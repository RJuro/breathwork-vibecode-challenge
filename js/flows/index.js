// The practice library, in display order (grouped on screen by `tag`).
import { tide } from './tide.js';
import { clearNose } from './clear.js';
import { fireWave, holdLadder } from './energy.js';
import { resonance, sighing, balance } from './calm.js';
import { windDown } from './sleep.js';
import { windowSeat } from './travel.js';

export const FLOWS = [resonance, sighing, balance, fireWave, holdLadder, tide, clearNose, windowSeat, windDown];

export const INTENSITY = {
  none: { holdScale: 0, gentle: true, noHolds: true },
  gentle: { holdScale: 0.6, gentle: true },
  standard: { holdScale: 1 },
  deeper: { holdScale: 1.3 },
};

/** The intensities a practice offers (its spoken lines differ per intensity). */
export const intensitiesOf = (flow) => (Array.isArray(flow.intensity) ? flow.intensity : flow.intensity ? ['gentle', 'standard', 'deeper'] : ['standard']);

export const LEVEL_NAMES = { none: 'No holds', gentle: 'Gentle', standard: 'Standard', deeper: 'Deeper' };
