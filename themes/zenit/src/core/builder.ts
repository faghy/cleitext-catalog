/**
 * The header and footer layouts (options `header-desktop-items`,
 * `header-mobile-items`, `footer-desktop-items`): rows, zones and the
 * elements placed in them.
 */
import type { Options } from './options.js';
import { rec } from './php.js';

export const ROWS = ['below', 'above', 'primary', 'popup'] as const;

/** Every element placed in a layout option. */
function elementsOf(layout: unknown): string[] {
  const out: string[] = [];
  for (const [row, zones] of Object.entries(rec(layout))) {
    if (!(ROWS as readonly string[]).includes(row) || !zones || typeof zones !== 'object') continue;
    for (const list of Object.values(zones as Record<string, unknown>)) {
      if (Array.isArray(list)) out.push(...list.map(String));
    }
  }
  return out;
}

const cache = new WeakMap<Options, Record<string, string[]>>();

/** `Builder_Helper::is_component_loaded( $id, $type, $device )`. */
export function isLoaded(
  o: Options,
  id: string,
  type: 'header' | 'footer' | 'all' = 'header',
  device: 'both' | 'desktop' | 'mobile' = 'both',
): boolean {
  let grids = cache.get(o);
  if (!grids) {
    const desktop = elementsOf(o.get('header-desktop-items', {}));
    const mobile = elementsOf(o.get('header-mobile-items', {}));
    const footer = elementsOf(o.get('footer-desktop-items', {}));
    grids = {
      header_desktop: desktop,
      header_mobile: mobile,
      footer_both: footer,
      header_both: [...desktop, ...mobile],
      all: [...new Set([...desktop, ...mobile, ...footer])],
    };
    cache.set(o, grids);
  }
  if (type === 'all') return grids.all!.includes(id);
  return (grids[`${type}_${device}`] ?? []).includes(id);
}

/** The elements of a zone: `zone('header-desktop-items', 'primary', 'left')`. */
export function zone(o: Options, option: string, row: string, name: string): string[] {
  const list = rec(rec(o.get(option, {}))[row])[`${row}_${name}`];
  return Array.isArray(list) ? list.map(String) : [];
}
