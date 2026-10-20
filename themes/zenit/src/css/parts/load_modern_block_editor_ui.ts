/**
 * Block editor content on the front end: default block padding per device
 * (compact, comfortable or custom), content and wide widths, full and wide
 * alignments in each container, quotes, separators, media and text, latest
 * posts, login form, lists.
 */
import { mobile, parseCss, responsiveSpacing, tablet } from '../../core/css.js';
import { empty, esc, str } from '../../core/php.js';
import type { Part } from './index.js';

const DEVICES = ['desktop', 'tablet', 'mobile'] as const;
const SIDES = ['top', 'right', 'bottom', 'left'] as const;
type Spacing = Record<(typeof DEVICES)[number], Record<(typeof SIDES)[number], string>>;

/** The default padding of top-level blocks per device and side. */
function blockSpacing(type: unknown, custom: unknown): Spacing {
  const all = (v: string) => ({ top: v, right: v, bottom: v, left: v });
  switch (type) {
    case 'compact':
      return { desktop: all('2em'), tablet: all('2em'), mobile: all('2em') };
    case 'comfort':
      return {
        desktop: all('3em'),
        tablet: { top: '3em', right: '2em', bottom: '3em', left: '2em' },
        mobile: { top: '3em', right: '1.5em', bottom: '3em', left: '1.5em' },
      };
    case 'custom': {
      const side = (d: string) => ({
        top: responsiveSpacing(custom, 'top', d),
        right: responsiveSpacing(custom, 'right', d),
        bottom: responsiveSpacing(custom, 'bottom', d),
        left: responsiveSpacing(custom, 'left', d),
      });
      return { desktop: side('desktop'), tablet: side('tablet'), mobile: side('mobile') };
    }
    default:
      return { desktop: all(''), tablet: all(''), mobile: all('') };
  }
}

/** Fixed rules for file, pullquote and quote blocks. */
const REQUIRED =
  '.wp-block-file{display: flex;align-items: center;flex-wrap: wrap;justify-content: space-between}' +
  '.wp-block-pullquote{border: none}' +
  '.wp-block-pullquote blockquote::before{content: "\\201D";font-family: "Helvetica",sans-serif;display: flex;' +
  'transform: rotate( 180deg );font-size: 6rem;font-style: normal;line-height: 1;font-weight: bold;' +
  'align-items: center;justify-content: center}' +
  '.has-text-align-right > blockquote::before{justify-content: flex-start}' +
  '.has-text-align-left > blockquote::before{justify-content: flex-end}' +
  'figure.wp-block-pullquote.is-style-solid-color blockquote{max-width: 100%;text-align: inherit}';

const NO_SIDEBAR_NESTED = [
  'alignfull .alignfull',
  'alignfull .alignwide',
  'alignwide .alignfull',
  'alignwide .alignwide',
  'wp-block-column .alignfull',
  'wp-block-column .alignwide',
]
  .flatMap((s) => [
    `.zn-plain-container.zn-no-sidebar .entry-content .${s}`,
    `.zn-page-builder-template.zn-no-sidebar .entry-content .${s}`,
  ])
  .join(', ');

const LAYOUT = '.entry-content[data-zn-blocks-layout]';
// Page builders' top elements (Prisma, Fresco) keep their own inner widths.
const ROOT = ':where(:not(.pr-is-root):not(.pr-is-root):not(.fr-e))';

