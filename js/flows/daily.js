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
  welcome: {
    desk: line('ready_welcome_desk', 'Two sighs, slow breaths out, a short box, then your first move.'),
    stage: line('ready_welcome_stage', 'Sighs, slow breaths, a short box, then three hums before you speak.'),
    start: line('ready_welcome_start', 'Two sighs, long breaths out, then an easier rhythm before the start.'),
  },
  desk: line('ready_plan_desk2', 'Sit tall, feet flat, eyes on one spot.'),
  stage: line('ready_plan_stage2_r2', 'Sit tall, feet flat, with your gaze resting on one spot.'),
  start: line('ready_plan_start2_r2', 'Stand easy, knees soft, hands loose, eyes open. Drop the counts whenever you need more air.'),
  sigh: line('ready_sigh', 'Two sighs. Breathe in through your nose, top it up with a second short sniff, then let it all go slowly through your mouth.', 'technique'),
  long: say('Four in through the nose, eight out through the nose or soft lips. Five breaths.'),
  between: line('ready_between_r2', 'Breathe at your own pace for a moment. On the slow breaths coming up, leave some room at the top of the inhale.'),
  beforeBox: line('ready_before_box_r2', 'Breathe easy at your own pace. Next, three boxes: in four, hold four, out four, hold four.'),
  beforeEven: line('ready_before_even_r2', 'Breathe at your own pace. Next, the out-breath shortens to six, a little closer to ordinary breathing before you move.'),
  permission: line('ready_permission_r2', 'Breathe whenever you need to. If you feel lightheaded, drop the holds and breathe normally.'),
  lead: line('ready_lead_r2', 'Follow one easy breath with me. Then let the four sides give your attention a simple job.'),
  beforeHum: line('ready_before_hum', 'Let your breathing find its own pace before the hums.'),
  sighWhy: lesson('ready_sigh_why', "That second sniff helps reopen tiny air sacs."),
  why: lesson('ready_why2_r2', "Your heart usually slows on the out-breath, so we're giving it more time."),
  settle: line('ready_settle_r2', 'Let the air leave slowly; breathe in sooner if eight feels too long.'),
  even: say('Four in, six out. Six breaths.'),
  hum: line('ready_hum_r2', 'Three hums. Lips closed, teeth apart. Hum quietly at your speaking pitch on the way out. A light buzz at your lips is enough. Stop before you squeeze out the last air.', 'technique'),
  first: {
    desk: line('ready_first2', "Breathe freely now. Choose your first action, such as reading the first question. Keep it specific."),
    stage: line('ready_first_stage', 'Breathe freely now. Picture your opening sentence, and where you will take a breath before saying it.'),
    start: line('ready_first_start', 'Breathe freely now. Leave the counts behind when you move. Picture your first few steps from the start.'),
  },
  humWhy: lesson('ready_hum_why_r3', 'Humming is a gentle voice warm-up. Keep the tone easy.'),
  finish: {
    desk: line('ready_finish_desk', "When it starts, do that one thing first."),
    stage: line('ready_finish_stage', "When it's your turn, take that breath before your first line."),
    start: line('ready_finish_start', 'Eyes up. Wait for your start signal.'),
  },
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
    start: 'About 4 minutes. Standing, eyes open, no holds. Before a race or a game.',
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
          ? [{ rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.beforeEven }] }, { say: RY.even, gap: 0.6 }, { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count', calls: LEO }]
          : [
              { rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.beforeBox }] },
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
        steps: [{ say: RY.welcome[mode], bell: 'low', lead: 1 }, { say: RY[mode] }, ...(mode === 'start' ? [] : [{ say: RY.permission }])],
      },
      {
        id: 'calm-sighs',
        title: 'Sighs',
        what: 'Two double breaths in, long out',
        color: '#b39a72',
        steps: [{ say: RY.sigh, gap: 0.5 }, { pace: { inhale: 2.5, inhale2: 1.5, exhale: 6 }, count: 2, style: 'slow', calls: (ph, i) => ph === 'in2' ? say('More.') : LEO(ph, i), cues: [{ breath: 1, phase: 'out', say: RY.sighWhy }] }],
      },
      {
        id: 'calm-long',
        title: 'Long out',
        what: '4 in · 8 out, five breaths',
        color: '#9a8058',
        steps: [{ rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.between }] }, { say: RY.long, gap: 0.6 }, { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', calls: LEO, cues: [{ breath: 0, phase: 'out', say: RY.settle }, { breath: 2, phase: 'out', say: RY.why }] }],
      },
      box,
      ...(mode === 'stage'
        ? [{ id: 'hum-ready', title: 'Hums', what: 'Three, for the voice', color: '#c88aa8', steps: [{ rest: 12, label: 'Your own pace', cues: [{ at: 0, say: RY.beforeHum }] }, { say: RY.hum, gap: 0.6 }, { pace: { inhale: 4, exhale: 8, hum: true }, count: 3, style: 'hum', calls: (ph, i) => ph === 'hum' ? say('And hum.') : LEO(ph, i), cues: [{ breath: 1, phase: 'hum', say: RY.humWhy }] }] }]
        : []),
      {
        id: 'close',
        title: 'First move',
        what: 'Your first action',
        color: '#d9c49c',
        steps: [{ say: RY.first[mode], bell: 'bell' }, { rest: 6 }, { say: RY.finish[mode] }, { rest: 2 }],
      },
    ];
  },
  learn: `
<p>A routine of about four minutes (five with the Stage hums) for just before something that matters. It aims to bring your arousal down a notch without slowing you down, and ends on an action: the first thing you'll do.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Two sighs:</strong> in through the nose, a second short sniff on top, a long, slow breath out through the mouth.</li>
  <li><strong>Long out:</strong> 4 in, 8 out, five breaths, low in the belly.</li>
  <li><strong>Box:</strong> 4 in, 4 hold, 4 out, 4 hold, three rounds. Start line swaps it for 4 in, 6 out, with eyes open and no holds. Stage adds three quiet hums at a comfortable speaking pitch, with a light buzz at the lips.</li>
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
  <li><a href="https://pubmed.ncbi.nlm.nih.gov/30041932/" target="_blank" rel="noopener">A pilot survey of warm-up practices among singers</a>, J Voice: humming as a common warm-up task.</li>
</ul>`,
};

