// Short meditations: Reps (Leo, counting breaths, for the morning) and Land (Mira, a body
// scan, after training or at night). Attention training, said plainly.

import { line, say, tip, SAFETY_HTML, ev } from './lib.js';

const minutesOf = (opts) => (opts.gentle ? 3 : (opts.holdScale ?? 1) > 1 ? 10 : 5);
const LENGTHS = { gentle: '3 min', standard: '5 min', deeper: '10 min' };

// ── Reps ───────────────────────────────────────────────
const R = {
  welcome: line('reps_welcome', 'Morning. Sit up, comfortable but awake. Hands on your thighs, and close your eyes.'),
  plan: line('reps_plan2', "Count each out-breath silently, from one to ten, then start over. If you lose track, begin at one again. We're practising noticing when attention drifts."),
  breath: line('reps_breath2', "Breathe at your own pace for a few moments before counting. There's no rhythm to follow.", 'technique'),
  go: line('reps_go', "Next breath out, that's one."),
  drift: tip('reps_t_drift2', "If a thought takes over, you don't have to finish it before bringing your attention back to the breath."),
  quiet: tip('reps_t_quiet2', "Keep each number brief in your head, so you can still notice the breath it's counting."),
  why: line('reps_why2', 'Researchers use breath counting to study mindful attention. In one study, people counted more accurately after several weeks of practice.', 'science'),
  limits: line('reps_why_limits', "That study involved much longer sits than this. It doesn't tell us whether a few minutes will improve focus at work.", 'science'),
  halfway: say('Halfway.'),
  minute: say('One more minute of counting.'),
  release: line('reps_release2', "Let the counting go now. Keep breathing at your own pace while you sit here for a bit."),
  check: line('reps_check', "Notice how your head feels now, compared to when you sat down. It might be busy, clear, or somewhere in between. Any of that's fine."),
  close: line('reps_close', 'Open your eyes. Go do the first thing on your list.'),
};
/** Counting time in seconds and its spoken cues, per length. */
const REPS_BLOCK = {
  3: [100, [[20, R.drift], [42, R.quiet], [60, R.why], [78, R.limits]]],
  5: [220, [[30, R.drift], [70, R.quiet], [105, R.why], [130, R.limits], [160, R.minute]]],
  10: [520, [[30, R.drift], [90, R.quiet], [150, R.why], [190, R.limits], [260, R.halfway], [460, R.minute]]],
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
  music: ['focus', 'midnight', 'keys'],
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
        steps: [{ say: R.welcome, bell: 'low', lead: 2 }, { say: R.plan }, { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: R.breath }] }, { say: R.go, gap: 0.5 }],
      },
      {
        id: 'reps-count',
        title: 'Count',
        what: `One to ten, about ${Math.round(secs / 60)} min`,
        color: '#b9824a',
        steps: [{ rest: secs, cues: cues.map(([at, c]) => ({ at, say: c })) }],
      },
      {
        id: 'reps-close',
        title: 'Back',
        what: 'Eyes open',
        color: '#d9b98f',
        steps: [{ rest: 14, label: 'Your own pace', bell: 'bell', cues: [{ at: 0.3, say: R.release }] }, { say: R.check }, { rest: 4 }, { say: R.close }, { rest: 3 }],
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
  <li>Breath counting is used in research as a behavioural measure of mindful attention. In one study, accuracy improved after four weeks of training with much longer sits than these ${ev.some}.</li>
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
  plan: line('land_plan2', "We'll scan from feet to head. Stay with each area in the quiet between cues. There's no need to change anything."),
  settle: line('land_settle', "Take a few breaths at your own pace while you get comfortable. We'll start the scan in a moment."),
  feet: line('land_feet2', "Start with your heels, soles and toes. It's okay if there's little to notice."),
  legs: line('land_legs', 'Move up into your calves and knees, then your thighs. Notice whether your legs feel heavy.'),
  hips: line('land_hips', 'Now your hips and lower back. Feel where you meet the floor.'),
  belly: line('land_belly', 'Your belly. Let it rise and fall on its own. You don\'t have to help.'),
  wander: tip('land_t_wander', "If your mind wandered off, that's normal. Pick up wherever you left off."),
  chest: line('land_chest2', 'Notice your chest and upper back, including any movement as you breathe.'),
  hands: line('land_hands2', 'Notice your fingertips and palms, then the backs of your hands. Follow your arms up to your shoulders.'),
  neck: line('land_neck2', "Notice your neck and jaw. If there's tension, let it loosen a little."),
  face: line('land_face2', 'Notice your eyes and forehead, then where the back of your head is supported.'),
  whole: line('land_whole2', 'Now include the whole body in your attention. Keep breathing freely while you stay here.'),
  science: line('land_science2', 'Body scans are often part of longer mindfulness programs. Trials suggest those programs can help with stress and sleep, though results vary.', 'science'),
  limits: line('land_science_limits', "Those studies combine several exercises over weeks. They don't tell us how much a short body scan alone contributes.", 'science'),
  back: line('land_back', 'Start to come back. Wiggle your fingers and your toes.'),
  close: line('land_close', "If it's bedtime, you can just stay here. If not, roll onto your side first, and take your time getting up."),
};
const STOPS = [D.feet, D.legs, D.hips, D.belly, D.chest, D.hands, D.neck, D.face];
// Science shares a fixed free-breathing window, leaving quiet after the explanation.
// Skipping it changes how much is heard, not the advertised length.
const LAND_QUIET = { 3: [3, 29], 5: [15, 53], 10: [47, 97] }; // seconds after each stop, after the whole body

