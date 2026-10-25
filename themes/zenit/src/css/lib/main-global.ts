/**
 * The site-wide rules: custom properties, link and text colors, body and
 * heading fonts, site title and tagline, archive cards, form focus styles
 * (accessibility), embeds, the containers and the sidebar.
 */
import { contentLayout, meta, type Ctx } from '../../core/context.js';
import {
  adjustBrightness,
  backgroundObj,
  cssValue,
  fontArrayCss,
  fontCssValue,
  fontFamily,
  parseCss,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, esc, intval, str } from '../../core/php.js';
import {
  entryType,
  fgColor,
  fontExtra,
  isDarkPalette,
  parseSelector,
  respFont,
  trimCss,
  truthy,
} from './main.js';
import type { MainVars } from './main-vars.js';

/** Heading selectors with or without the links inside headings. */
export function headings(o: Options, withAnchors: string, without: string): string {
  return o.get('include-headings-in-typography') === true ? withAnchors : without;
}

const FOCUS_VISIBLE =
  '.zn-search-menu-icon.slide-search a:focus-visible:focus-visible, .zenit-search-icon:focus-visible, #close:focus-visible, a:focus-visible, .zn-menu-toggle:focus-visible, .site .skip-link:focus-visible, .wp-block-loginout input:focus-visible, .wp-block-search.wp-block-search__button-inside .wp-block-search__inside-wrapper, .zn-header-navigation-arrow:focus-visible, .woocommerce .wc-proceed-to-checkout > .checkout-button:focus-visible, .woocommerce .woocommerce-MyAccount-navigation ul li a:focus-visible, .zn-orders-table__row .zn-orders-table__cell:focus-visible, .woocommerce .woocommerce-order-details .order-again > .button:focus-visible, .woocommerce .woocommerce-message a.button.wc-forward:focus-visible, .woocommerce #minus_qty:focus-visible, .woocommerce #plus_qty:focus-visible, a#zn-apply-coupon:focus-visible, .woocommerce .woocommerce-info a:focus-visible, .woocommerce .zenit-shop-summary-wrap a:focus-visible, .woocommerce a.wc-forward:focus-visible, #zn-apply-coupon:focus-visible, .woocommerce-js .woocommerce-mini-cart-item a.remove:focus-visible, #close:focus-visible, .button.search-submit:focus-visible, #search_submit:focus, .normal-search:focus-visible, .zn-header-account-wrap:focus-visible, .woocommerce .zn-on-card-button.zn-quick-view-trigger:focus, .zenit-cart-drawer-close:focus, .zn-single-variation:focus, .zn-woocommerce-product-gallery__image:focus, .zn-button:focus, .woocommerce-product-gallery--with-images [data-controls="prev"]:focus-visible, .woocommerce-product-gallery--with-images [data-controls="next"]:focus-visible, .zn-builder-button-wrap:has(.zn-custom-button-link:focus), .zn-builder-button-wrap .zn-custom-button-link:focus';

const FOCUS_INPUTS =
  'input:focus, input[type="text"]:focus, input[type="email"]:focus, input[type="url"]:focus, input[type="password"]:focus, input[type="reset"]:focus, input[type="search"]:focus, input[type="number"]:focus, textarea:focus, .wp-block-search__input:focus, [data-section="section-header-mobile-trigger"] .zn-button-wrap .zn-mobile-menu-trigger-minimal:focus, .zn-mobile-popup-drawer.active .menu-toggle-close:focus, .woocommerce-ordering select.orderby:focus, #zn-scroll-top:focus, #coupon_code:focus, .woocommerce-page #comment:focus, .woocommerce #reviews #respond input#submit:focus, .woocommerce a.add_to_cart_button:focus, .woocommerce .button.single_add_to_cart_button:focus, .woocommerce .woocommerce-cart-form button:focus, .woocommerce .woocommerce-cart-form__cart-item .quantity .qty:focus, .woocommerce .woocommerce-billing-fields .woocommerce-billing-fields__field-wrapper .woocommerce-input-wrapper > .input-text:focus, .woocommerce #order_comments:focus, .woocommerce #place_order:focus, .woocommerce .woocommerce-address-fields .woocommerce-address-fields__field-wrapper .woocommerce-input-wrapper > .input-text:focus, .woocommerce .woocommerce-MyAccount-content form button:focus, .woocommerce .woocommerce-MyAccount-content .woocommerce-EditAccountForm .woocommerce-form-row .woocommerce-Input.input-text:focus, .woocommerce .zn-woocommerce-container .woocommerce-pagination ul.page-numbers li a:focus, body #content .woocommerce form .form-row .select2-container--default .select2-selection--single:focus, #zn-coupon-code:focus, .woocommerce.woocommerce-js .quantity input[type=number]:focus, .woocommerce-js .woocommerce-mini-cart-item .quantity input[type=number]:focus, .woocommerce p#zn-coupon-trigger:focus';

