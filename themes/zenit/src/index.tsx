import {
  defineTheme,
  googleFonts,
  HeadTags,
  Location,
  type LayoutProps,
} from '@cleitext/theme-sdk';
import { setGoogleFonts } from './settings/font-source.js';
import {
  applyBoxedLayouts,
  contentLayout,
  isContentBoxed,
  isPage,
  isSidebarBoxed,
  isSingle,
  isSingular,
} from './core/context.js';
import { sidebarLayout } from './css/lib/main.js';
import { rec } from './core/php.js';
import { dynamicCss } from './css/index.js';
import { STATIC_CSS } from './css/static.js';
import { proCss } from './pro/index.js';
import { fontsUrl } from './fonts.js';
import { Breadcrumbs, breadcrumbPosition } from './parts/breadcrumbs.js';
import { Footer, ScrollTop } from './parts/footer.js';
import { Header, MobilePopup } from './parts/header.js';
import { Index } from './parts/templates.js';
import { cx, slugId, useR, type R } from './parts/render.js';
import { importSettings } from './import.js';
import { SCRIPT } from './script.js';
import { HEADER_PRESETS } from './settings/builder.js';
import { ENTRY_SETTINGS, SECTIONS, SETTINGS } from './settings/index.js';

/**
 * Zenit: a multipurpose theme with a drag-and-drop header and footer
 * builder, global colors and fonts, and blog layouts, all set in
 * Appearance → Customize with a live preview.
 */

