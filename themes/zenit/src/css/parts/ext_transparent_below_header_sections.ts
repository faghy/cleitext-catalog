/**
 * The transparent header's colors for the below header row of the classic
 * layout (menu, submenu, search box and content colors per device).
 */
import { mobile, parseCss, tablet, type Rules } from '../../core/css.js';
import { esc } from '../../core/php.js';
import { isTransparentHeader, transparentColors } from '../lib/elements-transparent.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'ext_transparent_below_header_sections',
  run(o, c) {
    if (o.get('below-header-layout', 'disabled') === 'disabled') return '';
    if (!isTransparentHeader(o, c)) return '';
    const t = transparentColors(o);
    const onDesktop: Rules = {
      '.zn-theme-transparent-header.zn-no-toggle-below-menu-enable.zn-header-break-point .zn-below-header-navigation-wrap, .zn-theme-transparent-header .zn-below-header-actual-nav, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-actual-nav':
        {
          'background-color': esc(t.menuBgColorDesktop),
        },
      '.zn-theme-transparent-header .zn-below-header .zn-search-menu-icon form': {
        'background-color': esc(t.bgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-below-header .slide-search .search-field': {
        'background-color': esc(t.bgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-below-header .slide-search .search-field:focus': {
        'background-color': esc(t.bgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-below-header-menu, .zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu':
        {
          color: esc(t.menuColorDesktop),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.focus > .menu-link':
        {
          color: esc(t.menuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.menuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item:hover > .menu-item, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item:focus > .menu-item, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.focus > .menu-item':
        {
          color: esc(t.subMenuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link':
        {
          color: esc(t.subMenuHColorDesktop),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu': {
        'background-color': esc(t.subMenuBgColorDesktop),
      },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu, .zn-theme-transparent-header .zn-below-header-menu .sub-menu a':
        {
          color: esc(t.subMenuColorDesktop),
        },
      '.zn-theme-transparent-header .below-header-user-select, .zn-theme-transparent-header .below-header-user-select .widget,.zn-theme-transparent-header .below-header-user-select .widget-title':
        {
          color: esc(t.contentSectionTextColorDesktop),
        },
      '.zn-theme-transparent-header .below-header-user-select a, .zn-theme-transparent-header .below-header-user-select .widget a':
        {
          color: esc(t.contentSectionLinkColorDesktop),
        },
      '.zn-theme-transparent-header .below-header-user-select a:hover, .zn-theme-transparent-header .below-header-user-select .widget a:hover':
        {
          color: esc(t.contentSectionLinkHColorDesktop),
        },
    };
    const onTablet: Rules = {
      '.zn-theme-transparent-header.zn-no-toggle-below-menu-enable.zn-header-break-point .zn-below-header-navigation-wrap, .zn-theme-transparent-header .zn-below-header-actual-nav, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-actual-nav':
        {
          'background-color': esc(t.menuBgColorTablet),
        },
      '.zn-theme-transparent-header .zn-below-header .zn-search-menu-icon form': {
        'background-color': esc(t.bgColorTablet),
      },
      '.zn-theme-transparent-header .zn-below-header .slide-search .search-field': {
        'background-color': esc(t.bgColorTablet),
      },
      '.zn-theme-transparent-header .zn-below-header .slide-search .search-field:focus': {
        'background-color': esc(t.bgColorTablet),
      },
      '.zn-theme-transparent-header .zn-below-header-menu, .zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu':
        {
          color: esc(t.menuColorTablet),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.focus > .menu-link':
        {
          color: esc(t.menuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.menuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item:hover > .menu-item, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item:focus > .menu-item, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.focus > .menu-item':
        {
          color: esc(t.subMenuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link':
        {
          color: esc(t.subMenuHColorTablet),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu': {
        'background-color': esc(t.subMenuBgColorTablet),
      },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu, .zn-theme-transparent-header .zn-below-header-menu .sub-menu a':
        {
          color: esc(t.subMenuColorTablet),
        },
      '.zn-theme-transparent-header .below-header-user-select, .zn-theme-transparent-header .below-header-user-select .widget,.zn-theme-transparent-header .below-header-user-select .widget-title':
        {
          color: esc(t.contentSectionTextColorTablet),
        },
      '.zn-theme-transparent-header .below-header-user-select a, .zn-theme-transparent-header .below-header-user-select .widget a':
        {
          color: esc(t.contentSectionLinkColorTablet),
        },
      '.zn-theme-transparent-header .below-header-user-select a:hover, .zn-theme-transparent-header .below-header-user-select .widget a:hover':
        {
          color: esc(t.contentSectionLinkHColorTablet),
        },
    };
    const onMobile: Rules = {
      '.zn-theme-transparent-header.zn-no-toggle-below-menu-enable.zn-header-break-point .zn-below-header-navigation-wrap, .zn-theme-transparent-header .zn-below-header-actual-nav, .zn-theme-transparent-header.zn-header-break-point .zn-below-header-actual-nav':
        {
          'background-color': esc(t.menuBgColorMobile),
        },
      '.zn-theme-transparent-header .zn-below-header .zn-search-menu-icon form': {
        'background-color': esc(t.bgColorMobile),
      },
      '.zn-theme-transparent-header .zn-below-header .slide-search .search-field': {
        'background-color': esc(t.bgColorMobile),
      },
      '.zn-theme-transparent-header .zn-below-header .slide-search .search-field:focus': {
        'background-color': esc(t.bgColorMobile),
      },
      '.zn-theme-transparent-header .zn-below-header-menu, .zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu a, .zn-header-break-point.zn-theme-transparent-header .zn-below-header-menu':
        {
          color: esc(t.menuColorMobile),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.focus > .menu-link':
        {
          color: esc(t.menuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-ancestor > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .menu-item.current-menu-item > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .zn-menu-toggle, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .zn-menu-toggle':
        {
          color: esc(t.menuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item:hover > .menu-item, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item:focus > .menu-item, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.focus > .menu-item':
        {
          color: esc(t.subMenuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-ancestor.focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:hover > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item:focus > .menu-link, .zn-theme-transparent-header .zn-below-header-menu .sub-menu .menu-item.current-menu-item.focus > .menu-link':
        {
          color: esc(t.subMenuHColorMobile),
        },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu': {
        'background-color': esc(t.subMenuBgColorMobile),
      },
      '.zn-theme-transparent-header .zn-below-header-menu .sub-menu, .zn-theme-transparent-header .zn-below-header-menu .sub-menu a':
        {
          color: esc(t.subMenuColorMobile),
        },
      '.zn-theme-transparent-header .below-header-user-select, .zn-theme-transparent-header .below-header-user-select .widget,.zn-theme-transparent-header .below-header-user-select .widget-title':
        {
          color: esc(t.contentSectionTextColorMobile),
        },
      '.zn-theme-transparent-header .below-header-user-select a, .zn-theme-transparent-header .below-header-user-select .widget a':
        {
          color: esc(t.contentSectionLinkColorMobile),
        },
      '.zn-theme-transparent-header .below-header-user-select a:hover, .zn-theme-transparent-header .below-header-user-select .widget a:hover':
        {
          color: esc(t.contentSectionLinkHColorMobile),
        },
    };
    return (
      parseCss(onDesktop) + parseCss(onTablet, '', tablet()) + parseCss(onMobile, '', mobile())
    );
  },
};
