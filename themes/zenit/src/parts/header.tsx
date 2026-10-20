/**
 * The header: the desktop layout and the tablet/phone one are both in the
 * page (CSS shows one), each made of rows (above, main, below) split into
 * zones; the phone menu opens below the bar or in an off-canvas panel.
 */
import { isLoaded } from '../core/builder.js';
import { meta } from '../core/context.js';
import { rec, str } from '../core/php.js';
import { HeaderElement, type Device } from './elements.js';
import { ICONS, svg } from './icons.js';
import { cx, type R } from './render.js';
import { hasSticky } from '../pro/sticky-css.js';

/** The sticky header's choices, read by the page script (Zenit Pro). */
function stickyData(r: R): Record<string, string> {
  const { o } = r;
  if (!hasSticky(o)) return {};
  const stick = (k: string) => Boolean(Number(o.get(k, 0)));
  return {
    'data-sticky-rows': [
      stick('header-above-stick') && 'above',
      stick('header-main-stick') && 'primary',
      stick('header-below-stick') && 'below',
    ]
      .filter(Boolean)
      .join(' '),
    'data-sticky-devices': str(o.get('sticky-header-on-devices', 'desktop')) || 'desktop',
    'data-sticky-style': str(o.get('sticky-header-style', 'none')) || 'none',
    ...(stick('sticky-hide-on-scroll') ? { 'data-sticky-hide': '' } : {}),
    ...(stick('header-main-shrink') ? { 'data-sticky-shrink': '' } : {}),
  };
}

type Layout = Record<string, Record<string, string[]>>;

const layoutOf = (r: R, device: Device): Layout =>
  rec(r.o.get(device === 'desktop' ? 'header-desktop-items' : 'header-mobile-items')) as Layout;

const items = (layout: Layout, row: string, zone: string): string[] => {
  const list = rec(layout[row])[`${row}_${zone}`];
  return Array.isArray(list) ? list.map(String) : [];
};
const hasCenter = (layout: Layout, row: string) => items(layout, row, 'center').length > 0;
const hasSides = (layout: Layout, row: string) =>
  ['left', 'left_center', 'right_center', 'right'].some((z) => items(layout, row, z).length > 0);

function Zone({
  r,
  layout,
  row,
  zone,
  device,
}: {
  r: R;
  layout: Layout;
  row: string;
  zone: string;
  device: Device;
}) {
  return (
    <>
      {items(layout, row, zone).map((id) => (
        <HeaderElement key={id} r={r} id={id} device={device} />
      ))}
    </>
  );
}

/** The grid of a row: side zones and the center one. */
function Grid({ r, layout, row, device }: { r: R; layout: Layout; row: string; device: Device }) {
  const center = hasCenter(layout, row);
  const sides = hasSides(layout, row);
  const z = (zone: string) => <Zone r={r} layout={layout} row={row} zone={zone} device={device} />;
  return (
    <div
      className={cx(
        'zn-builder-grid-row',
        sides ? 'zn-builder-grid-row-has-sides' : 'zn-grid-center-col-layout-only zn-flex',
        center ? 'zn-grid-center-col-layout' : 'zn-builder-grid-row-no-center',
      )}
    >
      {sides && (
        <div
          className={`site-header-${row}-section-left site-header-section zn-flex site-header-section-left`}
        >
          {z('left')}
          {center &&
            (device === 'desktop' ? (
              <div
                className={`site-header-${row}-section-left-center site-header-section zn-flex zn-grid-left-center-section`}
              >
                {z('left_center')}
              </div>
            ) : (
              z('left_center')
            ))}
        </div>
      )}
      {center && (
        <div
          className={`site-header-${row}-section-center site-header-section zn-flex zn-grid-section-center`}
        >
          {z('center')}
        </div>
      )}
      {sides && (
        <div
          className={`site-header-${row}-section-right site-header-section zn-flex zn-grid-right-section`}
        >
          {center &&
            (device === 'desktop' ? (
              <div
                className={`site-header-${row}-section-right-center site-header-section zn-flex zn-grid-right-center-section`}
              >
                {z('right_center')}
              </div>
            ) : (
              z('right_center')
            ))}
          {z('right')}
        </div>
      )}
    </div>
  );
}

/** Whether a row is shown on this page (the page may hide some). */
function rowShown(r: R, row: string, device: Device): boolean {
  const key =
    device === 'mobile'
      ? 'zn-hfb-mobile-header-display'
      : row === 'primary'
        ? 'zn-main-header-display'
        : `zn-hfb-${row}-header-display`;
  return meta(r.o, r.c, key, '', true) !== 'disabled';
}

function DesktopRow({ r, row }: { r: R; row: string }) {
  const layout = layoutOf(r, 'desktop');
  if (!hasCenter(layout, row) && !hasSides(layout, row)) return null;
  if (!rowShown(r, row, 'desktop')) return null;
  const section = `section-${row}-header-builder`;
  const label = row === 'primary' ? 'main' : row;
  return (
    <div className={cx(`zn-${label}-header-wrap`, row === 'primary' && 'main-header-bar-wrap')}>
      <div
        className={cx(
          `zn-${row}-header-bar zn-${row}-header`,
          row === 'primary' && 'main-header-bar',
          'site-header-focus-item',
        )}
        data-section={section}
        data-customize={section}
      >
        <div
          className={`site-${row}-header-wrap zn-builder-grid-row-container site-header-focus-item zn-container`}
          data-section={section}
        >
          <Grid r={r} layout={layout} row={row} device="desktop" />
        </div>
      </div>
    </div>
  );
}

