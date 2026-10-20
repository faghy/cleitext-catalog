/**
 * PHP's `serialize()` format, read: WordPress customizer exports (`.dat`)
 * and `wp option get` without `--format=json` print settings this way.
 * Plain values and arrays; objects become plain objects of their
 * properties. String lengths count UTF-8 bytes, as PHP writes them.
 */
export type PhpValue = string | number | boolean | null | PhpValue[] | { [key: string]: PhpValue };

export function unserialize(text: string): PhpValue | undefined {
  const bytes = new TextEncoder().encode(text);
  const decoder = new TextDecoder();
  const str = (from: number, to: number) => decoder.decode(bytes.subarray(from, to));
  let at = 0;
  const fail = (): never => {
    throw new Error('not serialized');
  };
  const readUntil = (char: string): string => {
    const code = char.charCodeAt(0);
    const end = bytes.indexOf(code, at);
    if (end === -1) fail();
    const value = str(at, end);
    at = end + 1;
    return value;
  };
  const expect = (char: string) => {
    if (bytes[at] !== char.charCodeAt(0)) fail();
    at++;
  };
  const value = (): PhpValue => {
    const type = String.fromCharCode(bytes[at] ?? 0);
    at += 2; // type and colon (or semicolon for N)
    switch (type) {
      case 'N':
        return null;
      case 'b':
        return readUntil(';') === '1';
      case 'i':
      case 'd': {
        const n = Number(readUntil(';'));
        return Number.isFinite(n) ? n : 0;
      }
      case 's': {
        const length = Number(readUntil(':'));
        if (!Number.isInteger(length) || length < 0) fail();
        expect('"');
        const s = str(at, at + length);
        at += length;
        expect('"');
        expect(';');
        return s;
      }
      case 'a':
      case 'O': {
        if (type === 'O') {
          readUntil(':');
          expect('"');
          readUntil('"');
          expect(':');
        }
        const size = Number(readUntil(':'));
        expect('{');
        const entries: [string | number, PhpValue][] = [];
        for (let i = 0; i < size; i++) {
          const key = value();
          if (typeof key !== 'string' && typeof key !== 'number') fail();
          entries.push([key as string | number, value()]);
        }
        expect('}');
        if (entries.every(([key], i) => key === i)) return entries.map(([, v]) => v);
        return Object.fromEntries(entries.map(([key, v]) => [String(key), v]));
      }
      default:
        return fail();
    }
  };
  try {
    const result = value();
    return at === bytes.length ? result : undefined;
  } catch {
    return undefined;
  }
}
