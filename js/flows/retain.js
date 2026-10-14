// Retention: the longer sessions (15–25 min) where the holds are the work. Kumbhaka and the
// Hold Ladder with Leo; Rounds and Alternate Nostril with Mira. Plus Window Seat (Mira): soft
// pauses for a headache on a plane or a train.
// Voice tags are placed by hand; captions and on-device speech drop them.

import { line, say, tip, lesson, num, Num, dur, mmss, scaled, milestones, holdEmpty, callsFor, SAFETY_HTML, ev } from './lib.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const LEO = callsFor('leo');
const MIRA = callsFor('mira');
const tenMore = say('Ten more seconds.');
const levelOf = (opts) => (opts.gentle ? 'gentle' : (opts.holdScale ?? 1) > 1 ? 'deeper' : 'standard');

// ── Kumbhaka ───────────────────────────────────────────
// Structure from a co-design pass with GPT Sol (docs/research/kumbhaka-plan-sol.md): a short arrival,
// each step introduced, one shared breath in and all the way out before it, then the rounds with the
// phases called on every breath. Most rounds are calls only; the content that is there is tied to
// the phase it is about, and builds over the session (an effort check over three holds in the last
// step). Forty seconds of free breathing between steps. Nothing is said twice.
const K = {
  welcome: line('kb_welcome2', "Get seated, or lie down somewhere comfortable. This is kumbhaka: a pause after breathing in, and another after breathing out."),
  permission: line('kb_permission_r2', "Breathe at the first clear urge, even in the middle of a hold. If you feel dizzy or off, stop and breathe normally."),
  nose: line('kb_nose2', "Use your nose if it's comfortable, and keep the breathing quiet.", 'technique'),
  // Step intros, by role (first / middle / last step).
  size: line('kb_size_r2', "Use a comfortable breath, without filling to the top. If the breath after a pause is a gasp, take ordinary breaths instead of following the counts.", 'technique'),
  leadFirst: line('kb_lead_first_r2', "We'll take an easy breath in together and let it out. The next breath in starts round one."),
  longer: line('kb_longer_r2', "The counts get longer here. Spread the air across the whole inhale and exhale. If you finish early, slow the airflow on the next round.", 'technique'),
  leadMiddle: line('kb_lead_middle_r2', "One easy breath in together and one easy breath out, and then we're into the rounds."),
  finishOk: line('kb_finish_ok_r2', "If you gasped or had to break the rhythm in the last step, skip this one and breathe naturally for the rest of the session."),
  leadLast: line('kb_lead_last_r2', 'Before the last sequence, one easy breath in with me and an easy breath out. Round one follows.'),
  // In the rounds, tied to their phase.
  shoulders: line('kb_shoulders', "Keep your shoulders loose while you hold. Don't bear down.", 'technique'),
  evenOut: line('kb_even_out', 'Let the air leave evenly, without pushing.', 'technique'),
  belly: tip('kb_t_belly2', "Let your belly soften as the air leaves."),
  ribs: line('kb_ribs', 'Let your lower ribs widen as you inhale.', 'technique'),
  rejoin: line('kb_rejoin', "If you lose the rhythm, take a few ordinary breaths. Rejoin on a fresh breath in when it feels easy."),
  noticePause: tip('kb_t_notice_pause_r2', "Notice where the urge starts: throat, chest, or belly."),
  hands: line('kb_hands_r2', "Check your hands for extra effort. If they're gripping, let them go while you hold.", 'technique'),
  jaw: line('kb_jaw_r2', 'If your teeth are pressed together, let them part. You can hold without clenching your jaw.', 'technique'),
  body: line('kb_body_r2', 'Is your whole body braced? Small movements are fine; only the air needs to pause.', 'technique'),
  support: line('kb_empty_soft_r2', "Keep your belly soft, without pulling it in.", 'technique'),
  halfway: line('kb_halfway_r2', "Keep the next exhale even across its whole count. If you need to rush it, return to ordinary breathing.", 'technique'),
  // Between steps, and the close.
  interval1: line('kb_interval_1', "That's the first step done. Breathe at your own pace now. No counts for the next forty seconds."),
  interval2: line('kb_interval_2', "That's the second step. Take forty seconds of normal breathing before we set up the longer one."),
  release: line('kb_release2', "That was the last hold. Let your breathing find its own pace. We'll stay here for a minute."),
  nextTime: tip('kb_t_next_time_r2', "Next time, stop at the step you could finish without strain, empty holds included. Repeating a step is fine."),
  close: line('kb_close2', "Give your breathing time to settle before you get up."),
};
/** Steps per level: [unit in seconds, rounds]. A round is u in, 2u hold, 1.5u out, u hold. */
const KB_STEPS = {
  gentle: [[4, 6], [6, 8]],
  standard: [[4, 6], [6, 8], [8, 12]],
  deeper: [[6, 6], [8, 8], [10, 12]],
};
const ratio = (u) => ({ inhale: u, holdIn: 2 * u, exhale: 1.5 * u, holdOut: u });
// Debrief the first empty pauses while the listener is breathing freely.
const KB_DEBRIEF = lesson('kb_debrief_r3', "You may have noticed the short empty pause feels harder than the long full one. With less air in, there's less lung stretch to quiet the urge.");
// What's going on in the holds, told over consecutive full holds while the listener is feeling it:
// the urge in the second step (the last step at Gentle), then, early in the top step, why the same
// counts get harder, the heart on the long exhales, and what practice changes. The last rounds stay quiet.
const KB_WHY = [
  lesson('kb_why_1', "With no air moving, the carbon dioxide your body makes builds up. That's most of what you feel as the urge."),
  lesson('kb_why_2', "Sensors in your brainstem and in your neck track that rise and turn the urge up. It's not an oxygen alarm."),
  lesson('kb_why_3', "Holds this short barely move your blood oxygen, so the urge here is a nudge, not an emergency."),
];
const KB_DEEPER = [
  lesson('kb_deep_1', "At these counts you're taking under two breaths a minute, so carbon dioxide creeps up from round to round. That's why the same count can feel harder later."),
  lesson('kb_deep_2', "Your heart rate rises a little on each breath in and eases on each breath out. On these long exhales, you may feel it slow."),
  lesson('kb_deep_3', "With practice, the urge usually feels more familiar. Use that to stay loose while it builds, not to stretch the holds."),
];
const RATIO_LABELS = (ph) => ({ in: 'In', top: 'Hold', out: 'Out', bottom: 'Hold, empty' })[ph];
const kbIntro = (n, u, r) => say(`Step ${num(n)}. ${Num(r)} rounds. ${Num(u)} in, ${num(2 * u)} hold, ${num(1.5 * u)} out, ${num(u)} hold.`);
/** In-round content per role, as [round (0-based), phase, line]. `top` is the full hold, `bottom` the empty one. */
const KB_ROUNDS = {
  first: [[0, 'top', K.shoulders], [2, 'out', K.evenOut], [4, 'out', K.belly]],
  middle: [[0, 'in', K.ribs], [0, 'top', K.rejoin], [6, 'top', K.noticePause]],
  last: [[0, 'top', K.hands], [1, 'top', K.jaw], [2, 'top', K.body], [3, 'bottom', K.support], [6, 'top', K.halfway]],
};

