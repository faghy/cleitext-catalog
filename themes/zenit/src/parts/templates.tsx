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

/** A date as the site writes it (e.g. "October 1, 2026"). */
export function dateText(r: R, iso: string): string {
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

/** The title area of an entry, from the structure chosen for its type. */
function EntryHeader({ r, entry }: { r: R; entry: PublicEntry }) {
  const { o, c } = r;
  const pt = c.postType;
  if (meta(o, c, 'site-post-title', '', true) === 'disabled') return null;
  if (o.get(`zn-single-${pt}-title`, true) === false) return null;
  const structure = o.get(
    `zn-dynamic-single-${pt}-structure`,
    pt === 'page'
      ? [`zn-dynamic-single-${pt}-image`, `zn-dynamic-single-${pt}-title`]
      : // A product shows its title only: price and details are the shop's.
        pt === 'product'
        ? [`zn-dynamic-single-${pt}-title`]
        : [`zn-dynamic-single-${pt}-title`, `zn-dynamic-single-${pt}-meta`],
  ) as string[];
  const metadata = o.get<string[]>(`zn-dynamic-single-${pt}-metadata`, ['author', 'date']);
  const separator = str(o.get(`zn-dynamic-single-${pt}-metadata-separator`, '/'));
  const hideTitle =
    (entry.document.editor?.data as { hideTitle?: unknown } | undefined)?.hideTitle === true;
  return (
    <header
      className={cx('entry-header', pt === 'page' && !entry.featuredImage && 'zn-no-thumbnail')}
    >
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
        if (
          name === 'image' &&
          entry.featuredImage &&
          meta(o, c, 'zn-featured-img', '', true) !== 'disabled'
        )
          return (
            <div key="image" className="post-thumb-img-content post-thumb">
              <Image media={entry.featuredImage} eager sizes="(min-width: 1200px) 1200px, 100vw" />
            </div>
          );
        return null;
      })}
    </header>
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
  const content = (
    <>
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
                    {r.t.readMore}
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
  return (
    <div className="zn-pagination">
      <nav className="navigation pagination" aria-label={r.t.pagination}>
        <div className="nav-links">
          {pagination.prevUrl && (
            <a className="prev page-numbers" href={pagination.prevUrl}>
              {r.t.previous}
            </a>
          )}
          <span aria-current="page" className="page-numbers current">
            {pagination.page}
          </span>
          {pagination.nextUrl && (
            <a className="next page-numbers" href={pagination.nextUrl}>
              {r.t.next}
            </a>
          )}
        </div>
      </nav>
    </div>
  );
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
            !props.isHome && (
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
