/** The widget areas of the header. */
import { widgetCss } from '../lib/elements.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'hb_widget',
  run: (o) => widgetCss(o, 'header'),
};
