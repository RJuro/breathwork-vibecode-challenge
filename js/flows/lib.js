// Shared building blocks for practices: spoken lines, number words, common steps.
//
// A spoken line is { id, text, kind }. `line()` names one explicitly (stable id, so its
// recorded audio survives edits elsewhere); `say()` derives the id from the text, which
// is how count announcements ("Hold, forty-five seconds.") get one clip per wording and
// are shared across practices. scripts/export_cues.mjs collects every line into
// flow/cues.json for the TTS step.
//
// Step types (engine.js):
//   { say: line }                                    speak, then continue
//   { rest: seconds, cues }                          natural breathing
//   { pace: {inhale, inhale2, holdIn, exhale, holdOut, hum}, count, style, cues, labels }
//   { hold: 'empty'|'full', seconds, cues, label, record }
// Cues inside a step: { at: s | breath: n | fromEnd: s, say: line }.
// Any step can carry `bell: 'bell'|'low'` to ring as it starts.

export const line = (id, text, kind = 'guide') => ({ id, text, kind });
/** A teacher's tip: spoken at the Guided and Full voice levels, skipped at Quiet. */
export const tip = (id, text) => line(id, text, 'tip');

const slug = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);
export const say = (text, kind = 'count') => ({ id: `n_${slug(text)}`, text, kind });

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
export function num(n) {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : '');
  return n === 100 ? 'one hundred' : String(n);
}
export const Num = (n) => num(n)[0].toUpperCase() + num(n).slice(1);

/** Spoken duration: 45 → "forty-five seconds", 60 → "one minute", 90 → "a minute and a half". */
export function dur(s) {
  if (s < 60) return `${num(s)} seconds`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (r === 0) return m === 1 ? 'one minute' : `${num(m)} minutes`;
  if (r === 30) return m === 1 ? 'a minute and a half' : `${num(m)} and a half minutes`;
  return `${m === 1 ? 'one minute' : `${num(m)} minutes`} ${num(r)}`;
}

/** Spoken time markers for long holds, for practising with eyes closed. */
export const milestones = (seconds) => [
  ...(seconds >= 55 ? [{ at: 30, say: say('Thirty seconds.') }] : []),
  ...(seconds >= 80 ? [{ at: 60, say: say('One minute.') }] : []),
];

/** Hold length for the chosen intensity, rounded to 5 s. */
export const scaled = (s, opts) => Math.max(10, Math.round((s * (opts.holdScale ?? 1)) / 5) * 5);

export const mmss = (s) => (s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}s`);

// Breath patterns
export const PUMP = { inhale: 0.42, exhale: 0.58, level: 0.6, inLevel: 0.12 };
export const HUM = { inhale: 4, exhale: 9, holdOut: 3, hum: true };

// Lines several practices share.
export const L = {
  pumpLast: line('pump_last', 'Last few.'),
  deepIn: line('deep_in', 'Now one deep breath in.'),
  allOut: line('all_out', 'And all the way out.'),
  release: line('release', 'And let it go. Breathe naturally.'),
  bandha: line('bandha', 'Gently lift the pelvic floor, and bring the chin slightly down. Hold the breath as if it\'s resting, not trapped.', 'technique'),
  bandhaShort: line('bandha_short', 'Root lock. Chin down. Stay soft.', 'technique'),
  tenMore: say('Ten more seconds.'),
  breatheNow: line('breathe_now_ok', "Hold only to the first strong urge. If it comes early, tap breathe now. There's nothing to prove.", 'technique'),
};

// The teacher's voice: short, invitational lines used sparingly across practices.
// Describe, don't prescribe; comfort over depth; always a way out.
export const T = {
  eyes: line('t_eyes', 'Close your eyes, or let your gaze rest softly on the floor.'),
  anchor: line('t_anchor', 'Notice where the breath is easiest to feel. Cool air in at the nostrils, slightly warmer air out.', 'technique'),
  comfort: line('t_comfort', "Breathe easily and comfortably, not deeply. There's no need to try hard.", 'technique'),
  wander: line('t_wander', "If your mind has wandered, that's what minds do. Noticing is the practice. Come back to the next breath."),
  holdGuide: line('t_hold_guide', 'Let go whenever you need to. The timer is a guide, not a test.'),
  firstBreath: line('t_first_breath', 'Keep that first breath calm. If it came as a gasp, make the next hold shorter.', 'technique'),
  bellyOnly: line('t_belly_only', 'Face and shoulders still. Only the belly moves.', 'technique'),
  slowerFine: line('t_slower_fine', 'Slower is fine. Rhythm matters more than speed.', 'technique'),
  letGo: line('t_let_go', 'Let go of the pattern. Let the body breathe itself.'),
  notice: line('t_notice', "Notice what's different, without needing anything to be different."),
  carry: line('t_carry', 'Let some movement come back into the hands. Open your eyes when it feels right, and take some of this steadiness with you.'),
};

/** A "Teacher's notes" block for a practice page: { before, mistakes: [[mistake, fix]], feel, progress, skip }. */
export function notesHtml(n) {
  const list = (items) => `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;
  return [
    n.before && `<h4>Before you start</h4>${list(n.before)}`,
    n.mistakes && `<h4>Common slips</h4><ul class="fixes">${n.mistakes.map(([m, f]) => `<li><span>${m}</span><em>${f}</em></li>`).join('')}</ul>`,
    n.feel && `<h4>What you might notice</h4>${list(n.feel)}`,
    n.progress && `<h4>Going further</h4>${list(n.progress)}`,
    n.skip && `<h4>Skip it or go gentle if…</h4>${list(n.skip)}`,
  ]
    .filter(Boolean)
    .join('');
}