// Fresco's elements: only links in running text (text editor, paragraph, HTML) are underlined.
const UNDERLINE_EXCLUDED =
  '.zn-single-post .elementor-widget-button .elementor-button, .zn-single-post .entry-content .pr-tab a, .zn-single-post .entry-content .pr-info-box__cta a, .zn-single-post .entry-content .pr-module-content a, .zn-single-post .entry-content .pr-post-grid a, .zn-single-post .entry-content .pr-timeline a, .zn-single-post .entry-content .pr-toc a, .zn-single-post .entry-content .pr-taxonomy-list a, .zn-single-post .entry-content .woocommerce a, .entry-content .wp-block-latest-posts > li > a, .zn-single-post .entry-content .wp-block-file__button, a.zn-post-filter-single, .zn-single-post .zn-comment-content .comment-reply-link, .zn-single-post .zn-comment-content .comment-edit-link, .zn-single-post .entry-content .fr-e a:not(.fr-text__body a):not(.fr-a-paragraph a):not(.fr-html a)';

/** The site-wide rules. */
function globalRules(o: Options, v: MainVars): Rules {
  const dark = isDarkPalette(o);
  const title = o.get<Record<string, unknown>>('display-site-title-responsive');
  const tagline = o.get<Record<string, unknown>>('display-site-tagline-responsive');
  const radius = o.get('post-card-border-radius');
  const logo = v.logoWidth;
  const sel = '.zn-site-identity .site-title a';
  const h = (n: number) => v.h[n]!;
  const heading = (n: number) => ({
    'font-size': respFont(o, o.get(`font-size-h${n}`), 'desktop'),
    'font-weight': cssValue(h(n).weight, 'font'),
    'font-family': cssValue(h(n).family, 'font'),
    'line-height': esc(h(n).lineHeight),
    'text-transform': esc(h(n).transform),
    'text-decoration': esc(h(n).decoration),
    'letter-spacing': esc(h(n).spacing),
  });
  const smallHeading = (n: number) => ({
    'font-size': respFont(o, o.get(`font-size-h${n}`), 'desktop'),
    'line-height': esc(h(n).lineHeight),
    'font-weight': cssValue(h(n).weight, 'font'),
    'font-family': cssValue(h(n).family, 'font'),
    'text-transform': esc(h(n).transform),
    'text-decoration': esc(h(n).decoration),
    'letter-spacing': esc(h(n).spacing),
  });
  const extras = o.get('body-font-extras');
  const bodyLineHeight = fontExtra(extras, 'line-height', 'line-height-unit');
  const darkVar = 'var( --zn-global-color-secondary, var(--zn-global-color-5) )';
  const cardSelector =
    v.blogLayout === 'blog-layout-5'
      ? '.archive .zn-article-post, .blog .zn-article-post, .archive .zn-article-post:hover, .blog .zn-article-post:hover'
      : '.archive .zn-article-post .zn-article-inner, .blog .zn-article-post .zn-article-inner, .archive .zn-article-post .zn-article-inner:hover, .blog .zn-article-post .zn-article-inner:hover';
  const toggleRadius = o.get('mobile-header-toggle-btn-border-radius');
  const rules: Rules = {
    ':root': {
      '--zn-post-nav-space': 0,
      '--zn-container-default-xlg-padding': '2.5em',
      '--zn-container-default-lg-padding': '2.5em',
      '--zn-container-default-slg-padding': '2em',
      '--zn-container-default-md-padding': '2.5em',
      '--zn-container-default-sm-padding': '2.5em',
      '--zn-container-default-xs-padding': '2.4em',
      '--zn-container-default-xxs-padding': '1.8em',
      '--zn-code-block-background': dark ? 'var(--zn-global-color-5)' : '#ECEFF3',
      '--zn-comment-inputs-background': '#F9FAFB',
      '--zn-normal-container-width': `${str(v.siteContentWidth)}px`,
      // The content width for blocks that take the theme's (Prisma's containers).
      '--cx-container-width': 'var(--zn-normal-container-width)',
      '--zn-narrow-container-width': `${str(v.narrowWidth)}px`,
      '--zn-blog-title-font-weight': '600',
      '--zn-blog-meta-weight': '600',
      '--zn-global-color-primary': 'var(--zn-global-color-4)',
      '--zn-global-color-secondary': 'var(--zn-global-color-5)',
      '--zn-global-color-alternate-background': 'var(--zn-global-color-6)',
      '--zn-global-color-subtle-background': 'var(--zn-global-color-7)',
      '--zn-bg-style-guide': 'var( --zn-global-color-secondary, var(--zn-global-color-5) )',
      '--zn-shadow-style-guide': dark ? '0px 0px 4px 0 #ffffff57' : '0px 0px 4px 0 #00000057',
      '--zn-global-dark-bg-style': dark ? darkVar : '#fff',
      '--zn-global-dark-lfs': dark ? darkVar : '#fbfbfb',
      '--zn-widget-bg-color': dark ? darkVar : '#fafafa',
      '--zn-wc-container-head-bg-color': dark ? darkVar : '#fbfbfb',
      '--zn-title-layout-bg': dark ? darkVar : '#eeeeee',
      '--zn-search-border-color': dark ? 'var(--zn-border-color)' : '#e7e7e7',
      '--zn-lifter-hover-bg': dark
        ? 'var( --zn-global-color-primary, var(--zn-global-color-4) )'
        : '#e6e6e6',
      '--zn-gallery-block-color': dark ? 'var(--zn-global-color-2)' : '#000',
      '--srfm-color-input-label': 'var(--zn-global-color-2)',
    },
    html: { 'font-size': fontCssValue(o, intval(v.bodyDesktopSize) * 6.25, '%') },
    a: { color: esc(v.linkColor) },
    'a:hover, a:focus': { color: esc(v.linkHoverColor) },
    'body, button, input, select, textarea, .zn-button, .zn-custom-button': {
      'font-family': fontFamily(bodyFontFamily(o)),
      'font-weight': esc(o.get('body-font-weight')),
      'font-size': respFont(o, v.bodyFontSize, 'desktop'),
      'line-height': truthy(bodyLineHeight)
        ? `var(--zn-body-line-height, ${esc(bodyLineHeight)})`
        : '',
      'text-transform': esc(fontExtra(extras, 'text-transform')),
      'text-decoration': esc(fontExtra(extras, 'text-decoration')),
      'letter-spacing': esc(fontExtra(extras, 'letter-spacing', 'letter-spacing-unit')),
    },
    // Set twice in the reference: the text color replaces the border color.
    blockquote: { color: adjustBrightness(v.textColor, 75, 'darken') },
    'p, .entry-content p': { 'margin-bottom': cssValue(o.get('para-margin-bottom'), 'em') },
    [headings(
      o,
      'h1, h2, h3, h4, h5, h6, .entry-content :where(h1, h2, h3, h4, h5, h6), .entry-content :where(h1, h2, h3, h4, h5, h6) a, .site-title, .site-title a',
      'h1, h2, h3, h4, h5, h6, .entry-content :where(h1, h2, h3, h4, h5, h6), .site-title, .site-title a',
    )]: fontArrayCss(
      o,
      o.get('headings-font-family'),
      o.get('headings-font-weight'),
      [],
      'headings-font-extras',
    ),
    [sel]: { color: esc(o.get('header-color-site-title')) },
    [`${sel}:hover`]: { color: esc(o.get('header-color-h-site-title')) },
    '.zn-site-identity .site-description': { color: esc(o.get('header-color-site-tagline')) },
    '.site-title': {
      'font-size': respFont(o, o.get('font-size-site-title'), 'desktop'),
      display: truthy(at(title, 'desktop')) ? 'block' : 'none',
    },
    'header .custom-logo-link img': {
      'max-width': cssValue(logo.desktop, 'px'),
      width: cssValue(logo.desktop, 'px'),
    },
    '.zenit-logo-svg': { width: cssValue(logo.desktop, 'px') },
    '.site-header .site-description': {
      'font-size': respFont(o, o.get('font-size-site-tagline'), 'desktop'),
      display: truthy(at(tagline, 'desktop')) ? 'block' : 'none',
    },
    '.entry-title': { 'font-size': respFont(o, o.get('font-size-page-title'), 'desktop') },
    '.zn-blog-single-element.zn-taxonomy-container a': {
      'font-size': respFont(o, o.get('font-size-post-tax'), 'desktop'),
    },
    '.zn-blog-meta-container': {
      'font-size': respFont(o, o.get('font-size-post-meta'), 'desktop'),
    },
    [cardSelector]: {
      'border-top-left-radius': responsiveSpacing(radius, 'top', 'desktop'),
      'border-top-right-radius': responsiveSpacing(radius, 'right', 'desktop'),
      'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', 'desktop'),
      'border-bottom-left-radius': responsiveSpacing(radius, 'left', 'desktop'),
      overflow: 'hidden',
    },
    [headings(
      o,
      'h1, .entry-content :where(h1), .entry-content :where(h1) a',
      'h1, .entry-content :where(h1)',
    )]: heading(1),
    [headings(
      o,
      'h2, .entry-content :where(h2), .entry-content :where(h2) a',
      'h2, .entry-content :where(h2)',
    )]: heading(2),
    [headings(
      o,
      'h3, .entry-content :where(h3), .entry-content :where(h3) a',
      'h3, .entry-content :where(h3)',
    )]: heading(3),
    [headings(
      o,
      'h4, .entry-content :where(h4), .entry-content :where(h4) a',
      'h4, .entry-content :where(h4)',
    )]: smallHeading(4),
    [headings(
      o,
      'h5, .entry-content :where(h5), .entry-content :where(h5) a',
      'h5, .entry-content :where(h5)',
    )]: smallHeading(5),
    [headings(
      o,
      'h6, .entry-content :where(h6), .entry-content :where(h6) a',
      'h6, .entry-content :where(h6)',
    )]: smallHeading(6),
    '::selection': {
      'background-color': esc(v.themeColor),
      color: esc(v.highlightThemeColor === 'transparent' ? '' : v.highlightThemeColor),
    },
    [headings(
      o,
      'body, h1, h2, h3, h4, h5, h6, .entry-title a, .entry-content :where(h1, h2, h3, h4, h5, h6), .entry-content :where(h1, h2, h3, h4, h5, h6) a',
      'body, h1, h2, h3, h4, h5, h6, .entry-title a, .entry-content :where(h1, h2, h3, h4, h5, h6)',
    )]: { color: esc(v.textColor) },
    '.tagcloud a:hover, .tagcloud a:focus, .tagcloud a.current-item': {
      color: fgColor(o, v.linkColor),
      'border-color': esc(v.linkColor),
      'background-color': esc(v.linkColor),
    },
    'input:focus, input[type="text"]:focus, input[type="email"]:focus, input[type="url"]:focus, input[type="password"]:focus, input[type="reset"]:focus, input[type="search"]:focus, textarea:focus':
      { 'border-color': esc(v.linkColor) },
    'input[type="radio"]:checked, input[type=reset], input[type="checkbox"]:checked, input[type="checkbox"]:hover:checked, input[type="checkbox"]:focus:checked, input[type=range]::-webkit-slider-thumb':
      {
        'border-color': esc(v.linkColor),
        'background-color': esc(v.linkColor),
        'box-shadow': 'none',
      },
    '.site-footer a:hover + .post-count, .site-footer a:focus + .post-count': {
      background: esc(v.linkColor),
      'border-color': esc(v.linkColor),
    },
    '.single .nav-links .nav-previous, .single .nav-links .nav-next': { color: esc(v.linkColor) },
    '.entry-meta, .entry-meta *': {
      'line-height': '1.45',
      color: esc(v.linkColor),
      'font-weight': '600',
    },
    '.entry-meta a:not(.zn-button):hover, .entry-meta a:not(.zn-button):hover *, .entry-meta a:not(.zn-button):focus, .entry-meta a:not(.zn-button):focus *, .page-links > .page-link, .page-links .page-link:hover, .post-navigation a:hover':
      { color: esc(v.linkHoverColor) },
    '#cat option, .secondary .calendar_wrap thead a, .secondary .calendar_wrap thead a:visited': {
      color: esc(v.linkColor),
    },
    '.secondary .calendar_wrap #today, .zn-progress-val span': { background: esc(v.linkColor) },
    '.secondary a:hover + .post-count, .secondary a:focus + .post-count': {
      background: esc(v.linkColor),
      'border-color': esc(v.linkColor),
    },
    '.calendar_wrap #today > a': { color: fgColor(o, v.linkColor) },
    '.page-links .page-link, .single .post-navigation a': { color: esc(v.textColor) },
    '.zn-header-break-point .main-header-bar .zn-button-wrap .menu-toggle': {
      'border-radius': toggleRadius !== '' ? `${esc(toggleRadius)}px` : '',
    },
    '.zn-search-menu-icon .search-form button.search-submit': { padding: '0 4px' },
    '.zn-search-menu-icon form.search-form': { 'padding-right': '0' },
    '.zn-header-search .zn-search-menu-icon.zn-dropdown-active .search-form, .zn-header-search .zn-search-menu-icon.zn-dropdown-active .search-field:focus':
      { transition: 'all 0.2s', 'border-color': o.get('site-accessibility-highlight-input-color') },
    '.search-form input.search-field:focus': { outline: 'none' },
    '.zn-mobile-header-content .zn-builder-layout-element:not(.zn-builder-menu):not(.zn-header-divider-element), .zn-mobile-popup-content .zn-builder-layout-element:not(.zn-builder-menu):not(.zn-header-divider-element)':
      { padding: '15px 20px' },
  };
  return rules;
}

