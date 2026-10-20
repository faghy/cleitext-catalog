/**
 * The Google Fonts list, given by the theme when it starts. The settings
 * definitions are also bundled by Zenit Pro, which must not pull in the
 * theme SDK: they ask for the list only when values are written.
 */
import type { GoogleFont } from '@cleitext/theme-sdk';

let source: () => Map<string, GoogleFont> = () => new Map();

export function setGoogleFonts(list: () => Map<string, GoogleFont>): void {
  source = list;
}

export const googleFonts = (): Map<string, GoogleFont> => source();
