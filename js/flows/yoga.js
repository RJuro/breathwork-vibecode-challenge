// Flow: fifteen minutes of yoga by ear, with Leo. Built on the practitioner model in js/yoga.js:
// every move is checked against the body state, cues name the side from that state, and the left
// side is the right side mirrored. The rounds build the way a lot of modern vinyasa classes do:
// the same short chain each round, sides alternating, one new piece added per round.
// No music: breath and voice only.

import { line, tip, ev } from './lib.js';
import { build, move, hold, talk, bothSides } from '../yoga.js';

const science = (id, text) => line(id, text, 'science');
// Leo's voice here borrows the register of good vinyasa teachers (breath first, short actions, an
// aside now and then, a joke at his own expense) without borrowing anyone's lines.
const Y = {
  welcome: line('yg_welcome3', "Hey. This one's a short flow, about fifteen minutes. Grab a block or a cushion if you have one, and sit at the back of your mat."),
  plan: line('yg_plan2', "We'll wake up the spine, then build one flow, a piece at a time. Right side, then left, every round. Then hips, a twist, and rest."),
  byEar: line('yg_by_ear2', "You can put the phone down. I'll call every move, and which side. If my pace doesn't match your breath, go with your breath. I won't mind."),
  dogPedal: line('yg_dog_pedal2', 'Take a few breaths here. Pedal it out, one knee, then the other. No rush.', 'technique'),
  dogHands: tip('yg_dog_hands2', "Spread your fingers wide and keep the whole palm on the mat, so you're not tipping onto the outer edge of your hands."),
  dogSerratus: science('yg_dog_serratus2', 'Pushing the floor away recruits serratus anterior, among others. It holds your shoulder blades against your ribs, and you want it in every plank today.'),
  r1: line('yg_r1b', 'Round one is simple: into a lunge, and back. Right side first.'),
  lungeShape: line('yg_lunge_shape2', 'Back heel reaches back, back knee lifts. Front knee right over your ankle.', 'technique'),
  lungeRibs: tip('yg_lunge_ribs2', "Reach up without flaring the ribs. I think of zipping up a jacket."),
  r2: line('yg_r2b', "Round two. Same start, then warrior two. I'll call the feet as we go."),
  w2Knee: line('yg_w2_knee2', 'Front knee tracks over your middle toes. Shoulders stay right above your hips.', 'technique'),
  w2Burn: tip('yg_w2_burn', 'Thighs talking to you yet? Mine usually start about now.'),
  w2Name: science('yg_w2_name', 'The warriors are named for Virabhadra, a fierce warrior in a story about Shiva. Some teachers read warrior one, two and three as his fight, in order.'),
  r3: line('yg_r3c', 'Last round, and half moon joins in. Keep your block close.'),
  hmStack: line('yg_hm_stack2', 'Let the top hip open, flex the lifted foot, and keep your gaze down.', 'technique'),
  hmWobble: tip('yg_hm_wobble', "Wobbling is fine. Your standing foot is making lots of small corrections, and that's the training."),
  hmBalance: science('yg_hm_balance2', 'Balance runs on your eyes, your inner ear, and your sense of where your body is. A steady spot on the floor helps; look up, and you change that reference.'),
  hips: line('yg_hips2', 'Hips next. Pigeon, both sides. If your front knee complains at any point, come out.'),
  pigeonSet: line('yg_pigeon_set2', 'Back leg long, top of the foot down. A cushion under your front hip if it floats.', 'technique'),
  pigeonSquare: tip('yg_pigeon_square2', 'Let your hips face forward without forcing them. Support the front hip if that helps.'),
  pigeonPrep: science('yg_pigeon_prep2', 'Technically this is the prep. Full pigeon, eka pada rajakapotasana, adds a deep backbend, with the back foot reaching for your head.'),
  pigeonStretch: science('yg_pigeon_stretch2', 'A stretch can give you a little more range for now. Regular practice builds that range over time, partly by changing how much stretch you tolerate.'),
  pigeonRotators: science('yg_pigeon_rotators2', "Piriformis gets all the credit, but several muscles share the work around your hip. Your hip angle changes how they're loaded."),
  pigeonBelly: tip('yg_pigeon_belly', 'Let your belly soften on each breath out.'),
  childKnees: tip('yg_child_knees2', 'Knees wide or together, whichever lets your hips settle.'),
  childHistory: science('yg_child_history2', 'Exercise versions of sun salutations were promoted in the 1920s and thirties. The sun worship is far older, and the flowing sequences we do today have changed since.'),
  backRock: tip('yg_back_rock', 'Rock a little side to side if your lower back likes it.'),
  restText: science('yg_rest_text2', "Savasana's coming up. It's one of only about fifteen poses in the Hatha Yoga Pradipika, a fifteenth-century text, and most of the others are seated."),
  twistShoulder: line('yg_twist_shoulder2', 'Let the opposite shoulder settle. If it lifts, keep your knees a little higher. Turn your head only if your neck likes it.', 'technique'),
  twistLiver: science('yg_twist_liver2', "Twists rotate your spine. They don't wring toxins out of your liver; your liver handles that with enzymes, no squeezing required."),
  twistRibs: tip('yg_twist_ribs', 'Let the breath widen the ribs on the open side.'),
  rest: line('yg_rest2', 'Let go of the breath count. Just breathe.'),
  close: line('yg_close2', "That's the flow. Roll onto your side when you're ready, and take your time sitting up. Nice work today."),
};

