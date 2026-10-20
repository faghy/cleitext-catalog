/** The footer: up to three rows of 1–6 columns, with layouts per device. */
import { meta } from '../core/context.js';
import { intval, rec, str } from '../core/php.js';
import { FooterElement } from './elements.js';
import { ICONS, svg } from './icons.js';
import type { R } from './render.js';

const PREFIX: Record<string, string> = { above: 'hba', primary: 'hb', below: 'hbb' };

function FooterRow({ r, row }: { r: R; row: string }) {
  const { o } = r;
  const layout = rec(rec(o.get('footer-desktop-items'))[row]);
  const zone = (n: number) => {
    const list = layout[`${row}_${n}`];
    return Array.isArray(list) ? list.map(String) : [];
  };
  // As in the reference: a row shows when one of its first five columns has elements.
  if (![1, 2, 3, 4, 5].some((n) => zone(n).length > 0)) return null;
  const p = PREFIX[row]!;
  const columns = intval(o.get(`${p}-footer-column`));
  const grid = rec(o.get(`${p}-footer-layout`));
  const stack = rec(o.get(`${p}-stack`));
  const g = (d: string) => str(grid[d] ?? 'full');
  const s = (d: string) => str(stack[d] ?? 'stack');
  const section = `section-${row}-footer-builder`;
  return (
    <div
      className={[
        `site-${row}-footer-wrap`,
        'zn-builder-grid-row-container',
        'site-footer-focus-item',
        `zn-builder-grid-row-${g('desktop')}`,
        `zn-builder-grid-row-tablet-${g('tablet')}`,
        `zn-builder-grid-row-mobile-${g('mobile')}`,
        `zn-footer-row-${s('desktop')}`,
        `zn-footer-row-tablet-${s('tablet')}`,
        `zn-footer-row-mobile-${s('mobile')}`,
      ].join(' ')}
      data-section={section}
      data-customize={section}
    >
      <div className="zn-builder-grid-row-container-inner">
        <div
          className={`zn-builder-footer-grid-columns site-${row}-footer-inner-wrap zn-builder-grid-row`}
        >
          {Array.from({ length: Math.min(6, columns) }, (_, i) => i + 1).map((n) => (
            <div
              key={n}
              className={`site-footer-${row}-section-${n} site-footer-section site-footer-section-${n}`}
            >
              {zone(n).map((id) => (
                <FooterElement key={id} r={r} id={id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Footer({ r }: { r: R }) {
  if (meta(r.o, r.c, 'footer-sml-layout', '', true) === 'disabled') return null;
  return (
    <footer
      className="site-footer"
      id="colophon"
      itemType="https://schema.org/WPFooter"
      itemScope
      itemID="#colophon"
    >
      {['above', 'primary', 'below'].map((row) => (
        <FooterRow key={row} r={r} row={row} />
      ))}
    </footer>
  );
}

/** The "back to top" button. */
export function ScrollTop({ r }: { r: R }) {
  const { o, t } = r;
  if (!o.get('scroll-to-top-enable')) return null;
  return (
    <div
      id="zn-scroll-top"
      tabIndex={0}
      className={`zn-scroll-top-icon zn-scroll-to-top-${str(o.get('scroll-to-top-icon-position'))}`}
      data-on-devices={str(o.get('scroll-to-top-on-devices'))}
    >
      <span className="zn-icon icon-arrow" {...svg(ICONS.arrow)} />
      <span className="screen-reader-text">{t.scrollTop}</span>
    </div>
  );
}
