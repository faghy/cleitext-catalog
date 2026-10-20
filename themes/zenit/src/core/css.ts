/**
 * Building blocks of the dynamic CSS: rule lists printed with media
 * queries, CSS values with units, fonts in px and rem, colors, spacing and
 * backgrounds, as the rules of the theme expect them.
 */
import { at, blank, escAttr, floatval, intval, isNumeric, isset, num, rec, str } from './php.js';
import type { Options } from './options.js';

/** Selector → properties; a property with an empty value is left out. */
export type Rules = Record<string, Record<string, unknown> | null | undefined>;

/** Tablet and mobile breakpoints. */
export const TABLET = 921;
export const MOBILE = 544;

/** `get_tablet_breakpoint( $min, $max )`. */
export function tablet(min: number | '' = '', max: number | '' = ''): number {
  if (min !== '') return TABLET - min;
  if (max !== '') return TABLET + max;
  return TABLET;
}

/** `get_mobile_breakpoint( $min, $max )`. */
export function mobile(min: number | '' = '', max: number | '' = ''): number {
  if (min !== '') return MOBILE - min;
  if (max !== '') return MOBILE + max;
  return MOBILE;
}

/** Rules as CSS text, inside `@media (min-width:…) and (max-width:…)` when given. */
export function parseCss(
  rules: Rules,
  min: number | string = '',
  max: number | string = '',
): string {
  let out = '';
  for (const [selector, props] of Object.entries(rules)) {
    if (props === null) break;
    if (!props) continue;
    const entries = Object.entries(props);
    if (entries.length === 0) continue;
    let rule = '';
    let added = 0;
    for (const [property, value] of entries) {
      if ((blank(value) && value !== 0) || value === '!important') continue;
      added++;
      rule += `${property}:${str(value)};`;
    }
    if (added > 0) out += `${selector}{${rule}}`;
  }
  if (out !== '' && (min !== '' || max !== '')) {
    const minCss = min !== '' ? `(min-width:${str(min)}px)` : '';
    const maxCss = max !== '' ? `(max-width:${str(max)}px)` : '';
    const sep = min !== '' && max !== '' ? ' and ' : '';
    return `@media ${minCss}${sep}${maxCss}{${out}}`;
  }
  return out;
}

/** System fonts and what follows them in `font-family`. */
const SYSTEM_FONTS: Record<string, string> = {
  Helvetica: 'Verdana, Arial, sans-serif',
  Verdana: 'Helvetica, Arial, sans-serif',
  Arial: 'Helvetica, Verdana, sans-serif',
  Times: 'Georgia, serif',
  Georgia: 'Times, serif',
  Courier: 'monospace',
};

/** `get_font_family()`. */
export function fontFamily(value: unknown): string {
  const v = str(value);
  return SYSTEM_FONTS[v] ? `${v},${SYSTEM_FONTS[v]}` : v;
}

/** `get_css_value( $value, $unit, $default )`. */
export function cssValue(value: unknown, unit = 'px', def: unknown = ''): string {
  if (blank(value) && blank(def)) return str(value);
  switch (unit) {
    case 'font':
      if (value !== 'inherit') return fontFamily(value);
      return !blank(def) ? str(def) : '';
    case 'px':
    case '%': {
      if (str(value).toLowerCase() === 'inherit' || str(def).toLowerCase() === 'inherit')
        return str(value);
      const v = !blank(value) ? value : def;
      return escAttr(v) + unit;
    }
    case 'url':
      return `${unit}(${str(value)})`;
    default: {
      const v = !blank(value) ? value : def;
      return !blank(v) ? escAttr(v) + unit : '';
    }
  }
}

/** `get_font_css_value()`: px sizes followed by their rem. */
export function fontCssValue(o: Options, value: unknown, unit = 'px', device = 'desktop'): string {
  if (value === '' || value === 0 || blank(value) || Number(value) === 0) return '';
  switch (unit) {
    case 'em':
    case 'vw':
    case 'rem':
    case '%':
      return escAttr(value) + unit;
    case 'px': {
      if (isNumeric(value) || str(value).indexOf('px') > 0) {
        if (o.get('disable-px-to-rem-conversion', false)) return escAttr(value) + unit;
        const v = intval(value);
        const body = rec(o.get('font-size-body'));
        const fonts: Record<string, unknown> = {};
        fonts.desktop = isset(body, 'desktop') && !blank(body.desktop) ? body.desktop : 15;
        fonts.tablet = isset(body, 'tablet') && !blank(body.tablet) ? body.tablet : fonts.desktop;
        fonts.mobile = isset(body, 'mobile') && !blank(body.mobile) ? body.mobile : fonts.tablet;
        let css = `${escAttr(v)}${unit};`;
        if (body[`${device}-unit`] === 'px' && floatval(fonts[device])) {
          css += `font-size:${num(v / floatval(fonts[device]))}rem`;
        }
        return css;
      }
      return escAttr(value);
    }
    default:
      return '';
  }
}

