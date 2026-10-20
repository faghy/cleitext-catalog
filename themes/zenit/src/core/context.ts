/**
 * What the page is (an entry, a list, a search, a 404) and the layout it
 * gets: container and sidebar, from the page's own options, its content
 * type's, or the site's.
 */
import type { Options } from './options.js';
import { empty, str } from './php.js';

export interface Ctx {
  /** `single`: an entry (post, page…); `archive`: a list (the blog included). */
  view: 'single' | 'archive' | 'search' | '404';
  /** The entry's type, or the listed type: `post`, `page`, `product`… */
  postType: string;
  /** The site's home page. */
  isFrontPage: boolean;
  /** The posts page (the blog's list). */
  isHome: boolean;
  /** A category or tag list. */
  isTaxonomy?: boolean;
  /** An author's list. */
  isAuthor?: boolean;
  /** The page's own options (Document tab of the editor), by option key. */
  meta: Record<string, unknown>;
  rtl: boolean;
  /** The entry has comments open or some comments. */
  comments?: boolean;
  /** A list with more than one page. */
  paginated?: boolean;
}

export const isSingular = (c: Ctx) => c.view === 'single';
/** `is_single()`: a post (not a page). */
export const isSingle = (c: Ctx) => c.view === 'single' && c.postType !== 'page';
export const isPage = (c: Ctx) => c.view === 'single' && c.postType === 'page';
/** `is_archive()`: a list that is not the blog's home. */
export const isArchive = (c: Ctx) => c.view === 'archive' && !c.isHome;
export const isSearch = (c: Ctx) => c.view === 'search';
export const is404 = (c: Ctx) => c.view === '404';

/** Post types with their own layout options. */
export const SUPPORTED_TYPES = ['post', 'page', 'product'];

/** `get_option_meta()`: the page's own value, or (unless `onlyMeta`) the option. */
export function meta(
  o: Options,
  c: Ctx,
  key: string,
  def: unknown = '',
  onlyMeta = false,
): unknown {
  const v = isSingular(c) ? c.meta[key] : undefined;
  if (v !== undefined && v !== null && v !== '' && v !== 'default') return v;
  if (onlyMeta) return def;
  return o.get(key, def);
}

/** `toggle_layout()`: a container option as the layout name the CSS uses. */
export function toggleLayout(
  o: Options,
  c: Ctx,
  key: string,
  level: 'meta' | 'single' | 'archive' | 'global',
): string {
  const value =
    level === 'meta'
      ? str(meta(o, c, key, '', true))
      : str(o.get(key, c.postType === 'post' ? 'narrow-width-container' : 'default'));
  switch (value) {
    case 'normal-width-container':
      return 'plain-container';
    case 'narrow-width-container':
      return 'narrow-container';
    case 'full-width-container':
      return 'page-builder';
    default:
      return value;
  }
}

/** `get_content_layout()`. */
export function contentLayout(o: Options, c: Ctx): string {
  let layout: string;
  if (isSingular(c)) {
    layout = meta(o, c, 'zn-site-content-layout', '', true)
      ? toggleLayout(o, c, 'zn-site-content-layout', 'meta')
      : '';
    if (empty(layout)) {
      layout = toggleLayout(o, c, `single-${c.postType}-zn-content-layout`, 'single');
      if (layout === 'default' || empty(layout))
        layout = toggleLayout(o, c, 'zn-site-content-layout', 'global');
    }
  } else {
    layout = toggleLayout(o, c, `archive-${c.postType}-zn-content-layout`, 'archive');
    if (isSearch(c)) {
      const search = str(o.get('zn-search-content-layout', 'default'));
      layout = toggleLayout(
        o,
        c,
        search !== 'default' ? 'zn-search-content-layout' : 'archive-post-zn-content-layout',
        'archive',
      );
    }
    if (layout === 'default' || empty(layout))
      layout = toggleLayout(o, c, 'zn-site-content-layout', 'global');
  }
  return layout;
}

/** `page_layout()`: the sidebar (`no-sidebar`, `left-sidebar`, `right-sidebar`). */
export function pageLayout(o: Options, c: Ctx): string {
  let layout: string;
  if (isSingular(c)) {
    layout = str(meta(o, c, 'site-sidebar-layout', '', true));
    if (empty(layout)) {
      if (SUPPORTED_TYPES.includes(c.postType))
        layout = str(o.get(`single-${c.postType}-sidebar-layout`));
      if (layout === 'default' || empty(layout)) layout = str(o.get('site-sidebar-layout'));
    }
  } else if (isSearch(c)) {
    layout = str(o.get('archive-post-sidebar-layout'));
    const search = str(o.get('zn-search-sidebar-layout', 'default'));
    layout = search !== 'default' ? search : layout;
    if (layout === 'default' || empty(layout)) layout = str(o.get('site-sidebar-layout'));
  } else {
    layout = SUPPORTED_TYPES.includes(c.postType)
      ? str(o.get(`archive-${c.postType}-sidebar-layout`))
      : '';
    if (layout === 'default' || empty(layout)) layout = str(o.get('site-sidebar-layout'));
  }
  return layout;
}

/** `get_blog_layout()`. */
export function blogLayout(o: Options, c: Ctx): string {
  return isSearch(c) && o.get('zn-search-results-style') !== '' && o.get('zn-search-results-style')
    ? str(o.get('zn-search-results-style'))
    : str(o.get('blog-layout'));
}

/** `is_content_style_boxed()`: whether the content sits in a box. */
export function isContentBoxed(o: Options, c: Ctx): boolean {
  return styleBoxed(o, c, 'content');
}

/** `is_sidebar_style_boxed()`. */
export function isSidebarBoxed(o: Options, c: Ctx): boolean {
  return styleBoxed(o, c, 'sidebar');
}

function styleBoxed(o: Options, c: Ctx, what: 'content' | 'sidebar'): boolean {
  const blogType = isSingular(c) ? 'single' : 'archive';
  const globalStyle = str(o.get(`site-${what}-style`));
  const metaStyle = str(meta(o, c, `site-${what}-style`, '', true));
  const style = str(o.get(`${blogType}-${c.postType}-${what}-style`, ''));
  let boxed = globalStyle === 'boxed';
  if (!empty(style) && style !== 'default') boxed = style === 'boxed';
  if (blogType === 'single' && !empty(metaStyle) && metaStyle !== 'default')
    boxed = metaStyle === 'boxed';
  if (isSearch(c)) {
    const search = str(o.get(`zn-search-${what}-style`, ''));
    if (!empty(search) && search !== 'default') boxed = search === 'boxed';
  }
  return boxed;
}

/** `apply_boxed_layouts()`: the layout with its boxes. */
export function applyBoxedLayouts(
  o: Options,
  c: Ctx,
  layout: string,
  boxed: boolean,
  sidebarBoxed: boolean,
): string {
  if (layout !== 'plain-container') return layout;
  const sidebar = pageLayout(o, c);
  if (sidebar === 'no-sidebar') return boxed ? 'boxed-container' : layout;
  if (boxed) return sidebarBoxed ? 'boxed-container' : 'content-boxed-container';
  return sidebarBoxed ? 'boxed-container' : layout;
}
