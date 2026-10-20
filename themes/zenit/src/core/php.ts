/**
 * The comparisons and number formatting the CSS rules were written with, so
 * that the same options give the same CSS: `blank(v)` is `'' == v`, `empty`
 * is PHP's `empty()`, numbers print with 14 significant digits.
 */

/** `'' == v`: empty string, null, false or missing (not 0, not '0'). */
export function blank(v: unknown): boolean {
  return v === '' || v === null || v === undefined || v === false;
}

/** PHP's `empty()`. */
export function empty(v: unknown): boolean {
  if (Array.isArray(v)) return v.length === 0;
  if (v && typeof v === 'object') return Object.keys(v).length === 0;
  return v === undefined || v === null || v === false || v === 0 || v === '' || v === '0';
}

/** A value printed into CSS, as PHP prints it. */
export function str(v: unknown): string {
  if (v === null || v === undefined || v === false) return '';
  if (v === true) return '1';
  if (typeof v === 'number') return num(v);
  return String(v);
}

/** A number as PHP's `echo` prints it (precision 14). */
export function num(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Number.isInteger(n)) return String(n);
  return String(Number(n.toPrecision(14)));
}

/** `is_numeric()`. */
export function isNumeric(v: unknown): boolean {
  if (typeof v === 'number') return Number.isFinite(v);
  return typeof v === 'string' && /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/.test(v);
}

/** `intval()`. */
export function intval(v: unknown): number {
  if (typeof v === 'number') return Math.trunc(v);
  const n = parseInt(String(v ?? ''), 10);
  return Number.isNaN(n) ? 0 : n;
}

/** `floatval()`. */
export function floatval(v: unknown): number {
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v ?? ''));
  return Number.isNaN(n) ? 0 : n;
}

/** A record (PHP array) or an empty one. */
export function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/** `isset($a[$k])`: present and not null. */
export function isset(a: unknown, ...keys: string[]): boolean {
  let cur: unknown = a;
  for (const k of keys) {
    if (!cur || typeof cur !== 'object') return false;
    cur = (cur as Record<string, unknown>)[k];
    if (cur === undefined || cur === null) return false;
  }
  return true;
}

/** `$a[$k1][$k2]…` or undefined. */
export function at(a: unknown, ...keys: string[]): unknown {
  let cur: unknown = a;
  for (const k of keys) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }
  return cur;
}

/** `esc_attr()` for values printed into CSS. */
export function escAttr(v: unknown): string {
  return str(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Short name of `escAttr`. */
export const esc = escAttr;
