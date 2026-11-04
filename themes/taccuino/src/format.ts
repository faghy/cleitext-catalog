/** Small helpers of the theme, kept apart so they can be tested without React. */

const MONTHS: Record<string, string[]> = {
  it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The date parts of an ISO date in a time zone. */
function parts(iso: string, timeZone: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  let zone = timeZone || 'UTC';
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone });
  } catch {
    zone = 'UTC';
  }
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: zone, year: 'numeric', month: 'numeric', day: 'numeric' });
  const get = (type: string) => Number(fmt.formatToParts(date).find((p) => p.type === type)?.value ?? 0);
  return { y: get('year'), m: get('month'), d: get('day') };
}

/**
 * A date written with PHP's date letters, as WordPress's date format (`F j, Y` → "Maggio 17, 2024"; month names
 * capitalized when the format starts with them, as WordPress's Italian translation does).
 * Letters: d j m n F M Y y; other characters as they are, `\x` escapes a letter.
 */
export function formatDate(iso: string, format: string, locale: string, timeZone: string): string {
  const p = parts(iso, timeZone);
  if (!p) return '';
  const lang = (locale || 'en').slice(0, 2).toLowerCase();
  const months = MONTHS[lang] ?? MONTHS.en!;
  const name = months[p.m - 1] ?? '';
  let out = '';
  const f = format || 'j F Y';
  for (let i = 0; i < f.length; i++) {
    const c = f[i]!;
    if (c === '\\') {
      out += f[++i] ?? '';
      continue;
    }
    switch (c) {
      case 'd': out += String(p.d).padStart(2, '0'); break;
      case 'j': out += String(p.d); break;
      case 'm': out += String(p.m).padStart(2, '0'); break;
      case 'n': out += String(p.m); break;
      case 'F': out += out.trim() === '' ? cap(name) : name; break;
      case 'M': out += cap(name.slice(0, 3)); break;
      case 'Y': out += String(p.y); break;
      case 'y': out += String(p.y).slice(-2); break;
      default: out += c;
    }
  }
  return out;
}

/** An excerpt cut to `words` words with an ellipsis, as WordPress's `excerpt_length`; 0 keeps it whole. */
export function trimWords(text: string, words: number): string {
  const clean = text.replace(/\s*(\[(?:…|&hellip;|\.\.\.)\]|…|\.\.\.)\s*$/u, '').trim();
  if (!words || words < 1) return text;
  const list = clean.split(/\s+/).filter(Boolean);
  if (list.length <= words) return clean === text.trim() ? clean : `${clean}…`;
  return `${list.slice(0, words).join(' ')}…`;
}

/** `{year}` in a footer text → the current year. */
export const withYear = (text: string, year = new Date().getFullYear()) => text.replace(/\{year\}/g, String(year));

/** A safe link target: http(s), mailto, tel, a path or an anchor; else null. */
export function safeHref(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  if (!v) return null;
  if (/^(https?:|mailto:|tel:)/i.test(v) || /^\/(?!\/)/.test(v) || v.startsWith('#')) return v;
  return null;
}

/** A hexadecimal color (#rgb or #rrggbb), else the fallback. */
export const color = (value: unknown, fallback: string) =>
  typeof value === 'string' && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim()) ? value.trim() : fallback;

/** A font family name safe in CSS and in a Google Fonts address (letters, digits, spaces), else the fallback. */
export const family = (value: unknown, fallback: string) =>
  typeof value === 'string' && /^[A-Za-z0-9 ]{2,60}$/.test(value.trim()) ? value.trim() : fallback;

/** The Google Fonts stylesheet of the two families (Cleitext keeps a copy on the site). */
export function fontsUrl(heading: string, body: string): string {
  const q = (name: string) => name.replace(/ /g, '+');
  const fams =
    heading === body
      ? [`family=${q(body)}:ital,wght@0,300;0,400;0,700;1,300;1,700`]
      : [`family=${q(heading)}`, `family=${q(body)}:ital,wght@0,300;0,400;0,700;1,300;1,700`];
  return `https://fonts.googleapis.com/css2?${fams.join('&')}&display=swap`;
}
