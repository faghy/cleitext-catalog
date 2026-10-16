/** How to build pages with Canvas, for AI assistants connected through MCP. */
export const AI_GUIDE = `Canvas is a page-builder theme: a page is a stack of full-width **sections**, each a
core/group with \`"align":"full","tagName":"section"\` and the class \`cv-section\` plus a background.
A page whose first block is a section has no title bar: the first section (the hero) holds the h1.
Posts and simple pages can also be plain blocks without sections.

The quickest way: read the site's patterns "Canvas · …" (get_pattern) and reuse their blocks,
changing texts and images. Otherwise build sections from these classes (in "className"):

| Class | On | Effect |
| --- | --- | --- |
| cv-section | group (align full, tagName section) | A section, content kept at 76rem |
| cv-bg-soft, cv-bg-gray, cv-bg-mesh, cv-bg-brand, cv-bg-dark | the section | Light blue, gray, soft gradients (good for heroes), brand blue, navy |
| cv-center, cv-tight, cv-dots | the section | Centered text · less space · dotted decoration |
| cv-hero | section containing core/columns | Opening: title, text, buttons left; image right |
| cv-eyebrow | paragraph | Small label above a title |
| cv-lead | paragraph | Larger intro text under a title |
| <strong> inside a heading | heading | Those words get the brand gradient |
| cv-cards (+ cv-cols-4, cv-cols-2, cv-plain) | group | Grid of cards, 3 per row |
| cv-card cv-i-ICON | group inside cv-cards, with an h3 and a paragraph | Card with an icon tile |
| cv-split (+ cv-reverse) | core/columns: an image column and a text column | Image and text side by side |
| cv-float, cv-shadow | core/image | Floating illustration · rounded photo with shadow |
| cv-steps / cv-step | group / groups with h3 + paragraph | Numbered steps |
| cv-stats + cv-number | core/columns; in each column a paragraph cv-number and a label | Big numbers |
| cv-checks | core/list | Green check marks |
| cv-quote | core/quote | Large quote |
| cv-terminal | core/code | Terminal window |
| cv-box | group | Highlighted white box (e.g. a download) |
| cv-faq | group of groups (h3 + paragraph each) | Questions in two columns |
| cv-pills | core/buttons | Small rounded links |
| cv-small | core/buttons | Smaller buttons on one row; long labels end with … (they wrap on phones) |

Icons (ICON): edit, blocks, plugin, palette, globe, layers, shield, rocket, refresh, code, users,
search, image, zap, heart, download, book, lock, chat, check, github.

Buttons: the default is the primary style; add "is-style-outline" to a core/button for the secondary.

A hero, in block markup:

\`\`\`html
<!-- wp:group {"className":"cv-section cv-hero cv-bg-mesh","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:columns --><div class="wp-block-columns">
<!-- wp:column --><div class="wp-block-column">
<!-- wp:paragraph {"className":"cv-eyebrow"} --><p class="cv-eyebrow">New</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":1} --><h1>Build faster. <strong>Look great.</strong></h1><!-- /wp:heading -->
<!-- wp:paragraph {"className":"cv-lead"} --><p class="cv-lead">One line that says why it matters.</p><!-- /wp:paragraph -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/download"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/download">Get started</a></div><!-- /wp:button --></div><!-- /wp:buttons -->
</div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:image {"id":"MEDIA_ID","className":"cv-float"} --><figure class="wp-block-image cv-float"><img src="MEDIA_URL" alt="What it shows"/></figure><!-- /wp:image --></div><!-- /wp:column -->
</div><!-- /wp:columns --></section><!-- /wp:group -->
\`\`\`

Cards, centered on a gray background:

\`\`\`html
<!-- wp:group {"className":"cv-section cv-center cv-bg-gray","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Why <strong>us</strong></h2><!-- /wp:heading -->
<!-- wp:group {"className":"cv-cards"} --><div class="wp-block-group cv-cards">
<!-- wp:group {"className":"cv-card cv-i-zap"} --><div class="wp-block-group cv-card cv-i-zap"><!-- wp:heading {"level":3} --><h3>Fast</h3><!-- /wp:heading --><!-- wp:paragraph --><p>One short sentence.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

Style: light and clean, few words and more images; alternate backgrounds between sections
(white, cv-bg-gray or cv-bg-soft), and end landing pages with a cv-bg-brand cv-center call to action.
Illustrations: upload them with upload_image, then use their id and url in core/image.
The last item of the main menu is shown as a button: make it the main call to action.`;
