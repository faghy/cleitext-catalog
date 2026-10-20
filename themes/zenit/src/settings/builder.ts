/** The header and footer builders, their rows and their elements' settings. */
import { builder, type BuilderItem, type Setting } from './define.js';
import { settled, type Section } from './define-builder.js';
import { H, headerSettings } from './builder-header.js';
import { F, footerSettings } from './builder-footer.js';

export const BUILDER_SECTIONS: Section[] = [
  { id: H, label: { en: 'Header builder', it: 'Costruttore intestazione' }, tabs: true },
  {
    id: 'section-above-header-builder',
    label: { en: 'Top row', it: 'Riga superiore' },
    parent: H,
    tabs: true,
  },
  {
    id: 'section-primary-header-builder',
    label: { en: 'Main row', it: 'Riga principale' },
    parent: H,
    tabs: true,
  },
  {
    id: 'section-below-header-builder',
    label: { en: 'Bottom row', it: 'Riga inferiore' },
    parent: H,
    tabs: true,
  },
  {
    id: 'section-popup-header-builder',
    label: { en: 'Off-canvas', it: 'Pannello laterale' },
    parent: H,
    tabs: true,
  },
  {
    id: 'title_tagline',
    label: { en: 'Site title & logo', it: 'Titolo e logo' },
    parent: H,
    tabs: true,
  },
  {
    id: 'section-hb-menu-1',
    label: { en: 'Primary menu', it: 'Menu principale' },
    parent: H,
    tabs: true,
  },
  {
    id: 'section-hb-menu-2',
    label: { en: 'Secondary menu', it: 'Menu secondario' },
    parent: H,
    tabs: true,
  },
  { id: 'section-hb-button-1', label: { en: 'Button', it: 'Pulsante' }, parent: H, tabs: true },
  { id: 'section-hb-html-1', label: { en: 'HTML 1', it: 'HTML 1' }, parent: H, tabs: true },
  { id: 'section-hb-html-2', label: { en: 'HTML 2', it: 'HTML 2' }, parent: H, tabs: true },
  { id: 'section-header-search', label: { en: 'Search', it: 'Ricerca' }, parent: H, tabs: true },
  { id: 'section-hb-social-icons-1', label: { en: 'Social', it: 'Social' }, parent: H, tabs: true },
  { id: 'section-header-account', label: { en: 'Account', it: 'Account' }, parent: H, tabs: true },
  { id: 'sidebar-widgets-header-widget-1', label: { en: 'Widget 1', it: 'Widget 1' }, parent: H },
  { id: 'sidebar-widgets-header-widget-2', label: { en: 'Widget 2', it: 'Widget 2' }, parent: H },
  {
    id: 'section-header-mobile-trigger',
    label: { en: 'Toggle button', it: 'Pulsante menu' },
    parent: H,
    tabs: true,
  },
  {
    id: 'section-header-mobile-menu',
    label: { en: 'Off-canvas menu', it: 'Menu del pannello' },
    parent: H,
    tabs: true,
  },
  { id: F, label: { en: 'Footer builder', it: 'Costruttore piè di pagina' }, tabs: true },
  {
    id: 'section-above-footer-builder',
    label: { en: 'Top row', it: 'Riga superiore' },
    parent: F,
    tabs: true,
  },
  {
    id: 'section-primary-footer-builder',
    label: { en: 'Main row', it: 'Riga principale' },
    parent: F,
    tabs: true,
  },
  {
    id: 'section-below-footer-builder',
    label: { en: 'Bottom row', it: 'Riga inferiore' },
    parent: F,
    tabs: true,
  },
  {
    id: 'section-footer-copyright',
    label: { en: 'Copyright', it: 'Copyright' },
    parent: F,
    tabs: true,
  },
  {
    id: 'section-footer-menu',
    label: { en: 'Footer menu', it: 'Menu del piè di pagina' },
    parent: F,
    tabs: true,
  },
  { id: 'section-fb-html-1', label: { en: 'HTML 1', it: 'HTML 1' }, parent: F, tabs: true },
  { id: 'section-fb-html-2', label: { en: 'HTML 2', it: 'HTML 2' }, parent: F, tabs: true },
  { id: 'section-fb-social-icons-1', label: { en: 'Social', it: 'Social' }, parent: F, tabs: true },
  ...[1, 2, 3, 4].map((n) => ({
    id: `sidebar-widgets-footer-widget-${n}`,
    label: { en: `Widget ${n}`, it: `Widget ${n}` },
    parent: F,
  })),
];

const HEADER_ITEMS: BuilderItem[] = [
  { id: 'logo', label: { en: 'Site title & logo', it: 'Titolo e logo' }, section: 'title_tagline' },
  {
    id: 'menu-1',
    label: { en: 'Primary menu', it: 'Menu principale' },
    section: 'section-hb-menu-1',
  },
  {
    id: 'menu-2',
    label: { en: 'Secondary menu', it: 'Menu secondario' },
    section: 'section-hb-menu-2',
  },
  { id: 'button-1', label: { en: 'Button', it: 'Pulsante' }, section: 'section-hb-button-1' },
  { id: 'html-1', label: 'HTML 1', section: 'section-hb-html-1' },
  { id: 'html-2', label: 'HTML 2', section: 'section-hb-html-2' },
  { id: 'search', label: { en: 'Search', it: 'Ricerca' }, section: 'section-header-search' },
  { id: 'social-icons-1', label: 'Social', section: 'section-hb-social-icons-1' },
  { id: 'account', label: 'Account', section: 'section-header-account' },
  { id: 'widget-1', label: 'Widget 1', section: 'sidebar-widgets-header-widget-1' },
  { id: 'widget-2', label: 'Widget 2', section: 'sidebar-widgets-header-widget-2' },
  {
    id: 'mobile-trigger',
    label: { en: 'Toggle button', it: 'Pulsante menu' },
    section: 'section-header-mobile-trigger',
    devices: ['mobile'],
  },
  {
    id: 'mobile-menu',
    label: { en: 'Off-canvas menu', it: 'Menu del pannello' },
    section: 'section-header-mobile-menu',
    devices: ['mobile'],
  },
];

