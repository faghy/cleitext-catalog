/**
 * The global color palette: one custom property per color on `:root`, and
 * the classes the block editor gives text and backgrounds in those colors.
 */
import { parseCss, type Rules } from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, empty, isset, rec } from '../../core/php.js';
import type { Part } from './index.js';

/** The added colors (palette entries from the tenth on): which are still in use. */
function customColors(o: Options): { retired: boolean }[] {
  const list = at(o.get('zenit-color-palettes'), 'customColors');
  const values = Array.isArray(list)
    ? list
    : list && typeof list === 'object'
      ? Object.values(list)
      : [];
  return values.slice(0, 9).map((c) => ({ retired: !empty(at(c, 'retired')) }));
}

export const part: Part = {
  name: 'generate_global_palette_style',
  run(o) {
    const palette = o.get('global-color-palette');
    const prefix = '--zn-global-color-';
    const custom = customColors(o);
    const style: Rules = {};
    const vars: Record<string, unknown> = {};
    if (isset(palette, 'palette')) {
      const colors = at(palette, 'palette');
      const list = Array.isArray(colors)
        ? colors.map((v, i) => [String(i), v] as const)
        : Object.entries(rec(colors));
      for (const [key, color] of list) {
        const n = Number(key);
        if (n >= 9 && (!custom[n - 9] || custom[n - 9]!.retired)) continue;
        const name = `-zn-global-color-${key}`;
        const v = `var(${prefix}${key})`;
        style[`:root .has${name}-color`] = { color: v };
        style[`:root .has${name}-background-color`] = { 'background-color': v };
        style[`:root .wp-block-button .has${name}-color`] = { color: v };
        style[`:root .wp-block-button .has${name}-background-color`] = { 'background-color': v };
        vars[`${prefix}${key}`] = color;
      }
    }
    style[':root'] = vars;
    return parseCss(style);
  },
};
