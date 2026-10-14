// Training: Box (the tactical breath, then box breathing) and Cool-down (a post-workout
// downshift). Each has its own instructor (`voice`), designed with Gemini TTS: Leo for Box,
// Mira for Cool-down. A practice with a voice offers no Voice switch.
// Voice tags (<exhales>, <chuckle>, <sighs>) are placed by hand; captions and the other
// voices drop them.

import { line, say, lesson, num, Num, callsFor, SAFETY_HTML, ev } from './lib.js';

const LEO = callsFor('leo');
const MIRA = callsFor('mira');

// ── Box ────────────────────────────────────────────────
export const B = {
  welcome: line('box_welcome', 'Sit comfortably, feet on the floor and hands in your lap. Close your eyes, or rest your gaze ahead.'),
  plan: line('box_plan2', 'First, four counts in and eight out. Then two blocks of box breathing: in, hold, out, pause, with equal counts on each side.'),
  planNone: line('box_plan_none2', "No holds today. We'll breathe out twice as long as we breathe in, with a break between sequences."),
  permission: line('box_permission', 'Breathe whenever you need to, and drop the holds if you get lightheaded.'),
  permissionNone: line('box_permission_none', 'Keep the breaths comfortable. If the pace feels too slow, breathe normally instead.'),
  drillOne: line('box_drill_one', "We'll take six breaths. Breathe in through your nose for four, and out through your nose or parted lips for eight. Let your ribs widen without lifting your shoulders, and keep each breath a comfortable size."),
  throat: line('box_throat2', 'Let the air leave evenly, so it lasts through the whole count.', 'technique'),
  lever: line('box_lever2', 'Your heart usually slows during the exhale. Notice whether you can feel it.', 'science'),
  stay: line('box_stay', 'Same four in, eight out, for ten breaths. This time, let the last two counts of each exhale taper gently.'),
  hold: line('box_hold', 'Hold.', 'count'),
  softHold: line('box_soft_hold', 'The holds are a pause, not a squeeze. Throat open, shoulders down.', 'technique'),
  adjust: line('box_adjust', 'If that left you gulping, breathe freely through the next block. Ignore its calls and breath sounds.'),
  empty: line('box_empty_pause', 'Breathe out to a comfortable resting point, rather than squeezing your lungs empty. The empty pause starts there.', 'technique'),
  compare: lesson('box_compare_pauses', 'Notice whether the urge to breathe comes sooner in the full or empty pause.'),
  effort: line('box_effort', 'If eight feels easy now, keep the count and use less effort.', 'technique'),
  debrief: lesson('box_pause_debrief', 'The empty pause can feel harder because fuller lungs help quiet the urge to breathe. Carbon dioxide also builds during a hold, adding to that urge.'),
  lastA: say('Last round.'),
  lastOne: say('Last one.'),
  breakOne: line('box_break_1', 'Let the count go for a few breaths. Breathe at your own pace.'),
  leadA: line('box_lead_a2', "One easy breath with me, in and out. The box starts on the next breath in."),
  breakTwo: line('box_break_2', 'Breathe at your own pace for twenty seconds.'),
  leadB: line('box_lead_b', "If you're continuing with the box, take one easy breath with me, in and out. The box starts on the next inhale."),
  release: line('box_release', 'Let it go. Breathe however you like.'),
  check: line('box_check', "Notice whether your next few breaths feel easy, or whether you're catching up on air."),
  close: line('box_close', 'Before a call or a start line, use long exhales if the empty pause felt tight. Otherwise, either pattern is an option.'),
  closeNone: line('box_close_none', 'Ten of these breaths take two minutes. Use that count when you want something familiar before a call or a start line.'),
};
const boxIntro = (s) => say(`Now the box: breathe in, hold, breathe out, pause. ${Num(s)} counts each side.`);
const boxUp = (s) => say(`Now ${num(s)} counts each side.`);
const BOX_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold' })[ph];

