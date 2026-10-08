// Calm: resonance breathing, cyclic sighing, alternate-nostril breathing.

import { line, say, SAFETY_HTML, ev } from './lib.js';

const oneMore = say('One more minute.');
const halfway = say('Halfway.');

// ── Resonance ──────────────────────────────────────────
const R = {
  welcome: line('coh_welcome', 'Welcome. Find a comfortable seat, and let your breath settle in through the nose.'),
  light: line('coh_light', "Slow doesn't mean big. Keep each breath light and quiet, as if you could barely hear it.", 'technique'),
  ease: say('Four in, five out. Ten breaths.'),
  main: say("Now four in, six out. We'll stay here for about six minutes."),
  sync: line('coh_sync', 'At around six breaths a minute, your breath and heart rhythm tend to fall into step, and heart-rate variability usually rises.', 'science'),
  vagal: line('coh_vagal', "Each long exhale lets the heart slow a little. That's the vagus nerve, your body's brake, doing its work.", 'science'),
  dizzy: line('coh_dizzy', 'If you feel lightheaded, breathe smaller, not faster.', 'technique'),
  three: say('About three minutes to go.'),
  five: line('coh_five', 'Studies suggest even five minutes of slow breathing can shift the body toward its calm, vagal state.', 'science'),
  ret: line('coh_return', 'Let go of the count. Let the breath find its own rhythm.'),
  close: line('coh_close', "That's your practice. Stand up slowly, and take this pace with you."),
};

export const resonance = {
  id: 'resonance',
  title: 'Resonance',
  titleHtml: 'Reso<em>nance</em>',
  tag: 'Calm',
  blurb: 'Six breaths a minute, the best-studied way to calm down.',
  lede: 'Six slow, light breaths a minute. The best-studied calming practice there is, and the simplest.',
  music: 'tide',
  accent: ['#c6efe9', '#4f9fb0'],
  sky: 'calm',
  after: ['Even five minutes a day helps. Same time each day makes it a habit.', 'Stand up slowly; blood pressure can dip a little after slow breathing.'],
  sections: [
    {
      id: 'calm-arrive',
      title: 'Arrive',
      what: 'Settle into nasal breathing',
      color: '#8fd0cc',
      steps: [{ say: R.welcome, bell: 'low', lead: 2 }, { rest: 6 }, { say: R.light }, { rest: 4 }],
    },
    {
      id: 'calm-ease',
      title: 'Ease in',
      what: '4 in · 5 out, ten breaths',
      color: '#7cc7c4',
      steps: [{ say: R.ease, gap: 0.6 }, { pace: { inhale: 4, exhale: 5 }, count: 10, style: 'count' }],
    },
    {
      id: 'calm-wave',
      title: 'Resonance',
      what: '4 in · 6 out, about six minutes',
      color: '#4f9fb0',
      steps: [
        { say: R.main, gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 6 },
          count: 36,
          style: 'count',
          cues: [
            { breath: 3, say: R.sync },
            { breath: 10, say: R.vagal },
            { breath: 14, say: R.dizzy },
            { breath: 18, say: R.three },
            { breath: 23, say: R.five },
            { breath: 30, say: oneMore },
          ],
        },
      ],
    },
    {
      id: 'calm-close',
      title: 'Return',
      what: 'Natural breathing',
      color: '#a7c9e6',
      steps: [{ say: R.ret, bell: 'bell' }, { rest: 30 }, { say: R.close }, { rest: 6 }],
    },
  ],
  learn: `
<p>Breathing at about six breaths a minute is the most consistently studied calming practice. It's the core of heart-rate-variability biofeedback, and you don't need a device to do it.</p>
<h3>The technique</h3>
<ul>
  <li>Through the nose, <strong>light and quiet</strong>. Slow is not the same as big: overly deep slow breaths blow off CO₂ and can make you lightheaded.</li>
  <li>A short warm-up at 4 in / 5 out, then 4 in / 6 out (6 breaths a minute) for about six minutes.</li>
</ul>
<h3>Why it works</h3>
<ul>
  <li>Near six breaths a minute, heart rate rises on the inhale and falls on the exhale in a large, regular wave. This is linked to the baroreflex resonating ${ev.solid}.</li>
  <li>A meta-analysis of 223 studies found slow breathing raises vagally mediated HRV during, straight after, and across weeks of practice ${ev.solid}. Five minutes worked about as well as twenty in one study ${ev.some}.</li>
  <li>A slightly longer exhale (4:6) may help a little more than 5:5, but studies disagree ${ev.some}.</li>
  <li>Across breathwork trials, stress drops by a small-to-moderate amount ${ev.some}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Lehrer &amp; Gevirtz 2014, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4104929/" target="_blank" rel="noopener">Heart rate variability biofeedback: how and why does it work?</a>, Front Psychol.</li>
  <li>Meehan &amp; Shaffer 2024, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11310264/" target="_blank" rel="noopener">1:1 vs 1:2 inhale:exhale at 6 breaths/min</a>.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">breathwork and stress: meta-analysis of RCTs</a>, Sci Rep.</li>
</ul>`,
};

