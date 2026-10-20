/** The buttons of the header. */
import { buttonCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'hb_button',
  run: (o) => buttonCss(o, 'header'),
};
