/**
 * Header and footer elements shared by both builders: buttons, HTML blocks,
 * social icons and widget areas, each printed for every instance placed in
 * the layout.
 */
import { isLoaded } from '../../core/builder.js';
import {
  cssValue,
  fontArrayCss,
  mobile,
  parseCss,
  responsiveFont,
  responsiveSpacing,
  tablet,
  type Rules,
} from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { PRO_MAX } from '../../pro/elements.js';
import { at, empty, intval, isset } from '../../core/php.js';
import { marginPaddingCss, typographyCss, visibilityCss } from '../base.js';

export type Builder = 'header' | 'footer';

/**
 * How many instances of each element there can be (Zenit Pro adds some):
 * the CSS covers only those placed in the layout.
 */
export const COUNTS = PRO_MAX;

/**
 * One device's value of a responsive option: `def` when it is empty (and a
 * default is given), `false` kept as is, `def` (undefined) when the option is
 * not a set of values.
 */
export function getProp(value: unknown, prop: string, def?: unknown): unknown {
  if (!value || typeof value !== 'object') return def;
  const v = (value as Record<string, unknown>)[prop];
  if (v === false) return false;
  const found = v === undefined || v === null ? '' : v;
  return empty(found) && def !== undefined && def !== null ? def : found;
}

/** A responsive option's three devices. */
function devices(o: Options, key: string): { desktop: unknown; tablet: unknown; mobile: unknown } {
  const v = o.get(key);
  return {
    desktop: getProp(v, 'desktop'),
    tablet: getProp(v, 'tablet'),
    mobile: getProp(v, 'mobile'),
  };
}

/** Margins of a spacing option for one device. */
function margins(margin: unknown, d: string): Record<string, string> {
  return {
    'margin-top': responsiveSpacing(margin, 'top', d),
    'margin-bottom': responsiveSpacing(margin, 'bottom', d),
    'margin-left': responsiveSpacing(margin, 'left', d),
    'margin-right': responsiveSpacing(margin, 'right', d),
  };
}

/** Corner radius of a spacing option for one device (top-left, top-right, …). */
function corners(radius: unknown, d: string): Record<string, string> {
  return {
    'border-top-left-radius': responsiveSpacing(radius, 'top', d),
    'border-top-right-radius': responsiveSpacing(radius, 'right', d),
    'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
    'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
  };
}

/** Desktop rules, then tablet and mobile ones in their media queries. */
function threeDevices(desktop: Rules, tab: Rules, mob: Rules): string {
  return parseCss(desktop) + parseCss(tab, '', tablet()) + parseCss(mob, '', mobile());
}

