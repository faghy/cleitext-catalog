/**
 * Zenit 1.2.0, from moving a WordPress site with WPML (it/en/de): the
 * language switcher of the header and footer builders, where WPML had it
 * when the settings are imported, and the alignment of the footer widget
 * areas (CIN and CIR centred on phones too).
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
import type { Ctx } from '../src/core/context.js';
import { Options } from '../src/core/options.js';
import { dynamicCss } from '../src/css/index.js';
import { importSettings } from '../src/import.js';
import { flagOf, nativeName } from '../src/parts/language-switcher.js';
import { SETTINGS } from '../src/settings/index.js';

const ctx: Ctx = {
  view: 'single',
  postType: 'page',
  isFrontPage: false,
  isHome: false,
  meta: {},
  rtl: false,
};

/** Italian, English and German; the page is the English one, the German has no translation. */
const LOCALES: LocaleLink[] = [
  { code: 'it', name: 'Italiano', url: '/camere-familiari', current: false },
  { code: 'en', name: 'English', url: '/en/family-rooms', current: true },
  { code: 'de', name: 'Deutsch', url: '/de/', current: false },
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
  author: { id: 'u1', displayName: 'Milly', url: '/author/milly' },
  image: null,
  featuredImage: null,
  document: { schema: 1, blocks: [] },
  terms: {},
  translations: [],
  fields: {},
} as unknown as PublicEntry;

