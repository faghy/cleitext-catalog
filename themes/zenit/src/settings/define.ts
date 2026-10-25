/**
 * Settings of Appearance → Customize and the options they write. Each
 * setting has one or more fields (shown in Customize, with the defaults of
 * a new site) and turns their values into options (see core/options.ts).
 * A field's name is its option's key in camelCase.
 */
import type { FieldCondition, FieldDefinition, Label } from '@cleitext/shared';
import { googleFonts } from './font-source.js';
import { DEFAULTS } from '../core/defaults.js';
import { at, rec, str } from '../core/php.js';

/** The address of a media library item, by id. */
export type MediaUrl = (id: string) => string | undefined;

export interface Setting {
  fields: FieldDefinition[];
  /** The options of the values set (none: the defaults stay). */
  write(values: Record<string, unknown>, media: MediaUrl): Record<string, unknown>;
  /**
   * The field values of some options (an imported site's): only for the
   * options present. Settings without it keep the options as imported.
   */
  read?(options: Record<string, unknown>): Record<string, unknown>;
}

/** Where a field is shown. */
export interface Place {
  section: string;
  tab?: 'general' | 'design';
  group?: Label;
  help?: Label;
  showIf?: FieldCondition;
}

export const PALETTE = { field: 'globalColorPalette', prefix: '--zn-global-color-' } as const;

