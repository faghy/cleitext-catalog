/** Blog / archive: the list of posts, its title area, the search results page and its title area. */
import type { FieldDefinition, Label } from '@cleitext/shared';
import {
  background,
  camel,
  color,
  number,
  respNumber,
  select,
  spacing,
  text,
  toggle,
  typography,
  type Place,
  type Setting,
} from './define.js';
import { flags, sortable, type Section } from './define-global.js';

const B = 'section-blog';
const A = 'zn-dynamic-archive-post';
const S = 'zn-section-search-page';
const ST = 'section-search-page-title';

export const BLOG_ARCHIVE_SECTIONS: Section[] = [
  {
    id: B,
    label: { en: 'Blog / Archive', it: 'Blog / Archivio' },
    parent: 'section-blog-group',
    tabs: true,
  },
  {
    id: A,
    label: { en: 'Blog title area', it: 'Area del titolo del blog' },
    parent: 'section-blog-group',
    tabs: true,
  },
  { id: S, label: { en: 'Search page', it: 'Pagina di ricerca' }, parent: 'section-blog-group' },
  {
    id: ST,
    label: { en: 'Search page title', it: 'Titolo della pagina di ricerca' },
    parent: 'section-blog-group',
    tabs: true,
  },
];

/**
 * A setting whose option has no stored default (the theme falls back to
 * `def`): the field starts at `def`, and the option is written only once
 * the value differs from it.
 */
function withDefault(setting: Setting, def: unknown): Setting {
  const [field, ...rest] = setting.fields;
  const name = field!.name;
  return {
    fields: [{ ...field, default: def } as FieldDefinition, ...rest],
    read: setting.read,
    write(values, media) {
      if (JSON.stringify(values[name]) === JSON.stringify(def)) return {};
      return setting.write(values, media);
    },
  };
}

/** Leaves out written objects that are empty (font extras nobody set). */
function dropEmpty(setting: Setting): Setting {
  return {
    fields: setting.fields,
    read: setting.read,
    write(values, media) {
      const out = setting.write(values, media);
      return Object.fromEntries(
        Object.entries(out).filter(
          ([, v]) =>
            !(v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0),
        ),
      );
    },
  };
}

const EMPTY_SIDES = { top: '', right: '', bottom: '', left: '' };
const unitsOf = (u: string) => ({ 'desktop-unit': u, 'tablet-unit': u, 'mobile-unit': u });
const SIZE_SHAPE = { desktop: '', tablet: '', mobile: '', ...unitsOf('px') };
const spacingShape = (u: string) => ({
  desktop: EMPTY_SIDES,
  tablet: EMPTY_SIDES,
  mobile: EMPTY_SIDES,
  ...unitsOf(u),
});