// ── Cyclic sighing ─────────────────────────────────────
const C = {
  welcome: line('sigh_welcome', 'Welcome. This is the cyclic sigh: a double breath in, and a long, slow breath out.'),
  how: line('sigh_how', 'Breathe in through the nose. At the top, take a second, smaller sip to fill the lungs completely. Then let it all go through the mouth, slowly.', 'technique'),
  count: say('Five minutes. In, top up, and a long, slow breath out.'),
  science: line('sigh_science', 'In a month-long Stanford study, five minutes of daily cyclic sighing lifted mood more than mindfulness meditation.', 'science'),
  heart: line('sigh_heart', 'Your heart slows a little on every exhale. Making the exhale long leans the whole system toward calm.', 'science'),
  soft: line('sigh_soft', 'If you feel tingly, slow the exhale down. Calm, not forced.', 'technique'),
  close: line('sigh_close', 'Let your breath return to normal. One or two sighs, any time today, can be a small reminder of this.'),
};

export const sighing = {
  id: 'sighing',
  title: 'Cyclic Sighing',
  titleHtml: 'Cyclic <em>sighing</em>',
  tag: 'Calm',
  blurb: 'Double inhale, long exhale. Five minutes that lift your mood.',
  lede: 'A double breath in and a long, slow breath out. Five minutes a day lifted mood more than mindfulness in a month-long trial.',
  music: 'tide',
  accent: ['#ffd9c2', '#d9877a'],
  sky: 'calm',
  after: ['The study used five minutes a day for a month. Make it a daily habit.', 'One or two sighs in a tense moment is a fine pocket version.'],
  sections: [
    {
      id: 'calm-arrive',
      title: 'Settle',
      what: 'How the sigh works',
      color: '#f0b39c',
      steps: [{ say: C.welcome, bell: 'low', lead: 2 }, { say: C.how }],
    },
    {
      id: 'wave-sigh',
      title: 'Cyclic sighing',
      what: 'In · top up · long out, five minutes',
      color: '#d9877a',
      steps: [
        { say: C.count, gap: 0.6 },
        {
          pace: { inhale: 2.5, inhale2: 1, exhale: 7 },
          count: 28,
          style: 'slow',
          labels: (ph) => ({ in: 'In · nose', in2: 'Top up', out: 'Out · mouth' })[ph],
          cues: [
            { breath: 4, say: C.science },
            { breath: 10, say: C.heart },
            { breath: 14, say: halfway },
            { breath: 17, say: C.soft },
            { breath: 22, say: oneMore },
          ],
        },
      ],
    },
    {
      id: 'calm-close',
      title: 'Return',
      what: 'Natural breathing',
      color: '#a7c9e6',
      steps: [{ rest: 15, bell: 'bell' }, { say: C.close }, { rest: 6 }],
    },
  ],
  learn: `
<p>A cyclic sigh is a full inhale through the nose, a second short sip to top up the lungs, then a long, slow exhale through the mouth, repeated for five minutes.</p>
<h3>Why it works</h3>
<ul>
  <li>In a remote randomized trial, five minutes a day for 28 days of cyclic sighing raised positive mood more than mindfulness meditation, and the benefit grew over the month. It also lowered resting breathing rate ${ev.some}.</li>
  <li>Anxiety fell in every group, including box breathing and mindfulness. There was no measurable change in resting heart rate, HRV or sleep ${ev.some}.</li>
  <li>The long exhale slows the heart a little on every breath (respiratory sinus arrhythmia) ${ev.solid}. That the second sip re-opens collapsed air sacs is plausible but untested ${ev.spec}.</li>
</ul>
<p class="muted">The trial was small (108 people), registered late, and didn't report effect sizes. Promising, not settled.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
</ul>`,
};

