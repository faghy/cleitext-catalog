/** How to build pages with Locanda, for AI assistants connected through MCP. */
export const AI_GUIDE = `Locanda is a theme for historic family hotels, inns and country restaurants: a white page with the
content in a centered box (72rem), the name centered at the top with a "since" line between two arrows, a
deep green menu bar, a framed opening photo, condensed uppercase titles with an arrow under every h2, and
a deep green footer with a strip of grass. Pages are ordinary blocks inside the box (no full-width
bands): start with an lc-hero, then headings, text, an lc-two layout with a sidebar, cards and lists.
Running text keeps a readable width on its own; put it in lc-two when there is a sidebar.

| Class | On | Effect |
| --- | --- | --- |
| lc-hero (+ lc-hero-low) | group whose FIRST block is a core/image | The photo fills a green frame; the blocks after it sit on a light band across the middle (at the bottom with lc-hero-low). With an h1 in it, the page title is hidden |
| lc-frame | core/image, or a group holding an iframe | A photo or map in the green frame |
| (none) / lc-plain | core/heading level 2 | Every h2 is uppercase with an arrow under it; lc-plain removes the arrow |
| lc-kicker | paragraph before a heading | Small spaced uppercase line |
| lc-lead | paragraph | Larger intro text |
| lc-center | group | Centered text and buttons (h2 arrows centered too) |
| lc-section · lc-band · lc-dark | group | More space around it · light green tinted box · main-color box with white text |
| lc-two | core/columns with 2 columns | Content (2/3) and sidebar (1/3); the sidebar stays in view while scrolling |
| lc-box (+ lc-tinted) | group, usually in the sidebar | Bordered panel; its first heading is a small centered title |
| lc-checks (+ lc-cols-2) | core/list | Items with green check marks ("our strengths", what is included) |
| lc-cards (+ lc-cols-2, lc-cols-4) | group | Grid of cards, 3 per row |
| lc-card | group inside lc-cards: core/image (caption), h3, paragraph, buttons | A card; the image caption is a light band over the photo, the buttons go to the bottom |
| lc-price | paragraph inside an lc-card | A green price tag over the corner of the photo ("from <strong>89 €</strong>") |
| lc-events / lc-event | group / groups: paragraph lc-date, h3, paragraphs | Event list with a calendar tile; lc-date is "<strong>14</strong>June" (a line break between) |
| lc-where | core/columns: a column with a map (core/html iframe) or image, a column with the address | Map in a green frame beside a green panel with the address and distances |
| lc-lines | core/list | Lines with the value on the right: "Station<strong>4 km</strong>", hours, a menu with prices |
| lc-icon lc-i-ICON | paragraph or group | A small line icon before it (address, phone, how to get here) |
| lc-features / lc-feature lc-i-ICON | group / groups with h3 + paragraph | Services with an icon in a ring |
| lc-quote · lc-reviews | core/quote · group of quotes | One large review · review cards |

Icons (ICON): check, bed, fork, glass, cake, ring, briefcase, key, pin, map, phone, mail, clock, calendar,
car, train, plane, bus, wifi, parking, tree, leaf, sun, star, heart, bike, paw, house, family.

Buttons: the default is the main color, square-ish and uppercase; "is-style-outline" for the secondary.
Inside lc-dark and lc-where they turn white. A core/separator is a thin arrow across the box.

The opening of a home page, with the sidebar of strengths:

\`\`\`html
<!-- wp:group {"className":"lc-hero"} --><div class="wp-block-group lc-hero">
<!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="The garden of the inn"/></figure><!-- /wp:image -->
<!-- wp:heading {"level":1} --><h1>Inn and restaurant since 1887</h1><!-- /wp:heading -->
<!-- wp:paragraph --><p>A quiet house in a large garden, ten minutes from town.</p><!-- /wp:paragraph -->
</div><!-- /wp:group -->
<!-- wp:columns {"className":"lc-two"} --><div class="wp-block-columns lc-two">
<!-- wp:column --><div class="wp-block-column"><!-- wp:heading --><h2>A quiet inn in the green</h2><!-- /wp:heading --><!-- wp:paragraph {"className":"lc-lead"} --><p class="lc-lead">Welcome…</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"lc-box"} --><div class="wp-block-group lc-box"><!-- wp:heading {"level":3} --><h3>Our strengths</h3><!-- /wp:heading -->
<!-- wp:list {"className":"lc-checks"} --><ul class="lc-checks"><!-- wp:list-item --><li>A timeless atmosphere</li><!-- /wp:list-item --><!-- wp:list-item --><li>Green and quiet</li><!-- /wp:list-item --></ul><!-- /wp:list -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/contacts"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/contacts">Check availability</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</div><!-- /wp:group --></div><!-- /wp:column --></div><!-- /wp:columns -->
\`\`\`

Offers as cards:

\`\`\`html
<!-- wp:group {"className":"lc-cards"} --><div class="wp-block-group lc-cards">
<!-- wp:group {"className":"lc-card"} --><div class="wp-block-group lc-card"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt=""/><figcaption class="wp-element-caption">Offers</figcaption></figure><!-- /wp:image -->
<!-- wp:paragraph {"className":"lc-price"} --><p class="lc-price">from <strong>89 €</strong></p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3} --><h3>A weekend in the countryside</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Two nights with breakfast and a dinner.</p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/offers"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/offers">Discover</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->
</div><!-- /wp:group -->
\`\`\`

An event:

\`\`\`html
<!-- wp:group {"className":"lc-events"} --><div class="wp-block-group lc-events">
<!-- wp:group {"className":"lc-event"} --><div class="wp-block-group lc-event"><!-- wp:paragraph {"className":"lc-date"} --><p class="lc-date"><strong>14</strong>June</p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --><h3>Dinner in the garden</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Lanterns, a set menu and music.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group -->
\`\`\`

Style: calm, family-run, a sense of history; real photos of the house, the garden and the dining room;
short texts with a few words in bold. Alternate plain text with an lc-band or lc-dark box; use lc-where on
the contacts page. The footer is the "Footer" area (Appearance → Areas): two or three columns with the
address, phone and hours work well. The phone number, the booking button and the line under the name
("Since 1887") are in Customize.`;
