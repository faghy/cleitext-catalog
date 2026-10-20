/** Shows the mobile logo instead of the site logo below the breakpoint, when one is set. */
import { str } from '../../core/php.js';
import { trimCss } from '../lib/header-rows.js';
import type { Part } from './index.js';

const CSS =
  '.zn-header-break-point .zn-has-mobile-header-logo .custom-logo-link, .zn-header-break-point .wp-block-site-logo .custom-logo-link, .zn-desktop .wp-block-site-logo .custom-mobile-logo-link {display: none;}' +
  '.zn-header-break-point .zn-has-mobile-header-logo .custom-mobile-logo-link {display: inline-block;}' +
  '.zn-header-break-point.zn-mobile-inherit-site-logo .zn-has-mobile-header-logo .custom-logo-link, .zn-header-break-point.zn-mobile-inherit-site-logo .zn-has-mobile-header-logo .zenit-logo-svg {display: block;}';

export const part: Part = {
  name: 'builder_mobile_header_logo_css',
  run(o) {
    const different = o.get('different-mobile-logo');
    // A different mobile logo is on when the option is 1, '1' or true.
    const on = different === true || str(different) === '1';
    return o.get('mobile-header-logo') !== '' && on ? trimCss(CSS) : '';
  },
};
