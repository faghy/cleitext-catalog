/**
 * More kinds of settings for the header and footer builders and the page
 * options: switches per device, font sizes, the social networks list, the
 * columns of a footer row, custom SVG code, page options.
 */
import type { FieldDefinition, Label } from '@cleitext/shared';
import { DEFAULTS } from '../core/defaults.js';
import { at, rec, str } from '../core/php.js';
import { camel, PALETTE, respNumber, type Place, type Setting } from './define.js';

/** A Customize section (or a panel: a section without fields that lists its children). */
export type Section = {
  id: string;
  label: { en: string; it: string };
  parent?: string;
  tabs?: true;
  description?: { en: string; it: string };
};

const DEVICES = ['desktop', 'tablet', 'mobile'] as const;
const set = (v: unknown) => v !== undefined && v !== null && v !== '';

/** Common labels. */
export const L = {
  normal: { en: 'Normal', it: 'Normale' },
  hover: { en: 'Hover', it: 'Al passaggio' },
  active: { en: 'Active', it: 'Attivo' },
  left: { en: 'Left', it: 'Sinistra' },
  center: { en: 'Center', it: 'Centro' },
  right: { en: 'Right', it: 'Destra' },
  margin: { en: 'Margin', it: 'Margine esterno' },
  padding: { en: 'Padding', it: 'Margine interno' },
  spacing: { en: 'Spacing', it: 'Spaziatura' },
  font: { en: 'Font', it: 'Carattere' },
  fontSize: { en: 'Font size', it: 'Dimensione del testo' },
  background: { en: 'Background', it: 'Sfondo' },
} satisfies Record<string, Label>;

/** Left / center / right as the options store them (`left` or `flex-start`…). */
export const align = (flex = false) => [
  { value: flex ? 'flex-start' : 'left', label: L.left },
  { value: 'center', label: L.center },
  { value: flex ? 'flex-end' : 'right', label: L.right },
];

/**
 * A switch per device stored as `{ desktop: 1, tablet: 0, mobile: 1 }` (the
 * visibility of the site title, of the tagline…).
 */
export function deviceSwitches(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  const def = rec(DEFAULTS[key]);
  return {
    fields: [
      {
        ...place,
        name,
        type: 'boolean',
        label,
        responsive: true,
        default: Object.fromEntries(DEVICES.map((d) => [d, Boolean(Number(def[d] ?? 1))])),
      } as FieldDefinition,
    ],
    write(values) {
      const v = values[name];
      if (!set(v)) return {};
      const r = rec(v);
      // A device without a value uses the larger one's.
      let last = Boolean(Number(def.desktop ?? 1));
      const out: Record<string, number> = {};
      for (const d of DEVICES) {
        if (r[d] !== undefined && r[d] !== null) last = Boolean(r[d]);
        out[d] = last ? 1 : 0;
      }
      return { [key]: out };
    },
  };
}

/** A font size per device, in px, em, vw or rem. */
export function fontSize(key: string, label: Label, place: Place): Setting {
  return respNumber(key, label, place, { min: 0, max: 200, units: ['px', 'em', 'vw', 'rem'] });
}

/** Custom SVG code of the logo icon: `{ type: 'custom', value }`. */
export function svgCode(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  const def = rec(DEFAULTS[key]);
  const value = str(def.type) === 'custom' ? str(def.value) : '';
  return {
    fields: [
      {
        ...place,
        name,
        type: 'text',
        multiline: true,
        maxLength: 20000,
        label,
        ...(value ? { default: value } : {}),
      } as FieldDefinition,
    ],
    write(values) {
      const v = values[name];
      if (!set(v)) return {};
      return { [key]: { type: 'custom', value: str(v) } };
    },
  };
}

/** Some switches stored as one object of `1` / `0` (e.g. the post types searched). */
export function switchGroup(
  key: string,
  choices: { value: string; label: Label }[],
  place: Place,
): Setting {
  const base = camel(key);
  const def = rec(DEFAULTS[key]);
  const nameOf = (value: string) => `${base}${camel(`-${value}`)}`;
  return {
    fields: choices.map(
      (c) =>
        ({
          ...place,
          name: nameOf(c.value),
          type: 'boolean',
          label: c.label,
          default: Boolean(Number(def[c.value] ?? 0)),
        }) as FieldDefinition,
    ),
    write(values) {
      if (!choices.some((c) => set(values[nameOf(c.value)]))) return {};
      const out: Record<string, number> = {};
      for (const c of choices) {
        const v = values[nameOf(c.value)];
        out[c.value] = (set(v) ? Boolean(v) : Boolean(Number(def[c.value] ?? 0))) ? 1 : 0;
      }
      return { [key]: out };
    },
  };
}

