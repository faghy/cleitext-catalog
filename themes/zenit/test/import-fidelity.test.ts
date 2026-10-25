/**
 * What a site imported from the original theme keeps: icon variants of the
 * social icons and their colors, heading sizes per device, the paragraphs of
 * the HTML elements and of the copyright.
 *
 * Run from the Cleitext checkout: `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 */
import { describe, expect, it } from 'vitest';
import type { Ctx } from '../src/core/context.js';
import { Options } from '../src/core/options.js';
import { dynamicCss } from '../src/css/index.js';
import { socialCss } from '../src/css/lib/elements.js';
import { importSettings } from '../src/import.js';
import { autop } from '../src/parts/autop.js';
import { socialIcon, socialIconName } from '../src/parts/social-icons.js';
import { SETTINGS } from '../src/settings/index.js';

const ctx: Ctx = {
  view: 'single',
  postType: 'page',
  isFrontPage: false,
  isHome: false,
  meta: {},
  rtl: false,
};

/** Some options of the original theme, enough to be recognised. */
const BASE = {
  'site-content-layout': 'normal-width-container',
  'site-sidebar-layout': 'no-sidebar',
  'theme-color': '#0170B9',
};

const viewBox = (svg: string) => /viewBox="([^"]+)"/.exec(svg)?.[1];

describe('social icons: the variants of the original theme', () => {
  const rss = socialIcon('rss');
  it.each([
    'facebook-round',
    'facebook-f',
    'instagram-square',
    'twitter-square',
    'linkedin-in',
    'youtube-square',
    'pinterest-p',
    'whatsapp-square',
    'telegram-plane',
    'envelope',
    'phone-alt',
    'trip_advisor',
  ])('%s has its own icon', (name) => {
    expect(socialIconName(name)).toBeDefined();
    expect(socialIcon(name)).not.toBe(rss);
  });

  it('names it does not have fall back to the network, not to the RSS icon', () => {
    expect(socialIconName('linkedin-square')).toBe('linkedin');
    expect(socialIconName('instagram-square-logo')).toBe('instagram-square');
    expect(socialIconName('youtube-play')).toBe('youtube');
    expect(socialIcon('map-marker-alt', 'facebook-2')).toBe(socialIcon('facebook'));
    expect(socialIcon('', 'nowhere')).toBe(rss);
  });

  it('a square variant is not the round icon', () => {
    expect(viewBox(socialIcon('twitter-square'))).toBe('0 0 448 512');
    expect(socialIcon('youtube-square')).not.toBe(socialIcon('youtube'));
  });

  it('an import keeps the variant and the color, also once saved in Customize', () => {
    const items = [
      {
        id: 'twitter',
        enabled: true,
        source: 'icon',
        url: 'https://x.com/a',
        color: 'var(--ast-global-color-0)',
        background: 'transparent',
        icon: 'twitter-square',
        label: 'Twitter',
      },
      {
        id: 'instagram',
        enabled: true,
        source: 'icon',
        url: 'https://instagram.com/a',
        color: '',
        background: '',
        icon: 'instagram-square',
        label: '',
      },
    ];
    const values = importSettings({ ...BASE, 'header-social-icons-1': { items } })!;
    const list = values.headerSocialIcons1 as Record<string, unknown>[];
    expect(list.map((i) => i.network)).toEqual(['twitter', 'instagram']);
    const out = SETTINGS.toOptions(values, () => undefined)['header-social-icons-1'] as {
      items: Record<string, unknown>[];
    };
    expect(out.items[0]).toMatchObject({
      id: 'twitter',
      icon: 'twitter-square',
      color: 'var(--zn-global-color-0)',
    });
    expect(out.items[1]).toMatchObject({ icon: 'instagram-square', color: '#8a3ab9' });
    // Another network chosen in Customize: its own icon and brand color.
    list[0]!.network = 'facebook';
    const changed = SETTINGS.toOptions(values, () => undefined)['header-social-icons-1'] as {
      items: Record<string, unknown>[];
    };
    expect(changed.items[0]).toMatchObject({ icon: 'facebook', color: '#557dbc' });
  });
});

