/**
 * WordPress's `wpautop`, which the original theme runs on the texts of its
 * HTML elements and of the copyright: blank lines make paragraphs and single
 * line breaks `<br />`, around and between block tags (a `<div>` followed by
 * some lines of text gets its paragraphs too). The content of `<pre>` is kept
 * as it is, and line breaks inside script, style, svg and math stay.
 */

const BLOCKS =
  '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

const NL = ' <!-- wpnl --> ';

export function autop(content: string, br = true): string {
  if (!content.trim()) return '';
  let text = `${content}\n`;

  // <pre> blocks are put back unchanged at the end.
  const pres: string[] = [];
  if (text.includes('<pre')) {
    text = text.replace(/<pre[\s>][\s\S]*?<\/pre>/gi, (pre) => {
      pres.push(pre);
      return `<pre wp-pre-tag-${pres.length - 1}></pre>`;
    });
  }

  text = text.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '\n\n');
  // Space around the block tags.
  text = text.replace(new RegExp(`(<${BLOCKS}[\\s/>])`, 'gi'), '\n\n$1');
  text = text.replace(new RegExp(`(</${BLOCKS}>)`, 'gi'), '$1\n\n');
  text = text.replace(/<hr\s*?\/?>/gi, '<hr />\n\n');
  text = text.replace(/\r\n|\r/g, '\n');
  // Line breaks inside tags and comments are not paragraphs.
  text = text.replace(/<!--[\s\S]*?-->|<[^>]*>/g, (tag) => tag.replace(/\n/g, NL));

  // No paragraphs around options, object parameters and media sources.
  if (text.includes('<option')) {
    text = text.replace(/\s*<option/g, '<option').replace(/<\/option>\s*/g, '</option>');
  }
  if (text.includes('</object>')) {
    text = text
      .replace(/(<object[^>]*>)\s*/g, '$1')
      .replace(/\s*<\/object>/g, '</object>')
      .replace(/\s*(<\/?(?:param|embed)[^>]*>)\s*/g, '$1');
  }
  if (text.includes('<source') || text.includes('<track')) {
    text = text
      .replace(/([<[](?:audio|video)[^>\]]*[>\]])\s*/g, '$1')
      .replace(/\s*([<[]\/(?:audio|video)[>\]])/g, '$1')
      .replace(/\s*(<(?:source|track)[^>]*>)\s*/g, '$1');
  }
  if (text.includes('<figcaption')) {
    text = text
      .replace(/\s*(<figcaption[^>]*>)/g, '$1')
      .replace(/<\/figcaption>\s*/g, '</figcaption>');
  }

  text = text.replace(/\n\n+/g, '\n\n');
  text = text
    .split(/\n\s*\n/)
    .filter((part) => part !== '')
    .map((part) => `<p>${part.trim()}</p>\n`)
    .join('');

  text = text.replace(/<p>\s*<\/p>/g, '');
  text = text.replace(/<p>([^<]+)<\/(div|address|form)>/g, '<p>$1</p></$2>');
  text = text.replace(new RegExp(`<p>\\s*(</?${BLOCKS}[^>]*>)\\s*</p>`, 'gi'), '$1');
  text = text.replace(/<p>(<li.+?)<\/p>/g, '$1');
  text = text.replace(/<p><blockquote([^>]*)>/gi, '<blockquote$1><p>');
  text = text.replace(/<\/blockquote><\/p>/g, '</p></blockquote>');
  text = text.replace(new RegExp(`<p>\\s*(</?${BLOCKS}[^>]*>)`, 'gi'), '$1');
  text = text.replace(new RegExp(`(</?${BLOCKS}[^>]*>)\\s*</p>`, 'gi'), '$1');

  if (br) {
    text = text.replace(/<(script|style|svg|math)[^>]*>[\s\S]*?<\/\1>/gi, (m) =>
      m.replace(/\n/g, '<WPPreserveNewline />'),
    );
    text = text.replace(/<br>|<br\/>/gi, '<br />');
    text = text.replace(/(?<!<br \/>)\s*\n/g, '<br />\n');
    text = text.replace(/<WPPreserveNewline \/>/g, '\n');
  }

  text = text.replace(new RegExp(`(</?${BLOCKS}[^>]*>)\\s*<br />`, 'gi'), '$1');
  text = text.replace(/<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)/gi, '$1');
  text = text.replace(/\n<\/p>$/g, '</p>');

  if (pres.length)
    text = text.replace(/<pre wp-pre-tag-(\d+)><\/pre>/g, (_, i) => pres[Number(i)]!);
  return text.split(NL).join('\n');
}
