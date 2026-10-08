// Window Seat: a silent, seated practice for a headache on a plane or train.
//
// Built around what the evidence supports (relaxation and slow breathing with a long
// exhale) and what it warns against: raised CO2 widens brain vessels, so long holds can
// make a throbbing headache worse, and cabin air already starts you at ~93% SpO2. So the
// "holds" are soft pauses on two-thirds-full lungs, sized by where you are: Plane up to
// 15 s, Train up to 25 s, or none at all. Nose only, no fast breathing, nothing audible.

import { line, say, tip, T, num, dur, scaled, milestones, L, SAFETY_HTML, ev } from './lib.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

const W = {
  welcome: line('ws_welcome', 'Welcome. Sit back, head against the headrest if you can, feet flat on the floor. Eyes down, or closed. If you have water, take a sip now.'),
  silent: line('ws_silent', "Everything here is silent. Nose only, small breaths. No one around you needs to know you're doing this."),
  jaw: line('ws_jaw', 'Lips together, teeth apart. Let the tongue rest on the floor of the mouth.', 'technique'),
  brow: line('ws_brow', 'Unknit the brow. Soften around the eyes, and across the scalp.', 'technique'),
  shoulders: line('ws_shoulders', 'On each breath out, let the shoulders drop a little further.', 'technique'),
  neck: line('ws_neck', 'Let the back of the neck lengthen, the chin tipping very slightly down.', 'technique'),
  faceWhy: line('ws_face_why', 'Jaw, brow and shoulders often tighten around a headache. Letting them soften may ease some of the pressure.', 'science'),
  slow: say('In for four, out for six, small and quiet. About six minutes.'),
  small: line('ws_small', 'Slower, not bigger. Over-breathing can make you light-headed.', 'technique'),
  pain: line('ws_pain', 'In lab studies, slow breathing with a longer out-breath dulled pain a little. It may take the edge off.', 'science'),
  vagal: line('ws_vagal', 'A long out-breath shifts the heart toward its calmer, vagal rhythm. The same nerve, stimulated electrically, can dampen inflammation.', 'science'),
  twoMin: say('About two minutes to go.'),
  stress: line('ws_stress', 'Stress itself raises inflammatory signals. Whether breathing reaches the immune system directly is still uncertain. Regular practice is where any benefit lies.', 'science'),
  pauseIntro: line('ws_pause_intro', 'Now a few soft pauses. Breathe in to about two-thirds full, then simply pause. Throat relaxed, nothing pushing. Let the jaw and shoulders go.', 'technique'),
  skip: line('ws_skip', 'If the throbbing grows, or your head feels fuller, skip the pauses and just lengthen the out-breath.'),
  in: say('Breathe in, about two-thirds full.'),
  pause: say('And pause. Throat soft.'),
  out: say('Let it out slowly.'),
  long: say('Instead of pausing, lengthen the out-breath. In for four, out for eight.'),
  inTrain: say('Breathe in, comfortably full. Not to the top.'),
  trainCount: say('Five pauses, growing from thirty seconds to a minute.'),
  window: tip('ws_t_window', 'If your eyes are open, let them rest on the window. Let the view pass by, without following it.'),
  sounds: tip('ws_t_sounds', 'Let the sounds around you, the engine, the voices, the rails, become part of the background. Nothing to fix.'),
  shouldersAgain: tip('ws_t_shoulders', "Check the shoulders again. They've probably crept up. Let them drop."),
  hJaw: tip('ws_h_jaw', 'Let the jaw hang soft. Teeth apart.'),
  hHands: tip('ws_h_hands', 'Let your hands grow heavy in your lap.'),
  hSway: tip('ws_h_sway', "If you're on a train, feel its sway. Let the movement rock you, rather than holding against it."),
  hBrow: tip('ws_h_brow', 'Smooth the brow. Soften behind the eyes.'),
  hLast: tip('ws_h_last', 'Last pause. Nothing to prove. Let go whenever you like.'),
  longWhy: line('ws_long_why', 'A longer out-breath gives the heart more time to slow, and the body more time to settle.', 'science'),
  release: say('Back to four in, six out.'),
  tiltR: say('Slowly let your head tip toward the right shoulder.'),
  tiltL: say('And slowly toward the left.'),
  centre: say('Back to centre.'),
  checkin: line('ws_checkin', 'Notice your head, your jaw, your shoulders. Whatever has eased, let it stay eased.'),
  close: line('ws_close', "That's your practice. Sip some water, and keep taking your usual medication as you normally would. Come back to this whenever you need it."),
};

