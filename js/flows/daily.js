// Everyday practices: Ready and Resonance (Leo) before something; Between Sets (Mira) during
// training; Lights Out (Mira) at bedtime; and the breathe-light set: Breath Check and Breathe
// Light (Leo), Steady (Mira). Practices with their own level keys read `opts.level`.

import { line, say, tip, lesson, num, callsFor, SAFETY_HTML, ev } from './lib.js';
import { B } from './train.js';

const LEO = callsFor('leo');
const MIRA = callsFor('mira');
const BOX_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold' })[ph];
const SMALL = { inhale: 2.2, exhale: 2.5 };

// ── Ready ──────────────────────────────────────────────
const RY = {
  welcome: line('ready_welcome', "Okay. Let's get you level."),
  desk: line('ready_plan_desk2', 'Sit tall, feet flat, eyes on one spot.'),
  stage: line('ready_plan_stage2', 'Sit tall. We finish with three hums for your voice.'),
  start: line('ready_plan_start2', 'Stand easy, eyes open. No holds before a start.'),
  sigh: line('ready_sigh', 'Two sighs. Breathe in through your nose, top it up with a second short sniff, then let it all go slowly through your mouth.', 'technique'),
  long: say('Four in, eight out. Five breaths.'),
  between: line('ready_between', 'Breathe at your own pace here, low into your belly.'),
  beforeBox: line('ready_before_box', 'Take a few ordinary breaths before the box.'),
  beforeEven: line('ready_before_even', 'Stay with your own breathing for a few seconds. Then an easier pace.'),
  permission: line('ready_permission', 'Breathe whenever you need to. Stay seated for the holds, and never practise them in water.'),
  lead: line('ready_lead', 'Breathe in together, then all the way out. Next breath starts the box.'),
  beforeHum: line('ready_before_hum', 'Let your breathing find its own pace before the hums.'),
  why: lesson('ready_why2', 'Your heart usually slows a little on the breath out.'),
  settle: lesson('ready_settle', 'A few slow breaths may help you settle before you start.'),
  box: say('The box. Four counts a side. Three rounds.'),
  even: say('Four in, six out. Six breaths.'),
  eyes: line('ready_eyes2', 'Keep your gaze steady.'),
  hum: line('ready_hum', 'Three hums. Lips closed, teeth apart, and hum at an easy pitch on the way out. It warms up your voice.', 'technique'),
  first: line('ready_first2', "Open your eyes and breathe freely. Picture the first thing you'll do or say."),
  go: say('Go.'),
};

export const ready = {
  id: 'ready',
  title: 'Ready',
  titleHtml: '<em>Ready</em>',
  tag: 'Focus',
  moment: 'before',
  voice: 'leo',
  blurb: 'A few minutes before a talk, an exam or a start line.',
  lede: 'A short routine for the minutes before something that matters: two sighs, long breaths out, a few rounds of box breathing, and one clear first step. Short enough to use in a corridor.',
  music: ['focus', 'midnight', 'keys'],
  accent: ['#e6dcc8', '#8a6a3c'],
  sky: 'deep',
  intensity: ['desk', 'stage', 'start'],
  levelNames: { desk: 'Desk', stage: 'Stage', start: 'Start line' },
  intensityNotes: {
    desk: 'About 4 minutes. An exam, an interview, a hard call. Seated.',
    stage: 'About 5 minutes. Before you speak or perform: adds three hums for the voice.',
    start: 'About 3½ minutes. Standing, eyes open, no holds. Before a race or a game.',
  },
  defaultLevel: 'desk',
  after: ['Run it on calm days too. A routine you have rehearsed is one you can use under pressure.'],
  sections: (opts) => {
    const mode = opts.level in { stage: 1, start: 1 } ? opts.level : 'desk';
    const box = {
      id: 'deep-box',
      title: mode === 'start' ? 'Even' : 'Box',
      what: mode === 'start' ? '4 in · 6 out, six breaths' : '4-4-4-4, three rounds',
      color: '#7a6a8f',
      steps:
        mode === 'start'
          ? [{ rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.beforeEven }] }, { say: RY.even, gap: 0.6 }, { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count', calls: LEO, cues: [{ breath: 2, phase: 'out', say: RY.eyes }] }]
          : [
              { rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.beforeBox }] },
              { say: RY.box, gap: 0.6 },
              { say: B.softHold, gap: 0.6 },
              { say: RY.lead, gap: 0.6 },
              { pace: { inhale: 4, exhale: 4 }, count: 1, style: 'count', calls: LEO },
              {
                pace: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
                count: 3,
                style: 'count',
                labels: BOX_LABELS,
                calls: LEO,
                endOnHold: true,
              },
            ],
    };
    return [
      {
        id: 'deep-arrive',
        title: 'Plan',
        what: 'Posture, the routine',
        color: '#c9b48f',
        steps: [{ say: RY.welcome, bell: 'low', lead: 1 }, { say: RY[mode] }, ...(mode === 'start' ? [] : [{ say: RY.permission }])],
      },
      {
        id: 'calm-sighs',
        title: 'Sighs',
        what: 'Two double breaths in, long out',
        color: '#b39a72',
        steps: [{ say: RY.sigh, gap: 0.5 }, { pace: { inhale: 2.5, inhale2: 1.5, exhale: 6 }, count: 2, style: 'slow', calls: (ph, i) => ph === 'in2' ? say('More.') : LEO(ph, i) }],
      },
      {
        id: 'calm-long',
        title: 'Long out',
        what: '4 in · 8 out, five breaths',
        color: '#9a8058',
        steps: [{ rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.between }] }, { say: RY.long, gap: 0.6 }, { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', calls: LEO, cues: [{ breath: 2, phase: 'out', say: RY.why }, { breath: 3, phase: 'out', say: RY.settle }] }],
      },
      box,
      ...(mode === 'stage'
        ? [{ id: 'hum-ready', title: 'Hums', what: 'Three, for the voice', color: '#c88aa8', steps: [{ rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.beforeHum }] }, { say: RY.hum, gap: 0.6 }, { pace: { inhale: 4, exhale: 8, hum: true }, count: 3, style: 'hum', calls: (ph, i) => ph === 'hum' ? say('And hum.') : LEO(ph, i) }] }]
        : []),
      {
        id: 'close',
        title: 'Go',
        what: 'Eyes open, first step',
        color: '#d9c49c',
        steps: [{ say: RY.first, bell: 'bell' }, { rest: 6 }, { say: RY.go }, { rest: 2 }],
      },
    ];
  },
  learn: `
<p>A routine of about four minutes (five with the Stage hums) for just before something that matters. It aims to bring your arousal down a notch without slowing you down, and ends on an action: the first thing you'll do.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Two sighs:</strong> in through the nose, a second short sniff on top, a long, slow breath out through the mouth.</li>
  <li><strong>Long out:</strong> 4 in, 8 out, five breaths, low in the belly.</li>
  <li><strong>Box:</strong> 4 in, 4 hold, 4 out, 4 hold, three rounds. Start line swaps it for 4 in, 6 out, with eyes open and no holds. Stage adds three low hums to warm up the voice.</li>
  <li>Rehearse it on calm days. You won't reach for a routine under pressure unless you've trained it.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>A long exhale slows the heart a little on every breath ${ev.solid}.</li>
  <li>Slow breathing before a stressful task lowers anxiety a little in studies ${ev.some}.</li>
  <li>That this particular mix beats any one of its parts hasn't been tested ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
  <li>Zaccaro et al. 2018, <a href="https://doi.org/10.3389/fnhum.2018.00353" target="_blank" rel="noopener">systematic review on slow breathing</a>, Front Hum Neurosci.</li>
</ul>`,
};

