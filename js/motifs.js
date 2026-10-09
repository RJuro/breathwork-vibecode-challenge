// Line motifs for the library tiles: one single-stroke drawing per practice (56×56),
// with a wash of colour offset behind it, like a two-colour print.

const M = {
  reps: { wash: '#f3c98f', at: [36, 20, 12], d: ['M14 16V42', 'M21 16V42', 'M28 16V42', 'M35 16V42', 'M9 36L41 22'] },
  box: { wash: '#9fb1c8', at: [36, 20, 12], rect: [12, 12, 32, 32, 2], d: ['M12 28H44', 'M28 12V44'] },
  'cool-down': { wash: '#8fcfb8', at: [20, 20, 12], d: ['M6 18C14 18 16 30 24 30S34 40 42 40H50', 'M6 46H50'] },
  land: { wash: '#b7a4ff', at: [38, 22, 11], circles: [[12, 36, 4]], d: ['M17 37C24 33 32 33 38 36S46 39 50 38', 'M6 44H50'] },
  tide: { wash: '#ffb38a', at: [38, 18, 13], d: ['M4 30C12 24 18 24 26 30S42 36 52 30', 'M4 39C12 33 18 33 26 39S42 45 52 39', 'M4 48C12 42 18 42 26 48S42 54 52 48'] },
  'clear-nose': { wash: '#62c2ae', at: [34, 22, 14], d: ['M12 46C12 20 44 20 44 46', 'M20 46C20 31 36 31 36 46'] },
};

/** The tile drawing for practice `id`, as an inline SVG string. */
export function motif(id) {
  const m = M[id] || M.reps;
  const [x, y, r] = m.at;
  let svg = `<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><circle class="wash" cx="${x}" cy="${y}" r="${r}" fill="${m.wash}"/>`;
  for (const [cx, cy, cr] of m.circles || []) svg += `<circle cx="${cx}" cy="${cy}" r="${cr}"/>`;
  if (m.rect) svg += `<rect x="${m.rect[0]}" y="${m.rect[1]}" width="${m.rect[2]}" height="${m.rect[3]}" rx="${m.rect[4]}"/>`;
  for (const d of m.d || []) svg += `<path d="${d}"/>`;
  return svg + '</svg>';
}

export const washOf = (id) => (M[id] || M.reps).wash;
