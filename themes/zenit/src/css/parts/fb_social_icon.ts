/** The social icons of the footer. */
import { socialCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'fb_social_icon',
  run: (o, c) => socialCss(o, 'footer', c.rtl),
};