// ── Between Sets ───────────────────────────────────────
const BS = {
  knees: line('bs_knees', 'Hands on your knees. Mouth open, and let your breathing do what it needs.'),
  nose: line('bs_nose2', 'Follow the next breath in through your nose, then out through your mouth. Or keep breathing freely.'),
  noseOnly: line('bs_nose_only2', 'Breathe at your own pace here. Next, nose only if that feels easy.'),
  why: line('bs_why', 'In one small study of soccer players, heart rate came down faster with hands on knees than with hands on head.', 'science'),
  ten: say('Ten seconds. Stand up.'),
  go: say('Go.'),
};
/** Fixed total seconds, mixed breaths, nose-only breaths. Speech stays inside the timer. */
const BS_PLAN = { r60: [60, 2, 0], r90: [90, 2, 2], r120: [120, 4, 3], r180: [180, 6, 6] };

export const betweenSets = {
  id: 'between-sets',
  title: 'Between Sets',
  titleHtml: 'Between <em>sets</em>',
  tag: 'Training',
  moment: 'after',
  voice: 'mira',
  blurb: 'A rest timer that brings the breath down between hard efforts.',
  lede: 'Tap Begin when you finish a set. Hands on knees, let the breath run, then slow it down through the nose. Ten seconds before the end you stand up. Tap Again for the next rest.',
  music: false,
  noLog: true,
  accent: ['#d8efe4', '#3f8f7a'],
  sky: 'calm',
  intensity: ['r60', 'r90', 'r120', 'r180'],
  levelNames: { r60: '1:00', r90: '1:30', r120: '2:00', r180: '3:00' },
  intensityNotes: { r60: 'One-minute rests.', r90: 'Ninety-second rests.', r120: 'Two-minute rests.', r180: 'Three-minute rests, for heavy sets.' },
  defaultLevel: 'r90',
  after: ['Tap Again for the next rest.', 'Finish the session with the Cool-down.'],
  sections: (opts) => {
    const [seconds, mixed, nose] = BS_PLAN[opts.level] || BS_PLAN.r90;
    const free = seconds - 10 * (mixed + nose) - (nose ? 8 : 0) - 10;
    return [
      {
        id: 'calm-rest',
        title: 'Rest',
        what: 'Hands on knees, then slow it down',
        color: '#6bbaa0',
        steps: [
          { rest: free, label: 'Your own pace', bell: 'low', cues: [
            { at: 0.3, say: BS.knees },
            ...(nose ? [{ at: 8, say: BS.why }] : []),
            { at: free - 9, say: BS.nose },
          ] },
          { pace: { inhale: 4, exhale: 6 }, count: mixed, style: 'count', calls: MIRA },
          ...(nose ? [
            { rest: 8, label: 'Your own pace', cues: [{ at: 0, say: BS.noseOnly }] },
            { pace: { inhale: 4, exhale: 6 }, count: nose, style: 'count', calls: MIRA },
          ] : []),
          { rest: 9, label: 'Get set', cues: [{ at: 0, say: BS.ten }] },
          { rest: 1, bell: 'bell', cues: [{ at: 0, say: BS.go }] },
        ],
      },
    ];
  },
  learn: `
<p>A rest timer for intervals and strength sets. Tap Begin when you finish a set; the voice takes you from panting to slow nose breathing and stands you up ten seconds before the next one.</p>
<h3>The technique</h3>
<ul>
  <li>Hands on knees, back rounded. Let the breath run free through the mouth for the first stretch: right after a hard effort your body needs big breaths.</li>
  <li>Then in through the nose and a long breath out through the mouth, 4 in, 6 out. Then nose only, if it's easy.</li>
  <li>No holds between sets.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Hands on knees gave faster heart-rate recovery than hands on head between hard intervals in one small study ${ev.some}.</li>
  <li>Slow breathing between squat sets sped heart-rate recovery in a small study, with no effect on power or speed in the next set ${ev.some}.</li>
  <li>So it can help you come down faster and calmer; it won't make the next set stronger ${ev.spec}.</li>
</ul>
<p>Stop and get help for chest pain or unusual breathlessness.</p>
<h3>Sources</h3>
<ul class="sources">
  <li>Michaelson et al. 2019, hands-on-knees vs hands-on-head recovery between intervals, Transl J Am Coll Sports Med: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Michaelson+2019+recovery+posture+hands+on+knees" target="_blank" rel="noopener">PubMed search</a>.</li>
  <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11307190/" target="_blank" rel="noopener">4-7-8 breathing between squat sets</a>, J Hum Kinet 2024.</li>
</ul>`,
};