export const kumbhaka = {
  id: 'kumbhaka',
  title: 'Kumbhaka',
  titleHtml: '<em>Kumbhaka</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'leo',
  blurb: 'In, hold, out, hold at a fixed ratio, stepping up to 8 · 16 · 12 · 8.',
  lede: 'Breath retention at a 1 : 2 : 1.5 : 1 ratio: in, hold, out, hold, through the nose if comfortable. This uses shorter holds relative to the inhale than the traditional 1 : 4 : 2. Standard starts at 4 · 8 · 6 · 4 and steps up twice.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#cfd3f2', '#4b4f9a'],
  sky: 'deep',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: {
    gentle: 'Two steps: 4 · 8 · 6 · 4, then 6 · 12 · 9 · 6.',
    standard: 'Three steps, up to 8 · 16 · 12 · 8.',
    deeper: 'Three steps, up to 10 · 20 · 15 · 10.',
  },
  defaultLevel: 'standard',
  after: ['Daily is fine for this one. Move up a level only when the top step stays easy all the way through.', 'If you gasp after a hold, the counts are too long for today. Drop a level.'],
  sections: (opts) => {
    const steps = KB_STEPS[levelOf(opts)];
    const last = steps.length - 1;
    const role = (k) => (k === 0 ? 'first' : k === last ? 'last' : 'middle');
    const intro = { first: [K.size, K.leadFirst], middle: [K.longer, K.leadMiddle], last: [K.finishOk, ...(last === 1 ? [K.longer] : []), K.leadLast] };
    const intervals = [K.interval1, K.interval2];
    return [
      {
        id: 'deep-arrive',
        title: 'Arrive',
        what: 'Posture, permission',
        color: '#a3a8e0',
        steps: [{ say: K.welcome, bell: 'low', lead: 2 }, { say: K.permission }, { say: K.nose }, { rest: 4 }],
      },
      ...steps.flatMap(([u, r], k) => [
        {
          id: `deep-${k + 1}`,
          title: k === last ? 'Top step' : `Step ${k + 1}`,
          what: `${u} · ${2 * u} · ${1.5 * u} · ${u}, ${r} rounds`,
          color: ['#8f95d6', '#6f75c0', '#4b4f9a'][k],
          steps: [
            { say: kbIntro(k + 1, u, r), bell: 'bell', gap: 0.8 },
            ...intro[role(k)].map((line) => ({ say: line, gap: 0.8 })),
            // One easy breath together; the rounds start on the next breath in.
            { pace: { inhale: u, exhale: 1.5 * u }, count: 1, style: 'count', calls: LEO },
            {
              pace: ratio(u),
              count: r,
              style: 'count',
              labels: RATIO_LABELS,
              calls: LEO,
              endOnHold: true,
              // Gentle has no middle step: its rejoin cue moves to the break (below).
              cues: [
                ...KB_ROUNDS[role(k)].map(([round, phase, line]) => ({ breath: round, phase, say: line })),
                ...(role(k) === 'middle' ? KB_WHY.map((say, n) => ({ breath: 2 + n, phase: 'top', say })) : []),
                ...(role(k) === 'last' ? (last === 1 ? KB_WHY : KB_DEEPER).map((say, n) => ({ breath: 3 + n, phase: 'top', say })) : []),
              ],
            },
          ],
        },
        ...(k < last
          ? [
              {
                id: `calm-break-${k + 1}`,
                title: 'Own pace',
                what: 'Forty seconds, no counts',
                color: '#b9bde8',
                steps: [{ rest: 40, label: 'Your own pace', cues: [{ at: 0.5, say: intervals[k] }, ...(k === 0 ? [{ at: 13, say: KB_DEBRIEF }] : []), ...(last === 1 ? [{ at: 29, say: K.rejoin }] : [])] }],
              },
            ]
          : []),
      ]),
      {
        id: 'calm-kb',
        title: 'Release',
        what: 'Natural breathing, a minute',
        color: '#b9bde8',
        steps: [{ rest: 60, cues: [{ at: 0.5, say: K.release }, { at: 40, say: K.nextTime }, { at: 53, say: K.close }] }, { rest: 2 }],
      },
    ];
  },
  learn: `
<p>Kumbhaka means the held breath. Here it runs at a modern, shorter held ratio: in, hold full, out, hold empty, at 1 : 2 : 1.5 : 1. The full hold is twice the inhale, rather than four times as in the traditional 1 : 4 : 2. The counts get longer step by step while the rhythm stays the same.</p>
<h3>The technique</h3>
<ul>
  <li>Sit comfortably or lie down. Use your nose if comfortable, and keep the breathing slow and quiet.</li>
  <li>Fill from the bottom: belly, then ribs, then chest. Not to the very top.</li>
  <li>The holds are a pause, not a squeeze: throat open, face and shoulders soft. Spread the out-breath over its whole count.</li>
  <li>Gentle tops out at 6 · 12 · 9 · 6, Standard at 8 · 16 · 12 · 8, Deeper at 10 · 20 · 15 · 10. If a hold gets too long, breathe and join the next round.</li>
  <li>If you gasp or lose the rhythm, take ordinary breaths. Skip the next step if the current one requires either; choose shorter counts next time.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>The full cycle here is 22–55 seconds, about one to three breaths a minute. Carbon dioxide rises during a pause, and lung volume also affects when the urge arrives; an empty pause can feel harder despite being shorter.</li>
  <li>Slow breathing increases the heart-rate changes that follow each breath ${ev.solid}; reviews also report calmer mood and more alertness ${ev.some}. Those studies mostly use about six breaths a minute and often small samples. Whether these slower cycles with full and empty holds add a benefit has not been established ${ev.spec}.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Zaccaro et al. 2018, <a href="https://doi.org/10.3389/fnhum.2018.00353" target="_blank" rel="noopener">How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing</a>, Front Hum Neurosci.</li>
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">slow-paced breathing and vagally mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Parkes 2006, <a href="https://doi.org/10.1113/expphysiol.2005.031625" target="_blank" rel="noopener">Breath-holding and its breakpoint</a>, Exp Physiol.</li>
  <li><a href="https://www.institutokamala.com.br/en/biblioteca/gheranda-samhita" target="_blank" rel="noopener">Gheranda Samhita, fifth teaching</a>: traditional inhalation, retention and exhalation counts of 16 : 64 : 32.</li>
</ul>`,
};

// ── Hold Ladder ────────────────────────────────────────
const H = {
  welcome: line('hl_welcome', "This is a breath-hold table from dry-land freediving practice. Sit or lie down somewhere you can't fall. Never do this in or near water."),
  plan: (hold) => line(`hl_plan_${hold}_r2`, `Eight holds of ${dur(hold)}, with rests dropping from two minutes to thirty seconds. End any hold early when you need to. If the first isn't easy, stop and choose First urge next time.`),
  planUrge: line('hl_plan_urge_r2', "Six holds ending at the first clear urge to breathe, with two minutes between them. Each has a ninety-second ceiling. Breathe first; when you can, tap Breathe now to move to recovery."),
  full: line('hl_full', 'Every hold starts from a comfortably full breath, not as full as you can get.', 'technique'),
  noBig: line('hl_no_big', "Breathe normally in the rests. Big or fast breaths lower carbon dioxide and can delay the urge during the next hold, even as oxygen falls. That can lead to a blackout.", 'technique'),
  rule: line('hl_rule_r2', "Stop the table if you feel dizzy, start straining, or your breathing hasn't settled before the next hold."),
  calm: line('hl_calm2', 'Breathe at your own pace for a minute before we start the table.'),
  lead: line('hl_lead_r2', 'One easy breath in together and an easy breath out. The next breath in starts the first hold.'),
  in: say('Comfortably full breath in.'),
  recovery: line('hl_recovery_r2', "After each hold, release a little air. Then I'll call three recovery breaths: a quick inhale, a short pause, and out. After those, breathe normally.", 'technique'),
  recoverIn: line('hl_recover_in', 'In.', 'count'),
  recoverHold: line('hl_recover_hold', 'Pause.', 'count'),
  recoverOut: line('hl_recover_out', 'Let it go.', 'count'),
  soft: tip('hl_t_soft', "Let your jaw loosen without changing your breath hold."),
  co2: lesson('hl_co2', 'While you hold, your body keeps making carbon dioxide. Its rise usually drives the urge to breathe more than falling oxygen does.'),
  dive: lesson('hl_dive_r2', "Your heart may slow a little during a dry hold. That helps conserve oxygen while you're not breathing."),
  scan: tip('hl_t_scan', "Check whether your shoulders lifted with the inhale. Let them drop without letting air out."),
  contract: line('hl_contract_r2', "Jerks under your ribs are breathing contractions. This table ends before you push through them: breathe at the first one, or sooner if you need air."),
  spleen: lesson('hl_spleen2', "Over several holds, the spleen can release extra red blood cells. That temporarily adds a little to the oxygen your blood can carry."),
  ten: line('hl_t_ten2', "If the first breath after that hold was a gasp, finish the table on normal breathing. The next hold can wait for another day.", 'guide'),
  last: line('hl_last_r2', "This is the last hold. Keep your body loose."),
  restWhy: lesson('hl_rest_why_r2', 'Breathing in the rests lets carbon dioxide fall again. A shorter rest leaves less time for that recovery, so the next urge can arrive sooner.'),
  urgeWhy: lesson('hl_urge_why', "Breathing between holds lets carbon dioxide fall again. Here the rests stay long, so you can notice the urge without chasing a time."),
  study: lesson('hl_lung_store_r2', "Your lungs store oxygen too. A comfortably full inhale gives you a reserve without the tension of forcing in extra air."),
  earlierUrge: line('hl_earlier_urge_r2', "The shorter rests can bring the urge earlier now. End this hold when you need air, even if you finished the earlier ones."),
  shortRest: line('hl_short_rest_r2', "After the next recovery, only a few breaths remain before the last hold. If you're not settled by its inhale, finish on normal breathing."),
  restUrge: line('hl_t_rest_urge', "Take the whole rest. If your breathing is not easy again, stop here rather than starting another hold.", 'guide'),
  done: line('hl_done2', 'The table is done. Breathe at your own pace, and stay seated or lying down for this last minute.'),
  close: line('hl_close_r2', "Leave a rest day between tables. When the last forty-five-second hold feels as easy as the first, you can try the one-minute setting next time."),
  closeLong: line('hl_close_long_r2', "Leave a rest day between tables. Repeat this setting only while every hold stays easy, including the last. There's no need to extend the holds."),
  closeUrge: line('hl_close_urge_r2', "Leave a rest day between tables. Before choosing forty-five-second holds, make sure that length feels easy when you stop at the first urge."),
};
const HOLD_TIPS = [H.soft, H.scan];
const HL_BREAKS = [
  line('hl_break_1', 'Breathe at your own pace now.'),
  line('hl_break_2', 'No counts here. Let your breathing settle.'),
  line('hl_break_3', 'Take this rest on ordinary, unhurried breaths.'),
  line('hl_break_4', 'Let the rhythm go and breathe normally.'),
  line('hl_break_5', 'Use this time to breathe however feels easy.'),
  line('hl_break_6', 'Rest on your own rhythm before the next hold.'),
  line('hl_break_7_r2', 'Take these last few breaths at your own pace.'),
];
const ORDINAL = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'];
const RECOVER = { inhale: 1.5, holdIn: 1.5, exhale: 3 };
const recoveryCalls = (ph) => ({ in: H.recoverIn, top: H.recoverHold, out: H.recoverOut })[ph];