const at = (say, pose) => ({ say, pose });
const PROGRAM = [
  {
    id: 'yoga-arrive', title: 'Arrive', what: 'Seated, a few breaths', color: '#c7b8e8',
    steps: [talk(Y.welcome), talk(Y.plan), move('tall'), move('settle'), talk(Y.byEar)],
  },
  {
    id: 'yoga-warm', title: 'Warm up', what: 'Cat, cow, downward dog', color: '#a99ee0',
    steps: [
      move('toTable'), move('cow'), move('cat'), move('cow'), move('cat'), move('cow'), move('toDog'),
      hold(20, [at(Y.dogPedal, 'Downward dog'), at(Y.dogHands, 'Downward dog'), at(Y.dogSerratus, 'Downward dog')]),
    ],
  },
  {
    id: 'yoga-r1', title: 'Round one', what: 'Lunge, each side', color: '#8f84d6',
    steps: [
      talk(Y.r1),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('rise', x),
        hold(10, [at(n ? Y.lungeRibs : Y.lungeShape, 'High lunge')]),
        move('handsDown', x), move('stepBack', x), move('plankToDog'),
      ]),
    ],
  },
  {
    id: 'yoga-r2', title: 'Round two', what: '+ warrior 2, reverse warrior', color: '#7d70c4',
    steps: [
      talk(Y.r2),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('rise', x), move('warrior2', x),
        hold(16, n ? [at(Y.w2Burn, 'Warrior 2'), at(Y.w2Name, 'Warrior 2')] : [at(Y.w2Knee, 'Warrior 2')]),
        move('reverse', x), move('handsDown', x), move('stepBack', x), move('lower'), move('cobra'), move('backToDog'),
      ]),
    ],
  },
  {
    id: 'yoga-r3', title: 'Round three', what: '+ half moon', color: '#6b5fb4',
    steps: [
      talk(Y.r3),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('rise', x), move('warrior2', x), move('reverse', x),
        move('moonPrep', x), move('halfMoon', x),
        hold(18, n ? [at(Y.hmBalance, 'Half moon')] : [at(Y.hmStack, 'Half moon'), at(Y.hmWobble, 'Half moon')]),
        move('landLunge', x), move('stepBack', x), move('lower'), move('cobra'), move('backToDog'),
      ]),
    ],
  },
  {
    id: 'yoga-hips', title: 'Hips', what: 'Pigeon, each side', color: '#5b4f9e',
    steps: [
      talk(Y.hips),
      ...bothSides((x, n) => [
        move('lift', x), move('pigeon', x),
        hold(10, [at(n ? Y.pigeonSquare : Y.pigeonSet, 'Pigeon')]),
        move('fold'),
        hold(20, n ? [at(Y.pigeonRotators, 'Pigeon, folded'), at(Y.pigeonBelly, 'Pigeon, folded')] : [at(Y.pigeonPrep, 'Pigeon, folded'), at(Y.pigeonStretch, 'Pigeon, folded')]),
        move('pigeonUp'), move('pigeonBack', x),
      ]),
    ],
  },
  {
    id: 'yoga-close', title: 'Twist and rest', what: "Child's pose, a twist, savasana", color: '#463c80',
    steps: [
      hold(6),
      move('child'),
      hold(14, [at(Y.childKnees, "Child's pose"), at(Y.childHistory, "Child's pose")]),
      move('onBack'),
      hold(10, [at(Y.backRock, 'Knees to chest'), at(Y.restText, 'Knees to chest')]),
      ...bothSides((x, n) => [move('twist', x), hold(16, n ? [at(Y.twistRibs, 'Twist')] : [at(Y.twistShoulder, 'Twist'), at(Y.twistLiver, 'Twist')]), move('center')]),
      move('savasana'),
      hold(90, [at(Y.rest, 'Savasana')]),
      talk(Y.close),
    ],
  },
];


