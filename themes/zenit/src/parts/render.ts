/** What every part of the page reads: options, the page, its texts and media. */
import { usePage, type PageContext } from '@cleitext/theme-sdk';
import type { Ctx } from '../core/context.js';
import { Options } from '../core/options.js';
import { ENTRY_SETTINGS, SETTINGS } from '../settings/index.js';
import { importedOptions } from '../import.js';
import { PRO } from '../pro/index.js';
import { strings, type Strings } from '../strings.js';

export interface R {
  o: Options;
  c: Ctx;
  page: PageContext;
  t: Strings;
}

/** Class names without the empty ones. */
export const cx = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ');

/** Content types as the options name them. */
const postType = (type: string | undefined) => (!type || type === 'article' ? 'post' : type);

/**
 * The page's own options implied by the layout a page builder chose for it
 * (`editor.data.layout`, as Fresco sets it): a full-width page fills the
 * window with no sidebar, a canvas page shows only its content (no header,
 * footer or title area), like Astra does for page-builder pages. The page's
 * own Zenit options still win.
 */
function builderLayout(layout: unknown): Record<string, unknown> {
  if (layout !== 'full' && layout !== 'canvas') return {};
  const full = {
    'zn-site-content-layout': 'full-width-container',
    'site-content-style': 'unboxed',
    'site-sidebar-layout': 'no-sidebar',
  };
  if (layout === 'full') return full;
  return {
    ...full,
    'zn-global-header-display': 'disabled',
    'footer-sml-layout': 'disabled',
    'site-post-title': 'disabled',
    'zn-banner-title-visibility': 'disabled',
  };
}

/** The page as the layout rules see it. */
export function contextOf(page: PageContext, o: Options): Ctx {
  const view = page.view;
  const base = { meta: {}, rtl: false, isFrontPage: false, isHome: false };
  if (!view || view.kind === 'maintenance') return { ...base, view: '404', postType: 'post' };
  if (view.kind === 'entry') {
    const data = (view.entry.document.editor?.data ?? {}) as Record<string, unknown>;
    return {
      ...base,
      view: 'single',
      postType: postType(view.entry.type),
      isFrontPage: view.isFrontPage,
      meta: {
        ...builderLayout(data.layout),
        ...ENTRY_SETTINGS.toOptions(data, (id) => page.media.get(id)?.url),
      },
      comments: Boolean(
        view.entry.comments && (view.entry.comments.open || view.entry.comments.count > 0),
      ),
    };
  }
  if (view.kind === 'archive')
    return {
      ...base,
      view: 'archive',
      postType: postType(view.contentType),
      isHome: view.isHome,
      isFrontPage: view.isHome && !view.term && !view.author && !view.contentType,
      isTaxonomy: Boolean(view.term),
      isAuthor: Boolean(view.author),
      paginated: view.pagination.totalPages > 1,
    };
  void o;
  if (view.kind === 'search')
    return { ...base, view: 'search', postType: 'post', paginated: view.pagination.totalPages > 1 };
  return { ...base, view: view.kind, postType: 'post' };
}

const cache = new WeakMap<PageContext, R>();

/** Options, page and texts of the page being rendered. */
export function useR(): R {
  const page = usePage();
  let r = cache.get(page);
  if (!r) {
    const values = { ...(page.themeSettings ?? {}) } as Record<string, unknown>;
    // Options of an imported site first, then what Customize sets.
    const o = new Options({
      ...importedOptions(values),
      ...SETTINGS.toOptions(values, (id) => page.media.get(id)?.url),
      // Zenit Pro's fields: values only where the plugin is active.
      ...PRO.toOptions(values, (id) => page.media.get(id)?.url),
    });
    r = { o, c: contextOf(page, o), page, t: strings(page.locale) };
    cache.set(page, r);
  }
  return r;
}

/** An id usable in classes and anchors (plugin pages have ids like `plugin-page:/shop`). */
export const slugId = (id: string) => id.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
