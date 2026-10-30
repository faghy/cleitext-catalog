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
 * Podere: a warm theme for farm stays, country houses and rural B&Bs. Terracotta and cream, serif
 * titles, wave dividers between sections, rounded photos and cards with line icons, all made of
 * ordinary blocks with `pd-*` classes. No JavaScript on the public site: the mobile menu is a
 * <details>, the WhatsApp button a link.
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  accentColor?: string;
  creamColor?: string;
  darkColor?: string;
  headerStyle?: 'solid' | 'over';
  bookingUrl?: string;
  bookingLabel?: string;
  whatsapp?: string;
  footerText?: string;
  socialPlacement?: 'both' | 'footer' | 'none';
}

const FONTS =
  'https://fonts.bunny.net/css?family=forum:400|crimson-text:400,400i,600|plus-jakarta-sans:400,500,600,700&display=swap';
const HEX = /^#[0-9a-f]{6}$/i;

/** The default site icon: a hill and the sun, in the theme's colors. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#b9654b"/><circle cx="42" cy="22" r="7" fill="#fff5e0"/><path d="M6 50c10-14 20-18 30-12s16 6 22 2v24H6z" fill="#fff5e0"/></svg>`;
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

/** The palette as CSS variables, only for the colors given as plain hex values. */
export function paletteCss(settings: Settings): string | null {
  const rules: string[] = [];
  const accent = settings.accentColor;
  if (accent && HEX.test(accent)) {
    rules.push(
      `--pd-accent:${accent}`,
      `--pd-accent-deep:color-mix(in srgb,${accent} 80%,#000)`,
      `--pd-accent-soft:color-mix(in srgb,${accent} 18%,#fff)`,
    );
  }
  if (settings.creamColor && HEX.test(settings.creamColor)) {
    rules.push(
      `--pd-cream:${settings.creamColor}`,
      `--pd-cream-2:color-mix(in srgb,${settings.creamColor} 88%,#000)`,
    );
  }
  if (settings.darkColor && HEX.test(settings.darkColor))
    rules.push(`--pd-dark:${settings.darkColor}`);
  return rules.length ? `:root{${rules.join(';')}}` : null;
}

