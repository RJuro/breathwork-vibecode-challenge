// Under the weather: Turn the Tide (Mira; humming, short kapalabhati rounds and quiet holds for
// the first day of a cold) and Clear Nose (Leo; breathe light, pinch-and-nod holds).
// After the research: hums come in sets of three, at least three minutes apart, because the
// nasal nitric-oxide boost is front-loaded and the sinuses take about three minutes to refill;
// holds stay near-silent, with the coaching in the recovery; and a minute's rest before
// standing up after holds.

import { line, say, tip, PUMP, Num, num, mmss, scaled, holdEmpty, holdFull, SAFETY_HTML, ev } from './lib.js';

const HUM = { inhale: 4, exhale: 9, holdOut: 1, hum: true }; // ~14 s a hum: where HRV peaked in one study

// ── Turn the Tide ──────────────────────────────────────
const T = {
  welcome: line('tw_welcome', "Hey. Rough day? Let's look after you a bit. Sit up tall, or lie down if that's easier, and close your eyes."),
  nose: line('tw_nose', "We'll breathe through the nose the whole time. Slow and quiet, no effort."),
  noseWhy: line('tw_nose_why', "Your nose warms and moistens the air, and catches a lot of what's floating around before it reaches your lungs. Your sinuses also make nitric oxide, a gas that helps protect your airways. Mouth breathing skips all of that.", 'science'),
  ribs: line('tw_ribs', 'As you breathe in, let your ribs widen out to the sides. Shoulders stay where they are, belly soft.', 'technique'),
  ladder: line('tw_ladder', "Let's stretch the breath out a little at a time. In for four, out for four. Just follow the circle."),
  five: say('Five in, five out.'),
  six: say('Six in, six out.'),
  humHow: line('tw_hum_how', 'Now some humming. Breathe in through your nose, then hum the whole way out with your lips closed. Keep it low, with your teeth a little apart. You might feel a buzz in your face.', 'technique'),
  ears: tip('tw_t_ears', 'If you like, rest your thumbs lightly on the little flaps at the front of your ears. The hum may sound louder inside your head.'),
  hums: say('Three hums.'),
  humWhy: line('tw_hum_why', 'Humming vibrates the air in your sinuses, pushing nitric oxide into your nose. One study measured about fifteen times more than during a normal breath out. The first hum releases the most. It takes about three minutes for the sinuses to fill up again, so we use small sets and space them out.', 'science'),
  humAgain: line('tw_hum_again', 'Time for three more hums. The sinuses have had time to fill up again.'),
  humLast: line('tw_hum_last', 'Three last hums. Long and low.'),
  r1: line('tw_r1', 'Round one. Kapalabhati. Short, sharp breaths out through the nose, from the belly. The breath in happens by itself. Keep your face relaxed.', 'technique'),
  r2: line('tw_r2', 'Round two. A few more breaths, and a longer hold. A lot of people find this one easier than the first.'),
  r3: line('tw_r3', 'Last round. Let it be the easiest one.'),
  gentle: line('tw_gentle', 'Five slow, full breaths through the nose. Then a soft hold, with your lungs empty.'),
  lastFew: say('Last few.'),
  slower: tip('tw_t_slower', 'If you lose the rhythm, slow down. Keep it steady.'),
  deepIn: line('tw_deep_in', 'Now one deep breath in.'),
  allOut: line('tw_all_out', 'And all the way out.'),
  holdOk: line('tw_hold_ok', 'Let go at the first strong urge. You can tap Breathe now whenever you want.'),
  lock: line('tw_lock', 'Gently lift your pelvic floor and lower your chin a little. Keep it easy, without straining.', 'technique'),
  lockShort: line('tw_lock_short', 'Same lock. Chin down, stay soft.', 'technique'),
  release: line('tw_release', 'Let it go, and breathe normally.'),
  first: line('tw_first', 'Keep the first breath after a hold calm. If you gasped, hold a bit less next time.', 'technique'),
  co2: line('tw_co2', "Quick note. Breathing fast doesn't add much oxygen. Your blood's already nearly full of it. Fast breathing lowers carbon dioxide. That can make you feel tingly or light and make the hold feel easier. The urge to breathe comes mainly from carbon dioxide building back up, not from oxygen running low. That warning can come late. That's why we only do this sitting or lying down.", 'science'),
  kox: line('tw_kox', "In a 2014 study, a group of young men in the Netherlands trained for ten days in a method like this: fast breathing, long holds, cold and meditation. They then got an injection of a toxin that causes flu-like symptoms for a few hours. The trained group had a burst of adrenaline, less inflammation, and felt less sick. But the study was small, they were healthy, and the toxin wasn't a virus. This doesn't cure a cold. It suggests breathing can affect the immune response.", 'science'),
  nh: line('tw_nh', 'No hold this time. Just breathe easily, and see how you feel.'),
  r3After: line('tw_r3_after', "That's three rounds. Your hands and face might feel warm. That's normal."),
  cool: say('Now cool down. In for four, out for eight. Five breaths.'),
  vagus: line('tw_vagus', 'A slow breath out can slow your heart a little. In virus studies, people under a lot of stress caught colds more easily, as did people who slept under six hours a night. So tonight, take it easy and get some sleep. That may help more than this session.', 'science'),
  checkin: line('tw_checkin', 'Let the breath go. Notice how you feel right now.'),
  stay: line('tw_stay', 'Stay where you are for a minute before you get up. After holds, standing up fast can make you dizzy.'),
  close: line('tw_close', "That's it for today. Keep warm, have something hot to drink, and get to bed early. If a fever turns up, skip the rounds and just rest."),
};

