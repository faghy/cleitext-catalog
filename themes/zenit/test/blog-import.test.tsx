/**
 * A blog imported from the original theme (Zenit 1.1.0): its blog options
 * kept by the settings import, the posts per page and date format given to
 * the site, the blog page as the original showed it (no title area when it
 * is off, numbered pages, its read-more label, the site's date format), the
 * pages' own options from their WordPress meta and the class prefixes for
 * imported CSS.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  PageProvider,
  type PageContext,
  type PublicEntrySummary,
  type TemplateProps,
} from '@cleitext/theme-sdk';
import theme from '../src/index.js';
import { formatPhpDate } from '../src/core/date.js';
import { CSS_PREFIXES, importEntryMeta, importSettings } from '../src/import.js';
import { pageNumbers, pageUrl } from '../src/parts/templates.js';
import { ENTRY_SETTINGS } from '../src/settings/index.js';

const SOURCE = ['astra', 'settings'].join('-');
const P = ['a', 's', 't'].join('');

/** The original theme's options of the blog, as `wp option get … --format=json` prints them. */
const OPTIONS = {
  'site-content-layout': 'normal-width-container',
  'site-sidebar-layout': 'no-sidebar',
  'theme-color': '#0170B9',
  [`${P}-archive-post-title`]: false,
  'archive-post-content-style': 'boxed',
  'blog-post-structure': ['image', 'title', 'title-meta', 'excerpt', 'read-more'],
  'blog-meta': ['date'],
  'blog-post-per-page': 6,
};

/** A file with the theme's option and the site's options (`wp option get` of each). */
const FILE = { [SOURCE]: OPTIONS, date_format: 'F j, Y', posts_per_page: '10' };

const post = (n: number): PublicEntrySummary => ({
  id: `p${n}`,
  type: 'article',
  locale: 'it',
  title: `Articolo ${n}`,
  url: `/articolo-${n}`,
  publishedAt: '2025-10-24T10:00:00Z',
  excerpt: '',
  author: null,
  image: null,
  terms: {},
});

/** The posts page (`/blog`) as Zenit renders it with these Customize values. */
function renderBlog(
  themeSettings: Record<string, unknown>,
  pagination = { page: 1, totalPages: 22, prevUrl: null, nextUrl: '/blog/page/2' },
  site: Record<string, unknown> = { dateFormat: 'F j, Y' },
): string {
  const props: TemplateProps = {
    kind: 'archive',
    title: 'Blog',
    entries: [post(1), post(2)],
    pagination,
    isHome: false,
  };
  const page = {
    site: {
      id: 's1',
      title: 'Lino',
      tagline: '',
      origin: 'https://example.com',
      timezone: 'Europe/Rome',
      dateStyle: 'long',
      ...site,
    },
    locale: 'it',
    locales: [],
    menus: {},
    urls: { home: '/', search: '/search' },
    view: props,
    media: new Map(),
    themeSettings,
  } as unknown as PageContext;
  const Index = theme.templates!.index!;
  return renderToStaticMarkup(
    <PageProvider value={page}>
      <Index {...props} />
    </PageProvider>,
  );
}

describe('the settings import of the blog options', () => {
  const values = importSettings(FILE)!;

  it('keeps options without a stored default: the title area off, the boxed container', () => {
    expect(values.znArchivePostTitle).toBe(false);
    expect(values.archivePostContentStyle).toBe('boxed');
  });

  it('keeps the read-more of the posts structure, shown and in its place', () => {
    expect(values.blogPostStructure).toEqual([
      { item: 'image', enabled: true },
      { item: 'title', enabled: true },
      { item: 'title-meta', enabled: true },
      { item: 'excerpt', enabled: true },
      { item: 'read-more', enabled: true },
      { item: 'category', enabled: false },
      { item: 'tag', enabled: false },
    ]);
  });

  it("gives the site its posts per page (the theme's own first) and date format", () => {
    expect(values['@site']).toEqual({ postsPerPage: 6, dateFormat: 'F j, Y' });
    const { 'blog-post-per-page': _, ...rest } = OPTIONS;
    void _;
    expect(importSettings({ [SOURCE]: rest, posts_per_page: '8' })!['@site']).toEqual({
      postsPerPage: 8,
    });
    expect(importSettings(rest)!['@site']).toBeUndefined();
  });
});

