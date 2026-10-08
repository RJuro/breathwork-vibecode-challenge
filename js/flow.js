// "Turn the Tide": a 15-minute flow shaped like Dylan Werner's breath-sequence wave
// (warm-up → heat → retention → cool-down → check-in), adapted for the first day of
// a cold: nasal breathing throughout, spaced humming bookends for nasal nitric oxide,
// short kapalabhati bursts (he keeps fast-breathing rounds short to limit hypocapnia)
// and holds that lengthen round by round.
//
// Step types (see engine.js):
//   { say: cueId }                          speak, then continue
//   { rest: seconds }                       natural breathing
//   { pace: {inhale, holdIn, exhale, holdOut, hum}, count, style, cues: [{at|breath, id}] }
//   { hold: 'empty'|'full', seconds, cues: [{at|fromEnd, id}] }
// Any step can carry `bell: 'bell'|'low'` to ring as it starts.

const PUMP = { inhale: 0.42, exhale: 0.58, level: 0.6, inLevel: 0.12 };
const HUM = { inhale: 4, exhale: 9, holdOut: 3, hum: true };

const mmss = (s) => (s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : `${s}s`);

function holdsWhat(segs) {
  const out = segs.find((s) => s.kind === 'hold' && s.type === 'empty');
  const inn = segs.find((s) => s.kind === 'hold' && s.type === 'full');
  return `${mmss(out.target)} hold out · ${mmss(inn.target)} hold in`;
}

function round(n, o) {
  const tail = (fullCues, after) => [
    { pace: { inhale: 4 }, count: 1, style: 'slow', bell: 'low', cues: [{ at: 0, id: 'inhale_top' }] },
    { hold: 'full', seconds: o.full, tick: false, cues: fullCues },
    { say: 'release' },
    ...after,
  ];
  const settle = { pace: { inhale: 4, exhale: 6 }, count: 1, style: 'slow', cues: [{ at: 0, id: 'deep_in' }, { at: 4, id: 'all_out' }] };
  return {
    id: `round${n}`,
    title: `Round ${n}`,
    color: '#ff9b6a',
    what: (segs) => `${o.pumps} kapalabhati · ${holdsWhat(segs)}`,
    gentleWhat: (segs) => `5 slow breaths · ${holdsWhat(segs)}`,
    steps: [
      { say: o.intro, bell: 'bell' },
      { pace: PUMP, count: o.pumps, style: 'pump', cues: [{ breath: o.pumps - 5, id: 'pump_last' }] },
      settle,
      { hold: 'empty', seconds: o.hold, round: n, cues: [{ at: 0.3, id: 'hold_empty' }, ...o.holdCues] },
      ...tail(o.fullCues, o.after),
    ],
    gentleSteps: [
      { say: o.gentleIntro, bell: 'bell' },
      { pace: { inhale: 4, exhale: 6 }, count: 5, style: 'count' },
      settle,
      { hold: 'empty', seconds: o.hold, round: n, cues: [{ at: 0.3, id: 'hold_empty' }, ...(o.gentleHoldCues || [])] },
      ...tail([{ at: 1, id: 'bandha_short' }], o.after),
    ],
  };
}

export const FLOW = {
  id: 'turn-the-tide',
  title: 'Turn the Tide',
  sections: [
    {
      id: 'arrive',
      title: 'Arrive',
      what: 'Nasal breathing, a lengthening ladder',
      color: '#8f9cf0',
      steps: [
        { say: 'welcome', bell: 'low', lead: 2.5 },
        { rest: 7 },
        { say: 'nose' },
        { rest: 9 },
        { say: 'ribs' },
        { rest: 11 },
        { say: 'ladder_intro' },
        { pace: { inhale: 4, exhale: 4 }, count: 2, style: 'count' },
        { pace: { inhale: 5, exhale: 5 }, count: 2, style: 'count', cues: [{ at: 0, id: 'ladder_up' }] },
        { pace: { inhale: 6, exhale: 6 }, count: 3, style: 'count', cues: [{ at: 0, id: 'ladder_up2' }] },
      ],
    },
    {
      id: 'hum',
      title: 'Hum',
      what: 'Bhramari, five long hums',
      color: '#b39cff',
      steps: [
        { say: 'hum_intro', bell: 'bell' },
        { pace: HUM, count: 5, style: 'hum' },
        { say: 'hum_science', lead: 1 },
        { say: 'hum_space', gap: 4 },
      ],
    },
    round(1, {
      pumps: 30,
      hold: 45,
      full: 20,
      intro: 'r1_intro',
      gentleIntro: 'g_intro',
      holdCues: [{ at: 12, id: 'r1_tingle' }],
      gentleHoldCues: [{ at: 12, id: 'r2_hunger' }],
      fullCues: [{ at: 1, id: 'bandha' }],
      after: [{ rest: 12 }],
    }),
    round(2, {
      pumps: 40,
      hold: 60,
      full: 25,
      intro: 'r2_intro',
      gentleIntro: 'g_intro',
      holdCues: [{ at: 20, id: 'r2_hunger' }],
      fullCues: [
        { at: 1, id: 'bandha_short' },
        { at: 7, id: 'full_science' },
      ],
      after: [{ say: 'kox', lead: 2 }],
    }),
    round(3, {
      pumps: 45,
      hold: 75,
      full: 30,
      intro: 'r3_intro',
      gentleIntro: 'r3_intro',
      holdCues: [{ at: 25, id: 'r3_still' }],
      gentleHoldCues: [{ at: 15, id: 'r3_still' }],
      fullCues: [{ at: 1, id: 'bandha_short' }],
      after: [{ rest: 12 }],
    }),
    {
      id: 'close',
      title: 'Cool down',
      what: 'Long exhales, three hums, stillness',
      color: '#7cc7c4',
      steps: [
        { say: 'cool_intro', bell: 'bell' },
        { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', cues: [{ breath: 2, id: 'cool_science' }] },
        { say: 'hum_again' },
        { pace: HUM, count: 3, style: 'hum' },
        { say: 'checkin', lead: 1 },
        { rest: 28 },
        { say: 'close', bell: 'low' },
        { rest: 6 },
      ],
    },
  ],
};
