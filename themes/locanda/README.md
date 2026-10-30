# Locanda — historic hotel and inn theme for Cleitext

A classic theme for historic family hotels, inns, country restaurants and old trattorias: a white page
with the content in a centered box, the name centered at the top with its founding year between two
arrows, a deep green menu bar with thin lines between the items and drop-downs, a framed opening photo,
condensed uppercase titles with an arrow under them, a sidebar with "our strengths" and check marks, and
a deep green footer with a strip of grass.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/locanda --build
```

## Customize

- **Site**: logo, site icon, the lettering of the name when there is no logo (old sign, serif or
  condensed), the line under the name ("Since 1887"), the footer (with a strip of grass or plain) and its
  text.
- **Colors**: main color, light color (the current menu item) and footer color, or one of the ready
  palettes (Forest green, Old wine, Lake blue, Chestnut).
- **Phone and booking**: a phone number at the top left of every page (a link to call) and a booking
  button at the top right (a page, a booking engine, `mailto:` or `tel:`).
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (top line)**, a short line next to the phone number,
and **Footer** (two or three columns with the address, the phones and the opening hours work well).

## Classes

Pages are ordinary blocks inside the box; the look comes from CSS classes (block sidebar → _Advanced_ →
_Additional CSS class_). Every h2 is uppercase with an arrow under it.

| Class                                             | On                                  | Effect                                                                                 |
| ------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| `lc-hero` (`lc-hero-low`)                         | Group whose first block is an Image | The photo fills a green frame; the text sits on a light band across it (at the bottom) |
| `lc-frame`                                        | Image                               | A photo in the green frame                                                             |
| `lc-plain`                                        | Heading                             | An h2 without the arrow                                                                |
| `lc-kicker` `lc-lead`                             | Paragraph                           | Small spaced uppercase line · larger text                                              |
| `lc-center` `lc-section` `lc-band` `lc-dark`      | Group                               | Centered · more space · light tinted box · main-color box                              |
| `lc-two`                                          | Columns                             | Content and a sidebar that stays in view                                               |
| `lc-box` (`lc-tinted`)                            | Group                               | A bordered panel with a small centered title                                           |
| `lc-checks` (`lc-cols-2`)                         | List                                | Items with check marks                                                                 |
| `lc-cards` (`lc-cols-2`, `lc-cols-4`) / `lc-card` | Group / groups                      | Offer, room or service cards; the photo caption is a band over the photo               |
| `lc-price`                                        | Paragraph in a card                 | A price tag over the corner of the photo                                               |
| `lc-events` / `lc-event` + `lc-date`              | Group / groups + paragraph          | Events with a calendar tile                                                            |
| `lc-where`                                        | Columns                             | A map or picture in the frame beside a green panel with the address                    |
| `lc-lines`                                        | List                                | Lines with the value on the right (distances, hours, a menu with prices)               |
| `lc-icon lc-i-ICON`                               | Paragraph or group                  | A small line icon before it                                                            |
| `lc-features` / `lc-feature lc-i-ICON`            | Group / groups                      | Services with an icon in a ring                                                        |
| `lc-quote` · `lc-reviews`                         | Quote · Group of quotes             | One large review · review cards                                                        |

Icons: check, bed, fork, glass, cake, ring, briefcase, key, pin, map, phone, mail, clock, calendar, car,
train, plane, bus, wifi, parking, tree, leaf, sun, star, heart, bike, paw, house, family.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

Fonts: Oswald, Source Sans 3, Cormorant Garamond and UnifrakturMaguntia (SIL Open Font License), served
by fonts.bunny.net. Social icons: Font Awesome Free (CC BY 4.0).

License: GPL-2.0-or-later.
