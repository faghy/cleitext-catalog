/**
 * Helpers of the main dynamic CSS: the sidebar the page really gets, the
 * transparent header, the dark palette, colors and fonts as the rules expect
 * them, selector filtering and the whitespace trimming of the printed CSS.
 */
import {
  contentLayout,
  isArchive,
  isPage,
  isSearch,
  isSingle,
  meta,
  pageLayout,
  type Ctx,
} from '../../core/context.js';
import type { Options } from '../../core/options.js';
import { cssValue, fontCssValue, foregroundColor } from '../../core/css.js';
import { at, blank, empty, isNumeric, isset, rec, str } from '../../core/php.js';

/** PHP truthiness of a value. */
export const truthy = (v: unknown): boolean => !empty(v);

/** `'1' == v` in PHP. */
export const isOne = (v: unknown): boolean => v === true || (isNumeric(v) && Number(v) === 1);

/** The sidebar layout of the page, with no sidebar on the 404 page. */
export function rawSidebarLayout(o: Options, c: Ctx): string {
  return c.view === '404' ? 'no-sidebar' : pageLayout(o, c);
}

/**
 * The sidebar layout once the main CSS has run: no sidebar on the 404 page
 * and with the narrow or full-width containers.
 */
export function sidebarLayout(o: Options, c: Ctx): string {
  const layout = contentLayout(o, c);
  if (layout === 'narrow-container' || layout === 'page-builder') return 'no-sidebar';
  return rawSidebarLayout(o, c);
}

/** The type of the current entry (none on the 404 page). */
export const entryType = (c: Ctx): string => (c.view === '404' ? '' : c.postType);

/** Comments, line breaks, tabs and double spaces removed; `, ` becomes `,`. */
export function trimCss(css: string): string {
  if (!css) return css;
  let out = css.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//g, '');
  for (const s of ['\r\n', '\r', '\n', '\t', '  ', '    ']) out = out.split(s).join('');
  return out.split(', ').join(',');
}

/** A selector list without the shop (`wc`) and page builder (`el`) selectors. */
export function parseSelector(selectors: string, keywords: string | string[] = ''): string {
  const keys = typeof keywords === 'string' ? [keywords] : keywords;
  const out: string[] = [];
  for (const raw of selectors.split(',')) {
    const s = raw.trim();
    let skip = false;
    for (const k of keys) {
      if ((k === 'wc' || k === 'woocommerce') && s.includes('woocommerce')) skip = true;
      if ((k === 'el' || k === 'elementor') && s.includes('elementor')) skip = true;
      if (skip) break;
    }
    if (!skip) out.push(s);
  }
  return out.join(', ');
}

/** Whether the page has the transparent header. */
export function isTransparentHeader(o: Options, c: Ctx): boolean {
  let on = truthy(o.get('transparent-header-enable'));
  const metaOption = meta(o, c, 'theme-transparent-header-meta', 'default');
  if (on) {
    const archiveOff = o.get('transparent-header-disable-archive');
    if (c.view === '404' && isOne(o.get('transparent-header-disable-404-page', archiveOff)))
      on = false;
    if (isSearch(c) && isOne(o.get('transparent-header-disable-search-page', archiveOff)))
      on = false;
    if (isArchive(c) && isOne(o.get('transparent-header-disable-archive-pages', archiveOff)))
      on = false;
    if (c.isHome && isOne(o.get('transparent-header-disable-index')) && !c.isFrontPage) on = false;
    if (c.isFrontPage && c.isHome && isOne(o.get('transparent-header-disable-latest-posts-index')))
      on = false;
    if (isPage(c) && isOne(o.get('transparent-header-disable-page'))) on = false;
    if (isSingle(c) && isOne(o.get('transparent-header-disable-posts'))) on = false;
  }
  if (metaOption === 'enabled') on = true;
  else if (metaOption === 'disabled') on = false;
  return on;
}

/** Whether the active color palette is the dark one (the fourth). */
export function isDarkPalette(o: Options): boolean {
  const palettes = o.get('zenit-color-palettes');
  return (
    (isset(palettes, 'currentPalette') ? at(palettes, 'currentPalette') : 'palette_1') ===
    'palette_4'
  );
}

/** A font extra (`line-height`, `letter-spacing`…) with its unit when it has a value. */
export function fontExtra(config: unknown, setting: string, unit: string | false = false): unknown {
  let css = at(config, setting) ?? '';
  if (unit && truthy(css)) css = str(css) + str(at(config, unit) ?? '');
  return css;
}

/** Black or white text on a color, palette variables resolved to their color first. */
export function fgColor(o: Options, color: unknown): string {
  let c = color;
  if (typeof c === 'string' && c.startsWith('var(--')) {
    const palette = at(o.get('global-color-palette'), 'palette');
    if (palette && typeof palette === 'object') {
      for (const [i, value] of Object.entries(palette)) {
        if (`var(--zn-global-color-${i})` === c) {
          c = value;
          break;
        }
      }
    }
  }
  return foregroundColor(c);
}

/**
 * A font size for one device; the rem equivalent of px sizes is always
 * computed against the desktop body size, as the reference does.
 */
export function respFont(o: Options, font: unknown, device = 'desktop', def: unknown = ''): string {
  if (isset(font, device)) {
    const f = { ...rec(font) };
    if (!isset(f, `${device}-unit`)) f[`${device}-unit`] = 'px';
    if (!blank(def)) return cssValue(f[device], str(f[`${device}-unit`]), def);
    return fontCssValue(o, f[device], str(f[`${device}-unit`]));
  }
  if (isNumeric(font)) return cssValue(font);
  return typeof font === 'object' && font !== null ? '' : str(font);
}