export const land = {
  id: 'land',
  title: 'Land',
  titleHtml: '<em>Land</em>',
  tag: 'Meditation',
  moment: 'night',
  voice: 'mira',
  blurb: 'Lie down. A slow scan from your feet to your head. Nothing to fix.',
  lede: 'A body scan, lying down. Attention moves slowly from the feet to the head, with quiet in between. For after training, or for the end of the day.',
  music: ['dusk', 'mind'],
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
        what: 'Get comfortable, breathe freely',
        color: '#a99ee0',
        steps: [{ say: D.welcome, bell: 'low', lead: 2 }, { say: D.plan }, { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: D.settle }] }],
      },
      {
        id: 'land-scan',
        title: 'Scan',
        what: 'Feet to head',
        color: '#7d70c4',
        steps: STOPS.flatMap((s, i) => [{ say: s, gap: 0.5 }, { rest: quiet, cues: i === 3 && quiet >= 12 ? [{ at: 2, say: D.wander }] : [] }]),
      },
      {
        id: 'land-whole',
        title: 'Whole body',
        what: 'Lying here, breathing',
        color: '#5b4f9e',
        steps: [{ say: D.whole, gap: 0.5 }, { rest: end, cues: [{ at: 0.5, say: D.science }, { at: 16, say: D.limits }] }],
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
  <li>Body scans are often included in mindfulness programmes. A review found limited evidence of reduced stress or distress from those programmes ${ev.some}.</li>
  <li>A meta-analysis found modest improvements in self-rated sleep quality compared with general comparison programmes, but no clear advantage over established sleep treatments ${ev.some}.</li>
  <li>The body scan on its own, as a short session, is less studied ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Rusch et al. 2019, <a href="https://doi.org/10.1111/nyas.13996" target="_blank" rel="noopener">The effect of mindfulness meditation on sleep quality: a systematic review and meta-analysis of randomized controlled trials</a>, Ann N Y Acad Sci.</li>
  <li>Goyal et al. 2014, <a href="https://pubmed.ncbi.nlm.nih.gov/24395196/" target="_blank" rel="noopener">Meditation programs for psychological stress and well-being: a systematic review and meta-analysis</a>, JAMA Intern Med.</li>
</ul>`,
};
