/**
 * Single posts and pages: container and sidebar, the title area of posts
 * and of pages, related posts and comments.
 */
import type { FieldDefinition, Label } from '@cleitext/shared';
import { DEFAULTS } from '../core/defaults.js';
import { rec, str } from '../core/php.js';
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
  type FontKeys,
  type Place,
  type Setting,
} from './define.js';
import { sortable, type Choice, type Section } from './define-global.js';

const G = 'section-blog-group';
const SP = 'section-blog-single';
const DP = 'zn-dynamic-single-post';
const RP = 'zn-sub-section-related-posts';
const CM = 'zn-sub-section-comments';
const PG = 'section-single-page';
const DG = 'zn-dynamic-single-page';

export const BLOG_SINGLE_SECTIONS: Section[] = [
  { id: SP, label: { en: 'Single post', it: 'Articolo singolo' }, parent: G, tabs: true },
  {
    id: DP,
    label: { en: 'Post title area', it: 'Area del titolo degli articoli' },
    parent: G,
    tabs: true,
  },
  { id: RP, label: { en: 'Related posts', it: 'Articoli correlati' }, parent: G, tabs: true },
  { id: CM, label: { en: 'Comments', it: 'Commenti' }, parent: G, tabs: true },
  { id: PG, label: { en: 'Single page', it: 'Pagina singola' }, parent: G, tabs: true },
  {
    id: DG,
    label: { en: 'Page title area', it: 'Area del titolo delle pagine' },
    parent: G,
    tabs: true,
  },
];

/* ------------------------------------------------------------------ helpers */

/** Values compared as the CSS reads them: `'1'`/`1`/`true` and `3`/`'3'` alike. */
function norm(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(norm);
  if (v && typeof v === 'object') {
    const r = v as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(r)
        .sort()
        .map((k) => [k, norm(r[k])]),
    );
  }
  if (v === true) return '1';
  if (v === false || v === null || v === undefined) return '';
  return String(v);
}
const sameValue = (a: unknown, b: unknown) => JSON.stringify(norm(a)) === JSON.stringify(norm(b));
const isObj = (v: unknown): v is Record<string, unknown> =>
  Boolean(v) && typeof v === 'object' && !Array.isArray(v);

/** `fallback` with `value` laid over it, two levels deep (devices, then sides). */
function over(fallback: unknown, value: unknown): unknown {
  if (!isObj(fallback) || !isObj(value)) return value;
  const out: Record<string, unknown> = { ...fallback };
  for (const [k, v] of Object.entries(value)) {
    out[k] = isObj(fallback[k]) && isObj(v) ? { ...fallback[k], ...v } : v;
  }
  return out;
}

/**
 * Options a new site does not store (the theme reads them with a fallback):
 * the field shows the fallback, and a value equal to it writes nothing, so
 * an untouched site keeps reading the fallback. Objects are completed with
 * the fallback's missing parts (units, devices).
 */
function withFallback(s: Setting, fallbacks: Record<string, unknown>, ui?: unknown): Setting {
  const fields = s.fields.map((f, i) => {
    if (i > 0 || ui === undefined) return f;
    const d = (f as { default?: unknown }).default;
    return { ...f, default: isObj(d) && isObj(ui) ? { ...d, ...ui } : ui } as FieldDefinition;
  });
  return {
    fields,
    read: s.read,
    write(values, media) {
      const out = s.write(values, media);
      for (const [k, fb] of Object.entries(fallbacks)) {
        if (!(k in out) || k in DEFAULTS) continue;
        out[k] = over(fb, out[k]);
        if (sameValue(out[k], fb)) delete out[k];
      }
      return out;
    },
  };
}

/** The value standing for an empty option value (a choice cannot be empty). */
const EMPTY = 'default';

/**
 * A choice whose options may include the empty value (`''`, shown as
 * "Default"), with the theme's fallback when a new site has no value.
 */
function choose(
  key: string,
  label: Label,
  place: Place,
  options: { value: string; label: Label }[],
  extra: { display?: 'buttons' | 'select'; fallback?: string } = {},
): Setting {
  const name = camel(key);
  const stored = key in DEFAULTS;
  const def = stored ? str(DEFAULTS[key]) : extra.fallback;
  const ui = (v: string) => (v === '' ? EMPTY : v);
  const opts = options.map((o) => ({ value: ui(o.value), label: o.label }));
  const field =
    extra.display === 'select'
      ? { type: 'select' as const, options: opts }
      : { type: 'choice' as const, display: 'buttons' as const, options: opts };
  return {
    fields: [
      {
        ...place,
        ...field,
        name,
        label,
        ...(def !== undefined ? { default: ui(def) } : {}),
      } as FieldDefinition,
    ],
    write(values) {
      const v = values[name];
      if (v === undefined || v === null || v === '') return {};
      const o = v === EMPTY && options.some((x) => x.value === '') ? '' : str(v);
      if (!stored && o === (extra.fallback ?? '')) return {};
      return { [key]: o };
    },
  };
}

/** A switch with the theme's fallback when a new site has no value. */
const flag = (key: string, label: Label, place: Place, fallback: boolean) =>
  key in DEFAULTS
    ? toggle(key, label, place)
    : withFallback(toggle(key, label, place), { [key]: fallback }, fallback);

