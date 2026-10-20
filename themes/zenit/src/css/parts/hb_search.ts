/**
 * The search element of the header: the search box and its icon (size,
 * color, width per device), margin and visibility.
 */
import { isLoaded } from '../../core/builder.js';
import {
  cssValue,
  mobile,
  parseCss,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import { empty, esc, isset, at } from '../../core/php.js';
import { visibilityCss } from '../base.js';
import { getProp } from '../lib/elements.js';
import type { Part } from './index.js';

const SEARCH_BASE =
  '.main-header-bar .main-header-bar-navigation .zn-search-icon {display: block;z-index: 4;position: relative;}' +
  '.zn-search-icon .zn-icon {z-index: 4;}' +
  '.zn-search-icon {z-index: 4;position: relative;line-height: normal;}' +
  '.main-header-bar .zn-search-menu-icon .search-form {background-color: #ffffff;}' +
  '.zn-search-menu-icon.zn-dropdown-active.slide-search .search-form {visibility: visible;opacity: 1;}' +
  '.zn-search-menu-icon .search-form {border: 1px solid var(--zn-search-border-color);line-height: normal;padding: 0 3em 0 0;border-radius: 2px;display: inline-block;-webkit-backface-visibility: hidden;backface-visibility: hidden;position: relative;color: inherit;background-color: #fff;}' +
  '.zn-search-menu-icon .zenit-search-icon {-js-display: flex;display: flex;line-height: normal;}' +
  '.zn-search-menu-icon .zenit-search-icon:focus {outline: none;}' +
  '.zn-search-menu-icon .search-field {border: none;background-color: transparent;transition: all .3s;border-radius: inherit;color: inherit;font-size: inherit;width: 0;color: #757575;}' +
  '.zn-search-menu-icon .search-submit {display: none;background: none;border: none;font-size: 1.3em;color: #757575;}' +
  '.zn-search-menu-icon.zn-dropdown-active {visibility: visible;opacity: 1;position: relative;}' +
  '.zn-search-menu-icon.zn-dropdown-active .search-field,.zn-dropdown-active.zn-search-menu-icon.slide-search input.search-field {width: 235px;}' +
  '.zn-header-search .zn-search-menu-icon.slide-search .search-form,.zn-header-search .zn-search-menu-icon.zn-inline-search .search-form {-js-display: flex;display: flex;align-items: center;}';

const SEARCH_RTL =
  '.zn-search-menu-icon.zn-inline-search .search-field {width : 100%;padding : 0.60em;padding-left : 5.5em;transition: all 0.2s;}' +
  '.site-header-section-left .zn-search-menu-icon.slide-search .search-form {padding-right: 2em;padding-left: unset;right: -1em;left: unset;}' +
  '.site-header-section-left .zn-search-menu-icon.slide-search .search-form .search-field {margin-left: unset;}' +
  '.zn-search-menu-icon.slide-search .search-form {-webkit-backface-visibility: visible;backface-visibility: visible;visibility: hidden;opacity: 0;transition: all .2s;position: absolute;z-index: 3;left: -1em;top: 50%;transform: translateY(-50%);}';

const SEARCH_LTR =
  '.zn-search-menu-icon.zn-inline-search .search-field {width : 100%;padding : 0.60em;padding-right : 5.5em;transition: all 0.2s;}' +
  '.site-header-section-left .zn-search-menu-icon.slide-search .search-form {padding-left: 2em;padding-right: unset;left: -1em;right: unset;}' +
  '.site-header-section-left .zn-search-menu-icon.slide-search .search-form .search-field {margin-right: unset;}' +
  '.zn-search-menu-icon.slide-search .search-form {-webkit-backface-visibility: visible;backface-visibility: visible;visibility: hidden;opacity: 0;transition: all .2s;position: absolute;z-index: 3;right: -1em;top: 50%;transform: translateY(-50%);}';
/** The icon size of a device, 20 when not set. */
function iconSize(size: unknown, d: string): unknown {
  return isset(size, d) && !empty(at(size, d)) ? at(size, d) : 20;
}

export const part: Part = {
  name: 'hb_search',
  run(o, c) {
    if (!isLoaded(o, 'search', 'header')) return '';
    const section = 'section-header-search';
    const s = '.zn-header-search';
    const size = o.get('header-search-icon-space');
    const width = o.get('header-search-width');
    const live = o.get('live-search');
    const color = o.get('header-search-icon-color');
    const margin = o.get(`${section}-margin`);
    const marginSelector =
      '.zn-hfb-header .site-header-section > .zn-header-search, .zn-hfb-header .zn-header-search';
    const box = (d: string) => ({
      'margin-top': responsiveSpacing(margin, 'top', d),
      'margin-bottom': responsiveSpacing(margin, 'bottom', d),
      'margin-left': responsiveSpacing(margin, 'left', d),
      'margin-right': responsiveSpacing(margin, 'right', d),
    });
    const icon = (d: string): Rules => ({
      [`${s} .zenit-search-icon`]: {
        color: esc(getProp(color, d)),
        'font-size': cssValue(iconSize(size, d), 'px'),
      },
      [`${s} .search-field::placeholder,${s} .zn-icon`]: { color: esc(getProp(color, d)) },
      [marginSelector]: box(d),
    });
    const placeholder = `${s} .zn-search-menu-icon .search-form .search-field:-ms-input-placeholder`;
    const desktop: Rules = {
      [`${placeholder},${placeholder}`]: { opacity: '0.5' },
      [`${s} .zn-search-menu-icon.slide-search .search-form, .zn-header-search .zn-search-menu-icon.zn-inline-search .search-form`]:
        { '-js-display': 'flex', display: 'flex', 'align-items': 'center' },
      '.zn-builder-layout-element.zn-header-search': { height: 'auto' },
      ...icon('desktop'),
    };
    const field = `${s} form.search-form .search-field, ${s} .zn-dropdown-active.zn-search-menu-icon.slide-search input.search-field`;
    desktop[field] = { width: cssValue(getProp(width, 'desktop'), 'px') };
    if (!empty(live)) desktop['.zn-search-menu-icon'] = { 'z-index': '5' };
    const smaller = (d: 'tablet' | 'mobile'): Rules => ({
      ...icon(d),
      [`${field}, .zn-mobile-header-content .zn-search-menu-icon .search-form`]: {
        width: cssValue(getProp(width, d), 'px'),
      },
    });
    const tab = smaller('tablet');
    if (!empty(live) && isLoaded(o, 'search', 'header', 'mobile')) {
      tab['.zn-mobile-header-content .zn-header-search .zn-search-menu-icon .search-form'] = {
        overflow: 'visible',
      };
    }
    return (
      SEARCH_BASE +
      (c.rtl ? SEARCH_RTL : SEARCH_LTR) +
      parseCss(desktop) +
      parseCss(tab, '', tablet()) +
      parseCss(smaller('mobile'), '', mobile()) +
      visibilityCss(o, section, s)
    );
  },
};