// ── Resonance ──────────────────────────────────────────
const RS = {
  welcome: line('res_welcome', 'Welcome. Sit back, let your hands rest, and close your eyes.'),
  plan: line('res_plan', 'This is resonance breathing: slow, easy breaths at one steady pace, for about ten minutes. No holds.'),
  findPlan: line('res_find_plan', 'This is a pace test. Five slow paces, two minutes each, with a minute of normal breathing in between. After each one, notice how it felt: smooth and easy, hungry for air, or lightheaded. If a pace makes you lightheaded, stop following it and just breathe.'),
  ease: say("Let's ease in. Four in, five out."),
  small: line('res_small', "Slow doesn't mean big. Keep each breath small and smooth.", 'technique'),
  nose: tip('res_t_nose2', "Use your nose if it's easy."),
  light: line('res_light', 'If you feel lightheaded, make the breaths smaller, or stop following the pace for a bit.'),
  waves: [
    lesson('res_waves_1', "Your heart rate is following your breathing right now."),
    lesson('res_waves_2', "Now it's rising."),
    lesson('res_waves_3', "And now it's slowing down again."),
    lesson('res_waves_4', "Slow breathing makes that swing bigger."),
    lesson('res_waves_5', "With practice, some studies find less stress."),
  ],
  wander: tip('res_t_wander2', 'Bring your attention to this exhale.'),
  gadget: [
    lesson('res_gadget_1', "That swing is called heart rate variability."),
    lesson('res_gadget_2', "One study had people breathe at six a minute."),
    lesson('res_gadget_3', "Some had a heart-rate monitor to follow, some didn't."),
    lesson('res_gadget_4', "Their variability rose about the same either way."),
    lesson('res_gadget_5', "So you don't need a monitor for this."),
  ],
  quiet: line('res_quiet2', 'Only the breath calls from here.'),
  ret: line('res_return', 'Let the pace go, and breathe on your own.'),
  close: line('res_close', 'Open your eyes when you like. Ten minutes a day is a good start, and more is fine if you enjoy it.'),
  rate: [
    line('res_rate2', 'Breathe at your own pace for a minute. Was that pace smooth, hungry for air, or lightheaded? Remember it.'),
    line('res_rate_2b', 'Let the counts go for this rest. Remember whether that pace felt easy or strained.'),
    line('res_rate_3b', 'Back to ordinary breathing. Notice how that one sat with you before we slow down again.'),
    line('res_rate_4b', 'Another minute without counts. Keep that pace in mind. One more to go, the slowest.'),
  ],
  slower: line('res_slower', 'At these slower paces, keep the breaths small and easy.', 'technique'),
  pick: line('res_pick2', 'Breathe freely now. Pick the pace that felt smoothest, without straining or feeling lightheaded. Choose it above the Begin button next time. Test again in a few weeks, because it can shift.'),
};
/** Pace per level: [in, out] seconds, the rate as spoken, and as written. */
const PACES = {
  p65: [3.7, 5.5, 'Six and a half', '6.5'],
  p60: [4, 6, 'Six', '6'],
  p55: [4.4, 6.5, 'Five and a half', '5.5'],
  p50: [4.8, 7.2, 'Five', '5'],
  p45: [5.3, 8, 'Four and a half', '4.5'],
};
const cycle = ([i, o]) => i + o;

