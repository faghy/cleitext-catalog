/** The header row below the main one (only when it holds elements). */
import { sideRowCss } from '../lib/header-rows.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'below_header_row_setting',
  run: (o) => sideRowCss(o, 'below'),
};
