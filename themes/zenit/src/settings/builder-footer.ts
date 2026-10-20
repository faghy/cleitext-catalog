/** The settings of the footer builder: its layout, rows and elements. */
import {
  background,
  camel,
  color,
  number,
  respNumber,
  select,
  spacing,
  text,
  type Place,
  type Setting,
} from './define.js';
import { align, deviceColor, fontSize, footerColumns, L } from './define-builder.js';
import { advanced, html, shown, social, widget } from './builder-header.js';

export const F = 'section-footer-builder-layout';

const g = (section: string, extra: Omit<Place, 'section' | 'tab'> = {}): Place => ({
  section,
  tab: 'general',
  ...extra,
});
const d = (section: string, extra: Omit<Place, 'section' | 'tab'> = {}): Place => ({
  section,
  tab: 'design',
  ...extra,
});

/** The three rows: top, main and bottom. */
function footerRow(row: 'above' | 'primary' | 'below'): Setting[] {
  const s = `section-${row}-footer-builder`;
  const p = { above: 'hba', primary: 'hb', below: 'hbb' }[row];
  const height = row === 'primary' ? 'hb-primary-footer-height' : `${p}-footer-height`;
  const sep = row === 'primary' ? 'hb-footer-main-sep' : `${p}-footer-separator`;
  const sepColor = row === 'primary' ? 'hb-footer-main-sep-color' : `${p}-footer-top-border-color`;
  return [
    footerColumns(`${p}-footer-column`, `${p}-footer-layout`, g(s)),
    select(
      `${p}-stack`,
      { en: 'Inner elements layout', it: 'Elementi nelle colonne' },
      g(s),
      [
        { value: 'stack', label: { en: 'Stack', it: 'In colonna' } },
        { value: 'inline', label: { en: 'Inline', it: 'In riga' } },
      ],
      { responsive: true },
    ),
    select(`${p}-footer-layout-width`, { en: 'Width', it: 'Larghezza' }, g(s), [
      { value: 'full', label: { en: 'Full width', it: 'Larghezza piena' } },
      { value: 'content', label: { en: 'Content width', it: 'Larghezza del contenuto' } },
    ]),
    number(height, { en: 'Height', it: 'Altezza' }, g(s), {
      min: 30,
      max: 600,
      unit: 'px',
      range: true,
    }),
    select(
      `${p}-footer-vertical-alignment`,
      { en: 'Vertical alignment', it: 'Allineamento verticale' },
      g(s),
      [
        { value: 'flex-start', label: { en: 'Top', it: 'In alto' } },
        { value: 'center', label: { en: 'Middle', it: 'Al centro' } },
        { value: 'flex-end', label: { en: 'Bottom', it: 'In basso' } },
      ],
    ),
    shown(s),
    number(sep, { en: 'Top border size', it: 'Spessore del bordo superiore' }, d(s), {
      min: 0,
      max: 600,
      unit: 'px',
      range: true,
    }),
    color(
      sepColor,
      { en: 'Border color', it: 'Colore del bordo' },
      d(s, { showIf: { field: camel(sep), not: 0 } }),
    ),
    background(`${p}-footer-bg-obj-responsive`, L.background, d(s), { responsive: true }),
    respNumber(
      `${p}-inner-spacing`,
      { en: 'Inner column spacing', it: 'Spazio tra le colonne' },
      d(s),
      {
        min: 0,
        max: 200,
        range: true,
      },
    ),
    ...advanced(s),
  ];
}

/** The copyright text. */
function copyright(): Setting[] {
  const s = 'section-footer-copyright';
  return [
    text(
      'footer-copyright-editor',
      { en: 'Text', it: 'Testo' },
      g(s, {
        help: {
          en: 'Text or HTML. [copyright] becomes ©, [current_year] the current year, [site_title] the name of the site and [theme_author] a link to the theme’s author.',
          it: 'Testo o HTML. [copyright] diventa ©, [current_year] l’anno in corso, [site_title] il nome del sito e [theme_author] un link all’autore del tema.',
        },
      }),
      { multiline: true, maxLength: 20000 },
    ),
    select('footer-copyright-alignment', { en: 'Alignment', it: 'Allineamento' }, g(s), align(), {
      responsive: true,
    }),
    shown(s),
    color('footer-copyright-color', { en: 'Text color', it: 'Colore del testo' }, d(s)),
    fontSize('font-size-section-footer-copyright', L.fontSize, d(s)),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** The footer menu. */
function footerMenu(): Setting[] {
  const s = 'section-footer-menu';
  const colors = { en: 'Link / text', it: 'Link / testo' };
  const bg = { en: 'Background', it: 'Sfondo' };
  return [
    select(
      'footer-menu-layout',
      { en: 'Layout', it: 'Disposizione' },
      g(s),
      [
        { value: 'horizontal', label: { en: 'Inline', it: 'In riga' } },
        { value: 'vertical', label: { en: 'Stack', it: 'In colonna' } },
      ],
      { responsive: true },
    ),
    select('footer-menu-alignment', { en: 'Alignment', it: 'Allineamento' }, g(s), align(true), {
      responsive: true,
    }),
    shown(s),
    deviceColor('footer-menu-color-responsive', L.normal, d(s, { group: colors })),
    deviceColor('footer-menu-h-color-responsive', L.hover, d(s, { group: colors })),
    deviceColor('footer-menu-a-color-responsive', L.active, d(s, { group: colors })),
    background('footer-menu-bg-obj-responsive', L.normal, d(s, { group: bg }), {
      responsive: true,
    }),
    deviceColor('footer-menu-h-bg-color-responsive', L.hover, d(s, { group: bg })),
    deviceColor('footer-menu-a-bg-color-responsive', L.active, d(s, { group: bg })),
    fontSize('footer-menu-font-size', { en: 'Menu font size', it: 'Dimensione del menu' }, d(s)),
    spacing(
      'footer-main-menu-spacing',
      { en: 'Menu spacing', it: 'Spaziatura del menu' },
      d(s, { group: L.spacing }),
      {
        responsive: true,
      },
    ),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

export function footerSettings(): Setting[] {
  return [
    background(
      'footer-bg-obj-responsive',
      { en: 'Background color or image', it: 'Colore o immagine di sfondo' },
      d(F, {
        help: {
          en: 'If it does not show, check the colors of the top, main and bottom rows.',
          it: 'Se non si vede, controlla i colori delle righe superiore, principale e inferiore.',
        },
      }),
      { responsive: true },
    ),
    ...advanced(F),
    ...footerRow('above'),
    ...footerRow('primary'),
    ...footerRow('below'),
    ...copyright(),
    ...footerMenu(),
    ...html('footer', 1),
    ...html('footer', 2),
    ...social('footer'),
    ...[1, 2, 3, 4].flatMap((n) => widget('footer', n)),
  ];
}
