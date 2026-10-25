/**
 * The title area of posts and pages as a banner (layout 2, Zenit 1.0.6):
 * printed between the header and the content, with the structure chosen in
 * Customize, its width and background types for the dynamic CSS.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { PageProvider, type PageContext, type PublicEntry } from '@cleitext/theme-sdk';
import theme from '../src/index.js';
import { dynamicCss } from '../src/css/index.js';
import { Options } from '../src/core/options.js';
import { SETTINGS } from '../src/settings/index.js';

const image = {
  id: 'm1',
  url: 'https://example.com/media/fruit.jpg',
  mime: 'image/jpeg',
  width: 1600,
  height: 900,
  alt: 'Fruit',
  variants: [],
};

function entry(type: 'page' | 'article', extra: Partial<PublicEntry> = {}): PublicEntry {
  return {
    id: 'e1',
    type,
    locale: 'en',
    title: 'Corsi di cucina',
    url: '/corsi',
    slug: 'corsi',
    publishedAt: '2026-10-01T10:00:00Z',
    excerpt: 'Cooking with fruit.',
    author: { id: 'u1', displayName: 'Serena', url: '/author/serena' },
    image: null,
    featuredImage: null,
    document: { schema: 1, blocks: [] },
    terms: {},
    translations: [],
    fields: {},
    ...extra,
  } as PublicEntry;
}

/** The page as Zenit renders it, with these Customize options (by their option names). */
function render(e: PublicEntry, options: Record<string, unknown> = {}): string {
  const themeSettings = Object.fromEntries(
    Object.entries(options).map(([key, value]) => [
      key.replace(/-([a-z0-9])/g, (_, ch: string) => ch.toUpperCase()),
      value,
    ]),
  );
  const page = {
    site: {
      id: 's1',
      title: 'Olistica',
      tagline: '',
      origin: 'https://example.com',
      timezone: 'Europe/Rome',
      dateStyle: 'long',
    },
    locale: 'en',
    locales: [],
    menus: {},
    urls: { home: '/', search: '/search' },
    entry: e,
    view: { kind: 'entry', entry: e, isFrontPage: false },
    media: new Map(),
    themeSettings,
  } as unknown as PageContext;
  const Index = theme.templates!.index!;
  return renderToStaticMarkup(
    <PageProvider value={page}>
      <theme.Layout head={{ title: 'x', alternates: [], og: {}, tags: [] } as never} css="">
        <Index kind="entry" entry={e} isFrontPage={false} />
      </theme.Layout>
    </PageProvider>,
  );
}

/** The banner's markup (the dynamic CSS names its class too). */
const BANNER = '<section class="zn-single-entry-banner"';

const between = (html: string, from: string, to: string) =>
  html.slice(html.indexOf(from), html.indexOf(to, html.indexOf(from)));

