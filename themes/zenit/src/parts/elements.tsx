/**
 * The elements placed in the header and footer: each with its wrapper
 * (`data-section` names the settings it is edited with) and content.
 */
import { BlockArea } from '@cleitext/theme-sdk';
import type { ReactNode } from 'react';
import { at, rec, str } from '../core/php.js';
import { ICONS, svg } from './icons.js';
import { FlatMenuItems, MenuItems } from './menu.js';
import { cx, type R } from './render.js';
import { socialIcon } from './social-icons.js';

export type Device = 'desktop' | 'mobile';

/** Setting sections of the elements, for the Customize pencils. */
export const SECTIONS: Record<string, string> = {
  logo: 'title_tagline',
  'menu-1': 'section-hb-menu-1',
  'menu-2': 'section-hb-menu-2',
  'mobile-menu': 'section-header-mobile-menu',
  'mobile-trigger': 'section-header-mobile-trigger',
  'button-1': 'section-hb-button-1',
  'html-1': 'section-hb-html-1',
  'html-2': 'section-hb-html-2',
  search: 'section-header-search',
  'social-icons-1': 'section-hb-social-icons-1',
  account: 'section-header-account',
  'woo-cart': 'section-header-woo-cart',
  'widget-1': 'sidebar-widgets-header-widget-1',
  'widget-2': 'sidebar-widgets-header-widget-2',
};

/** The editing pencil of an element in the Customize preview (by its settings section). */
const pencil = (section: string) => ({ 'data-section': section, 'data-customize': section });

