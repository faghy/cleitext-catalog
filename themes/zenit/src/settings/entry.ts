/**
 * Options of single pages and posts (Document tab of the editor). Their
 * values become the page's own options, over the Customize ones.
 */
import type { FieldDefinition } from '@cleitext/shared';
import { background, type Place, type Setting } from './define.js';
import { pageHide, pageSelect } from './define-builder.js';

const place = (
  group: { en: string; it: string },
  extra: Omit<Place, 'section' | 'group'> = {},
): Place => ({
  section: 'zenit',
  group,
  ...extra,
});

const LAYOUT = { en: 'Layout', it: 'Impaginazione' };
const DISABLE = { en: 'Disable sections', it: 'Nascondi sezioni' };
const HEADER = { en: 'Header', it: 'Intestazione' };
const AS_CUSTOMIZE = {
  value: 'default',
  label: { en: 'As in Customize', it: 'Come in Personalizza' },
};
const STYLES = [
  AS_CUSTOMIZE,
  { value: 'unboxed', label: { en: 'Unboxed', it: 'Senza riquadro' } },
  { value: 'boxed', label: { en: 'Boxed', it: 'Riquadro' } },
];
const headerShown = { field: 'znGlobalHeaderDisplay', equals: false };
const BACKGROUND = { en: 'Background', it: 'Sfondo' };
const ownBackground = { field: 'znPageBackgroundEnabled', equals: true };

/** The page's own backgrounds are used (`'enabled'`), over the site's (since Zenit 1.1.0). */
function backgroundSwitch(): Setting {
  const key = 'zn-page-background-enabled';
  const name = 'znPageBackgroundEnabled';
  return {
    fields: [
      {
        ...place(BACKGROUND),
        name,
        type: 'boolean',
        label: { en: 'Backgrounds of this page', it: 'Sfondi di questa pagina' },
        default: false,
      } as FieldDefinition,
    ],
    write(values) {
      return values[name] === true ? { [key]: 'enabled' } : {};
    },
    read(o) {
      return key in o ? { [name]: o[key] === 'enabled' } : {};
    },
  };
}

/**
 * "Hide the title area": the title banner of the page goes
 * (`zn-banner-title-visibility`), the content keeps the global container's
 * top and bottom margin (Zenit 1.2.1). The original's older "Disable title"
 * (`site-post-title`) also drops that margin: a page imported with it keeps
 * it in a hidden field, used while the title area stays hidden.
 */
function titleHide(): Setting {
  const name = 'sitePostTitle';
  const legacy = 'znLegacyPostTitleDisabled';
  return {
    fields: [
      {
        ...place(DISABLE),
        name,
        type: 'boolean',
        label: { en: 'Hide the title area', it: 'Nascondi l’area del titolo' },
        default: false,
      } as FieldDefinition,
      {
        ...place(DISABLE),
        name: legacy,
        type: 'boolean',
        hidden: true,
        label: { en: 'Title disabled (imported)', it: 'Titolo disattivato (importato)' },
        default: false,
      } as FieldDefinition,
    ],
    write(values) {
      const v = values[name];
      if (v === undefined || v === null) return {};
      return {
        'zn-banner-title-visibility': v ? 'disabled' : '',
        ...(v && values[legacy] === true ? { 'site-post-title': 'disabled' } : {}),
      };
    },
    read(o) {
      const keys = ['site-post-title', 'zn-banner-title-visibility'].filter((k) => k in o);
      if (!keys.length) return {};
      return {
        [name]: keys.some((k) => o[k] === 'disabled'),
        ...(o['site-post-title'] === 'disabled' ? { [legacy]: true } : {}),
      };
    },
  };
}