/** `hb-header-height` → `hbHeaderHeight`. */
export function camel(key: string): string {
  return key
    .replace(/[-_]+([a-zA-Z0-9])/g, (_, c: string) => c.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');
}

const DEVICES = ['desktop', 'tablet', 'mobile'] as const;
const set = (v: unknown) => v !== undefined && v !== null && v !== '';

/** A setting writing one option from one field, converting the value both ways. */
function single(
  key: string,
  field: Record<string, unknown> & { type: FieldDefinition['type']; name?: string },
  place: Place,
  toOption: (v: unknown, media: MediaUrl) => unknown,
  fromOption: (v: unknown) => unknown,
): Setting {
  const name = field.name ?? camel(key);
  const def = fromOption(DEFAULTS[key]);
  return {
    fields: [
      {
        ...place,
        ...field,
        name,
        ...(def !== undefined ? { default: def } : {}),
      } as FieldDefinition,
    ],
    write(values, media) {
      const v = values[name];
      return set(v) ? { [key]: toOption(v, media) } : {};
    },
    read(options) {
      if (!(key in options)) return {};
      const v = fromOption(options[key]);
      return v === undefined ? {} : { [name]: v };
    },
  };
}

const same = (v: unknown) => v;
const defined = (v: unknown) => (set(v) ? v : undefined);

export function color(
  key: string,
  label: Label,
  place: Place,
  extra: { alpha?: boolean } = {},
): Setting {
  return single(
    key,
    { type: 'color', label, palette: PALETTE, alpha: extra.alpha ?? true },
    place,
    same,
    defined,
  );
}

/** A color per device: `{ desktop, tablet, mobile }` on both sides. */
export function respColor(key: string, label: Label, place: Place): Setting {
  return single(
    key,
    { type: 'color', label, palette: PALETTE, alpha: true, responsive: true },
    place,
    (v) => ({ desktop: '', tablet: '', mobile: '', ...clean(v) }),
    (v) => nonEmpty(pick(v, DEVICES)),
  );
}

export function text(
  key: string,
  label: Label,
  place: Place,
  extra: { multiline?: boolean; maxLength?: number } = {},
): Setting {
  return single(key, { type: 'text', label, ...extra }, place, same, defined);
}

export function number(
  key: string,
  label: Label,
  place: Place,
  extra: { min?: number; max?: number; step?: number; unit?: string; range?: boolean } = {},
): Setting {
  const { range, ...rest } = extra;
  return single(
    key,
    { type: 'number', label, ...rest, ...(range ? { display: 'range' as const } : {}) },
    place,
    same,
    (v) => (set(v) && !Number.isNaN(Number(v)) ? Number(v) : undefined),
  );
}

/** A number per device, with units: `{ desktop, …, desktopUnit }` ↔ `{ desktop, …, 'desktop-unit' }`. */
export function respNumber(
  key: string,
  label: Label,
  place: Place,
  extra: { min?: number; max?: number; step?: number; units?: string[]; range?: boolean } = {},
): Setting {
  const { range, ...rest } = extra;
  return single(
    key,
    {
      type: 'number',
      label,
      responsive: true,
      ...rest,
      ...(range ? { display: 'range' as const } : {}),
    },
    place,
    (v) => {
      const r = rec(v);
      const out: Record<string, unknown> = { ...rec(DEFAULTS[key]) };
      for (const d of DEVICES) {
        out[d] = set(r[d]) ? r[d] : (rec(DEFAULTS[key])[d] ?? '');
        if (set(r[`${d}Unit`])) out[`${d}-unit`] = r[`${d}Unit`];
      }
      return out;
    },
    (v) => {
      const r = rec(v);
      const out: Record<string, unknown> = {};
      for (const d of DEVICES) {
        if (set(r[d]) && !Number.isNaN(Number(r[d]))) out[d] = Number(r[d]);
        if (set(r[`${d}-unit`]) && extra.units?.includes(str(r[`${d}-unit`])))
          out[`${d}Unit`] = r[`${d}-unit`];
      }
      return nonEmpty(out);
    },
  );
}

export function select(
  key: string,
  label: Label,
  place: Place,
  options: { value: string; label: Label; image?: string }[],
  extra: { display?: 'buttons' | 'images' | 'select'; responsive?: boolean } = {},
): Setting {
  const display = extra.display ?? 'buttons';
  const field =
    display === 'select'
      ? {
          type: 'select' as const,
          label,
          options: options.map(({ value, label: l }) => ({ value, label: l })),
        }
      : { type: 'choice' as const, label, options, display };
  if (extra.responsive) {
    return single(
      key,
      { ...field, responsive: true },
      place,
      (v) => ({ ...rec(DEFAULTS[key]), ...clean(v) }),
      (v) => nonEmpty(pick(v, DEVICES)),
    );
  }
  return single(key, field, place, same, (v) => (set(v) ? str(v) : undefined));
}

/**
 * A switch. Options store it as `true`/`false`, `1`/`0` or `'1'`/`''`:
 * `on` and `off` are what this one writes.
 */
export function toggle(
  key: string,
  label: Label,
  place: Place,
  on: unknown = true,
  off: unknown = false,
): Setting {
  return single(
    key,
    { type: 'boolean', label },
    place,
    (v) => (v ? on : off),
    (v) => (v === undefined ? undefined : v === true || v === 1 || v === '1' || v === 'yes'),
  );
}

/** Shown on desktop, tablet and phones: `{ desktop: 1, … }` ↔ a switch per device. */
export function visibility(section: string, place: Place): Setting {
  const key = `${section}-visibility-responsive`;
  return single(
    key,
    {
      type: 'boolean',
      label: { en: 'Visibility', it: 'Visibilità' },
      responsive: true,
      display: 'devices',
    },
    place,
    (v) => {
      const r = rec(v);
      return Object.fromEntries(DEVICES.map((d) => [d, r[d] === false ? 0 : 1]));
    },
    (v) => {
      const r = rec(v);
      return Object.fromEntries(
        DEVICES.map((d) => [d, r[d] === undefined ? true : Boolean(Number(r[d]))]),
      );
    },
  );
}

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

/** Four sides and a unit, per device or not (`ast-border`: no unit). */
export function spacing(
  key: string,
  label: Label,
  place: Place,
  extra: {
    responsive?: boolean;
    units?: string[];
    corners?: boolean;
    sides?: (typeof SIDES)[number][];
    unitless?: boolean;
  } = {},
): Setting {
  const units = extra.unitless ? [''] : (extra.units ?? ['px', 'em', '%']);
  const sidesOf = (v: unknown) =>
    Object.fromEntries(
      SIDES.map((s) => [s, set(at(v, s)) ? Number(at(v, s)) : null]).filter(
        ([, n]) => n !== null && !Number.isNaN(n),
      ),
    );
  const field = {
    type: 'spacing' as const,
    label,
    units,
    ...(extra.corners ? { corners: true } : {}),
    ...(extra.sides ? { sides: extra.sides } : {}),
    ...(extra.responsive ? { responsive: true } : {}),
  };
  if (!extra.responsive) {
    return single(
      key,
      field,
      place,
      (v) => Object.fromEntries(SIDES.map((s) => [s, set(at(v, s)) ? at(v, s) : ''])),
      (v) => nonEmpty(sidesOf(v)),
    );
  }
  return single(
    key,
    field,
    place,
    (v) => {
      const out: Record<string, unknown> = { ...rec(DEFAULTS[key]) };
      for (const d of DEVICES) {
        const dv = at(v, d);
        out[d] = Object.fromEntries(SIDES.map((s) => [s, set(at(dv, s)) ? at(dv, s) : '']));
        if (set(at(dv, 'unit'))) out[`${d}-unit`] = at(dv, 'unit');
      }
      return out;
    },
    (v) => {
      const out: Record<string, unknown> = {};
      for (const d of DEVICES) {
        const sides = sidesOf(at(v, d));
        const unit = str(at(v, `${d}-unit`));
        if (Object.keys(sides).length)
          out[d] = { ...sides, ...(unit && unit !== units[0] ? { unit } : {}) };
      }
      return nonEmpty(out);
    },
  );
}

/** A background: ours `{ type, color, gradient, image, … }` ↔ the options' background object. */
export function background(
  key: string,
  label: Label,
  place: Place,
  extra: { responsive?: boolean } = {},
): Setting {
  const toObj = (v: unknown, media: MediaUrl, base: unknown) => {
    const b = rec(v);
    const out: Record<string, unknown> = { ...rec(base) };
    const type = str(b.type);
    if (type === 'gradient') {
      out['background-type'] = 'gradient';
      out['background-color'] = str(b.gradient);
    } else if (type === 'image' && set(b.image)) {
      out['background-type'] = 'image';
      out['background-image'] = media(str(b.image)) ?? '';
      out['background-media'] = b.image;
      if (set(b.color)) out['background-color'] = b.color;
    } else {
      out['background-type'] = set(b.color) ? 'color' : '';
      out['background-color'] = set(b.color) ? b.color : '';
      out['background-image'] = '';
    }
    for (const [ours, theirs] of [
      ['position', 'background-position'],
      ['size', 'background-size'],
      ['repeat', 'background-repeat'],
      ['attachment', 'background-attachment'],
    ] as const) {
      if (set(b[ours])) out[theirs] = b[ours];
    }
    if (set(b.overlay)) {
      out['overlay-type'] = 'classic';
      out['overlay-color'] = b.overlay;
    }
    return out;
  };
  const fromObj = (v: unknown) => {
    const b = rec(v);
    const type = str(b['background-type']);
    if (type === 'gradient') return { type: 'gradient', gradient: str(b['background-color']) };
    if (type === 'image' && set(b['background-media']))
      return { type: 'image', image: b['background-media'] };
    return set(b['background-color'])
      ? { type: 'color', color: str(b['background-color']) }
      : undefined;
  };
  const field = {
    type: 'background' as const,
    label,
    palette: PALETTE,
    ...(extra.responsive ? { responsive: true } : {}),
  };
  if (!extra.responsive) {
    return single(key, field, place, (v, media) => toObj(v, media, DEFAULTS[key]), fromObj);
  }
  return single(
    key,
    field,
    place,
    (v, media) => {
      const base = rec(DEFAULTS[key]);
      return Object.fromEntries(
        DEVICES.map((d) => [d, set(at(v, d)) ? toObj(at(v, d), media, base[d]) : (base[d] ?? {})]),
      );
    },
    (v) =>
      nonEmpty(
        Object.fromEntries(
          DEVICES.map((d) => [d, fromObj(at(v, d))]).filter(([, b]) => b !== undefined),
        ),
      ),
  );
}

/** Option keys of a font: family, weight, size (per device) and extras (line height…). */
export interface FontKeys {
  family?: string;
  weight?: string;
  size?: string;
  extras?: string;
}

/** A font: one Customize field, up to four options. */
export function typography(name: string, keys: FontKeys, label: Label, place: Place): Setting {
  const extras = rec(keys.extras ? DEFAULTS[keys.extras] : {});
  const size = rec(keys.size ? DEFAULTS[keys.size] : {});
  /**
   * The field's value from options (an imported site's, or the defaults). An
   * imported size without a value for a device (`''`, or missing) is `null`:
   * the device uses the larger one's size, as the original theme does,
   * instead of Zenit's own smaller default.
   */
  const valueOf = (get: (key: string) => unknown, imported = false) => {
    const out: Record<string, unknown> = {};
    const x = rec(keys.extras ? get(keys.extras) : {});
    const z = rec(keys.size ? get(keys.size) : {});
    if (keys.family && set(get(keys.family)))
      out.family = str(get(keys.family)).replace(/^'([^']+)'.*$/, '$1');
    if (keys.weight && set(get(keys.weight))) out.weight = str(get(keys.weight));
    const sz: Record<string, unknown> = {};
    for (const d of DEVICES) {
      if (set(z[d]) && !Number.isNaN(Number(z[d]))) sz[d] = Number(z[d]);
      else if (imported && d !== 'desktop') sz[d] = null;
      if (set(z[`${d}-unit`]) && z[`${d}-unit`] !== 'px') sz[`${d}Unit`] = z[`${d}-unit`];
    }
    if (Object.keys(sz).length) out.size = sz;
    if (set(x['line-height']) && !Number.isNaN(Number(x['line-height'])))
      out.lineHeight = Number(x['line-height']);
    if (set(x['line-height-unit'])) out.lineHeightUnit = str(x['line-height-unit']);
    if (set(x['letter-spacing']) && !Number.isNaN(Number(x['letter-spacing'])))
      out.letterSpacing = Number(x['letter-spacing']);
    if (set(x['text-transform'])) out.transform = x['text-transform'];
    if (set(x['text-decoration'])) out.decoration = x['text-decoration'];
    return out;
  };
  const def = valueOf((k) => DEFAULTS[k]);
  const own = [keys.family, keys.weight, keys.size, keys.extras].filter(Boolean) as string[];
  return {
    read(options) {
      if (!own.some((k) => k in options)) return {};
      return {
        [name]: valueOf(
          (k) => (k in options ? options[k] : DEFAULTS[k]),
          keys.size !== undefined && keys.size in options,
        ),
      };
    },
    fields: [
      {
        ...place,
        name,
        type: 'typography',
        label,
        ...(Object.keys(def).length ? { default: def } : {}),
      } as FieldDefinition,
    ],
    write(values) {
      const t = rec(values[name]);
      if (!Object.keys(t).length) return {};
      const out: Record<string, unknown> = {};
      if (keys.family && set(t.family)) out[keys.family] = familyValue(str(t.family));
      if (keys.weight && set(t.weight)) out[keys.weight] = t.weight;
      if (keys.size && t.size) {
        const s = rec(t.size);
        const o: Record<string, unknown> = { ...size };
        for (const d of DEVICES) {
          if (d in s) o[d] = set(s[d]) ? s[d] : '';
          if (set(s[`${d}Unit`])) o[`${d}-unit`] = s[`${d}Unit`];
        }
        out[keys.size] = o;
      }
      if (keys.extras) {
        const e: Record<string, unknown> = { ...extras };
        if ('lineHeight' in t) e['line-height'] = set(t.lineHeight) ? t.lineHeight : '';
        if (set(t.lineHeightUnit)) e['line-height-unit'] = t.lineHeightUnit;
        if ('letterSpacing' in t) e['letter-spacing'] = set(t.letterSpacing) ? t.letterSpacing : '';
        if (set(t.letterSpacingUnit)) e['letter-spacing-unit'] = t.letterSpacingUnit;
        if ('transform' in t) e['text-transform'] = t.transform ?? '';
        if ('decoration' in t) e['text-decoration'] = t.decoration ?? '';
        out[keys.extras] = e;
      }
      return out;
    },
  };
}

