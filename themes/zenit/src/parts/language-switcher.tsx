/**
 * The language switcher of the header and footer builders (Zenit 1.2.0): the
 * site's languages from Cleitext (`page.locales`, each with the address of the
 * current page in that language, or of the language's home when the page has
 * no translation), as a dropdown or a list, with flags and native names or
 * codes. It shows nothing on sites with one language.
 *
 * Since Zenit 1.2.2, with Multilingual 1.6.0 on Cleitext 0.83 the slot shows
 * the plugin's switcher (`<LanguageSwitcher>` of the theme SDK): one look and
 * one set of options for the whole site, with this slot's layout as Zenit's
 * suggestion. Zenit's own list is the fallback (older cores or plugins).
 */
import * as sdk from '@cleitext/theme-sdk';
import type { LocaleLink } from '@cleitext/theme-sdk';
import type { ReactNode } from 'react';
import { str } from '../core/php.js';
import { ICONS, svg } from './icons.js';
import { cx, type R } from './render.js';

export type SwitcherLayout = 'dropdown' | 'horizontal' | 'vertical';

/** Countries of the flags of languages written without one (`it`, not `it-IT`). */
const COUNTRIES: Record<string, string> = {
  ar: 'SA',
  bg: 'BG',
  ca: 'AD',
  cs: 'CZ',
  da: 'DK',
  de: 'DE',
  el: 'GR',
  en: 'GB',
  es: 'ES',
  et: 'EE',
  fi: 'FI',
  fr: 'FR',
  he: 'IL',
  hi: 'IN',
  hr: 'HR',
  hu: 'HU',
  id: 'ID',
  it: 'IT',
  ja: 'JP',
  ko: 'KR',
  lt: 'LT',
  lv: 'LV',
  nb: 'NO',
  nl: 'NL',
  no: 'NO',
  pl: 'PL',
  pt: 'PT',
  ro: 'RO',
  ru: 'RU',
  sk: 'SK',
  sl: 'SI',
  sq: 'AL',
  sr: 'RS',
  sv: 'SE',
  th: 'TH',
  tr: 'TR',
  uk: 'UA',
  vi: 'VN',
  zh: 'CN',
};

/** The flag of a language as an emoji (`🇮🇹`), or '' when no country goes with it. */
export function flagOf(code: string): string {
  const [lang = '', region] = code.split(/[-_]/);
  const country = (
    region && /^[A-Za-z]{2}$/.test(region) ? region : COUNTRIES[lang.toLowerCase()]
  )?.toUpperCase();
  if (!country) return '';
  return String.fromCodePoint(...[...country].map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/** The language's name in itself (`Deutsch` for `de`), else the name the site gives it. */
export function nativeName(locale: Pick<LocaleLink, 'code' | 'name'>): string {
  try {
    const name = new Intl.DisplayNames([locale.code], { type: 'language', fallback: 'none' }).of(
      locale.code,
    );
    if (name && name !== locale.code)
      return name.charAt(0).toLocaleUpperCase(locale.code) + name.slice(1);
  } catch {
    // A code this runtime does not know.
  }
  return locale.name || locale.code.toUpperCase();
}

/** The options of a builder's switcher. */
export function switcherOptions(r: R, type: 'header' | 'footer') {
  const k = `${type}-language-switcher`;
  const layout = str(r.o.get(`${k}-layout`, type === 'header' ? 'dropdown' : 'horizontal'));
  return {
    layout: (['dropdown', 'horizontal', 'vertical'].includes(layout)
      ? layout
      : 'dropdown') as SwitcherLayout,
    flags: Boolean(r.o.get(`${k}-show-flag`)),
    codes: r.o.get(`${k}-display`) === 'code',
  };
}

function Label({ locale, flags, codes }: { locale: LocaleLink; flags: boolean; codes: boolean }) {
  const flag = flags ? flagOf(locale.code) : '';
  const name = nativeName(locale);
  return (
    <>
      {flag && (
        <span className="zn-lang-flag" aria-hidden="true">
          {flag}
        </span>
      )}
      {codes ? (
        <>
          <span className="zn-lang-name" aria-hidden="true">
            {locale.code.toUpperCase()}
          </span>
          <span className="screen-reader-text">{name}</span>
        </>
      ) : (
        <span className="zn-lang-name">{name}</span>
      )}
    </>
  );
}

function Item({ locale, flags, codes }: { locale: LocaleLink; flags: boolean; codes: boolean }) {
  return (
    <li className={cx('zn-lang-item', locale.current && 'zn-lang-current')}>
      <a
        href={locale.url}
        hrefLang={locale.code}
        lang={locale.code}
        aria-current={locale.current ? 'true' : undefined}
      >
        <Label locale={locale} flags={flags} codes={codes} />
      </a>
    </li>
  );
}

/** The theme SDK's switcher (Cleitext 0.83), read as optional: older cores do not have it. */
type SharedSwitcher = (props: {
  placement?: string;
  hint?: { style?: 'dropdown' | 'inline' | 'list' };
  className?: string;
  fallback?: ReactNode;
}) => ReactNode;
const shared = (sdk as unknown as { LanguageSwitcher?: SharedSwitcher }).LanguageSwitcher;

/** Zenit's layouts as the language plugin names them. */
const HINT = { dropdown: 'dropdown', horizontal: 'inline', vertical: 'list' } as const;

/**
 * The slot's switcher: the language plugin's when the core and the plugin
 * give one, else Zenit's own.
 */
export function LanguageSwitcher({ r, type }: { r: R; type: 'header' | 'footer' }) {
  const own = <OwnSwitcher r={r} type={type} />;
  const plugin = (r.page as { languageSwitcher?: unknown }).languageSwitcher;
  if (typeof shared !== 'function' || !plugin) return own;
  const Shared = shared;
  return (
    <Shared
      placement={type}
      hint={{ style: HINT[switcherOptions(r, type).layout] }}
      className="zn-lang-switcher"
      fallback={own}
    />
  );
}

/** Zenit's own switcher: a dropdown (`<details>`, opened by click, tap or keyboard) or a list. */
export function OwnSwitcher({ r, type }: { r: R; type: 'header' | 'footer' }) {
  const { page, t } = r;
  const locales = page.locales ?? [];
  if (locales.length < 2) return null;
  const { layout, flags, codes } = switcherOptions(r, type);
  const current = locales.find((l) => l.current) ?? locales[0]!;
  const className = cx('zn-lang-switcher', `zn-lang-switcher-${layout}`, flags && 'zn-lang-flags');
  if (layout === 'dropdown') {
    return (
      <nav className={className} aria-label={t.languages}>
        <details className="zn-lang-dropdown">
          <summary aria-label={t.language(nativeName(current))} lang={current.code}>
            <Label locale={current} flags={flags} codes={codes} />
            <span className="zn-lang-caret" aria-hidden="true" {...svg(ICONS.arrow)} />
          </summary>
          <ul className="zn-lang-list">
            {locales
              .filter((l) => l !== current)
              .map((locale) => (
                <Item key={locale.code} locale={locale} flags={flags} codes={codes} />
              ))}
          </ul>
        </details>
      </nav>
    );
  }
  return (
    <nav className={className} aria-label={t.languages}>
      <ul className="zn-lang-list">
        {locales.map((locale) => (
          <Item key={locale.code} locale={locale} flags={flags} codes={codes} />
        ))}
      </ul>
    </nav>
  );
}