/** The body font: the system stack when inherited. */
function bodyFontFamily(o: Options): unknown {
  const f = o.get('body-font-family');
  return f === 'inherit'
    ? '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif'
    : f;
}

/** The site-wide rules, the embeds, the containers, the sidebar and the forms. */
export function globalCss(o: Options, c: Ctx, v: MainVars): string {
  const rules = globalRules(o, v);
  if (v.blogLayout === 'blog-layout-6') {
    rules['.zn-blog-layout-6-grid .zn-article-inner .post-thumb::after'] = {
      content: '""',
      position: 'absolute',
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
      ...backgroundObj(o, o.get('post-card-background-overlay')),
    };
  }
  const searchFocus =
    '.zn-search-menu-icon .search-form button.search-submit:focus, .zn-theme-transparent-header .zn-header-search .zn-dropdown-active .zn-icon, .zn-theme-transparent-header .zn-inline-search .search-field:focus .zn-icon';
  rules[searchFocus] = { color: 'var(--zn-global-color-1)' };
  rules['.zn-desktop .zn-header-search .slide-search .search-form'] = {
    border: '2px solid var(--zn-global-color-0)',
  };
  rules['.zn-header-search .slide-search .search-field'] = {
    'background-color': 'var(--zn-global-dark-bg-style)',
  };
  if (!truthy(o.get('zenit-site-svg-logo-equal-height', true))) {
    rules[
      '.zenit-logo-svg:not(.sticky-custom-logo .zenit-logo-svg, .transparent-custom-logo .zenit-logo-svg, .advanced-header-logo .zenit-logo-svg)'
    ] = {
      height: cssValue(
        truthy(v.logoWidth['desktop-svg-height']) ? v.logoWidth['desktop-svg-height'] : '',
        'px',
      ),
    };
  }
  rules['.zn-archive-title'] = { color: esc(v.headingBaseColor) };
  rules['.widget-title'] = {
    'font-size': fontCssValue(o, intval(v.bodyDesktopSize) * 1.428571429),
    color: esc(v.headingBaseColor),
  };
  if (v.sidebar !== 'no-sidebar') {
    rules[
      '#secondary, #secondary button, #secondary input, #secondary select, #secondary textarea'
    ] = {
      'font-size': respFont(o, v.bodyFontSize, 'desktop'),
    };
  }
  if (truthy(o.get('underline-content-links'))) {
    rules[
      '.zn-single-post .entry-content a, .zn-comment-content a:not(.zn-comment-edit-reply-wrap a)'
    ] = {
      'text-decoration': 'underline',
    };
    rules[parseSelector(UNDERLINE_EXCLUDED, ['wc', 'el'])] = { 'text-decoration': 'none' };
  }
  const a11y = truthy(o.get('site-accessibility-toggle', false));
  const focusVisible = parseSelector(FOCUS_VISIBLE, 'wc');
  const focusInputs = parseSelector(FOCUS_INPUTS, 'wc');
  const inputColor = o.get('site-accessibility-highlight-input-color');
  if (a11y) {
    const style = o.get('site-accessibility-highlight-type');
    const color = o.get('site-accessibility-highlight-color');
    let inputStyle = o.get('site-accessibility-highlight-input-type');
    if (inputStyle === 'disable') inputStyle = 'unset';
    rules[focusVisible] = {
      'outline-style': truthy(style) ? style : 'inherit',
      'outline-color': truthy(color) ? color : 'inherit',
      'outline-width': 'thin',
      'border-color': inputColor,
    };
    rules[focusInputs] =
      inputStyle !== 'unset'
        ? {
            'border-style': truthy(inputStyle) ? inputStyle : 'inherit',
            'border-color': truthy(inputColor) ? inputColor : 'inherit',
            'border-width': 'thin',
            'outline-color': inputColor,
          }
        : {
            'border-style': truthy(style) ? style : 'inherit',
            'border-color': truthy(color) ? color : 'inherit',
            'border-width': 'thin',
            'outline-color': inputColor,
          };
    rules.input = { outline: 'none' };
  } else {
    rules[`${focusInputs}, ${focusVisible}`] = { 'outline-style': 'none' };
    rules['.zn-menu-toggle:focus, .zn-button-wrap .menu-toggle:focus'] = {
      outline: 'none',
      'border-color': 'transparent',
    };
    rules[
      '.zn-header-search .zn-search-menu-icon.zn-dropdown-active .search-form, .zn-header-search .zn-search-menu-icon.zn-dropdown-active .search-field:focus'
    ] = { 'border-color': 'var(--zn-global-color-0)' };
  }
  rules[searchFocus] = { color: 'var(--zn-global-color-1)' };
  if (!a11y)
    rules['.zn-header-search .slide-search .search-form'] = {
      border: '2px solid var(--zn-global-color-0)',
    };
  rules['.zn-header-search .slide-search .search-field'] = {
    'background-color': 'var(--zn-global-dark-bg-style)',
  };
  if (truthy(o.get('logo-title-inline')))
    rules['.zn-logo-title-inline .site-logo-img'] = { 'padding-right': '1em' };
  if (
    truthy(o.get('custom_logo')) ||
    truthy(o.get('transparent-header-logo')) ||
    truthy(o.get('sticky-header-logo'))
  ) {
    rules['.site-logo-img img'] = { ' transition': 'all 0.2s linear' };
    if (truthy(o.get('header-logo-color'))) {
      rules['.site-logo-img img'] = {
        filter: 'url(#zn-img-color-filter)',
        ' transition': 'all 0.2s linear',
      };
    }
    if (truthy(o.get('transparent-header-logo-color'))) {
      rules[
        '.site-logo-img .transparent-custom-logo img, .zn-theme-transparent-header .site-logo-img img'
      ] = {
        filter: 'url(#zn-img-color-filter-2)',
      };
    }
  }
  let css = parseCss(rules);
  const side = c.rtl ? 'right' : 'left';
  css += parseCss({
    'body .zn-oembed-container *': {
      position: 'absolute',
      top: '0',
      width: '100%',
      height: '100%',
      [side]: '0',
    },
    'body .wp-block-embed-pocket-casts .zn-oembed-container *': { position: 'unset' },
  });
  css += containerLayoutCss(o, c);
  if (v.sidebar !== 'no-sidebar') {
    css += trimCss(sidebarStaticCss(c));
    if (truthy(o.get('site-sticky-sidebar', false))) {
      css += parseCss(
        {
          '.zn-sticky-sidebar .sidebar-main': {
            top: '50px',
            position: 'sticky',
            'overflow-y': 'auto',
          },
        },
        tablet('', 1),
      );
      css += parseCss(
        { '.zn-sticky-sidebar .sidebar-main': { position: '-webkit-sticky' } },
        tablet('', 1),
      );
    }
  }
  css += formsCss(o);
  css += parseCss({ '#zn-desktop-header': { display: 'none' } }, '', (tablet() + 0.99).toFixed(2));
  css += parseCss({ '#zn-mobile-header': { display: 'none' } }, tablet('', 1));
  return css;
}

