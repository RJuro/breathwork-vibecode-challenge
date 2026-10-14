// Under the weather: Turn the Tide (Mira; humming, short kapalabhati rounds and
// quiet holds) and Clear Nose (Leo; light breathing, pinch-and-nod holds).
// Explain the felt changes in whole sentences; recover at the listener's own pace.

import { line, say, lesson, callsFor, PUMP, Num, dur, mmss, scaled, holdEmpty, SAFETY_HTML, ev } from './lib.js';

// Keep the calls compatible with the spoken mouth-breathing fallback.
const miraCalls = callsFor('mira');
const MIRA = (phase, breath) => {
  const call = miraCalls(phase, breath);
  return call?.id === 'mira_in_nose' ? say('And breathe in.') : call;
};
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
  welcome: line('tw_welcome_r2', "Start with gentle breathing for that scratchy throat. Sit comfortably or lie down, rest your hands, and close your eyes if you like."),
  permission: line('tw_permission_r2', "Stay seated or lying down, never in water. If you're feverish, achy or have chest symptoms, choose No holds or rest today. Breathe at the first urge or when I call time, whichever comes first; stop for dizziness."),
  easy: line('tw_easy', "There are no holds at this level. Use your own pace whenever the counts don't suit you, and stop if you feel dizzy."),
  nose: line('tw_nose_r2', "Use your nose if it's comfortable, or your mouth if it's blocked. Keep the breathing gentle enough that your throat stays comfortable.", 'technique'),
  noseWhy: line('tw_nose_why2', "Air picks up warmth and moisture as it passes through your nose. That matters when your throat already feels dry or scratchy.", 'science'),
  ribs: line('tw_ribs_r2', 'Let your ribs widen with your shoulders relaxed. As the breaths slow down, let them become a bit fuller, without forcing air in.', 'technique'),
  ladder: line('tw_ladder2', "We'll lengthen the breath gradually. Start with four in, four out. I'll call each change."),
  five: line('tw_five', 'Breathe five each way.'),
  six: line('tw_six', 'Breathe six each way.'),
  beforeHum: line('tw_before_hum', 'Leave the counts here. Breathe naturally while I explain the humming.'),
  humHow: line('tw_hum_how_r2', "We'll do three hums at a comfortable pitch. Breathe in, then hum softly with lips touching and teeth apart. Inhale through your mouth if needed. Skip the hum if your nose passes no air, and stop early if your throat strains or you need air.", 'technique'),
  humVibration: lesson('tw_hum_vibration_r2', 'That vibration moves air between your nose and sinuses, through their small connecting openings.'),
  humSpace: lesson('tw_hum_space_r2', "Your sinuses make nitric oxide, which comes out with the hum. Quiet gaps let that supply rebuild before the next set of soft hums."),
  humRest: line('tw_hum_rest', 'Breathe at your own pace again while we rest.'),
  humAgain: line('tw_hum_again2', 'Another set of three hums now, starting with the breath in.'),
  afterMiddleHum: line('tw_after_middle_hum', 'Take a few ordinary breaths before the last round.'),
  humLast: line('tw_hum_last', 'Finish with three soft hums at a comfortable pitch.'),
  fastPurpose: line('tw_fast_purpose_r2', "The next part explores how quick breathing changes a hold. If you want to keep this a quiet sick-day session, breathe normally through these rounds and skip the holds.", 'technique'),
  r1: line('tw_r1_2', 'Round one uses small, sharp breaths out through the nose, from the belly. Let each breath in happen by itself. Keep your face relaxed.', 'technique'),
  fastSafety: line('tw_fast_safety_r2', "Quick breathing delays the urge while oxygen can fall during the hold, so don't wait for a strong urge. Light tingling can happen; cramping hands or dizziness mean normal breathing and no hold. If your nose is too blocked for quick breaths, skip them and the holds.", 'technique'),
  r2: line('tw_r2_2', 'Round two has more breaths and a longer hold limit. Keep the breaths just as small.'),
  r3: line('tw_r3', "This round has the most quick breaths. Keep the effort light and the exhales small."),
  lead: [
    line('tw_lead_1', 'One breath together first. The next breath in starts round one.'),
    line('tw_lead_2', 'In with me, all the way out, then into round two.'),
    line('tw_lead_3', 'One easy breath first; the next inhale starts our last round.'),
  ],
  holdExit: line('tw_hold_exit_r2', 'If you stop a hold early or need to cough, breathe normally through the rest of that hold sequence. You can stop before any time call.', 'technique'),
  deepIn: line('tw_deep_in2', 'Comfortable breath in.', 'count'),
  allOut: line('tw_all_out', 'And all the way out.', 'count'),
  first: line('tw_first_r2', 'If that ended in a gasp, breathe well before the limit next round, even though the limit goes up. Start again only once breathing has settled.', 'technique'),
  rest: [
    line('tw_rest_1_r2', 'Resume normal breathing at your own pace. Take thirty seconds before the next round.'),
    line('tw_rest_2_r2', 'Return to ordinary breathing at your own pace. Hums come next; let your breathing settle first.'),
    line('tw_rest_3_r2', 'Resume breathing at your own pace. The holds are done; longer exhales come next.'),
  ],
  noHoldRest: [
    line('tw_nh_1_r2', 'Breathe at your own pace for twenty seconds. Notice whether your throat feels comfortable with that rhythm.'),
    line('tw_nh_2', 'Leave the rhythm now and take some ordinary breaths before we hum again.'),
    line('tw_nh_3_r2', 'The rounds are done. Take a few breaths on your own before one last set with a longer exhale.'),
  ],
  cool: line('tw_cool', "Now five breaths, in for four and out for eight. Let the exhale stay soft; breathe sooner if eight is too long."),
  vagus: line('tw_vagus2', 'Your heart often slows a little on the out-breath.', 'science'),
  lastRest: line('tw_last_rest', "Breathe freely. The last hums come next."),
  checkin: line('tw_checkin2', "Return to your own pace. Stay here for a minute; there's no more counting."),
  stay: line('tw_weather_stay', 'Breathe normally and stay seated or lying down for this last minute. Give yourself time before standing up.'),
  sleep: line('tw_sleep_r2', 'In a cold-virus study, people averaging six hours of sleep or less before exposure had about four times the odds of a cold compared with those sleeping over seven. Leave room for sleep tonight.', 'science'),
  close: line('tw_close_r2', "If you closed your eyes, open them when you're ready. A warm drink might feel good next; let your throat decide."),
};

