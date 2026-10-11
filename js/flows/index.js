// The practice library, grouped on screen by moment of the day (`flow.moment`). Every
// practice has its own instructor: Leo or Mira.
import { reps, land } from './sit.js';
import { box, coolDown } from './train.js';
import { tide, clearNose } from './weather.js';
import { kumbhaka, holdLadder, rounds, alternate, windowSeat } from './retain.js';
import { ready, betweenSets, resonance, lightsOut, breathCheck, breatheLight, steady } from './daily.js';
import { NOTES } from './notes.js';

export const FLOWS = [kumbhaka, holdLadder, rounds, alternate, reps, box, ready, resonance, betweenSets, coolDown, land, lightsOut, breathCheck, breatheLight, steady, tide, clearNose, windowSeat];
for (const f of FLOWS) f.notes = NOTES[f.id];

/** Shelf order and headers. */
export const MOMENTS = [
  { id: 'retention', title: 'Retention', sub: 'The long sessions, 15 to 25 minutes. The holds are the work.' },
  { id: 'morning', title: 'Morning', sub: 'Before the phone. Wake the attention up.' },
  { id: 'before', title: 'Before', sub: "Something's coming. Get level." },
  { id: 'after', title: 'Training', sub: 'Between sets, and after.' },
  { id: 'night', title: 'Night', sub: 'Lights low. Land.' },
  { id: 'light', title: 'Breathe light', sub: 'Less air, on purpose. Measure it, train it, use it when it spikes.' },
  { id: 'anytime', title: 'Under the weather', sub: 'Scratchy throat, blocked nose.' },
  { id: 'move', title: 'On the move', sub: 'A headache, and you’re stuck in a seat.' },
];

export const INTENSITY = {
  none: { holdScale: 0, gentle: true, noHolds: true },
  gentle: { holdScale: 0.6, gentle: true },
  standard: { holdScale: 1 },
  deeper: { holdScale: 1.3 },
};

/** Compile options for a level. Custom levels (a practice's own keys, e.g. Resonance's paces)
 *  have no INTENSITY entry and are read from `level`. */
export const optsOf = (level) => ({ ...INTENSITY[level], level });

/** The intensities a practice offers (its spoken lines differ per intensity). */
export const intensitiesOf = (flow) => (Array.isArray(flow.intensity) ? flow.intensity : flow.intensity ? ['gentle', 'standard', 'deeper'] : ['standard']);

export const LEVEL_NAMES = { none: 'No holds', gentle: 'Gentle', standard: 'Standard', deeper: 'Deeper' };