/** The social networks of the social icons element, with their brand colors. */
export const NETWORKS: { value: string; label: string; color: string }[] = [
  { value: 'behance', label: 'Behance', color: '#1B64F6' },
  { value: 'bluesky', label: 'Bluesky', color: '#1285fe' },
  { value: 'dribbble', label: 'Dribbble', color: '#d77ea6' },
  { value: 'email', label: 'Email 1', color: '#ea4335' },
  { value: 'email_2', label: 'Email 2', color: '#ea4335' },
  { value: 'facebook', label: 'Facebook', color: '#557dbc' },
  { value: 'facebook_group', label: 'Facebook Group', color: '#3D87FB' },
  { value: 'github', label: 'GitHub', color: '#24292e' },
  { value: 'google_reviews', label: 'Google Reviews', color: '#dc4e41' },
  { value: 'imdb', label: 'IMDB', color: '#000000' },
  { value: 'instagram', label: 'Instagram', color: '#8a3ab9' },
  { value: 'linkedin', label: 'LinkedIn', color: '#1c86c6' },
  { value: 'medium', label: 'Medium', color: '#292929' },
  { value: 'nextdoor', label: 'Nextdoor', color: '#73CD0E' },
  { value: 'patreon', label: 'Patreon', color: '#e65c4b' },
  { value: 'phone', label: 'Phone 1', color: 'inherit' },
  { value: 'phone_2', label: 'Phone 2', color: 'inherit' },
  { value: 'pinterest', label: 'Pinterest', color: '#ea575a' },
  { value: 'reddit', label: 'Reddit', color: '#FC471E' },
  { value: 'rss', label: 'RSS', color: '#f09124' },
  { value: 'telegram', label: 'Telegram', color: '#229CCE' },
  { value: 'threads', label: 'Threads', color: '#000000' },
  { value: 'tiktok', label: 'TikTok', color: '#000000' },
  { value: 'trip_advisor', label: 'Trip Advisor', color: '#00aa6c' },
  { value: 'twitter', label: 'Twitter', color: '#7acdee' },
  { value: 'twitter-x', label: 'Twitter / X', color: '#000000' },
  { value: 'vimeo', label: 'Vimeo', color: '#8ecfde' },
  { value: 'vk', label: 'VK', color: '#5382b6' },
  { value: 'wechat', label: 'WeChat', color: '#2DC100' },
  { value: 'whatsapp', label: 'WhatsApp', color: '#5BBA67' },
  { value: 'wordpress-logo', label: 'WordPress', color: '#464646' },
  { value: 'xing', label: 'Xing', color: '#0A5C5D' },
  { value: 'yelp', label: 'Yelp', color: '#af0606' },
  { value: 'youtube', label: 'YouTube', color: '#e96651' },
];

/**
 * The networks of a social icons element: a list of network, label, address
 * and a switch, written as `{ items: [{ id, enabled, source, url, color,
 * background, icon, label }] }`.
 */