describe('social icons: custom colors', () => {
  it('the paths have no fill of their own, so the color set on the svg applies', () => {
    for (const name of ['facebook', 'instagram', 'twitter-square', 'linkedin', 'email']) {
      expect(socialIcon(name)).not.toMatch(/<path[^>]*fill="currentColor"/);
    }
  });

  it('the custom color and hover color go on the svg', () => {
    const o = new Options({
      'header-desktop-items': { primary: { primary_right: ['social-icons-1'] } },
      'header-social-1-color-type': 'custom',
      'header-social-1-color': { desktop: 'var(--zn-global-color-0)', tablet: '', mobile: '' },
      'header-social-1-h-color': { desktop: '#ff0000', tablet: '', mobile: '' },
    });
    const css = socialCss(o, 'header', false);
    expect(css).toMatch(/zn-social-color-type-custom svg\{fill:var\(--zn-global-color-0\)/);
    expect(css).toMatch(/zn-builder-social-element:hover svg\{fill:#ff0000/);
  });
});

describe('heading sizes per device', () => {
  const h1 = {
    desktop: 48,
    tablet: '',
    mobile: '',
    'desktop-unit': 'px',
    'tablet-unit': 'px',
    'mobile-unit': 'px',
  };

  it('an import without tablet and phone sizes uses the desktop size there', () => {
    const values = importSettings({ ...BASE, 'font-size-h1': h1 })!;
    expect((values.h1Font as Record<string, unknown>).size).toEqual({
      desktop: 48,
      tablet: null,
      mobile: null,
    });
    const options = SETTINGS.toOptions(values, () => undefined);
    expect(options['font-size-h1']).toMatchObject({ desktop: 48, tablet: '', mobile: '' });
    const css = dynamicCss(new Options(options), ctx);
    expect(css).toContain('font-size:48px');
    expect(css).not.toMatch(/h1, \.entry-content :where\(h1\)[^{]*\{font-size:30px/);
  });

  it('sizes the site set stay', () => {
    const values = importSettings({ ...BASE, 'font-size-h1': { ...h1, tablet: 28 } })!;
    const options = SETTINGS.toOptions(values, () => undefined);
    expect(options['font-size-h1']).toMatchObject({ desktop: 48, tablet: 28, mobile: '' });
    // Saved in Customize without an import: Zenit's defaults for the devices left out.
    const own = SETTINGS.toOptions({ h1Font: { size: { desktop: 40 } } }, () => undefined);
    expect(own['font-size-h1']).toMatchObject({ desktop: 40, tablet: 30, mobile: 30 });
  });
});

describe('content width for blocks', () => {
  it('the site content width is given to blocks that take the theme’s', () => {
    const css = dynamicCss(new Options({ 'site-content-width': 1200 }), ctx);
    expect(css).toContain('--zn-normal-container-width:1200px');
    expect(css).toContain('--cx-container-width:var(--zn-normal-container-width)');
  });
});

describe('wpautop on the HTML elements and the copyright', () => {
  it('line breaks and blank lines', () => {
    expect(autop('Via Roma 1\n16100 Genova\n\nTel. 010 123')).toBe(
      '<p>Via Roma 1<br />\n16100 Genova</p>\n<p>Tel. 010 123</p>\n',
    );
  });

  it('text after a block tag gets its paragraphs too', () => {
    expect(autop('<div class="a">one</div>\ntwo\nthree')).toBe(
      '<div class="a">one</div>\n<p>two<br />\nthree</p>\n',
    );
  });

  it('inline tags stay inline, attributes keep their line breaks', () => {
    expect(autop('<a\nhref="/x">x</a> and <span style="color:red">y</span>')).toBe(
      '<p><a\nhref="/x">x</a> and <span style="color:red">y</span></p>\n',
    );
  });

  it('pre and lists are left as they are', () => {
    expect(autop('<pre>a\n\nb</pre>')).toBe('<pre>a\n\nb</pre>\n');
    expect(autop('<ul>\n<li>a</li>\n<li>b</li>\n</ul>')).toBe(
      '<ul>\n<li>a</li>\n<li>b</li>\n</ul>\n',
    );
  });

  it('empty text stays empty', () => {
    expect(autop('  \n ')).toBe('');
  });
});