export const box = {
  id: 'box',
  title: 'Box',
  titleHtml: '<em>Box</em>',
  tag: 'Training',
  moment: 'before',
  voice: 'leo',
  blurb: 'Long exhales, then equal-sided box breathing. Rehearse a rhythm for pressure.',
  lede: 'Start with four counts in and eight out. Then two blocks of box breathing: in, hold, out, pause, all the same length, with an own-pace break between blocks. Choose No holds for long exhales throughout.',
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
  after: ['Rehearse on calm days so the counting is familiar before a difficult call or a start line.', 'Use the pattern that leaves your next breath easy. Choose long exhales if the empty pause feels tight.'],
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
        { pace: { inhale: 4, exhale: 8 }, count: 6, style: 'count', calls: LEO, cues: [{ breath: 1, phase: 'out', say: B.throat }, { breath: 4, phase: 'out', say: B.lever }] },
      ],
    };
    const close = {
      id: 'box-close',
      title: 'Debrief',
      what: 'Natural breathing, a quick check',
      color: '#b8c4d4',
      steps: [{ say: B.release, bell: 'bell' }, { rest: 15 }, { say: B.check }, { rest: 6 }, { say: opts.noHolds ? B.closeNone : B.close }, { rest: 4 }],
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
          { pace: { inhale: 4, exhale: 8 }, count: 10, style: 'count', calls: LEO, cues: [{ breath: 5, phase: 'out', say: B.effort }, { breath: 8, phase: 'out', say: B.lastOne }] },
        ],
      };
      return [arrive, tactical, breather('box-break-1', B.breakOne), stay, close];
    }
    const [a, b] = opts.gentle ? [3, 4] : (opts.holdScale ?? 1) > 1 ? [5, 6] : [4, 5];
    const rounds = (s, secs) => Math.round(secs / (4 * s));
    const ra = rounds(a, 128);
    const rb = rounds(b, 120);
    const pace = (s) => ({ inhale: s, holdIn: s, exhale: s, holdOut: s });
    // One comfortable breath together; the box starts on the next breath in.
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
          { say: B.empty, gap: 0.6 },
          { say: B.compare, gap: 0.6 },
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
      breather('box-break-2', B.breakTwo, [{ at: 5.5, say: B.debrief }]),
      {
        id: 'box-b',
        title: 'Bigger box',
        what: `${b}-${b}-${b}-${b}, ${rb} rounds`,
        color: '#4a5d78',
        steps: [
          { say: B.adjust },
          { say: boxUp(b), gap: 0.6 },
          { say: B.leadB, gap: 0.6 },
          leadIn(b),
          {
            pace: pace(b), count: rb, style: 'count', labels: BOX_LABELS,
            calls: LEO,
            endOnHold: true,
            cues: [{ breath: rb - 1, phase: 'top', say: B.lastOne }],
          },
        ],
      },
      close,
    ];
  },
  learn: `
<p>Two counting drills to rehearse before a difficult call, a talk or a race start. Start with long exhales, then try equal-sided box breathing. Use the pattern that leaves your next breath comfortable.</p>
<h3>The technique</h3>
<ul>
  <li><strong>The long exhale:</strong> in through the nose for 4; out through the nose or parted lips for 8. Take a comfortable breath, let the ribs widen, and leave the last part of the exhale unforced. This is five breaths a minute.</li>
  <li><strong>The box:</strong> in, hold, out, hold, all the same length. 4 counts a side, then 5 (Gentle 3 then 4; Deeper 5 then 6). A hold is a pause, not a squeeze: throat open, shoulders loose.</li>
  <li>Before each box block, take one paced breath in and out together. Between blocks, breathe at your own pace for twenty seconds.</li>
  <li>The empty pause begins at the end of an ordinary exhale, not after squeezing out every bit of air. Breathe whenever you need to. If you needed a gulp of air after the first block, breathe freely through the second, ignoring its calls and breath sounds.</li>
  <li>No holds keeps the four-in, eight-out rhythm throughout, with a break between the two sequences. In the second sequence, let the last two counts of each exhale taper gently.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Heart rate usually rises during an inhale and falls during an exhale. Slow breathing can increase this variation between heartbeats; this does not mean the average heart rate must fall ${ev.solid}.</li>
  <li>During a pause, carbon dioxide rises and increases the drive to breathe. Feedback from fuller lungs can soften air hunger, which helps explain why the full and empty pauses can feel different. The urge is not a direct measure of oxygen.</li>
  <li>One month-long trial found reduced anxiety with five minutes a day of box breathing, other breathing routines and mindfulness. It tested the whole routine, so the contribution of the holds remains uncertain. The equal sides provide a simple structure to count ${ev.some}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Yasuma and Hayano 2004, <a href="https://pubmed.ncbi.nlm.nih.gov/14769752/" target="_blank" rel="noopener">respiratory sinus arrhythmia</a>, Chest.</li>
  <li>Banzett et al. 2021, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10986303/" target="_blank" rel="noopener">air hunger and lung-inflation feedback</a>, Compr Physiol.</li>
</ul>`,
};

// ── Cool-down ──────────────────────────────────────────
const C = {
  welcome: line('cd_welcome', "Workout's done. Let's get you lying down."),
  setup: line('cd_setup', 'Lie on your back, arms by your sides. For comfort, you can rest your calves on a chair or bench, knees and hips roughly at right angles. Lying flat is fine too.'),
  free: line('cd_free', "For the first minute, breathe however you need to. Use your mouth if that's easier."),
  legs: lesson('cd_legs', "If your calves are up, blood from your legs drains back toward your heart more easily."),
  oxygen: lesson('cd_oxygen_after', "Your body is still using extra oxygen to recover, so breathing can stay heavy after you stop. Let it settle before following a count."),
  stepOne: line('cd_step_one', "On the next call, breathe in through your nose for four, and out through your nose or mouth for six. We'll take six breaths. Keep each one a comfortable size."),
  low: line('cd_low2', "Let your belly move freely. There's no need to brace it for another rep.", 'technique'),
  permission: line('cd_permission', 'Join the counts only if breathing feels easy. If you need more air, stay at your own pace and join on an inhale whenever it eases.'),
  interval: line('cd_interval', 'Take twenty seconds at your own pace. Then we can try a longer breath out.'),
  stepTwo: line('cd_step_two', "For fifteen breaths, we'll try four in and eight out. Leave the count if the longer exhale takes effort."),
  why: lesson('cd_why2', 'Your pulse usually slows on each exhale. Notice it if you can.'),
  twoMore: say('Two more breaths.'),
  quiet: line('cd_quiet2', "The counts stop here. For two minutes, let your breathing find its own pace. I'll speak again when it's time to get up."),
  ret: line('cd_return2', "Keep lying down for a moment. Blood vessels in your legs can stay widened after exercise, so we'll get up in stages."),
  up: line('cd_up', 'If your legs are raised, bring your feet onto the floor. Roll onto your side, then use your hands to sit up slowly.'),
  pause: line('cd_sit_pause', 'Stay seated for a few breaths. If you feel lightheaded, lie back down and leave getting up for later.'),
  close: line('cd_close2', "When you feel steady sitting up, stand and give it a few seconds before walking."),
};

