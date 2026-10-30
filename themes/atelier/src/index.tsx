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
 * Atelier: a quiet theme for painters, photographers and artisans. White and light gray pages, a
 * large serif name over a framed artwork with a translucent card overlapping it, thin gold lines,
 * a gallery of works with title, year, technique and size under each, and a timeline of
 * exhibitions, all made of ordinary blocks with `at-*` classes. No JavaScript on the public site:
 * the mobile menu is a <details>, captions appear on hover with CSS only.
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  accentColor?: string;
  paperColor?: string;
  inkColor?: string;
  headerStyle?: 'side' | 'center';
  showTagline?: boolean;
  contactUrl?: string;
  contactLabel?: string;
  whatsapp?: string;
  footerText?: string;
  socialPlacement?: 'both' | 'footer' | 'none';
}

const FONTS =
  'https://fonts.bunny.net/css?family=playfair-display:400,400i,500,600|open-sans:300,400,600&display=swap';
const HEX = /^#[0-9a-f]{6}$/i;

/** The default site icon: a frame with a sun and a hill, in the theme's colors. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#3d3e40"/><rect x="12" y="12" width="40" height="40" fill="#f3f3f1"/><rect x="12" y="12" width="40" height="40" fill="none" stroke="#b89d4f" stroke-width="3"/><circle cx="40" cy="25" r="5" fill="#b89d4f"/><path d="M14 50l12-14 8 8 6-5 10 11z" fill="#3d3e40"/></svg>`;
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
      `--at-accent:${accent}`,
      `--at-accent-deep:color-mix(in srgb,${accent} 72%,#000)`,
      `--at-accent-soft:color-mix(in srgb,${accent} 16%,#fff)`,
    );
  }
  if (settings.paperColor && HEX.test(settings.paperColor)) {
    rules.push(
      `--at-paper:${settings.paperColor}`,
      `--at-paper-2:color-mix(in srgb,${settings.paperColor} 92%,#000)`,
    );
  }
  if (settings.inkColor && HEX.test(settings.inkColor)) rules.push(`--at-ink:${settings.inkColor}`);
  return rules.length ? `:root{${rules.join(';')}}` : null;
}

/** Icon links to the site's social profiles. */
function SocialLinks({ items, className }: { items: Profile[]; className: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <ul className={`at-social ${className}`} aria-label={t.socialProfiles}>
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
  const contact =
    typeof settings.contactUrl === 'string' && settings.contactUrl.trim()
      ? settings.contactUrl.trim()
      : null;
  const whatsapp = whatsappUrl(settings.whatsapp);
  const centered = settings.headerStyle === 'center';
  const tagline = settings.showTagline !== false && page.site.tagline ? page.site.tagline : null;
  const languages =
    page.locales.length > 1 ? (
      <ul className="at-langs" aria-label={t.languages}>
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
        className="at-langs"
        fallback={languages}
      />
    ) : (
      languages
    );
  const social = settings.socialPlacement === 'none' ? [] : profiles(settings);
  const headerSocial = settings.socialPlacement === 'both' ? social : [];
  const contactButton = (className: string) =>
    contact && (
      <a className={`at-cta ${className}`} href={contact}>
        {settings.contactLabel || t.contact}
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
        <a className="at-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className={`at-header${centered ? ' at-header-center' : ''}`}>
            <div className="at-wrap at-header-row">
              <a className="at-brand" href={page.urls.home}>
                {logo ? (
                  <img className="at-logo" src={logo.url} alt={page.site.title} />
                ) : (
                  <span className="at-sitename">{page.site.title}</span>
                )}
                {!logo && tagline && <span className="at-tagline">{tagline}</span>}
              </a>
              <div className="at-desktop">
                {primary.length > 0 && (
                  <nav className="at-nav" aria-label={t.mainMenu}>
                    <Menu items={primary} />
                  </nav>
                )}
                {languageSwitcher('header')}
                {headerSocial.length > 0 && (
                  <SocialLinks items={headerSocial} className="at-social-head" />
                )}
                {contactButton('')}
              </div>
              <BlockArea name="header" className="at-header-area" />
              {(primary.length > 0 || languages || contact) && (
                <details className="at-menu at-mobile">
                  <summary>
                    <span className="at-burger" aria-hidden="true" />
                    <span className="at-sr">{t.menu}</span>
                  </summary>
                  <div className="at-panel">
                    {primary.length > 0 && (
                      <nav className="at-nav" aria-label={t.mainMenu}>
                        <Menu items={primary} />
                      </nav>
                    )}
                    {languageSwitcher('mobile')}
                    {contactButton('at-cta-panel')}
                  </div>
                </details>
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="at-footer">
            <BlockArea name="footer" className="at-wrap at-footer-area" />
            <div className="at-footer-bottom">
              <div className="at-wrap at-footer-row">
                <p>
                  {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} ·{' '}
                  {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
                </p>
                {social.length > 0 && <SocialLinks items={social} className="at-social-foot" />}
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
            className="at-wa"
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
          <article className={`at-entry${isPost ? '' : ' at-page'}`}>
            {!hideTitle && (
              <header className="at-page-header at-wrap">
                {isPost && entry.publishedAt && (
                  <p className="at-meta">
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
                {isPost && entry.excerpt && <p className="at-page-lead">{entry.excerpt}</p>}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="at-featured at-wrap">
                <Image media={entry.featuredImage} eager sizes="(min-width: 64rem) 64rem, 100vw" />
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
          <div className="at-listing">
            <header className="at-page-header at-wrap">
              <h1>{props.title}</h1>
              {props.description && !props.author && (
                <p className="at-page-lead">{props.description}</p>
              )}
            </header>
            {props.author && (
              <div className="at-wrap">
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
          <div className="at-listing">
            <header className="at-page-header at-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="at-search" role="search" action={page.urls.search} method="get">
                <label className="at-sr" htmlFor="at-q">
                  {t.search}
                </label>
                <input
                  id="at-q"
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
        <div className="at-wrap at-message">
          <p className="at-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="at-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="at-wrap at-message">
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
  if (entries.length === 0) return <p className="at-wrap at-empty">{empty}</p>;
  return (
    <ul className="at-wrap at-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="at-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="at-post-image">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </a>
          )}
          <div className="at-post-body">
            {entry.publishedAt && (
              <p className="at-meta">
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
            <a className="at-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
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
    <nav className="at-wrap at-pages" aria-label={t.pagination}>
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
  slug: 'atelier',
  name: 'Atelier',
  version: '1.0.0',
  description:
    'A quiet portfolio theme for painters, photographers and artisans: white and light gray, a serif name over a framed artwork, thin gold lines, a gallery of works and a timeline of exhibitions.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settingsSections: [
    { id: 'site', label: { en: 'Site', it: 'Sito' } },
    { id: 'colors', label: { en: 'Colors', it: 'Colori' } },
    {
      id: 'contact',
      label: { en: 'Contact button and WhatsApp', it: 'Pulsante contatti e WhatsApp' },
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
      id: 'gold',
      label: { en: 'Gold leaf', it: 'Foglia d’oro' },
      values: { accentColor: '#b89d4f', paperColor: '#f3f3f1', inkColor: '#3d3e40' },
    },
    {
      id: 'sienna',
      label: { en: 'Burnt sienna', it: 'Terra di Siena' },
      values: { accentColor: '#a65a3a', paperColor: '#f5f0ea', inkColor: '#3b2a22' },
    },
    {
      id: 'ultramarine',
      label: { en: 'Ultramarine', it: 'Oltremare' },
      values: { accentColor: '#3a55a0', paperColor: '#f1f3f7', inkColor: '#1f2533' },
    },
    {
      id: 'sage',
      label: { en: 'Sage', it: 'Salvia' },
      values: { accentColor: '#6b7f5e', paperColor: '#f2f4ef', inkColor: '#2c3328' },
    },
    {
      id: 'ink',
      label: { en: 'Black and white', it: 'Bianco e nero' },
      values: { accentColor: '#2b2b2b', paperColor: '#f2f2f2', inkColor: '#111111' },
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
        en: 'A square PNG, at least 512×512 px. Empty: a small framed picture.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: un piccolo quadro incorniciato.',
      },
    },
    {
      name: 'headerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Header', it: 'Intestazione' },
      display: 'buttons',
      options: [
        {
          value: 'side',
          label: { en: 'Name left, menu right', it: 'Nome a sinistra, menu a destra' },
        },
        {
          value: 'center',
          label: { en: 'Centered name over the menu', it: 'Nome centrato sopra il menu' },
        },
      ],
      default: 'side',
    },
    {
      name: 'showTagline',
      type: 'boolean',
      section: 'site',
      label: { en: 'Show the tagline under the name', it: 'Mostra il motto sotto il nome' },
      help: {
        en: 'Only when there is no logo (e.g. "Painter", "Photographer", "Ceramics").',
        it: 'Solo quando non c’è un logo (es. «Pittrice», «Fotografo», «Ceramiche»).',
      },
      default: true,
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
      label: { en: 'Accent (lines, titles, buttons)', it: 'Accento (linee, titoli, pulsanti)' },
      ...hex('#b89d4f'),
    },
    {
      name: 'paperColor',
      label: { en: 'Light gray sections', it: 'Sezioni grigio chiaro' },
      ...hex('#f3f3f1'),
    },
    {
      name: 'inkColor',
      label: { en: 'Titles and dark sections', it: 'Titoli e sezioni scure' },
      ...hex('#3d3e40'),
    },
    {
      name: 'contactUrl',
      type: 'url',
      section: 'contact',
      label: { en: 'Contact button: address', it: 'Pulsante contatti: indirizzo' },
      help: {
        en: 'At the end of the menu: a page of the site (/contacts), mailto: or tel:. Empty: no button.',
        it: 'In fondo al menu: una pagina del sito (/contatti), mailto: o tel:. Vuoto: nessun pulsante.',
      },
    },
    {
      name: 'contactLabel',
      type: 'text',
      section: 'contact',
      label: { en: 'Contact button: text', it: 'Pulsante contatti: testo' },
      help: { en: 'Empty: "Contact".', it: 'Vuoto: «Contatti».' },
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
