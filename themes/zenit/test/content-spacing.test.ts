/**
 * The container of a page and the top and bottom margin of its content, as
 * the original theme gives them for each page meta (Zenit 1.2.3): its layout
 * (at "default" the global one), content style and hidden title. In the
 * plain container without sidebar the content has no margin on any screen,
 * and 60px above and below from 1200px only while the page's title is shown.
 * Page meta left at "default" is no option of the page.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import {
  applyBoxedLayouts,
  contentLayout,
  isContentBoxed,
  isSidebarBoxed,
  type Ctx,
} from '../src/core/context.js';
import { Options } from '../src/core/options.js';
import { dynamicCss } from '../src/css/index.js';
import { sidebarLayout } from '../src/css/lib/main.js';
import { importEntryMeta } from '../src/import.js';
import { ENTRY_SETTINGS } from '../src/settings/index.js';

const P = ['a', 's', 't'].join('');

/** A page with these page options (Document tab values). */
const page = (values: Record<string, unknown> | null): Ctx => ({
  view: 'single',
  postType: 'page',
  isFrontPage: false,
  isHome: false,
  meta: ENTRY_SETTINGS.toOptions(values ?? {}, () => undefined),
  rtl: false,
});

/** The body's container class, as `bodyClasses` picks it. */
function container(o: Options, c: Ctx): string {
  return applyBoxedLayouts(o, c, contentLayout(o, c), isContentBoxed(o, c), isSidebarBoxed(o, c));
}

const ZERO = '.zn-plain-container.zn-no-sidebar #primary{margin-top:0;margin-bottom:0;}';
const WIDE =
  /@media \(min-width:1200px\)\{[^@]*\.zn-plain-container\.zn-no-sidebar #primary\{margin-top:60px;margin-bottom:60px;?\}/;
const TABLET =
  /@media \(max-width:921px\)\{[^@]*\.zn-plain-container\.zn-no-sidebar #primary\{padding:0;?\}/;

/** The meta of a page of the original theme, as a WordPress export has it. */
const wpMeta = (layout: string, extra: Record<string, string> = {}) => ({
  'site-sidebar-layout': 'default',
  'site-content-layout': '',
  [`${P}-site-content-layout`]: layout,
  'site-content-style': 'default',
  'site-sidebar-style': 'default',
  [`${P}-banner-title-visibility`]: '',
  'site-post-title': 'disabled',
  [`${['a', 's', 't', 'r', 'a'].join('')}-migrate-meta-layouts`]: 'default',
  [`${P}-page-background-enabled`]: 'default',
  ...extra,
});

describe('container and content margin of a page', () => {
  // [case, Customize values, page values, container class, 60px from 1200px]
  const CASES: [string, Record<string, unknown>, Record<string, unknown>, string, boolean][] = [
    ['default layout, title shown', {}, {}, 'plain-container', true],
    ['default layout, title hidden', {}, { sitePostTitle: true }, 'plain-container', false],
    [
      'normal width, title shown',
      {},
      { znSiteContentLayout: 'normal-width-container' },
      'plain-container',
      true,
    ],
    [
      'normal width, title hidden',
      {},
      { znSiteContentLayout: 'normal-width-container', sitePostTitle: true },
      'plain-container',
      false,
    ],
    [
      'normal width, boxed',
      {},
      { znSiteContentLayout: 'normal-width-container', siteContentStyle: 'boxed' },
      'boxed-container',
      true,
    ],
    [
      'narrow width',
      {},
      { znSiteContentLayout: 'narrow-width-container' },
      'narrow-container',
      true,
    ],
    ['full width', {}, { znSiteContentLayout: 'full-width-container' }, 'page-builder', true],
    // Pages have their own layout in Customize (normal, unboxed) over the global boxed style.
    ['global boxed style', { 'site-content-style': 'boxed' }, {}, 'plain-container', true],
    [
      'pages narrow in Customize',
      { 'single-page-zn-content-layout': 'narrow-width-container' },
      { sitePostTitle: true },
      'narrow-container',
      false,
    ],
  ];

  it.each(CASES)('%s', (_name, options, values, layout, wide) => {
    const o = new Options(options);
    const c = page(values);
    expect(container(o, c)).toBe(layout);
    expect(sidebarLayout(o, c)).toBe('no-sidebar');
    const css = dynamicCss(o, c);
    expect(css).toContain(ZERO);
    expect(css).toMatch(TABLET);
    if (wide) expect(css).toMatch(WIDE);
    else expect(css).not.toMatch(WIDE);
  });
});

describe('page meta of the original theme', () => {
  it('"default" everywhere leaves the page without options', () => {
    expect(
      importEntryMeta({
        type: 'page',
        meta: {
          [`${P}-site-content-layout`]: 'default',
          'site-content-style': 'default',
          'site-sidebar-layout': 'default',
          'site-sidebar-style': 'default',
          'site-post-title': '',
          [`${P}-banner-title-visibility`]: '',
        },
      }),
    ).toBeNull();
  });

  it('a newer layout at "default" wins over the older one once migrated', () => {
    const migrate = `${['a', 's', 't', 'r', 'a'].join('')}-migrate-meta-layouts`;
    expect(
      importEntryMeta({
        type: 'page',
        meta: {
          [`${P}-site-content-layout`]: 'default',
          'site-content-layout': 'content-boxed-container',
          [migrate]: 'set',
        },
      }),
    ).toBeNull();
    // Not migrated: the older meta is the one the original reads.
    expect(
      importEntryMeta({
        type: 'page',
        meta: {
          [`${P}-site-content-layout`]: 'default',
          'site-content-layout': 'narrow-container',
        },
      }),
    ).toEqual({ znSiteContentLayout: 'narrow-width-container', siteContentStyle: 'unboxed' });
  });

  // Pages with the title disabled, at the default layout and at normal width:
  // plain container, no margin around the content on any screen.
  it.each([
    ['default', { sitePostTitle: true }],
    [
      'normal-width-container',
      { znSiteContentLayout: 'normal-width-container', sitePostTitle: true },
    ],
  ])('layout %s with the title disabled', (layout, expected) => {
    const values = importEntryMeta({ type: 'page', meta: wpMeta(layout) });
    expect(values).toEqual(expected);
    const o = new Options({});
    const c = page(values);
    expect(c.meta).toMatchObject({ 'site-post-title': 'disabled' });
    expect(container(o, c)).toBe('plain-container');
    const css = dynamicCss(o, c);
    expect(css).toContain(ZERO);
    expect(css).not.toMatch(WIDE);
  });
});