describe('the banner of posts and pages (layout 2)', () => {
  it('knows the option names Customize saves', () => {
    const fields = SETTINGS.fields.map((f) => f.name);
    expect(fields).toContain('znDynamicSinglePageLayout');
    expect(fields).toContain('znDynamicSinglePostLayout');
  });

  it('is not printed with layout 1: the title stays in the content', () => {
    const html = render(entry('page'));
    expect(html).not.toContain(BANNER);
    expect(between(html, 'id="content"', '</article>')).toContain(
      '<h1 class="entry-title" itemProp="headline">Corsi di cucina</h1>',
    );
  });

  it('prints the banner of a page above the content, with the title out of the content', () => {
    const html = render(entry('page', { featuredImage: image }), {
      'zn-dynamic-single-page-layout': 'layout-2',
    });
    const banner = between(html, '<section class="zn-single-entry-banner"', '</section>');
    expect(banner).toContain('data-post-type="page"');
    expect(banner).toContain('data-banner-layout="layout-2"');
    expect(banner).toContain('data-banner-width-type="fullwidth"');
    expect(banner).toContain('data-banner-background-type="custom"');
    // The page's default structure: the image, then the title, in the banner's container.
    expect(banner).toMatch(
      /<div class="zn-container"><div class="post-thumb-img-content post-thumb">.*<h1 class="entry-title" itemProp="headline">Corsi di cucina<\/h1><\/div>$/,
    );
    // Right before the content, after the header.
    expect(html.indexOf(BANNER)).toBeGreaterThan(html.indexOf('</header>'));
    expect(html.indexOf(BANNER)).toBeLessThan(html.indexOf('id="content"'));
    expect(html).toMatch(/<\/section><div id="content" class="site-content">/);
    expect(between(html, 'id="content"', '</article>')).not.toContain('entry-title');
    expect(html).not.toContain('class="entry-header');
  });

  it('follows the structure, width and image options of posts', () => {
    const post = entry('article', { featuredImage: image });
    const html = render(post, {
      'zn-dynamic-single-post-layout': 'layout-2',
      // As Customize saves a sortable list.
      'zn-dynamic-single-post-structure': [
        'zn-dynamic-single-post-breadcrumb',
        'zn-dynamic-single-post-title',
        'zn-dynamic-single-post-excerpt',
        'zn-dynamic-single-post-meta',
        'zn-dynamic-single-post-image',
      ].map((item) => ({ item, enabled: true })),
      'zn-dynamic-single-post-banner-width-type': 'custom',
      'zn-dynamic-single-post-article-featured-image-position-layout-2': 'below',
    });
    const banner = between(html, '<section class="zn-single-entry-banner"', '</section>');
    expect(banner).toContain('data-post-type="post"');
    expect(banner).toContain('data-banner-width-type="custom"');
    expect(banner).toContain('<p class="zn-excerpt">Cooking with fruit.</p>');
    expect(banner).toContain('class="entry-meta"');
    expect(banner.indexOf('entry-title')).toBeLessThan(banner.indexOf('zn-excerpt'));
    // "Below": the image is at the top of the article, not in the banner.
    expect(banner).not.toContain('post-thumb');
    expect(between(html, '<article', '</article>')).toContain(
      'class="zn-single-post-featured-section post-thumb"',
    );
  });

  it('can have the featured image as its background, with an overlay', () => {
    const html = render(entry('page', { featuredImage: image }), {
      'zn-dynamic-single-page-layout': 'layout-2',
      'zn-dynamic-single-page-featured-as-background': true,
      'zn-dynamic-single-page-banner-featured-overlay': 'rgba(0,0,0,0.4)',
    });
    const banner = between(html, '<section class="zn-single-entry-banner"', '</section>');
    expect(banner).toContain('data-banner-background-type="featured"');
    expect(banner).toContain(
      'background-image:linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(&quot;https://example.com/media/fruit.jpg&quot;)',
    );
    expect(banner).not.toContain('post-thumb');
    // An overlay that is not a color is left out.
    const unsafe = render(entry('page', { featuredImage: image }), {
      'zn-dynamic-single-page-layout': 'layout-2',
      'zn-dynamic-single-page-featured-as-background': true,
      'zn-dynamic-single-page-banner-featured-overlay': 'red);x:url(evil',
    });
    expect(unsafe).not.toContain('evil');
  });

  it('is not printed when the title area is off, or the page hides it', () => {
    const on = { 'zn-dynamic-single-page-layout': 'layout-2' };
    expect(render(entry('page'), { ...on, 'zn-single-page-title': false })).not.toContain(BANNER);
    const hidden = entry('page', {
      document: { schema: 1, blocks: [], editor: { id: 'fresco', data: { layout: 'canvas' } } },
    } as Partial<PublicEntry>);
    expect(render(hidden, on)).not.toContain(BANNER);
    // The page's "Hide the title" (a page builder's) keeps the banner without the title.
    const noTitle = entry('page', {
      document: { schema: 1, blocks: [], editor: { id: 'fresco', data: { hideTitle: true } } },
    } as Partial<PublicEntry>);
    const banner = render(noTitle, on);
    expect(banner).toContain(BANNER);
    expect(between(banner, BANNER, '</section>')).not.toContain('entry-title');
  });

  it('matches the dynamic CSS of the banner (height, background, colors)', () => {
    const o = new Options(
      SETTINGS.toOptions(
        {
          znDynamicSinglePageLayout: 'layout-2',
          znDynamicSinglePageBannerHeight: { desktop: 320, tablet: '', mobile: '' },
        },
        () => undefined,
      ),
    );
    const css = dynamicCss(o, {
      view: 'single',
      postType: 'page',
      isFrontPage: false,
      isHome: false,
      meta: {},
      rtl: false,
    });
    expect(css).toContain('.zn-single-entry-banner[data-post-type="page"]{');
    expect(css).toMatch(/\.zn-single-entry-banner\[data-post-type="page"\]\{[^}]*min-height:320px/);
  });
});
