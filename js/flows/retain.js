// Retention: the longer sessions (15–25 min) where the holds are the work. Kumbhaka and the
// Hold Ladder with Leo; Rounds and Alternate Nostril with Mira. Plus Window Seat (Mira): soft
// pauses for a headache on a plane or a train.
// Voice tags are placed by hand; captions and on-device speech drop them.

import { line, say, tip, num, Num, dur, mmss, scaled, milestones, holdEmpty, holdFull, callsFor, SAFETY_HTML, ev } from './lib.js';
import { B } from './train.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const tenMore = say('Ten more seconds.');
const levelOf = (opts) => (opts.gentle ? 'gentle' : (opts.holdScale ?? 1) > 1 ? 'deeper' : 'standard');
const STAY = line('tw_stay', 'Stay where you are for a minute before you get up. After holds, standing up fast can make you dizzy.');

// ── Kumbhaka ───────────────────────────────────────────
const K = {
  welcome: line('kb_welcome', 'Welcome. Sit up tall on a cushion or a chair, hands resting on your knees, and close your eyes.'),
  plan: line('kb_plan', "This is kumbhaka: in, hold, out, hold, at a fixed ratio. If you breathe in for four, you hold for eight, breathe out for six, and hold empty for four. We start short and step it up. If you need air before a count ends, just breathe."),
  nose: line('kb_nose', 'Breathe through your nose the whole time, slow and quiet.', 'technique'),
  slowOut: line('kb_slow_out', "Let the air out steadily, over the whole count. If you run out early, let it out slower next time.", 'technique'),
  emptyHold: line('kb_empty_hold', 'The empty hold is usually the harder one. Keep your belly soft, and breathe if you need to.', 'technique'),
  air: line('kb_air', 'If a hold gets too long, breathe. Join the rhythm again once your breathing feels easy.'),
  circle: tip('kb_t_circle', "You don't have to count. If your eyes are open, the circle keeps time for you."),
  face: tip('kb_t_face', 'Let your forehead, your eyes and your jaw go slack.'),
  wander: tip('kb_t_wander', "If your mind's drifted off, come back on the next breath in."),
  rate: line('kb_rate', "You're down to under two breaths a minute now. Most slow-breathing research is at about six a minute, so how much of it applies here isn't clear.", 'science'),
  co2: line('kb_co2', 'During the holds, carbon dioxide builds up. That, more than low oxygen, is what makes you want to breathe.', 'science'),
  texts: line('kb_texts', 'Kumbhaka means the held breath. In the old hatha yoga texts, the holds are the heart of the practice.'),
  top: line('kb_top', 'Top step. Same rhythm, longer counts. Stay easy.'),
  release: line('kb_release', 'Let go of the count, and breathe at your own pace.'),
  notice: line('kb_notice', 'Stay here for a minute. See if the breath stays slow on its own.'),
  close: line('kb_close', 'Open your eyes. If the top step stayed easy all the way through, try the next level next time.'),
};
/** Steps per level: [unit in seconds, rounds]. A round is u in, 2u hold, 1.5u out, u hold. */
const KB_STEPS = {
  gentle: [[4, 8], [6, 18]],
  standard: [[4, 6], [6, 8], [8, 12]],
  deeper: [[6, 6], [8, 8], [10, 10]],
};
const ratio = (u) => ({ inhale: u, holdIn: 2 * u, exhale: 1.5 * u, holdOut: u });
const RATIO_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold, empty' })[ph];
const LEO = callsFor('leo');
const MIRA = callsFor('mira');
const kbIntro = (n, u, r) => say(`Step ${num(n)}. ${Num(r)} rounds. ${Num(u)} in, ${num(2 * u)} hold, ${num(1.5 * u)} out, ${num(u)} hold.`);

