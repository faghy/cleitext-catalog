/** The scroll-to-top button: fixed, hidden until scrolling, in a corner. */
import type { Part } from './index.js';

export const part: Part = {
  name: 'scroll_to_top_static_css',
  run(o, c) {
    if (o.get('scroll-to-top-enable', true) !== true) return '';
    const [left, right] = c.rtl ? ['right', 'left'] : ['left', 'right'];
    return (
      '#zn-scroll-top{display: none;position: fixed;text-align: center;cursor: pointer;z-index: 99;' +
      'width: 2.1em;height: 2.1em;line-height: 2.1;color: #ffffff;border-radius: 2px;content: "";outline: inherit;}' +
      '@media (min-width: 769px){#zn-scroll-top{content: "769";}}' +
      `#zn-scroll-top .zn-icon.icon-arrow svg{margin-${left}: 0px;vertical-align: middle;` +
      'transform: translate(0, -20%) rotate(180deg);width: 1.6em;}' +
      `.zn-scroll-to-top-right{${right}: 30px;bottom: 30px;}` +
      `.zn-scroll-to-top-left{${left}: 30px;bottom: 30px;}`
    );
  },
};
