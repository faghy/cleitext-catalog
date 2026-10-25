/** The settings of the header builder: its layout, rows and elements. */
import type { Label } from '@cleitext/shared';
import { ICONS } from '../parts/icons.js';
import {
  background,
  camel,
  color,
  image,
  link,
  number,
  respNumber,
  select,
  spacing,
  text,
  toggle,
  typography,
  visibility,
  type Place,
  type Setting,
} from './define.js';
import {
  align,
  deviceColor,
  deviceSwitches,
  fontSize,
  L,
  selectNone,
  socialIcons,
  svgCode,
  switchGroup,
} from './define-builder.js';

export const H = 'section-header-builder-layout';

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

/** Padding and margin of an element (Design tab, under "Spacing"). */
export function advanced(section: string, withPadding = true): Setting[] {
  const group = L.spacing;
  return [
    ...(withPadding
      ? [spacing(`${section}-padding`, L.padding, d(section, { group }), { responsive: true })]
      : []),
    spacing(`${section}-margin`, L.margin, d(section, { group }), { responsive: true }),
  ];
}

/** The visibility of an element or a row per device (General tab, last). */
export const shown = (section: string) => visibility(section, g(section));

/** The three rows: top, main and bottom. */
function headerRow(row: 'above' | 'primary' | 'below'): Setting[] {
  const s = `section-${row}-header-builder`;
  const p = { above: 'hba', primary: 'hb', below: 'hbb' }[row];
  const sep = row === 'primary' ? 'hb-header-main-sep' : `${p}-header-separator`;
  const sepColor =
    row === 'primary' ? 'hb-header-main-sep-color' : `${p}-header-bottom-border-color`;
  return [
    respNumber(`${p}-header-height`, { en: 'Height', it: 'Altezza' }, g(s), {
      min: 30,
      max: 600,
      range: true,
    }),
    background(
      `${p}-header-bg-obj-responsive`,
      L.background,
      d(s, {
        help: {
          en: 'Not used when the header is transparent.',
          it: 'Non si applica quando l’intestazione è trasparente.',
        },
      }),
      { responsive: true },
    ),
    color(
      sepColor,
      { en: 'Bottom border color', it: 'Colore del bordo inferiore' },
      d(s, { showIf: { field: camel(sep), not: 0 } }),
    ),
    number(sep, { en: 'Bottom border size', it: 'Spessore del bordo inferiore' }, d(s), {
      min: 0,
      max: 10,
      unit: 'px',
      range: true,
    }),
    ...advanced(s),
    shown(s),
  ];
}

/** The off-canvas panel (or dropdown) that opens from the toggle button. */
function offCanvas(): Setting[] {
  const s = 'section-popup-header-builder';
  const type = 'mobileHeaderType';
  const panel = { field: type, in: ['off-canvas', 'full-width'] };
  return [
    select('mobile-header-type', { en: 'Header type', it: 'Tipo di pannello' }, g(s), [
      { value: 'off-canvas', label: { en: 'Flyout', it: 'Laterale' } },
      { value: 'full-width', label: { en: 'Full-screen', it: 'A schermo intero' } },
      { value: 'dropdown', label: { en: 'Dropdown', it: 'A discesa' } },
    ]),
    toggle(
      'off-canvas-move-body',
      { en: 'Move body', it: 'Sposta la pagina' },
      g(s, {
        showIf: { field: type, equals: 'dropdown' },
        help: {
          en: 'Shift the page content when the menu opens. Not applied to transparent and sticky headers.',
          it: 'Sposta il contenuto della pagina quando il menu si apre. Non vale per le intestazioni trasparenti e fisse.',
        },
      }),
    ),
    select(
      'off-canvas-slide',
      { en: 'Position', it: 'Posizione' },
      g(s, { showIf: { field: type, equals: 'off-canvas' } }),
      [
        { value: 'left', label: L.left },
        { value: 'right', label: L.right },
      ],
    ),
    select(
      'header-builder-menu-toggle-target',
      { en: 'Dropdown target', it: 'Cosa apre i sottomenu' },
      g(s, {
        help: {
          en: 'Icon: only the arrow opens a submenu. Link: the whole menu item does.',
          it: 'Icona: solo la freccia apre il sottomenu. Link: lo apre tutta la voce.',
        },
      }),
      [
        { value: 'icon', label: { en: 'Icon', it: 'Icona' } },
        { value: 'link', label: { en: 'Link', it: 'Link' } },
      ],
    ),
    select(
      'header-offcanvas-content-alignment',
      { en: 'Content alignment', it: 'Allineamento del contenuto' },
      g(s),
      align(true),
    ),
    background('off-canvas-background', L.background, d(s)),
    color(
      'off-canvas-close-color',
      { en: 'Close icon color', it: 'Colore dell’icona di chiusura' },
      d(s, { showIf: panel }),
    ),
    number(
      'off-canvas-inner-spacing',
      { en: 'Inner element spacing', it: 'Spazio tra gli elementi' },
      d(s),
      { min: 0, max: 100, unit: 'px', range: true },
    ),
    spacing(
      'off-canvas-padding',
      { en: 'Popup padding', it: 'Margine interno del pannello' },
      d(s, { group: L.spacing, showIf: panel }),
      { responsive: true },
    ),
  ];
}

