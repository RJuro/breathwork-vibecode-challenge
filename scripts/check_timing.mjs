#!/usr/bin/env node
// Timing report with the recorded cue lengths, each practice in its own instructor's pack:
// total per practice × intensity × talk level, any unrecorded line, any line pushed late by
// the one before it, and any line still running when its segment ends.
//   node scripts/check_timing.mjs [--flow box]
import { existsSync, readFileSync } from 'node:fs';
import { FLOWS, INTENSITY, intensitiesOf } from '../js/flows/index.js';
import { compile } from '../js/engine.js';

const only = process.argv.includes('--flow') ? process.argv[process.argv.indexOf('--flow') + 1] : null;
const pack = (voice) => {
  const f = new URL(`../audio/cues-${voice}/manifest.json`, import.meta.url);
  return existsSync(f) ? Object.fromEntries(Object.entries(JSON.parse(readFileSync(f))).map(([k, v]) => [k, v.duration])) : {};
};
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
let problems = 0;
for (const flow of FLOWS) {
  if (only && flow.id !== only) continue;
  const durs = pack(flow.voice);
  for (const [level, talk] of intensitiesOf(flow).flatMap((l) => ['quiet', 'guided', 'full'].map((t) => [l, t]))) {
    const plan = compile(flow, durs, { ...INTENSITY[level], talk });
    const issues = [];
    for (const v of plan.voice) {
      if (!durs[v.id]) issues.push(`unrecorded ${v.id}`);
      if (v.late > 0.3) issues.push(`late ${v.late.toFixed(1)}s ${v.id}`);
      const seg = plan.segs.find((s) => v.t >= s.start && v.t < s.end);
      if (seg && seg.kind !== 'talk' && v.t + v.dur > seg.end + 0.6) issues.push(`spills ${(v.t + v.dur - seg.end).toFixed(1)}s past ${seg.kind} ${v.id}`);
    }
    problems += issues.length;
    console.log(`${flow.id.padEnd(12)} ${level.padEnd(9)} ${talk.padEnd(6)} ${fmt(plan.total)}${issues.length ? '\n    ' + issues.join('\n    ') : ''}`);
  }
}
process.exit(problems ? 1 : 0);
