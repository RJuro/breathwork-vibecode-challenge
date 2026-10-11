// Everyday practices: Ready and Resonance (Leo) before something; Between Sets (Mira) during
// training; Lights Out (Mira) at bedtime; and the breathe-light set: Breath Check and Breathe
// Light (Leo), Steady (Mira). Practices with their own level keys read `opts.level`.

import { line, say, tip, num, SAFETY_HTML, ev } from './lib.js';
import { B } from './train.js';

const BOX_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold' })[ph];
const SMALL = { inhale: 2, exhale: 2.5 };

// ── Ready ──────────────────────────────────────────────
const RY = {
  welcome: line('ready_welcome', "Okay. Let's get you level."),
  desk: line('ready_plan_desk', "Sit tall, feet flat, eyes on one spot. We'll do two sighs, a few long breaths out, then the box."),
  stage: line('ready_plan_stage', 'Sit or stand tall, eyes on one spot. Two sighs, a few long breaths out, the box, and three hums to warm up your voice.'),
  start: line('ready_plan_start', 'Stand easy, eyes open. Two sighs, then long breaths out. No holds before a start.'),
  sigh: line('ready_sigh', 'Two sighs. Breathe in through your nose, top it up with a second short sniff, then let it all go slowly through your mouth.', 'technique'),
  long: say('Four in, eight out. Five breaths.'),
  low: line('ready_low', 'Breathe low, into your belly. Shoulders stay down.', 'technique'),
  why: line('ready_why', 'Your heart slows a little each time you breathe out. A few slow breaths can help you settle before you start.', 'science'),
  box: say('The box. Four counts a side. Four rounds.'),
  even: say('Four in, six out. Six breaths.'),
  eyes: line('ready_eyes', "Keep your eyes on where you're going. Breathe low and quiet."),
  hum: line('ready_hum', 'Three hums. Lips closed, teeth apart, and hum at an easy pitch on the way out. It warms up your voice.', 'technique'),
  first: line('ready_first', "Eyes open. Think of the first thing you'll do or say when it starts. Just that one thing."),
  go: say('Go.'),
};

