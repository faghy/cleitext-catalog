/** The above footer row: background, height, top border, columns, spacing, visibility. */
import { footerRowCss, footerRowHasItems } from '../lib/footer-global.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_above_footer',
  run(o) {
    if (!footerRowHasItems(o, 'above')) return '';
    return footerRowCss(o, {
      row: 'above',
      prefix: 'hba',
      height: 'hba-footer-height',
      separator: 'hba-footer-separator',
      separatorColor: 'hba-footer-top-border-color',
      padding: '20px',
    });
  },
};