export const resonance = {
  id: 'resonance',
  title: 'Resonance',
  titleHtml: '<em>Resonance</em>',
  tag: 'Calm',
  moment: 'before',
  voice: 'leo',
  blurb: 'Slow, light breathing at one steady pace. Find the pace that suits you.',
  lede: 'Six slow, light breaths a minute suits most people, and it is one of the best-studied calming practices. Run Find your pace once to try five paces, then practise at the one that felt smoothest.',
  music: ['focus'],
  accent: ['#d6e4f0', '#4f6f8f'],
  sky: 'calm',
  intensity: ['find', 'p65', 'p60', 'p55', 'p50', 'p45'],
  levelNames: { find: 'Find', p65: '6.5', p60: '6', p55: '5.5', p50: '5', p45: '4.5' },
  intensityNotes: {
    find: 'Find your pace: five paces, two minutes each. About fifteen minutes.',
    p65: '6.5 breaths a minute: 3.7 in, 5.5 out.',
    p60: '6 breaths a minute: 4 in, 6 out. Where most people start.',
    p55: '5.5 breaths a minute: 4.4 in, 6.5 out.',
    p50: '5 breaths a minute: 4.8 in, 7.2 out.',
    p45: '4.5 breaths a minute: 5.3 in, 8 out. Keep the breaths small.',
  },
  defaultLevel: 'p60',
  after: ['Ten minutes a day is a good start.', 'Re-run Find your pace every few weeks.'],
  sections: (opts) => {
    if (opts.level === 'find') {
      const keys = Object.keys(PACES);
      return [
        { id: 'calm-arrive', title: 'Arrive', what: 'The test', color: '#a9c2d8', steps: [{ say: RS.welcome, bell: 'low', lead: 2 }, { say: RS.findPlan }, { say: RS.small }, { rest: 10, label: 'Your own pace' }] },
        ...keys.map((k, n) => {
          const [i, o, words, rate] = PACES[k];
          const count = Math.round(120 / (i + o));
          const last = n === keys.length - 1;
          return {
            id: `calm-pace-${n + 1}`,
            title: `Pace ${n + 1}`,
            what: `${rate} a minute, two minutes`,
            color: ['#9db8d4', '#89a8c8', '#7598bc', '#6288b0', '#4f78a4'][n],
            steps: [
              { say: say(`Pace ${num(n + 1)}. ${words} breaths a minute.`), bell: 'bell', gap: 0.6 },
              { pace: { inhale: i, exhale: o }, count, style: 'count', calls: LEO },
              ...(last ? [{ say: RS.pick }, { rest: 4 }] : [{ rest: 60, label: 'Your own pace', cues: [{ at: 0.5, say: RS.rate[n] }, ...(n === 2 ? [{ at: 35, say: RS.slower }] : [])] }]),
            ],
          };
        }),
      ];
    }
    const pace = PACES[opts.level] || PACES.p60;
    // Arrival, ease-in and return also count toward the roughly ten-minute session.
    const main = Math.round(300 / cycle(pace));
    const quiet = Math.round(180 / cycle(pace));
    return [
      { id: 'calm-arrive', title: 'Arrive', what: 'Settle', color: '#a9c2d8', steps: [{ say: RS.welcome, bell: 'low', lead: 2 }, { say: RS.plan }, { say: RS.small }, { say: RS.light }, { rest: 10, label: 'Your own pace' }] },
      { id: 'calm-ease', title: 'Ease in', what: '4 in · 5 out', color: '#8fb0d0', steps: [{ say: RS.ease, gap: 0.6 }, { pace: { inhale: 4, exhale: 5 }, count: 6, style: 'count', calls: LEO }] },
      {
        id: 'calm-res',
        title: 'Resonance',
        what: `${pace[3]} a minute, ${pace[0]} in · ${pace[1]} out`,
        color: '#6f93b8',
        steps: [
          { rest: 12, label: 'Your own pace', cues: [{ at: 0, say: line('res_interval', 'A few breaths at your own pace before we settle into the main rhythm.') }] },
          { say: say(`Now ${pace[2].toLowerCase()} breaths a minute. Join on the next breath in.`), bell: 'bell', gap: 0.6 },
          {
            pace: { inhale: pace[0], exhale: pace[1] },
            count: main,
            style: 'slow',
            calls: LEO,
            cues: [
              { breath: 2, phase: 'out', say: RS.nose },
              // The rise is described on an in-breath; the fall on its out-breath.
              ...RS.waves.map((say, n) => ({ breath: n < 2 ? 3 + n : 2 + n, phase: n === 1 ? 'in' : 'out', say })),
              ...RS.gadget.map((say, n) => ({ breath: 7 + n, phase: 'out', say })),
              { breath: 12, phase: 'out', say: RS.wander },
              { breath: main - 1, phase: 'out', say: RS.quiet },
            ],
          },
        ],
      },
      { id: 'calm-quiet', title: 'Quiet', what: 'Same pace, only the calls', color: '#4f6f8f', steps: [{ pace: { inhale: pace[0], exhale: pace[1] }, count: quiet, style: 'slow', calls: LEO }] },
      { id: 'close', title: 'Return', what: 'Natural breathing', color: '#b8cde0', steps: [{ say: RS.ret, bell: 'bell' }, { rest: 15 }, { say: RS.close }, { rest: 4 }] },
    ];
  },
  learn: `
<p>Slow, light breathing at one steady pace, about six breaths a minute: one of the best-studied calming practices. <strong>Find your pace</strong> tries five paces from 6.5 to 4.5 a minute so you can pick the one that feels smoothest; then practise at it.</p>
<h3>The technique</h3>
<ul>
  <li>Sit back, eyes closed. In and out through the nose if that's easy.</li>
  <li>Slow doesn't mean big: keep each breath small and smooth. If you feel lightheaded, the breaths are too big.</li>
  <li>For the pace test, note after each pace whether it felt smooth, hungry for air, or lightheaded. Choose the one that felt smoothest. Re-test every few weeks; it shifts.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Around six breaths a minute, heart rate rises and falls with each breath in large, regular waves, and slow breathing shifts the body toward rest ${ev.solid}.</li>
  <li>Six a minute without any biofeedback raised heart rate variability as much as with it ${ev.some}.</li>
  <li>Clinics find a personal "resonance" pace with a heart-rate sensor; without one, this test only finds the pace that feels best to you. Comfort as the way to choose hasn't been validated ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Shaffer &amp; Meehan 2020, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7578229/" target="_blank" rel="noopener">A practical guide to resonance frequency assessment</a>, Front Neurosci.</li>
  <li>Laborde et al. 2022, slow-paced breathing with and without biofeedback, Psychophysiology 59(1):e13952.</li>
  <li>Meehan &amp; Shaffer 2024, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11310264/" target="_blank" rel="noopener">inhale-to-exhale ratios at six breaths a minute</a>.</li>
</ul>`,
};

// ── Lights Out ─────────────────────────────────────────
const LO = {
  welcome: line('lo_welcome', 'Hey. Lights off, phone face down. Lie on your back, or however you fall asleep.'),
  plan: line('lo_plan2', "Breathe at your own pace while you settle. Then follow the calls: in through your nose, out through lightly pursed lips. Keep the breaths easy. Later, only the breath sound stays. You can stop following it whenever you like."),
  face: line('lo_face2', 'Let your face soften, including your jaw.'),
  shoulders: line('lo_shoulders', 'Let your shoulders sink into the bed.'),
  arms: line('lo_arms2', 'Let your hands rest without gripping.'),
  belly: line('lo_belly2', 'Let your belly soften as air leaves.'),
  legs: line('lo_legs2', 'Let your legs rest on the bed.'),
  rest: line('lo_rest2', "You don't have to make sleep happen."),
  study: [
    lesson('lo_study_1', "One study had students breathe slowly like this before bed."),
    lesson('lo_study_2', "They did fifteen minutes a night, for a month."),
    lesson('lo_study_3', "Another group spent those minutes on their phones."),
    lesson('lo_study_4', "The breathing group rated their sleep as better."),
  ],
  quiet: line('lo_quiet2', "I'll leave you with the breath sound."),
  slower: line('lo_slower2', 'Breathe freely for a moment. A slower rhythm follows, if you still want it.'),
  close: line('lo_close', 'Let the breath go wherever it wants. Goodnight.'),
};
const LO_PACE = { inhale: 4.5, exhale: 5.5, level: 0.35 };
// Forty seconds to settle and a short return are included in the listed length.
const LO_COUNT = { gentle: 55, standard: 85, deeper: 84 };

