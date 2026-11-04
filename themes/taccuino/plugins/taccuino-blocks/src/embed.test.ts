import { describe, expect, it } from 'vitest';
import { playerOf } from './embed';
import { formatDate, trimWords, withYear } from './format';

describe('players of a field', () => {
  it('reads the Spotify iframe of an episode', () => {
    const p = playerOf('<iframe src="https://open.spotify.com/embed-podcast/episode/4rOoJ6Egrf8K2IrywzwOMk" width="100%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>');
    expect(p).toEqual({ src: 'https://open.spotify.com/embed-podcast/episode/4rOoJ6Egrf8K2IrywzwOMk', height: 232, title: '' });
  });
  it('refuses other sites and scripts', () => {
    expect(playerOf('<iframe src="https://evil.example/x"></iframe>')).toBeNull();
    expect(playerOf('<script>alert(1)</script>')).toBeNull();
    expect(playerOf('')).toBeNull();
    expect(playerOf('https://open.spotify.com/embed/episode/1')?.height).toBe(152);
  });
});

describe('formats', () => {
  it('writes dates as WordPress', () => {
    expect(formatDate('2024-05-17T10:00:00Z', 'F j, Y', 'it', 'Europe/Rome')).toBe('Maggio 17, 2024');
    expect(formatDate('2020-05-24T23:30:00Z', 'j F Y', 'it', 'Europe/Rome')).toBe('25 maggio 2020');
    expect(formatDate('2020-05-24T23:30:00Z', 'd/m/Y', 'en', 'UTC')).toBe('24/05/2020');
  });
  it('cuts excerpts', () => {
    expect(trimWords('uno due tre quattro', 2)).toBe('uno due…');
    expect(trimWords('uno due [&hellip;]', 5)).toBe('uno due…');
    expect(trimWords('uno due', 5)).toBe('uno due');
    expect(withYear('© {year} X', 2026)).toBe('© 2026 X');
  });
});