const humSet = (intro, extra = []) => [{ say: intro, bell: 'bell' }, ...extra, { say: T.hums, gap: 0.6 }, { pace: HUM, count: 3, style: 'hum' }];

function round(n, o, opts) {
  if (opts.noHolds) {
    return {
      id: `round${n}`,
      title: `Round ${n}`,
      color: '#ff9b6a',
      what: '5 slow breaths · no holds',
      steps: [
        { say: say(`Round ${num(n)}. Five slow breaths, then rest.`), bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 5, style: 'count' },
        { rest: 20, cues: [{ at: 1, say: T.nh }] },
      ],
    };
  }
  const hold = scaled(o.hold, opts);
  const g = opts.gentle;
  const group = `r${n}`;
  const breaths = g
    ? [{ say: T.gentle, gap: 0.6 }, { pace: { inhale: 4, exhale: 6 }, count: 5, style: 'count' }]
    : [
        { say: say(`${Num(o.pumps)} quick breaths. Go.`), gap: 0.4 },
        { pace: PUMP, count: o.pumps, style: 'pump', cues: [...(o.pumpCue ? [{ breath: 8, say: o.pumpCue }] : []), { breath: o.pumps - 5, say: T.lastFew }] },
      ];
  return {
    id: `round${n}`,
    title: `Round ${n}`,
    color: '#ff9b6a',
    what: `${g ? '5 slow breaths' : `${o.pumps} kapalabhati`} · ${mmss(hold)} hold out · ${mmss(o.full)} hold in`,
    steps: [
      ...(g ? [] : [{ say: o.intro, bell: 'bell' }]),
      ...breaths,
      { pace: { inhale: 4, exhale: 6 }, count: 1, style: 'slow', cues: [{ at: 0, say: T.deepIn }, { at: 4, say: T.allOut }] },
      holdEmpty(hold, o.holdCues || [], { group }),
      // A 6 s inhale: Mira's "Breathe in, all the way to the top, and hold…" needs the room.
      ...holdFull(o.full, [{ at: 1, say: n === 1 ? T.lock : T.lockShort }], { group, inhale: 6 }),
      { say: T.release },
      ...(o.after || []),
    ],
  };
}