export const lightsOut = {
  id: 'lights-out',
  title: 'Lights Out',
  titleHtml: 'Lights <em>out</em>',
  tag: 'Sleep',
  moment: 'night',
  voice: 'mira',
  blurb: 'Fifteen minutes of slow breathing in bed. The voice fades out.',
  lede: 'Six slow breaths a minute in bed, in through the nose and out through pursed lips. Mira talks you through a body sweep for the first few minutes, then goes quiet.',
  music: ['dusk', 'mind'],
  accent: ['#cfc6f2', '#3d3570'],
  sky: 'night',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: { gentle: '10 min', standard: '15 min', deeper: '20 min' },
  intensityNotes: { gentle: 'Ten minutes.', standard: 'Fifteen minutes, as in the bedtime study.', deeper: 'Twenty minutes, slowing to five breaths a minute at the end.' },
  defaultLevel: 'standard',
  after: ['Every night for a month is what the study did.'],
  sections: (opts) => {
    const lv = opts.gentle ? 'gentle' : (opts.holdScale ?? 1) > 1 ? 'deeper' : 'standard';
    return [
      { id: 'night-arrive', title: 'Lie down', what: 'Lights off', color: '#a99ee0', steps: [{ rest: 40, label: 'Your own pace', cues: [{ at: 1.5, say: LO.welcome }, { at: 12, say: LO.plan }] }] },
      {
        id: 'night-slow',
        title: 'Slow breathing',
        what: '4.5 in · 5.5 out, voice then quiet',
        color: '#6f63b8',
        steps: [
          {
            pace: LO_PACE,
            count: 27,
            calls: MIRA,
            style: 'slow',
            cues: [
              { breath: 1, phase: 'out', say: LO.face },
              { breath: 4, phase: 'out', say: LO.shoulders },
              { breath: 7, phase: 'out', say: LO.arms },
              { breath: 10, phase: 'out', say: LO.belly },
              { breath: 13, phase: 'out', say: LO.legs },
              { breath: 16, phase: 'out', say: LO.rest },
              ...LO.study.map((say, n) => ({ breath: 18 + n, phase: 'out', say })),
              { breath: 25, phase: 'out', say: LO.quiet },
            ],
          },
        ],
      },
      { id: 'night-quiet', title: 'Quiet', what: 'Breath sound only', color: '#4f4590', steps: [{ pace: LO_PACE, count: LO_COUNT[lv] - 27, style: 'slow' }] },
      ...(lv === 'deeper'
        ? [{ id: 'night-slower', title: 'Slower', what: '5 in · 7 out', color: '#4f4590', steps: [{ rest: 12, label: 'Your own pace', cues: [{ at: 0.5, say: LO.slower }] }, { pace: { inhale: 5, exhale: 7, level: 0.3 }, count: 25, style: 'slow' }] }]
        : []),
      { id: 'night-close', title: 'Drift', what: 'Quiet', color: '#3d3570', steps: [{ rest: lv === 'deeper' ? 8 : 10, cues: [{ at: 0.5, say: LO.close }] }] },
    ];
  },
  learn: `
<p>Fifteen minutes of slow breathing in bed, the one bedtime breathing routine with a randomised trial behind it. A short body sweep at the start, then the voice goes quiet and only the breath sound paces you.</p>
<h3>The technique</h3>
<ul>
  <li>Lights off, phone face down, lying however you sleep.</li>
  <li>In through the nose for about 4½ seconds, out through slightly pursed lips for about 5½. The pursed lips keep the breath slow without making it big.</li>
  <li>If sleep doesn't come, that's fine: lying still and breathing slowly is restful on its own.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Students who did 15 minutes of this before bed for 30 days rated their sleep better than students who spent the time on social media, and their overnight heart-rate variability rose ${ev.some}.</li>
  <li>A 2026 review found self-rated sleep improves with about four weeks of slow breathing; effects on how fast you fall asleep are unclear ${ev.some}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Laborde et al. 2019, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6406675/" target="_blank" rel="noopener">slow-paced breathing before sleep for 30 days</a>, J Clin Med.</li>
  <li>Eide et al. 2026, slow breathing and sleep: systematic review, Sleep Med Rev 87:102284.</li>
</ul>`,
};

// ── Breath Check ───────────────────────────────────────
const BC = {
  welcome: line('bc_welcome', "This is a quick check, not a workout. Sit still and breathe normally through your nose for a minute."),
  cpHow: line('bc_cp_how', "Test one. Take a small, normal breath in and out through your nose. Then pinch your nose and wait for the first clear urge to breathe. It's not a max hold. The moment the urge comes, let go and tap Breathe now."),
  pinch: say('Pinch, and wait.'),
  gasp: line('bc_gasp', 'If your first breath after that was a gasp, you held on too long. Next time, let go sooner.'),
  exHow: line('bc_ex_how', "Test two. Take a comfortable full breath in through your nose, then breathe out as slowly as you can without forcing it. Tap Breathe now when you're empty."),
  fullIn: say('Full breath in.'),
  safety: line('bc_safety', 'Stay seated for the check, never in water. Breathe whenever you need to, even before the first urge.'),
  recover: line('bc_recover', 'Release your nose and breathe at your own pace. Take this rest before the second test.'),
  done: line('bc_done', 'Breathe normally again. The measurements are finished.'),
  slowOut: say('And out, as slowly as you can.'),
  log: line('bc_log', 'Both times are saved in your log. Check again in a week, at the same time of day. Look for changes over several checks; small differences are normal.'),
  why: line('bc_why', "Your hold time varies with sleep, meals, exercise, and how you do the test. One reading tells you little, and it doesn't measure your carbon dioxide level.", 'science'),
};

