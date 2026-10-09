// Short meditations: Reps (Leo, counting breaths, for the morning) and Land (Mira, a body
// scan, after training or at night). Attention training, said plainly.

import { line, say, tip, SAFETY_HTML, ev } from './lib.js';

const minutesOf = (opts) => (opts.gentle ? 3 : (opts.holdScale ?? 1) > 1 ? 10 : 5);
const LENGTHS = { gentle: '3 min', standard: '5 min', deeper: '10 min' };

// ── Reps ───────────────────────────────────────────────
const R = {
  welcome: line('reps_welcome', 'Morning. Sit up, comfortable but awake. Hands on your thighs, and close your eyes.'),
  plan: line('reps_plan', "Here's the drill. Count your breaths out, one to ten, then start again at one. At some point you'll lose count. Everybody does. When you notice, go back to one. Every time you catch it, that's a rep."),
  breath: line('reps_breath', "Don't change your breathing. Let it do its thing, and just count it.", 'technique'),
  go: line('reps_go', "Next breath out, that's one."),
  drift: line('reps_drift', 'If you just realised you were somewhere else, good. You caught it. Back to one.'),
  quiet: tip('reps_t_quiet', 'Keep the count quiet. Like a whisper in your head.'),
  why: line('reps_why', 'Researchers use this exact task, counting breaths to ten, to measure attention. And people get better at it with practice.', 'science'),
  lost: line('reps_lost', 'Got to fifteen? <chuckle> Happens to everyone. Back to one.'),
  halfway: say('Halfway.'),
  minute: say('One more minute.'),
  release: line('reps_release', 'Okay. Let the counting go.'),
  check: line('reps_check', "Notice how your head feels now, compared to when you sat down. It might be busy, clear, or somewhere in between. Any of that's fine."),
  close: line('reps_close', 'Open your eyes. Go do the first thing on your list.'),
};
/** Counting time in seconds and its spoken cues, per length. */
const REPS_BLOCK = {
  3: [105, [[20, R.drift], [45, R.quiet], [62, R.why], [82, R.lost]]],
  5: [225, [[30, R.drift], [70, R.quiet], [105, R.why], [140, R.lost], [165, R.minute]]],
  10: [525, [[30, R.drift], [90, R.quiet], [150, R.why], [255, R.halfway], [340, R.lost], [465, R.minute]]],
};

export const reps = {
  id: 'reps',
  title: 'Reps',
  titleHtml: '<em>Reps</em>',
  tag: 'Meditation',
  moment: 'morning',
  voice: 'leo',
  blurb: 'Count your breaths to ten. Lose count, start again. That’s the rep.',
  lede: 'A short sit for the morning. Count your out-breaths from one to ten and start over. When you drift, notice it and go back to one. Every catch is a rep.',
  music: 'transit',
  accent: ['#f3dfc1', '#b9824a'],
  sky: 'clear',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: LENGTHS,
  intensityNotes: { gentle: 'Three minutes. A good first week.', standard: 'Five minutes.', deeper: 'Ten minutes, with fewer cues.' },
  defaultLevel: 'standard',
  after: ['Same time every morning makes it stick. Before the phone is best.', 'Losing count a lot is normal. The catching is the training.'],
  sections: (opts) => {
    const [secs, cues] = REPS_BLOCK[minutesOf(opts)];
    return [
      {
        id: 'reps-arrive',
        title: 'Arrive',
        what: 'Posture, the drill',
        color: '#e2c49c',
        steps: [{ say: R.welcome, bell: 'low', lead: 2 }, { say: R.plan }, { say: R.breath }, { rest: 6 }, { say: R.go, gap: 0.5 }],
      },
      {
        id: 'reps-count',
        title: 'Count',
        what: `One to ten, about ${Math.round(secs / 60)} min`,
        color: '#b9824a',
        steps: [{ rest: secs, label: 'Count, one to ten', cues: cues.map(([at, c]) => ({ at, say: c })) }],
      },
      {
        id: 'reps-close',
        title: 'Back',
        what: 'Eyes open',
        color: '#d9b98f',
        steps: [{ say: R.release, bell: 'bell' }, { rest: 8 }, { say: R.check }, { rest: 4 }, { say: R.close }, { rest: 3 }],
      },
    ];
  },
  learn: `
<p>A short attention drill for the start of the day. Count your out-breaths from one to ten, then start again. When you notice you've drifted, or counted past ten, go back to one.</p>
<h3>The technique</h3>
<ul>
  <li>Sit up, comfortable but awake. Eyes closed, or resting on the floor.</li>
  <li>Don't steer the breath. Count each out-breath silently: one, two… ten, then one again.</li>
  <li>Losing count is the point, not a failure. Noticing it and starting over is the repetition.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Breath counting to ten is used in research as a behavioural measure of mindful attention, and accuracy improves with mindfulness training ${ev.some}.</li>
  <li>Short daily mindfulness practice lowered anxiety over a month, about as much as the breathing practices it was compared with ${ev.some}.</li>
  <li>Claims that a few minutes a day sharpens focus at work are mostly untested ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Levinson et al. 2014, <a href="https://doi.org/10.3389/fpsyg.2014.01202" target="_blank" rel="noopener">A mind you can count on: validating breath counting as a behavioral measure of mindfulness</a>, Front Psychol.</li>
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
</ul>`,
};

