// Compiles a flow definition (flow.js) into an absolute timeline, and answers
// "what should the screen show at time t?" for the session view.

const WORDS_PER_SEC = 2.3; // estimate for cues that have no audio yet

export function estimateDur(text) {
  return text.split(/\s+/).length / WORDS_PER_SEC + 0.4;
}

/**
 * @param flow   flow definition: { sections: [{ id, title, steps: [...] }] }
 * @param cues   id -> { text, kind? } (flow/cues.json)
 * @param durs   id -> seconds (decoded audio length, or undefined)
 * @param opts   { holdScale, gentle }
 */
export function compile(flow, cues, durs = {}, opts = {}) {
  const { holdScale = 1, gentle = false } = opts;
  const segs = [];
  const voice = [];
  const sounds = [];
  let t = 0;

  const dur = (id) => {
    if (!cues[id]) throw new Error(`unknown cue ${id}`);
    return durs[id] ?? estimateDur(cues[id].text);
  };
  const say = (id, at) => {
    const d = dur(id);
    voice.push({ id, t: at, dur: d, text: cues[id].text, kind: cues[id].kind || 'guide' });
    return d;
  };

  for (const section of flow.sections) {
    const steps = gentle && section.gentleSteps ? section.gentleSteps : section.steps;
    for (const step of steps) {
      const start = t;
      const base = { section: section.id, start };

      if (step.bell) sounds.push({ t, type: step.bell });

      if (step.say) {
        const d = say(step.say, t + (step.lead ?? 0.3));
        t += (step.lead ?? 0.3) + d + (step.gap ?? 1.5);
        segs.push({ ...base, kind: 'talk', end: t });
      } else if (step.rest) {
        t += step.rest;
        segs.push({ ...base, kind: 'rest', end: t, label: step.label });
      } else if (step.pace) {
        const p = step.pace;
        const phases = [];
        const breathStarts = [];
        for (let i = 0; i < step.count; i++) {
          breathStarts.push(t);
          const last = i === step.count - 1;
          const parts = [
            ['in', p.inhale],
            ['top', p.holdIn || 0],
            [p.hum ? 'hum' : 'out', last && step.lastExhale ? step.lastExhale : p.exhale],
            ['bottom', last ? 0 : p.holdOut || 0],
          ];
          for (const [phase, d] of parts) {
            if (!d) continue;
            phases.push({ phase, start: t, end: t + d, breath: i });
            if (phase === 'in' || phase === 'out') {
              const level = phase === 'in' ? p.inLevel ?? p.level ?? 0.5 : p.level ?? 0.5;
              sounds.push({ t, dur: d, type: phase, level });
            } else if (phase === 'hum') {
              sounds.push({ t, dur: d, type: 'hum' });
            }
            t += d;
          }
        }
        for (const c of step.cues || []) {
          const at = c.breath != null ? breathStarts[Math.min(c.breath, step.count - 1)] : start + c.at;
          say(c.id, at + (c.offset || 0));
        }
        segs.push({ ...base, kind: 'pace', end: t, phases, style: step.style || 'slow', count: step.count, label: step.label });
      } else if (step.hold) {
        const scaled = step.hold === 'empty' ? step.seconds * holdScale : step.seconds;
        const target = Math.round(scaled / 5) * 5;
        const end = t + target;
        for (const c of step.cues || []) {
          const at = c.fromEnd != null ? end - c.fromEnd : start + c.at;
          // Drop mid-hold cues that would crowd a shortened hold.
          if (at < start || at + dur(c.id) > end - 2) continue;
          say(c.id, at);
        }
        if (step.tick !== false && target >= 30) sounds.push({ t: end - 10, type: 'tick' });
        t = end;
        segs.push({ ...base, kind: 'hold', type: step.hold, end, target, round: step.round, label: step.label });
      }
    }
  }

  // Nudge any overlapping voice cues apart (never across a segment boundary we care about:
  // flows are written with room to spare, this only absorbs small duration drift).
  voice.sort((a, b) => a.t - b.t);
  for (let i = 1; i < voice.length; i++) {
    const prevEnd = voice[i - 1].t + voice[i - 1].dur + 0.4;
    if (voice[i].t < prevEnd) {
      if (prevEnd - voice[i].t > 1.5) console.warn('cue overlap', voice[i - 1].id, voice[i].id);
      voice[i].t = prevEnd;
    }
  }

  const sections = flow.sections.map((s) => {
    const own = segs.filter((g) => g.section === s.id);
    return { id: s.id, title: s.title, start: own[0].start, end: own[own.length - 1].end };
  });

  return { segs, voice, sounds, sections, total: t };
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
    if (ph.phase === 'in') out.scale = LO + (HI - LO) * ease(p);
    else if (ph.phase === 'out' || ph.phase === 'hum') out.scale = HI - (HI - LO) * ease(p);
    else out.scale = ph.phase === 'top' ? HI : LO;
    out.label = { in: 'In', out: 'Out', hum: 'Hum', top: 'Hold', bottom: 'Rest' }[ph.phase];
    if (seg.style === 'pump') {
      // Kapalabhati: a quick pulse around a steady size, not a full breath each second.
      out.phase = 'pump';
      out.label = 'Kapalabhati';
      out.scale = 0.8 - 0.07 * Math.sin(Math.PI * (ph.phase === 'out' ? p : 0));
      out.sub = `${ph.breath + 1} / ${seg.count}`;
    } else if (seg.style === 'count') {
      out.sub = String(Math.max(1, Math.ceil(ph.end - t - 0.05)));
    }
  } else if (seg.kind === 'hold') {
    const el = Math.max(0, t - seg.start);
    out.phase = seg.type === 'empty' ? 'empty' : 'full';
    out.p = Math.min(1, el / seg.target);
    out.elapsed = el;
    out.target = seg.target;
    out.scale = seg.type === 'empty' ? LO * 0.94 : HI * 1.02;
    out.label = seg.type === 'empty' ? 'Hold — empty' : 'Hold — full';
  } else {
    // Natural breathing: a slow, unforced drift (~5 s cycle).
    out.phase = 'rest';
    out.scale = 0.64 + 0.06 * Math.sin((t / 5.5) * Math.PI * 2);
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
