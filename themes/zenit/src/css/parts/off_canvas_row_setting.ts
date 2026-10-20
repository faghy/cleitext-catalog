/**
 * The off-canvas area opened by the mobile toggle: its layout (flyout panel
 * or dropdown), background, close button color, content alignment, the
 * spacing between its elements and its padding per device.
 */
import { isLoaded } from '../../core/builder.js';
import {
  backgroundObj,
  cssValue,
  mobile,
  parseCss,
  responsiveSpacing,
  tablet,
} from '../../core/css.js';
import type { Rules } from '../../core/css.js';
import { empty, esc, intval, str } from '../../core/php.js';
import type { Part } from './index.js';

const OFF_CANVAS = [
  '.zn-off-canvas-active body.zn-main-header-nav-open {overflow: hidden;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-overlay {background-color: rgba(0,0,0,0.4);position: fixed;top: 0;right: 0;bottom: 0;left: 0;visibility: hidden;opacity: 0;transition: opacity 0.2s ease-in-out;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-header {-js-display: flex;display: flex;justify-content: flex-end;min-height: calc( 1.2em + 24px);flex-shrink: 0;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-header .menu-toggle-close {background: transparent;border: 0;font-size: 24px;line-height: 1;padding: .6em;color: inherit;-js-display: flex;display: flex;box-shadow: none;}',
  '.zn-mobile-popup-drawer.zn-mobile-popup-full-width .zn-mobile-popup-inner {max-width: none;transition: transform 0s ease-in,opacity 0.2s ease-in;}',
  '.zn-mobile-popup-drawer.active {left: 0;opacity: 1;right: 0;z-index: 100000;transition: opacity 0.25s ease-out;}',
  '.zn-mobile-popup-drawer.active .zn-mobile-popup-overlay {opacity: 1;cursor: pointer;visibility: visible;}',
  'body.admin-bar .zn-mobile-popup-drawer,body.admin-bar .zn-mobile-popup-drawer .zn-mobile-popup-inner {top: 32px;}',
  'body.admin-bar.zn-primary-sticky-header-active .zn-mobile-popup-drawer,body.admin-bar.zn-primary-sticky-header-active .zn-mobile-popup-drawer .zn-mobile-popup-inner{top: 0px;}',
  '@media (max-width: 782px) {body.admin-bar .zn-mobile-popup-drawer,body.admin-bar .zn-mobile-popup-drawer .zn-mobile-popup-inner {top: 46px;}}',
  '.zn-mobile-popup-content > *,.zn-desktop-popup-content > *{padding: 10px 0;height: auto;}',
  '.zn-mobile-popup-content > *:first-child,.zn-desktop-popup-content > *:first-child{padding-top: 10px;}',
  '.zn-mobile-popup-content > .zn-builder-menu,.zn-desktop-popup-content > .zn-builder-menu{padding-top: 0;}',
  '.zn-mobile-popup-content > *:last-child,.zn-desktop-popup-content > *:last-child {padding-bottom: 0;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-icon,.zn-mobile-popup-drawer .main-header-bar-navigation .menu-item-has-children .sub-menu,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-icon {display: none;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.zn-inline-search label,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.zn-inline-search label {width: 100%;}',
  '.zn-mobile-popup-content .zn-builder-menu-mobile .main-header-menu,.zn-mobile-popup-content .zn-builder-menu-mobile .main-header-menu .sub-menu {background-color: transparent;}',
  '.zn-mobile-popup-content .zn-icon svg {height: .85em;width: .95em;margin-top: 15px;}',
  '.zn-mobile-popup-content .zn-icon.icon-search svg {margin-top: 0;}',
  '.zn-desktop .zn-desktop-popup-content .zenit-menu-animation-slide-up > .menu-item > .sub-menu,.zn-desktop .zn-desktop-popup-content .zenit-menu-animation-slide-up > .menu-item .menu-item > .sub-menu,.zn-desktop .zn-desktop-popup-content .zenit-menu-animation-slide-down > .menu-item > .sub-menu,.zn-desktop .zn-desktop-popup-content .zenit-menu-animation-slide-down > .menu-item .menu-item > .sub-menu,.zn-desktop .zn-desktop-popup-content .zenit-menu-animation-fade > .menu-item > .sub-menu,.zn-mobile-popup-drawer.show,.zn-desktop .zn-desktop-popup-content .zenit-menu-animation-fade > .menu-item .menu-item > .sub-menu{opacity: 1;visibility: visible;}',
].join('');

