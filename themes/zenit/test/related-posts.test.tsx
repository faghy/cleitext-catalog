/**
 * Related posts under a post (Zenit 1.3.0), as the original theme prints them:
 * Cleitext's candidates (`entry.related`) in the order and number chosen in
 * Customize, the default title in the page's language; and WordPress's base
 * styles of core blocks (columns, separators) in the static CSS.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  PageProvider,
  type PageContext,
  type PublicEntry,
  type PublicEntrySummary,
} from '@cleitext/theme-sdk';
import theme from '../src/index.js';
import { STATIC_CSS } from '../src/css/static.js';

const author = { id: 'u1', displayName: 'Serena', url: '/author/serena' };

const summary = (n: number, date: string): PublicEntrySummary => ({
  id: `00000000-0000-4000-8000-00000000000${n}`,
  type: 'article',
  locale: 'it',
  title: `Articolo ${n}`,
  url: `/articolo-${n}`,
  publishedAt: date,
  excerpt: `Uno due tre quattro cinque sei sette otto nove dieci ${n}.`,
  author,
  image:
    n === 1
      ? {
          id: 'm1',
          url: 'https://example.com/media/a.jpg',
          mime: 'image/jpeg',
          width: 1200,
          height: 675,
          alt: '',
          variants: [],
        }
      : null,
});

// Newest first, as Cleitext gives them.
const RELATED = [
  summary(3, '2026-09-03T10:00:00Z'),
  summary(2, '2026-09-02T10:00:00Z'),
  summary(1, '2026-09-01T10:00:00Z'),
];

function entry(extra: Partial<PublicEntry> = {}): PublicEntry {
  return {
    id: '00000000-0000-4000-8000-000000000099',
    type: 'article',
    locale: 'it',
    title: 'Un video',
    url: '/un-video',
    slug: 'un-video',
    publishedAt: '2026-10-01T10:00:00Z',
    excerpt: '',
    author,
    image: null,
    featuredImage: null,
    document: { schema: 1, blocks: [] },
    terms: { category: [{ slug: 'video', name: 'Video', url: '/category/video' }] },
    translations: [],
    fields: {},
    related: RELATED,
    ...extra,
  } as PublicEntry;
}

/** The page as Zenit renders it, with these Customize options (by their option names). */
function render(
  e: PublicEntry,
  options: Record<string, unknown> = {},
  locale = 'it',
  entryData: Record<string, unknown> = {},
): string {
  const themeSettings = Object.fromEntries(
    Object.entries(options).map(([key, value]) => [
      key.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase()),
      value,
    ]),
  );
  const withData = {
    ...e,
    document: { ...e.document, editor: { data: entryData } },
  } as PublicEntry;
  const page = {
    site: {
      id: 's1',
      title: 'Sito',
      tagline: '',
      origin: 'https://example.com',
      timezone: 'Europe/Rome',
      dateStyle: 'long',
    },
    locale,
    locales: [],
    menus: {},
    urls: { home: '/', search: '/search' },
    entry: withData,
    view: { kind: 'entry', entry: withData, isFrontPage: false },
    media: new Map(),
    themeSettings,
  } as unknown as PageContext;
  const Index = theme.templates!.index!;
  return renderToStaticMarkup(
    <PageProvider value={page}>
      <theme.Layout head={{ title: 'x', alternates: [], og: {}, tags: [] } as never} css="">
        <Index kind="entry" entry={withData} isFrontPage={false} />
      </theme.Layout>
    </PageProvider>,
  );
}

const CONTAINER = '<div class="zn-single-related-posts-container';
const titles = (html: string) =>
  [
    ...html.matchAll(
      /<h3 class="zn-related-post-title entry-title"><a href="[^"]*" rel="bookmark">([^<]*)</g,
    ),
  ].map((m) => m[1]);