/** `responsive_font( $font, $device, $default )`. */
export function responsiveFont(
  o: Options,
  font: unknown,
  device = 'desktop',
  def: unknown = '',
): string {
  if (isset(font, device)) {
    const f = { ...rec(font) };
    if (!isset(f, `${device}-unit`)) f[`${device}-unit`] = 'px';
    if (!blank(def)) return cssValue(f[device], str(f[`${device}-unit`]), def);
    // The rem is always computed against the desktop body size, as in the reference.
    return fontCssValue(o, f[device], str(f[`${device}-unit`]));
  }
  if (isNumeric(font)) return cssValue(font);
  return typeof font === 'object' && font !== null ? '' : str(font);
}

/** `responsive_spacing( $option, $side, $device, $default, $prefix )`. */
export function responsiveSpacing(
  option: unknown,
  side = '',
  device = 'desktop',
  def: unknown = '',
  prefix = '',
): string {
  let spacing: string;
  if (isset(option, device, side) && isset(option, `${device}-unit`)) {
    spacing = cssValue(at(option, device, side), str(at(option, `${device}-unit`)), def);
  } else if (isNumeric(option)) {
    spacing = cssValue(option);
  } else {
    spacing = typeof option === 'object' && option !== null ? '' : str(option);
  }
  return prefix !== '' && spacing !== '' ? prefix + spacing : spacing;
}

/** `hex_to_rgba()`. */
export function hexToRgba(color: unknown, opacity: number | false = false): string {
  const fallback = 'rgb(0,0,0)';
  let c = str(color);
  if (!c) return fallback;
  if (c[0] === '#') c = c.slice(1);
  let hex: string[];
  if (c.length === 6) hex = [c.slice(0, 2), c.slice(2, 4), c.slice(4, 6)];
  else if (c.length === 3) hex = [c[0]! + c[0], c[1]! + c[1], c[2]! + c[2]];
  else return fallback;
  const rgb = hex.map((h) => parseInt(h, 16) || 0);
  if (opacity) {
    const o = Math.abs(opacity) > 1 ? 1 : opacity;
    return `rgba(${rgb.join(',')},${num(o)})`;
  }
  return `rgb(${rgb.join(',')})`;
}

const isHex = (h: string) => /^[a-f0-9]+$/i.test(h);

