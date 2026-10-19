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
 *
 * Paid themes and plugins (items with `paid`, docs/paid-themes.md): their
 * source is the checkout of the private repository in $CATALOG_PRIVATE_DIR
 * (`private/`, folders themes/<slug> and plugins/<slug>) when the item says
 * `"source": "private"`, and their zips go to the releases of
 * $CATALOG_PRIVATE_REPO with the token $CATALOG_PRIVATE_TOKEN. The index lists
 * them with their SHA-256 like the others; the download address is the
 * license server's, which hands out short-lived addresses to licensed sites.
 * Free plugins come from the latest Cleitext release.
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
const PRIVATE_REPO = process.env.CATALOG_PRIVATE_REPO ?? 'faghy/cleitext-catalog-private';
const PRIVATE_TOKEN = process.env.CATALOG_PRIVATE_TOKEN ?? process.env.GH_TOKEN;
const PRIVATE_DIR = process.env.CATALOG_PRIVATE_DIR ?? join(root, 'private');
const dryRun = process.argv.includes('--dry-run') || !process.env.CATALOG_SIGNING_KEY;
const out = join(root, 'out');

const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'], ...options });
const gh = (...args) => run('gh', args);
/** gh on the private repository, with its own token. */
const ghPrivate = (...args) =>
  run('gh', args, { env: { ...process.env, ...(PRIVATE_TOKEN ? { GH_TOKEN: PRIVATE_TOKEN } : {}) } });
const sha256 = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const config = JSON.parse(
  readFileSync(process.env.CATALOG_CONFIG ?? join(root, 'catalog.config.json'), 'utf8'),
);
const core = JSON.parse(gh('api', `repos/${CORE}/releases/latest`));
console.log(`Cleitext ${core.tag_name}`);

function releaseAssets(tag, repo = REPO) {
  try {
    const call = repo === REPO ? gh : ghPrivate;
    return JSON.parse(call('api', `repos/${repo}/releases/tags/${tag}`)).assets ?? [];
  } catch {
    return null;
  }
}

async function download(url, file) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
}

/**
 * A theme, or a plugin of the private repository, built here: one release per
 * version (never replaced), in this repository or, when paid, the private one.
 */
async function buildPackage(item) {
  const kind = item.type;
  const paid = item.paid ?? null;
  const folder = kind === 'theme' ? 'themes' : 'plugins';
  const manifestName = kind === 'theme' ? 'theme.json' : 'cleitext.plugin.json';
  const dir = join(item.source === 'private' ? PRIVATE_DIR : root, folder, item.slug);
  const manifest = JSON.parse(readFileSync(join(dir, manifestName), 'utf8'));
  if (paid && manifest.paid?.licenseServer !== paid.licenseServer) {
    throw new Error(`${item.slug}: ${manifestName} paid.licenseServer must be ${paid.licenseServer}`);
  }
  const repo = paid ? PRIVATE_REPO : REPO;
  const call = paid ? ghPrivate : gh;
  const tag = `${kind}-${item.slug}-${manifest.version}`;
  const name = `cleitext-${kind}-${item.slug}-${manifest.version}.zip`;
  const file = join(out, name);
  let assets = releaseAssets(tag, repo);
  if (assets?.some((a) => a.name === name)) {
    // Published versions never change: same file, same checksum.
    if (paid) call('release', 'download', tag, '-R', repo, '-p', name, '-D', out, '--clobber');
    else await download(assets.find((a) => a.name === name).browser_download_url, file);
  } else {
    if (!process.env.CLEITEXT_CLI) throw new Error(`CLEITEXT_CLI is needed to build ${folder}`);
    if (kind === 'plugin' && existsSync(join(dir, 'package-lock.json'))) {
      run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], { cwd: dir, stdio: 'inherit' });
    }
    run('node', [process.env.CLEITEXT_CLI, `${kind}:build`, dir], { stdio: 'inherit' });
    const stage = join(out, 'stage', item.slug);
    mkdirSync(stage, { recursive: true });
    const parts =
      kind === 'theme'
        ? ['theme.json', 'dist', 'README.md']
        : ['cleitext.plugin.json', 'dist', 'migrations', 'README.md', 'LICENSE'];
    for (const part of parts) {
      if (existsSync(join(dir, part))) run('cp', ['-r', join(dir, part), stage]);
    }
    // Plugins that come with a theme (theme.json `plugins`): built from plugins/<slug>, packed in;
    // an official plugin the theme needs (Fresco) comes from the latest Cleitext release.
    for (const plugin of kind === 'theme' ? (manifest.plugins ?? []) : []) {
      const source = join(dir, 'plugins', plugin);
      if (!existsSync(join(source, 'cleitext.plugin.json'))) {
        const asset = core.assets.find(
          (a) => a.name.startsWith(`cleitext-plugin-${plugin}-`) && a.name.endsWith('.zip'),
        );
        if (!asset) throw new Error(`${item.slug}: plugins/${plugin} is missing, and ${core.tag_name} has no such plugin`);
        const zip = join(out, asset.name);
        await download(asset.browser_download_url, zip);
        mkdirSync(join(stage, 'plugins'), { recursive: true });
        run('unzip', ['-q', '-o', zip, '-d', join(stage, 'plugins')]);
        continue;
      }
      run('node', [process.env.CLEITEXT_CLI, 'plugin:build', source], { stdio: 'inherit' });
      const target = join(stage, 'plugins', plugin);
      mkdirSync(target, { recursive: true });
      for (const part of ['cleitext.plugin.json', 'dist', 'migrations', 'README.md', 'LICENSE']) {
        if (existsSync(join(source, part))) run('cp', ['-r', join(source, part), target]);
      }
      run('find', [join(target, 'dist'), '-name', '*.map', '-delete']);
    }
    // Source maps stay out of the packages.
    run('find', [join(stage, 'dist'), '-name', '*.map', '-delete']);
    run('python3', ['-m', 'zipfile', '-c', file, item.slug], { cwd: join(out, 'stage') });
    if (!dryRun) {
      if (assets === null) {
        call('release', 'create', tag, file, '-R', repo, '--title', `${manifest.name} ${manifest.version}`,
          '--notes', `${manifest.name} ${manifest.version}, ${kind} for Cleitext.`);
      } else {
        call('release', 'upload', tag, file, '-R', repo, '--clobber');
      }
      assets = releaseAssets(tag, repo);
    }
  }
  return {
    version: manifest.version,
    ...(kind === 'theme' ? { requires: item.requires } : { apiVersion: manifest.apiVersion }),
    license: manifest.license,
    author: manifest.author ?? 'Cleitext',
    download: paid
      ? `${paid.licenseServer.replace(/\/+$/, '')}/download/${item.slug}/${manifest.version}`
      : `https://github.com/${REPO}/releases/download/${tag}/${name}`,
    sha256: sha256(file),
    size: statSync(file).size,
    homepage: paid ? paid.purchaseUrl : `https://github.com/${REPO}/tree/main/${folder}/${item.slug}`,
    updatedAt: assets?.find((a) => a.name === name)?.updated_at ?? new Date().toISOString(),
    ...(paid ? { paid } : {}),
  };
}

const items = [];
for (const item of config.items) {
  let entry;
  if (item.type === 'plugin' && item.source !== 'private') {
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
      homepage: item.paid?.purchaseUrl ?? `https://github.com/${CORE}/tree/main/plugins/${item.slug}`,
      updatedAt: asset.updated_at,
      ...(item.paid ? { paid: item.paid } : {}),
    };
  } else {
    entry = await buildPackage(item);
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
