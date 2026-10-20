/**
 * The theme's options as the CSS and the templates read them: the site's
 * values (from the Customize settings) over the defaults.
 */
import { DEFAULTS } from './defaults.js';
import { at } from './php.js';

export class Options {
  private readonly values: Record<string, unknown>;

  constructor(values: Record<string, unknown> = {}) {
    this.values = { ...DEFAULTS, ...values };
  }

  /** An option, or `def` when it is missing or an empty string. */
  get<T = unknown>(key: string, def: unknown = ''): T {
    const v = this.values[key];
    return (v !== undefined && v !== null && v !== '' ? v : def) as T;
  }

  /** The raw value (empty strings included), or undefined. */
  raw(key: string): unknown {
    return this.values[key];
  }

  /** Whether the site set the option itself (not a default). */
  has(key: string): boolean {
    return key in this.values && this.values[key] !== DEFAULTS[key];
  }

  /** The color behind `var(--zn-global-color-N)`, or the value itself. */
  paletteColor(value: string): string {
    const match = /--zn-global-color-(\d+)/.exec(value);
    if (!match) return value;
    const color = at(this.get('global-color-palette'), 'palette', match[1]!);
    return typeof color === 'string' ? color : value;
  }
}
