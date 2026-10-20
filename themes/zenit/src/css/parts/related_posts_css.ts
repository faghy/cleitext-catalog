/**
 * Related posts: grid columns per device, date badge, section background,
 * fonts and colors of the section title, post titles, meta and excerpt,
 * image ratio, category and tag badges, section spacing and border.
 */
import {
  cssValue,
  fontArrayCss,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  tablet,
  type Rules,
} from '../../core/css.js';
import { at, empty, esc, isset } from '../../core/php.js';
import { innerSectionCss } from '../base.js';
import {
  aspectRatio,
  deviceFont,
  GRID_SIZE,
  relatedPostsShown,
  textOn,
} from '../lib/footer-global.js';
import type { Part } from './index.js';

const TITLE =
  '.zn-related-post-content .entry-header .zn-related-post-title, .zn-related-post-content .entry-header .zn-related-post-title a';
const BADGE =
  '.zn-related-cat-style--badge .cat-links > a, .zn-related-tag-style--badge .tags-links > a';

export const part: Part = {
  name: 'related_posts_css',
  run(o, c) {
    if (!relatedPostsShown(o, c)) return '';
    const link = o.get('link-color');
    let titleAlign = o.get('releted-posts-title-alignment');
    if (c.rtl && titleAlign !== 'center') titleAlign = titleAlign === 'left' ? 'right' : 'left';
    const grid = o.get('related-posts-grid-responsive');
    const cols = (d: string, def: string) => GRID_SIZE[String(isset(grid, d) ? at(grid, d) : def)];
    const titleSize = o.get('related-posts-title-font-size');
    const metaSize = o.get('related-posts-meta-font-size');
    const contentSize = o.get('related-posts-content-font-size');
    const sectionSize = o.get('related-posts-section-title-font-size');
    const contentBg = o.get('content-bg-obj-responsive');
    const textColor = o.get('related-posts-text-color');
    const ratioType = o.get('related-posts-image-ratio-type', '');
    const font = (key: string, size: unknown, color: unknown = '') =>
      fontArrayCss(
        o,
        o.get(`${key}-font-family`),
        o.get(`${key}-font-weight`),
        size,
        `${key}-font-extras`,
        color,
      );

    const desktop: Rules = {
      '.zn-single-related-posts-container .zn-related-posts-wrapper': {
        'grid-template-columns': cols('desktop', '2-equal'),
      },
      '.zn-related-posts-inner-section .zn-date-meta .posted-on, .zn-related-posts-inner-section .zn-date-meta .posted-on *':
        {
          background: esc(link),
          color: textOn(o, link),
        },
      '.zn-related-posts-inner-section .zn-date-meta .posted-on .date-month, .zn-related-posts-inner-section .zn-date-meta .posted-on .date-year':
        { color: textOn(o, link) },
      '.zn-single-related-posts-container': {},
      '.zn-related-posts-title': font(
        'related-posts-section-title',
        sectionSize,
        o.get('related-posts-title-color'),
      ),
      '.zn-related-posts-title-section .zn-related-posts-title': { 'text-align': esc(titleAlign) },
      [TITLE]: font('related-posts-title', titleSize, textColor),
      '.zn-related-post-content .entry-meta, .zn-related-post-content .entry-meta *': font(
        'related-posts-meta',
        metaSize,
        o.get('related-posts-meta-color'),
      ),
      '.zn-related-post-content .entry-meta a:hover, .zn-related-post-content .entry-meta span a span:hover':
        {
          color: esc(o.get('related-posts-meta-link-hover-color')),
        },
      '.zn-related-post-cta a': { color: esc(o.get('related-posts-link-color')) },
      '.zn-related-post-cta a:hover': { color: esc(o.get('related-posts-link-hover-color')) },
      '.zn-related-post-excerpt': font('related-posts-content', contentSize, textColor),
      '.zn-related-post-content .post-thumb-img-content img': {
        'aspect-ratio': aspectRatio(
          ratioType,
          o.get('related-posts-image-ratio-pre-scale'),
          o.get('related-posts-image-custom-scale-width', 16),
          o.get('related-posts-image-custom-scale-height', 9),
        ),
        width: ratioType === 'predefined' || ratioType === 'custom' ? '100%' : '',
        'object-fit': ratioType === 'custom' ? 'cover' : '',
      },
      '.zn-related-post-content .zn-author-avatar': {
        '--zn-author-avatar-size': cssValue(o.get('related-posts-author-avatar-size'), 'px'),
      },
    };
    // The section background: the option, else the content background.
    const bg = o.get('related-posts-background-color', contentBg);
    const bgRule = () =>
      typeof bg === 'object' && bg !== null
        ? responsiveBackgroundObj(o, bg, 'desktop')
        : { 'background-color': esc(bg) };
    desktop['.zn-single-related-posts-container'] = bgRule();

    let btnText = o.get('button-color', '#fff');
    let btnBorder = o.get('theme-button-border-group-border-color');
    const btnBorderHover = o.get('theme-button-border-group-border-h-color');
    const theme = o.get('theme-color');
    let btnBg = o.get('button-bg-color', theme);
    const btnTextHover = o.get('button-h-color', '#fff');
    const btnBgHover = o.get('button-bg-h-color', o.get('link-h-color'));
    const preset = o.get('button-preset-style');
    const size = o.get('theme-button-border-group-border-size');
    if (preset === 'button_04' || preset === 'button_05' || preset === 'button_06') {
      if (empty(btnBorder)) btnBorder = btnBg;
      if (o.get('button-bg-color') === '' && o.get('button-color') === '') btnText = theme;
      else if (o.get('button-color') === '') btnText = btnBg;
      btnBg = 'transparent';
    }
    const width = (side: string) =>
      isset(size, side) && at(size, side) !== '' ? cssValue(at(size, side), 'px') : '0';
    desktop[BADGE] = {
      'border-style': 'solid',
      'border-top-width': width('top'),
      'border-right-width': width('right'),
      'border-left-width': width('left'),
      'border-bottom-width': width('bottom'),
      padding: '4px 8px',
      'border-radius': '3px',
      'font-size': 'inherit',
      color: esc(btnText),
      'border-color': empty(btnBorder) ? esc(btnBg) : esc(btnBorder),
      'background-color': esc(btnBg),
    };
    desktop[BADGE.replace(/ > a/g, ' > a:hover')] = {
      color: esc(btnTextHover),
      'background-color': esc(btnBgHover),
      'border-color': empty(btnBorderHover) ? esc(btnBgHover) : esc(btnBorderHover),
    };
    desktop[
      '.zn-related-cat-style--underline .cat-links > a, .zn-related-tag-style--underline .tags-links > a'
    ] = {
      'text-decoration': 'underline',
    };

    const small = (d: string, def: string): Rules => ({
      ...(d === 'tablet'
        ? {
            '.zn-single-related-posts-container .zn-related-posts-wrapper .zn-related-post': {
              width: '100%',
            },
          }
        : {}),
      '.zn-single-related-posts-container .zn-related-posts-wrapper': {
        'grid-template-columns': cols(d, def),
      },
      [TITLE]: { 'font-size': deviceFont(o, titleSize, d) },
      '.zn-related-post-content .entry-meta *': { 'font-size': deviceFont(o, metaSize, d) },
      '.zn-related-post-excerpt': { 'font-size': deviceFont(o, contentSize, d) },
      '.zn-related-posts-title': { 'font-size': deviceFont(o, sectionSize, d) },
      // The desktop background again, as in the reference.
      '.zn-single-related-posts-container': bgRule(),
    });
    return (
      parseCss(desktop) +
      parseCss(small('tablet', '2-equal'), '', tablet()) +
      parseCss(small('mobile', 'full'), '', mobile()) +
      innerSectionCss(o, 'zn-sub-section-related-posts', '.site .zn-single-related-posts-container')
    );
  },
};