describe('related posts', () => {
  it('asks Cleitext for candidates', () => {
    expect(theme.relatedEntries).toBe(12);
  });

  it('are not shown while turned off (the default)', () => {
    expect(render(entry())).not.toContain(CONTAINER);
  });

  it('show the configured number, oldest first by default as the original theme, in Italian', () => {
    const html = render(entry(), { 'enable-related-posts': true, 'related-posts-total-count': 2 });
    expect(html).toContain(CONTAINER);
    expect(html).toContain(
      '<div class="zn-related-posts-title-section"><h2 class="zn-related-posts-title">Articoli correlati</h2></div>',
    );
    expect(titles(html)).toEqual(['Articolo 1', 'Articolo 2']);
    // The card with an image: the image, then the title and the meta.
    expect(html).toContain(
      '<div class="zn-related-post-featured-section post-has-thumb"><div class="post-thumb-img-content post-thumb"><a aria-label="Leggi di più su Articolo 1" href="/articolo-1">',
    );
    expect(html).toMatch(/<article class="zn-related-post post-[\w-]+ post type-post/);
    expect(html).toContain('<div class="zn-related-cat-style--none zn-related-tag-style--none">');
    // After the post navigation's place, before the comments.
    expect(html.indexOf(CONTAINER)).toBeGreaterThan(html.indexOf('</article>'));
  });

  it('keep a title of the site’s own and translate only the default one', () => {
    expect(render(entry(), { 'enable-related-posts': true }, 'en')).toContain(
      '<h2 class="zn-related-posts-title">Related Posts</h2>',
    );
    const own = render(entry(), {
      'enable-related-posts': true,
      'related-posts-title': 'Leggi anche',
    });
    expect(own).toContain('<h2 class="zn-related-posts-title">Leggi anche</h2>');
  });

  it('follow the order chosen in Customize', () => {
    const newest = render(entry(), {
      'enable-related-posts': true,
      'related-posts-total-count': 3,
      'related-posts-order': 'desc',
    });
    expect(titles(newest)).toEqual(['Articolo 3', 'Articolo 2', 'Articolo 1']);
    const byTitle = render(entry(), {
      'enable-related-posts': true,
      'related-posts-order-by': 'title',
      'related-posts-order': 'desc',
      'related-posts-total-count': 1,
    });
    expect(titles(byTitle)).toEqual(['Articolo 3']);
  });

  it('show the excerpt when asked, and nothing without candidates or when hidden on the post', () => {
    const html = render(entry(), {
      'enable-related-posts': true,
      'enable-related-posts-excerpt': true,
      'related-posts-excerpt-count': 3,
    });
    expect(html).toContain('<p class="zn-related-post-excerpt">Uno due tre …</p>');
    expect(render(entry({ related: [] }), { 'enable-related-posts': true })).not.toContain(
      CONTAINER,
    );
    expect(
      render(entry(), { 'enable-related-posts': true }, 'it', { znDisableRelatedPosts: true }),
    ).not.toContain(CONTAINER);
  });

  it('go under the content, across the page, when separated', () => {
    const html = render(entry(), {
      'enable-related-posts': true,
      'related-posts-box-placement': 'outside',
      'related-posts-container-width': 'narrow',
    });
    expect(html).toContain('<div class="zn-single-related-posts-container zn-container--narrow">');
    expect(html.indexOf(CONTAINER)).toBeGreaterThan(html.indexOf('id="content"'));
    expect(html.indexOf(CONTAINER)).toBeLessThan(html.indexOf('<footer'));
    expect(html.match(new RegExp(CONTAINER, 'g'))).toHaveLength(1);
  });
});

describe('WordPress base styles of core blocks', () => {
  it('lay columns out in a row and stack them on phones', () => {
    expect(STATIC_CSS).toContain('.wp-block-columns{align-items:normal !important;');
    expect(STATIC_CSS).toContain('display:flex;flex-wrap:wrap !important}');
    expect(STATIC_CSS).toContain(
      '@media (max-width:781px){.wp-block-columns:not(.is-not-stacked-on-mobile)>.wp-block-column{flex-basis:100% !important}}',
    );
    expect(STATIC_CSS).toContain(
      ".wp-block-columns.is-not-stacked-on-mobile>.wp-block-column[style*='flex-basis']{flex-grow:0}",
    );
  });

  it('draw separators: a short line, wide and dots styles', () => {
    expect(STATIC_CSS).toContain('.wp-block-separator{border:none;border-bottom:2px solid;');
    expect(STATIC_CSS).toContain(
      '.wp-block-separator:not(.is-style-wide):not(.is-style-dots){width:100px}',
    );
    expect(STATIC_CSS).toContain('.wp-block-separator.is-style-dots:before{');
  });

  it('come before the theme’s own rules, as WordPress loads them', () => {
    expect(STATIC_CSS.indexOf('.wp-block-columns{')).toBeLessThan(
      STATIC_CSS.indexOf('.alignleft{'),
    );
  });
});
