# Paid themes in the catalog

Status:
- **Implemented** in Cleitext 0.23.0. Covers RF-CAT-03, plugin API 1.10, the Store 1.0.0 plugin and Showcase 1.1.0.
- **Implemented** in this repository's build and workflow.
- **Not live yet**. The first candidate is Vitality, whose source is now in the private repository: see [Going live](#going-live).

## Principles

1. **Pay for downloads, updates and support, not for running the theme.**
   - An installed theme never stops working: there are no checks while pages are rendered and no remote switch.
   - When a license ends, only new downloads and updates stop.
   - Pages keep their speed, and the site works offline.
2. **Same integrity as free themes.** Paid packages are in the same signed index, with their SHA-256. Only the download address needs a license.
3. **Nothing secret in the catalog.**
   - The key lives on the site, encrypted.
   - The store keeps only its SHA-256.
4. **A demo for everyone.** A paid theme can be installed without a license and tried with **Live Preview** on the site's own pages. Activating it needs a license for that site.
5. **Older Cleitext versions do not break.**
   - They ignore `paid`.
   - `requires` (the first version that knows paid items) lists the theme as incompatible there.

## Decisions taken (can still change)

| Question | Choice |
| --- | --- |
| Code license | **GPL + paid access**: the code is GPL like the rest of Cleitext; the price buys downloads, updates and support. The source lives in a private repository. |
| Price model | One-off purchase with **12 months of updates**, per site. Packs are variants with more sites: 1, 5, or 0 for no limit. Renewals are a separate variant. |
| Payment provider | **Lemon Squeezy**, a merchant of record: they handle EU VAT and invoices. Other providers fit the same `OrderEvent` (Store `providers.ts`). |
| License server | The **Store** plugin, run on cleitext.com. |
| Free themes | Canvas and Pulsar stay free. |

## How it works

```
 Buyer                 Customer site (Cleitext)        cleitext.com (Store plugin)       Lemon Squeezy
 ─────                 ────────────────────────        ───────────────────────────       ─────────────
 Buy ─────────────────────────────────────────────────────────────────────────────────▶ checkout
                                                         ◀── webhook order_created (signed)
                                                         key emailed (stored as SHA-256)
 Add New → Install the demo ─▶ POST download-token {demo} ▶ signed address (5 min)
                               GET address → 302 to the private GitHub release
                               SHA-256 = signed catalog? → installed; Live Preview only
 Enter license key ──────────▶ POST activate {key, slug, siteOrigin, siteId}
                               ◀── activation token, updates until, seats
 Activate theme (no network: the license is stored for the site)
 Update ─────────────────────▶ POST download-token {activation, version}
                               ◀── address, or 402 "renew to update" when the version
                                   was released after the updates the license includes
```

### Catalog (`catalog.config.json`)

A paid item adds `paid`, `requires` and, for a private source, `"source": "private"`:

```json
{
  "type": "theme",
  "slug": "vitality",
  "name": "Vitality",
  "summary": { "en": "…", "it": "…" },
  "tags": ["business", "multipurpose"],
  "requires": ">=0.23.0",
  "source": "private",
  "paid": {
    "price": { "amount": 59, "currency": "EUR", "per": "site" },
    "updatesMonths": 12,
    "purchaseUrl": "https://cleitext.com/store/vitality",
    "licenseServer": "https://cleitext.com/api/v1/ext/store/v1"
  },
  "icon": "assets/vitality.svg",
  "screenshots": ["assets/vitality.png"]
}
```

`tools/build.mjs` handles paid items like this:
- It builds the theme from `private/themes/<slug>`, the checkout of `faghy/cleitext-catalog-private`.
- It checks that `theme.json` has the same `paid.licenseServer`.
- It puts the zip in a release of the private repository (`theme-<slug>-<version>`, never replaced), using `CATALOG_PRIVATE_TOKEN`.
- In the signed index it writes the usual version, SHA-256 and size. The download address points to the license server, the homepage to the purchase page, and it adds `paid`.

The workflow clones the private repository only when the `CATALOG_PRIVATE_TOKEN` secret is set. Without the secret, nothing changes for free items.

### Theme (`theme.json`)

```json
"paid": {
  "licenseServer": "https://cleitext.com/api/v1/ext/store/v1",
  "purchaseUrl": "https://cleitext.com/store/vitality"
}
```

An installed theme carries this field, so the site knows where to activate the key even when the theme is no longer in the catalog.

### Cleitext (core)

- **Schema.** `catalogItemSchema.paid` (optional) and `themeManifestSchema.paid`.
- **License keys.** 25 Crockford base32 characters with a Luhn mod 32 check character, so a mistyped key is caught before the server is asked.
- **Licenses.** One per theme and site.
  - API: `GET /api/v1/licenses`, `PUT /api/v1/licenses/:slug {key}`, `POST /api/v1/licenses/:slug/refresh`, `DELETE /api/v1/licenses/:slug`. They need `manage_themes`.
  - The key and the activation token are stored encrypted (AES-256-GCM, from `APP_SECRET`).
- **Activation.** A paid theme can be activated only on a site with a stored license. This check is local: there is no network call.
- **Install and update.** `CatalogService.install` asks the license server for a short-lived address, which is the demo when the site has no license. It then checks the SHA-256 exactly as for free items.
- **Renewals.** When the update was released after the license's updates, the catalog item says `renew` and the admin shows *Renew to update*.
- **Live Preview.** `POST /api/v1/themes/:slug/preview` shows the site's pages with any installed theme.
- **Server unreachable.** Installed themes keep working; only activation of new keys, refreshes and downloads wait.
- **Showcase** (cleitext.com/themes) shows the price and **Buy** instead of Download.

### License server (Store plugin)

Endpoints are under `https://cleitext.com/api/v1/ext/store/v1`. They are webhook routes of plugin API 1.10: anonymous, with no origin check, and limited per IP address.

- `POST /activate` `{key, slug, siteOrigin, siteId}` returns `{activation, updatesUntil, seats, renewUrl}`.
  - Seats are counted by site origin.
  - The same site again keeps its seat.
  - A full license answers 409.
- `POST /deactivate` `{activation}` frees the seat.
- `POST /status` `{activation}` returns `{status, updatesUntil, seats, renewUrl}`. This is a POST, so the token never appears in URLs or logs.
- `POST /download-token`:
  - with `{activation, slug, version}`, it returns `{url, updatesUntil}`, or 402 when the version's release date is after `updatesUntil`;
  - with `{demo: true, slug, version, siteOrigin}`, it returns the demo address, when the product offers a demo.
- `GET /download/:slug/:version?ref&exp&sig` checks the HMAC signature, which is valid for 5 minutes, then redirects to GitHub's short-lived address for the private asset.
- `POST /webhooks/lemonsqueezy` checks the `X-Signature` HMAC over the raw body, then:
  - `order_created`, new license variant: creates the license and emails the key. A retried webhook creates nothing new.
  - `order_created`, renewal variant: extends the license named in `checkout[custom][license]` from the end of its updates.
  - `order_refunded`: revokes the license. Sites keep the theme but get no more downloads.

The **Store** admin page covers:
- setup: the private repository, the GitHub token and the Lemon Squeezy secret, all encrypted;
- products and variants;
- licenses: search, licenses made by hand with the key shown once, extend, revoke or restore;
- each license's sites, with a way to free a seat;
- the latest downloads, demos included.

## Going live

1. ✅ **Release Cleitext 0.23.0.** It carries the paid items, Live Preview, plugin API 1.10, Store 1.0.0 and Showcase 1.1.0. cleitext.com and pulsar.faghy.it run it.
2. ✅ **Private repository.** `faghy/cleitext-catalog-private` holds `themes/vitality`, which is not in this public repository.
3. **Tokens.** Create a fine-grained token with *Contents: read and write* on the private repository and add it to this repository as the secret `CATALOG_PRIVATE_TOKEN`. On cleitext.com the Store needs only *read*.
4. **Store on cleitext.com.**
   - Upload `cleitext-plugin-store-<version>.zip` and activate it.
   - Settings → Store: repository `faghy/cleitext-catalog-private`.
   - Store: the GitHub token, product `vitality` (12 months, demo on, renewal checkout).
5. **Lemon Squeezy.**
   - Create the product with its variants (1 site, 5 sites, renewal) and register each variant id in Store.
   - Add a webhook to `https://cleitext.com/api/v1/ext/store/v1/webhooks/lemonsqueezy` (`order_created`, `order_refunded`) and copy its signing secret to Store.
   - Try it in test mode.
6. **Store page and terms** on cleitext.com (`/store/vitality`): price, what the license includes, refunds, and the link to the live demo site.
7. **Catalog.** Add the Vitality item above to `catalog.config.json` with its icon and screenshot, raise its version to 1.0.0, and push to `main`.

## Not done yet

- A live demo site, for example vitality.cleitext.com. It is only content, made with the theme.
- Paid plugins. The same fields would work, but plugins are built from the Cleitext release, so their packages would need the same private path.
- A buyer's account page on cleitext.com, to see and free one's own sites. Today the store admin does it on request.
