/**
 * Header elements over the transparent header (html, search, social icons,
 * button, divider, account, widgets, mobile toggle), list paragraphs and
 * the comments area box.
 */
import { isLoaded } from '../../core/builder.js';
import type { Ctx } from '../../core/context.js';
import { cssValue, mobile, parseCss, tablet, type Rules } from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, empty, esc, rec } from '../../core/php.js';
import { innerSectionCss } from '../base.js';
import { isTransparentHeader, truthy } from './main.js';

const T = '.zn-theme-transparent-header';
const SOCIAL = `${T} .zn-header-social-wrap .zn-social-color-type-custom .zn-builder-social-element`;

/** Social icon colors over the transparent header, for one device. */
function social(o: Options, d: string): Rules {
  const c = (k: string) => esc(at(o.get(k), d));
  return {
    [SOCIAL]: { background: c('transparent-header-social-icons-bg-color') },
    [`${SOCIAL} svg`]: { fill: c('transparent-header-social-icons-color') },
    [`${SOCIAL}:hover`]: { background: c('transparent-header-social-icons-bg-h-color') },
    [`${SOCIAL}:hover svg`]: { fill: c('transparent-header-social-icons-h-color') },
    [`${SOCIAL} .social-item-label`]: { color: c('transparent-header-social-icons-color') },
    [`${SOCIAL}:hover .social-item-label`]: { color: c('transparent-header-social-icons-h-color') },
  };
}

