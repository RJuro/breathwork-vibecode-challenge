// Line motifs for the library tiles: one single-stroke drawing per practice (56×56),
// with a wash of colour offset behind it, like a two-colour print.

const M = {
  reps: { wash: '#f3c98f', at: [36, 20, 12], d: ['M14 16V42', 'M21 16V42', 'M28 16V42', 'M35 16V42', 'M9 36L41 22'] },
  box: { wash: '#9fb1c8', at: [36, 20, 12], rect: [12, 12, 32, 32, 2], d: ['M12 28H44', 'M28 12V44'] },
  'cool-down': { wash: '#8fcfb8', at: [20, 20, 12], d: ['M6 18C14 18 16 30 24 30S34 40 42 40H50', 'M6 46H50'] },
  land: { wash: '#b7a4ff', at: [38, 22, 11], circles: [[12, 36, 4]], d: ['M17 37C24 33 32 33 38 36S46 39 50 38', 'M6 44H50'] },
  tide: { wash: '#ffb38a', at: [38, 18, 13], d: ['M4 30C12 24 18 24 26 30S42 36 52 30', 'M4 39C12 33 18 33 26 39S42 45 52 39', 'M4 48C12 42 18 42 26 48S42 54 52 48'] },
  kumbhaka: { wash: '#a3a8e0', at: [22, 22, 12], d: ['M6 42L14 16H26L36 42H50'] },
  'hold-ladder': { wash: '#7da2ff', at: [36, 36, 13], d: ['M8 46H18V36H28V26H38V16H48'] },
  rounds: { wash: '#ff9e7a', at: [20, 34, 12], circles: [[14, 28, 6], [28, 28, 6], [42, 28, 6]], d: ['M6 44H50'] },
  alternate: { wash: '#b7a4ff', at: [35, 19, 12], circles: [[22, 30, 13], [34, 30, 13]] },
  'window-seat': { wash: '#ffd46b', at: [33, 19, 7], rect: [12, 6, 32, 44, 13], d: ['M12 34C20 29 26 33 31 30C36 27 40 29 44 28'] },
  ready: { wash: '#e2c49c', at: [34, 22, 12], d: ['M8 42H40', 'M32 34L40 42L32 50', 'M14 30V18'] },
  resonance: { wash: '#9fb6d8', at: [22, 20, 12], d: ['M4 30C10 18 16 18 22 30S34 42 40 30 48 18 52 26'] },
  'between-sets': { wash: '#8fcfb8', at: [36, 20, 11], rect: [20, 24, 16, 8, 2], d: ['M8 22V34', 'M14 20V36', 'M42 20V36', 'M48 22V34', 'M14 28H42'] },
  'lights-out': { wash: '#b7a4ff', at: [36, 20, 12], d: ['M30 12C20 16 18 34 30 42C18 44 8 34 10 24C12 16 20 11 30 12Z', 'M6 48H50'] },
  'breath-check': { wash: '#c9d0d6', at: [20, 22, 12], d: ['M10 40A18 18 0 0 1 46 40', 'M28 40L38 26'] },
  'breathe-light': { wash: '#8fbfae', at: [36, 34, 12], d: ['M10 28C16 24 22 24 28 28S40 32 46 28'] },
  steady: { wash: '#b3a8f0', at: [22, 34, 12], circles: [[12, 28, 2], [20, 28, 2], [28, 28, 2], [36, 28, 2], [44, 28, 2]] },
  'flow-15': { wash: '#b7a4ff', at: [34, 24, 12], d: ['M30 29C30 25 35 25 35 29S30 37 24 33 21 21 31 20 43 27 41 37 30 47 16 42', 'M6 49H50'] },
  'clear-nose': { wash: '#62c2ae', at: [34, 22, 14], d: ['M12 46C12 20 44 20 44 46', 'M20 46C20 31 36 31 36 46'] },
};

// A traced copy of one stroke, for the hover's travelling light (box: its outline as a path).
const TRACE = {
  box: 'M14 12H42Q44 12 44 14V42Q44 44 42 44H14Q12 44 12 42V14Q12 12 14 12Z',
  kumbhaka: 0,
  'hold-ladder': 0,
  resonance: 0,
  'cool-down': 0,
  'breathe-light': 0,
  'window-seat': 0,
};

/** The tile drawing for practice `id`, as an inline SVG string. Every stroke gets
 *  pathLength=1 and its index (class `n0`…, `--n`), so CSS can draw it in and animate it
 *  per practice (styles.css, "Tile motion"). */
export function motif(id) {
  const m = M[id] || M.reps;
  const [x, y, r] = m.at;
  let n = 0;
  const stroke = (tag, attrs) => `<${tag} ${attrs} class="n${n}" style="--n:${n++}" pathLength="1"/>`;
  let svg = `<svg class="m m-${id}" viewBox="0 0 56 56" aria-hidden="true" focusable="false"><circle class="wash" cx="${x}" cy="${y}" r="${r}" fill="${m.wash}"/>`;
  for (const [cx, cy, cr] of m.circles || []) svg += stroke('circle', `cx="${cx}" cy="${cy}" r="${cr}"`);
  if (m.rect) svg += stroke('rect', `x="${m.rect[0]}" y="${m.rect[1]}" width="${m.rect[2]}" height="${m.rect[3]}" rx="${m.rect[4]}"`);
  for (const d of m.d || []) svg += stroke('path', `d="${d}"`);
  const t = TRACE[id];
  if (t !== undefined) svg += `<path class="trace" d="${typeof t === 'number' ? m.d[t] : t}" pathLength="1"/>`;
  return svg + '</svg>';
}

export const washOf = (id) => (M[id] || M.reps).wash;
