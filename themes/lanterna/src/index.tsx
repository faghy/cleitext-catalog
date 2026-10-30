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
  type LocaleLink,
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
 * Lanterna: a theme for Asian and ethnic restaurants, takeaway and delivery. A warm beige header
 * with a red "See the menu" button and the language switcher, a full-screen photo opening with a
 * huge heavy title, menu sections with prices and spicy or vegetarian marks, and call, WhatsApp and
 * menu buttons always at hand on phones. All made of ordinary blocks with `ln-*` classes; no
 * JavaScript on the public site (the mobile menu is a <details>).
 */

interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  headerStyle?: 'paper' | 'white' | 'over';
  accentColor?: string;
  paperColor?: string;
  darkColor?: string;
  menuUrl?: string;
  menuLabel?: string;
  phone?: string;
  whatsapp?: string;
  mobileBar?: 'on' | 'off';
  footerText?: string;
  socialPlacement?: 'both' | 'footer' | 'none';
}

const FONTS =
  'https://fonts.bunny.net/css?family=unbounded:600,800|inter:400,500,600,700&display=swap';
const HEX = /^#[0-9a-f]{6}$/i;

/** The default site icon: a paper lantern on the main color. */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#d7141e"/><path d="M32 8v6" stroke="#f3eee4" stroke-width="3" stroke-linecap="round"/><path d="M24 14h16c6 4 9 9 9 16s-3 12-9 16H24c-6-4-9-9-9-16s3-12 9-16z" fill="#f3eee4"/><path d="M32 14v32M25 15c-3 4-4 9-4 15s1 11 4 15M39 15c3 4 4 9 4 15s-1 11-4 15" stroke="#d7141e" stroke-width="2" fill="none"/><path d="M27 46v6M32 46v8M37 46v6" stroke="#f3eee4" stroke-width="3" stroke-linecap="round"/></svg>`;
const ICON = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

/** A speech bubble with a handset (not a brand logo), for the WhatsApp buttons. */
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
const MENU_ICON = (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM8.5 8h7M8.5 12h7M8.5 16h4"
    />
  </svg>
);

/** wa.me wants the number with its country code and digits only. */
export function whatsappUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const digits = value.replace(/^\s*(\+|00)/, '').replace(/[\s.()/-]/g, '');
  return /^\d{6,15}$/.test(digits) ? `https://wa.me/${digits}` : null;
}

/** A tel: link from a phone number as people write it (+39 02 000 0000). */
export function phoneUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const plus = /^\s*(\+|00)/.test(value) ? '+' : '';
  const digits = value.replace(/^\s*(\+|00)/, '').replace(/[\s.()/-]/g, '');
  return /^\d{4,15}$/.test(digits) ? `tel:${plus}${digits}` : null;
}

/** The palette as CSS variables, only for the colors given as plain hex values. */
export function paletteCss(settings: Settings): string | null {
  const rules: string[] = [];
  const accent = settings.accentColor;
  if (accent && HEX.test(accent)) {
    rules.push(
      `--ln-accent:${accent}`,
      `--ln-accent-deep:color-mix(in srgb,${accent} 82%,#000)`,
      `--ln-accent-soft:color-mix(in srgb,${accent} 12%,#fff)`,
    );
  }
  if (settings.paperColor && HEX.test(settings.paperColor)) {
    rules.push(
      `--ln-paper:${settings.paperColor}`,
      `--ln-paper-2:color-mix(in srgb,${settings.paperColor} 93%,#000)`,
    );
  }
  if (settings.darkColor && HEX.test(settings.darkColor))
    rules.push(`--ln-dark:${settings.darkColor}`, `--ln-ink:${settings.darkColor}`);
  return rules.length ? `:root{${rules.join(';')}}` : null;
}

/**
 * The short name of a language in the theme's own switcher: its code (EN, DE), or its own name
 * for scripts where a Latin code reads oddly (中文, 日本語, 한국어…).
 */
const NATIVE_SHORT: Record<string, string> = {
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  th: 'ไทย',
  ar: 'العربية',
  he: 'עברית',
  hi: 'हिन्दी',
  ru: 'РУС',
  uk: 'УКР',
  el: 'ΕΛ',
};
export function shortLanguage(code: string): string {
  return NATIVE_SHORT[code.slice(0, 2).toLowerCase()] ?? code.slice(0, 2).toUpperCase();
}

