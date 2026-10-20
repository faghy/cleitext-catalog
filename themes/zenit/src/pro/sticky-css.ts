/**
 * CSS of the sticky header (Zenit Pro): colors and logo width of the rows
 * once they stick. Nothing when no row sticks.
 */
import { parseCss, tablet, mobile, type Rules } from '../core/css.js';
import type { Options } from '../core/options.js';
import { rec, str } from '../core/php.js';

const DEVICES = ['desktop', 'tablet', 'mobile'] as const;
type Device = (typeof DEVICES)[number];

const at = (o: Options, key: string, d: Device) => str(rec(o.get(key))[d]);

/** Whether some row of the header sticks. */
export const hasSticky = (o: Options) =>
  ['header-above-stick', 'header-main-stick', 'header-below-stick'].some((k) =>
    Boolean(Number(o.get(k, 0))),
  );

function rules(o: Options, d: Device): Rules {
  const s = '.zn-header-sticked';
  const width = rec(o.get('sticky-header-logo-width'));
  const w = str(width[d]);
  return {
    [`${s} .zn-above-header-bar`]: {
      background: at(o, 'sticky-above-header-bg-color-responsive', d),
    },
    [`${s} .main-header-bar`]: { background: at(o, 'sticky-header-bg-color-responsive', d) },
    [`${s} .zn-below-header-bar`]: {
      background: at(o, 'sticky-below-header-bg-color-responsive', d),
    },
    [`${s} .site-title a,${s} .site-title a:hover`]: {
      color: at(o, 'sticky-header-color-site-title-responsive', d),
    },
    [`${s} .main-header-menu .menu-link`]: {
      color: at(o, 'sticky-header-menu-color-responsive', d),
    },
    [`${s} .main-header-menu .menu-item:hover > .menu-link,${s} .main-header-menu .current-menu-item > .menu-link`]:
      { color: at(o, 'sticky-header-menu-h-color-responsive', d) },
    [`${s} .site-logo-img .custom-logo-link img`]: {
      'max-width': w ? `${w}${str(width[`${d}-unit`]) || 'px'}` : '',
      width: w ? `${w}${str(width[`${d}-unit`]) || 'px'}` : '',
    },
  };
}

export function stickyCss(o: Options): string {
  if (!hasSticky(o)) return '';
  return (
    parseCss(rules(o, 'desktop')) +
    parseCss(rules(o, 'tablet'), '', tablet()) +
    parseCss(rules(o, 'mobile'), '', mobile())
  );
}
