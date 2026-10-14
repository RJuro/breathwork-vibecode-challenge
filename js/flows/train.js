// Training: Box (the tactical breath, then box breathing) and Cool-down (a post-workout
// downshift). Each has its own instructor (`voice`), designed with Gemini TTS: Leo for Box,
// Mira for Cool-down. A practice with a voice offers no Voice switch.
// Voice tags (<exhales>, <chuckle>, <sighs>) are placed by hand; captions and the other
// voices drop them.

import { line, say, tip, lesson, num, Num, callsFor, SAFETY_HTML, ev } from './lib.js';

const LEO = callsFor('leo');
const MIRA = callsFor('mira');

// ── Box ────────────────────────────────────────────────
export const B = {
  welcome: line('box_welcome', 'Welcome. Sit tall, feet flat on the floor. Close your eyes, or rest them on a spot in front of you.'),
  plan: line('box_plan2', "Two drills today. First, a longer breath out. Then equal counts for breathing in, holding, breathing out and pausing empty."),
  planNone: line('box_plan_none2', "No holds today. We'll breathe out twice as long as we breathe in, with a break between sequences."),
  permission: line('box_permission', 'Stay seated or lying down, never in water. Breathe whenever you need to, and stop if you feel dizzy or unwell.'),
  permissionNone: line('box_permission_none', 'Keep the breaths comfortable. If the pace feels too slow, breathe normally instead.'),
  drillOne: say('Drill one. In through the nose for four, out for eight. Six breaths.'),
  layers: line('box_layers2', 'Expand your ribs.', 'technique'),
  throat: line('box_throat2', 'Narrow the back of your throat a little, so the air leaves evenly.', 'technique'),
  lever: line('box_lever2', "A long breath out can slow your heart a little. We're lengthening it.", 'science'),
  stay: say('Back to four in, eight out. Ten breaths.'),
  hold: line('box_hold', 'Hold.', 'count'),
  softHold: line('box_soft_hold', 'The holds are a pause, not a squeeze. Throat open, shoulders down.', 'technique'),
  where: line('box_where', "Police and military teach this one. It's easy to count, and you can do it without anyone noticing."),
  exact: tip('box_t_exact', "Don't chase the exact count. Just keep all four sides even."),
  study: lesson('box_study2', "A month-long study had people do five minutes of box breathing a day. I'll tell you what it found over the next few holds."),
  evenOut: tip('box_t_even_out', 'Let the air leave evenly, without forcing it.'),
  lastA: say('Last round.'),
  lastOne: say('Last one.'),
  breakOne: line('box_break_1', 'Let the count go for a few breaths. Breathe at your own pace.'),
  leadA: line('box_lead_a', 'One breath in with me, all the way out, and the box starts on the next breath in.'),
  breakTwo: line('box_break_2', 'Breathe on your own for a moment. The next box is a little bigger.'),
  leadB: line('box_lead_b', 'Once more: in together, all the way out, then the bigger box.'),
  release: line('box_release', 'Let it go. Breathe however you like.'),
  check: line('box_check', 'Check how your shoulders, jaw, hands and head feel compared with before. Any change gives you a benchmark.'),
  close: line('box_close', 'Practise the drill on calm days so you can use it when things get stressful.'),
};
const boxIntro = (s) => say(`Drill two. The box. In, hold, out, hold. ${Num(s)} counts each side.`);
const boxUp = (s) => say(`Now ${num(s)} each side. Same shape, a little longer.`);
const BOX_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold' })[ph];
// One connected explanation, one short sentence per consecutive full hold.
const BOX_THREAD = [
  lesson('box_study_anxiety', "They reported less anxiety."),
  lesson('box_study_comparison', "Other methods did as well."),
  lesson('box_study_pace', "Maybe it's just the pace."),
  lesson('box_study_holds', "Nobody tested the holds on their own."),
];

