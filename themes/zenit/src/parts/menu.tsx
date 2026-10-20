/**
 * Navigation menus with the markup the CSS and the script expect: items
 * with `menu-link`, submenus with an arrow and a toggle button.
 */
import type { MenuItemView } from '@cleitext/theme-sdk';
import type { CSSProperties } from 'react';
import { ICONS, svg } from './icons.js';
import { cx, type R } from './render.js';
import { megaOf } from '../pro/mega-menu.js';

const hasCurrent = (item: MenuItemView): boolean =>
  item.children.some((c) => c.current || hasCurrent(c));

function Item({
  r,
  item,
  depth,
  inMega = false,
}: {
  r: R;
  item: MenuItemView;
  depth: number;
  /** A column of a mega menu (Zenit Pro). */
  inMega?: boolean;
}) {
  const children = item.children.length > 0;
  // Zenit Pro's options of the item (none without it).
  const m = megaOf(item);
  const mega = depth === 0 && children && Boolean(m.megaMenu);
  const width = m.megaWidth === 'full' || m.megaWidth === 'custom' ? m.megaWidth : 'content';
  const ancestor = hasCurrent(item);
  const current = item.current && !ancestor;
  const parent = item.children.some((c) => c.current);
  const toggle = r.t.toggleSubmenu(item.label);
  return (
    <li
      id={`menu-item-${item.id}`}
      className={cx(
        'menu-item',
        current && 'current-menu-item',
        ancestor && 'current-menu-ancestor',
        parent && 'current-menu-parent',
        children && 'menu-item-has-children',
        `menu-item-${item.id}`,
        mega && `zn-megamenu-li zn-megamenu-${width}`,
        inMega && depth === 1 && m.megaHideHeading && 'zn-mm-hide-heading',
      )}
      style={
        mega
          ? ({
              '--zn-mm-columns': String(Math.min(item.children.length, 6)),
              ...(m.megaBackground ? { '--zn-mm-bg': m.megaBackground } : {}),
              ...(width === 'custom' ? { '--zn-mm-width': `${m.megaCustomWidth ?? 900}px` } : {}),
            } as CSSProperties)
          : undefined
      }
    >
      <a
        href={m.menuNoLink ? undefined : item.url}
        target={m.menuNoLink ? undefined : item.target}
        rel={item.target && !m.menuNoLink ? 'noopener' : undefined}
        aria-current={current ? 'page' : undefined}
        aria-expanded={children ? 'false' : undefined}
        className={cx('menu-link', m.menuNoLink && 'zn-mm-no-link')}
        tabIndex={m.menuNoLink && !children ? -1 : undefined}
      >
        {depth > 0 && <span className="zn-icon icon-arrow" {...svg(ICONS.arrow)} />}
        {item.label}
        {m.menuLabel && (
          <span
            className="zn-mm-label"
            style={{
              ...(m.menuLabelColor ? { color: m.menuLabelColor } : {}),
              ...(m.menuLabelBackground ? { background: m.menuLabelBackground } : {}),
            }}
          >
            {m.menuLabel}
          </span>
        )}
        {children && (
          <span
            role="button"
            className="dropdown-menu-toggle zn-header-navigation-arrow"
            tabIndex={0}
            aria-expanded="false"
            aria-label={toggle}
            aria-haspopup="true"
          >
            <span className="zn-icon icon-arrow" {...svg(ICONS.arrow)} />
          </span>
        )}
      </a>
      {children && (
        <>
          <button className="zn-menu-toggle" aria-expanded="false" aria-label={toggle}>
            <span className="zn-icon icon-arrow" {...svg(ICONS.arrow)} />
          </button>
          <ul className={cx('sub-menu', mega && 'zn-megamenu')}>
            {item.children.map((child) => (
              <Item key={child.id} r={r} item={child} depth={depth + 1} inMega={mega || inMega} />
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

/** The items of a menu as `<li>` elements. */
export function MenuItems({ r, items }: { r: R; items: MenuItemView[] }) {
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} r={r} item={item} depth={0} />
      ))}
    </>
  );
}

/** A footer menu: one level, no toggles. */
export function FlatMenuItems({ items }: { items: MenuItemView[] }) {
  return (
    <>
      {items.map((item) => (
        <li
          key={item.id}
          id={`menu-item-${item.id}`}
          className={cx('menu-item', item.current && 'current-menu-item', `menu-item-${item.id}`)}
        >
          <a
            href={item.url}
            target={item.target}
            rel={item.target ? 'noopener' : undefined}
            aria-current={item.current ? 'page' : undefined}
            className="menu-link"
          >
            {item.label}
          </a>
        </li>
      ))}
    </>
  );
}
