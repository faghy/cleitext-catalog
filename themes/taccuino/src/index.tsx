import {
  BlockArea,
  Comments,
  defineTheme,
  EntryContent,
  HeadTags,
  Image,
  Location,
  usePage,
  useThemeSettings,
  type LayoutProps,
  type MenuItemView,
  type Pagination,
  type PublicEntry,
  type PublicEntrySummary,
  type TemplateProps,
  type TermLink,
} from '@cleitext/theme-sdk';
import * as sdk from '@cleitext/theme-sdk';
import type { ReactNode } from 'react';
import { BRANDS } from './icons.js';
import { color, family, fontsUrl, formatDate, safeHref, trimWords, withYear } from './format.js';
import { strings } from './strings.js';
import { css as themeCss, editorCss, script } from './styles.js';

/**
 * Taccuino: a theme for news sites, magazines and blogs. A white header with the logo, the main menu (with an
 * emoji or icon per item) and a search panel; the latest article opening the home page over its photo, cards
 * of the others; articles with a sidebar of the latest of their category and share buttons; category, tag,
 * author and search pages; a "podcast" category shown as a band of players; a footer with the logo, the social
 * profiles and two menus. Colors, fonts and every text come from Appearance → Customize. Its companion plugin
 * Taccuino Blocks adds the "Articles" and "Embeds of articles" blocks the home page and the podcast page use.
 */

export interface Settings extends Record<string, unknown> {
  logo?: string;
  favicon?: string;
  footerLogo?: string;
  footerText?: string;
  accentColor?: string;
  highlightColor?: string;
  textColor?: string;
  mutedColor?: string;
  footerColor?: string;
  headingFont?: string;
  bodyFont?: string;
  topBarText?: string;
  topBarCta?: string;
  topBarLink?: string;
  searchTitle?: string;
  excerptWords?: number;
  hiddenTag?: string;
  moreLabel?: string;
  shareButtons?: boolean;
  shareVia?: string;
  showComments?: boolean;
  relatedTitle?: string;
  bandCategory?: string;
  bandLogo?: string;
  bandTitle?: string;
  footerMenu1Title?: string;
  footerMenu2Title?: string;
  copyright?: string;
  poweredText?: string;
  poweredName?: string;
  poweredUrl?: string;
  poweredLogo?: string;
  creditLogo?: string;
  creditUrl?: string;
  creditLabel?: string;
  notFoundImage?: string;
  notFoundTitle?: string;
  notFoundText?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialX?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialLinkedin?: string;
  socialTiktok?: string;
  socialTelegram?: string;
  socialSpotify?: string;
}

const SOCIAL = [
  ['socialFacebook', 'facebook', 'Facebook'],
  ['socialTwitter', 'twitter', 'Twitter'],
  ['socialX', 'x', 'X'],
  ['socialInstagram', 'instagram', 'Instagram'],
  ['socialYoutube', 'youtube', 'YouTube'],
  ['socialLinkedin', 'linkedin', 'LinkedIn'],
  ['socialTiktok', 'tiktok', 'TikTok'],
  ['socialTelegram', 'telegram', 'Telegram'],
  ['socialSpotify', 'spotify', 'Spotify'],
] as const;

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0770b8"/><path d="M18 14h24l6 6v30H18z" fill="#fff"/><path d="M24 26h18M24 33h18M24 40h12" stroke="#0770b8" stroke-width="3" stroke-linecap="round"/><path d="M42 14v6h6" fill="#f9b238"/></svg>`;
const ICON = `data:image/svg+xml,${encodeURIComponent(MARK)}`;

