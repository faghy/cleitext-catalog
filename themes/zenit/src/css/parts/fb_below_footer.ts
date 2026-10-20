/** The below footer row: background, height, top border, columns, spacing, visibility. */
import { footerRowCss, footerRowHasItems } from '../lib/footer-global.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_below_footer',
  run(o) {
    if (!footerRowHasItems(o, 'below')) return '';
    return footerRowCss(o, {
      row: 'below',
      prefix: 'hbb',
      height: 'hbb-footer-height',
      separator: 'hbb-footer-separator',
      separatorColor: 'hbb-footer-top-border-color',
      padding: '20px',
    });
  },
};
