/**
 * Title area of the search results: the description box (layout 1) or the
 * banner (layout 2) with alignment, height, spacing, background, fonts and
 * colors of text and title.
 */
import { isSearch } from '../../core/context.js';
import {
  cssValue,
  fontArrayCss,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  tablet,
  type Rules,
} from '../../core/css.js';
import { at, esc, isset } from '../../core/php.js';
import { deviceFont, flipRtl, withUnit } from '../lib/footer-global.js';
import {
  BANNER_PADDING,
  box,
  TITLE_FONT_SIZE,
  TITLE_FONT_WEIGHT,
} from './post_single_structure.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'special_archive',
  run(o, c) {
    if (!isSearch(c)) return '';
    const key = (k: string) => `section-search-page-title-${k}`;
    const layout = o.get(key('layout'), 'layout-1');
    const layout2 = layout === 'layout-2';
    const sel = layout2
      ? '.search .zn-archive-entry-banner'
      : '.search .zn-container section.zn-archive-description';
    const align = o.get(key('horizontal-alignment'));
    const alignOf = (d: string) => {
      const v = isset(align, d) ? at(align, d) : '';
      return flipRtl(c, layout === 'layout-1' && v === '' ? 'left' : v);
    };
    const gap = o.get(key('elements-gap'), 10);
    const bannerPadding = o.get(key('banner-padding'), BANNER_PADDING);
    const bannerMargin = o.get(key('banner-margin'));
    const height = o.get(key('banner-height'));
    const heightOf = (d: string) =>
      layout2 && isset(height, d) ? cssValue(at(height, d), 'px') : '';
    const vertical = layout2 ? o.get(key('vertical-alignment'), 'center') : 'center';
    const widthType = o.get(key('banner-width-type'), 'fullwidth');
    const customWidth = o.get(key('banner-custom-width'), 1200);
    const bgType = o.get(key('banner-image-type'), 'none');
    const textSize = o.get(key('text-font-size'));
    const titleSize = o.get(key('title-font-size'), TITLE_FONT_SIZE);
    const narrowWidth = o.get('narrow-container-max-width', 750);
    const textFont = fontArrayCss(
      o,
      o.get(key('text-font-family')),
      o.get(key('text-font-weight')),
      textSize,
      key('text-font-extras'),
      o.get(key('banner-text-color')),
    );
    const titleFont = fontArrayCss(
      o,
      o.get(key('title-font-family')),
      o.get(key('title-font-weight'), TITLE_FONT_WEIGHT),
      titleSize,
      key('title-font-extras'),
      o.get(key('banner-title-color')),
    );
    const link = esc(o.get(key('banner-link-color')));
    const hover = esc(o.get(key('banner-link-hover-color')));
    const custom = o.get(key('banner-custom-bg'));

    let desktop: Rules;
    let minTablet: Rules = {};
    let tab: Rules;
    let mob: Rules;
    if (layout === 'layout-1') {
      desktop = {
        [sel]: {
          'max-width': withUnit(o.get('site-content-width', 1200), 'px'),
          width: '100%',
          'text-align': alignOf('desktop'),
          ...box('padding', bannerPadding, 'desktop'),
          ...box('margin', bannerMargin, 'desktop', ['top', 'bottom', 'left', 'right']),
        },
        [`${sel} *`]: textFont,
        [`${sel} h1, ${sel} h1 *`]: titleFont,
        [`${sel} a, ${sel} a *`]: { color: link },
        [`${sel} a:hover, ${sel} a:hover *`]: { color: hover },
        [`${sel} > *:not(:last-child)`]: { 'margin-bottom': withUnit(gap, 'px') },
      };
      const small = (d: string): Rules => ({
        [sel]: {
          'text-align': alignOf(d),
          ...box('padding', bannerPadding, d),
          ...box('margin', bannerMargin, d),
        },
        [`${sel} h1`]: { 'font-size': deviceFont(o, titleSize, d) },
        [`${sel} *`]: { 'font-size': deviceFont(o, textSize, d) },
      });
      tab = small('tablet');
      mob = small('mobile');
      if (bgType !== 'none') {
        desktop['.search section.zn-archive-description'] = responsiveBackgroundObj(
          o,
          custom,
          'desktop',
        );
        tab['.search section.zn-archive-description'] = responsiveBackgroundObj(
          o,
          custom,
          'tablet',
        );
        mob['.search section.zn-archive-description'] = responsiveBackgroundObj(
          o,
          custom,
          'mobile',
        );
      }
    } else {
      desktop = {
        [sel]: {
          'text-align': alignOf('desktop'),
          'justify-content': vertical,
          'min-height': heightOf('desktop'),
          ...box('margin', bannerMargin, 'desktop', ['top', 'bottom', 'left', 'right']),
          ...box('padding', bannerPadding, 'desktop'),
        },
        [`${sel} .zn-container`]: { width: '100%' },
        [`${sel} .zn-container *`]: textFont,
        [`${sel} .zn-container h1, ${sel} .zn-container h1 *`]: titleFont,
        [`${sel} .zn-container h1`]: { 'margin-bottom': '0' },
        [`.zn-page-builder-template ${sel} .zn-container`]: { 'max-width': '100%' },
        [`.zn-narrow-container ${sel} .zn-container`]: { 'max-width': withUnit(narrowWidth, 'px') },
        [`${sel} .zn-container a, ${sel} .zn-container a *`]: { color: link },
        [`${sel} .zn-container a:hover, ${sel} .zn-container a:hover *`]: { color: hover },
        [`${sel} .zn-container > *:not(:last-child)`]: { 'margin-bottom': withUnit(gap, 'px') },
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
        ...(d === 'tablet'
          ? { [`${sel} .zn-container`]: { 'padding-left': '0', 'padding-right': '0' } }
          : {}),
        [`${sel} .zn-container h1`]: { 'font-size': deviceFont(o, titleSize, d) },
        [`${sel} *`]: { 'font-size': deviceFont(o, textSize, d) },
      });
      tab = small('tablet');
      mob = small('mobile');
      if (widthType === 'custom') {
        desktop[`${sel}[data-banner-width-type="custom"]`] = {
          'max-width': withUnit(customWidth, 'px'),
        };
      }
      if (bgType === 'custom') {
        const k = `${sel}[data-banner-background-type="custom"]`;
        desktop[k] = responsiveBackgroundObj(o, custom, 'desktop');
        tab[k] = responsiveBackgroundObj(o, custom, 'tablet');
        mob[k] = responsiveBackgroundObj(o, custom, 'mobile');
      }
    }
    return (
      parseCss(desktop) +
      parseCss(minTablet, tablet('', 1)) +
      parseCss(tab, '', tablet()) +
      parseCss(mob, '', mobile()) +
      '.zn-archive-entry-banner{-js-display: flex;display: flex;flex-direction: column;justify-content: center;' +
      'text-align: center;position: relative;background: var(--zn-title-layout-bg)}' +
      '.zn-archive-entry-banner[data-banner-width-type="custom"]{margin: 0 auto;width: 100%}' +
      `.zn-archive-entry-banner[data-banner-layout="layout-1"]{background: inherit;padding: 20px 0;text-align: ${String(flipRtl(c, 'left'))}}`
    );
  },
};
