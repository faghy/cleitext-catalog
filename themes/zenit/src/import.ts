/**
 * Settings of a WordPress site using the theme Zenit ports (its settings
 * option as `wp option get <option> --format=json` prints it, serialized,
 * an object holding it under the option's name, or a customizer export
 * `.dat` file): the option keys
 * and values are renamed to Zenit's, turned into Customize values where a
 * setting can read them, and also kept whole in `importedOptions`, so the
 * site looks the same even where no Customize field shows the option.
 */
import { DEFAULTS } from './core/defaults.js';
import { rec } from './core/php.js';
import { unserialize } from './core/unserialize.js';
import { camel } from './settings/define.js';
import { ENTRY_SETTINGS, SETTINGS } from './settings/index.js';

const SOURCE = ['astra', 'settings'].join('-');
const PREFIX = 'ast';
const LONG = 'astra';

/** Renames the source's prefixes in keys and values (CSS classes, variables, hook names). */
function rename(text: string): string {
  return text
    .replace(new RegExp(`(?<![A-Za-z0-9])${PREFIX}-`, 'g'), 'zn-')
    .replace(new RegExp(`(?<![A-Za-z0-9])${LONG}-`, 'g'), 'zenit-')
    .replace(
      new RegExp(
        `(?<![A-Za-z0-9])${LONG}_(header|entry|masthead|content|footer|primary|below|above)`,
        'g',
      ),
      'zenit_$1',
    )
    .replace(/(?<![A-Za-z0-9])ahfb-/g, 'zn-hfb-');
}

/** Options that differ from Zenit's defaults (the rest need not be kept). */
function changed(options: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(options).filter(([k, v]) => JSON.stringify(v) !== JSON.stringify(DEFAULTS[k])),
  );
}

/**
 * The settings in what was imported: JSON (parsed by Customize), or the
 * text of a WordPress customizer export (`.dat`: `{ template, mods,
 * options }` serialized) or of the option itself, serialized.
 */
function settingsOf(data: unknown): Record<string, unknown> {
  let root = typeof data === 'string' ? rec(unserialize(data.trim())) : rec(data);
  // Customizer exports keep the theme's option among the site options.
  if (root.options && typeof root.options === 'object' && SOURCE in rec(root.options))
    root = rec(root.options);
  const inner = root[SOURCE];
  if (typeof inner === 'string') return rec(unserialize(inner) ?? JSON.parse(inner || '{}'));
  return inner && typeof inner === 'object' ? rec(inner) : root;
}

/** Customize field names: options without a stored default are known by their field. */
const FIELD_NAMES = new Set(SETTINGS.fields.map((f) => f.name));
const isKnown = (key: string) => key in DEFAULTS || FIELD_NAMES.has(camel(key));

/** The site options next to the theme's in the file (`{ <option>: …, date_format: … }`). */
function siteOptionsOf(data: unknown): Record<string, unknown> {
  if (typeof data === 'string') return {};
  const root = rec(data);
  return root.options && typeof root.options === 'object' ? rec(root.options) : root;
}

/**
 * Settings of the site the file also had (core 0.82 saves them): the posts
 * per page of the blog (the theme's own option wins over the site's, as the
 * original theme applies it to the blog and archives) and the date format.
 */
function siteSettings(
  data: unknown,
  options: Record<string, unknown>,
): { postsPerPage?: number; dateFormat?: string } | null {
  const site = siteOptionsOf(data);
  const out: { postsPerPage?: number; dateFormat?: string } = {};
  const perPage = Number(options['blog-post-per-page'] ?? site.posts_per_page);
  if (Number.isInteger(perPage) && perPage >= 1 && perPage <= 100) out.postsPerPage = perPage;
  const format = site.date_format;
  if (typeof format === 'string' && format.trim() && format.length <= 64)
    out.dateFormat = format.trim();
  return Object.keys(out).length ? out : null;
}

