/**
 * Tests of Zenit, run from a Cleitext checkout beside the catalog:
 * `node_modules/.bin/vitest run --root ../cleitext-catalog/themes/zenit`.
 * React and the theme SDK come from that checkout (the catalog has no
 * packages of its own); the build (`cleitext theme:build`) does not read this.
 */
import { fileURLToPath } from 'node:url';

const cleitext = (path) => fileURLToPath(new URL(`../../../cleitext/${path}`, import.meta.url));

export default {
  resolve: {
    alias: [
      { find: /^react$/, replacement: cleitext('packages/theme-sdk/node_modules/react/index.js') },
      {
        find: /^react\/jsx-runtime$/,
        replacement: cleitext('packages/theme-sdk/node_modules/react/jsx-runtime.js'),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: cleitext('packages/theme-sdk/node_modules/react/jsx-dev-runtime.js'),
      },
      {
        find: /^react-dom\/server$/,
        replacement: cleitext('packages/theme-sdk/node_modules/react-dom/server.node.js'),
      },
      { find: /^@cleitext\/theme-sdk$/, replacement: cleitext('packages/theme-sdk/src/index.tsx') },
    ],
  },
};