/** Buttons: font, colors (normal and hover) per device, border, radius, spacing, visibility. */
export function buttonCss(o: Options, type: Builder): string {
  let css = '';
  let flag = false;
  for (let i = 1; i <= COUNTS[type].button; i++) {
    if (!isLoaded(o, `button-${i}`, type)) continue;
    flag = type === 'header';
    const ctx = type === 'header' ? 'hb' : 'fb';
    const section = `section-${ctx}-button-${i}`;
    const key = `${type}-button${i}`;
    const selector = `.zn-${type}-button-${i}`;
    const fontSize = o.get(`${key}-font-size`);
    const borderWidth = o.get(`${key}-border-size`);
    const radius = o.get(`${key}-border-radius-fields`);
    const bg = devices(o, `${key}-back-color`);
    const color = devices(o, `${key}-text-color`);
    const bgH = devices(o, `${key}-back-h-color`);
    const colorH = devices(o, `${key}-text-h-color`);
    const border = devices(o, `${key}-border-color`);
    const borderH = devices(o, `${key}-border-h-color`);
    const inner = `${selector}[data-section*="section-${ctx}-button-"] .zn-builder-button-wrap .zn-custom-button`;
    const smaller = (d: 'tablet' | 'mobile'): Rules => ({
      [inner]: { 'font-size': responsiveFont(o, fontSize, d) },
      [`${selector} .zn-custom-button`]: {
        'font-size': responsiveFont(o, fontSize, d),
        color: color[d],
        background: bg[d],
        'border-color': border[d],
        ...corners(radius, d),
      },
      [`${selector} .zn-custom-button:hover`]: {
        color: colorH[d],
        background: bgH[d],
        'border-color': borderH[d],
      },
    });
    css += threeDevices(
      {
        [inner]: fontArrayCss(
          o,
          o.get(`${key}-font-family`, 'inherit'),
          o.get(`${key}-font-weight`, 'inherit'),
          fontSize,
          `${key}-font-extras`,
        ),
        [`${selector} .zn-custom-button`]: {
          color: color.desktop,
          background: bg.desktop,
          'border-color': border.desktop,
          'border-top-width': cssValue(at(borderWidth, 'top'), 'px'),
          'border-bottom-width': cssValue(at(borderWidth, 'bottom'), 'px'),
          'border-left-width': cssValue(at(borderWidth, 'left'), 'px'),
          'border-right-width': cssValue(at(borderWidth, 'right'), 'px'),
          ...corners(radius, 'desktop'),
        },
        [`${selector} .zn-custom-button:hover`]: {
          color: colorH.desktop,
          background: bgH.desktop,
          'border-color': borderH.desktop,
        },
      },
      smaller('tablet'),
      smaller('mobile'),
    );
    css += marginPaddingCss(o, section, inner);
    css += visibilityCss(o, section, `.zn-${type}-button-${i}[data-section="${section}"]`);
  }
  if (flag)
    return (
      parseCss({ '[data-section*="section-hb-button-"] .menu-link': { display: 'none' } }) + css
    );
  return css;
}

/** HTML blocks: text and link colors per device, font size, margin, visibility. */
export function htmlCss(o: Options, type: Builder): string {
  let css = '';
  let flag = false;
  for (let i = 1; i <= COUNTS[type].html; i++) {
    if (!isLoaded(o, `html-${i}`, type)) continue;
    flag = true;
    const section = `section-${type === 'header' ? 'hb' : 'fb'}-html-${i}`;
    const margin = o.get(`${section}-margin`);
    const fontSize = o.get(`font-size-${section}`);
    const text = devices(o, `${type}-html-${i}color`);
    const link = devices(o, `${type}-html-${i}link-color`);
    const linkH = devices(o, `${type}-html-${i}link-h-color`);
    const selector =
      type === 'header'
        ? `.zn-header-html-${i}`
        : `.footer-widget-area[data-section="section-fb-html-${i}"]`;
    const rules = (d: 'desktop' | 'tablet' | 'mobile'): Rules => ({
      [`${selector} .zn-builder-html-element`]: {
        color: text[d],
        'font-size': responsiveFont(o, fontSize, d),
      },
      [selector]: margins(margin, d),
      [`${selector} a`]: { color: link[d] },
      [`${selector} a:hover`]: { color: linkH[d] },
    });
    css += threeDevices(rules('desktop'), rules('tablet'), rules('mobile'));
    css += typographyCss(o, section, selector);
    css += visibilityCss(o, section, selector, type === 'header' ? 'flex' : 'block');
  }
  if (!flag) return css;
  return (
    parseCss({
      '.zn-builder-html-element img.alignnone': { display: 'inline-block' },
      '.zn-builder-html-element p:first-child': { 'margin-top': '0' },
      '.zn-builder-html-element p:last-child': { 'margin-bottom': '0' },
      '.zn-header-break-point .main-header-bar .zn-builder-html-element': {
        'line-height': '1.85714285714286',
      },
    }) + css
  );
}