describe('the blog page', () => {
  const values = importSettings(FILE)!;

  it('has no title area when the blog title area is off', () => {
    expect(renderBlog(values)).not.toContain('zn-archive-title');
    expect(renderBlog({})).toContain('<h1 class="page-title zn-archive-title">Blog</h1>');
  });

  it('numbers its pages as the original: 1 2 … 22 Next →', () => {
    const html = renderBlog(values);
    const links = html
      .slice(html.indexOf('<div class="nav-links">'))
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    expect(links).toBe('1 2 … 22 Successivo →');
    expect(html).toContain('<a class="page-numbers" href="/blog/page/22">22</a>');
    expect(html).toContain('<span aria-current="page" class="page-numbers current">1</span>');
  });

  it("shows the read-more with the original's Italian label", () => {
    expect(renderBlog(values)).toContain(
      '<span class="screen-reader-text">Articolo 1</span> Leggi l&#x27;articolo »</a>',
    );
  });

  it("writes dates with the site's date format, else as before", () => {
    expect(renderBlog(values)).toContain(' Ottobre 24, 2025 ');
    expect(renderBlog(values, undefined, {})).toContain(' 24 ottobre 2025 ');
    expect(formatPhpDate('2025-10-24T10:00:00Z', 'd/m/Y', 'it', 'Europe/Rome')).toBe('24/10/2025');
  });
});

describe('page numbers and their addresses', () => {
  it('shows the ends and the neighbours of the current page', () => {
    expect(pageNumbers(1, 22)).toEqual([1, 2, null, 22]);
    expect(pageNumbers(5, 22)).toEqual([1, null, 4, 5, 6, null, 22]);
    expect(pageNumbers(22, 22)).toEqual([1, null, 21, 22]);
    expect(pageNumbers(2, 3)).toEqual([1, 2, 3]);
  });

  it('builds the address of any page from the next or the previous one', () => {
    const middle = { page: 5, prevUrl: '/blog/page/4/', nextUrl: '/blog/page/6/' };
    expect(pageUrl(middle, 1)).toBe('/blog/');
    expect(pageUrl(middle, 22)).toBe('/blog/page/22/');
    const home = { page: 3, prevUrl: '/page/2', nextUrl: null };
    expect(pageUrl(home, 1)).toBe('/');
    expect(pageUrl({ page: 2, prevUrl: '/blog', nextUrl: null }, 1)).toBe('/blog');
    expect(pageUrl({ page: 1, prevUrl: null, nextUrl: '/search?q=a&page=2' }, 9)).toBe(
      '/search?q=a&page=9',
    );
    expect(pageUrl({ page: 1, prevUrl: null, nextUrl: null }, 2)).toBeNull();
    expect(pageUrl({ page: 2, prevUrl: '/blog', nextUrl: null }, 5)).toBeNull();
  });
});

describe("the pages' options from their WordPress meta", () => {
  it('container layout, style and backgrounds, as page options', () => {
    const values = importEntryMeta({
      type: 'page',
      meta: {
        [`${P}-site-content-layout`]: 'narrow-width-container',
        'site-content-style': 'boxed',
        'site-sidebar-layout': 'default',
        'site-post-title': 'disabled',
        [`${P}-page-background-enabled`]: 'enabled',
        [`${P}-page-background-meta`]:
          'a:1:{s:7:"desktop";a:2:{s:16:"background-color";s:7:"#f5f5f5";s:15:"background-type";s:5:"color";}}',
        [`${P}-content-background-meta`]:
          'a:1:{s:7:"desktop";a:3:{s:16:"background-color";s:4:"#fff";s:15:"background-type";s:5:"image";s:16:"background-media";i:12;}}',
        _edit_lock: '1700000000:1',
      },
    });
    expect(values).toEqual({
      znSiteContentLayout: 'narrow-width-container',
      siteContentStyle: 'boxed',
      sitePostTitle: true,
      znPageBackgroundEnabled: true,
      znPageBackgroundMeta: { desktop: { type: 'color', color: '#f5f5f5' } },
      znContentBackgroundMeta: { desktop: { type: 'color', color: '#fff' } },
    });
    // As the page renders them: the options the layout and the CSS read.
    expect(ENTRY_SETTINGS.toOptions(values!, () => undefined)).toMatchObject({
      'zn-site-content-layout': 'narrow-width-container',
      'site-content-style': 'boxed',
      'zn-page-background-enabled': 'enabled',
      'zn-page-background-meta': { desktop: { 'background-color': '#f5f5f5' } },
    });
  });

  it("reads the layouts of the original's older versions", () => {
    expect(
      importEntryMeta({ type: 'page', meta: { 'site-content-layout': 'page-builder' } }),
    ).toEqual({
      znSiteContentLayout: 'full-width-container',
      siteContentStyle: 'unboxed',
    });
    expect(importEntryMeta({ type: 'post', meta: { _thumbnail_id: '5' } })).toBeNull();
  });
});

describe('class prefixes for CSS imported from WordPress', () => {
  it('maps the original prefixes to Zenit’s', () => {
    expect(theme.importCssPrefixes).toBe(CSS_PREFIXES);
    expect(CSS_PREFIXES[`${P}-`]).toBe('zn-');
    expect(theme.importEntryMeta).toBe(importEntryMeta);
  });
});
