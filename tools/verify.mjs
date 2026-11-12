#!/usr/bin/env node
/**
 * Checks every theme and paid plugin before the catalog is published: the
 * catalog's CI. Run from the folder that holds `cleitext/` (the latest
 * release, `pnpm install` done and the CLI built) and this repository, with
 * the private repository in $CATALOG_PRIVATE_DIR when there is one.
 *
 * 1. Each paid plugin: type check and its own tests (`npm run typecheck`,
 *    `npm test`), with the SDK packages linked from the Cleitext checkout.
 * 2. Themes with tests (Zenit): their tests, run with Cleitext's Vitest.
 * 3. Every theme and paid plugin built with the CLI, then installed on a
 *    test Cleitext (embedded PostgreSQL, the release's own test helpers):
 *    plugins must load, and each theme must serve its home page, a page, a
 *    post, an archive, a search and a page not found without a server error.
 *
 * Any failure stops it with exit code 1: the publish workflow then publishes
 * nothing. `--skip-install` leaves out step 3 (faster, for a quick check).
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(join(dirname(fileURLToPath(import.meta.url)), '..'));
const workspace = resolve(process.env.CATALOG_WORKSPACE ?? join(root, '..'));
const cleitext = join(workspace, 'cleitext');
const privateDir = process.env.CATALOG_PRIVATE_DIR
  ? resolve(process.env.CATALOG_PRIVATE_DIR)
  : existsSync(join(root, 'private'))
    ? join(root, 'private')
    : join(workspace, 'cleitext-catalog-private');
const cli = process.env.CLEITEXT_CLI ?? join(cleitext, 'packages/cli/dist/bin.js');
const out = join(root, 'out', 'verify');
const skipInstall = process.argv.includes('--skip-install');

const failures = [];
const step = (name, fn) => {
  process.stdout.write(`\n== ${name}\n`);
  try {
    fn();
  } catch (error) {
    failures.push(name);
    console.error(`!! ${name} failed: ${error instanceof Error ? error.message.split('\n')[0] : error}`);
  }
};
const run = (cmd, args, options = {}) =>
  execFileSync(cmd, args, { stdio: 'inherit', ...options });
const folders = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
        .map((d) => join(dir, d.name))
    : [];

if (!existsSync(cli)) {
  console.error(`The Cleitext CLI is missing (${cli}): build it first.`);
  process.exit(1);
}

// The private repository must sit where the plugins' scripts expect it: next to
// cleitext/ (their typecheck runs ../../../cleitext/…).
const privatePlugins = folders(join(privateDir, 'plugins'));
const privateThemes = folders(join(privateDir, 'themes'));
const publicThemes = folders(join(root, 'themes'));

// ---- 1. Paid plugins: type check and tests ----------------------------------------------
for (const dir of privatePlugins) {
  const slug = dir.split('/').pop();
  const pkg = existsSync(join(dir, 'package.json'))
    ? JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
    : { scripts: {} };
  if (existsSync(join(dir, 'link-types.sh'))) {
    step(`${slug}: links`, () => run('sh', [join(dir, 'link-types.sh')], { cwd: dir }));
  }
  if (pkg.scripts?.typecheck) step(`${slug}: type check`, () => run('npm', ['run', '-s', 'typecheck'], { cwd: dir }));
  if (pkg.scripts?.test && existsSync(join(dir, 'test'))) {
    step(`${slug}: tests`, () => run('npm', ['run', '-s', 'test'], { cwd: dir }));
  }
}

// ---- 2. Themes with their own tests ----------------------------------------------------
for (const dir of [...publicThemes, ...privateThemes]) {
  if (!existsSync(join(dir, 'test'))) continue;
  const slug = dir.split('/').pop();
  // Their imports (React, the theme SDK) resolve from the Cleitext checkout's packages.
  const modules = join(dir, 'node_modules');
  const linked = !existsSync(modules);
  if (linked) symlinkSync(join(cleitext, 'node_modules/.pnpm/node_modules'), modules);
  step(`${slug}: tests`, () =>
    run(join(cleitext, 'node_modules/.bin/vitest'), ['run', '--root', dir], { cwd: cleitext }),
  );
  if (linked) rmSync(modules, { force: true });
}

// ---- 3. Built, installed and tried on a test Cleitext ---------------------------------
if (!skipInstall) {
  rmSync(out, { recursive: true, force: true });
  const themesOut = join(out, 'themes');
  const pluginsOut = join(out, 'plugins');
  mkdirSync(themesOut, { recursive: true });
  mkdirSync(pluginsOut, { recursive: true });
  for (const dir of [...publicThemes, ...privateThemes]) {
    const slug = dir.split('/').pop();
    step(`${slug}: build`, () => {
      run('node', [cli, 'theme:build', dir]);
      cpSync(dir, join(themesOut, slug), {
        recursive: true,
        filter: (file) => !file.includes('node_modules') && !file.includes('/test/'),
      });
    });
  }
  for (const dir of privatePlugins) {
    const slug = dir.split('/').pop();
    step(`${slug}: build`, () => {
      run('node', [cli, 'plugin:build', dir]);
      mkdirSync(join(pluginsOut, slug), { recursive: true });
      for (const part of ['cleitext.plugin.json', 'dist', 'migrations']) {
        if (existsSync(join(dir, part))) cpSync(join(dir, part), join(pluginsOut, slug, part), { recursive: true });
      }
    });
  }
  const test = join(cleitext, 'apps/server/test/zz-catalog-verify.test.ts');
  step('install and render on a test Cleitext', () => {
    cpSync(join(root, 'tools/verify.test.ts'), test);
    try {
      run(join(cleitext, 'node_modules/.bin/vitest'), ['run', 'test/zz-catalog-verify.test.ts'], {
        cwd: join(cleitext, 'apps/server'),
        env: { ...process.env, VERIFY_THEMES: themesOut, VERIFY_PLUGINS: pluginsOut },
      });
    } finally {
      rmSync(test, { force: true });
    }
  });
}

if (failures.length) {
  console.error(`\nThe catalog is NOT verified (${failures.length}): ${failures.join(', ')}`);
  process.exit(1);
}
console.log('\nCatalog verified: every theme and paid plugin passed.');