// ── Heat ───────────────────────────────────────────────
// A warming flow in the spirit of the strength-and-transition teachers: crossunders for the core,
// step-in salutations through a squat and a chair (a twist from round two, a countdown hold), then
// one standing chain that adds a piece per round (knee taps; warrior three into half moon with a
// squeeze; side plank flipped into wild thing), crow or a squat, and half splits and lizard to cool
// the legs before bridge, a twist and rest.
const H = {
  welcome: line('ht_welcome', "Hey. This one builds heat as it goes, and it's a little longer. Start seated at the back of your mat, block nearby if you have one."),
  plan: line('ht_plan', 'Core first, then salutations through a squat. Then knee taps, a balance, and a side plank that turns into wild thing. We slow it all down at the end.'),
  dogPedal: line('ht_dog_pedal', 'Pedal your feet a few times. Let the backs of the legs wake up.', 'technique'),
  crossIntro: line('ht_cross_intro', 'Core time. Knee across toward the opposite elbow, then back to dog. Right side first.'),
  crossShoulders: tip('ht_cross_shoulders', 'When the knee comes in, keep your shoulders over your wrists. Round your upper back a little and push the floor away.'),
  childReset: line('ht_child_reset', "Child's pose for a few breaths. Your wrists get a break, and so do you."),
  saluteIntro: line('ht_salute_intro', 'Now a few salutations, a little different from the usual. We step into a squat first.'),
  chairLow: line('ht_chair_low', "Sit back like the chair's a little farther away. Whole foot grounded. Only as low as you can still breathe.", 'technique'),
  chairName: science('ht_chair_name', 'Utkatasana usually gets translated as fierce pose. Some schools just call it awkward pose, which is also fair.'),
  twistIntro: line('ht_twist_intro', 'This round, a twist in the chair, both ways.'),
  standIntro: line('ht_stand_intro', 'Standing work. Three rounds, each with its own thing. Right side, then left.'),
  tapChest: tip('ht_tap_chest', 'Chest stays lifted while both knees bend and your hips lower. A light touch with the back knee, or a hover.'),
  tapWhy: tip('ht_tap_why', 'Those taps work like a small split squat. Both legs do the work; the front thigh just complains first.'),
  r2: line('ht_r2', 'Round two. From the lunge, we lean out into warrior three and open up to half moon.'),
  hmSet: line('ht_hm_set', 'Fingertips on the floor or a block. Let the top hip open, flex the lifted foot, gaze down.', 'technique'),
  hmWobble: tip('ht_hm_wobble', 'A little wobble is fine. I keep my gaze down here; it gives me one less thing to manage.'),
  hmBalance: science('yg_hm_balance2', 'Balance runs on your eyes, your inner ear, and your sense of where your body is. A steady spot on the floor helps; look up, and you change that reference.'),
  r3: line('ht_r3', "Last round: side plank, then wild thing if it's familiar. Side plank or child's pose are good options too. We'll take our time."),
  wildHow: line('ht_wild_how', 'Press through your supporting hand and both feet. Lift your chest as the top arm reaches. No need for a bigger backbend.', 'technique'),
  wildName: science('ht_wild_name', 'Wild thing caught on through Anusara yoga, so it is a modern pose. Its Sanskrit name, camatkarasana, comes from camatkara: astonishment, or wonder.'),
  crowIntro: line('ht_crow_intro', "Time to play a little. Wrists rest first, in child's pose. Then a squat, with crow if you want it."),
  crowSet: line('ht_crow_set', 'For crow, bring your feet a little closer. Hands shoulder-width, hips up, elbows bent, knees high on your upper arms.', 'technique'),
  crowLean: line('ht_crow_lean', "Look just ahead of your hands. Lean until one foot gets light, maybe both. I'd rather you place them down than hop.", 'technique'),
  crowName: science('ht_crow_name', 'Baka means crane, kaka means crow. A lot of teachers call the straight-arm version crane and the bent-arm one crow, but the names get mixed up.'),
  hipsIntro: line('ht_hips_intro', "Okay. Let's take the heat out of the legs. Lizard, each side."),
  lizardHow: line('ht_lizard_how', 'Back knee stays down. Hands inside your front foot, or on blocks. Forearms only if your hips settle there without strain.', 'technique'),
  lizardPress: tip('ht_lizard_press', 'Try a gentle press of the front foot into the floor for three seconds. Let go, take a breath, and see if the stretch eases.'),
  lizardSink: tip('ht_lizard_sink', 'Let your hips lower a little, ribs easy. Stop before your lower back takes over.'),
  twist: line('ht_twist', 'Knees rest together, supported if you need it. Keep the opposite shoulder easy; a smaller twist is fine.', 'technique'),
  twistLiver: science('yg_twist_liver2', "Twists rotate your spine. They don't wring toxins out of your liver; your liver handles that with enzymes, no squeezing required."),
  rest: line('ht_rest', "Let the heat settle. There's nothing to do now."),
  close: line('ht_close', "That's it. Take your time coming up, and drink some water. Nice work today."),
};

