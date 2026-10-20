/** The "Previous / Next" links under a post. */
import { mobile } from '../../core/css.js';
import { isSingle } from '../../core/context.js';
import { empty, esc } from '../../core/php.js';
import { trimCss } from '../lib/main.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'navigation_css',
  run(o, c) {
    if (!isSingle(c)) return '';
    const bp = String(mobile());
    const pad = empty(o.get('remove_single_posts_navigation_mobile_device_padding'))
      ? 'padding-left: 20px; padding-right: 20px;'
      : '';
    let css = `
      .single .post-navigation a p { margin-top: 0.5em; margin-bottom: 0; text-transform: initial; line-height: 1.65em; font-weight: normal; }
      .single .post-navigation a .zn-post-nav { font-weight: 600; display: block; text-transform: uppercase; font-size: 0.85em; letter-spacing: 0.05em; }
      .single .post-navigation a svg { top: .125em; width: 1em; height: 1em; position: relative; fill: currentColor; }
      .page-links .page-link:hover, .single .post-navigation a:hover { color: ${esc(o.get('link-h-color'))}; }
      @media( min-width: 320px ) {
        .single .post-navigation .nav-previous a { text-align: left; padding-right: 20px; }
        .single .post-navigation .nav-next a { text-align: right; padding-left: 20px; }
        .comment-navigation .nav-previous:after, .post-navigation .nav-previous:after { position: absolute; content: ""; top: 25%; right: 0; width: 1px; height: 50%; background: var(--zn-single-post-border, var(--zn-border-color)); }
      }
      @media( max-width: ${bp}px ) {
        .single .post-navigation .nav-links { -js-display: inline-flex; display: inline-flex; width: 100%; ${pad} }
        .single .post-navigation a p { display: none; }
        .single .post-navigation .nav-previous { margin-bottom: 0; }
      }
      @media( min-width: 421px ) {
        .single .post-navigation a { max-width: 80%; width: 100%; }
        .post-navigation a { font-weight: 500; font-size: 16px; }
      }
    `;
    if (c.rtl) {
      css += `
        @media( min-width: 320px ) {
          .single .post-navigation .nav-previous a { text-align: start; }
          .single .post-navigation .nav-next a { text-align: end; }
        }
        @media( max-width: ${bp}px ) {
          .single .post-navigation .nav-links { padding-left: 0px; padding-right: 0px; }
        }
      `;
    }
    return trimCss(css);
  },
};
