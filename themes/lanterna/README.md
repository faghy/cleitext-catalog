# Lanterna — Asian restaurant theme for Cleitext

A theme for Asian and ethnic restaurants, takeaway and delivery: warm beige pages, a main color (lantern
red by default), heavy display titles, a full-screen photo opening with a huge white title, menu sections
with prices and spicy or vegetarian marks, white cards, photo panels for takeaway and delivery, and the
call, WhatsApp and menu buttons always at hand on phones.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/lanterna --build
```

## Customize

- **Site**: logo, site icon, header (a beige bar, a white bar, or transparent over the opening photo of
  pages that start with an `ln-hero` section), footer text.
- **Colors**: main color, background and dark color (titles and dark sections), or one of the ready
  palettes (Lantern red, Jade, Saffron, Indigo night).
- **Menu, phone and WhatsApp**: the red "See the menu" button in the header (a page, a PDF or an ordering
  site), the booking phone, a round WhatsApp button in the corner, and on phones a bar fixed at the
  bottom with Call · WhatsApp · Menu.
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (right side)** and **Footer** (three columns with
the address, the opening hours and links work well).

### Several languages

With Multilingual the header shows a compact dropdown with each language's own name (Italiano ▾ →
English, 中文), and the phone menu shows them side by side. Without a language plugin the theme draws
its own switcher (IT · EN · 中文). Titles in Chinese, Japanese or Korean use a bold system font, as the
display font has Latin letters only. The interface texts of the theme are in English, Italian, German
and Chinese.

## Classes

Pages are stacks of full-width sections made of normal blocks; the look comes from CSS classes (block
sidebar → _Advanced_ → _Additional CSS class_).

| Class                                                         | On                                               | Effect                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------- |
| `ln-section`                                                  | Group (full width, tag `section`)                | A section: spacing, content kept at 74rem                               |
| `ln-bg-paper` `ln-bg-white` `ln-bg-accent` `ln-bg-dark`       | section                                          | Background: beige, white, main color, dark                              |
| `ln-center` `ln-tight` `ln-flush`                             | section                                          | Centered text, h2 with an ornament · less space · no side padding       |
| `ln-hero` (`ln-left`, `ln-short`)                             | section whose first block is an Image            | The image fills the screen; a huge white title over it                  |
| `ln-kicker` `ln-title` `ln-lead` `ln-display`                 | Paragraph · Heading · Paragraph · Paragraph      | Small red line · title with an ornament · larger text · very large text |
| `ln-split` `ln-reverse`                                       | Columns                                          | Photo and text side by side                                             |
| `ln-photo` `ln-round` `ln-tall`                               | Image                                            | Shadow · round · portrait                                               |
| `ln-strip`                                                    | Group of images, or Gallery                      | A row of four square photos                                             |
| `ln-cards` (`ln-cols-2`, `ln-cols-4`, `ln-spots`) / `ln-card` | Group / groups                                   | White cards with a photo, or with a small round illustration            |
| `ln-features` / `ln-feature ln-i-ICON`                        | Group / groups                                   | Features with an icon in a soft disc                                    |
| `ln-icon ln-i-ICON`                                           | Group or paragraph                               | An icon disc on the left (contacts, hours)                              |
| `ln-numbers` / `ln-number`                                    | Group / paragraph                                | Big figures over short labels                                           |
| `ln-menu` (`ln-cols-1`)                                       | Group: heading, then dishes                      | A menu category, the dishes in two columns                              |
| `ln-dish` (`ln-spicy`, `ln-hot`, `ln-veg`, `ln-chef`)         | Group: [image], heading, description, `ln-price` | A dish with its price; marks after the name                             |
| `ln-legend` / `ln-mark ln-spicy`…                             | Group / paragraphs                               | A legend of the marks                                                   |
| `ln-lines`                                                    | List                                             | Lines with the value on the right (hours, set menus)                    |
| `ln-panel` (`ln-right`)                                       | Group: an image, then a group with the text      | A large photo with a white box over it (takeaway, delivery, banquets)   |
| `ln-partners`                                                 | Buttons                                          | Delivery or ordering services as white pills with an arrow              |
| `ln-quote` · `ln-reviews`                                     | Quote · Group of quotes                          | One large review · review cards with the name and stars                 |
| `ln-map` · `ln-ornament`                                      | Custom HTML or Embed · Separator                 | A rounded map or video · two lines and a diamond                        |

Icons: dumpling, bowl, chopsticks, lantern, tea, wok, chili, leaf, scooter, bag, phone, chat, clock, pin,
mail, wifi, kids, people, cake, table, star, gift, calendar, card, parking, mobile, menu, fish.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

Fonts: Unbounded and Inter (SIL Open Font License), from Bunny Fonts; Cleitext keeps copies on the site.

License: GPL-2.0-or-later.
