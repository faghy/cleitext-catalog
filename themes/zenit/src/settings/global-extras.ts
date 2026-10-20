/** Breadcrumbs and the transparent header. */
import type { FieldDefinition, Label } from '@cleitext/shared';
import {
  camel,
  color,
  image,
  number,
  respColor,
  respNumber,
  select,
  spacing,
  text,
  toggle,
  typography,
  type Place,
  type Setting,
} from './define.js';
import type { Section } from './define-global.js';

const B = 'section-breadcrumb';
const TH = 'section-transparent-header';

export const EXTRAS_SECTIONS: Section[] = [
  { id: B, label: { en: 'Breadcrumb', it: 'Percorso di navigazione' }, tabs: true },
  {
    id: TH,
    label: { en: 'Transparent header', it: 'Intestazione trasparente' },
    parent: 'section-header-builder-layout',
    tabs: true,
  },
];

/**
 * An option the theme reads with a fallback when it is not set (it has no
 * default of its own): the field shows the fallback, and only a different
 * value is written.
 */
function implicit(
  key: string,
  field: Record<string, unknown> & { type: FieldDefinition['type'] },
  place: Place,
  fallback: unknown,
  toOption: (v: unknown) => unknown = (v) => v,
): Setting {
  const name = camel(key);
  return {
    fields: [{ ...place, ...field, name, default: fallback } as FieldDefinition],
    write(values) {
      const v = values[name];
      if (v === undefined || v === null || v === '' || v === fallback) return {};
      return { [key]: toOption(v) };
    },
  };
}

/** A switch on by default when its option is not set, written `on`/`off`. */
const onByDefault = (
  key: string,
  label: Label,
  place: Place,
  on: unknown,
  off: unknown,
  help?: Label,
) =>
  implicit(key, { type: 'boolean', label, ...(help ? { help } : {}) }, place, true, (v) =>
    v ? on : off,
  );

const NORMAL = { en: 'Normal', it: 'Normale' };
const HOVER = { en: 'Hover', it: 'Al passaggio' };