export const part: Part = {
  name: 'load_modern_block_editor_ui',
  run(o, c) {
    const [left, right] = c.rtl ? ['right', 'left'] : ['left', 'right'];
    const v2 = !empty(o.get('wp-blocks-v2-ui', true));
    const container = `${str(o.get('site-content-width', 1200))}px`;
    const sp = blockSpacing(o.get('wp-blocks-ui'), o.get('wp-blocks-global-padding'));
    const contentWidth = v2 ? container : '910px';
    const wideWidth = v2
      ? `calc(${esc(container)} + var(--wp--custom--zn-default-block-left-padding) + var(--wp--custom--zn-default-block-right-padding))`
      : container;
    const narrow = `${str(o.get('narrow-container-max-width', 750))}px`;
    const pads = (d: (typeof DEVICES)[number]) =>
      SIDES.map((s) => `--wp--custom--zn-default-block-${s}-padding: ${sp[d][s]};`).join('');

    let css =
      REQUIRED +
      `:root{${pads('desktop')}--wp--custom--zn-container-width: ${container};` +
      `--wp--custom--zn-content-width-size: ${contentWidth};--wp--custom--zn-wide-width-size: ${wideWidth};}` +
      `.zn-narrow-container{--wp--custom--zn-content-width-size: ${narrow};--wp--custom--zn-wide-width-size: ${narrow};}` +
      `@media(max-width: ${tablet()}px){:root{${pads('tablet')}}}` +
      `@media(max-width: ${mobile()}px){:root{${pads('mobile')}}}`;

    const wide = v2
      ? `${LAYOUT} > .alignwide`
      : `${LAYOUT} > .alignwide, ${LAYOUT} .wp-block-cover__inner-container, ${LAYOUT} > p`;
    const full = v2
      ? '.zn-plain-container.zn-no-sidebar .entry-content > .alignfull, .zn-page-builder-template .zn-no-sidebar .entry-content > .alignfull'
      : '.zn-plain-container.zn-no-sidebar .entry-content .alignfull, .zn-page-builder-template .zn-no-sidebar .entry-content .alignfull';
    css +=
      '.entry-content > .wp-block-group, .entry-content > .wp-block-cover, .entry-content > .wp-block-columns{' +
      'padding-top: var(--wp--custom--zn-default-block-top-padding);padding-right: var(--wp--custom--zn-default-block-right-padding);' +
      'padding-bottom: var(--wp--custom--zn-default-block-bottom-padding);padding-left: var(--wp--custom--zn-default-block-left-padding)}' +
      `${full}{margin-left: calc( -50vw + 50%);margin-right: calc( -50vw + 50%);max-width: 100vw;width: 100vw}` +
      `${NO_SIDEBAR_NESTED}{margin-left: auto;margin-right: auto;width: 100%}` +
      '[data-zn-blocks-layout] .wp-block-separator:not(.is-style-dots){height: 0}' +
      '[data-zn-blocks-layout] .wp-block-separator{margin: 20px auto}' +
      '[data-zn-blocks-layout] .wp-block-separator:not(.is-style-wide):not(.is-style-dots){max-width: 100px}' +
      '[data-zn-blocks-layout] .wp-block-separator.has-background{padding: 0}' +
      `${LAYOUT} > *{max-width: var(--wp--custom--zn-content-width-size);margin-left: auto;margin-right: auto}` +
      `${wide}{max-width: var(--wp--custom--zn-wide-width-size)}` +
      `${LAYOUT} .alignfull{max-width: none}` +
      '.entry-content .wp-block-columns{margin-bottom: 0}' +
      'blockquote{margin: 1.5em;border-color: rgba(0,0,0,0.05)}' +
      `.wp-block-quote:not(.has-text-align-right):not(.has-text-align-center){border-${left}: 5px solid rgba(0, 0, 0, 0.05)}` +
      `.has-text-align-right > blockquote, blockquote.has-text-align-right{border-${right}: 5px solid rgba(0, 0, 0, 0.05)}` +
      `.has-text-align-left > blockquote, blockquote.has-text-align-left{border-${left}: 5px solid rgba(0, 0, 0, 0.05)}` +
      '.wp-block-site-tagline, .wp-block-latest-posts .read-more{margin-top: 15px}' +
      '.wp-block-loginout p label{display: block}' +
      '.wp-block-loginout p:not(.login-remember):not(.login-submit) input{width: 100%}' +
      '.wp-block-loginout input:focus{border-color: transparent}' +
      '.wp-block-loginout input:focus{outline: thin dotted}' +
      '.entry-content .wp-block-media-text .wp-block-media-text__content{padding: 0 0 0 8%}' +
      '.entry-content .wp-block-media-text.has-media-on-the-right .wp-block-media-text__content{padding: 0 8% 0 0}' +
      '.entry-content .wp-block-media-text.has-background .wp-block-media-text__content{padding: 8%}' +
      '.entry-content .wp-block-cover:not([class*="background-color"]):not(.has-text-color.has-link-color) .wp-block-cover__inner-container, ' +
      '.entry-content .wp-block-cover:not([class*="background-color"]) .wp-block-cover-image-text, ' +
      '.entry-content .wp-block-cover:not([class*="background-color"]) .wp-block-cover-text, ' +
      '.entry-content .wp-block-cover-image:not([class*="background-color"]) .wp-block-cover__inner-container, ' +
      '.entry-content .wp-block-cover-image:not([class*="background-color"]) .wp-block-cover-image-text, ' +
      '.entry-content .wp-block-cover-image:not([class*="background-color"]) .wp-block-cover-text' +
      '{color: var(--zn-global-color-primary, var(--zn-global-color-5))}' +
      '.wp-block-loginout .login-remember input{width: 1.1rem;height: 1.1rem;margin: 0 5px 4px 0;vertical-align: middle}' +
      '.wp-block-latest-posts > li > *:first-child, .wp-block-latest-posts:not(.is-grid) > li:first-child{margin-top: 0}' +
      '.entry-content > .wp-block-buttons, .entry-content > .wp-block-prisma-buttons{margin-bottom: 1.5em}';

    if (v2) {
      const pad = 'var(--zn-container-default-xlg-padding)';
      const negative = `calc(-1 * min(${pad}, 20px))`;
      css +=
        '.wp-block-search__inside-wrapper .wp-block-search__input{padding: 0 10px;color: var(--zn-global-color-3);' +
        'background: var(--zn-global-color-primary, var(--zn-global-color-5));border-color: var(--zn-border-color)}' +
        '.wp-block-latest-posts .read-more{margin-bottom: 1.5em}' +
        '.wp-block-search__no-button .wp-block-search__inside-wrapper .wp-block-search__input{padding-top: 5px;padding-bottom: 5px}' +
        '.wp-block-latest-posts .wp-block-latest-posts__post-date, .wp-block-latest-posts .wp-block-latest-posts__post-author{font-size: 1rem}' +
        '.wp-block-latest-posts > li > *, .wp-block-latest-posts:not(.is-grid) > li{margin-top: 12px;margin-bottom: 12px}' +
        `.zn-page-builder-template ${LAYOUT} > .alignwide${ROOT} > *{max-width: var(--wp--custom--zn-wide-width-size)}` +
        `.zn-page-builder-template ${LAYOUT} > .inherit-container-width > *, ` +
        `.zn-page-builder-template ${LAYOUT} > *:not(.wp-block-group)${ROOT} > *, ` +
        `${LAYOUT} > .wp-block-cover .wp-block-cover__inner-container{max-width: none;margin-left: auto;margin-right: auto}` +
        `.zn-page-builder-template ${LAYOUT} > *, .zn-page-builder-template ${LAYOUT} > .alignfull` +
        ':where(:not(.wp-block-group):not(.pr-is-root):not(.pr-is-root):not(.fr-e)) > *{max-width: none}' +
        `${LAYOUT} .wp-block-cover:not(.alignleft):not(.alignright){width: auto}` +
        '@media(max-width: 1200px){.zn-separate-container .entry-content > .alignfull, ' +
        `.zn-separate-container ${LAYOUT} > .alignwide, .zn-plain-container ${LAYOUT} > .alignwide, ` +
        `.zn-plain-container .entry-content .alignfull{margin-left: ${negative};margin-right: ${negative}}}` +
        `@media(min-width: 1201px){.zn-separate-container .entry-content > .alignfull{margin-left: calc(-1 * ${pad} );` +
        `margin-right: calc(-1 * ${pad} )}` +
        `.zn-separate-container ${LAYOUT} > .alignwide, .zn-plain-container ${LAYOUT} > .alignwide{margin-left: auto;margin-right: auto}}` +
        `@media(min-width: ${tablet()}px){` +
        '.zn-separate-container .entry-content .wp-block-group.alignwide:not(.inherit-container-width) > :where(:not(.alignleft):not(.alignright)), ' +
        '.zn-plain-container .entry-content .wp-block-group.alignwide:not(.inherit-container-width) > :where(:not(.alignleft):not(.alignright))' +
        '{max-width: calc( var(--wp--custom--zn-content-width-size) + 80px )}' +
        `.zn-plain-container.zn-right-sidebar ${LAYOUT} .alignfull, .zn-plain-container.zn-left-sidebar ${LAYOUT} .alignfull` +
        '{margin-left: -60px;margin-right: -60px}}' +
        `@media(min-width: ${mobile()}px){.entry-content > .alignleft{margin-${right}: 20px}` +
        `.entry-content > .alignright{margin-${left}: 20px}}`;
    } else {
      css +=
        '.wp-block-latest-posts > li > a{font-size: 28px}' +
        '.wp-block-latest-posts > li > *, .wp-block-latest-posts:not(.is-grid) > li{margin-top: 15px;margin-bottom: 15px}' +
        '.wp-block-latest-posts .wp-block-latest-posts__post-date, .wp-block-latest-posts .wp-block-latest-posts__post-author{font-size: 15px}';
    }
    css += parseCss(
      {
        '.wp-block-columns .wp-block-column:not(:last-child)': { 'margin-bottom': '20px' },
        '.wp-block-latest-posts': { margin: '0' },
      },
      '',
      mobile(),
    );
    css +=
      '@media( max-width: 600px ){.entry-content .wp-block-media-text .wp-block-media-text__content, ' +
      '.entry-content .wp-block-media-text.has-media-on-the-right .wp-block-media-text__content{padding: 8% 0 0}' +
      '.entry-content .wp-block-media-text.has-background .wp-block-media-text__content{padding: 8%}}' +
      `.zn-page-builder-template .entry-header{padding-${left}: 0}` +
      '.zn-narrow-container .site-content .wp-block-prisma-image--align-full .pr-image__figure' +
      '{max-width: 100%;margin-left: auto;margin-right: auto}' +
      `.entry-content ul, .entry-content ol{padding: revert;margin: revert;padding-${c.rtl ? 'right' : 'left'}: 20px}` +
      '.entry-content ul.wc-block-product-template{padding: 0}';
    return css;
  },
};