/** How a family name is stored: Google fonts quoted, with their category as fallback. */
function familyValue(family: string): string {
  if (family === 'inherit' || family === '') return 'inherit';
  const google = googleFonts().get(family);
  return google ? `'${family}', ${google.category}` : family;
}

/** A link: `{ url, new_tab, link_rel }`, as two fields. */
export function link(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  const def = rec(DEFAULTS[key]);
  return {
    fields: [
      {
        ...place,
        name: `${name}Url`,
        type: 'url',
        label,
        default: str(def.url),
      } as FieldDefinition,
      {
        ...place,
        name: `${name}NewTab`,
        type: 'boolean',
        label: { en: 'Open in a new tab', it: 'Apri in una nuova scheda' },
        default: Boolean(def.new_tab),
      } as FieldDefinition,
    ],
    read(options) {
      if (!(key in options)) return {};
      const l = rec(options[key]);
      return { [`${name}Url`]: str(l.url), [`${name}NewTab`]: Boolean(l.new_tab) };
    },
    write(values) {
      const url = values[`${name}Url`];
      const tab = values[`${name}NewTab`];
      if (!set(url) && !set(tab)) return {};
      return {
        [key]: {
          ...def,
          ...(set(url) ? { url } : {}),
          ...(set(tab) ? { new_tab: Boolean(tab) } : {}),
        },
      };
    },
  };
}

