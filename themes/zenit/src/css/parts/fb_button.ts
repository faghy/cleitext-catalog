/**
 * The buttons of the footer: the shared button rules, then the alignment of
 * each one (the free theme has no footer button, so this prints nothing).
 */
import { isLoaded } from '../../core/builder.js';
import { mobile, parseCss, tablet } from '../../core/css.js';
import { at } from '../../core/php.js';
import { buttonCss, COUNTS } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_button',
  run(o) {
    let css = buttonCss(o, 'footer');
    let flag = false;
    for (let i = 1; i <= COUNTS.footer.button; i++) {
      if (!isLoaded(o, `button-${i}`, 'footer')) continue;
      flag = true;
      const selector = `.zn-footer-button-${i}[data-section="section-fb-button-${i}"]`;
      const align = o.get(`footer-button-${i}-alignment`);
      const rule = (d: string) => ({ [selector]: { 'justify-content': at(align, d) ?? '' } });
      css +=
        parseCss(rule('desktop')) +
        parseCss(rule('tablet'), '', tablet()) +
        parseCss(rule('mobile'), '', mobile());
    }
    if (!flag) return css;
    return (
      parseCss({
        '[data-section*="section-fb-button-"] .menu-link': { display: 'none' },
        '[CLASS*="zn-footer-button-"][data-section^="section-fb-button-"]': {
          'justify-content': 'center',
        },
        '.site-footer-focus-item[CLASS*="zn-footer-button-"]': { display: 'flex' },
      }) + css
    );
  },
};
