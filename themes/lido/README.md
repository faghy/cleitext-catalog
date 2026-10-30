# Lido — beach club theme for Cleitext

A sunny theme for beach clubs, lidos and seaside lounges with a restaurant and events: an aerial photo
of the beach that fills the opening with a single "Book now" pill, a transparent header over it, soft
wave edges between sections, a handwritten title with a widely letter-spaced line under it ("lounge
beach"), sandy and white sections and sea blues. Price lists, season promos and event cards are made of
ordinary blocks.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/lido --build
```

## Customize

- **Site**: logo and an optional white logo for the transparent header, site icon, header (transparent
  over the opening photo of pages that start with a `ld-hero` section, or a white bar), footer (sand or
  deep sea), footer text.
- **Colors and fonts**: sea color, buttons, background and dark color, or one of the ready palettes
  (Riviera, Lounge, Sunset, Lagoon); display titles handwritten or in a soft serif. Button text turns
  dark on light button colors by itself.
- **Booking and WhatsApp**: a "Book now" button at the end of the menu (a page, a booking system,
  `mailto:` or `tel:`), optionally kept at the bottom of the screen on phones, and a round WhatsApp
  button in the corner of every page.
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (right side)** and **Footer** (three columns with
the address, the season and the opening hours work well).

## Classes

Pages are stacks of full-width sections made of normal blocks; the look comes from CSS classes (block
sidebar → _Advanced_ → _Additional CSS class_).

| Class                                                                          | On                                    | Effect                                                                                  |
| ------------------------------------------------------------------------------ | ------------------------------------- | --------------------------------------------------------------------------------------- |
| `ld-section`                                                                   | Group (full width, tag `section`)     | A section: spacing, content kept at 72rem                                               |
| `ld-bg-sand` `ld-bg-white` `ld-bg-soft` `ld-bg-blush` `ld-bg-sea` `ld-bg-dark` | section                               | Background: sand, white, pale sea, pale pink, sea, deep sea                             |
| `ld-wave-top` `ld-wave-bottom`                                                 | section                               | A wave in the section's color over the section above / below                            |
| `ld-center` `ld-tight`                                                         | section                               | Centered text, h2 with a small wave under it · less space                               |
| `ld-hero` (`ld-plain`, `ld-short`)                                             | section whose first block is an Image | The image fills the section; text and a pill button centered over it · no shade · lower |
| `ld-band`                                                                      | Image (full width)                    | A photo as wide as the page between sections                                            |
| `ld-script` `ld-spaced` `ld-kicker`                                            | Heading · Paragraph · Paragraph       | Handwritten title · letter-spaced line under it · small uppercase line                  |
| `ld-title` `ld-lead`                                                           | Heading · Paragraph                   | Title with a small wave · larger text                                                   |
| `ld-photos` (`ld-cols-2`, `ld-tall`)                                           | Group of images                       | A row of photos with a deep shadow                                                      |
| `ld-split` `ld-reverse`                                                        | Columns                               | Photo and text side by side                                                             |
| `ld-shadow` `ld-round`                                                         | Image                                 | Deep shadow · round photo                                                               |
| `ld-promos` / `ld-promo` (`ld-boxed`, `ld-highlight`)                          | Group / groups                        | Season promo boxes: photo, uppercase title, price, button                               |
| `ld-events` / `ld-event`                                                       | Group / groups                        | Event cards with the date on the photo's corner                                         |
| `ld-badge` · `ld-price`                                                        | Paragraph                             | A small pill label (on the photo of a card) · a large price                             |
| `ld-prices`                                                                    | Table                                 | Price list with a sea-colored header row                                                |
| `ld-lines`                                                                     | List                                  | Lines with the value on the right (hours, prices)                                       |
| `ld-features` / `ld-feature ld-i-ICON`                                         | Group / groups                        | Services with a round line icon                                                         |
| `ld-icon ld-i-ICON`                                                            | Group or paragraph                    | A small icon disc                                                                       |
| `ld-quote` · `ld-reviews`                                                      | Quote · Group of quotes               | One large review · review cards with stars                                              |
| `ld-map`                                                                       | Custom HTML or Embed                  | A rounded map or video                                                                  |

Icons: umbrella, sunbed, wave, sun, sunset, shower, cabin, cocktail, fork, fish, sup, canoe, swim,
volley, kids, paw, access, wifi, parking, music, party, ring, calendar, ticket, star, heart, clock,
phone, mail, pin.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

Fonts (Dancing Script, Alice, Nunito Sans) are served by Bunny Fonts under the SIL Open Font License.

License: GPL-2.0-or-later.
