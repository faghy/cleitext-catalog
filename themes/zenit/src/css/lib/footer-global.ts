/**
 * Helpers shared by the footer rows and by the global and content parts:
 * static CSS trimming, footer grid columns, what the page's content type
 * is, boxed content and sidebar styles, RTL alignment flips.
 */
import { is404, isSearch, isSingular, meta, pageLayout, type Ctx } from '../../core/context.js';
import {
  cssValue,
  fontCssValue,
  foregroundColor,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveFont,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, blank, empty, intval, isNumeric, isset, rec, str } from '../../core/php.js';
import { marginPaddingCss, visibilityCss } from '../base.js';

/** Static CSS minified as the reference minifies it (comments, newlines, tabs, double spaces, `, `). */
export function trimCss(css: string): string {
  if (empty(css)) return css;
  let out = css.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//g, '');
  for (const s of ['\r\n', '\r', '\n', '\t', '  ', '    ', '    ']) out = out.split(s).join('');
  return out.split(', ').join(',');
}

/** Column templates of the footer and related posts grids, by layout name. */
export const GRID_SIZE: Record<string, string> = {
  '6-equal': 'repeat( 6, 1fr )',
  '5-equal': 'repeat( 5, 1fr )',
  '4-equal': 'repeat( 4, 1fr )',
  '4-lheavy': '2fr 1fr 1fr 1fr',
  '4-rheavy': '1fr 1fr 1fr 2fr',
  '3-equal': 'repeat( 3, 1fr )',
  '3-lheavy': '2fr 1fr 1fr',
  '3-rheavy': '1fr 1fr 2fr',
  '3-cheavy': '1fr 2fr 1fr',
  '3-cwide': '1fr 3fr 1fr',
  '3-firstrow': '1fr 1fr',
  '3-lastrow': '1fr 1fr',
  '2-equal': 'repeat( 2, 1fr )',
  '2-lheavy': '2fr 1fr',
  '2-rheavy': '1fr 2fr',
  '2-full': '2fr',
  full: '1fr',
};

/** Whether a footer row has an element in one of its first five columns. */
export function footerRowHasItems(o: Options, row: string): boolean {
  const zones = rec(rec(o.get('footer-desktop-items'))[row]);
  for (let i = 1; i <= 5; i++) {
    const list = zones[`${row}_${i}`];
    if (Array.isArray(list) && list.length > 0) return true;
    if (list && typeof list === 'object' && !Array.isArray(list) && Object.keys(list).length > 0)
      return true;
  }
  return false;
}

/** The content type of the page's current entry (empty on a 404). */
export function entryType(c: Ctx): string {
  return c.view === '404' ? '' : c.postType;
}

/** The sidebar layout; a 404 page never has a sidebar. */
export function sidebarLayout(o: Options, c: Ctx): string {
  return is404(c) ? 'no-sidebar' : pageLayout(o, c);
}

/** Left and right swapped on right-to-left sites. */
export function flipRtl(c: Ctx, alignment: unknown): unknown {
  if (!c.rtl) return alignment;
  if (alignment === 'left') return 'right';
  if (alignment === 'right') return 'left';
  return alignment;
}

/** Shared rules of `content-style` and `sidebar-style`: global, per type, the page's own, search. */
function boxedStyle(o: Options, c: Ctx, kind: 'content' | 'sidebar', searchKey: string): boolean {
  const blogType = isSingular(c) ? 'single' : 'archive';
  const global = o.get(`site-${kind}-style`);
  const own = meta(o, c, `site-${kind}-style`, '', true);
  const style = o.get(`${blogType}-${entryType(c)}-${kind}-style`, '');
  let boxed = global === 'boxed';
  if (!empty(style) && style !== 'default') boxed = style === 'boxed';
  if (blogType === 'single' && !empty(own) && own !== 'default') boxed = own === 'boxed';
  if (searchKey && isSearch(c)) {
    const s = o.get(searchKey, '');
    if (!empty(s) && s !== 'default') boxed = s === 'boxed';
  }
  return boxed;
}

/** Whether the content area is boxed on this page. */
export function isContentBoxed(o: Options, c: Ctx): boolean {
  return boxedStyle(o, c, 'content', 'zn-search-content-style');
}

/** Whether the sidebar is boxed on this page. */
export function isSidebarBoxed(o: Options, c: Ctx): boolean {
  return boxedStyle(o, c, 'sidebar', 'zn-search-sidebar-style');
}

/** The container layout once the boxed content and sidebar styles are applied. */
export function boxedLayout(
  o: Options,
  c: Ctx,
  layout: string,
  boxed: boolean,
  sidebarBoxed: boolean,
): string {
  if (layout !== 'plain-container') return layout;
  if (sidebarLayout(o, c) === 'no-sidebar') return boxed ? 'boxed-container' : layout;
  if (boxed) return sidebarBoxed ? 'boxed-container' : 'content-boxed-container';
  return sidebarBoxed ? 'boxed-container' : layout;
}

/** The `aspect-ratio` of featured images: a preset, `width/height`, or none. */
export function aspectRatio(
  type: unknown,
  preset: unknown,
  width: unknown,
  height: unknown,
): unknown {
  if (type === 'predefined') return preset;
  if (type === 'custom') return `${Math.abs(intval(width))}/${Math.abs(intval(height))}`;
  return '';
}

/** `$value . 'px'` and the like: a value printed with a unit appended. */
export function withUnit(v: unknown, unit: string): string {
  return str(v) + unit;
}

/** What differs between the above, primary and below footer rows. */
export interface FooterRow {
  row: 'above' | 'primary' | 'below';
  /** Option prefix: `hba`, `hb`, `hbb`. */
  prefix: string;
  height: string;
  separator: string;
  separatorColor: string;
  /** Vertical padding of the row wrapper. */
  padding: string;
  /** Background of the whole footer, first in the tablet and mobile rules (primary row). */
  footerBg?: unknown;
}

