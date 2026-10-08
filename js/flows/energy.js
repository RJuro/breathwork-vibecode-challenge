// Energy & long holds: a breath-of-fire wave with full-lung holds, and a dry CO2 table.

import { line, say, L, Num, num, dur, mmss, scaled, holdFull, SAFETY_HTML, ev } from './lib.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

// ── Fire Wave ──────────────────────────────────────────
const BOF = { inhale: 0.2, exhale: 0.25, level: 0.45, inLevel: 0.15 };
const F = {
  welcome: line('fw_welcome', 'Welcome. This one builds heat. Sit tall, spine long, and breathe through the nose.'),
  ujjayi: line('fw_ujjayi', 'Ujjayi breath: a soft hiss at the back of the throat, like fogging a mirror with your mouth closed.', 'technique'),
  four: say('Four in, four out.'),
  five: say('Five in, five out.'),
  six: say('Six in, six out.'),
  r1: line('fw_r1', 'Round one. Breath of fire. Quick, light breaths through the nose, two or three a second. Belly soft, shoulders still. Keep each breath small.', 'technique'),
  r2: line('fw_r2', 'Round two. A few more breaths, and a longer hold.'),
  r3: line('fw_r3', 'Last round. The longest hold. Stay soft inside it.'),
  urge: line('fw_urge', 'Lock and hold only until the first clear urge. Let the energy settle.', 'technique'),
  buzz: line('fw_buzz', 'If you feel dizzy, slow down, or stop and breathe normally.'),
  adrenaline: line('fw_adrenaline', 'In small studies, breathing like this raised adrenaline. Claims about the immune system are still early.', 'science'),
  rest: line('fw_rest', 'Breathe easy. Let your heart rate settle before the next round.'),
  cool: say('Six slow breaths. In for four, out for six.'),
  close: line('fw_close', "That's your practice. Notice the warmth, and the clear head. Take it into your day."),
};

function fireRound(n, o, opts) {
  const breaths = opts.gentle ? o.gentleBreaths : o.breaths;
  const hold = scaled(o.hold, opts);
  return {
    id: `fire-${n}`,
    title: `Round ${n}`,
    what: `${breaths} breaths of fire · ${mmss(hold)} hold in`,
    color: '#f08a5d',
    steps: [
      { say: o.intro, bell: 'bell' },
      { say: say(`${Num(breaths)} quick breaths. Begin.`), gap: 0.4 },
      { pace: BOF, count: breaths, style: 'pump', label: 'Breath of fire', cues: [{ breath: breaths - 8, say: L.pumpLast }] },
      ...holdFull(hold, o.holdCues, { record: true }),
      { say: L.release },
      ...o.after,
    ],
  };
}

