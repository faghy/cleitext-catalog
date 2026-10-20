/** The HTML blocks of the header. */
import { htmlCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'hb_html',
  run: (o) => htmlCss(o, 'header'),
};
