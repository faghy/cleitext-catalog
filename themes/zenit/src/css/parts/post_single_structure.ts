/**
 * Entry title area of posts and pages: container spacing, then the title
 * header (layout 1, inside the content) or the banner (layout 2): alignment,
 * height, spacing, background, fonts and colors of text, title and meta,
 * featured image ratio and padding.
 */
import { isSingular } from '../../core/context.js';
import {
  cssValue,
  fontArrayCss,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import { at, empty, esc, isset } from '../../core/php.js';
import { aspectRatio, deviceFont, entryType, flipRtl, withUnit } from '../lib/footer-global.js';
import type { Part } from './index.js';

/** Defaults of the banner options shared by the title areas. */
export const BANNER_PADDING = {
  desktop: { top: 3, right: 3, bottom: 3, left: 3 },
  tablet: { top: '', right: '', bottom: '', left: '' },
  mobile: { top: '', right: '', bottom: '', left: '' },
  'desktop-unit': 'em',
  'tablet-unit': 'em',
  'mobile-unit': 'em',
};
export const TITLE_FONT_SIZE = {
  desktop: '32',
  tablet: '',
  mobile: '',
  'desktop-unit': 'px',
  'tablet-unit': 'px',
  'mobile-unit': 'px',
};
export const TITLE_FONT_WEIGHT = '600';
const BG_DEVICE = {
  'background-color': '',
  'background-image': '',
  'background-repeat': 'repeat',
  'background-position': 'center center',
  'background-size': 'auto',
  'background-attachment': 'scroll',
  'overlay-type': '',
  'overlay-color': '',
  'overlay-opacity': '',
  'overlay-gradient': '',
  'background-type': '',
  'background-media': '',
};
export const BANNER_BACKGROUND = { desktop: BG_DEVICE, tablet: BG_DEVICE, mobile: BG_DEVICE };

/** Margin, padding, top, bottom, left, right of a spacing option on one device. */
export const box = (
  prefix: string,
  value: unknown,
  d: string,
  order = ['top', 'right', 'bottom', 'left'],
) => Object.fromEntries(order.map((s) => [`${prefix}-${s}`, responsiveSpacing(value, s, d)]));

export const part: Part = {
  name: 'post_single_structure',
  run(o, c) {
    const type = entryType(c);
    if (!isSingular(c) || !['post', 'page'].includes(type)) return '';
    const sectionId = type === 'page' ? 'section-single-page' : `single-posttype-${type}`;
    const padding = o.get(type === 'post' ? 'single-post-inside-spacing' : `${sectionId}-padding`);
    const margin = o.get(type === 'post' ? 'single-post-outside-spacing' : `${sectionId}-margin`);
    const marginSel = '.site .site-content #primary';
    const paddingSel =
      '.site .site-content #primary .zn-article-single, .zn-separate-container .site-content #secondary .widget';
    const space = (d: string): Rules => ({
      [marginSel]: box('margin', margin, d, ['top', 'bottom', 'left', 'right']),
      [paddingSel]: box('padding', padding, d, ['top', 'bottom', 'left', 'right']),
    });
    let css =
      parseCss(space('desktop')) +
      parseCss(space('tablet'), '', tablet()) +
      parseCss(space('mobile'), '', mobile());

    if (o.get(`zn-single-${type}-title`, true) === false) return css;

    const key = (k: string) => `zn-dynamic-single-${type}-${k}`;
    const layout = o.get(key('layout'), 'layout-1');
    const layout2 = layout === 'layout-2';
    const exclude = !empty(o.get('enable-related-posts', false))
      ? ':not(.related-entry-header)'
      : '';
    const sel = layout2
      ? `.zn-single-entry-banner[data-post-type="${type}"]`
      : `header.entry-header${exclude}`;
    const align = o.get(key('horizontal-alignment'));
    const alignOf = (d: string) => {
      const v = isset(align, d) ? at(align, d) : '';
      return flipRtl(c, layout === 'layout-1' && v === '' ? 'left' : v);
    };
    const bannerPadding = o.get(key('banner-padding'), BANNER_PADDING);
    const bannerMargin = o.get(key('banner-margin'));
    const textColor = o.get(key('banner-text-color'));
    const titleColor = o.get(key('banner-title-color'));
    const linkColor = o.get(key('banner-link-color'));
    const linkHover = o.get(key('banner-link-hover-color'));
    const gap = o.get(key('elements-gap'), 10);
    const height = o.get(key('banner-height'));
    const heightOf = (d: string) =>
      layout2 && isset(height, d) ? cssValue(at(height, d), 'px') : '';
    const vertical = layout2 ? o.get(key('vertical-alignment'), 'center') : 'center';
    const widthType = o.get(key('banner-width-type'), 'fullwidth');
    const customWidth = o.get(key('banner-custom-width'), 1200);
    const textSize = o.get(key('text-font-size'));
    const titleSize = o.get(key('title-font-size'), TITLE_FONT_SIZE);
    const metaSize = o.get(key('meta-font-size'));
    const narrowWidth = o.get('narrow-container-max-width', 750);
    const ratioType = o.get(key('article-featured-image-ratio-type'), 'predefined');
    const ratio = aspectRatio(
      ratioType,
      o.get(key('article-featured-image-ratio-pre-scale'), '16/9'),
      o.get(key('article-featured-image-custom-scale-width'), 16),
      o.get(key('article-featured-image-custom-scale-height'), 9),
    );
    const fit = ratioType === 'custom' ? 'cover' : '';
    const full = ratioType !== 'default' ? '100%' : '';
    const textFont = fontArrayCss(
      o,
      o.get(key('text-font-family')),
      o.get(key('text-font-weight')),
      textSize,
      key('text-font-extras'),
      textColor,
    );
    const titleFont = fontArrayCss(
      o,
      o.get(key('title-font-family')),
      o.get(key('title-font-weight'), TITLE_FONT_WEIGHT),
      titleSize,
      key('title-font-extras'),
      titleColor,
    );
    const metaFont = fontArrayCss(
      o,
      o.get(key('meta-font-family')),
      o.get(key('meta-font-weight')),
      metaSize,
      key('meta-font-extras'),
    );
    const meta = `${sel} .entry-meta, ${sel} .entry-meta *`;

    let desktop: Rules;
    let minTablet: Rules = {};
    let tab: Rules;
    let mob: Rules;
    if (layout === 'layout-1') {
      desktop = {
        [sel]: { 'text-align': alignOf('desktop') },
        [`${sel} *`]: textFont,
        [`${sel} .entry-title`]: titleFont,
        [meta]: metaFont,
        [`${sel} a, ${sel} a *`]: { color: esc(linkColor) },
        [`${sel} a:hover, ${sel} a:hover *`]: { color: esc(linkHover) },
        [`${sel} > *:not(:last-child)`]: { 'margin-bottom': withUnit(gap, 'px') },
        [`${sel} .post-thumb-img-content`]: { 'text-align': 'center' },
        [`${sel} .post-thumb img, .zn-single-post-featured-section.post-thumb img`]: {
          'aspect-ratio': ratio,
          width: full,
          height: full,
          'object-fit': fit,
        },
      };
      const small = (d: string): Rules => ({
        [sel]: { 'text-align': alignOf(d) },
        [`${sel} .entry-title`]: { 'font-size': deviceFont(o, titleSize, d) },
        [`${sel} *`]: { 'font-size': deviceFont(o, textSize, d) },
        [meta]: { 'font-size': deviceFont(o, metaSize, d) },
      });
      tab = small('tablet');
      mob = small('mobile');
      const noPadding =
        !empty(o.get(key('remove-featured-padding'), false)) &&
        o.get(key('article-featured-image-position-layout-1')) === 'none';
      if (noPadding) {
        // Pull the featured image over the container's padding.
        const xlg = 'var(--zn-container-default-xlg-padding)';
        const pull = (rules: Rules, side: string, top: string) => {
          rules[`.zn-separate-container ${sel} .post-thumb`] = {
            'margin-left': `calc( -1 * ${side} )`,
          };
          rules[`.zn-separate-container ${sel} > *:first-child.post-thumb`] = {
            'margin-top': `calc( -1 * ${top} )`,
          };
          rules[`.zn-separate-container ${sel} .post-thumb`]!['margin-right'] =
            `calc( -1 * ${side} )`;
        };
        pull(desktop, xlg, xlg);
        pull(tab, xlg, xlg);
        pull(mob, '1em', '1.5em');
      }
    } else {
      const position = o.get(key('image-position'), 'inside');
      const background = o.get(key('banner-background'), BANNER_BACKGROUND);
      const banner = `${sel}[data-banner-layout="layout-2"]`;
      desktop = {
        [sel]: {
          'text-align': alignOf('desktop'),
          'justify-content': vertical,
          'min-height': heightOf('desktop'),
          ...box('margin', bannerMargin, 'desktop'),
          width: '100%',
          ...box('padding', bannerPadding, 'desktop'),
        },
        [banner]: responsiveBackgroundObj(o, background, 'desktop'),
        [`${sel} .zn-container *`]: textFont,
        [`${sel} .zn-container > *:not(:last-child), ${sel} .read-more`]: {
          'margin-bottom': withUnit(gap, 'px'),
        },
        [`${sel} .zn-container`]: { width: '100%' },
        [`${sel} .entry-title`]: titleFont,
        [`${sel} > .entry-title`]: { 'margin-bottom': '0' },
        [meta]: metaFont,
        [`${sel} .zn-container a, ${sel} .zn-container a *`]: { color: esc(linkColor) },
        [`${sel} .zn-container a:hover, ${sel} .zn-container a:hover *`]: { color: esc(linkHover) },
        '.zn-single-entry-banner .read-more .zn-button': {
          'margin-top': '0.5em',
          display: 'inline-block',
        },
        [`${sel} .post-thumb img, .zn-single-post-featured-section img`]: {
          'aspect-ratio': ratio,
          width: full,
          height: full,
          'object-fit': fit,
        },
        [`${sel} .zn-container > *:last-child`]: { 'margin-bottom': '0' },
      };
      minTablet = {
        [`.zn-narrow-container ${sel} .zn-container`]: {
          'max-width': withUnit(narrowWidth, 'px'),
          'padding-left': '0',
          'padding-right': '0',
        },
      };
      const small = (d: string): Rules => ({
        [sel]: {
          'text-align': alignOf(d),
          'min-height': heightOf(d),
          ...box('padding', bannerPadding, d),
          ...box('margin', bannerMargin, d),
        },
        [banner]: responsiveBackgroundObj(o, background, d),
        [`${sel} .entry-title`]: { 'font-size': deviceFont(o, titleSize, d) },
        ...(d === 'tablet'
          ? { [`${sel} .zn-container`]: { 'padding-left': '0', 'padding-right': '0' } }
          : {}),
        [`${sel} *`]: { 'font-size': deviceFont(o, textSize, d) },
        [meta]: { 'font-size': deviceFont(o, metaSize, d) },
      });
      tab = small('tablet');
      mob = small('mobile');
      if (layout2 && widthType === 'custom') {
        desktop[`${sel}[data-banner-width-type="custom"]`] = {
          'max-width': withUnit(customWidth, 'px'),
        };
      }
      // A featured image as banner background needs the entry's image, which the page context does not carry.
      if (position === 'outside')
        desktop['.single article .post-thumb'] = { 'margin-bottom': '2em' };
    }

    css +=
      '.zn-single-entry-banner{-js-display: flex;display: flex;flex-direction: column;justify-content: center;' +
      'text-align: center;position: relative;background: var(--zn-title-layout-bg)}' +
      `.zn-single-entry-banner[data-banner-layout="layout-1"]{max-width: ${cssValue(o.get('site-content-width', 1200), 'px')};` +
      'background: inherit;padding: 20px 0}' +
      '.zn-single-entry-banner[data-banner-width-type="custom"]{margin: 0 auto;width: 100%}' +
      '.zn-single-entry-banner + .site-content .entry-header{margin-bottom: 0}' +
      `.site .zn-author-avatar{--zn-author-avatar-size: ${cssValue(o.get(key('author-avatar-size')), 'px')}}` +
      'a.zn-underline-text{text-decoration: underline}' +
      '.zn-container > .zn-terms-link{position: relative;display: block}' +
      'a.zn-button.zn-badge-tax{padding: 4px 8px;border-radius: 3px;font-size: inherit}';
    return (
      css +
      parseCss(desktop) +
      parseCss(minTablet, tablet('', 1)) +
      parseCss(tab, '', tablet()) +
      parseCss(mob, '', mobile())
    );
  },
};