function MobileRow({ r, row }: { r: R; row: string }) {
  const layout = layoutOf(r, 'mobile');
  if (!hasCenter(layout, row) && !hasSides(layout, row)) return null;
  const transparent = row === 'primary' && r.o.get('transparent-header-enable');
  const section = transparent ? 'section-transparent-header' : `section-${row}-header-builder`;
  const label = row === 'primary' ? 'main' : row;
  return (
    <div className={cx(`zn-${label}-header-wrap`, row === 'primary' && 'main-header-bar-wrap')}>
      <div
        className={cx(
          `zn-${row}-header-bar zn-${row}-header`,
          row === 'primary' && 'main-header-bar',
          `site-${row}-header-wrap site-header-focus-item zn-builder-grid-row-layout-default zn-builder-grid-row-tablet-layout-default zn-builder-grid-row-mobile-layout-default`,
        )}
        data-section={section}
        data-customize={section}
      >
        <Grid r={r} layout={layout} row={row} device="mobile" />
      </div>
    </div>
  );
}

/** The phone menu's content (dropdown or off-canvas). */
function PopupContent({ r, device }: { r: R; device: Device }) {
  const layout = layoutOf(r, device);
  return (
    <>
      {items(layout, 'popup', 'content').map((id) => (
        <HeaderElement key={id} r={r} id={id} device="mobile" />
      ))}
    </>
  );
}

export function Header({ r }: { r: R }) {
  const { o, c } = r;
  if (meta(o, c, 'zn-global-header-display', '', true) === 'disabled') return null;
  const type = str(o.get('mobile-header-type'));
  const dropdown = type === 'dropdown';
  const trigger = isLoaded(o, 'mobile-trigger', 'header');
  const menuOk = Boolean(r.page.menus.primary?.length);
  return (
    <header
      className={cx(
        'site-header header-main-layout-1',
        menuOk ? 'zn-primary-menu-enabled' : 'zn-primary-menu-disabled',
        Boolean(o.get('logo-title-inline')) && 'zn-logo-title-inline',
        'zn-hide-custom-menu-mobile',
        `zn-builder-menu-toggle-${str(o.get('header-builder-menu-toggle-target'))}`,
        `zn-mobile-header-${str(o.get('hb-header-main-menu-align') || 'inline')}`,
      )}
      id="masthead"
      itemType="https://schema.org/WPHeader"
      itemScope
      itemID="#masthead"
      {...stickyData(r)}
    >
      <div id="zn-desktop-header" data-toggle-type={dropdown ? 'dropdown' : 'off-canvas'}>
        {['above', 'primary', 'below'].map((row) => (
          <DesktopRow key={row} r={r} row={row} />
        ))}
      </div>
      {rowShown(r, 'primary', 'mobile') && (
        <div
          id="zn-mobile-header"
          className="zn-mobile-header-wrap "
          data-type={dropdown ? 'dropdown' : 'off-canvas'}
        >
          {['above', 'primary', 'below'].map((row) => (
            <MobileRow key={row} r={r} row={row} />
          ))}
          {dropdown && trigger && (
            <div
              className={`zn-mobile-header-content content-align-${str(o.get('header-offcanvas-content-alignment'))} `}
            >
              <PopupContent r={r} device="mobile" />
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/** The off-canvas or full-screen phone menu, after the footer. */
export function MobilePopup({ r }: { r: R }) {
  const { o, t } = r;
  if (!isLoaded(o, 'mobile-trigger', 'header')) return null;
  const type = str(o.get('mobile-header-type'));
  if (type === 'dropdown') return null;
  const slide = str(o.get('off-canvas-slide'));
  const side =
    type === 'off-canvas'
      ? slide === 'left'
        ? 'zn-mobile-popup-left'
        : 'zn-mobile-popup-right'
      : 'zn-mobile-popup-full-width';
  return (
    <div id="zn-mobile-popup-wrapper">
      <div
        id="zn-mobile-popup"
        className={`zn-mobile-popup-drawer content-align-${str(o.get('header-offcanvas-content-alignment'))} ${side}`}
      >
        <div className="zn-mobile-popup-overlay" />
        <div className="zn-mobile-popup-inner">
          <div className="zn-mobile-popup-header">
            <button
              type="button"
              id="menu-toggle-close"
              className="menu-toggle-close"
              aria-label={t.closeMenu}
              tabIndex={0}
            >
              <span className="zn-svg-iconset">
                <span
                  aria-hidden="true"
                  className="zn-hfb-svg-iconset zn-inline-flex svg-baseline"
                  {...svg(ICONS.close)}
                />
              </span>
            </button>
          </div>
          <div className="zn-mobile-popup-content">
            <PopupContent r={r} device="mobile" />
          </div>
          <div className="zn-desktop-popup-content" />
        </div>
      </div>
    </div>
  );
}
