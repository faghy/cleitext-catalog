/** The social icons of the header. */
import { socialCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'hb_social_icon',
  run: (o, c) => socialCss(o, 'header', c.rtl),
};
