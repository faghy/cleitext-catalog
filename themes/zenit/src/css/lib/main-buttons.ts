/**
 * Sidebar borders and spacing, the 404 page, the buttons (theme, block
 * editor, search and file blocks) per device, small-screen spacing and the
 * site background.
 */
import { is404, type Ctx } from '../../core/context.js';
import { isLoaded } from '../../core/builder.js';
import {
  cssValue,
  fontCssValue,
  fontFamily,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, empty, esc, isset, num, str } from '../../core/php.js';
import { fontExtra, respFont, truthy } from './main.js';
import type { MainVars } from './main-vars.js';

const BUTTONS =
  '.menu-toggle, button, .zn-button, .zn-custom-button, .button, input#submit, input[type="button"], input[type="submit"], input[type="reset"], #comments .submit, .search .search-submit, form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button, body .wp-block-file .wp-block-file__button, .search .search-submit';
const BUTTONS_HOVER =
  'button:focus, .menu-toggle:hover, button:hover, .zn-button:hover, .zn-custom-button:hover .button:hover, .zn-custom-button:hover , input[type=reset]:hover, input[type=reset]:focus, input#submit:hover, input#submit:focus, input[type="button"]:hover, input[type="button"]:focus, input[type="submit"]:hover, input[type="submit"]:focus, form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button:hover, form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button:focus, body .wp-block-file .wp-block-file__button:hover, body .wp-block-file .wp-block-file__button:focus';
const BLOCK_BUTTONS =
  '.wp-block-button .wp-block-button__link, .wp-block-search .wp-block-search__button, body .wp-block-file .wp-block-file__button';
const SMALL_BUTTONS =
  '.menu-toggle, button, .zn-button, .button, input#submit, input[type="button"], input[type="submit"], input[type="reset"]';

