// Training: Box (the tactical breath, then box breathing) and Cool-down (a post-workout
// downshift). Each has its own instructor (`voice`), designed with Gemini TTS: Leo for Box,
// Mira for Cool-down. A practice with a voice offers no Voice switch.
// Voice tags (<exhales>, <chuckle>, <sighs>) are placed by hand; captions and the other
// voices drop them.

import { line, say, tip, num, Num, SAFETY_HTML, ev } from './lib.js';

// ── Box ────────────────────────────────────────────────
const B = {
  welcome: line('box_welcome', 'Welcome. Sit tall, feet flat on the floor. Close your eyes, or rest them on a spot in front of you.'),
  plan: line('box_plan', "Here's the plan. Two drills. First, a long breath out, twice as long as the breath in. Then the box: in, hold, out, hold, all the same length. Nothing to win here. Just get the rhythm."),
  planNone: line('box_plan_none', "Here's the plan. No holds today. One drill: breathe out twice as long as you breathe in. The long breath out does most of the work."),
  empty: line('box_empty', 'Before we start, empty out. One long breath through the mouth. <exhales> Good.'),
  drillOne: say('Drill one. In through the nose for four, out for eight. Six breaths.'),
  layers: line('box_layers', 'On the way in, fill from the bottom. Belly, then ribs, then chest.', 'technique'),
  throat: line('box_throat', 'On the way out, narrow the back of the throat a little, so the air leaves slow and even.', 'technique'),
  lever: line('box_lever', "A long breath out can slow your heart a little. That's why we're lengthening it.", 'science'),
  stay: say('Stay with it. Ten more.'),
  in: line('box_in', 'Breathe in.'),
  hold: line('box_hold', 'Hold.'),
  out: line('box_out', 'Out.'),
  softHold: line('box_soft_hold', 'The holds are a pause, not a squeeze. Throat open, shoulders down.', 'technique'),
  where: line('box_where', "Police and military teach this one. It's easy to count, and you can do it without anyone noticing."),
  exact: tip('box_t_exact', "Don't chase the exact count. Just keep all four sides even."),
  study: line('box_study', 'In a month-long study, five minutes of box breathing a day eased anxiety about as much as the other breathing methods tested. Slowing down may be part of why it helps.', 'science'),
  lastOne: say('Last one.'),
  release: line('box_release', 'Let it go. Breathe however you like.'),
  check: line('box_check', 'Check how your shoulders, jaw, hands and head feel compared with before. Any change gives you a benchmark.'),
  close: line('box_close', 'Practise the drill on calm days so you can use it when things get stressful.'),
};
const boxIntro = (s) => say(`Drill two. The box. In, hold, out, hold. ${Num(s)} counts each side.`);
const boxUp = (s) => say(`Now ${num(s)} each side. Same shape, a little longer.`);
const BOX_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold' })[ph];
/** "In. Hold. Out. Hold." on the first `rounds` rounds of a box with sides of `s` seconds. */
const called = (s, rounds) =>
  Array.from({ length: rounds }, (_, i) => [
    { breath: i, say: B.in },
    { breath: i, offset: s, say: B.hold },
    { breath: i, offset: 2 * s, say: B.out },
    { breath: i, offset: 3 * s, say: B.hold },
  ]).flat();