/** The body's classes: the kind of page, its container and sidebar. */
function bodyClasses(r: R): string {
  const { o, c, page } = r;
  const view = page.view;
  const classes: string[] = [];
  if (c.isFrontPage) classes.push('home');
  if (c.isHome) classes.push('blog');
  if (view?.kind === 'entry') {
    classes.push(
      isPage(c) ? 'page' : `single single-${c.postType}`,
      `postid-${slugId(view.entry.id)}`,
    );
  } else if (view?.kind === 'archive' && !c.isHome) {
    classes.push(
      'archive',
      view.term
        ? view.term.taxonomy === 'category'
          ? 'category'
          : 'tag'
        : view.author
          ? 'author'
          : 'post-type-archive',
    );
  } else if (view?.kind === 'search') {
    classes.push('search', view.entries.length ? 'search-results' : 'search-no-results');
  } else if (view?.kind === '404') {
    classes.push('error404');
  }
  classes.push('zn-desktop');
  if (str(rec(o.get('zenit-color-palettes')).currentPalette) === 'palette_4')
    classes.push('zenit-dark-mode-enable');
  const layout = applyBoxedLayouts(
    o,
    c,
    contentLayout(o, c),
    isContentBoxed(o, c),
    isSidebarBoxed(o, c),
  );
  if (layout === 'content-boxed-container') classes.push('zn-separate-container');
  else if (layout === 'boxed-container') classes.push('zn-separate-container zn-two-container');
  else if (layout === 'page-builder') classes.push('zn-page-builder-template');
  else if (layout === 'plain-container') classes.push('zn-plain-container');
  else if (layout === 'narrow-container') {
    classes.push('zn-narrow-container');
    if (isContentBoxed(o, c)) classes.push('zn-separate-container');
  }
  const sidebar = sidebarLayout(o, c);
  classes.push(`zn-${sidebar}`);
  if (sidebar !== 'no-sidebar' && o.get('site-sticky-sidebar')) classes.push('zn-sticky-sidebar');
  if (isSingular(c)) classes.push('zn-single-post');
  if (isSingle(c)) classes.push('zn-blog-single-style-1');
  classes.push('zn-inherit-site-logo-transparent', 'zn-hfb-header');
  if (isSingular(c)) classes.push('zn-normal-title-enabled');
  return classes.join(' ');
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

/** Switches the body between the desktop and the tablet/phone header before the page paints. */
const BREAKPOINT_SCRIPT = `(function(){var mq=window.matchMedia('(max-width:921.99px)');function apply(m){var b=document.body.classList;if(m){b.add('zn-header-break-point');b.remove('zn-desktop');}else{b.remove('zn-header-break-point');b.add('zn-desktop');}}apply(mq.matches);mq.addEventListener?mq.addEventListener('change',function(e){apply(e.matches)}):mq.addListener(function(e){apply(e.matches)});})();`;

function Layout({ head, children }: LayoutProps) {
  const r = useR();
  const { o, c, page } = r;
  const fonts = fontsUrl(o);
  const crumbs = breadcrumbPosition(r);
  return (
    <html lang={page.locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        {fonts && (
          <>
            <link rel="preconnect" href="https://fonts.bunny.net" />
            <link rel="stylesheet" href={fonts} />
          </>
        )}
        <style id="zenit-css" dangerouslySetInnerHTML={{ __html: STATIC_CSS }} />
        <style
          id="zenit-dynamic-css"
          dangerouslySetInnerHTML={{ __html: dynamicCss(o, c) + proCss(o, c) }}
        />
        <HeadTags tags={head.tags} />
      </head>
      <body
        className={bodyClasses(r)}
        itemType={isSingular(c) ? 'https://schema.org/WebPage' : 'https://schema.org/Blog'}
        itemScope
      >
        <Location name="hook:zenit_body_top" />
        <script dangerouslySetInnerHTML={{ __html: BREAKPOINT_SCRIPT }} />
        <a className="skip-link screen-reader-text" href="#content">
          {r.t.skip}
        </a>
        <div className="hfeed site" id="page">
          <Location name="hook:zenit_header_before" />
          <Location name="header">
            <Header r={r} />
          </Location>
          <Location name="hook:zenit_header_after" />
          {crumbs === 'after-header' && (
            <div className="main-header-bar zn-header-breadcrumb">
              <div className="zn-container">
                <Breadcrumbs r={r} />
              </div>
            </div>
          )}
          <Location name="hook:zenit_content_before" />
          <div id="content" className="site-content">
            <div className="zn-container">
              <Location name="hook:zenit_content_top" />
              {children}
              <Location name="hook:zenit_content_bottom" />
            </div>
          </div>
          <Location name="hook:zenit_content_after" />
          <Location name="hook:zenit_footer_before" />
          <Location name="footer">
            <Footer r={r} />
          </Location>
          <Location name="hook:zenit_footer_after" />
        </div>
        <Location name="hook:zenit_body_bottom" />
        <MobilePopup r={r} />
        <ScrollTop r={r} />
        <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />
      </body>
    </html>
  );
}

setGoogleFonts(googleFonts);

export const theme = defineTheme({
  slug: 'zenit',
  name: 'Zenit',
  version: '1.0.1',
  description:
    'A fast multipurpose theme: drag-and-drop header and footer builder, global colors and fonts, container and sidebar layouts, blog layouts.',
  menuLocations: {
    primary: 'Primary menu',
    secondary_menu: 'Secondary menu',
    mobile_menu: 'Off-canvas menu',
    footer_menu: 'Footer menu',
  },
  settingsSections: SECTIONS,
  settings: SETTINGS.fields,
  presets: HEADER_PRESETS,
  entryFields: { fields: ENTRY_SETTINGS.fields },
  areas: {
    'sidebar-1': 'Sidebar',
    'header-widget-1': 'Header widget 1',
    'header-widget-2': 'Header widget 2',
    'header-cart': 'Header cart',
    'footer-widget-1': 'Footer widget 1',
    'footer-widget-2': 'Footer widget 2',
    'footer-widget-3': 'Footer widget 3',
    'footer-widget-4': 'Footer widget 4',
  },
  // The shop's cart link, shown when the shop plugin is active.
  areaDefaults: {
    'header-cart': {
      schema: 1,
      blocks: [{ id: 'zn-cart', type: 'shop/cart-link', v: 1, attrs: {} }],
    },
  },
  templates: { index: Index },
  comments: 'manual',
  listTerms: true,
  importSettings,
  adjacentEntries: true,
  Layout,
  css: '',
});

export default theme;