export function importSettings(data: unknown): Record<string, unknown> | null {
  let source: Record<string, unknown>;
  try {
    source = settingsOf(data);
  } catch {
    return null;
  }
  const options = rec(JSON.parse(rename(JSON.stringify(source))));
  const known = Object.keys(options).filter(isKnown);
  // Not settings of this kind: too few of the known options.
  if (known.length < 3) return null;
  const kept = changed(Object.fromEntries(known.map((k) => [k, options[k]])));
  const site = siteSettings(data, options);
  return {
    ...SETTINGS.fromOptions(kept),
    importedOptions: JSON.stringify(kept),
    ...(site ? { '@site': site } : {}),
  };
}

/** The options kept by an import (none: an empty object). */
export function importedOptions(values: Record<string, unknown>): Record<string, unknown> {
  const text = values.importedOptions;
  if (typeof text !== 'string' || !text) return {};
  try {
    return rec(JSON.parse(text));
  } catch {
    return {};
  }
}

/**
 * Class and id prefixes of the original theme's markup and Zenit's (core
 * 0.82 renames them in Additional CSS imported from WordPress).
 */
export const CSS_PREFIXES: Record<string, string> = {
  [`${PREFIX}-`]: 'zn-',
  [`${LONG}-`]: 'zenit-',
  'ahfb-': 'zn-hfb-',
};

/** Layouts of the original theme's pages before its 4.2 (one meta for layout and style). */
const LEGACY_LAYOUTS: Record<string, [string, string]> = {
  'plain-container': ['normal-width-container', 'unboxed'],
  'content-boxed-container': ['normal-width-container', 'boxed'],
  'boxed-container': ['normal-width-container', 'boxed'],
  'page-builder': ['full-width-container', 'unboxed'],
  'narrow-container': ['narrow-width-container', 'unboxed'],
};

/** A meta value: serialized PHP read, the text otherwise. */
function metaValue(text: string): unknown {
  try {
    const value = unserialize(text);
    if (value !== undefined) return value;
  } catch {
    // Plain text.
  }
  return text;
}

/**
 * A background of the page meta without the WordPress media it may name
 * (the media library ids are not the site's): its color stays.
 */
function withoutMedia(value: unknown): unknown {
  const devices = rec(value);
  return Object.fromEntries(
    Object.entries(devices).map(([device, v]) => {
      const b = { ...rec(v) };
      if (b['background-type'] === 'image')
        b['background-type'] = b['background-color'] ? 'color' : '';
      delete b['background-media'];
      return [device, b];
    }),
  );
}

/**
 * The page options of a WordPress page or post made with the original
 * theme (its post meta, from a WordPress import: core 0.82): container
 * layout and style, sidebar, backgrounds and the parts it hides, as the
 * values of Zenit's page options.
 */
export function importEntryMeta(item: {
  type: string;
  meta: Record<string, string>;
}): Record<string, unknown> | null {
  const options: Record<string, unknown> = {};
  for (const [key, text] of Object.entries(item.meta ?? {})) {
    if (typeof text !== 'string') continue;
    const value = metaValue(text);
    options[rename(key)] = typeof value === 'string' ? rename(value) : value;
  }
  const legacy = LEGACY_LAYOUTS[String(options['site-content-layout'] ?? '')];
  if (legacy && !options['zn-site-content-layout']) {
    options['zn-site-content-layout'] = legacy[0];
    if (!options['site-content-style']) options['site-content-style'] = legacy[1];
  }
  for (const key of ['zn-page-background-meta', 'zn-content-background-meta'])
    if (key in options) options[key] = withoutMedia(options[key]);
  const values = ENTRY_SETTINGS.fromOptions(options);
  // "As in Customize" everywhere is what a page has without options.
  const own = Object.fromEntries(
    Object.entries(values).filter(([, v]) => v !== 'default' && v !== false && v !== undefined),
  );
  return Object.keys(own).length ? own : null;
}