const OFF_CANVAS_RTL = [
  '.zn-mobile-popup-drawer {position: fixed;top: 0;bottom: 0;right: -99999rem;left: 99999rem;transition: opacity 0.25s ease-in,right 0s 0.25s,left 0s 0.25s;opacity: 0;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-inner {width: 100%;transform: translateX(-115%);max-width: 90%;left: 0;top: 0;background: #fafafa;color: #3a3a3a;bottom: 0;opacity: 0;position: fixed;box-shadow: 0 0 2rem 0 rgba(0,0,0,0.1);-js-display: flex;display: flex;flex-direction: column;transition: transform 0.2s ease-in,opacity 0.2s ease-in;overflow-y:auto;overflow-x:hidden;}',
  '.zn-mobile-popup-drawer.zn-mobile-popup-left .zn-mobile-popup-inner {transform: translateX(-115%);left: auto;right: 0;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-popup-drawer .main-header-bar-navigation ul .menu-item .sub-menu .menu-link {padding-right: 30px;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-popup-drawer .main-header-bar-navigation .sub-menu .menu-item .menu-item .menu-link {padding-right: 40px;}',
  '.zn-mobile-popup-drawer .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle {left: calc( 20px - 0.907em);}',
  '.zn-mobile-popup-drawer.content-align-flex-end .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle {right: calc( 20px - 0.907em);width: fit-content;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon,.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.slide-search,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.slide-search {width: 100%;position: relative;display: block;left: auto;transform: none;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.slide-search .search-form,.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon .search-form,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.slide-search .search-form,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon .search-form {left: 0;visibility: visible;opacity: 1;position: relative;top: auto;transform: none;padding: 0;display: block;overflow: hidden;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon .search-field,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon .search-field {width: 100%;padding-left: 5.5em;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon .search-submit,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon .search-submit {display: block;position: absolute;height: 100%;top: 0;left: 0;padding: 0 1em;border-radius: 0;}',
].join('');

const OFF_CANVAS_LTR = [
  '.zn-mobile-popup-drawer {position: fixed;top: 0;bottom: 0;left: -99999rem;right: 99999rem;transition: opacity 0.25s ease-in,left 0s 0.25s,right 0s 0.25s;opacity: 0;visibility: hidden;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-inner {width: 100%;transform: translateX(100%);max-width: 90%;right: 0;top: 0;background: #fafafa;color: #3a3a3a;bottom: 0;opacity: 0;position: fixed;box-shadow: 0 0 2rem 0 rgba(0,0,0,0.1);-js-display: flex;display: flex;flex-direction: column;transition: transform 0.2s ease-in,opacity 0.2s ease-in;overflow-y:auto;overflow-x:hidden;}',
  '.zn-mobile-popup-drawer.zn-mobile-popup-left .zn-mobile-popup-inner {transform: translateX(-100%);right: auto;left: 0;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-popup-drawer .main-header-bar-navigation ul .menu-item .sub-menu .menu-link {padding-left: 30px;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-popup-drawer .main-header-bar-navigation .sub-menu .menu-item .menu-item .menu-link {padding-left: 40px;}',
  '.zn-mobile-popup-drawer .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle {right: calc( 20px - 0.907em);}',
  '.zn-mobile-popup-drawer.content-align-flex-end .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle {left: calc( 20px - 0.907em);width: fit-content;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon,.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.slide-search,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.slide-search {width: 100%;position: relative;display: block;right: auto;transform: none;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.slide-search .search-form,.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon .search-form,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.slide-search .search-form,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon .search-form {right: 0;visibility: visible;opacity: 1;position: relative;top: auto;transform: none;padding: 0;display: block;overflow: hidden;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon .search-field,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon .search-field {width: 100%;padding-right: 5.5em;}',
  '.zn-mobile-popup-drawer .zn-mobile-popup-content .zn-search-menu-icon .search-submit,.zn-mobile-popup-drawer .zn-desktop-popup-content .zn-search-menu-icon .search-submit {display: block;position: absolute;height: 100%;top: 0;right: 0;padding: 0 1em;border-radius: 0;}',
].join('');

const OFF_CANVAS_END = [
  '.zn-mobile-popup-drawer.active .zn-mobile-popup-inner {opacity: 1;visibility: visible;transform: translateX(0%);}',
].join('');