/** Settle breath before an empty hold: deep in, all the way out. */
export const settle = () => ({
  pace: { inhale: 4, exhale: 6 },
  count: 1,
  style: 'slow',
  cues: [
    { at: 0, say: L.deepIn },
    { at: 4, say: L.allOut },
  ],
});

/** An empty-lung hold with its length announced, a "ten more seconds" call, and extra cues. */
export function holdEmpty(seconds, cues = [], o = {}) {
  // "Up to", not a target: after fast breathing an empty hold is where oxygen drops fastest.
  const announce = say(`Hold, lungs empty, for up to ${dur(seconds)}.`);
  return {
    hold: 'empty',
    seconds,
    record: true,
    tick: seconds < 40,
    ...o,
    cues: [{ at: 0.3, say: announce }, ...cues, ...milestones(seconds), ...(seconds >= 40 ? [{ fromEnd: 11, say: L.tenMore }] : [])],
  };
}

/** Inhale to the top, then a full hold with its length announced. */
export function holdFull(seconds, cues = [], o = {}) {
  return [
    {
      pace: { inhale: 4 },
      count: 1,
      style: 'slow',
      bell: 'low',
      group: o.group,
      cues: [{ at: 0, say: say(`Breathe in, all the way to the top, and hold. ${dur(seconds)[0].toUpperCase()}${dur(seconds).slice(1)}.`) }],
    },
    { hold: 'full', seconds, tick: false, ...o, cues: [...cues, ...milestones(seconds), ...(seconds >= 40 ? [{ fromEnd: 11, say: L.tenMore }] : [])] },
  ];
}

export const SAFETY_HTML = `
<h3>Safety</h3>
<ul>
  <li>Only seated or lying down. Never in or near water, in the bath, or while driving. Blackouts after fast breathing or long holds come without warning.</li>
  <li>If you are pregnant, or have epilepsy, heart disease, high blood pressure or a fever, skip fast breathing and breath holds altogether: choose Resonance, Cyclic Sighing or Alternate Nostril, or a <em>No holds</em> option. A shorter hold is not the same as a safe one. Ask your doctor if unsure.</li>
  <li>Stop whenever you like. If you feel dizzy or unwell, or the urge to breathe gets strong, breathe normally. <em>Breathe now</em> ends any hold.</li>
</ul>
<p class="muted">Not medical advice. These practices adapt traditional pranayama and published breathing methods; check with your doctor if you have a health condition.</p>`;

export const ev = {
  solid: '<span class="evidence solid">solid</span>',
  some: '<span class="evidence some">some evidence</span>',
  spec: '<span class="evidence spec">speculative</span>',
};
