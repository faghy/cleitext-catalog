/** How to build pages with Lido, for AI assistants connected through MCP. */
export const AI_GUIDE = `Lido is a theme for beach clubs, lidos and seaside lounges: an aerial photo of the beach that
fills the opening with a single "Book now" pill, a transparent header over it, soft wave edges, a
handwritten title with a widely letter-spaced line under it ("lounge beach"), sandy and white sections
and sea blues. A page is a stack of full-width **sections**: core/group blocks with
\`"align":"full","tagName":"section"\` and the class \`ld-section\` plus a background. A page whose first
block is a section has no title: the first section holds the h1. Simple pages (privacy, articles) can
be plain blocks without sections.

| Class | On | Effect |
| --- | --- | --- |
| ld-section | group (align full, tagName section) | A section, content kept at 72rem |
| ld-bg-sand, ld-bg-white, ld-bg-soft, ld-bg-blush, ld-bg-sea, ld-bg-dark | the section | Sand (default), white, pale sea, pale pink, sea color, deep sea |
| ld-wave-top, ld-wave-bottom | the section | A soft wave in the section's color over the section above / below |
| ld-center, ld-tight | the section | Centered text (h2 gets a small wave under it) · less vertical space |
| ld-hero (+ ld-plain, ld-short) | section whose FIRST block is a core/image | The image fills the section as a background; text and a pill button centered over it · no shade · lower |
| ld-band | core/image (align full) | A photo as wide as the page, between two sections |
| ld-script | heading | Large handwritten title (the name of the beach) |
| ld-spaced | paragraph right after ld-script | A widely letter-spaced lowercase line ("lounge beach") |
| ld-kicker | paragraph before a heading | Small uppercase spaced line in the sea color |
| ld-title | heading | Title with a small wave under it |
| ld-lead | paragraph | Larger intro text |
| ld-photos (+ ld-cols-2, ld-tall) | group of core/image | A row of 3 (2) photos with a deep shadow; portrait with ld-tall |
| ld-split (+ ld-reverse) | core/columns: an image column and a text column | Photo and text side by side |
| ld-shadow, ld-round | core/image | Deep shadow · round photo |
| ld-promos (+ ld-cols-2, ld-cols-4) | group | Grid of season promo boxes, 3 per row |
| ld-promo (+ ld-boxed, ld-highlight) | group inside ld-promos: core/image, h3, paragraph ld-price, paragraph, buttons | A promo: photo, uppercase title, price, button · white card · ringed |
| ld-events (+ ld-cols-2, ld-cols-4) | group | Grid of event cards (white cards) |
| ld-event | group inside ld-events: core/image, paragraph ld-badge (the date), h3, paragraph, buttons | An event with its date on the photo's corner |
| ld-badge | paragraph | A small pill label; right after a card's image it sits on the photo |
| ld-price | paragraph | A price in large sea-colored letters ("from <strong>€ 310</strong> a month") |
| ld-prices | core/table (with a header row) | Price list: sea header row, values on the right, striped rows |
| ld-lines | core/list | Lines with the value on the right (hours, prices: "Sunbed<strong>€ 12</strong>") |
| ld-features | group | Row of services with round line icons |
| ld-feature ld-i-ICON | group inside ld-features: h3 + paragraph | A service with its icon |
| ld-icon ld-i-ICON | paragraph or group | A small icon disc before the content |
| ld-quote | core/quote | One large review |
| ld-reviews | group of core/quote (optionally an h3 inside each quote) | Review cards with stars |
| ld-map | core/html or core/embed | A map or a video, rounded |

Icons (ICON): umbrella, sunbed, wave, sun, sunset, shower, cabin, cocktail, fork, fish, sup, canoe, swim,
volley, kids, paw, access, wifi, parking, music, party, ring, calendar, ticket, star, heart, clock, phone,
mail, pin.

Buttons: pills in the Buttons color; "is-style-outline" for the secondary. In ld-hero the button is a
sand-colored sign in the display font (keep ONE button there, "Book now"); on ld-bg-sea and ld-bg-dark
buttons turn sand.

The opening of a home page, in block markup (the aerial photo, one pill; the title comes right after,
in a sand section with a wave over the photo):

\`\`\`html
<!-- wp:group {"className":"ld-section ld-hero ld-plain","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:image {"id":"MEDIA_ID","sizeSlug":"full"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="The beach from above"/></figure><!-- /wp:image -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/booking"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/booking">Book now</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</section><!-- /wp:group -->
<!-- wp:group {"className":"ld-section ld-center ld-wave-top","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:paragraph {"className":"ld-kicker"} --><p class="ld-kicker">Welcome to</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":1,"className":"ld-script"} --><h1 class="ld-script">Name</h1><!-- /wp:heading -->
<!-- wp:paragraph {"className":"ld-spaced"} --><p class="ld-spaced">lounge beach</p><!-- /wp:paragraph -->
</section><!-- /wp:group -->
\`\`\`

Season promos:

\`\`\`html
<!-- wp:group {"className":"ld-section ld-center","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Low season promo</h2><!-- /wp:heading -->
<!-- wp:group {"className":"ld-promos"} --><div class="wp-block-group ld-promos">
<!-- wp:group {"className":"ld-promo"} --><div class="wp-block-group ld-promo"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3>March to May</h3><!-- /wp:heading --><!-- wp:paragraph {"className":"ld-price"} --><p class="ld-price">from <strong>€ 310</strong> a month</p><!-- /wp:paragraph --><!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/booking"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/booking">Book now</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

An event card (inside a ld-events group):

\`\`\`html
<!-- wp:group {"className":"ld-event"} --><div class="wp-block-group ld-event"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt=""/></figure><!-- /wp:image --><!-- wp:paragraph {"className":"ld-badge"} --><p class="ld-badge">Sat 14 June</p><!-- /wp:paragraph --><!-- wp:heading {"level":3} --><h3>Sunset aperitif</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Live music from 7 pm.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
\`\`\`

Style: bright and relaxed, real photos of the beach (an aerial one for the opening), short texts;
alternate sand and white sections, a ld-bg-blush or ld-bg-soft section for the restaurant or the events,
and use waves (ld-wave-top) on sections whose color differs from the one above. Prices go in a ld-prices
table on their own page. The footer is the "Footer" area (Appearance → Areas): three columns with the
address, the season and opening hours, and how to get there work well. The Booking button, the bottom
bar on phones and the WhatsApp number are in Customize.`;