// Debrief the felt change, without repeating the delayed-urge warning.
const TIDE_THREAD = [
  lesson('tw_co2_1_r2', 'If your fingers or lips tingled during the quick breaths, lower carbon dioxide helps explain it. That change affects nerve activity.'),
  lesson('tw_lung_stretch_r2', 'If that inhale eased the urge, lung stretch signals help explain the quick relief. Filling your lungs changes the feeling of needing air.'),
  lesson('tw_co2_3', 'Rising carbon dioxide changes the acidity of your blood. Your brain senses that change and increases the drive to breathe.'),
  lesson('tw_rhythm_r2', "If your belly twitched in that empty hold, those were breathing movements trying to resume. Your brain keeps sending the breathing signals during a pause."),
  line('tw_cough_r2', 'If your throat tickles, end the hold and breathe normally. If you need to cough, let it happen; skip the rest of this hold sequence.', 'technique'),
  lesson('tw_variation_r2', 'Give a scratchy throat the final say today. Compare how comfortable your breathing feels afterwards, rather than how long you held.'),
];
const gentleCO2 = lesson('tw_slow_hold_gases', 'During this pause, your body keeps using oxygen and making carbon dioxide. With no air leaving, carbon dioxide begins to build.');
const slowRound = (n, noHolds) => line(`tw_slow_round_${n}_${noHolds ? 'none' : 'gentle'}_r2`, [
  `Round one returns to four in, six out: a shorter inhale and a longer exhale. Take five breaths, then ${noHolds ? 'rest' : 'an easy empty hold'}.`,
  `For round two, keep four in and six out, with a softer exhale. After five breaths, ${noHolds ? 'rest at your own pace' : 'we pause again'}.`,
  `For the last round, notice whether your jaw stays loose as you breathe. Use the same four in, six out for five breaths${noHolds ? ', then rest' : ' before the hold'}.`,
][n - 1]);
const humSet = (intro, cues = []) => [{ say: intro, bell: 'bell' }, { pace: HUM, count: 3, style: 'hum', calls: humCalls(MIRA), cues }];

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
      ...(!noHolds && !g && n === 1 ? [{ say: T.fastPurpose }] : []),
      { say: noHolds || g ? slowRound(n, noHolds) : o.intro, bell: 'bell' },
      ...(!noHolds && !g && n === 1 ? [{ say: T.fastSafety }] : []),
      ...(!noHolds && n === 1 ? [{ say: T.holdExit }] : []),
      ...(!noHolds && n === 2 ? [{ say: line('tw_twitch_rule_r2', 'If your belly starts twitching during a hold, breathe normally and leave out the rest of that hold sequence.', 'technique') }] : []),
      ...(noHolds ? [] : [{ say: T.lead[n - 1], gap: 0.6 }, leadBreath()]),
      ...(g
        ? [{ pace: { inhale: 4, exhale: 6 }, count: 5, style: 'count', calls: MIRA }]
        : [{ say: say(`${Num(o.pumps)} quick breaths.`), gap: 0.4 }, {
          pace: PUMP, count: o.pumps, style: 'pump',
          // Call every other exhale for the opening eight breaths. Individual
          // TTS calls need more room than the one-second pump cycle provides.
          calls: (phase, breath) => phase === 'out' && breath < 8 && breath % 2 === 0 ? say('Out.') : null,
          cues: [{ at: o.pumps - 10, say: say('Ten more breaths.') }],
        }]),
      ...(noHolds ? [] : [
        // This final emptying breath is separate from the entry breath above.
        { pace: { inhale: 4, exhale: 6 }, count: 1, style: 'slow', calls: (phase) => ({ in: T.deepIn, out: T.allOut })[phase] },
        holdEmpty(hold, [{ at: 8, say: g && n === 1 ? gentleCO2 : TIDE_THREAD[(n - 1) * 2] }], { group }),
        { pace: { inhale: 4 }, count: 1, style: 'slow', calls: MIRA, group },
        { hold: 'full', seconds: o.full, tick: false, group, cues: [{ at: 0.3, say: fullHold }, ...(n < 3 ? [{ at: 7, say: TIDE_THREAD[(n - 1) * 2 + 1] }] : [])] },
      ]),
      { rest: n === 3 ? (noHolds ? 19 : 25) : (!noHolds && n === 1 ? 30 : 20), label: 'Your own pace', cues: [
        { at: 0.3, say: noHolds ? T.noHoldRest[n - 1] : T.rest[n - 1] },
        ...(!noHolds && n === 1 ? [{ at: 10, say: T.first }] : []),
        ...(!noHolds && n === 3 ? [{ at: 10, say: TIDE_THREAD[5] }] : []),
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
  blurb: 'Soft humming and slow breathing for a scratchy-throat day, with optional breathing rounds and holds.',
  lede: 'Three spaced sets of soft humming, a slow breathing ladder, and a long-exhale finish. Choose No holds for slow breathing throughout, Gentle for slow rounds with short holds, or Standard and Deeper for quick breathing before the holds. Choose the quiet version for comfort, or optional rounds to explore the sensations of breath holding.',
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
    'Have a warm drink if it feels comfortable, and leave time for sleep tonight.',
    'If you hum again later, keep it soft and leave a few quiet minutes between sets.',
    'If a fever arrives, skip fast breathing and holds. Rest, or choose No holds if slow breathing is comfortable.',
  ],
  sections: (opts) => [
    {
      id: 'arrive', title: 'Arrive', what: 'Nose breathing, a lengthening ladder', color: '#8f9cf0',
      steps: [
        { say: T.welcome, bell: 'low', lead: 2.5 },
        { say: opts.noHolds ? T.easy : T.permission },
        { say: T.nose }, { say: T.noseWhy }, { say: T.ribs },
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
        ...humSet(T.humHow, [{ breath: 1, phase: 'hum', say: T.humVibration }]),
        { rest: 36, label: 'Your own pace', cues: [{ at: 0.3, say: T.humRest }, { at: 10, say: T.humSpace }] },
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
      id: 'close', title: 'Long exhales', what: 'Long exhales, three last hums, stillness', color: '#7cc7c4',
      steps: [
        { say: T.cool, bell: 'bell', gap: 0.8 },
        { pace: { inhale: 4, exhale: 8 }, count: 5, style: 'count', calls: MIRA, cues: [{ breath: 1, phase: 'out', say: T.vagus }] },
        // Also keeps the last two humming sets three minutes apart at No holds / Quiet.
        { rest: opts.noHolds ? 30 : 8, label: 'Your own pace', cues: [{ at: 0.3, say: T.lastRest }] },
        ...humSet(T.humLast),
        { rest: 60, label: 'Your own pace', bell: 'low', cues: [
          { at: 0.3, say: opts.noHolds ? T.checkin : T.stay },
          { at: 16, say: T.sleep }, { at: 43, say: T.close },
        ] },
      ],
    },
  ],
  learn: `
<p>For a scratchy-throat day: a continuous slow ladder, three spaced sets of soft humming, three breathing rounds and a long-exhale finish. No holds uses slow breaths throughout; Gentle adds short holds; Standard and Deeper use quick belly-led exhales before the holds.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Nose if comfortable.</strong> Use your mouth if your nose is blocked. Let the ribs widen with shoulders relaxed. As breathing slows, let breaths become a bit fuller without forcing them.</li>
  <li><strong>The ladder:</strong> equal breaths in and out, lengthened a second at a time, 4 → 5 → 6.</li>
  <li><strong>Humming:</strong> breathe in, then hum softly through the exhale with lips closed and teeth slightly apart. Inhale through your mouth if needed. Skip the hum if your nose passes no air, and end early if it strains your throat or you need air. Three hums per set, with at least three quiet minutes between sets.</li>
  <li><strong>Quick breathing:</strong> small, sharp exhales from the belly; let each inhale happen by itself. Follow the opening pulse, then continue until the closing marker. If nasal breathing is too blocked, use ordinary breathing and skip the holds.</li>
  <li><strong>Holds:</strong> one shared breath introduces each sequence. After the breathing round, one comfortable breath in and out leads into the empty hold, then an inhale leads into the full hold. Keep your neck and throat easy. End at the first urge or the time call, whichever comes first; breathe sooner whenever needed. After quick breathing, do not wait for a strong urge. End the sequence for coughing or belly twitches; the times are upper limits.</li>
  <li><strong>Breaks:</strong> breathe at your own pace between rounds. The next round starts only if ordinary breathing has returned.</li>
  <li><strong>Finish:</strong> five breaths in for 4 and out for 8, with an earlier inhale whenever needed, three last hums, and a minute seated or lying down.</li>
</ul>
<h3>What you may notice</h3>
<p>Quick breathing lowers carbon dioxide without adding much oxygen to blood that is already close to fully saturated at rest. The change in carbon dioxide affects blood flow and nerve activity, which can produce tingling. It also delays the urge to breathe during the following hold while oxygen continues to fall. An easy feeling is not a safety gauge. Stop for dizziness, and never extend a hold just because the urge is quiet.</p>
<p>After slow breaths, carbon dioxide builds during a hold without that initial washout. Carbon dioxide and changes in blood acidity are major signals for breathing. Lung inflation also affects the sensation of air hunger, and the brain's breathing rhythm continues even while you suppress the movement. Hold time varies with the starting breath and metabolism; it is not a fitness score.</p>
<h3>Humming and a cold</h3>
<p>Humming moves air between the nose and sinuses. In ten healthy volunteers, nasal nitric oxide output rose about fifteenfold during humming ${ev.some}. Repeated hums reduced the initial peak; a second small study found it recovered after three quiet minutes ${ev.some}. That explains the spacing, rather than establishing an ideal dose.</p>
<p>No trial has established that this humming and breathing sequence treats a cold. Sleep research concerns susceptibility: in a viral-challenge study, people sleeping five to six hours before exposure had about 4.2 times the odds of developing a cold compared with those sleeping over seven (about 4.5 times below five hours). It does not show that extra sleep now will stop a cold already beginning.</p>
<p class="muted">If a fever or chest symptoms develop, skip quick breathing and holds. Choose No holds only if slow breathing feels comfortable, or leave the session and rest.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus nitric oxide output using single-breath humming exhalations</a>, Eur Respir J.</li>
  <li>Parkes 2006, <a href="https://doi.org/10.1113/expphysiol.2005.031625" target="_blank" rel="noopener">Breath-holding and its breakpoint</a>, Exp Physiol.</li>
  <li>Cooper et al. 2003, <a href="https://pubmed.ncbi.nlm.nih.gov/12730051/" target="_blank" rel="noopener">CO₂-dependent components of sinus arrhythmia from the start of breath holding in humans</a>, Am J Physiol Heart Circ Physiol.</li>
  <li>Skow et al. 2015, <a href="https://doi.org/10.1152/advan.00030.2015" target="_blank" rel="noopener">The ins and outs of breath holding</a>, Adv Physiol Educ.</li>
  <li>Prather et al. 2015, <a href="https://pubmed.ncbi.nlm.nih.gov/26118561/" target="_blank" rel="noopener">Behaviorally assessed sleep and susceptibility to the common cold</a>, Sleep.</li>
</ul>`,
};

// ── Clear Nose ─────────────────────────────────────────
const K = {
  welcome: line('cl_welcome2', "Sit upright and let your hands rest in your lap. Breathe through whichever side lets air through. If both are blocked, use your mouth without forcing air through your nose."),
  permission: line('cl_permission_r2', 'Stay seated for the holds, never in water. Breathe whenever you need air, and stop for dizziness. If you have a fever or chest symptoms, leave out the holds today.'),
  easy: line('cl_easy', 'There are no holds at this level. Leave any humming or reduced breathing whenever you need to; stop if you feel dizzy.'),
  humHow: line('cl_hum_how', "We start with three soft hums. Breathe in, then hum out with lips closed and your jaw loose. Inhale through your mouth if needed. If no air passes through your nose, skip the hum and breathe normally. Stop humming whenever you need air.", 'technique'),
  humVibration: lesson('cl_hum_vibration_r2', 'The hum moves air between the sinuses and nose through their small connecting openings.'),
  afterHum: line('cl_after_hum', 'Return to your own pace. Let your jaw relax before we make the breaths a little smaller.'),
  humWhy: line('cl_hum_model_r2', "In a lab model, a hum's changing pressure pushed gas through a sinus opening. The sound waves add movement that a quiet exhale doesn't create.", 'science'),
  tissue: lesson('cl_tissue_r2', 'A blocked nose can be swollen, blood-filled lining as well as mucus. The blood vessels can narrow in response to breathing demand, leaving more room for air.'),
  light: line('cl_light_r2', 'Let your breaths get slightly smaller and quieter at your own pace. A mild want for more air is enough; if you need a big breath, go back to normal.', 'technique'),
  lightWhy: lesson('cl_light_why_r2', 'Breathing a little less lets carbon dioxide rise, which can bring that mild urge for air. This drill uses that breathing signal to encourage more room in the nose.'),
  cycle: line('cl_cycle_r2', 'Even without a cold, the two sides take turns swelling over a few hours. That is why the more open nostril can switch sides.', 'science'),
  noHoldsNotice: lesson('cl_sniff_r2', 'A hard sniff can pull the soft walls near your nostrils inward, narrowing the passage. Let air come in quietly instead of trying to pull it through.'),
  sideSleep: line('cl_side_sleep', "If the blockage bothers you in bed, position can matter. Lying on one side tends to leave the upper nostril more open. The change isn't always immediate.", 'science'),
  check: line('cl_check_r2', 'Check whether either side passes air with less effort now. If neither does, use your mouth and let the breathing become ordinary again.', 'technique'),
  tissueReach: line('cl_tissue_reach_r2', 'Keep a tissue within reach in case you need to blow your nose.'),
  normal: line('cl_normal', 'Return to ordinary breathing now. Let any air hunger settle before we move on.'),
  how: line('cl_how_r2', "After a small breath out, pinch your nose and nod gently. Keep your mouth closed. At the first clear urge or sooner, stop nodding, let go and breathe. Use your mouth if needed. If nodding bothers your neck, keep your head still.", 'technique'),
  tradition: lesson('cl_drill_reason_r2', 'The pause lets carbon dioxide build without moving air through a blocked nose. The nods add small muscle movement, which also uses oxygen and produces carbon dioxide.'),
  lead: [
    line('cl_lead_1', 'Round one. One easy breath together, then a smaller breath in and out before the pinch.'),
    line('cl_lead_2', 'Second round. One shared breath, then the small breath that leads into the hold.'),
    line('cl_lead_3', 'Last round. Breathe with me first, then take the smaller breath before closing your nose.'),
  ],
  release: line('cl_release_r2', 'Stop nodding, release your nose and rest your hand in your lap. Breathe gently at your own pace, through your mouth if needed.'),
  recover2: line('cl_recover_2', 'Let go and stop the movement. Rest your hand in your lap and breathe normally at your own pace.'),
  recover3: line('cl_recover_3_r2', 'Release your nose, let your head be still and put your hand in your lap. Take a minute of breathing at your own pace.'),
  firstRest: lesson('cl_first_rest_r2', 'Compare the effort on these ordinary breaths with the start. Use a quiet inhale to check; a hard sniff makes it harder to judge.'),
  gasp: line('cl_gasp_r2', 'If that ended in a gasp, let go well before the limit next round. Wait until ordinary breathing has returned.', 'technique'),
  settled: line('cl_settled_r2', "The last hold comes next. If your breathing hasn't settled, skip it and just breathe; your mouth is fine."),
  relief: lesson('cl_relief', 'Any opening may fade as the lining swells again. Judge the drill by the breathing afterwards, rather than by the seconds you held.'),
  humAgain: line('cl_hum_again2', 'Finish with three more soft hums. Start with a comfortable breath in.'),
  retryHum: line('cl_retry_hum_r2', 'If you skipped the first hums, see whether air passes through your nose now. Try a soft hum only if it does; otherwise keep breathing normally.', 'technique'),
  blow: line('cl_blow_r2', 'If you need to blow your nose, do it gently, one side at a time.', 'technique'),
  finish: line('cl_finish_r2', "That's it. If you try a hold again later, keep it easy and brief, with ordinary breathing afterwards. You can leave it at one round."),
  finishEasy: line('cl_finish_easy_r2', "That's it. If you hum again later, keep it soft and leave a few quiet minutes between sets."),
  close: line('cl_close2', 'Breathe at your own pace again. Notice the effort of an ordinary breath through your nose; use your mouth if you still need to.'),
};
const SMALL = { inhale: 2, exhale: 2.5 };
const smallCalls = (phase) => ({ in: say('Gently in.'), out: say('Easy out.') })[phase];
const pinch = (seconds) => ({ hold: 'empty', seconds, label: 'Pinch & nod', record: true, tick: false, cues: [
  { at: 0.2, say: say(`Pinch and nod gently, for up to ${dur(seconds)}.`) },
] });

export const clearNose = {
  id: 'clear-nose',
  title: 'Clear Nose',
  titleHtml: 'Clear <em>nose</em>',
  tag: 'Under the weather',
  moment: 'anytime',
  voice: 'leo',
  blurb: 'Soft hums, light breathing, and optional short pinch-and-nod holds for a blocked nose.',
  lede: 'A seated breathing-retraining drill with soft humming at each end. Try slightly smaller breaths, then optional pinch-and-nod holds, ending at the first clear urge or sooner. Use your mouth whenever your nose will not pass air.',
  music: ['tide', 'swell'],
  accent: ['#cfe8ff', '#5b8fd6'],
  sky: 'clear',
  intensity: ['none', 'standard'],
  intensityNotes: {
    none: 'No breath holds: soft hums, two and a half minutes of slightly smaller breaths, then hums again.',
    standard: 'Three short pinch-and-nod holds, up to 20, 30 and 30 s. Let go at the first clear urge, or sooner.',
  },
  after: ['If your nose opens, the change may be temporary. Let breathing settle fully before trying another short round; longer holds are not the goal.', 'See a doctor for breathlessness, chest pain, high fever, severe facial pain, or symptoms past ten days.'],
  sections: (opts) => [
    {
      id: 'clear-settle', title: 'Settle', what: 'Nose, or the more open side', color: '#9cc7f0',
      steps: [{ say: K.welcome, bell: 'low', lead: 2 }, { say: opts.noHolds ? K.easy : K.permission }, { say: K.tissueReach }, { rest: 5 }],
    },
    {
      id: 'clear-hum', title: 'Hum', what: 'Three hums', color: '#b39cff',
      steps: [{ say: K.humHow, bell: 'bell' }, { pace: HUM, count: 3, style: 'hum', calls: humCalls(LEO), cues: [{ breath: 1, phase: 'hum', say: K.humVibration }] }, { rest: 24, label: 'Your own pace', cues: [{ at: 0.3, say: K.afterHum }, { at: 10, say: K.humWhy }] }],
    },
    {
      id: 'clear-light', title: 'Breathe light', what: 'Smaller, quieter breaths', color: '#7fb0e6',
      steps: [{ say: K.tissue }, { say: K.light }, { rest: opts.noHolds ? 150 : 45, label: 'Light breathing', cues: [
        { at: 5, say: K.lightWhy }, { at: 22, say: K.cycle },
        ...(opts.noHolds ? [{ at: 65, say: K.noHoldsNotice }, { at: 95, say: K.check }] : []),
      ] }, { rest: 12, label: 'Your own pace', cues: [{ at: 0.3, say: K.normal }] }],
    },
    ...(opts.noHolds ? [] : [20, 30, 30].map((seconds, n) => ({
      id: `nose-${n + 1}`, title: `Hold ${n + 1}`, what: `Pinch & nod · up to ${seconds}s`, color: ['#5b8fd6', '#4c7fc8', '#3f6fb8'][n],
      steps: [
        ...(n === 0 ? [{ say: K.how, bell: 'bell' }, { say: K.tradition }] : []),
        { say: K.lead[n], bell: n ? 'low' : undefined, gap: 0.6 },
        // One shared breath, then the small breath that actually leads into the pinch.
        { ...leadBreath(), calls: (phase) => ({ in: say('Take an easy breath in.'), out: say('Let it go gently.') })[phase] },
        { pace: SMALL, count: 1, style: 'slow', calls: smallCalls },
        pinch(seconds),
        { rest: n === 2 ? 60 : 40, label: 'Your own pace', cues: [
          { at: 0.2, say: [K.release, K.recover2, K.recover3][n] },
          ...(n === 0 ? [{ at: 13, say: K.firstRest }, { at: 27, say: K.gasp }] : []),
          ...(n === 1 ? [{ at: 14, say: K.settled }] : []),
          ...(n === 2 ? [{ at: 16, say: K.relief }, { at: 35, say: K.blow }] : []),
        ] },
      ],
    }))),
    {
      id: 'clear-hum-2', title: 'Hum', what: 'Three more hums', color: '#b39cff',
      steps: [{ say: K.retryHum }, { say: K.humAgain, bell: 'bell' }, { pace: HUM, count: 3, style: 'hum', calls: humCalls(LEO) }],
    },
    {
      id: 'clear-close', title: 'Close', what: 'Quiet nasal breathing', color: '#7cc7c4',
      steps: [{ say: K.close, lead: 1 }, { rest: 18, label: 'Your own pace', cues: [{ at: 1, say: K.sideSleep }] }, { say: opts.noHolds ? K.finishEasy : K.finish }],
    },
  ],
  learn: `
<p>A seated drill for a stuffy nose: three soft hums, slightly smaller breaths, optional pinch-and-nod holds, and three more hums. If neither nostril passes air, breathe through your mouth and skip humming until it is comfortable.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Breathe light:</strong> slightly smaller, quieter breaths at your own pace, with your nose unpinched. Return to ordinary breathing if you need a bigger breath.</li>
  <li><strong>Pinch and nod:</strong> one easy shared breath without forcing the exhale, then a small breath in and out. Pinch your nose, keep your mouth closed and gently nod. At the first clear urge or sooner, stop nodding, release and breathe gently. Use your mouth if your nose remains blocked.</li>
  <li><strong>Rest:</strong> breathe at your own pace for 40 seconds between holds and a minute after the last one. Leave your nose open and skip a hold if ordinary breathing has not returned.</li>
  <li><strong>Hums:</strong> keep lips closed and jaw loose. Inhale through your mouth if needed. Skip a hum whenever no air passes through the nose, and stop humming when you need air. Sets are separated by a few quiet minutes.</li>
</ul>
<h3>What the drill is working with</h3>
<p>Nasal lining contains blood-filled tissue that can swell and narrow the passage; blockage is not always just mucus. Its blood supply responds to the nervous system and breathing demand. Carbon dioxide rises during a hold, and studies found reduced nasal resistance after breath holding or during raised carbon dioxide and exercise ${ev.some}. A proposed explanation is narrowing of blood vessels in the nasal lining.</p>
<p>Pinch and nod is a breathing-retraining drill. The nods add small movement while seated. Moving muscles use oxygen and produce carbon dioxide. Keep the movement easy, or leave it out if it bothers your neck, and use the first clear urge as the limit. Any change in airflow may be temporary.</p>
<p>The more open nostril often switches over a few hours as the lining alternately swells on each side. Position matters too: lying on one side tends to favor airflow through the upper nostril, without an immediate or guaranteed change ${ev.some}.</p>
<p>A hard sniff can draw the soft nasal walls inward and narrow the passage. Use ordinary, quiet breaths to compare airflow.</p>
<p>Humming moves sinus air into the nose and increases measured nitric oxide output. A physical tube-and-cavity model reproduced increased gas evacuation with vibrating airflow. Repeated hums draw down the initial peak; in a small study it recovered after three quiet minutes ${ev.some}. Those measurements explain the spacing.</p>
<p class="muted">These studies do not establish relief from these short holds during a cold, an added benefit from small nods, or a cold treatment from humming. Keep the movement comfortable and assess airflow on ordinary breaths afterwards.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus nitric oxide output using single-breath humming exhalations</a>, Eur Respir J.</li>
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Hasegawa &amp; Kern 1978, <a href="https://pubmed.ncbi.nlm.nih.gov/741150/" target="_blank" rel="noopener">The effect of breath holding, hyperventilation, and exercise on nasal resistance</a>, Rhinology.</li>
  <li>Mertz et al. 1984, <a href="https://pubmed.ncbi.nlm.nih.gov/6431370/" target="_blank" rel="noopener">Role of the nasal airway in regulation of airway resistance during hypercapnia and exercise</a>, Otolaryngol Head Neck Surg.</li>
  <li>Granqvist et al. 2006, <a href="https://pubmed.ncbi.nlm.nih.gov/16708919/" target="_blank" rel="noopener">Paranasal sinus ventilation by humming</a>, J Acoust Soc Am.</li>
  <li>Uldry &amp; Fitting 1995, <a href="https://thorax.bmj.com/content/50/4/371" target="_blank" rel="noopener">Maximal values of sniff nasal inspiratory pressure in healthy subjects</a>, Thorax.</li>
  <li>Kahana-Zweig et al. 2016, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5053491/" target="_blank" rel="noopener">Measuring and characterizing the human nasal cycle</a>, PLOS ONE.</li>
</ul>`,
};
