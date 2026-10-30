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
 * Clinica: a clean, professional theme for dental studios, medical and physiotherapy practices.
 * A white header with the menu items divided by thin lines and an appointment button, a photo hero
 * with an opening-hours card, treatment grids with line icons, team, reviews and FAQ, all made of
 * ordinary blocks with `cl-*` classes. No JavaScript on the public site: the mobile menu is a
 * <details>, the call and WhatsApp buttons are links.
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  accentColor?: string;
  inkColor?: string;
  softColor?: string;
  headerStyle?: 'plain' | 'topbar';
  appointmentUrl?: string;
  appointmentLabel?: string;
  phone?: string;
  email?: string;
  hours?: string;
  whatsapp?: string;
  footerText?: string;
  socialPlacement?: 'both' | 'footer' | 'none';
}

const FONTS =
  'https://fonts.bunny.net/css?family=montserrat:600,700,800|work-sans:400,500,600&display=swap';
const HEX = /^#[0-9a-f]{6}$/i;

/** The default site icon: a white cross on a blue rounded square. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#1f86bd"/><path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#fff"/></svg>`;
const ICON = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

/** The mark next to the site's name when there is no logo: a cross in the main color. */
const CROSS = (
  <svg className="cl-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="15" fill="currentColor" />
    <path d="M26 14h12v12h12v12H38v12H26V38H14V26h12z" fill="#fff" />
  </svg>
);

/** A handset, for the call button and the contact strip. */
const PHONE_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"
    />
  </svg>
);
const CLOCK_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </g>
  </svg>
);
const MAIL_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </g>
  </svg>
);

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

/** A tel: link for a phone number as people write it (+39 019 000 000), or null. */
export function telUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const plus = /^\s*(\+|00)/.test(value) ? '+' : '';
  const digits = value.replace(/^\s*(\+|00)/, '').replace(/[\s.()/-]/g, '');
  return /^\d{4,15}$/.test(digits) ? `tel:${plus}${digits}` : null;
}

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value.trim() : null;

/** The palette as CSS variables, only for the colors given as plain hex values. */
export function paletteCss(settings: Settings): string | null {
  const rules: string[] = [];
  const accent = settings.accentColor;
  const ink = settings.inkColor && HEX.test(settings.inkColor) ? settings.inkColor : null;
  if (accent && HEX.test(accent)) {
    rules.push(
      `--cl-accent:${accent}`,
      `--cl-accent-deep:color-mix(in srgb,${accent} 78%,#000)`,
      `--cl-accent-soft:color-mix(in srgb,${accent} 13%,#fff)`,
      `--cl-accent-light:color-mix(in srgb,${accent} 45%,#fff)`,
    );
  }
  if (ink) rules.push(`--cl-ink:${ink}`);
  if ((accent && HEX.test(accent)) || ink) {
    rules.push(`--cl-strong:color-mix(in srgb,var(--cl-accent) 62%,var(--cl-ink))`);
  }
  if (settings.softColor && HEX.test(settings.softColor)) {
    rules.push(
      `--cl-soft:${settings.softColor}`,
      `--cl-line:color-mix(in srgb,${settings.softColor} 86%,#456)`,
    );
  }
  return rules.length ? `:root{${rules.join(';')}}` : null;
}

