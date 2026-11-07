# Taccuino — news and magazine theme for Cleitext

A theme for news sites, online magazines, sports and culture blogs: a white header with the logo, the main menu
(each item can have an emoji before its label) and a search panel; the latest article opening the home page over
its photo, then cards of the others; articles with a sidebar of the latest ones and share buttons; category, tag,
author and search pages; a category shown as a colored band of players (a podcast, a video series); a light footer
with the logo, a short text, the social profiles and two menus with their titles.

Install it from **Appearance → Themes → Add New** (Cleitext catalog), or build and install it from this folder:

```bash
cleitext theme:install themes/taccuino --build
```

It comes with the plugin **Taccuino Blocks** (installed and activated with the theme), which adds two blocks.

## Customize

- **Site identity**: logo, site icon, the title of the search panel.
- **Colors and fonts**: main color (links, buttons, the menu underline), highlight (hover, the band), text,
  secondary text, footer background; the fonts of the titles and of the text, by their Google Fonts name (Cleitext
  keeps a copy of them on the site, so visitors never reach Google). Three ready styles.
- **Top bar**: a thin colored bar above the header with a text and a link (empty: no bar).
- **Lists and articles**: the words of the excerpts, the "load more" label, the title of the latest articles in the
  sidebar, the share buttons (WhatsApp on phones, Facebook, Twitter, LinkedIn) and the Twitter account for "via".
  **Tag of the entries hidden from the lists**: articles with that tag stay at their address but are left out of
  the home page, category and tag lists (sponsored articles reached from their landing page).
- **Band category**: the category (slug) whose page is a colored band of players, its logo and title.
- **Footer**: logo, text, titles of the two footer menus, the copyright line (`{year}` is the current year), a
  partner ("Powered by …" with name, address and logo) and a credit logo with its link.
- **Social profiles**: Facebook, Twitter, X, Instagram, YouTube, LinkedIn, TikTok, Telegram, Spotify.
- **Page not found**: image, title and text.

**Menus**: *Main menu*, *Footer menu 1* and *Footer menu 2*. In **Appearance → Menus** each item of the main menu
has an **Icon** option: an emoji shown before the label (🎧 Podcast).

**Areas** (Appearance → Areas): *Article sidebar* (above the latest articles: a partner banner, a separator),
*Band category page* (the players of the band category: by default the "Embeds of articles" block reading the
`embed_spotify` field) and *Footer* (above the copyright line).

## Blocks (Taccuino Blocks)

- **Articles**: the latest articles, or those of a category; "Big first" puts the first over its photo (the height
  of the screen) with the date, the categories, the title and the excerpt in white, then the cards. On phones it
  can show a list of its own length with a "load more" link. Options: how many, skip the first, the tag to leave
  out, the date format (PHP letters, as WordPress: `F j, Y`).
- **Embeds of articles**: the player saved in a field of the latest articles of a category (the embed code of a
  Spotify or Spreaker episode, a YouTube video), with date and title; as a colored band with a logo, a title and a
  button, or as a plain list (the band category page). Players are iframes of other sites: with the Privacy plugin
  they wait for the visitor's consent.

A typical home page is a page set as the front page (Settings → Reading) with an **Articles** block ("Big first",
4, 10 on phones) and an **Embeds of articles** band of the podcast category.

## For sites coming from WordPress

The markup follows the usual magazine themes made with Understrap/Bootstrap: cards 32% wide in a 1280 px column,
200 px images, the latest article over its photo at `100vh - 175px`, article column 70% and sidebar 30% in a
1400 px container, footer at 1280 px. Links keep WordPress's addresses with the WordPress Importer.

## License

GPL-2.0-or-later. Copyright (C) 2026 Serafino Christian. Brand icons: Font Awesome Free (CC BY 4.0, https://fontawesome.com/license/free).