export function socialIcons(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  const known = new Set(NETWORKS.map((n) => n.value));
  const def = ((at(DEFAULTS[key], 'items') ?? []) as unknown[]).map(rec);
  return {
    fields: [
      {
        ...place,
        name,
        type: 'list',
        label,
        itemLabel: 'label',
        max: 40,
        fields: [
          {
            name: 'network',
            type: 'select',
            label: { en: 'Network', it: 'Social network' },
            options: NETWORKS.map((n) => ({ value: n.value, label: n.label })),
            required: true,
          },
          { name: 'label', type: 'text', label: { en: 'Label', it: 'Etichetta' }, maxLength: 100 },
          {
            name: 'url',
            type: 'text',
            label: { en: 'Link', it: 'Link' },
            help: {
              en: 'The address of your page. For phone and email just write the number or the address.',
              it: 'L’indirizzo della tua pagina. Per telefono ed email basta scrivere il numero o l’indirizzo.',
            },
            maxLength: 2000,
          },
          {
            name: 'enabled',
            type: 'boolean',
            label: { en: 'Shown', it: 'Visibile' },
            default: true,
          },
        ],
        default: def.map((item) => ({
          network: known.has(str(item.icon)) ? str(item.icon) : str(item.id),
          label: str(item.label),
          url: str(item.url),
          enabled: item.enabled !== false,
        })),
      } as FieldDefinition,
    ],
    write(values) {
      const list = values[name];
      if (!Array.isArray(list)) return {};
      const used = new Map<string, number>();
      const items = list.map(rec).flatMap((item) => {
        const network = str(item.network);
        if (!known.has(network)) return [];
        const n = (used.get(network) ?? 0) + 1;
        used.set(network, n);
        const brand = NETWORKS.find((x) => x.value === network)!;
        return [
          {
            id: n === 1 ? network : `${network}-${n}`,
            enabled: item.enabled !== false,
            source: 'icon',
            url: str(item.url),
            color: brand.color,
            background: 'transparent',
            icon: network,
            label: set(item.label) ? str(item.label) : brand.label,
          },
        ];
      });
      return { [key]: { items } };
    },
  };
}

/** Column layouts of a footer row: `grid-template-columns` widths, for their pictures. */
const LAYOUTS: Record<string, { label: Label; widths: number[]; spans?: 'first' | 'last' }> = {
  '6-equal': { label: { en: 'Equal', it: 'Uguali' }, widths: [1, 1, 1, 1, 1, 1] },
  '5-equal': { label: { en: 'Equal', it: 'Uguali' }, widths: [1, 1, 1, 1, 1] },
  '4-equal': { label: { en: 'Equal', it: 'Uguali' }, widths: [1, 1, 1, 1] },
  '4-lheavy': { label: { en: 'Wide left', it: 'Larga a sinistra' }, widths: [2, 1, 1, 1] },
  '4-rheavy': { label: { en: 'Wide right', it: 'Larga a destra' }, widths: [1, 1, 1, 2] },
  '3-equal': { label: { en: 'Equal', it: 'Uguali' }, widths: [1, 1, 1] },
  '3-lheavy': { label: { en: 'Wide left', it: 'Larga a sinistra' }, widths: [2, 1, 1] },
  '3-rheavy': { label: { en: 'Wide right', it: 'Larga a destra' }, widths: [1, 1, 2] },
  '3-cheavy': { label: { en: 'Wide center', it: 'Larga al centro' }, widths: [1, 2, 1] },
  '3-cwide': { label: { en: 'Extra-wide center', it: 'Molto larga al centro' }, widths: [1, 3, 1] },
  '3-firstrow': {
    label: { en: 'First on its own row', it: 'Prima su una riga' },
    widths: [1, 1],
    spans: 'first',
  },
  '3-lastrow': {
    label: { en: 'Last on its own row', it: 'Ultima su una riga' },
    widths: [1, 1],
    spans: 'last',
  },
  '2-equal': { label: { en: 'Equal', it: 'Uguali' }, widths: [1, 1] },
  '2-lheavy': { label: { en: 'Wide left', it: 'Larga a sinistra' }, widths: [2, 1] },
  '2-rheavy': { label: { en: 'Wide right', it: 'Larga a destra' }, widths: [1, 2] },
  full: { label: { en: 'Rows', it: 'Righe' }, widths: [1] },
};

/** The layouts offered for each number of columns (tablets and phones also get the last ones). */
const LAYOUTS_BY_COLUMNS: Record<number, string[]> = {
  6: ['6-equal', 'full'],
  5: ['5-equal', 'full'],
  4: ['4-equal', '4-lheavy', '4-rheavy', '2-equal', 'full'],
  3: ['3-equal', '3-lheavy', '3-rheavy', '3-cheavy', '3-cwide', '3-firstrow', '3-lastrow', 'full'],
  2: ['2-equal', '2-lheavy', '2-rheavy', 'full'],
};

