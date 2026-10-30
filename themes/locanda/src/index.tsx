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
} from '@cleitext/theme-sdk';
import * as sdk from '@cleitext/theme-sdk';
import type { ReactNode } from 'react';
import { strings } from './strings.js';
import { AI_GUIDE } from './guide.js';
import { css as themeCss, editorCss } from './styles.js';
import { NETWORKS, profiles, settingName, type Profile } from './social.js';

/**
 * Locanda: a classic theme for historic family hotels, inns and country restaurants. A white boxed
 * page, the name centered at the top with its founding year between two arrows, a deep green menu
 * bar with thin lines between the items, a framed opening photo, condensed uppercase titles with an
 * arrow under them, and a footer with a strip of grass. Pages are ordinary blocks with `lc-*`
 * classes. No JavaScript on the public site: the mobile menu is a <details>.
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  since?: string;
  nameStyle?: 'blackletter' | 'serif' | 'condensed';
  phone?: string;
  accentColor?: string;
  softColor?: string;
  darkColor?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  footerText?: string;
  footerStyle?: 'grass' | 'plain';
  socialPlacement?: 'both' | 'footer' | 'none';
}

const BASE_FONTS =
  'oswald:300,400,500,600|source-sans-3:400,400i,600,700|cormorant-garamond:500i,600';
const NAME_FONTS: Record<string, string> = { blackletter: '|unifrakturmaguntia:400' };
const HEX = /^#[0-9a-f]{6}$/i;

/** The default site icon: a hanging sign on its bracket, in the theme's colors. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0e4a32"/><path d="M14 14h36M20 14v8M44 14v8" stroke="#a9cfa6" stroke-width="3" stroke-linecap="round"/><ellipse cx="32" cy="36" rx="17" ry="14" fill="#fbfaf5"/><path d="M32 28c-5 0-7 4-7 7.5S28 44 32 44s7-5 7-8.5S37 28 32 28zM30 27.5l2-2.5 2 2.5" fill="#0e4a32"/></svg>`;
const ICON = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

/** The palette as CSS variables, only for the colors given as plain hex values. */
export function paletteCss(settings: Settings): string | null {
  const rules: string[] = [];
  const accent = settings.accentColor;
  if (accent && HEX.test(accent)) {
    rules.push(
      `--lc-accent:${accent}`,
      `--lc-accent-deep:color-mix(in srgb,${accent} 78%,#000)`,
      `--lc-tint:color-mix(in srgb,${accent} 7%,#fff)`,
    );
  }
  if (settings.softColor && HEX.test(settings.softColor)) {
    rules.push(
      `--lc-soft:${settings.softColor}`,
      `--lc-soft-2:color-mix(in srgb,${settings.softColor} 30%,#fff)`,
    );
  }
  if (settings.darkColor && HEX.test(settings.darkColor))
    rules.push(`--lc-dark:${settings.darkColor}`);
  return rules.length ? `:root{${rules.join(';')}}` : null;
}

/** tel: wants the digits and the leading +, without spaces. */
export function telUrl(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const digits = value.trim().replace(/[\s.()/-]/g, '');
  return /^\+?\d{5,16}$/.test(digits) ? `tel:${digits}` : null;
}

