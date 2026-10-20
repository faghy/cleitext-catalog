/** The sidebar: a block area of the site, beside the content when the layout has one. */
import { BlockArea } from '@cleitext/theme-sdk';
import type { R } from './render.js';

export function Sidebar({ r }: { r: R }) {
  void r;
  return (
    <div
      className="widget-area secondary"
      id="secondary"
      itemType="https://schema.org/WPSideBar"
      itemScope
    >
      <div className="sidebar-main" role="complementary">
        <BlockArea name="sidebar-1" />
      </div>
    </div>
  );
}