function breadcrumbs(): Setting[] {
  const shown = { field: 'breadcrumbPosition', not: 'none' };
  const gen = (extra: Partial<Place> = {}): Place => ({
    section: B,
    tab: 'general',
    showIf: shown,
    ...extra,
  });
  const des = (extra: Partial<Place> = {}): Place => ({
    section: B,
    tab: 'design',
    showIf: shown,
    ...extra,
  });
  const display = { en: 'Display settings', it: 'Dove mostrarlo' };
  return [
    implicit(
      'breadcrumb-position',
      {
        type: 'select',
        label: { en: 'Header position', it: 'Posizione' },
        options: [
          { value: 'none', label: { en: 'None', it: 'Nessuna' } },
          {
            value: 'zenit_header_primary_container_after',
            label: { en: 'Inside', it: "Dentro l'intestazione" },
          },
          { value: 'zenit_header_after', label: { en: 'After', it: "Dopo l'intestazione" } },
          { value: 'zenit_entry_top', label: { en: 'Before title', it: 'Prima del titolo' } },
        ],
      },
      {
        section: B,
        tab: 'general',
        help: {
          en: 'Pick a position other than None to show the breadcrumb and use its design settings.',
          it: 'Scegli una posizione diversa da Nessuna per mostrare il percorso e usarne le impostazioni di stile.',
        },
      },
      'none',
    ),
    select('breadcrumb-separator-selector', { en: 'Separator', it: 'Separatore' }, gen(), [
      { value: '\\003E', label: '>' },
      { value: '\\00BB', label: '»' },
      { value: '\\002F', label: '/' },
      { value: 'unicode', label: { en: 'Custom', it: 'Personalizzato' } },
    ]),
    text(
      'breadcrumb-separator',
      { en: 'Unicode', it: 'Codice Unicode' },
      gen({
        showIf: { all: [shown, { field: 'breadcrumbSeparatorSelector', equals: 'unicode' }] },
        help: { en: 'For example \\00bb for ».', it: 'Per esempio \\00bb per ».' },
      }),
      { maxLength: 20 },
    ),
    implicit(
      'breadcrumb-alignment',
      {
        type: 'choice',
        label: { en: 'Alignment', it: 'Allineamento' },
        options: [
          { value: 'left', label: { en: 'Left', it: 'Sinistra' } },
          { value: 'center', label: { en: 'Center', it: 'Centro' } },
          { value: 'right', label: { en: 'Right', it: 'Destra' } },
        ],
        display: 'buttons',
      },
      gen(),
      'left',
    ),
    onByDefault(
      'breadcrumb-disable-home-page',
      { en: 'Home page', it: 'Pagina iniziale' },
      gen({ group: display }),
      '1',
      '0',
    ),
    onByDefault(
      'breadcrumb-disable-blog-posts-page',
      { en: 'Blog / posts page', it: 'Pagina del blog' },
      gen({ group: display }),
      '1',
      '0',
      {
        en: 'The latest posts page, or the page chosen as blog page.',
        it: 'La pagina degli ultimi articoli, o quella scelta come pagina del blog.',
      },
    ),
    onByDefault(
      'breadcrumb-disable-search',
      { en: 'Search', it: 'Ricerca' },
      gen({ group: display }),
      '1',
      '0',
    ),
    onByDefault(
      'breadcrumb-disable-archive',
      { en: 'Archives', it: 'Archivi' },
      gen({ group: display }),
      '1',
      '0',
    ),
    onByDefault(
      'breadcrumb-disable-single-page',
      { en: 'Single page', it: 'Pagine' },
      gen({ group: display }),
      '1',
      '0',
    ),
    onByDefault(
      'breadcrumb-disable-single-post',
      { en: 'Single post', it: 'Articoli' },
      gen({ group: display }),
      '1',
      '0',
    ),
    onByDefault(
      'breadcrumb-disable-singular',
      { en: 'Singular', it: 'Tutti i contenuti singoli' },
      gen({ group: display }),
      '1',
      '0',
      {
        en: 'All pages, all posts, all attachments.',
        it: 'Tutte le pagine, gli articoli e gli allegati.',
      },
    ),
    onByDefault(
      'breadcrumb-disable-404-page',
      { en: '404 page', it: 'Pagina 404' },
      gen({ group: display }),
      '1',
      '0',
    ),
    respColor(
      'breadcrumb-bg-color',
      { en: 'Background color', it: 'Colore di sfondo' },
      des({ group: { en: 'Colors', it: 'Colori' } }),
    ),
    respColor(
      'breadcrumb-active-color-responsive',
      { en: 'Text color', it: 'Colore del testo' },
      des(),
    ),
    respColor(
      'breadcrumb-separator-color',
      { en: 'Separator color', it: 'Colore del separatore' },
      des(),
    ),
    respColor(
      'breadcrumb-text-color-responsive',
      { en: 'Link color', it: 'Colore dei link' },
      des(),
    ),
    respColor(
      'breadcrumb-hover-color-responsive',
      { en: 'Link color on hover', it: 'Colore dei link al passaggio' },
      des(),
    ),
    typography(
      'breadcrumbFont',
      {
        family: 'breadcrumb-font-family',
        weight: 'breadcrumb-font-weight',
        size: 'breadcrumb-font-size',
        extras: 'breadcrumb-font-extras',
      },
      { en: 'Content font', it: 'Carattere' },
      des({ group: { en: 'Font', it: 'Carattere' } }),
    ),
    spacing(
      'breadcrumb-spacing',
      { en: 'Spacing', it: 'Spaziatura' },
      des({ group: { en: 'Spacing', it: 'Spaziatura' } }),
      {
        responsive: true,
        units: ['px', 'em', '%'],
      },
    ),
  ];
}