export const breathCheck = {
  id: 'breath-check',
  title: 'Breath Check',
  titleHtml: 'Breath <em>check</em>',
  tag: 'Measure',
  moment: 'light',
  voice: 'leo',
  blurb: 'Two numbers to track: your comfortable hold, and your slowest breath out.',
  lede: 'A short check, three to five minutes. The control pause times a relaxed hold to the first urge to breathe; the slow exhale times your slowest breath out. Both go in your log, so you can watch the trend over weeks.',
  music: false,
  accent: ['#e3e3e3', '#5c6670'],
  sky: 'clear',
  recordNames: ['Control pause', 'Slow exhale'],
  metric: { label: 'control pause', of: (e) => e.holds?.[0] },
  after: ['Same time of day each week, ideally first thing in the morning, before coffee.', 'Watch the trend over weeks. A single day means little.'],
  sections: [
    { id: 'clear-settle', title: 'Settle', what: 'Normal breathing', color: '#b9c2ca', steps: [{ rest: 60, label: 'Your own pace', bell: 'low', cues: [{ at: 1.5, say: BC.welcome }, { at: 14, say: BC.safety }] }] },
    {
      id: 'clear-cp',
      title: 'Control pause',
      what: 'Hold to the first urge',
      color: '#8d99a4',
      steps: [
        { say: BC.cpHow },
        { pace: SMALL, count: 1, style: 'slow', calls: LEO },
        { hold: 'empty', seconds: 60, label: 'Control pause', record: true, tick: false, cues: [{ at: 0.2, say: BC.pinch }] },
        { rest: 40, label: 'Your own pace', cues: [{ at: 0, say: BC.recover }, { at: 10, say: BC.gasp }, { at: 21, say: BC.why }] },
      ],
    },
    {
      id: 'clear-ex',
      title: 'Slow exhale',
      what: 'Full breath in, slowest breath out',
      color: '#5c6670',
      steps: [
        { say: BC.exHow },
        { pace: { inhale: 5 }, count: 1, style: 'slow', calls: () => BC.fullIn },
        { hold: 'empty', seconds: 60, label: 'Slow exhale', record: true, tick: false, cues: [{ at: 0.2, say: BC.slowOut }] },
        { rest: 6, label: 'Your own pace', cues: [{ at: 0, say: BC.done }] },
      ],
    },
    { id: 'close', title: 'Logged', what: 'The trend', color: '#c9d0d6', steps: [{ say: BC.log, bell: 'bell' }, { rest: 3 }] },
  ],
  learn: `
<p>Two simple numbers to track over weeks. The <strong>control pause</strong> is a relaxed hold after a normal breath out, ended at the first clear urge to breathe. The <strong>slow exhale</strong> is how long you can make one breath out last. Your log shows the control pause as a trend on this page.</p>
<h3>The technique</h3>
<ul>
  <li>Sit still and breathe normally for a minute first.</li>
  <li>Control pause: a small, normal breath in and out through the nose, then pinch and wait. End it at the first clear urge: a twitch in the throat or belly, or the urge to swallow. If your first breath afterwards is a gasp, you held too long. It is not a maximum hold.</li>
  <li>Slow exhale: one full breath in through the nose, then out as slowly as you can. Tap Breathe now when you're empty.</li>
  <li>Compare week to week, at the same time of day. Sleep, meals and exercise all move the number.</li>
</ul>
<h3>What it does and doesn't tell you</h3>
<ul>
  <li>Breathing-retraining teachers use the control pause to track progress, and users report it rising over months ${ev.spec}.</li>
  <li>It doesn't measure carbon dioxide: in one study, hold time correlated slightly the wrong way with exhaled CO₂. It was shorter in people with chest-dominant breathing and poorer lung function ${ev.some}.</li>
  <li>No health bands are shown here, because the published ones disagree and none is validated.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Courtney &amp; Cohen 2008, investigating the claims of Konstantin Buteyko: the relationship of breath holding time to end tidal CO₂, J Altern Complement Med 14(2):115–123.</li>
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">exhale test used to size box breathing</a>, Cell Rep Med.</li>
</ul>`,
};

// ── Breathe Light ──────────────────────────────────────
const BL = {
  welcome: line('bl_welcome2', 'Sit comfortably, mouth closed, tongue resting on the roof of your mouth. Never do these holds in water.'),
  plan: line('bl_plan', "We'll practise breathing a little less air. A few short holds first, then rounds of breathing so light you can barely feel it. You may notice a mild urge for more air, but it should still feel comfortable."),
  holdsHow: line('bl_holds_how2', 'One easy breath in and a normal breath out together first. The next breath starts the small holds. Pinch after each out-breath, without pushing the air out. Release whenever you need to.', 'technique'),
  letGo: say('Let go.'),
  hands: tip('bl_t_hands', 'Notice whether your hands are gripping while you rest.'),
  lightHow: line('bl_light_how', 'Now breathe light. Make each breath softer, until you can hardly feel the air at your nostrils. Keep your belly soft.', 'technique'),
  quieter: tip('bl_quieter2', 'Let this breath leave quietly.'),
  hunger: line('bl_hunger', "A mild urge for more air is enough. If you're gulping or it feels like a struggle, breathe normally for a bit, then start again."),
  shoulders: tip('bl_t_shoulders2', 'Let your shoulders settle.'),
  breaks: [
    line('bl_break_1', 'Let the pace go. Breathe normally for a minute.'),
    line('bl_break_2', 'Another minute at your own pace before round three.'),
    line('bl_break_3', 'Rest on ordinary breathing. The final round follows in a minute.'),
  ],
  recover: line('bl_recover', 'The small holds are done. Breathe at your own pace here.'),
  last: say('Last round. Breathe light.'),
  thread: [
    lesson('bl_thread_1', 'Breathing retraining like this has been studied mainly in asthma, usually as part of a wider programme.'),
    lesson('bl_thread_2', "Some trials found fewer symptoms and less reliever use. That didn't come with better lung function."),
    lesson('bl_thread_3', 'One proposed explanation was a rise in carbon dioxide. But the trials found benefits without that rise.'),
    lesson('bl_thread_4', "So the reason for those improvements is still uncertain. We can't assume the same benefits outside asthma."),
  ],
  close: line('bl_close', 'Let your breathing go back to normal. If you like, try a minute of lighter breathing at quiet moments during the day.'),
};
const LIGHT = { inhale: 4, exhale: 5, holdOut: 1, level: 0.25 };
/** Per level: [small hold s, light rounds, breaths per round]. */
const BL_PLAN = { gentle: [3, 2, 12], standard: [4, 3, 18], deeper: [5, 4, 18] };

