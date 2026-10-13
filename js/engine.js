// Compiles a practice definition (js/flows/*.js) into an absolute timeline, and answers
// "what should the screen show at time t?" for the session view.

const WORDS_PER_SEC = 2.3; // estimate for lines that have no audio yet

/** A line's text without its voice tags (`<sigh>`, `<short pause>`): what captions show and on-device speech reads. */
export const plain = (text) => text.replace(/\s*<[^>]+>\s*/g, ' ').replace(/\s+/g, ' ').trim();

export function estimateDur(text) {
  return text.split(/\s+/).length / WORDS_PER_SEC + 0.4;
}

/**
 * @param flow   practice: { sections: [...] | (opts) => [...] }
 * @param durs   line id -> seconds (decoded audio length, or undefined)
 * @param opts   { holdScale, gentle } for the chosen intensity
 */
export function compile(flow, durs = {}, opts = {}) {
  const defs = typeof flow.sections === 'function' ? flow.sections(opts) : flow.sections;
  const segs = [];
  const voice = [];
  const sounds = [];
  let t = 0;

  // How much the coach says: quiet = instructions and counts; guided (default) adds the
  // teacher's tips; full adds the science.
  const talk = opts.talk || (opts.explain ? 'full' : 'guided');
  const skip = (c) => (c.kind === 'science' && talk !== 'full') || (c.kind === 'tip' && talk === 'quiet');
  const speak = (c, at) => {
    if (!c || !c.id || !c.text) throw new Error(`bad spoken line: ${JSON.stringify(c)}`);
    if (skip(c)) return 0;
    const d = durs[c.id] ?? estimateDur(plain(c.text));
    // `tts` keeps the voice tags for the recording scripts; `text` is what the listener reads.
    voice.push({ id: c.id, t: at, dur: d, text: plain(c.text), tts: c.text, kind: c.kind || 'guide' });
    return d;
  };
  const lineDur = (c) => durs[c.id] ?? estimateDur(plain(c.text));

  // Spoken phase calls ("Breathe in." "Hold." "Out.") on every breath of a paced step, for eyes-closed
  // practice; `calls(phase, breath)` gives the line or null. The step's other cues go into the first gap
  // between calls that holds them (within two breaths). A cue too long for any gap starts right after a
  // call and silences the fewest calls it can (in and out weigh most: they matter most with eyes
  // closed, the start of a breath above all). Count lines ("Last one.") never move.
  const placeWithCalls = (cues, phases, calls, end, cycle) => {
    const list = phases.map((ph) => ({ t: ph.start, c: calls(ph.phase, ph.breath), w: { in: 2.5, out: 2 }[ph.phase] ?? 1 })).filter((k) => k.c);
    const taken = [];
    const free = (a, b) => !taken.some(([x, y]) => a < y && b > x);
    const callsIn = (a, b) => list.filter((k) => !k.off && k.t >= a && k.t < b);
    const cost = (a, b) => callsIn(a, b).reduce((n, k) => n + k.w, 0);
    for (const x of cues.sort((p, q) => p.t - q.t)) {
      const d = lineDur(x.c) + 0.4;
      const tries = [x.t, ...list.filter((k) => k.t >= x.t - 0.01).map((k) => k.t + lineDur(k.c) + 0.3)].filter((w) => w >= x.t && w - x.t <= 2 * cycle && w + d <= end + 0.5 && free(w, w + d));
      let at = x.t;
      if (x.c.kind !== 'count' && tries.length) {
        at = tries.find((w) => !cost(w - 0.2, w + d)) ?? tries.reduce((best, w) => (cost(w - 0.2, w + d) < cost(best - 0.2, best + d) ? w : best));
      }
      for (const k of callsIn(at - 0.2, at + d)) k.off = true;
      taken.push([at, at + d]);
      speak(x.c, at);
    }
    for (const k of list) if (!k.off) speak(k.c, k.t);
  };

  for (const section of defs) {
    for (const step of section.steps) {
      const start = t;
      const base = { section: section.id, start };

      if (step.bell) sounds.push({ t, type: step.bell });

      if (step.say && skip(step.say)) {
        // A skipped explanation leaves `min` seconds of easy breathing in its place.
        if (step.min) {
          t += step.min;
          segs.push({ ...base, kind: 'rest', end: t, group: step.group });
        }
      } else if (step.say) {
        const d = speak(step.say, t + (step.lead ?? 0.3));
        t += (step.lead ?? 0.3) + d + (step.gap ?? 1.5);
        segs.push({ ...base, kind: 'talk', end: t, group: step.group });
      } else if (step.rest) {
        for (const c of step.cues || []) speak(c.say, start + c.at);
        t += step.rest;
        segs.push({ ...base, kind: 'rest', end: t, label: step.label, group: step.group });
      } else if (step.pace) {
        const p = step.pace;
        const phases = [];
        const breathStarts = [];
        for (let i = 0; i < step.count; i++) {
          breathStarts.push(t);
          const last = i === step.count - 1;
          const parts = [
            ['in', p.inhale],
            ['in2', p.inhale2 || 0],
            ['top', p.holdIn || 0],
            [p.hum ? 'hum' : 'out', last && step.lastExhale ? step.lastExhale : p.exhale],
            ['bottom', last ? 0 : p.holdOut || 0],
          ];
          for (const [phase, d] of parts) {
            if (!d) continue;
            const label = step.labels ? step.labels(phase, i) : undefined;
            phases.push({ phase, start: t, end: t + d, breath: i, label, split: !!p.inhale2 });
            const pan = step.pan ? step.pan(phase, i) : 0; // -1 left … 1 right (headphones)
            if (phase === 'in' || phase === 'in2' || phase === 'out') {
              const level = phase === 'out' ? p.level ?? 0.5 : p.inLevel ?? p.level ?? 0.5;
              sounds.push({ t, dur: d, type: phase === 'out' ? 'out' : 'in', level, pan });
            } else if (phase === 'hum') {
              sounds.push({ t, dur: d, type: 'hum', pan });
            }
            t += d;
          }
        }
        const cues = (step.cues || [])
          .map((c) => ({ c: c.say, t: (c.breath != null ? breathStarts[Math.min(c.breath, step.count - 1)] : start + c.at) + (c.offset || 0) }))
          .filter((x) => !skip(x.c));
        if (!step.calls) for (const x of cues) speak(x.c, x.t);
        else placeWithCalls(cues, phases, step.calls, t, step.count > 1 ? breathStarts[1] - breathStarts[0] : t - start);
        segs.push({ ...base, kind: 'pace', end: t, phases, style: step.style || 'slow', count: step.count, label: step.label, group: step.group });
      } else if (step.hold) {
        const target = Math.round(step.seconds);
        const end = t + target;
        for (const c of step.cues || []) {
          const at = c.fromEnd != null ? end - c.fromEnd : start + c.at;
          // Drop mid-hold lines that would crowd a short hold.
          if (skip(c.say) || at < start || at + lineDur(c.say) > end - 1.5) continue;
          speak(c.say, at);
        }
        if (step.tick ?? target >= 30) sounds.push({ t: end - 10, type: 'tick' });
        t = end;
        segs.push({ ...base, kind: 'hold', type: step.hold, end, target, record: !!step.record, label: step.label, group: step.group });
      }
    }
  }

  // Nudge any overlapping lines apart (practices are written with room to spare; this
  // only absorbs small duration drift between estimates and recordings).
  voice.sort((a, b) => a.t - b.t);
  for (let i = 1; i < voice.length; i++) {
    const prevEnd = voice[i - 1].t + voice[i - 1].dur + 0.4;
    if (voice[i].t < prevEnd) {
      voice[i].late = prevEnd - voice[i].t; // diagnostics: scripts/check_timing.mjs
      if (voice[i].late > 1.5) console.warn('cue overlap', voice[i - 1].id, voice[i].id);
      voice[i].t = prevEnd;
    }
  }

  const sections = defs.map((s) => {
    const own = segs.filter((g) => g.section === s.id);
    return { id: s.id, title: s.title, what: s.what, color: s.color, start: own[0].start, end: own[own.length - 1].end };
  });

  return { segs, voice, sounds, sections, total: t };
}