/** Widget areas: title and content colors and sizes per device, margin, visibility. */
export function widgetCss(o: Options, type: Builder): string {
  let css = '';
  for (let i = 1; i <= COUNTS[type].widget; i++) {
    if (!isLoaded(o, `widget-${i}`, type)) continue;
    // Block-based widget screens: the section of the area has this name.
    const section = `zenit-sidebar-widgets-${type}-widget-${i}`;
    const selector = `.${type}-widget-area[data-section="sidebar-widgets-${type}-widget-${i}"]`;
    const margin = o.get(`${section}-margin`);
    const inner = `${selector}.${type}-widget-area-inner`;
    const key = `${type}-widget-${i}`;
    const titleSize = o.get(`${key}-font-size`);
    const contentSize = o.get(`${key}-content-font-size`);
    const title = devices(o, `${key}-title-color`);
    const text = devices(o, `${key}-color`);
    const link = devices(o, `${key}-link-color`);
    const linkH = devices(o, `${key}-link-h-color`);
    const headings = [
      '.widget-title',
      'h1',
      '.widget-area h1',
      'h2',
      '.widget-area h2',
      'h3',
      '.widget-area h3',
    ]
      .concat(['h4', '.widget-area h4', 'h5', '.widget-area h5', 'h6', '.widget-area h6'])
      .map((h) => `${selector} ${h}`)
      .join(', ');
    const content = (d: 'desktop' | 'tablet' | 'mobile') => ({
      color: text[d],
      'font-size': responsiveFont(o, contentSize, d),
    });
    const heading = (d: 'desktop' | 'tablet' | 'mobile') => ({
      color: title[d],
      'font-size': responsiveFont(o, titleSize, d),
    });
    const smaller = (d: 'tablet' | 'mobile'): Rules => ({
      [inner]: content(d),
      [headings]: heading(d),
      [`${inner} a`]: { color: link[d] },
      [`${inner} a:hover`]: { color: linkH[d] },
      [selector]: margins(margin, d),
    });
    css += threeDevices(
      {
        [inner]: content('desktop'),
        [`${inner} a`]: { color: link.desktop },
        [`${inner} a:hover`]: { color: linkH.desktop },
        [headings]: heading('desktop'),
        [selector]: margins(margin, 'desktop'),
      },
      smaller('tablet'),
      smaller('mobile'),
    );
    css += visibilityCss(o, section, selector, 'block');
  }
  return css;
}

/** Half of a responsive spacing (the gap is split on both sides of each icon). */
function half(space: unknown, d: string): number | '' {
  return isset(space, d) && at(space, d) !== '' ? intval(at(space, d)) / 2 : '';
}

/** A responsive size as a whole number, or empty. */
function whole(size: unknown, d: string): number | '' {
  return isset(size, d) && at(size, d) !== '' ? intval(at(size, d)) : '';
}

/** The label's color, or the fallback when it is not set. */
const orElse = (value: unknown, fallback: unknown): unknown => (!empty(value) ? value : fallback);