/** The rules of a footer row: background, height, top border, columns, gaps, inline or stacked. */
export function footerRowCss(o: Options, r: FooterRow): string {
  const section = `section-${r.row}-footer-builder`;
  const wrap = `.site-${r.row}-footer-wrap`;
  const selector = `${wrap}[data-section="${section}"]`;
  const grid = `${selector} .zn-builder-grid-row`;
  const bg = o.get(`${r.prefix}-footer-bg-obj-responsive`);
  const height = o.get(r.height);
  const border = o.get(r.separator);
  const borderColor = o.get(r.separatorColor);
  const width = o.get(`${r.prefix}-footer-layout-width`);
  const contentWidth = o.get('site-content-width');
  const spacing = o.get(`${r.prefix}-inner-spacing`);
  const layout = o.get(`${r.prefix}-footer-layout`);
  const lay = (d: string) => (isset(layout, d) ? str(at(layout, d)) : 'full');
  const gap = (d: string) => (isset(spacing, d) ? at(spacing, d) : '');

  const desktop: Rules = {
    [wrap]: { 'padding-top': r.padding, 'padding-bottom': r.padding },
    [selector]: { ...(responsiveBackgroundObj(o, bg, 'desktop') ?? {}) },
    [grid]: { 'grid-column-gap': cssValue(gap('desktop'), 'px') },
    [`${grid}, ${selector} .site-footer-section`]: {
      'align-items': o.get(`${r.prefix}-footer-vertical-alignment`),
    },
    [`${selector}.zn-footer-row-inline .site-footer-section`]: {
      display: 'flex',
      'margin-bottom': '0',
    },
    [`.zn-builder-grid-row-${lay('desktop')} .zn-builder-grid-row`]: {
      'grid-template-columns': GRID_SIZE[lay('desktop')],
    },
  };
  const main = desktop[selector]!;
  main['min-height'] = cssValue(height, 'px');
  if (isset(border) && phpGte(border, 1)) {
    main['border-style'] = 'solid';
    main['border-width'] = '0px';
    main['border-top-width'] = cssValue(border, 'px');
    main['border-top-color'] = borderColor;
  }
  const rows = desktop[grid]!;
  if (width === 'content') {
    rows['max-width'] = cssValue(contentWidth, 'px');
    rows['min-height'] = cssValue(height, 'px');
    rows['margin-left'] = 'auto';
    rows['margin-right'] = 'auto';
  } else {
    rows['max-width'] = '100%';
    rows['padding-left'] = '35px';
    rows['padding-right'] = '35px';
  }
  const small = (d: 'tablet' | 'mobile'): Rules => ({
    ...(r.footerBg !== undefined
      ? { '.site-footer': responsiveBackgroundObj(o, r.footerBg, d) }
      : {}),
    [selector]: responsiveBackgroundObj(o, bg, d),
    [grid]: { 'grid-column-gap': cssValue(gap(d), 'px'), 'grid-row-gap': cssValue(gap(d), 'px') },
    [`${selector}.zn-footer-row-${d}-inline .site-footer-section`]: {
      display: 'flex',
      'margin-bottom': '0',
    },
    [`${selector}.zn-footer-row-${d}-stack .site-footer-section`]: {
      display: 'block',
      'margin-bottom': '10px',
    },
    [`.zn-builder-grid-row-container.zn-builder-grid-row-${d}-${lay(d)} .zn-builder-grid-row`]: {
      'grid-template-columns': GRID_SIZE[lay(d)],
    },
  });
  return (
    parseCss(desktop) +
    parseCss(small('tablet'), '', tablet()) +
    parseCss(small('mobile'), '', mobile()) +
    marginPaddingCss(o, section, selector) +
    visibilityCss(o, section, selector, 'grid')
  );
}

/** PHP's loose `$a >= $b` against a number. */
export function phpGte(a: unknown, b: number): boolean {
  if (typeof a === 'boolean') return a >= Boolean(b);
  if (isNumeric(a)) return Number(a) >= b;
  return str(a) >= str(b);
}

/** Whether related posts are shown: enabled, on a single post. */
export function relatedPostsShown(o: Options, c: Ctx): boolean {
  return !empty(o.get('enable-related-posts')) && isSingular(c) && c.postType === 'post';
}

/** Black or white text on a color, a palette variable (`var(--zn-global-color-N)`) read as its hex. */
export function textOn(o: Options, color: unknown): string {
  let c = color;
  if (typeof c === 'string' && c.startsWith('var(--')) {
    const palette = at(o.get('global-color-palette'), 'palette');
    const list = Array.isArray(palette)
      ? palette.map((v, i) => [String(i), v] as const)
      : Object.entries(rec(palette));
    for (const [i, v] of list) {
      if (`var(--zn-global-color-${i})` === c) {
        c = v;
        break;
      }
    }
  }
  return foregroundColor(c);
}

/**
 * A font size of one device. Unlike `responsiveFont` from core/css, the rem
 * value is always computed against the desktop body size, as the reference
 * does (it does not pass the device on).
 */
export function deviceFont(
  o: Options,
  font: unknown,
  device = 'desktop',
  def: unknown = '',
): string {
  if (isset(font, device)) {
    const f = { ...rec(font) };
    if (!isset(f, `${device}-unit`)) f[`${device}-unit`] = 'px';
    if (!blank(def)) return cssValue(f[device], str(f[`${device}-unit`]), def);
    return fontCssValue(o, f[device], str(f[`${device}-unit`]));
  }
  return responsiveFont(o, font, device, def);
}