function transparentCss(o: Options): string {
  const g = (k: string) => o.get(k);
  const social0 = social(o, 'desktop');
  const rules: Rules = {
    [`${T} [CLASS*="zn-header-html-"] .zn-builder-html-element`]: {
      color: esc(g('transparent-header-html-text-color')),
    },
    [`${T} [CLASS*="zn-header-html-"] .zn-builder-html-element a`]: {
      color: esc(g('transparent-header-html-link-color')),
    },
    [`${T} [CLASS*="zn-header-html-"] .zn-builder-html-element a:hover`]: {
      color: esc(g('transparent-header-html-link-h-color')),
    },
    [`${T} .zn-header-search .zenit-search-icon, ${T} .zn-header-search .search-field::placeholder, ${T} .zn-header-search .zn-icon`]:
      {
        color: esc(g('transparent-header-search-icon-color')),
      },
    [`${T} .zn-header-search .zn-search-menu-icon .search-field, ${T} .zn-header-search .zn-search-menu-icon .search-field::placeholder`]:
      {
        color: esc(g('transparent-header-search-box-placeholder-color')),
      },
    [`${T} .zn-header-search .zn-search-menu-icon .search-field, ${T} .zn-header-search .zn-search-menu-icon .search-form, ${T} .zn-header-search .zn-search-menu-icon .search-submit`]:
      { 'background-color': esc(g('transparent-header-search-box-background-color')) },
    ...social0,
    [`${T} [CLASS*="zn-header-button-"] .zn-custom-button`]: {
      color: esc(g('transparent-header-button-text-color')),
      background: esc(g('transparent-header-button-bg-color')),
      'border-color': esc(g('transparent-header-button-border-color')),
    },
    [`${T} [CLASS*="zn-header-button-"] .zn-custom-button:hover`]: {
      color: esc(g('transparent-header-button-text-h-color')),
      background: esc(g('transparent-header-button-bg-h-color')),
      'border-color': esc(g('transparent-header-button-border-h-color')),
    },
    [`${T} .zn-header-divider-element .zn-divider-wrapper`]: {
      'border-color': esc(g('transparent-header-divider-color')),
    },
    [`${T} .zn-header-account-wrap .zn-header-account-type-icon .zn-hfb-svg-iconset svg path:not(.zn-hf-account-unfill), ${T} .zn-header-account-wrap .zn-header-account-type-icon .zn-hfb-svg-iconset svg circle`]:
      { fill: esc(g('transparent-account-icon-color')) },
    [`${T} .zn-header-account-wrap .zn-account-nav-menu .menu-item .menu-link`]: {
      color: esc(g('transparent-account-menu-color')),
    },
    [`${T} .zn-header-account-wrap .zn-account-nav-menu .menu-item:hover > .menu-link`]: {
      color: g('transparent-account-menu-h-color'),
      background: g('transparent-account-menu-h-bg-color'),
    },
    [`${T} .zn-header-account-wrap .zn-account-nav-menu .menu-item.current-menu-item > .menu-link`]:
      {
        color: g('transparent-account-menu-a-color'),
        background: g('transparent-account-menu-a-bg-color'),
      },
    [`${T} .zn-header-account-wrap .account-main-navigation ul`]: {
      background: g('transparent-account-menu-bg-obj'),
    },
    [`${T} .zn-header-account-wrap .zn-header-account-text`]: {
      color: g('transparent-account-type-text-color'),
    },
  };
  const title = esc(g('transparent-header-widget-title-color'));
  const content = esc(g('transparent-header-widget-content-color'));
  const link = esc(g('transparent-header-widget-link-color'));
  const linkHover = esc(g('transparent-header-widget-link-h-color'));
  rules[`${T} .widget-area.header-widget-area .widget-title`] = { color: title };
  rules[`${T} .widget-area.header-widget-area .header-widget-area-inner`] = { color: content };
  rules[`${T} .widget-area.header-widget-area .header-widget-area-inner a`] = { color: link };
  rules[`${T} .widget-area.header-widget-area .header-widget-area-inner a:hover`] = {
    color: linkHover,
  };
  const widget = `${T} .widget-area.header-widget-area.header-widget-area-inner`;
  rules[widget] = { color: content };
  rules[`${widget} a`] = { color: link };
  rules[`${widget} a:hover`] = { color: linkHover };
  if (isLoaded(o, 'mobile-trigger', 'header', 'mobile')) {
    const toggle = `${T} [data-section="section-header-mobile-trigger"]`;
    const bg = g('transparent-header-toggle-btn-bg-color');
    const borderColor = o.get('transparent-header-toggle-border-color', bg);
    const style = g('mobile-header-toggle-btn-style');
    const icon = g('transparent-header-toggle-btn-color');
    rules[`${toggle} .zn-button-wrap .mobile-menu-toggle-icon .zn-mobile-svg`] = { fill: icon };
    rules[`${toggle} .zn-button-wrap .mobile-menu-wrap .mobile-menu`] = { color: icon };
    if (style === 'fill') {
      rules[`${toggle} .zn-button-wrap .zn-mobile-menu-trigger-fill`] = { background: esc(bg) };
      rules[
        `${toggle} .zn-button-wrap .zn-mobile-menu-trigger-fill, ${toggle} .zn-button-wrap .zn-mobile-menu-trigger-minimal`
      ] = {
        color: esc(icon),
        border: 'none',
      };
    } else if (style === 'outline') {
      rules[`${toggle} .zn-button-wrap .zn-mobile-menu-trigger-outline`] = {
        background: 'transparent',
        color: esc(icon),
        'border-color': borderColor,
      };
    } else {
      rules[`${toggle} .zn-button-wrap .zn-mobile-menu-trigger-minimal`] = {
        background: 'transparent',
      };
    }
  }
  return (
    parseCss(rules) +
    parseCss(social(o, 'tablet'), '', tablet()) +
    parseCss(social(o, 'mobile'), '', mobile())
  );
}

/** The end of the main CSS: transparent header elements, list paragraphs, comments area. */
export function endCss(o: Options, c: Ctx): string {
  let css = '';
  if (isTransparentHeader(o, c)) css += transparentCss(o);
  css += parseCss({ '.entry-content li > p': { 'margin-bottom': 0 } });
  if (truthy(o.get('enable-comments-area', true))) {
    css += innerSectionCss(o, 'zn-sub-section-comments', '.site .comments-area');
    const radius = rec(
      o.get('zn-sub-section-comments-border-radius', { top: '', right: '', bottom: '', left: '' }),
    );
    const r = (s: string) => (!empty(cssValue(radius[s])) ? cssValue(radius[s], 'px') : '');
    css += parseCss({
      '.comments-area .comments-title, .comments-area .comment-respond': {
        'border-top-left-radius': r('top'),
        'border-bottom-right-radius': r('bottom'),
        'border-bottom-left-radius': r('left'),
        'border-top-right-radius': r('right'),
      },
    });
  }
  return css;
}
