/** The header row above the main one (only when it holds elements). */
import { sideRowCss } from '../lib/header-rows.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'above_header_row_setting',
  run: (o) => sideRowCss(o, 'above'),
};
