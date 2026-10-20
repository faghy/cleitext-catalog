/** The base color of headings h1–h6 and of entry title links. */
import { parseCss } from '../../core/css.js';
import { empty, esc } from '../../core/php.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'heading_colors_section',
  run(o) {
    const color = o.get('heading-base-color');
    if (empty(color)) return '';
    return parseCss({
      'h1, h2, h3, h4, h5, h6, .entry-content :where(h1, h2, h3, h4, h5, h6)': {
        color: esc(color),
      },
      '.entry-title a': { color: esc(color) },
    });
  },
};