// ── Between Sets ───────────────────────────────────────
const BS = {
  knees: line('bs_knees', 'Lean forward, hands on your knees. Breathe freely through your mouth if you need to.'),
  nose: line('bs_nose2_r2', "The calls offer three in, five out: nose in, mouth out. If you're still panting, keep your own pace and join when it eases."),
  noseOnly: line('bs_nose_only2_r2', 'Try nose-only if it feels easy.'),
  why: line('bs_why_r2', 'Supporting your upper body on your knees can make room for fuller breaths while you recover.', 'science'),
  upright: line('bs_upright', 'Stand upright when you feel ready.'),
  slower: say('Next, four in, six out.'),
  ten: say('Ten seconds. Drop the counts and get into position for your exercise. Take longer if you need it.'),
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
  lede: 'Tap Begin when you finish a set. Hands on knees, let the breath run. The calls offer an optional slower rhythm once panting eases. Ten seconds before the end, get into position. The timer is a reminder; take longer if you need it. Tap Again for the next rest.',
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
    const free = seconds - 8 * mixed - 10 * nose - 10;
    return [
      {
        id: 'calm-rest',
        title: 'Rest',
        what: 'Hands on knees, then slow it down',
        color: '#6bbaa0',
        steps: [
          { rest: free, label: 'Your own pace', bell: 'low', cues: [
            { at: 0.3, say: BS.knees },
            ...(nose ? [{ at: 9, say: BS.why }] : []),
            { at: free - 14, say: BS.nose },
          ] },
          { pace: { inhale: 3, exhale: 5 }, count: mixed, style: 'count', calls: MIRA, cues: [
            { breath: 0, phase: 'out', say: BS.upright },
            ...(nose ? [{ breath: mixed - 1, phase: 'out', say: BS.slower }] : []),
          ] },
          ...(nose ? [
            { pace: { inhale: 4, exhale: 6 }, count: nose, style: 'count', calls: (ph, i) => MIRA(ph, mixed + i), cues: [{ breath: 0, phase: 'out', say: BS.noseOnly }] },
          ] : []),
          { rest: 9, label: 'Get set', cues: [{ at: 0, say: BS.ten }] },
          { rest: 1, bell: 'bell', cues: [{ at: 0, say: BS.go }] },
        ],
      },
    ];
  },
  learn: `
<p>A rest timer for intervals and strength sets. Tap Begin when you finish a set; the voice offers a slower rhythm once the initial panting has eased, and gives you ten seconds to get into position. Follow the counts only if they feel comfortable.</p>
<h3>The technique</h3>
<ul>
  <li>Lean forward with hands supported on your knees. Let the breath run free through the mouth for the first stretch. Do not force a slow rhythm while you are still panting.</li>
  <li>When breathing feels easy, try nose in for 3 and mouth out for 5. The longer timers continue straight into 4 in, 6 out, with an optional switch to nose-only breathing. Stand upright when ready. Keep your own pace if the calls feel restrictive.</li>
  <li>No holds between sets.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Hands on knees gave faster heart-rate recovery than hands on head between hard intervals in one small study ${ev.some}.</li>
  <li>Slow breathing between squat sets sped heart-rate recovery in a small study, with no effect on power or speed in the next set ${ev.some}.</li>
  <li>That squat study used a different pattern with holds; this timer uses no holds, and its exact sequence has not been tested ${ev.spec}.</li>
</ul>
<p>Stop and get help for chest pain or unusual breathlessness.</p>
<h3>Sources</h3>
<ul class="sources">
  <li>Michaelson et al. 2019, <a href="https://doi.org/10.1249/TJX.0000000000000079" target="_blank" rel="noopener">effects of two recovery postures during high-intensity interval training</a>, Transl J Am Coll Sports Med.</li>
  <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11307190/" target="_blank" rel="noopener">4-7-8 breathing between squat sets</a>, J Hum Kinet 2024.</li>
</ul>`,
};

