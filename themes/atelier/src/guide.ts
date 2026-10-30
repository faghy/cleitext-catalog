/** How to build pages with Atelier, for AI assistants connected through MCP. */
export const AI_GUIDE = `Atelier is a portfolio theme for painters, illustrators, photographers and artisans: white and light
gray pages, Playfair Display titles, thin gold lines, framed artworks with soft shadows, a gallery of works
with title, year, technique and size under each picture, and a timeline of exhibitions.
A page is a stack of full-width **sections**: core/group blocks with \`"align":"full","tagName":"section"\`
and the class \`at-section\` (white by default, \`at-bg-paper\` for light gray). A page whose first block is
a section has no title: the first section holds the h1. Simple pages (privacy, articles) can be plain
blocks without sections.

| Class | On | Effect |
| --- | --- | --- |
| at-section | group (align full, tagName section) | A section, content kept at 74rem |
| at-bg-white, at-bg-paper, at-bg-dark | the section | White (default), light gray, dark (the titles color) |
| at-center, at-tight, at-line-top | the section | Centered text · less vertical space · a thin line on top |
| at-vline | the section, or a core/separator | A thin vertical gold line under the section's first h2 / the separator becomes that line |
| at-hero | section: FIRST block a core/image (the artwork), SECOND block a group (the card) | Framed artwork on the right with a translucent card overlapping it on the left; the h1 is the artist's name |
| at-hero at-reverse | same | Artwork on the left, card on the right |
| at-hero at-full | same | The image fills the section as a background; the card on the left |
| at-kicker | paragraph before a heading | Small spaced capitals in gold ("Painter", "Exhibitions") |
| at-years | paragraph | The years line under a name: "1951 – 2019", "Since 2004" |
| at-lead | paragraph | Larger intro text |
| at-title | heading | Gold serif title with a thin gold line under it |
| at-signature | paragraph | The name in large italic serif, like a signature (footer) |
| at-dropcap | paragraph | A big gold serif initial |
| at-prose | group of paragraphs | Long text flowing in newspaper columns (3 on wide screens) |
| at-frame, at-mat, at-shadow | core/image, or a group (applies to every image inside) | Thin dark frame · white passe-partout · deep shadow |
| at-paper | core/image | A tilted sheet of tinted paper behind the picture |
| at-artwork | core/columns: an image column and a text column | One artwork with its details beside it |
| at-specs | core/list | Details of a work: "<strong>Technique</strong>Oil on canvas", "<strong>Size</strong>80 × 100 cm" |
| at-works (+ at-cols-2, at-cols-4, at-square, at-portrait) | group | Gallery of works, 3 per row; pictures aligned on one line (or cropped square / 4:5) |
| at-work | group inside at-works: core/image, h3 (title), ONE paragraph | A work: the paragraph has line breaks — year, technique, size ("2021\\nOil on canvas\\n80 × 100 cm"); the first line is gold |
| at-hover | core/image, core/gallery, at-works or any group | The image caption slides up over the picture on hover (no lightbox) |
| at-strip | core/gallery or group of images | A row of works scrolling sideways, each in its own shape |
| at-timeline | core/list | Exhibitions/dates on a vertical gold line: "<strong>2024</strong>Title — Gallery, City" |
| at-events / at-event | group / groups inside: paragraph.at-kicker (date), h3, paragraph | Event cards with a gold line on top |
| at-icon at-i-ICON | paragraph or heading | A small gold icon before the line |
| at-quote | core/quote | The artist's statement, large and centered |

Icons (ICON): palette, brush, easel, frame, camera, vase, needle, chisel, calendar, ticket, book, award,
clock, phone, mail, pin.

Buttons: square, gold, small capitals; "is-style-outline" for the secondary.

The opening of a home page, in block markup:

\`\`\`html
<!-- wp:group {"className":"at-section at-hero","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:image {"id":"MEDIA_ID","sizeSlug":"full"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="Tides, oil on canvas"/></figure><!-- /wp:image -->
<!-- wp:group --><div class="wp-block-group"><!-- wp:paragraph {"className":"at-kicker"} --><p class="at-kicker">Painter</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":1} --><h1>First Last</h1><!-- /wp:heading -->
<!-- wp:paragraph {"className":"at-years"} --><p class="at-years">1951 – 2019</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</section><!-- /wp:group -->
\`\`\`

The biography, centered with the vertical gold line, text in columns:

\`\`\`html
<!-- wp:group {"className":"at-section at-center at-vline","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Biography</h2><!-- /wp:heading -->
<!-- wp:group {"className":"at-prose"} --><div class="wp-block-group at-prose"><!-- wp:paragraph {"className":"at-dropcap"} --><p class="at-dropcap">Born by the sea…</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>…</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</section><!-- /wp:group -->
\`\`\`

A gallery of works:

\`\`\`html
<!-- wp:group {"className":"at-section at-bg-paper at-center","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Works</h2><!-- /wp:heading -->
<!-- wp:group {"className":"at-works at-hover"} --><div class="wp-block-group at-works at-hover">
<!-- wp:group {"className":"at-work"} --><div class="wp-block-group at-work"><!-- wp:image {"id":"MEDIA_ID"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="Tides"/><figcaption class="wp-element-caption">Tides, 2021</figcaption></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3>Tides</h3><!-- /wp:heading --><!-- wp:paragraph --><p>2021<br>Oil on canvas<br>80 × 100 cm</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

Style: calm, lots of white space, the works are the protagonists; short texts. Alternate white and
light gray sections. One page per series or per work is fine (at-artwork with at-paper on the image and
at-specs beside it, then a "Browse all" button). The footer is the "Footer" area (Appearance → Areas):
the logo or the name on the left, and at-icon lines (e.g. at-i-palette "Visit the gallery", at-i-mail) on
the right work well. The contact button and the WhatsApp number are in Customize.`;
