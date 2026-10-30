/** How to build pages with Bistrot, for AI assistants connected through MCP. */
export const AI_GUIDE = `Bistrot is a theme for restaurants, bistrots, wine and cocktail bars: dark navy pages with gold
accents, Art Deco display titles (Poiret One) with a thin gold line under them, Cormorant Garamond
for dish names and italic lines, a full-height photo opening, a slanted gold band, arch patterns and
menus with prices. A page is a stack of full-width **sections**: core/group blocks with
\`"align":"full","tagName":"section"\` and the class \`bs-section\` plus a background. A page whose first
block is a section has no title: the first section holds the h1. Simple pages (privacy, articles) can
be plain blocks without sections.

| Class | On | Effect |
| --- | --- | --- |
| bs-section | group (align full, tagName section) | A section, content kept at 72rem |
| bs-bg-navy, bs-bg-deep, bs-bg-light, bs-bg-gold | the section | Navy (default), deeper navy, cream with dark text, gold with navy text |
| bs-arches | the section | Art Deco pattern of stacked arches over the navy |
| bs-band (+ bs-next-deep, bs-next-light) | the section | A slanted gold band at its bottom edge; the wedge under it takes the next section's color (navy, or deep / light) |
| bs-center, bs-tight | the section | Centered text (h2 gets a thin gold line under it) · less vertical space |
| bs-hero | section whose FIRST block is a core/image | The image fills the whole screen height as a background; text centered over it in gold |
| bs-kicker | paragraph before a heading | Small italic gold line ("Wine bar", "Since 1962") |
| bs-title | heading | Thin gold line under the heading |
| bs-lead | paragraph | Larger intro text |
| bs-statement | paragraph | One large, light line in the display font (a motto, a short manifesto) |
| bs-divider | core/separator | A short gold rule with a diamond in the middle |
| bs-split (+ bs-reverse) | core/columns: an image column and a text column | Photo and text side by side |
| bs-round, bs-arch, bs-frame | core/image | Round photo with soft faded edges · arch-topped photo · offset thin gold frame (combine with bs-arch) |
| bs-box | group | A box with a double gold border, like a printed menu card |
| bs-menu (+ bs-cols-2) | core/list | Menu lines: "Dish<strong>12 €</strong><em>description</em>"; dotted leaders to the price, description under it |
| bs-hours | core/list | Lines with the value on the right: "Monday<strong>Closed</strong>" |
| bs-cards (+ bs-cols-2, bs-cols-4) | group | Grid of cards, 3 per row |
| bs-card | group inside bs-cards: core/image, h3, paragraph, paragraph.bs-price | Arch-topped photo, name, description, price |
| bs-price | paragraph | A price between two short dashes, gold |
| bs-features | group | Row of features with gold line icons in a diamond |
| bs-feature bs-i-ICON | group inside bs-features: h3 + paragraph | A feature with its icon |
| bs-icon bs-i-ICON | paragraph or group | A small icon before the content |
| bs-quote | core/quote | One large review |
| bs-reviews | group of core/quote | Review boxes with stars |
| bs-map | core/html or core/embed | A map or a video in a thin gold frame |

Icons (ICON): cocktail, wine, bubbles, beer, coffee, fork, cloche, fish, cake, music, terrace, leaf, star,
calendar, clock, phone, mail, pin, gift, heart, wifi, paw.

Buttons: gold pills with navy text; "is-style-outline" for the secondary (gold outline). On bs-bg-light
and bs-bg-gold buttons turn navy.

The opening of a home page, with the gold band under it, in block markup:

\`\`\`html
<!-- wp:group {"className":"bs-section bs-hero bs-band","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:image {"id":"MEDIA_ID","sizeSlug":"full"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="The bar counter"/></figure><!-- /wp:image -->
<!-- wp:heading {"level":1} --><h1>Name</h1><!-- /wp:heading -->
<!-- wp:paragraph --><p>Timeless atmosphere, honest flavours</p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/contacts"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/contacts">Book a table</a></div><!-- /wp:button --><!-- wp:button {"url":"/menu","className":"is-style-outline"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link" href="/menu">Menu</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</section><!-- /wp:group -->
\`\`\`

A part of the menu in a framed card:

\`\`\`html
<!-- wp:group {"className":"bs-section bs-center","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:paragraph {"className":"bs-kicker"} --><p class="bs-kicker">From the kitchen</p><!-- /wp:paragraph -->
<!-- wp:heading --><h2>Our proposals</h2><!-- /wp:heading -->
<!-- wp:group {"className":"bs-box"} --><div class="wp-block-group bs-box"><!-- wp:heading {"level":3} --><h3>Starters</h3><!-- /wp:heading -->
<!-- wp:list {"className":"bs-menu"} --><ul class="bs-menu"><!-- wp:list-item --><li>Anchovies in lemon<strong>9 €</strong><em>Marinated overnight, with toasted bread</em></li><!-- /wp:list-item --></ul><!-- /wp:list -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

Cocktails as cards, over the arch pattern:

\`\`\`html
<!-- wp:group {"className":"bs-section bs-arches bs-center","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Signature cocktails</h2><!-- /wp:heading -->
<!-- wp:group {"className":"bs-cards"} --><div class="wp-block-group bs-cards">
<!-- wp:group {"className":"bs-card"} --><div class="wp-block-group bs-card"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3>Negroni</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Gin, bitter, red vermouth.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"bs-price"} --><p class="bs-price">10 €</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

Style: evening and refined, warm photos of the room, the counter and the dishes, short texts. Open with
a bs-hero bs-band section, alternate navy and bs-bg-deep sections, use one bs-arches section and one
bs-statement line as a pause, the menu in bs-box cards with bs-menu lists, the hours in a bs-hours
list. The footer is the "Footer" area (Appearance → Areas): address, hours and contacts in three
columns work well. The "Book a table" button, the short hours line and the WhatsApp number are in
Customize.`;
