/**
 * The content of each kind of page: an entry (post, page…), a list of
 * posts (blog, categories, author), search results, the 404 page.
 */
import {
  COMMUNITY_JS,
  CommentText,
  EntryContent,
  FormattedDate,
  Image,
  Location,
  type PublicEntry,
  type PublicEntrySummary,
  type TemplateProps,
} from '@cleitext/theme-sdk';
import { Fragment, type ReactNode } from 'react';
import { blogLayout, isSingle, meta } from '../core/context.js';
import { formatPhpDate } from '../core/date.js';
import { blogColumns, dateBox, firstPostFull, infiniteLoad, isMasonry } from '../pro/blog.js';
import { str } from '../core/php.js';
import { Breadcrumbs, breadcrumbPosition } from './breadcrumbs.js';
import { ICONS, svg } from './icons.js';
import { sidebarLayout } from '../css/lib/main.js';
import { cx, slugId, useR, type R } from './render.js';
import { Sidebar } from './sidebar.js';

/** `<div id="primary">` with the blog layout classes, and the sidebar beside it. */
function Primary({
  r,
  children,
  grid,
  before,
  noMain,
  location,
  entry,
}: {
  r: R;
  children: ReactNode;
  grid?: boolean;
  /** Shown above the list (the title area of archives and searches). */
  before?: ReactNode;
  /** The 404 page has no `<main>`. */
  noMain?: boolean;
  /** The theme location a plugin may fill instead of the content (site builders). */
  location: 'single' | 'archive' | 'hook:zenit_404';
  /** On single entries: the entry, for the location's entry-content block. */
  entry?: PublicEntry;
}) {
  const layout = grid ? blogLayout(r.o, r.c) : '';
  const sidebar = sidebarLayout(r.o, r.c);
  const primary = (
    <div
      id="primary"
      className={cx(
        'content-area primary',
        grid && layout && `zn-grid-${blogColumns(r.o)} zn-${layout}-grid`,
        grid && isMasonry(r.o) && 'zn-blog-masonry',
        grid && firstPostFull(r.o) && 'zn-first-post-full',
      )}
    >
      {breadcrumbPosition(r) === 'before-title' && <Breadcrumbs r={r} />}
      <Location name={location} {...(entry ? { entry } : {})}>
        {before}
        {noMain ? (
          children
        ) : (
          <main id="main" className="site-main">
            {children}
          </main>
        )}
      </Location>
    </div>
  );
  if (sidebar === 'left-sidebar')
    return (
      <>
        <Sidebar r={r} />
        {primary}
      </>
    );
  if (sidebar === 'right-sidebar')
    return (
      <>
        {primary}
        <Sidebar r={r} />
      </>
    );
  return primary;
}

/** Terms of an entry as classes (`category-news`). */
const termClasses = (entry: PublicEntry) =>
  Object.entries(entry.terms)
    .flatMap(([tax, terms]) =>
      terms.map((t) => `${tax === 'category' ? 'category' : `tag`}-${t.slug}`),
    )
    .join(' ');

/**
 * A date as the site writes it: with the site's date format (Settings →
 * General, core 0.82, e.g. `F j, Y` imported from WordPress), else as
 * "October 1, 2026".
 */
export function dateText(r: R, iso: string): string {
  const format = (r.page.site as { dateFormat?: unknown }).dateFormat;
  if (typeof format === 'string' && format)
    return formatPhpDate(iso, format, r.page.locale, r.page.site.timezone);
  return new Intl.DateTimeFormat(r.page.locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: r.page.site.timezone,
  }).format(new Date(iso));
}

