/**
 * The footer's own background and spacing, then the primary footer row:
 * background, height, top border, columns, spacing, visibility.
 */
import { mobile, parseCss, responsiveBackgroundObj, tablet } from '../../core/css.js';
import { marginPaddingCss } from '../base.js';
import { footerRowCss, footerRowHasItems } from '../lib/footer-global.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_primary_footer',
  run(o) {
    const footerBg = o.get('footer-bg-obj-responsive');
    const bg = (d: string) => ({ '.site-footer': responsiveBackgroundObj(o, footerBg, d) });
    const css =
      parseCss(bg('desktop')) +
      marginPaddingCss(o, 'section-footer-builder-layout', '.zn-hfb-header .site-footer') +
      parseCss(bg('tablet'), '', tablet()) +
      parseCss(bg('mobile'), '', mobile());
    if (!footerRowHasItems(o, 'primary')) return css;
    return (
      css +
      footerRowCss(o, {
        row: 'primary',
        prefix: 'hb',
        height: 'hb-primary-footer-height',
        separator: 'hb-footer-main-sep',
        separatorColor: 'hb-footer-main-sep-color',
        padding: '45px',
        footerBg,
      })
    );
  },
};
