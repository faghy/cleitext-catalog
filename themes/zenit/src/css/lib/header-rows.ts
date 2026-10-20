/**
 * Helpers shared by the header rows, the off-canvas area and the menus:
 * whether a row holds elements, the minified form of a CSS chunk, and
 * small per-device lookups.
 */
import { cssValue, mobile, parseCss, responsiveBackgroundObj, tablet } from '../../core/css.js';
import type { Rules } from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, empty, esc, rec, str } from '../../core/php.js';
import { marginPaddingCss, visibilityCss } from '../base.js';

/** Whether a zone of the layout holds at least one element. */
function zoneFilled(row: Record<string, unknown>, key: string): boolean {
  const list = row[key];
  return Array.isArray(list) && list.length > 0;
}

/**
 * Whether a header row holds elements on a device (the reference names
 * this "is row empty" but answers true when the row is used).
 */
export function rowUsed(
  o: Options,
  row: string,
  device: 'desktop' | 'mobile',
  type = 'header',
): boolean {
  const layout = rec(o.get(`${type}-${device}-items`));
  if (!(row in layout)) return false;
  const r = rec(layout[row]);
  return ['center', 'left', 'left_center', 'right_center', 'right'].some((z) =>
    zoneFilled(r, `${row}_${z}`),
  );
}

/** Removes comments, line breaks, tabs, double spaces and the space after commas. */
export function trimCss(css: string): string {
  if (empty(css)) return css;
  let out = css.replace(/\/\*[^*]*\*+([^/][^*]*\*+)*\//g, '');
  for (const s of ['\r\n', '\r', '\n', '\t', '  ', '    ']) out = out.split(s).join('');
  return out.split(', ').join(',');
}

/** `$a[$device]` when set and not empty, else ''. */
export function nonEmptyAt(value: unknown, key: string): unknown {
  const v = rec(value)[key];
  return v !== undefined && v !== null && !empty(v) ? v : '';
}

/**
 * The rules of the row above or below the main one: height per device,
 * submenu toggles of inline mobile menus, bottom border, background per
 * device, spacing and visibility. Printed only when the row holds elements.
 */
export function sideRowCss(o: Options, row: 'above' | 'below'): string {
  if (!rowUsed(o, row, 'desktop') && !rowUsed(o, row, 'mobile')) return '';
  const p = row === 'above' ? 'hba' : 'hbb';
  const height = o.get(`${p}-header-height`);
  const divider = o.get(`${p}-header-separator`);
  const borderColor = o.get(`${p}-header-bottom-border-color`);
  const bg = o.get(`${p}-header-bg-obj-responsive`);
  const bgColor = (d: string) => at(bg, d, 'background-color') ?? '';
  const hDesktop = nonEmptyAt(height, 'desktop');
  const bar = `.zn-${row}-header-bar`;
  const wrap = `.zn-mobile-header-wrap ${bar} , ${bar} .site-${row}-header-wrap`;
  const inline = `.zn-header-break-point .zn-mobile-header-wrap .zn-${row}-header-wrap .main-header-bar-navigation`;
  const sidePadding = { 'padding-left': '20px', 'padding-right': '20px' };

  const common: Rules = {
    [`.zn-${row}-header .main-header-bar-navigation`]: { height: '100%' },
    [`${inline} .inline-on-mobile .menu-item .menu-link`]: { border: 'none' },
    [`${inline} .inline-on-mobile .menu-item-has-children > .zn-menu-toggle::before`]: {
      'font-size': '.6rem',
    },
    [`${inline} .zn-submenu-expanded > .zn-menu-toggle::before`]: { transform: 'rotateX(180deg)' },
  };
  if (row === 'below') common[`#masthead .zn-mobile-header-wrap ${bar}`] = sidePadding;
  common[wrap] = { 'min-height': cssValue(hDesktop, 'px') };
  common[`.zn-desktop ${bar} .main-header-menu > .menu-item`] = {
    'line-height': cssValue(hDesktop, 'px'),
  };
  common[`.zn-desktop ${bar} .zn-header-woo-cart, .zn-desktop ${bar} .zn-header-edd-cart`] = {
    'line-height': cssValue(hDesktop, 'px'),
  };
  common[bar] =
    divider !== '' && divider !== 'inherit'
      ? {
          'border-bottom-width': cssValue(divider, 'px'),
          'border-bottom-color': esc(borderColor),
          'border-bottom-style': 'solid',
        }
      : { 'border-bottom-style': 'none' };

  const bgSelector = row === 'above' ? '.zn-above-header.zn-above-header-bar' : bar;
  const device = (d: string): Rules => ({
    [bgSelector]: responsiveBackgroundObj(o, bg, d),
    [`.zn-header-break-point ${bar}`]: { 'background-color': esc(bgColor(d)) },
  });
  const tabletRules: Rules = {
    ...device('tablet'),
    [wrap]: { 'min-height': cssValue(nonEmptyAt(height, 'tablet'), 'px') },
  };
  if (row === 'above') tabletRules[`#masthead .zn-mobile-header-wrap ${bar}`] = sidePadding;

  const css =
    parseCss(common) +
    parseCss(device('desktop')) +
    parseCss(tabletRules, '', tablet()) +
    parseCss(
      {
        ...device('mobile'),
        [wrap]: { 'min-height': cssValue(nonEmptyAt(height, 'mobile'), 'px') },
      },
      '',
      mobile(),
    );

  const section = `section-${row}-header-builder`;
  const parent =
    row === 'above'
      ? '.zn-above-header.zn-above-header-bar, .zn-header-break-point #masthead.site-header .zn-above-header-bar'
      : '.zn-below-header-bar.zn-below-header, .zn-header-break-point .zn-below-header-bar.zn-below-header';
  return (
    trimCss(css) +
    marginPaddingCss(o, section, parent) +
    visibilityCss(o, section, bar, 'block', 'grid')
  );
}

/** A spacing value shifted by an amount: `calc( 10px - 0.907em )` (nothing when empty). */
export function calcSpacing(value: unknown, operation = '', from = '', fromUnit = ''): unknown {
  if (empty(value)) return '';
  let css: unknown = value;
  if (!empty(operation) && !empty(from)) {
    if (!empty(fromUnit)) css = `calc( ${str(value)} ${operation} ${from}${fromUnit} )`;
    if (operation === '*' || operation === '/') css = `calc( ${str(value)} ${operation} ${from} )`;
  }
  return css;
}