/** Site title and logo. */
function siteIdentity(): Setting[] {
  const s = 'title_tagline';
  const svgOn = { field: 'useLogoSvgIcon', equals: true };
  return [
    image('custom_logo', { en: 'Logo', it: 'Logo' }, g(s)),
    image(
      'favicon',
      { en: 'Site icon (favicon)', it: 'Icona del sito (favicon)' },
      g(s, {
        help: {
          en: 'A square PNG, at least 512×512 px.',
          it: 'Un PNG quadrato, almeno 512×512 px.',
        },
      }),
    ),
    toggle(
      'different-retina-logo',
      { en: 'Different logo for retina screens', it: 'Logo diverso per schermi retina' },
      g(s, {
        help: {
          en: 'A logo twice as large, shown on high-resolution screens.',
          it: 'Un logo grande il doppio, per gli schermi ad alta risoluzione.',
        },
      }),
    ),
    image(
      'zn-header-retina-logo',
      { en: 'Retina logo', it: 'Logo retina' },
      g(s, { showIf: { field: 'differentRetinaLogo', equals: true } }),
    ),
    toggle(
      'different-mobile-logo',
      { en: 'Different logo for tablets and phones', it: 'Logo diverso per tablet e telefoni' },
      g(s),
    ),
    image(
      'mobile-header-logo',
      { en: 'Mobile logo', it: 'Logo per dispositivi mobili' },
      g(s, { showIf: { field: 'differentMobileLogo', equals: true } }),
    ),
    toggle(
      'use-logo-svg-icon',
      { en: 'Use an SVG icon as logo', it: 'Usa un’icona SVG come logo' },
      g(s, {
        help: {
          en: 'Used when no logo image is chosen.',
          it: 'Si usa quando non è scelta un’immagine del logo.',
        },
      }),
    ),
    svgCode(
      'logo-svg-icon',
      { en: 'Logo SVG icon', it: 'Icona SVG del logo' },
      g(s, {
        showIf: svgOn,
        help: {
          en: 'Paste the SVG code. Leave out the "width", "height" and "fill" attributes so the size and color options work.',
          it: 'Incolla il codice SVG. Togli gli attributi "width", "height" e "fill" perché funzionino le opzioni di dimensione e colore.',
        },
      }),
    ),
    respNumber(
      'logo-svg-site-title-gap',
      { en: 'Logo SVG gap', it: 'Spazio tra icona e titolo' },
      g(s, { showIf: svgOn }),
      { min: 0, max: 600, range: true },
    ),
    respNumber(
      'zn-header-responsive-logo-width',
      { en: 'Logo width', it: 'Larghezza del logo' },
      g(s),
      {
        min: 0,
        max: 600,
        range: true,
      },
    ),
    deviceSwitches(
      'display-site-title-responsive',
      { en: 'Show the site title', it: 'Mostra il titolo del sito' },
      g(s),
    ),
    toggle(
      'logo-title-inline',
      { en: 'Inline logo & site title', it: 'Logo e titolo sulla stessa riga' },
      g(s),
      1,
      0,
    ),
    deviceSwitches(
      'display-site-tagline-responsive',
      { en: 'Show the tagline', it: 'Mostra il motto' },
      g(s),
    ),
    shown(s),
    color(
      'header-logo-color',
      { en: 'Logo color', it: 'Colore del logo' },
      d(s, {
        help: {
          en: 'Recolors the logo: works best with transparent images.',
          it: 'Ricolora il logo: rende al meglio con immagini trasparenti.',
        },
      }),
    ),
    color(
      'header-color-site-title',
      L.normal,
      d(s, { group: { en: 'Title color', it: 'Colore del titolo' } }),
    ),
    color(
      'header-color-h-site-title',
      L.hover,
      d(s, { group: { en: 'Title color', it: 'Colore del titolo' } }),
    ),
    color('header-color-site-tagline', { en: 'Tagline', it: 'Motto' }, d(s)),
    color(
      'logo-svg-icon-color',
      L.normal,
      d(s, { group: { en: 'Logo SVG icon color', it: 'Colore dell’icona SVG' }, showIf: svgOn }),
    ),
    color(
      'logo-svg-icon-hover-color',
      L.hover,
      d(s, { group: { en: 'Logo SVG icon color', it: 'Colore dell’icona SVG' }, showIf: svgOn }),
    ),
    fontSize('font-size-site-title', { en: 'Title font size', it: 'Dimensione del titolo' }, d(s)),
    fontSize(
      'font-size-site-tagline',
      { en: 'Tagline font size', it: 'Dimensione del motto' },
      d(s),
    ),
    ...advanced(s, false),
  ];
}