export const kumbhaka = {
  id: 'kumbhaka',
  title: 'Kumbhaka',
  titleHtml: '<em>Kumbhaka</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'leo',
  blurb: 'In, hold, out, hold at a fixed ratio, stepping up to 8 · 16 · 12 · 8.',
  lede: 'Breath retention the classical way: in, hold, out, hold at a ratio of 1 : 2 : 1.5 : 1, through the nose. It starts at 4 · 8 · 6 · 4 and steps up twice.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#cfd3f2', '#4b4f9a'],
  sky: 'deep',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: {
    gentle: 'Two steps: 4 · 8 · 6 · 4, then 6 · 12 · 9 · 6.',
    standard: 'Three steps, up to 8 · 16 · 12 · 8.',
    deeper: 'Three steps, up to 10 · 20 · 15 · 10.',
  },
  defaultLevel: 'standard',
  after: ['Daily is fine for this one. Move up a level only when the top step stays easy all the way through.', 'If you gasp after a hold, the counts are too long for today. Drop a level.'],
  sections: (opts) => {
    const steps = KB_STEPS[levelOf(opts)];
    const last = steps.length - 1;
    const cuesFor = (k, u, r) => {
      // Tips go wherever they fit between the calls (engine.js); "Last one." sits in the empty hold before it.
      const lastOne = { breath: r - 2, offset: 4.5 * u + 1.9, say: B.lastOne };
      if (k === 0) return [{ breath: 1, say: B.layers }, { breath: 2, say: K.slowOut }, { breath: 3, say: B.softHold }, { breath: 4, say: K.circle }];
      const first = [{ breath: 0, say: K.emptyHold }, { breath: 1, say: K.air }];
      if (k < last) return [...first, { breath: 3, say: K.face }, lastOne];
      return [...first, { breath: 2, say: K.rate }, { breath: 4, say: K.co2 }, { breath: 6, say: K.texts }, { breath: 8, say: K.wander }, lastOne];
    };
    return [
      {
        id: 'deep-arrive',
        title: 'Arrive',
        what: 'Posture, the ratio',
        color: '#a3a8e0',
        steps: [{ say: K.welcome, bell: 'low', lead: 2 }, { say: K.plan }, { say: K.nose }, { rest: 20 }],
      },
      ...steps.map(([u, r], k) => ({
        id: `deep-${k + 1}`,
        title: k === last ? 'Top step' : `Step ${k + 1}`,
        what: `${u} · ${2 * u} · ${1.5 * u} · ${u}, ${r} rounds`,
        color: ['#8f95d6', '#6f75c0', '#4b4f9a'][k],
        steps: [
          ...(k === last ? [{ say: K.top, bell: 'bell' }] : []),
          { say: kbIntro(k + 1, u, r), bell: k === last ? undefined : 'bell', gap: 0.6 },
          { pace: ratio(u), count: r, style: 'count', labels: RATIO_LABELS, calls: LEO, cues: cuesFor(k, u, r) },
        ],
      })),
      {
        id: 'calm-kb',
        title: 'Release',
        what: 'Natural breathing, quiet',
        color: '#b9bde8',
        steps: [{ say: K.release, bell: 'bell' }, { rest: 10 }, { say: K.notice }, { rest: 60 }, { say: K.close, bell: 'low' }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>Kumbhaka means the held breath. Here it runs at a fixed ratio: in, hold full, out, hold empty, at 1 : 2 : 1.5 : 1. The counts get longer step by step while the rhythm stays the same.</p>
<h3>The technique</h3>
<ul>
  <li>Sit tall. Nose only, the whole time, slow and quiet.</li>
  <li>Fill from the bottom: belly, then ribs, then chest. Not to the very top.</li>
  <li>The holds are a pause, not a squeeze: throat open, face and shoulders soft. Spread the out-breath over its whole count.</li>
  <li>Gentle tops out at 6 · 12 · 9 · 6, Standard at 8 · 16 · 12 · 8, Deeper at 10 · 20 · 15 · 10. If a hold gets too long, breathe and join the next round.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>At these counts you take one to three breaths a minute. Slow breathing reliably shifts heart rhythm toward its "rest" pattern ${ev.solid}.</li>
  <li>Reviews of slow-breathing studies report calmer mood and more alertness, mostly from small trials ${ev.some}.</li>
  <li>Whether the holds add anything on top of the slow breathing, for example by getting you used to carbon dioxide, hasn't been tested ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Zaccaro et al. 2018, <a href="https://doi.org/10.3389/fnhum.2018.00353" target="_blank" rel="noopener">How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing</a>, Front Hum Neurosci.</li>
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
</ul>`,
};

// ── Hold Ladder ────────────────────────────────────────
const H = {
  welcome: line('hl_welcome', "Welcome. This is a breath-hold table, the way freedivers train on dry land. Sit or lie down somewhere you can't fall from. Never do this in water."),
  plan: line('hl_plan', 'Eight holds, all the same length. The rests get shorter each time, so the urge to breathe tends to come sooner. Your job is to stay relaxed, and to end a hold early whenever you need to.'),
  planUrge: line('hl_plan_urge', "Six holds, no target time. Hold until the first clear urge to breathe, then tap Breathe now. Two minutes of rest between holds. You're learning what a relaxed hold feels like."),
  full: line('hl_full', 'Every hold starts from a comfortably full breath, not as full as you can get.', 'technique'),
  noBig: line('hl_no_big', "In the rests, breathe normally. Big or fast breaths before a hold push the urge to breathe back, while your oxygen keeps dropping. That's how people black out.", 'technique'),
  rule: line('hl_rule', "If you ever feel dizzy or find yourself straining, stop the table there. You can end any hold early."),
  calm: line('hl_calm', 'A minute of easy breathing first. Then the first hold.'),
  in: say('Comfortably full breath in.'),
  recovery: line('hl_recovery', 'Recovery breaths. A quick breath in, a short pause at the top, and let it go.', 'technique'),
  recoveryShort: say('Recovery breaths.'),
  soft: tip('hl_t_soft', 'Soften your face. Jaw loose, eyes soft.'),
  dive: line('hl_dive', "Your heart may slow down during the hold, as part of the diving reflex. Every mammal has it.", 'science'),
  scan: tip('hl_t_scan', "Check for tension, and let go wherever you're still gripping."),
  contract: line('hl_contract', "If your belly starts to twitch, those are contractions. They're normal. Today, treat them as your signal to stop."),
  spleen: line('hl_spleen', "After a few holds, your spleen can release some extra red blood cells. It's a small effect, and it fades within minutes.", 'science'),
  ten: tip('hl_t_ten', 'If you need to breathe, breathe. The table will wait.'),
  wave: tip('hl_t_wave', "Notice the urge when it comes. You can stop there, or stay a little longer if you're still relaxed."),
  last: line('hl_last', 'Last hold. Stay soft right to the end.'),
  restOut: tip('hl_t_rest_out', 'Let each breath out be a little longer than the breath in.'),
  restWhy: line('hl_rest_why', 'Each rest is a bit shorter than the one before, so you start the next hold with more carbon dioxide on board.', 'science'),
  study: line('hl_study', "In one small study, tables like this dropped blood oxygen less than max holds did. Whether they make your max hold longer hasn't been shown.", 'science'),
  urgeAgain: line('hl_t_urge', 'Same as before. Breathe at the first clear urge, or sooner if you like.'),
  restUrge: tip('hl_t_rest_urge', "Take the whole rest. Start the next hold only when your breathing feels easy again."),
  done: line('hl_done', 'That was the last one. Let your breathing settle.'),
  stayLeo: line('hl_stay', 'Stay sitting or lying for a minute before you get up.'),
  close: line('hl_close', 'Two or three tables a week is plenty, with a day off in between.'),
};
const HOLD_TIPS = [H.soft, H.dive, H.scan, H.contract, H.spleen, H.ten, H.wave];
const REST_TIPS = [H.restOut, H.restWhy, null, H.study, null, null];
const REST_TIPS_URGE = [H.restOut, H.restUrge, H.urgeAgain, H.study, H.urgeAgain];
const ORDINAL = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
const RECOVER = { inhale: 1.5, holdIn: 1.5, exhale: 3 };

export const holdLadder = {
  id: 'hold-ladder',
  title: 'Hold Ladder',
  titleHtml: 'Hold <em>ladder</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'leo',
  blurb: 'A freediver’s table on dry land: same holds, shorter rests.',
  lede: 'A dry breath-hold table from freediving. Start with First urge: six relaxed holds that end when you choose. Then the CO₂ table: eight holds of the same length, with the rest shrinking from two minutes to thirty seconds.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#cfe0f2', '#3d5f8f'],
  sky: 'table',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: { gentle: 'First urge', standard: '8 × 0:45', deeper: '8 × 1:00' },
  intensityNotes: {
    gentle: 'Six holds to the first clear urge, two minutes apart. Start here.',
    standard: 'Eight holds of 45 s. Suits a relaxed max hold of about 1:30.',
    deeper: 'Eight holds of 1:00. Suits a relaxed max hold of 2:00 or more.',
  },
  defaultLevel: 'gentle',
  after: ['Two or three tables a week, with a rest day between.', 'Dry only. Never practise breath holds in or near water without trained supervision.'],
  sections: (opts) => {
    const urge = levelOf(opts) === 'gentle';
    const hold = urge ? 90 : scaled(45, opts) > 45 ? 60 : 45;
    const n = urge ? 6 : 8;
    const rests = urge ? Array(n - 1).fill(120) : [120, 105, 90, 75, 60, 45, 30];
    const holds = Array.from({ length: n }, (_, i) => {
      const last = i === n - 1;
      const tipAt = urge ? 12 : 10;
      return [
        { pace: { inhale: 4 }, count: 1, style: 'slow', bell: 'low', group: `h${i}`, cues: [{ at: 0, say: H.in }] },
        {
          hold: 'full',
          seconds: hold,
          label: urge ? 'Hold · first urge' : `Hold ${i + 1} of ${n}`,
          record: true,
          tick: !urge,
          group: `h${i}`,
          cues: [
            { at: 0.3, say: urge ? say(`${ORDINAL[i]} hold.`) : say(`Hold ${num(i + 1)} of ${num(n)}. ${cap(dur(hold))}.`) },
            { at: last ? 5 : tipAt, say: last ? H.last : HOLD_TIPS[i] },
            ...milestones(hold),
            ...(urge ? [] : [{ fromEnd: 11, say: tenMore }]), // First urge has no target to reach
          ],
        },
        { pace: RECOVER, count: 3, style: 'slow', label: 'Recovery', cues: [{ at: 0, say: i === 0 ? H.recovery : H.recoveryShort }] },
        ...(last ? [] : [{ rest: rests[i] - 22, label: 'Rest', cues: (urge ? REST_TIPS_URGE : REST_TIPS)[i] ? [{ at: 6, say: (urge ? REST_TIPS_URGE : REST_TIPS)[i] }] : [] }]),
      ];
    }).flat();
    return [
      {
        id: 'deep-arrive',
        title: 'Arrive',
        what: 'How the table works',
        color: '#9fb6d8',
        steps: [{ say: H.welcome, bell: 'low', lead: 2 }, { say: urge ? H.planUrge : H.plan }, { say: H.full }, { say: H.noBig }, { say: H.rule }, { say: H.calm, gap: 0.5 }, { rest: 60, label: 'Rest' }],
      },
      {
        id: 'table',
        title: 'The table',
        what: urge ? `${n} holds to the first urge · 2:00 rests` : `${n} × ${mmss(hold)} holds · rests 2:00 → 0:30`,
        color: '#3d5f8f',
        steps: holds,
      },
      {
        id: 'calm-close',
        title: 'Recover',
        what: 'Natural breathing',
        color: '#a9c2e0',
        steps: [{ say: H.done, bell: 'bell' }, { rest: 45 }, { say: H.stayLeo }, { rest: 12 }, { say: H.close }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>Freedivers train with "tables" on dry land. <strong>First urge</strong> is the beginner's version: each hold lasts until the first clear urge to breathe, with two minutes of rest. In a <strong>CO₂ table</strong> the hold stays fixed (about half your relaxed maximum) while the rest shrinks each round, so carbon dioxide builds a little more each time.</p>
<h3>The technique</h3>
<ul>
  <li>Easy breathing between holds: normal-sized breaths, out a little longer than in. No fast or big breaths before a hold, ever.</li>
  <li>Each hold starts from a comfortable full breath, about 80%, not a maximal one. Relax the face, jaw and shoulders.</li>
  <li>After each hold, three recovery breaths: a quick breath in, a short pause at the top, then let it go.</li>
  <li>The CO₂ table has eight holds; rests go 2:00, 1:45, 1:30, 1:15, 1:00, 0:45, 0:30. If a hold starts to feel like a maximum effort, stop the table there.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Tables lowered blood oxygen much less than maximal holds in novices, so they're a mild training stimulus ${ev.some}.</li>
  <li>The diving reflex slows the heart during a hold ${ev.solid}. The spleen contracts over several holds, releasing a few percent more red blood cells; this fades within minutes ${ev.solid}.</li>
  <li>Two weeks of daily holds lengthened max holds by about 44 s in a small, uncontrolled study ${ev.some}. That tables themselves improve your maximum isn't shown ${ev.spec}.</li>
  <li>Diaphragm contractions late in a hold are a response to rising CO₂ ${ev.solid}. In this app they're a good moment to end the hold, not something to push through.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Declercq et al. 2024, CO₂ and O₂ tables vs maximal apneas in novices, <a href="https://doi.org/10.1007/s00421-024-05563-7" target="_blank" rel="noopener">Eur J Appl Physiol</a>.</li>
  <li>Engan et al. 2013, two weeks of daily apnea training (max holds, diving response, spleen), Scand J Med Sci Sports: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Engan+2013+apnea+training+Scand+J+Med+Sci+Sports" target="_blank" rel="noopener">PubMed search</a>.</li>
  <li>RAID, <a href="https://gofreediving.co.uk/wp-content/uploads/2024/09/Static-Apnea-Management-Manual_V1.0.-1.pdf" target="_blank" rel="noopener">Static apnea management manual</a> (recovery breathing).</li>
</ul>`,
};

// ── Rounds ─────────────────────────────────────────────
const R = {
  welcome: line('rd_welcome', "Hey. Sit or lie down somewhere comfortable, where you can't fall. Never near water with this one."),
  blackout: line('rd_blackout', "One important thing before we start. If you ever twitch, blank out, or lose track of time in a hold, your brain has run short of oxygen. That's not a release. Stop the session there."),
  plan: line('rd_plan', "Four rounds. Each one starts with a set of full breaths. Then you breathe out and hold with your lungs empty, for as long as it's comfortable. When you need air, take one big breath in and hold it for fifteen seconds. Then a short rest, and we go again."),
  how: line('rd_how', "Breathe in deep, into your belly and then your chest. Then just let it fall out. Don't push the breath out.", 'technique'),
  tingle: line('rd_tingle', "You might get tingly hands or a tingly face, or feel a bit lightheaded. That's the fast breathing. If it gets strong, slow down, or just breathe normally."),
  lastBreath: line('rd_last_breath', 'Last one. Let it go.'),
  tap: line('rd_tap', 'Whenever you need to breathe, tap Breathe now.'),
  relax: tip('rd_t_relax', 'Let your shoulders drop and your hands go soft.'),
  letGo: line('rd_let_go', 'And let it go.'),
  rest: tip('rd_t_rest', 'Breathe normally for a bit, and let yourself settle before the next round.'),
  why: line('rd_why', "Fast breathing lowers carbon dioxide, so the urge to breathe comes later than usual, while oxygen keeps falling. That's why the holds here have a cap.", 'science'),
  study: line('rd_study', 'In a month-long study, five minutes a day of fast breathing with short holds lifted mood and eased anxiety. The slower practices did about as well.', 'science'),
  slow: say('Now slow it down. In for four, out for six.'),
  quiet: line('rd_quiet', 'Let the count go. Rest here for a minute.'),
  close: line('rd_close', 'Open your eyes whenever you feel ready.'),
};
const POWER = { inhale: 1.6, exhale: 1.6, level: 0.6 };
const RD_HOLDS = [45, 60, 75, 75];
const RD_REST = [
  [{ at: 4, say: R.rest }],
  [{ at: 4, say: R.why }],
  [{ at: 4, say: R.study }],
];

function powerRound(n, opts) {
  const breaths = opts.gentle ? 20 : 30;
  const hold = scaled(RD_HOLDS[n - 1], opts);
  const first = n === 1;
  return {
    id: `round-${n}`,
    title: `Round ${n}`,
    what: `${breaths} breaths · empty hold up to ${mmss(hold)}`,
    color: ['#ffb38a', '#ff9e7a', '#ff8a7a', '#f2777f'][n - 1],
    steps: [
      { say: say(`Round ${num(n)}. ${Num(breaths)} breaths.`), bell: 'bell', gap: 0.6 },
      {
        pace: POWER,
        count: breaths,
        style: 'tally',
        lastExhale: 3,
        cues: [...(first ? [{ breath: 2, say: R.how }, { breath: 12, say: R.tingle }] : []), { breath: breaths - 1, say: R.lastBreath }],
      },
      holdEmpty(hold, first ? [{ at: 6, say: R.tap }] : n === 2 ? [{ at: 8, say: R.relax }] : []),
      ...holdFull(15, [], { inhale: 6 }),
      { say: R.letGo, gap: 0.5 },
      ...(n < 4 ? [{ rest: 45, label: 'Rest', cues: RD_REST[n - 1] }] : []),
    ],
  };
}

export const rounds = {
  id: 'rounds',
  title: 'Rounds',
  titleHtml: '<em>Rounds</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'mira',
  blurb: 'Thirty full breaths, an empty hold, one recovery breath. Four rounds.',
  lede: 'The rounds most people know: a set of full, rhythmic breaths, then a hold on empty lungs for as long as it’s comfortable, then one deep recovery breath held for fifteen seconds. The holds are capped, and you end each one when you choose.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#ffe0cc', '#c8554f'],
  sky: 'round',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: {
    gentle: 'Twenty breaths a round, empty holds of up to 0:25 → 0:45.',
    standard: 'Thirty breaths a round, empty holds of up to 0:45 → 1:15.',
    deeper: 'Thirty breaths a round, empty holds of up to 1:00 → 1:40.',
  },
  defaultLevel: 'standard',
  after: ['Twitching, blanking out or losing time in a hold means oxygen ran low. It is never a release; shorten the holds.', 'Never in or near water, and never standing. Give it a few minutes before you drive.'],
  sections: (opts) => [
    {
      id: 'heat-arrive',
      title: 'Arrive',
      what: 'How a round works',
      color: '#ffc9a8',
      steps: [{ say: R.welcome, bell: 'low', lead: 2 }, { say: R.plan }, { say: R.blackout }, { rest: 6 }],
    },
    ...[1, 2, 3, 4].map((n) => powerRound(n, opts)),
    {
      id: 'calm-rd',
      title: 'Come down',
      what: '4 in · 6 out, then quiet',
      color: '#8fcfb8',
      steps: [
        { say: R.slow, bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 12, style: 'count', calls: MIRA },
        { say: R.quiet, bell: 'low' },
        { rest: 60 },
        { say: R.close },
        { say: STAY },
        { rest: 4 },
      ],
    },
  ],
  learn: `
<p>Rounds of full, rhythmic breathing followed by a hold on empty lungs, then one deep breath held for fifteen seconds. It's the most popular retention format online. This version caps the holds and lets you end each one with <em>Breathe now</em>.</p>
<h3>The technique</h3>
<ul>
  <li>Seated or lying, never standing, never in or near water.</li>
  <li>Full breaths in through the nose or mouth, belly then chest; let each one fall out without pushing.</li>
  <li>After the last breath, let it all go and hold empty. When you need air, tap <em>Breathe now</em>: one big breath in, hold fifteen seconds, let go.</li>
  <li>Tingling hands and lightheadedness come from the fast breathing. If they get strong, breathe slower.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>The adrenaline rise comes mostly from the fast breathing itself; the long empty hold adds a deep drop in blood oxygen, to around 60–70% in lab studies ${ev.solid}. That's why the holds here are capped.</li>
  <li>In a month-long trial, five minutes a day of fast breathing with short holds improved mood and anxiety, about as much as slower breathing practices ${ev.some}.</li>
  <li>Trained volunteers had less inflammation after an injected toxin in one small study that combined breathing, cold and meditation ${ev.some}. It doesn't show the breathing alone protects you from illness ${ev.spec}.</li>
  <li>Twitching, blanking out or losing time in a hold is hypoxic fainting, not a release. Shorten the holds.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Zwaag et al. 2022, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9071023/" target="_blank" rel="noopener">cold exposure training and a breathing exercise: effects on the inflammatory response</a>, Psychosom Med.</li>
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
  <li>Kox et al. 2014, <a href="https://doi.org/10.1073/pnas.1322174111" target="_blank" rel="noopener">Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans</a>, PNAS.</li>
</ul>`,
};

// ── Alternate Nostril, with holds ──────────────────────
const N = {
  welcome: line('an_welcome', 'Hey. Sit up tall, on a cushion or a chair, and rest your left hand in your lap.'),
  hand: line('an_hand', 'Bring your right hand up and fold your index and middle fingers down. Your thumb closes the right nostril. Your ring finger closes the left.', 'technique'),
  plan: line('an_plan', "We'll warm up with plain alternate nostril breathing. Then we add a hold at the top. The old yoga texts use a ratio of one, four, two: you hold four times as long as you breathe in, and breathe out for twice as long. The counts are a guide. Breathe whenever you need to."),
  blocked: line('an_blocked', "If one side is blocked, don't force it. Lower your hand and breathe normally for a few rounds.", 'technique'),
  even: say('Four in, four out. We start on the left.'),
  lIn: line('an_l_in', 'Thumb on the right. In through the left.'),
  rOut: line('an_r_out', 'Switch. Out through the right.'),
  rIn: line('an_r_in', 'In through the right.'),
  lOut: line('an_l_out', 'Switch. Out through the left.'),
  both: line('an_both', 'Close both sides, and hold.'),
  lInH: line('an_l_in_h', 'In through the left.'),
  rOutH: line('an_r_out_h', 'Release the right, and breathe out.'),
  lOutH: line('an_l_out_h', 'Release the left, and breathe out.'),
  holdSoft: line('an_hold_soft', 'Keep your face and throat soft on the hold, and your fingers light.', 'technique'),
  track: tip('an_t_track', 'Lost track of the side? Breathe in on the side you just breathed out of.'),
  ears: tip('an_t_ears', 'With headphones on, the breath sound follows the side. Left ear, left nostril.'),
  arm: tip('an_t_arm', 'If your arm gets tired, drop your hand for a few breaths, then pick it back up.'),
  air: line('an_air', 'If a hold feels too long, let the breath out early and join the next round.'),
  rate: line('an_rate', "Most slow-breathing research is at about six breaths a minute. This is slower, and with holds, so we know less about it.", 'science'),
  bp: line('an_bp', "A few small trials found alternate nostril breathing lowered blood pressure a little. Whether the holds add anything isn't known.", 'science'),
  wander: tip('an_t_wander', 'If your mind wanders, use the next switch to come back.'),
  last: say('Last round.'),
  release: line('an_release', 'Release the hand. Breathe through both sides, and let the breath find its own pace.'),
  close: line('an_close', 'Sit for a moment longer, then open your eyes.'),
};
/** Ratio steps per level: [unit, breaths]; two breaths (left, then right) make a round. */
const AN_STEPS = {
  gentle: [[3, 32]],
  standard: [[3, 12], [4, 16]],
  deeper: [[3, 12], [4, 16], [5, 12]],
};
// Headphones: the breath sound sits on the side of the open nostril.
const sidePan = (ph, i) => {
  const left = i % 2 === 0;
  if (ph === 'in') return left ? -0.75 : 0.75;
  if (ph === 'out') return left ? 0.75 : -0.75;
  return 0;
};
const sides = (ph, i) => {
  const left = i % 2 === 0;
  if (ph === 'in') return left ? 'In · left' : 'In · right';
  if (ph === 'out') return left ? 'Out · right' : 'Out · left';
};
/** Side calls on every breath (left on even breaths, right on odd). The first rounds say the full
 *  instruction; after that, short calls. */
const OUT_R = say('Out through the right.');
const OUT_L = say('Out through the left.');
const evenCalls = (ph, i) =>
  ph === 'in' ? (i === 0 ? N.lIn : i % 2 ? N.rIn : N.lInH) : ph === 'out' ? (i === 0 ? N.rOut : i === 1 ? N.lOut : i % 2 ? OUT_L : OUT_R) : null;
const holdCalls = (first) => (ph, i) => {
  const full = first && i < 2;
  if (ph === 'in') return i % 2 ? N.rIn : N.lInH;
  if (ph === 'top') return full ? N.both : MIRA('top');
  if (ph === 'out') return full ? (i % 2 ? N.lOutH : N.rOutH) : i % 2 ? OUT_L : OUT_R;
  return null;
};

export const alternate = {
  id: 'alternate',
  title: 'Alternate Nostril',
  titleHtml: 'Alternate <em>nostril</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'mira',
  blurb: 'One nostril at a time, with a hold at the top. The classic 1 : 4 : 2.',
  lede: 'Nadi shodhana with kumbhaka. A few minutes of plain alternate nostril breathing, then a hold at the top of every breath: in for one count, hold for four, out for two.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#e0d9ff', '#6c63c9'],
  sky: 'balance',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: {
    gentle: 'Sixteen rounds of 3 · 12 · 6.',
    standard: '3 · 12 · 6, then 4 · 16 · 8.',
    deeper: 'Up to 5 · 20 · 10.',
  },
  defaultLevel: 'standard',
  after: ['If your nose is blocked, do Clear Nose first.', 'In the evening this is a good way into Land.'],
  sections: (opts) => {
    const steps = AN_STEPS[levelOf(opts)];
    return [
      {
        id: 'balance-set',
        title: 'Set up',
        what: 'Hand position, the ratio',
        color: '#b3a8f0',
        steps: [{ say: N.welcome, bell: 'low', lead: 2 }, { say: N.hand }, { say: N.plan }, { say: N.blocked }],
      },
      {
        id: 'balance-even',
        title: 'Even',
        what: '4 in · 4 out, six rounds',
        color: '#9d93e8',
        steps: [
          { say: N.even, gap: 0.6 },
          {
            pace: { inhale: 4, exhale: 4 },
            count: 12,
            style: 'count',
            labels: sides,
            pan: sidePan,
            calls: evenCalls,
            cues: [{ breath: 4, say: N.ears }, { breath: 8, say: N.track }],
          },
        ],
      },
      ...steps.map(([u, b], k) => ({
        id: `balance-${k + 1}`,
        title: k ? 'Longer' : 'With holds',
        what: `${u} · ${4 * u} · ${2 * u}, ${b / 2} rounds`,
        color: ['#857bdb', '#7067cc', '#5b52b8'][k],
        steps: [
          { say: say(`In for ${num(u)}, hold for ${num(4 * u)}, out for ${num(2 * u)}. ${Num(b / 2)} rounds.`), bell: 'bell', gap: 0.6 },
          {
            pace: { inhale: u, holdIn: 4 * u, exhale: 2 * u },
            count: b,
            style: 'count',
            labels: sides,
            pan: sidePan,
            calls: holdCalls(k === 0),
            cues: [
              ...(k === 0
                ? [{ breath: 2, say: N.holdSoft }, { breath: 4, say: N.arm }, { breath: 6, say: N.air }, { breath: 8, say: N.rate }, { breath: 11, say: N.wander }, ...(b > 16 ? [{ breath: 16, say: N.track }] : [])]
                : [{ breath: 2, say: N.bp }, { breath: 5, say: N.wander }]),
              { breath: b - 2, offset: u + 1, say: N.last },
            ],
          },
        ],
      })),
      {
        id: 'calm-an',
        title: 'Release',
        what: 'Both nostrils, quiet',
        color: '#b9b0e6',
        steps: [{ say: N.release, bell: 'bell' }, { rest: 60 }, { say: N.close, bell: 'low' }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>Nadi shodhana, alternate nostril breathing, with a hold at the top of every breath. Traditional teaching gives a ratio of 1 : 4 : 2: in for one count, hold for four, out for two.</p>
<h3>The technique</h3>
<ul>
  <li>Right hand up, index and middle fingers folded. The thumb closes the right nostril, the ring finger the left.</li>
  <li>In through the left, close both and hold, out through the right. In through the right, close both and hold, out through the left. That's one round.</li>
  <li>Holds stay soft: face and throat relaxed, fingers light. If a hold is too long, breathe out early and join the next round.</li>
  <li>With headphones, the breath sound follows the open side.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>At these counts you take two or three breaths a minute. Slow breathing shifts heart rhythm toward its "rest" pattern ${ev.solid}.</li>
  <li>Small studies found alternate nostril breathing lowered blood pressure and raised heart-rate variability for a while, mostly without a comparison group ${ev.some}.</li>
  <li>Claims about balancing the two halves of the brain aren't supported ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Zaccaro et al. 2018, <a href="https://doi.org/10.3389/fnhum.2018.00353" target="_blank" rel="noopener">systematic review on slow breathing</a>, Front Hum Neurosci.</li>
  <li>Ghiya 2017, <a href="https://pubmed.ncbi.nlm.nih.gov/?term=alternate+nostril+breathing+blood+pressure+heart+rate+variability" target="_blank" rel="noopener">alternate nostril breathing, blood pressure and HRV (PubMed search)</a>.</li>
</ul>`,
};

// ── Window Seat ────────────────────────────────────────
// A silent, seated practice for a headache on a plane or a train. Raised CO2 widens brain
// vessels, so the "holds" are soft pauses, sized for where you are: Plane up to 15 s (cabin air
// starts you lower), Train growing from 30 s to a minute, or none. Nose only, nothing audible.
const W = {
  welcome: line('ws_welcome', "Hey. Sit back, with your head on the headrest if you can, and your feet flat on the floor. Eyes down, or closed. If you've got water, take a sip now."),
  silent: line('ws_silent', 'Everything here is silent. Nose only, small breaths. Nobody around you needs to know.'),
  jaw: line('ws_jaw', 'Lips together, teeth apart. Let your tongue rest on the floor of your mouth.', 'technique'),
  brow: line('ws_brow', 'Let your forehead go smooth. Soften around your eyes, and across your scalp.', 'technique'),
  shoulders: line('ws_shoulders', 'Every time you breathe out, let your shoulders drop a little more.', 'technique'),
  neck: line('ws_neck', "If it's comfortable, let the back of your neck get long, with your chin tipped down a little.", 'technique'),
  faceWhy: line('ws_face_why', 'Your jaw, forehead and shoulders often tighten up around a headache. Letting them go may take off some of the pressure.', 'science'),
  slow: say('In for four, out for six, small and quiet. About six minutes.'),
  small: line('ws_small', 'Slower, not bigger. Big breaths can make you lightheaded.', 'technique'),
  pain: line('ws_pain', 'In a lab study, slow breathing with a longer breath out made heat pain a little easier to bear. Whether it helps a headache, nobody knows.', 'science'),
  vagal: line('ws_vagal', "Your heart slows a little as you breathe out, partly through the vagus nerve. Whether that does anything for inflammation isn't known.", 'science'),
  twoMin: say('About two minutes to go.'),
  stress: line('ws_stress', "Stress can raise inflammation. If slow breathing helps there, it's probably by lowering stress, and over weeks, not in one session.", 'science'),
  pauseIntro: line('ws_pause_intro', 'Now a few soft pauses. Breathe in to about two-thirds full, then just pause. Throat relaxed, nothing pushing. Let your jaw and shoulders go.'),
  skip: line('ws_skip', 'If the throbbing gets worse, or your head feels fuller, skip the pauses for today and just make the breath out longer.'),
  in: say('Breathe in, about two-thirds full.'),
  out: say('Let it out slowly.'),
  long: say('Instead of pausing, make the breath out longer. In for four, out for eight.'),
  inTrain: say('Breathe in, comfortably full. Not to the top.'),
  trainCount: say('Five pauses, growing from thirty seconds to a minute.'),
  window: tip('ws_t_window', 'If your eyes are open, let them rest on the window. Let the view go by without following it.'),
  sounds: tip('ws_t_sounds', 'Let the engine and the voices around you carry on in the background while you follow your breath.'),
  shouldersAgain: tip('ws_t_shoulders', "Check your shoulders again, and let them drop if they've crept up."),
  anchor: tip('ws_t_anchor', 'Keep your attention on the air moving at the tip of your nose.'),
  wander: tip('ws_t_wander', "If your mind wanders off, that's fine. Come back on the next breath out."),
  hJaw: tip('ws_h_jaw', 'Let your jaw hang soft. Teeth apart.'),
  hHands: tip('ws_h_hands', 'Let your hands get heavy in your lap.'),
  hSway: tip('ws_h_sway', "On a train, let it rock you a little instead of bracing."),
  hBrow: tip('ws_h_brow', 'Let your forehead soften, and the muscles around your eyes.'),
  hLast: tip('ws_h_last', 'Last pause. Breathe whenever you like, even before the cue.'),
  longWhy: line('ws_long_why', 'A longer breath out gives your heart more time to slow down.', 'science'),
  release: say('Back to four in, six out.'),
  tiltR: say('Slowly let your head tip toward your right shoulder.'),
  tiltL: say('And slowly toward the left.'),
  centre: say('Back to center.'),
  checkin: line('ws_checkin', 'Notice how your head and jaw feel now. If something has eased, let it stay that way.'),
  close: line('ws_close', "That's it. Have some water. If the headache keeps going or gets worse, get it checked out. Come back to this whenever you need it."),
};

function seatPauses(opts) {
  if (opts.noHolds) {
    return {
      id: 'seat-holds',
      title: 'Long exhale',
      what: '4 in · 8 out, no pauses',
      color: '#6f7fc7',
      steps: [{ say: W.long, bell: 'bell', gap: 0.6 }, { pace: { inhale: 4, exhale: 8 }, count: 20, style: 'count', calls: MIRA, cues: [{ breath: 3, say: W.longWhy }] }],
    };
  }
  // Plane: five 15 s pauses on two-thirds-full lungs (cabin air starts you lower).
  // Train: five pauses growing from 30 s to a minute, comfortably full.
  const plane = opts.gentle;
  const holds = plane ? Array(5).fill(scaled(25, opts)) : [30, 40, 50, 60, 60];
  const scan = [W.hJaw, W.hHands, W.hSway, W.hBrow, W.hLast];
  return {
    id: 'seat-holds',
    title: plane ? 'Soft pauses' : 'Long pauses',
    what: plane ? `5 pauses of up to ${holds[0]} s, two-thirds full` : '5 pauses, 0:30 → 1:00, comfortably full',
    color: '#6f7fc7',
    steps: [
      { say: W.pauseIntro, bell: 'bell' },
      { say: W.skip },
      { say: plane ? say(`${cap(num(5))} pauses of up to ${dur(holds[0])}.`) : W.trainCount, gap: 0.6 },
      ...holds.flatMap((h, i) => [
        { pace: { inhale: plane ? 4 : 5.5 }, count: 1, style: 'slow', group: `p${i}`, bell: i ? 'low' : undefined, cues: [{ at: 0, say: plane ? W.in : W.inTrain }] },
        {
          hold: 'full',
          seconds: h,
          label: plane ? 'Soft pause' : 'Pause',
          record: true,
          tick: false,
          group: `p${i}`,
          cues: [{ at: 0.3, say: say(`And pause, up to ${dur(h)}. Throat soft.`) }, ...(plane ? [] : [{ at: 10, say: scan[i] }]), ...milestones(h), ...(h >= 40 ? [{ fromEnd: 11, say: tenMore }] : [])],
        },
        { pace: { inhale: 4, exhale: 6 }, count: plane ? 3 : 4, style: 'count', cues: [{ at: 0, say: W.out }] },
      ]),
    ],
  };
}

export const windowSeat = {
  id: 'window-seat',
  title: 'Window Seat',
  titleHtml: 'Window <em>seat</em>',
  tag: 'On the move',
  moment: 'move',
  voice: 'mira',
  blurb: 'Silent, seated breathing for a headache on a plane or a train.',
  lede: "For a headache when you're stuck in a seat. Soften the face, slow the breath, and add a few soft pauses sized for where you are. Silent, nose-only, no fast breathing.",
  music: ['transit', 'tide'],
  accent: ['#d8e1ff', '#5f74b8'],
  sky: 'seat',
  intensity: ['none', 'gentle', 'standard'],
  levelNames: { none: 'No pauses', gentle: 'Plane', standard: 'Train' },
  defaultLevel: 'gentle',
  intensityNotes: {
    none: 'No pauses: a long out-breath instead. Best if your headache throbs, or during descent.',
    gentle: 'Plane: five soft pauses of up to 15 s. Cabin air holds less oxygen, so they stay short.',
    standard: 'Train or ground: five pauses that grow from 30 s to a full minute, on comfortably full lungs.',
  },
  after: [
    'Drink some water. Cabin air is very dry.',
    'Get help at once (tell the crew on a plane) for a sudden, severe "worst ever" headache, or one with weakness, confusion, trouble speaking, vision loss, or fever with a stiff neck.',
    'A sharp pain around one eye during landing is usually sinus pressure from the descent. It tends to pass within half an hour.',
  ],
  sections: (opts) => [
    {
      id: 'seat-settle',
      title: 'Settle',
      what: 'Headrest, feet flat, a sip of water',
      color: '#a9b8ec',
      steps: [{ say: W.welcome, bell: 'low', lead: 2 }, { rest: 8 }, { say: W.silent }, { rest: 6 }],
    },
    {
      id: 'seat-soften',
      title: 'Soften',
      what: 'Jaw, brow, shoulders, neck',
      color: '#93a5e4',
      steps: [{ say: W.jaw }, { rest: 12 }, { say: W.brow }, { rest: 12 }, { say: W.shoulders }, { rest: 16 }, { say: W.neck }, { rest: 10 }, { say: W.faceWhy, min: 4 }],
    },
    {
      id: 'seat-slow',
      title: 'Slow breathing',
      what: '4 in · 6 out, about six minutes',
      color: '#7f91d8',
      steps: [
        { say: W.slow, bell: 'bell', gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 6 },
          count: 35,
          style: 'count',
          calls: MIRA,
          cues: [
            { breath: 2, say: W.small },
            { breath: 4, say: W.window },
            { breath: 6, say: W.pain },
            { breath: 9, say: W.anchor },
            { breath: 12, say: W.vagal },
            { breath: 15, say: W.wander },
            { breath: 18, say: W.stress },
            { breath: 20, say: W.sounds },
            { breath: 23, say: W.twoMin },
            { breath: 28, say: W.shouldersAgain },
          ],
        },
      ],
    },
    seatPauses(opts),
    {
      id: 'seat-release',
      title: 'Release',
      what: 'Slow breathing, gentle neck tilts',
      color: '#9a8fd6',
      steps: [
        { say: W.release, bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 12, style: 'count', calls: MIRA, cues: [{ breath: 2, say: W.tiltR }, { breath: 6, say: W.tiltL }, { breath: 10, say: W.centre }] },
      ],
    },
    {
      id: 'seat-close',
      title: 'Close',
      what: 'Check in, water',
      color: '#7cc7c4',
      steps: [{ say: W.checkin, lead: 1 }, { rest: 25 }, { say: W.close, bell: 'low' }, { rest: 5 }],
    },
  ],
  learn: `
<p>A seated, silent practice for a headache while travelling: relax the face and shoulders, breathe slowly with a long out-breath, and (optionally) a few soft pauses. It's comfort and settling, not treatment. Keep taking your usual medication as you normally would.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Soften:</strong> lips together, teeth apart, tongue resting; brow, eyes and scalp soft; shoulders dropping on each out-breath.</li>
  <li><strong>Slow breathing:</strong> 4 in, 6 out through the nose, small and quiet. Slower, not bigger.</li>
  <li><strong>Pauses:</strong> breathe in, then pause with a relaxed throat (never bearing down), and let go whenever you like. Plane: two-thirds full, up to 15 s. Train or ground: comfortably full, growing from 30 s to a minute. No empty-lung holds.</li>
</ul>
<h3>Why the pauses stay soft, and why no fast breathing</h3>
<ul>
  <li>Raised CO₂ widens the brain's blood vessels; headache from high CO₂ is a recognised diagnosis, and breath-holding divers get it ${ev.solid}. Pauses raise CO₂ a little, which might worsen a throbbing headache, so skip them if it does ${ev.spec}.</li>
  <li>Straining against a closed throat (Valsalva) is a known headache trigger, so pauses stay soft ${ev.solid}.</li>
  <li>Cabins are pressurised to about 1,800–2,400 m; oxygen saturation drops by around four points ${ev.solid}. Holds start lower and fall faster there, which is why the Plane setting is shorter.</li>
  <li>Over-breathing causes light-headedness and tingling that can feel like a migraine aura; it's simply avoided here ${ev.some}.</li>
</ul>
<h3>Does it help?</h3>
<ul>
  <li>For <strong>preventing</strong> migraine and tension-type headache, relaxation training and biofeedback are well supported, with moderate effects ${ev.solid}.</li>
  <li>For <strong>relief during</strong> a headache, there are no controlled trials. In the lab, slow breathing with a longer exhale reduced experimental pain a little ${ev.some}.</li>
  <li><strong>Inflammation:</strong> electrical vagus-nerve stimulation reduces inflammation in rheumatoid arthritis ${ev.solid}. Whether slow breathing engages the same pathway is inferred, not shown ${ev.spec}. One session won't change inflammation measurably; it can lower stress, and stress raises inflammatory signals ${ev.solid}.</li>
</ul>
<h3>Get help at once</h3>
<p>Tell the crew or call for help for a sudden severe headache that peaks within a minute, the worst headache of your life, or a headache with weakness, trouble speaking, vision loss, confusion, fever with a stiff neck, or after a head injury. A severe pain around one eye during landing is usually descent-related sinus pressure and tends to pass within 30 minutes.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Silberstein 2000 (US Headache Consortium), summarised in <a href="https://www.aafp.org/afp/2000/1115/p2359" target="_blank" rel="noopener">Am Fam Physician</a>; Nestoriuc &amp; Martin 2007, <a href="https://pubmed.ncbi.nlm.nih.gov/17084028" target="_blank" rel="noopener">biofeedback for migraine</a>, Pain; Bendtsen et al. 2010, <a href="https://pubmed.ncbi.nlm.nih.gov/20482606" target="_blank" rel="noopener">EFNS guideline</a>.</li>
  <li>Jafari et al. 2020, <a href="https://cris.maastrichtuniversity.nl/en/publications/can-slow-deep-breathing-reduce-pain-an-experimental-study-explori/" target="_blank" rel="noopener">Can slow deep breathing reduce pain?</a>, J Pain.</li>
  <li>ICHD-3 <a href="https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-3-diving-headache/" target="_blank" rel="noopener">10.1.3 diving headache</a> and <a href="https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-2-headache-attributed-to-aeroplane-travel/" target="_blank" rel="noopener">10.1.2 headache attributed to aeroplane travel</a>.</li>
  <li>Hampson et al. 2013, <a href="https://asma.kglmeridian.com/view/journals/asem/84/1/article-p27.xml" target="_blank" rel="noopener">cabin pressure altitudes</a>; Muhm et al. 2007, <a href="https://www.nejm.org/doi/full/10.1056/NEJMoa062770" target="_blank" rel="noopener">effect of aircraft-cabin altitude</a>, NEJM.</li>
  <li>Koopman et al. 2016, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4961187/" target="_blank" rel="noopener">vagus nerve stimulation in rheumatoid arthritis</a>, PNAS; Marsland et al. 2017, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5553449" target="_blank" rel="noopener">acute stress and inflammatory markers</a>.</li>
  <li>Do et al. 2019, <a href="https://doi.org/10.1212/WNL.0000000000006697" target="_blank" rel="noopener">SNNOOP10 headache red flags</a>, Neurology.</li>
</ul>`,
};