function transparentHeader(): Setting[] {
  const gen = (extra: Partial<Place> = {}): Place => ({ section: TH, tab: 'general', ...extra });
  const des = (extra: Partial<Place> = {}): Place => ({ section: TH, tab: 'design', ...extra });
  const enabled = { field: 'transparentHeaderEnable', equals: true };
  const disableOn = { en: 'Disable on', it: 'Disattiva su' };
  const diffLogo = { field: 'differentTransparentLogo', equals: true };
  const overlay = { en: 'Background overlay', it: 'Sfondo sovrapposto' };
  const siteTitle = { en: 'Site title', it: 'Titolo del sito' };
  const menu = { en: 'Menu color', it: 'Colori del menu' };
  const submenu = { en: 'Submenu color', it: 'Colori del sottomenu' };
  const social = { en: 'Social color', it: 'Colori dei social' };
  const search = { en: 'Search color', it: 'Colori della ricerca' };
  const button = { en: 'Button color', it: 'Colori del pulsante' };
  const account = { en: 'Account', it: 'Account' };
  const toggleBtn = { en: 'Toggle color', it: 'Colori del pulsante menu' };
  const html = { en: 'HTML color', it: "Colori dell'HTML" };
  const archivesHelp = (what: { en: string; it: string }): Label => ({
    en: `Generally not recommended on ${what.en}: to use it there, turn this off.`,
    it: `In genere sconsigliata su ${what.it}: per usarla lì, disattiva questa opzione.`,
  });
  return [
    toggle(
      'transparent-header-enable',
      { en: 'Enable on the whole website', it: 'Attiva su tutto il sito' },
      gen(),
      1,
      0,
    ),
    onByDefault(
      'transparent-header-disable-404-page',
      { en: '404 page', it: 'Pagina 404' },
      gen({ group: disableOn, showIf: enabled }),
      1,
      0,
      archivesHelp({ en: 'the 404 page', it: 'la pagina 404' }),
    ),
    onByDefault(
      'transparent-header-disable-search-page',
      { en: 'Search page', it: 'Pagina di ricerca' },
      gen({ group: disableOn, showIf: enabled }),
      1,
      0,
      archivesHelp({ en: 'the search page', it: 'la pagina di ricerca' }),
    ),
    onByDefault(
      'transparent-header-disable-archive-pages',
      { en: 'Archive pages', it: 'Pagine di archivio' },
      gen({ group: disableOn, showIf: enabled }),
      1,
      0,
      archivesHelp({ en: 'archive pages', it: 'le pagine di archivio' }),
    ),
    toggle(
      'transparent-header-disable-index',
      { en: 'Blog page', it: 'Pagina del blog' },
      gen({
        group: disableOn,
        showIf: enabled,
        help: {
          en: 'A page chosen to show the latest posts.',
          it: 'Una pagina scelta per mostrare gli ultimi articoli.',
        },
      }),
      1,
      0,
    ),
    toggle(
      'transparent-header-disable-latest-posts-index',
      { en: 'Latest posts page', it: 'Pagina degli ultimi articoli' },
      gen({
        group: disableOn,
        showIf: enabled,
        help: {
          en: "The site's front page when it shows the latest posts.",
          it: 'La pagina iniziale del sito quando mostra gli ultimi articoli.',
        },
      }),
      1,
      0,
    ),
    toggle(
      'transparent-header-disable-page',
      { en: 'Pages', it: 'Pagine' },
      gen({ group: disableOn, showIf: enabled }),
      1,
      0,
    ),
    toggle(
      'transparent-header-disable-posts',
      { en: 'Posts', it: 'Articoli' },
      gen({ group: disableOn, showIf: enabled }),
      1,
      0,
    ),
    select('transparent-header-on-devices', { en: 'Enable on', it: 'Attiva su' }, gen(), [
      { value: 'desktop', label: { en: 'Desktop', it: 'Computer' } },
      { value: 'mobile', label: { en: 'Mobile', it: 'Telefono' } },
      { value: 'both', label: { en: 'Desktop + mobile', it: 'Computer e telefono' } },
    ]),
    toggle(
      'different-transparent-logo',
      { en: 'Different transparent logo', it: 'Logo diverso' },
      gen({ group: { en: 'Logo', it: 'Logo' } }),
      1,
      0,
    ),
    image('transparent-header-logo', { en: 'Logo', it: 'Logo' }, gen({ showIf: diffLogo })),
    toggle(
      'different-transparent-retina-logo',
      { en: 'Different logo for retina devices', it: 'Logo diverso per schermi retina' },
      gen({ showIf: diffLogo }),
      1,
      0,
    ),
    image(
      'transparent-header-retina-logo',
      { en: 'Retina logo', it: 'Logo retina' },
      gen({
        showIf: { all: [diffLogo, { field: 'differentTransparentRetinaLogo', equals: true }] },
      }),
    ),
    respNumber(
      'transparent-header-logo-width',
      { en: 'Logo width', it: 'Larghezza del logo' },
      gen({ showIf: diffLogo }),
      {
        min: 50,
        max: 600,
        step: 1,
        range: true,
      },
    ),
    number(
      'transparent-header-main-sep',
      { en: 'Bottom border size', it: 'Spessore del bordo inferiore' },
      des(),
      {
        min: 0,
        max: 600,
        unit: 'px',
        range: true,
      },
    ),
    color(
      'transparent-header-main-sep-color',
      { en: 'Bottom border color', it: 'Colore del bordo inferiore' },
      des({
        showIf: { field: 'transparentHeaderMainSep', not: 0 },
      }),
    ),
    color(
      'transparent-header-logo-color',
      { en: 'Logo color', it: 'Colore del logo' },
      des({
        group: { en: 'Colors & background', it: 'Colori e sfondo' },
        help: {
          en: 'Use it with transparent images for the best results.',
          it: 'Dà i risultati migliori con immagini trasparenti.',
        },
      }),
    ),
    respColor(
      'hba-transparent-header-bg-color-responsive',
      { en: 'Top row', it: 'Riga superiore' },
      des({ group: overlay }),
    ),
    respColor(
      'transparent-header-bg-color-responsive',
      { en: 'Main row', it: 'Riga principale' },
      des({ group: overlay }),
    ),
    respColor(
      'hbb-transparent-header-bg-color-responsive',
      { en: 'Bottom row', it: 'Riga inferiore' },
      des({ group: overlay }),
    ),
    respColor('transparent-header-color-site-title-responsive', NORMAL, des({ group: siteTitle })),
    respColor('transparent-header-color-h-site-title-responsive', HOVER, des({ group: siteTitle })),
    respColor(
      'transparent-menu-color-responsive',
      { en: 'Text / link', it: 'Testo e link' },
      des({ group: menu }),
    ),
    respColor(
      'transparent-menu-bg-color-responsive',
      { en: 'Background', it: 'Sfondo' },
      des({ group: menu }),
    ),
    respColor(
      'transparent-menu-h-color-responsive',
      { en: 'Text / link on hover or active', it: 'Testo e link al passaggio o attivi' },
      des({ group: menu }),
    ),
    respColor(
      'transparent-submenu-color-responsive',
      { en: 'Text / link', it: 'Testo e link' },
      des({ group: submenu }),
    ),
    respColor(
      'transparent-submenu-bg-color-responsive',
      { en: 'Background', it: 'Sfondo' },
      des({ group: submenu }),
    ),
    respColor(
      'transparent-submenu-h-color-responsive',
      { en: 'Text / link on hover or active', it: 'Testo e link al passaggio o attivi' },
      des({ group: submenu }),
    ),
    respColor(
      'transparent-header-social-icons-color',
      { en: 'Text / icon', it: 'Testo e icona' },
      des({ group: social }),
    ),
    respColor(
      'transparent-header-social-icons-h-color',
      { en: 'Text / icon on hover', it: 'Testo e icona al passaggio' },
      des({ group: social }),
    ),
    respColor(
      'transparent-header-social-icons-bg-color',
      { en: 'Background', it: 'Sfondo' },
      des({ group: social }),
    ),
    respColor(
      'transparent-header-social-icons-bg-h-color',
      { en: 'Background on hover', it: 'Sfondo al passaggio' },
      des({ group: social }),
    ),
    color(
      'transparent-header-search-icon-color',
      { en: 'Icon', it: 'Icona' },
      des({ group: search }),
    ),
    color(
      'transparent-header-search-box-background-color',
      { en: 'Box background', it: 'Sfondo del campo' },
      des({
        group: search,
        help: {
          en: 'For the slide and box search styles.',
          it: 'Per gli stili di ricerca a scorrimento e a campo.',
        },
      }),
    ),
    color(
      'transparent-header-button-text-color',
      { en: 'Text', it: 'Testo' },
      des({ group: button }),
    ),
    color(
      'transparent-header-button-text-h-color',
      { en: 'Text on hover', it: 'Testo al passaggio' },
      des({ group: button }),
    ),
    color(
      'transparent-header-button-bg-color',
      { en: 'Background', it: 'Sfondo' },
      des({ group: button }),
    ),
    color(
      'transparent-header-button-bg-h-color',
      { en: 'Background on hover', it: 'Sfondo al passaggio' },
      des({ group: button }),
    ),
    color(
      'transparent-header-button-border-color',
      { en: 'Border', it: 'Bordo' },
      des({ group: button }),
    ),
    color(
      'transparent-header-button-border-h-color',
      { en: 'Border on hover', it: 'Bordo al passaggio' },
      des({ group: button }),
    ),
    color('transparent-account-icon-color', { en: 'Icon', it: 'Icona' }, des({ group: account })),
    color(
      'transparent-account-type-text-color',
      { en: 'Text', it: 'Testo' },
      des({ group: account }),
    ),
    color(
      'transparent-header-toggle-btn-color',
      { en: 'Icon', it: 'Icona' },
      des({ group: toggleBtn }),
    ),
    color(
      'transparent-header-toggle-btn-bg-color',
      { en: 'Background', it: 'Sfondo' },
      des({ group: toggleBtn }),
    ),
    color(
      'transparent-header-toggle-border-color',
      { en: 'Border', it: 'Bordo' },
      des({ group: toggleBtn }),
    ),
    color('transparent-header-html-text-color', { en: 'Text', it: 'Testo' }, des({ group: html })),
    color('transparent-header-html-link-color', { en: 'Link', it: 'Link' }, des({ group: html })),
    color(
      'transparent-header-html-link-h-color',
      { en: 'Link on hover', it: 'Link al passaggio' },
      des({ group: html }),
    ),
  ];
}

export function extrasSettings(): Setting[] {
  return [...breadcrumbs(), ...transparentHeader()];
}