// ── Land ───────────────────────────────────────────────
const D = {
  welcome: line('land_welcome', 'Hey. Lie down on your back, arms by your sides. Palms up, if that feels okay.'),
  plan: line('land_plan', "We're going to move your attention slowly through your body, from your feet up to your head. Nothing to fix. You don't even have to relax. Just notice what's there."),
  sigh: line('land_sigh', 'Start with one big sigh. In through the nose, and let it all go. <sighs>'),
  feet: line('land_feet', "Start with your feet. Notice your heels on the floor, your soles and toes. You might feel warmth, cold, tingling, or nothing. That's fine."),
  legs: line('land_legs', 'Move up into your calves and knees, then your thighs. Notice whether your legs feel heavy.'),
  hips: line('land_hips', 'Now your hips and lower back. Feel where you meet the floor.'),
  belly: line('land_belly', 'Your belly. Let it rise and fall on its own. You don\'t have to help.'),
  wander: tip('land_t_wander', "If your mind wandered off, that's normal. Pick up wherever you left off."),
  chest: line('land_chest', 'Your chest and upper back. Notice the breath moving there.'),
  hands: line('land_hands', 'Your hands. Fingertips, palms, the backs of your hands. Then up your arms to your shoulders.'),
  neck: line('land_neck', 'Your neck and jaw. If your jaw feels tense, let it loosen a little.'),
  face: line('land_face', 'Your face. Eyes, forehead, back of your head. Notice any heaviness against the floor.'),
  whole: line('land_whole', 'Now the whole body at once, lying here, breathing. Stay with that for a while.'),
  science: line('land_science', 'Body scans are a core part of most mindfulness programs. In trials, those programs help with stress and sleep. The benefits are small, but consistent.', 'science'),
  back: line('land_back', 'Start to come back. Wiggle your fingers and your toes.'),
  close: line('land_close', "If it's bedtime, you can just stay here. If not, roll onto your side first, and take your time getting up."),
};
const STOPS = [D.feet, D.legs, D.hips, D.belly, D.chest, D.hands, D.neck, D.face];
const LAND_QUIET = { 3: [4, 8], 5: [14, 30], 10: [48, 90] }; // seconds after each stop, after the whole body

export const land = {
  id: 'land',
  title: 'Land',
  titleHtml: '<em>Land</em>',
  tag: 'Meditation',
  moment: 'night',
  voice: 'mira',
  blurb: 'Lie down. A slow scan from your feet to your head. Nothing to fix.',
  lede: 'A body scan, lying down. Attention moves slowly from the feet to the head, with quiet in between. For after training, or for the end of the day.',
  music: 'tide',
  accent: ['#cfc6f2', '#5b4f9e'],
  sky: 'night',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: LENGTHS,
  intensityNotes: { gentle: 'Three minutes. A quick landing.', standard: 'Five minutes.', deeper: 'Ten minutes, long quiet between stops.' },
  defaultLevel: 'standard',
  after: ['At night, start it in bed and put the phone face down.', 'After training it works well right after the Cool-down.'],
  sections: (opts) => {
    const [quiet, end] = LAND_QUIET[minutesOf(opts)];
    return [
      {
        id: 'land-arrive',
        title: 'Lie down',
        what: 'One big sigh',
        color: '#a99ee0',
        steps: [{ say: D.welcome, bell: 'low', lead: 2 }, { say: D.plan }, { say: D.sigh }, { rest: 5 }],
      },
      {
        id: 'land-scan',
        title: 'Scan',
        what: 'Feet to head',
        color: '#7d70c4',
        steps: STOPS.flatMap((s, i) => [{ say: s, gap: 0.5 }, { rest: quiet, cues: i === 3 && quiet >= 20 ? [{ at: quiet - 7, say: D.wander }] : [] }]),
      },
      {
        id: 'land-whole',
        title: 'Whole body',
        what: 'Lying here, breathing',
        color: '#5b4f9e',
        steps: [{ say: D.whole, gap: 0.5 }, { rest: end }, { say: D.science, min: 0 }],
      },
      {
        id: 'land-back',
        title: 'Back',
        what: 'Slowly',
        color: '#b9b0e6',
        steps: [{ say: D.back, bell: 'bell' }, { rest: 6 }, { say: D.close }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>A body scan: attention moves slowly from the feet to the head, with quiet in between. You're not trying to relax anything, only to notice it.</p>
<h3>The technique</h3>
<ul>
  <li>Lie on your back, arms by your sides. A pillow under the knees if your back likes that.</li>
  <li>Follow the voice from stop to stop. In the quiet, stay with that part of the body.</li>
  <li>When the mind wanders, notice it and pick up where you left off.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>The body scan is a core exercise in mindfulness programmes, which reduce stress by a small-to-moderate amount in trials ${ev.some}.</li>
  <li>Mindfulness training improved self-rated sleep quality modestly in a meta-analysis of randomized trials ${ev.some}.</li>
  <li>The body scan on its own, as a short session, is less studied ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Rusch et al. 2019, <a href="https://doi.org/10.1111/nyas.13996" target="_blank" rel="noopener">The effect of mindfulness meditation on sleep quality: a systematic review and meta-analysis of randomized controlled trials</a>, Ann N Y Acad Sci.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">breathwork and stress: meta-analysis of RCTs</a>, Sci Rep.</li>
</ul>`,
};
