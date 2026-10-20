/** Global → Typography and Global → Colors. */
import { color, number, toggle, typography, type Setting } from './define.js';
import { colorPalettes, type Section } from './define-global.js';

const T = 'section-typography';
const C = 'section-colors-background';

export const TYPOGRAPHY_SECTIONS: Section[] = [
  { id: T, label: { en: 'Typography', it: 'Tipografia' }, parent: 'panel-global' },
  { id: C, label: { en: 'Colors', it: 'Colori' }, parent: 'panel-global' },
];

const BASE = { en: 'Base typography', it: 'Tipografia di base' };
const HEADINGS = { en: 'Headings', it: 'Titoli' };

export function typographySettings(): Setting[] {
  return [
    typography(
      'bodyFont',
      {
        family: 'body-font-family',
        weight: 'body-font-weight',
        size: 'font-size-body',
        extras: 'body-font-extras',
      },
      { en: 'Body font', it: 'Carattere del testo' },
      { section: T, group: BASE },
    ),
    typography(
      'headingsFont',
      {
        family: 'headings-font-family',
        weight: 'headings-font-weight',
        extras: 'headings-font-extras',
      },
      { en: 'Headings font', it: 'Carattere dei titoli' },
      {
        section: T,
        group: BASE,
        help: {
          en: 'Used by every heading that does not set its own font below.',
          it: 'Vale per tutti i titoli che non hanno un carattere proprio qui sotto.',
        },
      },
    ),
    number(
      'para-margin-bottom',
      { en: 'Space below paragraphs', it: 'Spazio sotto i paragrafi' },
      { section: T, group: BASE },
      { min: 0.5, max: 5, step: 0.01, unit: 'em', range: true },
    ),
    toggle(
      'underline-content-links',
      { en: 'Underline links in content', it: 'Sottolinea i link nei contenuti' },
      { section: T, group: BASE },
    ),
    ...[1, 2, 3, 4, 5, 6].map((n) =>
      typography(
        `h${n}Font`,
        {
          family: `font-family-h${n}`,
          weight: `font-weight-h${n}`,
          size: `font-size-h${n}`,
          extras: `font-extras-h${n}`,
        },
        { en: `H${n} font`, it: `Carattere H${n}` },
        { section: T, group: HEADINGS },
      ),
    ),

    colorPalettes({ section: C, group: { en: 'Global palette', it: 'Tavolozza globale' } }),
    color(
      'theme-color',
      { en: 'Accent', it: 'Colore principale' },
      {
        section: C,
        group: { en: 'Theme color', it: 'Colore del tema' },
        help: {
          en: 'Buttons, highlights and other details.',
          it: 'Pulsanti, evidenziazioni e altri dettagli.',
        },
      },
    ),
    color(
      'link-color',
      { en: 'Links', it: 'Link' },
      { section: C, group: { en: 'Links', it: 'Link' } },
    ),
    color(
      'link-h-color',
      { en: 'Links on hover', it: 'Link al passaggio del mouse' },
      { section: C, group: { en: 'Links', it: 'Link' } },
    ),
    color(
      'heading-base-color',
      { en: 'Headings (H1-H6)', it: 'Titoli (H1-H6)' },
      { section: C, group: { en: 'Text', it: 'Testo' } },
    ),
    color(
      'text-color',
      { en: 'Body text', it: 'Testo' },
      { section: C, group: { en: 'Text', it: 'Testo' } },
    ),
    color(
      'border-color',
      { en: 'Borders', it: 'Bordi' },
      { section: C, group: { en: 'Text', it: 'Testo' } },
    ),
  ];
}