export const box = {
  id: 'box',
  title: 'Box',
  titleHtml: '<em>Box</em>',
  tag: 'Training',
  moment: 'before',
  voice: 'leo',
  blurb: 'The tactical breath, then the box. Two drills to stay level under pressure.',
  lede: 'Two drills. A long breath out, twice the breath in. Then the box: in, hold, out, hold, all the same length. Train it on calm days so it is there on hard ones.',
  music: 'transit',
  accent: ['#cfd8e3', '#4a5d78'],
  sky: 'deep',
  intensity: ['none', 'gentle', 'standard', 'deeper'],
  intensityNotes: {
    none: 'No holds: the four-in, eight-out breath throughout.',
    gentle: 'A box of 3 counts a side, then 4.',
    standard: 'A box of 4 counts a side, then 5.',
    deeper: 'A box of 5 counts a side, then 6.',
  },
  after: ['Five minutes a day on calm days is how it becomes automatic on hard ones.', 'The four-in, eight-out breath works on its own: before a call, a talk, or a start line.'],
  sections: (opts) => {
    const arrive = {
      id: 'box-arrive',
      title: 'Arrive',
      what: 'The plan, one breath out',
      color: '#9fb1c8',
      steps: [{ say: B.welcome, bell: 'low', lead: 2 }, { say: opts.noHolds ? B.planNone : B.plan }, { say: B.empty }, { rest: 3 }],
    };
    const tactical = {
      id: 'box-tactical',
      title: 'Drill one',
      what: '4 in · 8 out, six breaths',
      color: '#7f95b3',
      steps: [
        { say: B.drillOne, gap: 0.6 },
        { pace: { inhale: 4, exhale: 8 }, count: 6, style: 'count', cues: [{ breath: 1, say: B.layers }, { breath: 3, say: B.throat }, { breath: 5, say: B.lever }] },
      ],
    };
    const close = {
      id: 'box-close',
      title: 'Debrief',
      what: 'Natural breathing, a quick check',
      color: '#b8c4d4',
      steps: [{ say: B.release, bell: 'bell' }, { rest: 15 }, { say: B.check }, { rest: 6 }, { say: B.close }, { rest: 4 }],
    };
    if (opts.noHolds) {
      const stay = {
        id: 'box-long',
        title: 'Long out',
        what: '4 in · 8 out, ten more',
        color: '#4a5d78',
        steps: [
          { say: B.stay, gap: 0.6 },
          { pace: { inhale: 4, exhale: 8 }, count: 10, style: 'count', cues: [{ breath: 2, say: B.where }, { breath: 5, say: B.exact }, { breath: 9, say: B.lastOne }] },
        ],
      };
      return [arrive, tactical, stay, close];
    }
    const [a, b] = opts.gentle ? [3, 4] : (opts.holdScale ?? 1) > 1 ? [5, 6] : [4, 5];
    const rounds = (s, secs) => Math.round(secs / (4 * s));
    const ra = rounds(a, 128);
    const rb = rounds(b, 120);
    const pace = (s) => ({ inhale: s, holdIn: s, exhale: s, holdOut: s });
    return [
      arrive,
      tactical,
      {
        id: 'box-a',
        title: 'The box',
        what: `${a}-${a}-${a}-${a}, ${ra} rounds`,
        color: '#5f7596',
        steps: [
          { say: boxIntro(a), gap: 0.6 },
          {
            pace: pace(a),
            count: ra,
            style: 'count',
            labels: BOX_LABELS,
            cues: [...called(a, 2), { breath: 3, say: B.softHold }, { breath: Math.min(5, ra - 2), say: B.where }, { breath: ra - 1, say: B.lastOne }],
          },
        ],
      },
      {
        id: 'box-b',
        title: 'Bigger box',
        what: `${b}-${b}-${b}-${b}, ${rb} rounds`,
        color: '#4a5d78',
        steps: [
          { say: boxUp(b), gap: 0.6 },
          { pace: pace(b), count: rb, style: 'count', labels: BOX_LABELS, cues: [{ breath: 1, say: B.exact }, { breath: 2, say: B.study }, { breath: rb - 1, say: B.lastOne }] },
        ],
      },
      close,
    ];
  },
  learn: `
<p>Two drills that police, military and first-responder courses teach for staying level under pressure. Trained on calm days, they're there when you need them.</p>
<h3>The technique</h3>
<ul>
  <li><strong>The tactical breath:</strong> in through the nose for 4, filling from the belly up; out for 8, slow and even. The long exhale does most of the work.</li>
  <li><strong>The box:</strong> in, hold, out, hold, all the same length. 4 counts a side, then 5 (Gentle 3 then 4; Deeper 5 then 6). A hold is a pause, not a squeeze: throat open, shoulders loose.</li>
  <li>No holds runs the tactical breath throughout. It loses little, since the evidence doesn't show the holds adding much.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>A long exhale slows the heart a little on every breath, and slow breathing reliably shifts the body toward its "rest" state ${ev.solid}.</li>
  <li>In a month-long trial, five minutes a day of box breathing (5-5-5-5) reduced anxiety about as much as cyclic sighing and mindfulness. Cyclic sighing lifted mood the most ${ev.some}.</li>
  <li>That the holds add anything beyond a slow, long exhale isn't shown. Its strengths are that it's easy to remember and to count, and easy to do unnoticed ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">breathwork and stress: meta-analysis of RCTs</a>, Sci Rep.</li>
</ul>`,
};

// ── Cool-down ──────────────────────────────────────────
const C = {
  welcome: line('cd_welcome', "Welcome. You've done the work. Now we bring it down."),
  setup: line('cd_setup', 'Lie on your back and rest your calves on a chair or a bench, knees and hips bent at right angles. No chair? Just lie flat.'),
  free: line('cd_free', 'For the first minute, breathe however you need to. Mouth is fine. Let the panting settle on its own.'),
  sigh: line('cd_sigh', "If a big sigh wants to come out, let it. <sighs> That's allowed."),
  heavy: tip('cd_t_heavy', 'Let the floor take your weight. Heels heavy, hands open.'),
  stepOne: say('In through the nose for four, out through the mouth for six. Six breaths.'),
  low: line('cd_low', 'Breathe low. Let the belly rise. The chest can stay quiet.', 'technique'),
  stepTwo: say('Now stretch the breath out. Four in, eight out.'),
  why: line('cd_why', 'A long breath out can slow your heart a little. It helps your body settle after training.', 'science'),
  jaw: tip('cd_t_jaw', 'Unclench the jaw. Let the tongue rest.'),
  nose: line('cd_nose', 'If it feels easy now, close your mouth. Nose in, nose out.', 'technique'),
  study: line('cd_study', "In a small lab study, slow breathing after cycling brought heart rate down faster than just resting. A bigger trial found no boost to the training itself. So this is for coming down, not for gains.", 'science'),
  twoMore: say('Two more.'),
  quiet: line('cd_quiet', "I'll stop talking now. Keep the long breath out, and follow the circle."),
  ret: line('cd_return', 'Let go of the count. Breathe on your own.'),
  check: line('cd_check', 'Check your heart rate, breath and head. Notice if anything settled.'),
  up: line('cd_up', 'Take your legs down, roll onto your side, and get up slowly. Blood pressure can dip after this.'),
  close: line('cd_close', "That's the cool-down. Water, food and sleep help you recover from training."),
};

