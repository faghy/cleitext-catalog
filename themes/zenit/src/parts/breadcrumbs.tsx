/** The breadcrumb trail (Home › section › page), where the settings place it. */
import { isPage, isSingular } from '../core/context.js';
import { meta } from '../core/context.js';
import { str } from '../core/php.js';
import type { R } from './render.js';

interface Crumb {
  label: string;
  url?: string;
}

function trail(r: R): Crumb[] {
  const { page, t } = r;
  const crumbs: Crumb[] = [{ label: t.home, url: page.urls.home }];
  const view = page.view;
  if (!view) return crumbs;
  if (view.kind === 'entry') {
    const category = view.entry.terms.category?.[0];
    if (category && !isPage(r.c)) crumbs.push({ label: category.name, url: category.url });
    crumbs.push({ label: view.entry.title });
  } else if (view.kind === 'archive' && !view.isHome) {
    crumbs.push({ label: view.title });
  } else if (view.kind === 'search') {
    crumbs.push({ label: t.searchResultsFor(view.query) });
  } else if (view.kind === '404') {
    crumbs.push({ label: '404' });
  }
  return crumbs;
}

/** Where the trail goes: `none`, `inside` the header, `after-header`, `before-title`. */
export function breadcrumbPosition(r: R): string {
  const position = str(r.o.get('breadcrumb-position'));
  if (meta(r.o, r.c, 'zn-breadcrumbs-content', '', true) === 'disabled') return 'none';
  if (position === 'zenit_entry_top') return r.c.isFrontPage ? 'none' : 'before-title';
  if (position === 'zenit_header_after') return 'after-header';
  if (position === 'zenit_header_primary_container_after') return 'inside';
  return 'none';
}

/** Whether the trail is shown on this kind of page. */
function enabledHere(r: R): boolean {
  const { o, c } = r;
  const off = (key: string) => str(o.get(key, '1')) === '0';
  if (c.isFrontPage && off('breadcrumb-disable-home-page')) return false;
  if (c.isHome && !c.isFrontPage && off('breadcrumb-disable-blog-posts-page')) return false;
  if (c.view === 'search' && off('breadcrumb-disable-search')) return false;
  if (c.view === 'archive' && !c.isHome && off('breadcrumb-disable-archive')) return false;
  if (c.view === '404' && off('breadcrumb-disable-404-page')) return false;
  if (isSingular(c)) {
    if (off('breadcrumb-disable-singular')) return false;
    if (isPage(c) ? off('breadcrumb-disable-single-page') : off('breadcrumb-disable-single-post'))
      return false;
  }
  return true;
}

export function Breadcrumbs({ r }: { r: R }) {
  if (!enabledHere(r)) return null;
  const crumbs = trail(r);
  return (
    <div className="zn-breadcrumbs-wrapper">
      <div className="zn-breadcrumbs-inner">
        <nav
          role="navigation"
          aria-label={r.t.breadcrumbs}
          className="breadcrumb-trail breadcrumbs"
        >
          <div className="zn-breadcrumbs">
            <ul className="trail-items">
              {crumbs.map((crumb, i) => (
                <li
                  key={i}
                  className={`trail-item${i === 0 ? ' trail-begin' : ''}${i === crumbs.length - 1 ? ' trail-end' : ''}`}
                >
                  {crumb.url && i < crumbs.length - 1 ? (
                    <a href={crumb.url} rel={i === 0 ? 'home' : undefined}>
                      <span>{crumb.label}</span>
                    </a>
                  ) : (
                    <span>
                      <span>{crumb.label}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
