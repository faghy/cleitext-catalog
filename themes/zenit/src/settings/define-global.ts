/**
 * More kinds of settings for the global and content options: ordered lists
 * of elements, groups of switches stored as one object, the color palettes.
 */
import type { FieldDefinition, Label } from '@cleitext/shared';
import { DEFAULTS } from '../core/defaults.js';
import { at, rec, str } from '../core/php.js';
import { camel, PALETTE, type Place, type Setting } from './define.js';

/** A Customize section (or a panel: a section without fields that lists its children). */
export type Section = {
  id: string;
  label: { en: string; it: string };
  parent?: string;
  tabs?: true;
};

/** A choice of an ordered list or of a group of switches. */
export interface Choice {
  value: string;
  label: Label;
}

/**
 * The elements shown and their order (e.g. the parts of a post card): the
 * option is the array of the shown ones, in order. In Customize, a list of
 * every element with a switch, dragged into order.
 */
export function sortable(key: string, label: Label, place: Place, choices: Choice[]): Setting {
  const name = camel(key);
  const def = Array.isArray(DEFAULTS[key]) ? (DEFAULTS[key] as unknown[]).map(String) : [];
  const known = (v: string) => choices.some((c) => c.value === v);
  const items = [
    ...def.filter(known).map((item) => ({ item, enabled: true })),
    ...choices
      .filter((c) => !def.includes(c.value))
      .map((c) => ({ item: c.value, enabled: false })),
  ];
  return {
    fields: [
      {
        ...place,
        name,
        type: 'list',
        label,
        itemLabel: 'item',
        max: choices.length,
        fields: [
          {
            name: 'item',
            type: 'select',
            label: { en: 'Element', it: 'Elemento' },
            options: choices.map((c) => ({ value: c.value, label: c.label })),
          },
          {
            name: 'enabled',
            type: 'boolean',
            label: { en: 'Shown', it: 'Visibile' },
            default: true,
          },
        ],
        default: items,
      } as FieldDefinition,
    ],
    write(values) {
      const list = values[name];
      if (!Array.isArray(list)) return {};
      const out: string[] = [];
      for (const it of list) {
        const v = str(rec(it).item);
        if (known(v) && rec(it).enabled !== false && !out.includes(v)) out.push(v);
      }
      return { [key]: out };
    },
    read(options) {
      const list = options[key];
      if (!Array.isArray(list)) return {};
      const on = list.map(String).filter((v, i, all) => known(v) && all.indexOf(v) === i);
      return {
        [name]: [
          ...on.map((item) => ({ item, enabled: true })),
          ...choices
            .filter((c) => !on.includes(c.value))
            .map((c) => ({ item: c.value, enabled: false })),
        ],
      };
    },
  };
}

/**
 * Switches stored together as one object (`{ post: 1, page: 1 }`): one
 * boolean field per entry, named after the option and the entry.
 */
export function flags(
  key: string,
  place: Place,
  choices: Choice[],
  on: unknown = 1,
  off: unknown = 0,
): Setting {
  const base = rec(DEFAULTS[key]);
  const nameOf = (v: string) => camel(`${key}-${v}`);
  return {
    fields: choices.map(
      (c) =>
        ({
          ...place,
          name: nameOf(c.value),
          type: 'boolean',
          label: c.label,
          default: Boolean(Number(base[c.value] ?? 0)) || base[c.value] === true,
        }) as FieldDefinition,
    ),
    write(values) {
      if (!choices.some((c) => values[nameOf(c.value)] !== undefined)) return {};
      const out: Record<string, unknown> = { ...base };
      for (const c of choices) {
        const v = values[nameOf(c.value)];
        if (v === undefined) continue;
        if (v) out[c.value] = on;
        else if (off === undefined) delete out[c.value];
        else out[c.value] = off;
      }
      return { [key]: out };
    },
  };
}

