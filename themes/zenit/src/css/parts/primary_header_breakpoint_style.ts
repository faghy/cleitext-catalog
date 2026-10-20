/**
 * The main header row: height per device, width, bottom border,
 * background per device, spacing, visibility and the header's margin.
 */
import {
  cssValue,
  mobile,
  parseCss,
  responsiveBackgroundObj,
  responsiveSpacing,
  tablet,
} from '../../core/css.js';
import { esc } from '../../core/php.js';
import { marginPaddingCss, visibilityCss } from '../base.js';
import { nonEmptyAt, rowUsed, trimCss } from '../lib/header-rows.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'primary_header_breakpoint_style',
  run(o) {
    if (!rowUsed(o, 'primary', 'desktop') && !rowUsed(o, 'primary', 'mobile')) return '';
    const height = o.get('hb-header-height');
    const hDesktop = nonEmptyAt(height, 'desktop');
    const hTablet = nonEmptyAt(height, 'tablet');
    const hMobile = nonEmptyAt(height, 'mobile');

    let css = parseCss({
      '.zn-mobile-header-wrap .zn-primary-header-bar, .zn-primary-header-bar .site-primary-header-wrap':
        {
          'min-height': cssValue(hDesktop, 'px'),
        },
      '.zn-desktop:not(:has(.zn-header-sticked)) .zn-primary-header-bar .main-header-menu > .menu-item':
        {
          'line-height': cssValue(hDesktop, 'px'),
        },
    });

    if (o.get('hb-header-main-layout-width') !== 'content') {
      css += parseCss({
        '#masthead .zn-container, .site-header-focus-item + .zn-breadcrumbs-wrapper': {
          'max-width': '100%',
          'padding-left': '35px',
          'padding-right': '35px',
        },
      });
    } else if (o.get('breadcrumb-position') === 'zenit_header_primary_container_after') {
      const width = Number(o.get('site-content-width', 1200));
      css += parseCss({
        '.site-header-focus-item + .zn-breadcrumbs-wrapper': {
          'max-width': cssValue(width + 40, 'px'),
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding-left': '20px',
          'padding-right': '20px',
        },
      });
    }

    css += parseCss({
      '.zn-header-break-point #masthead .zn-mobile-header-wrap .zn-primary-header-bar, .zn-header-break-point #masthead .zn-mobile-header-wrap .zn-below-header-bar, .zn-header-break-point #masthead .zn-mobile-header-wrap .zn-above-header-bar':
        { 'padding-left': '20px', 'padding-right': '20px' },
    });

    const separator = o.get('hb-header-main-sep');
    let border: Record<string, string>;
    if (separator !== '' && separator !== 'inherit') {
      border = {
        'border-bottom-width': cssValue(separator, 'px'),
        'border-bottom-color': esc(o.get('hb-header-main-sep-color')),
        'border-bottom-style': 'solid',
      };
    } else {
      border = { 'border-bottom-style': 'none' };
    }
    css += parseCss({ '.zn-header-break-point .zn-primary-header-bar': border });
    css += parseCss({ '.zn-primary-header-bar': border }, tablet('', 1));

    const bg = o.get('hb-header-bg-obj-responsive');
    css += parseCss({ '.zn-primary-header-bar': responsiveBackgroundObj(o, bg, 'desktop') });
    css += parseCss(
      {
        '.zn-primary-header-bar.zn-primary-header': responsiveBackgroundObj(o, bg, 'tablet'),
        '.zn-mobile-header-wrap .zn-primary-header-bar, .zn-primary-header-bar .site-primary-header-wrap':
          {
            'min-height': cssValue(hTablet, 'px'),
          },
      },
      '',
      tablet(),
    );
    css += parseCss(
      {
        '.zn-primary-header-bar.zn-primary-header': responsiveBackgroundObj(o, bg, 'mobile'),
        '.zn-mobile-header-wrap .zn-primary-header-bar , .zn-primary-header-bar .site-primary-header-wrap':
          {
            'min-height': cssValue(hMobile, 'px'),
          },
      },
      '',
      mobile(),
    );

    let out = trimCss(css);
    const section = 'section-primary-header-builder';
    out += marginPaddingCss(
      o,
      section,
      '.zn-desktop .zn-primary-header-bar.main-header-bar, .zn-header-break-point #masthead .zn-primary-header-bar.main-header-bar',
    );
    out += visibilityCss(o, section, '.zn-primary-header-bar', 'block', 'grid');

    const margin = o.get('section-header-builder-layout-margin');
    const box = (d: string) => ({
      '.zn-hfb-header .site-header': {
        'margin-top': responsiveSpacing(margin, 'top', d),
        'margin-bottom': responsiveSpacing(margin, 'bottom', d),
        'margin-left': responsiveSpacing(margin, 'left', d),
        'margin-right': responsiveSpacing(margin, 'right', d),
      },
    });
    out += parseCss(box('desktop'));
    out += parseCss(box('tablet'), '', tablet());
    out += parseCss(box('mobile'), '', mobile());
    return out;
  },
};
