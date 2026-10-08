#!/usr/bin/env node
// Collects every spoken line from every practice, at every intensity (explanations on), into
// flow/cues.json, the list scripts/generate_cues.py renders with TTS.
//   node scripts/export_cues.mjs [--check]   (--check: fail if cues.json is stale)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { FLOWS, INTENSITY, intensitiesOf } from '../js/flows/index.js';
import { compile } from '../js/engine.js';
import { teacherTalk } from '../js/flows/talk.js';

const out = fileURLToPath(new URL('../flow/cues.json', import.meta.url));
const lines = {};
for (const flow of FLOWS) {
  const plans = intensitiesOf(flow).map((level) => compile(flow, {}, { ...INTENSITY[level], talk: 'full' }));
  const talk = teacherTalk(flow);
  if (talk) plans.push(compile(talk, {}, { talk: 'full' }));
  for (const plan of plans) {
    for (const v of plan.voice) {
      const prev = lines[v.id];
      if (prev && prev.text !== v.text) throw new Error(`line id "${v.id}" has two texts:\n  ${prev.text}\n  ${v.text}`);
      lines[v.id] = { text: v.text, kind: v.kind };
    }
  }
}
const json = JSON.stringify(Object.fromEntries(Object.entries(lines).sort(([a], [b]) => a.localeCompare(b))), null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(out, 'utf8') !== json) {
    console.error('flow/cues.json is stale: run node scripts/export_cues.mjs');
    process.exit(1);
  }
} else {
  writeFileSync(out, json);
}
console.log(`${Object.keys(lines).length} spoken lines across ${FLOWS.length} practice(s)`);
