/**
 * Rules for the dark palette (the fourth one): menus, forms and borders take
 * the palette's colors instead of their light defaults.
 */
import { parseCss } from '../../core/css.js';
import { at, isset } from '../../core/php.js';
import type { Part } from './index.js';

export const part: Part = {
  name: 'dark_palette_css',
  run(o) {
    const palettes = o.get('zenit-color-palettes');
    const current = isset(palettes, 'currentPalette')
      ? at(palettes, 'currentPalette')
      : 'palette_1';
    if (current !== 'palette_4') return '';
    const inputs = [
      'input[type="text"]:focus',
      'input[type="number"]:focus',
      'input[type="email"]:focus',
      'input[type="url"]:focus',
      'input[type="password"]:focus',
      'input[type="search"]:focus',
      'input[type=reset]:focus',
      'input[type="tel"]:focus',
      'input[type="date"]:focus',
      'select:focus',
      'textarea:focus',
      '.select2-container--default .select2-selection--single .select2-selection__rendered',
    ];
    return parseCss({
      '.zenit-dark-mode-enable .blockUI.blockOverlay': {
        'background-color': 'var( --zn-global-color-primary, var(--zn-global-color-4) ) !important',
      },
      '.zn-header-social-wrap svg': {
        fill: 'var(--zn-global-color-2)',
        stroke: 'var(--zn-global-color-2)',
      },
      ' .zenit-dark-mode-enable .main-header-menu .sub-menu': {
        'background-color': 'var( --zn-global-color-secondary, var(--zn-global-color-5) )',
      },
      '.zenit-dark-mode-enable .zn-header-search .zn-search-menu-icon .search-form': {
        'border-color': 'var(--zn-border-color) !important',
      },
      ':root': { 'border-color': 'var(--zn-border-color) !important' },
      ' .zenit-dark-mode-enable label, .zenit-dark-mode-enable legend': {
        color: 'var(--zn-global-color-2)',
      },
      [' ' + inputs.map((s) => `.zenit-dark-mode-enable ${s}`).join(', ')]: {
        color: 'var(--zn-global-color-2)',
      },
      ' .zenit-dark-mode-enable .wp-block-search.wp-block-search__button-inside .wp-block-search__inside-wrapper':
        {
          border: '1px solid var(--zn-border-color)',
          outline: 'none',
        },
    });
  },
};
