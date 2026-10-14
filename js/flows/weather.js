// Under the weather: Turn the Tide (Mira; humming, short kapalabhati rounds and
// quiet holds) and Clear Nose (Leo; light breathing, pinch-and-nod holds).
// Teaching follows a thread across holds; recovery stays at the listener's own pace.

import { line, say, tip, lesson, callsFor, PUMP, Num, num, dur, mmss, scaled, holdEmpty, SAFETY_HTML, ev } from './lib.js';

const MIRA = callsFor('mira');
const LEO = callsFor('leo');
const HUM = { inhale: 4, exhale: 9, holdOut: 1, hum: true };
const humCall = say('And hum.'); // a bare "Hum." comes out of TTS as a wordless hum, or a long silence
const humCalls = (voice) => (phase, breath) => phase === 'hum' ? humCall : phase === 'in' ? voice(phase, breath) : null;
const togetherIn = say('Breathe in with me.');
const togetherOut = say('All the way out.');
const togetherCalls = (phase) => ({ in: togetherIn, out: togetherOut })[phase];
const leadBreath = () => ({ pace: { inhale: 4, exhale: 6 }, count: 1, style: 'slow', calls: togetherCalls });

// ── Turn the Tide ──────────────────────────────────────
const T = {
  welcome: line('tw_welcome', "Hey. Rough day? Let's look after you a bit. Sit up tall, or lie down if that's easier, and close your eyes."),
  permission: line('tw_permission', "Never do this in water. Breathe at the first urge, or sooner; Breathe now ends a hold. Stop if you're dizzy or unwell."),
  easy: line('tw_easy', "There are no holds at this level. Breathe at your own pace whenever the counts don't suit you."),
  nose: line('tw_nose2', "Use your nose if it's comfortable. Keep the breathing quiet, without forcing it.", 'technique'),
  noseWhy: line('tw_nose_why2', 'The nose warms, moistens and filters incoming air. The sinuses also produce nitric oxide, which is involved in airway defenses. Mouth breathing bypasses that nasal conditioning.', 'science'),
  ribs: line('tw_ribs', 'As you breathe in, let your ribs widen out to the sides. Shoulders stay where they are, belly soft.', 'technique'),
  ladder: line('tw_ladder2', "We'll lengthen the breath gradually. Start with four in, four out. I'll call each change."),
  five: line('tw_five', 'Next, five each way.'),
  six: line('tw_six', 'And next, six each way.'),
  beforeHum: line('tw_before_hum', 'Leave the counts here. Breathe naturally while I explain the humming.'),
  humHow: line('tw_hum_how2', "We'll do three hums. Breathe in through your nose, then hum all the way out with lips closed and teeth slightly apart. Keep it low.", 'technique'),
  ears: tip('tw_t_ears', 'If you like, rest your thumbs lightly on the little flaps at the front of your ears. The hum may sound louder inside your head.'),
  humWhy: line('tw_hum_why2', 'Humming moves sinus air into the nose, releasing nitric oxide. A small study measured fifteen times more during humming than a quiet exhale.', 'science'),
  humSpace: line('tw_hum_space', "The first hum released the most. Another study found the boost came back after three quiet minutes, which is why the hums are spaced out. It doesn't make humming a cold treatment.", 'science'),
  humRest: line('tw_hum_rest', 'Breathe at your own pace again while we rest.'),
  humAgain: line('tw_hum_again2', 'Another set of three hums now, starting with the breath in.'),
  afterMiddleHum: line('tw_after_middle_hum', 'Take a few ordinary breaths before the last round.'),
  humLast: line('tw_hum_last', 'Three last hums. Long and low.'),
  r1: line('tw_r1_2', 'Round one uses short, sharp breaths out through the nose, from the belly. Let each breath in happen by itself. Keep your face relaxed.', 'technique'),
  r2: line('tw_r2_2', "Round two has more breaths and a longer empty hold. End it early if that's enough today."),
  r3: line('tw_r3', 'Last round. Let it be the easiest one.'),
  lock: line('tw_lock2', 'During a full hold, gently lift your pelvic floor and lower your chin if that stays easy.', 'technique'),
  lead: [
    line('tw_lead_1', 'One breath together first. The next breath in starts round one.'),
    line('tw_lead_2', 'In with me, all the way out, then into round two.'),
    line('tw_lead_3', 'One easy breath first; the next inhale starts our last round.'),
  ],
  slower: tip('tw_t_slower2', 'If the quick breaths took effort, use normal breathing for the next round.'),
  deepIn: line('tw_deep_in2', 'Comfortable breath in.', 'count'),
  allOut: line('tw_all_out', 'And all the way out.', 'count'),
  first: line('tw_first', 'Keep the first breath after a hold calm. If you gasped, hold a bit less next time.', 'technique'),
  rest: [
    line('tw_rest_1', 'Let the air out. Take twenty seconds of breathing at your own pace before the next round.'),
    line('tw_rest_2', 'Release the breath and return to normal breathing. Take this whole rest before the next hums.'),
    line('tw_rest_3', 'Let it go. Breathe without counts for a bit before the cool-down.'),
  ],
  noHoldRest: [
    line('tw_nh_1', 'No hold follows. Breathe at your own pace until I call the next round.'),
    line('tw_nh_2', 'Leave the rhythm now and take some ordinary breaths before we hum again.'),
    line('tw_nh_3', 'The slow rounds are done. Take a little uncounted breathing before the cool-down.'),
  ],
  cool: say('Now cool down. In for four, out for eight. Five breaths.'),
  vagus: line('tw_vagus2', 'Your heart often slows a little on the out-breath.', 'science'),
  lastRest: line('tw_last_rest', "Breathe freely again for a bit. Then we'll finish with humming."),
  checkin: line('tw_checkin2', "Let your breathing find its own pace. Notice how you're doing; we'll stay here for a minute."),
  stay: line('tw_stay', 'Stay where you are for a minute before you get up. After holds, standing up fast can make you dizzy.'),
  stress: line('tw_stress', 'Slow breathing may help with stress. In studies where volunteers were exposed to cold viruses, people reporting more stress were more likely to get sick.', 'science'),
  sleep: line('tw_sleep', "Short sleep was also linked to catching colds, especially under six hours a night. That doesn't mean this session prevents one. Give yourself time to rest tonight.", 'science'),
  close: line('tw_close2', 'Have something warm to drink if you like. If a fever turns up, skip the rounds and rest. Take your time getting up.'),
};

