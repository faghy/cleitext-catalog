/**
 * Blog layouts (Zenit Pro): columns of the grid, the first post across the
 * whole row, masonry, a date box on the images and "load more" or infinite
 * scrolling instead of page numbers.
 */
import type { Label } from '@cleitext/shared';
import { parseCss, tablet, mobile } from '../core/css.js';
import type { Options } from '../core/options.js';
import { str } from '../core/php.js';
import { select, text, toggle, type Place, type Setting } from '../settings/define.js';

const B = 'section-blog';
const L = (en: string, it: string): Label => ({ en, it });
const g = (group: Label, extra: Partial<Place> = {}): Place => ({
  section: B,
  tab: 'general',
  group,
  ...extra,
});
const grid = { field: 'blogLayout', in: ['blog-layout-4', 'blog-layout-6'] };
const infinite = { field: 'blogPagination', equals: 'infinite' };

export function blogSettings(): Setting[] {
  const layout = L('Blog layout', 'Layout del blog');
  const image = L('Featured image', 'Immagine in evidenza');
  const pages = L('Pagination', 'Paginazione');
  return [
    select(
      'blog-grid',
      L('Columns', 'Colonne'),
      g(layout, { showIf: grid }),
      ['1', '2', '3', '4'].map((n) => ({ value: n, label: n })),
    ),
    toggle(
      'first-post-full-width',
      L('First post across the row', 'Primo articolo su tutta la riga'),
      g(layout, { showIf: grid }),
      1,
      0,
    ),
    toggle(
      'blog-masonry',
      L('Masonry', 'Masonry'),
      g(layout, {
        showIf: grid,
        help: L(
          'Posts of different heights fit together without gaps.',
          'Gli articoli di altezze diverse si incastrano senza spazi vuoti.',
        ),
      }),
      1,
      0,
    ),
    toggle('blog-date-box', L('Date box', 'Riquadro della data'), g(image), 1, 0),
    select(
      'blog-date-box-style',
      L('Date box style', 'Stile del riquadro'),
      g(image, { showIf: { field: 'blogDateBox', equals: true } }),
      [
        { value: 'square', label: L('Square', 'Quadrato') },
        { value: 'circle', label: L('Circle', 'Cerchio') },
      ],
    ),
    select('blog-pagination', L('Type', 'Tipo'), g(pages), [
      { value: 'number', label: L('Numbers', 'Numeri') },
      { value: 'infinite', label: L('Load more', 'Carica altri') },
    ]),
    select(
      'blog-infinite-scroll-event',
      L('Load the next posts', 'Carica i successivi'),
      g(pages, { showIf: infinite }),
      [
        { value: 'click', label: L('On click', 'Con un clic') },
        { value: 'scroll', label: L('While scrolling', 'Scorrendo') },
      ],
    ),
    text(
      'blog-load-more-text',
      L('Button text', 'Testo del pulsante'),
      g(pages, {
        showIf: { all: [infinite, { field: 'blogInfiniteScrollEvent', equals: 'click' }] },
      }),
    ),
  ];
}

/** Columns chosen (Zenit's grid has three). */
export const blogColumns = (o: Options) => Number(str(o.get('blog-grid'))) || 3;
export const isMasonry = (o: Options) => Boolean(Number(o.get('blog-masonry', 0)));
export const firstPostFull = (o: Options) => Boolean(Number(o.get('first-post-full-width', 0)));
export const dateBox = (o: Options) =>
  Boolean(Number(o.get('blog-date-box', 0)))
    ? str(o.get('blog-date-box-style', 'square')) || 'square'
    : '';
export const infiniteLoad = (o: Options) =>
  str(o.get('blog-pagination')) === 'infinite'
    ? str(o.get('blog-infinite-scroll-event', 'click')) || 'click'
    : '';

/** The CSS of the choices above for the list layout `layout` (none when untouched). */
export function blogProCss(o: Options, layout: string): string {
  const bl = `.zn-${layout}-grid`;
  const cols = blogColumns(o);
  let css = '';
  if (cols !== 3 && (layout === 'blog-layout-4' || layout === 'blog-layout-6')) {
    css += parseCss({ [`${bl} .zn-article-post`]: { width: `${(100 / cols).toFixed(2)}%` } });
    if (cols > 2) css += parseCss({ [`${bl} .zn-article-post`]: { width: '50%' } }, '', tablet());
    css += parseCss({ [`${bl} .zn-article-post`]: { width: '100%' } }, '', mobile());
  }
  if (firstPostFull(o))
    css += parseCss({
      [`${bl}.zn-first-post-full .zn-row > .zn-article-post:first-child`]: { width: '100%' },
    });
  if (isMasonry(o))
    css +=
      parseCss({
        [`${bl}.zn-blog-masonry .zn-row`]: { display: 'block', 'column-count': String(cols) },
        [`${bl}.zn-blog-masonry .zn-article-post`]: {
          display: 'inline-block',
          width: '100%',
          'break-inside': 'avoid',
        },
      }) +
      parseCss(
        { [`${bl}.zn-blog-masonry .zn-row`]: { 'column-count': String(Math.min(cols, 2)) } },
        '',
        tablet(),
      ) +
      parseCss({ [`${bl}.zn-blog-masonry .zn-row`]: { 'column-count': '1' } }, '', mobile());
  return css;
}
