// Short meditations: Reps (Leo, counting breaths, for the morning) and Land (Mira, a body
// scan, after training or at night). Attention training, said plainly.

import { line, say, tip, lesson, SAFETY_HTML, ev } from './lib.js';

const minutesOf = (opts) => (opts.gentle ? 3 : (opts.holdScale ?? 1) > 1 ? 10 : 5);
const LENGTHS = { gentle: '3 min', standard: '5 min', deeper: '10 min' };

// ── Reps ───────────────────────────────────────────────
const R = {
  welcome: line('reps_welcome3', 'Sit upright, with your hands resting on your thighs. Close your eyes, or keep a soft gaze on the floor.'),
  plan: line('reps_plan3', 'Count each out-breath silently from one to ten, then start again. If you lose count or go past ten, start at one.'),
  breath: line('reps_breath3', "Let your breathing find its own pace before you start. You don't need to make the breaths deeper or slower.", 'technique'),
  go: line('reps_go3', 'On your next out-breath, count one.'),
  drift: tip('reps_t_drift4', "If you've drifted into planning your day, leave it mid-sentence and start at one on the next out-breath."),
  quiet: lesson('reps_l_autopilot', 'The numbers can keep going while your attention is elsewhere. Check whether you can feel the breath that goes with each number.'),
  halfway: say("You're halfway through the counting."),
  minute: say('One more minute of counting.'),
  release: line('reps_release3', 'Stop counting now. Notice one out-breath without giving it a number.'),
  debrief: lesson('reps_l_debrief4', 'Each time you caught a lost count and started again, you practiced noticing where your attention went.'),
  close: line('reps_close4', "If your eyes are closed, open them when you're ready."),
};
/** Counting time in seconds and its spoken cues, per length. */
const REPS_BLOCK = {
  3: [104, [[20, R.drift], [42, R.quiet]]],
  5: [224, [[30, R.drift], [70, R.quiet], [164, R.minute]]],
  10: [524, [[30, R.drift], [90, R.quiet], [262, R.halfway], [464, R.minute]]],
};

export const reps = {
  id: 'reps',
  title: 'Reps',
  titleHtml: '<em>Reps</em>',
  tag: 'Meditation',
  moment: 'morning',
  voice: 'leo',
  blurb: 'Count your out-breaths to ten. When you lose count, start at one.',
  lede: 'A morning attention drill, seated and breathing at your own pace. Count each out-breath from one to ten, then repeat. Notice when the count runs ahead of your attention.',
  music: ['focus', 'midnight', 'keys'],
  accent: ['#f3dfc1', '#b9824a'],
  sky: 'clear',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: LENGTHS,
  intensityNotes: { gentle: 'About three minutes.', standard: 'About five minutes.', deeper: 'About ten minutes, with longer stretches of quiet.' },
  defaultLevel: 'standard',
  after: ['Choose a place where you can sit upright without holding yourself stiff.', 'Count the breaths you feel, rather than letting the numbers run on their own.'],
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
        what: 'Finish counting',
        color: '#d9b98f',
        steps: [{ rest: 14, label: 'Your own pace', bell: 'bell', cues: [{ at: 0.3, say: R.release }] }, { rest: 12, cues: [{ at: 0.3, say: R.debrief }] }, { say: R.close }, { rest: 3 }],
      },
    ];
  },
  learn: `
<p>A short attention drill for the start of the day. Count your out-breaths from one to ten, then start again. When you notice you've drifted, or counted past ten, go back to one.</p>
<h3>The technique</h3>
<ul>
  <li>Sit upright with your hands on your thighs. Close your eyes, or let your gaze rest on the floor.</li>
  <li>Don't steer the breath. Count each out-breath silently: one, two… ten, then one again.</li>
  <li>If you lose count or go past ten, start at one. Notice the actual breath as well as its number; counting can carry on while attention drifts.</li>
</ul>
<h3>What the research measures</h3>
<ul>
  <li>In a breath-counting study, participants counted to nine using buttons and reported when they caught themselves losing count. In Study 2, about 35 percent of counting errors were self-caught ${ev.some}.</li>
  <li>Accuracy was associated with less mind wandering and greater awareness of where attention was. Four weeks of training used longer sits than these; the results do not establish a benefit at work from this short drill ${ev.some}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Levinson et al. 2014, <a href="https://doi.org/10.3389/fpsyg.2014.01202" target="_blank" rel="noopener">A mind you can count on: validating breath counting as a behavioral measure of mindfulness</a>, Front Psychol.</li>
</ul>`,
};