// ── Resonance ──────────────────────────────────────────
const RS = {
  welcome: line('res_welcome', 'Sit comfortably, let your hands rest, and close your eyes if you like.'),
  plan: line('res_plan_r2', 'About eleven minutes at your chosen pace, with a short warm-up first.'),
  findPlan: line('res_find_plan_r2', 'Five paces, two minutes each, with a minute of ordinary breathing between. Score each pace out of ten for smoothness. Keep just your best score and pace number in mind. If two tie, keep the faster one.'),
  ease: say("Let's ease in. Four in, five out."),
  small: line('res_small_r2', "Each breath will be a bit fuller than usual. Leave room at the top and don't squeeze at the bottom. Use your nose if that's easy.", 'technique'),
  nose: tip('res_t_nose2', "Let the air leave without pushing."),
  light: line('res_light_r2', 'If you feel lightheaded or have to fight for air, drop the count and breathe normally.'),
  waves: lesson('res_waves', 'Your heart rate usually rises as you breathe in and falls as you breathe out. Slow breathing makes that swing larger.'),
  wander: tip('res_t_wander2', 'Bring your attention to this exhale.'),
  feedback: line('res_feedback', 'Pressure sensors in your arteries help adjust your heart rate. At a matching breathing pace, that feedback rhythm and your breathing reinforce each other. That is the resonance.', 'science'),
  interval: line('res_interval_r2', 'Breathe at your own pace for a moment before the main rhythm.'),
  check: line('res_check', "If you're lightheaded, breathe normally."),
  quiet: line('res_quiet2', 'Only the breath calls from here.'),
  ret: line('res_return', 'Let the pace go, and breathe on your own.'),
  close: line('res_close_r2', 'If your eyes are closed, open them when you like. Sit for a few breaths before you stand.'),
  rate: [
    line('res_rate2_r2', 'Breathe at your own pace for a minute. Score pace one for smoothness, out of ten. Remember the number with the score: pace one, seven, for example.'),
    line('res_rate_2b_r2', 'Let the counts go for a minute. Score pace two. If it felt smoother, keep this pace and score as your favorite.'),
    line('res_rate_3b_r2', 'Back to ordinary breathing. Score pace three, then keep whichever pace has felt smoothest so far.'),
    line('res_rate_4b_r2', 'Another minute at your own pace. Score pace four and compare it with your favorite. One more pace follows.'),
  ],
  slower: line('res_slower', 'The slower options are not higher levels. Choose comfort rather than the lowest number.', 'technique'),
  pick: line('res_pick2_r2', 'Breathe freely now. Score pace five and choose your smoothest pace; keep the faster one if two tied. Open your eyes if you closed them. Set your choice above the Begin button next time.'),
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
  blurb: 'Slow, smooth breathing at one steady pace. Find the pace that suits you.',
  lede: 'Start around six breaths a minute, with breaths a little fuller than usual. Run Find your pace to compare five rhythms, then practice at the one that felt smoothest.',
  music: ['focus'],
  accent: ['#d6e4f0', '#4f6f8f'],
  sky: 'calm',
  intensity: ['find', 'p65', 'p60', 'p55', 'p50', 'p45'],
  levelNames: { find: 'Find', p65: '6.5', p60: '6', p55: '5.5', p50: '5', p45: '4.5' },
  intensityNotes: {
    find: 'Find your pace: five paces, two minutes each. About sixteen minutes.',
    p65: '6.5 breaths a minute: 3.7 in, 5.5 out.',
    p60: '6 breaths a minute: 4 in, 6 out. Where most people start.',
    p55: '5.5 breaths a minute: 4.4 in, 6.5 out.',
    p50: '5 breaths a minute: 4.8 in, 7.2 out.',
    p45: '4.5 breaths a minute: 5.3 in, 8 out. Keep the breaths smooth and unforced.',
  },
  defaultLevel: 'p60',
  after: ['Ten minutes a day is a practical starting point.', 'Choose the easiest pace; a slower number is not a progression target.'],
  sections: (opts) => {
    if (opts.level === 'find') {
      const keys = Object.keys(PACES);
      return [
        { id: 'calm-arrive', title: 'Arrive', what: 'The comparison', color: '#a9c2d8', steps: [{ say: RS.welcome, bell: 'low', lead: 2 }, { say: RS.findPlan }, { say: RS.small }, { say: RS.light }, { rest: 5, label: 'Your own pace' }] },
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
              { pace: { inhale: i, exhale: o }, count, style: 'count', calls: LEO, cues: last ? [{ breath: 3, phase: 'out', say: line('res_find_effort', 'If this pace takes effort, let it go and breathe normally.') }] : [] },
              ...(last ? [{ say: RS.pick }, { rest: 4 }] : [{ rest: 60, label: 'Your own pace', cues: [{ at: 0.5, say: RS.rate[n] }, ...(n === 2 ? [{ at: 35, say: RS.slower }] : [])] }]),
            ],
          };
        }),
      ];
    }
    const pace = PACES[opts.level] || PACES.p60;
    // Arrival, ease-in, the debrief and return bring the session to about eleven minutes.
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
          { rest: 40, label: 'Your own pace', cues: [{ at: 0, say: RS.interval }, { at: 7, say: RS.waves }, { at: 19, say: RS.feedback }] },
          { say: say(`Now ${pace[2].toLowerCase()} breaths a minute. Join on the next breath in.`), bell: 'bell', gap: 0.6 },
          {
            pace: { inhale: pace[0], exhale: pace[1] },
            count: main,
            style: 'slow',
            calls: LEO,
            cues: [
              { breath: 2, phase: 'out', say: RS.nose },
              { breath: 10, phase: 'out', say: RS.wander },
              { breath: 18, phase: 'out', say: RS.check },
              { breath: 20, phase: 'out', say: RS.quiet },
            ],
          },
        ],
      },
      { id: 'calm-quiet', title: 'Quiet', what: 'Same pace, only the calls', color: '#4f6f8f', steps: [{ pace: { inhale: pace[0], exhale: pace[1] }, count: quiet, style: 'slow', calls: LEO }] },
      { id: 'close', title: 'Return', what: 'Natural breathing', color: '#b8cde0', steps: [{ say: RS.ret, bell: 'bell' }, { rest: 15 }, { say: RS.close }, { rest: 4 }] },
    ];
  },
  learn: `
<p>Slow, smooth breathing at one steady pace, around six breaths a minute. <strong>Find your pace</strong> compares five paces from 6.5 to 4.5 a minute; then practice at the one that feels smoothest.</p>
<h3>The technique</h3>
<ul>
  <li>Sit comfortably, eyes closed if you like. In and out through the nose if that's easy.</li>
  <li>At these slow rates, each breath is a little fuller than usual. Leave room at the top and avoid squeezing at the bottom. If you feel lightheaded or have to fight for air, stop following the counts and breathe normally.</li>
  <li>Score each pace out of ten for smoothness, remembering only your favorite pace number and score. If two tie, choose the faster one as a practical starting point. Slower is not better. Compare again if your preferred pace stops feeling comfortable.</li>
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
  <li>Vaschillo et al. 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12001882/" target="_blank" rel="noopener">resonance in the cardiovascular system</a>, Appl Psychophysiol Biofeedback.</li>
  <li>Anderson et al. 2009, <a href="https://pubmed.ncbi.nlm.nih.gov/20183539/" target="_blank" rel="noopener">slow breathing, tidal volume and end-tidal carbon dioxide</a>, Psychol Health Med.</li>
  <li>Laborde et al. 2022, slow-paced breathing with and without biofeedback, Psychophysiology 59(1):e13952.</li>
  <li>Meehan &amp; Shaffer 2024, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11310264/" target="_blank" rel="noopener">inhale-to-exhale ratios at six breaths a minute</a>.</li>
</ul>`,
};