// Consecutive empty/full holds carry one explanation; even the 25 s Gentle empty
// hold and the first 20 s full hold have room. The no-holds option keeps nasal and
// humming science in its rests, without a lecture about a sequence it does not do.
const TIDE_THREAD = [
  lesson('tw_co2_1', 'While you pause, carbon dioxide builds again. Fast breathing lowers it without adding much oxygen, because blood oxygen is usually already near full at rest.'),
  lesson('tw_co2_2', 'That drop can cause tingling or lightness. As carbon dioxide rises again, it usually drives the urge to breathe more than falling oxygen does.'),
  lesson('tw_co2_3', 'So after fast breathing, the urge can arrive late while oxygen keeps falling. A comfortable hold is still no guarantee of safety. Breathe before you need to strain.'),
  lesson('tw_kox_1', 'Those changes were studied in healthy young men in 2014. They trained for ten days with fast breathing, holds, cold exposure and meditation.'),
  lesson('tw_kox_2', 'After that training, researchers injected a bacterial toxin that causes brief flu-like symptoms. The trained men released more adrenaline, had less inflammation, and reported feeling less sick.'),
  lesson('tw_kox_3', "But that was a small study of healthy people, and the toxin wasn't a virus. It suggests an effect on the immune response, not that these rounds treat a cold."),
];
const gentleCO2 = lesson('tw_co2_gentle', 'Unlike these slow breaths, fast breathing lowers carbon dioxide without adding much oxygen. Blood oxygen is usually already near full at rest. During a hold, carbon dioxide builds again.');
const humSet = (intro, extra = []) => [{ say: intro, bell: 'bell' }, ...extra, { pace: HUM, count: 3, style: 'hum', calls: humCalls(MIRA) }];