/** Any other field, written as is. */
export function raw(
  key: string,
  field: Record<string, unknown> & { type: FieldDefinition['type'] },
  place: Place,
  name = camel(key),
): Setting {
  return {
    fields: [{ ...place, ...field, name } as FieldDefinition],
    write(values) {
      return set(values[name]) ? { [key]: values[name] } : {};
    },
  };
}

function pick(v: unknown, keys: readonly string[]): Record<string, unknown> {
  const r = rec(v);
  return Object.fromEntries(keys.filter((k) => set(r[k])).map((k) => [k, r[k]]));
}

function clean(v: unknown): Record<string, unknown> {
  return Object.fromEntries(Object.entries(rec(v)).filter(([, x]) => set(x)));
}

function nonEmpty<T extends Record<string, unknown>>(v: T): T | undefined {
  return Object.keys(v).length ? v : undefined;
}

/** The fields of some settings, and the options of their values. */
const enLabel = (l: unknown) => (typeof l === 'string' ? l : String(rec(l).en ?? ''));
const sameGroup = (a: FieldDefinition, b: FieldDefinition) =>
  JSON.stringify(a.group) === JSON.stringify(b.group);

/** A hover color goes on the line of the normal one, as two swatches. */
function pairColors(fields: FieldDefinition[]): FieldDefinition[] {
  return fields.map((f, i) => {
    const before = fields[i - 1];
    return f.type === 'color' &&
      before?.type === 'color' &&
      !before.inline &&
      before.section === f.section &&
      before.tab === f.tab &&
      sameGroup(before, f) &&
      /(^|\s)hover$/i.test(enLabel(f.label))
      ? { ...f, inline: true }
      : f;
  });
}

