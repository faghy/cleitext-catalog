/**
 * Tablet and mobile fonts: body, site title and tagline, entry titles,
 * headings, logo sizes, the root font size, the container widths.
 */
import { contentLayout, type Ctx } from '../../core/context.js';
import {
  cssValue,
  fontCssValue,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, blank, intval, isset, num, rec } from '../../core/php.js';
import { headings } from './main-global.js';
import { siteBackground } from './main-buttons.js';
import { respFont, truthy } from './main.js';
import type { MainVars } from './main-vars.js';

/** Fonts, logo and background per device, root font size, container widths. */
export function typoCss(o: Options, c: Ctx, v: MainVars): string {
  const body = rec(v.bodyFontSize);
  const title = o.get('display-site-title-responsive');
  const tagline = o.get('display-site-tagline-responsive');
  const radius = o.get('post-card-border-radius');
  const logo = v.logoWidth;
  const bg = siteBackground(o, c);
  const cards =
    v.blogLayout === 'blog-layout-4'
      ? '.archive .zn-article-post .zn-article-inner, .blog .zn-article-post .zn-article-inner'
      : '.archive .zn-article-post, .zn-article-post .post-thumb-img-content, .zn-blog-layout-6-grid .zn-article-inner .post-thumb::after, .blog .zn-article-post';
  const svgHeight =
    '.zenit-logo-svg:not(.sticky-custom-logo .zenit-logo-svg, .transparent-custom-logo .zenit-logo-svg, .advanced-header-logo .zenit-logo-svg)';
  const common = (d: 'tablet' | 'mobile'): Rules => ({
    'body, button, input, select, textarea, .zn-button, .zn-custom-button': {
      'font-size': respFont(o, v.bodyFontSize, d),
    },
    '#secondary, #secondary button, #secondary input, #secondary select, #secondary textarea': {
      'font-size': respFont(o, v.bodyFontSize, d),
    },
    '.site-title': {
      'font-size': respFont(o, o.get('font-size-site-title'), d),
      display: truthy(at(title, d)) ? 'block' : 'none',
    },
    '.site-header .site-description': {
      'font-size': respFont(o, o.get('font-size-site-tagline'), d),
      display: truthy(at(tagline, d)) ? 'block' : 'none',
    },
    '.entry-title': { 'font-size': respFont(o, o.get('font-size-page-title'), d) },
    '.zn-blog-single-element.zn-taxonomy-container a': {
      'font-size': respFont(o, o.get('font-size-post-tax'), d),
    },
    '.zn-blog-meta-container': { 'font-size': respFont(o, o.get('font-size-post-meta'), d) },
    [cards]: {
      'border-top-left-radius': responsiveSpacing(radius, 'top', d),
      'border-top-right-radius': responsiveSpacing(radius, 'right', d),
      'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
      'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
    },
    ...Object.fromEntries(
      [1, 2, 3, 4, 5, 6].map((n) => [
        headings(
          o,
          `h${n}, .entry-content :where(h${n}), .entry-content :where(h${n}) a`,
          `h${n}, .entry-content :where(h${n})`,
        ),
        { 'font-size': respFont(o, o.get(`font-size-h${n}`), d) },
      ]),
    ),
  });
  const svg = (d: string) => ({
    height: cssValue(truthy(logo[`${d}-svg-height`]) ? logo[`${d}-svg-height`] : '', 'px'),
  });

  const tabletRules: Rules = {};
  if (isset(body, 'tablet') && !blank(body.tablet)) {
    tabletRules['.widget-title'] = {
      'font-size': fontCssValue(o, intval(body.tablet) * 1.428571429, 'px', 'tablet'),
    };
  }
  Object.assign(tabletRules, common('tablet'), {
    '.zenit-logo-svg': { width: cssValue(logo.tablet, 'px') },
    [svgHeight]: svg('tablet'),
    'header .custom-logo-link img, .zn-header-break-point .site-logo-img .custom-mobile-logo-link img':
      {
        'max-width': cssValue(logo.tablet, 'px'),
        width: cssValue(logo.tablet, 'px'),
      },
    'body, .zn-separate-container': responsiveBackgroundObj(o, bg, 'tablet'),
  });
  let css = parseCss(tabletRules, '', tablet());

  const mobileRules: Rules = {};
  if (isset(body, 'mobile') && body.mobile !== '') {
    mobileRules['.widget-title'] = {
      'font-size': fontCssValue(o, intval(body.mobile) * 1.428571429, 'px', 'mobile'),
    };
  }
  Object.assign(mobileRules, common('mobile'), {
    'header .custom-logo-link img, .zn-header-break-point .site-branding img, .zn-header-break-point .custom-logo-link img':
      {
        'max-width': cssValue(logo.mobile, 'px'),
        width: cssValue(logo.mobile, 'px'),
      },
    '.zenit-logo-svg': { width: cssValue(logo.mobile, 'px') },
    [svgHeight]: svg('mobile'),
    '.zn-header-break-point .site-logo-img .custom-mobile-logo-link img': {
      'max-width': cssValue(logo.mobile, 'px'),
    },
    'body, .zn-separate-container': responsiveBackgroundObj(o, bg, 'mobile'),
  });
  css += parseCss(mobileRules, '', mobile());

  const root = intval(v.bodyDesktopSize);
  if (blank(body.tablet))
    css += parseCss({ html: { 'font-size': fontCssValue(o, root * 5.7, '%') } }, '', tablet());
  css += parseCss(
    { html: { 'font-size': fontCssValue(o, root * (blank(body.mobile) ? 5.7 : 6.25), '%') } },
    '',
    mobile(),
  );
  css += parseCss(
    { '.zn-container': { 'max-width': cssValue(num(Number(v.siteContentWidth) + 40), 'px') } },
    tablet('', 1),
  );
  const narrow = contentLayout(o, c) === 'narrow-container';
  if (narrow) {
    const rule = parseCss(
      {
        '.zn-narrow-container .site-content > .zn-container': {
          'max-width': cssValue(v.narrowWidth, 'px'),
        },
      },
      tablet('', 1),
    );
    css += rule + rule;
  }
  css += parseCss({ '.site-content .zn-container': { display: 'flex' } }, tablet('', 1));
  css += parseCss({ '.site-content .zn-container': { 'flex-direction': 'column' } }, '', tablet());
  return css;
}
