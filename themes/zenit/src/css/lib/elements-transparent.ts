/**
 * The transparent header: whether the page gets it, the colors of its
 * elements per device, and the last header row (which carries the bottom
 * border).
 */
import {
  is404,
  isArchive,
  isPage,
  isSearch,
  isSingle,
  meta,
  type Ctx,
} from '../../core/context.js';
import type { Options } from '../../core/options.js';
import { at, empty, isNumeric, rec } from '../../core/php.js';
import { getProp } from './elements.js';

/** A switch stored as 1, '1' or true (loose comparison with '1'). */
const on = (v: unknown): boolean => v === true || (isNumeric(v) && Number(v) === 1);

/** Whether the page shows the header over its content. */
export function isTransparentHeader(o: Options, c: Ctx): boolean {
  let enabled = !empty(o.get('transparent-header-enable'));
  const pageChoice = meta(o, c, 'theme-transparent-header-meta', 'default');
  if (enabled) {
    const archives = o.get('transparent-header-disable-archive');
    if (is404(c) && on(o.get('transparent-header-disable-404-page', archives))) enabled = false;
    if (isSearch(c) && on(o.get('transparent-header-disable-search-page', archives)))
      enabled = false;
    if (isArchive(c) && on(o.get('transparent-header-disable-archive-pages', archives)))
      enabled = false;
    // The blog list is the front page here: the option for a separate posts page never applies.
    if (c.isFrontPage && c.isHome && on(o.get('transparent-header-disable-latest-posts-index')))
      enabled = false;
    if (isPage(c) && on(o.get('transparent-header-disable-page'))) enabled = false;
    if (isSingle(c) && on(o.get('transparent-header-disable-posts'))) enabled = false;
  }
  if (pageChoice === 'enabled') enabled = true;
  else if (pageChoice === 'disabled') enabled = false;
  return enabled;
}

export const COLORS = {
  bgColor: 'transparent-header-bg-color-responsive',
  aboveTransparentBgColor: 'hba-transparent-header-bg-color-responsive',
  belowTransparentBgColor: 'hbb-transparent-header-bg-color-responsive',
  colorSiteTitle: 'transparent-header-color-site-title-responsive',
  colorHSiteTitle: 'transparent-header-color-h-site-title-responsive',
  menuBgColor: 'transparent-menu-bg-color-responsive',
  menuColor: 'transparent-menu-color-responsive',
  menuHColor: 'transparent-menu-h-color-responsive',
  subMenuColor: 'transparent-submenu-color-responsive',
  subMenuHColor: 'transparent-submenu-h-color-responsive',
  subMenuBgColor: 'transparent-submenu-bg-color-responsive',
  contentSectionTextColor: 'transparent-content-section-text-color-responsive',
  contentSectionLinkColor: 'transparent-content-section-link-color-responsive',
  contentSectionLinkHColor: 'transparent-content-section-link-h-color-responsive',
} as const;

/** The colors of the transparent header, by name and device (`menuColorTablet`). */
export function transparentColors(o: Options): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, key] of Object.entries(COLORS)) {
    const value = o.get(key);
    for (const d of ['Desktop', 'Tablet', 'Mobile'])
      out[name + d] = getProp(value, d.toLowerCase());
  }
  return out;
}

/** Whether a header row of a device has elements in any zone. */
function rowHasItems(o: Options, row: string, device: string): boolean {
  const zones = rec(at(o.get(`header-${device}-items`), row));
  return ['center', 'left', 'left_center', 'right_center', 'right'].some((z) => {
    const list = zones[`${row}_${z}`];
    return Array.isArray(list) && list.length > 0;
  });
}

/** The selector of the last header row with elements on a device, or ''. */
export function lastActiveRow(o: Options, device: 'desktop' | 'mobile'): string {
  const prefix =
    device === 'desktop'
      ? '.zn-theme-transparent-header #zn-desktop-header > '
      : '.zn-theme-transparent-header.zn-header-break-point #zn-mobile-header > ';
  let selector = '';
  for (const row of ['above', 'primary', 'below']) {
    if (!rowHasItems(o, row, device)) continue;
    selector =
      row === 'primary'
        ? `${prefix}.zn-main-header-wrap > .main-header-bar`
        : `${prefix}.zn-${row}-header-wrap > .zn-${row}-header`;
  }
  return selector;
}