export const fireWave = {
  id: 'fire-wave',
  title: 'Fire Wave',
  titleHtml: 'Fire <em>wave</em>',
  tag: 'Energy',
  blurb: 'Ujjayi, three rounds of breath of fire, holds with bandhas.',
  lede: "A morning heat-builder in Dylan Werner's sequence style: ujjayi warm-up, three short rounds of breath of fire, each sealed with a full-lung hold.",
  music: 'ember',
  accent: ['#ffd29a', '#e8553a'],
  sky: 'fire',
  intensity: true,
  intensityNotes: {
    gentle: 'Fewer breaths, holds of 10–25 s.',
    standard: 'Holds of 15, 30 and 45 s on full lungs.',
    deeper: 'Holds of 20, 40 and 60 s. For experienced practitioners.',
  },
  after: ['Best on an empty stomach, earlier in the day.', 'Skip the fast breathing if you are pregnant, have epilepsy, heart disease or high blood pressure.'],
  sections: (opts) => [
    {
      id: 'heat-warm',
      title: 'Warm up',
      what: 'Ujjayi, 4:4 → 6:6',
      color: '#f6b77a',
      steps: [
        { say: F.welcome, bell: 'low', lead: 2 },
        { say: F.ujjayi },
        { say: F.four, gap: 0.6 },
        { pace: { inhale: 4, exhale: 4 }, count: 3, style: 'count' },
        { pace: { inhale: 5, exhale: 5 }, count: 3, style: 'count', cues: [{ at: 0, say: F.five }] },
        { pace: { inhale: 6, exhale: 6 }, count: 2, style: 'count', cues: [{ at: 0, say: F.six }] },
      ],
    },
    fireRound(1, { breaths: 30, gentleBreaths: 20, hold: 15, intro: F.r1, holdCues: [{ at: 1, say: L.bandhaShort }, { at: 4.5, say: F.urge }], after: [{ rest: 25, cues: [{ at: 3, say: F.buzz }] }] }, opts),
    fireRound(2, { breaths: 40, gentleBreaths: 25, hold: 30, intro: F.r2, holdCues: [{ at: 1, say: L.bandha }], after: [{ rest: 30, cues: [{ at: 3, say: F.adrenaline }] }] }, opts),
    fireRound(3, { breaths: 50, gentleBreaths: 30, hold: 45, intro: F.r3, holdCues: [{ at: 1, say: L.bandhaShort }], after: [{ rest: 15, cues: [{ at: 3, say: F.rest }] }] }, opts),
    {
      id: 'calm-cool',
      title: 'Cool down',
      what: '4 in · 6 out, check in',
      color: '#7cc7c4',
      steps: [
        { say: F.cool, bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count' },
        { rest: 15 },
        { say: F.close, bell: 'low' },
        { rest: 5 },
      ],
    },
  ],
  learn: `
<p>Built like the "breath sequence wave" in Dylan Werner's <em>The Illuminated Breath</em>: warm up, build heat, seal it with retention, cool down.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Ujjayi</strong>: a soft hiss at the back of the throat, nose only, lengthening from 4:4 to 6:6.</li>
  <li><strong>Breath of fire</strong>: quick, small breaths through the nose, about two or three a second, belly soft and shoulders still. Werner keeps these rounds short and seals each with a hold, so CO₂ doesn't drop too far.</li>
  <li><strong>Full-lung holds with bandhas</strong>: root lock (mula bandha) and chin lock (jalandhara). Hold only to the first clear urge. Holding on full lungs, rather than empty, keeps oxygen higher.</li>
</ul>
<h3>Why it works</h3>
<ul>
  <li>Fast breathing raises adrenaline and shifts the nervous system toward alertness in the short term ${ev.some}.</li>
  <li>Buzzing, warmth and tingling come from lowered CO₂ ${ev.solid}. They're expected, not the goal.</li>
  <li>Claims about immunity, performance or mood rest on small, mostly unblinded trials ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Werner D. <em>The Illuminated Breath</em> (2021); <a href="https://blog.alomoves.com/mindfulness/dylan-werners-4-breathing-exercises-to-immediately-reduce-stress" target="_blank" rel="noopener">4 breathing exercises</a>, Alo Moves.</li>
  <li>Kox et al. 2014, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4034215/" target="_blank" rel="noopener">voluntary activation of the sympathetic nervous system</a>, PNAS.</li>
  <li>Almahayni &amp; Hammond 2024, systematic review of the Wim Hof Method (8 studies, very low certainty), PLOS ONE: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Almahayni+Hammond+Wim+Hof+Method" target="_blank" rel="noopener">PubMed search</a>.</li>
</ul>`,
};

// ── Hold Ladder (dry CO2 table) ────────────────────────
const H = {
  welcome: line('hl_welcome', 'Welcome to the hold ladder, a dry breath-hold table from freediving. Sit or lie down. Never in water.'),
  how: line('hl_how', 'Every hold starts from a comfortable full breath, not a maximal one. The holds stay the same length. The rests get shorter.', 'technique'),
  calm: say('Half a minute of calm breathing. Then the first hold.'),
  inhale: say('Comfortably full breath in.'),
  soft: line('hl_soft', 'Soften the face. Shoulders down. Holding the breath is a relaxation skill.', 'technique'),
  dive: line('hl_dive', "Your heart may slow during the hold. That's the diving reflex, built into every mammal.", 'science'),
  contract: line('hl_contract', 'If your diaphragm starts to twitch, you can end the hold right there. Just tap breathe now.'),
  spleen: line('hl_spleen', 'Over a few holds, the spleen squeezes out a small reserve of red blood cells. A real effect, but a small one.', 'science'),
  last: line('hl_last', 'Last hold. Stay soft right to the end.'),
  rule: line('hl_rule', 'If a hold ever starts to feel like a maximum effort, end the table there. Training happens below your limit.', 'technique'),
  rests: line('hl_rests', 'In the rests, breathe slow and easy. No big breaths, no fast breathing.', 'technique'),
  why: line('hl_why', "The same hold with less rest each time lets carbon dioxide build a little more. That's what you're getting used to.", 'science'),
  close: line('hl_close', "That's the ladder. Breathe easy for a minute before you stand. Two or three times a week is plenty."),
};
const RESTS = [90, 75, 60, 45, 30, 15];
const HOLD_CUES = [[{ at: 8, say: H.soft }], [{ at: 10, say: H.dive }], [{ at: 10, say: H.contract }], [{ at: 10, say: H.spleen }], [], [{ at: 5, say: H.last }]];
const REST_CUES = [[{ at: 5, say: H.rule }, { at: 30, say: H.rests }], [{ at: 5, say: H.why }], [], [], [], []];

export const holdLadder = {
  id: 'hold-ladder',
  title: 'Hold Ladder',
  titleHtml: 'Hold <em>ladder</em>',
  tag: 'Long holds',
  blurb: 'A freediver’s CO₂ table: six holds, shrinking rests.',
  lede: 'A dry CO₂ table from freediving. Six calm, full-lung holds of the same length, with less rest between each one.',
  music: 'ember',
  accent: ['#bfe3ff', '#2f6fa8'],
  sky: 'deep',
  intensity: true,
  intensityNotes: {
    gentle: 'Six holds of 25 s. A good place to start.',
    standard: 'Six holds of 45 s. Suits a comfortable max hold of about 1:30.',
    deeper: 'Six holds of 1:00. Suits a comfortable max hold of 2:00 or more.',
  },
  after: ['Two or three times a week is plenty; leave a day between tables.', 'Dry only. Never practise breath holds in water without trained supervision.'],
  sections: (opts) => {
    const hold = scaled(45, opts);
    return [
      {
        id: 'deep-arrive',
        title: 'Arrive',
        what: 'How the table works',
        color: '#8cc0e8',
        steps: [{ say: H.welcome, bell: 'low', lead: 2 }, { say: H.how }, { say: H.calm, gap: 0.5 }, { rest: 30 }],
      },
      {
        id: 'table',
        title: 'The table',
        what: `6 × ${mmss(hold)} holds · rests 1:30 → 0:15`,
        color: '#2f6fa8',
        steps: RESTS.flatMap((rest, i) => [
          { pace: { inhale: 4 }, count: 1, style: 'slow', bell: i === 0 ? 'bell' : 'low', cues: [{ at: 0, say: H.inhale }] },
          {
            hold: 'full',
            seconds: hold,
            record: true,
            tick: false,
            cues: [{ at: 0.3, say: say(`Hold ${num(i + 1)} of six. ${cap(dur(hold))}.`) }, ...HOLD_CUES[i], ...(hold >= 40 ? [{ fromEnd: 11, say: L.tenMore }] : [])],
          },
          { rest, cues: [{ at: 0.4, say: say(i === 5 ? 'Breathe. That was the last one.' : `Breathe. Rest, ${dur(rest)}.`) }, ...REST_CUES[i]] },
        ]),
      },
      {
        id: 'calm-close',
        title: 'Recover',
        what: 'Easy breathing',
        color: '#7cc7c4',
        steps: [{ rest: 20 }, { say: H.close, bell: 'low' }, { rest: 8 }],
      },
    ];
  },
  learn: `
<p>Freedivers train with "tables" on dry land. In a <strong>CO₂ table</strong> the hold stays fixed (about half your comfortable maximum) while the rest shrinks each round, so carbon dioxide builds up a little more each time.</p>
<h3>The technique</h3>
<ul>
  <li>Calm breathing first: no fast breathing or big breaths before a hold, ever.</li>
  <li>Each hold starts from a comfortable full breath, not a maximal one. Relax the face, jaw and shoulders.</li>
  <li>Six holds; rests go 1:30, 1:15, 1:00, 0:45, 0:30, 0:15. Pick the intensity that's roughly half your comfortable maximum hold.</li>
  <li>If a hold starts to feel like a maximum effort, stop the table there.</li>
</ul>
<h3>What happens in your body</h3>
<ul>
  <li>The diving reflex: heart rate drops (around 14 beats a minute within 30 s in divers) and blood vessels in the limbs narrow ${ev.solid}.</li>
  <li>The spleen contracts by about a fifth, releasing a few percent more red blood cells over several holds; this fades within minutes ${ev.solid}.</li>
  <li>Two weeks of daily holds lengthened max holds by about 44 s in a small study ${ev.some}. Lasting changes in haemoglobin aren't proven ${ev.spec}.</li>
  <li>Diaphragm contractions late in a hold are a response to rising CO₂ ${ev.solid}. In this app they're a good moment to end the hold, not something to push through.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Engan et al. 2013, two weeks of daily apnea training (max holds, diving response, spleen), Scand J Med Sci Sports: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Engan+2013+apnea+training+Scand+J+Med+Sci+Sports" target="_blank" rel="noopener">PubMed search</a>.</li>
  <li>Citherlet et al. 2021, <a href="https://doi.org/10.3389/fspor.2021.700757" target="_blank" rel="noopener">Acute effects of the Wim Hof breathing method</a>, Front Sports Act Living (SpO₂ during holds).</li>
  <li>Valdivia-Valdivia et al. 2021, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8352716" target="_blank" rel="noopener">syncope after unsupervised hyperventilation and apnea</a>, Diving Hyperb Med.</li>
</ul>`,
};
