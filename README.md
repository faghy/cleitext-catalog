# Cleitext catalog

The official catalog of plugins and themes for [Cleitext](https://github.com/faghy/cleitext). Sites install them from the admin (**Plugins → Add New**, **Appearance → Themes → Add New**) and are told when an update is out.

- `catalog.config.json` lists the items: the official plugins shipped as separate packages with each Cleitext release, and the themes in `themes/`. Each plugin has a `category`, the group the admin lists it under: `editor` (Editor & builder), `seo`, `analytics` (Statistics), `shop` (E-commerce) or `tools`.
- `tools/build.mjs` builds each new theme version into its own release (`theme-<slug>-<version>`, never replaced), reads the plugins of the latest Cleitext release, and writes `catalog.json` with versions, compatibility, download addresses and SHA-256 checksums.
- `catalog.json` is signed with Ed25519 (`catalog.json.sig`); Cleitext ships the public key and refuses an index or a package that does not match.
- The workflow publishes both in the [`catalog` release](https://github.com/faghy/cleitext-catalog/releases/tag/catalog) on every push, every six hours and on demand.

To publish a new theme version, raise `version` in its `theme.json` and push. A new plugin version arrives with the next Cleitext release.

Everything here is free software under GPL-compatible licenses. Paid themes (see [docs/paid-themes.md](docs/paid-themes.md)) are GPL too: their source and packages live in a private repository, and the license buys downloads, updates and support from the Store on cleitext.com.