/** Icon links to the site's social profiles. */
function SocialLinks({ items, className }: { items: Profile[]; className: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <ul className={`pd-social ${className}`} aria-label={t.socialProfiles}>
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
  const favicon = settings.favicon ? page.media.get(settings.favicon) : undefined;
  const palette = paletteCss(settings);
  const primary = page.menus.primary ?? [];
  const booking =
    typeof settings.bookingUrl === 'string' && settings.bookingUrl.trim()
      ? settings.bookingUrl.trim()
      : null;
  const whatsapp = whatsappUrl(settings.whatsapp);
  const languages =
    page.locales.length > 1 ? (
      <ul className="pd-langs" aria-label={t.languages}>
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
        className="pd-langs"
        fallback={languages}
      />
    ) : (
      languages
    );
  const social = settings.socialPlacement === 'none' ? [] : profiles(settings);
  const headerSocial = settings.socialPlacement === 'footer' ? [] : social;
  const bookingButton = (className: string) =>
    booking && (
      <a className={`pd-book ${className}`} href={booking}>
        {settings.bookingLabel ||
          (page.locale.startsWith('it')
            ? 'Prenota'
            : page.locale.startsWith('de')
              ? 'Buchen'
              : 'Book now')}
      </a>
    );

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
      <body>
        <a className="pd-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header
            className={`pd-header${settings.headerStyle === 'over' ? ' pd-header-over' : ''}`}
          >
            <div className="pd-wrap pd-header-row">
              <a className="pd-brand" href={page.urls.home}>
                {logo ? (
                  <img className="pd-logo" src={logo.url} alt={page.site.title} />
                ) : (
                  <span className="pd-sitename">{page.site.title}</span>
                )}
              </a>
              <div className="pd-desktop">
                {primary.length > 0 && (
                  <nav className="pd-nav" aria-label={t.mainMenu}>
                    <Menu items={primary} />
                  </nav>
                )}
                {languageSwitcher('header')}
                {bookingButton('')}
              </div>
              {headerSocial.length > 0 && (
                <SocialLinks items={headerSocial} className="pd-social-head" />
              )}
              <BlockArea name="header" className="pd-header-area" />
              {(primary.length > 0 || languages || booking) && (
                <details className="pd-menu pd-mobile">
                  <summary>
                    <span className="pd-burger" aria-hidden="true" />
                    <span className="pd-sr">{t.menu}</span>
                  </summary>
                  <div className="pd-panel">
                    {primary.length > 0 && (
                      <nav className="pd-nav" aria-label={t.mainMenu}>
                        <Menu items={primary} />
                      </nav>
                    )}
                    {languageSwitcher('mobile')}
                    {bookingButton('pd-book-panel')}
                  </div>
                </details>
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="pd-footer">
            <BlockArea name="footer" className="pd-wrap pd-footer-area" />
            <div className="pd-wrap pd-footer-bottom">
              {(page.menus.footer?.length ?? 0) > 0 && (
                <nav aria-label={t.footerMenu}>
                  <Menu items={page.menus.footer!} />
                </nav>
              )}
              <p>
                {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} ·{' '}
                {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
              </p>
              {social.length > 0 && <SocialLinks items={social} className="pd-social-foot" />}
            </div>
          </footer>
        </Location>
        {whatsapp && (
          <a
            className="pd-wa"
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
          <article className={`pd-entry${isPost ? '' : ' pd-page'}`}>
            {!hideTitle && (
              <header className="pd-page-header pd-wrap">
                {isPost && entry.publishedAt && (
                  <p className="pd-meta">
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
                {isPost && entry.excerpt && <p className="pd-page-lead">{entry.excerpt}</p>}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="pd-featured pd-wrap">
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
          <div className="pd-listing">
            <header className="pd-page-header pd-wrap">
              <h1>{props.title}</h1>
              {props.description && !props.author && (
                <p className="pd-page-lead">{props.description}</p>
              )}
            </header>
            {props.author && (
              <div className="pd-wrap">
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
          <div className="pd-listing">
            <header className="pd-page-header pd-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="pd-search" role="search" action={page.urls.search} method="get">
                <label className="pd-sr" htmlFor="pd-q">
                  {t.search}
                </label>
                <input
                  id="pd-q"
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
        <div className="pd-wrap pd-message">
          <p className="pd-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="pd-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="pd-wrap pd-message">
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
  if (entries.length === 0) return <p className="pd-wrap pd-empty">{empty}</p>;
  return (
    <ul className="pd-wrap pd-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="pd-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="pd-post-image">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </a>
          )}
          <div className="pd-post-body">
            {entry.publishedAt && (
              <p className="pd-meta">
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
            <a className="pd-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
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
    <nav className="pd-wrap pd-pages" aria-label={t.pagination}>
      {pagination.prevUrl ? <a href={pagination.prevUrl}>← {t.newer}</a> : <span />}
      <span>{t.pageOf(pagination.page, pagination.totalPages)}</span>
      {pagination.nextUrl ? <a href={pagination.nextUrl}>{t.older} →</a> : <span />}
    </nav>
  );
}

const hex = (en: string, it: string) => ({
  type: 'text' as const,
  section: 'colors',
  help: { en: `Hexadecimal, e.g. ${en}`, it: `Esadecimale, es. ${it}` },
  maxLength: 7,
});

export const theme = defineTheme({
  slug: 'podere',
  name: 'Podere',
  version: '1.0.0',
  description:
    'A warm theme for farm stays and country houses: terracotta and cream, serif titles, wave dividers, rounded photos and a WhatsApp button.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settingsSections: [
    { id: 'site', label: { en: 'Site', it: 'Sito' } },
    { id: 'colors', label: { en: 'Colors', it: 'Colori' } },
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
      id: 'terracotta',
      label: { en: 'Terracotta', it: 'Terracotta' },
      values: { accentColor: '#b9654b', creamColor: '#fff5e0', darkColor: '#3b2a20' },
    },
    {
      id: 'olive',
      label: { en: 'Olive grove', it: 'Uliveto' },
      values: { accentColor: '#6f7d3c', creamColor: '#f7f4e6', darkColor: '#2f3320' },
    },
    {
      id: 'lavender',
      label: { en: 'Lavender', it: 'Lavanda' },
      values: { accentColor: '#7c6a9e', creamColor: '#f6f2fa', darkColor: '#2e2840' },
    },
    {
      id: 'vineyard',
      label: { en: 'Vineyard', it: 'Vigneto' },
      values: { accentColor: '#8a2f3c', creamColor: '#fbf3ec', darkColor: '#33181c' },
    },
  ],
  settings: [
    { name: 'logo', type: 'media', section: 'site', label: { en: 'Logo', it: 'Logo' } },
    {
      name: 'favicon',
      type: 'media',
      section: 'site',
      label: { en: 'Site icon (favicon)', it: 'Icona del sito (favicon)' },
      help: {
        en: 'A square PNG, at least 512×512 px. Empty: a hill and the sun.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: una collina e il sole.',
      },
    },
    {
      name: 'headerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Header', it: 'Intestazione' },
      display: 'buttons',
      options: [
        { value: 'solid', label: { en: 'Colored bar', it: 'Barra colorata' } },
        { value: 'over', label: { en: 'Over the opening photo', it: 'Sopra la foto di apertura' } },
      ],
      default: 'solid',
      help: {
        en: 'Over the photo: on pages that open with a pd-hero section the header is transparent, on the others it stays a colored bar.',
        it: 'Sopra la foto: nelle pagine che si aprono con una sezione pd-hero l’intestazione è trasparente, nelle altre resta una barra colorata.',
      },
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
      ...hex('#b9654b', '#b9654b'),
    },
    { name: 'creamColor', label: { en: 'Background', it: 'Sfondo' }, ...hex('#fff5e0', '#fff5e0') },
    {
      name: 'darkColor',
      label: { en: 'Footer and dark sections', it: 'Piè di pagina e sezioni scure' },
      ...hex('#3b2a20', '#3b2a20'),
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
