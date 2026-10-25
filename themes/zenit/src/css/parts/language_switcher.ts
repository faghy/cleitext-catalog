/** The language switcher of the header and footer (Zenit's own, 1.2.0). */
import { languageSwitcherCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'language_switcher',
  run: (o, c) => languageSwitcherCss(o, c.rtl),
};
