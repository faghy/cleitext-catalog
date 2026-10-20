/**
 * Header separator, content and sidebar widths when there is a sidebar, the
 * flex layout of menu items and the turn of submenu arrows.
 */
import { cssValue, parseCss, tablet } from '../../core/css.js';
import { esc, intval } from '../../core/php.js';
import { sidebarLayout } from '../lib/main.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'return_meta_output',
  run(o, c) {
    const right = c.rtl ? 'left' : 'right';
    const left = c.rtl ? 'right' : 'left';
    const secondary = Math.abs(intval(o.get('site-sidebar-width')));
    const primary = Math.abs(100 - secondary);
    const sep = o.get('header-main-sep');
    const sepColor = esc(o.get('header-main-sep-color'));
    const border = { 'border-bottom-width': cssValue(sep, 'px'), 'border-bottom-color': sepColor };
    let css =
      parseCss({ '.zn-header-break-point .main-header-bar': border }) +
      parseCss({ '.main-header-bar': border }, tablet('', 1));
    if (sidebarLayout(o, c) !== 'no-sidebar') {
      css += parseCss(
        {
          '#primary': { width: cssValue(primary, '%') },
          '#secondary': { width: cssValue(String(secondary), '%') },
        },
        tablet('', 1),
      );
    }
    const centered = {
      '-webkit-align-content': 'center',
      '-ms-flex-line-pack': 'center',
      'align-content': 'center',
      '-webkit-box-align': 'center',
      '-webkit-align-items': 'center',
      '-moz-box-align': 'center',
      '-ms-flex-align': 'center',
      'align-items': 'center',
    };
    const layouts =
      '.header-main-layout-1 .zn-flex.main-header-container, .header-main-layout-3 .zn-flex.main-header-container';
    if (o.get('submenu-below-header', true) === false) {
      css += parseCss({
        '.zn-flex': centered,
        '.main-header-bar': { padding: '1em 0' },
        '.zn-site-identity': { padding: '0' },
        [layouts]: centered,
      });
    } else {
      css += parseCss({
        '.main-header-menu .menu-item, #zenit-footer-menu .menu-item, .main-header-bar .zn-masthead-custom-menu-items':
          {
            '-js-display': 'flex',
            display: 'flex',
            '-webkit-box-pack': 'center',
            '-webkit-justify-content': 'center',
            '-moz-box-pack': 'center',
            '-ms-flex-pack': 'center',
            'justify-content': 'center',
            '-webkit-box-orient': 'vertical',
            '-webkit-box-direction': 'normal',
            '-webkit-flex-direction': 'column',
            '-moz-box-orient': 'vertical',
            '-moz-box-direction': 'normal',
            '-ms-flex-direction': 'column',
            'flex-direction': 'column',
          },
        '.main-header-menu > .menu-item > .menu-link, #zenit-footer-menu > .menu-item > .menu-link':
          {
            height: '100%',
            '-webkit-box-align': 'center',
            '-webkit-align-items': 'center',
            '-moz-box-align': 'center',
            '-ms-flex-align': 'center',
            'align-items': 'center',
            '-js-display': 'flex',
            display: 'flex',
          },
        '#zn-desktop-header .main-header-menu > .menu-item.menu-item-has-children > .menu-link .zn-header-navigation-arrow':
          { [`padding-${right}`]: '10px', [`margin-${right}`]: '-10px' },
      });
    }
    if (o.get('submenu-open-below-header', true) === false)
      css += parseCss({ [layouts]: centered });
    css += parseCss({
      '.zn-header-break-point .main-navigation ul .menu-item .menu-link .icon-arrow:first-of-type svg':
        {
          top: '.2em',
          'margin-top': '0px',
          [`margin-${left}`]: '0px',
          width: '.65em',
          transform: c.rtl
            ? 'translate(0, -2px) rotateZ(90deg)'
            : 'translate(0, -2px) rotateZ(270deg)',
        },
      '.zn-mobile-popup-content .zn-submenu-expanded > .zn-menu-toggle': {
        transform: 'rotateX(180deg)',
        'overflow-y': 'auto',
      },
    });
    return (
      css +
      parseCss(
        {
          '.zn-builder-menu .main-navigation > ul > li:last-child a': { [`margin-${right}`]: '0' },
        },
        tablet('', 1),
      )
    );
  },
};
