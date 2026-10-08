// Sleep: a wind-down built on a lengthening exhale and Andrew Weil's 4-7-8.

import { line, say, SAFETY_HTML, ev } from './lib.js';

const W = {
  welcome: line('n478_welcome', 'Welcome. Lie down if you can, and let the bed take your weight. This is a wind-down, not a test.'),
  six: say('In for four, out for six. Six breaths.'),
  eight: say('Now out for eight. Eight breaths.'),
  exhale: line('n478_exhale', 'Your heart slows a little on every exhale. A longer exhale gives it more time to settle.', 'science'),
  mind: line('n478_mind', 'Counting gives a busy mind something simple to hold on to.', 'science'),
  tongue: line('n478_tongue', 'Next, four, seven, eight. Rest the tip of your tongue behind your upper front teeth, and keep it there.', 'technique'),
  count: say('Four rounds. In through the nose for four, hold for seven, and whoosh out through the mouth for eight.'),
  ratio: line('n478_ratio', 'If the hold feels long, let it go early. The ratio matters more than the seconds.', 'technique'),
  drift: line('n478_drift', 'Let go of counting. Let the breath be as slow and as small as it wants.'),
  end: line('n478_end', 'Nothing more to do. Stay here as long as you like.'),
};

export const windDown = {
  id: 'wind-down',
  title: 'Wind Down',
  titleHtml: 'Wind <em>down</em>',
  tag: 'Sleep',
  blurb: 'Longer and longer exhales, four rounds of 4-7-8, then drift.',
  lede: 'Lie down. Exhales grow longer, then four rounds of 4-7-8, then nothing at all. A wind-down for the end of the day.',
  music: 'night',
  accent: ['#b9bdf7', '#3d3f9c'],
  sky: 'night',
  after: ['Dim screens and lights after this, so the calm has a chance to stick.', 'Weil suggests no more than four rounds of 4-7-8 at a time for the first month.'],
  sections: [
    {
      id: 'night-settle',
      title: 'Settle',
      what: 'Lie down, natural breathing',
      color: '#8f93e6',
      steps: [{ say: W.welcome, bell: 'low', lead: 2 }, { rest: 30 }],
    },
    {
      id: 'night-lengthen',
      title: 'Lengthen',
      what: '4 in · 6 out, then 4 in · 8 out',
      color: '#6e72d8',
      steps: [
        { say: W.six, gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 6, style: 'count', cues: [{ breath: 2, say: W.exhale }] },
        { say: W.eight, gap: 0.6 },
        { pace: { inhale: 4, exhale: 8 }, count: 8, style: 'count', cues: [{ breath: 3, say: W.mind }] },
      ],
    },
    {
      id: 'night-478',
      title: '4-7-8',
      what: 'Four rounds',
      color: '#4d51b8',
      steps: [
        { say: W.tongue, bell: 'bell' },
        { say: W.ratio },
        { say: W.count, gap: 0.8 },
        {
          pace: { inhale: 4, holdIn: 7, exhale: 8 },
          count: 4,
          style: 'count',
          labels: (ph) => ({ in: 'In · nose', top: 'Hold', out: 'Whoosh out' })[ph],
        },
      ],
    },
    {
      id: 'night-drift',
      title: 'Drift',
      what: 'No counting',
      color: '#3d3f9c',
      steps: [{ say: W.drift, lead: 2 }, { rest: 50 }, { say: W.end }, { rest: 30 }],
    },
  ],
  learn: `
<p>A wind-down rather than a sleep treatment: exhales that lengthen, four rounds of Andrew Weil's 4-7-8, then a minute or so with nothing to do.</p>
<h3>The technique</h3>
<ul>
  <li>Exhales grow from six to eight seconds, through the nose.</li>
  <li><strong>4-7-8:</strong> tongue tip resting behind the upper front teeth throughout. In through the nose for 4, hold for 7, then a whooshing exhale through the mouth for 8. Weil suggests four rounds at a time for the first month, then up to eight.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>A long exhale slows the heart on every breath, and slow breathing reliably shifts the body toward its "rest" state ${ev.solid}.</li>
  <li>4-7-8 itself lowered heart rate and blood pressure in one small study, but raised HRV less than plain six-breaths-a-minute breathing in another ${ev.some}.</li>
  <li>Evidence that breathing exercises improve sleep is thin: one small uncontrolled study was positive, a randomized crossover trial found no robust benefit ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Weil A. <a href="https://awcim.arizona.edu/file?id=138394" target="_blank" rel="noopener">Three breathing exercises</a>, Andrew Weil Center for Integrative Medicine.</li>
  <li>Vierra et al. 2022, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9277512/" target="_blank" rel="noopener">Effects of sleep deprivation and 4-7-8 breathing on HRV, BP and anxiety</a>, Physiol Rep.</li>
  <li>Marchant et al. 2025, <a href="https://pubmed.ncbi.nlm.nih.gov/39864026/" target="_blank" rel="noopener">comparing breathing patterns for HRV</a>, Appl Psychophysiol Biofeedback.</li>
  <li>Kuula et al. 2020, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7198497/" target="_blank" rel="noopener">slow-paced breathing before sleep: randomized crossover</a>, Sci Rep.</li>
</ul>`,
};
