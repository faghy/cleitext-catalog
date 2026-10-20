/**
 * Comments on an entry with comments open (or some comments): list, meta,
 * reply form, author highlight, avatar, spacing per device and container.
 */
import { contentLayout } from '../../core/context.js';
import { fontCssValue, mobile, parseCss, tablet, type Rules } from '../../core/css.js';
import { at, blank, empty, esc, intval, isset, str } from '../../core/php.js';
import {
  boxedLayout,
  deviceFont,
  isContentBoxed,
  isSidebarBoxed,
  trimCss,
} from '../lib/footer-global.js';
import type { Part } from './index.js';

const LIST = '.zn-comment-list';
const SEP = '.zn-separate-container';
const NARROW = '.zn-narrow-container';

/** Rules of the comment list and form that only depend on the layout and direction. */
function listCss(rtl: boolean, depthPadding: boolean, plainLike: boolean): string {
  const [start, end] = rtl ? ['right', 'left'] : ['left', 'right'];
  let css =
    '.comments-title{padding: 1em 0 0}' +
    '.comments-title{word-wrap: break-word;font-weight: 600;padding-bottom: 1em}' +
    `${LIST}{margin: 0;word-wrap: break-word;padding-bottom: 0;list-style: none}` +
    `${LIST} li{list-style: none}` +
    `${LIST} .zn-comment-edit-reply-wrap{-js-display: flex;display: flex;justify-content: flex-end}` +
    `${LIST} .comment-awaiting-moderation{margin-bottom: 0}` +
    '.zn-comment{padding: 0}' +
    '.zn-comment-info img{border-radius: 50%}' +
    '.zn-comment-cite-wrap cite{font-style: normal}' +
    '.comment-reply-title{font-weight: 600;line-height: 1.65}' +
    '.zn-comment-meta{margin-bottom: 0.5em}' +
    '.comments-area .comment-form-comment{width: 100%;border: none;margin: 0;padding: 0}' +
    '.comments-area .comment-notes,.comments-area .comment-textarea,.comments-area .form-allowed-tags{margin-bottom: 1.5em}' +
    '.comments-area .form-submit{margin-bottom: 0}' +
    '.comments-area textarea#comment,.comments-area .zn-comment-formwrap input[type="text"]' +
    '{width: 100%;border-radius: 0;vertical-align: middle;margin-bottom: 10px}' +
    '.comments-area .no-comments{margin-top: 0.5em;margin-bottom: 0.5em}' +
    '.comments-area p.logged-in-as{margin-bottom: 1em}' +
    `${SEP} ${LIST}{padding-bottom: 0}` +
    `${SEP} ${LIST} li.depth-1 .children li,${NARROW} ${LIST} li.depth-1 .children li{padding-bottom: 0;padding-top: 0;margin-bottom: 0}` +
    `${SEP} ${LIST} .comment-respond{padding-top: 0;padding-bottom: 1em;background-color: transparent}` +
    `${LIST} .comment .comment-respond{padding-bottom: 2em;border-bottom: none}` +
    `${SEP} ${LIST} .bypostauthor,${NARROW} ${LIST} .bypostauthor{padding: 2em;margin-bottom: 1em}` +
    `${SEP} ${LIST} .bypostauthor li,${NARROW} ${LIST} .bypostauthor li{background: transparent;margin-bottom: 0;padding: 0 0 0 2em}` +
    '.comment-content a{word-wrap: break-word}' +
    '.comment-form-legend{margin-bottom: unset;padding: 0 0.5em}' +
    '.comment-reply-title{padding-top: 0;margin-bottom: 1em}' +
    '.zn-comment{padding-top: 2.5em;padding-bottom: 2.5em;border-top: 1px solid var(--zn-single-post-border,var(--zn-border-color))}' +
    `${SEP} ${LIST} .comment + .comment,${NARROW} ${LIST} .comment + .comment{padding-top: 0;padding-bottom: 0}`;
  if (depthPadding) {
    css += `${SEP} ${LIST} li.depth-1,${NARROW} ${LIST} li.depth-1{padding-left: 2.5em;padding-right: 2.5em}`;
  }
  css +=
    '.zn-plain-container .zn-comment,.zn-page-builder-template .zn-comment{padding: 2em 0}' +
    '.page.zn-page-builder-template .comments-area{margin-top: 2em}';
  if (plainLike)
    css += '.zn-page-builder-template .comment-respond{border-top: none;padding-bottom: 2em}';
  css +=
    `${LIST} .children{margin-${start}: 2em}` +
    `@media (max-width: 992px){${LIST} .children{margin-${start}: 1em}}` +
    `${LIST} #cancel-comment-reply-link{white-space: nowrap;font-size: 13px;font-weight: normal;margin-${start}: 1em}`;
  if (rtl) {
    css +=
      '.zn-comment-meta{justify-content: left;padding: 0 3.4em 1.333em}' +
      '.zn-comment-time .timendate,.zn-comment-time .reply{margin-left: 0.5em}';
  } else {
    css +=
      '.zn-comment-info{display: flex;position: relative}' +
      '.zn-comment-meta{justify-content: right;padding: 0 3.4em 1.60em}';
  }
  css +=
    `.comments-area #wp-comment-cookies-consent{margin-${end}: 10px}` +
    `.zn-page-builder-template .comments-area{padding-${start}: 20px;padding-${end}: 20px;margin-top: 0;margin-bottom: 2em}` +
    `${SEP} ${LIST} .bypostauthor .bypostauthor{background: transparent;margin-bottom: 0;padding-${end}: 0;padding-bottom: 0;padding-top: 0}`;
  return trimCss(css);
}

