/** The player of a field: an iframe's address and height from the embed code saved in an article's field. */
export interface Player {
  src: string;
  height: number;
  title: string;
}

const ALLOWED = /^https:\/\/(open\.spotify\.com|widget\.spreaker\.com|www\.youtube(-nocookie)?\.com|player\.vimeo\.com|w\.soundcloud\.com|embed\.podcasts\.apple\.com|www\.podbean\.com|anchor\.fm|creators\.spotify\.com)\//;

/** Reads `<iframe src="…" height="…">` (or a bare address) of a field; null when it is not an allowed player. */
export function playerOf(value: unknown): Player | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const html = value.trim();
  const src = (/<iframe\b[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(html)?.[1] ?? (/^https:\/\/\S+$/.test(html) ? html : ''))
    .replace(/&amp;/g, '&');
  if (!ALLOWED.test(src)) return null;
  const h = Number.parseInt(/\sheight\s*=\s*["']?(\d+)/i.exec(html)?.[1] ?? '', 10);
  const title = /\stitle\s*=\s*["']([^"']*)["']/i.exec(html)?.[1] ?? '';
  return { src, height: Number.isFinite(h) && h >= 60 && h <= 1000 ? h : 152, title };
}
