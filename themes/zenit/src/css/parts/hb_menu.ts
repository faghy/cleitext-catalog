/**
 * The header menus (menu-1 and menu-2): font, colors per device (normal,
 * hover, active), backgrounds, item spacing, submenu border, radius, width
 * and offset, dividers between submenu items, margin, visibility, and the
 * hover animations (underline, overline, zoom) when one is chosen.
 */
import { isLoaded } from '../../core/builder.js';
import {
  cssValue,
  fontCssValue,
  fontExtras,
  fontFamily,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
} from '../../core/css.js';
import type { Rules } from '../../core/css.js';
import type { Options } from '../../core/options.js';
import type { Ctx } from '../../core/context.js';
import { at, empty, esc, intval, isset, str } from '../../core/php.js';
import { visibilityCss } from '../base.js';
import { calcSpacing } from '../lib/header-rows.js';
import type { Part } from './index.js';

/** Menus of the header builder. */
const MENUS = 2;

const HOVER_STYLES = [
  '.zn-desktop .zn-menu-hover-style-underline > .menu-item > .menu-link:before,.zn-desktop .zn-menu-hover-style-overline > .menu-item > .menu-link:before {content: "";position: absolute;width: 100%;right: 50%;height: 1px;background-color: transparent;transform: scale(0,0) translate(-50%,0);transition: transform .3s ease-in-out,color .0s ease-in-out;}',
  '.zn-desktop .zn-menu-hover-style-underline > .menu-item:hover > .menu-link:before,.zn-desktop .zn-menu-hover-style-overline > .menu-item:hover > .menu-link:before {width: calc(100% - 1.2em);background-color: currentColor;transform: scale(1,1) translate(50%,0);}',
  '.zn-desktop .zn-menu-hover-style-underline > .menu-item > .menu-link:before {bottom: 0;}',
  '.zn-desktop .zn-menu-hover-style-overline > .menu-item > .menu-link:before {top: 0;}',
  '.zn-desktop .zn-menu-hover-style-zoom > .menu-item > .menu-link:hover {transition: all .3s ease;transform: scale(1.2);}',
].join('');