const HEAT = [
  {
    id: 'heat-arrive', title: 'Arrive', what: 'Seated, a couple of breaths', color: '#f2b38a',
    steps: [talk(H.welcome), talk(H.plan), move('tall'), move('settle'), talk(Y.byEar)],
  },
  {
    id: 'heat-core', title: 'Core', what: 'All fours, crossunders', color: '#ee9a72',
    steps: [
      move('toTable'), move('cow'), move('cat'), move('cow'), move('cat'), move('scapSink'), move('scapPush'), move('scapSink'), move('toDog'),
      hold(12, [at(H.dogPedal, 'Downward dog'), at(H.crossShoulders, 'Downward dog')]),
      talk(H.crossIntro),
      move('crossUnder', 'R'), move('crossBack', 'R'), move('crossUnder', 'L'), move('crossBack', 'L'),
      move('crossUnder', 'R'), move('crossBack', 'R'), move('crossUnder', 'L'), move('crossBack', 'L'),
      move('child'),
      hold(12, [at(H.childReset, "Child's pose")]),
      move('childToDog'),
    ],
  },
  {
    id: 'heat-salute', title: 'Salutations', what: 'Squat, chair; then a chair twist', color: '#e8845e',
    steps: [
      talk(H.saluteIntro),
      move('dogHeels'), move('toSquat'), move('squatHeart'), move('squatFold'), move('riseUp'), move('chair'),
      hold(16, [at(H.chairLow, 'Chair'), at(H.chairName, 'Chair')], { countdown: true }),
      move('foldDown'), move('halfLift'), move('jumpBack'), move('upDog'), move('backToDog'),
      talk(H.twistIntro),
      move('dogHeels'), move('toSquat'), move('squatHeart'), move('squatFold'), move('riseUp'), move('chair'), move('chairHeart'),
      move('chairTwist', 'R'), move('chairCenter'), move('chairTwist', 'L'), move('chairCenter'),
      move('foldDown'), move('halfLift'), move('jumpBack'), move('upDog'), move('backToDog'),
    ],
  },
  {
    id: 'heat-stand-1', title: 'Standing, round one', what: 'High lunge, knee taps', color: '#dc6f4f',
    steps: [
      talk(H.standIntro),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('rise', x),
        move('kneeTap', x), move('kneeLift', x), move('kneeTap', x), move('kneeLift', x),
        hold(10, [at(n ? H.tapWhy : H.tapChest, 'High lunge')]),
        move('handsDown', x), move('stepBack', x), move('plankToDog'),
      ]),
    ],
  },
  {
    id: 'heat-stand-2', title: 'Standing, round two', what: 'Warrior 3, half moon, a squeeze', color: '#cf5b45',
    steps: [
      talk(H.r2),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('rise', x),
        move('warrior3', x), move('openMoon', x),
        hold(14, n ? [at(H.hmWobble, 'Half moon'), at(H.hmBalance, 'Half moon')] : [at(H.hmSet, 'Half moon')]),
        move('moonSqueeze', x), move('moonKick', x),
        move('landLunge', x), move('stepBack', x), move('lower'), move('upDog'), move('backToDog'),
      ]),
    ],
  },
  {
    id: 'heat-stand-3', title: 'Standing, round three', what: 'Side plank, wild thing', color: '#bf4a3f',
    steps: [
      talk(H.r3),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('rise', x), move('handsDown', x), move('stepBack', x),
        move('sidePlank', x), move('wild', x),
        hold(12, n ? [] : [at(H.wildHow, 'Wild thing')]),
        move('wildToPlank', x), move('plankBreath'), move('plankToDog'),
      ]),
    ],
  },
  {
    id: 'heat-crow', title: 'Crow', what: 'Or a squat', color: '#a8443f',
    steps: [
      talk(H.crowIntro),
      move('child'),
      hold(16, [at(H.wildName, "Child's pose")]),
      move('childToDog'), move('toSquat'),
      hold(24, [at(H.crowSet, 'Squat'), at(H.crowLean, 'Squat'), at(H.crowName, 'Squat')]),
      move('crowLand'), move('squatToDog'),
    ],
  },
  {
    id: 'heat-hips', title: 'Cool the legs', what: 'Lizard, each side', color: '#8a4a5e',
    steps: [
      talk(H.hipsIntro),
      ...bothSides((x, n) => [
        move('lift', x), move('stepThrough', x), move('kneeDown', x), move('lizard', x),
        hold(16, n ? [at(H.lizardSink, 'Lizard')] : [at(H.lizardHow, 'Lizard'), at(H.lizardPress, 'Lizard')]),
        move('lizardBack', x),
        hold(6),
      ]),
    ],
  },
  {
    id: 'heat-close', title: 'Twist and rest', what: "Child's pose, a twist, savasana", color: '#5d4a78',
    steps: [
      move('child'),
      hold(15),
      move('onBack'),
      ...bothSides((x, n) => [move('twist', x), hold(14, n ? [] : [at(H.twist, 'Twist'), at(H.twistLiver, 'Twist')]), move('center')]),
      move('savasana'),
      hold(90, [at(H.rest, 'Savasana')]),
      talk(H.close),
    ],
  },
];