function Brand({ name, className }: { name: string; className?: string }) {
  const icon = BRANDS[name];
  if (!icon) return null;
  return (
    <svg className={className} viewBox={icon.viewBox} aria-hidden="true" focusable="false">
      <path fill="currentColor" d={icon.d} />
    </svg>
  );
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L20 20" />
  </svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
const UpIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

const text = (v: unknown, fallback = '') => (typeof v === 'string' && v.trim() ? v.trim() : fallback);

/** The settings' CSS variables. */
function varsCss(s: Settings): string {
  const heading = family(s.headingFont, 'Lilita One');
  const body = family(s.bodyFont, 'IBM Plex Sans');
  return (
    `:root{--tc-accent:${color(s.accentColor, '#0770b8')};--tc-highlight:${color(s.highlightColor, '#f9b238')};` +
    `--tc-text:${color(s.textColor, '#1d1d1b')};--tc-muted:${color(s.mutedColor, '#737376')};` +
    `--tc-footer:${color(s.footerColor, '#f7f7f7')};--tc-heading-font:"${heading}",cursive;--tc-body-font:"${body}",sans-serif}`
  );
}

/** Date of an entry in the site's format. */
function EntryDate({ iso }: { iso: string | null }) {
  const page = usePage();
  if (!iso) return null;
  return <span>{formatDate(iso, page.site.dateFormat ?? 'F j, Y', page.locale, page.site.timezone)}</span>;
}

/** Categories of an entry as the small links after the date. */
function Categories({ terms }: { terms?: Record<string, TermLink[]> }) {
  const hidden = text(useThemeSettings<Settings>().hiddenTag);
  const list = (terms?.category ?? terms?.categories ?? []).filter((t) => t.slug !== hidden);
  return (
    <>
      {list.map((t) => (
        <a key={t.slug} href={t.url} className="tc-cat">
          <span>{t.name}</span>
        </a>
      ))}
    </>
  );
}

function hasHiddenTag(entry: { terms?: Record<string, TermLink[]> }, hidden: string): boolean {
  if (!hidden) return false;
  return Object.values(entry.terms ?? {}).some((list) => list.some((t) => t.slug === hidden));
}

/** A card of a list: image, date and categories, title, excerpt. */
export function Card({ entry, words, eager }: { entry: PublicEntrySummary; words: number; eager?: boolean }) {
  return (
    <article className="tc-card">
      <a href={entry.url} className="tc-card-image" tabIndex={-1} aria-hidden="true">
        {entry.image && <Image media={entry.image} alt="" eager={eager} sizes="(max-width: 640px) 100vw, 420px" />}
      </a>
      <header className="tc-card-header">
        <div className="tc-date">
          <EntryDate iso={entry.publishedAt} />
          <Categories terms={entry.terms} />
        </div>
        <h2 className="tc-card-title">
          <a href={entry.url}>{entry.title}</a>
        </h2>
      </header>
      {entry.excerpt && (
        <div className="tc-excerpt">
          <p>{trimWords(entry.excerpt, words)}</p>
        </div>
      )}
    </article>
  );
}

/** The share links of an article. */
function Share({ entry }: { entry: PublicEntry }) {
  const settings = useThemeSettings<Settings>();
  const t = strings(usePage().locale);
  if (settings.shareButtons === false) return null;
  const url = encodeURIComponent(entry.url);
  const title = encodeURIComponent(entry.title);
  const via = text(settings.shareVia).replace(/[^A-Za-z0-9_]/g, '');
  const links = [
    ['whatsapp', `https://wa.me/?text=${title}%20${url}`, t.shareOn('WhatsApp')],
    ['facebook', `https://www.facebook.com/sharer/sharer.php?u=${url}`, t.shareOn('Facebook')],
    ['twitter', `https://twitter.com/intent/tweet?text=${title}&url=${url}${via ? `&via=${via}` : ''}`, t.shareOn('Twitter')],
    ['linkedin', `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`, t.shareOn('LinkedIn')],
  ] as const;
  return (
    <div className="tc-share">
      <ul>
        {links.map(([key, href, label]) => (
          <li key={key} className={`tc-share-${key}`}>
            <a href={href} target="_blank" rel="noopener noreferrer" title={label} aria-label={label}>
              <Brand name={key} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Avatar({ name, url }: { name: string; url?: string | null }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return url ? (
    <img className="tc-avatar" src={url} alt="" width={42} height={42} loading="lazy" />
  ) : (
    <span className="tc-avatar tc-avatar-initials" aria-hidden="true">
      {initials}
    </span>
  );
}

function Article({ entry }: { entry: PublicEntry }) {
  const settings = useThemeSettings<Settings>();
  const t = strings(usePage().locale);
  const hidden = text(settings.hiddenTag);
  const related = (entry.related ?? []).filter((r) => !hasHiddenTag(r, hidden)).slice(0, 5);
  return (
    <div className="tc-single">
      <div className="tc-container-medium">
        <article className="tc-article">
          <div className="tc-article-main">
            {entry.featuredImage && (
              <Image media={entry.featuredImage} eager alt={entry.title} sizes="(max-width: 640px) 100vw, 900px" />
            )}
            <div className="tc-article-text">
              <header className="tc-entry-header">
                <div className="tc-date">
                  <EntryDate iso={entry.publishedAt} />
                  <Categories terms={entry.terms} />
                </div>
                <h1 className="tc-entry-title">{entry.title}</h1>
                {entry.author && (
                  <div className="tc-author">
                    <Avatar name={entry.author.displayName} url={entry.author.avatarUrl} />
                    <span>{entry.author.displayName}</span>
                  </div>
                )}
                <Share entry={entry} />
              </header>
              <div className="tc-entry-content entry-content">
                <EntryContent document={entry.document} />
              </div>
              <Share entry={entry} />
              {settings.showComments !== false && (
                <div className="tc-comments">
                  <Comments />
                </div>
              )}
            </div>
          </div>
          <aside className="tc-article-side">
            <BlockArea name="sidebar" className="tc-side-area" />
            {related.length > 0 && (
              <>
                <h3 className="tc-side-title">{text(settings.relatedTitle, t.latest)}</h3>
                <div className="tc-side-list">
                  {related.map((r) => (
                    <article key={r.id} className="tc-card tc-card-small">
                      <a href={r.url} className="tc-card-image" tabIndex={-1} aria-hidden="true">
                        {r.image && <Image media={r.image} alt="" sizes="300px" />}
                      </a>
                      <header className="tc-card-header">
                        <div className="tc-date">
                          <EntryDate iso={r.publishedAt} />
                          <Categories terms={r.terms} />
                        </div>
                        <h2 className="tc-card-title">
                          <a href={r.url}>{r.title}</a>
                        </h2>
                      </header>
                    </article>
                  ))}
                </div>
              </>
            )}
          </aside>
        </article>
      </div>
    </div>
  );
}

function Page({ entry, front }: { entry: PublicEntry; front: boolean }) {
  const data = (entry.document.editor?.data ?? {}) as { hideTitle?: unknown; hideFeatured?: unknown; layout?: unknown };
  const builder = data.layout === 'full' || data.layout === 'canvas';
  if (front || builder) {
    return (
      <div className={front ? 'tc-front' : 'tc-builder'}>
        <EntryContent document={entry.document} />
      </div>
    );
  }
  return (
    <div className="tc-container-small tc-page">
      {data.hideTitle !== true && (
        <header className="tc-hero">
          <h1 className="tc-hero-title">{entry.title}</h1>
        </header>
      )}
      {entry.featuredImage && data.hideFeatured !== true && (
        <Image media={entry.featuredImage} alt="" sizes="(max-width: 1200px) 100vw, 1140px" />
      )}
      <div className="tc-page-content entry-content">
        <EntryContent document={entry.document} />
      </div>
    </div>
  );
}

function More({ pagination, label }: { pagination: Pagination; label: string }) {
  if (!pagination.nextUrl) return null;
  return (
    <div className="tc-more-bar">
      <a className="tc-button tc-button-secondary tc-button-small tc-more" href={pagination.nextUrl} data-tc-more="">
        {label}
      </a>
    </div>
  );
}

function Listing({ title, entries, pagination, band }: {
  title: ReactNode;
  entries: PublicEntrySummary[];
  pagination: Pagination;
  band?: boolean;
}) {
  const settings = useThemeSettings<Settings>();
  const page = usePage();
  const t = strings(page.locale);
  const hidden = text(settings.hiddenTag);
  const words = Number(settings.excerptWords ?? 20);
  const logo = settings.bandLogo ? page.media.get(settings.bandLogo) : undefined;
  if (band) {
    return (
      <div className="tc-band-page">
        <header className="tc-hero">
          {logo && <img className="tc-band-logo" src={logo.url} alt={logo.alt || ''} />}
          <h1 className="tc-hero-title">{title}</h1>
        </header>
        <BlockArea name="band" className="tc-band-area" />
      </div>
    );
  }
  const list = entries.filter((e) => !hasHiddenTag(e, hidden));
  return (
    <div className="tc-container">
      <header className="tc-hero">
        <h1 className="tc-hero-title">{title}</h1>
      </header>
      <div className="tc-articles">
        <div className="tc-cards" data-tc-list="">
          {list.map((e, i) => (
            <Card key={e.id} entry={e} words={words} eager={i < 3} />
          ))}
        </div>
        <More pagination={pagination} label={text(settings.moreLabel, t.more)} />
      </div>
    </div>
  );
}

function PageLinks({ pagination }: { pagination: Pagination }) {
  const t = strings(usePage().locale);
  if (pagination.totalPages <= 1) return null;
  return (
    <nav className="tc-pages" aria-label={t.pagination}>
      {pagination.prevUrl && <a href={pagination.prevUrl}>« {t.newer}</a>}
      <span className="tc-pages-current">{pagination.page}</span>
      <span> / {pagination.totalPages}</span>
      {pagination.nextUrl && <a href={pagination.nextUrl}>{t.older} »</a>}
    </nav>
  );
}

function Index(props: TemplateProps) {
  const page = usePage();
  const settings = useThemeSettings<Settings>();
  const t = strings(page.locale);
  switch (props.kind) {
    case 'entry': {
      const { entry } = props;
      const isPost = entry.type === 'post' || entry.type === 'article';
      return (
        <Location name="single" entry={entry}>
          {isPost ? <Article entry={entry} /> : <Page entry={entry} front={props.isFrontPage} />}
        </Location>
      );
    }
    case 'archive': {
      if (props.author) {
        const a = props.author;
        return (
          <Location name="archive">
            <div className="tc-container-small tc-author-page">
              <header className="tc-author-header">
                <h1>{t.about(a.displayName)}</h1>
                {a.avatarUrl && <img className="tc-author-avatar" src={a.avatarUrl} alt="" width={96} height={96} />}
                {(a.website || a.bio) && (
                  <dl>
                    {a.website && safeHref(a.website) && (
                      <>
                        <dt>{t.website}</dt>
                        <dd>
                          <a href={safeHref(a.website)!}>{a.website}</a>
                        </dd>
                      </>
                    )}
                    {a.bio && (
                      <>
                        <dt>{t.profile}</dt>
                        <dd>{a.bio}</dd>
                      </>
                    )}
                  </dl>
                )}
                <h2>{t.postsBy(a.displayName)}</h2>
              </header>
              <ul className="tc-author-list">
                {props.entries.map((e) => (
                  <li key={e.id}>
                    <a href={e.url} rel="bookmark">{e.title}</a> {t.postedOn} <EntryDate iso={e.publishedAt} />{' '}
                    {t.by} {a.displayName} {t.in}{' '}
                    {(e.terms?.category ?? []).map((c, i) => (
                      <span key={c.slug}>
                        {i > 0 && ' & '}
                        <a href={c.url}>{c.name}</a>
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
              <PageLinks pagination={props.pagination} />
            </div>
          </Location>
        );
      }
      const band = Boolean(props.term && props.term.slug === text(settings.bandCategory));
      const title = band ? text(settings.bandTitle, props.title) : props.term ? props.term.name : props.title;
      return (
        <Location name="archive">
          <Listing title={title} entries={props.entries} pagination={props.pagination} band={band} />
        </Location>
      );
    }
    case 'search':
      return (
        <Location name="archive">
          <div className="tc-container-small tc-search-page">
            {props.entries.length > 0 ? (
              <header className="tc-search-header">
                <h1>
                  {t.resultsFor}
                  <span>{props.query}</span>
                </h1>
              </header>
            ) : (
              <header className="tc-search-header">
                <h1>{t.nothingFound}</h1>
                <p>{t.nothingFoundText}</p>
                <SearchForm id="tc-q404" />
              </header>
            )}
            {props.entries.map((e) => (
              <article key={e.id} className="tc-result">
                <h2 className="tc-result-title">
                  <a href={e.url}>{e.title}</a>
                </h2>
                <p className="tc-result-meta">
                  {t.postedOn} <a href={e.url}><EntryDate iso={e.publishedAt} /></a>
                  {e.author && (
                    <>
                      {' '}
                      {t.by} {e.author.url ? <a href={e.author.url}>{e.author.displayName}</a> : e.author.displayName}
                    </>
                  )}
                </p>
                {e.excerpt && <p className="tc-result-excerpt">{trimWords(e.excerpt, 55)}</p>}
                <p className="tc-result-terms">
                  {(e.terms?.category ?? []).length > 0 && (
                    <>
                      {t.postedIn}{' '}
                      {(e.terms?.category ?? []).map((c, i) => (
                        <span key={c.slug}>
                          {i > 0 && ', '}
                          <a href={c.url}>{c.name}</a>
                        </span>
                      ))}
                    </>
                  )}
                  {(e.terms?.tag ?? e.terms?.post_tag ?? []).filter((x) => x.slug !== text(settings.hiddenTag)).length > 0 && (
                    <>
                      {' '}
                      {t.tagged}{' '}
                      {(e.terms?.tag ?? e.terms?.post_tag ?? []).filter((x) => x.slug !== text(settings.hiddenTag)).map((c, i) => (
                        <span key={c.slug}>
                          {i > 0 && ', '}
                          <a href={c.url}>{c.name}</a>
                        </span>
                      ))}
                    </>
                  )}
                </p>
              </article>
            ))}
            <PageLinks pagination={props.pagination} />
          </div>
        </Location>
      );
    case '404': {
      const image = settings.notFoundImage ? page.media.get(settings.notFoundImage) : undefined;
      return (
        <div className="tc-container tc-404">
          <header>
            {image && <img className="tc-404-image" src={image.url} alt="" />}
            <h1>{text(settings.notFoundTitle, t.notFoundTitle)}</h1>
          </header>
          <p className="tc-404-text">{text(settings.notFoundText, t.notFoundText)}</p>
          <a className="tc-404-link" href={page.urls.home}>
            {t.backHome}
          </a>
        </div>
      );
    }
    case 'maintenance':
      return (
        <div className="tc-container tc-404">
          <h1>{t.maintenanceTitle}</h1>
          <p className="tc-404-text">{t.maintenanceText}</p>
        </div>
      );
  }
}

function SearchForm({ id }: { id: string }) {
  const page = usePage();
  const t = strings(page.locale);
  return (
    <form className="tc-search-form" role="search" action={page.urls.search} method="get">
      <label className="tc-sr" htmlFor={id}>
        {t.search}
      </label>
      <input id={id} type="search" name="q" placeholder={t.searchPlaceholder} />
      <button type="submit">{t.search}</button>
    </form>
  );
}

/** The main menu, with the emoji or icon of each item (its "Icon" option) before the label. */
function MainMenu({ items, id }: { items: MenuItemView[]; id?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className="tc-menu" id={id}>
      {items.map((item) => {
        const icon = typeof item.data?.icon === 'string' ? item.data.icon : '';
        return (
          <li key={item.id} className={item.current ? 'is-current' : undefined}>
            <a href={item.url} target={item.target} aria-current={item.current ? 'page' : undefined}>
              {icon && (
                <span className="tc-menu-icon" aria-hidden="true">
                  {icon}
                </span>
              )}
              {icon ? ' ' : ''}
              {item.label}
            </a>
            {item.children.length > 0 && <MainMenu items={item.children} />}
          </li>
        );
      })}
    </ul>
  );
}

function FooterMenu({ title, items }: { title: string; items: MenuItemView[] }) {
  if (items.length === 0) return null;
  return (
    <div className="tc-footer-menu">
      {title && <h4 className="tc-footer-menu-title">{title}</h4>}
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.url} target={item.target}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Layout({ head, css, children }: LayoutProps) {
  const page = usePage();
  const settings = useThemeSettings<Settings>();
  const t = strings(page.locale);
  const logo = settings.logo ? page.media.get(settings.logo) : undefined;
  const footerLogo = settings.footerLogo ? page.media.get(settings.footerLogo) : logo;
  const favicon = settings.favicon ? page.media.get(settings.favicon) : undefined;
  const powered = settings.poweredLogo ? page.media.get(settings.poweredLogo) : undefined;
  const credit = settings.creditLogo ? page.media.get(settings.creditLogo) : undefined;
  const primary = page.menus.primary ?? [];
  const spot = text(settings.topBarText);
  const spotLink = safeHref(settings.topBarLink);
  const social = SOCIAL.map(([key, icon, label]) => [safeHref(settings[key]), icon, label] as const).filter(
    ([href]) => href,
  );
  const heading = family(settings.headingFont, 'Lilita One');
  const body = family(settings.bodyFont, 'IBM Plex Sans');
  const view = page.view;
  const editor = view?.kind === 'entry' ? ((view.entry.document.editor?.data ?? {}) as { layout?: unknown }) : {};
  const kind =
    view?.kind === 'entry'
      ? view.isFrontPage
        ? 'front'
        : editor.layout === 'full' || editor.layout === 'canvas'
          ? 'builder'
          : view.entry.type
      : (view?.kind ?? 'page');
  const poweredUrl = safeHref(settings.poweredUrl);
  const creditUrl = safeHref(settings.creditUrl);
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
        <link rel="stylesheet" href={fontsUrl(heading, body)} />
        <style dangerouslySetInnerHTML={{ __html: varsCss(settings) + css }} />
        <HeadTags tags={head.tags} />
      </head>
      <body className={`tc-kind-${String(kind).replace(/[^a-z0-9-]/gi, '')}${spot ? ' tc-has-spot' : ''}`}>
        <a className="tc-skip" href="#content">
          {t.skip}
        </a>
        <div className="tc-site">
          <div className="tc-search-tab" id="tc-search" hidden>
            <div className="tc-container-medium">
              <div className="tc-search-tab-content">
                <h4 className="tc-search-tab-title">{text(settings.searchTitle, t.searchTitle)}</h4>
                <SearchForm id="tc-q" />
              </div>
            </div>
          </div>
          {spot && (
            <div className="tc-spot">
              <div className="tc-container-big">
                <span className="tc-spot-text">{spot}</span>
                {spotLink && text(settings.topBarCta) && (
                  <a className="tc-spot-link" href={spotLink}>
                    {text(settings.topBarCta)}
                  </a>
                )}
              </div>
            </div>
          )}
          <Location name="header">
            <header className="tc-top" data-customize="identity">
              <div className="tc-container-big">
                <div className="tc-top-content">
                  <div className="tc-top-left">
                    <a className="tc-logo" href={page.urls.home} aria-label={page.site.title}>
                      {logo ? <img src={logo.url} alt={page.site.title} /> : <span className="tc-site-name">{page.site.title}</span>}
                    </a>
                    <nav className="tc-nav" id="tc-nav" aria-label={t.mainMenu}>
                      <button type="button" className="tc-icon-button tc-nav-close" data-tc-close="" aria-label={t.close}>
                        <CloseIcon />
                      </button>
                      <MainMenu items={primary} id="tc-main-menu" />
                    </nav>
                  </div>
                  <div className="tc-top-right">
                    <button type="button" className="tc-icon-button" data-tc-search="" aria-controls="tc-search" aria-expanded="false" aria-label={t.search}>
                      <SearchIcon />
                    </button>
                    {primary.length > 0 && (
                      <button type="button" className="tc-icon-button tc-burger" data-tc-menu="" aria-controls="tc-nav" aria-expanded="false" aria-label={t.menu}>
                        <MenuIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </header>
          </Location>
          <main id="content" className="tc-main">
            {children}
          </main>
          <a href="#content" className="tc-to-top" aria-label={t.toTop}>
            <UpIcon />
          </a>
          <Location name="footer">
            <footer className="tc-footer" data-customize="footer">
              <div className="tc-footer-main">
                <div className="tc-container-big">
                  <div className="tc-footer-content">
                    <div className="tc-footer-left">
                      {footerLogo && (
                        <div className="tc-footer-logo">
                          <img src={footerLogo.url} alt={page.site.title} />
                        </div>
                      )}
                      {text(settings.footerText) && <p className="tc-footer-text">{text(settings.footerText)}</p>}
                      {social.length > 0 && (
                        <div className="tc-social">
                          {social.map(([href, icon, label]) => (
                            <a key={icon} href={href!} target="_blank" rel="noopener" title={t.followOn(label)} aria-label={t.followOn(label)}>
                              <Brand name={icon} />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="tc-footer-right">
                      <FooterMenu title={text(settings.footerMenu1Title)} items={page.menus.footer1 ?? []} />
                      <FooterMenu title={text(settings.footerMenu2Title)} items={page.menus.footer2 ?? []} />
                    </div>
                  </div>
                </div>
              </div>
              <BlockArea name="footer" className="tc-footer-area" />
              <div className="tc-copyright">
                <div className="tc-container-big">
                  <div className="tc-copyright-content">
                    <p>{withYear(text(settings.copyright, `© {year} ${page.site.title}`))}</p>
                    {(text(settings.poweredName) || credit) && (
                      <p>
                        {text(settings.poweredName) && (
                          <>
                            {text(settings.poweredText)}{' '}
                            {poweredUrl ? (
                              <a href={poweredUrl} target="_blank" rel="noopener">
                                {text(settings.poweredName)}
                              </a>
                            ) : (
                              text(settings.poweredName)
                            )}
                            {powered && <img src={powered.url} className="tc-powered-logo" alt={text(settings.poweredName)} />}
                          </>
                        )}
                        {credit && (
                          <span className="tc-credit">
                            {creditUrl ? (
                              <a href={creditUrl} target="_blank" rel="noopener" aria-label={text(settings.creditLabel, credit.alt || '')}>
                                <img src={credit.url} alt={text(settings.creditLabel, credit.alt || '')} />
                              </a>
                            ) : (
                              <img src={credit.url} alt={text(settings.creditLabel, credit.alt || '')} />
                            )}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </footer>
          </Location>
        </div>
        <script dangerouslySetInnerHTML={{ __html: script }} />
      </body>
    </html>
  );
}

const hex = (example: string) => ({
  type: 'text' as const,
  section: 'colors',
  maxLength: 7,
  help: { en: `Hexadecimal, e.g. ${example}`, it: `Esadecimale, es. ${example}` },
});
const media = (name: string, section: string, en: string, it: string) => ({
  name,
  type: 'media' as const,
  section,
  label: { en, it },
});
const line = (name: string, section: string, en: string, it: string, maxLength = 200) => ({
  name,
  type: 'text' as const,
  section,
  maxLength,
  label: { en, it },
});

export const theme = defineTheme({
  slug: 'taccuino',
  name: 'Taccuino',
  version: '1.0.0',
  description:
    'A theme for news sites, magazines and blogs: the latest article over its photo, article cards, articles with a sidebar, a band of podcast players, footer with two menus.',
  menuLocations: { primary: 'Main menu', footer1: 'Footer menu 1', footer2: 'Footer menu 2' },
  menuItemFields: [
    {
      field: {
        name: 'icon',
        type: 'text',
        maxLength: 8,
        label: { en: 'Icon (an emoji)', it: 'Icona (un’emoji)' },
        help: { en: 'Shown before the label in the main menu, e.g. 🎧', it: 'Mostrata prima del testo nel menu principale, es. 🎧' },
      },
      levels: 'top',
    },
  ],
  areas: {
    sidebar: 'Article sidebar',
    band: 'Band category page',
    footer: 'Footer (above the copyright)',
  },
  areaDefaults: {
    band: {
      schema: 1,
      blocks: [{ v: 1, id: 'tcband1', type: 'taccuino-blocks/embeds', attrs: { count: 30, field: 'embed_spotify', layout: 'grid' } }],
    } as never,
  },
  relatedEntries: 5,
  listTerms: true,
  settingsSections: [
    { id: 'identity', label: { en: 'Site identity', it: 'Identità del sito' } },
    { id: 'colors', label: { en: 'Colors and fonts', it: 'Colori e caratteri' } },
    { id: 'topbar', label: { en: 'Top bar', it: 'Barra in alto' } },
    { id: 'lists', label: { en: 'Lists and articles', it: 'Elenchi e articoli' } },
    { id: 'band', label: { en: 'Band category (podcast)', it: 'Categoria a fascia (podcast)' } },
    { id: 'footer', label: { en: 'Footer', it: 'Piè di pagina' } },
    { id: 'social', label: { en: 'Social profiles', it: 'Profili social' } },
    { id: 'notfound', label: { en: 'Page not found', it: 'Pagina non trovata' } },
  ],
  settings: [
    media('logo', 'identity', 'Logo', 'Logo'),
    media('favicon', 'identity', 'Site icon (favicon)', 'Icona del sito (favicon)'),
    line('searchTitle', 'identity', 'Title of the search panel', 'Titolo del pannello di ricerca', 80),
    { name: 'accentColor', label: { en: 'Main color (links, buttons)', it: 'Colore principale (link, pulsanti)' }, default: '#0770b8', ...hex('#0770b8') },
    { name: 'highlightColor', label: { en: 'Highlight (hover, band)', it: 'Evidenza (passaggio, fascia)' }, default: '#f9b238', ...hex('#f9b238') },
    { name: 'textColor', label: { en: 'Text', it: 'Testo' }, default: '#1d1d1b', ...hex('#1d1d1b') },
    { name: 'mutedColor', label: { en: 'Secondary text', it: 'Testo secondario' }, default: '#737376', ...hex('#737376') },
    { name: 'footerColor', label: { en: 'Footer background', it: 'Sfondo del piè di pagina' }, default: '#f7f7f7', ...hex('#f7f7f7') },
    {
      ...line('headingFont', 'colors', 'Font of the titles (Google Fonts name)', 'Carattere dei titoli (nome di Google Fonts)', 60),
      default: 'Lilita One',
    },
    {
      ...line('bodyFont', 'colors', 'Font of the text (Google Fonts name, with weights 300 and 700)', 'Carattere del testo (nome di Google Fonts, con i pesi 300 e 700)', 60),
      default: 'IBM Plex Sans',
    },
    line('topBarText', 'topbar', 'Text (empty: no bar)', 'Testo (vuoto: nessuna barra)', 200),
    line('topBarCta', 'topbar', 'Link label', 'Testo del link', 60),
    line('topBarLink', 'topbar', 'Link address', 'Indirizzo del link', 500),
    { name: 'excerptWords', type: 'number', section: 'lists', min: 0, max: 100, default: 20, label: { en: 'Words of the excerpts (0: all)', it: 'Parole dei riassunti (0: tutte)' } },
    line('moreLabel', 'lists', 'Label of the "load more" button', 'Testo del pulsante "carica altri"', 60),
    {
      ...line('hiddenTag', 'lists', 'Tag of the entries hidden from the lists', 'Tag degli articoli nascosti dagli elenchi', 100),
      help: {
        en: 'Articles with this tag (its slug) are left out of the home page, category and tag lists; they stay at their address and in the search.',
        it: 'Gli articoli con questo tag (il suo slug) non compaiono nella home e negli elenchi di categorie e tag; restano al loro indirizzo e nella ricerca.',
      },
    },
    line('relatedTitle', 'lists', 'Title of the latest articles in the sidebar', 'Titolo degli ultimi articoli nella barra laterale', 80),
    { name: 'shareButtons', type: 'boolean', section: 'lists', default: true, label: { en: 'Share buttons on articles', it: 'Pulsanti di condivisione negli articoli' } },
    { name: 'showComments', type: 'boolean', section: 'lists', default: true, label: { en: 'Comments under the articles', it: 'Commenti sotto gli articoli' } },
    line('shareVia', 'lists', 'Twitter/X account for "via" (without @)', 'Account Twitter/X per "via" (senza @)', 30),
    line('bandCategory', 'band', 'Category shown as a band of players (slug)', 'Categoria mostrata come fascia di player (slug)', 100),
    media('bandLogo', 'band', 'Logo of the band', 'Logo della fascia'),
    line('bandTitle', 'band', 'Title of its page', 'Titolo della sua pagina', 120),
    media('footerLogo', 'footer', 'Footer logo (empty: the logo)', 'Logo del piè di pagina (vuoto: il logo)'),
    line('footerText', 'footer', 'Text under the logo', 'Testo sotto il logo', 300),
    line('footerMenu1Title', 'footer', 'Title of footer menu 1', 'Titolo del menu 1 del piè di pagina', 60),
    line('footerMenu2Title', 'footer', 'Title of footer menu 2', 'Titolo del menu 2 del piè di pagina', 60),
    { ...line('copyright', 'footer', 'Copyright line ({year}: the current year)', 'Riga del copyright ({year}: l’anno in corso)', 300) },
    line('poweredText', 'footer', 'Text before the partner (e.g. Powered by)', 'Testo prima del partner (es. Powered by)', 60),
    line('poweredName', 'footer', 'Partner name', 'Nome del partner', 80),
    line('poweredUrl', 'footer', 'Partner address', 'Indirizzo del partner', 500),
    media('poweredLogo', 'footer', 'Partner logo', 'Logo del partner'),
    media('creditLogo', 'footer', 'Credit logo (e.g. the web agency)', 'Logo del credito (es. la web agency)'),
    line('creditUrl', 'footer', 'Credit address', 'Indirizzo del credito', 500),
    line('creditLabel', 'footer', 'Credit name', 'Nome del credito', 80),
    ...SOCIAL.map(([name, , label]) => line(name, 'social', `${label} address`, `Indirizzo ${label}`, 500)),
    media('notFoundImage', 'notfound', 'Image', 'Immagine'),
    line('notFoundTitle', 'notfound', 'Title', 'Titolo', 80),
    line('notFoundText', 'notfound', 'Text', 'Testo', 200),
  ],
  presets: [
    { id: 'blue-orange', label: { en: 'Blue and orange', it: 'Blu e arancio' }, values: { accentColor: '#0770b8', highlightColor: '#f9b238' } },
    { id: 'press', label: { en: 'Newspaper red', it: 'Rosso quotidiano' }, values: { accentColor: '#c8102e', highlightColor: '#f2c14e', headingFont: 'Oswald' } },
    { id: 'green', label: { en: 'Pitch green', it: 'Verde campo' }, values: { accentColor: '#0b7a4b', highlightColor: '#ffd166' } },
  ],
  templates: { index: Index },
  Layout,
  css: themeCss,
  editorCss: (s) => `@import url("${fontsUrl(family(s.headingFont, 'Lilita One'), family(s.bodyFont, 'IBM Plex Sans'))}");` + varsCss(s as Settings) + editorCss,
  comments: 'manual',
  aiGuide:
    'Taccuino is a news and magazine theme. The home page is a page with the blocks of Taccuino Blocks ("Articles": the latest article big over its photo, then cards; "Embeds of articles": a band of players read from a field of the articles, e.g. a Spotify episode). Articles show their date, categories, author, share buttons and a sidebar (block area "Article sidebar", then the latest articles). The category named in Customize → Band category is shown as a colored band of players (block area "Band category page"). Texts, colors, fonts, social profiles and the footer come from Customize.',
});

void sdk;
export default theme;
