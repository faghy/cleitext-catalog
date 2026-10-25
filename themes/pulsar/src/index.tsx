import {
  AuthorBox,
  BlockArea,
  defineTheme,
  EntryContent,
  FormattedDate,
  HeadTags,
  Image,
  Location,
  Menu,
  usePage,
  useThemeSettings,
  type LayoutProps,
  type Pagination,
  type PublicEntrySummary,
  type TemplateProps,
} from "@cleitext/theme-sdk";
import * as sdk from "@cleitext/theme-sdk";
import type { ReactNode } from "react";
import { strings } from "./strings.js";
import { AI_GUIDE } from "./guide.js";
import { css as themeCss, editorCss } from "./styles.js";

const FONTS =
  "https://fonts.bunny.net/css?family=space-grotesk:400,500,700|jetbrains-mono:400,600&display=swap";

/** Copy buttons on the commands of terminal blocks (.psx-term). */
const COPY_SCRIPT = `document.querySelectorAll('.psx-term pre').forEach(function(pre){var b=document.createElement('button');b.type='button';b.className='psx-copy';var l=document.documentElement.lang.indexOf('it')===0;b.textContent=l?'copia':'copy';b.addEventListener('click',function(){var t=pre.innerText.trim();navigator.clipboard&&navigator.clipboard.writeText(t).then(function(){b.textContent=l?'copiato ✓':'copied ✓';setTimeout(function(){b.textContent=l?'copia':'copy'},1600)})});pre.appendChild(b)});`;

