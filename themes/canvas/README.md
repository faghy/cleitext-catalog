# Canvas — page-builder theme for Cleitext

Part of the Cleitext catalog: install it from **Appearance → Themes → Add New**, or with `cleitext theme:install themes/canvas --build`.
Pages are stacks of full-width **sections** made of normal blocks; the look comes from CSS classes
(block sidebar → *Advanced* → *Additional CSS class*). Editors usually insert ready sections from
**Patterns** (*Canvas · …*) and only change texts and images.

## Classes

| Class | On | Effect |
| --- | --- | --- |
| `cv-section` | Group (full width, tag `section`) | A section: spacing, content kept at 76rem |
| `cv-bg-soft` `cv-bg-gray` `cv-bg-mesh` `cv-bg-brand` `cv-bg-dark` | section | Background: light blue, gray, soft gradients, brand blue, navy |
| `cv-center` `cv-tight` `cv-dots` | section | Centered text · less vertical space · dotted decoration |
| `cv-hero` | section with Columns | Opening: big title, text and buttons, illustration |
| `cv-eyebrow` `cv-lead` `cv-small` | Paragraph | Small label pill · larger intro text · small gray note |
| `<strong>` in a heading | Heading | Gradient words |
| `cv-cards` (+ `cv-cols-4`, `cv-cols-2`, `cv-plain`) | Group | Grid of cards (3 per row by default) |
| `cv-card cv-i-<icon>` | Group in cv-cards | Card with icon: edit, blocks, plugin, palette, globe, layers, shield, rocket, refresh, code, users, search, image, zap, heart, download, book, lock, chat, check, github |
| `cv-split` (+ `cv-reverse`) | Columns | Image and text side by side (reversed: image right) |
| `cv-float` `cv-shadow` | Image | Gently floating · rounded with shadow |
| `cv-steps` / `cv-step` | Group / Group | Numbered steps |
| `cv-stats` + `cv-number` | Columns + Paragraph | Big numbers with labels |
| `cv-checks` | List | Green check marks |
| `cv-quote` | Quote | Large quote |
| `cv-terminal` | Code | Terminal window |
| `cv-box` | Group | Highlighted white box |
| `cv-faq` | Group of Groups | Questions and answers in two columns |
| `cv-pills` | Buttons | Small rounded links |

Buttons: *Fill* = primary, *Outline* = secondary (white on brand/dark sections).
The last item of the main menu is shown as a button (the call to action).

## Build

```bash
python3 make-icons.py      # src/icons.css from the icon list
python3 build-styles.py    # src/styles.ts from style.css, icons.css, editor.css
node ../cleitext/packages/cli/dist/bin.js theme:build .
```

Bump the version in `theme.json` and `src/index.tsx` before installing an update.
