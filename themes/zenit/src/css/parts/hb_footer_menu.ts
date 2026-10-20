/**
 * The footer menu: alignment and layout per device, link colors and
 * backgrounds (normal, hover, current), font size, link spacing, margin,
 * visibility.
 */
import { isLoaded } from '../../core/builder.js';
import {
  cssValue,
  fontCssValue,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Ctx } from '../../core/context.js';
import { at, empty, isset, str } from '../../core/php.js';
import { visibilityCss } from '../base.js';
import { trimCss } from '../lib/footer-global.js';
import type { Part } from './index.js';

/** Fixed rules of the footer menu: vertical grid, horizontal spacing, no outer padding. */
function staticCss(c: Ctx): string {
  const [first, last] = c.rtl
    ? ['padding-right', 'padding-left']
    : ['padding-left', 'padding-right'];
  return trimCss(
    '.footer-nav-wrap .zenit-footer-vertical-menu {display: grid;}' +
      '@media (min-width: 769px) {.footer-nav-wrap .zenit-footer-horizontal-menu li {margin: 0;}' +
      '.footer-nav-wrap .zenit-footer-horizontal-menu a {padding: 0 0.5em;}}' +
      '@media (min-width: 769px) {' +
      `.footer-nav-wrap .zenit-footer-horizontal-menu li:first-child a {${first}: 0;}` +
      `.footer-nav-wrap .zenit-footer-horizontal-menu li:last-child a {${last}: 0;}}`,
  );
}

export const part: Part = {
  name: 'hb_footer_menu',
  run(o, c) {
    if (!isLoaded(o, 'menu', 'footer')) return '';
    const section = 'section-footer-menu';
    const selector = '#zenit-footer-menu';
    const area = '.footer-widget-area[data-section="section-footer-menu"]';
    const pick = (key: string) => {
      const v = o.get(key);
      return (d: string) => (isset(v, d) ? at(v, d) : '');
    };
    const color = pick('footer-menu-color-responsive');
    const bg = o.get('footer-menu-bg-obj-responsive');
    const hColor = pick('footer-menu-h-color-responsive');
    const hBg = pick('footer-menu-h-bg-color-responsive');
    const aColor = pick('footer-menu-a-color-responsive');
    const aBg = pick('footer-menu-a-bg-color-responsive');
    const align = pick('footer-menu-alignment');
    const size = o.get('footer-menu-font-size');
    const sizeOf = (d: string) => (isset(size, d) ? at(size, d) : '');
    const sizeUnit = (d: string) => (isset(size, `${d}-unit`) ? str(at(size, `${d}-unit`)) : '');
    const spacing = o.get('footer-main-menu-spacing');
    const space = (d: string, side: string) =>
      isset(spacing, d, side) ? at(spacing, d, side) : '';
    const spaceUnit = (d: string) =>
      isset(spacing, `${d}-unit`) && !empty(at(spacing, `${d}-unit`))
        ? str(at(spacing, `${d}-unit`))
        : '';
    const margin = o.get(`${section}-margin`);

    const link = (d: string) => ({
      color: color(d),
      'font-size': fontCssValue(o, sizeOf(d), sizeUnit(d)),
      'padding-top': cssValue(space(d, 'top'), spaceUnit(d)),
      'padding-bottom': cssValue(space(d, 'bottom'), spaceUnit(d)),
      'padding-left': cssValue(space(d, 'left'), spaceUnit(d)),
      'padding-right': cssValue(space(d, 'right'), spaceUnit(d)),
    });
    const list = (d: string) => ({
      'margin-top': responsiveSpacing(margin, 'top', d),
      'margin-bottom': responsiveSpacing(margin, 'bottom', d),
      'margin-left': responsiveSpacing(margin, 'left', d),
      'margin-right': responsiveSpacing(margin, 'right', d),
      ...(responsiveBackgroundObj(o, bg, d) ?? {}),
    });
    const states = (d: string) => ({
      [`${selector} .menu-item:hover > a`]: { color: hColor(d), background: hBg(d) },
      [`${selector} .menu-item.current-menu-item > a`]: { color: aColor(d), background: aBg(d) },
    });
    const small = (d: string) => ({
      [`${area} .zenit-footer-${d}-horizontal-menu`]: {
        'justify-content': align(d),
        display: 'flex',
      },
      [`${area} .zenit-footer-${d}-vertical-menu`]: {
        display: 'grid',
        'justify-content': align(d),
      },
      [`${area} .zenit-footer-${d}-vertical-menu .menu-item`]: { 'align-items': align(d) },
      [`${selector} .menu-item > a`]: link(d),
      ...states(d),
      [selector]: list(d),
    });

    const desktop = {
      [`${area} .zenit-footer-horizontal-menu`]: { 'justify-content': align('desktop') },
      [`${area} .zenit-footer-vertical-menu .menu-item`]: { 'align-items': align('desktop') },
      [`${selector} .menu-item > a`]: link('desktop'),
      ...states('desktop'),
      [selector]: list('desktop'),
    };
    // On mobile the menu's own rule comes first (its key is set twice there).
    const mobileRules: Rules = { [selector]: {} };
    Object.assign(mobileRules, small('mobile'));
    return (
      staticCss(c) +
      parseCss(desktop) +
      parseCss(small('tablet'), '', tablet()) +
      parseCss(mobileRules, '', mobile()) +
      visibilityCss(o, section, area, 'block')
    );
  },
};