/** Written objects completed with the full shape the option has (`shapes`: by option key). */
function fill(setting: Setting, shapes: Record<string, Record<string, unknown>>): Setting {
  return {
    fields: setting.fields,
    read: setting.read,
    write(values, media) {
      const out = setting.write(values, media);
      for (const [k, shape] of Object.entries(shapes)) {
        const v = out[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = { ...shape, ...v };
      }
      return out;
    },
  };
}

/** A switch whose option is on unless written `false` (no stored default). */
function onUnlessOff(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  return {
    fields: [{ ...place, name, type: 'boolean', label, default: true } as FieldDefinition],
    write(values) {
      return values[name] === false ? { [key]: false } : {};
    },
  };
}

/** Choices where one option is stored as an empty string (`none` here ↔ `''`). */
function selectWithEmpty(
  key: string,
  label: Label,
  place: Place,
  options: { value: string; label: Label }[],
  extra: { display?: 'buttons' | 'select' } = {},
): Setting {
  const NONE = 'none-value';
  const base = select(
    key,
    label,
    place,
    options.map((o) => ({ ...o, value: o.value === '' ? NONE : o.value })),
    extra,
  );
  const name = base.fields[0]!.name;
  return {
    fields: base.fields.map((f) => {
      const def = (f as { default?: unknown }).default;
      return def === undefined || def === '' ? ({ ...f, default: NONE } as FieldDefinition) : f;
    }),
    write(values) {
      const v = values[name];
      if (v === undefined || v === null) return {};
      return { [key]: v === NONE ? '' : v };
    },
  };
}

const L = (en: string, it: string) => ({ en, it });
const FONT_UNITS = ['px', 'em', 'vw', 'rem'];

const CONTAINER = [
  { value: 'default', label: L('Default', 'Predefinito') },
  { value: 'normal-width-container', label: L('Normal', 'Normale') },
  { value: 'narrow-width-container', label: L('Narrow', 'Stretto') },
  { value: 'full-width-container', label: L('Full width', 'Larghezza piena') },
];
const STYLE = [
  { value: 'default', label: L('Default', 'Predefinito') },
  { value: 'unboxed', label: L('Unboxed', 'Senza riquadro') },
  { value: 'boxed', label: L('Boxed', 'Riquadro') },
];
const SIDEBAR = [
  { value: 'default', label: L('Default', 'Predefinita') },
  { value: 'no-sidebar', label: L('No sidebar', 'Nessuna') },
  { value: 'left-sidebar', label: L('Left sidebar', 'A sinistra') },
  { value: 'right-sidebar', label: L('Right sidebar', 'A destra') },
];
const STYLE_HELP = L(
  'The container style applies only when the layout is normal or narrow.',
  'Lo stile del contenitore vale solo con il layout normale o stretto.',
);
const SIDEBAR_HELP = L(
  'The sidebar applies only when the container layout is normal.',
  'La barra laterale compare solo con il layout del contenitore normale.',
);
const LAYOUTS = [
  { value: 'blog-layout-4', label: L('Grid', 'Griglia') },
  { value: 'blog-layout-5', label: L('List', 'Elenco') },
  { value: 'blog-layout-6', label: L('Cover', 'Copertina') },
];
const TERM_STYLE = [
  { value: 'default', label: L('Default', 'Predefinito') },
  { value: 'badge', label: L('Badge', 'Etichetta') },
  { value: 'underline', label: L('Underline', 'Sottolineato') },
];
const DATE_FORMATS = [
  { value: '', label: L('Default', 'Predefinito') },
  { value: 'F j, Y', label: 'November 6, 2010' },
  { value: 'Y-m-d', label: '2010-11-06' },
  { value: 'm/d/Y', label: '11/06/2010' },
  { value: 'd/m/Y', label: '06/11/2010' },
];

/** Container and sidebar of a kind of page (`archive-post-*`, `zn-search-*`). */
function containerSettings(prefix: string, place: Place, stored: boolean): Setting[] {
  const opt = (key: string, s: Setting) => (stored ? s : withDefault(s, 'default'));
  const layoutKey =
    prefix === 'archive-post' ? 'archive-post-zn-content-layout' : `${prefix}-content-layout`;
  return [
    opt(
      layoutKey,
      select(layoutKey, L('Container layout', 'Layout del contenitore'), place, CONTAINER),
    ),
    withDefault(
      select(
        `${prefix}-content-style`,
        L('Container style', 'Stile del contenitore'),
        { ...place, help: STYLE_HELP },
        STYLE,
      ),
      'default',
    ),
    opt(
      `${prefix}-sidebar-layout`,
      select(
        `${prefix}-sidebar-layout`,
        L('Sidebar layout', 'Layout della barra laterale'),
        { ...place, help: SIDEBAR_HELP },
        SIDEBAR,
      ),
    ),
    opt(
      `${prefix}-sidebar-style`,
      select(
        `${prefix}-sidebar-style`,
        L('Sidebar style', 'Stile della barra laterale'),
        place,
        STYLE,
      ),
    ),
  ];
}

/** The title area of a list (`zn-dynamic-archive-post-*`, `section-search-page-title-*`). */
function bannerSettings(t: string, search: boolean): Setting[] {
  const g = (group?: Label, showIf?: Place['showIf']): Place => ({
    section: t,
    tab: 'general',
    ...(group ? { group } : {}),
    ...(showIf ? { showIf } : {}),
  });
  const d = (group?: Label, showIf?: Place['showIf']): Place => ({
    section: t,
    tab: 'design',
    ...(group ? { group } : {}),
    ...(showIf ? { showIf } : {}),
  });
  const layout2 = { field: camel(`${t}-layout`), equals: 'layout-2' };
  const structure = L('Structure', 'Struttura');
  const titleFont = L('Title font', 'Carattere del titolo');
  const textFont = L('Text font', 'Carattere del testo');
  const colors = L('Colors', 'Colori');
  const spacingGroup = L('Spacing', 'Spaziature');
  const choices = search
    ? [
        { value: `${t}-title`, label: L('Heading', 'Titolo') },
        { value: `${t}-description`, label: L('Subheading', 'Sottotitolo') },
        { value: `${t}-breadcrumb`, label: L('Breadcrumb', 'Percorso di navigazione') },
      ]
    : [
        { value: `${t}-breadcrumb`, label: L('Breadcrumb', 'Percorso di navigazione') },
        { value: `${t}-title`, label: L('Title', 'Titolo') },
        { value: `${t}-description`, label: L('Description', 'Descrizione') },
      ];
  const structureSetting = sortable(`${t}-structure`, structure, g(), choices);
  return [
    withDefault(
      select(
        `${t}-layout`,
        L('Banner layout', 'Layout del banner'),
        {
          ...g(),
          help: L(
            'Layout 1 shows the title inside the content; layout 2 shows it in a full-width banner above it.',
            'Il layout 1 mostra il titolo nel contenuto; il layout 2 in un banner a tutta larghezza sopra.',
          ),
        },
        [
          { value: 'layout-1', label: L('Layout 1', 'Layout 1') },
          { value: 'layout-2', label: L('Layout 2', 'Layout 2') },
        ],
      ),
      'layout-1',
    ),
    ...(search
      ? []
      : [
          withDefault(
            toggle(
              `${t}-banner-on-blog`,
              L('Show on the blog / posts page', 'Mostra nella pagina del blog'),
              g(undefined, { field: camel(`${t}-layout`), not: 'layout-1' }),
            ),
            false,
          ),
        ]),
    withDefault(
      select(
        `${t}-banner-width-type`,
        L('Container width', 'Larghezza del contenitore'),
        g(undefined, layout2),
        [
          { value: 'fullwidth', label: L('Full width', 'Larghezza piena') },
          { value: 'custom', label: L('Custom', 'Personalizzata') },
        ],
      ),
      'fullwidth',
    ),
    withDefault(
      number(
        `${t}-banner-custom-width`,
        L('Custom width', 'Larghezza personalizzata'),
        g(undefined, {
          all: [layout2, { field: camel(`${t}-banner-width-type`), equals: 'custom' }],
        }),
        { min: 768, max: 1920, unit: 'px', range: true },
      ),
      1200,
    ),
    // The structure and its texts.
    search
      ? structureSetting
      : withDefault(structureSetting, [
          { item: `${t}-title`, enabled: true },
          { item: `${t}-description`, enabled: true },
          { item: `${t}-breadcrumb`, enabled: false },
        ]),
    text(
      `${t}-custom-title`,
      search ? L('Heading text', 'Testo del titolo') : L('Blog title', 'Titolo del blog'),
      {
        ...g(structure),
        ...(search
          ? {}
          : {
              help: L(
                'Shown on the posts archive with banner layout 2.',
                "Compare nell'archivio degli articoli con il layout 2 del banner.",
              ),
            }),
      },
    ),
    ...(search
      ? [
          text(
            `${t}-found-custom-description`,
            L('Subheading when results are found', 'Sottotitolo quando ci sono risultati'),
            g(structure),
            { multiline: true },
          ),
          text(
            `${t}-not-found-custom-description`,
            L('Subheading when nothing is found', 'Sottotitolo senza risultati'),
            g(structure),
            { multiline: true },
          ),
        ]
      : [
          text(
            `${t}-custom-description`,
            L('Blog description', 'Descrizione del blog'),
            {
              ...g(structure),
              help: L(
                'Shown on the posts archive with banner layout 2.',
                "Compare nell'archivio degli articoli con il layout 2 del banner.",
              ),
            },
            { multiline: true },
          ),
        ]),
    select(
      `${t}-horizontal-alignment`,
      L('Horizontal alignment', 'Allineamento orizzontale'),
      g(),
      [
        { value: 'left', label: L('Left', 'Sinistra') },
        { value: 'center', label: L('Center', 'Centro') },
        { value: 'right', label: L('Right', 'Destra') },
      ],
      { responsive: true },
    ),
    withDefault(
      select(
        `${t}-vertical-alignment`,
        L('Vertical alignment', 'Allineamento verticale'),
        g(undefined, layout2),
        [
          { value: 'flex-start', label: L('Top', 'In alto') },
          { value: 'center', label: L('Middle', 'Al centro') },
          { value: 'flex-end', label: L('Bottom', 'In basso') },
        ],
      ),
      'center',
    ),
    // Design.
    respNumber(
      `${t}-banner-height`,
      L('Banner minimum height', 'Altezza minima del banner'),
      d(undefined, layout2),
      {
        min: 0,
        max: 1000,
        range: true,
      },
    ),
    withDefault(
      number(`${t}-elements-gap`, L('Space between elements', 'Spazio tra gli elementi'), d(), {
        min: 0,
        max: 100,
        unit: 'px',
        range: true,
      }),
      10,
    ),
    withDefault(
      select(`${t}-banner-image-type`, L('Container background', 'Sfondo del contenitore'), d(), [
        { value: 'none', label: L('None', 'Nessuno') },
        { value: 'custom', label: L('Custom', 'Personalizzato') },
      ]),
      'none',
    ),
    background(
      `${t}-banner-custom-bg`,
      L('Background', 'Sfondo'),
      d(undefined, { field: camel(`${t}-banner-image-type`), equals: 'custom' }),
      {
        responsive: true,
      },
    ),
    color(`${t}-banner-title-color`, L('Title color', 'Colore del titolo'), d(colors)),
    color(`${t}-banner-text-color`, L('Text color', 'Colore del testo'), d(colors)),
    color(`${t}-banner-link-color`, L('Link color', 'Colore dei link'), d(colors)),
    color(
      `${t}-banner-link-hover-color`,
      L('Link hover color', 'Colore dei link al passaggio'),
      d(colors),
    ),
    titleFont_(t, search, d(titleFont)),
    dropEmpty(
      fill(
        typography(
          camel(`${t}-text-font`),
          {
            family: `${t}-text-font-family`,
            weight: `${t}-text-font-weight`,
            size: `${t}-text-font-size`,
            extras: `${t}-text-font-extras`,
          },
          textFont,
          d(textFont),
        ),
        { [`${t}-text-font-size`]: SIZE_SHAPE },
      ),
    ),
    fill(
      spacing(`${t}-banner-margin`, L('Margin', 'Margine'), d(spacingGroup), { responsive: true }),
      {
        [`${t}-banner-margin`]: spacingShape('px'),
      },
    ),
    withDefault(
      fill(
        spacing(`${t}-banner-padding`, L('Padding', 'Spaziatura interna'), d(spacingGroup), {
          responsive: true,
        }),
        {
          [`${t}-banner-padding`]: spacingShape('em'),
        },
      ),
      { desktop: { top: 3, right: 3, bottom: 3, left: 3, unit: 'em' } },
    ),
  ];
}

/** The banner title font: stored defaults for the search page, the theme's fallbacks (600, 32px) for the blog. */
function titleFont_(t: string, search: boolean, place: Place): Setting {
  const s = typography(
    camel(`${t}-title-font`),
    {
      family: `${t}-title-font-family`,
      weight: `${t}-title-font-weight`,
      size: `${t}-title-font-size`,
      extras: `${t}-title-font-extras`,
    },
    L('Title font', 'Carattere del titolo'),
    place,
  );
  const shaped = fill(s, { [`${t}-title-font-size`]: SIZE_SHAPE });
  return dropEmpty(search ? shaped : withDefault(shaped, { weight: '600', size: { desktop: 32 } }));
}

export function blogArchiveSettings(): Setting[] {
  const g = (group?: Label): Place => ({ section: B, tab: 'general', ...(group ? { group } : {}) });
  const d = (group?: Label): Place => ({ section: B, tab: 'design', ...(group ? { group } : {}) });
  const elements = L('Post elements', 'Elementi degli articoli');
  const image = L('Featured image', 'Immagine in evidenza');
  const ratio = { field: 'blogImageRatioType' };
  const meta = L('Meta', 'Metadati');
  const cover = { field: 'blogLayout', equals: 'blog-layout-6' };
  const search = (group?: Label): Place => ({ section: S, ...(group ? { group } : {}) });
  return [
    // Blog / Archive: General.
    onUnlessOff('zn-archive-post-title', L('Blog title area', 'Area del titolo del blog'), {
      ...g(),
      help: L(
        'Its options are in “Blog title area”.',
        'Le sue opzioni sono in “Area del titolo del blog”.',
      ),
    }),
    ...containerSettings('archive-post', g(), true),
    select('blog-layout', L('Layout', 'Layout'), g(L('Blog layout', 'Layout del blog')), LAYOUTS),
    number(
      'blog-post-per-page',
      L('Posts per page', 'Articoli per pagina'),
      g(L('Blog layout', 'Layout del blog')),
      { min: 1, max: 500, step: 1 },
    ),
    select('blog-width', L('Content width', 'Larghezza del contenuto'), g(), [
      { value: 'default', label: L('Default', 'Predefinita') },
      { value: 'custom', label: L('Custom', 'Personalizzata') },
    ]),
    number(
      'blog-max-width',
      L('Custom width', 'Larghezza personalizzata'),
      { ...g(), showIf: { field: 'blogWidth', equals: 'custom' } },
      {
        min: 768,
        max: 1920,
        unit: 'px',
        range: true,
      },
    ),
    sortable('blog-post-structure', elements, g(L('Posts structure', 'Struttura degli articoli')), [
      { value: 'image', label: L('Featured image', 'Immagine in evidenza') },
      { value: 'category', label: L('Categories', 'Categorie') },
      { value: 'tag', label: L('Tags', 'Tag') },
      { value: 'title', label: L('Title', 'Titolo') },
      { value: 'title-meta', label: L('Post meta', 'Metadati') },
      { value: 'excerpt', label: L('Excerpt', 'Riassunto') },
      { value: 'read-more', label: L('Read more', 'Leggi tutto') },
    ]),
    // Featured image.
    selectWithEmpty('blog-image-ratio-type', L('Image ratio', 'Proporzioni'), g(image), [
      { value: '', label: L('Original', 'Originali') },
      { value: 'predefined', label: L('Predefined', 'Predefinite') },
      { value: 'custom', label: L('Custom', 'Personalizzate') },
    ]),
    select(
      'blog-image-ratio-pre-scale',
      L('Ratio', 'Rapporto'),
      { ...g(image), showIf: { ...ratio, equals: 'predefined' } },
      [
        { value: '1/1', label: '1:1' },
        { value: '4/3', label: '4:3' },
        { value: '16/9', label: '16:9' },
        { value: '2/1', label: '2:1' },
      ],
    ),
    number(
      'blog-image-custom-scale-width',
      L('Width', 'Larghezza'),
      { ...g(image), showIf: { ...ratio, equals: 'custom' } },
      { min: 1 },
    ),
    number(
      'blog-image-custom-scale-height',
      L('Height', 'Altezza'),
      {
        ...g(image),
        showIf: { ...ratio, equals: 'custom' },
        help: L(
          'Width and height set the shape of the image, e.g. 16 and 9.',
          "Larghezza e altezza danno la forma dell'immagine, ad esempio 16 e 9.",
        ),
      },
      { min: 1 },
    ),
    select('blog-hover-effect', L('Hover effect', 'Effetto al passaggio'), g(image), [
      { value: 'none', label: L('None', 'Nessuno') },
      { value: 'zoom-in', label: L('Zoom in', 'Ingrandisci') },
      { value: 'zoom-out', label: L('Zoom out', 'Rimpicciolisci') },
    ]),
    withDefault(
      select(
        'blog-image-size',
        L('Image size', "Dimensione dell'immagine"),
        g(image),
        [
          { value: 'thumbnail', label: L('Thumbnail', 'Miniatura') },
          { value: 'medium', label: L('Medium', 'Media') },
          { value: 'medium_large', label: L('Medium large', 'Medio-grande') },
          { value: 'large', label: L('Large', 'Grande') },
          { value: 'full', label: L('Full size', 'Originale') },
        ],
        { display: 'select' },
      ),
      'large',
    ),
    select(
      'blog-category-style',
      L('Categories style', 'Stile delle categorie'),
      g(L('Categories', 'Categorie')),
      TERM_STYLE,
    ),
    select('blog-tag-style', L('Tags style', 'Stile dei tag'), g(L('Tags', 'Tag')), TERM_STYLE),
    select('blog-post-meta-divider-type', L('Divider type', 'Separatore'), g(meta), [
      { value: '/', label: '/' },
      { value: '-', label: '-' },
      { value: '|', label: '|' },
      { value: '•', label: '•' },
      { value: 'none', label: L('None', 'Nessuno') },
    ]),
    select(
      'blog-post-content',
      L('Post content', "Contenuto dell'articolo"),
      g(L('Excerpt', 'Riassunto')),
      [
        { value: 'full-content', label: L('Full content', 'Contenuto completo') },
        { value: 'excerpt', label: L('Excerpt', 'Riassunto') },
      ],
    ),
    text('blog-excerpt-marker', L('Truncation marker', 'Segno di troncamento'), {
      ...g(L('Excerpt', 'Riassunto')),
      showIf: { field: 'blogPostContent', equals: 'excerpt' },
      help: L(
        'Shown at the end of trimmed excerpts. Leave empty to hide it.',
        'Compare alla fine dei riassunti accorciati. Lascialo vuoto per nasconderlo.',
      ),
    }),
    sortable(
      'blog-meta',
      L('Meta', 'Metadati'),
      {
        ...g(meta),
        help: L(
          'Shown when “Post meta” is among the post elements.',
          'Compaiono quando “Metadati” è tra gli elementi degli articoli.',
        ),
      },
      [
        { value: 'comments', label: L('Comments', 'Commenti') },
        { value: 'category', label: L('Categories', 'Categorie') },
        { value: 'author', label: L('Author', 'Autore') },
        { value: 'date', label: L('Date', 'Data') },
        { value: 'tag', label: L('Tags', 'Tag') },
      ],
    ),
    select('blog-meta-date-type', L('Date type', 'Tipo di data'), g(meta), [
      { value: 'published', label: L('Published', 'Pubblicazione') },
      { value: 'updated', label: L('Last updated', 'Ultimo aggiornamento') },
    ]),
    selectWithEmpty(
      'blog-meta-date-format',
      L('Date format', 'Formato della data'),
      g(meta),
      DATE_FORMATS,
      { display: 'select' },
    ),
    select(
      'blog-meta-category-style',
      L('Categories style in meta', 'Stile delle categorie nei metadati'),
      g(meta),
      [
        { value: 'default', label: L('Default', 'Predefinito') },
        { value: 'underline', label: L('Underline', 'Sottolineato') },
      ],
    ),
    select('blog-meta-tag-style', L('Tags style in meta', 'Stile dei tag nei metadati'), g(meta), [
      { value: 'default', label: L('Default', 'Predefinito') },
      { value: 'underline', label: L('Underline', 'Sottolineato') },
    ]),
    // Blog / Archive: Design.
    background('post-card-background-overlay', L('Background overlay', 'Velatura dello sfondo'), {
      ...d(L('Post cards', 'Schede degli articoli')),
      showIf: cover,
    }),
    spacing(
      'post-card-border-radius',
      L('Border radius', 'Arrotondamento degli angoli'),
      d(L('Post cards', 'Schede degli articoli')),
      {
        responsive: true,
        corners: true,
        units: ['px', 'em', '%'],
      },
    ),
    respNumber(
      'font-size-page-title',
      L('Post title size', 'Dimensione del titolo'),
      d(L('Fonts', 'Caratteri')),
      {
        min: 0,
        max: 200,
        units: FONT_UNITS,
        range: true,
      },
    ),
    respNumber(
      'font-size-post-meta',
      L('Meta font size', 'Dimensione dei metadati'),
      d(L('Fonts', 'Caratteri')),
      {
        min: 0,
        max: 200,
        units: FONT_UNITS,
        range: true,
      },
    ),
    respNumber(
      'font-size-post-tax',
      L('Taxonomy font size', 'Dimensione di categorie e tag'),
      d(L('Fonts', 'Caratteri')),
      {
        min: 0,
        max: 200,
        units: FONT_UNITS,
        range: true,
      },
    ),
    // Blog title area.
    ...bannerSettings(A, false),
    // Search page.
    onUnlessOff('zn-search-page-title', L('Search page title', 'Titolo della pagina di ricerca'), {
      ...search(),
      help: L(
        'Its options are in “Search page title”.',
        'Le sue opzioni sono in “Titolo della pagina di ricerca”.',
      ),
    }),
    ...containerSettings('zn-search', search(), false),
    select(
      'zn-search-results-style',
      L('Results layout', 'Layout dei risultati'),
      {
        ...search(),
        help: L('Empty: the same as the blog.', 'Se non scelto: come il blog.'),
      },
      LAYOUTS,
    ),
    number('zn-search-results-per-page', L('Posts per page', 'Risultati per pagina'), search(), {
      min: 1,
      max: 500,
      step: 1,
    }),
    toggle('zn-search-live-search', L('Live search', 'Ricerca istantanea'), {
      ...search(),
      help: L(
        'Shows results while typing in the search box of the “nothing found” page.',
        'Mostra i risultati mentre si scrive nella casella di ricerca della pagina senza risultati.',
      ),
    }),
    flags(
      'zn-search-live-search-post-types',
      {
        ...search(L('Search within', 'Cerca tra')),
        showIf: { field: 'znSearchLiveSearch', equals: true },
      },
      [
        { value: 'post', label: L('Posts', 'Articoli') },
        { value: 'page', label: L('Pages', 'Pagine') },
      ],
    ),
    ...bannerSettings(ST, true),
  ];
}