const DROPDOWN = [
  '.zn-mobile-header-content > *,.zn-desktop-header-content > * {padding: 10px 0;height: auto;}',
  '.zn-mobile-header-content > *:first-child,.zn-desktop-header-content > *:first-child {padding-top: 10px;}',
  '.zn-mobile-header-content > .zn-builder-menu,.zn-desktop-header-content > .zn-builder-menu {padding-top: 0;}',
  '.zn-mobile-header-content > *:last-child,.zn-desktop-header-content > *:last-child {padding-bottom: 0;}',
  '.zn-mobile-header-content .zn-search-menu-icon.zn-inline-search label,.zn-desktop-header-content .zn-search-menu-icon.zn-inline-search label {width: 100%;}',
  '.zn-desktop-header-content .main-header-bar-navigation .zn-submenu-expanded > .zn-menu-toggle::before {transform: rotateX(180deg);}',
  '#zn-desktop-header .zn-desktop-header-content,.zn-mobile-header-content .zn-search-icon,.zn-desktop-header-content .zn-search-icon,.zn-mobile-header-wrap .zn-mobile-header-content,.zn-main-header-nav-open.zn-popup-nav-open .zn-mobile-header-wrap .zn-mobile-header-content,.zn-main-header-nav-open.zn-popup-nav-open .zn-desktop-header-content {display: none;}',
  '.zn-main-header-nav-open.zn-header-break-point #zn-desktop-header .zn-desktop-header-content,.zn-main-header-nav-open.zn-header-break-point .zn-mobile-header-wrap .zn-mobile-header-content {display: block;}',
  '.zn-desktop .zn-desktop-header-content .zenit-menu-animation-slide-up > .menu-item > .sub-menu,.zn-desktop .zn-desktop-header-content .zenit-menu-animation-slide-up > .menu-item .menu-item > .sub-menu,.zn-desktop .zn-desktop-header-content .zenit-menu-animation-slide-down > .menu-item > .sub-menu,.zn-desktop .zn-desktop-header-content .zenit-menu-animation-slide-down > .menu-item .menu-item > .sub-menu,.zn-desktop .zn-desktop-header-content .zenit-menu-animation-fade > .menu-item > .sub-menu,.zn-desktop .zn-desktop-header-content .zenit-menu-animation-fade > .menu-item .menu-item > .sub-menu {opacity: 1;visibility: visible;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-header-wrap .zn-mobile-header-content .main-header-bar-navigation {width: unset;margin: unset;}',
].join('');

const DROPDOWN_RTL = [
  '.zn-mobile-header-content.content-align-flex-end .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle,.zn-desktop-header-content.content-align-flex-end .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle {right: calc( 20px - 0.907em);left: auto;}',
  '.zn-mobile-header-content .zn-search-menu-icon,.zn-mobile-header-content .zn-search-menu-icon.slide-search,.zn-desktop-header-content .zn-search-menu-icon,.zn-desktop-header-content .zn-search-menu-icon.slide-search {width: 100%;position: relative;display: block;left: auto;transform: none;}',
  '.zn-mobile-header-content .zn-search-menu-icon.slide-search .search-form,.zn-mobile-header-content .zn-search-menu-icon .search-form,.zn-desktop-header-content .zn-search-menu-icon.slide-search .search-form,.zn-desktop-header-content .zn-search-menu-icon .search-form {left: 0;visibility: visible;opacity: 1;position: relative;top: auto;transform: none;padding: 0;display: block;overflow: hidden;}',
  '.zn-mobile-header-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-mobile-header-content .zn-search-menu-icon .search-field,.zn-desktop-header-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-desktop-header-content .zn-search-menu-icon .search-field {width: 100%;padding-left: 5.5em;}',
  '.zn-mobile-header-content .zn-search-menu-icon .search-submit,.zn-desktop-header-content .zn-search-menu-icon .search-submit {display: block;position: absolute;height: 100%;top: 0;left: 0;padding: 0 1em;border-radius: 0;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-header-wrap .zn-mobile-header-content .main-header-bar-navigation ul .sub-menu .menu-link {padding-right: 30px;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-header-wrap .zn-mobile-header-content .main-header-bar-navigation .sub-menu .menu-item .menu-item .menu-link {padding-right: 40px;}',
].join('');