/** Every yoga program by practice id, for scripts/yoga_check.mjs. */
export const PROGRAMS = { 'flow-15': PROGRAM, heat: HEAT };

export const flow15 = {
  id: 'flow-15',
  title: 'Fifteen',
  titleHtml: '<em>Fifteen</em>',
  tag: 'Yoga',
  moment: 'flow',
  voice: 'leo',
  blurb: 'Vinyasa by ear. One chain, three rounds, a new piece each time. Every move called, and which side.',
  lede: 'Fifteen minutes of vinyasa you can do with your eyes off the screen. A warm-up, three rounds of the same short chain with a new piece each round (high lunge, warrior two, half moon), pigeon, a twist and savasana. Every move is called on the breath, with the side. Music is off unless you switch it on.',
  music: ['keys', 'current', 'mind'],
  musicDefault: false, // breath and voice only, unless switched on for this practice
  accent: ['#d9d0f5', '#5b4f9e'],
  sky: 'arrive',
  after: ['The left side always follows the right, so a round is the same chain twice.', 'If a move comes faster than your breath, pause the session and catch up.'],
  sections: (opts, durs) => build(PROGRAM, durs, opts.talk).sections,
  learn: `
<p>A short vinyasa class for people who already know the poses. One chain (three-legged dog, lunge, back to plank, cobra, downward dog) runs three rounds. Each round adds a piece: high lunge, then warrior two and reverse warrior, then half moon. Sides alternate every round. Then pigeon on both sides, a supine twist, and savasana.</p>
<h3>By ear</h3>
<ul>
  <li>Every move is called on its breath: inhale to lift and open, exhale to fold, lower and step.</li>
  <li>The side is named from a model of where your body is, so "right" is always the foot that's actually in front.</li>
  <li>The first time through a move gets the full cue; after that, the short one.</li>
</ul>
<h3>What the extra lines say, and how sure we are</h3>
<ul>
  <li>Stretching mostly raises how much stretch you tolerate; the muscle itself changes little in one session ${ev.solid}.</li>
  <li>Twists rotate the spine; the idea that they detox organs has no evidence behind it ${ev.solid}.</li>
  <li>The modern sun salutation took shape in early-twentieth-century India, mixing older practice with the physical culture of the time ${ev.some}.</li>
</ul>
<h3>Safety</h3>
<ul>
  <li>Skip or soften anything that hurts. Sharp pain, or pain in a joint rather than a muscle, means come out.</li>
  <li>Wrists: the class spends about six minutes on the hands. Knees down in plank and lowering, or forearms in downward dog, take some of that off.</li>
  <li>If you're pregnant, recovering from an injury or surgery, or have a joint or back condition, ask your doctor or physio first, and be ready to skip the half moon and the pigeon.</li>
</ul>
<p class="muted">Not medical advice. Written for people who already know these poses.</p>
<h3>Sources</h3>
<ul class="sources">
  <li>Singleton 2010, <em>Yoga Body: The Origins of Modern Posture Practice</em>, Oxford University Press.</li>
  <li>Weppler & Magnusson 2010, <a href="https://doi.org/10.2522/ptj.20090030" target="_blank" rel="noopener">Increasing muscle extensibility: a matter of increasing length or modifying sensation?</a>, Phys Ther.</li>
</ul>`,
};

