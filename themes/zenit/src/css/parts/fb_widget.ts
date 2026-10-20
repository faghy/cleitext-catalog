/**
 * The widget areas of the footer: the text alignment of each area, their
 * width, then the shared widget rules.
 */
import { isLoaded } from '../../core/builder.js';
import { mobile, parseCss, tablet } from '../../core/css.js';
import { at } from '../../core/php.js';
import { COUNTS, widgetCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_widget',
  run(o) {
    let css = '';
    for (let i = 1; i <= COUNTS.footer.widget; i++) {
      if (!isLoaded(o, `widget-${i}`, 'footer')) continue;
      const selector = `.footer-widget-area[data-section="sidebar-widgets-footer-widget-${i}"].footer-widget-area-inner`;
      const align = o.get(`footer-widget-alignment-${i}`);
      const rule = (d: string) => ({ [selector]: { 'text-align': at(align, d) ?? '' } });
      css +=
        parseCss(rule('desktop')) +
        parseCss(rule('tablet'), '', tablet()) +
        parseCss(rule('mobile'), '', mobile());
    }
    // Sites set up before the widgets got their own width keep the old flag.
    const raw = o.raw('support-footer-widget-right-margin');
    if (raw === undefined || raw === null) {
      css += parseCss({
        '.footer-widget-area.widget-area.site-footer-focus-item': { width: 'auto' },
        '.zn-footer-row-inline .footer-widget-area.widget-area.site-footer-focus-item': {
          width: '100%',
        },
      });
    }
    return css + widgetCss(o, 'footer');
  },
};