export function collect(settings: Setting[]) {
  return {
    fields: pairColors(settings.flatMap((s) => s.fields)),
    /** The field values of an imported site's options (settings that can read them). */
    fromOptions(options: Record<string, unknown>) {
      const out: Record<string, unknown> = {};
      // Fields of settings without their own reading: an option of the same name, as it is
      // (values the field does not accept are dropped when they are saved).
      const byName = new Map(Object.keys(options).map((k) => [camel(k), k]));
      for (const setting of settings) {
        if (setting.read) {
          Object.assign(out, setting.read(options));
          continue;
        }
        for (const field of setting.fields) {
          const key = byName.get(field.name);
          if (key !== undefined) out[field.name] = options[key];
        }
      }
      return out;
    },
    toOptions(values: Record<string, unknown>, media: MediaUrl) {
      return Object.assign({}, ...settings.map((s) => s.write(values, media))) as Record<
        string,
        unknown
      >;
    },
  };
}

/** An element of a builder: its name in Customize and in the layout options. */
export interface BuilderItem {
  id: string;
  label: Label;
  section?: string;
  devices?: ('desktop' | 'mobile')[];
}

const itemName = (id: string) => camel(id === 'woo-cart' ? 'cart' : id);

/**
 * A drag-and-drop builder (header or footer): a zones field written to one
 * layout option per device (`{ row: { row_zone: [ids] } }`).
 */
