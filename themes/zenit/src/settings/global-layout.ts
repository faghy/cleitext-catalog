/**
 * Global layout settings: container, surface colors, buttons, block editor
 * spacing, accessibility, misc, scroll to top and the sidebar.
 */
import type { FieldDefinition, Label } from '@cleitext/shared';
import { DEFAULTS } from '../core/defaults.js';
import { rec, str } from '../core/php.js';
import {
  background,
  color,
  number,
  select,
  spacing,
  toggle,
  typography,
  type Place,
  type Setting,
} from './define.js';
import type { Section } from './define-global.js';

const G = 'panel-global';
const CONTAINER = 'section-container-layout';
const COLORS = 'section-colors-background';
const BUTTONS = 'section-buttons';
const BLOCKS = 'section-block-editor';
const A11Y = 'section-accessibility';
const MISC = 'section-global-misc';
const TOP = 'section-scroll-to-top';
const SIDEBAR = 'section-sidebars';

export const LAYOUT_SECTIONS: Section[] = [
  { id: CONTAINER, label: { en: 'Container', it: 'Contenitore' }, parent: G },
  { id: BUTTONS, label: { en: 'Buttons', it: 'Pulsanti' }, parent: G, tabs: true },
  { id: BLOCKS, label: { en: 'Block editor', it: 'Editor a blocchi' }, parent: G },
  { id: A11Y, label: { en: 'Accessibility', it: 'Accessibilità' }, parent: G },
  { id: MISC, label: { en: 'Misc', it: 'Varie' }, parent: G },
  { id: TOP, label: { en: 'Scroll to top', it: 'Torna su' }, parent: G, tabs: true },
  { id: SIDEBAR, label: { en: 'Sidebar', it: 'Barra laterale' } },
];

const SIDES4 = ['top', 'right', 'bottom', 'left'] as const;

/**
 * A responsive background whose unchanged devices keep their stored type
 * (a color stored without a type stays so).
 */
function surface(key: string, label: Label, place: Place): Setting {
  const s = background(key, label, place, { responsive: true });
  const base = rec(DEFAULTS[key]);
  return {
    fields: s.fields,
    read: s.read,
    write(values, media) {
      const out = s.write(values, media);
      const v = out[key];
      if (!v) return out;
      const r = { ...rec(v) };
      for (const d of ['desktop', 'tablet', 'mobile']) {
        const dv = rec(r[d]);
        const bd = rec(base[d]);
        if (
          dv['background-type'] === 'color' &&
          str(bd['background-type']) === '' &&
          str(dv['background-color']) === str(bd['background-color']) &&
          str(dv['background-image']) === ''
        ) {
          r[d] = { ...dv, 'background-type': '' };
        }
      }
      return { [key]: r };
    },
  };
}

/** The ready-made looks of a button: corners, border, padding and (outline) colors. */
const PRESETS: { value: string; label: Label; radius: number; outline: boolean }[] = [
  { value: 'button_01', label: { en: 'Square', it: 'Squadrato' }, radius: 0, outline: false },
  { value: 'button_02', label: { en: 'Rounded', it: 'Arrotondato' }, radius: 3, outline: false },
  { value: 'button_03', label: { en: 'Pill', it: 'A pillola' }, radius: 30, outline: false },
  {
    value: 'button_04',
    label: { en: 'Square outline', it: 'Squadrato vuoto' },
    radius: 0,
    outline: true,
  },
  {
    value: 'button_05',
    label: { en: 'Rounded outline', it: 'Arrotondato vuoto' },
    radius: 3,
    outline: true,
  },
  {
    value: 'button_06',
    label: { en: 'Pill outline', it: 'A pillola vuoto' },
    radius: 30,
    outline: true,
  },
];

const sides = (n: number | string) => Object.fromEntries(SIDES4.map((s) => [s, n]));
const respSides = (desktop: number) => ({
  desktop: sides(desktop),
  tablet: sides(''),
  mobile: sides(''),
  'desktop-unit': 'px',
  'tablet-unit': 'px',
  'mobile-unit': 'px',
});

/**
 * One button's settings, led by its preset: choosing a preset writes it and
 * its corners, border, padding and colors, except those changed below.
 */
