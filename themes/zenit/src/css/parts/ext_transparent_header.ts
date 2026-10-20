/**
 * The transparent header: the header lies over the page content, with its
 * own logo, background and colors for every element, on desktop, mobile or
 * both, and a bottom border on its last row.
 */
import { cssValue, mobile, parseCss, tablet, type Rules } from '../../core/css.js';
import { at, empty, esc } from '../../core/php.js';
import { getProp } from '../lib/elements.js';
import {
  COLORS,
  isTransparentHeader,
  lastActiveRow,
  transparentColors,
} from '../lib/elements-transparent.js';
import type { Options } from '../../core/options.js';
import type { Part } from './index.js';

/** The rules: on every device (`all`), then the colors per device. */
function rules(o: Options): { all: Rules; desktop: Rules; tablet: Rules; mobile: Rules } {
  const t = transparentColors(o);
  // The header backgrounds of smaller screens fall back to the larger ones.
  for (const name of ['bgColor', 'aboveTransparentBgColor', 'belowTransparentBgColor'] as const) {
    const value = o.get(COLORS[name]);
    const desktop = t[`${name}Desktop`];
    const tab = getProp(value, 'tablet', desktop);
    t[`${name}Tablet`] = tab;
    t[`${name}Mobile`] = getProp(value, 'mobile', !empty(tab) ? tab : desktop);
  }
  const onAll: Rules = {
    '.zn-theme-transparent-header #masthead': {
      position: 'absolute',
      left: '0',
      right: '0',
    },
    '.zn-theme-transparent-header .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .main-header-bar':
      {
        background: 'none',
      },
    'body.elementor-editor-active.zn-theme-transparent-header #masthead, .fl-builder-edit .zn-theme-transparent-header #masthead, body.vc_editor.zn-theme-transparent-header #masthead, body.brz-ed.zn-theme-transparent-header #masthead':
      {
        'z-index': '0',
      },
    '.zn-header-break-point.zn-replace-site-logo-transparent.zn-theme-transparent-header .custom-mobile-logo-link':
      {
        display: 'none',
      },
    '.zn-header-break-point.zn-replace-site-logo-transparent.zn-theme-transparent-header .transparent-custom-logo':
      {
        display: 'inline-block',
      },
    '.zn-theme-transparent-header .zn-above-header, .zn-theme-transparent-header .zn-above-header.zn-above-header-bar':
      {
        'background-image': 'none',
        'background-color': 'transparent',
      },
    '.zn-theme-transparent-header .zn-below-header, .zn-theme-transparent-header .zn-below-header.zn-below-header-bar':
      {
        'background-image': 'none',
        'background-color': 'transparent',
      },
  };

  const onDesktop: Rules = {
    '.zn-theme-transparent-header .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .main-header-bar-wrap .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .main-header-bar-wrap .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .zn-mobile-header-wrap .main-header-bar':
      {
        'background-color': esc(t.bgColorDesktop),
      },
    '.zn-theme-transparent-header .main-header-bar .zn-search-menu-icon form': {
      'background-color': esc(t.bgColorDesktop),
    },
    '.zn-theme-transparent-header .zn-above-header, .zn-theme-transparent-header .zn-above-header.zn-above-header-bar':
      {
        'background-color': esc(t.aboveTransparentBgColorDesktop),
      },
    '.zn-theme-transparent-header .zn-below-header, .zn-theme-transparent-header .zn-below-header.zn-below-header-bar':
      {
        'background-color': esc(t.belowTransparentBgColorDesktop),
      },
    '.zn-theme-transparent-header .site-title a, .zn-theme-transparent-header .site-title a:focus, .zn-theme-transparent-header .site-title a:hover, .zn-theme-transparent-header .site-title a:visited':
      {
        color: esc(t.colorSiteTitleDesktop),
      },
    '.zn-theme-transparent-header .site-header .site-title a:hover': {
      color: esc(t.colorHSiteTitleDesktop),
    },
    '.zn-theme-transparent-header .site-header .site-description': {
      color: esc(t.colorSiteTitleDesktop),
    },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .sub-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu .main-header-bar-wrap .main-header-menu, .zn-flyout-menu-enable.zn-header-break-point.zn-theme-transparent-header .main-header-bar-navigation .site-navigation, .zn-fullscreen-menu-enable.zn-header-break-point.zn-theme-transparent-header .main-header-bar-navigation .site-navigation, .zn-flyout-above-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation-wrap .zn-above-header-navigation, .zn-flyout-below-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-below-header-navigation-wrap .zn-below-header-actual-nav, .zn-fullscreen-above-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation-wrap, .zn-fullscreen-below-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-below-header-navigation-wrap, .zn-theme-transparent-header .main-header-menu .menu-link':
      {
        'background-color': esc(t.menuBgColorDesktop),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu':
      {
        'background-color': esc(t.subMenuBgColorDesktop),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link':
      {
        color: esc(t.subMenuColorDesktop),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link:hover,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .menu-item,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .zn-menu-toggle,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link':
      {
        color: esc(t.subMenuHColorDesktop),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item > .menu-link, .zn-theme-transparent-header .zn-masthead-custom-menu-items, .zn-theme-transparent-header .zn-masthead-custom-menu-items a, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation > ul.zn-above-header-menu > .menu-item-has-children:not(.current-menu-item) > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu, .zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu, .zn-theme-transparent-header .main-header-menu .menu-link':
      {
        color: esc(t.menuColorDesktop),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .zn-masthead-custom-menu-items a:hover, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .focus > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-ancestor > .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header .main-header-menu .current-menu-ancestor > .menu-link':
      {
        color: esc(t.menuHColorDesktop),
      },
    // Content Section text color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget-title, .zn-theme-transparent-header .site-header-section [CLASS*="zn-header-html-"] .zn-builder-html-element':
      {
        color: esc(t.contentSectionTextColorDesktop),
      },
    // Content Section link color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items a, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget a, .zn-theme-transparent-header .site-header-section [CLASS*="zn-header-html-"] .zn-builder-html-element a':
      {
        color: esc(t.contentSectionLinkColorDesktop),
      },
    // Content Section link hover color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items a:hover, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget a:hover, .zn-theme-transparent-header .site-header-section [CLASS*="zn-header-html-"] .zn-builder-html-element a:hover':
      {
        color: esc(t.contentSectionLinkHColorDesktop),
      },
  };
  // New sites: links of submenus get no background of their own.
  const raw = o.raw('v4-3-2-anchor_transperent_style');
  if (raw === undefined || raw === null) {
    onDesktop[
      '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link, ' +
        '.zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link'
    ] = { 'background-color': 'transparent' };
  }

  const onTablet: Rules = {
    '.zn-theme-transparent-header .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .main-header-bar-wrap .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .main-header-bar-wrap .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .zn-mobile-header-wrap .main-header-bar':
      {
        'background-color': esc(t.bgColorTablet),
      },
    '.zn-theme-transparent-header .main-header-bar .zn-search-menu-icon form': {
      'background-color': esc(t.bgColorTablet),
    },
    '.zn-theme-transparent-header.zn-header-break-point .zn-above-header, .zn-theme-transparent-header.zn-header-break-point .zn-above-header-bar .main-header-menu':
      {
        'background-color': esc(t.aboveTransparentBgColorTablet),
      },
    '.zn-theme-transparent-header.zn-header-break-point .zn-below-header, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-bar .main-header-menu':
      {
        'background-color': esc(t.belowTransparentBgColorTablet),
      },
    '.zn-theme-transparent-header .site-title a, .zn-theme-transparent-header .site-title a:focus, .zn-theme-transparent-header .site-title a:hover, .zn-theme-transparent-header .site-title a:visited, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a:hover, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a:focus, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a:visited':
      {
        color: esc(t.colorSiteTitleTablet),
      },
    '.zn-theme-transparent-header .site-header .site-title a:hover': {
      color: esc(t.colorHSiteTitleTablet),
    },
    '.zn-theme-transparent-header .site-header .site-description': {
      color: esc(t.colorSiteTitleTablet),
    },
    '.zn-theme-transparent-header.zn-header-break-point .zn-builder-menu .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu  .main-header-menu .sub-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu  .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu .main-header-bar-wrap .main-header-menu, .zn-flyout-menu-enable.zn-header-break-point.zn-theme-transparent-header .main-header-bar-navigation .site-navigation, .zn-fullscreen-menu-enable.zn-header-break-point.zn-theme-transparent-header .main-header-bar-navigation .site-navigation, .zn-flyout-above-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation-wrap .zn-above-header-navigation, .zn-flyout-below-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-below-header-navigation-wrap .zn-below-header-actual-nav, .zn-fullscreen-above-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation-wrap, .zn-fullscreen-below-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-below-header-navigation-wrap, .zn-theme-transparent-header .main-header-menu .menu-link':
      {
        'background-color': esc(t.menuBgColorTablet),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation .main-header-menu .menu-item .sub-menu, .zn-theme-transparent-header.zenit-hfb-header .zn-builder-menu [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zenit-hfb-header .zn-builder-menu .main-header-bar-navigation [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header.zenit-hfb-header .zn-builder-menu [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zenit-hfb-header .zn-builder-menu .main-header-bar-navigation [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu':
      {
        'background-color': esc(t.subMenuBgColorTablet),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link':
      {
        color: esc(t.subMenuColorTablet),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link:hover,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .menu-item,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .menu-link,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .zn-menu-toggle,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link':
      {
        color: esc(t.subMenuHColorTablet),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item > .menu-link, .zn-theme-transparent-header .zn-masthead-custom-menu-items, .zn-theme-transparent-header .zn-masthead-custom-menu-items a,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-link':
      {
        color: esc(t.menuColorTablet),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .zn-masthead-custom-menu-items a:hover, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .focus > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-ancestor > .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header .main-header-menu .current-menu-ancestor > .menu-link':
      {
        color: esc(t.menuHColorTablet),
      },
    // Content Section text color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget-title, .zn-theme-transparent-header .site-header-section [CLASS*="zn-header-html-"] .zn-builder-html-element':
      {
        color: esc(t.contentSectionTextColorTablet),
      },
    // Content Section link color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items a, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget a':
      {
        color: esc(t.contentSectionLinkColorTablet),
      },
    // Content Section link hover color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items a:hover, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget a:hover':
      {
        color: esc(t.contentSectionLinkHColorTablet),
      },
  };

  const onMobile: Rules = {
    '.zn-theme-transparent-header .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .main-header-bar-wrap .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .main-header-bar-wrap .main-header-bar, .zn-theme-transparent-header.zn-header-break-point .zn-mobile-header-wrap .main-header-bar':
      {
        'background-color': esc(t.bgColorMobile),
      },
    '.zn-theme-transparent-header .main-header-bar .zn-search-menu-icon form': {
      'background-color': esc(t.bgColorMobile),
    },
    '.zn-theme-transparent-header.zn-header-break-point .zn-above-header, .zn-theme-transparent-header.zn-header-break-point .zn-above-header-bar .main-header-menu':
      {
        'background-color': esc(t.aboveTransparentBgColorMobile),
      },
    '.zn-theme-transparent-header.zn-header-break-point .zn-below-header, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-bar .main-header-menu':
      {
        'background-color': esc(t.belowTransparentBgColorMobile),
      },
    '.zn-theme-transparent-header .site-title a, .zn-theme-transparent-header .site-title a:focus, .zn-theme-transparent-header .site-title a:hover, .zn-theme-transparent-header .site-title a:visited, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a:hover, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a:focus, .zn-theme-transparent-header .zn-builder-layout-element .zn-site-identity .site-title a:visited':
      {
        color: esc(t.colorSiteTitleMobile),
      },
    '.zn-theme-transparent-header .site-header .site-title a:hover': {
      color: esc(t.colorHSiteTitleMobile),
    },
    '.zn-theme-transparent-header .site-header .site-description': {
      color: esc(t.colorSiteTitleMobile),
    },
    '.zn-theme-transparent-header.zn-header-break-point .zn-builder-menu .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu  .main-header-menu .sub-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu  .main-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-builder-menu .main-header-bar-wrap .main-header-menu, .zn-flyout-menu-enable.zn-header-break-point.zn-theme-transparent-header .main-header-bar-navigation .site-navigation, .zn-fullscreen-menu-enable.zn-header-break-point.zn-theme-transparent-header .main-header-bar-navigation .site-navigation, .zn-flyout-above-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation-wrap .zn-above-header-navigation, .zn-flyout-below-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-below-header-navigation-wrap .zn-below-header-actual-nav, .zn-fullscreen-above-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation-wrap, .zn-fullscreen-below-menu-enable.zn-header-break-point.zn-theme-transparent-header .zn-below-header-navigation-wrap, .zn-theme-transparent-header .main-header-menu .menu-link':
      {
        'background-color': esc(t.menuBgColorMobile),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation .main-header-menu .menu-item .sub-menu, .zn-theme-transparent-header.zenit-hfb-header .zn-builder-menu [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zenit-hfb-header .zn-builder-menu .main-header-bar-navigation [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .zn-builder-menu .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header.zenit-hfb-header .zn-builder-menu [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zenit-hfb-header .zn-builder-menu .main-header-bar-navigation [CLASS*="zn-builder-menu-"] .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu':
      {
        'background-color': esc(t.subMenuBgColorMobile),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link':
      {
        color: esc(t.subMenuColorMobile),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-link:hover,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .menu-item,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .menu-link,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.current-menu-item > .zn-menu-toggle,.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item .sub-menu .menu-item.focus > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-item.focus > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item .sub-menu .menu-item:hover > .menu-link, .zn-header-break-point.zn-flyout-menu-enable.zn-header-break-point .main-header-bar-navigation .main-header-menu .menu-item .sub-menu .menu-link':
      {
        color: esc(t.subMenuHColorMobile),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-link, .zn-theme-transparent-header .zn-masthead-custom-menu-items, .zn-theme-transparent-header .zn-masthead-custom-menu-items a, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-link':
      {
        color: esc(t.menuColorMobile),
      },
    '.zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .zn-masthead-custom-menu-items a:hover, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .focus > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-builder-menu .main-header-menu .current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-ancestor > .menu-link, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header [CLASS*="zn-builder-menu-"] .main-header-menu .current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .main-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .main-header-menu .current-menu-item > .menu-link, .zn-theme-transparent-header .main-header-menu .current-menu-ancestor > .menu-link':
      {
        color: esc(t.menuHColorMobile),
      },
    // Content Section text color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget-title, .zn-theme-transparent-header .site-header-section [CLASS*="zn-header-html-"] .zn-builder-html-element':
      {
        color: esc(t.contentSectionTextColorMobile),
      },
    // Content Section link color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items a, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget a':
      {
        color: esc(t.contentSectionLinkColorMobile),
      },
    // Content Section link hover color.
    '.zn-theme-transparent-header div.zn-masthead-custom-menu-items a:hover, .zn-theme-transparent-header div.zn-masthead-custom-menu-items .widget a:hover':
      {
        color: esc(t.contentSectionLinkHColorMobile),
      },
  };
  return { all: onAll, desktop: onDesktop, tablet: onTablet, mobile: onMobile };
}

/** The bottom border of the given rows: a width and color, or none. */
function border(o: Options, selector: string): Rules {
  const sep = o.get('transparent-header-main-sep');
  if (sep !== '' && sep !== 'inherit') {
    return {
      [selector]: {
        'border-bottom-width': cssValue(sep, 'px'),
        'border-bottom-style': 'solid',
        'border-bottom-color': esc(o.get('transparent-header-main-sep-color')),
      },
    };
  }
  return { [selector]: { 'border-bottom-style': 'none' } };
}

export const part: Part = {
  name: 'ext_transparent_header',
  run(o, c) {
    if (!isTransparentHeader(o, c)) return '';
    const width = o.get('transparent-header-logo-width');
    const devices = o.get('transparent-header-on-devices');
    let css = '';
    if (o.get('different-transparent-logo') === '0' && o.get('transparent-header-logo') !== '') {
      css += parseCss({
        '.zn-theme-transparent-header .site-logo-img .custom-logo-link': { display: 'none' },
      });
    }
    const logo = (d: string): Rules => ({
      '.zn-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo .zenit-logo-svg':
        {
          width: cssValue(at(width, d), 'px'),
          height: cssValue(
            !empty(at(width, `${d}-svg-height`)) ? at(width, `${d}-svg-height`) : '',
            'px',
          ),
        },
      '.zn-theme-transparent-header #masthead .site-logo-img .transparent-custom-logo img': {
        ' max-width': cssValue(at(width, d), 'px'),
        ' width': cssValue(at(width, d), 'px'),
      },
    });
    css += parseCss(logo('desktop'));
    css += parseCss(logo('tablet'), '', tablet());
    css += parseCss(logo('mobile'), '', mobile(1));

    const r = rules(o);
    if (devices === 'both' || devices === 'desktop') {
      css += parseCss(r.all, tablet('', 1));
      css += devices === 'both' ? parseCss(r.desktop) : parseCss(r.desktop, tablet('', 1));
    }
    if (devices === 'mobile') {
      css += parseCss({ '.transparent-custom-logo': { display: 'none' } }, tablet());
      css += parseCss({ '.transparent-custom-logo': { display: 'block' } }, '', tablet());
      css += parseCss({ '.zn-transparent-desktop-logo': { display: 'none' } }, '', tablet());
    }
    if (devices === 'desktop') {
      css += parseCss({ '.transparent-custom-logo': { display: 'none' } }, '', tablet());
      css += parseCss({ '.zn-transparent-mobile-logo': { display: 'none' } }, tablet());
      css += parseCss({ '.zn-transparent-mobile-logo': { display: 'block' } }, '', tablet(1));
    }
    if (devices === 'both' || devices === 'mobile') {
      css += parseCss(r.all, '', tablet());
      css += parseCss(r.tablet, '', tablet());
      css += parseCss(r.mobile, '', mobile());
    }
    if (devices === 'both') {
      const desk = lastActiveRow(o, 'desktop');
      const mob = lastActiveRow(o, 'mobile');
      css += parseCss(border(o, desk !== '' && mob !== '' ? `${desk}, ${mob}` : desk + mob));
    }
    if (devices === 'mobile') css += parseCss(border(o, lastActiveRow(o, 'mobile')), '', tablet());
    if (devices === 'desktop')
      css += parseCss(border(o, lastActiveRow(o, 'desktop')), tablet('', 1));
    return css;
  },
};