export const tide = {
  id: 'tide',
  title: 'Turn the Tide',
  titleHtml: 'Turn the <em>tide</em>',
  tag: 'Under the weather',
  moment: 'anytime',
  voice: 'mira',
  blurb: 'Humming and quiet holds for a scratchy-throat day. Comfort, not a cure.',
  lede: 'For the scratchy-throat day: nose breathing, three short sets of humming, and three rounds of quiet holds. Warming and settling. Humming raises nasal nitric oxide, but no study shows breathwork treats a cold.',
  music: 'tide',
  accent: ['#f6c48f', '#e0785a'],
  intensity: ['none', 'gentle', 'standard', 'deeper'],
  intensityNotes: {
    none: 'No fast breathing and no breath holds: slow breathing and humming only.',
    gentle: 'No fast breathing. Shorter holds: up to 25, 35 and 45 s on empty, then 20–30 s full.',
    standard: '30–45 kapalabhati breaths, then holds of up to 45 s, 1:00 and 1:15 on empty, each followed by a 20–30 s full hold.',
    deeper: 'As Standard, with empty holds of up to 1:00, 1:20 and 1:40. Experienced practitioners only.',
  },
  after: [
    'Warm drink, early night. Sleep is the best-supported thing you can do for a cold.',
    'A few hums through the day are a nice reminder. Three at a time, a few minutes apart, works best.',
    'If a fever arrives, skip the rounds. Rest, or choose No holds.',
  ],
  sections: (opts) => [
    {
      id: 'arrive',
      title: 'Arrive',
      what: 'Nose breathing, a lengthening ladder',
      color: '#8f9cf0',
      steps: [
        { say: T.welcome, bell: 'low', lead: 2.5 },
        { rest: 5 },
        { say: T.nose },
        { say: T.noseWhy },
        { rest: 6 },
        { say: T.ribs },
        { rest: 8 },
        { say: T.ladder, gap: 0.8 },
        { pace: { inhale: 4, exhale: 4 }, count: 2, style: 'count' },
        { pace: { inhale: 5, exhale: 5 }, count: 2, style: 'count', cues: [{ at: 0, say: T.five }] },
        { pace: { inhale: 6, exhale: 6 }, count: 3, style: 'count', cues: [{ at: 0, say: T.six }] },
      ],
    },
    {
      id: 'hum',
      title: 'Hum',
      what: 'Three hums',
      color: '#b39cff',
      steps: [...humSet(T.humHow, [{ say: T.ears }]), { say: T.humWhy, lead: 1, gap: 3 }],
    },
    round(1, {
      pumps: 30,
      hold: 45,
      full: 20,
      intro: T.r1,
      holdCues: [{ at: 7, say: T.holdOk }],
      after: [{ rest: 16, cues: [{ at: 2, say: T.first }] }, { say: T.co2, lead: 0.5 }],
    }, opts),
    round(2, {
      pumps: 40,
      hold: 60,
      full: 25,
      intro: T.r2,
      pumpCue: T.slower,
      after: [{ rest: 10 }, { say: T.kox, lead: 1, min: 6 }],
    }, opts),
    {
      id: 'hum-2',
      title: 'Hum',
      what: 'Three more hums',
      color: '#b39cff',
      steps: humSet(T.humAgain),
    },
    round(3, {
      pumps: 45,
      hold: 75,
      full: 30,
      intro: T.r3,
      after: [{ rest: 12, cues: [{ at: 3, say: T.r3After }] }],
    }, opts),
    {
      id: 'close',
      title: 'Cool down',
      what: 'Long exhales, three last hums, stillness',
      color: '#7cc7c4',
      steps: [
        { say: T.cool, bell: 'bell', gap: 0.8 },
        { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', cues: [{ breath: 1, say: T.vagus }] },
        { say: T.humLast, gap: 0.6 },
        { pace: HUM, count: 3, style: 'hum' },
        { say: T.checkin, lead: 1 },
        { rest: 20 },
        { say: T.stay },
        { rest: 8 },
        { say: T.close, bell: 'low' },
        { rest: 6 },
      ],
    },
  ],
  learn: `
<p>A warm-up, three rounds of breathing and retention, and a cool-down, adapted for the first day of a cold. Hums come in three short sets, spread through the session.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Nose only.</strong> Ribs widen to the sides, shoulders still, belly soft. Breathe in with no more effort than at rest.</li>
  <li><strong>The ladder:</strong> equal breaths in and out, lengthened a second at a time, 4 → 5 → 6.</li>
  <li><strong>Humming</strong> (bhramari): in through the nose, then a low hum through the whole exhale, lips closed. Three hums at a time, at least three minutes apart.</li>
  <li><strong>Kapalabhati:</strong> short, sharp exhales from the belly; the inhale happens on its own. The bursts stay short, and each is followed by holds.</li>
  <li><strong>Holds:</strong> first with empty lungs, then with full lungs and a gentle lock (a light lift of the pelvic floor, chin slightly down). Come out of any hold whenever you want to.</li>
  <li><strong>Cool-down:</strong> in for 4, out for 8, three last hums, then a minute of stillness before you get up.</li>
</ul>
<h3>What happens in your body</h3>
<p>Fast breathing blows off carbon dioxide. Blood vessels in the brain narrow a little and nerves get more excitable, which is the tingling and lightness you may feel ${ev.solid}. Because rising CO₂, not falling oxygen, drives the urge to breathe, the empty hold that follows feels easier than it should. In studies of similar protocols, oxygen saturation dips to around 60% by the end of a hold. That's why you only ever do this sitting or lying down.</p>
<h3>…and the cold?</h3>
<ul>
  <li><strong>Humming</strong> raised nasal nitric oxide about 15-fold in healthy volunteers ${ev.solid}. The boost is biggest on the first hum and takes about three minutes to recover ${ev.solid}, hence three short sets. Nitric oxide slows rhinovirus, the main common-cold virus, in cell culture ${ev.spec}.</li>
  <li><strong>Breathing with retention</strong> plus training caused an adrenaline surge and roughly halved the inflammatory response to an injected bacterial toxin (Kox 2014) ${ev.some}. That's a lab model, not a virus.</li>
  <li><strong>Stress</strong> and <strong>short sleep</strong> predict catching colds in viral-challenge studies ${ev.solid}. Slow breathing modestly lowers stress ${ev.some}; whether that protects against colds has never been tested.</li>
</ul>
<p><strong>Bottom line:</strong> no trial has tested breathwork against a cold. Think of this as care, not cure. Sleep, fluids and rest are still the best-supported moves.</p>
<p class="muted">Breathing-retraining guidance advises against strong air hunger during an active cold or flu. Keep every hold comfortable, and once you're properly ill rather than just getting there, switch to No holds or to Clear Nose.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus NO output using single-breath humming</a>, Eur Respir J.</li>
  <li>Sanders et al. 1998, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC124563" target="_blank" rel="noopener">Role of NO in rhinovirus infection</a>, J Virol.</li>
  <li>Kox et al. 2014, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4034215/" target="_blank" rel="noopener">Voluntary activation of the sympathetic nervous system</a>, PNAS.</li>
  <li>Citherlet et al. 2021, <a href="https://doi.org/10.3389/fspor.2021.700757" target="_blank" rel="noopener">Acute effects of the Wim Hof breathing method</a>, Front Sports Act Living.</li>
  <li>Cohen, Tyrrell &amp; Smith 1991, <a href="https://pubmed.ncbi.nlm.nih.gov/1713648/" target="_blank" rel="noopener">Psychological stress and susceptibility to the common cold</a>, NEJM.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">Effect of breathwork on stress and mental health: meta-analysis of RCTs</a>, Sci Rep.</li>
</ul>`,
};

// ── Clear Nose ─────────────────────────────────────────
const K = {
  welcome: line('cl_welcome', "Blocked nose? Let's get it open. Sit tall and breathe through your nose, or through whichever side is more open. If it's completely blocked, sip a little air through the corner of your mouth."),
  humHow: line('cl_hum_how', 'We start with three hums. Breathe in through the nose, then hum all the way out with your lips closed.', 'technique'),
  light: line('cl_light', "Now breathe light. Smaller, quieter breaths than you'd like. A little air hunger, not a lot.", 'technique'),
  cycle: line('cl_cycle', "If one side's blocked, that can be normal. Your nose naturally switches sides every few hours. It doesn't necessarily mean your cold's getting worse.", 'science'),
  how: line('cl_how', "Here's the drill. Small breath in, small breath out. Then pinch your nose and gently nod your head. When you really need to breathe, let go, and breathe in through your nose, gently.", 'technique'),
  silly: line('cl_silly', "Yes, you'll look a bit silly. <chuckle> Nobody's watching."),
  release: line('cl_release', 'Let go. Breathe in through your nose, nice and gentle. No big breath.'),
  co2: line('cl_co2', 'As carbon dioxide builds a little, the nose often opens up for a while. A small study saw the same thing after exercise.', 'science'),
  first: tip('cl_t_first', 'Watch the first breath after the hold. Gentle, through the nose. No gulping.'),
  temp: line('cl_temp', 'The relief often wears off after a while. That\'s fine. Do it again later, rather than holding longer now.'),
  gasp: line('cl_gasp', 'If you gasped on that first breath, you held too long. Let go sooner next time.', 'technique'),
  quiet: line('cl_quiet', 'Now just quiet breathing through the nose for a minute. Small and slow.'),
  humAgain: line('cl_hum_again', 'Three more hums to finish. The sinuses have had time to fill up again.'),
  close: line('cl_close', 'Back to quiet breathing through your nose. Come back to this whenever it closes up again.'),
};
const SMALL = { inhale: 2, exhale: 2.5 };
const pinch = (seconds, cue, cues = []) => ({ hold: 'empty', seconds, label: 'Pinch & nod', record: true, tick: false, cues: [{ at: 0.2, say: cue }, ...cues] });

export const clearNose = {
  id: 'clear-nose',
  title: 'Clear Nose',
  titleHtml: 'Clear <em>nose</em>',
  tag: 'Under the weather',
  moment: 'anytime',
  voice: 'leo',
  blurb: 'Three hums, breathe light, three pinch-and-nod holds, three more hums.',
  lede: 'For a stuffy nose. A breathing-retraining exercise for unblocking the nose, kept gentle for a cold, with a short set of hums at each end.',
  music: 'tide',
  accent: ['#cfe8ff', '#5b8fd6'],
  sky: 'clear',
  intensity: ['none', 'standard'],
  intensityNotes: {
    none: 'No breath holds: hums, breathe light, hums.',
    standard: 'Three short pinch-and-nod holds: let go at the first urge, moderate air hunger at most.',
  },
  after: ['Relief is usually temporary. Repeat whenever your nose closes up, rather than holding longer.', 'See a doctor for breathlessness, chest pain, high fever, severe facial pain, or symptoms past ten days.'],
  sections: (opts) => [
    {
      id: 'clear-settle',
      title: 'Settle',
      what: 'Nose, or the more open side',
      color: '#9cc7f0',
      steps: [{ say: K.welcome, bell: 'low', lead: 2 }, { rest: 5 }],
    },
    {
      id: 'clear-hum',
      title: 'Hum',
      what: 'Three hums',
      color: '#b39cff',
      steps: [{ say: K.humHow, bell: 'bell' }, { say: T.hums, gap: 0.6 }, { pace: HUM, count: 3, style: 'hum' }],
    },
    {
      id: 'clear-light',
      title: 'Breathe light',
      what: 'Smaller, quieter breaths',
      color: '#7fb0e6',
      steps: [{ say: K.light }, { rest: opts.noHolds ? 150 : 45, cues: [{ at: 15, say: K.cycle }] }],
    },
    ...(opts.noHolds
      ? []
      : [
          {
            id: 'nose-1',
            title: 'Hold 1',
            what: 'Pinch & nod, to the first urge',
            color: '#5b8fd6',
            steps: [
              { say: K.how, bell: 'bell' },
              { say: K.silly },
              { say: say('Round one. Small breath in, small breath out.'), gap: 0.2 },
              { pace: SMALL, count: 1, style: 'slow' },
              pinch(20, say('Pinch, and nod. Let go at the first clear urge.')),
              { say: K.release },
              { rest: 40, cues: [{ at: 8, say: K.co2 }, { at: 24, say: K.first }] },
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
              { rest: 40, cues: [{ at: 6, say: K.temp }] },
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
              { rest: 20, cues: [{ at: 5, say: K.gasp }] },
              { say: K.quiet },
              { rest: 45 },
            ],
          },
        ]),
    {
      id: 'clear-hum-2',
      title: 'Hum',
      what: 'Three more hums',
      color: '#b39cff',
      steps: [{ say: K.humAgain, bell: 'bell' }, { say: T.hums, gap: 0.6 }, { pace: HUM, count: 3, style: 'hum' }],
    },
    {
      id: 'clear-close',
      title: 'Close',
      what: 'Quiet nasal breathing',
      color: '#7cc7c4',
      steps: [{ say: K.close, lead: 1 }, { rest: 12 }],
    },
  ],
  learn: `
<p>For a stuffy nose: a breathing-retraining exercise for unblocking the nose, kept to moderate air hunger for a cold, with three hums at each end.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Breathe light:</strong> quieter, slightly smaller breaths through the nose, enough for a touch of air hunger and no more.</li>
  <li><strong>Pinch and nod:</strong> after a small breath out, pinch the nose and gently nod the head. Let go at the first clear urge (first hold) or at moderate air hunger, then breathe in gently through the nose and calm the breath within a few breaths.</li>
  <li><strong>Hums:</strong> three at the start and three at the end, a few minutes apart, so the sinuses refill in between.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>A mild rise in CO₂ can open the nose for a while; a small study saw the same after exercise ${ev.some}. Relief is usually temporary.</li>
  <li>Breathing retraining that includes this kind of reduced breathing improved asthma symptoms and reduced reliever use in trials, though not lung function ${ev.some}.</li>
  <li>Humming raises nasal nitric oxide, most on the first hums ${ev.solid}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus NO output using single-breath humming</a>, Eur Respir J.</li>
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Bruton et al. 2018, <a href="https://doi.org/10.1016/S2213-2600(17)30474-5" target="_blank" rel="noopener">physiotherapy breathing retraining for asthma (BREATHE trial)</a>, Lancet Respir Med.</li>
</ul>`,
};