export function entrySettings(): Setting[] {
  return [
    pageSelect(
      'zn-site-content-layout',
      { en: 'Container layout', it: 'Layout del contenitore' },
      place(LAYOUT),
      [
        AS_CUSTOMIZE,
        { value: 'normal-width-container', label: { en: 'Normal', it: 'Normale' } },
        { value: 'narrow-width-container', label: { en: 'Narrow', it: 'Stretto' } },
        { value: 'full-width-container', label: { en: 'Full width', it: 'Larghezza piena' } },
      ],
    ),
    pageSelect(
      'site-content-style',
      { en: 'Container style', it: 'Stile del contenitore' },
      place(LAYOUT),
      STYLES,
    ),
    pageSelect('site-sidebar-layout', { en: 'Sidebar', it: 'Barra laterale' }, place(LAYOUT), [
      AS_CUSTOMIZE,
      { value: 'no-sidebar', label: { en: 'No sidebar', it: 'Nessuna' } },
      { value: 'left-sidebar', label: { en: 'Left sidebar', it: 'A sinistra' } },
      { value: 'right-sidebar', label: { en: 'Right sidebar', it: 'A destra' } },
    ]),
    pageSelect(
      'site-sidebar-style',
      { en: 'Sidebar style', it: 'Stile della barra laterale' },
      place(LAYOUT),
      STYLES,
    ),
    backgroundSwitch(),
    background(
      'zn-page-background-meta',
      { en: 'Page background', it: 'Sfondo della pagina' },
      place(BACKGROUND, { showIf: ownBackground }),
      { responsive: true },
    ),
    background(
      'zn-content-background-meta',
      { en: 'Content background', it: 'Sfondo del contenuto' },
      place(BACKGROUND, { showIf: ownBackground }),
      { responsive: true },
    ),
    pageHide(
      ['zn-global-header-display'],
      { en: 'Hide the header', it: 'Nascondi l’intestazione' },
      place(DISABLE),
    ),
    pageHide(
      ['footer-sml-layout'],
      { en: 'Hide the footer', it: 'Nascondi il piè di pagina' },
      place(DISABLE),
    ),
    titleHide(),
    pageHide(
      ['zn-breadcrumbs-content'],
      { en: 'Hide the breadcrumb', it: 'Nascondi il percorso di navigazione' },
      place(DISABLE, {
        help: {
          en: 'Only when the breadcrumb is turned on in Customize.',
          it: 'Solo se il percorso di navigazione è attivo in Personalizza.',
        },
      }),
    ),
    pageHide(
      ['zn-featured-img'],
      { en: 'Hide the featured image', it: 'Nascondi l’immagine in evidenza' },
      place(DISABLE, {
        help: {
          en: 'It still shows in the lists of posts.',
          it: 'Resta visibile negli elenchi degli articoli.',
        },
      }),
    ),
    pageHide(
      ['zn-disable-related-posts'],
      { en: 'Hide the related posts', it: 'Nascondi gli articoli correlati' },
      place(DISABLE, {
        help: {
          en: 'Only when related posts are turned on in Customize.',
          it: 'Solo se gli articoli correlati sono attivi in Personalizza.',
        },
      }),
    ),
    pageHide(
      ['zn-hfb-above-header-display'],
      { en: 'Hide the top row', it: 'Nascondi la riga superiore' },
      place(HEADER, { showIf: headerShown }),
    ),
    pageHide(
      ['zn-main-header-display'],
      { en: 'Hide the main row', it: 'Nascondi la riga principale' },
      place(HEADER, { showIf: headerShown }),
    ),
    pageHide(
      ['zn-hfb-below-header-display'],
      { en: 'Hide the bottom row', it: 'Nascondi la riga inferiore' },
      place(HEADER, { showIf: headerShown }),
    ),
    pageHide(
      ['zn-hfb-mobile-header-display'],
      {
        en: 'Hide the header on tablets and phones',
        it: 'Nascondi l’intestazione su tablet e telefoni',
      },
      place(HEADER, { showIf: headerShown }),
    ),
    pageSelect(
      'theme-transparent-header-meta',
      { en: 'Transparent header', it: 'Intestazione trasparente' },
      place(HEADER, { showIf: headerShown }),
      [
        AS_CUSTOMIZE,
        { value: 'enabled', label: { en: 'On', it: 'Attiva' } },
        { value: 'disabled', label: { en: 'Off', it: 'Disattiva' } },
      ],
    ),
  ];
}