export const coolDown = {
  id: 'cool-down',
  title: 'Cool-down',
  titleHtml: 'Cool-<em>down</em>',
  tag: 'Training',
  moment: 'after',
  voice: 'mira',
  blurb: 'After training: legs up, long breaths out, then quiet.',
  lede: 'For straight after training. Legs up, let the panting settle, then long breaths out that bring the heart rate down, and a couple of quiet minutes.',
  music: 'tide',
  accent: ['#d8efe4', '#3f8f7a'],
  sky: 'calm',
  after: ['Make it the last thing in every session, not just the hard ones.', 'Get up slowly; blood pressure can dip after slow breathing with the legs raised.'],
  sections: [
    {
      id: 'cd-settle',
      title: 'Settle',
      what: 'Legs up, breathe as you need',
      color: '#8fcfb8',
      steps: [
        { say: C.welcome, bell: 'low', lead: 2 },
        { say: C.setup },
        { say: C.free },
        { rest: 60, cues: [{ at: 18, say: C.sigh }, { at: 40, say: C.heavy }] },
      ],
    },
    {
      id: 'cd-shift',
      title: 'Downshift',
      what: '4 in · 6 out, six breaths',
      color: '#6bbaa0',
      steps: [
        { say: C.stepOne, gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count', cues: [{ breath: 2, say: C.low }] },
      ],
    },
    {
      id: 'cd-long',
      title: 'Long out',
      what: '4 in · 8 out, fifteen breaths',
      color: '#4fa58a',
      steps: [
        { say: C.stepTwo, gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 8 },
          count: 15,
          style: 'count',
          cues: [
            { breath: 1, say: C.why },
            { breath: 4, say: C.jaw },
            { breath: 7, say: C.nose },
            { breath: 10, say: C.study },
            { breath: 13, say: C.twoMore },
          ],
        },
      ],
    },
    {
      id: 'cd-quiet',
      title: 'Quiet',
      what: '4 in · 8 out, no talking',
      color: '#3f8f7a',
      steps: [{ say: C.quiet, gap: 0.8 }, { pace: { inhale: 4, exhale: 8 }, count: 10, style: 'slow' }],
    },
    {
      id: 'cd-return',
      title: 'Return',
      what: 'Natural breathing, get up slowly',
      color: '#a9d6c6',
      steps: [{ say: C.ret, bell: 'bell' }, { rest: 20 }, { say: C.check }, { rest: 6 }, { say: C.up }, { rest: 3 }, { say: C.close }, { rest: 4 }],
    },
  ],
  learn: `
<p>A downshift for straight after training: legs up, let the breath settle, then slow breathing with a long exhale, and a couple of minutes with no voice at all.</p>
<h3>The technique</h3>
<ul>
  <li>Lie on your back with your calves on a chair or bench, hips and knees at about 90°, or lie flat.</li>
  <li>First minute: breathe however you need to. Then in through the nose for 4, out through the mouth for 6; then 4 in, 8 out, moving to the nose as it gets easy.</li>
  <li>Get up slowly at the end: roll to your side first.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>A long exhale slows the heart a little on every breath, and slow breathing shifts the body toward its "rest" state ${ev.solid}.</li>
  <li>In a small lab study, breathing at six a minute after cycling brought heart rate down faster over five minutes than sitting or easy pedalling ${ev.some}.</li>
  <li>A randomized trial that added daily slow breathing to four weeks of sprint training found no extra benefit for performance, HRV or sleep. Use it to come down, not to train harder ${ev.spec}.</li>
  <li>Between hard intervals, hands on the knees beat hands on the head for heart-rate recovery in one small study ${ev.some}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Zumbro et al. 2019, <a href="https://scholars.georgiasouthern.edu/en/publications/the-influence-of-a-slow-breathing-protocol-on-heart-rate-and-bloo/" target="_blank" rel="noopener">a slow-breathing protocol and heart rate and blood pressure after exercise</a>.</li>
  <li>Raidl et al., <a href="https://www.sponet.de/sponet/Record/4098152?lng=en" target="_blank" rel="noopener">no evidence for slow-paced breathing as a recovery strategy after sprint interval training</a>.</li>
  <li>Michaelson et al. 2019, hands-on-knees vs hands-on-head recovery between intervals, Transl J Am Coll Sports Med: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Michaelson+2019+recovery+posture+hands+on+knees" target="_blank" rel="noopener">PubMed search</a>.</li>
</ul>`,
};
