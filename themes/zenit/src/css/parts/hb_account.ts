/**
 * The account element of the header: icon and avatar sizes per device, icon
 * and text colors, text font size, margin and visibility.
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
import { at, empty, esc, isset } from '../../core/php.js';
import { typographyCss, visibilityCss } from '../base.js';
import type { Part } from './index.js';

/** A size of a device, 20 when not set. */
function sizeOf(size: unknown, d: string): unknown {
  return isset(size, d) && !empty(at(size, d)) ? at(size, d) : 20;
}

export const part: Part = {
  name: 'hb_account',
  run(o) {
    if (!isLoaded(o, 'account', 'header')) return '';
    const section = 'section-header-account';
    const s = '.zn-header-account-wrap';
    const icon = o.get('header-account-icon-size');
    const image = o.get('header-account-image-width');
    const margin = o.get('header-account-margin');
    const iconColor = esc(o.get('header-account-icon-color'));
    const svg = `${s} .zn-header-account-type-icon .zn-hfb-svg-iconset svg`;
    const paths = (prefix: string) =>
      `${prefix}${svg} path:not( .zn-hf-account-unfill ), ${prefix}${svg} circle`;
    const sizes = (d: string): Rules => ({
      [svg]: { height: cssValue(sizeOf(icon, d), 'px'), width: cssValue(sizeOf(icon, d), 'px') },
      [`${s} .zn-header-account-type-avatar .avatar`]: { width: cssValue(sizeOf(image, d), 'px') },
    });
    const box = (d: string): Rules => ({
      [s]: {
        'margin-top': responsiveSpacing(margin, 'top', d),
        'margin-bottom': responsiveSpacing(margin, 'bottom', d),
        'margin-left': responsiveSpacing(margin, 'left', d),
        'margin-right': responsiveSpacing(margin, 'right', d),
      },
    });
    const desktop: Rules = {
      '.zn-header-account-type-icon': {
        '-js-display': 'inline-flex',
        display: 'inline-flex',
        'align-self': 'center',
        'vertical-align': 'middle',
      },
      '.zn-header-account-type-avatar .avatar': {
        display: 'inline',
        'border-radius': '100%',
        'max-width': '100%',
      },
      '.as.site-header-focus-item.zn-header-account:hover > .customize-partial-edit-shortcut': {
        opacity: '0',
      },
      '.site-header-focus-item.zn-header-account:hover > * > .customize-partial-edit-shortcut': {
        opacity: '1',
      },
      [paths('')]: { fill: iconColor },
      [paths('.zn-mobile-popup-content ')]: { fill: iconColor },
      ...sizes('desktop'),
      [`${s} .zn-header-account-text`]: { color: esc(o.get('header-account-type-text-color')) },
      ...box('desktop'),
    };
    return (
      parseCss(desktop) +
      parseCss({ ...sizes('tablet'), ...box('tablet') }, '', tablet()) +
      parseCss({ ...sizes('mobile'), ...box('mobile') }, '', mobile()) +
      typographyCss(o, section, `${s} .zn-header-account-text`) +
      visibilityCss(o, section, s)
    );
  },
};
