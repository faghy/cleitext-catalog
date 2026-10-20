/**
 * The theme's icons, drawn for Zenit at the sizes its CSS expects: menu and
 * close (24×24), the submenu arrow (26×16), search, account, back to top.
 */

/** A string of SVG put inside an element (no React overhead for static icons). */
export const svg = (markup: string) => ({ dangerouslySetInnerHTML: { __html: markup } });

export const ICONS = {
  menu: `<svg class="zn-mobile-svg zn-menu-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="2" rx="1"></rect><rect x="2" y="11" width="20" height="2" rx="1"></rect><rect x="2" y="17" width="20" height="2" rx="1"></rect></svg>`,
  menu2: `<svg class="zn-mobile-svg zn-menu2-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="2" rx="1"></rect><rect x="2" y="11" width="20" height="2" rx="1"></rect><rect x="2" y="17" width="12" height="2" rx="1"></rect></svg>`,
  menu3: `<svg class="zn-mobile-svg zn-menu3-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="10" y="5" width="12" height="2" rx="1"></rect><rect x="2" y="11" width="20" height="2" rx="1"></rect><rect x="2" y="17" width="20" height="2" rx="1"></rect></svg>`,
  close: `<svg class="zn-mobile-svg zn-close-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="11" y="3" width="2" height="18" rx="1" transform="rotate(45 12 12)"></rect><rect x="11" y="3" width="2" height="18" rx="1" transform="rotate(-45 12 12)"></rect></svg>`,
  arrow: `<svg class="zn-arrow-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="26px" height="16.043px" viewBox="57 35.171 26 16.043"><path d="M57.4 38l2.8-2.8L70 45l9.8-9.8 2.8 2.8L70 50.6z"></path></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" class="zn-search-svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a6 6 0 1 0 3.75 10.69l4.28 4.28a1 1 0 0 0 1.42-1.42l-4.28-4.28A6 6 0 0 0 8 2zm-4 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"></path></svg>`,
  account: `<svg version="1.1" class="account-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 120 120" fill="currentColor"><path d="M84.6 62c-7.1 5.5-15.6 8.4-24.6 8.4s-17.5-2.9-24.6-8.4C17.8 69.1 6 86.1 6 104.8v8.2c0 3.3 2.7 6 6 6h96c3.3 0 6-2.7 6-6v-8.2c0-18.7-11.8-35.7-29.4-42.8zM60 63.4c15.6 0 28.3-12.7 28.3-28.3S75.6 6.8 60 6.8 31.7 19.5 31.7 35.1 44.4 63.4 60 63.4z"></path></svg>`,
  longLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor"><path d="M21 233.4 182.6 72a32 32 0 0 1 45.3 45.3L121.3 224H416a32 32 0 0 1 0 64H121.3l106.6 106.6a32 32 0 0 1-45.3 45.3L21 278.6a32 32 0 0 1 0-45.2z"></path></svg>`,
  longRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor"><path d="M427 278.6 265.4 440a32 32 0 0 1-45.3-45.3L326.7 288H32a32 32 0 0 1 0-64h294.7L220.1 117.4A32 32 0 0 1 265.4 72L427 233.4a32 32 0 0 1 0 45.2z"></path></svg>`,
  /** The reply arrow of comments. */
  reply: `<svg class="zn-reply-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M2 220l160-140c14-12 35-2 35 16v74c146 2 251 31 251 189 0 64-42 127-88 160-14 10-35-3-30-20 50-162-26-201-133-203v81c0 18-21 28-35 16L2 252c-10-9-10-24 0-32z"></path></svg>`,
} as const;

export type IconName = keyof typeof ICONS;
