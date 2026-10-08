#!/usr/bin/env node
// Timing report with the recorded cue lengths: total per practice × intensity, any line
// pushed late by the one before it, and any line still running when its segment ends.
//   node scripts/check_timing.mjs [--pack gemini]   (another voice pack: only the practices it fully covers)
import { readFileSync } from 'node:fs';
import { FLOWS, INTENSITY, intensitiesOf } from '../js/flows/index.js';
import { compile } from '../js/engine.js';

const pack = process.argv.includes('--pack') ? process.argv[process.argv.indexOf('--pack') + 1] : 'tom';
const man = JSON.parse(readFileSync(new URL(`../audio/${pack === 'tom' ? 'cues' : `cues-${pack}`}/manifest.json`, import.meta.url)));
const durs = Object.fromEntries(Object.entries(man).map(([k, v]) => [k, v.duration]));
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
let problems = 0;
for (const flow of FLOWS) {
  if (pack !== 'tom' && !intensitiesOf(flow).every((l) => compile(flow, durs, { ...INTENSITY[l], talk: 'full' }).voice.every((v) => durs[v.id]))) continue;
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