export const box = {
  id: 'box',
  title: 'Box',
  titleHtml: '<em>Box</em>',
  tag: 'Training',
  moment: 'before',
  voice: 'leo',
  blurb: 'The tactical breath, then the box. Two drills to stay level under pressure.',
  lede: 'Two drills. A long breath out, twice the breath in. Then the box: in, hold, out, hold, all the same length. Train it on calm days so it is there on hard ones.',
  music: ['focus'],
  accent: ['#cfd8e3', '#4a5d78'],
  sky: 'deep',
  intensity: ['none', 'gentle', 'standard', 'deeper'],
  intensityNotes: {
    none: 'No holds: the four-in, eight-out breath throughout.',
    gentle: 'A box of 3 counts a side, then 4.',
    standard: 'A box of 4 counts a side, then 5.',
    deeper: 'A box of 5 counts a side, then 6.',
  },
  after: ['A few minutes on calm days can make the rhythm more familiar under pressure.', 'The four-in, eight-out breath works on its own: before a call, a talk, or a start line.'],
  sections: (opts) => {
    const arrive = {
      id: 'box-arrive',
      title: 'Arrive',
      what: 'The plan, comfortable breathing',
      color: '#9fb1c8',
      steps: [{ say: B.welcome, bell: 'low', lead: 2 }, { say: opts.noHolds ? B.planNone : B.plan }, { say: opts.noHolds ? B.permissionNone : B.permission }, { rest: 3 }],
    };
    const tactical = {
      id: 'box-tactical',
      title: 'Drill one',
      what: '4 in · 8 out, six breaths',
      color: '#7f95b3',
      steps: [
        { say: B.drillOne, gap: 0.6 },
        { pace: { inhale: 4, exhale: 8 }, count: 6, style: 'count', calls: LEO, cues: [{ breath: 0, phase: 'in', say: B.layers }, { breath: 3, phase: 'out', say: B.throat }, { breath: 5, phase: 'out', say: B.lever }] },
      ],
    };
    const close = {
      id: 'box-close',
      title: 'Debrief',
      what: 'Natural breathing, a quick check',
      color: '#b8c4d4',
      steps: [{ say: B.release, bell: 'bell' }, { rest: 15 }, { say: B.check }, { rest: 6 }, { say: B.close }, { rest: 4 }],
    };
    const breather = (id, line, extra = []) => ({ id, title: 'Own pace', what: 'Twenty seconds', color: '#b8c4d4', steps: [{ rest: 20, label: 'Your own pace', cues: [{ at: 0.5, say: line }, ...extra] }] });
    if (opts.noHolds) {
      const stay = {
        id: 'box-long',
        title: 'Long out',
        what: '4 in · 8 out, ten more',
        color: '#4a5d78',
        steps: [
          { say: B.stay, gap: 0.6 },
          { pace: { inhale: 4, exhale: 8 }, count: 10, style: 'count', calls: LEO, cues: [{ breath: 5, phase: 'out', say: B.evenOut }, { breath: 8, phase: 'out', say: B.lastOne }] },
        ],
      };
      return [arrive, tactical, breather('box-break-1', B.breakOne), stay, close];
    }
    const [a, b] = opts.gentle ? [3, 4] : (opts.holdScale ?? 1) > 1 ? [5, 6] : [4, 5];
    const rounds = (s, secs) => Math.round(secs / (4 * s));
    const ra = rounds(a, 128);
    const rb = rounds(b, 120);
    const pace = (s) => ({ inhale: s, holdIn: s, exhale: s, holdOut: s });
    // One breath together, all the way out; the box starts on the next breath in.
    const leadIn = (s) => ({ pace: { inhale: s, exhale: 2 * s }, count: 1, style: 'count', calls: LEO });
    return [
      arrive,
      tactical,
      breather('box-break-1', B.breakOne),
      {
        id: 'box-a',
        title: 'The box',
        what: `${a}-${a}-${a}-${a}, ${ra} rounds`,
        color: '#5f7596',
        steps: [
          { say: boxIntro(a), gap: 0.6 },
          // This shared line is too long for a three-second hold; explain it before pacing.
          { say: B.softHold, gap: 0.6 },
          { say: B.exact, gap: 0.6 },
          { say: B.leadA, gap: 0.6 },
          leadIn(a),
          {
            pace: pace(a),
            count: ra,
            style: 'count',
            labels: BOX_LABELS,
            calls: LEO,
            endOnHold: true,
            cues: [{ breath: ra - 2, phase: 'bottom', say: B.lastA }],
          },
        ],
      },
      breather('box-break-2', B.breakTwo, [{ at: 8, say: B.where }]),
      {
        id: 'box-b',
        title: 'Bigger box',
        what: `${b}-${b}-${b}-${b}, ${rb} rounds`,
        color: '#4a5d78',
        steps: [
          { say: boxUp(b), gap: 0.6 },
          { say: B.study, gap: 0.6 },
          { say: B.leadB, gap: 0.6 },
          leadIn(b),
          {
            pace: pace(b), count: rb, style: 'count', labels: BOX_LABELS,
            // The short Hold call leaves room even in Gentle's four-second full holds.
            calls: (phase, breath) => phase === 'top' && breath < BOX_THREAD.length ? B.hold : LEO(phase, breath),
            endOnHold: true,
            cues: [...BOX_THREAD.map((say, breath) => ({ breath, phase: 'top', say })), { breath: rb - 2, phase: 'bottom', say: B.lastOne }],
          },
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
  sigh: line('cd_sigh2', "If a sigh comes naturally, let it happen. You don't need to make one."),
  heavy: tip('cd_t_heavy', 'Let the floor take your weight. Heels heavy, hands open.'),
  stepOne: say('The next breath in starts six breaths: nose in for four, mouth out for six.'),
  low: line('cd_low2', "Let your belly move as you breathe. There's no need for a big breath.", 'technique'),
  permission: line('cd_permission', "If you're still panting, keep breathing at your own pace. You can leave the count whenever you need to."),
  interval: line('cd_interval', 'Take twenty seconds at your own pace. Then we can try a longer breath out.'),
  stepTwo: say('Now stretch the breath out. Four in, eight out.'),
  why: line('cd_why2', "Your heart rate often slows during an exhale. We're extending that breath out.", 'science'),
  jaw: tip('cd_t_jaw', 'Unclench the jaw. Let the tongue rest.'),
  nose: line('cd_nose2', "Let this breath leave through your nose, if it's comfortable.", 'technique'),
  noseIn: line('cd_nose_in', 'Nose in.', 'technique'),
  study: line('cd_study2', 'A small cycling study tested slow breathing just after exercise.', 'science'),
  studyResult: line('cd_study_result', 'Heart rate fell faster than with rest alone. Only nine people took part.', 'science'),
  studyLink: line('cd_study_link', 'That tells us about the minutes after exercise, rather than later training gains.', 'science'),
  studyTraining: line('cd_study_training', 'A larger trial added daily slow breathing to four weeks of sprint training.', 'science'),
  studyLimit: line('cd_study_limit', "It found no extra performance gains, so don't count on this improving your training.", 'science'),
  twoMore: say('Two more.'),
  quiet: line('cd_quiet2', "Two quiet minutes now. Breathe at your own pace, and let the breath out stay easy."),
  ret: line('cd_return2', "Stay lying here a little longer. Notice how you're breathing now."),
  check: line('cd_check', 'Check your heart rate, breath and head. Notice if anything settled.'),
  up: line('cd_up', 'Take your legs down, roll onto your side, and get up slowly. Blood pressure can dip after this.'),
  close: line('cd_close2', 'Give yourself time for water and food after this. Sleep matters for recovery too.'),
};

export const coolDown = {
  id: 'cool-down',
  title: 'Cool-down',
  titleHtml: 'Cool-<em>down</em>',
  tag: 'Training',
  moment: 'after',
  voice: 'mira',
  blurb: 'After training: legs up, long breaths out, then quiet.',
  lede: 'For straight after training. Legs up, let the panting settle, then comfortable longer breaths out, and two quiet minutes at your own pace.',
  music: ['terrace', 'night'],
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
        { rest: 60, label: 'Your own pace', cues: [{ at: 18, say: C.sigh }, { at: 28, say: C.low }, { at: 40, say: C.heavy }, { at: 48, say: C.permission }] },
      ],
    },
    {
      id: 'cd-shift',
      title: 'Downshift',
      what: '4 in · 6 out, six breaths',
      color: '#6bbaa0',
      steps: [
        { say: C.stepOne, gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count', calls: MIRA },
      ],
    },
    {
      id: 'cd-break', title: 'Own pace', what: 'Twenty seconds, no counts', color: '#a9d6c6',
      steps: [{ rest: 20, label: 'Your own pace', cues: [{ at: 0.5, say: C.interval }] }],
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
          calls: MIRA,
          cues: [
            { breath: 1, phase: 'out', say: C.why },
            { breath: 3, phase: 'out', say: C.jaw },
            { breath: 5, phase: 'out', say: C.nose },
            { breath: 6, phase: 'in', say: C.noseIn },
            // No holds here: the explanation runs over five consecutive out-breaths.
            ...[C.study, C.studyResult, C.studyLink, C.studyTraining, C.studyLimit].map((say, i) => ({ breath: 8 + i, phase: 'out', say })),
            { breath: 13, phase: 'in', say: C.twoMore },
          ],
        },
      ],
    },
    {
      id: 'cd-quiet',
      title: 'Quiet',
      what: 'Two minutes at your own pace, no talking',
      color: '#3f8f7a',
      steps: [{ say: C.quiet, gap: 0.8 }, { rest: 120, label: 'Your own pace' }],
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
  <li>First minute: breathe however you need to. Join the counts only once breathing feels easy. Then in through the nose for 4, out through the mouth for 6; take twenty seconds at your own pace before 4 in, 8 out, moving to the nose as it gets easy.</li>
  <li>Finish with two quiet minutes of natural breathing. Leave the count whenever you need to.</li>
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