/** An ordered list of elements with the theme's fallback when a new site has no value. */
function order(
  key: string,
  label: Label,
  place: Place,
  choices: Choice[],
  fallback: string[],
): Setting {
  const s = sortable(key, label, place, choices);
  if (key in DEFAULTS) return s;
  const items = [
    ...fallback.map((item) => ({ item, enabled: true })),
    ...choices
      .filter((c) => !fallback.includes(c.value))
      .map((c) => ({ item: c.value, enabled: false })),
  ];
  return withFallback(s, { [key]: fallback }, items);
}

/** A font: family, weight, size and extras, completed with the fallbacks of a new site. */
function font(
  name: string,
  prefix: string,
  label: Label,
  place: Place,
  fallback: { weight?: string; size?: number } = {},
): Setting {
  const keys: FontKeys = {
    family: `${prefix}-font-family`,
    weight: `${prefix}-font-weight`,
    size: `${prefix}-font-size`,
    extras: `${prefix}-font-extras`,
  };
  const fallbacks = {
    [keys.family!]: 'inherit',
    [keys.weight!]: fallback.weight ?? 'inherit',
    [keys.size!]: { ...FONT_SIZE, desktop: fallback.size ?? '' },
    [keys.extras!]: FONT_EXTRAS,
  };
  const ui: Record<string, unknown> = {};
  if (!(keys.weight! in DEFAULTS) && fallback.weight) ui.weight = fallback.weight;
  if (!(keys.size! in DEFAULTS) && fallback.size) ui.size = { desktop: fallback.size };
  return withFallback(
    typography(name, keys, label, place),
    fallbacks,
    Object.keys(ui).length ? ui : undefined,
  );
}

const FONT_SIZE = {
  desktop: '',
  tablet: '',
  mobile: '',
  'desktop-unit': 'px',
  'tablet-unit': 'px',
  'mobile-unit': 'px',
};
const FONT_EXTRAS = {
  'line-height': '',
  'line-height-unit': 'em',
  'letter-spacing': '',
  'letter-spacing-unit': 'px',
  'text-transform': '',
  'text-decoration': '',
};
const EMPTY_SIDES = { top: '', right: '', bottom: '', left: '' };
const SPACING = {
  desktop: EMPTY_SIDES,
  tablet: EMPTY_SIDES,
  mobile: EMPTY_SIDES,
  'desktop-unit': 'px',
  'tablet-unit': 'px',
  'mobile-unit': 'px',
};
const BANNER_PADDING = {
  desktop: { top: 3, right: 3, bottom: 3, left: 3 },
  tablet: EMPTY_SIDES,
  mobile: EMPTY_SIDES,
  'desktop-unit': 'em',
  'tablet-unit': 'em',
  'mobile-unit': 'em',
};
const BG_DEVICE = {
  'background-color': '',
  'background-image': '',
  'background-repeat': 'repeat',
  'background-position': 'center center',
  'background-size': 'auto',
  'background-attachment': 'scroll',
  'overlay-type': '',
  'overlay-color': '',
  'overlay-opacity': '',
  'overlay-gradient': '',
  'background-type': '',
  'background-media': '',
};
const BACKGROUND = { desktop: BG_DEVICE, tablet: BG_DEVICE, mobile: BG_DEVICE };

/** A responsive spacing (padding or margin) with the fallback of a new site. */
const space = (key: string, label: Label, place: Place, fallback: unknown = SPACING) => {
  const s = spacing(key, label, place, { responsive: true, units: ['px', 'em', '%'] });
  if (key in DEFAULTS) return s;
  const r = rec(fallback);
  const ui: Record<string, unknown> = {};
  for (const d of ['desktop', 'tablet', 'mobile']) {
    const sides = Object.fromEntries(
      Object.entries(rec(r[d])).filter(([, v]) => v !== '' && v !== undefined),
    );
    const unit = str(r[`${d}-unit`]);
    if (Object.keys(sides).length) ui[d] = { ...sides, ...(unit && unit !== 'px' ? { unit } : {}) };
  }
  return withFallback(s, { [key]: fallback }, Object.keys(ui).length ? ui : undefined);
};

/* ------------------------------------------------------------------ choices */

const L = (en: string, it: string) => ({ en, it });