function pauses(opts) {
  if (opts.noHolds) {
    return {
      id: 'seat-holds',
      title: 'Long exhale',
      what: '4 in · 8 out, no pauses',
      color: '#6f7fc7',
      steps: [
        { say: W.long, bell: 'bell', gap: 0.6 },
        { pace: { inhale: 4, exhale: 8 }, count: 20, style: 'count', cues: [{ breath: 3, say: W.longWhy }] },
      ],
    };
  }
  // Plane: five 15 s pauses on two-thirds-full lungs (cabin air starts you lower).
  // Train: five pauses growing from 30 s to a minute, comfortably full.
  const plane = opts.gentle;
  const holds = plane ? Array(5).fill(scaled(25, opts)) : [30, 40, 50, 60, 60];
  const scan = [W.hJaw, W.hHands, W.hSway, W.hBrow, W.hLast];
  return {
    id: 'seat-holds',
    title: plane ? 'Soft pauses' : 'Long pauses',
    what: plane ? `5 pauses of up to ${holds[0]} s, two-thirds full` : '5 pauses, 0:30 → 1:00, comfortably full',
    color: '#6f7fc7',
    steps: [
      { say: W.pauseIntro, bell: 'bell' },
      { say: W.skip },
      { say: plane ? say(`${cap(num(5))} pauses of up to ${dur(holds[0])}.`) : W.trainCount, gap: 0.6 },
      ...holds.flatMap((h, i) => [
        { pace: { inhale: 4 }, count: 1, style: 'slow', group: `p${i}`, bell: i ? 'low' : undefined, cues: [{ at: 0, say: plane ? W.in : W.inTrain }] },
        {
          hold: 'full',
          seconds: h,
          label: plane ? 'Soft pause' : 'Pause',
          record: true,
          tick: false,
          group: `p${i}`,
          cues: [
            { at: 0.3, say: say(`And pause, up to ${dur(h)}. Throat soft.`) },
            ...(plane ? [] : [{ at: 10, say: scan[i] }]),
            ...milestones(h),
            ...(h >= 40 ? [{ fromEnd: 11, say: L.tenMore }] : []),
          ],
        },
        { pace: { inhale: 4, exhale: 6 }, count: plane ? 3 : 4, style: 'count', cues: [{ at: 0, say: W.out }] },
      ]),
    ],
  };
}