// ── Lights Out ─────────────────────────────────────────
const LO = {
  welcome: line('lo_welcome_r2', 'Lights off, phone face down. Lie on your back or side, however you usually fall asleep, and close your eyes.'),
  plan: line('lo_plan2_r2', 'Breathe at your own pace while you settle. When the calls start, breathe in through your nose and out through softly pursed lips, with just a small gap. Let the air leave without pushing.'),
  heart: lesson('lo_heart', "Each slow exhale nudges your heart rate down a little, the way it drifts as you fall asleep."),
  face: line('lo_face2', 'Let your teeth rest slightly apart.'),
  neck: line('lo_neck', 'Let your neck rest on the pillow.'),
  shoulders: line('lo_shoulders', 'Let your shoulders sink into the bed.'),
  arms: line('lo_arms2', 'Let your hands rest without gripping.'),
  belly: line('lo_belly2', 'Let your belly soften as air leaves.'),
  legs: line('lo_legs2', 'Let both legs rest fully.'),
  rest: line('lo_rest2', "Let your feet rest loosely."),
  release: line('lo_release', 'You can let your mouth close now.'),
  quiet: line('lo_quiet2_r2', 'You can stop following and rest.'),
};
const LO_PACE = { inhale: 4.5, exhale: 5.5, level: 0.35 };
// Fade the final three sound breaths, then leave silence. No voice returns after the handoff.
const sleepBreaths = (pace, count, fade) => fade
  ? [{ pace, count: count - 3, style: 'slow' }, ...[0.6, 0.3, 0.1].map((gain) => ({ pace: { ...pace, level: pace.level * gain }, count: 1, style: 'slow' }))]
  : [{ pace, count, style: 'slow' }];
