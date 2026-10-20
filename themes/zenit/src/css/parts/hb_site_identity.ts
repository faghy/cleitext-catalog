/** The logo element of the header: its margin per device and its visibility. */
import { isLoaded } from '../../core/builder.js';
import { mobile, parseCss, responsiveSpacing, tablet } from '../../core/css.js';
import { visibilityCss } from '../base.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'hb_site_identity',
  run(o) {
    if (!isLoaded(o, 'logo', 'header')) return '';
    const section = 'title_tagline';
    const selector = '.zn-builder-layout-element .zn-site-identity';
    const margin = o.get(`${section}-margin`);
    const box = (d: string) => ({
      [selector]: {
        'margin-top': responsiveSpacing(margin, 'top', d),
        'margin-bottom': responsiveSpacing(margin, 'bottom', d),
        'margin-left': responsiveSpacing(margin, 'left', d),
        'margin-right': responsiveSpacing(margin, 'right', d),
      },
    });
    return (
      parseCss(box('desktop')) +
      parseCss(box('tablet'), '', tablet()) +
      parseCss(box('mobile'), '', mobile()) +
      visibilityCss(o, section, '.zn-builder-layout-element[data-section="title_tagline"]')
    );
  },
};
