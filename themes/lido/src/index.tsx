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
 * Lido: a theme for beach clubs, lidos and seaside lounges. An aerial photo that fills the opening
 * with a single "Book now" pill, a transparent header over it, a soft wave edge, a handwritten title
 * with a letter-spaced line under it, sandy and white sections and sea blues. Price lists, season
 * promos and event cards are ordinary blocks with `ld-*` classes. No JavaScript on the public site:
 * the mobile menu is a <details>, the booking and WhatsApp buttons are links.
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  logoLight?: string;
  favicon?: string;
  headerStyle?: 'over' | 'solid';
  titleFont?: 'script' | 'serif';
  footerStyle?: 'sand' | 'sea';
  accentColor?: string;
  buttonColor?: string;
  sandColor?: string;
  darkColor?: string;
  bookingUrl?: string;
  bookingLabel?: string;
  bookingBar?: boolean;
  whatsapp?: string;
  footerText?: string;
  socialPlacement?: 'both' | 'footer' | 'none';
}

const FONTS =
  'https://fonts.bunny.net/css?family=dancing-script:500,600|alice:400|nunito-sans:400,400i,600,700,800&display=swap';
const HEX = /^#[0-9a-f]{6}$/i;

/** The default site icon: a beach umbrella seen from above, on the sea. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#2b7ea1"/><path d="M0 44c8-5 16-5 24 0s16 5 24 0 12-4 16-2v24H0z" fill="#f7efe0"/><circle cx="32" cy="27" r="15" fill="#fffaf2"/><path d="M32 27V12a15 15 0 0 1 13 7.5zM32 27l13 7.5A15 15 0 0 1 32 42zM32 27H17a15 15 0 0 1 2-7.5z" fill="#ef8a6b"/><circle cx="32" cy="27" r="2" fill="#2b7ea1"/></svg>`;
const ICON = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

/** A speech bubble with a handset (not a brand logo), for the WhatsApp button. */
const CHAT_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"
    />
    <path
      fill="currentColor"
      d="M9.2 7.6c.3 0 .5 0 .7.5l.8 1.8c.1.3 0 .5-.1.7l-.6.7c.6 1.2 1.7 2.3 3 3l.7-.7c.2-.2.4-.2.7-.1l1.8.8c.4.2.5.4.4.7-.2 1.2-1.2 1.9-2.3 1.8-3.4-.4-6.4-3.4-6.8-6.8-.1-1.1.6-2.1 1.7-2.4z"
    />
  </svg>
);

/** wa.me wants the number with its country code and digits only. */
export function whatsappUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const digits = value.replace(/^\s*(\+|00)/, '').replace(/[\s.()/-]/g, '');
  return /^\d{6,15}$/.test(digits) ? `https://wa.me/${digits}` : null;
}

/** The palette and the title font as CSS variables, only for the colors given as plain hex values. */
export function paletteCss(settings: Settings): string | null {
  const rules: string[] = [];
  const accent = settings.accentColor;
  if (accent && HEX.test(accent)) {
    rules.push(
      `--ld-accent:${accent}`,
      `--ld-accent-deep:color-mix(in srgb,${accent} 78%,#000)`,
      `--ld-accent-soft:color-mix(in srgb,${accent} 12%,#fff)`,
    );
  }
  const button = settings.buttonColor;
  if (button && HEX.test(button)) {
    rules.push(`--ld-button:${button}`, `--ld-button-deep:color-mix(in srgb,${button} 82%,#000)`);
  }
  if (settings.sandColor && HEX.test(settings.sandColor)) {
    rules.push(
      `--ld-sand:${settings.sandColor}`,
      `--ld-sand-2:color-mix(in srgb,${settings.sandColor} 90%,#8a6a3a)`,
    );
  }
  if (settings.darkColor && HEX.test(settings.darkColor))
    rules.push(`--ld-dark:${settings.darkColor}`);
  if (settings.titleFont === 'serif')
    rules.push('--ld-script:var(--ld-display)', '--ld-script-weight:400');
  return rules.length ? `:root{${rules.join(';')}}` : null;
}