/** The four ready-made palettes (the fourth is dark). */
export const PALETTES: Record<string, string[]> = {
  palette_1: [
    '#046bd2',
    '#045cb4',
    '#1e293b',
    '#334155',
    '#FFFFFF',
    '#F0F5FA',
    '#111111',
    '#D1D5DB',
    '#111111',
  ],
  palette_2: [
    '#0067FF',
    '#005EE9',
    '#0F172A',
    '#364151',
    '#FFFFFF',
    '#E7F6FF',
    '#070614',
    '#D1DAE5',
    '#222222',
  ],
  palette_3: [
    '#6528F7',
    '#5511F8',
    '#0F172A',
    '#454F5E',
    '#FFFFFF',
    '#F2F0FE',
    '#0D0614',
    '#D8D8F5',
    '#222222',
  ],
  palette_4: [
    '#0085FF',
    '#0177E3',
    '#FFFFFF',
    '#E7F6FF',
    '#212A37',
    '#0F172A',
    '#4F5B62',
    '#070614',
    '#222222',
  ],
};

const COLOR_NAMES = [
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

const swatches = (colors: string[]) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 20">${colors
      .slice(0, 5)
      .map((c, i) => `<rect x="${i * 18}" width="18" height="20" fill="${c}"/>`)
      .join('')}</svg>`,
  )}`;

/**
 * The palette: which of the four palettes is in use (the fourth is dark)
 * and its nine colors. The colors start as the chosen palette's: a palette
 * whose colors were not changed uses the ready-made ones. Written as the
 * current colors (`global-color-palette`) and as the palettes
 * (`zenit-color-palettes`).
 */
export function colorPalettes(place: Place): Setting {
  const choiceName = 'colorPaletteCurrent';
  const def = (
    (at(DEFAULTS['global-color-palette'], 'palette') ?? PALETTES.palette_1) as string[]
  ).map(String);
  const same = (a: string[], b: string[]) =>
    a.length === b.length && a.every((c, i) => c.toLowerCase() === (b[i] ?? '').toLowerCase());
  return {
    fields: [
      {
        ...place,
        name: choiceName,
        type: 'choice',
        display: 'images',
        label: { en: 'Palette', it: 'Tavolozza' },
        help: {
          en: 'The fourth palette is dark: forms, menus and borders follow it. Pick a palette first, then change its colors.',
          it: 'La quarta tavolozza è scura: moduli, menu e bordi si adeguano. Scegli prima la tavolozza, poi cambiane i colori.',
        },
        options: Object.entries(PALETTES).map(([value, colors], i) => ({
          value,
          label:
            i === 3
              ? { en: 'Dark', it: 'Scura' }
              : { en: `Palette ${i + 1}`, it: `Tavolozza ${i + 1}` },
          image: swatches(colors),
        })),
        default: 'palette_1',
      } as FieldDefinition,
      {
        ...place,
        name: PALETTE.field,
        type: 'list',
        label: { en: 'Global colors', it: 'Colori globali' },
        help: {
          en: 'Colors used across the site: every color option can pick one of these.',
          it: 'I colori usati in tutto il sito: ogni opzione di colore può sceglierne uno.',
        },
        max: 9,
        itemLabel: 'name',
        fields: [
          { name: 'name', type: 'text', label: { en: 'Name', it: 'Nome' }, maxLength: 40 },
          { name: 'color', type: 'color', label: { en: 'Color', it: 'Colore' }, alpha: true },
        ],
        default: def.map((color, i) => ({ name: COLOR_NAMES[i]?.en ?? `Color ${i + 1}`, color })),
      } as FieldDefinition,
    ],
    write(values) {
      const chosen = str(values[choiceName]);
      const list = values[PALETTE.field];
      if (!chosen && !Array.isArray(list)) return {};
      const current = PALETTES[chosen] ? chosen : 'palette_1';
      const preset = PALETTES[current]!;
      let colors = Array.isArray(list)
        ? preset.map((p, i) => str(rec(list[i]).color) || p)
        : preset;
      // Colors left as the first palette's: the chosen palette's own.
      if (current !== 'palette_1' && same(colors, def)) colors = preset;
      const palettes = Object.fromEntries(
        Object.entries(PALETTES).map(([id, c]) => [id, id === current ? colors : c]),
      );
      const out: Record<string, unknown> = { 'global-color-palette': { palette: colors } };
      if (current !== 'palette_1' || !same(colors, def)) {
        out['zenit-color-palettes'] = { currentPalette: current, palettes };
        out['zenit-color-palettes-current'] = current;
      }
      return out;
    },
  };
}
