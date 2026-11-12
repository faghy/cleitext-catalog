/**
 * The catalog's install check (tools/verify.mjs copies it into the Cleitext
 * checkout's apps/server/test and runs it there): the built paid plugins load
 * on a test Cleitext, with the free plugins they need, and every theme serves
 * its pages without a server error.
 *
 * VERIFY_THEMES: a folder of built themes; VERIFY_PLUGINS: a folder of built
 * paid plugins.
 */
import { mkdtemp, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPlugin, installPlugin } from '@cleitext/cli';
import { settings, withSiteContext, type DatabaseClient } from '@cleitext/db';
import { licenseStorageKey } from '@cleitext/shared';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { afterAll, beforeAll, describe, expect, inject, it } from 'vitest';
import { PluginHost } from '../src/plugins/plugin-host.service.js';
import { ownerDatabase, seedSite, seedUser, startTestApp, TestClient } from './helpers.js';

const PASSWORD = 'correct horse battery staple';
const THEMES = process.env.VERIFY_THEMES ?? '';
const PLUGINS = process.env.VERIFY_PLUGINS ?? '';
const freePlugins = fileURLToPath(new URL('../../../plugins', import.meta.url));

let app: NestFastifyApplication;
let owner: DatabaseClient;
let admin: TestClient;
let visitor: TestClient;
let themes: string[] = [];
let paid: string[] = [];
let siteId = '';

const list = async (dir: string) =>
  dir ? (await readdir(dir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name) : [];

beforeAll(async () => {
  owner = ownerDatabase();
  const pluginsPath = await mkdtemp(join(tmpdir(), 'catalog-plugins-'));
  const appRole = new URL(inject('appUrl')).username;
  themes = await list(THEMES);
  paid = await list(PLUGINS);
  // The free plugins the paid ones need (Fresco for Fresco Pro…), from this Cleitext.
  const needed = new Set<string>();
  for (const slug of paid) {
    const manifest = JSON.parse(await readFile(join(PLUGINS, slug, 'cleitext.plugin.json'), 'utf8'));
    for (const dep of Object.keys(manifest.requires?.plugins ?? {})) needed.add(dep);
  }
  // Built where they are: their imports resolve in the Cleitext workspace.
  for (const slug of needed) {
    const source = join(freePlugins, slug);
    await buildPlugin(source);
    await installPlugin(owner.db, { source, pluginsPath, appRole });
  }
  for (const slug of paid) {
    await installPlugin(owner.db, { source: join(PLUGINS, slug), pluginsPath, appRole });
  }
  app = await startTestApp({ pluginsPath, env: { THEMES_PATH: THEMES } });
  const site = await seedSite(owner, 'catalog-verify');
  siteId = site.id;
  await seedUser(owner, {
    email: 'admin@catalog-verify.test',
    password: PASSWORD,
    site,
    role: 'administrator',
    superAdmin: true,
  });
  admin = new TestClient(app, site.host, '10.77.0.1');
  visitor = new TestClient(app, site.host, '10.77.0.2');
  await admin.login('admin@catalog-verify.test', PASSWORD);
}, 300_000);

afterAll(async () => {
  await app?.close();
  await owner?.close();
});

/** A local license row (the shape the core keeps after an activation). */
async function license(type: 'theme' | 'plugin', slug: string) {
  await withSiteContext(owner.db, siteId, (tx) =>
    tx.insert(settings).values({
      siteId,
      namespace: 'licenses',
      key: licenseStorageKey(type, slug),
      value: {
        key: 'local',
        activation: 'local',
        server: 'https://cleitext.com/api/v1/ext/store/v1',
        keyHint: 'LOCAL',
        activatedAt: new Date().toISOString(),
        updatesUntil: null,
        seats: { used: 1, total: 1 },
        renewUrl: null,
      },
    }),
  );
}

describe('catalog', () => {
  it('loads every paid plugin', () => {
    const host = app.get(PluginHost);
    for (const slug of paid) {
      const plugin = host.get(slug);
      expect(plugin, `${slug} is not installed`).toBeDefined();
      expect(plugin!.status, `${slug}: ${plugin!.error ?? ''}`).toBe('loaded');
    }
  });

  it('renders every theme without a server error', async () => {
    // Some content for the templates: a page, a post with a category, a comment-free archive.
    const page = (await admin.post('/api/v1/entries', { type: 'page', title: 'About us' })).json();
    await admin.post(`/api/v1/entries/${page.id}/publish`, {});
    const post = (await admin.post('/api/v1/entries', { type: 'article', title: 'Hello world' })).json();
    const published = (await admin.post(`/api/v1/entries/${post.id}/publish`, {})).json();
    // Posts live at /{year}/{slug} by default.
    const postUrl = `/${new Date().getUTCFullYear()}/${published.slug}`;
    const pageUrl = `/${page.slug}`;
    const failures: string[] = [];
    for (const slug of themes) {
      // A paid theme gets a local license, as a licensed site has.
      const manifest = JSON.parse(await readFile(join(THEMES, slug, 'theme.json'), 'utf8'));
      if (manifest.paid) await license('theme', slug);
      const activated = await admin.post(`/api/v1/themes/${slug}/activate`, {});
      if (activated.statusCode !== 200) {
        failures.push(`${slug}: activation ${activated.statusCode} ${activated.body.slice(0, 200)}`);
        continue;
      }
      for (const [path, ok] of [
        ['/', [200]],
        [pageUrl, [200]],
        [postUrl, [200]],
        ['/category/uncategorized', [200, 404]],
        ['/?s=hello', [200]],
        ['/no-such-page-here', [404]],
      ] as const) {
        const res = await visitor.get(path);
        if (!(ok as readonly number[]).includes(res.statusCode)) {
          failures.push(`${slug} ${path}: ${res.statusCode} ${res.body.slice(0, 160)}`);
        }
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
});