/** HTML texts of the settings: placeholders replaced, paragraphs added. */
export function htmlText(r: R, content: string): string {
  const year = String(new Date().getFullYear());
  const text = content
    .split('[copyright]')
    .join('&copy;')
    .split('[current_year]')
    .join(year)
    .split('[site_title]')
    .join(escapeHtml(r.page.site.title))
    .split('[theme_author]')
    .join('<a href="https://cleitext.com/" rel="nofollow noopener" target="_blank">Zenit</a>');
  return autop(text);
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Paragraphs from blank lines, line breaks from single ones (as in the classic editor). */
function autop(text: string): string {
  const t = text.trim();
  if (!t) return '';
  if (/^<(p|div|ul|ol|h[1-6]|table|figure|blockquote)\b/i.test(t)) return t;
  return t
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.trim().replace(/\n/g, '<br />\n')}</p>`)
    .join('\n');
}

function SiteIdentity({ r, device }: { r: R; device: Device }) {
  const { o, page } = r;
  const title = rec(o.get('display-site-title-responsive'));
  const tagline = rec(o.get('display-site-tagline-responsive'));
  const showTitle = Boolean(title.desktop || title.tablet || title.mobile);
  const showTagline = Boolean(tagline.desktop || tagline.tablet || tagline.mobile);
  const logoId = str(o.get('custom_logo-id'));
  const mobileLogoId =
    device === 'mobile' && o.get('different-mobile-logo')
      ? str(o.get('mobile-header-logo-id'))
      : '';
  const logo = page.media.get(mobileLogoId || logoId);
  const retinaId = o.get('different-retina-logo') ? str(o.get('zn-header-retina-logo-id')) : '';
  const retina = retinaId ? page.media.get(retinaId) : undefined;
  // Zenit Pro: another logo while the header sticks.
  const stickyLogo = o.get('different-sticky-logo')
    ? page.media.get(str(o.get('sticky-header-logo-id')))
    : undefined;
  return (
    <div
      className="site-branding zn-site-identity"
      itemType="https://schema.org/Organization"
      itemScope
    >
      {logo && (
        <span className="site-logo-img">
          <a href={page.urls.home} className="custom-logo-link" rel="home">
            <img
              width={logo.width ?? undefined}
              height={logo.height ?? undefined}
              src={logo.url}
              className="custom-logo"
              alt={logo.alt || page.site.title}
              decoding="async"
              srcSet={retina ? `${logo.url} 1x, ${retina.url} 2x` : undefined}
            />
            {stickyLogo && (
              <img
                width={stickyLogo.width ?? undefined}
                height={stickyLogo.height ?? undefined}
                src={stickyLogo.url}
                className="custom-logo zn-sticky-logo"
                alt={stickyLogo.alt || page.site.title}
                decoding="async"
              />
            )}
          </a>
        </span>
      )}
      {(showTitle || showTagline) && (
        <div className="zn-site-title-wrap">
          {showTitle && (
            <span className="site-title" itemProp="name">
              <a href={page.urls.home} rel="home" itemProp="url">
                {page.site.title}
              </a>
            </span>
          )}
          {showTagline && page.site.tagline && (
            <p className="site-description" itemProp="description">
              {page.site.tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Menu locations of the header menus. */
export const MENU_LOCATIONS: Record<string, string> = {
  'menu-1': 'primary',
  'menu-2': 'secondary_menu',
};

function HeaderMenu({ r, index, device }: { r: R; index: number; device: Device }) {
  const { o, page, t } = r;
  const items = page.menus[MENU_LOCATIONS[`menu-${index}`]!] ?? [];
  const key = `header-menu${index}`;
  const stack = o.get(`${key}-menu-stack-on-mobile`);
  const animation = str(o.get(`${key}-submenu-container-animation`));
  const hover = str(o.get(`${key}-menu-hover-animation`));
  return (
    <div className="zn-main-header-bar-alignment">
      <div className="main-header-bar-navigation">
        <nav
          className="site-navigation zn-flex-grow-1 navigation-accessibility site-header-focus-item"
          id={`${index === 1 ? 'primary' : 'secondary'}-site-navigation-${device}`}
          aria-label={index === 1 ? t.primaryNav : t.siteNav('Secondary')}
          itemType="https://schema.org/SiteNavigationElement"
          itemScope
        >
          <div className="main-navigation zn-inline-flex">
            <ul
              id={`zn-hf-menu-${index}${device === 'desktop' ? '' : `-${device}`}`}
              className={cx(
                'main-header-menu zn-menu-shadow zn-nav-menu zn-flex',
                o.get(`${key}-submenu-item-border`)
                  ? 'submenu-with-border zn-menu-item-divider'
                  : 'submenu-with-border',
                animation && `zenit-menu-animation-${animation}`,
                hover && `zn-menu-hover-style-${hover}`,
                stack ? 'stack-on-mobile' : 'inline-on-mobile',
              )}
            >
              <MenuItems r={r} items={items} />
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

function MobileMenu({ r }: { r: R }) {
  const { o, page, t } = r;
  const items = page.menus.mobile_menu?.length
    ? page.menus.mobile_menu
    : (page.menus.primary ?? []);
  const animation = str(o.get('header-mobile-menu-submenu-container-animation'));
  return (
    <div className="zn-main-header-bar-alignment">
      <div className="main-header-bar-navigation">
        <nav
          className="site-navigation zn-flex-grow-1 navigation-accessibility site-header-focus-item"
          id="zn-mobile-site-navigation"
          aria-label={t.siteNav('')}
          itemType="https://schema.org/SiteNavigationElement"
          itemScope
        >
          <div className="main-navigation">
            <ul
              id="zn-hf-mobile-menu"
              className={cx(
                'main-header-menu zn-nav-menu zn-flex',
                o.get('header-mobile-menu-submenu-item-border')
                  ? 'submenu-with-border zn-menu-item-divider'
                  : 'submenu-with-border',
                animation && `zenit-menu-animation-${animation}`,
                'stack-on-mobile',
              )}
            >
              <MenuItems r={r} items={items} />
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

function MobileTrigger({ r }: { r: R }) {
  const { o, t } = r;
  const icon = str(o.get('header-trigger-icon')) as 'menu' | 'menu2' | 'menu3';
  const label = str(o.get('mobile-header-menu-label'));
  return (
    <div className="zn-button-wrap">
      <button
        type="button"
        className={`menu-toggle main-header-menu-toggle zn-mobile-menu-trigger-${str(o.get('mobile-header-toggle-btn-style'))}`}
        aria-expanded="false"
        aria-label={t.menuToggle}
      >
        <span className="mobile-menu-toggle-icon">
          <span
            aria-hidden="true"
            className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
            {...svg(ICONS[icon] ?? ICONS.menu)}
          />
          <span
            aria-hidden="true"
            className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
            {...svg(ICONS.close)}
          />
        </span>
        {label && (
          <span className="mobile-menu-wrap">
            <span className="mobile-menu">{label}</span>
          </span>
        )}
      </button>
    </div>
  );
}

function Button({ r, prefix }: { r: R; prefix: string }) {
  const { o } = r;
  const text = str(o.get(`${prefix}-text`));
  const link = rec(o.get(`${prefix}-link-option`));
  const url = str(link.url);
  const target = link.new_tab ? '_blank' : '_self';
  const rel = str(link.link_rel) || (link.new_tab ? 'noopener' : undefined);
  return (
    <div
      className={`zn-builder-button-wrap zn-builder-button-size-${str(o.get(`${prefix}-size`))}`}
    >
      <a
        className="zn-custom-button-link"
        href={url || undefined}
        target={target}
        rel={rel}
        role={url ? 'button' : undefined}
        aria-label={text}
      >
        <div className="zn-custom-button">{text}</div>
      </a>
      <a className="menu-link" href={url || undefined} target={target} rel={rel}>
        {text}
      </a>
    </div>
  );
}

function Html({ r, option }: { r: R; option: string }) {
  const content = str(r.o.get(option));
  if (!content) return null;
  return (
    <div className="zn-header-html inner-link-style-">
      <div className="zn-builder-html-element" {...svg(htmlText(r, content))} />
    </div>
  );
}

function Search({ r }: { r: R }) {
  const { page, t } = r;
  return (
    <div className="zn-search-menu-icon slide-search">
      <form role="search" method="get" className="search-form" action={page.urls.search}>
        <label htmlFor="search-field">
          <span className="screen-reader-text">{t.searchFor}</span>
          <input
            type="search"
            id="search-field"
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
      </form>
      <div className="zn-search-icon">
        <a
          className="slide-search zenit-search-icon"
          role="button"
          tabIndex={0}
          aria-label={t.searchButton}
          href="#"
        >
          <span className="screen-reader-text">{t.search}</span>
          <span className="zn-icon icon-search" {...svg(ICONS.search)} />
        </a>
      </div>
    </div>
  );
}

export function Social({ r, type, index }: { r: R; type: 'header' | 'footer'; index: number }) {
  const { o } = r;
  const items = (at(o.get(`${type}-social-icons-${index}`), 'items') ?? []) as Record<
    string,
    unknown
  >[];
  const showLabel = Boolean(o.get(`${type}-social-${index}-label-toggle`));
  return (
    <div className={`zn-${type}-social-${index}-wrap zn-${type}-social-wrap`}>
      <div
        className={`${type}-social-inner-wrap element-social-inner-wrap social-show-label-${showLabel ? 'true' : 'false'} zn-social-color-type-${str(o.get(`${type}-social-${index}-color-type`))} zn-social-stack-${str(o.get(`${type}-social-${index}-stack`, 'none'))} zn-social-element-style-filled`}
      >
        {items
          .filter((item) => item.enabled)
          .map((item) => {
            const id = str(item.id);
            const url = str(item.url);
            let link = url;
            if (id === 'phone') link = /^tel:/i.test(url) ? url : `tel:${url}`;
            else if (id === 'email' || id === 'email_2')
              link = /^mailto:/i.test(url) ? url : `mailto:${url}`;
            else if (id === 'whatsapp')
              link = /^(http|whatsapp:)/i.test(url)
                ? url
                : `https://api.whatsapp.com/send?phone=${url}`;
            const external = !['phone', 'email'].includes(id);
            return (
              <a
                key={id}
                href={link}
                aria-label={str(item.label) || id}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                style={{
                  ['--color' as string]: str(item.color) || '#3a3a3a',
                  ['--background-color' as string]: str(item.background) || 'transparent',
                }}
                className={`zn-builder-social-element zn-inline-flex zn-${id} ${type}-social-item`}
              >
                <span
                  aria-hidden="true"
                  className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
                  {...svg(socialIcon(str(item.icon) || id))}
                />
                {showLabel && <span className="social-item-label">{str(item.label)}</span>}
              </a>
            );
          })}
      </div>
    </div>
  );
}