/** The rules of one menu of the header. */
function menuCss(o: Options, c: Ctx, index: number): string {
  const prefix = `menu${index}`;
  const section = `section-hb-menu-${index}`;
  const s = `.zn-builder-menu-${index}`;
  const opt = (key: string, def: unknown = '') => o.get(`header-${prefix}-${key}`, def);
  const themeColor = o.get('theme-color');

  const subBorder = opt('submenu-border');
  const dividerOn = opt('submenu-item-border') === true;
  const dividerSize = opt('submenu-item-b-size');
  const dividerColor = opt('submenu-item-b-color');
  const radius = opt('submenu-border-radius-fields');
  const offsetRaw = opt('submenu-top-offset');
  const widthRaw = opt('submenu-width');

  const color = opt('color-responsive');
  const bg = opt('bg-obj-responsive');
  const hover = opt('h-color-responsive');
  const hoverBg = opt('h-bg-color-responsive');
  const active = opt('a-color-responsive');
  const activeBg = opt('a-bg-color-responsive');
  const v = (value: unknown, d: string) => (isset(value, d) ? at(value, d) : '');

  const extras = opt('font-extras');
  const fontSize = opt('font-size');
  const size = (d: string) =>
    fontCssValue(o, v(fontSize, d), str(v(fontSize, `${d}-unit`)), 'desktop');
  const spacing = opt('menu-spacing');

  const side = (k: string) => (subBorder && !empty(at(subBorder, k)) ? at(subBorder, k) : 0);
  const top = side('top');
  const offset = !empty(offsetRaw) ? offsetRaw : 0;
  const width = !empty(widthRaw) ? widthRaw : '';

  const margin = o.get(`${section}-margin`);
  const marginSelector = `${s} .main-header-menu, .zn-header-break-point ${s} .main-header-menu`;
  const margins = (d: string) => ({
    'margin-top': responsiveSpacing(margin, 'top', d),
    'margin-bottom': responsiveSpacing(margin, 'bottom', d),
    'margin-left': responsiveSpacing(margin, 'left', d),
    'margin-right': responsiveSpacing(margin, 'right', d),
  });
  const padding = (d: string) => ({
    'padding-top': responsiveSpacing(spacing, 'top', d),
    'padding-bottom': responsiveSpacing(spacing, 'bottom', d),
    'padding-left': responsiveSpacing(spacing, 'left', d),
    'padding-right': responsiveSpacing(spacing, 'right', d),
  });
  const corners = (d: string) => ({
    'border-top-left-radius': responsiveSpacing(radius, 'top', d),
    'border-top-right-radius': responsiveSpacing(radius, 'right', d),
    'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
    'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
  });
  const rightOf = (d: string) =>
    calcSpacing(responsiveSpacing(spacing, 'right', d), '-', '0.907', 'em');
  const orZero = (x: unknown) => (!empty(x) ? x : 0);

  const submenu = `${s} .sub-menu, ${s} .inline-on-mobile .sub-menu`;
  const hoverSel = `${s} .menu-link:hover, ${s} .main-header-menu > .menu-item:hover > .menu-link, ${s} .inline-on-mobile .zn-menu-toggle:hover, ${s} .inline-on-mobile .main-header-menu > .menu-item:hover > .zn-menu-toggle`;
  const hoverToggleSel = `${s} .zn-menu-toggle:hover, ${s} .main-header-menu > .menu-item:hover > .zn-menu-toggle`;
  const activeBelow = `${s} .menu-item.current-menu-item > .menu-link, ${s} .inline-on-mobile .menu-item.current-menu-item > .zn-menu-toggle, ${s} .current-menu-ancestor > .menu-link, ${s} .current-menu-ancestor > .zn-menu-toggle`;
  const firstLevel = `${s} .main-header-menu > .menu-item > .sub-menu, ${s} .main-header-menu > .menu-item > .zenit-full-megamenu-wrapper`;
  const background = `${s} .main-header-menu, ${s} .main-header-menu .sub-menu`;

  const desktop: Rules = {
    [s]: {
      'font-family': fontFamily(opt('font-family')),
      'font-weight': esc(opt('font-weight')),
      'text-transform': esc(fontExtras(extras, 'text-transform')),
    },
    [`${s} .menu-item > .menu-link`]: {
      'line-height': esc(fontExtras(extras, 'line-height', 'line-height-unit')),
      'font-size': size('desktop'),
      color: v(color, 'desktop'),
      ...padding('desktop'),
      'text-decoration': esc(fontExtras(extras, 'text-decoration')),
      'letter-spacing': esc(fontExtras(extras, 'letter-spacing', 'letter-spacing-unit')),
    },
    [`${s} .menu-item > .zn-menu-toggle`]: { color: v(color, 'desktop') },
    [hoverSel]: { color: v(hover, 'desktop'), background: v(hoverBg, 'desktop') },
    [hoverToggleSel]: { color: v(hover, 'desktop') },
    [`${s} .menu-item.current-menu-item > .menu-link, ${s} .inline-on-mobile .menu-item.current-menu-item > .zn-menu-toggle, ${s} .current-menu-ancestor > .menu-link`]:
      { color: v(active, 'desktop'), background: v(activeBg, 'desktop') },
    [`${s} .menu-item.current-menu-item > .zn-menu-toggle`]: { color: v(active, 'desktop') },
    [submenu]: {
      'border-top-width': cssValue(top, 'px'),
      'border-bottom-width': cssValue(side('bottom'), 'px'),
      'border-right-width': cssValue(side('right'), 'px'),
      'border-left-width': cssValue(side('left'), 'px'),
      'border-color': esc(opt('submenu-b-color', themeColor)),
      'border-style': 'solid',
      width: cssValue(width, 'px'),
      ...corners('desktop'),
    },
    [`${s} .sub-menu .sub-menu`]: { top: cssValue(str(-1 * intval(top)), 'px') },
    [firstLevel]: { 'margin-top': cssValue(offset, 'px') },
    [`.zn-desktop ${s} .main-header-menu > .menu-item > .sub-menu:before, .zn-desktop ${s} .main-header-menu > .menu-item > .zenit-full-megamenu-wrapper:before`]:
      { height: calcSpacing(`${str(offset)}px`, '+', `${intval(top)}px + 5`, 'px') },
    [`${s} .menu-item.menu-item-has-children > .zn-menu-toggle`]: {
      top: responsiveSpacing(spacing, 'top', 'desktop'),
      right: rightOf('desktop'),
    },
    [marginSelector]: margins('desktop'),
  };
  desktop[background] = responsiveBackgroundObj(o, bg, 'desktop');

  const m = `.zn-header-break-point .zn-builder-menu-${index}`;
  const mobileTop = orZero(responsiveSpacing(spacing, 'top', 'mobile'));
  const tabletTop = orZero(responsiveSpacing(spacing, 'top', 'tablet'));

  const tabletRules: Rules = {
    [`${m} .menu-item > .menu-link`]: { 'font-size': size('tablet') },
    [`${m} .main-header-menu .menu-item > .menu-link`]: padding('tablet'),
    [submenu]: corners('tablet'),
    [`${s} .main-header-menu .menu-item > .menu-link`]: { color: v(color, 'tablet') },
    [`${s} .menu-item > .zn-menu-toggle`]: { color: v(color, 'tablet') },
    [hoverSel]: { color: v(hover, 'tablet'), background: v(hoverBg, 'tablet') },
    [hoverToggleSel]: { color: v(hover, 'tablet') },
    [activeBelow]: { color: v(active, 'tablet'), background: v(activeBg, 'tablet') },
    [`${s} .menu-item.current-menu-item > .zn-menu-toggle`]: { color: v(active, 'tablet') },
    [`${m} .menu-item.menu-item-has-children > .zn-menu-toggle`]: {
      top: tabletTop,
      right: rightOf('tablet'),
    },
    [`${s} .inline-on-mobile .menu-item.menu-item-has-children > .zn-menu-toggle`]: c.rtl
      ? { left: '-15px' }
      : { right: '-15px' },
    [`${s} .menu-item-has-children > .menu-link:after`]: { content: 'unset' },
    [marginSelector]: margins('tablet'),
    [firstLevel]: { 'margin-top': '0' },
  };
  tabletRules[background] = responsiveBackgroundObj(o, bg, 'tablet');

  const mobileRules: Rules = {
    [`${m} .menu-item > .menu-link`]: { 'font-size': size('mobile') },
    [`${m} .main-header-menu .menu-item > .menu-link`]: padding('mobile'),
    [submenu]: corners('mobile'),
    [`${s} .main-header-menu .menu-item > .menu-link`]: { color: v(color, 'mobile') },
    [`${s} .menu-item  > .zn-menu-toggle`]: { color: v(color, 'mobile') },
    [hoverSel]: { color: v(hover, 'mobile'), background: v(hoverBg, 'mobile') },
    [hoverToggleSel]: { color: v(hover, 'mobile') },
    [activeBelow]: { color: v(active, 'mobile'), background: v(activeBg, 'mobile') },
    [`${s} .menu-item.current-menu-item  > .zn-menu-toggle`]: { color: v(active, 'mobile') },
    [`${m} .menu-item.menu-item-has-children > .zn-menu-toggle`]: {
      top: mobileTop,
      right: rightOf('mobile'),
    },
    [marginSelector]: margins('mobile'),
    [firstLevel]: { 'margin-top': '0' },
  };
  mobileRules[background] = responsiveBackgroundObj(o, bg, 'mobile');

  // Inner items follow the submenu's rounded corners, less its top border.
  const border = cssValue(str(top), 'px');
  const inner = (r: string) => (!empty(r) ? `calc(${r} - ${border})` : '');
  for (const [d, rules] of [
    ['desktop', desktop],
    ['tablet', tabletRules],
    ['mobile', mobileRules],
  ] as const) {
    rules[
      `${s} .sub-menu .menu-item:first-of-type > .menu-link, ${s} .inline-on-mobile .sub-menu .menu-item:first-of-type > .menu-link`
    ] = {
      'border-top-left-radius': inner(responsiveSpacing(radius, 'top', d)),
      'border-top-right-radius': inner(responsiveSpacing(radius, 'right', d)),
    };
    rules[
      `${s} .sub-menu .menu-item:last-of-type > .menu-link, ${s} .inline-on-mobile .sub-menu .menu-item:last-of-type > .menu-link`
    ] = {
      'border-bottom-right-radius': inner(responsiveSpacing(radius, 'bottom', d)),
      'border-bottom-left-radius': inner(responsiveSpacing(radius, 'left', d)),
    };
  }

  if (dividerOn) {
    desktop[
      `.zn-desktop ${s} .menu-item .sub-menu .menu-link, .zn-header-break-point .main-navigation ul .menu-item .menu-link`
    ] = {
      'border-bottom-width': `${str(dividerSize)}px`,
      'border-color': dividerColor,
      'border-style': 'solid',
    };
    desktop[
      `.zn-desktop ${s} .menu-item .sub-menu:last-child > .menu-item > .menu-link, .zn-header-break-point .main-navigation ul .menu-item .menu-link`
    ] = {
      'border-bottom-width': `${str(dividerSize)}px`,
    };
    desktop[`.zn-desktop ${s} .menu-item:last-child > .menu-item > .menu-link`] = {
      'border-bottom-width': 0,
    };
  } else {
    desktop[`.zn-desktop .zn-builder-menu-${index} .menu-item .sub-menu .menu-link`] = {
      'border-style': 'none',
    };
  }

  return (
    parseCss(desktop) +
    parseCss(tabletRules, '', tablet()) +
    parseCss(mobileRules, '', mobile()) +
    visibilityCss(o, section, s)
  );
}

export const part: Part = {
  name: 'hb_menu',
  run(o, c) {
    let css = '';
    for (let index = 1; index <= MENUS; index++) {
      if (isLoaded(o, `menu-${index}`, 'header')) css += menuCss(o, c, index);
    }
    let animated = false;
    for (let index = 1; index <= MENUS; index++) {
      if (o.get(`header-menu${index}-menu-hover-animation`) !== '') animated = true;
    }
    return css + (animated ? HOVER_STYLES : '');
  },
};
