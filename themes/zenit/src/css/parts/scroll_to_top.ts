/** The scroll-to-top button's colors, icon size and corner radius per device. */
import { cssValue, mobile, parseCss, responsiveSpacing, tablet } from '../../core/css.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'scroll_to_top',
  run(o, c) {
    if (o.get('scroll-to-top-enable', true) !== true) return '';
    const radius = o.get('scroll-to-top-icon-radius-fields');
    const corners = (d: string) => ({
      'border-top-left-radius': responsiveSpacing(radius, 'top', d),
      'border-top-right-radius': responsiveSpacing(radius, 'right', d),
      'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
      'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
    });
    let css =
      parseCss({
        '#zn-scroll-top': {
          color: o.get('scroll-to-top-icon-color'),
          'background-color': o.get('scroll-to-top-icon-bg-color', o.get('link-color')),
          'font-size': cssValue(o.get('scroll-to-top-icon-size', 15), 'px'),
          ...corners('desktop'),
        },
        '#zn-scroll-top:hover': {
          color: o.get('scroll-to-top-icon-h-color'),
          'background-color': o.get('scroll-to-top-icon-h-bg-color'),
        },
      }) +
      parseCss({ '#zn-scroll-top': corners('tablet') }, '', tablet()) +
      parseCss({ '#zn-scroll-top': corners('mobile') }, '', mobile());
    if (c.rtl)
      css += parseCss({ '#zn-scroll-top .zn-icon.icon-arrow svg': { 'margin-right': '0px' } });
    if (o.get('can-update-zenit-icons-svg', true) === false) {
      css += parseCss({
        '.zn-scroll-top-icon::before': {
          content: '"\\e900"',
          'font-family': 'inherit',
          'text-decoration': 'inherit',
        },
        '.zn-scroll-top-icon': { transform: 'rotate(180deg)' },
      });
    }
    return (
      css + parseCss({ '#zn-scroll-top .zn-icon.icon-arrow svg': { width: '1em' } }, '', tablet())
    );
  },
};