/** The full-width, narrow and featured-image containers. */
function containerLayoutCss(o: Options, c: Ctx): string {
  const layout = contentLayout(o, c);
  let css = `
		.zn-single-post-featured-section + article {
			margin-top: 2em;
		}
		.site-content .zn-single-post-featured-section img {
			width: 100%;
			overflow: hidden;
			object-fit: cover;
		}
	`;
  const desktop = `@media (min-width: ${tablet('', 1)}px)`;
  const type = entryType(c);
  const layoutType = o.get(`zn-dynamic-single-${type}-layout`, 'layout-1');
  const imagePosition = o.get(
    `zn-dynamic-single-${type}-article-featured-image-position-layout-1`,
    'behind',
  );
  if (layoutType === 'layout-1' && imagePosition === 'behind') {
    css += `
			.zn-separate-container .site-content .zn-single-post-featured-section + article {
				margin-top: -80px;
				z-index: 9;
				position: relative;
				border-radius: 4px;
			}
			${desktop} {
				.zn-no-sidebar .site-content .zn-article-image-container--wide {
					margin-left: -120px;
					margin-right: -120px;
					max-width: unset;
					width: unset;
				}
				.zn-left-sidebar .site-content .zn-article-image-container--wide, .zn-right-sidebar .site-content .zn-article-image-container--wide {
					margin-left: -10px;
					margin-right: -10px;
				}
				.site-content .zn-article-image-container--full {
					margin-left: calc( -50vw + 50%);
					margin-right: calc( -50vw + 50%);
					max-width: 100vw;
					width: 100vw;
				}
				.zn-left-sidebar .site-content .zn-article-image-container--full,
				.zn-right-sidebar .site-content .zn-article-image-container--full {
					margin-left: -10px;
					margin-right: -10px;
					max-width: inherit;
					width: auto;
				}
			}
		`;
  }
  css += `
		.site > .zn-single-related-posts-container {
			margin-top: 0;
		}
		@media (min-width: ${tablet('', 1)}px) {
			.zn-desktop .zn-container--narrow {
				max-width: var(--zn-narrow-container-width);
				margin: 0 auto;
			}
		}
	`;
  if (layout !== 'page-builder') return css;
  css += `
        .zn-page-builder-template .hentry {
            margin: 0;
          }
          .zn-page-builder-template .site-content > .zn-container {
            max-width: 100%;
            padding: 0;
          }
          .zn-page-builder-template .site .site-content #primary {
            padding: 0;
            margin: 0;
          }
          .zn-page-builder-template .no-results {
            text-align: center;
            margin: 4em auto;
          }
          .zn-page-builder-template .zn-pagination {
            padding: 2em;
          }

          .zn-page-builder-template .entry-header.zn-no-title.zn-no-thumbnail {
            margin-top: 0;
          }
          .zn-page-builder-template .entry-header.zn-header-without-markup {
            margin-top: 0;
            margin-bottom: 0;
          }

          .zn-page-builder-template .entry-header.zn-no-title.zn-no-meta {
            margin-bottom: 0;
          }
          .zn-page-builder-template.single .post-navigation {
            padding-bottom: 2em;
          }
          .zn-page-builder-template.single-post .site-content > .zn-container {
            max-width: 100%;
          }`;
  css += `
				.zn-page-builder-template .entry-header {
					margin-top: 2em;
					margin-left: auto;
					margin-right: auto;
				}
			`;
  if (meta(o, c, 'site-post-title', '', true) !== 'disabled') {
    css += `${parseSelector('.zn-single-post.zn-page-builder-template .site-main > article, .woocommerce.zn-page-builder-template .site-main, .zn-page-builder-template .post-navigation', 'wc')} {
						padding-top: 2em;
						padding-left: 20px;
						padding-right: 20px;
					}
				`;
  }
  css += `
			.zn-page-builder-template .zn-archive-description {
				margin: 2em auto 0;
				padding-left: 20px;
				padding-right: 20px;
			}
		`;
  css += `
				.zn-page-builder-template .zn-row {
					margin-left: 0;
					margin-right: 0;
				}
				.single.zn-page-builder-template .entry-header + .entry-content,
				.single.zn-page-builder-template .zn-single-entry-banner + .site-content article .entry-content {
					margin-bottom: 2em;
				}
				@media(min-width: ${tablet()}px) {
					.zn-page-builder-template.archive.zn-right-sidebar .zn-row article, .zn-page-builder-template.archive.zn-left-sidebar .zn-row article {
						padding-left: 0;
						padding-right: 0;
					}
				}
			`;
  if (o.get('improve-gb-editor-ui', true) === false) {
    css += `.zn-page-builder-template.zn-no-sidebar .entry-content .alignwide {
                margin-left: 0;
                margin-right: 0;
            }`;
  }
  return trimCss(css);
}

