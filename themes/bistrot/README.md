# Bistrot — restaurant and cocktail bar theme for Cleitext

An elegant evening theme for restaurants, bistrots, wine and cocktail bars: dark navy pages with gold
accents, Art Deco display titles with a thin gold line under them, a full-height opening photo with a
slanted gold band under it, arch patterns, menus with dotted leaders and prices, cocktail cards with
arch-topped photos and a "Book a table" button.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/bistrot --build
```

## Customize

- **Site**: logo, site icon, header (a dark bar, or transparent over the opening photo of pages that
  start with a `bs-hero` section), footer text.
- **Colors**: gold, background and footer color, or one of the ready palettes (Navy and gold,
  Bordeaux, Emerald, Charcoal and brass).
- **Booking, hours and WhatsApp**: a "Book a table" button at the end of the menu (a page, a booking
  service, `mailto:` or `tel:`), a short opening-hours line at the bottom of every page and a round
  WhatsApp button in the corner.
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (right side)** and **Footer** (three columns with
the address, the hours and the contacts work well).

## Classes

Pages are stacks of full-width sections made of normal blocks; the look comes from CSS classes (block
sidebar → _Advanced_ → _Additional CSS class_).

| Class                                                | On                                          | Effect                                                                                   |
| ---------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `bs-section`                                         | Group (full width, tag `section`)           | A section: spacing, content kept at 72rem                                                |
| `bs-bg-navy` `bs-bg-deep` `bs-bg-light` `bs-bg-gold` | section                                     | Background: navy, deeper navy, cream, gold                                               |
| `bs-arches`                                          | section                                     | Art Deco pattern of stacked arches                                                       |
| `bs-band` (`bs-next-deep`, `bs-next-light`)          | section                                     | A slanted gold band at its bottom edge                                                   |
| `bs-center` `bs-tight`                               | section                                     | Centered text, h2 with a thin gold line · less space                                     |
| `bs-hero`                                            | section whose first block is an Image       | The image fills the screen; title centered over it                                       |
| `bs-kicker` `bs-title` `bs-lead` `bs-statement`      | Paragraph · Heading · Paragraph · Paragraph | Small italic line · gold line under the title · larger text · one large display line     |
| `bs-divider`                                         | Separator                                   | A short gold rule with a diamond                                                         |
| `bs-split` `bs-reverse`                              | Columns                                     | Photo and text side by side                                                              |
| `bs-round` `bs-arch` `bs-frame`                      | Image                                       | Round photo with faded edges · arch-topped photo · offset gold frame                     |
| `bs-box`                                             | Group                                       | Double gold border, like a printed menu card                                             |
| `bs-menu` (`bs-cols-2`)                              | List                                        | Dish, dotted leader, price, description: `Dish<strong>12 €</strong><em>description</em>` |
| `bs-hours`                                           | List                                        | Lines with the value on the right (`Monday<strong>Closed</strong>`)                      |
| `bs-cards` (`bs-cols-2`, `bs-cols-4`) / `bs-card`    | Group / groups                              | Cards with an arch-topped photo, name, text and `bs-price`                               |
| `bs-features` / `bs-feature bs-i-ICON`               | Group / groups                              | Features with a gold line icon in a diamond                                              |
| `bs-icon bs-i-ICON`                                  | Group or paragraph                          | A small icon before the content                                                          |
| `bs-quote` · `bs-reviews`                            | Quote · Group of quotes                     | One large review · review boxes with stars                                               |
| `bs-map`                                             | Custom HTML or Embed                        | A map or a video in a thin gold frame                                                    |

Icons: cocktail, wine, bubbles, beer, coffee, fork, cloche, fish, cake, music, terrace, leaf, star,
calendar, clock, phone, mail, pin, gift, heart, wifi, paw.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

Fonts: Poiret One, Cormorant Garamond and Sulphur Point (SIL Open Font License), served by
fonts.bunny.net.

License: GPL-2.0-or-later.