function round(n, o, opts) {
  const noHolds = opts.noHolds;
  const g = opts.gentle;
  const hold = scaled(o.hold, opts);
  const group = `r${n}`;
  const fullHold = say(`Hold comfortably full, up to ${dur(o.full)}.`);
  return {
    id: `round${n}`,
    title: `Round ${n}`,
    color: '#ff9b6a',
    what: noHolds ? '5 slow breaths · no holds' : `${g ? '5 slow breaths' : `${o.pumps} kapalabhati`} · ${mmss(hold)} hold out · ${mmss(o.full)} hold in`,
    steps: [
      { say: noHolds || g ? say(`Round ${num(n)}. Five slow breaths${noHolds ? ', then rest' : ', then an easy empty hold'}.`) : o.intro, bell: 'bell' },
      ...(noHolds ? [] : [{ say: T.lead[n - 1], gap: 0.6 }, leadBreath()]),
      ...(g
        ? [{ pace: { inhale: 4, exhale: 6 }, count: 5, style: 'count', calls: MIRA }]
        : [{ say: say(`${Num(o.pumps)} quick breaths.`), gap: 0.4 }, { pace: PUMP, count: o.pumps, style: 'pump' }]),
      ...(noHolds ? [] : [
        // This final emptying breath is separate from the entry breath above.
        { pace: { inhale: 4, exhale: 6 }, count: 1, style: 'slow', calls: (phase) => ({ in: T.deepIn, out: T.allOut })[phase] },
        holdEmpty(hold, [{ at: 8, say: g && n === 1 ? gentleCO2 : TIDE_THREAD[(n - 1) * 2] }], { group }),
        { pace: { inhale: 4 }, count: 1, style: 'slow', calls: MIRA, group },
        { hold: 'full', seconds: o.full, tick: false, group, cues: [{ at: 0.3, say: fullHold }, { at: 5, say: TIDE_THREAD[(n - 1) * 2 + 1] }] },
      ]),
      { rest: n === 3 ? (noHolds ? 19 : 8) : 20, label: 'Your own pace', cues: [
        { at: 0.3, say: noHolds ? T.noHoldRest[n - 1] : T.rest[n - 1] },
        ...(!noHolds && n === 1 ? [{ at: 10, say: T.first }] : []),
        ...(!noHolds && n === 2 && !g ? [{ at: 11, say: T.slower }] : []),
      ] },
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
  music: ['tide', 'swell'],
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
      id: 'arrive', title: 'Arrive', what: 'Nose breathing, a lengthening ladder', color: '#8f9cf0',
      steps: [
        { say: T.welcome, bell: 'low', lead: 2.5 },
        { say: opts.noHolds ? T.easy : T.permission },
        { say: T.nose }, { say: T.noseWhy }, { say: T.ribs },
        ...(!opts.noHolds ? [{ say: T.lock }] : []),
        { say: T.ladder, gap: 0.8 },
        // One continuous ladder: each step-up is announced on the out-breath before it.
        { pace: { inhale: 4, exhale: 4 }, count: 2, style: 'count', calls: MIRA, cues: [{ breath: 1, phase: 'out', say: T.five }] },
        { pace: { inhale: 5, exhale: 5 }, count: 2, style: 'count', calls: MIRA, cues: [{ breath: 1, phase: 'out', say: T.six }] },
        { pace: { inhale: 6, exhale: 6 }, count: 3, style: 'count', calls: MIRA },
      ],
    },
    {
      id: 'hum', title: 'Hum', what: 'Three hums', color: '#b39cff',
      steps: [
        { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: T.beforeHum }] },
        ...humSet(T.humHow, [{ say: T.ears }]),
        { rest: 30, label: 'Your own pace', cues: [{ at: 0.3, say: T.humRest }, { at: 5, say: T.humWhy }, { at: 16, say: T.humSpace }] },
      ],
    },
    round(1, { pumps: 30, hold: 45, full: 20, intro: T.r1 }, opts),
    round(2, { pumps: 40, hold: 60, full: 25, intro: T.r2 }, opts),
    {
      id: 'hum-2', title: 'Hum', what: 'Three more hums', color: '#b39cff',
      steps: [...humSet(T.humAgain), { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: T.afterMiddleHum }] }],
    },
    round(3, { pumps: 45, hold: 75, full: 30, intro: T.r3 }, opts),
    {
      id: 'close', title: 'Cool down', what: 'Long exhales, three last hums, stillness', color: '#7cc7c4',
      steps: [
        { say: T.cool, bell: 'bell', gap: 0.8 },
        { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', calls: MIRA, cues: [{ breath: 1, phase: 'out', say: T.vagus }] },
        // Also keeps the last two humming sets three minutes apart at No holds / Quiet.
        { rest: opts.noHolds ? 30 : 6, label: 'Your own pace', cues: [{ at: 0.3, say: T.lastRest }] },
        ...humSet(T.humLast),
        { rest: 60, label: 'Your own pace', bell: 'low', cues: [
          { at: 0.3, say: opts.noHolds ? T.checkin : T.stay },
          { at: 10, say: T.stress }, { at: 27, say: T.sleep }, { at: 46, say: T.close },
        ] },
      ],
    },
  ],
  learn: `
<p>A warm-up, three rounds of breathing and retention, and a cool-down, adapted for the first day of a cold. Hums come in three short sets, spread through the session.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Nose if comfortable.</strong> Ribs widen to the sides, shoulders still, belly soft. Breathe in with no more effort than at rest.</li>
  <li><strong>The ladder:</strong> equal breaths in and out, lengthened a second at a time, 4 → 5 → 6.</li>
  <li><strong>Humming</strong> (bhramari): in through the nose, then a low hum through the whole exhale, lips closed. Three hums at a time, at least three minutes apart.</li>
  <li><strong>Kapalabhati:</strong> short, sharp exhales from the belly; the inhale happens on its own. The bursts stay short, and each is followed by holds.</li>
  <li><strong>Holds:</strong> first with empty lungs, then with comfortably full lungs and an optional gentle lock (a light lift of the pelvic floor, chin slightly down). Come out of any hold whenever you want to.</li>
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
  <li>Prather et al. 2015, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4531403/" target="_blank" rel="noopener">Behaviorally assessed sleep and susceptibility to the common cold</a>, Sleep.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">Effect of breathwork on stress and mental health: meta-analysis of RCTs</a>, Sci Rep.</li>
</ul>`,
};