export const part: Part = {
  name: 'comments_css',
  run(o, c) {
    if (!c.comments) return '';
    const body = o.get('font-size-body');
    const isObj = typeof body === 'object' && body !== null;
    const desktopSize = isObj
      ? isset(body, 'desktop') && !blank(at(body, 'desktop'))
        ? at(body, 'desktop')
        : 15
      : !blank(body)
        ? body
        : 15;
    let css = parseCss({
      '.comment-reply-title': { 'font-size': fontCssValue(o, intval(desktopSize) * 1.3) },
      '.zn-comment-meta': {
        'line-height': '1.666666667',
        color: esc(o.get('link-color', o.get('theme-color'))),
        'font-size': fontCssValue(o, intval(desktopSize) * 0.8571428571),
      },
      [`${LIST} #cancel-comment-reply-link`]: { 'font-size': deviceFont(o, body, 'desktop') },
    });

    const boxed = isContentBoxed(o, c);
    const layout = contentLayout(o, c);
    const placement = o.get('comments-box-placement', '');
    const depthPadding =
      (layout === 'plain-container' || layout === 'narrow-container') &&
      boxed &&
      placement !== 'inside';
    const legacy = boxedLayout(o, c, layout, boxed, isSidebarBoxed(o, c));
    css += listCss(c.rtl, depthPadding, legacy === 'page-builder' || legacy === 'plain-container');

    const [start, end] = c.rtl ? ['right', 'left'] : ['left', 'right'];
    css += parseCss(
      {
        [`${SEP} ${LIST} li .comment-respond`]: {
          'padding-left': '2.66666em',
          'padding-right': '2.66666em',
        },
      },
      tablet('', 1),
    );
    const scaled = (d: string, f: number) =>
      !empty(at(body, d)) ? fontCssValue(o, intval(at(body, d)) * f, 'px', d) : '';
    css += parseCss(
      {
        [`${SEP} ${LIST} li.depth-1`]: { padding: '', 'margin-bottom': '0' },
        [`${SEP} ${LIST} .bypostauthor`]: { padding: '.5em' },
        [`${SEP} .comment-respond`]: { padding: '' },
        '.zn-comment-meta': { 'font-size': scaled('mobile', 0.8571428571) },
        '.comment-reply-title': { 'font-size': scaled('mobile', 1.3) },
        [`${LIST} #cancel-comment-reply-link`]: { 'font-size': deviceFont(o, body, 'mobile') },
        [`${SEP} ${LIST} .bypostauthor li`]: { padding: '0 0 0 .5em' },
        [`${LIST} .children`]: { [`margin-${start}`]: '0.66666em' },
      },
      '',
      mobile(),
    );
    const tabletRules: Rules = {
      '.zn-comment-avatar-wrap img': { 'max-width': '2.5em' },
      '.comments-area': { 'margin-top': '1.5em' },
      // Set twice in the reference: the second value (padding only) wins.
      '.zn-comment-meta': { padding: '0 1.8888em 1.3333em' },
      [`${SEP} ${LIST} li.depth-1`]: { padding: '' },
      [`${SEP} .comment-respond`]: { padding: '' },
      '.comment-reply-title': { 'font-size': scaled('tablet', 1.3) },
      [`${LIST} #cancel-comment-reply-link`]: { 'font-size': deviceFont(o, body, 'tablet') },
      '.zn-comment-avatar-wrap': { [`margin-${end}`]: '0.5em' },
    };

    css +=
      '.zn-comment-cite-wrap cite{font-weight: 600;font-size: 1.2em}' +
      '.zn-comment-info img{box-shadow: 0 0 5px 0 rgba(0,0,0,.15);border: 1px solid var(--zn-single-post-border, var(--zn-border-color))}' +
      '.zn-comment-info{margin-bottom: 1em}' +
      '.logged-in span.zn-reply-link{margin-right: 16px}' +
      'a.comment-edit-link, a.comment-reply-link{font-size: 13px;transition: all 0.2s}' +
      'header.zn-comment-meta{text-transform: inherit}' +
      '.zn-page-builder-template .zn-comment-list .children{margin-top: 0em}' +
      '.zn-page-builder-template .zn-comment-meta{padding: 0 22px}' +
      '.zn-comment-content.comment p{margin-bottom: 16px}' +
      '.zn-comment-list .zn-comment-edit-reply-wrap{justify-content: flex-start;align-items: center}' +
      '.comment-awaiting-moderation{margin-top: 20px}' +
      '.entry-content ul li, .entry-content ol li{margin-bottom: 10px}' +
      '.comment-respond{padding-top: 2em;padding-bottom: 2em}' +
      '.zn-comment-list + .comment-respond{border-top: 1px solid var(--zn-single-post-border, var(--zn-border-color));padding-bottom: 0}' +
      '.comment .comment-reply-title{display: flex;align-items: center;justify-content: space-between}' +
      `@media(min-width: ${mobile('', 1)}px){` +
      'header.zn-comment-meta{display: flex;width: 100%;margin-bottom: 0;padding-bottom: 0;align-items: center}' +
      'a.comment-reply-link{padding: 1px 10px;display: block;border-radius: 3px;border: none}' +
      '.zn-separate-container .zn-comment-list li.depth-1, .zn-narrow-container .zn-comment-list li.depth-1{margin-bottom: 0}' +
      '.zn-comment-time{display: flex;margin-left: auto;font-weight: 500}' +
      'section.zn-comment-content.comment{padding-left: 50px}' +
      `.zn-comment .comment-reply-link:hover{background: ${str(o.get('theme-color'))};color: #fff}` +
      '.zn-comment .comment-edit-link:hover{text-decoration: underline}' +
      'svg.zn-reply-icon{fill: currentColor;margin-right: 5px;padding-top: 2px;transition: none}' +
      '.comment-reply-link:hover .zn-reply-icon{fill: #fff}}' +
      `@media(min-width: ${tablet()}px){` +
      '.zn-comment-cite-wrap{margin-left: -7px}' +
      'section.zn-comment-content.comment{padding-left: 70px}}';
    if (o.get('comment-form-position') === 'above') {
      css +=
        '.comment-respond{border-bottom: 1px solid var(--zn-single-post-border, var(--zn-border-color))}';
    }
    if (placement === 'inside') css += '.site-content article .comment-respond{padding-top: 1.5em}';
    return css + parseCss(tabletRules, '', tablet());
  },
};
