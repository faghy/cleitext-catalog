/**
 * Zenit 1.2.2: the language switcher slot of the header and footer builders
 * shows the language plugin's switcher (Multilingual 1.6.0 on Cleitext 0.83),
 * with the slot's layout as a hint, and Zenit's own list without it.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  PageProvider,
  type LocaleLink,
  type PageContext,
  type PublicEntry,
} from '@cleitext/theme-sdk';
import theme from '../src/index.js';

const LOCALES: LocaleLink[] = [
  { code: 'it', name: 'Italiano', url: '/camere-familiari', current: false, translated: true },
  { code: 'en', name: 'English', url: '/en/family-rooms', current: true, translated: true },
];

const entry = {
  id: 'e1',
  type: 'page',
  locale: 'en',
  title: 'Family rooms',
  url: '/en/family-rooms',
  slug: 'family-rooms',
  publishedAt: '2026-10-01T10:00:00Z',
  excerpt: '',
  author: null,
  image: null,
  featuredImage: null,
  document: { schema: 1, blocks: [] },
  terms: {},
  translations: [],
  fields: {},
} as unknown as PublicEntry;

/** What the language plugin's block got, and a stand-in for its markup. */
const seen: { id: string; type: string; attrs: Record<string, unknown> }[] = [];
const renderers = new Map([
  [
    'multilingual/language-switcher',
    ({ block }: { block: { id: string; type: string; attrs: Record<string, unknown> } }) => {
      seen.push(block);
      return <nav className={`ml-switcher ${String(block.attrs.className)}`} data-plugin="" />;
    },
  ],
]);

function render(options: Record<string, unknown>, plugin: boolean): string {
  const page = {
    site: {
      id: 's1',
      title: 'Milly Rooms',
      tagline: '',
      origin: 'https://example.com',
      timezone: 'Europe/Rome',
      dateStyle: 'long',
    },
    locale: 'en',
    locales: LOCALES,
    menus: {},
    urls: { home: '/en/', search: '/en/search' },
    entry,
    view: { kind: 'entry', entry, isFrontPage: false },
    media: new Map(),
    themeSettings: { importedOptions: JSON.stringify(options) },
    ...(plugin
      ? {
          blockRenderers: renderers,
          languageSwitcher: { type: 'multilingual/language-switcher', id: 'cx-language-switcher' },
        }
      : {}),
  } as unknown as PageContext;
  const Index = theme.templates!.index!;
  return renderToStaticMarkup(
    <PageProvider value={page}>
      <theme.Layout head={{ title: 'x', alternates: [], og: {}, tags: [] } as never} css="">
        <Index kind="entry" entry={entry} isFrontPage={false} />
      </theme.Layout>
    </PageProvider>,
  );
}

const options = {
  'header-desktop-items': {
    primary: { primary_left: ['logo'], primary_right: ['language-switcher'] },
  },
  'footer-desktop-items': { below: { below_1: ['language-switcher'] } },
  'footer-language-switcher-layout': 'vertical',
};

describe('the language switcher slot with Multilingual', () => {
  it('shows the plugin’s switcher, with the slot’s layout as a hint', () => {
    seen.length = 0;
    const html = render(options, true);
    expect(html).toContain('<nav class="ml-switcher zn-lang-switcher" data-plugin=""></nav>');
    expect(html).not.toContain('<details class="zn-lang-dropdown"');
    expect(seen.map((b) => [b.id, b.attrs])).toEqual([
      [
        'cx-language-switcher',
        { placement: 'header', hint: { style: 'dropdown' }, className: 'zn-lang-switcher' },
      ],
      [
        'cx-language-switcher',
        { placement: 'footer', hint: { style: 'list' }, className: 'zn-lang-switcher' },
      ],
    ]);
  });

  it('keeps Zenit’s own switcher without the plugin', () => {
    const html = render(options, false);
    expect(html).not.toContain('data-plugin');
    expect(html).toContain(
      '<nav class="zn-lang-switcher zn-lang-switcher-dropdown" aria-label="Languages">',
    );
    expect(html).toContain('zn-lang-switcher-vertical');
  });
});