// ── Clear Nose ─────────────────────────────────────────
const K = {
  welcome: line('cl_welcome2', "Blocked nose? Sit comfortably and use whichever side is more open. If neither side is open, take a little air through your mouth. We'll keep this gentle."),
  permission: line('cl_permission', 'Stay seated for the holds, never in water. Release your nose whenever you need air; Breathe now ends the hold. Stop if you feel dizzy.'),
  humHow: line('cl_hum_how', 'We start with three hums. Breathe in through the nose, then hum all the way out with your lips closed.', 'technique'),
  afterHum: line('cl_after_hum', 'Let the hum stop and breathe at your own pace for a few breaths.'),
  light: line('cl_light2', 'Now let your breaths be a little smaller and quieter, at your own pace. Ease off if the air hunger grows.', 'technique'),
  cycle: line('cl_cycle', "If one side's blocked, that can be normal. Your nose naturally switches sides every few hours. It doesn't necessarily mean your cold's getting worse.", 'science'),
  normal: line('cl_normal', 'Return to ordinary breathing for a moment. Let the air hunger settle before the next part.'),
  how: line('cl_how2', 'After a small breath out, pinch your nose and gently nod. Release at the first clear urge, or sooner. Keep the first breath back gentle.', 'technique'),
  lead: [
    line('cl_lead_1', 'Round one. One easy breath in together, all the way out, then a small breath starts the hold sequence.'),
    line('cl_lead_2', 'Second round. Breathe in with me and empty gently. The next breath in starts the small breath before the pinch.'),
    line('cl_lead_3', 'Last round. One shared breath first. Then a small breath in and out before you close your nose.'),
  ],
  release: line('cl_release', 'Let go. Breathe in through your nose, nice and gentle. No big breath.', 'count'),
  recover2: line('cl_recover_2', 'Release your nose. Breathe normally at your own pace while we rest.'),
  recover3: line('cl_recover_3', 'Let your nose go. Take a minute of quiet breathing at your own pace now.'),
  firstRest: line('cl_first_rest', 'Use this rest for normal breathing. There are no counts to follow.'),
  gasp: line('cl_gasp', 'If you gasped on that first breath, you held too long. Let go sooner next time.', 'technique'),
  settled: line('cl_settled', 'Only start the next hold if your breathing has settled. You can skip it and carry on breathing.'),
  humAgain: line('cl_hum_again2', 'Three more hums to finish. Start with a comfortable breath in.'),
  close: line('cl_close2', "Let your breath settle. Open your eyes when you're ready, and take your time getting up."),
};
const NOSE_THREAD = [
  lesson('cl_co2_1', "During this pause, carbon dioxide rises. That helps drive the urge to breathe; it isn't a target to push past."),
  lesson('cl_co2_2', "That rise may briefly ease nasal resistance. Small studies found less resistance after holds and exercise, but they don't establish how well this works for a cold."),
  lesson('cl_co2_3', "So any relief may be temporary, and a longer hold hasn't been shown to help more. The small studies don't establish that nodding adds a benefit."),
];
const SMALL = { inhale: 2, exhale: 2.5 };
const smallCalls = (phase) => ({ in: say('Gently in.'), out: say('Easy out.') })[phase];
const PINCH_CALLS = [say('Pinch, and nod.'), say('Close your nose; gentle nods.'), say('Pinch again. Keep nodding small.')];
const pinch = (seconds, n) => ({ hold: 'empty', seconds, label: 'Pinch & nod', record: true, tick: false, cues: [{ at: 0.2, say: PINCH_CALLS[n] }, { at: 5, say: NOSE_THREAD[n] }] });

