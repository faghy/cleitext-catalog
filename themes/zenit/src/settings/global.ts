/**
 * Global and content settings: typography, colors, container, buttons,
 * sidebar, blog and pages, breadcrumbs, scroll to top, transparent header.
 */
import type { Setting } from './define.js';
import type { Section } from './define-global.js';
import { TYPOGRAPHY_SECTIONS, typographySettings } from './global-typography.js';
import { LAYOUT_SECTIONS, layoutSettings } from './global-layout.js';
import { BLOG_ARCHIVE_SECTIONS, blogArchiveSettings } from './global-blog-archive.js';
import { BLOG_SINGLE_SECTIONS, blogSingleSettings } from './global-blog-single.js';
import { EXTRAS_SECTIONS, extrasSettings } from './global-extras.js';

export const GLOBAL_SECTIONS: Section[] = [
  { id: 'panel-global', label: { en: 'Global', it: 'Globale' } },
  ...TYPOGRAPHY_SECTIONS,
  ...LAYOUT_SECTIONS,
  { id: 'section-blog-group', label: { en: 'Blog and pages', it: 'Blog e pagine' } },
  ...BLOG_ARCHIVE_SECTIONS,
  ...BLOG_SINGLE_SECTIONS,
  ...EXTRAS_SECTIONS,
];

export function globalSettings(): Setting[] {
  return [
    ...typographySettings(),
    ...layoutSettings(),
    ...blogArchiveSettings(),
    ...blogSingleSettings(),
    ...extrasSettings(),
  ];
}
