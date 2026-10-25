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
- **Language switcher** (Zenit 1.2.0), an element of both builders for sites in several languages
  (Multilingual plugin): a dropdown or a list, with flags or not, names in each language or codes;
  each language links to the current page's translation, or to its home page when there is none.
  It shows nothing while the site has one language.

Each page and post can change its own container, sidebar, backgrounds (since Zenit 1.1.0) and
which parts to hide (Document tab of the editor).

Lists of posts are numbered page by page (`1 2 … 22 Next →`); how many posts a page shows is the
site's **Settings → Reading → Posts per page**, and dates follow the site's date format (Settings →
General, a format of its own such as `F j, Y` since Cleitext 0.82).

**Moving a site from the original theme** (Zenit 1.1.0, Cleitext 0.82): Customize → ⋯ → Import
reads its settings (`wp option get <option> --format=json`, or a JSON object with that option and
the site's `date_format` and `posts_per_page`), and also sets the site's posts per page and date
format. Importing the WordPress export with Zenit active gives each page its own options from the
original theme's page settings (container layout and style, sidebar, backgrounds, hidden parts),
and rewrites the original theme's class names in the imported Additional CSS to Zenit's (`.zn-…`,
in selectors only), as the import report says.
When the file also has WPML's options (`wpml_language_switcher`, or the older ones in
`icl_sitepress_settings`), the language switcher goes where WPML showed its own: next to the primary
menu (and the off-canvas menu on phones), next to a footer widget area, or in the footer's bottom
row (Zenit 1.2.0).

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
