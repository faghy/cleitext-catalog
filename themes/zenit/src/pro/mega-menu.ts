/**
 * Mega menu (Zenit Pro): options of the menu items. A first-level item can
 * open its children as columns across the header, the second level being
 * the column headings; any item can carry a label and keep its text
 * without a link.
 */
import type { FieldDefinition, Label, MenuItemField } from '@cleitext/shared';

const L = (en: string, it: string): Label => ({ en, it });
const mega = { field: 'megaMenu', equals: true };

export const MEGA_MENU_FIELDS: MenuItemField[] = [
  {
    levels: 'top',
    field: {
      name: 'megaMenu',
      type: 'boolean',
      label: L('Mega menu', 'Mega menu'),
      help: L(
        'Its sub-items open as columns across the header; their own sub-items are listed under them.',
        'Le sue voci si aprono in colonne su tutta l’intestazione; le loro sotto-voci sono elencate sotto.',
      ),
    } as FieldDefinition,
  },
  {
    levels: 'top',
    field: {
      name: 'megaWidth',
      type: 'select',
      label: L('Width', 'Larghezza'),
      options: [
        { value: 'content', label: L('Content', 'Contenuto') },
        { value: 'full', label: L('Full width', 'Tutta la pagina') },
        { value: 'custom', label: L('Custom', 'Personalizzata') },
      ],
      default: 'content',
      showIf: mega,
    } as FieldDefinition,
  },
  {
    levels: 'top',
    field: {
      name: 'megaCustomWidth',
      type: 'number',
      label: L('Custom width (px)', 'Larghezza personalizzata (px)'),
      min: 200,
      max: 2000,
      default: 900,
      showIf: { all: [mega, { field: 'megaWidth', equals: 'custom' }] },
    } as FieldDefinition,
  },
  {
    levels: 'top',
    field: {
      name: 'megaBackground',
      type: 'color',
      label: L('Background', 'Sfondo'),
      showIf: mega,
    } as FieldDefinition,
  },
  {
    levels: 'nested',
    field: {
      name: 'megaHideHeading',
      type: 'boolean',
      label: L('Hide as a column heading', 'Nascondi come titolo di colonna'),
      help: L('Only in a mega menu column.', 'Solo in una colonna di un mega menu.'),
    } as FieldDefinition,
  },
  {
    field: {
      name: 'menuLabel',
      type: 'text',
      label: L('Label', 'Etichetta'),
      maxLength: 30,
      help: L(
        'A short badge after the text, e.g. “New”.',
        'Un breve bollino dopo il testo, ad esempio «Nuovo».',
      ),
    } as FieldDefinition,
  },
  {
    field: {
      name: 'menuLabelColor',
      type: 'color',
      label: L('Label color', 'Colore dell’etichetta'),
    } as FieldDefinition,
  },
  {
    field: {
      name: 'menuLabelBackground',
      type: 'color',
      label: L('Label background', 'Sfondo dell’etichetta'),
    } as FieldDefinition,
  },
  {
    field: {
      name: 'menuNoLink',
      type: 'boolean',
      label: L('Text only, without a link', 'Solo testo, senza link'),
    } as FieldDefinition,
  },
];

/** An item's mega menu options (none without Zenit Pro: the theme gets no data). */
export interface MegaData {
  megaMenu?: boolean;
  megaWidth?: string;
  megaCustomWidth?: number;
  megaBackground?: string;
  megaHideHeading?: boolean;
  menuLabel?: string;
  menuLabelColor?: string;
  menuLabelBackground?: string;
  menuNoLink?: boolean;
}

export const megaOf = (item: { data?: Record<string, unknown> }): MegaData =>
  (item.data ?? {}) as MegaData;
