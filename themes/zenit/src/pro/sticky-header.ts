/**
 * Sticky header (Zenit Pro): rows that stay at the top while the page
 * scrolls, with an optional smaller main row, another logo and colors.
 */
import type { Label } from '@cleitext/shared';
import {
  image,
  respColor,
  respNumber,
  select,
  toggle,
  type Place,
  type Setting,
} from '../settings/define.js';

export const STICKY = 'section-sticky-header';

const gen = (extra: Partial<Place> = {}): Place => ({ section: STICKY, tab: 'general', ...extra });
const des = (extra: Partial<Place> = {}): Place => ({ section: STICKY, tab: 'design', ...extra });

const rows: Label = { en: 'Sticky rows', it: 'Righe fisse' };
const diffLogo = { field: 'differentStickyLogo', equals: true };
const background: Label = { en: 'Background', it: 'Sfondo' };
const colors: Label = { en: 'Colors', it: 'Colori' };

export function stickySettings(): Setting[] {
  return [
    toggle(
      'header-above-stick',
      { en: 'Top row', it: 'Riga superiore' },
      gen({ group: rows }),
      1,
      0,
    ),
    toggle(
      'header-main-stick',
      { en: 'Main row', it: 'Riga principale' },
      gen({ group: rows }),
      1,
      0,
    ),
    toggle(
      'header-below-stick',
      { en: 'Bottom row', it: 'Riga inferiore' },
      gen({ group: rows }),
      1,
      0,
    ),
    toggle(
      'header-main-shrink',
      { en: 'Shrink the main row', it: 'Riduci la riga principale' },
      gen({
        help: {
          en: 'The main row gets smaller once it sticks.',
          it: 'La riga principale si rimpicciolisce quando resta fissa.',
        },
      }),
      1,
      0,
    ),
    select('sticky-header-on-devices', { en: 'Enable on', it: 'Attiva su' }, gen(), [
      { value: 'desktop', label: { en: 'Desktop', it: 'Computer' } },
      { value: 'mobile', label: { en: 'Mobile', it: 'Telefono' } },
      { value: 'both', label: { en: 'Both', it: 'Entrambi' } },
    ]),
    select('sticky-header-style', { en: 'Animation', it: 'Animazione' }, gen(), [
      { value: 'none', label: { en: 'None', it: 'Nessuna' } },
      { value: 'slide', label: { en: 'Slide', it: 'Scorrimento' } },
      { value: 'fade', label: { en: 'Fade', it: 'Dissolvenza' } },
    ]),
    toggle(
      'sticky-hide-on-scroll',
      { en: 'Hide when scrolling down', it: 'Nascondi scorrendo verso il basso' },
      gen({
        help: {
          en: 'It comes back as soon as the visitor scrolls up.',
          it: 'Ricompare appena si scorre verso l’alto.',
        },
      }),
      1,
      0,
    ),
    toggle(
      'different-sticky-logo',
      { en: 'Different logo for the sticky header', it: 'Logo diverso per l’intestazione fissa' },
      gen({ group: { en: 'Logo', it: 'Logo' } }),
      1,
      0,
    ),
    image('sticky-header-logo', { en: 'Logo', it: 'Logo' }, gen({ showIf: diffLogo })),
    respNumber('sticky-header-logo-width', { en: 'Logo width', it: 'Larghezza del logo' }, gen(), {
      min: 20,
      max: 600,
      step: 1,
      range: true,
    }),
    respColor(
      'sticky-above-header-bg-color-responsive',
      { en: 'Top row', it: 'Riga superiore' },
      des({ group: background }),
    ),
    respColor(
      'sticky-header-bg-color-responsive',
      { en: 'Main row', it: 'Riga principale' },
      des({ group: background }),
    ),
    respColor(
      'sticky-below-header-bg-color-responsive',
      { en: 'Bottom row', it: 'Riga inferiore' },
      des({ group: background }),
    ),
    respColor(
      'sticky-header-color-site-title-responsive',
      { en: 'Site title', it: 'Titolo del sito' },
      des({ group: colors }),
    ),
    respColor(
      'sticky-header-menu-color-responsive',
      { en: 'Menu links', it: 'Link del menu' },
      des({ group: colors }),
    ),
    respColor(
      'sticky-header-menu-h-color-responsive',
      { en: 'Menu links on hover', it: 'Link del menu al passaggio' },
      des({ group: colors }),
    ),
  ];
}
