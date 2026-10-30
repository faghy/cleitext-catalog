/** How to build pages with Clinica, for AI assistants connected through MCP. */
export const AI_GUIDE = `Clinica is a theme for dental studios, medical practices and physiotherapy centres: white pages,
light blue-gray sections, a main color (clinic blue by default), bold Montserrat titles in a dark teal,
cards with line icons. A page is a stack of full-width **sections**: core/group blocks with
\`"align":"full","tagName":"section"\` and the class \`cl-section\` plus a background. A page whose first
block is a section has no title: the first section holds the h1. Simple pages (privacy, articles) can be
plain blocks without sections.

| Class | On | Effect |
| --- | --- | --- |
| cl-section | group (align full, tagName section) | A section, content kept at 74rem |
| cl-bg-white, cl-bg-soft, cl-bg-blue, cl-bg-ink, cl-bg-gradient | the section | White (default), light blue-gray, strong blue, dark teal, gradient of the main color |
| cl-center, cl-tight | the section | Centered text (h2 gets a short line under it) · less vertical space |
| cl-hex (+ cl-hex-left) | the section | Hexagons in the main color in the bottom-right (left) corner |
| cl-hero | section whose FIRST block is a core/image | The image fills the section, darkened; text over it, white |
| cl-label | paragraph before the h1 of a hero | A small label box ("Over 25 years") |
| cl-hours | group | The hours card: translucent main color; an h3 + phone line, then each h4 is a label between two lines (Morning, Afternoon) followed by a paragraph with the hours |
| cl-ico cl-i-ICON | heading or paragraph | A line icon before the text (white inside cl-hours and dark sections) |
| cl-kicker · cl-title · cl-lead · cl-small | paragraph · h2 · paragraph · paragraph | Small uppercase line · h2 with a short line under it · larger text · small gray text |
| cl-split (+ cl-reverse) | core/columns | Photo and text side by side, centered vertically |
| cl-duo | group with two core/image | A large photo with a smaller one over its bottom-right corner |
| cl-photo | image | Soft shadow |
| cl-treatments (+ cl-cols-3/4/5, cl-rows) / cl-treatment cl-i-ICON | group / groups with an h3 and a paragraph | Treatment cards with a line icon on top (cl-rows: icon at the left) |
| cl-checks (+ cl-cols-2) | list | Lines with a check mark |
| cl-steps | ordered list, each item "<strong>Title</strong> text" | Numbered step cards |
| cl-stats | core/columns, each column: a number paragraph, then a label paragraph | Big numbers in a row |
| cl-team / cl-member | group / groups: image, h3 name, paragraph role, paragraph text | Team cards with portrait and role |
| cl-reviews | group of core/quote (citation = the name) | Review cards with the name and five stars |
| cl-faq | group of Custom HTML \`<details><summary>Question</summary><p>Answer</p></details>\`, or h3 + paragraph pairs | Questions that open, in a white box |
| cl-note | group or paragraph | A highlighted note with a line at the left |
| cl-lines | list, each item "Label<strong>value</strong>" | Lines with the value on the right (hours, prices) |
| cl-box | group | A white box (contacts beside a map) |
| cl-map | Custom HTML or Embed | A rounded map or video |

Icons (cl-i-…): tooth, clean, implant, braces, smile, sparkle, xray, laser, shield, syringe, stethoscope,
heart, spine, bone, hand, eye, child, calendar, clock, phone, mail, pin, user, team, chat, check, award,
card, access, parking, cross, pill.

Buttons: the default is the main color; "is-style-outline" for the secondary. On cl-hero and dark
sections buttons turn white.

The opening of a home page, in block markup (photo, label, title on the left; hours card on the right):

\`\`\`html
<!-- wp:group {"className":"cl-section cl-hero","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:image {"id":"MEDIA_ID","sizeSlug":"full"} --><figure class="wp-block-image"><img src="MEDIA_URL" alt="The treatment room"/></figure><!-- /wp:image -->
<!-- wp:columns --><div class="wp-block-columns">
<!-- wp:column {"width":"60%"} --><div class="wp-block-column" style="flex-basis:60%"><!-- wp:paragraph {"className":"cl-label"} --><p class="cl-label">Over 25 years of care</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":1} --><h1>Healthy smiles, treatments made for you</h1><!-- /wp:heading -->
<!-- wp:buttons --><div class="wp-block-buttons"><!-- wp:button {"url":"/contacts"} --><div class="wp-block-button"><a class="wp-block-button__link" href="/contacts">Book a visit</a></div><!-- /wp:button --></div><!-- /wp:buttons --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:group {"className":"cl-hours"} --><div class="wp-block-group cl-hours">
<!-- wp:heading {"level":3,"className":"cl-ico cl-i-phone"} --><h3 class="cl-ico cl-i-phone">Book a visit</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p><a href="tel:+390000000">+39 000 000 000</a></p><!-- /wp:paragraph -->
<!-- wp:heading {"level":3,"className":"cl-ico cl-i-clock"} --><h3 class="cl-ico cl-i-clock">Opening hours</h3><!-- /wp:heading -->
<!-- wp:heading {"level":4} --><h4>Morning</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Mon–Fri 9:00 – 13:00</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":4} --><h4>Afternoon</h4><!-- /wp:heading --><!-- wp:paragraph --><p>Mon–Thu 15:00 – 19:00</p><!-- /wp:paragraph -->
</div><!-- /wp:group --></div><!-- /wp:column --></div><!-- /wp:columns --></section><!-- /wp:group -->
\`\`\`

Treatments on the strong blue, centered:

\`\`\`html
<!-- wp:group {"className":"cl-section cl-bg-blue cl-center","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Our treatments</h2><!-- /wp:heading -->
<!-- wp:group {"className":"cl-treatments cl-cols-4"} --><div class="wp-block-group cl-treatments cl-cols-4">
<!-- wp:group {"className":"cl-treatment cl-i-clean"} --><div class="wp-block-group cl-treatment cl-i-clean"><!-- wp:heading {"level":3} --><h3>Hygiene and prevention</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Regular check-ups and cleaning for lasting oral health.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

A FAQ:

\`\`\`html
<!-- wp:group {"className":"cl-section cl-bg-soft cl-center","align":"full","tagName":"section"} -->
<section class="wp-block-group"><!-- wp:heading --><h2>Frequently asked questions</h2><!-- /wp:heading -->
<!-- wp:group {"className":"cl-faq"} --><div class="wp-block-group cl-faq">
<!-- wp:html --><details><summary>Does the first visit cost anything?</summary><p>The first check-up is free.</p></details><!-- /wp:html -->
</div><!-- /wp:group --></section><!-- /wp:group -->
\`\`\`

Style: calm, clear and reassuring; short texts, real photos of the practice and of the team (no stock
smiles), a precise phone number and opening hours. Alternate white and cl-bg-soft sections, put the
treatments on cl-bg-blue, and close the home page with a cl-bg-gradient call to action. Medical
claims must stay factual: no promises of results. The footer is the "Footer" area (Appearance → Areas):
three or four columns with the address, the opening hours and the contacts work well. The appointment
button, the phone number (call button on phones) and the contact strip are in Customize.`;