export const ready = {
  id: 'ready',
  title: 'Ready',
  titleHtml: '<em>Ready</em>',
  tag: 'Focus',
  moment: 'before',
  voice: 'leo',
  blurb: 'Three minutes before a talk, an exam or a start line.',
  lede: 'A short routine for the minutes before something that matters: two sighs, long breaths out, a few rounds of box breathing, and one clear first step. Short enough to use in a corridor.',
  music: ['focus', 'keys'],
  accent: ['#e6dcc8', '#8a6a3c'],
  sky: 'deep',
  intensity: ['desk', 'stage', 'start'],
  levelNames: { desk: 'Desk', stage: 'Stage', start: 'Start line' },
  intensityNotes: {
    desk: 'An exam, an interview, a hard call. Seated.',
    stage: 'Before you speak or perform: adds three hums for the voice.',
    start: 'Standing, eyes open, no holds. Before a race or a game.',
  },
  defaultLevel: 'desk',
  after: ['Run it on calm days too. A routine you have rehearsed is one you can use under pressure.'],
  sections: (opts) => {
    const mode = opts.level in { stage: 1, start: 1 } ? opts.level : 'desk';
    const box = {
      id: 'deep-box',
      title: mode === 'start' ? 'Even' : 'Box',
      what: mode === 'start' ? '4 in · 6 out, six breaths' : '4-4-4-4, four rounds',
      color: '#7a6a8f',
      steps:
        mode === 'start'
          ? [{ say: RY.even, gap: 0.6 }, { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count', cues: [{ breath: 2, say: RY.eyes }] }]
          : [
              { say: RY.box, gap: 0.6 },
              {
                pace: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 },
                count: 4,
                style: 'count',
                labels: BOX_LABELS,
                cues: [{ breath: 0, say: B.in }, { breath: 0, offset: 4, say: B.hold }, { breath: 0, offset: 8, say: B.out }, { breath: 0, offset: 12, say: B.hold }, { breath: 1, say: B.softHold }],
              },
            ],
    };
    return [
      {
        id: 'deep-arrive',
        title: 'Plan',
        what: 'Posture, the routine',
        color: '#c9b48f',
        steps: [{ say: RY.welcome, bell: 'low', lead: 1 }, { say: RY[mode] }],
      },
      {
        id: 'calm-sighs',
        title: 'Sighs',
        what: 'Two double breaths in, long out',
        color: '#b39a72',
        steps: [{ say: RY.sigh, gap: 0.5 }, { pace: { inhale: 2.5, inhale2: 1, exhale: 6 }, count: 2, style: 'slow' }],
      },
      {
        id: 'calm-long',
        title: 'Long out',
        what: '4 in · 8 out, five breaths',
        color: '#9a8058',
        steps: [{ say: RY.long, gap: 0.6 }, { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', cues: [{ breath: 1, say: RY.low }, { breath: 3, say: RY.why }] }],
      },
      box,
      ...(mode === 'stage'
        ? [{ id: 'hum-ready', title: 'Hums', what: 'Three, for the voice', color: '#c88aa8', steps: [{ say: RY.hum, gap: 0.6 }, { pace: { inhale: 4, exhale: 8, hum: true }, count: 3, style: 'hum' }] }]
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
<p>A three-minute routine for just before something that matters. It aims to bring your arousal down a notch without slowing you down, and ends on an action: the first thing you'll do.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Two sighs:</strong> in through the nose, a second short sniff on top, a long, slow breath out through the mouth.</li>
  <li><strong>Long out:</strong> 4 in, 8 out, five breaths, low in the belly.</li>
  <li><strong>Box:</strong> 4 in, 4 hold, 4 out, 4 hold, four rounds. Start line swaps it for 4 in, 6 out, with eyes open and no holds. Stage adds three low hums to warm up the voice.</li>
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
  nose: line('bs_nose', "When you're ready, in through your nose, and a long, slow breath out through your mouth."),
  noseOnly: line('bs_nose_only', 'If it feels easy, close your mouth and breathe slowly through your nose.'),
  why: line('bs_why', 'In one small study of soccer players, heart rate came down faster with hands on knees than with hands on head.', 'science'),
  ten: say('Ten seconds. Stand up.'),
  go: say('Go.'),
};
/** Per rest length: [free breathing s, 4:6 breaths nose in / mouth out, 4:6 breaths nose only]. */
const BS_PLAN = { r60: [12, 2, 0], r90: [12, 3, 2], r120: [24, 4, 3], r180: [40, 6, 6] };

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
    const [free, mixed, nose] = BS_PLAN[opts.level] || BS_PLAN.r90;
    return [
      {
        id: 'calm-rest',
        title: 'Rest',
        what: 'Hands on knees, then slow it down',
        color: '#6bbaa0',
        steps: [
          { say: BS.knees, bell: 'low', lead: 0.3, gap: 0.5 },
          { rest: free, label: 'Recover' },
          { say: BS.nose, gap: 0.5 },
          { pace: { inhale: 4, exhale: 6 }, count: mixed, style: 'count', cues: mixed >= 3 ? [{ breath: 1, say: BS.why }] : [] },
          ...(nose ? [{ say: BS.noseOnly, gap: 0.5 }, { pace: { inhale: 4, exhale: 6 }, count: nose, style: 'count' }] : []),
          { say: BS.ten, gap: 0 },
          { rest: 8, label: 'Get set' },
          { say: BS.go, bell: 'bell', gap: 0.5 },
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
  nose: tip('res_t_nose', 'In and out through your nose, if that feels easy.'),
  light: line('res_light', 'If you feel lightheaded, make the breaths smaller, or stop following the pace for a bit.'),
  waves: line('res_waves', 'At around six breaths a minute, your heart speeds up a little on each breath in and slows on each breath out. Practised regularly, that rhythm is linked with lower stress.', 'science'),
  wander: tip('res_t_wander', 'If your mind wanders, let the next breath out bring you back.'),
  gadget: line('res_gadget', "In one study, six breaths a minute raised heart rate variability about as much without a heart monitor as with one. You don't need gadgets for this.", 'science'),
  quiet: line('res_quiet', "I'll be quiet for the last few minutes. Stay with the circle."),
  ret: line('res_return', 'Let the pace go, and breathe on your own.'),
  close: line('res_close', 'Open your eyes when you like. Ten minutes a day is a good start, and more is fine if you enjoy it.'),
  rate: line('res_rate', 'How was that one? Smooth, hungry for air, or lightheaded? Remember it.'),
  slower: line('res_slower', 'At these slower paces, keep the breaths small and easy.', 'technique'),
  pick: line('res_pick', 'Pick the pace that felt smoothest, without straining or feeling lightheaded. Choose it above the Begin button next time. Test again in a few weeks, because it can shift.'),
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
  music: ['focus', 'keys'],
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
        { id: 'calm-arrive', title: 'Arrive', what: 'The test', color: '#a9c2d8', steps: [{ say: RS.welcome, bell: 'low', lead: 2 }, { say: RS.findPlan }, { say: RS.small }, { rest: 6 }] },
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
              { pace: { inhale: i, exhale: o }, count, style: 'count', cues: n === 3 ? [{ breath: 1, say: RS.slower }] : [] },
              { say: last ? RS.pick : RS.rate },
              ...(last ? [{ rest: 4 }] : [{ rest: 50, label: 'Breathe normally' }]),
            ],
          };
        }),
      ];
    }
    const pace = PACES[opts.level] || PACES.p60;
    const main = Math.round(420 / cycle(pace));
    const quiet = Math.round(180 / cycle(pace));
    return [
      { id: 'calm-arrive', title: 'Arrive', what: 'Settle', color: '#a9c2d8', steps: [{ say: RS.welcome, bell: 'low', lead: 2 }, { say: RS.plan }, { rest: 4 }] },
      { id: 'calm-ease', title: 'Ease in', what: '4 in · 5 out', color: '#8fb0d0', steps: [{ say: RS.ease, gap: 0.6 }, { pace: { inhale: 4, exhale: 5 }, count: 6, style: 'count' }] },
      {
        id: 'calm-res',
        title: 'Resonance',
        what: `${pace[3]} a minute, ${pace[0]} in · ${pace[1]} out`,
        color: '#6f93b8',
        steps: [
          { say: say(`Now ${pace[2].toLowerCase()} breaths a minute. Follow the circle.`), bell: 'bell', gap: 0.6 },
          {
            pace: { inhale: pace[0], exhale: pace[1] },
            count: main,
            style: 'slow',
            cues: [{ breath: 2, say: RS.small }, { breath: 5, say: RS.nose }, { breath: 9, say: RS.light }, { breath: 14, say: RS.waves }, { breath: 22, say: RS.wander }, { breath: 30, say: RS.gadget }],
          },
        ],
      },
      { id: 'calm-quiet', title: 'Quiet', what: 'Same pace, no talking', color: '#4f6f8f', steps: [{ say: RS.quiet, gap: 0.8 }, { pace: { inhale: pace[0], exhale: pace[1] }, count: quiet, style: 'slow' }] },
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
  plan: line('lo_plan', "We'll breathe slowly, about six breaths a minute. In through your nose, and out through slightly pursed lips, like cooling a spoonful of soup. I'll talk for the first few minutes, then go quiet."),
  face: line('lo_face', 'Let your face go slack, from your forehead down to your jaw.'),
  shoulders: line('lo_shoulders', 'Let your shoulders sink into the bed.'),
  arms: line('lo_arms', 'Let your arms rest on the bed, and let your hands go loose.'),
  belly: line('lo_belly', 'Let your belly rise and fall, nice and easy.'),
  legs: line('lo_legs', 'Let your legs relax into the bed too.'),
  rest: line('lo_rest', "If sleep doesn't come, that's okay. Lying still and breathing slowly is restful on its own."),
  study: line('lo_study', 'In one study, students who did fifteen minutes of this every night for a month rated their sleep better than students who spent that time on their phones.', 'science'),
  quiet: line('lo_quiet', "I'll go quiet now. Just follow the sound of the breath."),
  slower: line('lo_slower', 'The pace slows a little now. Follow it if it feels comfortable.'),
  close: line('lo_close', 'Let the breath go wherever it wants. Goodnight.'),
};
const LO_PACE = { inhale: 4.5, exhale: 5.5, level: 0.35 };
const LO_COUNT = { gentle: 60, standard: 90, deeper: 90 };

export const lightsOut = {
  id: 'lights-out',
  title: 'Lights Out',
  titleHtml: 'Lights <em>out</em>',
  tag: 'Sleep',
  moment: 'night',
  voice: 'mira',
  blurb: 'Fifteen minutes of slow breathing in bed. The voice fades out.',
  lede: 'Six slow breaths a minute in bed, in through the nose and out through pursed lips. Mira talks you through a body sweep for the first few minutes, then goes quiet.',
  music: ['dusk', 'night'],
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
      { id: 'night-arrive', title: 'Lie down', what: 'Lights off', color: '#a99ee0', steps: [{ say: LO.welcome, lead: 1.5 }, { say: LO.plan }] },
      {
        id: 'night-slow',
        title: 'Slow breathing',
        what: '4.5 in · 5.5 out, voice then quiet',
        color: '#6f63b8',
        steps: [
          {
            pace: LO_PACE,
            count: LO_COUNT[lv],
            style: 'slow',
            cues: [
              { breath: 1, say: LO.face },
              { breath: 4, say: LO.shoulders },
              { breath: 7, say: LO.arms },
              { breath: 10, say: LO.belly },
              { breath: 13, say: LO.legs },
              { breath: 17, say: LO.rest },
              { breath: 20, say: LO.study },
              { breath: 24, say: LO.quiet },
            ],
          },
        ],
      },
      ...(lv === 'deeper'
        ? [{ id: 'night-slower', title: 'Slower', what: '5 in · 7 out', color: '#4f4590', steps: [{ say: LO.slower, gap: 0.5 }, { pace: { inhale: 5, exhale: 7, level: 0.3 }, count: 25, style: 'slow' }] }]
        : []),
      { id: 'night-close', title: 'Drift', what: 'Quiet', color: '#3d3570', steps: [{ say: LO.close, lead: 1 }, { rest: 10 }] },
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
  small: say('Small breath in, and out.'),
  pinch: say('Pinch, and wait.'),
  gasp: line('bc_gasp', 'If your first breath after that was a gasp, you held on too long. Next time, let go sooner.'),
  exHow: line('bc_ex_how', "Test two. Take a comfortable full breath in through your nose, then breathe out as slowly as you can without forcing it. Tap Breathe now when you're empty."),
  fullIn: say('Full breath in.'),
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
    { id: 'clear-settle', title: 'Settle', what: 'Normal breathing', color: '#b9c2ca', steps: [{ say: BC.welcome, bell: 'low', lead: 1.5 }, { rest: 45, label: 'Settle' }] },
    {
      id: 'clear-cp',
      title: 'Control pause',
      what: 'Hold to the first urge',
      color: '#8d99a4',
      steps: [
        { say: BC.cpHow },
        { pace: SMALL, count: 1, style: 'slow', cues: [{ at: 0, say: BC.small }] },
        { hold: 'empty', seconds: 75, label: 'Control pause', record: true, tick: false, cues: [{ at: 0.2, say: BC.pinch }] },
        { say: BC.gasp },
        { rest: 40, label: 'Rest' },
      ],
    },
    {
      id: 'clear-ex',
      title: 'Slow exhale',
      what: 'Full breath in, slowest breath out',
      color: '#5c6670',
      steps: [
        { say: BC.exHow },
        { pace: { inhale: 5 }, count: 1, style: 'slow', cues: [{ at: 0, say: BC.fullIn }] },
        { hold: 'empty', seconds: 75, label: 'Slow exhale', record: true, tick: false, cues: [{ at: 0.2, say: BC.slowOut }] },
        { rest: 3 },
      ],
    },
    { id: 'close', title: 'Logged', what: 'The trend', color: '#c9d0d6', steps: [{ say: BC.log, bell: 'bell' }, { say: BC.why, min: 0 }, { rest: 3 }] },
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
  welcome: line('bl_welcome', 'Sit up, mouth closed, with your tongue resting on the roof of your mouth.'),
  plan: line('bl_plan', "We'll practise breathing a little less air. A few short holds first, then rounds of breathing so light you can barely feel it. You may notice a mild urge for more air, but it should still feel comfortable."),
  holdsHow: line('bl_holds_how', 'Small holds. Breathe out normally and pinch your nose. Let go after a few seconds, or sooner if you need to, and breathe quietly through your nose.', 'technique'),
  letGo: say('Let go.'),
  small: tip('bl_t_small', "Every hold starts from a normal breath out. Don't empty your lungs."),
  lightHow: line('bl_light_how', 'Now breathe light. Make each breath softer, until you can hardly feel the air at your nostrils. Keep your belly soft.', 'technique'),
  quieter: line('bl_quieter', "Quieter. If I could hear you, it's too much."),
  hunger: line('bl_hunger', "A mild urge for more air is enough. If you're gulping or it feels like a struggle, breathe normally for a bit, then start again."),
  shoulders: tip('bl_t_shoulders', 'Relax your shoulders, and let your belly move gently as you breathe.'),
  brk: say('Take a break. Breathe normally for a minute.'),
  again: say('Breathe light again.'),
  last: say('Last round. Breathe light.'),
  asthma: line('bl_asthma', "Some asthma trials found fewer symptoms and less reliever use after breathing retraining like this. Lung function itself didn't improve.", 'science'),
  theory: line('bl_theory', 'One theory was that this helps by raising carbon dioxide. The trials found benefits without that rise, so nobody knows exactly why it helps.', 'science'),
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
    const holds = Array.from({ length: 6 }, (_, i) => [
      { pace: SMALL, count: 1, style: 'slow' },
      { hold: 'empty', seconds: hold, label: 'Small hold', tick: false, cues: [{ at: 0.2, say: B.hold }] },
      { rest: 10, cues: [{ at: 0, say: BL.letGo }, ...(i === 1 ? [{ at: 3, say: BL.small }] : [])] },
    ]).flat();
    const light = (r) => {
      const last = r === rounds - 1;
      const cues = r === 0 ? [{ breath: 3, say: BL.quieter }, { breath: 7, say: BL.hunger }, { breath: 10, say: BL.shoulders }] : r === 1 ? [{ breath: 3, say: BL.asthma }] : r === 2 ? [{ breath: 3, say: BL.theory }] : [];
      return {
        id: `clear-light-${r + 1}`,
        title: `Light ${r + 1}`,
        what: `${Math.round((breaths * 10) / 60)} min, barely there`,
        color: ['#8fbfae', '#76ad99', '#5e9a85', '#4d7f6d'][r],
        steps: [
          r === 0 ? { say: BL.lightHow, bell: 'bell', gap: 0.6 } : { say: last ? BL.last : BL.again, bell: 'bell', gap: 0.6 },
          { pace: LIGHT, count: breaths, style: 'slow', cues },
          ...(last ? [] : [{ say: BL.brk, gap: 0.3 }, { rest: 55, label: 'Break' }]),
        ],
      };
    };
    return [
      { id: 'clear-arrive', title: 'Settle', what: 'Mouth closed, nose only', color: '#b9d8cc', steps: [{ say: BL.welcome, bell: 'low', lead: 1.5 }, { say: BL.plan }, { rest: 40, label: 'Settle' }] },
      { id: 'clear-holds', title: 'Small holds', what: `Six holds of ${hold} s`, color: '#a4ccbd', steps: [{ say: BL.holdsHow, gap: 0.6 }, ...holds] },
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
  welcome: line('st_welcome', "Hey. Sit down if you can, and breathe gently through your nose if that's easy."),
  plan: line('st_plan', "We'll do ten tiny holds. A small breath out, a short pause, then quiet breathing. If a pause ever feels like too much, skip it and just breathe gently."),
  safety: line('st_safety', "If you have chest pain, or an asthma attack your inhaler isn't helping, stop here and get help instead."),
  small: line('st_small', "Start each hold after a small, normal breath out. Don't push the air out.", 'technique'),
  hold: line('st_hold', 'Hold.'),
  letGo: say('Let go.'),
  soft: tip('st_t_soft', 'Between holds, let your shoulders drop and your belly go soft.'),
  pull: line('st_pull', "You might feel like taking one big breath. If you can, let that pass. If you're really struggling for air, stop the holds and breathe freely."),
  signs: tip('st_t_signs', 'Take your time between holds. Skip the next one if you need to.'),
  why: line('st_why', 'Breathing fast can lower carbon dioxide and cause dizziness or tingling. Gentler breathing lets it come back up.', 'science'),
  slow: say('Now small, slow breaths. Three in, six out.'),
  close: line('st_close', 'Use this whenever stress has your breathing running ahead of you.'),
};
const ST_TIPS = { 1: ST.soft, 3: ST.pull, 5: ST.signs, 7: ST.why };

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
      { pace: SMALL, count: 1, style: 'slow' },
      { hold: 'empty', seconds: h, label: 'Hold', tick: false, cues: [{ at: 0.2, say: ST.hold }] },
      { rest: ST_TIPS[i] ? 16 : 12, cues: [{ at: 0, say: ST.letGo }, ...(ST_TIPS[i] ? [{ at: 1.5, say: ST_TIPS[i] }] : [])] },
    ]).flat();
    return [
      { id: 'balance-arrive', title: 'Settle', what: 'Mouth closed, nose only', color: '#b3a8f0', steps: [{ say: ST.welcome, bell: 'low', lead: 1 }, { say: ST.plan }, { say: ST.safety }, { say: ST.small }, { rest: 20 }] },
      { id: 'balance-holds', title: 'Tiny holds', what: `Ten holds of ${h} s`, color: '#857bdb', steps: cycles },
      { id: 'balance-slow', title: 'Small and slow', what: '3 in · 6 out', color: '#6c63c9', steps: [{ say: ST.slow, bell: 'bell', gap: 0.6 }, { pace: { inhale: 3, exhale: 6, level: 0.3 }, count: 12, style: 'count' }] },
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
