#!/usr/bin/env node
// A practice as heard, for script review: every line with its time, the breath phase it lands in
// (and ends in), and its kind. Breath calls are folded into one line per paced step.
//   node scripts/session_script.mjs [flow] [--level standard] [--talk full]
import { existsSync, readFileSync } from 'node:fs';
import { FLOWS, optsOf, intensitiesOf } from '../js/flows/index.js';
import { compile, stateAt } from '../js/engine.js';

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const only = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : null;
const talk = arg('--talk', 'full');
const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;
const pack = (voice) => {
  const f = new URL(`../audio/cues-${voice}/manifest.json`, import.meta.url);
  return existsSync(f) ? Object.fromEntries(Object.entries(JSON.parse(readFileSync(f))).map(([k, v]) => [k, v.duration])) : {};
};
const where = (plan, t) => {
  const s = stateAt(plan, t);
  return s.seg.kind === 'pace' ? `${s.phase}${s.breath}` : s.seg.kind === 'hold' ? `HOLD-${s.phase}` : s.seg.kind;
};
for (const flow of FLOWS) {
  if (only && flow.id !== only) continue;
  for (const level of arg('--level') ? [arg('--level')] : intensitiesOf(flow)) {
    const plan = compile(flow, pack(flow.voice), { ...optsOf(level), talk });
    console.log(`\n=== ${flow.id} (${flow.voice}) · ${level} · ${talk} · ${fmt(plan.total)}`);
    for (const sec of plan.sections) {
      console.log(`--- ${sec.title || sec.id}`);
      for (const g of plan.segs.filter((x) => x.section === sec.id)) {
        const lines = plan.voice.filter((v) => v.t >= g.start - 0.01 && v.t < g.end - 0.01);
        let desc = `[${fmt(g.start)}–${fmt(g.end)}] ${g.kind}`;
        if (g.kind === 'pace') {
          const b = g.phases.filter((p) => p.breath === 0).map((p) => `${p.phase} ${+(p.end - p.start).toFixed(1)}`).join(', ');
          desc += ` ×${g.count} (${b})`;
        } else if (g.kind === 'hold') desc += ` ${g.type} ${g.target}s`;
        else if (g.label) desc += ` "${g.label}"`;
        console.log(desc);
        const calls = lines.filter((v) => v.kind === 'count' && g.kind === 'pace' && v.dur < 2.2 && /^(And |Breathe in|In through|Hold|Pause|Out|Let it out|Slowly out)/.test(v.text));
        if (calls.length) console.log(`        · ${calls.length} calls: ${[...new Set(calls.map((v) => v.text))].join(' / ')}`);
        for (const v of lines) {
          if (calls.includes(v)) continue;
          console.log(`  ${fmt(v.t)} ${where(plan, v.t + 0.05).padEnd(12)}→${where(plan, v.t + v.dur - 0.05).padEnd(12)} ${v.kind.padEnd(9)} ${v.id}: ${v.text}`);
        }
      }
    }
    if (plan.dropped.length) console.log(`!! repeats dropped: ${plan.dropped.join(', ')}`);
  }
}
