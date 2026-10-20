/** The copyright element of the footer. */
import { isLoaded } from '../../core/builder.js';
import { mobile, parseCss, responsiveSpacing, tablet } from '../../core/css.js';
import { at } from '../../core/php.js';
import { typographyCss, visibilityCss } from '../base.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_copyright',
  run(o) {
    if (!isLoaded(o, 'copyright', 'footer')) return '';
    const section = 'section-footer-copyright';
    const selector = '.zn-footer-copyright.site-footer-focus-item ';
    const alignment = o.get('footer-copyright-alignment');
    const margin = o.get(`${section}-margin`);
    const box = (d: string) => ({
      'margin-top': responsiveSpacing(margin, 'top', d),
      'margin-bottom': responsiveSpacing(margin, 'bottom', d),
      'margin-left': responsiveSpacing(margin, 'left', d),
      'margin-right': responsiveSpacing(margin, 'right', d),
    });
    const css =
      parseCss({
        '.zn-footer-copyright': { 'text-align': at(alignment, 'desktop') ?? '' },
        [selector]: {
          color: o.get('footer-copyright-color', o.get('text-color')),
          ...box('desktop'),
        },
      }) +
      parseCss(
        {
          '.zn-footer-copyright': { 'text-align': at(alignment, 'tablet') ?? '' },
          [selector]: box('tablet'),
        },
        '',
        tablet(),
      ) +
      parseCss(
        {
          '.zn-footer-copyright': { 'text-align': at(alignment, 'mobile') ?? '' },
          [selector]: box('mobile'),
        },
        '',
        mobile(),
      );
    return (
      css +
      typographyCss(o, section, selector) +
      visibilityCss(o, section, '.zn-footer-copyright.zn-builder-layout-element')
    );
  },
};
