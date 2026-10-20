/**
 * Backgrounds of the content area per device: boxed entries, lists, the
 * sidebar's widgets, narrow and full-width containers. A page can set its
 * own; an unboxed container with a boxed sidebar takes the site background.
 */
import { blogLayout, contentLayout, meta } from '../../core/context.js';
import { mobile, parseCss, responsiveBackgroundObj, tablet, type Rules } from '../../core/css.js';
import { isset } from '../../core/php.js';
import { isContentBoxed, isSidebarBoxed, sidebarLayout } from '../lib/footer-global.js';
import type { Part } from './index.js';

const BOXED =
  '.zn-separate-container .zn-article-single:not(.zn-related-post), .zn-separate-container .error-404, ' +
  '.zn-separate-container .no-results, .single.zn-separate-container .site-main .zn-author-meta, ' +
  '.zn-separate-container .related-posts-title-wrapper, .zn-separate-container .comments-count-wrapper, ' +
  '.zn-box-layout.zn-plain-container .site-content, .zn-padded-layout.zn-plain-container .site-content, ' +
  '.zn-separate-container .zn-archive-description';

export const part: Part = {
  name: 'content_background_css',
  run(o, c) {
    let content = o.get('content-bg-obj-responsive');
    const enabled = meta(o, c, 'zn-page-background-enabled');
    if (isset(enabled) && enabled === 'enabled') content = meta(o, c, 'zn-content-background-meta');
    const sidebar = content;
    const boxed = isContentBoxed(o, c);
    const sidebarBoxed = isSidebarBoxed(o, c);
    const layout = contentLayout(o, c);
    if (
      layout === 'plain-container' &&
      !boxed &&
      sidebarBoxed &&
      sidebarLayout(o, c) !== 'no-sidebar'
    ) {
      content =
        enabled === 'enabled'
          ? meta(o, c, 'zn-page-background-meta')
          : o.get('site-layout-outside-bg-obj-responsive');
    }
    const bg = (v: unknown, d: string) => responsiveBackgroundObj(o, v, d);
    const media = (rules: (d: string) => Rules) =>
      parseCss(rules('desktop')) +
      parseCss(rules('tablet'), '', tablet()) +
      parseCss(rules('mobile'), '', mobile());

    const narrow = layout === 'narrow-container' && !boxed;
    const container = (d: string): Rules => ({
      [d === 'desktop' ? `${BOXED}, .zn-separate-container .comments-area` : BOXED]: bg(content, d),
      ...(narrow ? { '.zn-narrow-container .site-content': bg(content, d) } : {}),
    });
    const blog = blogLayout(o, c);
    const inner = ['blog-layout-1', 'blog-layout-4', 'blog-layout-6'].includes(blog);
    let css = '';
    if (!inner) {
      css += parseCss({
        '.zn-separate-container .zn-article-inner': {
          'background-color': 'transparent',
          'background-image': 'none',
        },
      });
    }
    const article = inner
      ? '.zn-separate-container .zn-article-inner'
      : '.zn-separate-container .zn-article-post';
    css += media((d) => ({ [article]: bg(content, d) }));
    css += media(container);
    css += media((d) => ({
      '.zn-separate-container.zn-two-container #secondary .widget': bg(sidebar, d),
    }));
    const site = o.get('site-layout');
    if (
      o.get('apply-content-background-fullwidth-layouts', true) &&
      site !== 'zn-box-layout' &&
      site !== 'zn-padded-layout'
    ) {
      css += media((d) => ({ '.zn-plain-container, .zn-page-builder-template': bg(content, d) }));
    }
    return css;
  },
};
