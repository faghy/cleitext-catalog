# Clinica — dental and medical practice theme for Cleitext

A clean, professional theme for dental studios, medical practices and physiotherapy centres: a white
header with the menu items divided by thin lines and an appointment button, a photo hero with a label
box, a big bold title and a translucent card with the phone number and the opening hours, light
blue-gray sections, bold Montserrat titles in a dark teal, treatment cards with line icons, team, reviews
and questions that open.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this
folder:

```bash
cleitext theme:install themes/clinica --build
```

## Customize

- **Site**: logo, site icon, header (a white bar, or the white bar with a dark contact strip above it
  showing the opening hours, the email and the phone), footer text (name, VAT number, medical director).
- **Colors**: main color, titles and dark sections, light sections, or one of the ready palettes
  (Clinic blue, Teal, Physio green, Navy and lilac).
- **Appointments and contacts**: an appointment button at the right of the menu (a page, an online
  booking service, `mailto:` or `tel:`), the phone number (a round call button next to the menu on
  phones), email and short opening hours for the contact strip, and an optional WhatsApp button.
- **Social profiles**: icons in the footer, or in the header and the footer.

**Appearance → Areas** has two block areas: **Header (right side)** and **Footer** (four columns with
the practice, the address, the opening hours and the contacts work well).

## Classes

Pages are stacks of full-width sections made of normal blocks; the look comes from CSS classes (block
sidebar → _Advanced_ → _Additional CSS class_).

| Class                                                                   | On                                                   | Effect                                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `cl-section`                                                            | Group (full width, tag `section`)                    | A section: spacing, content kept at 74rem                                                    |
| `cl-bg-white` `cl-bg-soft` `cl-bg-blue` `cl-bg-ink` `cl-bg-gradient`    | section                                              | Background: white, light blue-gray, strong blue, dark teal, gradient                         |
| `cl-center` `cl-tight`                                                  | section                                              | Centered text, h2 with a short line under it · less space                                    |
| `cl-hex` (`cl-hex-left`)                                                | section                                              | Hexagons in the main color in a bottom corner                                                |
| `cl-hero`                                                               | section whose first block is an Image                | The image fills the section, darkened; text over it                                          |
| `cl-label`                                                              | Paragraph                                            | The small label box over the hero title ("Over 25 years")                                    |
| `cl-hours`                                                              | Group                                                | The hours card: h3 + phone, then h4 labels between lines (Morning, Afternoon) with the hours |
| `cl-ico cl-i-ICON`                                                      | Heading or paragraph                                 | A line icon before the text                                                                  |
| `cl-kicker` `cl-title` `cl-lead` `cl-small`                             | Paragraph · Heading · Paragraph                      | Small uppercase line · title with a line · larger text · small text                          |
| `cl-split` `cl-reverse`                                                 | Columns                                              | Photo and text side by side                                                                  |
| `cl-duo` · `cl-photo`                                                   | Group of two images · Image                          | A large photo with a smaller one over its corner · soft shadow                               |
| `cl-treatments` (`cl-cols-3/4/5`, `cl-rows`) / `cl-treatment cl-i-ICON` | Group / groups                                       | Treatment cards with a line icon                                                             |
| `cl-checks` (`cl-cols-2`) · `cl-steps`                                  | List · Ordered list                                  | Lines with a check mark · numbered step cards                                                |
| `cl-stats`                                                              | Columns                                              | Big numbers in a row                                                                         |
| `cl-team` / `cl-member`                                                 | Group / groups                                       | Team cards: portrait, name, role, text                                                       |
| `cl-reviews` (`cl-cols-3`)                                              | Group of quotes                                      | Review cards with the name and five stars                                                    |
| `cl-faq`                                                                | Group of Custom HTML `<details>` (or h3 + paragraph) | Questions that open, in a white box                                                          |
| `cl-note` · `cl-box` · `cl-lines`                                       | Group · Group · List                                 | Highlighted note · white box · lines with the value on the right (hours, prices)             |
| `cl-map`                                                                | Custom HTML or Embed                                 | A rounded map or video                                                                       |

Icons: tooth, clean, implant, braces, smile, sparkle, xray, laser, shield, syringe, stethoscope, heart,
spine, bone, hand, eye, child, calendar, clock, phone, mail, pin, user, team, chat, check, award, card,
access, parking, cross, pill.

AI assistants connected through MCP read the same guide (`src/guide.ts`).

License: GPL-2.0-or-later.
