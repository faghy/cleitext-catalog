/** Layout of the related posts section under a post: grid, cards, title spacing. */
import { relatedPostsShown } from '../lib/footer-global.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'related_posts_static_css',
  run(o, c) {
    if (!relatedPostsShown(o, c)) return '';
    return (
      '.zn-related-post-title, .entry-meta *{word-break: break-word}' +
      '.zn-related-post-cta.read-more .zn-related-post-link{text-decoration: none}' +
      '.zn-page-builder-template .zn-related-post .entry-header, .zn-related-post-content .entry-header, ' +
      '.zn-related-post-content .entry-meta{margin: 1em auto 1em auto;padding: 0}' +
      '.zn-related-posts-wrapper{display: grid;grid-column-gap: 25px;grid-row-gap: 25px}' +
      '.zn-related-posts-wrapper .zn-related-post, .zn-related-post-featured-section' +
      '{padding: 0;margin: 0;width: 100%;position: relative}' +
      '.zn-related-posts-inner-section{height: 100%}' +
      '.post-has-thumb + .entry-header, .post-has-thumb + .entry-content{margin-top: 1em}' +
      '.zn-related-post-content .entry-meta{margin-top: 0.5em}' +
      '.zn-related-posts-inner-section .post-thumb-img-content{margin: 0;position: relative}' +
      '.zn-single-related-posts-container{border-top: 1px solid var(--zn-single-post-border, var(--zn-border-color))}' +
      '.zn-separate-container .zn-single-related-posts-container{border-top: 0}' +
      '.zn-single-related-posts-container{padding-top: 2em}' +
      '.zn-related-posts-title-section{padding-bottom: 20px}' +
      '.zn-page-builder-template .zn-single-related-posts-container' +
      '{margin-top: 0;padding-left: 20px;padding-right: 20px}' +
      '@media (max-width: 544px){.zn-related-posts-title-section{padding-bottom: 1.5em}}'
    );
  },
};
