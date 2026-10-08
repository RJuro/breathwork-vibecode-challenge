#!/usr/bin/env node
// Timing report with the recorded cue lengths: total per practice × intensity, any line
// pushed late by the one before it, and any line still running when its segment ends.
import { readFileSync } from 'node:fs';
import { FLOWS, INTENSITY, intensitiesOf } from '../js/flows/index.js';
import { compile } from '../js/engine.js';

const man = JSON.parse(readFileSync(new URL('../audio/cues/manifest.json', import.meta.url)));
const durs = Object.fromEntries(Object.entries(man).map(([k, v]) => [k, v.duration]));
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
let problems = 0;
for (const flow of FLOWS) {
  for (const [level, explain] of intensitiesOf(flow).flatMap((l) => [[l, false], [l, true]])) {
    const plan = compile(flow, durs, { ...INTENSITY[level], explain });
    const issues = [];
    for (const v of plan.voice) {
      if (!durs[v.id]) issues.push(`unrecorded ${v.id}`);
      if (v.late > 0.3) issues.push(`late ${v.late.toFixed(1)}s ${v.id}`);
      const seg = plan.segs.find((s) => v.t >= s.start && v.t < s.end);
      if (seg && seg.kind !== 'talk' && v.t + v.dur > seg.end + 0.6) issues.push(`spills ${(v.t + v.dur - seg.end).toFixed(1)}s past ${seg.kind} ${v.id}`);
    }
    problems += issues.length;
    console.log(`${flow.id.padEnd(12)} ${level.padEnd(9)} ${explain ? '+why' : '    '} ${fmt(plan.total)}${issues.length ? '\n    ' + issues.join('\n    ') : ''}`);
  }
}
process.exit(problems ? 1 : 0);
