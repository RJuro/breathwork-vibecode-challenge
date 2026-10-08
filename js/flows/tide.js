// "Turn the Tide": a 15-minute flow shaped like Dylan Werner's breath-sequence wave
// (warm-up → heat → retention → cool-down → check-in), adapted for the first day of
// a cold: nasal breathing throughout, spaced humming bookends for nasal nitric oxide,
// short kapalabhati bursts (he keeps fast-breathing rounds short to limit hypocapnia)
// and holds that lengthen round by round.

import { line, say, L, PUMP, HUM, Num, mmss, scaled, settle, holdEmpty, holdFull, SAFETY_HTML, ev } from './lib.js';

const T = {
  welcome: line('welcome', 'Welcome. Sit tall, or lie down. Let your eyes close, and let the day go quiet for a few minutes.'),
  nose: line('nose', "Breathe only through your nose. It warms and filters the air, and it's where your sinuses add nitric oxide to every breath.", 'science'),
  ribs: line('ribs', 'Let the ribs widen to the sides, like a band stretching. Shoulders still, belly soft. Breathe in with no more effort than at rest.', 'technique'),
  ladderIntro: line('ladder_intro', "Now we lengthen the breath, one step at a time. Four counts in, four counts out. Follow the circle."),
  ladderUp: line('ladder_up', 'Five in, five out.'),
  ladderUp2: line('ladder_up2', 'Six in, six out. Smooth and even.'),
  humIntro: line('hum_intro', 'Humming breath. Breathe in through the nose, then hum the whole exhale, lips closed, jaw soft. Let the sound fill your head.', 'technique'),
  humCount: say('Five hums. In for four, then hum it all out.'),
  humScience: line('hum_science', 'Humming makes the air in your sinuses vibrate. In studies, it raised nitric oxide in the nose about fifteen-fold. In the lab, nitric oxide slows cold viruses.', 'science'),
  humSpace: line('hum_space', "The first hum gives the biggest boost, so we'll hum again at the end, once your sinuses have refilled.", 'science'),
  r1Intro: line('r1_intro', 'Round one. Kapalabhati. Short, sharp exhales through the nose, pulled from the belly. The inhale takes care of itself. Keep your face soft.', 'technique'),
  r2Intro: line('r2_intro', 'Round two. A few more breaths this time, and a longer hold. Many people find the second hold easier than the first.'),
  r3Intro: line('r3_intro', 'Last round. Let this be the easiest one.'),
  gIntro: line('g_intro', 'Slow, full breaths through the nose. Then a soft hold, with empty lungs.'),
  r1Tingle: line('r1_tingle', "Tingling or lightness is normal. The fast breathing lowered your carbon dioxide, and rising carbon dioxide is what makes you want to breathe. It's a signal, not an emergency.", 'science'),
  r1After: line('r1_after', 'Notice the tingling settle, as your carbon dioxide comes back up.', 'science'),
  r2Hunger: line('r2_hunger', 'Air hunger is just a sensation. Notice it without arguing with it. Soften your jaw, your eyes, your hands.', 'technique'),
  r3Still: line('r3_still', 'Nothing to do. Just the stillness of an empty breath.'),
  r3After: line('r3_after', 'Three rounds done. Notice the warmth in your hands and face, and the quiet behind it.'),
  fullScience: line('full_science', "With full lungs, oxygen stays high while carbon dioxide slowly rises. That's where your tolerance is built.", 'science'),
  kox: line('kox', 'In a 2014 study, people trained in this kind of breathing released a surge of adrenaline, and their inflammatory response to a bacterial toxin was roughly halved. Not a cold. But a sign your breath can talk to your immune system.', 'science'),
  coolIntro: line('cool_intro', 'Now cool down. Five slow breaths. In for four, out for eight.', 'technique'),
  coolScience: line('cool_science', "A long exhale turns up the vagus nerve, your body's brake pedal. Less stress is one of the few things linked to catching fewer colds.", 'science'),
  humAgain: line('hum_again', 'Three last hums. Long and low.'),
  checkin: line('checkin', 'Let the breath go. Notice how you feel. Warmth, quiet, whatever is here.'),
  close: line('close', 'That\'s your practice. Keep warm, have something hot to drink, and get to bed early. If a fever comes, rest instead, or choose the gentle version.'),
};

function round(n, o, opts) {
  const hold = scaled(o.hold, opts);
  const g = opts.gentle;
  const breaths = g
    ? [{ say: say('Five slow breaths.'), gap: 0.6 }, { pace: { inhale: 4, exhale: 6 }, count: 5, style: 'count' }]
    : [
        { say: say(`${Num(o.pumps)} quick breaths. Begin.`), gap: 0.4 },
        { pace: PUMP, count: o.pumps, style: 'pump', cues: [{ breath: o.pumps - 5, say: L.pumpLast }] },
      ];
  return {
    id: `round${n}`,
    title: `Round ${n}`,
    color: '#ff9b6a',
    what: `${g ? '5 slow breaths' : `${o.pumps} kapalabhati`} · ${mmss(hold)} hold out · ${mmss(o.full)} hold in`,
    steps: [
      { say: g ? (n === 3 ? T.r3Intro : T.gIntro) : o.intro, bell: 'bell' },
      ...breaths,
      settle(),
      holdEmpty(hold, g ? o.gentleHoldCues : o.holdCues),
      ...holdFull(o.full, g ? [{ at: 1, say: L.bandhaShort }] : o.fullCues),
      { say: L.release },
      ...o.after,
    ],
  };
}