/** Default site icon, inline so browsers do not request /favicon.ico. */
const ICON = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0b5cad"/><path d="M21.5 11.5a7 7 0 1 0 0 9" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg>',
)}`;

/** Pulsar: Aurora plus the dark sections of the Pulsar pages, built from blocks with psx-* classes. */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  accentColor?: string;
  showTagline?: boolean;
  showSearch?: boolean;
  footerText?: string;
  colorScheme?: string;
}

/**
 * The colour scheme of the site (Customize): `auto` follows the visitor's
 * system (the default), `light` and `dark` are fixed. Anything else is `auto`.
 */
export type ColorScheme = "auto" | "light" | "dark";
export function colorScheme(value: unknown): ColorScheme {
  return value === "light" || value === "dark" ? value : "auto";
}

/** The accent color, only where the scheme is light: dark keeps its own lighter accent. */
export function accentCss(accent: string, scheme: ColorScheme): string | null {
  if (scheme === "dark") return null;
  const rule = `:root { --accent: ${accent}; }`;
  return scheme === "light"
    ? rule
    : `@media (prefers-color-scheme: light) { ${rule} }`;
}

/** Only plain hex colors reach the stylesheet. */
const HEX = /^#[0-9a-f]{6}$/i;

/** The theme SDK's language switcher (Cleitext 0.83), read as optional: older cores do not have it. */
const SharedSwitcher = (
  sdk as unknown as {
    LanguageSwitcher?: (props: {
      placement?: string;
      hint?: { style?: "inline"; names?: "native"; flags?: boolean };
      className?: string;
      fallback?: ReactNode;
    }) => ReactNode;
  }
).LanguageSwitcher;

/** The language plugin's switcher in Pulsar's look (names side by side), else Pulsar's own list. */
function Languages({ fallback }: { fallback: ReactNode }) {
  if (typeof SharedSwitcher !== "function") return <>{fallback}</>;
  return (
    <SharedSwitcher
      placement="header"
      hint={{ style: "inline", names: "native", flags: false }}
      className="languages"
      fallback={fallback}
    />
  );
}

function Layout({ head, css, children }: LayoutProps) {
  const page = usePage();
  const t = strings(page.locale);
  const settings = useThemeSettings<Settings>();
  const logo = settings.logo ? page.media.get(settings.logo) : undefined;
  const favicon = settings.favicon
    ? page.media.get(settings.favicon)
    : undefined;
  const scheme = colorScheme(settings.colorScheme);
  const accent =
    settings.accentColor && HEX.test(settings.accentColor)
      ? accentCss(settings.accentColor, scheme)
      : null;
  return (
    <html lang={page.locale} data-color-scheme={scheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="color-scheme"
          content={scheme === "auto" ? "light dark" : scheme}
        />
        <link rel="icon" href={favicon?.url ?? ICON} />
        {favicon && <link rel="apple-touch-icon" href={favicon.url} />}
        <title>{head.title}</title>
        {head.description && (
          <meta name="description" content={head.description} />
        )}
        {head.robots && <meta name="robots" content={head.robots} />}
        {head.canonical && <link rel="canonical" href={head.canonical} />}
        {head.alternates.map((alt) => (
          <link
            key={alt.hreflang}
            rel="alternate"
            hrefLang={alt.hreflang}
            href={alt.href}
          />
        ))}
        {Object.entries(head.og).map(([property, content]) => (
          <meta key={property} property={property} content={content} />
        ))}
        <meta
          name="twitter:card"
          content={head.og["og:image"] ? "summary_large_image" : "summary"}
        />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link rel="stylesheet" href={FONTS} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {accent && <style dangerouslySetInnerHTML={{ __html: accent }} />}
        <HeadTags tags={head.tags} />
      </head>
      <body>
        <a className="skip-link" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className="site-header">
            <div className="container">
              <a className="site-title" href={page.urls.home}>
                {logo ? (
                  <img
                    className="site-logo"
                    src={logo.url}
                    alt={page.site.title}
                  />
                ) : (
                  page.site.title
                )}
                {settings.showTagline !== false && page.site.tagline && (
                  <span className="site-tagline">{page.site.tagline}</span>
                )}
              </a>
              {(page.menus.primary?.length ?? 0) > 0 && (
                <nav className="site-nav" aria-label={t.mainMenu}>
                  <Menu items={page.menus.primary!} />
                </nav>
              )}
              {settings.showSearch === true && (
                <form
                  className="search-form"
                  role="search"
                  action={page.urls.search}
                  method="get"
                >
                  <label className="visually-hidden" htmlFor="search-q">
                    {t.search}
                  </label>
                  <input
                    id="search-q"
                    type="search"
                    name="q"
                    placeholder={t.searchPlaceholder}
                  />
                  <button type="submit">{t.search}</button>
                </form>
              )}
              {page.locales.length > 1 && (
                <Languages
                  fallback={
                    <nav className="languages" aria-label={t.languages}>
                      <ul>
                        {page.locales.map((locale) => (
                          <li key={locale.code}>
                            <a
                              href={locale.url}
                              hrefLang={locale.code}
                              lang={locale.code}
                              aria-current={locale.current ? "true" : undefined}
                            >
                              {locale.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  }
                />
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="site-footer">
            <BlockArea name="footer" className="container footer-area" />
            <div className="container">
              {(page.menus.footer?.length ?? 0) > 0 && (
                <nav className="footer-nav" aria-label={t.footerMenu}>
                  <Menu items={page.menus.footer!} />
                </nav>
              )}
              <p>
                {settings.footerText ||
                  `© ${new Date().getFullYear()} ${page.site.title}`}{" "}
                · {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
              </p>
            </div>
          </footer>
        </Location>
        <script dangerouslySetInnerHTML={{ __html: COPY_SCRIPT }} />
      </body>
    </html>
  );
}

function Index(props: TemplateProps) {
  const page = usePage();
  const t = strings(page.locale);
  switch (props.kind) {
    case "entry": {
      const { entry } = props;
      const isArticle = entry.type === "article";
      // A visual editor (Fresco) may hide the title: then no header, and no second h1.
      const editorData = entry.document.editor?.data as
        | { hideTitle?: unknown; hideFeatured?: unknown; layout?: unknown }
        | undefined;
      const hideTitle = editorData?.hideTitle === true;
      // Nor the featured image when the editor asks, or on its full-width and canvas layouts.
      const hideFeatured =
        editorData?.hideFeatured === true ||
        editorData?.layout === "full" ||
        editorData?.layout === "canvas";
      return (
        <Location name="single" entry={entry}>
          <article className="entry">
            {!hideTitle && (
              <header className="page-header container">
                <h1>{entry.title}</h1>
                {isArticle && entry.publishedAt && (
                  <p className="entry-meta">
                    <FormattedDate iso={entry.publishedAt} />
                    {entry.author && (
                      <>
                        {" · "}
                        {entry.author.url ? (
                          <a href={entry.author.url} rel="author">
                            {entry.author.displayName}
                          </a>
                        ) : (
                          entry.author.displayName
                        )}
                      </>
                    )}
                  </p>
                )}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="entry-featured">
                <Image
                  media={entry.featuredImage}
                  eager
                  sizes="(min-width: 70rem) 70rem, 100vw"
                />
              </figure>
            )}
            <div className="entry-content">
              <EntryContent document={entry.document} />
            </div>
            {/* Categories and tags; plugins show their own taxonomies (a shop's path). */}
            {Object.keys(entry.terms).some(
              (x) => x === "category" || x === "tag",
            ) && (
              <footer className="entry-terms page-header">
                {Object.entries(entry.terms)
                  .filter(
                    ([taxonomy]) =>
                      taxonomy === "category" || taxonomy === "tag",
                  )
                  .map(([taxonomy, terms]) => (
                    <p key={taxonomy}>
                      {taxonomy === "category" ? t.categories : t.tags}:{" "}
                      {terms.map((term, i) => (
                        <span key={term.slug}>
                          {i > 0 && ", "}
                          <a href={term.url}>{term.name}</a>
                        </span>
                      ))}
                    </p>
                  ))}
              </footer>
            )}
          </article>
        </Location>
      );
    }
    case "archive":
      return (
        <Location name="archive">
          <div className="container">
            <header className="page-header">
              <h1>{props.title}</h1>
              {props.term?.description && <p>{props.term.description}</p>}
            </header>
            {props.author && <AuthorBox author={props.author} variant="page" />}
            <EntryList entries={props.entries} empty={t.nothingYet} />
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case "search":
      return (
        <Location name="archive">
          <div className="container">
            <header className="page-header">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
            </header>
            <EntryList
              entries={props.entries}
              empty={props.query ? t.noResults : t.typeToSearch}
            />
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case "404":
      return (
        <div className="container page-header">
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a href={page.urls.home}>{t.backHome}</a>
          </p>
        </div>
      );
    case "maintenance":
      return (
        <div className="container page-header">
          <h1>{t.maintenanceTitle}</h1>
          <p>{t.maintenanceText}</p>
        </div>
      );
  }
}

function EntryList({
  entries,
  empty,
}: {
  entries: PublicEntrySummary[];
  empty: string;
}) {
  if (entries.length === 0) return <p className="page-header">{empty}</p>;
  return (
    <ul className="entry-list">
      {entries.map((entry, index) => (
        <li key={entry.id} className="card">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 704px"
              />
            </a>
          )}
          {entry.publishedAt && (
            <p className="card-meta">
              <FormattedDate iso={entry.publishedAt} />
            </p>
          )}
          <h2>
            <a href={entry.url}>{entry.title}</a>
          </h2>
          {entry.highlight ? (
            <p>
              {entry.highlight.map((part, i) =>
                part.match ? (
                  <mark key={i}>{part.text}</mark>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </p>
          ) : (
            entry.excerpt && <p>{entry.excerpt}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function PageLinks({ pagination }: { pagination: Pagination }) {
  const t = strings(usePage().locale);
  if (pagination.totalPages <= 1) return null;
  return (
    <nav className="pagination" aria-label={t.pagination}>
      {pagination.prevUrl ? (
        <a href={pagination.prevUrl}>← {t.newer}</a>
      ) : (
        <span />
      )}
      <span>{t.pageOf(pagination.page, pagination.totalPages)}</span>
      {pagination.nextUrl ? (
        <a href={pagination.nextUrl}>{t.older} →</a>
      ) : (
        <span />
      )}
    </nav>
  );
}

export const theme = defineTheme({
  slug: "pulsar",
  name: "Pulsar",
  version: "1.1.0",
  description:
    "Aurora with the styles of the Pulsar pages (psx-* block classes).",
  menuLocations: { primary: "Main menu", footer: "Footer menu" },
  settings: [
    { name: "logo", type: "media", label: { en: "Logo", it: "Logo" } },
    {
      name: "favicon",
      type: "media",
      label: { en: "Site icon (favicon)", it: "Icona del sito (favicon)" },
      help: {
        en: "A square PNG, at least 512×512 px. Empty: the Cleitext mark.",
        it: "Un PNG quadrato, almeno 512×512 px. Vuoto: il marchio di Cleitext.",
      },
    },
    {
      name: "accentColor",
      type: "text",
      label: { en: "Accent color", it: "Colore principale" },
      help: { en: "Hexadecimal, e.g. #0b5cad", it: "Esadecimale, es. #0b5cad" },
      maxLength: 7,
    },
    {
      // A name other themes share (THEMES §9): the WordPress Importer sets it to `light`.
      name: "colorScheme",
      type: "select",
      label: { en: "Colour scheme", it: "Schema di colori" },
      help: {
        en: "Automatic follows the light or dark mode of each visitor’s device.",
        it: "Automatico segue la modalità chiara o scura del dispositivo di ogni visitatore.",
      },
      options: [
        { value: "auto", label: { en: "Automatic", it: "Automatico" } },
        { value: "light", label: { en: "Always light", it: "Sempre chiaro" } },
        { value: "dark", label: { en: "Always dark", it: "Sempre scuro" } },
      ],
      default: "auto",
    },
    {
      name: "showTagline",
      type: "boolean",
      label: { en: "Show the tagline", it: "Mostra il motto" },
      default: true,
    },
    {
      name: "showSearch",
      type: "boolean",
      label: { en: "Show the search box", it: "Mostra la ricerca" },
      default: false,
    },
    {
      name: "footerText",
      type: "text",
      label: { en: "Footer text", it: "Testo del piè di pagina" },
      maxLength: 200,
    },
  ],
  areas: { footer: "Footer" },
  templates: { index: Index },
  Layout,
  css: themeCss,
  editorCss,
  aiGuide: AI_GUIDE,
});

export default theme;
