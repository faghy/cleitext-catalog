/**
 * The menu shown in the mobile header and the off-canvas area: font, colors
 * per device (normal, hover, active), backgrounds, item spacing, submenu
 * toggles, dividers between items, margin and visibility.
 */
import { isLoaded } from '../../core/builder.js';
import {
  fontArrayCss,
  fontCssValue,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
} from '../../core/css.js';
import type { Rules } from '../../core/css.js';
import { at, empty, isset, str } from '../../core/php.js';
import { visibilityCss } from '../base.js';
import { calcSpacing } from '../lib/header-rows.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'hb_mobile_menu',
  run(o) {
    if (!isLoaded(o, 'mobile-menu', 'header')) return '';
    const section = 'section-header-mobile-menu';
    const s = '.zn-builder-menu-mobile .main-navigation';

    const dividerOn = o.get('header-mobile-menu-submenu-item-border') === true;
    const dividerSize = o.get('header-mobile-menu-submenu-item-b-size');
    const dividerColor = dividerOn ? o.get('header-mobile-menu-submenu-item-b-color') : '';

    const color = o.get('header-mobile-menu-color-responsive');
    const bg = o.get('header-mobile-menu-bg-obj-responsive');
    const hover = o.get('header-mobile-menu-h-color-responsive');
    const hoverBg = o.get('header-mobile-menu-h-bg-color-responsive');
    const active = o.get('header-mobile-menu-a-color-responsive');
    const activeBg = o.get('header-mobile-menu-a-bg-color-responsive');
    const submenuBg = o.get('header-mobile-menu-submenu-bg-color-responsive');
    const v = (value: unknown, d: string) => (isset(value, d) ? at(value, d) : '');

    const fontSize = o.get('header-mobile-menu-font-size');
    const size = (d: string) =>
      fontCssValue(o, v(fontSize, d), str(v(fontSize, `${d}-unit`)), 'desktop');
    const spacing = o.get('header-mobile-menu-menu-spacing');
    const margin = o.get(`${section}-margin`);
    const marginSelector =
      '.zn-builder-menu-mobile .main-header-menu, .zn-header-break-point .zn-builder-menu-mobile .main-header-menu';

    const orZero = (x: unknown) => (x !== undefined && x !== null && !empty(x) ? x : 0);
    const desktopTop = orZero(responsiveSpacing(spacing, 'top', 'desktop'));
    const tabletTop = orZero(responsiveSpacing(spacing, 'top', 'tablet'));
    let mobileTop: unknown = responsiveSpacing(spacing, 'top', 'mobile');
    if (mobileTop === '' && tabletTop !== '' && tabletTop !== 0) mobileTop = tabletTop;
    mobileTop = orZero(mobileTop);

    const padding = (d: string) => ({
      'padding-top': responsiveSpacing(spacing, 'top', d),
      'padding-bottom': responsiveSpacing(spacing, 'bottom', d),
      'padding-left': responsiveSpacing(spacing, 'left', d),
      'padding-right': responsiveSpacing(spacing, 'right', d),
    });
    const margins = (d: string) => ({
      'margin-top': responsiveSpacing(margin, 'top', d),
      'margin-bottom': responsiveSpacing(margin, 'bottom', d),
      'margin-left': responsiveSpacing(margin, 'left', d),
      'margin-right': responsiveSpacing(margin, 'right', d),
    });
    const toggle = (d: string, top: unknown) => ({
      top,
      right: calcSpacing(responsiveSpacing(spacing, 'right', d), '-', '0.907', 'em'),
    });
    const hoverSel = `${s} .menu-link:hover, ${s} .main-header-menu > .menu-item:hover > .menu-link, ${s} .inline-on-mobile .zn-menu-toggle:hover, ${s} .inline-on-mobile .main-header-menu > .menu-item:hover > .zn-menu-toggle`;
    const hoverToggleSel = `${s} .zn-menu-toggle:hover, ${s} .main-header-menu > .menu-item:hover > .zn-menu-toggle`;
    const activeSel = `${s} .menu-item.current-menu-item > .menu-link, ${s} .inline-on-mobile .menu-item.current-menu-item > .zn-menu-toggle, ${s} .menu-item.current-menu-ancestor > .menu-link, ${s} .menu-item.current-menu-ancestor > .zn-menu-toggle`;
    const parentToggle = `${s} .menu-item.menu-item-has-children > .zn-menu-toggle`;
    const submenuLink = `${s} .main-header-menu .sub-menu .menu-link`;

    const desktop: Rules = {
      [`${s} .menu-item > .menu-link`]: fontArrayCss(
        o,
        o.get('header-mobile-menu-font-family'),
        o.get('header-mobile-menu-font-weight'),
        [],
        'font-extras-header-mobile-menu',
      ),
      [s]: { 'font-size': size('desktop') },
      [`${s} .main-header-menu .menu-item > .menu-link`]: {
        color: v(color, 'desktop'),
        ...padding('desktop'),
      },
      [`${s} .main-header-menu .menu-item > .zn-menu-toggle`]: { color: v(color, 'desktop') },
      [hoverSel]: { color: v(hover, 'desktop'), background: v(hoverBg, 'desktop') },
      [`.zn-builder-menu-mobile .menu-link:hover, .zn-builder-menu-mobile .main-header-menu > .menu-item:hover > .menu-link, ${s} .inline-on-mobile .zn-menu-toggle:hover, ${s} .inline-on-mobile .main-header-menu > .menu-item:hover > .zn-menu-toggle`]:
        { color: v(hover, 'desktop'), background: v(hoverBg, 'desktop') },
      [hoverToggleSel]: { color: v(hover, 'desktop') },
      [activeSel]: { color: v(active, 'desktop'), background: v(activeBg, 'desktop') },
      [`${s} .menu-item.current-menu-item > .zn-menu-toggle`]: { color: v(active, 'desktop') },
      [parentToggle]: toggle('desktop', desktopTop),
      [`${s} .menu-item-has-children > .menu-link:after`]: { content: 'unset' },
      [marginSelector]: margins('desktop'),
      [`${s} .main-header-menu, ${s} .main-header-menu .menu-link, ${s} .main-header-menu .sub-menu`]:
        responsiveBackgroundObj(o, bg, 'desktop'),
      [submenuLink]: { 'background-color': v(submenuBg, 'desktop') },
    };

    const tabletRules: Rules = {
      [s]: { 'font-size': size('tablet') },
      [`${s} .main-header-menu .menu-item > .menu-link`]: {
        color: v(color, 'tablet'),
        ...padding('tablet'),
      },
      [`${s} .main-header-menu .menu-item > .zn-menu-toggle`]: { color: v(color, 'tablet') },
      [hoverSel]: { color: v(hover, 'tablet'), background: v(hoverBg, 'tablet') },
      [hoverToggleSel]: { color: v(hover, 'tablet') },
      [activeSel]: { color: v(active, 'tablet'), background: v(activeBg, 'tablet') },
      [`${s} .menu-item.current-menu-item > .zn-menu-toggle`]: { color: v(active, 'tablet') },
      [parentToggle]: toggle('tablet', tabletTop),
      [`${s} .menu-item-has-children > .menu-link:after`]: { content: 'unset' },
      [marginSelector]: margins('tablet'),
      [`${s} .main-header-menu , ${s} .main-header-menu .menu-link, ${s} .main-header-menu .sub-menu`]:
        responsiveBackgroundObj(o, bg, 'tablet'),
      [submenuLink]: {
        'background-color': isset(submenuBg, 'tablet')
          ? at(submenuBg, 'tablet')
          : v(submenuBg, 'desktop'),
      },
    };

    const mobileRules: Rules = {
      [s]: { 'font-size': size('mobile') },
      [`${s} .main-header-menu .menu-item > .menu-link`]: {
        color: v(color, 'mobile'),
        ...padding('mobile'),
      },
      [`${s} .main-header-menu .menu-item  > .zn-menu-toggle`]: { color: v(color, 'mobile') },
      [hoverSel]: { color: v(hover, 'mobile'), background: v(hoverBg, 'mobile') },
      [hoverToggleSel]: { color: v(hover, 'mobile') },
      [activeSel]: { color: v(active, 'mobile'), background: v(activeBg, 'mobile') },
      [`${s} .menu-item.current-menu-item  > .zn-menu-toggle`]: { color: v(active, 'mobile') },
      [parentToggle]: toggle('mobile', mobileTop),
      [marginSelector]: margins('mobile'),
      [`${s} .main-header-menu, ${s} .main-header-menu .menu-link, ${s} .main-header-menu .sub-menu`]:
        responsiveBackgroundObj(o, bg, 'mobile'),
      [submenuLink]: {
        'background-color': isset(submenuBg, 'mobile')
          ? at(submenuBg, 'mobile')
          : v(submenuBg, 'desktop'),
      },
    };

    const h = '.zn-hfb-header';
    const submenu: Rules = dividerOn
      ? {
          [`${h} ${s} .main-header-menu, ${h} ${s} .main-header-menu, ${h} .zn-mobile-header-content ${s} .main-header-menu, ${h} .zn-mobile-popup-content ${s} .main-header-menu`]:
            { 'border-top-width': `${str(dividerSize)}px`, 'border-color': dividerColor },
          [`${h} ${s} .menu-item .sub-menu .menu-link, ${h} ${s} .menu-item .menu-link, ${h} ${s} .menu-item .sub-menu .menu-link, ${h} ${s} .menu-item .menu-link, ${h} .zn-mobile-header-content ${s} .menu-item .sub-menu .menu-link, ${h} .zn-mobile-header-content ${s} .menu-item .menu-link, ${h} .zn-mobile-popup-content ${s} .menu-item .sub-menu .menu-link, ${h} .zn-mobile-popup-content ${s} .menu-item .menu-link`]:
            {
              'border-bottom-width': `${str(dividerSize)}px`,
              'border-color': dividerColor,
              'border-style': 'solid',
            },
        }
      : {
          [`${h} .zn-builder-menu-mobile .main-header-menu, ${h} .zn-builder-menu-mobile .main-navigation .menu-item .menu-link, ${h} .zn-builder-menu-mobile .main-navigation .menu-item .sub-menu .menu-link`]:
            { 'border-style': 'none' },
        };
    submenu[parentToggle] = toggle('desktop', desktopTop);

    return (
      parseCss(desktop) +
      parseCss(submenu) +
      parseCss(tabletRules, '', tablet()) +
      parseCss(mobileRules, '', mobile()) +
      visibilityCss(o, section, s, 'block')
    );
  },
};
