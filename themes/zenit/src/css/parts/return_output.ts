/**
 * The main dynamic CSS: colors, fonts, buttons, containers, sidebar, blog
 * layouts, blocks and forms, with the site's custom CSS at the end.
 */
import { blocksCss } from '../lib/main-blocks.js';
import { blogCss } from '../lib/main-blog.js';
import { buttonsCss } from '../lib/main-buttons.js';
import { endCss } from '../lib/main-end.js';
import { typoCss } from '../lib/main-typo.js';
import { globalCss } from '../lib/main-global.js';
import { trimCss } from '../lib/main.js';
import { mainVars } from '../lib/main-vars.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'return_output',
  prepend: true,
  run(o, c) {
    const v = mainVars(o, c);
    let css = globalCss(o, c, v);
    css += blocksCss(o, c, v);
    css += buttonsCss(o, c, v);
    css += typoCss(o, c, v);
    css += blogCss(o, c, v);
    css += endCss(o, c);
    const custom = o.get('custom-css');
    if (custom !== '') css += String(custom);
    return trimCss(css);
  },
};