export const clearNose = {
  id: 'clear-nose',
  title: 'Clear Nose',
  titleHtml: 'Clear <em>nose</em>',
  tag: 'Under the weather',
  moment: 'anytime',
  voice: 'leo',
  blurb: 'Three hums, breathe light, three pinch-and-nod holds, three more hums.',
  lede: 'For a stuffy nose. A breathing-retraining exercise for unblocking the nose, kept gentle for a cold, with a short set of hums at each end.',
  music: ['tide', 'swell'],
  accent: ['#cfe8ff', '#5b8fd6'],
  sky: 'clear',
  intensity: ['none', 'standard'],
  intensityNotes: {
    none: 'No breath holds: hums, breathe light, hums.',
    standard: 'Three short pinch-and-nod holds, up to 20, 30 and 30 s. Let go at the first clear urge, or sooner.',
  },
  after: ['Relief is usually temporary. Repeat whenever your nose closes up, rather than holding longer.', 'See a doctor for breathlessness, chest pain, high fever, severe facial pain, or symptoms past ten days.'],
  sections: (opts) => [
    {
      id: 'clear-settle', title: 'Settle', what: 'Nose, or the more open side', color: '#9cc7f0',
      steps: [{ say: K.welcome, bell: 'low', lead: 2 }, ...(!opts.noHolds ? [{ say: K.permission }] : []), { rest: 5 }],
    },
    {
      id: 'clear-hum', title: 'Hum', what: 'Three hums', color: '#b39cff',
      steps: [{ say: K.humHow, bell: 'bell' }, { pace: HUM, count: 3, style: 'hum', calls: humCalls(LEO) }, { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: K.afterHum }] }],
    },
    {
      id: 'clear-light', title: 'Breathe light', what: 'Smaller, quieter breaths', color: '#7fb0e6',
      steps: [{ say: K.light }, { rest: opts.noHolds ? 150 : 45, label: 'Light breathing', cues: [{ at: 15, say: K.cycle }] }, { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: K.normal }] }],
    },
    ...(opts.noHolds ? [] : [20, 30, 30].map((seconds, n) => ({
      id: `nose-${n + 1}`, title: `Hold ${n + 1}`, what: `Pinch & nod · up to ${seconds}s`, color: ['#5b8fd6', '#4c7fc8', '#3f6fb8'][n],
      steps: [
        ...(n === 0 ? [{ say: K.how, bell: 'bell' }] : []),
        { say: K.lead[n], bell: n ? 'low' : undefined, gap: 0.6 },
        // One shared breath, then the small breath that actually leads into the pinch.
        leadBreath(),
        { pace: SMALL, count: 1, style: 'slow', calls: smallCalls },
        pinch(seconds, n),
        { rest: n === 2 ? 60 : 40, label: 'Your own pace', cues: [
          { at: 0.2, say: [K.release, K.recover2, K.recover3][n] },
          ...(n === 0 ? [{ at: 12, say: K.firstRest }, { at: 22, say: K.gasp }] : []),
          ...(n === 1 ? [{ at: 14, say: K.settled }] : []),
        ] },
      ],
    }))),
    {
      id: 'clear-hum-2', title: 'Hum', what: 'Three more hums', color: '#b39cff',
      steps: [{ say: K.humAgain, bell: 'bell' }, { pace: HUM, count: 3, style: 'hum', calls: humCalls(LEO) }],
    },
    {
      id: 'clear-close', title: 'Close', what: 'Quiet nasal breathing', color: '#7cc7c4',
      steps: [{ say: K.close, lead: 1 }, { rest: 12, label: 'Your own pace' }],
    },
  ],
  learn: `
<p>For a stuffy nose: a breathing-retraining exercise for unblocking the nose, kept to the first clear urge for a cold, with three hums at each end.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Breathe light:</strong> quieter, slightly smaller breaths through the nose, enough for a touch of air hunger and no more.</li>
  <li><strong>Pinch and nod:</strong> after a small breath out, pinch the nose and gently nod the head. Let go at the first clear urge, or sooner, then breathe in gently through the nose and calm the breath within a few breaths.</li>
  <li><strong>Hums:</strong> three at the start and three at the end, a few minutes apart, so the sinuses refill in between.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>Small studies found lower nasal resistance after breath holds, higher CO₂ or exercise; evidence for this gentle drill during a cold is limited ${ev.some}. Relief is usually temporary.</li>
  <li>Breathing retraining that includes this kind of reduced breathing improved asthma symptoms and reduced reliever use in trials, though not lung function ${ev.some}.</li>
  <li>Humming raises nasal nitric oxide, most on the first hums ${ev.solid}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus NO output using single-breath humming</a>, Eur Respir J.</li>
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Hasegawa &amp; Kern 1978, <a href="https://pubmed.ncbi.nlm.nih.gov/741150/" target="_blank" rel="noopener">The effect of breath holding, hyperventilation, and exercise on nasal resistance</a>, Rhinology.</li>
  <li>Mertz et al. 1984, <a href="https://pubmed.ncbi.nlm.nih.gov/6431370/" target="_blank" rel="noopener">Role of the nasal airway in regulation of airway resistance during hypercapnia and exercise</a>, Otolaryngol Head Neck Surg.</li>
  <li>Bruton et al. 2018, <a href="https://doi.org/10.1016/S2213-2600(17)30474-5" target="_blank" rel="noopener">physiotherapy breathing retraining for asthma (BREATHE trial)</a>, Lancet Respir Med.</li>
</ul>`,
};