/** End of the retention block a hold belongs to: "Breathe now" skips the rest of it
 *  (e.g. an empty hold and the recovery hold after it) straight to normal breathing. */
export function exitOf(plan, seg) {
  const i = plan.segs.indexOf(seg);
  let end = seg.end;
  if (seg.group) for (let j = i + 1; j < plan.segs.length && plan.segs[j].group === seg.group; j++) end = plan.segs[j].end;
  return end;
}

/** Guided hold time per recorded hold, from the timeline alone (no reliance on screen
 *  frames, which stop in background tabs). `skips` are [from, to] jumps made with
 *  "Breathe now"; `endT` is where playback stopped. */
export function holdResults(plan, skips, endT, all = false) {
  const out = [];
  for (const s of plan.segs) {
    if (s.kind !== 'hold' || (!s.record && !all) || s.start >= endT) continue;
    if (skips.some(([from, to]) => from < s.start && to >= s.end)) continue; // jumped over entirely
    const jump = skips.find(([from]) => from >= s.start && from < s.end);
    out.push(Math.max(0, Math.min(jump ? jump[0] : s.end, endT) - s.start));
  }
  return out;
}

/** Seconds spent holding the breath: every hold step as it was actually held, plus the held
 *  phases (top, bottom) of paced breathing, up to `endT`. */