/** Icon links to the site's social profiles. */
function SocialLinks({ items, className }: { items: Profile[]; className: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <ul className={`ln-social ${className}`} aria-label={t.socialProfiles}>
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
      hint?: { style?: 'dropdown' | 'inline'; names?: 'native' | 'code'; flags?: boolean };
      className?: string;
      fallback?: ReactNode;
    }) => ReactNode;
  }
).LanguageSwitcher;

/** The theme's own switcher, when no language plugin draws one: short names side by side. */
function Languages({ locales, label }: { locales: LocaleLink[]; label: string }) {
  return (
    <nav className="ln-langs ln-langs-own" aria-label={label}>
      <ul>
        {locales.map((locale) => (
          <li key={locale.code}>
            <a
              href={locale.url}
              hrefLang={locale.code}
              lang={locale.code}
              aria-current={locale.current ? 'true' : undefined}
              title={locale.name}
            >
              {shortLanguage(locale.code)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Layout({ head, css, children }: LayoutProps) {
  const page = usePage();
  const t = strings(page.locale);
  const settings = useThemeSettings<Settings>();
  const logo = settings.logo ? page.media.get(settings.logo) : undefined;
  const favicon = settings.favicon ? page.media.get(settings.favicon) : undefined;
  const palette = paletteCss(settings);
  const primary = page.menus.primary ?? [];
  const menuUrl =
    typeof settings.menuUrl === 'string' && settings.menuUrl.trim()
      ? settings.menuUrl.trim()
      : null;
  const menuLabel = settings.menuLabel || t.seeMenu;
  const whatsapp = whatsappUrl(settings.whatsapp);
  const phone = phoneUrl(settings.phone);
  const bar = settings.mobileBar !== 'off' && Boolean(phone || whatsapp || menuUrl);
  const multilingual = page.locales.length > 1;
  // Header: a compact dropdown with each language's own name (Italiano ▾ → English, 中文);
  // the mobile panel: the names side by side. Without a language plugin, the theme's own list.
  const languageSwitcher = (placement: 'header' | 'mobile') => {
    if (!multilingual) return null;
    const own = <Languages locales={page.locales} label={t.languages} />;
    return typeof SharedSwitcher === 'function' ? (
      <SharedSwitcher
        placement={placement}
        hint={{
          style: placement === 'header' ? 'dropdown' : 'inline',
          names: 'native',
          flags: false,
        }}
        className={`ln-langs ln-langs-${placement}`}
        fallback={own}
      />
    ) : (
      own
    );
  };
  const social = settings.socialPlacement === 'none' ? [] : profiles(settings);
  const headerSocial = settings.socialPlacement === 'both' ? social : [];
  const headerClass =
    settings.headerStyle === 'over'
      ? ' ln-header-over'
      : settings.headerStyle === 'white'
        ? ' ln-header-white'
        : '';

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
      <body className={bar ? 'ln-has-bar' : undefined}>
        <a className="ln-skip" href="#content">
          {t.skip}
        </a>
        <Location name="header">
          <header className={`ln-header${headerClass}`}>
            <div className="ln-wrap ln-header-row">
              <a className="ln-brand" href={page.urls.home}>
                {logo ? (
                  <img className="ln-logo" src={logo.url} alt={page.site.title} />
                ) : (
                  <span className="ln-sitename">{page.site.title}</span>
                )}
              </a>
              <div className="ln-desktop">
                {primary.length > 0 && (
                  <nav className="ln-nav" aria-label={t.mainMenu}>
                    <Menu items={primary} />
                  </nav>
                )}
                {menuUrl && (
                  <a className="ln-menu-button" href={menuUrl}>
                    {menuLabel}
                  </a>
                )}
                {languageSwitcher('header')}
              </div>
              {headerSocial.length > 0 && (
                <SocialLinks items={headerSocial} className="ln-social-head" />
              )}
              <BlockArea name="header" className="ln-header-area" />
              {(primary.length > 0 || multilingual || menuUrl) && (
                <details className="ln-burger-menu ln-mobile">
                  <summary>
                    <span className="ln-burger" aria-hidden="true" />
                    <span className="ln-sr">{t.menu}</span>
                  </summary>
                  <div className="ln-drawer">
                    {primary.length > 0 && (
                      <nav className="ln-nav" aria-label={t.mainMenu}>
                        <Menu items={primary} />
                      </nav>
                    )}
                    {menuUrl && (
                      <a className="ln-menu-button ln-menu-button-panel" href={menuUrl}>
                        {menuLabel}
                      </a>
                    )}
                    {languageSwitcher('mobile')}
                  </div>
                </details>
              )}
            </div>
          </header>
        </Location>
        <main id="content">{children}</main>
        <Location name="footer">
          <footer className="ln-footer">
            <BlockArea name="footer" className="ln-wrap ln-footer-area" />
            <div className="ln-wrap ln-footer-bottom">
              {(page.menus.footer?.length ?? 0) > 0 && (
                <nav aria-label={t.footerMenu}>
                  <Menu items={page.menus.footer!} />
                </nav>
              )}
              <p>
                {settings.footerText || `© ${new Date().getFullYear()} ${page.site.title}`} ·{' '}
                {t.poweredBy} <a href="https://cleitext.com">Cleitext</a>
              </p>
              {social.length > 0 && <SocialLinks items={social} className="ln-social-foot" />}
            </div>
          </footer>
        </Location>
        {whatsapp && (
          <a
            className="ln-wa"
            href={whatsapp}
            target="_blank"
            rel="noopener"
            aria-label={t.whatsapp}
            title={t.whatsapp}
          >
            {CHAT_ICON}
          </a>
        )}
        {bar && (
          <nav className="ln-bar" aria-label={t.quickActions}>
            {phone && (
              <a href={phone} aria-label={t.callUs(settings.phone!)}>
                {PHONE_ICON}
                <span>{t.call}</span>
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener" aria-label={t.whatsapp}>
                {CHAT_ICON}
                <span>WhatsApp</span>
              </a>
            )}
            {menuUrl && (
              <a href={menuUrl} className="ln-bar-menu">
                {MENU_ICON}
                <span>{t.menu}</span>
              </a>
            )}
          </nav>
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
          <article className={`ln-entry${isPost ? '' : ' ln-page'}`}>
            {!hideTitle && (
              <header className="ln-page-header ln-wrap">
                {isPost && entry.publishedAt && (
                  <p className="ln-meta">
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
                {isPost && entry.excerpt && <p className="ln-page-lead">{entry.excerpt}</p>}
              </header>
            )}
            {entry.featuredImage && !hideFeatured && (
              <figure className="ln-featured ln-wrap">
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
          <div className="ln-listing">
            <header className="ln-page-header ln-wrap">
              <h1>{props.title}</h1>
              {props.description && !props.author && (
                <p className="ln-page-lead">{props.description}</p>
              )}
            </header>
            {props.author && (
              <div className="ln-wrap">
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
          <div className="ln-listing">
            <header className="ln-page-header ln-wrap">
              <h1>{props.query ? t.resultsFor(props.query) : t.search}</h1>
              <form className="ln-search" role="search" action={page.urls.search} method="get">
                <label className="ln-sr" htmlFor="ln-q">
                  {t.search}
                </label>
                <input
                  id="ln-q"
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
        <div className="ln-wrap ln-message">
          <p className="ln-big">404</p>
          <h1>{t.notFoundTitle}</h1>
          <p>{t.notFoundText}</p>
          <p>
            <a className="ln-button" href={page.urls.home}>
              {t.backHome}
            </a>
          </p>
        </div>
      );
    case 'maintenance':
      return (
        <div className="ln-wrap ln-message">
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
  if (entries.length === 0) return <p className="ln-wrap ln-empty">{empty}</p>;
  return (
    <ul className="ln-wrap ln-posts">
      {entries.map((entry, index) => (
        <li key={entry.id} className="ln-post">
          {entry.image && (
            <a href={entry.url} tabIndex={-1} aria-hidden="true" className="ln-post-image">
              <Image
                media={entry.image}
                alt=""
                eager={index === 0}
                sizes="(max-width: 760px) 100vw, 400px"
              />
            </a>
          )}
          <div className="ln-post-body">
            {entry.publishedAt && (
              <p className="ln-meta">
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
            <a className="ln-more" href={entry.url} aria-hidden="true" tabIndex={-1}>
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
    <nav className="ln-wrap ln-pages" aria-label={t.pagination}>
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
  slug: 'lanterna',
  name: 'Lanterna',
  version: '1.0.0',
  description:
    'A theme for Asian and ethnic restaurants, takeaway and delivery: warm beige, red accents, a full-screen photo opening with a huge title, menu sections with prices and spicy or vegetarian marks, call and WhatsApp buttons.',
  menuLocations: { primary: 'Main menu', footer: 'Footer menu' },
  settingsSections: [
    { id: 'site', label: { en: 'Site', it: 'Sito' } },
    { id: 'colors', label: { en: 'Colors', it: 'Colori' } },
    {
      id: 'contact',
      label: { en: 'Menu, phone and WhatsApp', it: 'Menu, telefono e WhatsApp' },
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
      id: 'lantern',
      label: { en: 'Lantern red', it: 'Rosso lanterna' },
      values: { accentColor: '#d7141e', paperColor: '#eceae3', darkColor: '#1e293b' },
    },
    {
      id: 'jade',
      label: { en: 'Jade', it: 'Giada' },
      values: { accentColor: '#0e7a5a', paperColor: '#edefe6', darkColor: '#16302a' },
    },
    {
      id: 'saffron',
      label: { en: 'Saffron', it: 'Zafferano' },
      values: { accentColor: '#d4500f', paperColor: '#f5eedf', darkColor: '#2c1d13' },
    },
    {
      id: 'indigo',
      label: { en: 'Indigo night', it: 'Notte indaco' },
      values: { accentColor: '#c8302f', paperColor: '#e9ebf0', darkColor: '#141b33' },
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
        en: 'A square PNG, at least 512×512 px. Empty: a paper lantern.',
        it: 'Un PNG quadrato, almeno 512×512 px. Vuoto: una lanterna di carta.',
      },
    },
    {
      name: 'headerStyle',
      type: 'choice',
      section: 'site',
      label: { en: 'Header', it: 'Intestazione' },
      display: 'buttons',
      options: [
        { value: 'paper', label: { en: 'Beige bar', it: 'Barra beige' } },
        { value: 'white', label: { en: 'White bar', it: 'Barra bianca' } },
        { value: 'over', label: { en: 'Over the opening photo', it: 'Sopra la foto di apertura' } },
      ],
      default: 'paper',
      help: {
        en: 'Over the photo: on pages that open with an ln-hero section the header is transparent, on the others it stays a beige bar.',
        it: 'Sopra la foto: nelle pagine che si aprono con una sezione ln-hero l’intestazione è trasparente, nelle altre resta una barra beige.',
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
      ...hex('#d7141e'),
    },
    { name: 'paperColor', label: { en: 'Background', it: 'Sfondo' }, ...hex('#eceae3') },
    {
      name: 'darkColor',
      label: { en: 'Titles and dark sections', it: 'Titoli e sezioni scure' },
      ...hex('#1e293b'),
    },
    {
      name: 'menuUrl',
      type: 'url',
      section: 'contact',
      label: { en: 'Menu button: address', it: 'Pulsante Menu: indirizzo' },
      help: {
        en: 'The red button in the header and in the bar on phones: a page of the site (/menu), a PDF or an ordering site. Empty: no button.',
        it: 'Il pulsante rosso nell’intestazione e nella barra sui telefoni: una pagina del sito (/menu), un PDF o un sito di ordinazioni. Vuoto: nessun pulsante.',
      },
    },
    {
      name: 'menuLabel',
      type: 'text',
      section: 'contact',
      label: { en: 'Menu button: text', it: 'Pulsante Menu: testo' },
      help: {
        en: 'Empty: “See the menu” in the language of the page.',
        it: 'Vuoto: «Scopri il menu» nella lingua della pagina.',
      },
      maxLength: 30,
    },
    {
      name: 'phone',
      type: 'text',
      section: 'contact',
      label: { en: 'Phone for bookings', it: 'Telefono per le prenotazioni' },
      help: {
        en: 'As people dial it, e.g. +39 02 000 0000: the “Call” button in the bar on phones.',
        it: 'Come si compone, es. +39 02 000 0000: il pulsante «Chiama» nella barra sui telefoni.',
      },
      maxLength: 24,
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
    {
      name: 'mobileBar',
      type: 'choice',
      section: 'contact',
      label: { en: 'Bar on phones', it: 'Barra sui telefoni' },
      display: 'buttons',
      options: [
        { value: 'on', label: { en: 'Call · WhatsApp · Menu', it: 'Chiama · WhatsApp · Menu' } },
        { value: 'off', label: { en: 'Off', it: 'No' } },
      ],
      default: 'on',
      help: {
        en: 'A bar fixed at the bottom of the screen on phones, with the buttons whose address or number is set.',
        it: 'Una barra fissa in fondo allo schermo sui telefoni, con i pulsanti di cui hai messo indirizzo o numero.',
      },
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
