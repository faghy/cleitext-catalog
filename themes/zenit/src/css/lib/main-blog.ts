/**
 * Content widths of the blog, posts and pages, and the blog lists: grid,
 * list and cover layouts, image ratio, hover effect, author avatar and
 * category or tag badges; the submenu offset of left-aligned menus.
 */
import { isArchive, isSearch, isSingular, type Ctx } from '../../core/context.js';
import { cssValue, parseCss, tablet, type Rules } from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, blank, esc, intval, isset, str } from '../../core/php.js';
import { trimCss, truthy } from './main.js';
import type { MainVars } from './main-vars.js';

/** The image aspect ratio of the blog list (`16/9`, `4/3`…). */
function aspectRatio(o: Options, type: unknown): string {
  if (type === 'predefined') return str(o.get('blog-image-ratio-pre-scale'));
  if (type === 'custom') {
    const w = Math.abs(intval(o.get('blog-image-custom-scale-width', 16)));
    const h = Math.abs(intval(o.get('blog-image-custom-scale-height', 9)));
    return `${w}/${h}`;
  }
  return '';
}

export function blogCss(o: Options, c: Ctx, v: MainVars): string {
  let css = '';
  const wide = tablet('', 1);
  if (o.get('blog-width') === 'custom') {
    css += parseCss(
      {
        '.blog .site-content > .zn-container, .archive .site-content > .zn-container, .search .site-content > .zn-container':
          {
            'max-width': cssValue(o.get('blog-max-width'), 'px'),
          },
      },
      wide,
    );
  }
  if (o.get('blog-single-width') === 'custom') {
    css += parseCss(
      {
        '.single-post .site-content > .zn-container': {
          'max-width': cssValue(o.get('blog-single-max-width'), 'px'),
        },
      },
      wide,
    );
  }
  if (o.get('page-single-width') === 'custom') {
    css += parseCss(
      {
        ' .page .site-content > .zn-container': {
          'max-width': cssValue(o.get('page-single-max-width'), 'px'),
        },
      },
      wide,
    );
  }
  if (isSingular(c))
    css += parseCss({ '.entry-content :where(h1, h2, h3, h4, h5, h6)': { clear: 'none' } });

  if (isSearch(c) || isArchive(c) || c.isHome) css += blogListCss(o, c, v);

  const border = o.get<Record<string, unknown>>('primary-submenu-border');
  const has = (s: string) => isset(border, s) && !blank(at(border, s));
  css += parseCss(
    {
      '.main-header-menu .sub-menu .menu-item.zn-left-align-sub-menu:hover > .sub-menu, .main-header-menu .sub-menu .menu-item.zn-left-align-sub-menu.focus > .sub-menu':
        {
          'margin-left':
            has('left') || has('right')
              ? cssValue(`-${intval(at(border, 'left')) + intval(at(border, 'right'))}`, 'px')
              : '',
        },
    },
    wide,
  );
  return css;
}