/** A small picture of a column layout. */
function layoutPicture(layout: string, columns: number): string {
  const { widths, spans } = LAYOUTS[layout]!;
  const W = 60;
  const H = 30;
  const gap = 3;
  const rects: string[] = [];
  const row = (y: number, h: number, ws: number[]) => {
    const total = ws.reduce((a, b) => a + b, 0);
    const free = W - gap * (ws.length - 1);
    let x = 0;
    for (const w of ws) {
      const width = (free * w) / total;
      rects.push(
        `<rect x="${x.toFixed(1)}" y="${y}" width="${width.toFixed(1)}" height="${h}" rx="2"/>`,
      );
      x += width + gap;
    }
  };
  if (layout === 'full') {
    const n = Math.max(columns, 1);
    const h = (H - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) row(i * (h + gap), Number(h.toFixed(1)), [1]);
  } else if (spans) {
    const h = (H - gap) / 2;
    row(spans === 'first' ? 0 : h + gap, h, [1]);
    row(spans === 'first' ? h + gap : 0, h, widths);
  } else if (layout === '2-equal' && columns === 4) {
    const h = (H - gap) / 2;
    row(0, h, [1, 1]);
    row(h + gap, h, [1, 1]);
  } else {
    row(0, H, widths);
  }
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="#94a3b8">${rects.join('')}</svg>`,
  )}`;
}

/**
 * The columns of a footer row (`hb-footer-column`: `'1'`…`'6'`) and their
 * layout per device (`hb-footer-layout`), with one layout field per number
 * of columns, shown when that number is chosen.
 */
export function footerColumns(
  columnKey: string,
  layoutKey: string,
  place: Place,
  layoutPlace: Place = place,
): Setting {
  const columnName = camel(columnKey);
  const layoutName = (n: number) => `${camel(layoutKey)}${n}`;
  const defColumns = Number(DEFAULTS[columnKey] ?? 1);
  const defLayout = rec(DEFAULTS[layoutKey]);
  const layoutFor = (n: number): Record<string, string> =>
    n === defColumns
      ? Object.fromEntries(DEVICES.map((d) => [d, str(defLayout[d])]))
      : n === 1
        ? { desktop: 'full', tablet: 'full', mobile: 'full' }
        : { desktop: `${n}-equal`, tablet: `${n}-equal`, mobile: 'full' };
  const counts = [2, 3, 4, 5, 6];
  return {
    fields: [
      {
        ...place,
        name: columnName,
        type: 'number',
        label: { en: 'Columns', it: 'Colonne' },
        min: 1,
        max: 6,
        step: 1,
        display: 'range',
        default: defColumns,
      } as FieldDefinition,
      ...counts.map(
        (n) =>
          ({
            ...layoutPlace,
            name: layoutName(n),
            type: 'choice',
            display: 'images',
            responsive: true,
            label: { en: 'Layout', it: 'Disposizione' },
            help: {
              en: '“Rows” puts the columns one under the other: use it for tablets and phones.',
              it: '«Righe» mette le colonne una sotto l’altra: usala per tablet e telefoni.',
            },
            options: LAYOUTS_BY_COLUMNS[n]!.map((value) => ({
              value,
              label:
                value === '2-equal' && n === 4
                  ? { en: 'Two by two', it: 'Due per due' }
                  : LAYOUTS[value]!.label,
              image: layoutPicture(value, n),
            })),
            default: layoutFor(n),
            showIf: { field: columnName, equals: n },
          }) as FieldDefinition,
      ),
    ],
    write(values) {
      const out: Record<string, unknown> = {};
      const c = values[columnName];
      const n = set(c) ? Math.min(6, Math.max(1, Math.round(Number(c)))) : defColumns;
      if (set(c)) out[columnKey] = String(n);
      const chosen = n > 1 ? values[layoutName(n)] : undefined;
      if (set(chosen)) {
        const r = rec(chosen);
        const layout = layoutFor(n);
        for (const d of DEVICES) {
          if (set(r[d]) && LAYOUTS_BY_COLUMNS[n]!.includes(str(r[d]))) layout[d] = str(r[d]);
        }
        out[layoutKey] = layout;
      } else if (n !== defColumns) {
        out[layoutKey] = layoutFor(n);
      }
      return out;
    },
  };
}

