/**
 * What Zenit Pro adds to Customize. Zenit draws these features from their
 * options; the Zenit Pro plugin registers the fields and sections (with
 * `ctx.themes.extend`), so they work only where it is active.
 */
import type { ThemeSettingsSection } from '@cleitext/theme-sdk';
import { collect } from '../settings/define.js';
import type { Ctx } from '../core/context.js';
import { blogLayout } from '../core/context.js';
import type { Options } from '../core/options.js';
import { blogProCss, blogSettings } from './blog.js';
import { STICKY, stickySettings } from './sticky-header.js';
import { stickyCss } from './sticky-css.js';

const TABS = [
  { id: 'general', label: { en: 'General', it: 'Generale' } },
  { id: 'design', label: { en: 'Design', it: 'Design' } },
];

export const PRO_SECTIONS: ThemeSettingsSection[] = [
  {
    id: STICKY,
    label: { en: 'Sticky header', it: 'Intestazione fissa' },
    parent: 'section-header-builder-layout',
    tabs: TABS,
  },
];

export const PRO = collect([...stickySettings(), ...blogSettings()]);

/** The CSS of Zenit Pro's options, after the theme's. */
export function proCss(o: Options, c: Ctx): string {
  const list = c.view === 'archive' || c.view === 'search';
  return stickyCss(o) + (list ? blogProCss(o, blogLayout(o, c)) : '');
}

/** The extension the Zenit Pro plugin registers for the theme. */
export const PRO_EXTENSION = { settings: PRO.fields, settingsSections: PRO_SECTIONS };