// Forty seconds to settle and a silent tail are included in the listed length.
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
  intensityNotes: { gentle: 'Ten minutes.', standard: 'Fifteen minutes.', deeper: 'Twenty minutes, slowing to five breaths a minute near the end.' },
  defaultLevel: 'standard',
  after: ['Every night for a month is what the study did.'],
  sections: (opts) => {
    const lv = opts.gentle ? 'gentle' : (opts.holdScale ?? 1) > 1 ? 'deeper' : 'standard';
    return [
      { id: 'night-arrive', title: 'Lie down', what: 'Lights off', color: '#a99ee0', steps: [{ rest: 40, label: 'Your own pace', cues: [{ at: 1.5, say: LO.welcome }, { at: 12, say: LO.plan }, { at: 31, say: LO.heart }] }] },
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
              { breath: 4, phase: 'out', say: LO.neck },
              { breath: 7, phase: 'out', say: LO.shoulders },
              { breath: 10, phase: 'out', say: LO.arms },
              { breath: 13, phase: 'out', say: LO.belly },
              { breath: 16, phase: 'out', say: LO.legs },
              { breath: 19, phase: 'out', say: LO.rest },
              { breath: 22, phase: 'out', say: LO.release },
              { breath: 26, phase: 'out', say: LO.quiet },
            ],
          },
        ],
      },
      { id: 'night-quiet', title: 'Quiet', what: 'Breath sound only', color: '#4f4590', steps: sleepBreaths(LO_PACE, LO_COUNT[lv] - 27, lv !== 'deeper') },
      ...(lv === 'deeper'
        ? [{ id: 'night-slower', title: 'Slower', what: '5 in · 7 out', color: '#4f4590', steps: sleepBreaths({ inhale: 5, exhale: 7, level: 0.3 }, 26, true) }]
        : []),
      { id: 'night-close', title: 'Drift', what: 'Quiet', color: '#3d3570', steps: [{ rest: lv === 'deeper' ? 8 : 10 }] },
    ];
  },
  learn: `
<p>Slow breathing in bed, with ten-, fifteen- and twenty-minute options. A trial studied fifteen minutes nightly for thirty days; this session adds a short body sweep at the start. Then the voice stays quiet through the end, and the breath sound fades away over the last three breaths.</p>
<h3>The technique</h3>
<ul>
  <li>Lights off, phone face down, lying on your back or side, however you usually fall asleep.</li>
  <li>In through the nose for about 4½ seconds, out through slightly pursed lips for about 5½. Use only a small gap at the lips, without blowing hard or emptying completely.</li>
  <li>Stop following the rhythm whenever you get drowsy. Let your mouth close when you want. If you lose track, there is nothing to catch up on. The twenty-minute option slows the sound near the end without bringing the voice back.</li>
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
  <li>Eide et al. 2026, <a href="https://pubmed.ncbi.nlm.nih.gov/41886931/" target="_blank" rel="noopener">slow breathing and sleep: systematic review</a>, Sleep Med Rev 87:102284.</li>
</ul>`,
};

// ── Breath Check ───────────────────────────────────────
const BC = {
  welcome: line('bc_welcome', "This is a quick check, not a workout. Sit still and breathe normally through your nose for a minute."),
  cpHow: line('bc_cp_how_r2', 'Test one. Follow one normal breath in and out, without emptying your lungs, then pinch your nose. Stop as soon as you clearly want the next breath, before you need to gasp. Release and tap Breathe now immediately; the timer is not a target.'),
  pinch: say('Pinch, and wait.'),
  gasp: line('bc_gasp_r2', 'Breathe normally now. If you gasped, that number went beyond the first-urge check. End sooner next time.'),
  exHow: line('bc_ex_how_r2', 'Test two. Take a comfortable full breath in through your nose, then let it out through your nose in a thin, steady stream. When the flow breaks or you need to squeeze, tap Breathe now and take your next breath.'),
  fullIn: say('Full breath in.'),
  exMeaning: line('bc_ex_meaning_r2', 'That was practice in letting air out evenly. Keep the same comfortable starting breath and gentle flow each time; squeezing out extra seconds changes the task.'),
  safety: line('bc_safety_r2', 'Stay seated, never in water, and keep the phone where you can tap it. The hold ends at your first clear wish for another breath, not at your limit.'),
  recover: line('bc_recover', 'Breathe at your own pace. Rest here before the second test, so it starts from ordinary breathing again.'),
  done: line('bc_done', 'Breathe normally again. The measurements are finished.'),
  slowOut: say('And out, thin and steady.'),
  log: line('bc_log_r2', "Both times are in your log. There's no pass mark. Check again next week, at the same time of day, and compare several checks made with the same technique."),
  why: lesson('bc_why_r2', 'Your body keeps making carbon dioxide while you hold, and the rising level helps drive that urge to breathe.'),
};

export const breathCheck = {
  id: 'breath-check',
  title: 'Breath Check',
  titleHtml: 'Breath <em>check</em>',
  tag: 'Measure',
  moment: 'light',
  voice: 'leo',
  blurb: 'Two numbers to track: your comfortable hold, and a gentle, steady breath out.',
  lede: 'A short check, about three to six minutes, depending on when you end each test. The control pause times a relaxed hold to the first urge to breathe; the slow exhale ends when the steady flow breaks or needs a squeeze. Both go in your log.',
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
        { rest: 40, label: 'Your own pace', cues: [{ at: 0, say: BC.gasp }, { at: 10, say: BC.recover }, { at: 21, say: BC.why }] },
      ],
    },
    {
      id: 'clear-ex',
      title: 'Slow exhale',
      what: 'Comfortable full breath in, steady breath out',
      color: '#5c6670',
      steps: [
        { say: BC.exHow },
        { pace: { inhale: 5 }, count: 1, style: 'slow', calls: () => BC.fullIn },
        { hold: 'empty', seconds: 60, label: 'Slow exhale', record: true, tick: false, cues: [{ at: 0.2, say: BC.slowOut }] },
        { rest: 22, label: 'Your own pace', cues: [{ at: 0, say: BC.done }, { at: 6, say: BC.exMeaning }] },
      ],
    },
    { id: 'close', title: 'Logged', what: 'The trend', color: '#c9d0d6', steps: [{ say: BC.log, bell: 'bell' }, { rest: 3 }] },
  ],
  learn: `
<p>Two simple numbers to track over weeks. The <strong>control pause</strong> is a relaxed hold after a normal breath out, ended at the first clear urge to breathe. The <strong>slow exhale</strong> is how long you can make one breath out last. Your log shows the control pause as a trend on this page.</p>
<h3>The technique</h3>
<ul>
  <li>Sit still and breathe normally for a minute first.</li>
  <li>Control pause: a small, normal breath in and out through the nose, then pinch and wait. End it at the first clear urge for another breath; do not wait for a contraction or the timer. Keep the phone in reach so you can release and tap immediately. If your first breath afterwards is a gasp, you held too long. It is not a maximum hold.</li>
  <li>Slow exhale: a comfortable full breath in through the nose, then out through the nose in a thin, steady stream. When the flow breaks or you need to squeeze, tap Breathe now and take your next breath. Do not clamp your throat or hold after the exhale.</li>
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
  <li>Courtney &amp; Cohen 2008, <a href="https://pubmed.ncbi.nlm.nih.gov/18315509/" target="_blank" rel="noopener">breath holding time and end-tidal CO₂</a>, J Altern Complement Med 14(2):115–123.</li>
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">exhale test used to size box breathing</a>, Cell Rep Med.</li>
</ul>`,
};

