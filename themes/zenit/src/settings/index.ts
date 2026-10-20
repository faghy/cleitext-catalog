/**
 * Appearance → Customize for Zenit: the sections (as nested panels) and
 * the settings of each, written as options.
 */
import type { FieldDefinition } from '@cleitext/shared';
import type { ThemeSettingsSection } from '@cleitext/theme-sdk';
import { code, collect, type Setting } from './define.js';
import { builderSettings, BUILDER_SECTIONS } from './builder.js';
import { globalSettings, GLOBAL_SECTIONS } from './global.js';
import { entrySettings } from './entry.js';

const TABS = [
  { id: 'general', label: { en: 'General', it: 'Generale' } },
  { id: 'design', label: { en: 'Design', it: 'Design' } },
];

/** The builders' own sections: their first tab lists the elements in use. */
const BUILDER_TABS = [
  { id: 'general', label: { en: 'Elements', it: 'Elementi' } },
  { id: 'design', label: { en: 'Design', it: 'Design' } },
];
const BUILDERS = new Set(['section-header-builder-layout', 'section-footer-builder-layout']);

const withTabs = (s: (typeof GLOBAL_SECTIONS)[number] | (typeof BUILDER_SECTIONS)[number]) =>
  'tabs' in s && s.tabs === true
    ? { ...s, tabs: BUILDERS.has(s.id) ? BUILDER_TABS : TABS }
    : (s as ThemeSettingsSection);

/** Where each section goes in the tree of panels, and the panels' names. */
const GENERAL = 'panel-general';
const MOVED: Record<string, string> = {
  'section-sidebars': GENERAL,
  'section-breadcrumb': GENERAL,
  'section-scroll-to-top': GENERAL,
  'section-block-editor': GENERAL,
  'section-accessibility': GENERAL,
  'section-global-misc': GENERAL,
};
const RENAMED: Record<string, ThemeSettingsSection['label']> = {
  'section-blog-group': { en: 'Post types', it: 'Tipi di contenuto' },
  'section-header-builder-layout': { en: 'Header', it: 'Intestazione' },
  'section-footer-builder-layout': { en: 'Footer', it: 'Piè di pagina' },
};
/** The order of the first level, as the reference's panel. */
const ROOT = [
  'panel-global',
  'section-header-builder-layout',
  'section-blog-group',
  GENERAL,
  'section-footer-builder-layout',
  'section-custom-css',
];

const all: ThemeSettingsSection[] = [
  ...[...GLOBAL_SECTIONS, ...BUILDER_SECTIONS].map(withTabs),
  { id: GENERAL, label: { en: 'General', it: 'Generale' } },
  { id: 'section-custom-css', label: { en: 'Additional CSS', it: 'CSS aggiuntivo' } },
].map((s) => ({
  ...s,
  ...(MOVED[s.id] ? { parent: MOVED[s.id] } : {}),
  ...(RENAMED[s.id] ? { label: RENAMED[s.id]! } : {}),
}));

/** Panels first in the reference's order, each followed by its sections. */
export const SECTIONS: ThemeSettingsSection[] = [
  ...ROOT.flatMap((id) => [
    ...all.filter((s) => s.id === id),
    ...all.filter((s) => s.parent === id),
  ]),
  ...all.filter((s) => !ROOT.includes(s.id) && !(s.parent && ROOT.includes(s.parent))),
];

const ALL: Setting[] = [
  ...globalSettings(),
  ...builderSettings(),
  {
    fields: [
      {
        name: 'importedOptions',
        type: 'text',
        multiline: true,
        maxLength: 100_000,
        hidden: true,
        label: { en: 'Imported settings', it: 'Impostazioni importate' },
        section: 'section-custom-css',
      } as FieldDefinition,
    ],
    write: () => ({}),
  },
  code(
    'custom-css',
    { en: 'Additional CSS', it: 'CSS aggiuntivo' },
    {
      section: 'section-custom-css',
      help: {
        en: 'CSS added to every page, after the theme’s own.',
        it: 'CSS aggiunto a ogni pagina, dopo quello del tema.',
      },
    },
  ),
];

export const SETTINGS = collect(ALL);

/** The options of single pages (Document tab of the editor). */
export const ENTRY_SETTINGS = collect(entrySettings());
