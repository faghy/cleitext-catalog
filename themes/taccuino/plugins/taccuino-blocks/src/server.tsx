import { defineBlock, definePlugin, type PluginContext } from '@cleitext/plugin-sdk';
import { playerOf } from './embed';
import { formatDate, safeHref, trimWords } from './format';

/**
 * Taccuino Blocks (comes with the Taccuino theme): two blocks that list the site's articles with the theme's
 * markup, so a home page or a band can be made of them and edited in the block editor or in Fresco.
 *
 * - Articles: the latest articles (of a category, if chosen): with "Big first" the first over its photo, then
 *   cards; on phones a list of cards of its own length and a "load more" link.
 * - Embeds of articles: the latest articles of a category with the player saved in a field of theirs (an iframe
 *   of Spotify, Spreaker, YouTube…), their date and title; as a colored band with a logo, a title and a button,
 *   or as the list of a category page (empty category: the one of the page).
 *
 * Articles with the "hidden" tag are left out. Players are iframes of other sites: the Privacy plugin holds them
 * until consent, like any embed.
 */

interface Entry {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  image: { url: string; alt: string; variants: { url: string; width: number; format: string }[] } | null;
  terms?: Record<string, { name: string; slug: string; url: string }[]>;
  fields?: Record<string, unknown>;
}