const FOOTER_ITEMS: BuilderItem[] = [
  { id: 'copyright', label: 'Copyright', section: 'section-footer-copyright' },
  { id: 'menu', label: { en: 'Footer menu', it: 'Menu' }, section: 'section-footer-menu' },
  { id: 'html-1', label: 'HTML 1', section: 'section-fb-html-1' },
  { id: 'html-2', label: 'HTML 2', section: 'section-fb-html-2' },
  { id: 'social-icons-1', label: 'Social', section: 'section-fb-social-icons-1' },
  ...[1, 2, 3, 4].map((n) => ({
    id: `widget-${n}`,
    label: `Widget ${n}`,
    section: `sidebar-widgets-footer-widget-${n}`,
  })),
];

const zones = () => [
  { name: 'left', label: { en: 'Left', it: 'Sinistra' } },
  {
    name: 'left_center',
    label: { en: 'Left center', it: 'Centro sinistra' },
    whenUsed: 'center',
    devices: ['desktop' as const],
  },
  { name: 'center', label: { en: 'Center', it: 'Centro' } },
  {
    name: 'right_center',
    label: { en: 'Right center', it: 'Centro destra' },
    whenUsed: 'center',
    devices: ['desktop' as const],
  },
  { name: 'right', label: { en: 'Right', it: 'Destra' } },
];

const ROW_LABELS = {
  above: { en: 'Top row', it: 'Riga superiore' },
  primary: { en: 'Main row', it: 'Riga principale' },
  below: { en: 'Bottom row', it: 'Riga inferiore' },
};

export function builderSettings(): Setting[] {
  const settings: Setting[] = [
    builder(
      'headerItems',
      { en: 'Header', it: 'Intestazione' },
      { section: H, tab: 'general' },
      {
        options: { desktop: 'header-desktop-items', mobile: 'header-mobile-items' },
        rows: [
          ...(['above', 'primary', 'below'] as const).map((row) => ({
            name: row,
            label: ROW_LABELS[row],
            section: `section-${row}-header-builder`,
            zones: zones(),
          })),
          {
            name: 'popup',
            label: { en: 'Off-canvas', it: 'Pannello laterale' },
            section: 'section-popup-header-builder',
            devices: ['mobile'],
            stacked: true,
            zones: [{ name: 'content' }],
          },
        ],
        items: HEADER_ITEMS,
      },
    ),
    builder(
      'footerItems',
      { en: 'Footer', it: 'Piè di pagina' },
      { section: F, tab: 'general' },
      {
        options: { desktop: 'footer-desktop-items' },
        rows: (['above', 'primary', 'below'] as const).map((row) => ({
          name: row,
          label: ROW_LABELS[row],
          section: `section-${row}-footer-builder`,
          columnsField: {
            above: 'hbaFooterColumn',
            primary: 'hbFooterColumn',
            below: 'hbbFooterColumn',
          }[row],
          zones: [1, 2, 3, 4, 5, 6].map((n) => ({
            name: String(n),
            label: { en: `Column ${n}`, it: `Colonna ${n}` },
          })),
        })),
        items: FOOTER_ITEMS,
      },
    ),
    ...headerSettings(),
    ...footerSettings(),
  ];
  return settings.map(settled);
}

/** A header layout of the ready-made ones: desktop and mobile rows. */
const layout = (
  desktop: Record<string, Record<string, string[]>>,
  popup: string[],
): Record<string, unknown> => ({
  desktop,
  mobile: {
    primary: { left: ['logo'], right: ['mobileTrigger'] },
    popup: { content: popup },
  },
});

/**
 * Ready-made headers (the header presets): values of Customize fields, to
 * offer as the theme's `presets`.
 */
export const HEADER_PRESETS: {
  id: string;
  label: { en: string; it: string };
  values: Record<string, unknown>;
}[] = [
  {
    id: 'header-1',
    label: { en: 'Header: menu and social', it: 'Intestazione: menu e social' },
    values: {
      headerItems: layout({ primary: { left: ['logo'], right: ['menu1', 'socialIcons1'] } }, [
        'mobileMenu',
        'socialIcons1',
      ]),
    },
  },
  {
    id: 'header-2',
    label: { en: 'Header: menu and button', it: 'Intestazione: menu e pulsante' },
    values: {
      headerItems: layout({ primary: { left: ['logo'], right: ['menu1', 'button1'] } }, [
        'mobileMenu',
        'button1',
      ]),
    },
  },
  {
    id: 'header-3',
    label: {
      en: 'Header: menu on the left, log in and sign up',
      it: 'Intestazione: menu a sinistra, accesso e iscrizione',
    },
    values: {
      headerItems: layout({ primary: { left: ['logo', 'menu1'], right: ['html1', 'button1'] } }, [
        'mobileMenu',
        'html1',
        'button1',
      ]),
      headerHtml1: '<a href="#">Log in</a>',
      headerButton1Text: 'Sign up',
    },
  },
  {
    id: 'header-4',
    label: { en: 'Header: centered logo and menu', it: 'Intestazione: logo e menu al centro' },
    values: {
      headerItems: layout({ above: { center: ['logo'] }, primary: { center: ['menu1'] } }, [
        'search',
        'mobileMenu',
      ]),
      hbaHeaderSeparator: 0,
      hbHeaderHeight: { desktop: 80 },
    },
  },
];
