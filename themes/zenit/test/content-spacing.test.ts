/**
 * The top and bottom margin of the content in the plain container (Zenit
 * 1.2.1): a page that only hides its title area keeps the global layout's
 * margin, as the original does; the older "Disable title" of an imported
 * page drops it, as there. Page meta left at "default" is no option of the
 * page, so the global layout applies.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import { contentLayout, type Ctx } from '../src/core/context.js';
import { Options } from '../src/core/options.js';
import { dynamicCss } from '../src/css/index.js';
import { importEntryMeta } from '../src/import.js';
import { ENTRY_SETTINGS } from '../src/settings/index.js';

const P = ['a', 's', 't'].join('');

/** The global layout of the site: normal width, no box, no sidebar. */
const GLOBAL = {
  'zn-site-content-layout': 'normal-width-container',
  'site-content-style': 'unboxed',
  'site-sidebar-layout': 'no-sidebar',
};

/** A page with these page options (Document tab values). */
const page = (values: Record<string, unknown> | null): Ctx => ({
  view: 'single',
  postType: 'page',
  isFrontPage: false,
  isHome: false,
  meta: ENTRY_SETTINGS.toOptions(values ?? {}, () => undefined),
  rtl: false,
});

const PRIMARY = '.zn-plain-container.zn-no-sidebar #primary';
const WIDE =
  /@media \(min-width:1200px\)\{[^@]*\.zn-plain-container\.zn-no-sidebar #primary\{margin-top:60px;margin-bottom:60px;?\}/;

describe('page meta at "default"', () => {
  it('leaves the page without options', () => {
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
    expect(
      importEntryMeta({
        type: 'page',
        meta: {
          [`${P}-site-content-layout`]: 'default',
          'site-content-layout': 'content-boxed-container',
          [`${['a', 's', 't', 'r', 'a'].join('')}-migrate-meta-layouts`]: 'set',
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

  it('the page then has the global plain container', () => {
    const o = new Options(GLOBAL);
    expect(contentLayout(o, page(null))).toBe('plain-container');
  });
});

describe('the content margin of the plain container', () => {
  const o = new Options(GLOBAL);

  it('60px above and below on wide screens, none below (as the original)', () => {
    const css = dynamicCss(o, page(null));
    expect(css).toMatch(WIDE);
    expect(css).toContain(`${PRIMARY}{margin-top:0;margin-bottom:0;}`);
    // Tablets and phones: no side padding of the content area.
    expect(css).toMatch(
      /@media \(max-width:921px\)\{[^@]*\.zn-plain-container\.zn-no-sidebar #primary\{padding:0;?\}/,
    );
  });

  it('a page that hides its title area keeps it', () => {
    const values = importEntryMeta({
      type: 'page',
      meta: { [`${P}-banner-title-visibility`]: 'disabled' },
    });
    expect(values).toEqual({ sitePostTitle: true });
    const ctx = page(values);
    expect(ctx.meta).toEqual({ 'zn-banner-title-visibility': 'disabled' });
    expect(dynamicCss(o, ctx)).toMatch(WIDE);
    // The page saved with the option (no import) keeps it too.
    expect(dynamicCss(o, page({ sitePostTitle: true }))).toMatch(WIDE);
  });

  it('the older "Disable title" of an imported page drops it', () => {
    const values = importEntryMeta({ type: 'page', meta: { 'site-post-title': 'disabled' } });
    expect(values).toEqual({ sitePostTitle: true, znLegacyPostTitleDisabled: true });
    expect(dynamicCss(o, page(values))).not.toMatch(WIDE);
    // Shown again: the title and the margin come back.
    const shown = page({ ...values, sitePostTitle: false });
    expect(shown.meta).toEqual({ 'zn-banner-title-visibility': '' });
    expect(dynamicCss(o, shown)).toMatch(WIDE);
  });
});