/** Social icons: size, spacing, radius, custom or brand colors, labels, alignment, visibility. */
export function socialCss(o: Options, type: Builder, rtl: boolean): string {
  let css = '';
  let flag = false;
  for (let i = 1; i <= COUNTS[type].social; i++) {
    if (!isLoaded(o, `social-icons-${i}`, type)) continue;
    flag = true;
    const s = `.zn-${type}-social-${i}-wrap`;
    const section = `section-${type === 'header' ? 'hb' : 'fb'}-social-icons-${i}`;
    const key = `${type}-social-${i}`;
    const space = o.get(`${key}-space`);
    const rawBgSpace = o.get(`${key}-bg-space`);
    const size = o.get(`${key}-size`);
    const radius = o.get(`${key}-radius-fields`);
    const bgSpace = rawBgSpace !== '' ? intval(rawBgSpace) : '';
    const colorType = o.get(`${key}-color-type`);
    const brandHover = o.get(`${key}-brand-hover-toggle`);
    const brand = devices(o, `${key}-brand-color`);
    const brandLabel = devices(o, `${key}-brand-label-color`);
    const color = devices(o, `${key}-color`);
    const colorH = devices(o, `${key}-h-color`);
    const bg = devices(o, `${key}-bg-color`);
    const bgH = devices(o, `${key}-bg-h-color`);
    const label = devices(o, `${key}-label-color`);
    const labelH = devices(o, `${key}-label-h-color`);
    const margin = o.get(`${section}-margin`);
    const custom = colorType === 'custom';
    const official = colorType === 'official';

    /** Custom colors of one device. */
    const customRules = (d: 'desktop' | 'tablet' | 'mobile'): Rules => ({
      [`${s} .zn-social-color-type-custom svg`]: { fill: color[d] },
      [`${s} .zn-social-color-type-custom .zn-builder-social-element`]: { background: bg[d] },
      [`${s} .zn-social-color-type-custom .zn-builder-social-element:hover`]: {
        color: colorH[d],
        background: bgH[d],
      },
      [`${s} .zn-social-color-type-custom .zn-builder-social-element:hover svg`]: {
        fill: colorH[d],
      },
      [`${s} .zn-social-color-type-custom .social-item-label`]: {
        color: orElse(label[d], color[d]),
      },
      [`${s} .zn-builder-social-element:hover .social-item-label`]: {
        color: orElse(labelH[d], colorH[d]),
      },
    });

    const desktop: Rules = {
      [`${s} .zn-builder-social-element,${s} .social-show-label-true .zn-builder-social-element`]: {
        'margin-left': cssValue(half(space, 'desktop'), 'px'),
        'margin-right': cssValue(half(space, 'desktop'), 'px'),
        padding: cssValue(bgSpace, 'px'),
        ...corners(radius, 'desktop'),
      },
      [`${s} .zn-builder-social-element svg`]: {
        width: cssValue(whole(size, 'desktop'), 'px'),
        height: cssValue(whole(size, 'desktop'), 'px'),
      },
      [`${s} .zn-social-icon-image-wrap`]: { margin: cssValue(bgSpace, 'px') },
      [s]: margins(margin, 'desktop'),
    };
    if (custom) Object.assign(desktop, customRules('desktop'));
    if (official && brandHover === false) {
      desktop[
        '.zn-social-color-type-official .zn-builder-social-element, .zn-social-color-type-official .social-item-label'
      ] = {
        color: 'var(--color)',
        'background-color': 'var(--background-color)',
      };
      desktop[
        '.header-social-inner-wrap.zn-social-color-type-official .zn-builder-social-element svg, ' +
          '.footer-social-inner-wrap.zn-social-color-type-official .zn-builder-social-element svg'
      ] = { fill: 'currentColor' };
    }
    if (official && brandHover === true) {
      desktop[
        '.zn-social-color-type-official .zn-builder-social-element:hover, ' +
          '.zn-social-color-type-official .zn-builder-social-element:hover .social-item-label'
      ] = { color: 'var(--color)', 'background-color': 'var(--background-color)' };
      desktop[
        '.header-social-inner-wrap.zn-social-color-type-official .zn-builder-social-element:hover svg, ' +
          '.footer-social-inner-wrap.zn-social-color-type-official .zn-builder-social-element:hover svg'
      ] = { fill: 'currentColor' };
      desktop[`${s} .zn-social-color-type-official .zn-builder-social-element svg`] = {
        fill: brand.desktop,
      };
      desktop[`${s} .zn-social-color-type-official .social-item-label`] = {
        color: orElse(brandLabel.desktop, brand.desktop),
      };
    }

    const smaller = (d: 'tablet' | 'mobile'): Rules => {
      const rules: Rules = {
        [`${s} .zn-builder-social-element svg`]: {
          width: cssValue(whole(size, d), 'px'),
          height: cssValue(whole(size, d), 'px'),
        },
        [`${s} .zn-builder-social-element`]: {
          'margin-left': cssValue(half(space, d), 'px'),
          'margin-right': cssValue(half(space, d), 'px'),
          ...corners(radius, d),
        },
        [s]: margins(margin, d),
      };
      if (custom) Object.assign(rules, customRules(d));
      if (official && brandHover === true) {
        rules[`${s} .zn-social-color-type-official svg`] = { fill: brand[d] };
        // On tablets a set brand label color prints the custom label color (as the reference does).
        const shown = d === 'tablet' ? label[d] : brandLabel[d];
        rules[`${s} .zn-social-color-type-official .social-item-label`] = {
          color: !empty(brandLabel[d]) ? shown : brand[d],
        };
      }
      return rules;
    };
    const tab = smaller('tablet');
    const mob = smaller('mobile');

    if (type === 'footer') {
      const align = o.get(`footer-social-${i}-alignment`);
      const sel = `[data-section="section-fb-social-icons-${i}"] .footer-social-inner-wrap`;
      desktop[sel] = { 'text-align': at(align, 'desktop') ?? '' };
      tab[sel] = { 'text-align': at(align, 'tablet') ?? '' };
      mob[sel] = { 'text-align': at(align, 'mobile') ?? '' };
    }

    css += threeDevices(desktop, tab, mob);
    css += typographyCss(o, section, s);
    css += visibilityCss(o, section, `.zn-builder-layout-element[data-section="${section}"]`);
  }
  if (flag) return SOCIAL_BASE + (rtl ? SOCIAL_RTL : SOCIAL_LTR) + css;
  return css;
}