function button(id: '' | 'secondary-', place: Place): Setting {
  const p = (key: string) => `${id}${key}`;
  const g = (en: string, it: string): Place => ({ ...place, group: { en, it } });
  const parts: Setting[] = [
    color(
      p('button-color'),
      { en: 'Text color', it: 'Colore del testo' },
      g('Text color', 'Colore del testo'),
    ),
    color(
      p('button-h-color'),
      { en: 'Text color on hover', it: 'Colore del testo al passaggio' },
      g('Text color', 'Colore del testo'),
    ),
    color(
      p('button-bg-color'),
      { en: 'Background color', it: 'Colore di sfondo' },
      g('Background color', 'Colore di sfondo'),
    ),
    color(
      p('button-bg-h-color'),
      { en: 'Background color on hover', it: 'Colore di sfondo al passaggio' },
      g('Background color', 'Colore di sfondo'),
    ),
    color(
      p('theme-button-border-group-border-color'),
      { en: 'Border color', it: 'Colore del bordo' },
      g('Border color', 'Colore del bordo'),
    ),
    color(
      p('theme-button-border-group-border-h-color'),
      { en: 'Border color on hover', it: 'Colore del bordo al passaggio' },
      g('Border color', 'Colore del bordo'),
    ),
    typography(
      id ? 'secondaryButtonTextTypography' : 'buttonTextTypography',
      {
        family: p('font-family-button'),
        weight: p('font-weight-button'),
        size: p('font-size-button'),
        extras: p('font-extras-button'),
      },
      { en: 'Font', it: 'Carattere' },
      place,
    ),
    spacing(p('theme-button-padding'), { en: 'Padding', it: 'Spaziatura interna' }, place, {
      responsive: true,
    }),
    spacing(
      p('theme-button-border-group-border-size'),
      { en: 'Border width', it: 'Spessore del bordo' },
      place,
      { unitless: true },
    ),
    spacing(
      p('button-radius-fields'),
      { en: 'Border radius', it: 'Arrotondamento angoli' },
      place,
      { responsive: true, corners: true },
    ),
  ];
  const presetName = id ? 'secondaryButtonPresetStyle' : 'buttonPresetStyle';
  const fields = parts.flatMap((s) => s.fields);
  const changed = (key: string, values: Record<string, unknown>) => {
    const f = fields.find((x) => x.name === camelOf(key));
    if (!f || values[f.name] === undefined) return false;
    return JSON.stringify(values[f.name]) !== JSON.stringify((f as { default?: unknown }).default);
  };
  return {
    fields: [
      {
        ...place,
        name: presetName,
        type: 'choice',
        display: 'buttons',
        label: { en: 'Button presets', it: 'Stili predefiniti' },
        help: {
          en: 'A ready-made look: it sets the corners, border and padding you have not changed below.',
          it: 'Un aspetto già pronto: imposta angoli, bordo e spaziatura che non hai cambiato qui sotto.',
        },
        options: PRESETS.map(({ value, label }) => ({ value, label })),
      } as FieldDefinition,
      ...fields,
    ],
    write(values, media) {
      const out: Record<string, unknown> = Object.assign(
        {},
        ...parts.map((s) => s.write(values, media)),
      );
      const chosen = PRESETS.find((x) => x.value === str(values[presetName]));
      if (!chosen) return out;
      out[p('button-preset-style')] = chosen.value;
      const fill: Record<string, unknown> = {
        [p('theme-button-border-group-border-size')]: sides(chosen.outline ? 1 : 0),
        [p('button-radius-fields')]: respSides(chosen.radius),
        [p('theme-button-padding')]: {
          ...respSides(10),
          desktop: { top: 10, right: 20, bottom: 10, left: 20 },
        },
        ...(chosen.outline
          ? { [p('button-bg-color')]: 'rgba(0,0,0,0)', [p('button-color')]: '#0170B9' }
          : {}),
      };
      for (const [k, v] of Object.entries(fill)) if (!changed(k, values)) out[k] = v;
      return out;
    },
  };
}