function Account({ r }: { r: R }) {
  const { o, page, t } = r;
  const viewer = page.viewer;
  const outStyle = str(o.get('header-account-logout-style'));
  if (!viewer && outStyle === 'none') return null;
  if (!viewer) {
    const link = rec(o.get('header-account-logout-link'));
    const href = str(link.url) || page.urls.login || '#';
    return (
      <div className="zn-header-account-wrap" tabIndex={0}>
        <a
          className={`zn-header-account-link zn-account-action-${str(o.get('header-account-logout-action'))} zn-header-account-type-${outStyle}`}
          aria-label={t.account}
          href={href}
          target={link.new_tab ? '_blank' : '_self'}
        >
          {outStyle === 'icon' ? (
            <span
              aria-hidden="true"
              className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
              {...svg(ICONS.account)}
            />
          ) : (
            <span className="zn-header-account-text">
              {str(o.get('header-account-logged-out-text')) || t.logIn}
            </span>
          )}
        </a>
      </div>
    );
  }
  const style = str(o.get('header-account-login-style'));
  const link = rec(o.get('header-account-login-link'));
  const href = str(link.url) || page.urls.account;
  return (
    <div className="zn-header-account-wrap" tabIndex={0}>
      <div className="zn-header-account-inner-wrap">
        <a
          className={`zn-header-account-link zn-account-action-link zn-header-account-type-${style}`}
          role="link"
          href={href}
          aria-label={t.account}
          target={link.new_tab ? '_blank' : '_self'}
        >
          {style === 'avatar' && viewer.avatarUrl ? (
            <img
              alt={viewer.displayName}
              src={viewer.avatarUrl}
              className="avatar"
              width={40}
              height={40}
            />
          ) : style === 'text' ? (
            <span className="zn-header-account-text">
              {str(o.get('header-account-logged-in-text')) || t.myAccount}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
              {...svg(ICONS.account)}
            />
          )}
        </a>
      </div>
    </div>
  );
}

