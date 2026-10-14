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
  welcome: line('yg_welcome2', "Hey, it's Leo. This one's a short flow, about fifteen minutes. Grab a block or a cushion if you have one, and sit at the back of your mat."),
  plan: line('yg_plan2', "We'll wake up the spine, then build one flow, a piece at a time. Right side, then left, every round. Then hips, a twist, and rest."),
  byEar: line('yg_by_ear2', "You can put the phone down. I'll call every move, and which side. If my pace doesn't match your breath, go with your breath. I won't mind."),
  dogPedal: line('yg_dog_pedal2', 'Take a few breaths here. Pedal it out, one knee, then the other. No rush.', 'technique'),
  dogHands: tip('yg_dog_hands2', "Spread your fingers wide and keep the whole palm on the mat, so you're not tipping onto the outer edge of your hands."),
  dogSerratus: science('yg_dog_serratus2', "Pushing the floor away is serratus anterior, the muscle that keeps your shoulder blades on your ribs. You'll want it in every plank today."),
  r1: line('yg_r1b', 'Round one is simple: into a lunge, and back. Right side first.'),
  lungeShape: line('yg_lunge_shape2', 'Back heel reaches back, back knee lifts. Front knee right over your ankle.', 'technique'),
  lungeRibs: tip('yg_lunge_ribs2', "Reach up without flaring the ribs. I think of zipping up a jacket."),
  r2: line('yg_r2b', 'Round two. Same way in, and we add warrior two. You know the way by now.'),
  w2Knee: line('yg_w2_knee2', 'Front knee tracks over your middle toes. Shoulders stay right above your hips.', 'technique'),
  w2Burn: tip('yg_w2_burn', 'Thighs talking to you yet? Mine usually start about now.'),
  w2Name: science('yg_w2_name', 'The warriors are named for Virabhadra, a fierce warrior in a story about Shiva. Some teachers read warrior one, two and three as his fight, in order.'),
  r3: line('yg_r3c', 'Last round, and we add half moon. This is the fun one.'),
  hmStack: line('yg_hm_stack2', 'Let the top hip open, flex the lifted foot, and keep your gaze down.', 'technique'),
  hmWobble: tip('yg_hm_wobble', "Wobbling is fine. Your standing foot is making lots of small corrections, and that's the training."),
  hmBalance: science('yg_hm_balance2', 'Balance runs on your eyes, your inner ear, and your sense of where your body is. A steady spot on the floor helps; look up, and you change that reference.'),
  hmHatha: science('yg_hm_hatha', 'Hatha is often explained as sun and moon, ha and tha. The word itself means force.'),
  hips: line('yg_hips2', 'Hips next. Pigeon, both sides. If your front knee complains at any point, come out.'),
  pigeonSet: line('yg_pigeon_set2', 'Back leg long, top of the foot down. A cushion under your front hip if it floats.', 'technique'),
  pigeonSquare: tip('yg_pigeon_square2', 'Let your hips face forward without forcing them. Support the front hip if that helps.'),
  pigeonPrep: science('yg_pigeon_prep2', 'Technically this is the prep. Full pigeon, eka pada rajakapotasana, adds a deep backbend, with the back foot reaching for your head.'),
  pigeonStretch: science('yg_pigeon_stretch2', 'A short stretch like this mostly eases stiffness for now. Doing it regularly is what makes the range stick, partly because you get more comfortable with the stretch.'),
  pigeonRotators: science('yg_pigeon_rotators2', "Piriformis gets all the credit, but it's one of several deep hip muscles. Which ones you feel depends on your hip angle."),
  pigeonBelly: tip('yg_pigeon_belly', 'Let your belly soften on each breath out.'),
  childKnees: tip('yg_child_knees2', 'Knees wide or together. Whatever your hips vote for.'),
  childHistory: science('yg_child_history2', 'The sun salutation routines we know spread in the 1920s and thirties, alongside the physical culture of the time. The sun worship behind them is much older.'),
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
      move('twist', 'R'), hold(16, [at(Y.twistShoulder, 'Twist'), at(Y.twistLiver, 'Twist')]),
      move('center'),
      move('twist', 'L'), hold(16, [at(Y.twistRibs, 'Twist')]),
      move('center'),
      move('savasana'),
      hold(90, [at(Y.rest, 'Savasana')]),
      talk(Y.close),
    ],
  },
];

/** Every yoga program by practice id, for scripts/yoga_check.mjs. */
export const PROGRAMS = { 'flow-15': PROGRAM };

export const flow15 = {
  id: 'flow-15',
  title: 'Fifteen',
  titleHtml: '<em>Fifteen</em>',
  tag: 'Yoga',
  moment: 'flow',
  voice: 'leo',
  blurb: 'Vinyasa by ear. One chain, three rounds, a new piece each time. Leo calls every move, and which side.',
  lede: 'Fifteen minutes of vinyasa you can do with your eyes off the screen. A warm-up, three rounds of the same short chain with a new piece each round (high lunge, warrior two, half moon), pigeon, a twist and savasana. Leo calls every move on the breath and names the side. Music is off unless you switch it on.',
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
  <li>Leo names the side from a model of where your body is, so "right" is always the foot that's actually in front.</li>
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