// ── Nadi shodhana ──────────────────────────────────────
const N = {
  welcome: line('bal_welcome', 'Welcome to nadi shodhana, alternate nostril breathing. Sit tall, and rest your left hand in your lap.'),
  hand: line('bal_hand', 'Right hand up. Fold the index and middle fingers. Your thumb closes the right nostril, your ring finger closes the left.', 'technique'),
  blocked: line('bal_blocked', "If one side is blocked, don't force it. Just imagine the breath moving through it.", 'technique'),
  even: say('Four in, four out. Twelve rounds. We start on the left.'),
  lIn: line('bal_l_in', 'Thumb on the right. In through the left.'),
  rOut: line('bal_r_out', 'Switch. Out through the right.'),
  rIn: line('bal_r_in', 'In through the right.'),
  lOut: line('bal_l_out', 'Switch. Out through the left.'),
  rhythm: line('bal_rhythm', 'Switching sides slows the breath and gives your attention a steady rhythm to follow.', 'science'),
  long: say('Now four in, eight out. Ten rounds.'),
  bp: line('bal_bp', 'Small trials suggest regular practice may modestly lower blood pressure. Much of that is likely the slow breathing itself.', 'science'),
  tradition: line('bal_tradition', 'In yoga tradition, this practice is said to balance body and mind. Notice what balance feels like for you right now.'),
  last: say('Last round.'),
  release: line('bal_release', 'Release the hand. Breathe through both nostrils, and notice how the breath feels now.'),
  close: line('bal_close', "That's your practice. Carry the steadiness with you."),
};
const sides = (ph, i) => {
  const left = i % 2 === 0;
  if (ph === 'in') return left ? 'In · left' : 'In · right';
  if (ph === 'out') return left ? 'Out · right' : 'Out · left';
};

export const balance = {
  id: 'balance',
  title: 'Alternate Nostril',
  titleHtml: 'Alternate <em>nostril</em>',
  tag: 'Calm',
  blurb: 'Nadi shodhana: slow, even, and very steadying.',
  lede: 'Nadi shodhana. Breathing through one nostril at a time slows everything down and gives a busy mind a rhythm to follow.',
  music: 'tide',
  accent: ['#d9d0ff', '#6c63c9'],
  sky: 'balance',
  after: ['If your nose is blocked today, try Clear Nose first, or do this with the breath imagined.'],
  sections: [
    {
      id: 'balance-set',
      title: 'Set up',
      what: 'Hand position',
      color: '#b3a8f0',
      steps: [{ say: N.welcome, bell: 'low', lead: 2 }, { say: N.hand }, { say: N.blocked }],
    },
    {
      id: 'balance-even',
      title: 'Even',
      what: '4 in · 4 out, twelve rounds',
      color: '#8f86e0',
      steps: [
        { say: N.even, gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 4 },
          count: 24,
          style: 'count',
          labels: sides,
          cues: [
            { at: 0, say: N.lIn },
            { at: 4, say: N.rOut },
            { at: 8, say: N.rIn },
            { at: 12, say: N.lOut },
            { breath: 10, say: N.rhythm },
          ],
        },
      ],
    },
    {
      id: 'balance-long',
      title: 'Longer exhale',
      what: '4 in · 8 out, ten rounds',
      color: '#6c63c9',
      steps: [
        { say: N.long, gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 8 },
          count: 20,
          style: 'count',
          labels: sides,
          cues: [
            { breath: 4, say: N.bp },
            { breath: 10, say: N.tradition },
            { breath: 18, say: N.last },
          ],
        },
      ],
    },
    {
      id: 'calm-close',
      title: 'Release',
      what: 'Both nostrils, natural breathing',
      color: '#a7c9e6',
      steps: [{ say: N.release, bell: 'bell' }, { rest: 25 }, { say: N.close }, { rest: 6 }],
    },
  ],
  learn: `
<p>Nadi shodhana (“channel cleaning”) is alternate-nostril breathing: in through one side, out through the other, switching each breath.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Hand (Vishnu mudra):</strong> right hand, index and middle fingers folded. The thumb closes the right nostril; the ring finger closes the left.</li>
  <li>One round: in left, out right, in right, out left. Start and finish on the left.</li>
  <li>Here: 4:4 for twelve rounds, then a longer 4:8 exhale for ten. Classical texts build up to 1:4:2 with a hold after the inhale; that's left out of a calm session.</li>
</ul>
<h3>Why it works</h3>
<ul>
  <li>A pooled analysis of six small trials found lower blood pressure (about −7/−5 mmHg), but the trials were unblinded and very inconsistent ${ev.some}.</li>
  <li>Much of the effect is probably simply slow breathing plus focused attention ${ev.some}.</li>
  <li>The popular claim that the left nostril calms and the right energises is not supported: one recent trial found the opposite ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Nam et al. 2024, <a href="https://karger.com/cmr/article/31/5/449/910373/" target="_blank" rel="noopener">alternate nostril breathing and blood pressure: systematic review and meta-analysis</a>, Complement Med Res.</li>
  <li>Werner D. <em>The Illuminated Breath</em> (2021), chapters on nadi shodhana.</li>
</ul>`,
};