/** Icon links to the site's social profiles. */
function SocialLinks({ items, className }: { items: Profile[]; className: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <ul className={`ld-social ${className}`} aria-label={t.socialProfiles}>
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

function Layout({ head, css, children }: LayoutProps) {
  const page = usePage();
  const t = strings(page.locale);
  const settings = useThemeSettings<Settings>();
  const logo = settings.logo ? page.media.get(settings.logo) : undefined;
  const logoLight = settings.logoLight ? page.media.get(settings.logoLight) : undefined;
  const favicon = settings.favicon ? page.media.get(settings.favicon) : undefined;
  const palette = paletteCss(settings);
  const primary = page.menus.primary ?? [];
  const over = settings.headerStyle !== 'solid';
  const booking =
    typeof settings.bookingUrl === 'string' && settings.bookingUrl.trim()
      ? settings.bookingUrl.trim()
      : null;
  const bookingLabel = settings.bookingLabel || t.book;
  const whatsapp = whatsappUrl(settings.whatsapp);
  const languages =
    page.locales.length > 1 ? (
      <ul className="ld-langs" aria-label={t.languages}>
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
        className="ld-langs"
        fallback={languages}
      />
    ) : (
      languages
    );
  const social = settings.socialPlacement === 'none' ? [] : profiles(settings);
  const headerSocial = settings.socialPlacement === 'both' ? social : [];
  const bookingButton = (className: string) =>
    booking && (
      <a className={`ld-book ${className}`} href={booking}>
        {bookingLabel}
      </a>
    );
  const bodyClass = [
    over ? 'ld-over' : '',
    settings.footerStyle === 'sea' ? 'ld-footer-sea' : '',
    booking && settings.bookingBar ? 'ld-has-bar' : '',
  ]
    .filter(Boolean)
    .join(' ');

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
        <link rel="stylesheet" href={FONTS} />
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {palette && <style dangerouslySetInnerHTML={{ __html: palette }} />}
        <HeadTags tags={head.tags} />
      </head>
      <body className={bodyClass || undefined}>
        <a className="ld-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className="ld-header">
            <div className="ld-wrap ld-header-row">
              <a className="ld-brand" href={page.urls.home}>
                {logo ? (
                  <>
                    <img
                      className={`ld-logo${logoLight ? ' ld-logo-dark' : ''}`}
                      src={logo.url}
                      alt={page.site.title}
                    />
                    {logoLight && (
                      <img className="ld-logo ld-logo-light" src={logoLight.url} alt="" />
                    )}
                  </>
                ) : (
                  <span className="ld-sitename">{page.site.title}</span>
                )}
              </a>
              <div className="ld-desktop">
                {primary.length > 0 && (
                  <nav className="ld-nav" aria-label={t.mainMenu}>
                    <Menu items={primary} />
                  </nav>
                )}
                {languageSwitcher('header')}
                {bookingButton('')}
              </div>
              {headerSocial.length > 0 && (
                <SocialLinks items={headerSocial} className="ld-social-head" />
              )}
              <BlockArea name="header" className="ld-header-area" />
              {(primary.length > 0 || languages || booking) && (
                <details className="ld-menu ld-mobile">
                  <summary>
                    <span className="ld-burger" aria-hidden="true" />
                    <span className="ld-sr">{t.menu}</span>
                  </summary>
                  <div className="ld-panel">
                    {primary.length > 0 && (
                      <nav className="ld-nav" aria-label={t.mainMenu}>
                        <Menu items={primary} />
                      </nav>
                    )}
                    {languageSwitcher('mobile')}
                    {bookingButton('ld-book-panel')}
                  </div>
                </details>
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="ld-footer">
            <BlockArea name="footer" className="ld-wrap ld-footer-area" />
            <div className="ld-wrap ld-footer-bottom">
              {(page.menus.footer?.length ?? 0) > 0 && (
                <nav aria-label={t.footerMenu}>
                  <Menu items={page.menus.footer!} />
                </nav>
              )}
              <p>
                {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} ·{' '}
                {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
              </p>
              {social.length > 0 && <SocialLinks items={social} className="ld-social-foot" />}
            </div>
          </footer>
        </Location>
        {booking && settings.bookingBar && (
          <a className="ld-bar" href={booking}>
            {bookingLabel}
          </a>
        )}
        {whatsapp && (
          <a
            className="ld-wa"
            href={whatsapp}
            target="_blank"
            rel="noopener"
            aria-label={t.whatsapp}
            title={t.whatsapp}
          >
            {CHAT_ICON}
          </a>
        )}
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
          <article className={`ld-entry${isPost ? '' : ' ld-page'}`}>
            {!hideTitle && (
              <header className="ld-page-header ld-wrap">
                {isPost && entry.publishedAt && (
                  <p className="ld-meta">
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
                {isPost && entry.excerpt && <p className="ld-page-lead">{entry.excerpt}</p>}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="ld-featured ld-wrap">
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
          <div className="ld-listing">
            <header className="ld-page-header ld-wrap">
              <h1>{props.title}</h1>
              {props.description && !props.author && (
                <p className="ld-page-lead">{props.description}</p>
              )}
            </header>
            {props.author && (
              <div className="ld-wrap">
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
          <div className="ld-listing">
            <header className="ld-page-header ld-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="ld-search" role="search" action={page.urls.search} method="get">
                <label className="ld-sr" htmlFor="ld-q">
                  {t.search}
                </label>
                <input
                  id="ld-q"
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
        <div className="ld-wrap ld-message">
          <p className="ld-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="ld-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="ld-wrap ld-message">
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
  if (entries.length === 0) return <p className="ld-wrap ld-empty">{empty}</p>;
  return (
    <ul className="ld-wrap ld-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="ld-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="ld-post-image">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </a>
          )}
          <div className="ld-post-body">
            {entry.publishedAt && (
              <p className="ld-meta">
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
            <a className="ld-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
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
    <nav className="ld-wrap ld-pages" aria-label={t.pagination}>
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
  slug: 'lido',
  name: 'Lido',
  version: '1.0.0',
  description:
    'A sunny theme for beach clubs and lidos: an aerial photo with a Book now pill, a transparent header, wave edges, a handwritten title, price lists, season promos and event cards.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settingsSections: [
    { id: 'site', label: { en: 'Site', it: 'Sito' } },
    { id: 'colors', label: { en: 'Colors and fonts', it: 'Colori e caratteri' } },
    { id: 'contact', label: { en: 'Booking and WhatsApp', it: 'Prenotazioni e WhatsApp' } },
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
      id: 'riviera',
      label: { en: 'Riviera', it: 'Riviera' },
      values: {
        accentColor: '#2b7ea1',
        buttonColor: '#2b7ea1',
        sandColor: '#fffaf2',
        darkColor: '#163b4d',
      },
    },
    {
      id: 'lounge',
      label: { en: 'Lounge', it: 'Lounge' },
      values: {
        accentColor: '#3d6f86',
        buttonColor: '#7fb07a',
        sandColor: '#fffcf6',
        darkColor: '#2f3a3c',
      },
    },
    {
      id: 'sunset',
      label: { en: 'Sunset', it: 'Tramonto' },
      values: {
        accentColor: '#c0563d',
        buttonColor: '#e07a57',
        sandColor: '#fff7ee',
        darkColor: '#3d2427',
      },
    },
    {
      id: 'lagoon',
      label: { en: 'Lagoon', it: 'Laguna' },
      values: {
        accentColor: '#11807d',
        buttonColor: '#e9a52c',
        sandColor: '#f7fbf9',
        darkColor: '#0f3b3d',
      },
    },
  ],
  settings: [
    { name: 'logo', type: 'media', section: 'site', label: { en: 'Logo', it: 'Logo' } },
    {
      name: 'logoLight',
      type: 'media',
      section: 'site',
      label: { en: 'Light logo (over the photo)', it: 'Logo chiaro (sopra la foto)' },
      help: {
        en: 'Optional: a white version of the logo, used while the header is transparent over the opening photo.',
        it: 'Facoltativo: una versione bianca del logo, usata quando l’intestazione è trasparente sopra la foto di apertura.',
      },
    },
    {
      name: 'favicon',
      type: 'media',
      section: 'site',
      label: { en: 'Site icon (favicon)', it: 'Icona del sito (favicon)' },
      help: {
        en: 'A square PNG, at least 512×512 px. Empty: a beach umbrella on the sea.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: un ombrellone sul mare.',
      },
    },
    {
      name: 'headerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Header', it: 'Intestazione' },
      display: 'buttons',
      options: [
        { value: 'over', label: { en: 'Over the opening photo', it: 'Sopra la foto di apertura' } },
        { value: 'solid', label: { en: 'White bar', it: 'Barra bianca' } },
      ],
      default: 'over',
      help: {
        en: 'Over the photo: on pages that open with a ld-hero section the header is transparent, on the others it is a white bar.',
        it: 'Sopra la foto: nelle pagine che si aprono con una sezione ld-hero l’intestazione è trasparente, nelle altre è una barra bianca.',
      },
    },
    {
      name: 'footerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Footer', it: 'Piè di pagina' },
      display: 'buttons',
      options: [
        { value: 'sand', label: { en: 'Sand', it: 'Sabbia' } },
        { value: 'sea', label: { en: 'Deep sea', it: 'Mare profondo' } },
      ],
      default: 'sand',
    },
    {
      name: 'footerText',
      type: 'text',
      section: 'site',
      label: { en: 'Footer text', it: 'Testo del piè di pagina' },
      maxLength: 200,
    },
    {
      name: 'titleFont',
      type: 'choice',
      section: 'colors',
      label: { en: 'Display titles', it: 'Titoli grandi' },
      display: 'buttons',
      options: [
        { value: 'script', label: { en: 'Handwritten', it: 'Scritti a mano' } },
        { value: 'serif', label: { en: 'Soft serif', it: 'Graziato morbido' } },
      ],
      default: 'script',
      help: {
        en: 'The font of the large titles (ld-script) and of the site name.',
        it: 'Il carattere dei titoli grandi (ld-script) e del nome del sito.',
      },
    },
    {
      name: 'accentColor',
      label: { en: 'Sea color (titles, links, icons)', it: 'Colore mare (titoli, link, icone)' },
      ...hex('#2b7ea1'),
    },
    { name: 'buttonColor', label: { en: 'Buttons', it: 'Pulsanti' }, ...hex('#2b7ea1') },
    { name: 'sandColor', label: { en: 'Background', it: 'Sfondo' }, ...hex('#fffaf2') },
    {
      name: 'darkColor',
      label: { en: 'Dark sections and deep-sea footer', it: 'Sezioni scure e piè di pagina mare' },
      ...hex('#163b4d'),
    },
    {
      name: 'bookingUrl',
      type: 'url',
      section: 'contact',
      label: { en: 'Booking button: address', it: 'Pulsante Prenota: indirizzo' },
      help: {
        en: 'A page of the site (/booking), a booking system (https://…), mailto: or tel:. Empty: no button.',
        it: 'Una pagina del sito (/prenota), un sistema di prenotazione (https://…), mailto: o tel:. Vuoto: nessun pulsante.',
      },
    },
    {
      name: 'bookingLabel',
      type: 'text',
      section: 'contact',
      label: { en: 'Booking button: text', it: 'Pulsante Prenota: testo' },
      help: { en: 'Empty: “Book now”.', it: 'Vuoto: «Prenota ora».' },
      maxLength: 30,
    },
    {
      name: 'bookingBar',
      type: 'boolean',
      section: 'contact',
      label: {
        en: 'On phones, keep the booking button at the bottom of the screen',
        it: 'Sui telefoni, tieni il pulsante Prenota in fondo allo schermo',
      },
      default: false,
    },
    {
      name: 'whatsapp',
      type: 'text',
      section: 'contact',
      label: { en: 'WhatsApp number', it: 'Numero WhatsApp' },
      help: {
        en: 'With the country code, e.g. +39 333 1234567: a round button in the corner of every page. Empty: no button.',
        it: 'Con il prefisso internazionale, es. +39 333 1234567: un pulsante tondo nell’angolo di ogni pagina. Vuoto: nessun pulsante.',
      },
      maxLength: 24,
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
  areas: { header: 'Header (right side)', footer: 'Footer' },
  templates: { index: Index },
  Layout,
  css: themeCss,
  editorCss,
  aiGuide: AI_GUIDE,
});

export default theme;
