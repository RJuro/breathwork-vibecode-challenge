// Clear Nose: Buteyko / Patrick McKeown's nose-unblocking exercise, kept to moderate air
// hunger because his own guidance says strong air hunger isn't for an active cold.

import { line, say, HUM, SAFETY_HTML, ev } from './lib.js';

const K = {
  welcome: line('cn_welcome', "Sit tall. Breathe through your nose, or through whichever side is more open. If it's fully blocked, sip a little air through the corner of your mouth."),
  light: line('cn_light', 'Now breathe light. Quieter, slightly smaller breaths. Just a touch of air hunger, no more.', 'technique'),
  light2: line('cn_light2', 'Keep it small and quiet. A little air hunger is the point, but only a little.', 'technique'),
  cycle: line('cn_cycle', "One side blocked? Congestion naturally swaps sides every few hours. That's your nasal cycle, not the cold getting worse.", 'science'),
  how: line('cn_how', 'Now the nose-clearing exercise. After a small breath out, pinch your nose, and gently nod your head until you need to breathe.', 'technique'),
  release: line('cn_release', 'Release. Breathe in gently through the nose, no big breath. Calm it down within a few breaths.'),
  co2: line('cn_co2', 'As carbon dioxide gently builds, the nose often opens for a while. A small study saw this, much like after exercise.', 'science'),
  temp: line('cn_temp', 'Relief is often temporary. Come back to this whenever you need it, rather than pushing harder.', 'science'),
  gasp: line('cn_gasp', 'If your first breath after a hold is a gasp, the hold was too long. Next time, let go sooner.', 'technique'),
  hum: line('cn_hum', 'Five slow hums to finish. Humming vibrates the air in your sinuses. A few are plenty, more adds little.', 'science'),
  close: line('cn_close', 'Quiet, low, slow breathing through the nose. Come back to this whenever your nose closes up.'),
};

const SMALL = { inhale: 2, exhale: 2.5 };
const pinch = (seconds, cue) => ({ hold: 'empty', seconds, label: 'Pinch & nod', record: true, tick: false, cues: [{ at: 0.2, say: cue }] });