export const coolDown = {
  id: 'cool-down',
  title: 'Cool-down',
  titleHtml: 'Cool-<em>down</em>',
  tag: 'Training',
  moment: 'after',
  voice: 'mira',
  blurb: 'After training: lie down, let the breath settle, then long exhales and quiet.',
  lede: 'Lie on your back, with calves supported or legs flat. Breathe freely first, join the slower counts only if they feel easy, then take two quiet minutes at your own pace. Finish by sitting up and pausing before you stand.',
  music: ['terrace', 'night'],
  accent: ['#d8efe4', '#3f8f7a'],
  sky: 'calm',
  after: ['Use the counts only once breathing feels easy; stay at your own pace if you need more air.', 'Blood pressure can be lower after exercise. Pause sitting before standing, and lie back down if you feel lightheaded.'],
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
        { rest: 60, label: 'Your own pace', cues: [{ at: 6, say: C.oxygen }, { at: 18, say: C.legs }, { at: 28, say: C.low }, { at: 44, say: C.permission }] },
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
            { breath: 4, phase: 'out', say: C.why },
            // During breath thirteen's exhale: two complete breaths remain in every talk mode.
            { breath: 12, phase: 'out', say: C.twoMore },
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
      steps: [{ say: C.ret, bell: 'bell' }, { rest: 8 }, { say: C.up }, { rest: 12, cues: [{ at: 0.5, say: C.pause }] }, { say: C.close }, { rest: 5 }],
    },
  ],
  learn: `
<p>A lying-down routine after training. Breathe freely first, try longer exhales once breathing feels easy, and finish with two minutes without any cues. Calves on a chair are an optional comfort choice.</p>
<h3>The technique</h3>
<ul>
  <li>Lie on your back with your calves on a chair or bench, hips and knees at about 90°, or lie flat.</li>
  <li>First minute: breathe however you need to, using the mouth if that is easier. Let your belly move without bracing. Join the counts only once breathing feels easy; stay at your own pace until then and join when ready.</li>
  <li>Six breaths in through the nose for 4, out through the nose or mouth for 6; twenty seconds at your own pace; then fifteen breaths at 4 in, 8 out. Keep each breath a comfortable size. Use whichever exhale route feels easier throughout both blocks.</li>
  <li>Finish with two quiet minutes of natural breathing. Leave the count whenever you need to.</li>
  <li>At the end, lower supported legs, roll onto your side and sit up slowly. Pause sitting before standing. If you feel lightheaded, lie back down.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Oxygen use remains elevated just after exercise as the body restores energy stores and cools down. That is a reason to let breathing settle before imposing a slower count.</li>
  <li>Heart rate usually falls during the exhale and rises during the inhale. Slow breathing often increases this variation between heartbeats, even if the average pulse is still above its resting rate ${ev.solid}.</li>
  <li>A small study of nine women found faster heart-rate recovery with six breaths a minute after moderate cycling than with seated rest or easy pedalling. Our first paced block is six a minute; the longer-exhale block is five. The study did not test this whole routine or legs on a chair ${ev.some}.</li>
  <li>After exercise, blood vessels in the muscles can remain widened while heart rate falls. Blood pressure can be lower, and standing adds the pull of gravity. This is why the return to standing is gradual; a lower pulse alone does not mean blood pressure is back to normal.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Yasuma and Hayano 2004, <a href="https://pubmed.ncbi.nlm.nih.gov/14769752/" target="_blank" rel="noopener">respiratory sinus arrhythmia</a>, Chest.</li>
  <li>Zumbro et al. 2019, <a href="https://scholars.georgiasouthern.edu/en/publications/the-influence-of-a-slow-breathing-protocol-on-heart-rate-and-bloo/" target="_blank" rel="noopener">a slow-breathing protocol and heart rate and blood pressure after exercise</a>.</li>
  <li>Romero et al. 2017, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5407206/" target="_blank" rel="noopener">the cardiovascular system after exercise</a>, J Appl Physiol.</li>
  <li>Egan and Sharples 2023, <a href="https://journals.physiology.org/doi/10.1152/physrev.00054.2021" target="_blank" rel="noopener">molecular responses to acute exercise</a>, Physiol Rev.</li>
</ul>`,
};