interface Common {
  category: string;
  hiddenTag: string;
  dateFormat: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const slug = (v: unknown) => str(v).toLowerCase().replace(/[^a-z0-9_-]/g, '');

function srcSet(image: NonNullable<Entry['image']>) {
  const list = image.variants
    .filter((v) => v.format !== 'avif')
    .sort((a, b) => a.width - b.width)
    .map((v) => `${v.url} ${v.width}w`);
  return list.length ? list.join(', ') : undefined;
}

async function load(ctx: PluginContext, attrs: Common, context: Parameters<NonNullable<Parameters<typeof defineBlock>[0]['load']>>[1], limit: number, offset = 0) {
  const category = slug(attrs.category) || (context.page.archive?.term?.taxonomy === 'category' ? context.page.archive.term.slug : '');
  const hidden = slug(attrs.hiddenTag);
  const site = await ctx.site(context.siteId).catch(() => null);
  const { entries } = await context.query({
    type: 'article',
    ...(category ? { terms: { taxonomy: 'category', slugs: [category] } } : {}),
    limit: Math.min(100, limit + (hidden ? 10 : 0)),
    offset,
  });
  const list = (entries as unknown as Entry[])
    .filter((e) => !hidden || !Object.values(e.terms ?? {}).some((l) => l.some((t) => t.slug === hidden)))
    .slice(0, limit);
  return { entries: list, timezone: site?.timezone ?? 'UTC', locale: context.locale, hidden };
}

type Loaded = Awaited<ReturnType<typeof load>>;

function DateLine({ entry, data, format }: { entry: Entry; data: Loaded; format: string }) {
  const cats = (entry.terms?.category ?? []).filter((t) => t.slug !== data.hidden);
  return (
    <div className="tc-date">
      {entry.publishedAt && <span>{formatDate(entry.publishedAt, format || 'j F Y', data.locale, data.timezone)}</span>}
      {cats.map((t) => (
        <a key={t.slug} href={t.url} className="tc-cat">
          <span>{t.name}</span>
        </a>
      ))}
    </div>
  );
}

function Card({ entry, data, format, words, eager }: { entry: Entry; data: Loaded; format: string; words: number; eager?: boolean }) {
  return (
    <article className="tc-card">
      <a href={entry.url} className="tc-card-image" tabIndex={-1} aria-hidden="true">
        {entry.image && (
          <img src={entry.image.url} srcSet={srcSet(entry.image)} sizes="(max-width: 640px) 100vw, 420px" alt="" loading={eager ? undefined : 'lazy'} />
        )}
      </a>
      <header className="tc-card-header">
        <DateLine entry={entry} data={data} format={format} />
        <h2 className="tc-card-title">
          <a href={entry.url}>{entry.title}</a>
        </h2>
      </header>
      {entry.excerpt && (
        <div className="tc-excerpt">
          <p>{trimWords(entry.excerpt, words)}</p>
        </div>
      )}
    </article>
  );
}

const common = [
  { name: 'category', type: 'text' as const, maxLength: 100, label: { en: 'Category (slug; empty: all)', it: 'Categoria (slug; vuoto: tutte)' } },
  { name: 'hiddenTag', type: 'text' as const, maxLength: 100, label: { en: 'Leave out the articles with the tag (slug)', it: 'Escludi gli articoli con il tag (slug)' } },
  { name: 'dateFormat', type: 'text' as const, maxLength: 30, default: 'j F Y', label: { en: 'Date format (PHP letters, e.g. F j, Y)', it: 'Formato della data (lettere di PHP, es. F j, Y)' } },
];

interface PostsAttrs extends Common {
  layout: 'feature' | 'cards';
  count: number;
  offset: number;
  mobileCount: number;
  excerptWords: number;
  moreLabel: string;
  moreUrl: string;
}

interface EmbedsAttrs extends Common {
  field: string;
  count: number;
  layout: 'band' | 'list';
  logo?: string;
  title: string;
  buttonLabel: string;
  buttonUrl: string;
}

export default definePlugin({
  setup(ctx) {
    ctx.blocks.register(
      defineBlock<PostsAttrs, Loaded>({
        type: 'taccuino-blocks/posts',
        title: { en: 'Articles', it: 'Articoli' },
        description: { en: 'The latest articles, the first one big over its photo.', it: 'Gli ultimi articoli, il primo grande sulla sua foto.' },
        icon: 'grid-view',
        category: 'widgets',
        attributes: [
          ...common,
          {
            name: 'layout',
            type: 'select',
            default: 'feature',
            label: { en: 'Layout', it: 'Impaginazione' },
            options: [
              { value: 'feature', label: { en: 'Big first, then cards', it: 'Il primo grande, poi le card' } },
              { value: 'cards', label: { en: 'Cards', it: 'Card' } },
            ],
          },
          { name: 'count', type: 'number', min: 1, max: 30, default: 4, label: { en: 'How many', it: 'Quanti' } },
          { name: 'offset', type: 'number', min: 0, max: 50, default: 0, label: { en: 'Skip the first', it: 'Salta i primi' } },
          { name: 'mobileCount', type: 'number', min: 0, max: 30, default: 10, label: { en: 'How many on phones (0: the same)', it: 'Quanti sui telefoni (0: gli stessi)' } },
          { name: 'excerptWords', type: 'number', min: 0, max: 100, default: 20, label: { en: 'Words of the excerpts', it: 'Parole dei riassunti' } },
          { name: 'moreLabel', type: 'text', maxLength: 60, label: { en: '"Load more" label (phones)', it: 'Testo di "carica altri" (telefoni)' } },
          { name: 'moreUrl', type: 'text', maxLength: 300, label: { en: '"Load more" address', it: 'Indirizzo di "carica altri"' } },
        ],
        async load(attrs, context) {
          context.tag('type:article');
          return load(ctx, attrs, context, Math.max(attrs.count ?? 4, attrs.mobileCount ?? 0), attrs.offset ?? 0);
        },
        render({ attrs, data }) {
          if (!data || data.entries.length === 0) return null;
          const words = Number(attrs.excerptWords ?? 20);
          const desktop = data.entries.slice(0, attrs.count ?? 4);
          const phone = attrs.mobileCount ? data.entries.slice(0, attrs.mobileCount) : null;
          const [first, ...rest] = desktop;
          const more = safeHref(attrs.moreUrl);
          const big = attrs.layout !== 'cards' && first;
          return (
            <div className="tc-home">
              <div className={phone ? 'tc-only-desktop' : undefined}>
                <div className="tc-cards">
                  {big && (
                    <article className="tc-feature">
                      <div className="tc-feature-image">
                        {first.image && <img src={first.image.url} srcSet={srcSet(first.image)} sizes="100vw" alt={first.title} />}
                      </div>
                      <div className="tc-feature-text">
                        <header>
                          <DateLine entry={first} data={data} format={attrs.dateFormat} />
                          <h1 className="tc-feature-title">
                            <a href={first.url}>{first.title}</a>
                          </h1>
                        </header>
                        {first.excerpt && (
                          <div className="tc-excerpt">
                            <p>{trimWords(first.excerpt, words)}</p>
                          </div>
                        )}
                      </div>
                    </article>
                  )}
                  {(big ? rest : desktop).map((e) => (
                    <Card key={e.id} entry={e} data={data} format={attrs.dateFormat} words={words} />
                  ))}
                </div>
              </div>
              {phone && (
                <div className="tc-only-mobile">
                  <div className="tc-cards" data-tc-list="">
                    {phone.map((e, i) => (
                      <Card key={e.id} entry={e} data={data} format={attrs.dateFormat} words={words} eager={i === 0} />
                    ))}
                  </div>
                  {more && str(attrs.moreLabel) && (
                    <div className="tc-more-bar">
                      <a className="tc-button tc-button-secondary tc-button-small tc-more" href={more} data-tc-more="">
                        {str(attrs.moreLabel)}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        },
      }),
    );

    ctx.blocks.register(
      defineBlock<EmbedsAttrs, Loaded>({
        type: 'taccuino-blocks/embeds',
        title: { en: 'Embeds of articles', it: 'Player degli articoli' },
        description: {
          en: 'The players saved in a field of the latest articles of a category (e.g. podcast episodes).',
          it: 'I player salvati in un campo degli ultimi articoli di una categoria (es. le puntate di un podcast).',
        },
        icon: 'format-audio',
        category: 'widgets',
        media: (attrs) => (attrs.logo ? [attrs.logo] : []),
        attributes: [
          ...common,
          { name: 'field', type: 'text', maxLength: 60, default: 'embed_spotify', label: { en: 'Field with the embed code', it: 'Campo con il codice del player' } },
          { name: 'count', type: 'number', min: 1, max: 100, default: 1, label: { en: 'How many', it: 'Quanti' } },
          {
            name: 'layout',
            type: 'select',
            default: 'band',
            label: { en: 'Layout', it: 'Impaginazione' },
            options: [
              { value: 'band', label: { en: 'Colored band with logo and button', it: 'Fascia colorata con logo e pulsante' } },
              { value: 'list', label: { en: 'List of players', it: 'Elenco di player' } },
            ],
          },
          { name: 'logo', type: 'media', label: { en: 'Logo (band)', it: 'Logo (fascia)' } },
          { name: 'title', type: 'text', maxLength: 120, label: { en: 'Title (band)', it: 'Titolo (fascia)' } },
          { name: 'buttonLabel', type: 'text', maxLength: 60, label: { en: 'Button label (band)', it: 'Testo del pulsante (fascia)' } },
          { name: 'buttonUrl', type: 'text', maxLength: 300, label: { en: 'Button address (band)', it: 'Indirizzo del pulsante (fascia)' } },
        ],
        async load(attrs, context) {
          context.tag('type:article');
          const data = await load(ctx, attrs, context, attrs.count ?? 1);
          return data;
        },
        render({ attrs, data, context }) {
          if (!data) return null;
          const field = str(attrs.field) || 'embed_spotify';
          const items = data.entries
            .map((e) => ({ e, player: playerOf(e.fields?.[field]) }))
            .filter((x) => x.player);
          const list = (
            <div className="tc-band-list">
              {items.map(({ e, player }) => (
                <article key={e.id} className="tc-embed-item">
                  <iframe src={player!.src} title={player!.title || e.title} height={player!.height} width="100%" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" style={{ height: `${player!.height}px` }} />
                  <header className="tc-embed-meta">
                    {e.publishedAt && <span>{formatDate(e.publishedAt, attrs.dateFormat || 'j F Y', data.locale, data.timezone)} / </span>}
                    <a href={e.url}>{e.title}</a>
                  </header>
                </article>
              ))}
            </div>
          );
          if (attrs.layout === 'list') return list;
          const logo = attrs.logo ? context.media.get(attrs.logo) : undefined;
          const button = safeHref(attrs.buttonUrl);
          return (
            <section className="tc-band">
              <div className="tc-band-header">
                {logo && <img className="tc-band-logo" src={logo.url} alt={logo.alt || ''} />}
                {str(attrs.title) && <h1 className="tc-band-title">{str(attrs.title)}</h1>}
              </div>
              {list}
              {button && str(attrs.buttonLabel) && (
                <a className="tc-button tc-button-primary tc-band-button" href={button}>
                  {str(attrs.buttonLabel)}
                </a>
              )}
            </section>
          );
        },
      }),
    );
  },
});