export const clearNose = {
  id: 'clear-nose',
  title: 'Clear Nose',
  titleHtml: 'Clear <em>nose</em>',
  tag: 'Getting sick',
  blurb: 'Breathe light, three gentle pinch-and-nod holds, five hums.',
  lede: "For a stuffy nose. Patrick McKeown's nose-unblocking exercise, kept gentle for a cold, then a few slow hums.",
  music: 'tide',
  accent: ['#cfe8ff', '#5b8fd6'],
  sky: 'clear',
  intensity: ['gentle', 'standard'],
  intensityNotes: {
    gentle: 'No holds: breathe light and hum. For a fever, chest symptoms or feeling faint.',
    standard: 'Three short holds, to moderate air hunger at most.',
  },
  after: ['Relief is usually temporary. Repeat whenever your nose closes up, rather than holding longer.', 'See a doctor for breathlessness, chest pain, high fever, severe facial pain, or symptoms past ten days.'],
  sections: (opts) => [
    {
      id: 'clear-settle',
      title: 'Settle',
      what: 'Nose, or the more open side',
      color: '#9cc7f0',
      steps: [{ say: K.welcome, bell: 'low', lead: 2 }, { rest: 8 }],
    },
    {
      id: 'clear-light',
      title: 'Breathe light',
      what: 'Smaller, quieter breaths',
      color: '#7fb0e6',
      steps: [
        { say: K.light },
        opts.gentle
          ? { rest: 110, cues: [{ at: 15, say: K.cycle }, { at: 65, say: K.light2 }] }
          : { rest: 45, cues: [{ at: 15, say: K.cycle }] },
      ],
    },
    ...(opts.gentle
      ? []
      : [
          {
            id: 'nose-1',
            title: 'Hold 1',
            what: 'Pinch & nod, to the first urge',
            color: '#5b8fd6',
            steps: [
              { say: K.how, bell: 'bell' },
              { say: say('Round one. Small breath in, small breath out.'), gap: 0.2 },
              { pace: SMALL, count: 1, style: 'slow' },
              pinch(20, say('Pinch, and nod. Let go at the first clear urge.')),
              { say: K.release },
              { rest: 40, cues: [{ at: 8, say: K.co2 }] },
            ],
          },
          {
            id: 'nose-2',
            title: 'Hold 2',
            what: 'To moderate air hunger',
            color: '#4c7fc8',
            steps: [
              { say: say('Round two. Small breath in, small breath out. Pinch and nod, until moderate air hunger.'), bell: 'low', gap: 0.2 },
              { pace: SMALL, count: 1, style: 'slow' },
              pinch(30, say('Pinch, and nod.')),
              { say: K.release },
              { rest: 50, cues: [{ at: 6, say: K.temp }] },
            ],
          },
          {
            id: 'nose-3',
            title: 'Hold 3',
            what: 'To moderate air hunger',
            color: '#3f6fb8',
            steps: [
              { say: say('Last round. Same again.'), bell: 'low', gap: 0.2 },
              { pace: SMALL, count: 1, style: 'slow' },
              pinch(30, say('Pinch, and nod.')),
              { say: K.release },
              { rest: 35, cues: [{ at: 5, say: K.gasp }] },
            ],
          },
        ]),
    {
      id: 'clear-hum',
      title: 'Hum',
      what: 'Five slow hums',
      color: '#b39cff',
      steps: [{ say: K.hum, bell: 'bell', gap: 0.6 }, { pace: HUM, count: 5, style: 'hum' }],
    },
    {
      id: 'calm-close',
      title: 'Close',
      what: 'Quiet nasal breathing',
      color: '#7cc7c4',
      steps: [{ say: K.close, lead: 1 }, { rest: 15 }],
    },
  ],
  learn: `
<p>A comfort tool for a blocked nose: breathe light, then the Buteyko / Oxygen Advantage "nose-unblocking exercise", then a few hums.</p>
<h3>The technique</h3>
<ul>
  <li>Small breath in, small breath out through the nose (a sip through the corner of the mouth if fully blocked).</li>
  <li>Pinch the nose, lips closed, and gently nod or sway until you feel a clear need for air (typically 10–35 s). Release, breathe in gently through the nose, and calm the breathing within two or three breaths.</li>
  <li>Patrick McKeown normally uses medium-to-strong air hunger, but his own safety guidance lists an active cold or flu among times to avoid strong air hunger. So here: the first urge, then moderate at most, three rounds.</li>
</ul>
<h3>Why it might work</h3>
<ul>
  <li>Exercise reliably opens the nose: nasal resistance fell by about half a minute after exercise in one study, probably through sympathetic narrowing of the nasal blood vessels ${ev.solid}.</li>
  <li>Raising CO₂ by rebreathing lowered nasal resistance in a tiny 1977 study of four people ${ev.spec}. No study has tested the breath-hold exercise itself.</li>
  <li>Humming raises nasal nitric oxide about 15-fold, with the biggest boost on the first hum and recovery after about three minutes ${ev.solid}. There's no evidence it treats a cold ${ev.spec}.</li>
  <li>Congestion swapping sides every few hours is the normal nasal cycle, found in most adults ${ev.solid}.</li>
  <li>Steam inhalation shows no clear benefit for colds (Cochrane) ${ev.some}.</li>
</ul>
<p><strong>Bottom line:</strong> relief is usually modest and temporary. Repeat it when you need it, rather than holding longer.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>McKeown P. <em>The Oxygen Advantage</em>; <a href="https://oxygenadvantage.com/blogs/blog/safety-guidelines-oxygen-advantage-breathwork-training" target="_blank" rel="noopener">safety guidelines</a>; <a href="https://buteykoclinic.com/pages/buteyko-breathing-method-nose-unblocking-exercise" target="_blank" rel="noopener">nose-unblocking exercise</a>, Buteyko Clinic.</li>
  <li>Dallimore &amp; Eccles 1977, <a href="https://pubmed.ncbi.nlm.nih.gov/920143/" target="_blank" rel="noopener">CO₂ and nasal airway resistance</a>, Acta Otolaryngol.</li>
  <li>Strohl et al. 1988, <a href="https://pubmed.ncbi.nlm.nih.gov/3222760/" target="_blank" rel="noopener">exercise and nasal resistance</a>, Thorax.</li>
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">humming and nasal NO</a>; Maniscalco et al. 2003, <a href="https://pubmed.ncbi.nlm.nih.gov/12952268/" target="_blank" rel="noopener">repeated humming</a>.</li>
  <li>Singh et al. 2017, <a href="https://pubmed.ncbi.nlm.nih.gov/28849871/" target="_blank" rel="noopener">heated, humidified air for the common cold</a>, Cochrane.</li>
</ul>`,
};
