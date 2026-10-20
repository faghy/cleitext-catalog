/** Icon font glyphs, printed only when the site uses the icon font instead of SVG icons. */
import { trimCss } from '../lib/footer-global.js';
import type { Part } from './index.js';

const GLYPHS: [string, string][] = [
  ['down_arrow', 'e900'],
  ['close', 'e5cd'],
  ['drag_handle', 'e25d'],
  ['format_align_justify', 'e235'],
  ['menu', 'e5d2'],
  ['reorder', 'e8fe'],
  ['search', 'e8b6'],
  ['zoom_in', 'e56b'],
  ['check-circle', 'e901'],
  ['shopping-cart', 'f07a'],
  ['shopping-bag', 'f290'],
  ['shopping-basket', 'f291'],
  ['circle-o', 'e903'],
  ['certificate', 'e902'],
];

export const part: Part = {
  name: 'icons_static_css',
  run(o) {
    if (o.get('can-update-zenit-icons-svg', true) !== false) return '';
    return trimCss(
      GLYPHS.map(
        ([name, code]) => `.zenit-icon-${name}::after {content: "\\${code}";font-family: inherit;}`,
      ).join(''),
    );
  },
};
