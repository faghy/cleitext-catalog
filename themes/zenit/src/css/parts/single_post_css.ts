/** Spacing of post content, code, images and the post navigation (posts only). */
import { contentLayout, isContentBoxed, isSingle } from '../../core/context.js';
import { trimCss } from '../lib/main.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'single_post_css',
  run(o, c) {
    if (!isSingle(c)) return '';
    const layout = contentLayout(o, c);
    const unboxed =
      (layout === 'plain-container' || layout === 'narrow-container') && !isContentBoxed(o, c);
    let css = `
      :root { --zn-single-post-border: #e1e8ed; }
      .entry-content > * { margin-bottom: 1.5em; }
      .entry-content :where(h1, h2, h3, h4, h5, h6) { margin-top: 1.5em; margin-bottom: calc(0.3em + 10px); }
      code, kbd, samp { background: var(--zn-code-block-background); padding: 3px 6px; }
      .zn-row.comment-textarea fieldset.comment-form-comment { border: none; padding: unset; margin-bottom: 1.5em; }
      .entry-content .wp-block-image,
      .entry-content .wp-block-embed { margin-top: 2em; margin-bottom: 3em; }
    `;
    if (unboxed) {
      css += `
        :root { --zn-single-post-nav-padding: 4em 0 0; }
        .zn-single-post .zn-post-format-content { max-width: 100%; }
        .post-navigation + .comments-area { border-top: none; padding-top: 5em; }
      `;
    } else {
      css += `:root { --zn-single-post-nav-padding: ${c.comments ? '3em 0 1em' : '3em 0 0'}; }`;
    }
    return trimCss(css);
  },
};