/** The sidebar's spacing. */
function sidebarStaticCss(c: Ctx): string {
  const left = c.rtl ? 'right' : 'left';
  const right = c.rtl ? 'left' : 'right';
  return `
			#secondary {
				margin: 4em 0 2.5em;
				word-break: break-word;
				line-height: 2;
			}
			#secondary li {
				margin-bottom: 0.75em;
			}
			#secondary li:last-child {
				margin-bottom: 0;
			}
			@media (max-width: 768px) {
				.js_active .zn-plain-container.zn-single-post #secondary {
				  margin-top: 1.5em;
				}
			}
			.zn-separate-container.zn-two-container #secondary .widget {
				background-color: #fff;
				padding: 2em;
				margin-bottom: 2em;
			}
			
				@media (min-width: 993px) {
					.zn-left-sidebar #secondary {
						padding-${right}: 60px;
					}
					.zn-right-sidebar #secondary {
						padding-${left}: 60px;
					}
				}
				@media (max-width: 993px) {
					.zn-right-sidebar #secondary {
						padding-${left}: 30px;
					}
					.zn-left-sidebar #secondary {
						padding-${right}: 30px;
					}
				}
			
					@media (min-width: 993px) {
						.zn-page-builder-template.zn-left-sidebar #secondary {
							padding-${left}: 60px;
						}
						.zn-page-builder-template.zn-right-sidebar #secondary {
							padding-${right}: 60px;
						}
					}
					@media (max-width: 993px) {
						.zn-page-builder-template.zn-right-sidebar #secondary {
							padding-${right}: 30px;
						}
						.zn-page-builder-template.zn-left-sidebar #secondary {
							padding-${left}: 30px;
						}

					}
				`;
}

