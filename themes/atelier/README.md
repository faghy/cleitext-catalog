# Atelier — portfolio theme for Cleitext

A quiet portfolio theme for painters, illustrators, photographers and artisans: white and light gray pages,
Playfair Display titles, thin gold lines, the artist's name in a translucent card overlapping a framed
artwork, a gallery of works with title, year, technique and size under each picture, captions that slide up
on hover (no lightbox, no JavaScript) and a timeline of exhibitions.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/atelier --build
```

## Customize

- **Site**: logo, site icon, header (name on the left and menu on the right, or the name centered over the
  menu), the tagline under the name ("Painter", "Photographer"…), footer text.
- **Colors**: accent (lines, gold titles, buttons), light gray sections and titles color, or one of the ready
  palettes (Gold leaf, Burnt sienna, Ultramarine, Sage, Black and white).
- **Contact button and WhatsApp**: a small outlined button at the end of the menu (a page, `mailto:` or
  `tel:`) and a round WhatsApp button in the corner of every page.
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (right side)** and **Footer** (the name as
`at-signature` on the left and a few `at-icon` lines on the right work well).

## Classes

Pages are stacks of full-width sections made of normal blocks; the look comes from CSS classes (block
sidebar → _Advanced_ → _Additional CSS class_).

| Class                                                                         | On                                | Effect                                                                              |
| ----------------------------------------------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------- |
| `at-section`                                                                  | Group (full width, tag `section`) | A section: spacing, content kept at 74rem                                           |
| `at-bg-white` `at-bg-paper` `at-bg-dark`                                      | section                           | Background: white, light gray, dark                                                 |
| `at-center` `at-tight` `at-line-top`                                          | section                           | Centered text · less space · a thin line on top                                     |
| `at-vline`                                                                    | section · Separator               | A thin vertical gold line under the first h2 · the separator becomes that line      |
| `at-hero` (`at-reverse`, `at-full`)                                           | section: an Image, then a Group   | Framed artwork with a translucent card over it · mirrored · the image as background |
| `at-kicker` `at-years` `at-lead`                                              | Paragraph                         | Spaced small capitals · the years line under a name · larger text                   |
| `at-title` · `at-signature` · `at-dropcap`                                    | Heading · Paragraph · Paragraph   | Gold title with a line · name in italic serif · big initial                         |
| `at-prose`                                                                    | Group of paragraphs               | Text in newspaper columns                                                           |
| `at-frame` `at-mat` `at-shadow` · `at-paper`                                  | Image or group · Image            | Thin dark frame, white mat, deep shadow · tilted sheet of paper behind              |
| `at-artwork` + `at-specs`                                                     | Columns + List                    | One artwork with its details beside it                                              |
| `at-works` (`at-cols-2`, `at-cols-4`, `at-square`, `at-portrait`) / `at-work` | Group / groups                    | Gallery of works: picture, title, then year, technique and size                     |
| `at-hover`                                                                    | Image, Gallery or any group       | The caption slides up over the picture on hover                                     |
| `at-strip`                                                                    | Gallery or group of images        | A row of works scrolling sideways                                                   |
| `at-timeline`                                                                 | List                              | Exhibitions on a vertical gold line (`<strong>2024</strong>` first)                 |
| `at-events` / `at-event`                                                      | Group / groups                    | Event cards with a gold line on top                                                 |
| `at-icon at-i-ICON`                                                           | Paragraph or heading              | A small gold icon before the line                                                   |
| `at-quote`                                                                    | Quote                             | The artist's statement, large and centered                                          |

Icons: palette, brush, easel, frame, camera, vase, needle, chisel, calendar, ticket, book, award, clock,
phone, mail, pin.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

License: GPL-2.0-or-later.