export function builder(
  name: string,
  label: Label,
  place: Place,
  spec: {
    options: Partial<Record<'desktop' | 'mobile', string>>;
    rows: {
      name: string;
      label: Label;
      section?: string;
      devices?: ('desktop' | 'mobile')[];
      zones: {
        name: string;
        label?: Label;
        whenUsed?: string;
        devices?: ('desktop' | 'mobile')[];
      }[];
      columnsField?: string;
      stacked?: boolean;
    }[];
    items: BuilderItem[];
    /** Items another plugin adds to the field (Zenit Pro), known to the layout. */
    extraItems?: BuilderItem[];
  },
): Setting {
  const known = [...spec.items, ...(spec.extraItems ?? [])];
  const byName = new Map(known.map((i) => [itemName(i.id), i.id]));
  const devices = Object.keys(spec.options) as ('desktop' | 'mobile')[];
  const onDevice = (x: { devices?: ('desktop' | 'mobile')[] }, d: 'desktop' | 'mobile') =>
    !x.devices || x.devices.includes(d);
  const toLayout = (rows: unknown, base: unknown, d: 'desktop' | 'mobile') => {
    const out: Record<string, Record<string, unknown>> = {};
    const b = rec(base);
    for (const [row, zones] of Object.entries(b)) out[row] = { ...rec(zones) };
    for (const row of spec.rows) {
      if (!onDevice(row, d)) continue;
      const zones: Record<string, unknown> = { ...rec(b[row.name]) };
      for (const z of row.zones) {
        if (!onDevice(z, d)) continue;
        const key = `${row.name}_${z.name}`;
        const list = at(rows, row.name, z.name);
        const ids = Array.isArray(list)
          ? list.map((n) => byName.get(String(n))).filter((id): id is string => Boolean(id))
          : [];
        if (ids.length || key in zones) zones[key] = ids;
      }
      out[row.name] = zones;
    }
    return out;
  };
  const fromLayout = (layout: unknown, d: 'desktop' | 'mobile') => {
    const out: Record<string, Record<string, string[]>> = {};
    for (const row of spec.rows) {
      if (!onDevice(row, d)) continue;
      const zones: Record<string, string[]> = {};
      for (const z of row.zones) {
        if (!onDevice(z, d)) continue;
        const list = at(layout, row.name, `${row.name}_${z.name}`);
        if (Array.isArray(list) && list.length) {
          zones[z.name] = list
            .map(String)
            .filter((id) => known.some((i) => i.id === id))
            .map(itemName);
        }
      }
      if (Object.keys(zones).length) out[row.name] = zones;
    }
    return out;
  };
  const def = Object.fromEntries(
    devices.map((d) => [d, fromLayout(DEFAULTS[spec.options[d]!], d)]),
  );
  return {
    read(options) {
      if (!devices.some((d) => spec.options[d]! in options)) return {};
      return {
        [name]: Object.fromEntries(
          devices.map((d) => [
            d,
            fromLayout(options[spec.options[d]!] ?? DEFAULTS[spec.options[d]!], d),
          ]),
        ),
      };
    },
    fields: [
      {
        ...place,
        name,
        type: 'zones',
        label,
        devices,
        rows: spec.rows,
        items: spec.items.map((i) => ({
          name: itemName(i.id),
          label: i.label,
          ...(i.section ? { section: i.section } : {}),
          ...(i.devices ? { devices: i.devices } : {}),
        })),
        default: def,
      } as FieldDefinition,
    ],
    write(values) {
      const v = rec(values[name]);
      const out: Record<string, unknown> = {};
      for (const d of devices)
        if (v[d]) out[spec.options[d]!] = toLayout(v[d], DEFAULTS[spec.options[d]!], d);
      return out;
    },
  };
}

/** The palette: nine named colors (a list field), written as the palette option. */
export function palette(place: Place): Setting {
  const NAMES = [
    { en: 'Brand', it: 'Marchio' },
    { en: 'Alternate brand', it: 'Marchio alternativo' },
    { en: 'Headings', it: 'Titoli' },
    { en: 'Text', it: 'Testo' },
    { en: 'Primary background', it: 'Sfondo principale' },
    { en: 'Secondary background', it: 'Sfondo secondario' },
    { en: 'Alternate background', it: 'Sfondo alternativo' },
    { en: 'Subtle background', it: 'Sfondo tenue' },
    { en: 'Other', it: 'Altro' },
  ];
  const colors = (at(DEFAULTS['global-color-palette'], 'palette') ?? []) as string[];
  return {
    fields: [
      {
        ...place,
        name: PALETTE.field,
        type: 'list',
        label: { en: 'Global colors', it: 'Colori globali' },
        max: 9,
        itemLabel: 'name',
        fields: [
          { name: 'name', type: 'text', label: { en: 'Name', it: 'Nome' }, maxLength: 40 },
          { name: 'color', type: 'color', label: { en: 'Color', it: 'Colore' }, alpha: true },
        ],
        default: colors.map((color, i) => ({ name: NAMES[i]?.en ?? `Color ${i + 1}`, color })),
      } as FieldDefinition,
    ],
    read(options) {
      const list = at(options['global-color-palette'], 'palette');
      if (!Array.isArray(list)) return {};
      return {
        [PALETTE.field]: list.map((color, n) => ({
          name: NAMES[n]?.en ?? `Color ${n + 1}`,
          color: str(color),
        })),
      };
    },
    write(values) {
      const list = values[PALETTE.field];
      if (!Array.isArray(list)) return {};
      const palette = colors.map((def, i) => str(rec(list[i]).color) || def);
      return { 'global-color-palette': { palette } };
    },
  };
}

/** A media library image written as its address (and its id under `<key>-id`). */
export function image(key: string, label: Label, place: Place): Setting {
  const name = camel(key);
  return {
    fields: [{ ...place, name, type: 'media', label } as FieldDefinition],
    write(values, media) {
      const id = values[name];
      if (!set(id)) return {};
      return { [key]: media(str(id)) ?? '', [`${key}-id`]: id };
    },
  };
}