function EntryMeta({
  r,
  entry,
  items,
  separator,
  prefix = '',
}: {
  r: R;
  entry: PublicEntry | PublicEntrySummary;
  items: string[];
  separator: string;
  prefix?: string;
}) {
  const { t } = r;
  const parts: ReactNode[] = [];
  for (const item of items) {
    if (item === 'author' && entry.author) {
      parts.push(
        <Fragment key="author">
          {prefix}
          <span
            className="posted-by vcard author"
            itemType="https://schema.org/Person"
            itemScope
            itemProp="author"
          >
            <a
              title={t.postsBy(entry.author.displayName)}
              href={entry.author.url ?? '#'}
              rel="author"
              className="url fn n"
              itemProp="url"
            >
              <span className="author-name" itemProp="name">
                {entry.author.displayName}
              </span>
            </a>
          </span>
        </Fragment>,
      );
    } else if (item === 'date' && entry.publishedAt) {
      parts.push(
        <span key="date" className="posted-on">
          <span className="published" itemProp="datePublished">
            {` ${dateText(r, entry.publishedAt)} `}
          </span>
        </span>,
      );
    } else if (item === 'category' || item === 'tag') {
      const terms = entry.terms?.[item] ?? [];
      if (terms.length)
        parts.push(
          <span key={item} className={item === 'category' ? 'cat-links' : 'tags-links'}>
            {terms.map((term, i) => (
              <Fragment key={term.slug}>
                {i > 0 && ', '}
                <a href={term.url} rel={`${item} tag`}>
                  {term.name}
                </a>
              </Fragment>
            ))}
          </span>,
        );
    } else if (item === 'comments' && 'comments' in entry && entry.comments) {
      parts.push(
        <span key="comments" className="comments-link">
          <a href={`${entry.url}#comments`}>{entry.comments.count}</a>
        </span>,
      );
    }
  }
  const sep = separator === 'none' ? '\u00a0' : ` ${separator} `;
  // The parts are spans of their own: unwrap them so the markup is the same as without React.
  return (
    <div className="entry-meta">
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && sep}
          {p}
        </Fragment>
      ))}
    </div>
  );
}

const isSingleEntry = (e: PublicEntry | PublicEntrySummary): e is PublicEntry => 'document' in e;

/** Post types with a title area of their own (Customize → Blog and pages). */
const TITLE_AREA_TYPES = new Set(['post', 'page']);

/** Whether the entry shows its title area at all (Customize, the page's own options). */
function titleAreaShown(r: R): boolean {
  const { o, c } = r;
  const pt = c.postType;
  if (meta(o, c, 'site-post-title', '', true) === 'disabled') return false;
  if (meta(o, c, 'zn-banner-title-visibility', '', true) === 'disabled') return false;
  if (o.get(`zn-single-${pt}-title`, true) === false) return false;
  return !(
    pt === 'page' &&
    c.isFrontPage &&
    o.get(`zn-dynamic-single-${pt}-disable-structure-meta-on-front-page`, false) === true
  );
}

/**
 * The layout of the entry's title area: `layout-1` inside the content, or
 * `layout-2`, a banner across the page above it (posts and pages).
 */
export function titleLayout(r: R): 'layout-1' | 'layout-2' {
  const { o, c } = r;
  return TITLE_AREA_TYPES.has(c.postType) &&
    o.get(`zn-dynamic-single-${c.postType}-layout`, 'layout-1') === 'layout-2'
    ? 'layout-2'
    : 'layout-1';
}

/** Where the featured image of a banner goes: in it, at the top of the article, or behind it. */
function bannerImage(r: R, entry: PublicEntry): 'inside' | 'below' | 'background' | null {
  const { o, c } = r;
  const k = (s: string) => `zn-dynamic-single-${c.postType}-${s}`;
  if (!entry.featuredImage || meta(o, c, 'zn-featured-img', '', true) === 'disabled') return null;
  if (!structureOf(r).includes(k('image'))) return null;
  if (o.get(k('featured-as-background'), false) === true) return 'background';
  return o.get(k('article-featured-image-position-layout-2'), 'none') === 'below'
    ? 'below'
    : 'inside';
}

/** The parts of the title area chosen for the entry's type, in their order. */
function structureOf(r: R): string[] {
  const pt = r.c.postType;
  return r.o.get(
    `zn-dynamic-single-${pt}-structure`,
    pt === 'page'
      ? [`zn-dynamic-single-${pt}-image`, `zn-dynamic-single-${pt}-title`]
      : // A product shows its title only: price and details are the shop's.
        pt === 'product'
        ? [`zn-dynamic-single-${pt}-title`]
        : [`zn-dynamic-single-${pt}-title`, `zn-dynamic-single-${pt}-meta`],
  ) as string[];
}

