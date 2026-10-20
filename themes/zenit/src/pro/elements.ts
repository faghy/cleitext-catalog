/**
 * More header and footer elements (Zenit Pro): buttons, HTML blocks,
 * widget areas and social icon sets beyond the theme's own.
 */
import type { ThemeSettingsSection } from '@cleitext/theme-sdk';
import { button, html, social, widget } from '../settings/builder-header.js';
import type { BuilderItem, Setting } from '../settings/define.js';

type Kind = 'button' | 'html' | 'social' | 'widget';
type Builder = 'header' | 'footer';

/** How many of each the theme has, and how many with Zenit Pro. */
export const FREE: Record<Builder, Record<Kind, number>> = {
  header: { button: 1, html: 2, social: 1, widget: 2 },
  footer: { button: 0, html: 2, social: 1, widget: 4 },
};
export const PRO_MAX: Record<Builder, Record<Kind, number>> = {
  header: { button: 3, html: 4, social: 2, widget: 4 },
  footer: { button: 0, html: 4, social: 2, widget: 6 },
};

const H = 'section-header-builder-layout';
const F = 'section-footer-builder-layout';
const KINDS: Kind[] = ['button', 'html', 'social', 'widget'];

const idOf = (kind: Kind, n: number) => (kind === 'social' ? `social-icons-${n}` : `${kind}-${n}`);
const sectionOf = (type: Builder, kind: Kind, n: number) => {
  const b = type === 'header' ? 'hb' : 'fb';
  if (kind === 'widget') return `sidebar-widgets-${type}-widget-${n}`;
  if (kind === 'social') return `section-${b}-social-icons-${n}`;
  return `section-${b}-${kind}-${n}`;
};
const labelOf = (kind: Kind, n: number) =>
  ({
    button: { en: `Button ${n}`, it: `Pulsante ${n}` },
    html: { en: `HTML ${n}`, it: `HTML ${n}` },
    social: { en: `Social ${n}`, it: `Social ${n}` },
    widget: { en: `Widget ${n}`, it: `Widget ${n}` },
  })[kind];

/** The extra elements of a builder: kind and number. */
function extra(type: Builder): { kind: Kind; n: number }[] {
  return KINDS.flatMap((kind) =>
    Array.from({ length: PRO_MAX[type][kind] - FREE[type][kind] }, (_, i) => ({
      kind,
      n: FREE[type][kind] + i + 1,
    })),
  );
}

/** Whether an element of the layout exists only with Zenit Pro. */
export function proOnly(type: Builder, id: string): boolean {
  const m = /^(button|html|social-icons|widget)-(\d+)$/.exec(id);
  if (!m) return false;
  const kind = (m[1] === 'social-icons' ? 'social' : m[1]) as Kind;
  return Number(m[2]) > FREE[type][kind];
}

/** The settings section an element is edited in (for the preview pencils). */
export function elementSection(type: Builder, id: string): string {
  const m = /^(button|html|social-icons|widget)-(\d+)$/.exec(id);
  if (!m) return '';
  const kind = (m[1] === 'social-icons' ? 'social' : m[1]) as Kind;
  return sectionOf(type, kind, Number(m[2]));
}

export const PRO_ITEMS: Record<Builder, BuilderItem[]> = {
  header: extra('header').map(({ kind, n }) => ({
    id: idOf(kind, n),
    label: labelOf(kind, n),
    section: sectionOf('header', kind, n),
  })),
  footer: extra('footer').map(({ kind, n }) => ({
    id: idOf(kind, n),
    label: labelOf(kind, n),
    section: sectionOf('footer', kind, n),
  })),
};

export const ELEMENT_SECTIONS: ThemeSettingsSection[] = (['header', 'footer'] as const).flatMap(
  (type) =>
    extra(type).map(({ kind, n }) => ({
      id: sectionOf(type, kind, n),
      label: labelOf(kind, n),
      parent: type === 'header' ? H : F,
      ...(kind === 'widget'
        ? {
            description: {
              en: `Its blocks are written in Appearance → Areas → ${type === 'header' ? 'Header' : 'Footer'} widget ${n}.`,
              it: `I suoi blocchi si scrivono in Aspetto → Aree → ${type === 'header' ? 'Header' : 'Footer'} widget ${n}.`,
            },
          }
        : {
            tabs: [
              { id: 'general', label: { en: 'General', it: 'Generale' } },
              { id: 'design', label: { en: 'Design', it: 'Design' } },
            ],
          }),
    })),
);

/** Block areas of the extra widgets. */
export const ELEMENT_AREAS: Record<string, string> = Object.fromEntries(
  (['header', 'footer'] as const).flatMap((type) =>
    extra(type)
      .filter((e) => e.kind === 'widget')
      .map(({ n }) => [
        `${type}-widget-${n}`,
        `${type === 'header' ? 'Header' : 'Footer'} widget ${n}`,
      ]),
  ),
);

export function elementSettings(): Setting[] {
  return (['header', 'footer'] as const).flatMap((type) =>
    extra(type).flatMap(({ kind, n }) => {
      if (kind === 'button') return button(n);
      if (kind === 'html') return html(type, n);
      if (kind === 'social') return social(type, n);
      return widget(type, n);
    }),
  );
}
