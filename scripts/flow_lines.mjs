#!/usr/bin/env node
// Prints the ids of every line one practice can speak (all intensities, all talk levels),
// for scripts/generate_cues_gemini.py.
//   node scripts/flow_lines.mjs tide

import { FLOWS, INTENSITY, intensitiesOf } from '../js/flows/index.js';
import { compile } from '../js/engine.js';

const flow = FLOWS.find((f) => f.id === process.argv[2]);
if (!flow) {
  console.error(`unknown practice "${process.argv[2]}"; one of: ${FLOWS.map((f) => f.id).join(', ')}`);
  process.exit(1);
}
const ids = new Set();
for (const level of intensitiesOf(flow)) for (const v of compile(flow, {}, { ...INTENSITY[level], talk: 'full' }).voice) ids.add(v.id);
console.log(JSON.stringify([...ids]));
