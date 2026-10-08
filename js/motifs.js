// Line motifs for the library tiles: one single-stroke drawing per practice (56×56),
// with a wash of colour offset behind it, like a two-colour print.

const M = {
  tide: { wash: '#ffb38a', at: [38, 18, 13], d: ['M4 30C12 24 18 24 26 30S42 36 52 30', 'M4 39C12 33 18 33 26 39S42 45 52 39', 'M4 48C12 42 18 42 26 48S42 54 52 48'] },
  'clear-nose': { wash: '#62c2ae', at: [34, 22, 14], d: ['M12 46C12 20 44 20 44 46', 'M20 46C20 31 36 31 36 46'] },
  'fire-wave': { wash: '#ff9e6b', at: [21, 34, 13], d: ['M28 50C15 46 15 31 26 22C26 30 32 31 32 24C41 31 43 46 28 50Z'] },
  'hold-ladder': { wash: '#7da2ff', at: [36, 36, 13], d: ['M8 46H18V36H28V26H38V16H48'] },
  resonance: { wash: '#8adbe0', at: [35, 21, 12], circles: [[27, 29, 7], [27, 29, 14], [27, 29, 21]] },
  sighing: { wash: '#ffd46b', at: [20, 22, 12], d: ['M6 42C10 28 14 28 17 34C19 20 25 17 29 21C37 29 43 39 50 42'] },
  balance: { wash: '#b7a4ff', at: [35, 19, 12], circles: [[22, 30, 13], [34, 30, 13]] },
  'window-seat': { wash: '#ffd46b', at: [33, 19, 7], rect: [12, 6, 32, 44, 13], d: ['M12 34C20 29 26 33 31 30C36 27 40 29 44 28'] },
  'wind-down': { wash: '#b7a4ff', at: [20, 34, 12], d: ['M34 8A20 20 0 1 0 48 40A15 15 0 1 1 34 8Z'] },
};

/** The tile drawing for practice `id`, as an inline SVG string. */
export function motif(id) {
  const m = M[id] || M.resonance;
  const [x, y, r] = m.at;
  let svg = `<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><circle class="wash" cx="${x}" cy="${y}" r="${r}" fill="${m.wash}"/>`;
  for (const [cx, cy, cr] of m.circles || []) svg += `<circle cx="${cx}" cy="${cy}" r="${cr}"/>`;
  if (m.rect) svg += `<rect x="${m.rect[0]}" y="${m.rect[1]}" width="${m.rect[2]}" height="${m.rect[3]}" rx="${m.rect[4]}"/>`;
  for (const d of m.d || []) svg += `<path d="${d}"/>`;
  return svg + '</svg>';
}

export const washOf = (id) => (M[id] || M.resonance).wash;
