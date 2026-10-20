/**
 * The button that opens the mobile menu: its style (fill, outline or
 * minimal), icon size and color, background, border, radius per device,
 * label size and margin per device.
 */
import { isLoaded } from '../../core/builder.js';
import { cssValue, mobile, parseCss, responsiveSpacing, tablet } from '../../core/css.js';
import { at, esc, isset } from '../../core/php.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'mobile_trigger_row_setting',
  run(o) {
    if (
      !isLoaded(o, 'mobile-trigger', 'header', 'mobile') &&
      !isLoaded(o, 'mobile-trigger', 'header', 'desktop')
    ) {
      return '';
    }
    const section = 'section-header-mobile-trigger';
    const selector = '[data-section="section-header-mobile-trigger"]';
    const themeColor = o.get('theme-color');
    const iconSize = o.get('mobile-header-toggle-icon-size');
    const bg = o.get('mobile-header-toggle-btn-bg-color', themeColor);
    const borderWidth = o.get('mobile-header-toggle-btn-border-size');
    const borderColor = o.get('mobile-header-toggle-border-color', bg);
    const radius = o.get('mobile-header-toggle-border-radius-fields');
    const fontSize = o.get('mobile-header-label-font-size');
    const style = o.get('mobile-header-toggle-btn-style');
    const iconColor = o.get(
      'mobile-header-toggle-btn-color',
      style !== 'fill' ? themeColor : '#ffffff',
    );
    const width = (side: string) => (isset(borderWidth, side) ? at(borderWidth, side) : 0);
    const margin = o.get(`${section}-margin`);
    const marginSelector = `${selector} .zn-button-wrap .menu-toggle`;

    const corners = (d: string) => ({
      'border-top-left-radius': responsiveSpacing(radius, 'top', d),
      'border-top-right-radius': responsiveSpacing(radius, 'right', d),
      'border-bottom-right-radius': responsiveSpacing(radius, 'bottom', d),
      'border-bottom-left-radius': responsiveSpacing(radius, 'left', d),
    });
    const margins = (d: string) => ({
      'margin-top': responsiveSpacing(margin, 'top', d),
      'margin-bottom': responsiveSpacing(margin, 'bottom', d),
      'margin-left': responsiveSpacing(margin, 'left', d),
      'margin-right': responsiveSpacing(margin, 'right', d),
    });
    /** Radius per device on tablet and mobile for a style's button. */
    const radiusBelow = (button: string) =>
      parseCss({ [button]: corners('tablet') }, '', tablet()) +
      parseCss({ [button]: corners('mobile') }, '', mobile());

    let css = '';
    if (style === 'minimal') {
      css += parseCss({
        [`${selector} .zn-button-wrap .zn-mobile-menu-trigger-minimal`]: {
          color: esc(iconColor),
          border: 'none',
          background: 'transparent',
        },
      });
    } else if (style === 'fill') {
      const button = `${selector} .zn-button-wrap .zn-mobile-menu-trigger-fill`;
      css +=
        parseCss({
          [button]: {
            color: esc(iconColor),
            border: 'none',
            background: esc(bg),
            ...corners('desktop'),
          },
        }) + radiusBelow(button);
    } else if (style === 'outline') {
      const button = `${selector} .zn-button-wrap .zn-mobile-menu-trigger-outline`;
      css +=
        parseCss({
          [button]: {
            background: 'transparent',
            color: esc(iconColor),
            'border-top-width': cssValue(width('top'), 'px'),
            'border-bottom-width': cssValue(width('bottom'), 'px'),
            'border-right-width': cssValue(width('right'), 'px'),
            'border-left-width': cssValue(width('left'), 'px'),
            'border-style': 'solid',
            'border-color': borderColor,
            ...corners('desktop'),
          },
        }) + radiusBelow(button);
    }

    return (
      css +
      parseCss({
        [`${selector} .zn-button-wrap .mobile-menu-toggle-icon .zn-mobile-svg`]: {
          width: cssValue(iconSize, 'px'),
          height: cssValue(iconSize, 'px'),
          fill: iconColor,
        },
        [`${selector} .zn-button-wrap .mobile-menu-wrap .mobile-menu`]: {
          color: iconColor,
          'font-size': cssValue(fontSize, 'px'),
        },
        [marginSelector]: margins('desktop'),
      }) +
      parseCss({ [marginSelector]: margins('tablet') }, '', tablet()) +
      parseCss({ [marginSelector]: margins('mobile') }, '', mobile())
    );
  },
};
