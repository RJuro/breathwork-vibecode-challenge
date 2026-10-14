#!/usr/bin/env node
// A yoga practice step by step from the practitioner's side: the pose and side after every move,
// the breath it's on, what Leo says, and the checks (every move follows from the state, breath
// alternates, sides even, wrist breaks, savasana long enough). Exits 1 on any problem.
//   node scripts/yoga_check.mjs [--quiet] [--full | --quiet-voice]   (talk level; Guided by default)
import { existsSync, readFileSync } from 'node:fs';
import { FLOWS } from '../js/flows/index.js';
import { compile } from '../js/engine.js';
import { build, check } from '../js/yoga.js';
import { PROGRAMS } from '../js/flows/yoga.js';

const quiet = process.argv.includes('--quiet');
const f = new URL('../audio/cues-leo/manifest.json', import.meta.url);
const durs = existsSync(f) ? Object.fromEntries(Object.entries(JSON.parse(readFileSync(f))).map(([k, v]) => [k, v.duration])) : {};
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, '0')}`;
let bad = 0;
for (const [id, program] of Object.entries(PROGRAMS)) {
  const talk = process.argv.includes('--full') ? 'full' : process.argv.includes('--quiet-voice') ? 'quiet' : 'guided';
  const built = build(program, durs, talk);
  const { problems, sides, wrists } = check(built);
  const plan = compile(FLOWS.find((x) => x.id === id), durs, { talk });
  console.log(`\n=== ${id} · ${talk} · ${fmt(plan.total)} · right ${fmt(sides.R)} / left ${fmt(sides.L)} · wrists ${fmt(wrists.total)} (longest ${fmt(wrists.longest)})`);
  if (!quiet) {
    let t = 0;
    for (const s of built.trace) {
      const what = s.kind === 'move' ? `${s.breath.padEnd(3)} ${s.text}` : s.kind === 'hold' ? `    stay ${Math.round(s.dur)} s${s.lines.length ? ' · ' + s.lines.join(', ') : ''}` : `    ${s.kind}: ${s.text || ''}`;
      console.log(`${fmt(t).padStart(5)}  ${(s.pose + (s.side ? ' ' + s.side : '')).padEnd(20)} ${what}`);
      t += s.dur;
    }
  }
  for (const p of problems) console.log('  ✗ ' + p);
  bad += problems.length;
}
process.exit(bad ? 1 : 0);
