# Podere — farm stay theme for Cleitext

A warm theme for farm stays, country houses and rural B&Bs: cream pages, a main color (terracotta by
default), serif titles, soft wave dividers between sections, rounded photos, cards with the caption over
the photo and features with round line icons.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/podere --build
```

## Customize

- **Site**: logo, site icon, header (a colored bar, or transparent over the opening photo of pages that
  start with a `pd-hero` section), footer text.
- **Colors**: main color, background and dark color, or one of the ready palettes (Terracotta, Olive
  grove, Lavender, Vineyard).
- **Booking and WhatsApp**: a "Book now" button at the end of the menu (a page, a booking engine,
  `mailto:` or `tel:`) and a round WhatsApp button in the corner of every page.
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (right side)** and **Footer** (three columns with
the address, the opening hours and how to get there work well).

## Classes

Pages are stacks of full-width sections made of normal blocks; the look comes from CSS classes (block
sidebar → *Advanced* → *Additional CSS class*).

| Class | On | Effect |
| --- | --- | --- |
| `pd-section` | Group (full width, tag `section`) | A section: spacing, content kept at 72rem |
| `pd-bg-cream` `pd-bg-white` `pd-bg-accent` `pd-bg-dark` | section | Background: cream, white, main color, dark |
| `pd-wave-top` `pd-wave-bottom` | section | A wave in the section's color over the section above / below |
| `pd-center` `pd-tight` | section | Centered text, h2 with a short line under it · less space |
| `pd-hero` | section whose first block is an Image | The image fills the section; text over it |
| `pd-kicker` `pd-title` `pd-lead` | Paragraph · Heading · Paragraph | Small italic line · display title with a line · larger text |
| `pd-split` `pd-reverse` | Columns | Photo and text side by side |
| `pd-blob` `pd-arch` `pd-shadow` | Image | Organic round photo · arched photo · shadow |
| `pd-cards` (`pd-cols-2`, `pd-cols-4`, `pd-wide-photos`) / `pd-card` (`pd-boxed`) | Group / groups | Cards with a tall photo, its caption written over it |
| `pd-features` / `pd-feature pd-i-ICON` | Group / groups | Features with a round line icon |
| `pd-icon pd-i-ICON` | Group or paragraph | A small icon disc |
| `pd-intro` | Columns | A title next to features |
| `pd-lines` | List | Lines with the value on the right (hours, prices) |
| `pd-quote` · `pd-reviews` | Quote · Group of quotes | One large review · review cards with stars |
| `pd-map` | Custom HTML or Embed | A rounded map or video |

Icons: bed, fork, camper, beach, map, basket, leaf, hike, bike, star, sun, wine, olive, house, pool, kids,
paw, wifi, parking, clock, phone, mail, pin, heart, tree, egg.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

License: GPL-2.0-or-later.