/** The default look of form fields, labels and buttons. */
function formsCss(o: Options): string {
  const focus =
    'input[type="text"]:focus, input[type="number"]:focus, input[type="email"]:focus, input[type="url"]:focus, input[type="password"]:focus, input[type="search"]:focus, input[type=reset]:focus, input[type="tel"]:focus, input[type="date"]:focus, select:focus, textarea:focus';
  const rules: Rules = {
    'input[type="text"], input[type="number"], input[type="email"], input[type="url"], input[type="password"], input[type="search"], input[type=reset], input[type=tel], input[type=date], select, textarea':
      {
        'font-size': '16px',
        'font-style': 'normal',
        'font-weight': '400',
        'line-height': '24px',
        width: '100%',
        padding: '12px 16px',
        'border-radius': '4px',
        'box-shadow': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        color: 'var(--zn-form-input-text, #475569)',
      },
    'input[type="text"], input[type="number"], input[type="email"], input[type="url"], input[type="password"], input[type="search"], input[type=reset], input[type=tel], input[type=date], select':
      { height: '40px' },
    'input[type="date"]': {
      'border-width': '1px',
      'border-style': 'solid',
      'border-color': 'var(--zn-border-color)',
      background: 'var( --zn-global-color-secondary, var(--zn-global-color-5) )',
    },
    [focus]: {
      'border-color': 'var(--zn-global-color-0, #046BD2)',
      'box-shadow': 'none',
      outline: 'none',
      color: 'var(--zn-form-input-focus-text, #475569)',
    },
    'label, legend': {
      color: 'var(--zn-global-color-2, #111827 )',
      'font-size': '14px',
      'font-style': 'normal',
      'font-weight': '500',
      'line-height': '20px',
    },
    select: { padding: '6px 10px' },
    fieldset: { padding: '30px', 'border-radius': '4px' },
    'button, .zn-button, .button, input[type="button"], input[type="reset"], input[type="submit"], a:where(.wp-block-button__link)':
      {
        'border-radius': '4px',
        'box-shadow': '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
      },
    ':root': {
      '--zn-comment-inputs-background': isDarkPalette(o)
        ? 'var( --zn-global-color-secondary, var(--zn-global-color-5) )'
        : '#FFF',
    },
    '::placeholder': { color: 'var(--zn-form-field-color, #9CA3AF)' },
    '::-ms-input-placeholder': { color: 'var(--zn-form-field-color, #9CA3AF)' },
  };
  if (truthy(o.get('site-accessibility-toggle', false))) {
    const inputStyle = o.get('site-accessibility-highlight-input-type');
    const color =
      inputStyle !== 'unset'
        ? o.get('site-accessibility-highlight-input-color')
        : o.get('site-accessibility-highlight-color');
    rules[focus] = {
      'border-color': truthy(color) ? color : '#046BD2',
      'box-shadow': 'none',
      outline: 'none',
      color: 'var(--zn-form-input-focus-text, #475569)',
    };
  }
  return parseCss(rules);
}