export const heat = {
  id: 'heat',
  title: 'Heat',
  titleHtml: '<em>Heat</em>',
  tag: 'Yoga',
  moment: 'flow',
  voice: 'leo',
  blurb: 'A warming flow that builds. Crossunders, squat-and-chair salutations, then standing rounds with a balance and a flip into wild thing.',
  lede: 'A little over twenty minutes that get warmer as they go. Crossunders on all fours, step-in salutations through a squat and a chair (with a twist from round two), then three standing rounds, each with its own focus: knee taps; warrior three into half moon with a knee squeeze; side plank flipped into wild thing. Crow if you want it, then lizard, a twist and savasana. Every move is called on the breath, with the side.',
  music: ['building', 'keys', 'current'],
  musicDefault: false,
  accent: ['#f6d2bd', '#bf4a3f'],
  sky: 'arrive',
  after: ['Wild thing and crow are both optional: side plank and a squat are full options, not lesser ones.', 'Wrists get a lot of work here. Knees down in the lowering and forearms in dog take some of it off.'],
  sections: (opts, durs) => build(HEAT, durs, opts.talk).sections,
  learn: `
<p>A warming vinyasa for people who know the poses, built the way strength-and-transition teachers often build: the core first, salutations that open the hips on the way in, then standing rounds, each with its own focus, right side then left.</p>
<h3>The flow</h3>
<ul>
  <li><strong>Core:</strong> crossunders from downward dog, knee toward the opposite elbow.</li>
  <li><strong>Salutations:</strong> step or hop into a squat, fold, rise, chair. A held chair with a countdown in round one, a chair twist each way in round two.</li>
  <li><strong>Standing rounds:</strong> high lunge with back-knee taps; then warrior three opening to half moon, with the lifted knee drawn in and extended back; then side plank flipped into wild thing and back through plank.</li>
  <li><strong>Down:</strong> child's pose to rest the wrists, crow or a squat, lizard each side, a supine twist, savasana.</li>
</ul>
<h3>What the extra lines say, and how sure we are</h3>
<ul>
  <li>Balance draws on vision, the inner ear and body-position sense; a fixed spot on the floor helps ${ev.solid}.</li>
    <li>Briefly contracting a muscle before stretching it (contract-relax) can add a little range in the moment; whether the lizard press does that for a given muscle is less clear ${ev.some}.</li>
</ul>
<h3>Safety</h3>
<ul>
  <li>Skip or soften anything that hurts. Sharp pain, or pain in a joint rather than a muscle, means come out.</li>
  <li>Wrists: a good part of this class is on the hands. Knees down in the lowering, forearms in dog or lizard, and a squat instead of crow all take load off.</li>
  <li>If you're pregnant, recovering from an injury or surgery, or have a joint or back condition, ask your doctor or physio first, and skip wild thing, crow and the half moon.</li>
</ul>
<p class="muted">Not medical advice. Written for people who already know these poses.</p>`,
};
