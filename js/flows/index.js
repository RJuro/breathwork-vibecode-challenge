// The practice library, grouped on screen by moment of the day (`flow.moment`). Every
// practice has its own instructor: Leo or Mira.
import { reps, land } from './sit.js';
import { box, coolDown } from './train.js';
import { tide, clearNose } from './weather.js';
import { NOTES } from './notes.js';

export const FLOWS = [reps, box, coolDown, land, tide, clearNose];
for (const f of FLOWS) f.notes = NOTES[f.id];

/** Shelf order and headers. */
export const MOMENTS = [
  { id: 'morning', title: 'Morning', sub: 'Before the phone. Wake the attention up.' },
  { id: 'before', title: 'Before', sub: "Something's coming. Get level." },
  { id: 'after', title: 'After', sub: 'Done training. Bring it down.' },
  { id: 'night', title: 'Night', sub: 'Lights low. Land.' },
  { id: 'anytime', title: 'Under the weather', sub: 'Scratchy throat, blocked nose.' },
];

export const INTENSITY = {
  none: { holdScale: 0, gentle: true, noHolds: true },
  gentle: { holdScale: 0.6, gentle: true },
  standard: { holdScale: 1 },
  deeper: { holdScale: 1.3 },
};

/** The intensities a practice offers (its spoken lines differ per intensity). */
export const intensitiesOf = (flow) => (Array.isArray(flow.intensity) ? flow.intensity : flow.intensity ? ['gentle', 'standard', 'deeper'] : ['standard']);

export const LEVEL_NAMES = { none: 'No holds', gentle: 'Gentle', standard: 'Standard', deeper: 'Deeper' };