/** Icon links to the site's social profiles. */
function SocialLinks({ items, className }: { items: Profile[]; className: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <ul className={`cl-social ${className}`} aria-label={t.socialProfiles}>
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
  const appointment = text(settings.appointmentUrl);
  const phone = text(settings.phone);
  const tel = telUrl(phone);
  const email = text(settings.email);
  const hours = text(settings.hours);
  const whatsapp = whatsappUrl(settings.whatsapp);
  const topbar = settings.headerStyle === 'topbar' && (phone || email || hours);
  const languages =
    page.locales.length > 1 ? (
      <ul className="cl-langs" aria-label={t.languages}>
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
        className="cl-langs"
        fallback={languages}
      />
    ) : (
      languages
    );
  const social = settings.socialPlacement === 'none' ? [] : profiles(settings);
  const headerSocial = settings.socialPlacement === 'both' ? social : [];
  const appointmentButton = (className: string) =>
    appointment && (
      <a className={`cl-book ${className}`} href={appointment}>
        {settings.appointmentLabel || t.appointment}
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
        <a className="cl-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className="cl-header">
            {topbar && (
              <div className="cl-topbar">
                <div className="cl-wrap cl-topbar-row">
                  {hours && (
                    <span className="cl-topbar-item">
                      {CLOCK_ICON}
                      {hours}
                    </span>
                  )}
                  {email && (
                    <a className="cl-topbar-item" href={`mailto:${email}`}>
                      {MAIL_ICON}
                      {email}
                    </a>
                  )}
                  {phone &&
                    (tel ? (
                      <a className="cl-topbar-item cl-topbar-phone" href={tel}>
                        {PHONE_ICON}
                        {phone}
                      </a>
                    ) : (
                      <span className="cl-topbar-item cl-topbar-phone">
                        {PHONE_ICON}
                        {phone}
                      </span>
                    ))}
                  {headerSocial.length > 0 && (
                    <SocialLinks items={headerSocial} className="cl-social-head" />
                  )}
                </div>
              </div>
            )}
            <div className="cl-wrap cl-header-row">
              <a className="cl-brand" href={page.urls.home}>
                {logo ? (
                  <img className="cl-logo" src={logo.url} alt={page.site.title} />
                ) : (
                  <>
                    {CROSS}
                    <span className="cl-sitename">{page.site.title}</span>
                  </>
                )}
              </a>
              <div className="cl-desktop">
                {primary.length > 0 && (
                  <nav className="cl-nav" aria-label={t.mainMenu}>
                    <Menu items={primary} />
                  </nav>
                )}
                {languageSwitcher('header')}
                {!topbar && headerSocial.length > 0 && (
                  <SocialLinks items={headerSocial} className="cl-social-head" />
                )}
                {appointmentButton('')}
              </div>
              <BlockArea name="header" className="cl-header-area" />
              {tel && (
                <a
                  className="cl-call cl-mobile"
                  href={tel}
                  aria-label={t.call(phone!)}
                  title={t.call(phone!)}
                >
                  {PHONE_ICON}
                </a>
              )}
              {(primary.length > 0 || languages || appointment) && (
                <details className="cl-menu cl-mobile">
                  <summary>
                    <span className="cl-burger" aria-hidden="true" />
                    <span className="cl-sr">{t.menu}</span>
                  </summary>
                  <div className="cl-panel">
                    {primary.length > 0 && (
                      <nav className="cl-nav" aria-label={t.mainMenu}>
                        <Menu items={primary} />
                      </nav>
                    )}
                    {languageSwitcher('mobile')}
                    {appointmentButton('cl-book-panel')}
                  </div>
                </details>
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="cl-footer">
            <div className="cl-footer-main">
              <BlockArea name="footer" className="cl-wrap cl-footer-area" />
              {social.length > 0 && (
                <div className="cl-wrap cl-footer-social">
                  <SocialLinks items={social} className="cl-social-foot" />
                </div>
              )}
            </div>
            <div className="cl-footer-bottom">
              <div className="cl-wrap cl-footer-bottom-row">
                <p>
                  {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} ·{' '}
                  {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
                </p>
                {(page.menus.footer?.length ?? 0) > 0 && (
                  <nav aria-label={t.footerMenu}>
                    <Menu items={page.menus.footer!} />
                  </nav>
                )}
              </div>
            </div>
          </footer>
        </Location>
        {whatsapp && (
          <a
            className="cl-wa"
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
          <article className={`cl-entry${isPost ? '' : ' cl-page'}`}>
            {!hideTitle && (
              <header className="cl-page-header cl-wrap">
                {isPost && entry.publishedAt && (
                  <p className="cl-meta">
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
                {isPost && entry.excerpt && <p className="cl-page-lead">{entry.excerpt}</p>}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="cl-featured cl-wrap">
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
          <div className="cl-listing">
            <header className="cl-page-header cl-wrap">
              <h1>{props.title}</h1>
              {props.description && !props.author && (
                <p className="cl-page-lead">{props.description}</p>
              )}
            </header>
            {props.author && (
              <div className="cl-wrap">
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
          <div className="cl-listing">
            <header className="cl-page-header cl-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="cl-search" role="search" action={page.urls.search} method="get">
                <label className="cl-sr" htmlFor="cl-q">
                  {t.search}
                </label>
                <input
                  id="cl-q"
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
        <div className="cl-wrap cl-message">
          <p className="cl-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="cl-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="cl-wrap cl-message">
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
  if (entries.length === 0) return <p className="cl-wrap cl-empty">{empty}</p>;
  return (
    <ul className="cl-wrap cl-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="cl-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="cl-post-image">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </a>
          )}
          <div className="cl-post-body">
            {entry.publishedAt && (
              <p className="cl-meta">
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
            <a className="cl-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
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
    <nav className="cl-wrap cl-pages" aria-label={t.pagination}>
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
  slug: 'clinica',
  name: 'Clinica',
  version: '1.0.0',
  description:
    'A clean, professional theme for dental studios, medical and physiotherapy practices: white header with an appointment button, photo hero with an opening-hours card, treatment grids, team and FAQ.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settingsSections: [
    { id: 'site', label: { en: 'Site', it: 'Sito' } },
    { id: 'colors', label: { en: 'Colors', it: 'Colori' } },
    {
      id: 'contact',
      label: { en: 'Appointments and contacts', it: 'Appuntamenti e contatti' },
    },
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
      id: 'clinic-blue',
      label: { en: 'Clinic blue', it: 'Blu clinico' },
      values: { accentColor: '#1f86bd', inkColor: '#0b4159', softColor: '#f1f6f9' },
    },
    {
      id: 'teal',
      label: { en: 'Teal', it: 'Verde acqua' },
      values: { accentColor: '#14928f', inkColor: '#0d3d40', softColor: '#eff7f6' },
    },
    {
      id: 'sage',
      label: { en: 'Physio green', it: 'Verde fisioterapia' },
      values: { accentColor: '#3d8f62', inkColor: '#1b3d2c', softColor: '#f2f7f3' },
    },
    {
      id: 'navy',
      label: { en: 'Navy and lilac', it: 'Blu notte e lilla' },
      values: { accentColor: '#5a5fc4', inkColor: '#1c2147', softColor: '#f4f4fb' },
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
        en: 'A square PNG, at least 512×512 px. Empty: a white cross on the main color.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: una croce bianca sul colore principale.',
      },
    },
    {
      name: 'headerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Header', it: 'Intestazione' },
      display: 'buttons',
      options: [
        { value: 'plain', label: { en: 'White bar', it: 'Barra bianca' } },
        {
          value: 'topbar',
          label: { en: 'With a contact strip above', it: 'Con una striscia di contatti sopra' },
        },
      ],
      default: 'plain',
      help: {
        en: 'The contact strip shows the opening hours, the email and the phone number set in “Appointments and contacts”.',
        it: 'La striscia di contatti mostra gli orari, l’email e il telefono impostati in «Appuntamenti e contatti».',
      },
    },
    {
      name: 'footerText',
      type: 'text',
      section: 'site',
      label: { en: 'Footer text', it: 'Testo del piè di pagina' },
      help: {
        en: 'E.g. the name of the practice, its VAT number and the medical director.',
        it: 'Es. la ragione sociale, la partita IVA e il direttore sanitario.',
      },
      maxLength: 240,
    },
    {
      name: 'accentColor',
      label: {
        en: 'Main color (buttons, links, icons)',
        it: 'Colore principale (pulsanti, link, icone)',
      },
      ...hex('#1f86bd'),
    },
    {
      name: 'inkColor',
      label: { en: 'Titles and dark sections', it: 'Titoli e sezioni scure' },
      ...hex('#0b4159'),
    },
    {
      name: 'softColor',
      label: { en: 'Light sections', it: 'Sezioni chiare' },
      ...hex('#f1f6f9'),
    },
    {
      name: 'appointmentUrl',
      type: 'url',
      section: 'contact',
      label: { en: 'Appointment button: address', it: 'Pulsante appuntamento: indirizzo' },
      help: {
        en: 'At the right of the menu. A page of the site (/contacts), an online booking service (https://…), mailto: or tel:. Empty: no button.',
        it: 'A destra del menu. Una pagina del sito (/contatti), un servizio di prenotazione online (https://…), mailto: o tel:. Vuoto: nessun pulsante.',
      },
    },
    {
      name: 'appointmentLabel',
      type: 'text',
      section: 'contact',
      label: { en: 'Appointment button: text', it: 'Pulsante appuntamento: testo' },
      help: { en: 'Empty: “Book an appointment”.', it: 'Vuoto: «Prenota una visita».' },
      maxLength: 32,
    },
    {
      name: 'phone',
      type: 'text',
      section: 'contact',
      label: { en: 'Phone', it: 'Telefono' },
      help: {
        en: 'On phones a round call button appears next to the menu; also in the contact strip.',
        it: 'Sui telefoni compare un pulsante tondo per chiamare accanto al menu; anche nella striscia di contatti.',
      },
      maxLength: 24,
    },
    {
      name: 'email',
      type: 'text',
      section: 'contact',
      label: { en: 'Email (contact strip)', it: 'Email (striscia di contatti)' },
      maxLength: 80,
    },
    {
      name: 'hours',
      type: 'text',
      section: 'contact',
      label: {
        en: 'Opening hours, short (contact strip)',
        it: 'Orari in breve (striscia di contatti)',
      },
      help: { en: 'E.g. Mon–Fri 9:00–19:00', it: 'Es. Lun–Ven 9:00–19:00' },
      maxLength: 60,
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