// ── Land ───────────────────────────────────────────────
const D = {
  welcome: line('land_welcome3', 'Lie on your back, with your arms resting by your sides. Close your eyes, or let your gaze rest.'),
  plan: line('land_plan4', "We'll scan from feet to head, just noticing what's there. Stay with each area until the next cue. If attention wanders, return to the last area."),
  settle: line('land_settle4', 'Breathe at your own pace, and shift position whenever you need to get comfortable.'),
  feet: line('land_feet4', 'Notice your heels, soles and toes: pressure, warmth, or very little sensation.'),
  legs: line('land_legs4', 'Bring your attention to your calves, knees and thighs. Notice any heaviness or ache.'),
  hips: line('land_hips3', 'Notice your hips and lower back, and where their weight meets the surface underneath you.'),
  back: lesson('land_l_back', "Lying on your back, more of each breath goes to the back of your lungs, so you may feel it most against your support."),
  detail: lesson('land_l_adaptation4', 'Steady contact can fade from awareness, like the feel of your socks. If your hips feel faint, notice where the pressure is clearest.'),
  belly: line('land_belly4', 'Notice any movement in your belly as you breathe.'),
  chest: line('land_chest4', 'Notice your ribs and upper back, and any change in pressure against your support as you breathe.'),
  hands: line('land_hands4', 'Move your attention from your fingertips and palms along your arms to your shoulders.'),
  neck: line('land_neck4', 'Notice your neck and jaw, and whether your teeth are touching.'),
  face: line('land_face3', 'Notice your eyelids and forehead, then the weight of your head against its support.'),
  whole: line('land_whole4', 'Now take in the whole body at once, from heels to head. Stay here until the scan ends.'),
  close: line('land_close4', 'The scan is done. At bedtime, keep resting. To get up, move your fingers and toes, open your eyes if closed, roll onto your side, then sit up before standing.'),
};
const STOPS = [D.feet, D.legs, D.hips, D.belly, D.chest, D.hands, D.neck, D.face];
// The hips explanation follows time to feel the contact. Hands and whole body
// stay quiet; the short scan has no optional explanations.
const LAND_QUIET = { 3: [6, 13], 5: [20, 21], 10: [50, 81] }; // seconds after each stop, after the whole body

export const land = {
  id: 'land',
  title: 'Land',
  titleHtml: '<em>Land</em>',
  tag: 'Meditation',
  moment: 'night',
  voice: 'mira',
  blurb: 'Lie down for a body scan, breathing freely.',
  lede: 'A body scan for the end of the day or after training. Rest on your back and notice sensation from feet to head, with quiet between cues. At bedtime, stay lying down when it ends.',
  music: ['dusk', 'mind'],
  accent: ['#cfc6f2', '#5b4f9e'],
  sky: 'night',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: LENGTHS,
  intensityNotes: { gentle: 'About three minutes, with brief pauses.', standard: 'About five minutes.', deeper: 'About ten minutes, with long quiet between stops.' },
  defaultLevel: 'standard',
  after: ['At bedtime, start in bed so you can stay there when the scan ends.', 'After training, finish any active cool-down before lying down for the scan.'],
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
        steps: STOPS.flatMap((s, i) => [{ say: s, gap: 0.5 }, { rest: quiet, cues: quiet >= 20 && (i === 2 || i === 4) ? [{ at: quiet >= 50 ? 15 : 7, say: i === 2 ? D.detail : D.back }] : [] }]),
      },
      {
        id: 'land-whole',
        title: 'Whole body',
        what: 'Lying here, breathing',
        color: '#5b4f9e',
        steps: [{ say: D.whole, gap: 0.5 }, { rest: end }],
      },
      {
        id: 'land-back',
        title: 'Back',
        what: 'Slowly',
        color: '#b9b0e6',
        steps: [{ say: D.close }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>A body scan: attention moves slowly from the feet to the head, with quiet in between. You're not trying to relax anything, only to notice it.</p>
<h3>The technique</h3>
<ul>
  <li>Lie on your back, arms by your sides. Close your eyes or let your gaze rest. Use support under your knees if comfortable, and adjust your position whenever needed.</li>
  <li>Follow the voice from stop to stop. In the quiet, stay with that part of the body.</li>
  <li>When the mind wanders, return to the part you last noticed, then follow the next cue. Notice contact, temperature or movement rather than picturing the body part.</li>
  <li>You do not need to move or relax each area. At bedtime, keep resting when the scan ends. To get up, open your eyes if closed, roll onto your side and sit up before standing.</li>
</ul>
<h3>Attention and sensation</h3>
<ul>
  <li>Steady contact can become less noticeable over time. In a study with 21 participants, brain responses to sustained fingertip pressure decreased during stimulation. This is tactile adaptation; the feel of familiar clothing is an everyday example ${ev.some}.</li>
  <li>In a study with 12 participants, attention to finger vibrations changed early touch-related brain responses even when the physical stimulation was unchanged ${ev.some}.</li>
  <li>If a body part becomes easier to feel when you attend to it, attention may contribute to that change. You do not need to move it to notice more detail.</li>
  <li>A review of 14 body-scan studies found a small effect on mindfulness compared with passive controls ${ev.some}.</li>
</ul>
<p>The touch experiments did not test this scan or establish why a particular sensation changes during it. The body-scan studies were low quality and results varied; they do not establish a sleep or training-recovery benefit from this short practice.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Chung et al. 2015, <a href="https://doi.org/10.1186/s12868-015-0207-x" target="_blank" rel="noopener">Adaptation of cortical activity to sustained pressure stimulation on the fingertip</a>, BMC Neurosci.</li>
  <li>Eimer and Forster 2003, <a href="https://pubmed.ncbi.nlm.nih.gov/12842729/" target="_blank" rel="noopener">The spatial distribution of attentional selectivity in touch: evidence from somatosensory ERP components</a>, Clin Neurophysiol.</li>
  <li>Gan et al. 2022, <a href="https://pubmed.ncbi.nlm.nih.gov/35538557/" target="_blank" rel="noopener">The effects of body scan meditation: A systematic review and meta-analysis</a>, Appl Psychol Health Well Being.</li>
</ul>`,
};
