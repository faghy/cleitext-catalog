# Zenit — multipurpose theme for Cleitext

Part of the Cleitext catalog: install it from **Appearance → Themes → Add New**, or with
`cleitext theme:install themes/zenit --build`. Needs Cleitext 0.79 or later.

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
  of posts and pages, related posts, comments, search results. The title area is inside the
  content (layout 1) or, with **Banner layout → Layout 2** (since Zenit 1.0.6), a banner across
  the page between the header and the content: the parts chosen in **Structure** (title,
  breadcrumb, excerpt, meta, featured image), its width, minimum height, background (or the
  featured image with an overlay color), alignment and colors; the featured image can also go at
  the top of the article (**Image position → Below**).
- **Extras**: breadcrumbs, back-to-top button, transparent header.

Each page and post can change its own container, sidebar and which parts to hide (Document tab
of the editor).

CSS of your own goes in **Customize → Additional CSS**, Cleitext's for every theme (Zenit's own
option moved there with Zenit 1.0.5 and Cleitext 0.79). To change templates or styles in code,
make a child theme of Zenit (**Appearance → Themes → Create child theme**): Zenit's updates never
touch it.

Block areas (Appearance → Areas): **Sidebar**, **Header widget 1–2**, **Footer widget 1–4**.
Menu locations: **Primary**, **Secondary**, **Off-canvas** and **Footer**.

Site builders (Zenit Pro's Site Builder) can replace the header, the footer, the content of
entries, archives and the 404 page, and fill hook points that show nothing otherwise
(`hook:zenit_body_top`, `header_before`/`after`, `content_before`/`top`/`bottom`/`after`,
`entry_content_before`/`after`, `comments_before`, `footer_before`/`after`, `body_bottom`;
plugin API 1.33).

## Development

`node build-styles.py` writes `src/css/static.ts` from `src/css/static.css`; the dynamic CSS is
made by the parts in `src/css/parts`, in a fixed order, from the options (`src/core/options.ts`,
defaults in `src/core/defaults.ts`). Customize settings are in `src/settings`.

Tests (`test/`, not packaged), from a Cleitext checkout next to the catalog:
`node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.

Social icons: Font Awesome Free (icons under CC BY 4.0).
