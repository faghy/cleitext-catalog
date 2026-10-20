/**
 * The values the main dynamic CSS reads in several places: colors, fonts,
 * button colors and the page's container layout.
 */
import { blogLayout, toggleLayout, type Ctx } from '../../core/context.js';
import type { Options } from '../../core/options.js';
import { at, empty, floatval, isNumeric, rec, str } from '../../core/php.js';
import { fgColor, fontExtra, rawSidebarLayout } from './main.js';

export interface MainVars {
  left: string;
  right: string;
  siteContentWidth: unknown;
  narrowWidth: unknown;
  logoWidth: Record<string, unknown>;
  /** The site's container layout, boxed layouts applied. */
  containerLayout: string;
  textColor: unknown;
  themeColor: unknown;
  linkColor: unknown;
  linkHoverColor: unknown;
  headingBaseColor: unknown;
  bodyFontSize: unknown;
  bodyDesktopSize: number;
  headingsLineHeight: unknown;
  headingsTransform: unknown;
  headingsFamily: unknown;
  headingsWeight: unknown;
  /** Per heading level 1–6: family, weight, line height, transform, spacing, decoration. */
  h: Record<
    number,
    {
      family: unknown;
      weight: unknown;
      lineHeight: unknown;
      transform: unknown;
      spacing: unknown;
      decoration: unknown;
    }
  >;
  blogLayout: string;
  btnTextColor: unknown;
  btnTextHoverColor: unknown;
  btnBgColor: unknown;
  btnBgHoverColor: unknown;
  btnBorderColor: unknown;
  btnBorderHoverColor: unknown;
  btnPreset: unknown;
  highlightThemeColor: string;
  /** The sidebar layout (before the container removes it). */
  sidebar: string;
}

export function mainVars(o: Options, c: Ctx): MainVars {
  const themeColor = o.get('theme-color');
  const linkHoverColor = o.get('link-h-color');
  let containerLayout = toggleLayout(o, c, 'zn-site-content-layout', 'global');
  if (containerLayout === 'plain-container') {
    const boxed = o.get('site-content-style') === 'boxed';
    const sidebarBoxed = o.get('site-sidebar-style') === 'boxed';
    const sidebar = o.get('site-sidebar-layout');
    if (sidebar === 'no-sidebar') {
      if (boxed) containerLayout = 'boxed-container';
    } else if (boxed)
      containerLayout = sidebarBoxed ? 'boxed-container' : 'content-boxed-container';
    else if (sidebarBoxed) containerLayout = 'boxed-container';
  }

  const bodySize = o.get('font-size-body');
  let bodyDesktop: unknown;
  if (bodySize && typeof bodySize === 'object') {
    const d = at(bodySize, 'desktop');
    bodyDesktop = d !== undefined && d !== null && isNumeric(d) && floatval(d) !== 0 ? d : 15;
    if (!empty(at(bodySize, 'desktop-unit')) && at(bodySize, 'desktop-unit') === 'rem')
      bodyDesktop = floatval(bodyDesktop) * 16;
  } else {
    bodyDesktop = isNumeric(bodySize) && floatval(bodySize) !== 0 ? bodySize : 15;
  }

  const hx = o.get('headings-font-extras');
  const headingsFamily = o.get('headings-font-family');
  const headingsWeight = o.get('headings-font-weight');
  const headingsLineHeight = fontExtra(hx, 'line-height', 'line-height-unit');
  const headingsTransform = fontExtra(hx, 'text-transform');
  const h: MainVars['h'] = {};
  for (let i = 1; i <= 6; i++) {
    const x = o.get(`font-extras-h${i}`);
    let family = o.get(`font-family-h${i}`);
    let weight = o.get(`font-weight-h${i}`);
    let transform = fontExtra(x, 'text-transform');
    let lineHeight = fontExtra(x, 'line-height', 'line-height-unit');
    if (family === 'inherit') family = headingsFamily;
    if (weight === 'inherit') weight = headingsWeight;
    if (str(transform) === '') transform = headingsTransform;
    if (i <= 3 && str(lineHeight) === '') lineHeight = headingsLineHeight;
    h[i] = {
      family,
      weight,
      lineHeight,
      transform,
      spacing: fontExtra(x, 'letter-spacing', 'letter-spacing-unit'),
      decoration: fontExtra(x, 'text-decoration'),
    };
  }

  let btnTextColor = o.get('button-color');
  if (empty(btnTextColor)) btnTextColor = fgColor(o, themeColor);
  let btnTextHoverColor = o.get('button-h-color');
  if (empty(btnTextHoverColor)) btnTextHoverColor = fgColor(o, linkHoverColor);
  let btnBgColor = o.get('button-bg-color', themeColor);
  let btnBorderColor = o.get('theme-button-border-group-border-color');
  const btnPreset = o.get('button-preset-style');
  if (btnPreset === 'button_04' || btnPreset === 'button_05' || btnPreset === 'button_06') {
    if (empty(btnBorderColor)) btnBorderColor = btnBgColor;
    if (o.get('button-bg-color') === '' && o.get('button-color') === '') btnTextColor = themeColor;
    else if (o.get('button-color') === '') btnTextColor = btnBgColor;
    btnBgColor = 'transparent';
  }

  return {
    left: c.rtl ? 'right' : 'left',
    right: c.rtl ? 'left' : 'right',
    siteContentWidth: o.get('site-content-width', 1200),
    narrowWidth: o.get('narrow-container-max-width', 750),
    logoWidth: rec(o.get('zn-header-responsive-logo-width')),
    containerLayout,
    textColor: o.get('text-color'),
    themeColor,
    linkColor: o.get('link-color', themeColor),
    linkHoverColor,
    headingBaseColor: o.get('heading-base-color'),
    bodyFontSize: bodySize,
    bodyDesktopSize: floatval(bodyDesktop),
    headingsLineHeight,
    headingsTransform,
    headingsFamily,
    headingsWeight,
    h,
    blogLayout: blogLayout(o, c),
    btnTextColor,
    btnTextHoverColor,
    btnBgColor,
    btnBgHoverColor: o.get('button-bg-h-color', linkHoverColor),
    btnBorderColor,
    btnBorderHoverColor: o.get('theme-button-border-group-border-h-color'),
    btnPreset,
    highlightThemeColor: fgColor(o, themeColor),
    sidebar: rawSidebarLayout(o, c),
  };
}