export const holdLadder = {
  id: 'hold-ladder',
  title: 'Hold Ladder',
  titleHtml: 'Hold <em>ladder</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'leo',
  blurb: 'A freediver’s table on dry land: same holds, shorter rests.',
  lede: 'A dry breath-hold table from freediving. Start with First urge: six relaxed holds that end when you choose. Then the CO₂ table: eight holds of the same length, with the rest shrinking from two minutes to thirty seconds.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#cfe0f2', '#3d5f8f'],
  sky: 'table',
  intensity: ['gentle', 'standard', 'deeper'],
  levelNames: { gentle: 'First urge', standard: '8 × 0:45', deeper: '8 × 1:00' },
  intensityNotes: {
    gentle: 'Six holds to the first clear urge, each capped at 90 s, two minutes apart. Start here.',
    standard: 'Eight holds of 45 s. Start with First urge; the first fixed hold should feel easy.',
    deeper: 'Eight holds of 1:00. Choose this only after all eight 45 s holds stay easy, including the last.',
  },
  defaultLevel: 'gentle',
  after: ['Two or three tables a week, with a rest day between.', 'Use this table on dry land, seated or lying down. Never in or near water.'],
  sections: (opts) => {
    const urge = levelOf(opts) === 'gentle';
    const hold = urge ? 90 : scaled(45, opts) > 45 ? 60 : 45;
    const n = urge ? 6 : 8;
    const rests = urge ? Array(n - 1).fill(120) : [120, 105, 90, 75, 60, 45, 30];
    const thread = [H.co2, H.dive, H.spleen, H.study, ...(urge ? [] : [H.earlierUrge])];
    const holds = Array.from({ length: n }, (_, i) => {
      const last = i === n - 1;
      return [
        ...(i === 0 ? [{ pace: { inhale: 4, exhale: 6 }, count: 1, style: 'count', calls: LEO }] : []),
        { pace: { inhale: 4 }, count: 1, style: 'slow', bell: 'low', group: `h${i}`, calls: () => H.in },
        {
          hold: 'full',
          seconds: hold,
          label: urge ? 'Hold · first urge' : `Hold ${i + 1} of ${n}`,
          record: true,
          tick: !urge,
          group: `h${i}`,
          cues: [
            { at: 0.3, say: urge ? say(`${ORDINAL[i]} hold.`) : say(`Hold ${num(i + 1)} of ${num(n)}. ${cap(dur(hold))}.`) },
            ...(last || HOLD_TIPS[i] ? [{ at: 6.5, say: last ? H.last : HOLD_TIPS[i] }] : []),
            ...(thread[i] ? [{ at: 18, say: thread[i] }] : []),
            ...(urge ? [] : milestones(hold)),
            ...(urge ? [] : [{ fromEnd: 11, say: tenMore }]), // First urge has no target to reach
          ],
        },
        { pace: { exhale: 1.5 }, count: 1, style: 'slow', calls: () => LEO('out', 1) },
        { pace: RECOVER, count: 3, style: 'slow', label: 'Recovery', calls: recoveryCalls },
        // Include the release, recovery breaths and next four-second inhale in the advertised rest.
        ...(last ? [] : [{ rest: rests[i] - 23.5, label: 'Your own pace', cues: [{ at: 0.5, say: HL_BREAKS[i] }, ...(i === 0 ? [{ at: 12, say: urge ? H.urgeWhy : H.restWhy }] : urge && i === 1 ? [{ at: 12, say: H.restUrge }] : i === 4 ? [{ at: 12, say: H.ten }] : !urge && i === 5 ? [{ at: 8, say: H.shortRest }] : [])] }]),
      ];
    }).flat();
    return [
      {
        id: 'deep-arrive',
        title: 'Arrive',
        what: 'How the table works',
        color: '#9fb6d8',
        steps: [{ say: H.welcome, bell: 'low', lead: 2 }, { say: urge ? H.planUrge : H.plan(hold) }, { say: H.full }, { say: H.noBig }, { say: H.rule }, { say: H.contract }, { say: H.recovery }, { say: H.calm, gap: 0.5 }, { rest: 60, label: 'Your own pace' }, { say: H.lead }],
      },
      {
        id: 'table',
        title: 'The table',
        what: urge ? `${n} holds to the first urge · 2:00 rests` : `${n} × ${mmss(hold)} holds · rests 2:00 → 0:30`,
        color: '#3d5f8f',
        steps: holds,
      },
      {
        id: 'calm-close',
        title: 'Recover',
        what: 'Natural breathing',
        color: '#a9c2e0',
        steps: [{ rest: 60, label: 'Your own pace', bell: 'bell', cues: [{ at: 0.5, say: H.done }, { at: 45, say: urge ? H.closeUrge : hold === 45 ? H.close : H.closeLong }] }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>Freedivers train with "tables" on dry land. <strong>First urge</strong> is the beginner's version: each hold ends at the first clear urge to breathe, with a ninety-second cap and two minutes between holds. In a <strong>CO₂ table</strong> the hold stays fixed while the rest shrinks each round, leaving less time to recover. Choose a hold length that feels easy on the first hold; there is no need to test an all-out maximum.</p>
<h3>The technique</h3>
<ul>
  <li>Easy breathing between holds at your own pace. No fast or big breaths before a hold, ever.</li>
  <li>Each hold starts from a comfortable full breath, about 80%, not a maximal one. Relax the face, jaw and shoulders.</li>
  <li>After each hold, release a little air, then take three recovery breaths: a quick breath in, a short pause at the top, then let it go.</li>
  <li>The CO₂ table has eight holds; rests go 2:00, 1:45, 1:30, 1:15, 1:00, 0:45, 0:30. If a hold starts to feel like a maximum effort, stop the table there.</li>
  <li>Recovery breathing and the next inhale are included in each rest. The final 30-second interval leaves only a few own-pace breaths. If breathing has not settled, finish on ordinary breathing. Move from 45 s to 60 s only when all eight holds stay easy.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>A study in 28 novices found smaller falls in blood and brain oxygenation during tables than during maximal holds. It measured immediate responses, not whether repeated tables improve performance ${ev.some}.</li>
  <li>The diving reflex slows the heart during a hold ${ev.solid}. The spleen contracts over several holds, releasing a few percent more red blood cells; this fades within minutes ${ev.solid}.</li>
  <li>Two weeks of daily holds lengthened max holds by about 44 s in a small, uncontrolled study ${ev.some}. That tables themselves improve your maximum isn't shown ${ev.spec}.</li>
  <li>Diaphragm contractions late in a hold are a response to rising CO₂ ${ev.solid}. In this app they're a good moment to end the hold, not something to push through.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Declercq et al. 2024, CO₂ and O₂ tables vs maximal apneas in novices, <a href="https://doi.org/10.1007/s00421-024-05563-7" target="_blank" rel="noopener">Eur J Appl Physiol</a>.</li>
  <li>Engan et al. 2013, two weeks of daily apnea training (max holds, diving response, spleen), Scand J Med Sci Sports: <a href="https://pubmed.ncbi.nlm.nih.gov/?term=Engan+2013+apnea+training+Scand+J+Med+Sci+Sports" target="_blank" rel="noopener">PubMed search</a>.</li>
  <li>RAID, <a href="https://gofreediving.co.uk/wp-content/uploads/2024/09/Static-Apnea-Management-Manual_V1.0.-1.pdf" target="_blank" rel="noopener">Static apnea management manual</a> (recovery breathing).</li>
  <li>Vigetun-Haughey et al. 2015, <a href="https://pubmed.ncbi.nlm.nih.gov/25549785/" target="_blank" rel="noopener">voluntary apnea and diving responses</a>, Eur J Appl Physiol; healthy controls showed a smaller heart-rate response in air than with facial immersion.</li>
</ul>`,
};

// ── Rounds ─────────────────────────────────────────────
const R = {
  welcome: line('rd_welcome', "Sit or lie down somewhere comfortable, where you can't fall. Never do this standing, driving, or in or near water."),
  blackout: line('rd_blackout', "Twitching, blanking out, or losing track of time during a hold can mean oxygen ran dangerously low. Stop the session if that happens."),
  plan: line('rd_plan_r2', "Four rounds of full breaths, a pause after the air falls out, then one comfortable recovery breath held for up to fifteen seconds."),
  how: line('rd_how2', "Fill through your belly and chest, then let the air fall out without pushing.", 'technique'),
  tingle: line('rd_tingle_r2', "Light tingling in your hands or face can happen during the fast breaths. If your hands cramp or you feel dizzy, breathe normally and skip the hold and recovery pause."),
  powerIn: line('rd_power_in', 'In.', 'count'),
  lastIn: line('rd_last_in', 'Last in.', 'count'),
  lastBreath: line('rd_last_breath_r2', 'Let it go.', 'count'),
  tap: line('rd_tap_r2', "If you come up early, breathe normally and ignore the remaining hold and recovery calls. The phone can wait. Tapping Breathe now skips straight to the rest, including skipping the recovery breath and pause."),
  relax: tip('rd_t_relax', 'Let your shoulders drop and your hands go soft.'),
  letGo: line('rd_let_go', 'And let it go.', 'count'),
  why: lesson('rd_why2', "An unusually quiet urge is expected here: the fast breaths lowered carbon dioxide, the main signal that normally prompts a breath."),
  oxygen: line('rd_oxygen_r2', "Fast breathing delays the urge while oxygen can still run low. End a hold at the first clear urge or the time limit, whichever comes first; don't wait for a strong urge.", 'guide'),
  check: line('rd_check_r2', "Check your hands and lips. If they're still tingling, keep breathing normally and stay here until the sensation and any dizziness settle."),
  recoveryIn: line('rd_recovery_in', 'Take one comfortable breath in.', 'count'),
  downRest: line('rd_down_rest', 'Before the slower breathing, take a few breaths at your own pace.'),
  slow: say('Now slow it down. In for four, out for six.'),
  quiet: line('rd_quiet_r2', 'Let the count go and breathe at your own pace for this last minute. Stay seated or lying while you settle.'),
  close: line('rd_close_r2', "That's the session. Take your time getting up, once your breathing and balance feel normal."),
};
const POWER = { inhale: 1.6, exhale: 1.6, level: 0.6 };
const RD_HOLDS = [45, 60, 75, 75];
const RD_BREAKS = [
  line('rd_break_1', 'Breathe at your own pace for forty-five seconds before round two.'),
  line('rd_break_2', 'Another forty-five seconds of ordinary breathing. Let yourself settle before we continue.'),
  line('rd_break_3', 'No counts for this rest. Take forty-five seconds on your own rhythm.'),
];
const RD_THREAD = [
  R.why,
  lesson('rd_lung_reserve', 'This empty hold starts with less air in your lungs than a full hold. That leaves a smaller oxygen reserve to draw on.'),
  line('rd_urge_returns_r2', 'Carbon dioxide is building back up. If the urge returns, end the hold.'),
  line('rd_repeated_holds_r2', 'Later holds can feel easier after the breathing has lowered carbon dioxide. Keep the same time limit, however quiet the urge feels.'),
];
const RD_TINGLE = lesson('rd_tingle_why_r2', "Low carbon dioxide makes blood more alkaline and nerves more excitable. That's where light tingling can come from.");
const RD_FLOW = lesson('rd_flow_why_r2', "Fast breathing can lower blood flow to your brain by lowering carbon dioxide. That can explain a light head.");
const RD_TINGLE_REST = lesson('rd_tingle_fade_r2', 'If your hands are still tingling, notice whether it fades as you breathe normally and carbon dioxide returns toward its usual level.');

function powerRound(n, opts) {
  const breaths = opts.gentle ? 20 : 30;
  const hold = scaled(RD_HOLDS[n - 1], opts);
  return {
    id: `round-${n}`,
    title: `Round ${n}`,
    what: `${breaths} breaths · empty hold up to ${mmss(hold)}`,
    color: ['#ffb38a', '#ff9e7a', '#ff8a7a', '#f2777f'][n - 1],
    steps: [
      // The full lead-in instruction once; later rounds just name it.
      { say: n === 1 ? line(`rd_round_1_${breaths}_r2`, `Round one. ${Num(breaths)} breaths. First, one easy breath in with me and an easy breath out. The next inhale starts the faster rhythm.`) : say(`Round ${num(n)}. ${Num(breaths)} breaths. One easy breath with me first.`), bell: 'bell', gap: 0.6 },
      { pace: { inhale: 4, exhale: 6 }, count: 1, style: 'count', calls: MIRA },
      {
        pace: POWER,
        count: breaths,
        style: 'tally',
        lastExhale: 3,
        // Called breath by breath until the rhythm is set; after that the pump sound carries it and
        // only the markers are spoken, not sixty identical calls a round.
        calls: (ph, i) => {
          if (i === breaths - 1) return ph === 'in' ? R.lastIn : R.lastBreath;
          if (i < 5) return ph === 'in' ? R.powerIn : say('Out.');
          if (ph !== 'in') return null;
          return { 9: say('Ten.'), 19: say('Twenty.'), [breaths - 6]: say('Five more.') }[i] || null;
        },
        // A complete explanation in the gap between markers, without removing any calls.
        cues: n === 2 || n === 3 ? [{ at: (breaths === 20 ? 10 : 15) * 3.2, say: n === 2 ? RD_TINGLE : RD_FLOW }] : [],
      },
      holdEmpty(hold, [{ at: n === 3 ? (hold >= 60 ? 45 : 22) : 7, say: RD_THREAD[n - 1] }, ...(n === 2 ? [{ at: 20, say: R.relax }] : [])], { group: `rd${n}` }),
      { pace: { inhale: 6 }, count: 1, style: 'slow', group: `rd${n}`, calls: () => R.recoveryIn },
      { hold: 'full', seconds: 15, tick: false, group: `rd${n}`, label: 'Recovery · up to 15 s', cues: [{ at: 0.3, say: MIRA('top') }] },
      { pace: { exhale: 3 }, count: 1, style: 'slow', group: `rd${n}`, calls: () => R.letGo },
      ...(n < 4 ? [{ rest: 45, label: 'Your own pace', cues: [{ at: 0.5, say: RD_BREAKS[n - 1] }, ...(n === 1 ? [{ at: 12, say: RD_TINGLE_REST }] : [])] }] : []),
    ],
  };
}

export const rounds = {
  id: 'rounds',
  title: 'Rounds',
  titleHtml: '<em>Rounds</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'mira',
  blurb: 'Twenty or thirty rhythmic breaths, an empty hold, one recovery breath. Four rounds.',
  lede: 'Four sets of full, rhythmic breaths, each followed by an empty hold and one comfortable recovery breath held for up to fifteen seconds. End holds early; after fast breathing, a quiet urge does not tell you how much oxygen remains.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#ffe0cc', '#c8554f'],
  sky: 'round',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: {
    gentle: 'Twenty breaths a round, empty holds of up to 0:25 → 0:45.',
    standard: 'Thirty breaths a round, empty holds of up to 0:45 → 1:15.',
    deeper: 'Thirty breaths a round, empty holds of up to 1:00 → 1:40.',
  },
  defaultLevel: 'standard',
  after: ['Twitching, blanking out or losing time during a hold can mean oxygen ran dangerously low. Stop the session.', 'Never in or near water, and never standing. Give it a few minutes before you drive.'],
  sections: (opts) => [
    {
      id: 'heat-arrive',
      title: 'Arrive',
      what: 'How a round works',
      color: '#ffc9a8',
      steps: [{ say: R.welcome, bell: 'low', lead: 2 }, { say: R.plan }, { say: R.blackout }, { say: R.how }, { say: R.tingle }, { say: R.oxygen }, { say: R.tap }, { rest: 6 }],
    },
    ...[1, 2, 3, 4].map((n) => powerRound(n, opts)),
    {
      id: 'calm-rd',
      title: 'Come down',
      what: '4 in · 6 out, then quiet',
      color: '#8fcfb8',
      steps: [
        { rest: 15, label: 'Your own pace', cues: [{ at: 0.5, say: R.downRest }] },
        { say: R.slow, bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 10, style: 'count', calls: MIRA },
        { say: R.quiet, bell: 'low' },
        { rest: 60, label: 'Your own pace', cues: [{ at: 12, say: R.check }] },
        { say: R.close },
        { rest: 4 },
      ],
    },
  ],
  learn: `
<p>Four rounds of full, rhythmic breathing followed by an empty hold, then one comfortable breath held for up to fifteen seconds. If you end a hold early, breathe normally and tap <em>Breathe now</em> to skip the rest of that hold sequence. Time limits and a quiet urge do not guarantee safety after fast breathing.</p>
<h3>The technique</h3>
<ul>
  <li>Seated or lying, never standing, never in or near water.</li>
  <li>Full breaths in through the nose or mouth, belly then chest; let each one fall out without pushing.</li>
  <li>After the last breath, let the air fall out without pushing and pause at the end of that exhale. To end early, breathe normally and tap <em>Breathe now</em>; this skips the recovery hold too. If you follow the full sequence, take one comfortable breath in and pause for up to fifteen seconds, breathing out sooner whenever needed.</li>
  <li>Light tingling can occur during fast breathing. Cramping hands or dizziness mean normal breathing and skipping both the empty hold and recovery pause. Ignore their calls; the phone can wait. Tapping <em>Breathe now</em> during a hold skips to the rest.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>The adrenaline rise comes mostly from the fast breathing itself; the long empty hold adds a deep drop in blood oxygen, to around 60–70% in lab studies ${ev.solid}. A time cap does not prevent hypoxia or blackouts.</li>
  <li>In a month-long trial of five daily minutes, fast breathing with short holds, slower breathing practices and mindfulness all reduced anxiety and negative affect. Cyclic sighing had the largest daily increase in positive affect ${ev.some}. These longer holds were not tested, and the trial does not establish an advantage for this session.</li>
  <li>Trained volunteers had less inflammation after an injected toxin in one small study that combined breathing, cold and meditation ${ev.some}. It doesn't show the breathing alone protects you from illness ${ev.spec}.</li>
  <li>Twitching, blanking out or losing time in a hold can be signs of dangerously low oxygen. Stop the session.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Zwaag et al. 2022, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9071023/" target="_blank" rel="noopener">cold exposure training and a breathing exercise: effects on the inflammatory response</a>, Psychosom Med.</li>
  <li>Balban et al. 2023, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/" target="_blank" rel="noopener">Brief structured respiration practices enhance mood and reduce physiological arousal</a>, Cell Rep Med.</li>
  <li>Kox et al. 2014, <a href="https://doi.org/10.1073/pnas.1322174111" target="_blank" rel="noopener">Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans</a>, PNAS.</li>
  <li>Macefield &amp; Burke 1991, <a href="https://pubmed.ncbi.nlm.nih.gov/2004255/" target="_blank" rel="noopener">paraesthesiae and tetany induced by voluntary hyperventilation</a>, Brain.</li>
  <li>Debreczeni et al. 2009, <a href="https://pubmed.ncbi.nlm.nih.gov/19212108/" target="_blank" rel="noopener">hypocapnia induced by hyperventilation reduces cerebral blood-flow velocity</a>, Tohoku J Exp Med.</li>
</ul>`,
};

// ── Alternate Nostril, with holds ──────────────────────
const N = {
  welcome: line('an_welcome_r2', 'Sit comfortably on a cushion or chair, and rest your left hand in your lap. Close your eyes if you like; the calls will tell you which side.'),
  hand: line('an_hand_r2', 'Bring your right hand up and fold your index and middle fingers down. Your thumb closes the right nostril; your ring finger closes the left. Rest that hand in your lap until we start.', 'technique'),
  plan: line('an_plan', "We'll warm up without holds, then add a pause after each inhale. The traditional ratio is one, four, two: hold four times the inhale, then breathe out for twice the inhale. Breathe whenever you need to."),
  blocked: line('an_blocked_r2', "If one side stays blocked, keep your hand down and breathe through both sides with the calls. Don't force air through the blocked side.", 'technique'),
  even: say('Four in, four out. We start on the left.'),
  ready: line('an_ready', "Bring your right hand up and close the right nostril.", 'count'),
  rOut: line('an_r_out', 'Switch. Out through the right.', 'count'),
  rIn: line('an_r_in', 'In through the right.', 'count'),
  lOut: line('an_l_out', 'Switch. Out through the left.', 'count'),
  both: line('an_both', 'Close both sides, and hold.', 'count'),
  lInH: line('an_l_in_h', 'In through the left.', 'count'),
  rOutH: line('an_r_out_h', 'Release the right, and breathe out.', 'count'),
  lOutH: line('an_l_out_h', 'Release the left, and breathe out.', 'count'),
  holdSoft: line('an_hold_soft', 'Keep your face and throat soft on the hold, and your fingers light.', 'technique'),
  track: line('an_t_track', "After each exhale, inhale through the same side. Switch for the next exhale.", 'technique'),
  ears: tip('an_t_ears_r2', 'With headphones, the breath sound follows the open side. Sound on the left means breathe through your left nostril.'),
  arm: line('an_arm_r2', "If your arm tires, support your right elbow with your left hand, or lower your hand and breathe normally.", 'technique'),
  air: line('an_air_r2', "Breathe at the first clear urge. If a hold feels too long, release both nostrils and breathe normally. Rejoin on a left-side inhale when ready."),
  nasalCycle: lesson('an_nasal_cycle_r2', "Notice which side felt easier. The nasal lining naturally swells more on one side, then the other; that shift usually takes hours, so don't force equal airflow."),
  exhaleCheck: line('an_exhale_check_r2', "If the next exhale rushes, the hold was too long. Release both nostrils and breathe normally for a round.", 'technique'),
  holds: lesson('an_holds_r2', "The urge can build during these pauses because your body keeps making carbon dioxide, even while no air is moving."),
  creep: lesson('an_creep', "At these counts carbon dioxide creeps up from round to round, so the urge can arrive earlier in each hold."),
  resistance: lesson('an_resistance', "Breathing through one nostril roughly doubles your nose's resistance. That's what makes a long, even exhale easier to stretch."),
  longerCheck: line('an_longer_check_r2', "If this longer rhythm makes you rush the exhale, breathe normally for a round, then rejoin on the left.", 'technique'),
  deepestCheck: line('an_deepest_check_r2', "At these longest counts, let the exhale flow evenly. If it takes effort to keep pace, finish on ordinary breathing.", 'technique'),
  lastExhale: line('an_last_exhale_r2', "This is the last hold. Let the next exhale leave steadily, without squeezing out the last bit of air.", 'technique'),
  last: say('Last round.'),
  // Own-pace breaks before each set of holds, and the shared breath that starts each set.
  breaks: [
    line('an_break_1', 'Lower your hand and breathe through both sides at your own pace for half a minute.'),
    line('an_break_2_r2', "Lower your hand and breathe at your own pace for half a minute. We'll go longer next."),
    line('an_break_3', 'Rest your arm, and breathe at your own pace. One more set to go.'),
  ],
  leads: [
    line('an_lead_1_r2', 'Before the holds, one easy breath in through both sides with me, then an easy breath out. We start on the left.'),
    line('an_lead_2_r2', 'Keep your hand down for one easy breath in together and an easy breath out. The longer rounds start on the left.'),
    line('an_lead_3_r2', 'For the last set, take an easy breath in with me and let it out. We begin again on the left.'),
  ],
  release: line('an_release', "Lower your right hand into your lap. Breathe through both sides, and let the breath find its own pace."),
  close: line('an_close_r2', "Check which side feels more open now. If your eyes were closed, open them when ready, and take your time standing up."),
};
/** Ratio steps per level: [unit, breaths]; two breaths (left, then right) make a round. */
const AN_STEPS = {
  gentle: [[3, 32]],
  standard: [[3, 12], [4, 16]],
  deeper: [[3, 12], [4, 16], [5, 12]],
};
// Headphones: the breath sound sits on the side of the open nostril.
const sidePan = (ph, i) => {
  const left = i % 2 === 0;
  if (ph === 'in') return left ? -0.75 : 0.75;
  if (ph === 'out') return left ? 0.75 : -0.75;
  return 0;
};
const sides = (ph, i) => {
  const left = i % 2 === 0;
  if (ph === 'in') return left ? 'In · left' : 'In · right';
  if (ph === 'out') return left ? 'Out · right' : 'Out · left';
};
/** Side calls on every breath (left on even breaths, right on odd). The first rounds say the full
 *  instruction; after that, short calls. */
const OUT_R = say('Out through the right.');
const OUT_L = say('Out through the left.');
const evenCalls = (ph, i) =>
  ph === 'in' ? (i % 2 ? N.rIn : N.lInH) : ph === 'out' ? (i === 0 ? N.rOut : i === 1 ? N.lOut : i % 2 ? OUT_L : OUT_R) : null;
const holdCalls = (first) => (ph, i) => {
  const full = first && i < 2;
  if (ph === 'in') return i % 2 ? N.rIn : N.lInH;
  if (ph === 'top') return full ? N.both : MIRA('top');
  if (ph === 'out') return full ? (i % 2 ? N.lOutH : N.rOutH) : i % 2 ? OUT_L : OUT_R;
  return null;
};

export const alternate = {
  id: 'alternate',
  title: 'Alternate Nostril',
  titleHtml: 'Alternate <em>nostril</em>',
  tag: 'Retention',
  moment: 'retention',
  voice: 'mira',
  blurb: 'One nostril at a time, with a hold at the top. The classic 1 : 4 : 2.',
  lede: 'Nadi shodhana with kumbhaka. A few minutes of plain alternate nostril breathing, then a hold at the top of every breath: in for one count, hold for four, out for two.',
  music: ['mind', 'deep', 'building', 'current'],
  accent: ['#e0d9ff', '#6c63c9'],
  sky: 'balance',
  intensity: ['gentle', 'standard', 'deeper'],
  intensityNotes: {
    gentle: 'Sixteen rounds of 3 · 12 · 6.',
    standard: '3 · 12 · 6, then 4 · 16 · 8.',
    deeper: 'Up to 5 · 20 · 10.',
  },
  defaultLevel: 'standard',
  after: ['If your nose is blocked, do Clear Nose first.', 'In the evening this is a good way into Land.'],
  sections: (opts) => {
    const steps = AN_STEPS[levelOf(opts)];
    return [
      {
        id: 'balance-set',
        title: 'Set up',
        what: 'Hand position, the ratio',
        color: '#b3a8f0',
        steps: [{ say: N.welcome, bell: 'low', lead: 2 }, { say: N.plan }, { say: N.blocked }, { say: N.hand }, { say: N.track }],
      },
      {
        id: 'balance-even',
        title: 'Even',
        what: '4 in · 4 out, six rounds',
        color: '#9d93e8',
        steps: [
          { say: N.ears },
          { say: N.even, gap: 0.6 },
          { say: N.ready, gap: 0.6 },
          {
            pace: { inhale: 4, exhale: 4 },
            count: 12,
            style: 'count',
            labels: sides,
            pan: sidePan,
            calls: evenCalls,
          },
        ],
      },
      ...steps.flatMap(([u, b], k) => [
        {
          id: `calm-an-break-${k + 1}`,
          title: 'Own pace',
          what: 'Hand down, half a minute',
          color: '#c4bcef',
          steps: [{ rest: 30, label: 'Your own pace', cues: [{ at: 0.5, say: N.breaks[k] }, ...(k === 0 ? [{ at: 11, say: N.nasalCycle }] : [])] }],
        },
        {
          id: `balance-${k + 1}`,
          title: k ? 'Longer' : 'With holds',
          what: `${u} · ${4 * u} · ${2 * u}, ${b / 2} rounds`,
          color: ['#857bdb', '#7067cc', '#5b52b8'][k],
          steps: [
            { say: say(`In for ${num(u)}, hold for ${num(4 * u)}, out for ${num(2 * u)}. ${Num(b / 2)} rounds.`), bell: 'bell', gap: 0.6 },
            ...(k === 0 ? [{ say: N.air }] : []),
            { say: N.leads[k], gap: 0.6 },
            // One easy breath through both sides; the set starts on the next breath in.
            { pace: { inhale: u, exhale: 2 * u }, count: 1, style: 'count', calls: MIRA },
            { say: N.ready, gap: 0.6 },
            {
              pace: { inhale: u, holdIn: 4 * u, exhale: 2 * u },
              count: b,
              style: 'count',
              labels: sides,
              pan: sidePan,
              calls: holdCalls(k === 0),
              cues: [
                ...(k === 0
                  ? [{ breath: 2, phase: 'top', say: N.holdSoft }, { breath: 4, phase: 'top', say: N.exhaleCheck }, { breath: 6, phase: 'top', say: N.holds }]
                  : []),
                ...(k === (steps.length === 1 ? 0 : 1) ? [{ breath: steps.length === 1 ? 8 : 2, phase: 'top', say: N.arm }] : []),
                ...(k === (steps.length === 1 ? 0 : 1) ? [{ breath: steps.length === 1 ? 16 : 5, phase: 'top', say: N.longerCheck }] : []),
                ...(k === 1 || steps.length === 1 ? [{ breath: steps.length === 1 ? 10 : 8, phase: 'top', say: N.creep }, { breath: steps.length === 1 ? 12 : 10, phase: 'top', say: N.resistance }] : []),
                ...(k === 2 ? [{ breath: 4, phase: 'top', say: N.deepestCheck }] : []),
                ...(k === steps.length - 1 ? [{ breath: b - 1, phase: 'top', say: N.lastExhale }] : []),
                { breath: b - 2, phase: 'top', say: N.last },
              ],
            },
          ],
        },
      ]),
      {
        id: 'calm-an',
        title: 'Release',
        what: 'Both nostrils, quiet',
        color: '#b9b0e6',
        steps: [{ say: N.release, bell: 'bell' }, { rest: 60, label: 'Your own pace' }, { say: N.close, bell: 'low' }, { rest: 4 }],
      },
    ];
  },
  learn: `
<p>Nadi shodhana, alternate nostril breathing, with a hold at the top of every breath. Traditional teaching gives a ratio of 1 : 4 : 2: in for one count, hold for four, out for two.</p>
<h3>The technique</h3>
<ul>
  <li>Right hand up, index and middle fingers folded. The thumb closes the right nostril, the ring finger the left.</li>
  <li>In through the left, close both and hold, out through the right. In through the right, close both and hold, out through the left. That's one round.</li>
  <li>Holds stay soft: face and throat relaxed, fingers light. If a hold is too long, release both nostrils and breathe normally. Rejoin on a left-side inhale when ready. Support the right elbow with the left hand if needed.</li>
  <li>A rushed exhale is a reason to sit out a round on ordinary breathing. If one side stays blocked, keep the hand down and follow the calls through both sides without forcing air.</li>
  <li>With headphones, the breath sound follows the open side.</li>
</ul>
<h3>Why it works, and how well</h3>
<ul>
  <li>The held cycles here take 21–35 seconds per breath. Slow breathing increases the heart-rate changes linked to breathing, with most research using about six breaths a minute ${ev.solid}. The added holds and nostril pattern are less well studied.</li>
  <li>Small studies found alternate nostril breathing lowered blood pressure and raised heart-rate variability for a while, mostly without a comparison group ${ev.some}.</li>
  <li>The nasal cycle naturally changes which side passes more air, through swelling and shrinking of the nasal lining. The aim here is to follow the switches without forcing equal airflow.</li>
</ul>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Zaccaro et al. 2018, <a href="https://doi.org/10.3389/fnhum.2018.00353" target="_blank" rel="noopener">systematic review on slow breathing</a>, Front Hum Neurosci.</li>
  <li>Kahana-Zweig et al. 2016, <a href="https://doi.org/10.1371/journal.pone.0162918" target="_blank" rel="noopener">Measuring and Characterizing the Human Nasal Cycle</a>, PLOS One.</li>
  <li>Ghiya 2017, <a href="https://pubmed.ncbi.nlm.nih.gov/?term=alternate+nostril+breathing+blood+pressure+heart+rate+variability" target="_blank" rel="noopener">alternate nostril breathing, blood pressure and HRV (PubMed search)</a>.</li>
  <li><a href="https://www.institutokamala.com.br/en/biblioteca/gheranda-samhita" target="_blank" rel="noopener">Gheranda Samhita, fifth teaching</a>: the traditional 1 : 4 : 2 ratio.</li>
</ul>`,
};

// ── Window Seat ────────────────────────────────────────
// Quiet seated breathing for travel discomfort. Optional pauses are breath-awareness work,
// not a headache treatment. Plane pauses stay short because cabin pressure reduces oxygen
// availability; Train also covers seated practice on the ground.
const W = {
  welcome: line('ws_welcome_r2', "Sit back with your head supported if possible, and your feet on the floor. If you have water within reach, take a sip. If the window is bright, lower the shade or turn away before settling."),
  urgent: line('ws_urgent', 'If the headache is sudden and severe, or comes with weakness, confusion, trouble speaking, or vision loss, stop and get help now. On a plane, tell the crew.'),
  descent: line('ws_descent', 'During descent on a plane, skip any holds. Swallow whenever you need to; it helps your ears adjust to the pressure change.'),
  descentNoHolds: line('ws_descent_no_holds_r2', 'If your plane is descending, swallow whenever you need to. It helps your ears adjust to the pressure change.'),
  dry: lesson('ws_cabin_dry_r2', 'If you are flying, cabin humidity is often just ten to twenty percent, which can dry your eyes and nose. Aim a face-level vent away if you can.'),
  cabin: lesson('ws_cabin_altitude_r2', 'Cabin pressure often matches six to eight thousand feet. The oxygen percentage is unchanged, but lower pressure means less oxygen in each breath.'),
  silent: line('ws_silent_r2', "Now lower or close your eyes if comfortable. Keep the breathing quiet, through your nose if clear. If it's blocked, use your mouth without forcing it."),
  jaw: line('ws_jaw', "Keep your teeth apart and your tongue resting comfortably. Let your lips touch lightly if you're breathing through your nose.", 'technique'),
  brow: line('ws_brow', 'Let your forehead go smooth. Soften around your eyes, and across your scalp.', 'technique'),
  shoulders: line('ws_shoulders', "As you breathe out, let your shoulders rest instead of holding them up.", 'technique'),
  neck: line('ws_neck', "If it's comfortable, let the back of your neck get long, with your chin tipped down a little.", 'technique'),
  faceWhy: lesson('ws_face_why_r2', "A headache can come with extra jaw and neck tension. We'll let those muscles rest first."),
  slow: line('ws_slow_r2', 'In for four, out for six, for about six minutes. Let each breath be a little fuller than usual, without filling to the top.', 'technique'),
  small: line('ws_breath_size_r2', "Use enough air to last comfortably through the exhale.", 'technique'),
  airflow: line('ws_airflow_r2', "If you're empty early, slow the next exhale.", 'technique'),
  pulse: lesson('ws_pulse_r2', "Your heart rate usually rises as you breathe in and falls as you breathe out, in time with the breathing."),
  twoMin: say('About two minutes to go.'),
  pauseIntro: line('ws_pause_intro_r2', "Next are five optional pauses after breathing in, to notice when your breath needs to resume. End each at the first clear urge; the time is a ceiling. Keep your throat loose without straining."),
  trainSafety: line('ws_train_safety_r2', 'Stay seated for these longer pauses, and never practise them in water.'),
  skip: line('ws_skip_r2', "Holding raises carbon dioxide, which widens blood vessels in your head. If a pause increases the throbbing or pressure, breathe normally through the remaining pauses and ignore their calls. There's no need to find the phone."),
  in: say('Breathe in, about two-thirds full.'),
  out: say('Let it out slowly.'),
  long: line('ws_long_r2', 'Now stretch the breath out. In for four, out for eight.', 'technique'),
  inTrain: say('Breathe in, comfortably full. Not to the top.'),
  trainCount: say('Five pauses, with limits growing from thirty seconds to a minute.'),
  transition: line('ws_transition', 'Breathe at your own pace for twenty seconds before the next part.'),
  lead: line('ws_lead_r2', 'First, one easy breath in with me and an easy breath out. The breath in after that starts the first pause.'),
  longRest: line('ws_long_rest', 'Let the counts go for a bit and breathe normally before we finish.'),
  sounds: tip('ws_t_sounds2', 'Notice the sounds without interrupting your breathing.'),
  shouldersAgain: tip('ws_t_shoulders2', "Rest against the seat as you exhale."),
  anchor: tip('ws_t_anchor2', 'Notice the air without deepening your breath.'),
  wander: tip('ws_t_wander2', 'If you lose track, follow this exhale.'),
  hSway: tip('ws_h_sway', "If the seat is moving, let the support behind you take some of the work of steadying your head."),
  hBrow: line('ws_urge_location_r2', "If you're still holding, notice whether the urge starts in your throat, chest, or belly. When it arrives, let go.", 'guide'),
  hLast: line('ws_h_last_r2', "This is the last pause.", 'guide'),
  longWhy: line('ws_long_why_r2', "Your lungs recoil on their own; let air leave without pushing.", 'technique'),
  longCheck: line('ws_long_check_r2', "Keep the airflow even throughout this longer exhale.", 'technique'),
  release: line('ws_release_r2', "Return to four in, six out. If you like, try a small head tilt to each side and return to center after each. Skip the movements if they hurt, or keep your head supported and still."),
  tiltR: line('ws_tilt_r2', "Tilt a little toward your right shoulder.", 'count'),
  tiltL: say('Tilt a little toward your left shoulder.'),
  reset: say('Bring your head back to the center.'),
  centre: say('Return to center and rest your neck.'),
  checkin: line('ws_checkin_r2', "Let the counts go and breathe at your own pace. Notice how your head and jaw feel now."),
  close: line('ws_close', "If your eyes were closed, open them slowly. If the headache persists or gets worse, tell the crew or seek medical advice when you can."),
};
const WS_BREAKS = [
  line('ws_break_1', 'Breathe at your own pace before the second pause.'),
  line('ws_break_2', 'Let your breathing settle on its own rhythm now.'),
  line('ws_break_3', 'No counts here. Take a few ordinary breaths.'),
  line('ws_break_4', 'Breathe normally for a bit before the last pause.'),
  line('ws_break_5', 'The pauses are done. Rest on your own breathing.'),
];

function seatPauses(opts) {
  const settle = { rest: 20, label: 'Your own pace', cues: [{ at: 0.5, say: W.transition }, { at: 8, say: W.pulse }] };
  if (opts.noHolds) {
    return {
      id: 'seat-holds',
      title: 'Long exhale',
      what: '4 in · 8 out, no pauses',
      color: '#6f7fc7',
      steps: [settle, { say: W.long, bell: 'bell', gap: 0.6 }, { pace: { inhale: 4, exhale: 8 }, count: 20, style: 'count', calls: MIRA, cues: [{ breath: 3, phase: 'out', say: W.longWhy }, { breath: 11, phase: 'out', say: W.longCheck }] }],
    };
  }
  // Plane: five 15 s ceilings on two-thirds-full lungs; shorter is not a safety guarantee.
  // Train: five pauses growing from 30 s to a minute, comfortably full.
  const plane = opts.gentle;
  const holds = plane ? Array(5).fill(15) : [30, 40, 50, 60, 60];
  const scan = [null, null, W.hSway, W.hBrow, W.hLast];
  return {
    id: 'seat-holds',
    title: plane ? 'Soft pauses' : 'Long pauses',
    what: plane ? `5 pauses of up to ${holds[0]} s, two-thirds full` : '5 pauses, 0:30 → 1:00, comfortably full',
    color: '#6f7fc7',
    steps: [
      settle,
      ...(plane ? [{ say: W.cabin }] : [{ say: W.trainSafety }]),
      { say: W.pauseIntro, bell: 'bell' },
      { say: W.skip },
      { say: plane ? say(`${cap(num(5))} pauses of up to ${dur(holds[0])}.`) : W.trainCount, gap: 0.6 },
      { say: W.lead },
      { pace: { inhale: 4, exhale: 6 }, count: 1, style: 'count', calls: MIRA },
      ...holds.flatMap((h, i) => [
        { pace: { inhale: plane ? 4 : 5.5 }, count: 1, style: 'slow', group: `p${i}`, bell: i ? 'low' : undefined, calls: () => plane ? W.in : W.inTrain },
        {
          hold: 'full',
          seconds: h,
          label: plane ? 'Soft pause' : 'Pause',
          record: true,
          tick: false,
          group: `p${i}`,
          cues: [{ at: 0.3, say: say(`Pause for up to ${dur(h)}. Keep your throat soft.`) }, ...(!plane && scan[i] ? [{ at: 10, say: scan[i] }] : []), ...(plane && i === 4 ? [{ at: 7, say: W.hLast }] : [])],
        },
        { pace: { exhale: 6 }, count: 1, style: 'slow', group: `p${i}`, calls: () => W.out },
        { rest: plane ? 24 : 34, label: 'Your own pace', cues: [{ at: 0.5, say: WS_BREAKS[i] }] },
      ]),
    ],
  };
}

export const windowSeat = {
  id: 'window-seat',
  title: 'Window Seat',
  titleHtml: 'Window <em>seat</em>',
  tag: 'On the move',
  moment: 'move',
  voice: 'mira',
  blurb: 'Quiet, seated breathing when travelling with a headache.',
  lede: "For a headache when you're stuck in a seat. Rest the face and neck, then follow quiet, slow breaths. Optional pauses let you notice the urge to breathe; choose No pauses during descent or if holding worsens the headache.",
  music: ['transit', 'tide'],
  accent: ['#d8e1ff', '#5f74b8'],
  sky: 'seat',
  intensity: ['none', 'gentle', 'standard'],
  levelNames: { none: 'No pauses', gentle: 'Plane', standard: 'Train' },
  defaultLevel: 'gentle',
  intensityNotes: {
    none: 'No pauses: a long out-breath instead. Best if your headache throbs, or during descent.',
    gentle: 'Plane: five soft pauses of up to 15 s. Lower cabin pressure reduces available oxygen, so pauses stay short.',
    standard: 'Train or ground: five pauses that grow from 30 s to a full minute, on comfortably full lungs.',
  },
  after: [
    "Keep water within reach. If you're flying, cabin air is especially dry.",
    'Get help at once (tell the crew on a plane) for a sudden, severe "worst ever" headache, or one with weakness, confusion, trouble speaking, vision loss, or fever with a stiff neck.',
    'Pressure changes during descent can cause pain around the forehead or an eye. Tell the crew about severe or unfamiliar pain rather than assuming the cause.',
  ],
  sections: (opts) => [
    {
      id: 'seat-settle',
      title: 'Settle',
      what: 'Headrest, feet flat, a sip of water',
      color: '#a9b8ec',
      steps: [{ say: W.welcome, bell: 'low', lead: 2 }, { say: W.dry }, { rest: 8 }, { say: W.urgent }, { say: W.silent }, { say: opts.noHolds ? W.descentNoHolds : W.descent }, { rest: 6 }],
    },
    {
      id: 'seat-soften',
      title: 'Soften',
      what: 'Jaw, brow, shoulders, neck',
      color: '#93a5e4',
      steps: [{ say: W.faceWhy }, { say: W.jaw }, { rest: 12 }, { say: W.brow }, { rest: 12 }, { say: W.shoulders }, { rest: 16 }, { say: W.neck }, { rest: 10 }],
    },
    {
      id: 'seat-slow',
      title: 'Slow breathing',
      what: '4 in · 6 out, about six minutes',
      color: '#7f91d8',
      steps: [
        { say: W.slow, bell: 'bell', gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 6 },
          count: 35,
          style: 'count',
          calls: MIRA,
          cues: [
            { breath: 2, phase: 'out', say: W.small },
            { breath: 6, phase: 'out', say: W.airflow },
            { breath: 9, phase: 'out', say: W.anchor },
            { breath: 15, phase: 'out', say: W.wander },
            { breath: 21, phase: 'out', say: W.sounds },
            { breath: 23, phase: 'out', say: W.twoMin },
            { breath: 28, phase: 'out', say: W.shouldersAgain },
          ],
        },
      ],
    },
    seatPauses(opts),
    {
      id: 'seat-release',
      title: 'Release',
      what: 'Slow breathing, gentle neck tilts',
      color: '#9a8fd6',
      steps: [
        ...(opts.noHolds ? [{ rest: 20, label: 'Your own pace', cues: [{ at: 0.5, say: W.longRest }] }] : []),
        { say: W.release, bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 6 }, count: 12, style: 'count', calls: MIRA, cues: [{ breath: 2, phase: 'out', say: W.tiltR }, { breath: 3, phase: 'out', say: W.reset }, { breath: 6, phase: 'out', say: W.tiltL }, { breath: 7, phase: 'out', say: W.centre }] },
      ],
    },
    {
      id: 'seat-close',
      title: 'Close',
      what: 'Check in, water',
      color: '#7cc7c4',
      steps: [{ say: W.checkin, lead: 1 }, { rest: 25 }, { say: W.close, bell: 'low' }, { rest: 5 }],
    },
  ],
  learn: `
<p>A seated practice for a headache while travelling: relax the face and shoulders, breathe slowly with a long out-breath, and (optionally) a few soft pauses. It's comfort and settling, not treatment. Keep taking your usual medication as you normally would.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Soften:</strong> teeth apart, tongue resting; lips together only for nasal breathing. Let the brow, eyes, scalp and shoulders rest.</li>
  <li><strong>Slow breathing:</strong> 4 in, 6 out, quiet and a little fuller than usual, without filling to the top. Use the nose if clear, or the mouth if blocked. Spread the air over the whole exhale rather than pushing it out early.</li>
  <li><strong>Pauses:</strong> optional practice noticing the urge to resume breathing. Breathe in, then pause with a relaxed throat (never bearing down), and end at the first clear urge. Plane: two-thirds full, up to 15 s. Train or ground: comfortably full, with ceilings growing from 30 s to a minute. No empty-lung holds. If pressure or throbbing increases, breathe normally through the remaining pause slots, ignoring their calls; there is no need to find the phone. During a pause, <em>Breathe now</em> skips to the own-pace rest.</li>
</ul>
<h3>Why the pauses stay soft, and why no fast breathing</h3>
<ul>
  <li>Raised CO₂ widens the brain's blood vessels; headache from high CO₂ is a recognised diagnosis, and breath-holding divers get it ${ev.solid}. Pauses raise CO₂ a little, which might worsen a throbbing headache, so skip them if it does ${ev.spec}.</li>
  <li>Straining against a closed throat (Valsalva) is a known headache trigger, so pauses stay soft ${ev.solid}.</li>
  <li>Cabins are pressurised to about 1,800–2,400 m; oxygen saturation drops by around four points ${ev.solid}. Oxygen starts from a lower level there; this is why the Plane setting is shorter. A short pause is not a guarantee of safety.</li>
  <li>Over-breathing causes light-headedness and tingling that can feel like a migraine aura; it's simply avoided here ${ev.some}.</li>
</ul>
<h3>Does it help?</h3>
<ul>
  <li>For <strong>preventing</strong> migraine and tension-type headache, relaxation training and biofeedback are well supported, with moderate effects ${ev.solid}.</li>
  <li>A lab study found that paced breathing reduced experimental heat pain, with longer exhales helping most ${ev.some}. That does not establish headache relief, and these optional pauses have no established headache benefit.</li>
  <li><strong>Travel comfort:</strong> cabin humidity is often 10–20%, which can dry the eyes and nose. During descent, swallowing helps equalize middle-ear pressure; breath holds are not a pressure-equalization technique.</li>
</ul>
<h3>Get help at once</h3>
<p>Tell the crew or call for help for a sudden severe headache that peaks within a minute, the worst headache of your life, or a headache with weakness, trouble speaking, vision loss, confusion, fever with a stiff neck, or after a head injury. Pressure changes during descent can cause forehead or eye pain, but severe or unfamiliar pain still needs assessment; do not assume its cause from the timing alone.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Silberstein 2000 (US Headache Consortium), summarised in <a href="https://www.aafp.org/afp/2000/1115/p2359" target="_blank" rel="noopener">Am Fam Physician</a>; Nestoriuc &amp; Martin 2007, <a href="https://pubmed.ncbi.nlm.nih.gov/17084028" target="_blank" rel="noopener">biofeedback for migraine</a>, Pain; Bendtsen et al. 2010, <a href="https://pubmed.ncbi.nlm.nih.gov/20482606" target="_blank" rel="noopener">EFNS guideline</a>.</li>
  <li>Jafari et al. 2020, <a href="https://cris.maastrichtuniversity.nl/en/publications/can-slow-deep-breathing-reduce-pain-an-experimental-study-explori/" target="_blank" rel="noopener">Can slow deep breathing reduce pain?</a>, J Pain.</li>
  <li>ICHD-3 <a href="https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-3-diving-headache/" target="_blank" rel="noopener">10.1.3 diving headache</a> and <a href="https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-2-headache-attributed-to-aeroplane-travel/" target="_blank" rel="noopener">10.1.2 headache attributed to aeroplane travel</a>.</li>
  <li>Hampson et al. 2013, <a href="https://asma.kglmeridian.com/view/journals/asem/84/1/article-p27.xml" target="_blank" rel="noopener">cabin pressure altitudes</a>; Muhm et al. 2007, <a href="https://www.nejm.org/doi/full/10.1056/NEJMoa062770" target="_blank" rel="noopener">effect of aircraft-cabin altitude</a>, NEJM.</li>
  <li>CDC Yellow Book, <a href="https://www.cdc.gov/yellow-book/hcp/travel-air-sea/air-travel.html" target="_blank" rel="noopener">Air Travel</a>: cabin pressure, humidity and ear pressure.</li>
  <li>Do et al. 2019, <a href="https://doi.org/10.1212/WNL.0000000000006697" target="_blank" rel="noopener">SNNOOP10 headache red flags</a>, Neurology.</li>
</ul>`,
};
