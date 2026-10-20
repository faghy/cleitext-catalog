/**
 * Rules shared by the header and footer elements: font size, visibility per
 * device, padding and margin, borders of inner sections.
 */
import {
  cssValue,
  mobile,
  parseCss,
  responsiveFont,
  responsiveSpacing,
  tablet,
} from '../core/css.js';
import type { Options } from '../core/options.js';
import { empty, esc, rec } from '../core/php.js';

const DEVICES = ['desktop', 'tablet', 'mobile'] as const;

/** `prepare_advanced_typography_css( $section, $selector )`: the element's font size per device. */
export function typographyCss(o: Options, section: string, selector: string): string {
  const size = o.get(`font-size-${section}`);
  return (
    parseCss({ [selector]: { 'font-size': responsiveFont(o, size, 'desktop') } }) +
    parseCss({ [selector]: { 'font-size': responsiveFont(o, size, 'tablet') } }, '', tablet()) +
    parseCss({ [selector]: { 'font-size': responsiveFont(o, size, 'mobile') } }, '', mobile())
  );
}

/** `prepare_visibility_css( $section, $selector, $default, $mobile_tablet_default )`. */
export function visibilityCss(
  o: Options,
  section: string,
  selector: string,
  def = 'flex',
  mobileTabletDef = '',
): string {
  const shown = mobileTabletDef || def;
  const v = rec(o.get(`${section}-visibility-responsive`, { desktop: 1, tablet: 1, mobile: 1 }));
  const on = (d: string) => Boolean(v[d]) && v[d] !== '0';
  return (
    parseCss({ [selector]: { display: on('desktop') ? def : 'none' } }) +
    parseCss(
      { [`.zn-header-break-point ${selector}`]: { display: on('tablet') ? shown : 'none' } },
      '',
      (tablet() + 0.99).toFixed(2),
    ) +
    parseCss(
      { [`.zn-header-break-point ${selector}`]: { display: on('mobile') ? shown : 'none' } },
      '',
      mobile(),
    )
  );
}

/** `prepare_advanced_margin_padding_css( $section, $selector )`. */
export function marginPaddingCss(o: Options, section: string, selector: string): string {
  if (!section || !selector) return '';
  const padding = o.get(`${section}-padding`);
  const margin = o.get(`${section}-margin`);
  const box = (d: string) => ({
    'padding-top': responsiveSpacing(padding, 'top', d),
    'padding-bottom': responsiveSpacing(padding, 'bottom', d),
    'padding-left': responsiveSpacing(padding, 'left', d),
    'padding-right': responsiveSpacing(padding, 'right', d),
    'margin-top': responsiveSpacing(margin, 'top', d),
    'margin-bottom': responsiveSpacing(margin, 'bottom', d),
    'margin-left': responsiveSpacing(margin, 'left', d),
    'margin-right': responsiveSpacing(margin, 'right', d),
  });
  return (
    parseCss({ [selector]: box('desktop') }) +
    parseCss({ [selector]: box('tablet') }, '', tablet()) +
    parseCss({ [selector]: box('mobile') }, '', mobile())
  );
}

/** `prepare_inner_section_advanced_css( $section, $selector )`: borders, radius, spacing. */
export function innerSectionCss(o: Options, section: string, selector: string): string {
  if (!section || !selector) return '';
  const sides = { top: '', right: '', bottom: '', left: '' };
  const width = rec(o.get(`${section}-border-width`, sides));
  const color = o.get(`${section}-border-color`, '');
  const radius = rec(o.get(`${section}-border-radius`, sides));
  const w = (s: string) => (!empty(width[s]) ? cssValue(width[s], 'px') : '');
  const r = (s: string) => (!empty(radius[s]) ? cssValue(radius[s], 'px') : '');
  return (
    parseCss({
      [selector]: {
        'border-top-style': !empty(width.top) ? 'solid' : '',
        'border-right-style': !empty(width.right) ? 'solid' : '',
        'border-bottom-style': !empty(width.bottom) ? 'solid' : '',
        'border-left-style': !empty(width.left) ? 'solid' : '',
        'border-color': esc(color),
        'border-top-width': w('top'),
        'border-bottom-width': w('bottom'),
        'border-left-width': w('left'),
        'border-right-width': w('right'),
        'border-top-left-radius': r('top'),
        'border-bottom-right-radius': r('bottom'),
        'border-bottom-left-radius': r('left'),
        'border-top-right-radius': r('right'),
      },
    }) + marginPaddingCss(o, section, selector)
  );
}

export { DEVICES };