export const windowSeat = {
  id: 'window-seat',
  title: 'Window Seat',
  titleHtml: 'Window <em>seat</em>',
  tag: 'On the move',
  blurb: 'Silent, seated breathing for a headache on a plane or train.',
  lede: "For a headache when you're stuck in a seat. Soften the face, slow the breath, and add a few soft pauses sized for where you are. Silent, nose-only, no fast breathing.",
  music: ['transit', 'tide'],
  accent: ['#d8e1ff', '#5f74b8'],
  sky: 'seat',
  intensity: ['none', 'gentle', 'standard'],
  levelNames: { none: 'No pauses', gentle: 'Plane', standard: 'Train' },
  defaultLevel: 'gentle',
  intensityNotes: {
    none: 'No pauses: a long out-breath instead. Best if your headache throbs, or during descent.',
    gentle: 'Plane: five soft pauses of up to 15 s. Cabin air holds less oxygen, so they stay short.',
    standard: 'Train or ground: five pauses that grow from 30 s to a full minute, on comfortably full lungs.',
  },
  after: [
    'Drink some water. Cabin air is very dry.',
    'Get help at once (tell the crew on a plane) for a sudden, severe "worst ever" headache, or one with weakness, confusion, trouble speaking, vision loss, or fever with a stiff neck.',
    'A sharp pain around one eye during landing is usually sinus pressure from the descent. It tends to pass within half an hour.',
  ],
  sections: (opts) => [
    {
      id: 'seat-settle',
      title: 'Settle',
      what: 'Headrest, feet flat, a sip of water',
      color: '#a9b8ec',
      steps: [{ say: W.welcome, bell: 'low', lead: 2 }, { rest: 8 }, { say: W.silent }, { rest: 6 }],
    },
    {
      id: 'seat-soften',
      title: 'Soften',
      what: 'Jaw, brow, shoulders, neck',
      color: '#93a5e4',
      steps: [
        { say: W.jaw },
        { rest: 12 },
        { say: W.brow },
        { rest: 12 },
        { say: W.shoulders },
        { rest: 16 },
        { say: W.neck },
        { rest: 10 },
        { say: W.faceWhy, min: 4 },
      ],
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
          cues: [
            { breath: 2, say: W.small },
            { breath: 4, say: W.window },
            { breath: 6, say: W.pain },
            { breath: 9, say: T.anchor },
            { breath: 12, say: W.vagal },
            { breath: 15, say: T.wander },
            { breath: 20, say: W.sounds },
            { breath: 28, say: W.shouldersAgain },
            { breath: 18, say: W.stress },
            { breath: 23, say: W.twoMin },
          ],
        },
      ],
    },
    pauses(opts),
    {
      id: 'seat-release',
      title: 'Release',
      what: 'Slow breathing, gentle neck tilts',
      color: '#9a8fd6',
      steps: [
        { say: W.release, bell: 'bell', gap: 0.6 },
        {
          pace: { inhale: 4, exhale: 6 },
          count: 12,
          style: 'count',
          cues: [
            { breath: 2, say: W.tiltR },
            { breath: 6, say: W.tiltL },
            { breath: 10, say: W.centre },
          ],
        },
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
<p>A seated, silent practice for a headache while travelling: relax the face and shoulders, breathe slowly with a long out-breath, and (optionally) a few soft pauses. It's comfort and settling, not treatment. Keep taking your usual medication as you normally would.</p>
<h3>The technique</h3>
<ul>
  <li><strong>Soften:</strong> lips together, teeth apart, tongue resting; brow, eyes and scalp soft; shoulders dropping on each out-breath.</li>
  <li><strong>Slow breathing:</strong> 4 in, 6 out through the nose, small and quiet. Slower, not bigger.</li>
  <li><strong>Soft pauses:</strong> breathe in to about two-thirds full, pause with a relaxed throat (never bearing down), let go at the first clear urge. Plane: up to 15 s. Train or ground: up to 25 s. No empty-lung holds.</li>
</ul>
<h3>Why no long holds, and why no fast breathing</h3>
<ul>
  <li>Raised CO₂ widens the brain's blood vessels; headache from high CO₂ is a recognised diagnosis, and breath-holding divers get it ${ev.solid}. Short pauses raise CO₂ only a little, but even that might worsen a throbbing headache, so skip them if it does ${ev.spec}.</li>
  <li>Straining against a closed throat (Valsalva) is a known headache trigger, so pauses stay soft ${ev.solid}.</li>
  <li>Cabins are pressurised to about 1,800–2,400 m; oxygen saturation drops by around four points ${ev.solid}. Holds start lower and fall faster there, which is why the Plane setting is shorter.</li>
  <li>Over-breathing causes light-headedness and tingling that can feel like a migraine aura; it's simply avoided here ${ev.some}.</li>
</ul>
<h3>Does it help?</h3>
<ul>
  <li>For <strong>preventing</strong> migraine and tension-type headache, relaxation training and biofeedback are well supported, with moderate effects ${ev.solid}.</li>
  <li>For <strong>relief during</strong> a headache, there are no controlled trials. In the lab, slow breathing with a longer exhale reduced experimental pain a little ${ev.some}.</li>
  <li><strong>Inflammation:</strong> electrical vagus-nerve stimulation reduces inflammation in rheumatoid arthritis (approved in 2025) ${ev.solid}. Whether slow breathing engages the same pathway is inferred, not shown ${ev.spec}. Small trials hint at lower inflammatory markers with weeks of daily practice ${ev.some}. One 15-minute session won't change inflammation measurably; it can lower stress, and stress raises inflammatory signals ${ev.solid}.</li>
</ul>
<h3>Get help at once</h3>
<p>Tell the crew or call for help for a sudden severe headache that peaks within a minute, the worst headache of your life, or a headache with weakness, trouble speaking, vision loss, confusion, fever with a stiff neck, or after a head injury. A severe pain around one eye during landing is usually descent-related sinus pressure and tends to pass within 30 minutes.</p>
${SAFETY_HTML}
<h3>Sources</h3>
<ul class="sources">
  <li>Silberstein 2000 (US Headache Consortium), summarised in <a href="https://www.aafp.org/afp/2000/1115/p2359" target="_blank" rel="noopener">Am Fam Physician</a>; Nestoriuc &amp; Martin 2007, <a href="https://pubmed.ncbi.nlm.nih.gov/17084028" target="_blank" rel="noopener">biofeedback for migraine</a>, Pain; Nestoriuc et al. 2008, <a href="https://pubmed.ncbi.nlm.nih.gov/18540732" target="_blank" rel="noopener">biofeedback for tension-type headache</a>; Bendtsen et al. 2010, <a href="https://pubmed.ncbi.nlm.nih.gov/20482606" target="_blank" rel="noopener">EFNS guideline</a>.</li>
  <li>Jafari et al. 2020, <a href="https://cris.maastrichtuniversity.nl/en/publications/can-slow-deep-breathing-reduce-pain-an-experimental-study-explori/" target="_blank" rel="noopener">Can slow deep breathing reduce pain?</a>, J Pain.</li>
  <li>ICHD-3 <a href="https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-3-diving-headache/" target="_blank" rel="noopener">10.1.3 diving headache</a> and <a href="https://ichd-3.org/10-headache-attributed-to-disorder-of-homoeostasis/10-1-headache-attributed-to-hypoxia-andor-hypercapnia/10-1-2-headache-attributed-to-aeroplane-travel/" target="_blank" rel="noopener">10.1.2 headache attributed to aeroplane travel</a>; Bui &amp; Gazerani 2017, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5559404" target="_blank" rel="noopener">review</a>.</li>
  <li>Hampson et al. 2013, <a href="https://asma.kglmeridian.com/view/journals/asem/84/1/article-p27.xml" target="_blank" rel="noopener">cabin pressure altitudes</a>; Muhm et al. 2007, <a href="https://www.nejm.org/doi/full/10.1056/NEJMoa062770" target="_blank" rel="noopener">effect of aircraft-cabin altitude</a>, NEJM.</li>
  <li>Koopman et al. 2016, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4961187/" target="_blank" rel="noopener">vagus nerve stimulation in rheumatoid arthritis</a>, PNAS; Balint et al. 2022, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9574246/" target="_blank" rel="noopener">slow breathing and IL-6</a>, Front Immunol; Morgan et al. 2014, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4079606/" target="_blank" rel="noopener">mind-body therapies and inflammation</a>, PLoS One; Marsland et al. 2017, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5553449" target="_blank" rel="noopener">acute stress and inflammatory markers</a>.</li>
  <li>Do et al. 2019, <a href="https://doi.org/10.1212/WNL.0000000000006697" target="_blank" rel="noopener">SNNOOP10 headache red flags</a>, Neurology.</li>
</ul>`,
};
