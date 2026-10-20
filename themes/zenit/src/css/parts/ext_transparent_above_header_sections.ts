/**
 * The transparent header's colors for the above header row of the classic
 * layout (menu, submenu, search box and content colors per device).
 */
import { mobile, parseCss, tablet, type Rules } from '../../core/css.js';
import { esc } from '../../core/php.js';
import { isTransparentHeader, transparentColors } from '../lib/elements-transparent.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'ext_transparent_above_header_sections',
  run(o, c) {
    if (o.get('above-header-layout', 'disabled') === 'disabled') return '';
    if (!isTransparentHeader(o, c)) return '';
    const t = transparentColors(o);
    const onDesktop: Rules = {
      '.zn-theme-transparent-header .zn-above-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-above-header-section-separated .zn-above-header-navigation ul.zn-above-header-menu':
        {
          'background-color': esc(t.menuBgColorDesktop),
        },
      '.zn-theme-transparent-header .zn-above-header .zn-search-menu-icon form': {
        'background-color': esc(t.bgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-above-header .slide-search .search-field': {
        'background-color': esc(t.bgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-above-header .slide-search .search-field:focus': {
        'background-color': esc(t.bgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-above-header-navigation .menu-item.current-menu-item > .menu-link,.zn-theme-transparent-header .zn-above-header-navigation .menu-item.current-menu-ancestor > .menu-link':
        {
          color: esc(t.menuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-above-header-navigation .menu-item:hover > .menu-link': {
        color: esc(t.menuHColorDesktop),
      },
      '.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation > ul.zn-above-header-menu > .menu-item-has-children:not(.current-menu-item) > .zn-menu-toggle':
        {
          color: esc(t.menuColorDesktop),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu': {
        'background-color': esc(t.subMenuBgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:hover > .menu-item, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:focus > .menu-item, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.focus > .menu-item,.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.subMenuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.subMenuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link':
        {
          color: esc(t.subMenuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu, .zn-theme-transparent-header .zn-above-header-navigation .zn-above-header-menu .sub-menu a':
        {
          color: esc(t.subMenuColorDesktop),
        },
      // Content Section text color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select, .zn-theme-transparent-header .zn-above-header-section .widget, .zn-theme-transparent-header .zn-above-header-section .widget-title':
        {
          color: esc(t.contentSectionTextColorDesktop),
        },
      // Content Section link color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select a, .zn-theme-transparent-header .zn-above-header-section .widget a':
        {
          color: esc(t.contentSectionLinkColorDesktop),
        },
      // Content Section link hover color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select a:hover, .zn-theme-transparent-header .zn-above-header-section .widget a:hover':
        {
          color: esc(t.contentSectionLinkHColorDesktop),
        },
    };
    const onTablet: Rules = {
      '.zn-theme-transparent-header .zn-above-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-above-header-section-separated .zn-above-header-navigation ul.zn-above-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-section-separated .zn-below-header-actual-nav':
        {
          'background-color': esc(t.menuBgColorTablet),
        },
      '.zn-theme-transparent-header .zn-above-header .zn-search-menu-icon form': {
        'background-color': esc(t.bgColorTablet),
      },
      '.zn-theme-transparent-header .zn-above-header .slide-search .search-field': {
        'background-color': esc(t.bgColorTablet),
      },
      '.zn-theme-transparent-header .zn-above-header .slide-search .search-field:focus': {
        'background-color': esc(t.bgColorTablet),
      },
      '.zn-theme-transparent-header .zn-above-header-navigation .menu-item.current-menu-item > .menu-link,.zn-theme-transparent-header .zn-above-header-navigation .menu-item.current-menu-ancestor > .menu-link':
        {
          color: esc(t.menuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-above-header-navigation .menu-item:hover > .menu-link': {
        color: esc(t.menuHColorTablet),
      },
      '.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation > ul.zn-above-header-menu > .menu-item-has-children:not(.current-menu-item) > .zn-menu-toggle':
        {
          color: esc(t.menuColorTablet),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu': {
        'background-color': esc(t.subMenuBgColorTablet),
      },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:hover > .menu-item, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:focus > .menu-item, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.focus > .menu-item,.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.subMenuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.subMenuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link':
        {
          color: esc(t.subMenuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu, .zn-theme-transparent-header .zn-above-header-navigation .zn-above-header-menu .sub-menu a':
        {
          color: esc(t.subMenuColorTablet),
        },
      // Content Section text color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select, .zn-theme-transparent-header .zn-above-header-section .widget, .zn-theme-transparent-header .zn-above-header-section .widget-title':
        {
          color: esc(t.contentSectionTextColorTablet),
        },
      // Content Section link color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select a, .zn-theme-transparent-header .zn-above-header-section .widget a':
        {
          color: esc(t.contentSectionLinkColorTablet),
        },
      // Content Section link hover color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select a:hover, .zn-theme-transparent-header .zn-above-header-section .widget a:hover':
        {
          color: esc(t.contentSectionLinkHColorTablet),
        },
    };
    const onMobile: Rules = {
      '.zn-theme-transparent-header .zn-above-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-above-header-section-separated .zn-above-header-navigation ul.zn-above-header-menu, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-section-separated .zn-below-header-actual-nav':
        {
          'background-color': esc(t.menuBgColorMobile),
        },
      '.zn-theme-transparent-header .zn-above-header .zn-search-menu-icon form': {
        'background-color': esc(t.bgColorMobile),
      },
      '.zn-theme-transparent-header .zn-above-header .slide-search .search-field': {
        'background-color': esc(t.bgColorMobile),
      },
      '.zn-theme-transparent-header .zn-above-header .slide-search .search-field:focus': {
        'background-color': esc(t.bgColorMobile),
      },
      '.zn-theme-transparent-header .zn-above-header-navigation .menu-item.current-menu-item > .menu-link,.zn-theme-transparent-header .zn-above-header-navigation .menu-item.current-menu-ancestor > .menu-link':
        {
          color: esc(t.menuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-above-header-navigation .menu-item:hover > .menu-link': {
        color: esc(t.menuHColorMobile),
      },
      '.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation a, .zn-header-break-point.zn-theme-transparent-header .zn-above-header-navigation > ul.zn-above-header-menu > .menu-item-has-children:not(.current-menu-item) > .zn-menu-toggle':
        {
          color: esc(t.menuColorMobile),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu': {
        'background-color': esc(t.subMenuBgColorMobile),
      },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:hover > .menu-item, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:focus > .menu-item, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.focus > .menu-item,.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.subMenuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.subMenuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-above-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link':
        {
          color: esc(t.subMenuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-above-header-menu .sub-menu, .zn-theme-transparent-header .zn-above-header-navigation .zn-above-header-menu .sub-menu a':
        {
          color: esc(t.subMenuColorMobile),
        },
      // Content Section text color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select, .zn-theme-transparent-header .zn-above-header-section .widget, .zn-theme-transparent-header .zn-above-header-section .widget-title':
        {
          color: esc(t.contentSectionTextColorMobile),
        },
      // Content Section link color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select a, .zn-theme-transparent-header .zn-above-header-section .widget a':
        {
          color: esc(t.contentSectionLinkColorMobile),
        },
      // Content Section link hover color.
      '.zn-theme-transparent-header .zn-above-header-section .user-select a:hover, .zn-theme-transparent-header .zn-above-header-section .widget a:hover':
        {
          color: esc(t.contentSectionLinkHColorMobile),
        },
    };
    return (
      parseCss(onDesktop) + parseCss(onTablet, '', tablet()) + parseCss(onMobile, '', mobile())
    );
  },
};