export const breatheLight = {
  id: 'breathe-light',
  title: 'Breathe Light',
  titleHtml: 'Breathe <em>light</em>',
  tag: 'Retraining',
  moment: 'light',
  voice: 'leo',
  blurb: 'Small holds, then rounds of barely-there breathing. Daily retraining.',
  lede: 'Breathing retraining from the asthma clinics: a few small holds, then rounds of breathing so light you can barely feel it, with a slight want for more air. Daily, for weeks, is how it was tested.',
  music: ['swell', 'tide'],
  accent: ['#e2efe9', '#4d7f6d'],
  sky: 'clear',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: { gentle: 'Holds of 3 s, two rounds of two minutes.', standard: 'Holds of 4 s, three rounds of three minutes.', deeper: 'Holds of 5 s, four rounds of three minutes.' },
  defaultLevel: 'standard',
  after: ['The trials ran for weeks: once or twice a day, before meals.', 'With asthma, keep your inhaler and never cut medication without your doctor.'],
  sections: (opts) => {
    const [hold, rounds, breaths] = BL_PLAN[opts.gentle ? 'gentle' : (opts.holdScale ?? 1) > 1 ? 'deeper' : 'standard'];
    // Three-second holds leave room only for the call; teach in consecutive recoveries.
    const holds = Array.from({ length: 6 }, (_, i) => [
      { pace: SMALL, count: 1, style: 'slow', calls: LEO },
      { hold: 'empty', seconds: hold, label: 'Small hold', tick: false, cues: [{ at: 0.2, say: B.hold }] },
      { rest: 12, label: 'Your own pace', cues: [{ at: 0, say: BL.letGo }, ...(i === 1 ? [{ at: 2, say: BL.hands }] : []), ...(i >= 2 ? [{ at: 2, say: BL.thread[i - 2] }] : [])] },
    ]).flat();
    const light = (r) => {
      const last = r === rounds - 1;
      const cues = r === 0 ? [{ breath: 3, phase: 'out', say: BL.quieter }, { breath: 10, phase: 'out', say: BL.shoulders }] : [];
      return {
        id: `clear-light-${r + 1}`,
        title: `Light ${r + 1}`,
        what: `${Math.round((breaths * 10) / 60)} min, barely there`,
        color: ['#8fbfae', '#76ad99', '#5e9a85', '#4d7f6d'][r],
        steps: [
          ...(r === 0 ? [{ rest: 10, label: 'Your own pace', cues: [{ at: 0, say: BL.recover }] }, { say: BL.hunger }] : []),
          r === 0 ? { say: BL.lightHow, bell: 'bell', gap: 0.6 } : { say: last ? BL.last : say(`Round ${num(r + 1)}. Return to light breathing.`), bell: 'bell', gap: 0.6 },
          { pace: LIGHT, count: breaths, style: 'slow', calls: (ph, i) => (ph === 'bottom' ? null : LEO(ph, i)), endOnHold: true, cues },
          ...(last ? [] : [{ rest: 60, label: 'Your own pace', cues: [{ at: 0, say: BL.breaks[r] }] }]),
        ],
      };
    };
    return [
      { id: 'clear-arrive', title: 'Settle', what: 'Mouth closed, nose only', color: '#b9d8cc', steps: [{ say: BL.welcome, bell: 'low', lead: 1.5 }, { say: BL.plan }, { rest: 20, label: 'Your own pace', cues: [{ at: 0, say: line('bl_settle', 'Breathe normally while you settle. Each release later gives you time at your own pace.') }] }] },
      { id: 'clear-holds', title: 'Small holds', what: `Six holds of ${hold} s`, color: '#a4ccbd', steps: [{ say: BL.holdsHow, gap: 0.6 }, { pace: SMALL, count: 1, style: 'slow', calls: LEO }, ...holds] },
      ...Array.from({ length: rounds }, (_, r) => light(r)),
      { id: 'close', title: 'Back', what: 'Normal breathing', color: '#c9e0d6', steps: [{ say: BL.close, bell: 'bell' }, { rest: 6 }] },
    ];
  },
  learn: `
<p>Breathing retraining in the style used in asthma clinics: smaller, quieter, nose-only breathing, practised with a slight, tolerable want for more air. A few small holds first, then rounds of light breathing with a minute's break in between.</p>
<h3>The technique</h3>
<ul>
  <li>Mouth closed, tongue resting on the roof of the mouth, shoulders down.</li>
  <li><strong>Small holds:</strong> breathe out normally (don't empty the lungs), pinch the nose, hold a few seconds, let go and breathe quietly.</li>
  <li><strong>Breathe light:</strong> soften each breath until you can hardly feel the air at the nostrils, at about six breaths a minute. A slight air hunger is the target. If it turns into gulping, take one normal breath and start again.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>In asthma, breathing retraining of this kind reduced symptoms and reliever use in randomised trials, without changing lung function ${ev.solid}.</li>
  <li>A Cochrane review found breathing exercises improve asthma quality of life by a small-to-moderate amount at three months ${ev.solid}.</li>
  <li>The original theory, that it works by raising carbon dioxide, wasn't supported by the trials ${ev.some}. Benefits outside asthma are untested ${ev.spec}.</li>
</ul>
<p>With asthma, keep your inhaler and never cut medication without your doctor. In an attack, take your medication first.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Cooper et al. 2003, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1746772/" target="_blank" rel="noopener">breathing techniques in asthma: a randomised controlled trial</a>, Thorax.</li>
  <li>Bruton et al. 2018, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5757422/" target="_blank" rel="noopener">BREATHE trial</a>, Lancet Respir Med.</li>
  <li>Santino et al. 2020, <a href="https://rehabilitation.cochrane.org/breathing-exercises-adults-asthma" target="_blank" rel="noopener">breathing exercises for adults with asthma</a>, Cochrane Review.</li>
</ul>`,
};

