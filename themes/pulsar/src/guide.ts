/** How to build pages with the Pulsar theme, for AI assistants connected through MCP. */
export const AI_GUIDE = `Pulsar is Aurora (a readable one-column theme) plus dark "Pulsar" sections for landing pages,
in the style of the snd-pulsar home page: navy background, cyan and blue accents, monospace labels.

A landing page is a stack of core/group sections with \`"align":"full","tagName":"section"\` and the class
\`psx-section\` (plus the classes below). When the first section is \`psx-section psx-hero\`, the page title
is hidden and the hero holds the h1. Plain pages and posts use normal blocks, without these classes.
The best start: read the home page (get_entry on the front page) and reuse its sections.

| Class | On | Effect |
| --- | --- | --- |
| psx-section | group (align full, tagName section) | A dark section, content at 72rem |
| psx-hero psx-wave | the first section, with core/columns | Opening with the animated wave at the bottom |
| psx-center, psx-band, psx-final | the section | Centered · lighter band · final call to action |
| psx-eyebrow, psx-lead | paragraph | Small cyan label with a LED · larger intro text |
| <strong> in a heading | heading | Gradient words |
| psx-card-art | core/image | Floating hardware illustration |
| psx-stats-wrap + psx-stats | section + core/columns with an h3 number and a paragraph each | Numbers overlapping the hero |
| psx-window | core/image with a caption | Screenshot in an app window (the caption is the title bar) |
| psx-grid / psx-card psx-i-ICON | group / groups with h3 + paragraph | Feature cards (ICON: wave, chip, knobs, rack, keys, bars, ram, meters) |
| psx-flow / psx-node | group / groups with two paragraphs | A chain of steps joined by lines |
| psx-term | group: p.psx-titlebar, then comment paragraphs and core/code commands, p.psx-output | Terminal with copy buttons |
| psx-checks, psx-note | list · paragraph | Arrow list · amber note |
| psx-timeline | core/columns, each column: p (<strong>version</strong> date), h3, p | Release timeline |
| psx-status / psx-box (+ psx-todo) | core/columns / columns with h3 and a list | Done (green LEDs) and to do (amber) |
| psx-dev / psx-avatar / psx-chips | group / image / buttons | Author card with round photo and small links |

Buttons: the default is the cyan primary; "is-style-outline" for the secondary.
Keep texts short and factual; the site is about the snd-pulsar Linux driver.`;