/** The parts of an entry's title area, in the order of the structure chosen for its type. */
function TitleParts({ r, entry, banner }: { r: R; entry: PublicEntry; banner?: boolean }) {
  const { o, c } = r;
  const pt = c.postType;
  const structure = structureOf(r);
  const metadata = o.get<string[]>(`zn-dynamic-single-${pt}-metadata`, ['author', 'date']);
  const separator = str(o.get(`zn-dynamic-single-${pt}-metadata-separator`, '/'));
  const hideTitle =
    (entry.document.editor?.data as { hideTitle?: unknown } | undefined)?.hideTitle === true;
  // In a banner the image stays in it unless it goes below it or behind it.
  const image = banner
    ? bannerImage(r, entry) === 'inside'
    : Boolean(entry.featuredImage) && meta(o, c, 'zn-featured-img', '', true) !== 'disabled';
  return (
    <>
      {structure.map((el) => {
        const name = el.replace(`zn-dynamic-single-${pt}-`, '');
        if (name === 'title' && !hideTitle)
          return (
            <h1 key="title" className="entry-title" itemProp="headline">
              {entry.title}
            </h1>
          );
        if (name === 'meta' && pt !== 'page')
          return (
            <EntryMeta
              key="meta"
              r={r}
              entry={entry}
              items={metadata}
              separator={separator}
              prefix={str(o.get(`zn-dynamic-single-${pt}-author-prefix-label`, `${r.t.by} `))}
            />
          );
        if (name === 'excerpt' && entry.excerpt)
          return (
            <p key="excerpt" className="zn-excerpt">
              {entry.excerpt}
            </p>
          );
        if (name === 'breadcrumb') return <Breadcrumbs key="crumbs" r={r} />;
        if (name === 'image' && image && entry.featuredImage)
          return (
            <div key="image" className="post-thumb-img-content post-thumb">
              <Image media={entry.featuredImage} eager sizes="(min-width: 1200px) 1200px, 100vw" />
            </div>
          );
        return null;
      })}
    </>
  );
}

/** The title area of an entry inside its content (layout 1). */
function EntryHeader({ r, entry }: { r: R; entry: PublicEntry }) {
  const { c } = r;
  if (!titleAreaShown(r) || titleLayout(r) === 'layout-2') return null;
  return (
    <header
      className={cx(
        'entry-header',
        c.postType === 'page' && !entry.featuredImage && 'zn-no-thumbnail',
      )}
    >
      <TitleParts r={r} entry={entry} />
    </header>
  );
}

/** A color the banner's overlay may use: hex, rgb(a)/hsl(a) or a CSS variable. */
const overlayColor = (value: unknown) => {
  const v = str(value).trim();
  return /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([\d\s.,%/]+\)|var\(--[\w-]+\))$/i.test(v) ? v : '';
};

/**
 * The title area as a banner across the page, between the header and the
 * content (layout 2 of posts and pages, as Astra's): the parts of the
 * structure in a container, its background, height and colors from
 * Customize (`.zn-single-entry-banner` in the dynamic CSS). The featured
 * image can be its background, with an overlay color.
 */
