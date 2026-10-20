/**
 * Block and layout rules: centered buttons, spacing of entries, outline
 * (secondary) buttons, widget titles and the default page structure.
 */
import { isSearch, isSingle, isSingular, meta, type Ctx } from '../../core/context.js';
import {
  cssValue,
  fontCssValue,
  fontFamily,
  mobile,
  parseCss,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, blank, empty, esc, isset, rec, str } from '../../core/php.js';
import { fgColor, fontExtra, isTransparentHeader, respFont, truthy } from './main.js';
import type { MainVars } from './main-vars.js';

/** A button border width, or nothing when it is empty or `'0'`. */
function borderWidth(size: unknown, side: string): string {
  const v = at(size, side);
  return isset(size, side) && v !== '' && v !== '0' ? cssValue(v, 'px') : '';
}

/** Rules from the centered buttons block to the default page structure. */
export function blocksCss(o: Options, c: Ctx, v: MainVars): string {
  let css = parseCss({ '.wp-block-buttons.aligncenter': { 'justify-content': 'center' } });
  if (isSingular(c)) {
    css += parseCss(
      {
        '.zn-theme-transparent-header #primary, .zn-theme-transparent-header #secondary': {
          padding: 0,
        },
      },
      '',
      tablet(),
    );
    css += parseCss({ '.zn-plain-container.zn-no-sidebar #primary': { padding: 0 } }, '', tablet());
    css += parseCss({
      '.zn-plain-container.zn-no-sidebar #primary': { 'margin-top': '0', 'margin-bottom': '0' },
    });
    if (meta(o, c, 'site-post-title', '', true) !== 'disabled' && !isTransparentHeader(o, c)) {
      css += parseCss(
        {
          '.zn-plain-container.zn-no-sidebar #primary': {
            'margin-top': '60px',
            'margin-bottom': '60px',
          },
        },
        '1200',
      );
    }
  }

  const spacing = o.get('single-post-outside-spacing');
  const sides = (d: string) => ({
    'padding-left': responsiveSpacing(spacing, 'left', d),
    'padding-right': responsiveSpacing(spacing, 'right', d),
  });
  const primary =
    '.zn-separate-container.zn-single-post #primary, .zn-narrow-container.zn-single-post #primary';
  css += parseCss({ [primary]: sides('tablet') }, '', tablet());
  css += parseCss({ [primary]: sides('mobile') }, '', mobile());
  const top = {
    '.zn-separate-container #primary, .zn-narrow-container #primary': {
      'padding-top': cssValue(0, 'px'),
    },
  };
  const bottom = {
    '.zn-separate-container #primary, .zn-narrow-container #primary': {
      'padding-bottom': cssValue(0, 'px'),
    },
  };
  const has = (d: string) => isset(spacing, d, 'top') && !blank(at(spacing, d, 'top'));
  if (has('desktop')) css += parseCss(top);
  if (has('tablet')) css += parseCss(top, '', tablet());
  if (has('mobile')) css += parseCss(top, '', mobile());
  if (has('desktop')) css += parseCss(bottom);
  if (has('tablet')) css += parseCss(bottom, '', tablet());
  if (has('mobile')) css += parseCss(bottom, '', mobile());

  // Outline buttons of the block editor and the current page number.
  const size = o.get('theme-button-border-group-border-size');
  const bw = (s: string) => borderWidth(size, s);
  css += parseCss({
    '.wp-block-button.is-style-outline .wp-block-button__link': {
      'border-color': empty(v.btnBorderColor) ? esc(v.btnBgColor) : esc(v.btnBorderColor),
      'border-top-width': esc(bw('top')),
      'border-right-width': esc(bw('right')),
      'border-bottom-width': esc(bw('bottom')),
      'border-left-width': esc(bw('left')),
    },
    'div.wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color), div.wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color)':
      { color: empty(v.btnBorderColor) ? esc(v.btnBgColor) : esc(v.btnBorderColor) },
    '.wp-block-button.is-style-outline .wp-block-button__link:hover, .wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link:focus, .wp-block-buttons .wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color):hover, .wp-block-buttons .wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color):hover':
      {
        color: esc(v.btnTextHoverColor),
        'background-color': esc(v.btnBgHoverColor),
        'border-color': empty(v.btnBorderHoverColor)
          ? esc(v.btnBgHoverColor)
          : esc(v.btnBorderHoverColor),
      },
    '.post-page-numbers.current .page-link, .zn-pagination .page-numbers.current': {
      color: fgColor(o, v.themeColor),
      'border-color': esc(v.themeColor),
      'background-color': esc(v.themeColor),
    },
  });
  css += parseCss({
    '.wp-block-button.is-style-outline .wp-block-button__link': {
      'border-top-width': esc(bw('top')),
      'border-right-width': esc(bw('right')),
      'border-bottom-width': esc(bw('bottom')),
      'border-left-width': esc(bw('left')),
    },
  });
  css += secondaryButtonCss(o, v);

  css += parseCss({ '.entry-content[data-zn-blocks-layout] > figure': { 'margin-bottom': '1em' } });
  css += parseCss({
    'h1.widget-title': { 'font-weight': esc(v.h[1]!.weight) },
    'h2.widget-title': { 'font-weight': esc(v.h[2]!.weight) },
    'h3.widget-title': { 'font-weight': esc(v.h[3]!.weight) },
  });

  const align = o.get('shop-product-align-responsive');
  if (at(align, 'desktop') === 'align-center' && o.get('shop-style') !== 'shop-page-list-style') {
    css += parseCss({
      ' .zn-desktop .review-count': { 'margin-left': '-40px', 'margin-right': 'auto' },
    });
  }
  return css + structureCss(o, c);
}

