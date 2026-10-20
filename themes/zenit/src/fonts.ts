/**
 * Google fonts chosen in the settings, loaded from a privacy-friendly
 * mirror with the same families (no visitor data goes to Google).
 */
import { googleFonts } from '@cleitext/theme-sdk';
import type { Options } from './core/options.js';
import { str } from './core/php.js';

/** Family options and the weight option beside each. */
const FONT_KEYS: [string, string][] = [
  ['body-font-family', 'body-font-weight'],
  ['headings-font-family', 'headings-font-weight'],
  ...[1, 2, 3, 4, 5, 6].map((n): [string, string] => [`font-family-h${n}`, `font-weight-h${n}`]),
  ['font-family-button', 'font-weight-button'],
  ['secondary-font-family-button', 'secondary-font-weight-button'],
  ['header-menu1-font-family', 'header-menu1-font-weight'],
  ['header-menu2-font-family', 'header-menu2-font-weight'],
  ['header-mobile-menu-font-family', 'header-mobile-menu-font-weight'],
  ['header-button1-font-family', 'header-button1-font-weight'],
  ['breadcrumb-font-family', 'breadcrumb-font-weight'],
];

/** The family name of an option value (`'Lora', serif` → `Lora`). */
export const familyName = (value: unknown) => str(value).split(',')[0]!.replace(/['"]/g, '').trim();

/** The stylesheet address of the Google fonts in use, or null. */
export function fontsUrl(o: Options): string | null {
  const fonts = googleFonts();
  const wanted = new Map<string, Set<string>>();
  for (const [familyKey, weightKey] of FONT_KEYS) {
    const family = familyName(o.get(familyKey));
    const font = fonts.get(family);
    if (!font) continue;
    const weights = wanted.get(family) ?? new Set<string>();
    const weight = str(o.get(weightKey));
    for (const w of ['400', weight, '700']) if (font.weights.includes(w)) weights.add(w);
    wanted.set(family, weights);
  }
  if (wanted.size === 0) return null;
  const families = [...wanted].map(
    ([family, weights]) =>
      `${family.toLowerCase().replace(/ /g, '-')}:${[...weights].sort().join(',')}`,
  );
  return `https://fonts.bunny.net/css?family=${families.join('|')}&display=swap`;
}