/** Sidebar layout rules, the 404 page and the buttons. */
export function buttonsCss(o: Options, c: Ctx, v: MainVars): string {
  const sidebar = v.sidebar !== 'no-sidebar';
  let css = '';
  if (sidebar) {
    css += parseCss(
      {
        '#secondary.secondary': { 'padding-top': 0 },
        '.zn-separate-container.zn-right-sidebar #secondary': {
          'padding-left': '1em',
          'padding-right': '1em',
        },
        '.zn-separate-container.zn-two-container #secondary': {
          'padding-left': 0,
          'padding-right': 0,
        },
        '.zn-page-builder-template .entry-header #secondary, .zn-page-builder-template #secondary':
          { 'margin-top': '1.5em' },
      },
      '',
      tablet(),
    );
    const rules: Rules = c.rtl
      ? {
          '.zn-right-sidebar #primary': { 'padding-left': 0 },
          '.zn-page-builder-template.zn-left-sidebar #secondary, zn-page-builder-template.zn-right-sidebar #secondary':
            {
              'padding-left': '20px',
              'padding-right': '20px',
            },
          '.zn-right-sidebar #secondary, .zn-left-sidebar #primary': { 'padding-right': 0 },
          '.zn-left-sidebar #secondary': { 'padding-left': 0 },
        }
      : {
          '.zn-right-sidebar #primary': { 'padding-right': 0 },
          '.zn-page-builder-template.zn-left-sidebar #secondary, .zn-page-builder-template.zn-right-sidebar #secondary':
            {
              'padding-right': '20px',
              'padding-left': '20px',
            },
          '.zn-right-sidebar #secondary, .zn-left-sidebar #primary': { 'padding-left': 0 },
          '.zn-left-sidebar #secondary': { 'padding-right': 0 },
        };
    css += parseCss(rules, '', tablet());
  }
  const min: Rules = {
    '.zn-separate-container.zn-right-sidebar #primary, .zn-separate-container.zn-left-sidebar #primary':
      { border: 0 },
    '.search-no-results.zn-separate-container #primary': { 'margin-bottom': '4em' },
  };
  if (c.isAuthor) {
    min['.zn-author-box'] = { '-js-display': 'flex', display: 'flex' };
    min['.zn-author-bio'] = { flex: '1' };
  }
  css += parseCss(min, tablet('', 1));
  if (is404(c)) {
    css += parseCss({ '.zn-404-layout-1 .zn-404-text': { 'font-size': fontCssValue(o, '200') } });
    css += parseCss(
      { '.error404.zn-separate-container #primary': { 'margin-bottom': '4em' } },
      tablet('', 1),
    );
    css += parseCss(
      { '.zn-404-layout-1 .zn-404-text': { 'font-size': fontCssValue(o, 100) } },
      '',
      '920',
    );
  }
  if (sidebar) {
    const [a, b] = c.rtl ? ['left', 'right'] : ['right', 'left'];
    css += parseCss(
      {
        '.zn-right-sidebar #primary': { [`border-${a}`]: '1px solid var(--zn-border-color)' },
        ...(c.rtl
          ? {
              '.zn-right-sidebar #secondary': {
                [`border-${b}`]: '1px solid var(--zn-border-color)',
                [`margin-${b}`]: '-1px',
              },
              '.zn-left-sidebar #primary': { [`border-${b}`]: '1px solid var(--zn-border-color)' },
            }
          : {
              '.zn-left-sidebar #primary': { [`border-${b}`]: '1px solid var(--zn-border-color)' },
              '.zn-right-sidebar #secondary': {
                [`border-${b}`]: '1px solid var(--zn-border-color)',
                [`margin-${b}`]: '-1px',
              },
            }),
        '.zn-left-sidebar #secondary': {
          [`border-${a}`]: '1px solid var(--zn-border-color)',
          [`margin-${a}`]: '-1px',
        },
        '.zn-separate-container.zn-two-container.zn-right-sidebar #secondary': {
          [`padding-${b}`]: '30px',
          [`padding-${a}`]: 0,
        },
        '.zn-separate-container.zn-two-container.zn-left-sidebar #secondary': {
          [`padding-${a}`]: '30px',
          [`padding-${b}`]: 0,
        },
        '.zn-separate-container.zn-right-sidebar #secondary, .zn-separate-container.zn-left-sidebar #secondary':
          {
            border: 0,
            'margin-left': 'auto',
            'margin-right': 'auto',
          },
        '.zn-separate-container.zn-two-container #secondary .widget:last-child': {
          'margin-bottom': 0,
        },
      },
      tablet('', 1),
    );
  }

  // Theme buttons.
  const size = o.get('theme-button-border-group-border-size');
  const padding = o.get('theme-button-padding');
  const radius = o.get('button-radius-fields');
  const fontSize = o.get('font-size-button');
  const extras = o.get('font-extras-button');
  const transform = fontExtra(extras, 'text-transform');
  const lineHeight = fontExtra(extras, 'line-height', 'line-height-unit');
  const spacing = fontExtra(extras, 'letter-spacing', 'letter-spacing-unit');
  const decoration = fontExtra(extras, 'text-decoration');
  const border = (s: string, def: string) =>
    isset(size, s) && at(size, s) !== '' ? cssValue(at(size, s), 'px') : def;
  const pad = (d: string) => ({
    'padding-top': responsiveSpacing(padding, 'top', d),
    'padding-right': responsiveSpacing(padding, 'right', d),
    'padding-bottom': responsiveSpacing(padding, 'bottom', d),
    'padding-left': responsiveSpacing(padding, 'left', d),
  });
  const radii = (d: string) => ({
    'border-top-left-radius': responsiveSpacing(radius, 'top', d),
    'border-top-right-radius': responsiveSpacing(radius, 'right', d),
    'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
    'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
  });
  const borderColor = empty(v.btnBorderColor) ? esc(v.btnBgColor) : esc(v.btnBorderColor);
  const hover = {
    color: esc(v.btnTextHoverColor),
    'background-color': esc(v.btnBgHoverColor),
    'border-color': empty(v.btnBorderHoverColor)
      ? esc(v.btnBgHoverColor)
      : esc(v.btnBorderHoverColor),
  };
  const desktop: Rules = {
    [BUTTONS]: {
      'border-style': 'solid',
      'border-top-width': border('top', '0'),
      'border-right-width': border('right', '0'),
      'border-left-width': border('left', '0'),
      'border-bottom-width': border('bottom', '0'),
      color: esc(v.btnTextColor),
      'border-color': borderColor,
      'background-color': esc(v.btnBgColor),
      ...pad('desktop'),
      'font-family': fontFamily(o.get('font-family-button')),
      'font-weight': esc(o.get('font-weight-button')),
      'font-size': fontCssValue(o, at(fontSize, 'desktop'), str(at(fontSize, 'desktop-unit'))),
      'line-height': esc(lineHeight),
      'text-transform': esc(transform),
      'text-decoration': esc(decoration),
      'letter-spacing': esc(spacing),
      ...radii('desktop'),
    },
    [BUTTONS_HOVER]: hover,
  };
  const device = (d: string): Rules => ({
    [BUTTONS]: { ...pad(d), 'font-size': respFont(o, fontSize, d), ...radii(d) },
  });

  css += parseCss({ '.wp-block-button .wp-block-button__link': { color: esc(v.btnTextColor) } });
  const top = border('top', '');
  const bottom = border('bottom', '');
  const right = border('right', '');
  const left = border('left', '');
  const block: Rules = {
    '.wp-block-button .wp-block-button__link:hover, .wp-block-button .wp-block-button__link:focus':
      hover,
    [BLOCK_BUTTONS]: {
      'border-style': top || right || left || bottom ? 'solid' : '',
      'border-top-width': top,
      'border-right-width': right,
      'border-left-width': left,
      'border-bottom-width': bottom,
      'border-color': borderColor,
      'background-color': esc(v.btnBgColor),
      color: esc(v.btnTextColor),
      'font-family': fontFamily(o.get('font-family-button')),
      'font-weight': esc(o.get('font-weight-button')),
      'line-height': esc(lineHeight),
      'text-transform': esc(transform),
      'text-decoration': esc(decoration),
      'letter-spacing': esc(spacing),
      'font-size': respFont(o, fontSize, 'desktop'),
      ...radii('desktop'),
      ...pad('desktop'),
    },
  };
  if (truthy(o.get('underline-content-links'))) {
    block[
      '.zn-single-post .entry-content .wp-block-button .wp-block-button__link, .zn-single-post .entry-content .wp-block-search .wp-block-search__button, body .entry-content .wp-block-file .wp-block-file__button'
    ] = {
      'text-decoration': decoration === '' || decoration === 'initial' ? 'none' : esc(decoration),
    };
  }
  const blockDevice = (d: string): Rules => ({
    [BLOCK_BUTTONS]: { 'font-size': respFont(o, fontSize, d), ...pad(d), ...radii(d) },
  });
  css += parseCss(block);
  css += parseCss(blockDevice('tablet'), '', tablet());
  css += parseCss(blockDevice('mobile'), '', mobile());

  desktop[
    'form[CLASS*="wp-block-search__"].wp-block-search .wp-block-search__inside-wrapper .wp-block-search__button.has-icon'
  ] = {
    'padding-top': `calc(${responsiveSpacing(padding, 'top', 'desktop')} - 3px)`,
    'padding-right': `calc(${responsiveSpacing(padding, 'right', 'desktop')} - 3px)`,
    'padding-bottom': `calc(${responsiveSpacing(padding, 'bottom', 'desktop')} - 3px)`,
    'padding-left': `calc(${responsiveSpacing(padding, 'left', 'desktop')} - 3px)`,
  };
  css += parseCss(desktop);
  css += parseCss(device('tablet'), '', tablet());
  css += parseCss(device('mobile'), '', mobile());

  if (empty(v.siteContentWidth))
    css += parseCss({ '.zn-container': { 'max-width': '100%' } }, tablet());
  css += parseCss(
    {
      [SMALL_BUTTONS]: {
        'font-size': fontCssValue(o, at(fontSize, 'tablet'), str(at(fontSize, 'tablet-unit'))),
      },
      '.zn-mobile-header-stack .main-header-bar .zn-search-menu-icon': { display: 'inline-block' },
      '.zn-header-break-point.zn-header-custom-item-outside .zn-mobile-header-stack .main-header-bar .zn-search-icon':
        { margin: '0' },
      '.zn-comment-avatar-wrap img': { 'max-width': '2.5em' },
      '.zn-comment-meta': { padding: '0 1.8888em 1.3333em' },
    },
    '',
    tablet(),
  );
  css += parseCss({ '.zn-container': { 'max-width': '100%' } }, mobile());
  const small: Rules = {
    '.zn-separate-container .zn-article-post, .zn-separate-container .zn-article-single, .zn-separate-container .comments-title, .zn-separate-container .zn-archive-description':
      { padding: '1.5em 1em' },
    '.zn-separate-container #content .zn-container': {
      'padding-left': '0.54em',
      'padding-right': '0.54em',
    },
    '.zn-separate-container .zn-comment-list .bypostauthor': { padding: '.5em' },
    '.zn-search-menu-icon.zn-dropdown-active .search-field': { width: '170px' },
    [SMALL_BUTTONS]: {
      'font-size': fontCssValue(o, at(fontSize, 'mobile'), str(at(fontSize, 'mobile-unit'))),
    },
  };
  if (sidebar) {
    small['.zn-separate-container #secondary'] = { 'padding-top': 0 };
    small['.zn-separate-container.zn-two-container #secondary .widget'] = {
      'margin-bottom': '1.5em',
      'padding-left': '1em',
      'padding-right': '1em',
    };
  }
  css += parseCss(small, '', mobile());
  if (isLoaded(o, 'search', 'header', 'mobile')) {
    const side = c.rtl ? 'left' : 'right';
    css += parseCss(
      {
        '.zn-header-break-point .zn-search-menu-icon.slide-search .search-form': { [side]: '0' },
        '.zn-header-break-point .zn-mobile-header-stack .zn-search-menu-icon.slide-search .search-form':
          { [side]: '-1em' },
      },
      '',
      tablet(),
    );
  }
  if (o.get('responsive-cart-click-action') !== 'redirect') {
    css += parseCss({
      ' #zn-mobile-header .zn-site-header-cart-li a': { 'pointer-events': 'none' },
    });
  }
  if (v.containerLayout === 'page-builder') {
    css += parseCss(
      {
        '.zn-page-builder-template .comments-area, .single.zn-page-builder-template .entry-header, .single.zn-page-builder-template .post-navigation, .single.zn-page-builder-template .zn-single-related-posts-container':
          {
            'max-width': cssValue(num(Number(v.siteContentWidth) + 40), 'px'),
            'margin-left': 'auto',
            'margin-right': 'auto',
          },
      },
      mobile('', 1),
    );
  }
  const layout = o.get('site-layout');
  const fullBg =
    truthy(o.get('apply-content-background-fullwidth-layouts', true)) &&
    layout !== 'zn-box-layout' &&
    layout !== 'zn-padded-layout';
  css += parseCss({
    [fullBg ? '.zn-separate-container' : 'body, .zn-separate-container']: responsiveBackgroundObj(
      o,
      siteBackground(o, c),
      'desktop',
    ),
  });
  return css;
}

/** The site background (the page's own when it sets one). */
export function siteBackground(o: Options, c: Ctx): unknown {
  const enabled = c.view === 'single' ? c.meta['zn-page-background-enabled'] : undefined;
  if (enabled === 'enabled')
    return c.view === 'single' ? c.meta['zn-page-background-meta'] : undefined;
  return o.get('site-layout-outside-bg-obj-responsive');
}
