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
import { SETTINGS } from './settings/index.js';

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

export function importSettings(data: unknown): Record<string, unknown> | null {
  let source: Record<string, unknown>;
  try {
    source = settingsOf(data);
  } catch {
    return null;
  }
  const options = rec(JSON.parse(rename(JSON.stringify(source))));
  const known = Object.keys(options).filter((k) => k in DEFAULTS);
  // Not settings of this kind: too few of the known options.
  if (known.length < 3) return null;
  const kept = changed(Object.fromEntries(known.map((k) => [k, options[k]])));
  return {
    ...SETTINGS.fromOptions(kept),
    importedOptions: JSON.stringify(kept),
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
