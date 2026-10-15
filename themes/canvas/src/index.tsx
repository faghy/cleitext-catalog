import {
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
} from '@cleitext/theme-sdk';
import { strings } from './strings.js';
import { AI_GUIDE } from './guide.js';
import { css as themeCss, editorCss } from './styles.js';

/**
 * Canvas: a page-builder theme in the spirit of Elementor, made of blocks.
 * Pages are stacks of full-width sections (groups with `cv-*` classes, best
 * inserted from the site's patterns); everything stays editable in the block
 * editor. No JavaScript on the public site: the mobile menu is a <details>.
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  accentColor?: string;
  showTagline?: boolean;
  footerText?: string;
}

const FONTS =
  'https://fonts.bunny.net/css?family=inter:400,500,600,700,800|jetbrains-mono:400,600&display=swap';
const HEX = /^#[0-9a-f]{6}$/i;

/** The Cleitext mark, the default logo and site icon (unless the favicon setting is set). */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#0369a1"/><path d="M38.5 22.5 A13.5 13.5 0 1 0 38.5 41.5" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><rect x="43" y="19" width="5" height="26" rx="2.5" fill="#7dd3fc"/></svg>`;
const ICON = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

function Layout({ head, css, children }: LayoutProps) {
  const page = usePage();
  const t = strings(page.locale);
  const settings = useThemeSettings<Settings>();
  const logo = settings.logo ? page.media.get(settings.logo) : undefined;
  const favicon = settings.favicon ? page.media.get(settings.favicon) : undefined;
  const accent = settings.accentColor && HEX.test(settings.accentColor) ? settings.accentColor : null;
  const primary = page.menus.primary ?? [];
  const languages =
    page.locales.length > 1 ? (
      <ul className="cv-langs" aria-label={t.languages}>
        {page.locales.map((locale) => (
          <li key={locale.code}>
            <a
              href={locale.url}
              hrefLang={locale.code}
              lang={locale.code}
              aria-current={locale.current ? 'true' : undefined}
              title={locale.name}
            >
              {locale.code.slice(0, 2).toUpperCase()}
            </a>
          </li>
        ))}
      </ul>
    ) : null;

  return (
    <html lang={page.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={favicon?.url ?? ICON} />
        {favicon && <link rel="apple-touch-icon" href={favicon.url} />}
        <title>{head.title}</title>
        {head.description && <meta name="description" content={head.description} />}
        {head.robots && <meta name="robots" content={head.robots} />}
        {head.canonical && <link rel="canonical" href={head.canonical} />}
        {head.alternates.map((alt) => (
          <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
        ))}
        {Object.entries(head.og).map(([property, content]) => (
          <meta key={property} property={property} content={content} />
        ))}
        <meta name="twitter:card" content={head.og['og:image'] ? 'summary_large_image' : 'summary'} />
        <meta name="theme-color" content="#ffffff" />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link rel="stylesheet" href={FONTS} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {accent && <style dangerouslySetInnerHTML={{ __html: `:root{--cv-brand:${accent}}` }} />}
        <HeadTags tags={head.tags} />
      </head>
      <body>
        <a className="cv-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className="cv-header">
            <div className="cv-wrap cv-header-row">
              <a className="cv-brand" href={page.urls.home}>
                {logo ? (
                  <img className="cv-logo" src={logo.url} alt={page.site.title} />
                ) : (
                  <>
                    <span className="cv-mark" dangerouslySetInnerHTML={{ __html: MARK }} />
                    <span className="cv-sitename">{page.site.title}</span>
                  </>
                )}
              </a>
              {settings.showTagline === true && page.site.tagline && (
                <span className="cv-tagline">{page.site.tagline}</span>
              )}
              {/* Wide screens: a bar. Small screens: a panel that opens without JavaScript. */}
              <div className="cv-desktop">
                {primary.length > 0 && (
                  <nav className="cv-nav" aria-label={t.mainMenu}>
                    <Menu items={primary} />
                  </nav>
                )}
                {languages}
              </div>
              {(primary.length > 0 || languages) && (
                <details className="cv-menu cv-mobile">
                  <summary>
                    <span className="cv-burger" aria-hidden="true" />
                    <span className="cv-sr">{t.menu}</span>
                  </summary>
                  <div className="cv-panel">
                    {primary.length > 0 && (
                      <nav className="cv-nav" aria-label={t.mainMenu}>
                        <Menu items={primary} />
                      </nav>
                    )}
                    {languages}
                  </div>
                </details>
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="cv-footer">
            <BlockArea name="footer" className="cv-wrap cv-footer-area" />
            <div className="cv-wrap cv-footer-bottom">
              {(page.menus.footer?.length ?? 0) > 0 && (
                <nav aria-label={t.footerMenu}>
                  <Menu items={page.menus.footer!} />
                </nav>
              )}
              <p>
                {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} · {t.poweredBy}{' '}
                <a href="https://cleitext.com">Cleitext</a>
              </p>
            </div>
          </footer>
        </Location>
      </body>
    </html>
  );
}

function Index(props: TemplateProps) {
  const page = usePage();
  const t = strings(page.locale);
  switch (props.kind) {
    case 'entry': {
      const { entry } = props;
      const isPost = entry.type === 'article' || entry.type === 'post';
      return (
        <Location name="single" entry={entry}>
          <article className="cv-entry">
            <header className="cv-page-header cv-wrap">
              {isPost && entry.publishedAt && (
                <p className="cv-meta">
                  <FormattedDate iso={entry.publishedAt} />
                  {entry.author && ` · ${entry.author.displayName}`}
                </p>
              )}
              <h1>{entry.title}</h1>
              {isPost && entry.excerpt && <p className="cv-page-lead">{entry.excerpt}</p>}
            </header>
            {entry.featuredImage && (
              <figure className="cv-featured cv-wrap">
                <Image media={entry.featuredImage} eager sizes="(min-width: 72rem) 72rem, 100vw" />
              </figure>
            )}
            <div className="entry-content">
              <EntryContent document={entry.document} />
            </div>
          </article>
        </Location>
      );
    }
    case 'archive':
      return (
        <Location name="archive">
          <div className="cv-listing">
            <header className="cv-page-header cv-wrap">
              <h1>{props.title}</h1>
              {props.description && <p className="cv-page-lead">{props.description}</p>}
            </header>
            <EntryList entries={props.entries} empty={t.nothingYet} more={t.readMore} />
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case 'search':
      return (
        <Location name="archive">
          <div className="cv-listing">
            <header className="cv-page-header cv-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="cv-search" role="search" action={page.urls.search} method="get">
                <label className="cv-sr" htmlFor="cv-q">
                  {t.search}
                </label>
                <input id="cv-q" type="search" name="q" defaultValue={props.query ?? ''} placeholder={t.searchPlaceholder} />
                <button type="submit">{t.search}</button>
              </form>
            </header>
            <EntryList entries={props.entries} empty={props.query ? t.noResults : t.typeToSearch} more={t.readMore} />
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case '404':
      return (
        <div className="cv-wrap cv-message">
          <p className="cv-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="cv-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="cv-wrap cv-message">
          <h1>{t.maintenanceTitle}</h1>
          <p>{t.maintenanceText}</p>
        </div>
      );
  }
}

function EntryList({
  entries,
  empty,
  more,
}: {
  entries: PublicEntrySummary[];
  empty: string;
  more: string;
}) {
  if (entries.length === 0) return <p className="cv-wrap cv-empty">{empty}</p>;
  return (
    <ul className="cv-wrap cv-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="cv-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="cv-post-image">
              <Image media={entry.image} alt="" eager={index === 0} sizes="(max-width: 760px) 100vw, 400px" />
            </a>
          )}
          <div className="cv-post-body">
            {entry.publishedAt && (
              <p className="cv-meta">
                <FormattedDate iso={entry.publishedAt} />
              </p>
            )}
            <h2>
              <a href={entry.url}>{entry.title}</a>
            </h2>
            {entry.highlight ? (
              <p>
                {entry.highlight.map((part, i) =>
                  part.match ? <mark key={i}>{part.text}</mark> : <span key={i}>{part.text}</span>,
                )}
              </p>
            ) : (
              entry.excerpt && <p>{entry.excerpt}</p>
            )}
            <a className="cv-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
              {more} →
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}

function PageLinks({ pagination }: { pagination: Pagination }) {
  const t = strings(usePage().locale);
  if (pagination.totalPages <= 1) return null;
  return (
    <nav className="cv-wrap cv-pages" aria-label={t.pagination}>
      {pagination.prevUrl ? <a href={pagination.prevUrl}>← {t.newer}</a> : <span />}
      <span>{t.pageOf(pagination.page, pagination.totalPages)}</span>
      {pagination.nextUrl ? <a href={pagination.nextUrl}>{t.older} →</a> : <span />}
    </nav>
  );
}

export const theme = defineTheme({
  slug: 'canvas',
  name: 'Canvas',
  version: '1.0.6',
  description:
    'A page-builder theme: full-width sections, cards, icons and ready-made patterns, edited with blocks.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settings: [
    { name: 'logo', type: 'media', label: { en: 'Logo', it: 'Logo' } },
    {
      name: 'favicon',
      type: 'media',
      label: { en: 'Site icon (favicon)', it: 'Icona del sito (favicon)' },
      help: {
        en: 'A square PNG, at least 512×512 px. Empty: the Cleitext mark.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: il marchio di Cleitext.',
      },
    },
    {
      name: 'accentColor',
      type: 'text',
      label: { en: 'Brand color', it: 'Colore del marchio' },
      help: { en: 'Hexadecimal, e.g. #0369a1', it: 'Esadecimale, es. #0369a1' },
      maxLength: 7,
    },
    {
      name: 'showTagline',
      type: 'boolean',
      label: { en: 'Show the tagline next to the logo', it: 'Mostra il motto accanto al logo' },
      default: false,
    },
    {
      name: 'footerText',
      type: 'text',
      label: { en: 'Footer text', it: 'Testo del piè di pagina' },
      maxLength: 200,
    },
  ],
  areas: { footer: 'Footer' },
  templates: { index: Index },
  Layout,
  css: themeCss,
  editorCss,
  aiGuide: AI_GUIDE,
});

export default theme;
