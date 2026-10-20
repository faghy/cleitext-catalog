/**
 * The HTML blocks of the footer: the shared HTML rules, then the text
 * alignment of each block (mirrored for right-to-left languages).
 */
import { isLoaded } from '../../core/builder.js';
import { mobile, parseCss, tablet } from '../../core/css.js';
import { at, str } from '../../core/php.js';
import { COUNTS, htmlCss } from '../lib/elements.js';
import type { Ctx } from '../../core/context.js';
import type { Options } from '../../core/options.js';
import type { Part } from './index.js';

/** Every block's alignment, after the CSS before it. */
function body(o: Options, c: Ctx): string {
  let css = htmlCss(o, 'footer');
  for (let i = 1; i <= COUNTS.footer.html; i++) {
    if (!isLoaded(o, `html-${i}`, 'footer')) continue;
    const selector = `.footer-widget-area[data-section="section-fb-html-${i}"] .zn-builder-html-element`;
    const align = o.get(`footer-html-${i}-alignment`);
    const side = (d: string): unknown => {
      const v = at(align, d) ?? '';
      if (!c.rtl) return v;
      return str(v) === 'left' ? 'right' : str(v) === 'right' ? 'left' : v;
    };
    const rule = (d: string) => ({ [selector]: { 'text-align': side(d) } });
    css +=
      parseCss(rule('desktop')) +
      parseCss(rule('tablet'), '', tablet()) +
      parseCss(rule('mobile'), '', mobile());
  }
  return css;
}

/** The default alignment, put at the very start of the page's CSS. */
function lead(o: Options): string {
  const used = Array.from({ length: COUNTS.footer.html }, (_, i) => i + 1).some((i) =>
    isLoaded(o, `html-${i}`, 'footer'),
  );
  return used
    ? parseCss({
        '.footer-widget-area[data-section^="section-fb-html-"] .zn-builder-html-element': {
          'text-align': 'center',
        },
      })
    : '';
}

export const part: Part = {
  name: 'fb_html',
  lead,
  rest: body,
  run: (o, c) => lead(o) + body(o, c),
};
