/** The global border color as a custom property. */
import { str } from '../../core/php.js';
import { trimCss } from '../lib/footer-global.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'palette_global_border_compatibility',
  run(o) {
    return trimCss(`:root {--zn-border-color : ${str(o.get('border-color', '#dddddd'))};}`);
  },
};
