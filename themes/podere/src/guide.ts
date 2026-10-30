/** How to build pages with Podere, for AI assistants connected through MCP. */
export const AI_GUIDE = `Podere is a theme for farm stays, country houses and rural B&Bs: warm cream pages, a main color
(terracotta by default), serif titles, wave dividers between sections, rounded photos and line icons.
A page is a stack of full-width **sections**: core/group blocks with \`"align":"full","tagName":"section"\`
and the class \`pd-section\` plus a background. A page whose first block is a section has no title: the
first section holds the h1. Simple pages (privacy, articles) can be plain blocks without sections.

| Class | On | Effect |
| --- | --- | --- |
| pd-section | group (align full, tagName section) | A section, content kept at 72rem |
| pd-bg-cream, pd-bg-white, pd-bg-accent, pd-bg-dark | the section | Cream (default), white, main color, dark brown |
| pd-wave-top, pd-wave-bottom | the section | A soft wave in the section's color over the section above / below |
| pd-center, pd-tight | the section | Centered text (h2 gets a short line under it) · less vertical space |
| pd-hero | section whose FIRST block is a core/image | The image fills the section as a background; text over it, white |
| pd-kicker | paragraph before a heading | Small italic serif line ("Farm stay", "Welcome") |
| pd-title | heading | Display font with a short line under it |
| pd-lead | paragraph | Larger intro text |
| pd-split (+ pd-reverse) | core/columns: an image column and a text column | Photo and text side by side |
| pd-blob, pd-arch, pd-shadow | core/image | Organic round photo · arched photo · soft shadow |
| pd-cards (+ pd-cols-2, pd-cols-4, pd-wide-photos) | group | Grid of cards, 3 per row; tall photos (4:3 with pd-wide-photos) |
| pd-card (+ pd-boxed) | group inside pd-cards: core/image, h3, paragraph | A card; the image caption is written over the photo |
| pd-features | group | Row of features with round icons |
| pd-feature pd-i-ICON | group inside pd-features: h3 + paragraph | A feature with its icon in a disc |
| pd-icon pd-i-ICON | paragraph or group | A small icon disc before the content |
| pd-intro | core/columns | A title column next to a column of pd-features |
| pd-lines | core/list | Lines with the value on the right (hours, prices, distances: "Check-in<strong>15:00</strong>") |
| pd-quote | core/quote | One large review |
| pd-reviews | group of core/quote | Review cards with stars |
| pd-map | core/html or core/embed | A map or a video, rounded, full column width |

Icons (ICON): bed, fork, camper, beach, map, basket, leaf, hike, bike, star, sun, wine, olive, house,
pool, kids, paw, wifi, parking, clock, phone, mail, pin, heart, tree, egg.

Buttons: the default is the main color; "is-style-outline" for the secondary. On pd-hero, pd-bg-accent
and pd-bg-dark buttons turn cream.

The opening of a home page, in block markup:

\`\`\`html
<!-- wp:group {"className":"pd-section pd-hero","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:image {"id":"MEDIA_ID","sizeSlug":"full"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="The farm among the hills"/></figure><!-- /wp:image -->
<!-- wp:paragraph {"className":"pd-kicker"} --><p class="pd-kicker">Farm stay</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":1} --><h1>Name</h1><!-- /wp:heading -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/contacts"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/contacts">Book now</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</section><!-- /wp:group -->
\`\`\`

Services as cards, centered, with a wave over the section above:

\`\`\`html
<!-- wp:group {"className":"pd-section pd-center pd-wave-top","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Our services</h2><!-- /wp:heading -->
<!-- wp:group {"className":"pd-cards"} --><div class="wp-block-group pd-cards">
<!-- wp:group {"className":"pd-card"} --><div class="wp-block-group pd-card"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt=""/><figcaption class="wp-element-caption">Rooms</figcaption></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3>Rooms</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Two lines on what guests find.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

The surroundings, as features on the main color:

\`\`\`html
<!-- wp:group {"className":"pd-section pd-bg-accent pd-wave-top","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:columns {"className":"pd-intro"} --><div class="wp-block-columns pd-intro">
<!-- wp:column {"width":"35%"} --><div class="wp-block-column" style="flex-basis:35%"><!-- wp:heading --><h2>Around us</h2><!-- /wp:heading --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"pd-features"} --><div class="wp-block-group pd-features">
<!-- wp:group {"className":"pd-feature pd-i-beach"} --><div class="wp-block-group pd-feature pd-i-beach"><!-- wp:heading {"level":3} --><h3>The sea</h3><!-- /wp:heading --><!-- wp:paragraph --><p>A short walk away.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></div><!-- /wp:column --></div><!-- /wp:columns --></section><!-- /wp:group -->
\`\`\`

Style: calm and welcoming, real photos of the place, short texts; alternate cream and white sections,
put a pd-bg-accent section with features about the surroundings, and use waves (pd-wave-top) on
sections whose color differs from the one above. The footer is the "Footer" area (Appearance → Areas):
three columns with the logo and address, a map, and the opening hours work well. The Booking button
and the WhatsApp number are in Customize.`;