/** A header element in its wrapper. */
export function HeaderElement({ r, id, device }: { r: R; id: string; device: Device }): ReactNode {
  const section = SECTIONS[id] ?? '';
  const base = 'zn-builder-layout-element zn-flex site-header-focus-item';
  if (id === 'logo')
    return (
      <div className={base} {...pencil(section)}>
        <SiteIdentity r={r} device={device} />
      </div>
    );
  const menu = /^menu-(\d+)$/.exec(id);
  if (menu)
    return (
      <div
        className={`zn-builder-menu-${menu[1]} zn-builder-menu zn-flex zn-builder-menu-${menu[1]}-focus-item zn-builder-layout-element site-header-focus-item`}
        {...pencil(section)}
      >
        <HeaderMenu r={r} index={Number(menu[1])} device={device} />
      </div>
    );
  if (id === 'mobile-menu')
    return (
      <div
        className="zn-builder-menu-mobile zn-builder-menu zn-builder-menu-mobile-focus-item zn-builder-layout-element site-header-focus-item"
        {...pencil(section)}
      >
        <MobileMenu r={r} />
      </div>
    );
  if (id === 'mobile-trigger')
    return device === 'desktop' ? null : (
      <div className={base} {...pencil(section)}>
        <MobileTrigger r={r} />
      </div>
    );
  const button = /^button-(\d+)$/.exec(id);
  if (button)
    return (
      <div className={`${base} zn-header-button-${button[1]}`} {...pencil(section)}>
        <Button r={r} prefix={`header-button${button[1]}`} />
      </div>
    );
  const html = /^html-(\d+)$/.exec(id);
  if (html)
    return (
      <div className={`${base} zn-header-html-${html[1]}`} {...pencil(section)}>
        <Html r={r} option={`header-html-${html[1]}`} />
      </div>
    );
  if (id === 'search')
    return (
      <div className={`${base} zn-header-search`} {...pencil(section)}>
        <Search r={r} />
      </div>
    );
  const social = /^social-icons-(\d+)$/.exec(id);
  if (social)
    return (
      <div className={base} {...pencil(section)}>
        <Social r={r} type="header" index={Number(social[1])} />
      </div>
    );
  if (id === 'account')
    return (
      <div
        className="zn-builder-layout-element site-header-focus-item zn-header-account"
        {...pencil(section)}
      >
        <Account r={r} />
      </div>
    );
  if (id === 'woo-cart')
    return (
      <div className={`${base} zn-header-woo-cart`} {...pencil(section)}>
        <div className="zn-site-header-cart zn-menu-cart-with-border">
          <BlockArea name="header-cart" />
        </div>
      </div>
    );
  const widget = /^widget-(\d+)$/.exec(id);
  if (widget)
    return (
      <aside
        className="header-widget-area widget-area site-header-focus-item"
        {...pencil(section)}
        aria-label={`Header Widget ${widget[1]}`}
        role="region"
      >
        <div className="header-widget-area-inner site-info-inner">
          <BlockArea name={`header-widget-${widget[1]}`} />
        </div>
      </aside>
    );
  return null;
}