/** Icon links to the site's social profiles. */
function SocialLinks({ items, className }: { items: Profile[]; className: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <ul className={`lc-social ${className}`} aria-label={t.socialProfiles}>
      {items.map(({ network, url }) => (
        <li key={network.key}>
          <a
            href={url}
            target="_blank"
            rel="me noopener"
            aria-label={t.socialOn(page.site.title, network.label)}
            title={network.label}
          >
            <svg viewBox={network.viewBox} aria-hidden="true" focusable="false">
              <path fill="currentColor" d={network.d} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The theme SDK's language switcher (Cleitext 0.83), read as optional: older cores do not have it. */
const SharedSwitcher = (
  sdk as unknown as {
    LanguageSwitcher?: (props: {
      placement?: string;
      hint?: { style?: 'inline'; names?: 'code'; flags?: boolean };
      className?: string;
      fallback?: ReactNode;
    }) => ReactNode;
  }
).LanguageSwitcher;

/** The site's name in the chosen lettering, with the "since" line between two arrows. */
function Brand({ settings, footer = false }: { settings: Settings; footer?: boolean }) {
  const page = usePage();
  const logo = settings.logo && !footer ? page.media.get(settings.logo) : undefined;
  const since = typeof settings.since === 'string' ? settings.since.trim() : '';
  return (
    <a className={`lc-brand${footer ? ' lc-brand-foot' : ''}`} href={page.urls.home}>
      {logo ? (
        <img className="lc-logo" src={logo.url} alt={page.site.title} />
      ) : (
        <span className={`lc-sitename lc-name-${settings.nameStyle ?? 'blackletter'}`}>
          {page.site.title}
        </span>
      )}
      {since && (
        <span className="lc-since">
          <span>{since}</span>
        </span>
      )}
    </a>
  );
}

function Layout({ head, css, children }: LayoutProps) {
  const page = usePage();
  const t = strings(page.locale);
  const settings = useThemeSettings<Settings>();
  const favicon = settings.favicon ? page.media.get(settings.favicon) : undefined;
  const palette = paletteCss(settings);
  const fonts = `https://fonts.bunny.net/css?family=${BASE_FONTS}${
    settings.logo ? '' : (NAME_FONTS[settings.nameStyle ?? 'blackletter'] ?? '')
  }&display=swap`;
  const primary = page.menus.primary ?? [];
  const booking =
    typeof settings.bookingUrl === 'string' && settings.bookingUrl.trim()
      ? settings.bookingUrl.trim()
      : null;
  const phone = typeof settings.phone === 'string' ? settings.phone.trim() : '';
  const tel = telUrl(phone);
  const languages =
    page.locales.length > 1 ? (
      <ul className="lc-langs" aria-label={t.languages}>
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
  const languageSwitcher = (placement: string) =>
    languages && typeof SharedSwitcher === 'function' ? (
      <SharedSwitcher
        placement={placement}
        hint={{ style: 'inline', names: 'code', flags: false }}
        className="lc-langs"
        fallback={languages}
      />
    ) : (
      languages
    );
  const social = settings.socialPlacement === 'none' ? [] : profiles(settings);
  const headerSocial = settings.socialPlacement === 'both' ? social : [];
  const bookingButton = (className: string) =>
    booking && (
      <a className={`lc-book ${className}`} href={booking}>
        {settings.bookingLabel || t.book}
      </a>
    );
  const hasHeaderArea = (page.areas?.header?.blocks.length ?? 0) > 0;
  const topLine = phone || hasHeaderArea || headerSocial.length > 0 || languages || booking;
  const grass = settings.footerStyle !== 'plain';

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
        <meta
          name="twitter:card"
          content={head.og['og:image'] ? 'summary_large_image' : 'summary'}
        />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link rel="stylesheet" href={fonts} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {palette && <style dangerouslySetInnerHTML={{ __html: palette }} />}
        <HeadTags tags={head.tags} />
      </head>
      <body>
        <a className="lc-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className="lc-header">
            {topLine && (
              <div className="lc-wrap lc-top">
                <div className="lc-top-left">
                  {phone && (
                    <a
                      className="lc-phone"
                      href={tel ?? undefined}
                      aria-label={tel ? t.callUs(phone) : undefined}
                    >
                      {phone}
                    </a>
                  )}
                  <BlockArea name="header" className="lc-header-area" />
                </div>
                <div className="lc-top-right">
                  {headerSocial.length > 0 && (
                    <SocialLinks items={headerSocial} className="lc-social-head" />
                  )}
                  {languageSwitcher('header')}
                  {bookingButton('')}
                </div>
              </div>
            )}
            <div className="lc-wrap lc-brand-row">
              <Brand settings={settings} />
            </div>
          </header>
          {primary.length > 0 && (
            <div className="lc-bar-wrap">
              <nav className="lc-wrap lc-bar lc-desktop" aria-label={t.mainMenu}>
                <Menu items={primary} />
              </nav>
              <details className="lc-wrap lc-bar lc-menu lc-mobile">
                <summary>
                  <span className="lc-burger" aria-hidden="true" />
                  <span>{t.menu}</span>
                </summary>
                <nav className="lc-panel" aria-label={t.mainMenu}>
                  <Menu items={primary} />
                  {languageSwitcher('mobile')}
                </nav>
              </details>
            </div>
          )}
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className={`lc-footer${grass ? ' lc-grass' : ''}`}>
            <div className="lc-wrap lc-footer-main">
              <BlockArea name="footer" className="lc-footer-area" />
              <Brand settings={settings} footer />
            </div>
            <div className="lc-wrap lc-footer-bottom">
              {(page.menus.footer?.length ?? 0) > 0 && (
                <nav aria-label={t.footerMenu}>
                  <Menu items={page.menus.footer!} />
                </nav>
              )}
              <p>
                {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} ·{' '}
                {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
              </p>
              {social.length > 0 && <SocialLinks items={social} className="lc-social-foot" />}
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
      // A visual editor (Fresco) may hide the title: then no header, and no second h1.
      const editorData = entry.document.editor?.data as
        { hideTitle?: unknown; hideFeatured?: unknown; layout?: unknown } | undefined;
      const hideTitle = editorData?.hideTitle === true;
      const hideFeatured =
        editorData?.hideFeatured === true ||
        editorData?.layout === 'full' ||
        editorData?.layout === 'canvas';
      return (
        <Location name="single" entry={entry}>
          <article className={`lc-entry${isPost ? '' : ' lc-page'}`}>
            {!hideTitle && (
              <header className="lc-page-header lc-wrap">
                {isPost && entry.publishedAt && (
                  <p className="lc-meta">
                    <FormattedDate iso={entry.publishedAt} />
                    {entry.author && (
                      <>
                        {' · '}
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
                <h1>{entry.title}</h1>
                {isPost && entry.excerpt && <p className="lc-page-lead">{entry.excerpt}</p>}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="lc-featured lc-wrap">
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
          <div className="lc-listing">
            <header className="lc-page-header lc-wrap">
              <h1>{props.title}</h1>
              {props.description && !props.author && (
                <p className="lc-page-lead">{props.description}</p>
              )}
            </header>
            {props.author && (
              <div className="lc-wrap">
                <AuthorBox author={props.author} variant="page" />
              </div>
            )}
            <EntryList entries={props.entries} empty={t.nothingYet} more={t.readMore} />
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case 'search':
      return (
        <Location name="archive">
          <div className="lc-listing">
            <header className="lc-page-header lc-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="lc-search" role="search" action={page.urls.search} method="get">
                <label className="lc-sr" htmlFor="lc-q">
                  {t.search}
                </label>
                <input
                  id="lc-q"
                  type="search"
                  name="q"
                  defaultValue={props.query ?? ''}
                  placeholder={t.searchPlaceholder}
                />
                <button type="submit">{t.search}</button>
              </form>
            </header>
            <EntryList
              entries={props.entries}
              empty={props.query ? t.noResults : t.typeToSearch}
              more={t.readMore}
            />
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case '404':
      return (
        <div className="lc-wrap lc-message">
          <p className="lc-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="lc-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="lc-wrap lc-message">
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
  if (entries.length === 0) return <p className="lc-wrap lc-empty">{empty}</p>;
  return (
    <ul className="lc-wrap lc-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="lc-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="lc-post-image">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </a>
          )}
          <div className="lc-post-body">
            {entry.publishedAt && (
              <p className="lc-meta">
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
            <a className="lc-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
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
    <nav className="lc-wrap lc-pages" aria-label={t.pagination}>
      {pagination.prevUrl ? <a href={pagination.prevUrl}>← {t.newer}</a> : <span />}
      <span>{t.pageOf(pagination.page, pagination.totalPages)}</span>
      {pagination.nextUrl ? <a href={pagination.nextUrl}>{t.older} →</a> : <span />}
    </nav>
  );
}

const hex = (example: string) => ({
  type: 'text' as const,
  section: 'colors',
  help: { en: `Hexadecimal, e.g. ${example}`, it: `Esadecimale, es. ${example}` },
  maxLength: 7,
});

export const theme = defineTheme({
  slug: 'locanda',
  name: 'Locanda',
  version: '1.0.0',
  description:
    'A classic theme for historic family hotels, inns and country restaurants: a white boxed page, a centered name with its founding year, a deep green menu bar, a framed opening photo and condensed titles with an arrow.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settingsSections: [
    { id: 'site', label: { en: 'Site', it: 'Sito' } },
    { id: 'colors', label: { en: 'Colors', it: 'Colori' } },
    { id: 'contact', label: { en: 'Phone and booking', it: 'Telefono e prenotazioni' } },
    {
      id: 'social',
      label: { en: 'Social profiles', it: 'Profili social' },
      description: {
        en: 'Full addresses of your profiles, starting with https://. Networks left empty get no icon.',
        it: 'Gli indirizzi completi dei tuoi profili, che iniziano con https://. I social lasciati vuoti non hanno icona.',
      },
    },
  ],
  presets: [
    {
      id: 'forest',
      label: { en: 'Forest green', it: 'Verde bosco' },
      values: { accentColor: '#0e4a32', softColor: '#a9cfa6', darkColor: '#0a3524' },
    },
    {
      id: 'wine',
      label: { en: 'Old wine', it: 'Vino vecchio' },
      values: { accentColor: '#6e1e2c', softColor: '#e6b9b4', darkColor: '#43121b' },
    },
    {
      id: 'lake',
      label: { en: 'Lake blue', it: 'Blu lago' },
      values: { accentColor: '#1c3f5e', softColor: '#a9c7de', darkColor: '#122a40' },
    },
    {
      id: 'chestnut',
      label: { en: 'Chestnut', it: 'Castagno' },
      values: { accentColor: '#5a3a22', softColor: '#dcc39c', darkColor: '#3a2615' },
    },
  ],
  settings: [
    {
      name: 'logo',
      type: 'media',
      section: 'site',
      label: { en: 'Logo', it: 'Logo' },
      help: {
        en: 'Centered at the top. Empty: the site name in the lettering chosen below.',
        it: 'Al centro in alto. Vuoto: il nome del sito nella scrittura scelta qui sotto.',
      },
    },
    {
      name: 'favicon',
      type: 'media',
      section: 'site',
      label: { en: 'Site icon (favicon)', it: 'Icona del sito (favicon)' },
      help: {
        en: 'A square PNG, at least 512×512 px. Empty: a hanging sign.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: un’insegna appesa.',
      },
    },
    {
      name: 'nameStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Lettering of the name', it: 'Scrittura del nome' },
      display: 'buttons',
      options: [
        { value: 'blackletter', label: { en: 'Old sign', it: 'Insegna antica' } },
        { value: 'serif', label: { en: 'Serif', it: 'Graziato' } },
        { value: 'condensed', label: { en: 'Condensed', it: 'Stretto' } },
      ],
      default: 'blackletter',
    },
    {
      name: 'since',
      type: 'text',
      section: 'site',
      label: { en: 'Line under the name', it: 'Riga sotto il nome' },
      help: {
        en: 'Between two arrows, e.g. “Since 1887” or “Inn & restaurant”. Empty: no line.',
        it: 'Tra due frecce, es. «Dal 1887» o «Locanda e trattoria». Vuoto: nessuna riga.',
      },
      maxLength: 40,
    },
    {
      name: 'footerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Footer', it: 'Piè di pagina' },
      display: 'buttons',
      options: [
        { value: 'grass', label: { en: 'With a strip of grass', it: 'Con un prato' } },
        { value: 'plain', label: { en: 'Plain', it: 'Semplice' } },
      ],
      default: 'grass',
    },
    {
      name: 'footerText',
      type: 'text',
      section: 'site',
      label: { en: 'Footer text', it: 'Testo del piè di pagina' },
      maxLength: 200,
    },
    {
      name: 'accentColor',
      label: { en: 'Main color', it: 'Colore principale' },
      ...hex('#0e4a32'),
    },
    {
      name: 'softColor',
      label: { en: 'Light color (current menu item)', it: 'Colore chiaro (voce attiva)' },
      ...hex('#a9cfa6'),
    },
    { name: 'darkColor', label: { en: 'Footer', it: 'Piè di pagina' }, ...hex('#0a3524') },
    {
      name: 'phone',
      type: 'text',
      section: 'contact',
      label: { en: 'Phone number', it: 'Numero di telefono' },
      help: {
        en: 'Shown at the top left of every page, as a link to call. Empty: not shown.',
        it: 'In alto a sinistra in ogni pagina, come link per chiamare. Vuoto: non compare.',
      },
      maxLength: 24,
    },
    {
      name: 'bookingUrl',
      type: 'url',
      section: 'contact',
      label: { en: 'Booking button: address', it: 'Pulsante Prenota: indirizzo' },
      help: {
        en: 'A page of the site (/contacts), a booking engine (https://…), mailto: or tel:. Empty: no button.',
        it: 'Una pagina del sito (/contatti), un motore di prenotazione (https://…), mailto: o tel:. Vuoto: nessun pulsante.',
      },
    },
    {
      name: 'bookingLabel',
      type: 'text',
      section: 'contact',
      label: { en: 'Booking button: text', it: 'Pulsante Prenota: testo' },
      maxLength: 30,
    },
    ...NETWORKS.map((network) => ({
      name: settingName(network),
      type: 'url' as const,
      section: 'social',
      label: network.label,
    })),
    {
      name: 'socialPlacement',
      type: 'choice',
      section: 'social',
      label: { en: 'Show the icons', it: 'Mostra le icone' },
      display: 'buttons',
      options: [
        { value: 'both', label: { en: 'Header and footer', it: 'Testata e piè di pagina' } },
        { value: 'footer', label: { en: 'Footer only', it: 'Solo piè di pagina' } },
        { value: 'none', label: { en: 'Off', it: 'No' } },
      ],
      default: 'footer',
    },
  ],
  areas: { header: 'Header (top line)', footer: 'Footer' },
  templates: { index: Index },
  Layout,
  css: themeCss,
  editorCss,
  aiGuide: AI_GUIDE,
});

export default theme;