export function SingleBanner({ r, entry }: { r: R; entry: PublicEntry }) {
  const { o, c } = r;
  if (!titleAreaShown(r) || titleLayout(r) !== 'layout-2') return null;
  const k = (s: string) => `zn-dynamic-single-${c.postType}-${s}`;
  const image = entry.featuredImage;
  const background = image && bannerImage(r, entry) === 'background' ? image : null;
  const overlay = overlayColor(o.get(k('banner-featured-overlay')));
  const url = background ? JSON.stringify(background.url) : '';
  return (
    <section
      className="zn-single-entry-banner"
      data-post-type={c.postType}
      data-banner-layout="layout-2"
      data-banner-width-type={
        o.get(k('banner-width-type'), 'fullwidth') === 'custom' ? 'custom' : 'fullwidth'
      }
      data-banner-background-type={background ? 'featured' : 'custom'}
      style={
        background
          ? {
              backgroundImage: overlay
                ? `linear-gradient(${overlay}, ${overlay}), url(${url})`
                : `url(${url})`,
              backgroundPosition: 'center center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      <div className="zn-container">
        <TitleParts r={r} entry={entry} banner />
      </div>
    </section>
  );
}

function PostNavigation({ r, entry }: { r: R; entry: PublicEntry }) {
  const nav = entry.adjacent;
  if (!nav?.prev && !nav?.next) return null;
  const { t } = r;
  const arrow = (dir: 'left' | 'right') => (
    <span
      aria-hidden="true"
      className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
      {...svg(dir === 'left' ? ICONS.longLeft : ICONS.longRight)}
    />
  );
  return (
    <nav className="navigation post-navigation" aria-label={t.posts}>
      <div className="nav-links">
        {nav.prev && (
          <div className="nav-previous">
            <a title={nav.prev.title} href={nav.prev.url} rel="prev">
              <span className="zn-post-nav" aria-hidden="true">
                {arrow('left')} {t.previous}
              </span>{' '}
              <p> {nav.prev.title} </p>
            </a>
          </div>
        )}
        {nav.next && (
          <div className="nav-next">
            <a title={nav.next.title} href={nav.next.url} rel="next">
              <span className="zn-post-nav" aria-hidden="true">
                {t.next} {arrow('right')}
              </span>{' '}
              <p> {nav.next.title} </p>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

function Comments({ r, entry }: { r: R; entry: PublicEntry }) {
  const c = entry.comments;
  if (!c || !r.o.get('enable-comments-area', true)) return null;
  if (!c.open && c.count === 0) return null;
  return (
    <div
      id="comments"
      className={`comments-area comment-form-position-${str(r.o.get('comment-form-position', 'below'))} `}
    >
      {c.count > 0 && (
        <ol className="zn-comment-list">
          {c.items.map((comment) => (
            <li key={comment.id} className="comment depth-1" id={`li-comment-${comment.id}`}>
              <article id={`comment-${comment.id}`} className="zn-comment">
                <div className="zn-comment-info">
                  <div className="zn-comment-avatar-wrap">
                    {comment.avatar.url ? (
                      <img
                        alt=""
                        src={comment.avatar.url}
                        className="avatar"
                        height={50}
                        width={50}
                      />
                    ) : (
                      <span className="avatar">{comment.avatar.initials}</span>
                    )}
                  </div>
                  <header className="zn-comment-meta zn-row zn-comment-author vcard capitalize">
                    <div className="zn-comment-cite-wrap">
                      <cite>
                        <b className="fn">{comment.authorName}</b>
                      </cite>
                    </div>
                    <div className="zn-comment-time">
                      <span className="timendate">
                        <time dateTime={comment.createdAt}>
                          <FormattedDate iso={comment.createdAt} />
                        </time>
                      </span>
                    </div>
                  </header>
                </div>
                <section className="zn-comment-content comment">
                  <CommentText text={comment.content} />
                </section>
              </article>
            </li>
          ))}
        </ol>
      )}
      {c.open && <CommentForm r={r} entry={entry} />}
    </div>
  );
}

function CommentForm({ r, entry }: { r: R; entry: PublicEntry }) {
  const c = entry.comments!;
  const { t, page } = r;
  return (
    <div id="respond" className="comment-respond">
      <h3 id="reply-title" className="comment-reply-title">
        {t.leaveComment}{' '}
        <small>
          <a
            rel="nofollow"
            id="cancel-comment-reply-link"
            href="#respond"
            style={{ display: 'none' }}
          >
            {t.cancelReply}
          </a>
        </small>
      </h3>
      <form
        action={c.action}
        method="post"
        id="zn-commentform"
        className="comment-form"
        data-cx-comment-form=""
      >
        {/* What the core reads: the entry, the reply, where to go back, and its spam checks. */}
        <input type="hidden" name="entry" value={entry.id} />
        <input type="hidden" name="parent" value={c.replyTo?.id ?? ''} data-cx-parent="" />
        <input type="hidden" name="back" value={entry.url} />
        <div className="cx-hp" aria-hidden="true">
          <label>
            Website
            <input type="text" name="homepage" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input type="hidden" name="ts" value="" data-cx-ts="" />
        {!page.viewer && (
          <p className="comment-notes">
            <span id="email-notes">{t.emailNotes}</span>{' '}
            <span className="required-field-message">
              {t.requiredFields} <span className="required">*</span>
            </span>
          </p>
        )}
        <div className="zn-row comment-textarea">
          <fieldset className="comment-form-comment">
            <legend className="comment-form-legend" />
            <div className="comment-form-textarea zn-grid-common-col">
              <label htmlFor="comment" className="screen-reader-text">
                {t.typeHere}
              </label>
              <textarea
                id="comment"
                name="comment"
                placeholder={t.typeHere}
                cols={45}
                rows={8}
                aria-required="true"
                required
              />
            </div>
          </fieldset>
        </div>
        {!page.viewer && (
          <div className="zn-comment-formwrap zn-row">
            <p className="comment-form-author zn-grid-common-col zn-width-lg-33 zn-width-md-4 zn-float">
              <label htmlFor="author" className="screen-reader-text">
                {t.nameField}
              </label>
              <input
                id="author"
                name="name"
                data-cx-remember="name"
                type="text"
                placeholder={t.nameField}
                size={30}
                required={c.requireNameEmail}
              />
            </p>
            <p className="comment-form-email zn-grid-common-col zn-width-lg-33 zn-width-md-4 zn-float">
              <label htmlFor="email" className="screen-reader-text">
                {t.emailField}
              </label>
              <input
                id="email"
                name="email"
                data-cx-remember="email"
                type="email"
                placeholder={t.emailField}
                size={30}
                required={c.requireNameEmail}
              />
            </p>
            <p className="comment-form-url zn-grid-common-col zn-width-lg-33 zn-width-md-4 zn-float">
              <label htmlFor="url" className="screen-reader-text">
                {t.websiteField}
              </label>
              <input id="url" name="url" type="url" placeholder={t.websiteField} size={30} />
            </p>
          </div>
        )}
        {c.protection && (
          <div className="cx-challenge" dangerouslySetInnerHTML={{ __html: c.protection }} />
        )}
        <p className="form-submit">
          <input name="submit" type="submit" id="submit" className="submit" value={t.postComment} />
        </p>
      </form>
      <script dangerouslySetInnerHTML={{ __html: COMMUNITY_JS }} />
    </div>
  );
}

function SingleEntry({ r, entry }: { r: R; entry: PublicEntry }) {
  const { c } = r;
  const post = isSingle(c);
  // Layout 2: the title is in the banner above; the image may go at the top of the article.
  const below =
    titleLayout(r) === 'layout-2' &&
    titleAreaShown(r) &&
    entry.featuredImage &&
    bannerImage(r, entry) === 'below' &&
    structureOf(r).includes(`zn-dynamic-single-${c.postType}-image`);
  const content = (
    <>
      {below && entry.featuredImage && (
        <div className="zn-single-post-featured-section post-thumb">
          <Image media={entry.featuredImage} eager sizes="(min-width: 1200px) 1200px, 100vw" />
        </div>
      )}
      <EntryHeader r={r} entry={entry} />
      <div className="entry-content clear" data-zn-blocks-layout="true" itemProp="text">
        <Location name="hook:zenit_entry_content_before" />
        <EntryContent document={entry.document} />
        <Location name="hook:zenit_entry_content_after" />
      </div>
    </>
  );
  return (
    <>
      <article
        className={cx(
          `post-${slugId(entry.id)}`,
          c.postType,
          `type-${c.postType}`,
          'status-publish',
          post && 'format-standard hentry',
          post && termClasses(entry),
          'zn-article-single',
        )}
        id={`post-${slugId(entry.id)}`}
        itemType="https://schema.org/CreativeWork"
        itemScope
      >
        {post ? (
          <div
            className={cx(
              'zn-post-format-',
              !entry.featuredImage && 'zn-no-thumb',
              'single-layout-1',
            )}
          >
            {content}
          </div>
        ) : (
          content
        )}
      </article>
      {post && <PostNavigation r={r} entry={entry} />}
      <Location name="hook:zenit_comments_before" />
      {post && <Comments r={r} entry={entry} />}
    </>
  );
}

/** A post in a list, its parts in the order chosen in the blog settings. */
function ListedPost({ r, entry, index }: { r: R; entry: PublicEntrySummary; index: number }) {
  const { o } = r;
  const structure = o.get<string[]>('blog-post-structure');
  const metaItems = o.get<string[]>('blog-meta');
  const layout = blogLayout(o, r.c);
  const box = dateBox(o);
  return (
    <article
      className={`post-${slugId(entry.id)} post type-post status-publish format-standard hentry zn-grid-common-col zn-full-width zn-article-post remove-featured-img-padding`}
      id={`post-${slugId(entry.id)}`}
      itemType="https://schema.org/CreativeWork"
      itemScope
    >
      <div
        className={cx(
          'zn-post-format-',
          !entry.image && 'zn-no-thumb',
          layout.replace('blog-layout-', 'blog-layout-'),
          'zn-article-inner',
        )}
      >
        <div className="post-content zn-grid-common-col">
          {structure.map((el) => {
            if (el === 'image')
              return (
                <div
                  key="image"
                  className="zn-blog-featured-section post-thumb zn-blog-single-element"
                >
                  {entry.image && (
                    <div className="post-thumb-img-content post-thumb">
                      {box && entry.publishedAt && (
                        <DateBox r={r} date={entry.publishedAt} style={box} />
                      )}
                      <a href={entry.url}>
                        <Image
                          media={entry.image}
                          alt=""
                          eager={index === 0}
                          sizes="(max-width: 921px) 100vw, 400px"
                        />
                      </a>
                    </div>
                  )}
                </div>
              );
            if (el === 'category' || el === 'tag') {
              const terms = entry.terms?.[el] ?? [];
              if (!terms.length) return null;
              return (
                <span
                  key={el}
                  className={`zn-blog-single-element zn-taxonomy-container ${el === 'category' ? 'cat-links' : 'tags-links'} ${str(o.get(`blog-${el}-style`, 'default'))}`}
                >
                  {terms.map((term, i) => (
                    <Fragment key={term.slug}>
                      {i > 0 && ', '}
                      <a href={term.url} rel={`${el} tag`}>
                        {term.name}
                      </a>
                    </Fragment>
                  ))}
                </span>
              );
            }
            if (el === 'title')
              return (
                <h2 key="title" className="entry-title zn-blog-single-element" itemProp="headline">
                  <a href={entry.url} rel="bookmark">
                    {entry.title}
                  </a>
                </h2>
              );
            if (el === 'title-meta')
              return (
                <header
                  key="meta"
                  className="entry-header zn-blog-single-element zn-blog-meta-container"
                >
                  <EntryMeta
                    r={r}
                    entry={entry}
                    items={metaItems}
                    separator={str(o.get('blog-post-meta-divider-type', '/'))}
                  />
                </header>
              );
            if (el === 'excerpt')
              return (
                <div key="excerpt" className="zn-excerpt-container zn-blog-single-element">
                  {entry.excerpt && (
                    <p>
                      {excerpt(
                        entry.excerpt,
                        layout === 'blog-layout-4' ? 20 : 55,
                        str(o.get('blog-excerpt-marker')),
                      )}
                    </p>
                  )}
                </div>
              );
            if (el === 'read-more')
              return (
                <p key="more" className="zn-blog-single-element zn-read-more-container read-more">
                  <a className="" href={entry.url}>
                    {' '}
                    <span className="screen-reader-text">{entry.title}</span> {r.t.readMore}
                  </a>
                </p>
              );
            return null;
          })}
          <div className="entry-content clear" itemProp="text" />
        </div>
      </div>
    </article>
  );
}

/** Zenit Pro: day and month over the featured image. */
function DateBox({ r, date, style }: { r: R; date: string; style: string }) {
  const part = (options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(r.page.locale, { ...options, timeZone: r.page.site.timezone }).format(
      new Date(date),
    );
  return (
    <time className={`zn-date-box zn-date-box-${style}`} dateTime={date}>
      <span className="zn-date-box-day">{part({ day: 'numeric' })}</span>
      <span className="zn-date-box-month">{part({ month: 'short' })}</span>
    </time>
  );
}

/** The first words of an excerpt, with the marker when shortened. */
function excerpt(text: string, words: number, marker: string): string {
  const list = text.split(/\s+/);
  if (list.length <= words) return text;
  const m = marker.replace(/&hellip;/g, '…');
  return `${list.slice(0, words).join(' ')} ${m}`;
}

function PostList({ r, entries }: { r: R; entries: PublicEntrySummary[] }) {
  return (
    <div className="zn-row">
      {entries.map((entry, i) => (
        <ListedPost key={entry.id} r={r} entry={entry} index={i} />
      ))}
    </div>
  );
}

function Pages({
  r,
  pagination,
}: {
  r: R;
  pagination: { page: number; totalPages: number; prevUrl: string | null; nextUrl: string | null };
}) {
  if (pagination.totalPages <= 1) return null;
  // Zenit Pro: the next posts are added below the list.
  const more = infiniteLoad(r.o);
  if (more)
    return pagination.nextUrl ? (
      <div className="zn-pagination zn-load-more" data-event={more} data-next={pagination.nextUrl}>
        <a className="zn-load-more-button" href={pagination.nextUrl}>
          {str(r.o.get('blog-load-more-text')) || r.t.loadMore}
        </a>
      </div>
    ) : null;
  const links: ReactNode[] = [];
  if (pagination.prevUrl)
    links.push(
      <a key="prev" className="prev page-numbers" href={pagination.prevUrl}>
        <span className="zn-left-arrow" aria-hidden="true">
          ←
        </span>{' '}
        {r.t.previous}
      </a>,
    );
  pageNumbers(pagination.page, pagination.totalPages).forEach((n, i) => {
    const url = n === null || n === pagination.page ? null : pageUrl(pagination, n);
    links.push(
      n === null ? (
        <span key={`dots-${i}`} className="page-numbers dots">
          …
        </span>
      ) : n === pagination.page ? (
        <span key={n} aria-current="page" className="page-numbers current">
          {n}
        </span>
      ) : url ? (
        <a key={n} className="page-numbers" href={url}>
          {n}
        </a>
      ) : (
        <span key={n} className="page-numbers">
          {n}
        </span>
      ),
    );
  });
  if (pagination.nextUrl)
    links.push(
      <a key="next" className="next page-numbers" href={pagination.nextUrl}>
        {r.t.next}{' '}
        <span className="zn-right-arrow" aria-hidden="true">
          →
        </span>
      </a>,
    );
  return (
    <div className="zn-pagination">
      <nav className="navigation pagination" aria-label={r.t.pagination}>
        <h2 className="screen-reader-text">{r.t.pagination}</h2>
        <div className="nav-links">
          {/* One per line, as WordPress prints them (spaces between the numbers). */}
          {links.flatMap((link, i) => (i ? ['\n', link] : [link]))}
        </div>
      </nav>
    </div>
  );
}

/**
 * The page numbers shown, `null` for "…" (as WordPress's `paginate_links()`
 * with one number at each end and one on each side of the current page).
 */
export function pageNumbers(current: number, total: number): (number | null)[] {
  const out: (number | null)[] = [];
  let dots = false;
  for (let n = 1; n <= total; n++) {
    if (n === current || n <= 1 || (n >= current - 1 && n <= current + 1) || n > total - 1) {
      out.push(n);
      dots = true;
    } else if (dots) {
      out.push(null);
      dots = false;
    }
  }
  return out;
}

/**
 * The address of page `n` of a list, from the address of the next or the
 * previous page (`…/page/3/`, or `…&page=3` for search results).
 */
export function pageUrl(
  pagination: { page: number; prevUrl: string | null; nextUrl: string | null },
  n: number,
): string | null {
  const known = pagination.nextUrl
    ? { url: pagination.nextUrl, page: pagination.page + 1 }
    : pagination.prevUrl
      ? { url: pagination.prevUrl, page: pagination.page - 1 }
      : null;
  if (!known) return null;
  if (n === known.page) return known.url;
  const query = /([?&]page=)\d+/;
  if (query.test(known.url)) return known.url.replace(query, `$1${n}`);
  const path = /\/page\/\d+(\/?)(?=[?#]|$)/;
  if (!path.test(known.url)) return null;
  if (n > 1) return known.url.replace(path, `/page/${n}$1`);
  return known.url.replace(path, '$1').replace(/^(?=[?#]|$)/, '/') || '/';
}

/** The search box of the 404 and "nothing found" pages. */
function SearchForm({ r }: { r: R }) {
  const { t, page } = r;
  return (
    <form role="search" method="get" className="search-form" action={page.urls.search}>
      <label htmlFor="search-field">
        <span className="screen-reader-text">{t.searchFor}</span>
        <input
          type="search"
          id="search-field-sticky"
          className="search-field"
          placeholder={t.searchPlaceholder}
          defaultValue=""
          name="q"
          tabIndex={-1}
        />
        <button className="search-submit zn-search-submit" aria-label={t.searchSubmit}>
          <span hidden>{t.search}</span>
          <i>
            <span className="zn-icon icon-search" {...svg(ICONS.search)} />
          </i>
        </button>
      </label>
      <input type="submit" className="search-submit" value={t.search} />
    </form>
  );
}

function NoResults({ r }: { r: R }) {
  return (
    <div className="no-results not-found">
      <div className="page-content">
        <p>{r.t.nothingFoundText}</p>
        <SearchForm r={r} />
      </div>
    </div>
  );
}

/** The template of every page (the theme has one: it switches on the kind of page). */
export function Index(props: TemplateProps) {
  const r = useR();
  switch (props.kind) {
    case 'entry':
      return (
        <Primary r={r} location="single" entry={props.entry}>
          <SingleEntry r={r} entry={props.entry} />
        </Primary>
      );
    case 'archive':
      return (
        <Primary
          r={r}
          grid
          location="archive"
          before={
            !props.isHome &&
            // The blog title area can be turned off (Blog / Archive → Blog title area).
            r.o.get('zn-archive-post-title', true) !== false && (
              <section className="zn-archive-description">
                <h1 className="page-title zn-archive-title">{props.title}</h1>
                {props.description && <p>{props.description}</p>}
              </section>
            )
          }
        >
          <PostList r={r} entries={props.entries} />
          <Pages r={r} pagination={props.pagination} />
        </Primary>
      );
    case 'search':
      return (
        <Primary
          r={r}
          grid
          location="archive"
          before={
            <section className="zn-archive-description">
              <h1 className="page-title zn-archive-title">
                {props.entries.length ? (
                  <>
                    {r.t.searchResultsFor('')}
                    <span>{props.query}</span>
                  </>
                ) : (
                  r.t.nothingFound
                )}
              </h1>
              <Breadcrumbs r={r} />
            </section>
          }
        >
          {props.entries.length ? <PostList r={r} entries={props.entries} /> : <NoResults r={r} />}
          <Pages r={r} pagination={props.pagination} />
        </Primary>
      );
    case '404':
      return (
        <Primary r={r} noMain location="hook:zenit_404">
          <section className="error-404 not-found">
            <div className="zn-404-layout-1">
              <header className="page-header">
                <h1 className="page-title">{r.t.notFoundTitle}</h1>
              </header>
              <div className="page-content">
                <h3 className="page-sub-title">{r.t.notFoundText}</h3>
                <div className="zn-404-search">
                  <div className="widget widget_search">
                    <SearchForm r={r} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Primary>
      );
    default:
      return null;
  }
}
