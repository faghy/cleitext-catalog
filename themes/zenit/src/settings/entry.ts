/**
 * Options of single pages and posts (Document tab of the editor). Their
 * values become the page's own options, over the Customize ones.
 */
import type { Place, Setting } from './define.js';
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
    pageHide(
      ['site-post-title', 'zn-banner-title-visibility'],
      { en: 'Hide the title area', it: 'Nascondi l’area del titolo' },
      place(DISABLE),
    ),
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