/** Footer element wrappers. */
export function FooterElement({ r, id }: { r: R; id: string }): ReactNode {
  const { o, page } = r;
  if (id === 'copyright') {
    const text = str(o.get('footer-copyright-editor'));
    return (
      <div
        className="zn-builder-layout-element zn-flex site-footer-focus-item zn-footer-copyright"
        data-section="section-footer-builder"
        data-customize="section-footer-copyright"
      >
        <div className="zn-footer-copyright" {...svg(htmlText(r, text))} />
      </div>
    );
  }
  const html = /^html-(\d+)$/.exec(id);
  if (html)
    return (
      <div
        className={`footer-widget-area widget-area site-footer-focus-item zn-footer-html-${html[1]}`}
        {...pencil(`section-fb-html-${html[1]}`)}
      >
        <Html r={r} option={`footer-html-${html[1]}`} />
      </div>
    );
  const social = /^social-icons-(\d+)$/.exec(id);
  if (social)
    return (
      <div
        className="zn-builder-layout-element zn-flex site-footer-focus-item"
        {...pencil(`section-fb-social-icons-${social[1]}`)}
      >
        <Social r={r} type="footer" index={Number(social[1])} />
      </div>
    );
  const widget = /^widget-(\d+)$/.exec(id);
  if (widget)
    return (
      <aside
        className="footer-widget-area widget-area site-footer-focus-item"
        {...pencil(`sidebar-widgets-footer-widget-${widget[1]}`)}
        aria-label={`Footer Widget ${widget[1]}`}
        role="region"
      >
        <div className="footer-widget-area-inner site-info-inner">
          <BlockArea name={`footer-widget-${widget[1]}`} />
        </div>
      </aside>
    );
  if (id === 'menu') {
    const items = page.menus.footer_menu ?? [];
    const layout = rec(o.get('footer-menu-layout'));
    return (
      <div
        className="footer-widget-area widget-area site-footer-focus-item"
        {...pencil('section-footer-menu')}
      >
        {items.length > 0 && (
          <div className="footer-bar-navigation">
            <nav
              className="site-navigation zn-flex-grow-1 navigation-accessibility footer-navigation"
              id="footer-site-navigation"
              aria-label={r.t.siteNav('Footer')}
              itemType="https://schema.org/SiteNavigationElement"
              itemScope
            >
              <div className="footer-nav-wrap">
                <ul
                  id="zenit-footer-menu"
                  className={`zn-nav-menu zn-flex zenit-footer-${str(layout.desktop)}-menu zenit-footer-tablet-${str(layout.tablet)}-menu zenit-footer-mobile-${str(layout.mobile)}-menu`}
                >
                  <FlatMenuItems items={items} />
                </ul>
              </div>
            </nav>
          </div>
        )}
      </div>
    );
  }
  return null;
}