/** The blog list layouts. */
function blogListCss(o: Options, c: Ctx, v: MainVars): string {
  const [left, right] = c.rtl ? ['right', 'left'] : ['left', 'right'];
  let layout = v.blogLayout;
  if (layout === 'blog-layout-1' || layout === 'blog-layout-2' || layout === 'blog-layout-3')
    layout = 'blog-layout-4';
  const bl = `.zn-${esc(layout)}-grid`;
  const grid = o.get('blog-grid');
  const gridOrCover = layout === 'blog-layout-4' || layout === 'blog-layout-6';
  let rules: Rules = {};
  if (gridOrCover) {
    rules = {
      [`${bl} .zn-article-post`]: { border: '0' },
      [`${bl} .zn-article-inner .wp-post-image`]: { width: '100%' },
      '.zn-article-inner': { padding: '1.5em' },
      [`${bl} .zn-row`]: {
        display: 'flex',
        'flex-wrap': 'wrap',
        'flex-flow': 'row wrap',
        'align-items': 'stretch',
      },
    };
    rules[`${bl} .zn-article-post`] = {
      width: '33.33%',
      'margin-bottom': '2em',
      'border-bottom': '0',
      'background-color': 'transparent',
    };
    rules[`.zn-separate-container ${bl} .zn-article-post`] = { padding: '0 1em 0' };
    rules['.zn-separate-container.zn-desktop .zn-blog-layout-4-grid .zn-row'] = {
      'margin-left': '-1em',
      'margin-right': '-1em',
    };
  }
  rules[`${bl} .zn-article-inner`] = { 'box-shadow': '0px 6px 15px -2px rgba(16, 24, 40, 0.05)' };
  rules[
    `.zn-separate-container ${bl} .zn-article-inner, .zn-plain-container ${bl} .zn-article-inner`
  ] = { height: '100%' };
  let css = parseCss(rules);

  if (layout === 'blog-layout-4') {
    css += parseCss({
      '.zn-row .blog-layout-4 .post-content, .blog-layout-4 .post-thumb': {
        [`padding-${left}`]: '0',
        [`padding-${right}`]: '0',
      },
      '.zn-article-post.remove-featured-img-padding .blog-layout-4 .post-content .zn-blog-featured-section:first-child .post-thumb-img-content':
        { 'margin-top': '-1.5em' },
      '.zn-article-post.remove-featured-img-padding .blog-layout-4 .post-content .zn-blog-featured-section .post-thumb-img-content':
        {
          [`margin-${left}`]: '-1.5em',
          [`margin-${right}`]: '-1.5em',
        },
    });
  }
  if (layout === 'blog-layout-5') {
    css += parseCss({
      [`${bl} .zn-row`]: { [`margin-${left}`]: '0', [`margin-${right}`]: '0' },
      [`${bl} .zn-article-inner`]: { width: '100%' },
      [`${bl} .blog-layout-5`]: {
        display: 'flex',
        'flex-wrap': 'wrap',
        'vertical-align': 'middle',
      },
      [`${bl} .zn-blog-featured-section`]: { width: '25%', 'margin-bottom': '0' },
      [`${bl} .post-thumb-img-content`]: { height: '100%' },
      [`${bl} .zn-blog-featured-section img`]: {
        width: '100%',
        height: '100%',
        'object-fit': 'cover',
      },
      [`${bl} .post-content`]: { width: '75%', [`padding-${left}`]: '1.5em' },
      [`${bl} .zn-no-thumb .zn-blog-featured-section`]: { width: 'unset' },
      [`${bl} .zn-no-thumb .post-content`]: { width: '100%' },
      [`.zn-separate-container ${bl} .post-content`]: {
        [`padding-${right}`]: '1.5em',
        'padding-top': '1.5em',
        'padding-bottom': '1.5em',
      },
      [`${bl} .zn-article-post`]: { 'margin-bottom': '2em', padding: '0', 'border-bottom': '0' },
    });
    css += parseCss(
      { [`${bl} .zn-blog-featured-section`]: { 'margin-bottom': '1.5em' } },
      '',
      tablet(),
    );
  }
  if (layout === 'blog-layout-6') {
    const cover: Rules = {
      [`${bl} .blog-layout-6 .post-content`]: {
        position: 'static',
        'padding-left': '0',
        'padding-right': '0',
      },
      [`${bl} .blog-layout-6 .zn-blog-featured-section`]: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100%',
        height: '100%',
      },
      [`${bl} .blog-layout-6 .post-thumb-img-content,${bl} .blog-layout-6 .post-thumb-img-content img`]:
        { width: '100%', height: '100%' },
      [`${bl} .blog-layout-6 .post-thumb-img-content img`]: {
        'object-fit': 'cover',
        'border-radius': '4px',
      },
      [`${bl} .blog-layout-6 .zn-blog-single-element:not(.zn-blog-featured-section)`]: {
        position: 'relative',
        'z-index': '1',
      },
      [`${bl} .blog-layout-6 .zn-blog-single-element, ${bl} .blog-layout-6 .zn-blog-single-element *, ${bl} .blog-layout-6 .zn-blog-single-element *:hover`]:
        { color: '#fff' },
      [`${bl} .badge .zn-button,${bl} .badge .zn-button:hover`]: {
        border: '1px solid #fff',
        'background-color': 'transparent',
      },
      [`${bl} .blog-layout-6 .zn-blog-featured-section:before`]: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        width: '100%',
        height: '100%',
        'background-color': 'rgba(30, 41, 59, 0.65)',
        'border-radius': '4px',
      },
      [`${bl} .blog-layout-6`]: { position: 'relative' },
    };
    if (grid === 1) cover['.zn-plain-container .zn-article-post'] = { padding: '1.5em' };
    else cover['.zn-plain-container .zn-article-inner'] = { padding: '1.5em' };
    css += parseCss(cover);
  }
  const responsive: Rules = {};
  if (gridOrCover) responsive[`${bl} .zn-article-post`] = { width: '100%' };
  if (layout === 'blog-layout-5')
    responsive[`${bl} .zn-blog-featured-section,${bl} .post-content`] = { width: '100%' };
  css += parseCss(responsive, '', tablet());
  css += trimCss('.zn-blog-layout-6-grid .zn-blog-featured-section:before { content: ""; }');

  const ratioType = o.get('blog-image-ratio-type');
  const ratio = aspectRatio(o, ratioType);
  const imgWidth = ratioType === 'predefined' || ratioType === 'custom' ? '100%' : '';
  if (truthy(ratio) && imgWidth) {
    css += parseCss({
      '.zn-article-post .post-thumb-img-content img': { 'aspect-ratio': ratio, width: imgWidth },
    });
  }
  if (ratioType === 'custom')
    css += parseCss({ '.zn-article-post .post-thumb-img-content img': { 'object-fit': 'cover' } });
  if (truthy(o.get('blog-meta-author-avatar'))) {
    css += parseCss({
      '.zn-author-image': {
        'aspect-ratio': '1/1',
        'border-radius': '100%',
        [`margin-${right}`]: '.5em',
      },
    });
  }
  const hover = o.get('blog-hover-effect');
  if (hover !== 'none') {
    const fx: Rules = { '.zn-article-post .post-thumb-img-content': { overflow: 'hidden' } };
    if (hover === 'zoom-in') {
      fx['.zn-article-post .post-thumb-img-content img'] = {
        transform: 'scale(1)',
        transition: 'transform .5s ease',
      };
      fx['.zn-article-post:hover .post-thumb-img-content img'] = { transform: 'scale(1.1)' };
    }
    if (hover === 'zoom-out') {
      fx['.zn-article-post .post-thumb-img-content img'] = {
        transform: 'scale(1.1)',
        transition: 'transform .5s ease',
      };
      fx['.zn-article-post:hover .post-thumb-img-content img'] = { transform: 'scale(1)' };
    }
    css += parseCss(fx);
  }
  if (
    truthy(o.get('blog-category-style')) ||
    truthy(o.get('blog-tag-style')) ||
    truthy(o.get('blog-meta-category-style')) ||
    truthy(o.get('blog-meta-tag-style'))
  ) {
    css += trimCss(`
						.cat-links.badge a, .tags-links.badge a {
							padding: 4px 8px;
							border-radius: 3px;
							font-weight: 400;
						}

						.cat-links.underline a, .tags-links.underline a{
							text-decoration: underline;
						}
					`);
  }
  return css;
}
