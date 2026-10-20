/**
 * Page numbers under lists: colors, sizes, previous and next links. Only
 * when the list has more than one page (`paginated` on the page context).
 */
import { mobile, parseCss } from '../../core/css.js';
import type { Ctx } from '../../core/context.js';
import { esc } from '../../core/php.js';
import { trimCss } from '../lib/footer-global.js';
import type { Part } from './index.js';

const PN = '.zn-pagination';

/** Rules that do not depend on the options. */
function staticCss(c: Ctx): string {
  const [start, end] = c.rtl ? ['right', 'left'] : ['left', 'right'];
  let css =
    `${PN} .prev.page-numbers, ${PN} .next.page-numbers {padding: 0 1.5em;height: 2.33333em;line-height: calc(2.33333em - 3px);}` +
    `.zn-pagination-default ${PN} .next.page-numbers {padding-right: 0;}` +
    `.zn-pagination-default ${PN} .prev.page-numbers {padding-left: 0;}` +
    `.zn-pagination-default .post-page-numbers.current .page-link, .zn-pagination-default ${PN} .page-numbers.current {border-radius: 2px;}` +
    `${PN} {display: inline-block;width: 100%;padding-top: 2em;text-align: center;}` +
    `${PN} .page-numbers {display: inline-block;width: 2.33333em;height: 2.33333em;font-size: 16px;font-size: 1.06666rem;` +
    'line-height: calc(2.33333em - 3px);font-weight: 500;}' +
    `${PN} .nav-links {display: inline-block;width: 100%;}` +
    `@media (max-width: 420px) {${PN} .prev.page-numbers, ${PN} .next.page-numbers {width: 100%;text-align: center;margin: 0;}` +
    `.zn-pagination-circle ${PN} .next.page-numbers, .zn-pagination-square ${PN} .next.page-numbers{margin-top: 10px;}` +
    `.zn-pagination-circle ${PN} .prev.page-numbers, .zn-pagination-square ${PN} .prev.page-numbers{margin-bottom: 10px;}}` +
    `${PN} .prev, ${PN} .prev:visited, ${PN} .prev:focus, ${PN} .next, ${PN} .next:visited, ${PN} .next:focus ` +
    '{display: inline-block;width: auto;}' +
    `${PN} .prev svg, ${PN} .next svg{height: 16px;position: relative;top: 0.2em;}` +
    `${PN} .prev svg {margin-right: 0.3em;}` +
    `${PN} .next svg {margin-left: 0.3em;}` +
    `.zn-page-builder-template ${PN} {padding: 2em;}`;
  if (c.rtl) {
    css +=
      `.zn-pagination-default ${PN} .next.page-numbers {padding-left: 0;}` +
      `.zn-pagination-default ${PN} .prev.page-numbers {padding-right: 0;}` +
      `${PN} .prev svg {margin-left: 0.3em;}` +
      `${PN} .next svg {margin-right: 0.3em;}` +
      `@media (min-width: 993px) {${PN} {padding-right: 3.33333em;padding-left: 3.33333em;}` +
      `${PN} .prev.page-numbers {float: right;}` +
      `${PN} .next.page-numbers {float: left;text-align: left;}}` +
      `@media (max-width: 768px) {${PN} .next.page-numbers .page-navigation {padding-left: 0;}}`;
  } else {
    css +=
      `${PN} .prev.page-numbers {float: ${start};}` +
      `${PN} .next.page-numbers {float: ${end};}` +
      `@media (max-width: 768px) {${PN} .next.page-numbers .page-navigation {padding-right: 0;}}`;
  }
  return trimCss(css);
}

export const part: Part = {
  name: 'pagination_css',
  run(o, c) {
    if ((c as Ctx & { paginated?: boolean }).paginated !== true) return '';
    return (
      parseCss({
        [`${PN} .next.page-numbers`]: { display: 'inherit', float: 'none' },
        [`${PN} a, .nav-links a`]: { color: esc(o.get('text-color')) },
        [`${PN} a:hover, ${PN} a:focus, ${PN} > span:hover:not(.dots), ${PN} > span.current`]: {
          color: esc(o.get('link-h-color')),
        },
      }) +
      parseCss(
        { [`${PN} .next:focus, ${PN} .prev:focus`]: { width: '100% !important' } },
        '',
        mobile(),
      ) +
      staticCss(c)
    );
  },
};