export function retention(plan, skips, endT) {
  let s = holdResults(plan, skips, endT, true).reduce((a, b) => a + b, 0);
  for (const g of plan.segs) {
    if (g.kind !== 'pace' || g.start >= endT) continue;
    for (const p of g.phases) {
      if ((p.phase !== 'top' && p.phase !== 'bottom') || p.start >= endT) continue;
      if (skips.some(([a, b]) => p.start >= a && p.start < b)) continue; // skipped over
      s += Math.min(p.end, endT) - p.start;
    }
  }
  return s;
}

const ease = (x) => 0.5 - Math.cos(Math.PI * Math.min(1, Math.max(0, x))) / 2;
const LO = 0.46;
const HI = 1;

/** Visual state at time t (seconds into the session). */
export function stateAt(plan, t) {
  const segs = plan.segs;
  let seg = segs[segs.length - 1];
  for (const s of segs) {
    if (t < s.end) {
      seg = s;
      break;
    }
  }
  const out = { seg, phase: 'rest', p: 0, scale: 0.62, label: '', sub: '' };

  if (seg.kind === 'pace') {
    let ph = seg.phases[seg.phases.length - 1];
    for (const x of seg.phases) {
      if (t < x.end) {
        ph = x;
        break;
      }
    }
    const p = Math.min(1, Math.max(0, (t - ph.start) / (ph.end - ph.start)));
    out.phase = ph.phase;
    out.p = p;
    out.breath = ph.breath + 1;
    const MID = LO + (HI - LO) * 0.8; // a split inhale (cyclic sigh) fills most of the way first
    if (ph.phase === 'in') out.scale = LO + ((ph.split ? MID : HI) - LO) * ease(p);
    else if (ph.phase === 'in2') out.scale = MID + (HI - MID) * ease(p);
    else if (ph.phase === 'out' || ph.phase === 'hum') out.scale = HI - (HI - LO) * ease(p);
    else out.scale = ph.phase === 'top' ? HI : LO;
    out.label = ph.label || { in: 'In', in2: 'Top up', out: 'Out', hum: 'Hum', top: 'Hold', bottom: 'Rest' }[ph.phase];
    if (ph.phase === 'in2') out.phase = 'in';
    if (seg.style === 'pump') {
      // Kapalabhati: a quick pulse around a steady size, not a full breath each second.
      out.phase = 'pump';
      out.label = seg.label || 'Kapalabhati';
      out.scale = 0.8 - 0.07 * Math.sin(Math.PI * (ph.phase === 'out' ? p : 0));
      out.sub = `${ph.breath + 1} / ${seg.count}`;
    } else if (seg.style === 'count') {
      out.sub = String(Math.max(1, Math.ceil(ph.end - t - 0.05)));
    } else if (seg.style === 'tally') {
      out.sub = `${ph.breath + 1} / ${seg.count}`;
    }
  } else if (seg.kind === 'hold') {
    const el = Math.max(0, t - seg.start);
    out.phase = seg.type === 'empty' ? 'empty' : 'full';
    out.p = Math.min(1, el / seg.target);
    out.elapsed = el;
    out.target = seg.target;
    out.scale = seg.type === 'empty' ? LO * 0.94 : HI * 1.02;
    out.label = seg.label || (seg.type === 'empty' ? 'Hold, empty' : 'Hold, full');
  } else {
    // Natural breathing: a slow, unforced drift (~5 s cycle).
    out.phase = 'rest';
    out.scale = 0.64 + 0.06 * Math.sin((t / 5.5) * Math.PI * 2);
    out.label = seg.label || ''; // a labelled rest (between holds) shows a countdown
  }
  return out;
}

/** Voice cue (for captions) active at t, with a short linger after it ends. */
export function captionAt(plan, t, linger = 2.2) {
  let cur = null;
  for (const v of plan.voice) {
    if (v.t > t) break;
    if (t <= v.t + v.dur + linger) cur = v;
  }
  return cur;
}