/** Text, hover and active colors and backgrounds of a menu. */
function menuColors(prefix: string, s: string, linkLabel: Label): Setting[] {
  const colors = { en: 'Menu color', it: 'Colore del menu' };
  const bg = { en: 'Menu background', it: 'Sfondo del menu' };
  return [
    deviceColor(`${prefix}-color-responsive`, linkLabel, d(s, { group: colors })),
    deviceColor(`${prefix}-h-color-responsive`, L.hover, d(s, { group: colors })),
    deviceColor(`${prefix}-a-color-responsive`, L.active, d(s, { group: colors })),
    background(`${prefix}-bg-obj-responsive`, L.normal, d(s, { group: bg }), { responsive: true }),
    deviceColor(`${prefix}-h-bg-color-responsive`, L.hover, d(s, { group: bg })),
    deviceColor(`${prefix}-a-bg-color-responsive`, L.active, d(s, { group: bg })),
  ];
}

/** The primary and secondary menus. */
function headerMenu(n: 1 | 2): Setting[] {
  const s = `section-hb-menu-${n}`;
  const k = `header-menu${n}`;
  const sub = { en: 'Submenu', it: 'Sottomenu' };
  const box = { en: 'Submenu container', it: 'Riquadro del sottomenu' };
  const divider = { field: camel(`${k}-submenu-item-border`), equals: true };
  return [
    number(`${k}-submenu-width`, { en: 'Width', it: 'Larghezza' }, g(s, { group: sub }), {
      min: 0,
      max: 1920,
      unit: 'px',
      range: true,
    }),
    toggle(
      `${k}-submenu-item-border`,
      { en: 'Item divider', it: 'Divisore tra le voci' },
      g(s, { group: sub }),
    ),
    toggle(
      `${k}-menu-stack-on-mobile`,
      { en: 'Stack on tablets and phones', it: 'In colonna su tablet e telefoni' },
      g(s),
    ),
    shown(s),
    selectNone(
      `${k}-menu-hover-animation`,
      { en: 'Menu hover style', it: 'Effetto al passaggio' },
      d(s),
      [
        { value: '', label: { en: 'None', it: 'Nessuno' } },
        { value: 'zoom', label: { en: 'Zoom in', it: 'Ingrandimento' } },
        { value: 'underline', label: { en: 'Underline', it: 'Sottolineato' } },
        { value: 'overline', label: { en: 'Overline', it: 'Linea sopra' } },
      ],
    ),
    number(
      `${k}-submenu-item-b-size`,
      { en: 'Divider size', it: 'Spessore del divisore' },
      d(s, { group: box, showIf: divider }),
      {
        min: 1,
        max: 10,
        unit: 'px',
        range: true,
      },
    ),
    color(
      `${k}-submenu-item-b-color`,
      { en: 'Divider color', it: 'Colore del divisore' },
      d(s, { group: box, showIf: divider }),
    ),
    number(
      `${k}-submenu-top-offset`,
      { en: 'Top offset', it: 'Distanza dall’alto' },
      d(s, { group: box }),
      {
        min: 0,
        max: 200,
        unit: 'px',
        range: true,
      },
    ),
    selectNone(
      `${k}-submenu-container-animation`,
      { en: 'Submenu animation', it: 'Animazione del sottomenu' },
      d(s, { group: box }),
      [
        { value: '', label: { en: 'None', it: 'Nessuna' } },
        { value: 'slide-down', label: { en: 'Slide down', it: 'Scorre in basso' } },
        { value: 'slide-up', label: { en: 'Slide up', it: 'Scorre in alto' } },
        { value: 'fade', label: { en: 'Fade', it: 'Dissolvenza' } },
      ],
    ),
    spacing(
      `${k}-submenu-border`,
      { en: 'Border width', it: 'Spessore del bordo' },
      d(s, { group: box }),
      { unitless: true },
    ),
    color(
      `${k}-submenu-b-color`,
      { en: 'Border color', it: 'Colore del bordo' },
      d(s, { group: box }),
    ),
    spacing(
      `${k}-submenu-border-radius-fields`,
      { en: 'Border radius', it: 'Arrotondamento' },
      d(s, { group: box }),
      {
        responsive: true,
        corners: true,
      },
    ),
    ...menuColors(k, s, { en: 'Text / link', it: 'Testo / link' }),
    typography(
      `headerMenu${n}Font`,
      {
        family: `${k}-font-family`,
        weight: `${k}-font-weight`,
        size: `${k}-font-size`,
        extras: `${k}-font-extras`,
      },
      { en: 'Menu font', it: 'Carattere del menu' },
      d(s, { group: L.font }),
    ),
    spacing(`${k}-menu-spacing`, { en: 'Menu', it: 'Menu' }, d(s, { group: L.spacing }), {
      responsive: true,
    }),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** The menu inside the off-canvas panel. */
function mobileMenu(): Setting[] {
  const s = 'section-header-mobile-menu';
  const k = 'header-mobile-menu';
  const divider = { field: 'headerMobileMenuSubmenuItemBorder', equals: true };
  const div = { en: 'Item divider', it: 'Divisore tra le voci' };
  return [
    toggle(`${k}-submenu-item-border`, div, g(s)),
    shown(s),
    ...menuColors(k, s, { en: 'Link', it: 'Link' }),
    typography(
      'headerMobileMenuFont',
      {
        family: `${k}-font-family`,
        weight: `${k}-font-weight`,
        size: `${k}-font-size`,
        extras: 'font-extras-header-mobile-menu',
      },
      { en: 'Menu font', it: 'Carattere del menu' },
      d(s, { group: L.font }),
    ),
    number(
      `${k}-submenu-item-b-size`,
      { en: 'Divider size', it: 'Spessore del divisore' },
      d(s, { group: div, showIf: divider }),
      {
        min: 1,
        max: 10,
        unit: 'px',
        range: true,
      },
    ),
    color(
      `${k}-submenu-item-b-color`,
      { en: 'Divider color', it: 'Colore del divisore' },
      d(s, { group: div, showIf: divider }),
    ),
    spacing(
      `${k}-menu-spacing`,
      { en: 'Menu spacing', it: 'Spaziatura del menu' },
      d(s, { group: L.spacing }),
      {
        responsive: true,
      },
    ),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

const icon = (markup: string) =>
  `data:image/svg+xml,${encodeURIComponent(markup.replace(/ class="[^"]*"/, '').replace('currentColor', '#334155'))}`;

/** The button that opens the off-canvas panel. */
function toggleButton(): Setting[] {
  const s = 'section-header-mobile-trigger';
  const style = 'mobileHeaderToggleBtnStyle';
  return [
    select(
      'header-trigger-icon',
      { en: 'Icon', it: 'Icona' },
      g(s),
      [
        { value: 'menu', label: { en: 'Menu', it: 'Menu' }, image: icon(ICONS.menu) },
        { value: 'menu2', label: { en: 'Menu 2', it: 'Menu 2' }, image: icon(ICONS.menu2) },
        { value: 'menu3', label: { en: 'Menu 3', it: 'Menu 3' }, image: icon(ICONS.menu3) },
      ],
      { display: 'images' },
    ),
    select(
      'mobile-header-toggle-btn-style',
      { en: 'Toggle button style', it: 'Stile del pulsante' },
      g(s),
      [
        { value: 'fill', label: { en: 'Fill', it: 'Pieno' } },
        { value: 'outline', label: { en: 'Outline', it: 'Contorno' } },
        { value: 'minimal', label: { en: 'Minimal', it: 'Essenziale' } },
      ],
    ),
    text('mobile-header-menu-label', { en: 'Menu label', it: 'Etichetta del menu' }, g(s), {
      maxLength: 100,
    }),
    color('mobile-header-toggle-btn-color', { en: 'Icon color', it: 'Colore dell’icona' }, d(s)),
    color(
      'mobile-header-toggle-btn-bg-color',
      { en: 'Background color', it: 'Colore di sfondo' },
      d(s, { showIf: { field: style, equals: 'fill' } }),
    ),
    color(
      'mobile-header-toggle-border-color',
      { en: 'Border color', it: 'Colore del bordo' },
      d(s, { showIf: { field: style, equals: 'outline' } }),
    ),
    number(
      'mobile-header-toggle-icon-size',
      { en: 'Icon size', it: 'Dimensione dell’icona' },
      d(s),
      {
        min: 0,
        max: 100,
        unit: 'px',
        range: true,
      },
    ),
    spacing(
      'mobile-header-toggle-border-radius-fields',
      { en: 'Border radius', it: 'Arrotondamento' },
      d(s, { showIf: { field: style, not: 'minimal' } }),
      { responsive: true, corners: true },
    ),
    spacing(
      'mobile-header-toggle-btn-border-size',
      { en: 'Border width', it: 'Spessore del bordo' },
      d(s, { showIf: { field: style, equals: 'outline' } }),
      { unitless: true },
    ),
    number(
      'mobile-header-label-font-size',
      { en: 'Label font size', it: 'Dimensione dell’etichetta' },
      d(s),
      {
        min: 0,
        max: 200,
        unit: 'px',
        range: true,
      },
    ),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** The header button. */
export function button(n = 1): Setting[] {
  const s = `section-hb-button-${n}`;
  const k = `header-button${n}`;
  const textColor = { en: 'Text color', it: 'Colore del testo' };
  const bg = { en: 'Background color', it: 'Colore di sfondo' };
  const border = { en: 'Border color', it: 'Colore del bordo' };
  return [
    text(`${k}-text`, { en: 'Text', it: 'Testo' }, g(s), { maxLength: 200 }),
    link(`${k}-link-option`, { en: 'Link', it: 'Link' }, g(s)),
    shown(s),
    deviceColor(`${k}-text-color`, L.normal, d(s, { group: textColor })),
    deviceColor(`${k}-text-h-color`, L.hover, d(s, { group: textColor })),
    deviceColor(`${k}-back-color`, L.normal, d(s, { group: bg })),
    deviceColor(`${k}-back-h-color`, L.hover, d(s, { group: bg })),
    deviceColor(`${k}-border-color`, L.normal, d(s, { group: border })),
    deviceColor(`${k}-border-h-color`, L.hover, d(s, { group: border })),
    typography(
      `headerButton${n}Font`,
      {
        family: `${k}-font-family`,
        weight: `${k}-font-weight`,
        size: `${k}-font-size`,
        extras: `${k}-font-extras`,
      },
      L.font,
      d(s),
    ),
    spacing(`${k}-border-size`, { en: 'Border width', it: 'Spessore del bordo' }, d(s), {
      unitless: true,
    }),
    spacing(`${k}-border-radius-fields`, { en: 'Border radius', it: 'Arrotondamento' }, d(s), {
      responsive: true,
      corners: true,
    }),
    ...advanced(s),
  ];
}

/** An HTML element (header or footer). */
export function html(type: 'header' | 'footer', n: number): Setting[] {
  const s = `section-${type === 'header' ? 'hb' : 'fb'}-html-${n}`;
  const k = `${type}-html-${n}`;
  const linkColor = { en: 'Link color', it: 'Colore dei link' };
  return [
    text(
      k,
      { en: 'Content', it: 'Contenuto' },
      g(s, {
        help: {
          en: 'Text or HTML. Empty lines start a new paragraph.',
          it: 'Testo o HTML. Le righe vuote iniziano un nuovo paragrafo.',
        },
      }),
      { multiline: true, maxLength: 20000 },
    ),
    ...(type === 'footer'
      ? [
          select(`${k}-alignment`, { en: 'Alignment', it: 'Allineamento' }, g(s), align(), {
            responsive: true,
          }),
        ]
      : []),
    shown(s),
    deviceColor(`${k}color`, { en: 'Text color', it: 'Colore del testo' }, d(s)),
    deviceColor(`${k}link-color`, L.normal, d(s, { group: linkColor })),
    deviceColor(`${k}link-h-color`, L.hover, d(s, { group: linkColor })),
    fontSize(`font-size-${s}`, L.fontSize, d(s)),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** The search icon. */
function search(): Setting[] {
  const s = 'section-header-search';
  const live = { field: 'liveSearch', equals: true };
  return [
    respNumber('header-search-width', { en: 'Search width', it: 'Larghezza della ricerca' }, g(s), {
      min: 1,
      max: 1000,
      range: true,
    }),
    respNumber('header-search-icon-space', { en: 'Icon size', it: 'Dimensione dell’icona' }, g(s), {
      min: 0,
      max: 50,
      range: true,
    }),
    toggle(
      'live-search',
      { en: 'Live search', it: 'Ricerca istantanea' },
      g(s, {
        help: {
          en: 'Show results while typing.',
          it: 'Mostra i risultati mentre si scrive.',
        },
      }),
    ),
    switchGroup(
      'live-search-post-types',
      [
        { value: 'post', label: { en: 'Search in posts', it: 'Cerca negli articoli' } },
        { value: 'page', label: { en: 'Search in pages', it: 'Cerca nelle pagine' } },
      ],
      g(s, { showIf: live }),
    ),
    number(
      'live-search-result-count',
      { en: 'Visible results', it: 'Risultati mostrati' },
      g(s, { showIf: live }),
      {
        min: 1,
        max: 20,
      },
    ),
    shown(s),
    deviceColor('header-search-icon-color', { en: 'Icon color', it: 'Colore dell’icona' }, d(s)),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** The social icons (header or footer). */
export function social(type: 'header' | 'footer', n = 1): Setting[] {
  const s = `section-${type === 'header' ? 'hb' : 'fb'}-social-icons-${n}`;
  const k = `${type}-social-${n}`;
  const kind = `${type}Social${n}ColorType`;
  const official = { field: kind, equals: 'official' };
  const custom = { field: kind, equals: 'custom' };
  const brandHover = {
    all: [official, { field: `${type}Social${n}BrandHoverToggle`, equals: true }],
  };
  const iconColor = { en: 'Icon color', it: 'Colore delle icone' };
  const labelColor = { en: 'Label color', it: 'Colore delle etichette' };
  const bg = { en: 'Background color', it: 'Colore di sfondo' };
  return [
    socialIcons(`${type}-social-icons-${n}`, { en: 'Social icons', it: 'Icone social' }, g(s)),
    toggle(`${k}-label-toggle`, { en: 'Show label', it: 'Mostra le etichette' }, g(s)),
    ...(type === 'footer'
      ? [
          select(`${k}-alignment`, { en: 'Alignment', it: 'Allineamento' }, g(s), align(), {
            responsive: true,
          }),
        ]
      : []),
    shown(s),
    select(`${k}-color-type`, { en: 'Color type', it: 'Tipo di colori' }, d(s), [
      { value: 'custom', label: { en: 'Custom', it: 'Personalizzati' } },
      { value: 'official', label: { en: 'Official', it: 'Ufficiali' } },
    ]),
    deviceColor(`${k}-brand-color`, iconColor, d(s, { showIf: brandHover })),
    deviceColor(`${k}-brand-label-color`, labelColor, d(s, { showIf: brandHover })),
    toggle(
      `${k}-brand-hover-toggle`,
      { en: 'Brand color on hover', it: 'Colore del marchio al passaggio' },
      d(s, { showIf: official }),
    ),
    deviceColor(`${k}-color`, L.normal, d(s, { group: iconColor, showIf: custom })),
    deviceColor(`${k}-h-color`, L.hover, d(s, { group: iconColor, showIf: custom })),
    deviceColor(`${k}-label-color`, L.normal, d(s, { group: labelColor, showIf: custom })),
    deviceColor(`${k}-label-h-color`, L.hover, d(s, { group: labelColor, showIf: custom })),
    deviceColor(`${k}-bg-color`, L.normal, d(s, { group: bg, showIf: custom })),
    deviceColor(`${k}-bg-h-color`, L.hover, d(s, { group: bg, showIf: custom })),
    respNumber(`${k}-size`, { en: 'Icon size', it: 'Dimensione delle icone' }, d(s), {
      min: 0,
      max: 50,
      range: true,
    }),
    respNumber(`${k}-space`, { en: 'Icon spacing', it: 'Spazio tra le icone' }, d(s), {
      min: 0,
      max: 50,
      range: true,
    }),
    number(`${k}-bg-space`, { en: 'Icon background space', it: 'Spazio dello sfondo' }, d(s), {
      min: 0,
      max: 50,
      unit: 'px',
      range: true,
    }),
    spacing(`${k}-radius-fields`, { en: 'Icon radius', it: 'Arrotondamento delle icone' }, d(s), {
      responsive: true,
      corners: true,
    }),
    fontSize(
      `font-size-${s}`,
      { en: 'Label font size', it: 'Dimensione delle etichette' },
      d(s, { showIf: { field: `${type}Social${n}LabelToggle`, equals: true } }),
    ),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** The account icon: what logged-in and logged-out visitors see. */
function account(): Setting[] {
  const s = 'section-header-account';
  const loginStyle = 'headerAccountLoginStyle';
  const logoutStyle = 'headerAccountLogoutStyle';
  const inView = { en: 'Logged in view', it: 'Per chi ha effettuato l’accesso' };
  const outView = { en: 'Logged out view', it: 'Per chi non ha effettuato l’accesso' };
  const loginText = { field: loginStyle, equals: 'text' };
  const logoutText = { field: logoutStyle, equals: 'text' };
  const anyText = { any: [loginText, logoutText] };
  const anyIcon = {
    any: [
      { field: loginStyle, equals: 'icon' },
      { field: logoutStyle, equals: 'icon' },
    ],
  };
  const profileType = { en: 'Profile type', it: 'Tipo di profilo' };
  const textWith = { en: 'Show text with', it: 'Mostra il testo con' };
  return [
    select('header-account-login-style', profileType, g(s, { group: inView }), [
      { value: 'icon', label: { en: 'Icon', it: 'Icona' } },
      { value: 'avatar', label: { en: 'Avatar', it: 'Avatar' } },
      { value: 'text', label: { en: 'Text', it: 'Testo' } },
    ]),
    select(
      'header-account-login-style-extend-text-profile-type',
      textWith,
      g(s, {
        group: inView,
        showIf: loginText,
        help: {
          en: 'Show an icon or the avatar beside the text.',
          it: 'Mostra un’icona o l’avatar accanto al testo.',
        },
      }),
      [
        { value: 'default', label: { en: 'Nothing', it: 'Niente' } },
        { value: 'avatar', label: { en: 'Avatar', it: 'Avatar' } },
        { value: 'icon', label: { en: 'Icon', it: 'Icona' } },
      ],
    ),
    text(
      'header-account-logged-in-text',
      { en: 'Text', it: 'Testo' },
      g(s, { group: inView, showIf: loginText }),
      {
        maxLength: 100,
      },
    ),
    link(
      'header-account-login-link',
      { en: 'Account URL', it: 'Indirizzo dell’account' },
      g(s, { group: inView }),
    ),
    select('header-account-logout-style', profileType, g(s, { group: outView }), [
      { value: 'none', label: { en: 'None', it: 'Nessuno' } },
      { value: 'icon', label: { en: 'Icon', it: 'Icona' } },
      { value: 'text', label: { en: 'Text', it: 'Testo' } },
    ]),
    select(
      'header-account-logout-style-extend-text-profile-type',
      textWith,
      g(s, {
        group: outView,
        showIf: logoutText,
        help: {
          en: 'Show an icon beside the text.',
          it: 'Mostra un’icona accanto al testo.',
        },
      }),
      [
        { value: 'default', label: { en: 'Nothing', it: 'Niente' } },
        { value: 'icon', label: { en: 'Icon', it: 'Icona' } },
      ],
    ),
    text(
      'header-account-logged-out-text',
      { en: 'Text', it: 'Testo' },
      g(s, { group: outView, showIf: logoutText }),
      {
        maxLength: 100,
      },
    ),
    link(
      'header-account-logout-link',
      { en: 'Login URL', it: 'Indirizzo di accesso' },
      g(s, { group: outView, showIf: { field: logoutStyle, not: 'none' } }),
    ),
    shown(s),
    respNumber(
      'header-account-image-width',
      { en: 'Avatar width', it: 'Larghezza dell’avatar' },
      d(s, {
        showIf: {
          any: [
            { field: loginStyle, equals: 'avatar' },
            {
              all: [
                loginText,
                { field: 'headerAccountLoginStyleExtendTextProfileType', equals: 'avatar' },
              ],
            },
          ],
        },
      }),
      { min: 0, max: 100, range: true },
    ),
    respNumber(
      'header-account-icon-size',
      { en: 'Icon size', it: 'Dimensione dell’icona' },
      d(s, { showIf: anyIcon }),
      {
        min: 0,
        max: 50,
        range: true,
      },
    ),
    color(
      'header-account-icon-color',
      { en: 'Icon color', it: 'Colore dell’icona' },
      d(s, { showIf: anyIcon }),
    ),
    color(
      'header-account-type-text-color',
      { en: 'Profile text color', it: 'Colore del testo' },
      d(s, { group: { en: 'Text options', it: 'Testo' }, showIf: anyText }),
    ),
    fontSize(
      'font-size-section-header-account',
      L.fontSize,
      d(s, { group: { en: 'Text options', it: 'Testo' }, showIf: anyText }),
    ),
    spacing('header-account-margin', L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

/** A widget area of the header or of the footer (no tabs). */
export function widget(type: 'header' | 'footer', n: number): Setting[] {
  const s = `sidebar-widgets-${type}-widget-${n}`;
  const k = `${type}-widget-${n}`;
  const p: Place = { section: s };
  const linkColor = { en: 'Link color', it: 'Colore dei link' };
  return [
    ...(type === 'footer'
      ? [
          select(
            `footer-widget-alignment-${n}`,
            { en: 'Alignment', it: 'Allineamento' },
            p,
            align(),
            {
              responsive: true,
            },
          ),
        ]
      : []),
    deviceColor(`${k}-title-color`, { en: 'Heading color', it: 'Colore dei titoli' }, p),
    deviceColor(`${k}-color`, { en: 'Content color', it: 'Colore del contenuto' }, p),
    deviceColor(`${k}-link-color`, L.normal, { ...p, group: linkColor }),
    deviceColor(`${k}-link-h-color`, L.hover, { ...p, group: linkColor }),
    fontSize(`${k}-font-size`, { en: 'Title font size', it: 'Dimensione dei titoli' }, p),
    fontSize(
      `${k}-content-font-size`,
      { en: 'Content font size', it: 'Dimensione del contenuto' },
      p,
    ),
    spacing(`${s}-margin`, L.margin, p, { responsive: true }),
    visibility(s, { section: p.section, ...(p.tab ? { tab: p.tab } : {}) }),
  ];
}

/** The language switcher (header or footer): dropdown or list, flags, names or codes. */
export function languageSwitcher(type: 'header' | 'footer'): Setting[] {
  const s = `section-${type === 'header' ? 'hb' : 'fb'}-language-switcher`;
  const k = `${type}-language-switcher`;
  const linkColor = { en: 'Link color', it: 'Colore dei link' };
  return [
    select(`${k}-layout`, { en: 'Layout', it: 'Disposizione' }, g(s), [
      { value: 'dropdown', label: { en: 'Dropdown', it: 'Menu a tendina' } },
      { value: 'horizontal', label: { en: 'Inline', it: 'In riga' } },
      { value: 'vertical', label: { en: 'Stack', it: 'In colonna' } },
    ]),
    select(`${k}-display`, { en: 'Show', it: 'Mostra' }, g(s), [
      { value: 'name', label: { en: 'Native name', it: 'Nome nella lingua' } },
      { value: 'code', label: { en: 'Code', it: 'Codice' } },
    ]),
    toggle(`${k}-show-flag`, { en: 'Show flags', it: 'Mostra le bandiere' }, g(s)),
    ...(type === 'footer'
      ? [
          select(`${k}-alignment`, { en: 'Alignment', it: 'Allineamento' }, g(s), align(), {
            responsive: true,
          }),
        ]
      : []),
    shown(s),
    deviceColor(`${k}-color`, L.normal, d(s, { group: linkColor })),
    deviceColor(`${k}-h-color`, L.hover, d(s, { group: linkColor })),
    color(`${k}-bg-color`, { en: 'Dropdown background', it: 'Sfondo del menu a tendina' }, d(s)),
    fontSize(`font-size-${s}`, L.fontSize, d(s)),
    spacing(`${s}-margin`, L.margin, d(s, { group: L.spacing }), { responsive: true }),
  ];
}

export function headerSettings(): Setting[] {
  return [
    select(
      'hb-header-main-layout-width',
      { en: 'Width', it: 'Larghezza' },
      d(H, { help: { en: 'On computers.', it: 'Sui computer.' } }),
      [
        { value: 'full', label: { en: 'Full width', it: 'Larghezza piena' } },
        { value: 'content', label: { en: 'Content width', it: 'Larghezza del contenuto' } },
      ],
    ),
    spacing('section-header-builder-layout-margin', L.margin, d(H, { group: L.spacing }), {
      responsive: true,
    }),
    ...headerRow('above'),
    ...headerRow('primary'),
    ...headerRow('below'),
    ...offCanvas(),
    ...siteIdentity(),
    ...headerMenu(1),
    ...headerMenu(2),
    ...mobileMenu(),
    ...toggleButton(),
    ...button(),
    ...html('header', 1),
    ...html('header', 2),
    ...search(),
    ...social('header'),
    ...account(),
    ...widget('header', 1),
    ...widget('header', 2),
    ...languageSwitcher('header'),
  ];
}