/** `adjust_brightness( $hex, $steps, $type )`. */
export function adjustBrightness(color: unknown, steps: number, type: string): string {
  const hex = str(color).replace(/#/g, '');
  if (!isHex(hex)) return hex;
  const rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) || 0) as [
    number,
    number,
    number,
  ];
  let s = steps;
  if (type === 'reverse' && rgb[0] + rgb[1] + rgb[2] > 382) s = -s;
  else if (type === 'darken') s = -s;
  s = Math.max(-255, Math.min(255, s));
  return `#${rgb
    .map((v) =>
      Math.max(0, Math.min(255, v + s))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

/** `get_foreground_color()`: black or white text on a color. */
export function foregroundColor(color: unknown, o?: Options): string {
  let hex = str(color);
  if (o && hex.startsWith('var(--')) hex = o.paletteColor(hex);
  if (hex === 'transparent' || hex === 'false' || hex === '#' || !hex) return 'transparent';
  hex = hex.replace(/#/g, '');
  if (hex.length === 3) hex = hex[0]!.repeat(2) + hex[1]!.repeat(2) + hex[2]!.repeat(2);
  if (hex.includes('rgba')) {
    const rgba = hex.replace(/[^0-9,]/g, '').split(',');
    hex = rgba
      .slice(0, 3)
      .map((v) => Number(v).toString(16).padStart(2, '0'))
      .join('');
  }
  if (!isHex(hex)) return hex;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#000000' : '#ffffff';
}

/** `sanitize_css_value()`. */
export function sanitizeCss(value: unknown): string {
  if (typeof value === 'object' && value !== null) return '';
  let v = str(value);
  let prev: string;
  do {
    prev = v;
    for (const bad of ['/*', '*/', ';', '{', '}', '<', '>']) v = v.split(bad).join('');
  } while (prev !== v);
  return v.trim();
}

/** `get_font_extras( $config, $setting, $unit )`. */
export function fontExtras(config: unknown, setting: string, unit: string | false = false): string {
  let css = str(at(config, setting));
  // '0' counts as empty for the unit (PHP truthiness).
  if (unit && css && css !== '0') css += str(at(config, unit));
  return css;
}

const EMPTY_EXTRAS = {
  'line-height': '',
  'line-height-unit': 'em',
  'letter-spacing': '',
  'letter-spacing-unit': 'px',
  'text-transform': '',
  'text-decoration': '',
};

/** `get_font_array_css()`: a font's properties. */
export function fontArrayCss(
  o: Options,
  family: unknown,
  weight: unknown,
  size: unknown,
  extrasKey: string,
  color: unknown = '',
): Record<string, string> {
  const extras = o.get(extrasKey, EMPTY_EXTRAS);
  return {
    color: escAttr(color),
    'font-family': cssValue(family, 'font'),
    'font-weight': cssValue(weight, 'font'),
    'font-size':
      size && typeof size === 'object' && Object.keys(size).length
        ? responsiveFont(o, size, 'desktop')
        : '',
    'line-height': fontExtras(extras, 'line-height', 'line-height-unit'),
    'text-transform': fontExtras(extras, 'text-transform'),
    'letter-spacing': fontExtras(extras, 'letter-spacing', 'letter-spacing-unit'),
    'text-decoration': fontExtras(extras, 'text-decoration'),
  };
}

/** `get_background_obj()` (one device, values ending with `;` as there). */
export function backgroundObj(o: Options, bg: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  const img = str(at(bg, 'background-image'));
  const color = str(at(bg, 'background-color'));
  const type = str(at(bg, 'background-type'));
  if (type !== '') {
    switch (type) {
      case 'color':
        if (img !== '' && color !== '')
          out['background-image'] = `linear-gradient(to right, ${color}, ${color}), url(${img});`;
        else if (img === '') out['background-color'] = `${color};`;
        break;
      case 'image':
        if (img !== '') out['background-image'] = overlayImage(o, bg, img, ';');
        break;
      case 'gradient':
        out['background-image'] = `${color};`;
        break;
    }
  } else if (color !== '') {
    out['background-color'] = `${color};`;
  }
  if (img !== '') {
    for (const k of [
      'background-repeat',
      'background-position',
      'background-size',
      'background-attachment',
    ]) {
      if (isset(bg, k)) out[k] = escAttr(at(bg, k));
    }
  }
  return out;
}

function overlayImage(o: Options, bg: unknown, img: string, end: string): string {
  const type = isset(bg, 'overlay-type') ? str(at(bg, 'overlay-type')) : 'none';
  const color = sanitizeCss(at(bg, 'overlay-color'));
  const grad = sanitizeCss(at(bg, 'overlay-gradient'));
  const rawOpacity = at(bg, 'overlay-opacity');
  if (type !== 'none') {
    if (type === 'classic' && color !== '') {
      let c = color;
      if (!blank(rawOpacity) && rawOpacity !== '') {
        if (c.startsWith('var')) c = o.paletteColor(c);
        if (c[0] === '#') c = hexToRgba(c, floatval(rawOpacity));
      }
      return `linear-gradient(to right, ${c}, ${c}), url(${img})${end}`;
    }
    if (type === 'gradient' && grad !== '') return `${grad}, url(${img})${end}`;
  }
  return `url(${img})${end}`;
}

/** `get_responsive_background_obj( $bg, $device )`. */
export function responsiveBackgroundObj(
  o: Options,
  res: unknown,
  device: string,
): Record<string, string> | undefined {
  if (!res || typeof res !== 'object') return undefined;
  const out: Record<string, string> = {};
  const bg = rec(at(res, device));
  const img = sanitizeCss(escAttr(bg['background-image'] ?? ''));
  const tabImg = sanitizeCss(escAttr(at(res, 'tablet', 'background-image') ?? ''));
  const deskImg = sanitizeCss(escAttr(at(res, 'desktop', 'background-image') ?? ''));
  const color = sanitizeCss(escAttr(bg['background-color'] ?? ''));
  const tabletCss = Boolean(at(res, 'tablet', 'background-image'));
  const desktopCss = Boolean(at(res, 'desktop', 'background-image'));
  const type = bg['background-type'] ? str(bg['background-type']) : '';
  if (type !== '') {
    switch (type) {
      case 'color':
        if (img !== '' && color !== '') {
          out['background-image'] = `linear-gradient(to right, ${color}, ${color}), url(${img})`;
        } else if (device === 'mobile') {
          if (desktopCss)
            out['background-image'] =
              `linear-gradient(to right, ${color}, ${color}), url(${deskImg})`;
          else if (tabletCss)
            out['background-image'] =
              `linear-gradient(to right, ${color}, ${color}), url(${tabImg})`;
          else if (color !== '') {
            out['background-color'] = color;
            out['background-image'] = 'none';
          }
        } else if (device === 'tablet') {
          if (desktopCss)
            out['background-image'] =
              `linear-gradient(to right, ${color}, ${color}), url(${deskImg})`;
          else if (color !== '') {
            out['background-color'] = color;
            out['background-image'] = 'none';
          }
        } else if (img === '') {
          out['background-color'] = color;
          out['background-image'] = 'none';
        }
        break;
      case 'image':
        if (img !== '') out['background-image'] = overlayImage(o, bg, img, '');
        break;
      case 'gradient':
        if (color !== '') out['background-image'] = color;
        break;
    }
  } else if (color !== '') {
    out['background-color'] = color;
  }
  if (img !== '') {
    for (const k of [
      'background-repeat',
      'background-position',
      'background-size',
      'background-attachment',
    ]) {
      if (isset(bg, k)) out[k] = sanitizeCss(escAttr(bg[k]));
    }
  }
  return out;
}