// ── Steady ─────────────────────────────────────────────
const ST = {
  welcome: line('st_welcome2', "Hey. Sit or lie down, away from water. Breathe gently through your nose if that's easy."),
  plan: line('st_plan', "We'll do ten tiny holds. A small breath out, a short pause, then quiet breathing. If a pause ever feels like too much, skip it and just breathe gently."),
  safety: line('st_safety', "If you have chest pain, or an asthma attack your inhaler isn't helping, stop here and get help instead."),
  small: line('st_small2', "We'll take one small breath in and a normal breath out together first. The next breath begins the holds. Don't push the air out.", 'technique'),
  hold: line('st_hold', 'Hold.', 'count'),
  letGo: say('Let go.'),
  soft: tip('st_t_soft', 'Between holds, let your shoulders drop and your belly go soft.'),
  pull: line('st_pull2', 'If you need more air, take it. Leave out the next pause if your breathing needs time to settle.'),
  jaw: tip('st_t_jaw', "Check your jaw while you rest. Let your teeth part if they're pressed together."),
  thread: [
    lesson('st_why_1', 'When breathing moves more air than your body needs, carbon dioxide can fall.'),
    lesson('st_why_2', 'That fall can contribute to dizziness or tingling. Those symptoms can have other causes too.'),
    lesson('st_why_3', 'Gentler breathing may let carbon dioxide return toward its usual level. These pauses should stay easy.'),
  ],
  settle: line('st_settle', 'Breathe at your own pace for a little while. You can breathe whenever you need to during a pause, too.'),
  recover: line('st_recover', 'The holds are finished. Take a few breaths at your own pace before the slower rhythm.'),
  slow: say('Now small, slow breaths. Three in, six out.'),
  close: line('st_close2', 'Let the pace go now. Give your breathing time to settle before you get up.'),
};
const ST_TIPS = { 1: ST.soft, 3: ST.pull, 5: ST.jaw, 6: ST.thread[0], 7: ST.thread[1], 8: ST.thread[2] };

export const steady = {
  id: 'steady',
  title: 'Steady',
  titleHtml: '<em>Steady</em>',
  tag: 'Calm',
  moment: 'light',
  voice: 'mira',
  blurb: 'Stress has your breathing running fast? Tiny holds bring it back.',
  lede: 'For when stress has your breathing running ahead of you, like a panic spike or never quite getting a satisfying breath. Ten tiny holds, then small, slow breaths. The opposite of a big sigh.',
  music: ['swell', 'tide'],
  accent: ['#e0dcf0', '#5e5694'],
  sky: 'balance',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: { gentle: 'Holds of 3 seconds.', standard: 'Holds of 5 seconds.', deeper: 'Holds of 7 seconds.' },
  defaultLevel: 'standard',
  after: ['Use it any time your breathing runs ahead of you, wherever you are.', 'Chest pain, or an asthma attack that isn’t easing with your inhaler: get help, don’t breathe through it.'],
  sections: (opts) => {
    const h = opts.gentle ? 3 : (opts.holdScale ?? 1) > 1 ? 7 : 5;
    const cycles = Array.from({ length: 10 }, (_, i) => [
      { pace: SMALL, count: 1, style: 'slow', calls: MIRA },
      { hold: 'empty', seconds: h, label: 'Hold', tick: false, cues: [{ at: 0.2, say: ST.hold }] },
      { rest: ST_TIPS[i] ? 16 : 12, label: 'Your own pace', cues: [{ at: 0, say: ST.letGo }, ...(ST_TIPS[i] ? [{ at: 2, say: ST_TIPS[i] }] : [])] },
    ]).flat();
    return [
      { id: 'balance-arrive', title: 'Settle', what: 'Mouth closed, nose only', color: '#b3a8f0', steps: [{ say: ST.welcome, bell: 'low', lead: 1 }, { say: ST.plan }, { say: ST.safety }, { rest: 20, label: 'Your own pace', cues: [{ at: 0, say: ST.settle }] }, { say: ST.small }, { pace: SMALL, count: 1, style: 'slow', calls: MIRA }] },
      { id: 'balance-holds', title: 'Tiny holds', what: `Ten holds of ${h} s`, color: '#857bdb', steps: cycles },
      { id: 'balance-slow', title: 'Small and slow', what: '3 in · 6 out', color: '#6c63c9', steps: [{ rest: 10, label: 'Your own pace', cues: [{ at: 0, say: ST.recover }] }, { say: ST.slow, bell: 'bell', gap: 0.6 }, { pace: { inhale: 3, exhale: 6, level: 0.3 }, count: 12, style: 'count', calls: MIRA }] },
      { id: 'close', title: 'Back', what: 'Use it any time', color: '#b9b0e6', steps: [{ say: ST.close, bell: 'low' }, { rest: 4 }] },
    ];
  },
  learn: `
<p>For over-breathing: a panic spike, a tickly cough, or never quite getting a satisfying breath. Many tiny holds after a normal breath out let back some of the carbon dioxide that fast breathing blows off. It's the opposite of a big sigh.</p>
<h3>The technique</h3>
<ul>
  <li>Mouth closed, nose only. Every hold starts from a small, normal breath, not a big one.</li>
  <li>Pinch the nose (or just stop) for a few seconds, then let go and breathe quietly for about twelve seconds. Ten times.</li>
  <li>If you feel a pull to take one big breath, let it pass and keep it small.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Many of the dizzy, tingly symptoms of over-breathing come from low carbon dioxide and ease as it builds back up ${ev.solid}. This is a safer version of the old paper-bag advice.</li>
  <li>Breathing retraining with small holds reduced symptoms in asthma trials ${ev.some}; training that raises carbon dioxide has some trial support for panic ${ev.some}.</li>
  <li>Claims about brain fog or long COVID are untested ${ev.spec}.</li>
</ul>
<p>Not for chest pain, a first-ever attack, or an asthma attack that isn't easing with your reliever: get help.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Cooper et al. 2003, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1746772/" target="_blank" rel="noopener">breathing techniques in asthma: a randomised controlled trial</a>, Thorax.</li>
  <li>Meuret et al. 2008, capnometry-assisted breathing training for panic disorder: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Meuret+2008+capnometry+panic" target="_blank" rel="noopener">PubMed search</a>.</li>
</ul>`,
};
