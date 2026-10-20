/**
 * What Zenit Pro adds to Customize. Zenit draws these features from their
 * options; the Zenit Pro plugin registers the fields and sections (with
 * `ctx.themes.extend`), so they work only where it is active.
 */
import type { ThemeSettingsSection } from '@cleitext/theme-sdk';
import type { FieldDefinition } from '@cleitext/shared';
import { camel, collect, type Setting } from '../settings/define.js';
import { ELEMENT_AREAS, ELEMENT_SECTIONS, elementSettings, PRO_ITEMS } from './elements.js';
import type { Ctx } from '../core/context.js';
import { blogLayout } from '../core/context.js';
import type { Options } from '../core/options.js';
import { blogProCss, blogSettings } from './blog.js';
import { MEGA_MENU_FIELDS } from './mega-menu.js';
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
  ...ELEMENT_SECTIONS,
];

/** Set where Zenit Pro is active (its default applies): unlocks its elements. */
const marker: Setting = {
  fields: [
    {
      name: 'zenitPro',
      type: 'boolean',
      label: 'Zenit Pro',
      hidden: true,
      default: true,
      section: STICKY,
    } as FieldDefinition,
  ],
  write: (values) => (values.zenitPro ? { 'zenit-pro': 1 } : {}),
};

export const PRO = collect([marker, ...stickySettings(), ...blogSettings(), ...elementSettings()]);

/** The CSS of Zenit Pro's options, after the theme's. */
export function proCss(o: Options, c: Ctx): string {
  const list = c.view === 'archive' || c.view === 'search';
  return stickyCss(o) + (list ? blogProCss(o, blogLayout(o, c)) : '');
}

/** The extension the Zenit Pro plugin registers for the theme. */
const zoneItem = (i: (typeof PRO_ITEMS.header)[number]) => ({
  name: camel(i.id),
  label: i.label,
  ...(i.section ? { section: i.section } : {}),
});

export const PRO_EXTENSION = {
  settings: PRO.fields,
  settingsSections: PRO_SECTIONS,
  zoneItems: {
    headerItems: PRO_ITEMS.header.map(zoneItem),
    footerItems: PRO_ITEMS.footer.map(zoneItem),
  },
  areas: ELEMENT_AREAS,
  menuItemFields: MEGA_MENU_FIELDS,
};