const camelOf = (key: string) =>
  key
    .replace(/[-_]+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');

const ON = { field: 'scrollToTopEnable', equals: true };

export function layoutSettings(): Setting[] {
  const surfaceGroup = { en: 'Surface color', it: 'Colori delle superfici' };
  const primary: Place = {
    section: BUTTONS,
    tab: 'general',
    group: { en: 'Primary button', it: 'Pulsante principale' },
  };
  const secondary: Place = {
    section: BUTTONS,
    tab: 'design',
    group: { en: 'Secondary button', it: 'Pulsante secondario' },
  };
  return [
    // Container
    select(
      'zn-site-content-layout',
      { en: 'Container layout', it: 'Layout del contenitore' },
      { section: CONTAINER },
      [
        { value: 'normal-width-container', label: { en: 'Normal', it: 'Normale' } },
        { value: 'narrow-width-container', label: { en: 'Narrow', it: 'Stretto' } },
        { value: 'full-width-container', label: { en: 'Full width', it: 'Larghezza piena' } },
      ],
    ),
    select(
      'site-content-style',
      { en: 'Container style', it: 'Stile del contenitore' },
      {
        section: CONTAINER,
        help: {
          en: 'Used only when the layout is normal or narrow.',
          it: 'Vale solo con il layout normale o stretto.',
        },
      },
      [
        { value: 'unboxed', label: { en: 'Unboxed', it: 'Senza riquadro' } },
        { value: 'boxed', label: { en: 'Boxed', it: 'Riquadro' } },
      ],
    ),
    number(
      'site-content-width',
      { en: 'Container width', it: 'Larghezza del contenitore' },
      { section: CONTAINER },
      { min: 768, max: 1920, unit: 'px', range: true },
    ),
    number(
      'narrow-container-max-width',
      { en: 'Narrow container width', it: 'Larghezza del contenitore stretto' },
      { section: CONTAINER },
      { min: 400, max: 1000, unit: 'px', range: true },
    ),
    // Surface colors (shown with the colors)
    surface(
      'site-layout-outside-bg-obj-responsive',
      { en: 'Site background', it: 'Sfondo del sito' },
      { section: COLORS, group: surfaceGroup },
    ),
    surface(
      'content-bg-obj-responsive',
      { en: 'Content background', it: 'Sfondo dei contenuti' },
      { section: COLORS, group: surfaceGroup },
    ),
    // Buttons
    button('', primary),
    button('secondary-', secondary),
    // Block editor
    select(
      'wp-blocks-ui',
      { en: 'Core blocks spacing', it: 'Spaziatura dei blocchi' },
      { section: BLOCKS },
      [
        { value: 'compact', label: { en: 'Compact', it: 'Compatta' } },
        { value: 'comfort', label: { en: 'Comfort', it: 'Comoda' } },
        { value: 'custom', label: { en: 'Custom', it: 'Personalizzata' } },
      ],
    ),
    spacing(
      'wp-blocks-global-padding',
      { en: 'Size', it: 'Dimensione' },
      {
        section: BLOCKS,
        showIf: { field: 'wpBlocksUi', equals: 'custom' },
        help: {
          en: 'Inner space of Group, Columns and Cover blocks; each block can change it in its own settings.',
          it: 'Spazio interno dei blocchi Gruppo, Colonne e Copertina; ogni blocco può cambiarlo nelle sue impostazioni.',
        },
      },
      { responsive: true, units: ['em', 'px', '%'] },
    ),
    // Accessibility
    toggle(
      'site-accessibility-toggle',
      { en: 'Site accessibility', it: 'Accessibilità del sito' },
      { section: A11Y },
    ),
    select(
      'site-accessibility-highlight-type',
      { en: 'Global highlight', it: 'Evidenziazione generale' },
      { section: A11Y, showIf: { field: 'siteAccessibilityToggle', equals: true } },
      [
        { value: 'dotted', label: { en: 'Dotted', it: 'Punteggiata' } },
        { value: 'solid', label: { en: 'Solid', it: 'Continua' } },
      ],
    ),
    color(
      'site-accessibility-highlight-color',
      { en: 'Color', it: 'Colore' },
      {
        section: A11Y,
        showIf: { field: 'siteAccessibilityToggle', equals: true },
      },
    ),
    select(
      'site-accessibility-highlight-input-type',
      { en: 'Input highlight', it: 'Evidenziazione dei campi' },
      { section: A11Y, showIf: { field: 'siteAccessibilityToggle', equals: true } },
      [
        { value: 'disable', label: { en: 'Off', it: 'Disattivata' } },
        { value: 'dotted', label: { en: 'Dotted', it: 'Punteggiata' } },
        { value: 'solid', label: { en: 'Solid', it: 'Continua' } },
      ],
    ),
    color(
      'site-accessibility-highlight-input-color',
      { en: 'Input color', it: 'Colore dei campi' },
      {
        section: A11Y,
        showIf: { field: 'siteAccessibilityToggle', equals: true },
      },
    ),
    // Misc
    toggle(
      'enable-scroll-to-id',
      {
        en: 'Smooth scroll to links on the page',
        it: 'Scorrimento morbido verso i link della pagina',
      },
      { section: MISC },
    ),
    // Scroll to top
    toggle(
      'scroll-to-top-enable',
      { en: 'Show the scroll to top button', it: 'Mostra il pulsante Torna su' },
      { section: TOP, tab: 'general' },
    ),
    select(
      'scroll-to-top-on-devices',
      { en: 'Display on', it: 'Mostra su' },
      { section: TOP, tab: 'general', showIf: ON },
      [
        { value: 'desktop', label: { en: 'Desktop', it: 'Desktop' } },
        { value: 'mobile', label: { en: 'Mobile', it: 'Mobile' } },
        { value: 'both', label: { en: 'Desktop + mobile', it: 'Desktop + mobile' } },
      ],
    ),
    select(
      'scroll-to-top-icon-position',
      { en: 'Position', it: 'Posizione' },
      { section: TOP, tab: 'general', showIf: ON },
      [
        { value: 'left', label: { en: 'Left', it: 'Sinistra' } },
        { value: 'right', label: { en: 'Right', it: 'Destra' } },
      ],
    ),
    number(
      'scroll-to-top-icon-size',
      { en: 'Icon size', it: 'Dimensione icona' },
      { section: TOP, tab: 'general', showIf: ON },
      { min: 0, max: 50, unit: 'px', range: true },
    ),
    color(
      'scroll-to-top-icon-color',
      { en: 'Icon color', it: 'Colore icona' },
      {
        section: TOP,
        tab: 'design',
        showIf: ON,
        group: { en: 'Icon color', it: 'Colore icona' },
      },
    ),
    color(
      'scroll-to-top-icon-h-color',
      { en: 'Icon color on hover', it: 'Colore icona al passaggio' },
      {
        section: TOP,
        tab: 'design',
        showIf: ON,
        group: { en: 'Icon color', it: 'Colore icona' },
      },
    ),
    color(
      'scroll-to-top-icon-bg-color',
      { en: 'Background color', it: 'Colore di sfondo' },
      {
        section: TOP,
        tab: 'design',
        showIf: ON,
        group: { en: 'Background color', it: 'Colore di sfondo' },
      },
    ),
    color(
      'scroll-to-top-icon-h-bg-color',
      { en: 'Background color on hover', it: 'Colore di sfondo al passaggio' },
      {
        section: TOP,
        tab: 'design',
        showIf: ON,
        group: { en: 'Background color', it: 'Colore di sfondo' },
      },
    ),
    spacing(
      'scroll-to-top-icon-radius-fields',
      { en: 'Border radius', it: 'Arrotondamento angoli' },
      { section: TOP, tab: 'design', showIf: ON },
      { responsive: true, corners: true },
    ),
    // Sidebar
    select(
      'site-sidebar-layout',
      { en: 'Default layout', it: 'Layout predefinito' },
      {
        section: SIDEBAR,
        help: {
          en: 'The sidebar shows only when the container layout is normal.',
          it: 'La barra laterale compare solo con il layout del contenitore normale.',
        },
      },
      [
        { value: 'no-sidebar', label: { en: 'No sidebar', it: 'Nessuna' } },
        { value: 'left-sidebar', label: { en: 'Left sidebar', it: 'A sinistra' } },
        { value: 'right-sidebar', label: { en: 'Right sidebar', it: 'A destra' } },
      ],
    ),
    select(
      'site-sidebar-style',
      { en: 'Sidebar style', it: 'Stile della barra laterale' },
      { section: SIDEBAR },
      [
        { value: 'unboxed', label: { en: 'Unboxed', it: 'Senza riquadro' } },
        { value: 'boxed', label: { en: 'Boxed', it: 'Riquadro' } },
      ],
    ),
    number(
      'site-sidebar-width',
      { en: 'Sidebar width', it: 'Larghezza della barra laterale' },
      {
        section: SIDEBAR,
        help: {
          en: 'Used only when a sidebar is shown.',
          it: 'Vale solo quando la barra laterale è visibile.',
        },
      },
      { min: 15, max: 50, step: 1, unit: '%', range: true },
    ),
    toggle(
      'site-sticky-sidebar',
      { en: 'Sticky sidebar', it: 'Barra laterale fissa' },
      { section: SIDEBAR },
    ),
  ];
}
