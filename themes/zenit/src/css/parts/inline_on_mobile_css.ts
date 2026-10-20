/**
 * Header menus kept inline on mobile: no borders, small toggles, submenus
 * opening as dropdowns beside their item.
 */
import type { Part } from './index.js';

const BP = '.zn-header-break-point .zn-mobile-header-wrap';
const FLEX = `${BP} .zn-flex.inline-on-mobile`;
const EXPANDED = `${FLEX} .menu-item.zn-submenu-expanded > .sub-menu`;
const rows = (tail: string) =>
  ['above', 'main', 'below']
    .map((r) => `${BP} .zn-${r}-header-wrap .main-header-bar-navigation .inline-on-mobile ${tail}`)
    .join(',');

/** Submenu rules repeated twice in the reference's list, as there. */
const SUBMENUS =
  `${FLEX}{flex-wrap: unset}` +
  `${EXPANDED} .menu-link{padding: .1em 1em}` +
  `${EXPANDED} > .menu-item .zn-menu-toggle::before{transform: rotate(-90deg)}` +
  `${EXPANDED} > .menu-item.zn-submenu-expanded .zn-menu-toggle::before{transform: rotate(-270deg)}` +
  `${FLEX} .menu-item > .sub-menu > .menu-item .menu-link:before{content: none}`;

export const part: Part = {
  name: 'inline_on_mobile_css',
  run(o, c) {
    let inline = false;
    for (let i = 1; i <= 10; i++) {
      if (o.get(`header-menu${i}-menu-stack-on-mobile`) === false) {
        inline = true;
        break;
      }
    }
    if (!inline) return '';
    // `end` is the side submenus open towards, `start` the other one.
    const [start, end] = c.rtl ? ['right', 'left'] : ['left', 'right'];
    const side = (toggle: boolean) =>
      `${FLEX} .menu-item.menu-item-has-children{margin-${end}: 10px}` +
      `${EXPANDED}{display: block;position: absolute;${end}: auto;${start}: 0}` +
      (toggle ? `${EXPANDED} .menu-item .zn-menu-toggle{padding: 0;${end}: 1em}` : '') +
      `${EXPANDED} > .menu-item > .sub-menu{${start}: 100%;${end}: auto}` +
      `${FLEX} .zn-menu-toggle{${end}: -15px}`;
    return (
      `${rows('.menu-item .menu-link')}{border: none}` +
      `${rows('.menu-item-has-children > .zn-menu-toggle::before')}{font-size: .6rem}` +
      SUBMENUS +
      SUBMENUS +
      '.zn-header-break-point .inline-on-mobile .sub-menu{width: 150px}' +
      side(true) +
      side(false)
    );
  },
};
