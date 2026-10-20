/** An SVG icon used as logo: its width per device, colors and the gap to the site title. */
import { cssValue, mobile, parseCss, tablet } from '../../core/css.js';
import type { Rules } from '../../core/css.js';
import type { Options } from '../../core/options.js';
import { at, empty, esc, isset, str } from '../../core/php.js';
import type { Part } from './index.js';

/**
 * Whether the logo is an SVG icon: enabled, no image logo, and an icon from
 * the library (any name is taken as known) or custom SVG code.
 */
function hasSvgIcon(o: Options): boolean {
  if (empty(o.get('use-logo-svg-icon'))) return false;
  if (!empty(o.get('custom_logo'))) return false;
  const icon = o.get('logo-svg-icon');
  if (!isset(icon, 'value')) return false;
  const type = str(at(icon, 'type'));
  if (type === 'icon-library') return str(at(icon, 'value')) !== '';
  if (type === 'custom') return !empty(at(icon, 'value'));
  return false;
}

export const part: Part = {
  name: 'logo_svg_icons',
  run(o) {
    if (!hasSvgIcon(o)) return '';
    const width = o.get('zn-header-responsive-logo-width');
    const gap = o.get('logo-svg-site-title-gap');
    const inline = !empty(o.get('logo-title-inline'));
    const svg = '.site-branding .zn-logo-svg-icon svg';
    const addGap = (rules: Rules, d: string) => {
      if (!isset(gap, d)) return rules;
      if (inline)
        rules['.zn-logo-title-inline .zn-site-identity'] = { gap: cssValue(at(gap, d), 'px') };
      else
        rules['.zn-site-identity .zn-logo-svg-icon'] = {
          'margin-bottom': cssValue(at(gap, d), 'px'),
        };
      return rules;
    };
    const desktop = addGap(
      {
        '.site-branding .zn-logo-svg-icon': { display: 'inline-flex' },
        [svg]: {
          width: cssValue(at(width, 'desktop'), 'px', '30'),
          fill: esc(o.get('logo-svg-icon-color')),
        },
        '.site-branding .zn-logo-svg-icon:hover svg': {
          fill: esc(o.get('logo-svg-icon-hover-color')),
        },
      },
      'desktop',
    );
    const device = (d: string) =>
      addGap({ [svg]: { width: cssValue(at(width, d), 'px', '30') } }, d);
    return (
      parseCss(desktop) +
      parseCss(device('tablet'), '', tablet()) +
      parseCss(device('mobile'), '', mobile())
    );
  },
};