// ── Breathe Light ──────────────────────────────────────
const BL = {
  welcome: line('bl_welcome2_r2', 'Sit comfortably with your mouth closed. Breathe whenever you need to; drop the holds if you feel lightheaded.'),
  plan: line('bl_plan_r2', "Six short holds first, to practice a relaxed pause after an ordinary out-breath. Then lighter breathing at your own rate, with a little less air in each breath."),
  holdsHow: line('bl_holds_how2_r2', 'Follow one practice breath with me. Then, after each following out-breath, pinch your nose without pushing extra air out. Release whenever you need to.', 'technique'),
  letGo: say('Release your nose, rest your hand and breathe at your own pace.'),
  restart: line('bl_restart', 'Keep the first breath ordinary. If you need a gulp, shorten the next hold.'),
  lightHow: line('bl_light_how_r2', 'Rest your hands now. Keep your own breathing rate, and make each nose breath a little quieter and smaller. Let any natural pause after the out-breath happen by itself; there is no count to match.', 'technique'),
  quieter: tip('bl_quieter2_r2', 'Keep your belly soft; quiet breathing does not need a tight stomach.'),
  hunger: line('bl_hunger_r2', 'A mild want for more air is enough. If you gulp, strain or feel dizzy, return to ordinary breathing. Skip any pauses that add effort.'),
  checks: [
    line('bl_check_1', 'You may feel a want for air by now. If it keeps growing, take a little more air with each breath.'),
    line('bl_check_2', 'Halfway through this round. Keep the want for air mild and steady; increase the breath size if it is building.'),
    line('bl_check_3', 'Keep breathing at your own rate. If you are working to keep the breaths small, ease off the reduction.'),
    line('bl_check_4', 'Halfway through the final round. Take more air if you need it, leaving room for an easy first breath afterward.'),
  ],
  breaks: [
    line('bl_break_1_r2', 'Breathe normally for a minute. Notice your first breath: if you need a gulp, reduce less next round.'),
    line('bl_break_2', 'Another minute at your own pace before round three.'),
    line('bl_break_3', 'Rest on ordinary breathing. The final round follows in a minute.'),
  ],
  recover: line('bl_recover', 'The small holds are done. Breathe at your own pace here.'),
  last: say('Last round. Breathe light.'),
  why: lesson('bl_why', 'That want for air is your breathing drive asking for more ventilation. Carbon dioxide helps drive it, and taking smaller breaths can make the feeling more noticeable. Keep the reduction gentle.'),
  close: line('bl_close_r2', 'Breathe normally now. Notice the first breath back; if you need a gulp, use less reduction next time. For a short practice later, try one quiet minute at your desk.'),
};
/** Per level: [small hold s, light rounds, seconds per round]. */
const BL_PLAN = { gentle: [3, 2, 120], standard: [4, 3, 180], deeper: [5, 4, 180] };