/** Outline (secondary) buttons: colors, borders, font, padding and radius per device. */
function secondaryButtonCss(o: Options, v: MainVars): string {
  let textColor = o.get('secondary-button-color');
  const borderColor = o.get('secondary-theme-button-border-group-border-color');
  const borderHoverColor = o.get('secondary-theme-button-border-group-border-h-color');
  const size = o.get('secondary-theme-button-border-group-border-size');
  const top = borderWidth(size, 'top');
  const right = borderWidth(size, 'right');
  const left = borderWidth(size, 'left');
  const bottom = borderWidth(size, 'bottom');
  const fontSize = o.get('secondary-font-size-button');
  const extras = o.get('secondary-font-extras-button');
  const transform = fontExtra(extras, 'text-transform');
  const lineHeight = fontExtra(extras, 'line-height', 'line-height-unit');
  const spacing = fontExtra(extras, 'letter-spacing', 'letter-spacing-unit');
  const decoration = fontExtra(extras, 'text-decoration');
  const padding = o.get('secondary-theme-button-padding');
  const radius = o.get('secondary-button-radius-fields');
  let bgColor = o.get('secondary-button-bg-color');
  const bgHoverColor = o.get('secondary-button-bg-h-color');
  const textHoverColor = o.get('secondary-button-h-color');
  const wide =
    '.wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link.wp-element-button, .zn-outline-button, .wp-block-prisma-button .pr-button__link.zn-outline-button';
  let selector =
    '.wp-block-button.is-style-outline .wp-block-button__link.wp-element-button, .zn-outline-button';
  const pad = (s: string, d = 'desktop') => responsiveSpacing(padding, s, d);
  const mainBorder = empty(v.btnBorderColor) ? esc(v.btnBgColor) : esc(v.btnBorderColor);
  let colorVal: unknown = empty(textColor) ? mainBorder : textColor;
  let borderColorVal: unknown =
    empty(borderColor) && empty(bgColor)
      ? mainBorder
      : empty(borderColor)
        ? esc(bgColor)
        : esc(borderColor);
  const borderHoverVal = empty(borderHoverColor)
    ? empty(v.btnBorderHoverColor)
      ? esc(v.btnBgHoverColor)
      : esc(v.btnBorderHoverColor)
    : borderHoverColor;
  let bt = '';
  let br = '';
  let bb = '';
  let bl = '';
  if (top || right || left || bottom) {
    [bt, br, bb, bl] = [top, right, bottom, left];
    selector = wide;
  }
  if (pad('top') || pad('right') || pad('bottom') || pad('left')) selector = wide;
  const preset = o.get('secondary-button-preset-style');
  if (preset === 'button_04' || preset === 'button_05' || preset === 'button_06') {
    if (empty(borderColor)) borderColorVal = bgColor;
    if (o.get('secondary-button-bg-color') === '' && o.get('secondary-button-color') === '')
      colorVal = v.themeColor;
    else if (o.get('secondary-button-color') === '') colorVal = bgColor;
    bgColor = 'transparent';
  }
  const radii = (d: string) => ({
    'border-top-left-radius': responsiveSpacing(radius, 'top', d),
    'border-top-right-radius': responsiveSpacing(radius, 'right', d),
    'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
    'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
  });
  const fs = rec(fontSize);
  const desktop: Rules = {
    [selector]: {
      'border-color': esc(borderColorVal),
      'border-top-width': esc(bt),
      'border-right-width': esc(br),
      'border-bottom-width': esc(bb),
      'border-left-width': esc(bl),
      'font-family': fontFamily(o.get('secondary-font-family-button')),
      'font-weight': esc(o.get('secondary-font-weight-button')),
      'font-size':
        isset(fs, 'desktop') && isset(fs, 'desktop-unit') && typeof fontSize === 'object'
          ? fontCssValue(o, fs.desktop, str(fs['desktop-unit']))
          : '',
      'line-height': esc(lineHeight),
      'text-transform': esc(transform),
      'text-decoration': esc(decoration),
      'letter-spacing': esc(spacing),
      'padding-top': pad('top'),
      'padding-right': pad('right'),
      'padding-bottom': pad('bottom'),
      'padding-left': pad('left'),
      ...radii('desktop'),
    },
    '.wp-block-buttons .wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color), .wp-block-buttons .wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color), .zn-outline-button':
      { color: esc(colorVal) },
    '.wp-block-button.is-style-outline .wp-block-button__link:hover, .wp-block-buttons .wp-block-button.is-style-outline .wp-block-button__link:focus, .wp-block-buttons .wp-block-button.is-style-outline > .wp-block-button__link:not(.has-text-color):hover, .wp-block-buttons .wp-block-button.wp-block-button__link.is-style-outline:not(.has-text-color):hover, .zn-outline-button:hover, .zn-outline-button:focus, .wp-block-prisma-button .pr-button__link.zn-outline-button:hover, .wp-block-prisma-button .pr-button__link.zn-outline-button:focus':
      {
        color: empty(textHoverColor) ? esc(v.btnTextHoverColor) : esc(textHoverColor),
        'background-color': empty(bgHoverColor) ? esc(v.btnBgHoverColor) : esc(bgHoverColor),
        'border-color': esc(borderHoverVal),
      },
  };
  if (truthy(o.get('underline-content-links'))) {
    desktop[
      '.zn-single-post .entry-content a.zn-outline-button, .zn-single-post .entry-content .is-style-outline>.wp-block-button__link'
    ] = {
      'text-decoration': decoration === '' || decoration === 'initial' ? 'none' : esc(decoration),
    };
  }
  const device = (d: string): Rules => ({
    [selector]: {
      'font-size': respFont(o, fontSize, d),
      'padding-top': pad('top', d),
      'padding-right': pad('right', d),
      'padding-bottom': pad('bottom', d),
      'padding-left': pad('left', d),
      ...radii(d),
    },
  });
  desktop[
    '.wp-block-button .wp-block-button__link.wp-element-button.is-style-outline:not(.has-background), .wp-block-button.is-style-outline>.wp-block-button__link.wp-element-button:not(.has-background), .zn-outline-button'
  ] = { 'background-color': empty(bgColor) ? 'transparent' : esc(bgColor) };
  if (preset === 'button_01' || preset === 'button_02' || preset === 'button_03') {
    if (empty(textColor)) textColor = fgColor(o, v.themeColor);
    desktop[
      '.wp-block-buttons .wp-block-button .wp-block-button__link.is-style-outline:not(.has-background), .wp-block-buttons .wp-block-button.is-style-outline>.wp-block-button__link:not(.has-background), .zn-outline-button'
    ] = {
      'background-color': empty(bgColor) ? esc(v.themeColor) : esc(bgColor),
      color: esc(textColor),
    };
  }
  desktop['.pr-button__link.zn-outline-button'] = { 'border-radius': '9999px' };
  return (
    parseCss(desktop) +
    parseCss(device('tablet'), '', tablet()) +
    parseCss(device('mobile'), '', mobile())
  );
}