/** A page option stored as is (`default` means "as in Customize"). */
export function pageSelect(
  key: string,
  label: Label,
  place: Place,
  options: { value: string; label: Label }[],
): Setting {
  const name = camel(key);
  return {
    fields: [
      { ...place, name, type: 'select', label, options, default: 'default' } as FieldDefinition,
    ],
    write(values) {
      const v = values[name];
      return set(v) && v !== 'default' ? { [key]: v } : {};
    },
  };
}

/** A page switch that hides a part: `'disabled'` when on, `''` otherwise (one or more keys). */
export function pageHide(keys: string[], label: Label, place: Place): Setting {
  const name = camel(keys[0]!);
  return {
    fields: [{ ...place, name, type: 'boolean', label, default: false } as FieldDefinition],
    write(values) {
      const v = values[name];
      if (v === undefined || v === null) return {};
      return Object.fromEntries(keys.map((k) => [k, v ? 'disabled' : '']));
    },
  };
}

/** A value as a string with its keys sorted (to compare values). */
function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(',')}]`;
  if (v && typeof v === 'object')
    return `{${Object.keys(v)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable((v as Record<string, unknown>)[k])}`)
      .join(',')}}`;
  return JSON.stringify(v) ?? 'null';
}

/**
 * Palette colors the options write with a fallback
 * (`var( --zn-global-color-primary, var(--zn-global-color-4) )`) or with
 * spaces, as the palette color a color field accepts.
 */
function paletteDefault(v: unknown): unknown {
  if (typeof v === 'string') {
    const m =
      /^var\(\s*--zn-global-color-[a-z-]+\s*,\s*var\(\s*(--zn-global-color-\d+)\s*\)\s*\)$/.exec(v);
    if (m) return `var(${m[1]})`;
    const n = /^var\(\s*(--zn-global-color-\d+)\s*\)$/.exec(v);
    return n ? `var(${n[1]})` : v;
  }
  if (Array.isArray(v)) return v.map(paletteDefault);
  if (v && typeof v === 'object')
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, paletteDefault(x)]));
  return v;
}

/**
 * A setting that writes nothing for the fields left at their default (the
 * options then keep their own defaults, exactly), and whose palette colors
 * with a fallback are shown as the palette color.
 */
export function settled(setting: Setting): Setting {
  const fields = setting.fields.map((f) =>
    'default' in f && f.default !== undefined
      ? ({ ...f, default: paletteDefault(f.default) } as FieldDefinition)
      : f,
  );
  const defaults = new Map(
    fields
      .filter((f) => 'default' in f && f.default !== undefined)
      .map((f) => [f.name, stable((f as { default?: unknown }).default)]),
  );
  return {
    fields,
    read: setting.read,
    write(values, media) {
      const own = { ...values };
      for (const [name, def] of defaults)
        if (name in own && stable(own[name]) === def) delete own[name];
      return setting.write(own, media);
    },
  };
}

/**
 * A color per device. Its default stays in the option (a color field per
 * device cannot have one yet): the devices set are written over it.
 */
export function deviceColor(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  return {
    fields: [
      {
        ...place,
        name,
        type: 'color',
        label,
        palette: PALETTE,
        alpha: true,
        responsive: true,
      } as FieldDefinition,
    ],
    write(values) {
      const v = rec(values[name]);
      const chosen = Object.fromEntries(DEVICES.filter((d) => set(v[d])).map((d) => [d, v[d]]));
      if (!Object.keys(chosen).length) return {};
      const base = rec(DEFAULTS[key]);
      return { [key]: { desktop: '', tablet: '', mobile: '', ...base, ...chosen } };
    },
  };
}

/** A choice whose "none" is stored as an empty string (choices cannot have an empty value). */
export function selectNone(
  key: string,
  label: Label,
  place: Place,
  options: { value: string; label: Label }[],
): Setting {
  const name = camel(key);
  const NONE = 'none';
  return {
    fields: [
      {
        ...place,
        name,
        type: 'select',
        label,
        options: options.map((o) => ({ ...o, value: o.value || NONE })),
        default: str(DEFAULTS[key]) || NONE,
      } as FieldDefinition,
    ],
    write(values) {
      const v = values[name];
      return set(v) ? { [key]: v === NONE ? '' : v } : {};
    },
  };
}
