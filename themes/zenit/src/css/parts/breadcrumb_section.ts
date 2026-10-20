/**
 * Breadcrumbs: list reset and separator, then (when shown) colors, font,
 * background, spacing by position, alignment and line height.
 */
import {
  fontArrayCss,
  fontExtras,
  mobile,
  parseCss,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import { at, esc, str } from '../../core/php.js';
import { deviceFont } from '../lib/footer-global.js';
import type { Part } from './index.js';

const AFTER_HEADER =
  '.main-header-bar.zn-header-breadcrumb, .zn-header-break-point .main-header-bar.zn-header-breadcrumb, ' +
  '.zn-header-break-point .header-main-layout-2 .main-header-bar.zn-header-breadcrumb, ' +
  '.zn-header-break-point .zn-mobile-header-stack .main-header-bar.zn-header-breadcrumb, ' +
  '.zn-default-menu-enable.zn-main-header-nav-open.zn-header-break-point .main-header-bar-wrap .main-header-bar.zn-header-breadcrumb, ' +
  '.zn-main-header-nav-open .main-header-bar-wrap .main-header-bar.zn-header-breadcrumb';
const INSIDE_HEADER =
  '.zn-breadcrumbs-wrapper .zn-breadcrumbs-inner #zn-breadcrumbs-yoast, .zn-breadcrumbs-wrapper .zn-breadcrumbs-inner .breadcrumbs, ' +
  '.zn-breadcrumbs-wrapper .zn-breadcrumbs-inner .rank-math-breadcrumb, .zn-breadcrumbs-inner nav';
const BEFORE_TITLE =
  '.zn-breadcrumbs-wrapper #zn-breadcrumbs-yoast, .zn-breadcrumbs-wrapper .breadcrumbs, ' +
  '.zn-breadcrumbs-wrapper .rank-math-breadcrumb, .zn-breadcrumbs-inner nav';

export const part: Part = {
  name: 'breadcrumb_section',
  run(o) {
    let css = parseCss({
      '.zn-breadcrumbs .trail-browse, .zn-breadcrumbs .trail-items, .zn-breadcrumbs .trail-items li':
        {
          display: 'inline-block',
          margin: '0',
          padding: '0',
          border: 'none',
          background: 'inherit',
          'text-indent': '0',
          'text-decoration': 'none',
        },
      '.zn-breadcrumbs .trail-browse': {
        'font-size': 'inherit',
        'font-style': 'inherit',
        'font-weight': 'inherit',
        color: 'inherit',
      },
      '.zn-breadcrumbs .trail-items': { 'list-style': 'none' },
      '.trail-items li::after': { padding: '0 0.3em', content: '"\\00bb"' },
      '.trail-items li:last-of-type::after': { display: 'none' },
    });
    const position = o.get('breadcrumb-position', 'none');
    if (position === 'none') return css;

    const none = { desktop: '', tablet: '', mobile: '' };
    const text = o.get('breadcrumb-text-color-responsive', none);
    const active = o.get('breadcrumb-active-color-responsive', none);
    const hover = o.get('breadcrumb-hover-color-responsive', none);
    const separatorColor = o.get('breadcrumb-separator-color', none);
    const background = o.get('breadcrumb-bg-color', none);
    const size = o.get('breadcrumb-font-size');
    const spacing = o.get('breadcrumb-spacing');
    const chooser = o.get('breadcrumb-separator-selector');
    const separator =
      chooser === 'unicode' || chooser === 'custom' ? o.get('breadcrumb-separator') : chooser;

    css += parseCss({ '.trail-items li::after': { content: `"${str(separator)}"` } });

    const colors = (d: string): Rules => ({
      '.zn-breadcrumbs-wrapper .trail-items a': { color: esc(at(text, d)) },
      '.zn-breadcrumbs-wrapper .trail-items .trail-end': { color: esc(at(active, d)) },
      '.zn-breadcrumbs-wrapper .trail-items a:hover': { color: esc(at(hover, d)) },
      '.zn-breadcrumbs-wrapper .trail-items li::after': { color: esc(at(separatorColor, d)) },
    });
    const desktop: Rules = {
      ...colors('desktop'),
      '.zn-breadcrumbs-wrapper, .zn-breadcrumbs-wrapper *': fontArrayCss(
        o,
        o.get('breadcrumb-font-family'),
        o.get('breadcrumb-font-weight'),
        size,
        'breadcrumb-font-extras',
      ),
    };
    const small = (d: string): Rules => ({
      ...colors(d),
      '.zn-breadcrumbs-wrapper, .zn-breadcrumbs-wrapper a': { 'font-size': deviceFont(o, size, d) },
    });
    const tab = small('tablet');
    const mob = small('mobile');
    const bgKey = '.zn-breadcrumbs-wrapper, .main-header-bar.zn-header-breadcrumb';
    desktop[bgKey] = { 'background-color': esc(at(background, 'desktop')) };
    tab[bgKey] = { 'background-color': esc(at(background, 'tablet')) };
    mob[bgKey] = { 'background-color': esc(at(background, 'mobile')) };

    const pad = (d: string) => ({
      'padding-top': responsiveSpacing(spacing, 'top', d),
      'padding-right': responsiveSpacing(spacing, 'right', d),
      'padding-bottom': responsiveSpacing(spacing, 'bottom', d),
      'padding-left': responsiveSpacing(spacing, 'left', d),
    });
    const defaults: Rules = {};
    let padKey = BEFORE_TITLE;
    // Positions are action hook names; their theme prefix is ignored.
    const hook = str(position).replace(/^[a-z]+_/, '');
    if (hook === 'header_markup_after' || hook === 'header_after') {
      padKey = AFTER_HEADER;
      defaults['.zn-header-breadcrumb'] = {
        'padding-top': '10px',
        'padding-bottom': '10px',
        width: '100%',
      };
    } else if (hook === 'masthead_content') {
      padKey = INSIDE_HEADER;
      defaults[
        '.zn-breadcrumbs-inner #zn-breadcrumbs-yoast, .zn-breadcrumbs-inner .breadcrumbs, .zn-breadcrumbs-inner .rank-math-breadcrumb, .zn-breadcrumbs-inner nav'
      ] = { 'padding-bottom': '10px' };
      defaults['.zn-header-break-point .zn-breadcrumbs-wrapper'] = { order: '4' };
    }
    desktop[padKey] = pad('desktop');
    tab[padKey] = pad('tablet');
    mob[padKey] = pad('mobile');
    desktop['.zn-breadcrumbs-wrapper'] = { 'text-align': esc(o.get('breadcrumb-alignment')) };

    const lineHeight = fontExtras(
      o.get('breadcrumb-font-extras', {}),
      'line-height',
      'line-height-unit',
    );
    return (
      css +
      parseCss(desktop) +
      parseCss(tab, '', tablet()) +
      parseCss(mob, '', mobile()) +
      parseCss(defaults) +
      parseCss({
        '.zn-default-menu-enable.zn-main-header-nav-open.zn-header-break-point .main-header-bar.zn-header-breadcrumb, .zn-main-header-nav-open .main-header-bar.zn-header-breadcrumb':
          { 'padding-top': '1em', 'padding-bottom': '1em' },
      }) +
      parseCss({
        '.zn-header-break-point .main-header-bar.zn-header-breadcrumb': {
          'border-bottom-width': '1px',
          'border-bottom-color': '#eaeaea',
          'border-bottom-style': 'solid',
        },
      }) +
      parseCss({
        '.zn-breadcrumbs-wrapper': { 'line-height': lineHeight !== '' ? esc(lineHeight) : '1.4' },
      }) +
      parseCss({ '.zn-breadcrumbs-wrapper .rank-math-breadcrumb p': { 'margin-bottom': '0px' } }) +
      parseCss({ '.zn-breadcrumbs-wrapper': { display: 'block', width: '100%' } })
    );
  },
};
