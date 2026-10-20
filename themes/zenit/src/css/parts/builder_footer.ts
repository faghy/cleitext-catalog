/** Footer grids with three columns on two lines: the first or last column spans the row. */
import { mobile, parseCss, tablet } from '../../core/css.js';
import type { Part } from './index.js';

const span = (d: string) =>
  `.zn-builder-grid-row-container.zn-builder-grid-row-${d}-3-firstrow .zn-builder-grid-row > *:first-child, ` +
  `.zn-builder-grid-row-container.zn-builder-grid-row-${d}-3-lastrow .zn-builder-grid-row > *:last-child`;

export const part: Part = {
  name: 'builder_footer',
  run() {
    return (
      parseCss({ [span('tablet')]: { 'grid-column': '1 / -1' } }, '', tablet()) +
      parseCss({ [span('mobile')]: { 'grid-column': '1 / -1' } }, '', mobile())
    );
  },
};
