/** The pages of the comparison with the reference: what each one is. */
import type { Ctx } from '../core/context.js';

export const PAGES: Record<string, Ctx> = {
  page: {
    view: 'single',
    postType: 'page',
    isFrontPage: false,
    isHome: false,
    meta: {},
    rtl: false,
    comments: false,
  },
  single: {
    view: 'single',
    postType: 'post',
    isFrontPage: false,
    isHome: false,
    meta: {},
    rtl: false,
    comments: true,
  },
  home: {
    view: 'archive',
    postType: 'post',
    isFrontPage: true,
    isHome: true,
    meta: {},
    rtl: false,
  },
  search: {
    view: 'search',
    postType: 'post',
    isFrontPage: false,
    isHome: false,
    meta: {},
    rtl: false,
  },
  '404': { view: '404', postType: 'post', isFrontPage: false, isHome: false, meta: {}, rtl: false },
};
