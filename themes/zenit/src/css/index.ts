/**
 * The dynamic CSS of a page: each part reads the options and the page, and
 * adds its rules in a fixed order (the main part goes before the others).
 */
import type { Ctx } from '../core/context.js';
import type { Options } from '../core/options.js';
import { trimCss } from './lib/main.js';
import { PARTS } from './parts/index.js';

export function dynamicCss(o: Options, c: Ctx): string {
  let css = '';
  for (const part of PARTS) {
    if (part.lead && part.rest) {
      css = part.lead(o, c) + css + part.rest(o, c);
      continue;
    }
    const own = part.run(o, c);
    // The main part minifies its rules with all those added before it, as the reference does.
    css = part.prepend ? trimCss(own + css) : css + own;
  }
  return css;
}

/** The CSS of one part (tests). */
export function partCss(name: string, o: Options, c: Ctx): string {
  const part = PARTS.find((p) => p.name === name);
  if (!part) throw new Error(`No part ${name}`);
  return part.run(o, c);
}