export const breatheLight = {
  id: 'breathe-light',
  title: 'Breathe Light',
  titleHtml: 'Breathe <em>light</em>',
  tag: 'Retraining',
  moment: 'light',
  voice: 'leo',
  blurb: 'Small holds, then quieter breaths at your own rate. Practice breath size.',
  lede: 'Six short holds, then quieter nose breathing at your own rate, with a minute of ordinary breathing between rounds. Gentle has two rounds, Standard three, and Deeper four. Keep any want for more air mild and steady.',
  music: ['swell', 'tide'],
  accent: ['#e2efe9', '#4d7f6d'],
  sky: 'clear',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: { gentle: 'Holds of 3 s, two rounds of two minutes.', standard: 'Holds of 4 s, three rounds of three minutes.', deeper: 'Holds of 5 s, four rounds of three minutes.' },
  defaultLevel: 'standard',
  after: ['Keep the reduction small enough that ordinary breathing resumes easily.', 'With asthma, keep your inhaler and never cut medication without your doctor.'],
  sections: (opts) => {
    const [hold, rounds, seconds] = BL_PLAN[opts.gentle ? 'gentle' : (opts.holdScale ?? 1) > 1 ? 'deeper' : 'standard'];
    // Three-second holds leave room only for the call; teach in the recoveries.
    const holds = Array.from({ length: 6 }, (_, i) => [
      { pace: SMALL, count: 1, style: 'slow', calls: LEO },
      { hold: 'empty', seconds: hold, label: 'Small hold', tick: false, cues: [{ at: 0.2, say: B.hold }] },
      { rest: 16, label: 'Your own pace', cues: [{ at: 0, say: BL.letGo }, ...(i === 0 ? [{ at: 7, say: BL.restart }] : [])] },
    ]).flat();
    const light = (r) => {
      const last = r === rounds - 1;
      const cues = [...(r === 0 ? [{ at: 25, say: BL.quieter }] : []), { at: seconds / 2, say: BL.checks[r] }];
      return {
        id: `clear-light-${r + 1}`,
        title: `Light ${r + 1}`,
        what: `${seconds / 60} min, your own breathing rate`,
        color: ['#8fbfae', '#76ad99', '#5e9a85', '#4d7f6d'][r],
        steps: [
          ...(r === 0 ? [{ rest: 10, label: 'Your own pace', cues: [{ at: 0, say: BL.recover }] }, { say: BL.lightHow }, { say: BL.hunger }] : [{ say: last ? BL.last : say(`Round ${num(r + 1)}. Return to light breathing.`), gap: 0.6 }]),
          { rest: seconds, label: 'Light breathing', bell: 'bell', cues },
          ...(last ? [] : [{ rest: 60, label: 'Your own pace', cues: [{ at: 0, say: BL.breaks[r] }, ...(r === 0 ? [{ at: 20, say: BL.why }] : [])] }]),
        ],
      };
    };
    return [
      { id: 'clear-arrive', title: 'Settle', what: 'Mouth closed, nose only', color: '#b9d8cc', steps: [{ say: BL.welcome, bell: 'low', lead: 1.5 }, { say: BL.plan }, { rest: 12, label: 'Your own pace', cues: [{ at: 0, say: line('bl_settle_r2', 'Breathe normally while you settle. After each hold you will get a few breaths on your own.') }] }] },
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
  <li><strong>Small holds:</strong> breathe out normally (don't empty the lungs), pinch the nose, pause a few seconds, then release and rest your hand. These rehearse a relaxed stop and an ordinary restart; shorten or skip them if you need a gulp afterward.</li>
  <li><strong>Breathe light:</strong> keep your own breathing rate and make each nose breath a little quieter and smaller. Any pause should happen naturally, without a timed hold. Keep the want for air mild and steady; take more air if it builds. If you gulp, strain or feel dizzy, breathe normally until comfortable, then reduce less or finish.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>In asthma, breathing retraining of this kind reduced symptoms and reliever use in randomised trials, without changing lung function ${ev.solid}.</li>
  <li>A Cochrane review found breathing exercises improve asthma quality of life by a small-to-moderate amount at three months ${ev.solid}.</li>
  <li>The original theory, that benefits come from a lasting rise in carbon dioxide, wasn't supported by the trials ${ev.some}. This exact sequence and benefits outside asthma remain untested ${ev.spec}.</li>
</ul>
<p>With asthma, keep your inhaler and never cut medication without your doctor. In an attack, take your medication first.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Cooper et al. 2003, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1746772/" target="_blank" rel="noopener">breathing techniques in asthma: a randomised controlled trial</a>, Thorax.</li>
  <li>Banzett et al. 1996, <a href="https://pubmed.ncbi.nlm.nih.gov/8822220/" target="_blank" rel="noopener">carbon dioxide and the sensation of air hunger</a>, Respir Physiol.</li>
  <li>Bruton et al. 2018, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5757422/" target="_blank" rel="noopener">BREATHE trial</a>, Lancet Respir Med.</li>
  <li>Santino et al. 2020, <a href="https://rehabilitation.cochrane.org/breathing-exercises-adults-asthma" target="_blank" rel="noopener">breathing exercises for adults with asthma</a>, Cochrane Review.</li>
</ul>`,
};

// ── Steady ─────────────────────────────────────────────
const ST = {
  welcome: line('st_welcome2_r2', 'Sit comfortably, eyes open if that helps you stay oriented. Use your nose if it feels easy.'),
  safety: line('st_safety', "If this is new or unexplained breathlessness, you have chest pain, or your asthma inhaler isn't helping, stop and get medical help."),
  small: line('st_small2_r2', 'One practice breath first: gentle in, relaxed out. Then ten optional pauses after the out-breath, without emptying your lungs or pinching your nose. Breathe whenever needed; drop holds if lightheaded.', 'technique'),
  hold: line('st_hold', 'Hold.', 'count'),
  letGo: say('Take an easy breath, then breathe at your own pace.'),
  soft: tip('st_t_soft', 'Between holds, let your shoulders drop and your belly go soft.'),
  pull: line('st_pull2_r2', 'Aim for an ordinary first breath. If you need a gulp, skip the next pause and take the air you need.'),
  unsatisfied: line('st_unsatisfied', 'If you keep searching for one satisfying breath, stop testing each inhale by filling to the top. Let the next few breaths come without trying to make them perfect.'),
  feet: tip('st_feet', 'Feel where your feet meet the floor while your breathing carries on.'),
  thread: [
    lesson('st_why_1_r2', 'Moving more air than you need can lower carbon dioxide. A pause briefly stops that loss; there is no need to force an urge.'),
    lesson('st_why_2_r2', 'Low carbon dioxide can contribute to tingling and dizziness. Keeping the breaths gentle avoids adding more air just because those sensations feel alarming.'),
  ],
  recover: line('st_recover', 'The holds are finished. Take a few breaths at your own pace before the slower rhythm.'),
  slow: line('st_slow_plan_r2', 'Now three in, six out, with gentle breaths rather than deep ones. Slow, oversized breaths still move a lot of air. Shorten the exhale or keep your own pace if needed.'),
  close: line('st_close2_r2', 'Let the count go. Stay seated until you feel steady. If breathing still feels unsettled, keep an easy rhythm of your own rather than forcing more pauses.'),
};
const ST_TIPS = { 0: ST.pull, 1: ST.thread[0], 2: ST.thread[1], 3: ST.unsatisfied, 4: ST.soft, 5: ST.feet };

export const steady = {
  id: 'steady',
  title: 'Steady',
  titleHtml: '<em>Steady</em>',
  tag: 'Calm',
  moment: 'light',
  voice: 'mira',
  blurb: 'Optional short pauses and gentle breaths for a familiar stress spike.',
  lede: 'For when stress has your breathing running ahead of you, or you keep reaching for a satisfying breath. Ten optional pauses after relaxed out-breaths, then a slower rhythm you can shorten or leave whenever needed.',
  music: ['swell', 'tide'],
  accent: ['#e0dcf0', '#5e5694'],
  sky: 'balance',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: { gentle: 'Holds of 3 seconds.', standard: 'Holds of 5 seconds.', deeper: 'Holds of 7 seconds.' },
  defaultLevel: 'standard',
  after: ['Use it seated or lying down for a familiar stress-related breathing spike.', 'Chest pain, or an asthma attack that isn’t easing with your inhaler: get help, don’t breathe through it.'],
  sections: (opts) => {
    const h = opts.gentle ? 3 : (opts.holdScale ?? 1) > 1 ? 7 : 5;
    const cycles = Array.from({ length: 10 }, (_, i) => [
      { pace: SMALL, count: 1, style: 'slow', calls: MIRA },
      { hold: 'empty', seconds: h, label: 'Hold', tick: false, cues: [{ at: 0.2, say: i === 9 ? say('Last hold.') : ST.hold }] },
      { rest: ST_TIPS[i] ? 20 : 12, label: 'Your own pace', cues: [{ at: 0, say: ST.letGo }, ...(ST_TIPS[i] ? [{ at: 5.5, say: ST_TIPS[i] }] : [])] },
    ]).flat();
    return [
      { id: 'balance-arrive', title: 'Settle', what: 'Sit, gentle breathing', color: '#b3a8f0', steps: [{ say: ST.welcome, bell: 'low', lead: 1 }, { say: ST.safety }, { say: ST.small }, { pace: SMALL, count: 1, style: 'slow', calls: MIRA }] },
      { id: 'balance-holds', title: 'Tiny holds', what: `Ten holds of ${h} s`, color: '#857bdb', steps: cycles },
      { id: 'balance-slow', title: 'Small and slow', what: '3 in · 6 out', color: '#6c63c9', steps: [{ rest: 10, label: 'Your own pace', cues: [{ at: 0, say: ST.recover }] }, { say: ST.slow, bell: 'bell', gap: 0.6 }, { pace: { inhale: 3, exhale: 6, level: 0.3 }, count: 12, style: 'count', calls: MIRA }] },
      { id: 'close', title: 'Back', what: 'Your own pace', color: '#b9b0e6', steps: [{ say: ST.close, bell: 'low' }, { rest: 4 }] },
    ];
  },
  learn: `
<p>For a familiar stress-related breathing spike. Easy pauses after ordinary breaths introduce a break in the airflow, followed by a gentler rhythm. Skip any pause that adds discomfort. This is practice, not a test of the cause of breathlessness or a treatment for an attack.</p>
<h3>The technique</h3>
<ul>
  <li>Use the nose if comfortable. Every pause starts after a small, normal breath out, without pushing air out.</li>
  <li>Simply pause the airflow for a few seconds; no pinching is needed. Let the first breath afterward be an ordinary size, then breathe at your own pace for twelve to twenty seconds. Ten times, with every pause optional.</li>
  <li>Take the air you need. If you need large recovery breaths, skip further pauses and breathe freely. The final counts are optional too.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Over-breathing can lower carbon dioxide and contribute to dizziness and tingling ${ev.solid}. These symptoms also have other causes; they do not establish that you are over-breathing.</li>
  <li>Panic trials used weeks of breathing training with measured carbon dioxide feedback ${ev.some}; this short sequence has not been validated as an acute panic intervention ${ev.spec}.</li>
</ul>
<p>Not for chest pain, a first-ever attack, or an asthma attack that isn't easing with your reliever: get help.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Cooper et al. 2003, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1746772/" target="_blank" rel="noopener">breathing techniques in asthma: a randomised controlled trial</a>, Thorax.</li>
  <li>Meuret et al. 2008, capnometry-assisted breathing training for panic disorder: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Meuret+2008+capnometry+panic" target="_blank" rel="noopener">PubMed search</a>.</li>
</ul>`,
};
