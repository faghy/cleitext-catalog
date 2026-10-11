#!/usr/bin/env node
/**
 * Builds the Cleitext catalog: the zips of the themes in themes/ (one GitHub
 * release per version, never replaced), the list of the official plugins of
 * the latest Cleitext release, then catalog.json signed with Ed25519, published
 * in the rolling release "catalog".
 *
 * Needs: gh (authenticated), python3, unzip, and the Cleitext CLI built at
 * $CLEITEXT_CLI (to build the themes). The signing key (PKCS#8 PEM, base64)
 * comes from $CATALOG_SIGNING_KEY; without it, nothing is published (--dry-run).
 */
import { createHash, createPrivateKey, sign } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = process.env.CATALOG_REPO ?? 'faghy/cleitext-catalog';
const CORE = process.env.CLEITEXT_REPO ?? 'faghy/cleitext';
const RAW = `https://raw.githubusercontent.com/${REPO}/main`;
const dryRun = process.argv.includes('--dry-run') || !process.env.CATALOG_SIGNING_KEY;
const out = join(root, 'out');

const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...options });
const gh = (...args) => run('gh', args);
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const config = JSON.parse(readFileSync(join(root, 'catalog.config.json'), 'utf8'));
const core = JSON.parse(gh('api', `repos/${CORE}/releases/latest`));
console.log(`Cleitext ${core.tag_name}`);

function releaseAssets(tag) {
  try {
    return JSON.parse(gh('api', `repos/${REPO}/releases/tags/${tag}`)).assets ?? [];
  } catch {
    return null;
  }
}

async function download(url, file) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

const items = [];
for (const item of config.items) {
  let entry;
  if (item.type === 'plugin') {
    const asset = core.assets.find(
      (a) => a.name.startsWith(`cleitext-plugin-${item.slug}-`) && a.name.endsWith('.zip'),
    );
    if (!asset) {
      console.warn(`! ${item.slug}: not in ${core.tag_name}, skipped`);
      continue;
    }
    const file = join(out, asset.name);
    await download(asset.browser_download_url, file);
    const manifest = JSON.parse(run('unzip', ['-p', file, `${item.slug}/cleitext.plugin.json`]));
    entry = {
      version: manifest.version,
      apiVersion: manifest.apiVersion,
      license: manifest.license,
      author: manifest.author ?? 'Cleitext',
      download: asset.browser_download_url,
      sha256: sha256(file),
      size: statSync(file).size,
      homepage: `https://github.com/${CORE}/tree/main/plugins/${item.slug}`,
      updatedAt: asset.updated_at,
    };
  } else {
    const dir = join(root, 'themes', item.slug);
    const manifest = JSON.parse(readFileSync(join(dir, 'theme.json'), 'utf8'));
    const tag = `theme-${item.slug}-${manifest.version}`;
    const name = `cleitext-theme-${item.slug}-${manifest.version}.zip`;
    const file = join(out, name);
    let assets = releaseAssets(tag);
    if (assets?.some((a) => a.name === name)) {
      // Published versions never change: same file, same checksum.
      await download(assets.find((a) => a.name === name).browser_download_url, file);
    } else {
      if (!process.env.CLEITEXT_CLI) throw new Error('CLEITEXT_CLI is needed to build themes');
      run('node', [process.env.CLEITEXT_CLI, 'theme:build', dir], { stdio: 'inherit' });
      const stage = join(out, 'stage', item.slug);
      mkdirSync(stage, { recursive: true });
      for (const part of ['theme.json', 'dist', 'README.md']) {
        if (existsSync(join(dir, part))) run('cp', ['-r', join(dir, part), stage]);
      }
      rmSync(join(stage, 'dist', 'index.js.map'), { force: true });
      run('python3', ['-m', 'zipfile', '-c', file, item.slug], { cwd: join(out, 'stage') });
      if (!dryRun) {
        if (assets === null) {
          gh('release', 'create', tag, file, '-R', REPO, '--title', `${manifest.name} ${manifest.version}`,
            '--notes', `${manifest.name} ${manifest.version}, theme for Cleitext.`);
        } else {
          gh('release', 'upload', tag, file, '-R', REPO, '--clobber');
        }
        assets = releaseAssets(tag);
      }
    }
    entry = {
      version: manifest.version,
      requires: item.requires,
      license: manifest.license,
      author: manifest.author ?? 'Cleitext',
      download: `https://github.com/${REPO}/releases/download/${tag}/${name}`,
      sha256: sha256(file),
      size: statSync(file).size,
      homepage: `https://github.com/${REPO}/tree/main/themes/${item.slug}`,
      updatedAt: assets?.find((a) => a.name === name)?.updated_at ?? new Date().toISOString(),
    };
  }
  items.push({
    type: item.type,
    slug: item.slug,
    name: item.name,
    summary: item.summary,
    tags: item.tags ?? [],
    icon: item.icon ? `${RAW}/${item.icon}` : null,
    screenshots: (item.screenshots ?? []).map((s) => `${RAW}/${s}`),
    ...entry,
  });
  console.log(`  ${item.type} ${item.slug} ${entry.version}`);
}

const catalog = `${JSON.stringify(
  { schema: 1, generatedAt: new Date().toISOString(), cleitext: core.tag_name.replace(/^v/, ''), items },
  null,
  2,
)}\n`;
writeFileSync(join(out, 'catalog.json'), catalog);

if (dryRun) {
  console.log(`Dry run: ${items.length} items in out/catalog.json, nothing published.`);
} else {
  const key = createPrivateKey(Buffer.from(process.env.CATALOG_SIGNING_KEY, 'base64').toString('utf8'));
  writeFileSync(join(out, 'catalog.json.sig'), `${sign(null, Buffer.from(catalog), key).toString('base64')}\n`);
  if (releaseAssets('catalog') === null) {
    gh('release', 'create', 'catalog', '-R', REPO, '--title', 'Catalog', '--latest=false',
      '--notes', 'The signed index of the Cleitext catalog (catalog.json and catalog.json.sig), rebuilt automatically.');
  }
  gh('release', 'upload', 'catalog', join(out, 'catalog.json'), join(out, 'catalog.json.sig'), '-R', REPO, '--clobber');
  console.log(`Published ${items.length} items.`);
}