const DROPDOWN_LTR = [
  '.zn-mobile-header-content.content-align-flex-end .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle,.zn-desktop-header-content.content-align-flex-end .main-header-bar-navigation .menu-item-has-children > .zn-menu-toggle {left: calc( 20px - 0.907em);right: auto;}',
  '.zn-mobile-header-content .zn-search-menu-icon,.zn-mobile-header-content .zn-search-menu-icon.slide-search,.zn-desktop-header-content .zn-search-menu-icon,.zn-desktop-header-content .zn-search-menu-icon.slide-search {width: 100%;position: relative;display: block;right: auto;transform: none;}',
  '.zn-mobile-header-content .zn-search-menu-icon.slide-search .search-form,.zn-mobile-header-content .zn-search-menu-icon .search-form,.zn-desktop-header-content .zn-search-menu-icon.slide-search .search-form,.zn-desktop-header-content .zn-search-menu-icon .search-form {right: 0;visibility: visible;opacity: 1;position: relative;top: auto;transform: none;padding: 0;display: block;overflow: hidden;}',
  '.zn-mobile-header-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-mobile-header-content .zn-search-menu-icon .search-field,.zn-desktop-header-content .zn-search-menu-icon.zn-inline-search .search-field,.zn-desktop-header-content .zn-search-menu-icon .search-field {width: 100%;padding-right: 5.5em;}',
  '.zn-mobile-header-content .zn-search-menu-icon .search-submit,.zn-desktop-header-content .zn-search-menu-icon .search-submit {display: block;position: absolute;height: 100%;top: 0;right: 0;padding: 0 1em;border-radius: 0;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-header-wrap .zn-mobile-header-content .main-header-bar-navigation ul .sub-menu .menu-link {padding-left: 30px;}',
  '.zn-hfb-header.zn-default-menu-enable.zn-header-break-point .zn-mobile-header-wrap .zn-mobile-header-content .main-header-bar-navigation .sub-menu .menu-item .menu-item .menu-link {padding-left: 40px;}',
].join('');

/** The fixed rules of the flyout panel (side or full width). */
const offCanvasCss = (rtl: boolean): string =>
  OFF_CANVAS + (rtl ? OFF_CANVAS_RTL : OFF_CANVAS_LTR) + OFF_CANVAS_END;

/** The fixed rules of the dropdown under the header. */
const dropdownCss = (rtl: boolean): string => DROPDOWN + (rtl ? DROPDOWN_RTL : DROPDOWN_LTR);

export const part: Part = {
  name: 'off_canvas_row_setting',
  run(o, c) {
    const selector = '.zn-mobile-popup-drawer.active';
    if (!isLoaded(o, 'mobile-trigger', 'header')) return '';
    const background = o.get('off-canvas-background');
    const closeColor = o.get('off-canvas-close-color');
    const alignment = str(o.get('header-offcanvas-content-alignment', 'flex-start'));
    const padding = o.get('off-canvas-padding');
    const innerSpacing = intval(o.get('off-canvas-inner-spacing'));
    const type = o.get('mobile-header-type');
    const moveBody = o.get('off-canvas-move-body');
    let menuAlignment = 'center';
    if (alignment === 'flex-start') menuAlignment = c.rtl ? 'right' : 'left';
    else if (alignment === 'flex-end') menuAlignment = c.rtl ? 'left' : 'right';

    let css = '';
    if (type === 'off-canvas' || type === 'full-width') css += offCanvasCss(c.rtl);
    if (type === 'dropdown') css += dropdownCss(c.rtl);

    const content =
      '.zn-mobile-popup-drawer.active .zn-desktop-popup-content, .zn-mobile-popup-drawer.active .zn-mobile-popup-content';
    const box = (d: string) => ({
      'padding-top': responsiveSpacing(padding, 'top', d),
      'padding-bottom': responsiveSpacing(padding, 'bottom', d),
      'padding-left': responsiveSpacing(padding, 'left', d),
      'padding-right': responsiveSpacing(padding, 'right', d),
    });
    const rules: Rules = {
      [`${selector} .zn-mobile-popup-inner`]: backgroundObj(o, background),
      '.zn-mobile-header-wrap .zn-mobile-header-content, .zn-desktop-header-content': backgroundObj(
        o,
        background,
      ),
      [content]: box('desktop'),
      '.zn-mobile-popup-content > *, .zn-mobile-header-content > *, .zn-desktop-popup-content > *, .zn-desktop-header-content > *':
        {
          'padding-top': cssValue(innerSpacing, 'px'),
          'padding-bottom': cssValue(innerSpacing, 'px'),
        },
      [`.content-align-${esc(alignment)} .zn-builder-layout-element`]: {
        'justify-content': esc(alignment),
      },
      [`.content-align-${esc(alignment)} .main-header-menu`]: { 'text-align': esc(menuAlignment) },
    };
    if (type === 'dropdown' && empty(moveBody)) {
      rules['.zn-desktop-header-content, .zn-mobile-header-content'] = {
        position: 'absolute',
        width: '100%',
      };
    }
    if (c.rtl) {
      rules['.rtl #zn-mobile-popup-wrapper #zn-mobile-popup'] = { 'pointer-events': 'none' };
      rules['.rtl #zn-mobile-popup-wrapper #zn-mobile-popup.active'] = {
        'pointer-events': 'unset',
      };
    }
    rules[`${selector} .menu-toggle-close`] = { color: closeColor };

    return (
      css +
      parseCss(rules) +
      parseCss({ [content]: box('tablet') }, '', tablet()) +
      parseCss({ [content]: box('mobile') }, '', mobile())
    );
  },
};
