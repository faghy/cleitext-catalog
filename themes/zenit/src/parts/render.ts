/** What every part of the page reads: options, the page, its texts and media. */
import { usePage, type PageContext } from '@cleitext/theme-sdk';
import type { Ctx } from '../core/context.js';
import { Options } from '../core/options.js';
import { ENTRY_SETTINGS, SETTINGS } from '../settings/index.js';
import { importedOptions } from '../import.js';
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
      meta: ENTRY_SETTINGS.toOptions(data, (id) => page.media.get(id)?.url),
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
    });
    r = { o, c: contextOf(page, o), page, t: strings(page.locale) };
    cache.set(page, r);
  }
  return r;
}

/** An id usable in classes and anchors (plugin pages have ids like `plugin-page:/shop`). */
export const slugId = (id: string) => id.replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-|-$/g, '');