const CONTAINER = (narrow: boolean) => [
  { value: 'default', label: L('Default', 'Predefinito') },
  { value: 'normal-width-container', label: L('Normal', 'Normale') },
  ...(narrow ? [{ value: 'narrow-width-container', label: L('Narrow', 'Stretto') }] : []),
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
const WIDTH = [
  { value: 'default', label: L('Default', 'Predefinita') },
  { value: 'custom', label: L('Custom', 'Personalizzata') },
];
const DIVIDER = [
  { value: '/', label: '/' },
  { value: '-', label: '-' },
  { value: '|', label: '|' },
  { value: '•', label: '•' },
  { value: 'none', label: L('None', 'Nessuno') },
];
const DATE_TYPE = [
  { value: 'published', label: L('Published', 'Pubblicazione') },
  { value: 'updated', label: L('Last updated', 'Ultimo aggiornamento') },
];
const DATE_FORMAT = [
  { value: '', label: L('Default', 'Predefinito') },
  { value: 'F j, Y', label: 'November 6, 2010' },
  { value: 'Y-m-d', label: '2010-11-06' },
  { value: 'm/d/Y', label: '11/06/2010' },
  { value: 'd/m/Y', label: '06/11/2010' },
];
const TAX_STYLE = [
  { value: '', label: L('Default', 'Predefinito') },
  { value: 'badge', label: L('Badge', 'Etichetta') },
  { value: 'underline', label: L('Underline', 'Sottolineato') },
];
const TAXONOMIES = [
  { value: 'category', label: L('Categories', 'Categorie') },
  { value: 'post_tag', label: L('Tags', 'Tag') },
];
const RATIO_PRESETS = [
  { value: '1/1', label: '1:1' },
  { value: '4/3', label: '4:3' },
  { value: '16/9', label: '16:9' },
  { value: '2/1', label: '2:1' },
];
const IMAGE_SIZES = [
  { value: 'full', label: L('Full size', 'Dimensione originale') },
  { value: 'thumbnail', label: L('Thumbnail', 'Miniatura') },
  { value: 'medium', label: L('Medium', 'Media') },
  { value: 'medium_large', label: L('Medium large', 'Medio-grande') },
  { value: 'large', label: L('Large', 'Grande') },
];
const ALIGN = [
  { value: 'left', label: L('Left', 'Sinistra') },
  { value: 'center', label: L('Center', 'Centro') },
  { value: 'right', label: L('Right', 'Destra') },
];

/* ---------------------------------------------- container, sidebar, width */

function layoutSettings(type: 'post' | 'page', section: string): Setting[] {
  const p = { section, tab: 'general' as const };
  const container = `single-${type}-zn-content-layout`;
  const width = type === 'post' ? 'blog-single-width' : 'page-single-width';
  const max = type === 'post' ? 'blog-single-max-width' : 'page-single-max-width';
  return [
    choose(container, L('Container layout', 'Layout del contenitore'), p, CONTAINER(true), {
      fallback: 'default',
    }),
    choose(
      `single-${type}-content-style`,
      L('Container style', 'Stile del contenitore'),
      {
        ...p,
        help: L(
          'Applies only when the layout is normal or narrow.',
          'Vale solo quando il layout è normale o stretto.',
        ),
      },
      STYLE,
      { fallback: 'default' },
    ),
    choose(
      `single-${type}-sidebar-layout`,
      L('Sidebar layout', 'Layout della barra laterale'),
      {
        ...p,
        group: L('Sidebar', 'Barra laterale'),
        help: L(
          'The sidebar shows only when the container layout is normal.',
          'La barra laterale compare solo con il layout del contenitore normale.',
        ),
      },
      SIDEBAR,
      { fallback: 'default' },
    ),
    choose(
      `single-${type}-sidebar-style`,
      L('Sidebar style', 'Stile della barra laterale'),
      p,
      STYLE,
      {
        fallback: 'default',
      },
    ),
    select(
      width,
      L('Content width', 'Larghezza del contenuto'),
      { ...p, group: L('Width', 'Larghezza') },
      WIDTH,
    ),
    number(
      max,
      L('Custom width', 'Larghezza personalizzata'),
      { ...p, showIf: { field: camel(width), equals: 'custom' } },
      { min: 0, max: 1920, unit: 'px', range: true },
    ),
  ];
}

/* ------------------------------------------------------- the title areas */

function titleArea(type: 'post' | 'page'): Setting[] {
  const t = `zn-dynamic-single-${type}`;
  const section = type === 'post' ? DP : DG;
  const k = (s: string) => `${t}-${s}`;
  const n = (s: string) => camel(k(s));
  const gen: Place = { section, tab: 'general' };
  const des: Place = { section, tab: 'design' };
  const enabled = { field: camel(`zn-single-${type}-title`), equals: true };
  const on = (c: Place['showIf']): Place['showIf'] => (c ? { all: [enabled, c] } : enabled);
  const g = (place: Place, c?: Place['showIf'], group?: Label): Place => ({
    ...place,
    showIf: on(c),
    ...(group ? { group } : {}),
  });
  const layout2 = { field: n('layout'), equals: 'layout-2' };
  const layout1 = { field: n('layout'), not: 'layout-2' };
  const image = L('Featured image', 'Immagine in evidenza');
  const metaG = L('Meta', 'Meta');
  const structure: Choice[] = [
    { value: k('title'), label: L('Title', 'Titolo') },
    { value: k('breadcrumb'), label: L('Breadcrumb', 'Percorso di navigazione') },
    { value: k('excerpt'), label: L('Excerpt', 'Riassunto') },
    { value: k('meta'), label: L('Meta', 'Meta') },
    { value: k('image'), label: L('Featured image', 'Immagine in evidenza') },
    ...(type === 'post'
      ? [{ value: k('str-taxonomy'), label: L('Taxonomies', 'Tassonomie') }]
      : []),
  ];
  const metaChoices: Choice[] = [
    { value: 'comments', label: L('Comments', 'Commenti') },
    ...(type === 'post'
      ? [
          { value: k('taxonomy'), label: L('Taxonomy 1', 'Tassonomia 1') },
          { value: k('taxonomy-1'), label: L('Taxonomy 2', 'Tassonomia 2') },
          { value: k('taxonomy-2'), label: L('Taxonomy 3', 'Tassonomia 3') },
        ]
      : []),
    { value: 'date', label: L('Date', 'Data') },
    { value: 'author', label: L('Author', 'Autore') },
  ];
  const ratio = n('article-featured-image-ratio-type');
  const label =
    type === 'post'
      ? L('Post title area', 'Area del titolo')
      : L('Page title area', 'Area del titolo');
  return [
    flag(
      `zn-single-${type}-title`,
      L('Show the title area', "Mostra l'area del titolo"),
      { ...gen, group: label },
      true,
    ),
    ...(type === 'page'
      ? [
          flag(
            k('disable-structure-meta-on-front-page'),
            L('Hide on the front page', 'Nascondi nella pagina iniziale'),
            g(gen, undefined, undefined),
            false,
          ),
        ]
      : []),
    choose(
      k('layout'),
      L('Banner layout', 'Layout del banner'),
      {
        ...g(gen),
        help: L(
          'Layout 1 keeps the title inside the content; layout 2 shows it in a full-width banner above it.',
          'Il layout 1 tiene il titolo nel contenuto; il layout 2 lo mostra in un banner a tutta larghezza sopra.',
        ),
      },
      [
        { value: 'layout-1', label: L('Layout 1', 'Layout 1') },
        { value: 'layout-2', label: L('Layout 2', 'Layout 2') },
      ],
      { fallback: 'layout-1' },
    ),
    choose(
      k('banner-width-type'),
      L('Container width', 'Larghezza del contenitore'),
      g(gen, layout2),
      [
        { value: 'fullwidth', label: L('Full width', 'Larghezza piena') },
        { value: 'custom', label: L('Custom', 'Personalizzata') },
      ],
      { fallback: 'fullwidth' },
    ),
    withFallback(
      number(
        k('banner-custom-width'),
        L('Custom width', 'Larghezza personalizzata'),
        g(gen, { all: [layout2, { field: n('banner-width-type'), equals: 'custom' }] }),
        { min: 768, max: 1920, unit: 'px', range: true },
      ),
      { [k('banner-custom-width')]: 1200 },
      1200,
    ),
    order(
      k('structure'),
      L('Structure', 'Struttura'),
      g(gen),
      structure,
      type === 'page' ? [k('image'), k('title')] : [k('title'), k('meta')],
    ),
    choose(
      k('article-featured-image-position-layout-1'),
      L('Image position', "Posizione dell'immagine"),
      {
        ...g(gen, layout1, image),
        help: L(
          '"None" keeps the order above; "Behind" places the image under the article.',
          '"Nessuna" rispetta l\'ordine sopra; "Dietro" mette l\'immagine sotto l\'articolo.',
        ),
      },
      [
        { value: 'none', label: L('None', 'Nessuna') },
        { value: 'behind', label: L('Behind', 'Dietro') },
      ],
      { fallback: 'behind' },
    ),
    choose(
      k('article-featured-image-position-layout-2'),
      L('Image position', "Posizione dell'immagine"),
      {
        ...g(gen, layout2, image),
        help: L(
          '"None" keeps the order above; "Below" places the image on top of the article.',
          '"Nessuna" rispetta l\'ordine sopra; "Sotto" mette l\'immagine in cima all\'articolo.',
        ),
      },
      [
        { value: 'none', label: L('None', 'Nessuna') },
        { value: 'below', label: L('Below', 'Sotto') },
      ],
      { fallback: 'none' },
    ),
    choose(
      k('article-featured-image-width-type'),
      L('Width of the image behind', "Larghezza dell'immagine dietro"),
      g(gen, layout1, image),
      [
        { value: 'wide', label: L('Wide', 'Ampia') },
        { value: 'full', label: L('Full width', 'Larghezza piena') },
      ],
      { fallback: 'wide' },
    ),
    choose(
      k('article-featured-image-ratio-type'),
      L('Image ratio', "Proporzioni dell'immagine"),
      g(gen, undefined, image),
      [
        { value: 'default', label: L('Original', 'Originali') },
        { value: 'predefined', label: L('Predefined', 'Predefinite') },
        { value: 'custom', label: L('Custom', 'Personalizzate') },
      ],
      { fallback: 'predefined' },
    ),
    choose(
      k('article-featured-image-ratio-pre-scale'),
      L('Ratio', 'Proporzioni'),
      g(gen, { field: ratio, equals: 'predefined' }, image),
      RATIO_PRESETS,
      { fallback: '16/9' },
    ),
    withFallback(
      number(
        k('article-featured-image-custom-scale-width'),
        L('Width', 'Larghezza'),
        g(gen, { field: ratio, equals: 'custom' }, image),
        {
          min: 1,
          max: 1000,
        },
      ),
      { [k('article-featured-image-custom-scale-width')]: 16 },
      16,
    ),
    withFallback(
      number(
        k('article-featured-image-custom-scale-height'),
        L('Height', 'Altezza'),
        g(gen, { field: ratio, equals: 'custom' }, image),
        {
          min: 1,
          max: 1000,
        },
      ),
      { [k('article-featured-image-custom-scale-height')]: 9 },
      9,
    ),
    choose(
      k('article-featured-image-size'),
      L('Image size', "Dimensione dell'immagine"),
      g(gen, undefined, image),
      IMAGE_SIZES,
      {
        display: 'select',
        fallback: 'large',
      },
    ),
    flag(
      k('remove-featured-padding'),
      L('Remove image padding', "Togli lo spazio attorno all'immagine"),
      {
        ...g(gen, layout1, image),
        help: L(
          'Removes the space around the featured image when its position is "None".',
          'Toglie lo spazio attorno all\'immagine in evidenza quando la posizione è "Nessuna".',
        ),
      },
      false,
    ),
    flag(
      k('featured-as-background'),
      L('Use as background', 'Usa come sfondo'),
      g(gen, layout2, image),
      false,
    ),
    color(
      k('banner-featured-overlay'),
      L('Overlay color', 'Colore di sovrapposizione'),
      g(gen, layout2, image),
    ),
    ...(type === 'post'
      ? [
          choose(
            k('structural-taxonomy'),
            L('Taxonomy', 'Tassonomia'),
            g(gen, undefined, L('Taxonomies', 'Tassonomie')),
            [{ value: '', label: L('Select', 'Scegli') }, ...TAXONOMIES],
            { display: 'select' },
          ),
          choose(
            k('structural-taxonomy-style'),
            L('Style', 'Stile'),
            g(gen, undefined, L('Taxonomies', 'Tassonomie')),
            TAX_STYLE,
          ),
        ]
      : []),
    choose(
      k('metadata-separator'),
      L('Divider type', 'Tipo di separatore'),
      g(gen, undefined, metaG),
      DIVIDER,
      {
        fallback: '/',
      },
    ),
    order(k('metadata'), L('Meta', 'Meta'), g(gen, undefined, metaG), metaChoices, [
      'author',
      'date',
    ]),
    text(k('author-prefix-label'), L('Author prefix label', "Etichetta prima dell'autore"), {
      ...g(gen, undefined, L('Author', 'Autore')),
      help: L('Empty: "By".', 'Vuota: "Di".'),
    }),
    flag(
      k('author-avatar'),
      L('Author avatar', "Avatar dell'autore"),
      g(gen, undefined, L('Author', 'Autore')),
      false,
    ),
    withFallback(
      number(
        k('author-avatar-size'),
        L('Avatar size', "Dimensione dell'avatar"),
        g(gen, { field: n('author-avatar'), equals: true }, L('Author', 'Autore')),
        { min: 1, max: 200, unit: 'px', range: true },
      ),
      { [k('author-avatar-size')]: 30 },
      30,
    ),
    choose(
      k('meta-date-type'),
      L('Date type', 'Tipo di data'),
      g(gen, undefined, L('Date', 'Data')),
      DATE_TYPE,
      {
        fallback: 'published',
      },
    ),
    choose(
      k('date-format'),
      L('Date format', 'Formato della data'),
      g(gen, undefined, L('Date', 'Data')),
      DATE_FORMAT,
      {
        display: 'select',
      },
    ),
    ...(type === 'post'
      ? ['', '-1', '-2'].flatMap((suffix, i) => {
          const grp = L(`Taxonomy ${i + 1}`, `Tassonomia ${i + 1}`);
          return [
            choose(
              k(`taxonomy${suffix}`),
              L('Taxonomy', 'Tassonomia'),
              g(gen, undefined, grp),
              [{ value: '', label: L('Select', 'Scegli') }, ...TAXONOMIES],
              { display: 'select' },
            ),
            choose(
              k(`taxonomy${suffix}-style`),
              L('Style', 'Stile'),
              g(gen, undefined, grp),
              TAX_STYLE,
            ),
          ];
        })
      : []),
    select(
      k('horizontal-alignment'),
      L('Horizontal alignment', 'Allineamento orizzontale'),
      g(gen, undefined, L('Alignment', 'Allineamento')),
      ALIGN,
      { responsive: true },
    ),
    choose(
      k('vertical-alignment'),
      L('Vertical alignment', 'Allineamento verticale'),
      g(gen, layout2, L('Alignment', 'Allineamento')),
      [
        { value: 'flex-start', label: L('Top', 'In alto') },
        { value: 'center', label: L('Middle', 'Al centro') },
        { value: 'flex-end', label: L('Bottom', 'In basso') },
      ],
      { fallback: 'center' },
    ),

    // Design
    withFallback(
      respNumber(
        k('banner-height'),
        L('Banner minimum height', 'Altezza minima del banner'),
        g(des, layout2),
        {
          min: 0,
          max: 1000,
          range: true,
        },
      ),
      { [k('banner-height')]: { desktop: '', tablet: '', mobile: '' } },
    ),
    k('elements-gap') in DEFAULTS
      ? number(k('elements-gap'), L('Space between elements', 'Spazio tra gli elementi'), g(des), {
          min: 0,
          max: 100,
          unit: 'px',
          range: true,
        })
      : withFallback(
          number(
            k('elements-gap'),
            L('Space between elements', 'Spazio tra gli elementi'),
            g(des),
            {
              min: 0,
              max: 100,
              unit: 'px',
              range: true,
            },
          ),
          { [k('elements-gap')]: 10 },
          10,
        ),
    withFallback(
      background(
        k('banner-background'),
        L('Background', 'Sfondo'),
        g(des, { all: [layout2, { field: n('featured-as-background'), not: true }] }),
        { responsive: true },
      ),
      { [k('banner-background')]: BACKGROUND },
    ),
    color(
      k('banner-title-color'),
      L('Title color', 'Colore del titolo'),
      g(des, undefined, L('Colors', 'Colori')),
    ),
    color(
      k('banner-text-color'),
      L('Text color', 'Colore del testo'),
      g(des, undefined, L('Colors', 'Colori')),
    ),
    color(
      k('banner-link-color'),
      L('Link color', 'Colore dei link'),
      g(des, undefined, L('Colors', 'Colori')),
    ),
    color(
      k('banner-link-hover-color'),
      L('Link hover color', 'Colore dei link al passaggio'),
      g(des, undefined, L('Colors', 'Colori')),
    ),
    font(
      `${n('title')}Font`,
      k('title'),
      L('Title font', 'Carattere del titolo'),
      g(des, undefined, L('Fonts', 'Caratteri')),
      {
        weight: '600',
        size: 32,
      },
    ),
    font(
      `${n('text')}Font`,
      k('text'),
      L('Text font', 'Carattere del testo'),
      g(des, undefined, L('Fonts', 'Caratteri')),
    ),
    font(
      `${n('meta')}Font`,
      k('meta'),
      L('Meta font', 'Carattere dei meta'),
      g(des, undefined, L('Fonts', 'Caratteri')),
    ),
    space(k('banner-margin'), L('Margin', 'Margine'), g(des, layout2, L('Spacing', 'Spaziatura'))),
    space(
      k('banner-padding'),
      L('Padding', 'Spaziatura interna'),
      g(des, layout2, L('Spacing', 'Spaziatura')),
      BANNER_PADDING,
    ),
  ];
}

/* ------------------------------------------------------------ related posts */

function relatedPosts(): Setting[] {
  const gen: Place = { section: RP, tab: 'general' };
  const des: Place = { section: RP, tab: 'design' };
  const on = { field: 'enableRelatedPosts', equals: true };
  const g = (place: Place, c?: Place['showIf'], group?: Label): Place => ({
    ...place,
    showIf: c ? { all: [on, c] } : on,
    ...(group ? { group } : {}),
  });
  const titled = { field: 'relatedPostsTitle', not: '' };
  const placement = 'relatedPostsBoxPlacement';
  const ratio = 'relatedPostsImageRatioType';
  const image = L('Featured image', 'Immagine in evidenza');
  const meta = L('Meta', 'Meta');
  const query = L('Posts query', 'Selezione degli articoli');
  return [
    toggle('enable-related-posts', L('Show related posts', 'Mostra articoli correlati'), gen),
    text('related-posts-title', L('Title', 'Titolo'), g(gen)),
    select(
      'releted-posts-title-alignment',
      L('Title alignment', 'Allineamento del titolo'),
      g(gen, titled),
      ALIGN,
    ),
    number(
      'related-posts-total-count',
      L('Number of related posts', 'Numero di articoli correlati'),
      g(gen),
      {
        min: 1,
        max: 20,
        range: true,
      },
    ),
    select(
      'related-posts-grid-responsive',
      L('Grid columns', 'Colonne della griglia'),
      g(gen),
      [
        { value: 'full', label: '1' },
        { value: '2-equal', label: '2' },
        { value: '3-equal', label: '3' },
        { value: '4-equal', label: '4' },
      ],
      { responsive: true },
    ),
    select(
      'related-posts-based-on',
      L('Related posts by', 'Articoli correlati per'),
      g(gen, undefined, query),
      [
        { value: 'categories', label: L('Categories', 'Categorie') },
        { value: 'tags', label: L('Tags', 'Tag') },
      ],
    ),
    select(
      'related-posts-order-by',
      L('Order by', 'Ordina per'),
      g(gen, undefined, query),
      [
        { value: 'date', label: L('Date', 'Data') },
        { value: 'title', label: L('Title', 'Titolo') },
        { value: 'menu_order', label: L('Post order', 'Ordine degli articoli') },
        { value: 'rand', label: L('Random', 'Casuale') },
        { value: 'comment_count', label: L('Number of comments', 'Numero di commenti') },
      ],
      { display: 'select' },
    ),
    select('related-posts-order', L('Order', 'Ordine'), g(gen, undefined, query), [
      { value: 'asc', label: L('Ascending', 'Crescente') },
      { value: 'desc', label: L('Descending', 'Decrescente') },
    ]),
    sortable('related-posts-structure', L('Posts structure', 'Struttura degli articoli'), g(gen), [
      { value: 'featured-image', label: L('Featured image', 'Immagine in evidenza') },
      { value: 'title-meta', label: L('Title & post meta', 'Titolo e meta') },
    ]),
    choose(
      'related-posts-image-ratio-type',
      L('Image ratio', "Proporzioni dell'immagine"),
      g(gen, undefined, image),
      [
        { value: '', label: L('Original', 'Originali') },
        { value: 'predefined', label: L('Predefined', 'Predefinite') },
        { value: 'custom', label: L('Custom', 'Personalizzate') },
      ],
    ),
    select(
      'related-posts-image-ratio-pre-scale',
      L('Ratio', 'Proporzioni'),
      g(gen, { field: ratio, equals: 'predefined' }, image),
      RATIO_PRESETS,
    ),
    number(
      'related-posts-image-custom-scale-width',
      L('Width', 'Larghezza'),
      g(gen, { field: ratio, equals: 'custom' }, image),
      {
        min: 1,
        max: 1000,
      },
    ),
    number(
      'related-posts-image-custom-scale-height',
      L('Height', 'Altezza'),
      g(gen, { field: ratio, equals: 'custom' }, image),
      {
        min: 1,
        max: 1000,
      },
    ),
    choose(
      'related-posts-image-size',
      L('Image size', "Dimensione dell'immagine"),
      g(gen, undefined, image),
      [{ value: '', label: L('Default', 'Predefinita') }, ...IMAGE_SIZES],
      { display: 'select' },
    ),
    choose(
      'related-metadata-separator',
      L('Divider type', 'Tipo di separatore'),
      g(gen, undefined, meta),
      DIVIDER,
      {
        fallback: '/',
      },
    ),
    sortable('related-posts-meta-structure', L('Meta', 'Meta'), g(gen, undefined, meta), [
      { value: 'comments', label: L('Comments', 'Commenti') },
      { value: 'category', label: L('Category', 'Categoria') },
      { value: 'author', label: L('Author', 'Autore') },
      { value: 'date', label: L('Date', 'Data') },
      { value: 'tag', label: L('Tag', 'Tag') },
    ]),
    text(
      'related-posts-author-prefix-label',
      L('Author prefix label', "Etichetta prima dell'autore"),
      g(gen, undefined, L('Author', 'Autore')),
    ),
    toggle(
      'related-posts-author-avatar',
      L('Author avatar', "Avatar dell'autore"),
      g(gen, undefined, L('Author', 'Autore')),
    ),
    number(
      'related-posts-author-avatar-size',
      L('Avatar size', "Dimensione dell'avatar"),
      g(gen, { field: 'relatedPostsAuthorAvatar', equals: true }, L('Author', 'Autore')),
      { min: 1, max: 200, unit: 'px', range: true },
    ),
    select(
      'related-posts-meta-date-type',
      L('Date type', 'Tipo di data'),
      g(gen, undefined, L('Date', 'Data')),
      DATE_TYPE,
    ),
    choose(
      'related-posts-date-format',
      L('Date format', 'Formato della data'),
      g(gen, undefined, L('Date', 'Data')),
      DATE_FORMAT,
      {
        display: 'select',
      },
    ),
    select(
      'related-posts-category-style',
      L('Category style', 'Stile delle categorie'),
      g(gen, undefined, meta),
      [
        { value: 'none', label: L('Default', 'Predefinito') },
        { value: 'badge', label: L('Badge', 'Etichetta') },
        { value: 'underline', label: L('Underline', 'Sottolineato') },
      ],
    ),
    select('related-posts-tag-style', L('Tag style', 'Stile dei tag'), g(gen, undefined, meta), [
      { value: 'none', label: L('Default', 'Predefinito') },
      { value: 'badge', label: L('Badge', 'Etichetta') },
      { value: 'underline', label: L('Underline', 'Sottolineato') },
    ]),
    toggle(
      'enable-related-posts-excerpt',
      L('Show the excerpt', 'Mostra il riassunto'),
      g(gen, undefined, L('Excerpt', 'Riassunto')),
    ),
    number(
      'related-posts-excerpt-count',
      L('Excerpt word count', 'Parole del riassunto'),
      g(gen, { field: 'enableRelatedPostsExcerpt', equals: true }, L('Excerpt', 'Riassunto')),
      { min: 1, max: 100, range: true },
    ),
    select(
      'related-posts-box-placement',
      L('Section placement', 'Posizione della sezione'),
      {
        ...g(gen, undefined, L('Placement', 'Posizione')),
        help: L(
          'Keep the section inside the post area or show it as a separate box.',
          "Tieni la sezione dentro l'articolo o mostrala in un riquadro a parte.",
        ),
      },
      [
        { value: 'default', label: L('Default', 'Predefinita') },
        { value: 'inside', label: L('Contained', 'Contenuta') },
        { value: 'outside', label: L('Separated', 'Separata') },
      ],
    ),
    select(
      'related-posts-outside-location',
      L('Location', 'Collocazione'),
      {
        ...g(gen, { field: placement, not: 'default' }, L('Placement', 'Posizione')),
        help: L(
          'To keep it in step with the comments, give both sections the same placement.',
          'Per allinearla ai commenti, dai a entrambe le sezioni la stessa posizione.',
        ),
      },
      [
        { value: 'below', label: L('Below comments', 'Sotto i commenti') },
        { value: 'above', label: L('Above comments', 'Sopra i commenti') },
      ],
    ),
    choose(
      'related-posts-container-width',
      L('Container structure', 'Struttura del contenitore'),
      g(gen, { field: placement, equals: 'outside' }, L('Placement', 'Posizione')),
      [
        { value: 'narrow', label: L('Narrow', 'Stretta') },
        { value: '', label: L('Full width', 'Larghezza piena') },
      ],
    ),

    // Design
    color(
      'related-posts-title-color',
      L('Section title', 'Titolo della sezione'),
      g(des, titled, L('Colors', 'Colori')),
    ),
    color(
      'related-posts-background-color',
      L('Section background', 'Sfondo della sezione'),
      g(des, undefined, L('Colors', 'Colori')),
    ),
    color(
      'related-posts-text-color',
      L('Text color', 'Colore del testo'),
      g(des, undefined, L('Content colors', 'Colori del contenuto')),
    ),
    color(
      'related-posts-link-color',
      L('Link color', 'Colore dei link'),
      g(des, undefined, L('Content colors', 'Colori del contenuto')),
    ),
    color(
      'related-posts-meta-color',
      L('Meta color', 'Colore dei meta'),
      g(des, undefined, L('Content colors', 'Colori del contenuto')),
    ),
    color(
      'related-posts-link-hover-color',
      L('Link color on hover', 'Colore dei link al passaggio'),
      g(des, undefined, L('Content colors', 'Colori del contenuto')),
    ),
    color(
      'related-posts-meta-link-hover-color',
      L('Meta link color on hover', 'Colore dei link dei meta al passaggio'),
      g(des, undefined, L('Content colors', 'Colori del contenuto')),
    ),
    font(
      'relatedPostsSectionTitleFont',
      'related-posts-section-title',
      L('Section title font', 'Carattere del titolo della sezione'),
      g(des, titled, L('Fonts', 'Caratteri')),
    ),
    font(
      'relatedPostsTitleFont',
      'related-posts-title',
      L('Post title font', 'Carattere del titolo degli articoli'),
      g(des, undefined, L('Fonts', 'Caratteri')),
    ),
    font(
      'relatedPostsMetaFont',
      'related-posts-meta',
      L('Meta font', 'Carattere dei meta'),
      g(des, undefined, L('Fonts', 'Caratteri')),
    ),
    font(
      'relatedPostsContentFont',
      'related-posts-content',
      L('Content font', 'Carattere del contenuto'),
      g(des, { field: 'enableRelatedPostsExcerpt', equals: true }, L('Fonts', 'Caratteri')),
    ),
    ...borders(RP, des, on),
  ];
}

/** Border width, color and radius, then padding and margin, of a section (design tab). */
function borders(section: string, des: Place, cond?: Place['showIf']): Setting[] {
  const p = (group: Label): Place => ({ ...des, group, ...(cond ? { showIf: cond } : {}) });
  const border = L('Border', 'Bordo');
  const sp = L('Spacing', 'Spaziatura');
  return [
    spacing(`${section}-border-width`, L('Border width', 'Spessore del bordo'), p(border), {
      unitless: true,
    }),
    color(`${section}-border-color`, L('Color', 'Colore'), p(border)),
    spacing(`${section}-border-radius`, L('Border radius', 'Arrotondamento del bordo'), p(border), {
      unitless: true,
      corners: true,
    }),
    space(`${section}-padding`, L('Padding', 'Spaziatura interna'), p(sp)),
    space(`${section}-margin`, L('Margin', 'Margine'), p(sp)),
  ];
}

/* ----------------------------------------------------------------- comments */

function comments(): Setting[] {
  const gen: Place = { section: CM, tab: 'general' };
  const des: Place = { section: CM, tab: 'design' };
  const on = { field: 'enableCommentsArea', equals: true };
  const g = (c?: Place['showIf']): Place => ({ ...gen, showIf: c ? { all: [on, c] } : on });
  return [
    toggle('enable-comments-area', L('Show comments', 'Mostra i commenti'), gen),
    choose(
      'comments-box-placement',
      L('Section placement', 'Posizione della sezione'),
      {
        ...g(),
        help: L(
          'Keep the comments inside the post area or show them as a separate box.',
          "Tieni i commenti dentro l'articolo o mostrali in un riquadro a parte.",
        ),
      },
      [
        { value: '', label: L('Default', 'Predefinita') },
        { value: 'inside', label: L('Contained', 'Contenuta') },
        { value: 'outside', label: L('Separated', 'Separata') },
      ],
    ),
    choose(
      'comments-box-container-width',
      L('Container structure', 'Struttura del contenitore'),
      g({ field: 'commentsBoxPlacement', equals: 'outside' }),
      [
        { value: 'narrow', label: L('Narrow', 'Stretta') },
        { value: '', label: L('Full width', 'Larghezza piena') },
      ],
    ),
    select('comment-form-position', L('Form position', 'Posizione del modulo'), g(), [
      { value: 'below', label: L('Below comments', 'Sotto i commenti') },
      { value: 'above', label: L('Above comments', 'Sopra i commenti') },
    ]),
    ...borders(CM, des, on),
  ];
}

/* --------------------------------------------------------------- the lists */

export function blogSingleSettings(): Setting[] {
  const spGen: Place = { section: SP, tab: 'general' };
  const spDes: Place = {
    section: SP,
    tab: 'design',
    group: L('Post spacing', 'Spaziatura degli articoli'),
  };
  return [
    // Single post
    ...layoutSettings('post', SP),
    toggle(
      'single-content-images-shadow',
      L('Shadow on content images', 'Ombra sulle immagini del contenuto'),
      spGen,
    ),
    space('single-post-outside-spacing', L('Outside', 'Esterna'), spDes),
    space('single-post-inside-spacing', L('Inside', 'Interna'), spDes),
    ...titleArea('post'),
    ...relatedPosts(),
    ...comments(),
    // Single page
    ...layoutSettings('page', PG),
    space(`${PG}-padding`, L('Padding', 'Spaziatura interna'), {
      section: PG,
      tab: 'design',
      group: L('Spacing', 'Spaziatura'),
    }),
    space(`${PG}-margin`, L('Margin', 'Margine'), {
      section: PG,
      tab: 'design',
      group: L('Spacing', 'Spaziatura'),
    }),
    ...titleArea('page'),
  ];
}