export const tide = {
  id: 'tide',
  title: 'Turn the Tide',
  titleHtml: 'Turn the <em>tide</em>',
  tag: 'Getting sick',
  blurb: 'Humming, nasal breathing and three rounds of long, quiet holds.',
  lede: "For the scratchy-throat day. Humming, nasal breathing and three rounds of long, quiet holds, in the spirit of Dylan Werner's pranayama.",
  music: 'tide',
  intensity: true,
  intensityNotes: {
    gentle: 'No fast breathing, shorter holds. For a fever, or if holds are new to you.',
    standard: 'Kapalabhati, then empty holds of up to 45 s, 1:00 and 1:15.',
    deeper: 'Empty holds of up to 1:00, 1:20 and 1:40. Experienced practitioners only.',
  },
  accent: ['#f6c48f', '#e0785a'],
  after: [
    'Warm drink, early night. Sleep is the best-supported thing you can do for a cold.',
    'A few slow hums through the day are a nice reminder. Space them out; they work best that way.',
    'If a fever arrives, skip the rounds. Rest, or use the Gentle setting.',
  ],
  sections: (opts) => [
    {
      id: 'arrive',
      title: 'Arrive',
      what: 'Nasal breathing, a lengthening ladder',
      color: '#8f9cf0',
      steps: [
        { say: T.welcome, bell: 'low', lead: 2.5 },
        { rest: 7 },
        { say: T.nose },
        { rest: 9 },
        { say: T.ribs },
        { rest: 9 },
        { say: T.ladderIntro, gap: 0.8 },
        { pace: { inhale: 4, exhale: 4 }, count: 2, style: 'count' },
        { pace: { inhale: 5, exhale: 5 }, count: 2, style: 'count', cues: [{ at: 0, say: T.ladderUp }] },
        { pace: { inhale: 6, exhale: 6 }, count: 3, style: 'count', cues: [{ at: 0, say: T.ladderUp2 }] },
      ],
    },
    {
      id: 'hum',
      title: 'Hum',
      what: 'Bhramari, five long hums',
      color: '#b39cff',
      steps: [
        { say: T.humIntro, bell: 'bell' },
        { say: T.humCount, gap: 0.6 },
        { pace: HUM, count: 5, style: 'hum' },
        { say: T.humScience, lead: 1 },
        { say: T.humSpace, gap: 4 },
      ],
    },
    round(1, {
      pumps: 30,
      hold: 45,
      full: 20,
      intro: T.r1Intro,
      holdCues: [{ at: 4.5, say: L.breatheNow }, { at: 14, say: T.r1Tingle }],
      gentleHoldCues: [{ at: 4.5, say: L.breatheNow }],
      fullCues: [{ at: 1, say: L.bandha }],
      after: [{ rest: 12, cues: [{ at: 3, say: T.r1After }] }],
    }, opts),
    round(2, {
      pumps: 40,
      hold: 60,
      full: 25,
      intro: T.r2Intro,
      holdCues: [{ at: 20, say: T.r2Hunger }],
      gentleHoldCues: [{ at: 12, say: T.r3Still }],
      fullCues: [
        { at: 1, say: L.bandhaShort },
        { at: 7, say: T.fullScience },
      ],
      after: [{ say: T.kox, lead: 2 }],
    }, opts),
    round(3, {
      pumps: 45,
      hold: 75,
      full: 30,
      intro: T.r3Intro,
      holdCues: [{ at: 25, say: T.r3Still }],
      gentleHoldCues: [{ at: 15, say: T.r3Still }],
      fullCues: [{ at: 1, say: L.bandhaShort }],
      after: [{ rest: 12, cues: [{ at: 3, say: T.r3After }] }],
    }, opts),
    {
      id: 'close',
      title: 'Cool down',
      what: 'Long exhales, three hums, stillness',
      color: '#7cc7c4',
      steps: [
        { say: T.coolIntro, bell: 'bell', gap: 0.8 },
        { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', cues: [{ breath: 2, say: T.coolScience }] },
        { say: T.humAgain },
        { pace: HUM, count: 3, style: 'hum' },
        { say: T.checkin, lead: 1 },
        { rest: 26 },
        { say: T.close, bell: 'low' },
        { rest: 6 },
      ],
    },
  ],
  learn: `
<p>The session follows the arc Dylan Werner calls a <em>breath sequence</em>, built the way you'd build an asana class: warm up, build heat, go deep into retention, cool down, check in. Here it's adapted for the first day of a cold.</p>

<h3>The technique</h3>
<ul>
  <li><strong>Nose only.</strong> Werner calls nasal breathing "the number one thing". Let the ribs widen to the sides, keep the shoulders still and the belly soft, and breathe in with no more effort than at rest. The aim is to breathe <em>less</em>, not more.</li>
  <li><strong>The ladder</strong> (sama vritti): equal inhale and exhale, lengthened a second at a time, 4 → 5 → 6. It's his way of easing into a practice.</li>
  <li><strong>Humming</strong> (bhramari): a nasal inhale, then a hum through the whole exhale, lips closed.</li>
  <li><strong>Kapalabhati</strong>: short, sharp exhales driven from the belly; the inhale happens on its own. Werner keeps fast-breathing bursts short and follows them with a hold, to limit how far CO₂ drops.</li>
  <li><strong>Holds</strong> (kumbhaka): first with empty lungs (<em>bahya</em>), then with full lungs (<em>antara</em>). On the full hold, gently engage the root lock (<em>mula bandha</em>, a light lift of the pelvic floor) and tuck the chin a little (<em>jalandhara</em>). Air hunger is a sensation, not a verdict. Notice it and soften around it.</li>
  <li><strong>Cool-down</strong>: in for 4, out for 8, then three more hums and a minute of stillness.</li>
</ul>

<h3>What happens in your body</h3>
<p>Fast breathing blows off carbon dioxide. Blood vessels in the brain narrow a little and nerves get more excitable, which is the tingling and lightness you may feel ${ev.solid}. Because rising CO₂, not falling oxygen, drives the urge to breathe, the empty hold that follows feels easier than it should. In studies of similar protocols, oxygen saturation dips to around 60% by the end of a hold. That's why you only ever do this sitting or lying down.</p>
<p>With full lungs you carry a bigger oxygen store, so the full hold is mostly about letting CO₂ rise calmly. Slow breathing near six breaths a minute reliably raises heart-rate variability, a marker of vagal ("rest and digest") tone ${ev.solid}.</p>

<h3>…and the cold?</h3>
<ul>
  <li><strong>Humming</strong> raised nasal nitric oxide about 15-fold in healthy volunteers ${ev.solid}. Nitric oxide slows rhinovirus, the main common-cold virus, in cell culture ${ev.spec}. The boost is biggest on the first hum and takes about three minutes to recover, which is why the hums are split between the start and the end.</li>
  <li><strong>Breathing with retention</strong> plus training caused an adrenaline surge and roughly halved the inflammatory response to an injected bacterial toxin (Kox 2014) ${ev.some}. That's a lab model, not a virus, and calmer inflammation isn't the same as fighting off a cold.</li>
  <li><strong>Stress</strong> predicts catching colds in viral-challenge studies ${ev.solid}, and slow breathing modestly lowers stress ${ev.some}. Whether one leads to the other has never been tested.</li>
  <li><strong>Meditation</strong> reduced the severity of winter respiratory illness in one trial; a larger follow-up wasn't conclusive ${ev.some}.</li>
</ul>
<p><strong>Bottom line:</strong> no trial has tested breathwork against a cold. Think of this as care, not cure. The best-supported moves are still sleep, fluids and rest.</p>
<p class="muted">Patrick McKeown's own safety guidance advises against strong air hunger during an active cold or flu. Keep every hold comfortable, and once you're properly ill rather than just getting there, switch to Gentle or to Clear Nose.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Werner D. <em>The Illuminated Breath</em> (2021); <a href="https://blog.alomoves.com/mindfulness/dylan-werners-4-breathing-exercises-to-immediately-reduce-stress" target="_blank" rel="noopener">4 breathing exercises</a> and <a href="https://blog.alomoves.com/mindfulness/how-to-do-box-breathing-for-less-stress" target="_blank" rel="noopener">box breathing</a>, Alo Moves. Cues here are paraphrased in his spirit, not his words.</li>
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus NO output using single-breath humming</a>, Eur Respir J.</li>
  <li>Sanders et al. 1998, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC124563" target="_blank" rel="noopener">Role of NO in rhinovirus infection</a>, J Virol.</li>
  <li>Kox et al. 2014, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4034215/" target="_blank" rel="noopener">Voluntary activation of the sympathetic nervous system</a>, PNAS; Zwaag et al. 2022, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9071023/" target="_blank" rel="noopener">Psychosom Med</a>.</li>
  <li>Citherlet et al. 2021, <a href="https://doi.org/10.3389/fspor.2021.700757" target="_blank" rel="noopener">Acute effects of the Wim Hof breathing method</a>, Front Sports Act Living.</li>
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">Slow-paced breathing and vagally-mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Cohen, Tyrrell &amp; Smith 1991, <a href="https://pubmed.ncbi.nlm.nih.gov/1713648/" target="_blank" rel="noopener">Psychological stress and susceptibility to the common cold</a>, NEJM.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">Effect of breathwork on stress and mental health: meta-analysis of RCTs</a>, Sci Rep.</li>
  <li>Barrett et al. 2012, <a href="https://www.annfammed.org/content/10/4/337" target="_blank" rel="noopener">Meditation or exercise for preventing acute respiratory infection</a>, Ann Fam Med; 2018 follow-up in <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6014660/" target="_blank" rel="noopener">PLoS One</a>.</li>
</ul>
`,
};
