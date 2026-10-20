# Zenit — multipurpose theme for Cleitext

Part of the Cleitext catalog: install it from **Appearance → Themes → Add New**, or with
`cleitext theme:install themes/zenit --build`. Needs Cleitext 0.46 or later.

Everything is set in **Appearance → Customize**, with a live preview at desktop, tablet and
phone width:

- **Header and footer builders**: drag the elements (logo, menus, button, HTML, search, social
  icons, account, widgets, copyright…) into the rows and zones, with a layout for desktop and one
  for tablet/phone. A click on an element, or on the pencil beside it in the preview, opens its
  settings (General and Design tabs).
- **Global**: nine global colors (and four ready palettes, one dark), fonts for text and headings
  (Google Fonts, loaded from a privacy-friendly mirror), buttons, container width and style,
  sidebar.
- **Blog and pages**: blog layouts (grid, list, cover), what each post card shows, the title area
  of posts and pages, related posts, comments, search results.
- **Extras**: breadcrumbs, back-to-top button, transparent header.

Each page and post can change its own container, sidebar and which parts to hide (Document tab
of the editor).

Block areas (Appearance → Areas): **Sidebar**, **Header widget 1–2**, **Footer widget 1–4**.
Menu locations: **Primary**, **Secondary**, **Off-canvas** and **Footer**.

## Development

`node build-styles.py` writes `src/css/static.ts` from `src/css/static.css`; the dynamic CSS is
made by the parts in `src/css/parts`, in a fixed order, from the options (`src/core/options.ts`,
defaults in `src/core/defaults.ts`). Customize settings are in `src/settings`.

Social icons: Font Awesome Free (icons under CC BY 4.0).