/** The page as Zenit renders it, with these options (as an imported site's). */
function render(options: Record<string, unknown>, locales: LocaleLink[] = LOCALES): string {
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
    locales,
    menus: {},
    urls: { home: '/en/', search: '/en/search' },
    entry,
    view: { kind: 'entry', entry, isFrontPage: false },
    media: new Map(),
    themeSettings: { importedOptions: JSON.stringify(options) },
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

const header = (zone: string[]) => ({
  primary: { primary_left: ['logo'], primary_right: zone },
});
const footer = (zones: Record<string, string[]>) => ({ below: zones });

/** The markup of the first element with this class, up to its `</nav>`. */
const switcher = (html: string, where: string) => {
  const start = html.indexOf(`${where}"`);
  return html.slice(start, html.indexOf('</nav>', start) + 6);
};

describe('the language switcher', () => {
  it('is an element of both builders, with its settings', () => {
    const items = (name: string) =>
      (SETTINGS.fields.find((f) => f.name === name) as unknown as { items: { name: string }[] })
        .items;
    expect(items('headerItems').map((i) => i.name)).toContain('languageSwitcher');
    expect(items('footerItems').map((i) => i.name)).toContain('languageSwitcher');
    const fields = SETTINGS.fields.map((f) => f.name);
    for (const name of [
      'headerLanguageSwitcherLayout',
      'headerLanguageSwitcherDisplay',
      'headerLanguageSwitcherShowFlag',
      'footerLanguageSwitcherAlignment',
    ])
      expect(fields).toContain(name);
  });

  it('drops down from the current language, linking the others to the translation or their home', () => {
    const html = render({ 'header-desktop-items': header(['menu-1', 'language-switcher']) });
    const nav = switcher(html, 'zn-header-language-switcher');
    expect(nav).toContain(
      '<nav class="zn-lang-switcher zn-lang-switcher-dropdown" aria-label="Languages">',
    );
    expect(nav).toContain('<summary aria-label="Language: English" lang="en">');
    expect(nav).toContain('<span class="zn-lang-name">English</span>');
    // The others, in their own language: the Italian page and the German home.
    expect(nav).toContain(
      '<a href="/camere-familiari" hrefLang="it" lang="it"><span class="zn-lang-name">Italiano</span></a>',
    );
    expect(nav).toContain(
      '<a href="/de/" hrefLang="de" lang="de"><span class="zn-lang-name">Deutsch</span></a>',
    );
    expect(nav).not.toContain('href="/en/family-rooms"');
    // Its colors, font size and visibility only when placed.
    const css = dynamicCss(
      new Options({ 'header-desktop-items': header(['language-switcher']) }),
      ctx,
    );
    expect(css).toContain('.zn-header-language-switcher{display:flex;}');
    expect(dynamicCss(new Options({}), ctx)).not.toContain('zn-header-language-switcher');
  });

  it('lists the languages with flags or codes, the current one marked', () => {
    const html = render({
      'footer-desktop-items': footer({ below_1: ['copyright', 'language-switcher'] }),
      'footer-language-switcher-show-flag': true,
      'footer-language-switcher-display': 'code',
    });
    const nav = switcher(html, 'zn-footer-language-switcher');
    expect(nav).toContain('zn-lang-switcher zn-lang-switcher-horizontal zn-lang-flags');
    expect(nav).toContain(
      '<li class="zn-lang-item zn-lang-current"><a href="/en/family-rooms" hrefLang="en" lang="en" aria-current="true"><span class="zn-lang-flag" aria-hidden="true">🇬🇧</span><span class="zn-lang-name" aria-hidden="true">EN</span><span class="screen-reader-text">English</span></a></li>',
    );
    expect(nav).toContain('🇮🇹');
    expect(nav).toContain('🇩🇪');
  });

  it('shows nothing on a site with one language', () => {
    const html = render({ 'header-desktop-items': header(['language-switcher']) }, [
      { code: 'it', name: 'Italiano', url: '/', current: true },
    ]);
    expect(html).toContain('zn-header-language-switcher"');
    expect(html).not.toContain('<nav class="zn-lang-switcher');
  });

  it('names languages natively and flags them by language or region', () => {
    expect(nativeName({ code: 'de', name: 'German' })).toBe('Deutsch');
    expect(nativeName({ code: 'xx-unknown', name: 'Klingon' })).toBe('Klingon');
    expect(flagOf('it')).toBe('🇮🇹');
    expect(flagOf('en-US')).toBe('🇺🇸');
    expect(flagOf('eo')).toBe('');
  });

  it('is aligned in the footer per device, mirrored right to left', () => {
    const o = new Options({
      'footer-desktop-items': footer({ below_1: ['language-switcher'] }),
      'footer-language-switcher-alignment': { desktop: 'right', tablet: '', mobile: 'center' },
    });
    const css = dynamicCss(o, ctx);
    expect(css).toContain('.zn-footer-language-switcher{justify-content:flex-end;}');
    expect(css).toMatch(
      /@media \(max-width:544px\)\{[^@]*\.zn-footer-language-switcher\{justify-content:center;\}/,
    );
    expect(dynamicCss(o, { ...ctx, rtl: true })).toContain(
      '.zn-footer-language-switcher{justify-content:flex-start;}',
    );
  });
});

/** Settings of the original theme with WPML's options next to them, as one JSON file. */
const BASE = {
  'site-content-layout': 'normal-width-container',
  'site-sidebar-layout': 'no-sidebar',
  'theme-color': '#0170B9',
  'header-desktop-items': {
    primary: { primary_left: ['logo'], primary_right: ['menu-1'] },
  },
  'footer-desktop-items': {
    primary: { primary_1: ['widget-1'], primary_2: ['html-1'], primary_3: ['widget-3'] },
    below: { below_1: ['copyright'], below_2: ['html-2'] },
  },
};
const layout = (values: Record<string, unknown>) =>
  new Options(JSON.parse(String(values.importedOptions)) as Record<string, unknown>);

describe('importing a WPML site', () => {
  it('puts the switcher where WPML showed it in the menu: next to the menus, as a dropdown with flags', () => {
    const values = importSettings({
      'astra-settings': BASE,
      wpml_language_switcher: {
        menus: { 3: { show: 1, is_hierarchical: 1, display_flags: 1, position_in_menu: 'after' } },
        statics: { footer: { show: 0 } },
      },
    })!;
    const o = layout(values);
    expect(o.get('header-desktop-items')).toMatchObject({
      primary: { primary_right: ['menu-1', 'language-switcher'] },
    });
    expect(JSON.stringify(o.get('header-mobile-items'))).toMatch(
      /"popup_content":\["mobile-menu","language-switcher"\]/,
    );
    expect(JSON.stringify(o.get('footer-desktop-items'))).not.toContain('language-switcher');
    expect(o.get('header-language-switcher-show-flag')).toBe(true);
    expect(o.get('header-language-switcher-layout')).toBe('dropdown');
    // Customize shows it in the layout too.
    expect(values.headerItems).toMatchObject({
      desktop: { primary: { right: ['menu1', 'languageSwitcher'] } },
    });
  });

  it('follows WPML into a footer widget area or the footer, as a list', () => {
    const widget = layout(
      importSettings({
        'astra-settings': BASE,
        wpml_language_switcher: { sidebars: { 'footer-widget-3': { show: 1 } } },
      })!,
    );
    expect(widget.get('footer-desktop-items')).toMatchObject({
      primary: { primary_3: ['widget-3', 'language-switcher'] },
    });
    // PHP's serialized option, the old switcher in the footer.
    const statics = layout(
      importSettings({
        'astra-settings': BASE,
        wpml_language_switcher:
          'a:1:{s:7:"statics";a:1:{s:6:"footer";a:2:{s:4:"show";s:1:"1";s:15:"is_hierarchical";s:1:"0";}}}',
      })!,
    );
    expect(statics.get('footer-desktop-items')).toMatchObject({
      below: { below_1: ['copyright', 'language-switcher'] },
    });
    expect(statics.get('footer-language-switcher-layout')).toBe('horizontal');
  });

  it('leaves the layout alone without WPML, or when the original theme had its own switcher', () => {
    const plain = layout(importSettings({ 'astra-settings': BASE })!);
    expect(JSON.stringify(plain.get('header-desktop-items'))).not.toContain('language-switcher');
    const own = layout(
      importSettings({
        'astra-settings': {
          ...BASE,
          'footer-desktop-items': { below: { below_2: ['language-switcher'] } },
        },
        wpml_language_switcher: { menus: { 3: { show: 1 } } },
      })!,
    );
    expect(JSON.stringify(own.get('header-desktop-items'))).not.toContain('language-switcher');
    expect(own.get('footer-desktop-items')).toMatchObject({
      below: { below_2: ['language-switcher'] },
    });
  });
});

describe('footer widget areas', () => {
  it('are the element their alignment is written for, so CIN and CIR stay centred on phones', () => {
    const options = {
      'footer-desktop-items': { primary: { primary_3: ['widget-3'] } },
      // Centred on computers, nothing of its own on tablets and phones.
      'footer-widget-alignment-3': { desktop: 'center', tablet: '', mobile: '' },
    };
    const html = render(options);
    expect(html).toContain(
      '<aside class="footer-widget-area widget-area site-footer-focus-item footer-widget-area-inner" data-section="sidebar-widgets-footer-widget-3"',
    );
    const css = dynamicCss(new Options(options), ctx);
    // Outside any media query, so every device gets it.
    expect(css).toContain(
      '.footer-widget-area[data-section="sidebar-widgets-footer-widget-3"].footer-widget-area-inner{text-align:center;}',
    );
    expect(css).not.toMatch(
      /@media[^{]*\{[^@]*widget-3"\]\.footer-widget-area-inner\{text-align:left/,
    );
  });
});