const SOCIAL_BASE =
  '.zn-social-stack-desktop .zn-builder-social-element,.zn-social-stack-tablet .zn-builder-social-element,.zn-social-stack-mobile .zn-builder-social-element {margin-top: 6px;margin-bottom: 6px;}' +
  '.social-show-label-true .zn-builder-social-element {width: auto;padding: 0 0.4em;}' +
  '[data-section^="section-fb-social-icons-"] .footer-social-inner-wrap {text-align: center;}' +
  '.zn-footer-social-wrap {width: 100%;}';

const SOCIAL_RTL =
  '.zn-footer-social-wrap .zn-builder-social-element:first-child {margin-right: 0;}' +
  '.zn-footer-social-wrap .zn-builder-social-element:last-child {margin-left: 0;}' +
  '.zn-header-social-wrap .zn-builder-social-element:first-child {margin-right: 0;}' +
  '.zn-header-social-wrap .zn-builder-social-element:last-child {margin-left: 0;}' +
  '.zn-builder-social-element {line-height: 1;color: #3a3a3a;background: transparent;vertical-align: middle;transition: all 0.01s;margin-right: 6px;margin-left: 6px;justify-content: center;align-items: center;}' +
  '.zn-builder-social-element {line-height: 1;color: #3a3a3a;background: transparent;vertical-align: middle;transition: all 0.01s;margin-right: 6px;margin-left: 6px;justify-content: center;align-items: center;}' +
  '.zn-builder-social-element .social-item-label {padding-right: 6px;}';

const SOCIAL_LTR =
  '.zn-footer-social-wrap .zn-builder-social-element:first-child {margin-left: 0;}' +
  '.zn-footer-social-wrap .zn-builder-social-element:last-child {margin-right: 0;}' +
  '.zn-header-social-wrap .zn-builder-social-element:first-child {margin-left: 0;}' +
  '.zn-header-social-wrap .zn-builder-social-element:last-child {margin-right: 0;}' +
  '.zn-builder-social-element {line-height: 1;color: var(--zn-global-color-2);background: transparent;vertical-align: middle;transition: all 0.01s;margin-left: 6px;margin-right: 6px;justify-content: center;align-items: center;}' +
  '.zn-builder-social-element .social-item-label {padding-left: 6px;}';
