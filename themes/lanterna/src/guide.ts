/** How to build pages with Lanterna, for AI assistants connected through MCP. */
export const AI_GUIDE = `Lanterna is a theme for Asian and ethnic restaurants, takeaway and delivery: warm beige pages, a
main color (lantern red by default), heavy display titles, a full-screen photo opening, menu sections
with prices and spicy or vegetarian marks, white cards and photo panels.
A page is a stack of full-width **sections**: core/group blocks with \`"align":"full","tagName":"section"\`
and the class \`ln-section\` plus a background. A page whose first block is a section has no title: the
first section holds the h1. Simple pages (privacy, articles) can be plain blocks without sections.

| Class | On | Effect |
| --- | --- | --- |
| ln-section | group (align full, tagName section) | A section, content kept at 74rem |
| ln-bg-paper, ln-bg-white, ln-bg-accent, ln-bg-dark | the section | Beige (default), white, main color, dark |
| ln-center, ln-tight, ln-flush | the section | Centered text (h2 gets a red ornament under it) · less vertical space · no side padding |
| ln-hero (+ ln-left, ln-short) | section whose FIRST block is a core/image | The image fills the screen; a huge white title over it, centered at the bottom (left-aligned · shorter, for inner pages) |
| ln-kicker | paragraph before a heading | Small red uppercase line ("Since 1998", "Takeaway") |
| ln-title | heading | The red ornament under it |
| ln-lead · ln-display | paragraph | Larger intro text · a paragraph in the display font, very large |
| ln-split (+ ln-reverse) | core/columns: an image column and a text column | Photo and text side by side; several in a row alternate well |
| ln-photo, ln-round, ln-tall | core/image | Shadow · round · 4:5 portrait |
| ln-strip | group of core/image, or core/gallery | A row of 4 square rounded photos (2 on phones) |
| ln-cards (+ ln-cols-2, ln-cols-4, ln-spots) | group | Grid of white cards, 3 per row; ln-spots: small round illustrations, centered |
| ln-card | group inside ln-cards: core/image, h3, paragraph, buttons | A card; its first image fills the top |
| ln-features / ln-feature ln-i-ICON | group / groups inside it: h3 + paragraph | Features with an icon in a soft disc |
| ln-icon ln-i-ICON | paragraph or group (h3 + paragraph) | An icon disc on the left (contacts, hours) |
| ln-numbers / ln-number | group of groups / paragraph | Big figures over short labels ("120" "seats") |
| ln-menu (+ ln-cols-1) | group: h2 (category), optional paragraph, then ln-dish groups | A menu category: title with a red line, dishes in two columns |
| ln-dish (+ ln-spicy, ln-hot, ln-veg, ln-chef) | group: [optional core/image], h3 (name), paragraph (description), paragraph ln-price | A dish with its price on the right; marks after the name: chili, two chilis, leaf, star |
| ln-price | paragraph inside ln-dish | The price ("8.50 €") |
| ln-legend / ln-mark ln-spicy… | group / short paragraphs | A legend of the marks ("Spicy", "Vegetarian") |
| ln-lines | core/list | Lines with the value on the right (hours, set menus: "Lunch<strong>11:30–15:00</strong>") |
| ln-panel (+ ln-right) | group: core/image FIRST, then a core/group with h3, text, links or buttons | A large photo with a white box over it (takeaway, delivery, banquets) |
| ln-partners | core/buttons | Delivery or ordering services as white pills with an arrow (names only, no logos) |
| ln-quote · ln-reviews | quote · group of quotes | One large review · review cards with the name and five stars |
| ln-map | core/html or core/embed | A rounded map or video |
| ln-ornament | core/separator | Two short lines and a diamond in the main color |

Icons (ICON): dumpling, bowl, chopsticks, lantern, tea, wok, chili, leaf, scooter, bag, phone, chat,
clock, pin, mail, wifi, kids, people, cake, table, star, gift, calendar, card, parking, mobile, menu, fish.

Buttons: the default is the main color; "is-style-outline" for the secondary (on ln-hero it is white with
red text, like a "WhatsApp" button next to a red "Call" one). On ln-bg-accent buttons turn white.

The opening of a home page, in block markup:

\`\`\`html
<!-- wp:group {"className":"ln-section ln-hero","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:image {"id":"MEDIA_ID","sizeSlug":"full"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="The dining room"/></figure><!-- /wp:image -->
<!-- wp:heading {"level":1} --><h1>Name</h1><!-- /wp:heading -->
<!-- wp:paragraph --><p>Street 1, City · Open every day 12–15 and 18–23</p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"tel:+390000000"} --><div class="wp-block-button"><a class="wp-block-button__link" href="tel:+390000000">Call: 000 000</a></div><!-- /wp:button -->
<!-- wp:button {"className":"is-style-outline","url":"https://wa.me/390000000"} --><div class="wp-block-button is-style-outline"><a class="wp-block-button__link" href="https://wa.me/390000000">Book on WhatsApp</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</section><!-- /wp:group -->
\`\`\`

A menu category with two dishes:

\`\`\`html
<!-- wp:group {"className":"ln-section ln-bg-white","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:group {"className":"ln-menu"} --><div class="wp-block-group ln-menu">
<!-- wp:heading --><h2>Dumplings</h2><!-- /wp:heading -->
<!-- wp:group {"className":"ln-dish ln-spicy"} --><div class="wp-block-group ln-dish ln-spicy"><!-- wp:heading {"level":3} --><h3>Chili oil wontons</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Pork and ginger, black vinegar, chili oil.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ln-price"} --><p class="ln-price">8.50 €</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"className":"ln-dish ln-veg"} --><div class="wp-block-group ln-dish ln-veg"><!-- wp:heading {"level":3} --><h3>Vegetable gyoza</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Cabbage, mushrooms and chives, pan-fried.</p><!-- /wp:paragraph --><!-- wp:paragraph {"className":"ln-price"} --><p class="ln-price">7.00 €</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

Takeaway as a photo panel:

\`\`\`html
<!-- wp:group {"className":"ln-panel"} --><div class="wp-block-group ln-panel"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt=""/></figure><!-- /wp:image -->
<!-- wp:group --><div class="wp-block-group"><!-- wp:heading {"level":3} --><h3>Takeaway</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Order by phone and pick it up hot.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p><a href="/menu">See the menu</a></p><!-- /wp:paragraph --></div><!-- /wp:group --></div><!-- /wp:group -->
\`\`\`

Style: appetizing photos, short texts, prices always visible. A home page works well as: ln-hero; a
centered welcome section with ln-strip of four dishes; ln-cards ln-spots ("why choose us"); two or three
ln-split rows about the rooms and the cooking; a section with ln-panel blocks for takeaway and delivery
and ln-partners; ln-reviews; a ln-bg-accent call to book. The menu page: one ln-menu per category, with
a ln-legend at the top. The footer is the "Footer" area (Appearance → Areas): columns with the address,
the opening hours and links work well. The menu button, the phone, WhatsApp and the bar on phones are in
Customize. The site can have several languages (Multilingual): titles in Chinese, Japanese or Korean use a
bold system font automatically.`;
