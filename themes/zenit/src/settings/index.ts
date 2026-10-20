/**
 * Appearance → Customize for Zenit: the sections (as nested panels) and
 * the settings of each, written as options.
 */
import type { ThemeSettingsSection } from '@cleitext/theme-sdk';
import { collect, type Setting } from './define.js';
import { builderSettings, BUILDER_SECTIONS } from './builder.js';
import { globalSettings, GLOBAL_SECTIONS } from './global.js';
import { entrySettings } from './entry.js';

const TABS = [
  { id: 'general', label: { en: 'General', it: 'Generale' } },
  { id: 'design', label: { en: 'Design', it: 'Design' } },
];

export const SECTIONS: ThemeSettingsSection[] = [...GLOBAL_SECTIONS, ...BUILDER_SECTIONS].map(
  (s) => ('tabs' in s && s.tabs === true ? { ...s, tabs: TABS } : (s as ThemeSettingsSection)),
);

const ALL: Setting[] = [...globalSettings(), ...builderSettings()];

export const SETTINGS = collect(ALL);

/** The options of single pages (Document tab of the editor). */
export const ENTRY_SETTINGS = collect(entrySettings());