/** The default page structure: full-height page, titles, comments form, 404 and search pages. */
function structureCss(o: Options, c: Ctx): string {
  const left = c.rtl ? 'right' : 'left';
  const right = c.rtl ? 'left' : 'right';
  const rules: Rules = {
    '#page': { display: 'flex', 'flex-direction': 'column', 'min-height': '100vh' },
    '.zn-404-layout-1 h1.page-title': { color: 'var(--zn-global-color-2)' },
    '.single .post-navigation a': { 'line-height': '1em', height: 'inherit' },
    '.error-404 .page-sub-title': { 'font-size': '1.5rem', 'font-weight': 'inherit' },
    '.search .site-content .content-area .search-form': { 'margin-bottom': '0' },
    '#page .site-content': { 'flex-grow': '1' },
    '.widget': { 'margin-bottom': '1.25em' },
    '#secondary li': { 'line-height': '1.5em' },
    '#secondary .wp-block-group h2': { 'margin-bottom': '0.7em' },
    '#secondary h2': { 'font-size': '1.7rem' },
    '.zn-separate-container .zn-article-post, .zn-separate-container .zn-article-single, .zn-separate-container .comment-respond':
      {
        padding: isSingle(c) ? '2.5em' : '3em',
      },
    '.zn-separate-container .zn-article-single .zn-article-single': { padding: '0' },
    '.zn-article-single .wp-block-post-template-is-layout-grid': { [`padding-${left}`]: '0' },
    '.zn-separate-container .comments-title, .zn-narrow-container .comments-title': {
      padding: '1.5em 2em',
    },
    '.zn-page-builder-template .comment-form-textarea, .zn-comment-formwrap .zn-grid-common-col': {
      padding: '0',
    },
    '.zn-comment-formwrap': {
      padding: '0',
      display: 'inline-flex',
      'column-gap': '20px',
      width: '100%',
      'margin-left': '0',
      'margin-right': '0',
    },
    '.comments-area textarea#comment:focus, .comments-area textarea#comment:active, .comments-area .zn-comment-formwrap input[type="text"]:focus, .comments-area .zn-comment-formwrap input[type="text"]:active ':
      { 'box-shadow': 'none', outline: 'none' },
    '.archive.zn-page-builder-template .entry-header': { 'margin-top': '2em' },
    '.zn-page-builder-template .zn-comment-formwrap': { width: '100%' },
    '.entry-title': { 'margin-bottom': '0.6em' },
    '.zn-archive-description p': {
      'font-size': 'inherit',
      'font-weight': 'inherit',
      'line-height': 'inherit',
    },
  };
  if (isSingle(c) && truthy(o.get('single-content-images-shadow', false))) {
    rules['.zn-article-single figure, .zn-article-single img:not(figure img)'] = {
      'box-shadow': '0 0 30px 0 rgba(0,0,0,.15)',
      '-webkit-box-shadow': '0 0 30px 0 rgba(0,0,0,.15)',
      '-moz-box-shadow': '0 0 30px 0 rgba(0,0,0,.15)',
    };
  }
  rules['.zn-separate-container .zn-comment-list li.depth-1, .hentry'] = {
    'margin-bottom': '1.5em',
  };
  rules['.site-content section.zn-archive-description'] = { 'margin-bottom': '2em' };
  if (isSearch(c)) {
    rules['.no-results'] = { 'text-align': 'center' };
    rules['.no-results .search-form'] = { 'max-width': '370px', margin: '0 auto' };
    rules['.no-results .search-field'] = { width: '100%' };
    rules['.search .site-main .no-results .zn-search-submit'] = { display: 'block' };
    rules['.search .site-main .no-results .zn-live-search-results'] = { 'max-height': '200px' };
  }
  let css = parseCss(rules);
  css += parseCss(
    {
      '.zn-left-sidebar.zn-page-builder-template #secondary, .archive.zn-right-sidebar.zn-page-builder-template .site-main':
        {
          [`padding-${left}`]: '20px',
          [`padding-${right}`]: '20px',
        },
    },
    tablet(),
  );
  css += parseCss(
    {
      '.zn-comment-formwrap.zn-row': { 'column-gap': '10px', display: 'inline-block' },
      '#zn-commentform .zn-grid-common-col': { position: 'relative', width: '100%' },
    },
    '',
    mobile(),
  );
  css += parseCss(
    {
      '.zn-separate-container .zn-article-post, .zn-separate-container .zn-article-single, .zn-separate-container .zn-author-box, .zn-separate-container .zn-404-layout-1, .zn-separate-container .no-results':
        { padding: isSingle(c) ? '2.5em' : '3em' },
    },
    '1201',
  );
  if (c.isAuthor) {
    css += parseCss({ '.zn-author-box img.avatar': { margin: '0' } });
    css += parseCss(
      {
        '.zn-author-box img.avatar': { width: '100px', height: '100px' },
        '.zn-author-box': { 'column-gap': '50px' },
      },
      tablet(),
    );
    css += parseCss({ '.zn-author-avatar': { 'margin-top': '20px' } }, '', tablet());
    css += parseCss({ '.zn-author-box': { 'align-items': 'center' } }, tablet('', 1));
  }
  css += parseCss(
    {
      '.zn-left-sidebar #content > .zn-container': {
        display: 'flex',
        'flex-direction': 'column-reverse',
        width: '100%',
      },
    },
    '',
    tablet(),
  );
  return css;
}
