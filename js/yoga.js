// Audio yoga on a deterministic model of the practitioner. The body state is the truth: every move
// is a change to it with preconditions, so the coach always knows which foot is in front and which
// hand is up, a move that doesn't follow from the current state is an error rather than a guess,
// and the second side is the first side with R and L swapped. A program compiles to ordinary
// engine steps (engine.js): a flow move is one breath phase whose call is the move's cue; a hold is
// free breathing in a named pose, with its lines placed one after another.
//
//   node scripts/yoga_check.mjs   the state at every step, and the checks

import { say } from './flows/lib.js';
import { plain, estimateDur } from './engine.js';

export const other = (x) => (x === 'R' ? 'L' : 'R');
const NAME = { R: 'right', L: 'left' };
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);

// ── State ──────────────────────────────────────────────
// base:  what carries you: seated | all4 | dog | plank | lunge | stance | balance | prone | pigeon | child |
//        supine | stand | fold | squat | chair | sideplank | wild | halfsplits | lizard
// feet:  per side: under (together under the body, as in dog or seated) | top (standing at the front) |
//        front | back | air
// hands: per side: lap | floor | up | wide | thigh | back | knee | heart | hip
// heel:  the back heel: up | down.  spine: long | flex | extend | side | fold | twist
// knees: in supine poses: bent | chest | left | right (fallen to that side) | long
// extras: backKnee (lunge: up | hover | down), turn (chair twist side), support (side plank / wild
//        thing hand), open (balance: hips open = half moon), kneeIn (half moon squeeze), cross (knee
//        crossing under in plank), hips ('up' in bridge), up (up dog rather than cobra)
export const START = { base: 'seated', feet: { R: 'under', L: 'under' }, hands: { R: 'lap', L: 'lap' }, heel: null, spine: 'long', knees: null };

const front = (s) => (s.feet.R === 'front' ? 'R' : s.feet.L === 'front' ? 'L' : null);
const lifted = (s) => (s.feet.R === 'air' ? 'R' : s.feet.L === 'air' ? 'L' : null);
const set = (s, patch) => ({ ...s, ...patch, feet: { ...s.feet, ...patch.feet }, hands: { ...s.hands, ...patch.hands } });
const both = (v) => ({ R: v, L: v });
const sides = (x, mine, theirs) => ({ [x]: mine, [other(x)]: theirs });

/** Pose names, first match wins. A state no pose matches is an error: the program has drifted. */
const POSES = [
  ['Seated', (s) => s.base === 'seated'],
  ['Cat', (s) => s.base === 'all4' && s.spine === 'flex'],
  ['Cow', (s) => s.base === 'all4' && s.spine === 'extend'],
  ['Tabletop', (s) => s.base === 'all4'],
  ['Standing, arms up', (s) => s.base === 'stand'],
  ['Halfway lift', (s) => s.base === 'fold' && s.spine === 'long'],
  ['Forward fold', (s) => s.base === 'fold'],
  ['Squat', (s) => s.base === 'squat'],
  ['Chair twist', (s) => s.base === 'chair' && s.spine === 'twist'],
  ['Chair', (s) => s.base === 'chair'],
  ['Side plank', (s) => s.base === 'sideplank'],
  ['Wild thing', (s) => s.base === 'wild'],
  ['Half splits', (s) => s.base === 'halfsplits'],
  ['Lizard', (s) => s.base === 'lizard'],
  ['Bridge', (s) => s.base === 'supine' && s.hips === 'up'],
  ['On your back, knees bent', (s) => s.base === 'supine' && s.knees === 'bent'],
  ['Plank, knee across', (s) => s.base === 'plank' && s.cross],
  ['Three-legged dog', (s) => s.base === 'dog' && lifted(s)],
  ['Downward dog', (s) => s.base === 'dog'],
  ['Plank, knee in', (s) => s.base === 'plank' && lifted(s)],
  ['Plank', (s) => s.base === 'plank'],
  ['High lunge, knee down', (s) => s.base === 'lunge' && s.hands.R === 'up' && s.backKnee === 'hover'],
  ['High lunge', (s) => s.base === 'lunge' && s.hands.R === 'up'],
  ['Low lunge', (s) => s.base === 'lunge' && s.backKnee === 'down'],
  ['Lunge', (s) => s.base === 'lunge'],
  ['Half moon, setting up', (s) => s.base === 'stance' && s.hands[front(s)] === 'floor'],
  ['Reverse warrior', (s) => s.base === 'stance' && s.spine === 'side' && s.hands[front(s)] === 'up'],
  ['Side angle', (s) => s.base === 'stance' && s.spine === 'side'],
  ['Warrior 2', (s) => s.base === 'stance'],
  ['Warrior 3', (s) => s.base === 'balance' && !s.open],
  ['Half moon, knee in', (s) => s.base === 'balance' && s.kneeIn],
  ['Half moon', (s) => s.base === 'balance'],
  ['Up dog or cobra', (s) => s.base === 'prone' && s.spine === 'extend' && s.up],
  ['Cobra', (s) => s.base === 'prone' && s.spine === 'extend'],
  ['On your belly', (s) => s.base === 'prone'],
  ['Pigeon, folded', (s) => s.base === 'pigeon' && s.spine === 'fold'],
  ['Pigeon', (s) => s.base === 'pigeon'],
  ["Child's pose", (s) => s.base === 'child'],
  ['Twist', (s) => s.base === 'supine' && s.spine === 'twist'],
  ['Knees to chest', (s) => s.base === 'supine' && s.knees === 'chest'],
  ['Savasana', (s) => s.base === 'supine' && s.knees === 'long'],
];
export const poseOf = (s) => (POSES.find(([, is]) => is(s)) || [null])[0];
/** Which side a one-sided shape is on: the supporting hand, the twist, the front foot, the lifted leg,
 *  or the side the knees fell to. */
const sideOf = (s) => s.support || s.turn || front(s) || lifted(s) || (s.knees === 'right' ? 'R' : s.knees === 'left' ? 'L' : null) || s.pigeon || null;
/** Hands carrying weight, for the wrist budget. */
const onWrists = (s) =>
  ['all4', 'dog', 'plank', 'sideplank', 'wild', 'lizard'].includes(s.base) || (['lunge', 'squat'].includes(s.base) && s.hands.R === 'floor') || (s.base === 'balance' && s.open);

// ── Moves ──────────────────────────────────────────────
// A move: { id, breath: 'in' | 'out', pre(s) → true or why not, to(s) → next state, cue, again,
// needs: poses (with side) that must come earlier }. `cue` is the first time the move is made on
// that side, `again` the short versions after (a list rotates; a function picks by state); {x} is
// the move's side, {o} the other ({X}, {O} capitalised).
const ok = (cond, why) => (cond ? true : why);
export const MOVES = {
  tall: () => ({ breath: 'in', pre: (s) => ok(s.base === 'seated', 'not seated'), to: (s) => s, cue: 'Inhale, sit up tall. The crown of your head lifts.' }),
  settle: () => ({ breath: 'out', pre: (s) => ok(s.base === 'seated', 'not seated'), to: (s) => s, cue: 'Exhale, let the shoulders drop. Good.' }),
  toTable: () => ({ breath: 'out', pre: (s) => ok(s.base === 'seated', 'not seated'), to: (s) => set(s, { base: 'all4', hands: both('floor') }), cue: 'Exhale, come forward onto all fours. Wrists under shoulders, knees under hips.' }),
  cow: () => ({ breath: 'in', pre: (s) => ok(s.base === 'all4', 'not on hands and knees'), to: (s) => set(s, { spine: 'extend' }), cue: 'Inhale, cow. Belly drops, chest lifts, tailbone up.', again: ['Inhale, cow.', 'Inhale, chest forward, belly soft.'] }),
  cat: () => ({ breath: 'out', pre: (s) => ok(s.base === 'all4', 'not on hands and knees'), to: (s) => set(s, { spine: 'flex' }), cue: 'Exhale, cat. Round the back and push the floor away.', again: ['Exhale, round it out.', 'Exhale, cat.'] }),
  toDog: () => ({ breath: 'out', pre: (s) => ok(s.base === 'all4', 'not on hands and knees'), to: (s) => set(s, { base: 'dog', spine: 'long' }), cue: 'Exhale, tuck the toes and send your hips up and back. Downward dog.' }),
  lift: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'dog' && !lifted(s), 'not in downward dog with both feet down'), to: (s) => set(s, { feet: { [x]: 'air' } }), cue: 'Inhale, your {x} leg lifts, high behind you.', again: ['Inhale, {x} leg up.', 'Inhale, lift the {x} leg.', 'Inhale, {x} leg reaches high.'] }),
  stepThrough: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'dog' && s.feet[x] === 'air', `the ${NAME[x]} leg isn't lifted`),
    to: (s) => set(s, { base: 'lunge', feet: sides(x, 'front', 'back'), heel: 'up' }),
    cue: 'Exhale, shift forward, {x} knee to your nose, and step that foot up between your hands.',
    again: ['Exhale, {x} knee in, {x} foot between your hands.', 'Exhale, {x} foot all the way up between your hands.'],
  }),
  rise: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'lunge' && front(s) === x, `no lunge with the ${NAME[x]} foot in front`), to: (s) => set(s, { hands: both('up') }), cue: 'Inhale, rise up into high lunge. Arms reach.', again: ['Inhale, rise into high lunge.', 'Inhale, come up into high lunge, arms up.', 'Inhale, up you come. High lunge.'] }),
  warrior2: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'up', `no high lunge with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { base: 'stance', heel: 'down', hands: both('wide') }),
    cue: 'Exhale, turn your back toes toward the long edge, heel down, hips open. Warrior two, arms wide.',
    again: ['Exhale, back heel down, hips open. Warrior two.', 'Exhale, {o} toes toward the long edge, heel down. Warrior two.'],
  }),
  reverse: (x) => ({
    breath: 'in',
    pre: (s) => ok(s.base === 'stance' && front(s) === x, `no wide stance with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { spine: 'side', hands: sides(x, 'up', 'back') }),
    cue: 'Inhale, reverse warrior. {X} arm sweeps up and back, {o} hand slides down the back leg.',
    again: ['Inhale, reverse warrior, {x} arm up and back.', 'Inhale, reverse warrior.'],
  }),
  sideAngle: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'stance' && front(s) === x, `no wide stance with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { spine: 'side', hands: sides(x, 'thigh', 'up') }),
    cue: 'Exhale, side angle. {X} forearm to your thigh, {o} arm reaches long over your ear.',
    again: ['Exhale, side angle, {x} forearm to thigh.'],
  }),
  moonPrep: (x) => ({
    breath: 'out',
    needs: ['Warrior 2'],
    pre: (s) => ok(s.base === 'stance' && front(s) === x, `no wide stance with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { spine: 'long', hands: sides(x, 'floor', 'hip') }),
    cue: 'Exhale, windmill your {x} hand down to the floor or a block, a foot ahead of your {x} foot. {O} hand to your hip.',
    again: ['Exhale, {x} hand ahead and just outside your {x} foot, {o} hand to your hip.'],
  }),
  halfMoon: (x) => ({
    breath: 'in',
    pre: (s) => ok(s.base === 'stance' && front(s) === x && s.hands[x] === 'floor', `the ${NAME[x]} hand isn't down ahead of the ${NAME[x]} foot`),
    to: (s) => set(s, { base: 'balance', open: true, feet: sides(x, 'front', 'air'), hands: sides(x, 'floor', 'up'), heel: null, spine: 'long' }),
    cue: 'Inhale, shift forward and float your {o} leg up. Half moon. Top arm up if you want it.',
    again: ['Inhale, float the {o} leg up. Half moon.'],
  }),
  landLunge: (x) => ({
    min: 7, breath: 'out',
    pre: (s) => ok(s.base === 'balance' && front(s) === x, `not balancing on the ${NAME[x]} leg`),
    to: (s) => set(s, { base: 'lunge', feet: sides(x, 'front', 'back'), hands: both('floor'), heel: 'up', open: null, kneeIn: null, backKnee: 'up' }),
    cue: 'Exhale, bend your {x} knee, turn your hips down, and step your {o} foot back onto its toes. Hands beside your {x} foot.',
    again: ['Exhale, bend your {x} knee, hips turn down, {o} foot steps back.'],
  }),
  handsDown: (x) => ({
    breath: 'out',
    pre: (s) => ok(['lunge', 'stance'].includes(s.base) && front(s) === x, `no ${NAME[x]} foot in front`),
    to: (s) => set(s, { base: 'lunge', hands: both('floor'), heel: 'up', spine: 'long' }),
    cue: (s) => (s.base === 'stance' ? 'Exhale, windmill your hands down beside your {x} foot. Back heel lifts.' : 'Exhale, hands to the floor, either side of your {x} foot.'),
    again: (s) => (s.base === 'stance' ? ['Exhale, hands beside your front foot, back heel up.'] : ['Exhale, hands down.', 'Exhale, hands beside your front foot.']),
  }),
  stepBack: (x) => ({
    breath: 'in',
    pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'floor', `no lunge with hands down and the ${NAME[x]} foot in front`),
    to: (s) => set(s, { base: 'plank', feet: both('under'), heel: null }),
    cue: 'Inhale, step your {x} foot back to plank.',
    again: ['Inhale, {x} foot back. Plank.', 'Inhale, step back to plank.', 'Inhale, {x} foot back to plank.'],
  }),
  plankToDog: () => ({ breath: 'out', pre: (s) => ok(s.base === 'plank' && !lifted(s), 'not in plank'), to: (s) => set(s, { base: 'dog' }), cue: 'Exhale, push back to downward dog.', again: ['Exhale, hips up and back. Dog.'] }),
  lower: () => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'plank' && !lifted(s), 'not in plank'),
    to: (s) => set(s, { base: 'prone' }),
    cue: 'Exhale, lower down to your belly, elbows close. Knees down if you want them.',
    again: ['Exhale, belly down.', 'Exhale, lower all the way down.', 'Exhale, lower slowly to your belly.'],
  }),
  cobra: () => ({ breath: 'in', needs: ['Cow'], pre: (s) => ok(s.base === 'prone', 'not on your belly'), to: (s) => set(s, { spine: 'extend' }), cue: 'Inhale, untuck your toes. Cobra: press lightly through your hands and lift your chest.', again: ['Inhale, cobra.', 'Inhale, chest forward. Cobra.', 'Inhale, lift your chest into cobra.'] }),
  backToDog: () => ({ breath: 'out', pre: (s) => ok(s.base === 'prone', 'not on your belly'), to: (s) => set(s, { base: 'dog', spine: 'long', feet: both('under'), up: null }), cue: 'Exhale, tuck your toes and press back to downward dog.', again: ['Exhale, downward dog.', 'Exhale, back to dog.', 'Exhale, press back. Hips high.'] }),
  pigeon: (x) => ({
    breath: 'out',
    needs: ['Lunge', 'Lunge@o'],
    pre: (s) => ok(s.base === 'dog' && s.feet[x] === 'air', `the ${NAME[x]} leg isn't lifted`),
    to: (s) => set(s, { base: 'pigeon', feet: sides(x, 'front', 'back'), pigeon: x }),
    cue: 'Exhale, {x} knee behind your {x} wrist, {x} heel toward your {o} hip. Slide the {o} leg back and lower down. Pigeon.',
    again: ['Exhale, {x} knee behind your {x} wrist, {x} heel toward your {o} hip. Slide the {o} leg back. Pigeon.'],
  }),
  fold: () => ({ breath: 'out', pre: (s) => ok(s.base === 'pigeon' && s.spine === 'long', 'not upright in pigeon'), to: (s) => set(s, { spine: 'fold' }), cue: 'Exhale, walk your hands forward and fold over your front shin.', again: ['Exhale, walk the hands out and fold.'] }),
  pigeonUp: () => ({ breath: 'in', pre: (s) => ok(s.base === 'pigeon' && s.spine === 'fold', 'not folded in pigeon'), to: (s) => set(s, { spine: 'long' }), cue: 'Inhale, walk your hands back in and lift your chest.', again: ['Inhale, hands back, chest up.'] }),
  pigeonBack: (x) => ({
    min: 6, breath: 'out',
    pre: (s) => ok(s.base === 'pigeon' && s.pigeon === x && s.spine === 'long', `not upright in pigeon on the ${NAME[x]}`),
    to: (s) => set(s, { base: 'dog', feet: both('under'), pigeon: null }),
    cue: 'Exhale, tuck your back toes, press into your hands and lift the back knee. Draw your {x} leg back to downward dog.',
    again: ['Exhale, back toes tuck, hands press, back knee lifts. {X} leg back to dog.'],
  }),
  child: () => ({ breath: 'out', pre: (s) => ok(s.base === 'dog', 'not in downward dog'), to: (s) => set(s, { base: 'child', spine: 'flex' }), cue: "Exhale, knees down, hips back to your heels. Child's pose." }),
  onBack: () => ({ breath: 'in', pre: (s) => ok(s.base === 'child', "not in child's pose"), to: (s) => set(s, { base: 'supine', spine: 'long', knees: 'chest', hands: both('knee') }), cue: 'Inhale, sit over to one side, bring your legs around, and lie back. Hug your knees in.' }),
  twist: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'supine' && s.knees === 'chest', 'knees not at your chest'),
    to: (s) => set(s, { spine: 'twist', knees: x === 'R' ? 'right' : 'left', hands: both('wide') }),
    cue: 'Exhale, arms wide, and let both knees fall over to the {x}.',
    again: ['Exhale, knees over to the {x}.'],
  }),
  center: () => ({ breath: 'in', pre: (s) => ok(s.base === 'supine' && s.spine === 'twist', 'not twisting'), to: (s) => set(s, { spine: 'long', knees: 'chest', hands: both('knee') }), cue: 'Inhale, knees back to center.', again: ['Inhale, back to center.'] }),
  savasana: () => ({ breath: 'out', pre: (s) => ok(s.base === 'supine' && s.spine === 'long', 'not on your back'), to: (s) => set(s, { knees: 'long', hands: both('floor') }), cue: 'Exhale, legs long, arms by your sides, palms up. Savasana.' }),

  // ── For warmer flows: step-in salutations, chair twists, crossunders, knee taps, warrior three to
  // half moon, side plank to wild thing, a squat for crow, half splits, lizard, bridge.
  dogHeels: () => ({ breath: 'in', pre: (s) => ok(s.base === 'dog' && !lifted(s), 'not in downward dog'), to: (s) => s, cue: 'Inhale, lift your heels and look up between your hands.', again: ['Inhale, heels up, look forward.', 'Inhale, lift the heels.'] }),
  toSquat: () => ({ min: 6, breath: 'out', pre: (s) => ok(s.base === 'dog' && !lifted(s), 'not in downward dog'), to: (s) => set(s, { base: 'squat', feet: both('top'), spine: 'long' }), cue: 'Exhale, bend your knees and step your feet just outside your hands. Lower into a squat, only as far as is comfortable.', again: ['Exhale, step your feet outside your hands. Squat.'] }),
  squatHeart: () => ({ breath: 'in', pre: (s) => ok(s.base === 'squat', 'not in a squat'), to: (s) => set(s, { hands: both('heart') }), cue: 'Inhale, hands to your heart, knees follow your toes, chest lifts.', again: ['Inhale, hands to heart, chest lifts.'] }),
  squatFold: () => ({ breath: 'out', pre: (s) => ok(s.base === 'squat', 'not in a squat'), to: (s) => set(s, { base: 'fold', spine: 'fold', hands: both('floor') }), cue: 'Exhale, hands down, lift your hips into a wide forward fold. Knees can stay bent.', again: ['Exhale, hands down, hips up. Wide forward fold.'] }),
  squatToDog: () => ({ breath: 'out', pre: (s) => ok(s.base === 'squat', 'not in a squat'), to: (s) => set(s, { base: 'dog', feet: both('under'), hands: both('floor') }), cue: 'Exhale, hands down, step back to downward dog.' }),
  riseUp: () => ({ breath: 'in', pre: (s) => ok(s.base === 'fold', 'not folded'), to: (s) => set(s, { base: 'stand', spine: 'long', hands: both('up') }), cue: 'Inhale, rise all the way up, feet hip-width, arms overhead.', again: ['Inhale, rise, feet hip-width, arms up.'] }),
  chair: () => ({ breath: 'out', pre: (s) => ok(s.base === 'stand', 'not standing'), to: (s) => set(s, { base: 'chair' }), cue: 'Exhale, sit your hips back into chair. Arms stay up, whole feet grounded.', again: ['Exhale, chair.', 'Exhale, sit it back. Chair.'] }),
  chairHeart: () => ({ breath: 'in', pre: (s) => ok(s.base === 'chair' && s.spine === 'long', 'not in chair'), to: (s) => set(s, { hands: both('heart') }), cue: 'Inhale, hands to your heart.', again: ['Inhale, hands to heart.'] }),
  chairTwist: (x) => ({ breath: 'out', pre: (s) => ok(s.base === 'chair' && s.spine === 'long' && s.hands.R === 'heart', 'not in chair with hands at your heart'), to: (s) => set(s, { spine: 'twist', turn: x }), cue: 'Exhale, twist {x}, {o} elbow outside your {x} knee.', again: ['Exhale, twist {x}, {o} elbow outside your {x} knee.'] }),
  chairCenter: () => ({ breath: 'in', pre: (s) => ok(s.base === 'chair' && s.spine === 'twist', 'not twisting in chair'), to: (s) => set(s, { spine: 'long', turn: null }), cue: 'Inhale, back to center.', again: ['Inhale, center.'] }),
  foldDown: () => ({ breath: 'out', pre: (s) => ok(['stand', 'chair'].includes(s.base) && s.spine !== 'twist', 'not standing or in chair'), to: (s) => set(s, { base: 'fold', spine: 'fold', hands: both('floor'), turn: null }), cue: 'Exhale, fold over your legs.', again: ['Exhale, fold.', 'Exhale, fold it down.'] }),
  halfLift: () => ({ breath: 'in', pre: (s) => ok(s.base === 'fold' && s.spine === 'fold', 'not folded'), to: (s) => set(s, { spine: 'long' }), cue: 'Inhale, halfway lift. Long spine, hands on your shins.', again: ['Inhale, halfway up.', 'Inhale, long spine.'] }),
  jumpBack: () => ({ min: 6, breath: 'out', pre: (s) => ok(s.base === 'fold' && s.spine === 'long', 'not in a halfway lift'), to: (s) => set(s, { base: 'prone', spine: 'long', feet: both('under'), hands: both('floor') }), cue: 'Exhale, plant your hands, step back to plank, then lower to your belly. Knees first if you like.', again: ['Exhale, hands down, step to plank, lower to your belly.'] }),
  upDog: () => ({ breath: 'in', needs: ['Cow'], pre: (s) => ok(s.base === 'prone' && s.spine === 'long', 'not on your belly'), to: (s) => set(s, { spine: 'extend', up: true }), cue: 'Inhale, untuck your toes. Cobra with the pelvis down, or up dog with the thighs lifted if your arms are happy.', again: ['Inhale, cobra or up dog.', 'Inhale, chest forward. Cobra or up dog.'] }),
  crossUnder: (x) => ({ breath: 'out', pre: (s) => ok(s.base === 'dog' && !lifted(s), 'not in downward dog'), to: (s) => set(s, { base: 'plank', feet: { [x]: 'air' }, cross: true }), cue: 'Exhale, shift forward, and cross your {x} knee under you toward your {o} elbow.', again: ['Exhale, shift forward, {x} knee toward your {o} elbow.', 'Exhale, {x} knee across to your {o} elbow.'] }),
  crossBack: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'plank' && s.cross && s.feet[x] === 'air', `the ${NAME[x]} knee isn't across`), to: (s) => set(s, { base: 'dog', feet: both('under'), cross: null }), cue: 'Inhale, back to downward dog.', again: ['Inhale, back to dog.', 'Inhale, press back to dog.'] }),
  kneeTap: (x) => ({ breath: 'out', pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'up' && s.backKnee !== 'hover', 'not in high lunge'), to: (s) => set(s, { backKnee: 'hover' }), cue: 'Exhale, both knees bend, and the back knee lowers to tap the floor, lightly.', again: ['Exhale, back knee taps.', 'Exhale, tap the back knee down.'] }),
  kneeLift: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.backKnee === 'hover', 'back knee not down'), to: (s) => set(s, { backKnee: 'up' }), cue: 'Inhale, drive it back up into high lunge.', again: ['Inhale, back knee lifts.', 'Inhale, back up to high lunge.'] }),
  warrior3: (x) => ({ min: 7, breath: 'out', pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'up' && s.backKnee !== 'hover', `no high lunge with the ${NAME[x]} foot in front`), to: (s) => set(s, { base: 'balance', open: false, feet: sides(x, 'front', 'air'), hands: both('heart'), heel: null, backKnee: null }), cue: 'Exhale, hands to heart, shift onto your {x} foot and lift your {o} leg behind you. Warrior three, {x} knee soft.', again: ['Exhale, hands to heart, weight into your {x} foot, {o} leg lifts. Warrior three.'] }),
  openMoon: (x) => ({ min: 7, breath: 'in', needs: ['Warrior 3'], pre: (s) => ok(s.base === 'balance' && !s.open && front(s) === x, `not in warrior three on the ${NAME[x]} leg`), to: (s) => set(s, { open: true, hands: sides(x, 'floor', 'up') }), cue: "Inhale, {x} fingertips ahead and just outside your {x} foot, on a block or the floor. {O} hip opens, {o} arm up if you're steady. Half moon.", again: ['Inhale, {x} fingertips ahead and outside your foot. {O} hip opens. Half moon.'] }),
  moonSqueeze: (x) => ({ breath: 'out', pre: (s) => ok(s.base === 'balance' && s.open && !s.kneeIn && front(s) === x, 'not in half moon'), to: (s) => set(s, { kneeIn: true }), cue: 'Exhale, draw your {o} knee toward your {o} ribs. Squeeze, chest stays open.', again: ['Exhale, {o} knee toward your ribs. Squeeze.'] }),
  moonKick: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'balance' && s.kneeIn, 'knee not drawn in'), to: (s) => set(s, { kneeIn: null }), cue: 'Inhale, extend your {o} leg back, slowly.', again: ['Inhale, extend the {o} leg back.'] }),
  sidePlank: (x) => ({ min: 7, breath: 'out', pre: (s) => ok(s.base === 'plank' && !lifted(s), 'not in plank'), to: (s) => set(s, { base: 'sideplank', support: x, hands: sides(x, 'floor', 'up') }), cue: 'Exhale, {x} shoulder over your hand, roll onto the outer edge of your {x} foot, stack your {o} foot on top, {o} arm up. Side plank.', again: ['Exhale, {x} hand supports, roll onto your {x} foot, stack the {o} foot, {o} arm up. Side plank.'] }),
  wild: (x) => ({ min: 7, breath: 'in', needs: ['Side plank'], pre: (s) => ok(s.base === 'sideplank' && s.support === x, `not in side plank on the ${NAME[x]} hand`), to: (s) => set(s, { base: 'wild', spine: 'extend' }), cue: 'Inhale, bend your {o} knee and place the ball of your {o} foot behind your {x} leg. Lift your hips, {o} arm overhead. Wild thing.', again: ['Inhale, bend your {o} knee, {o} toes land behind you. Hips lift, arm overhead. Wild thing.'] }),
  wildToPlank: (x) => ({ min: 7, breath: 'out', pre: (s) => ok((s.base === 'wild' || s.base === 'sideplank') && s.support === x, 'not in wild thing or side plank'), to: (s) => set(s, { base: 'plank', spine: 'long', support: null, hands: both('floor'), feet: both('under') }), cue: 'Exhale, lower your hips a little, turn your chest to the floor, {o} hand down, {o} foot back. Plank.', again: ['Exhale, hips lower, chest turns down, {o} hand and foot back to plank.'] }),
  plankBreath: () => ({ breath: 'in', pre: (s) => ok(s.base === 'plank' && !lifted(s), 'not in plank'), to: (s) => s, cue: 'Inhale, hold your plank, long through the heels.', again: ['Inhale, plank.'] }),
  crowLand: () => ({ breath: 'in', pre: (s) => ok(s.base === 'squat', 'not in a squat'), to: (s) => set(s, { hands: both('heart') }), cue: 'Inhale, feet down in your squat, and lift your chest.' }),
  scapPush: () => ({ breath: 'out', pre: (s) => ok(s.base === 'all4', 'not on hands and knees'), to: (s) => set(s, { spine: 'long' }), cue: 'Exhale, push the floor away and spread your shoulder blades.', again: ['Exhale, push the floor away.'] }),
  scapSink: () => ({ breath: 'in', pre: (s) => ok(s.base === 'all4', 'not on hands and knees'), to: (s) => set(s, { spine: 'long' }), cue: 'Inhale, arms straight, let your chest sink between your shoulders.', again: ['Inhale, chest sinks.'] }),
  kneeDown: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'floor', `no lunge with hands down and the ${NAME[x]} foot in front`), to: (s) => set(s, { backKnee: 'down', heel: null, hands: both('thigh') }), cue: 'Inhale, lower your back knee and untuck the toes. Hands to your front thigh, chest lifts.', again: ['Inhale, {o} knee down, untuck the toes, hands to your {x} thigh.'] }),
  halfSplits: (x) => ({ breath: 'out', pre: (s) => ok(s.base === 'lunge' && s.backKnee === 'down' && front(s) === x, 'not in a low lunge'), to: (s) => set(s, { base: 'halfsplits', hands: both('floor'), spine: 'fold' }), cue: 'Exhale, hands down, shift your hips back over your knee, and straighten your front leg. Half splits.', again: ['Exhale, hands down, hips back over your {o} knee, {x} leg long. Half splits.'] }),
  toLowLunge: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'halfsplits' && front(s) === x, 'not in half splits'), to: (s) => set(s, { base: 'lunge', backKnee: 'down', spine: 'long' }), cue: 'Inhale, bend the front knee and come back into your lunge.', again: ['Inhale, back into your lunge.'] }),
  lizard: (x) => ({ breath: 'out', pre: (s) => ok(s.base === 'lunge' && s.backKnee === 'down' && front(s) === x, 'not in a low lunge'), to: (s) => set(s, { base: 'lizard', hands: both('floor') }), cue: 'Exhale, {x} foot steps out toward the edge of the mat, hands inside it. Lizard.', again: ['Exhale, {x} foot to the edge, hands inside. Lizard.'] }),
  lizardBack: (x) => ({ min: 6, breath: 'in', pre: (s) => ok(s.base === 'lizard' && front(s) === x, 'not in lizard'), to: (s) => set(s, { base: 'dog', feet: both('under'), backKnee: null, heel: null }), cue: 'Inhale, palms down, tuck your {o} toes and lift your {o} knee. {X} foot steps back, hips lift into downward dog.', again: ['Inhale, palms down, {o} knee lifts, {x} foot back. Dog.'] }),
  childToDog: () => ({ breath: 'in', pre: (s) => ok(s.base === 'child', "not in child's pose"), to: (s) => set(s, { base: 'dog', spine: 'long' }), cue: 'Inhale, come forward onto all fours, tuck your toes, and lift back to downward dog.' }),
  feetDown: () => ({ breath: 'out', pre: (s) => ok(s.base === 'supine' && s.knees === 'chest', 'knees not at your chest'), to: (s) => set(s, { knees: 'bent', hands: both('floor') }), cue: 'Exhale, feet down on the mat, knees bent, arms by your sides.' }),
  bridgeUp: () => ({ breath: 'in', pre: (s) => ok(s.base === 'supine' && s.knees === 'bent' && s.hips !== 'up', 'not lying with knees bent'), to: (s) => set(s, { hips: 'up' }), cue: 'Inhale, press into your feet and lift your hips, only as high as is easy. Bridge.', again: ['Inhale, lift again. Bridge.'] }),
  bridgeDown: () => ({ breath: 'out', pre: (s) => ok(s.base === 'supine' && s.hips === 'up', 'not in bridge'), to: (s) => set(s, { hips: null }), cue: 'Exhale, lower down slowly, one vertebra at a time.', again: ['Exhale, lower down.'] }),
  kneesIn: () => ({ breath: 'in', pre: (s) => ok(s.base === 'supine' && s.knees === 'bent' && s.hips !== 'up', 'not lying with knees bent'), to: (s) => set(s, { knees: 'chest', hands: both('knee') }), cue: 'Inhale, hug your knees into your chest.' }),
};

// ── Program ────────────────────────────────────────────
// Steps: move(name, side) | hold(seconds, lines, { countdown }) | talk(line) | rest(seconds, label).
// Hold lines: { say, pose } — `pose` is the pose the line is about; the check fails if you're elsewhere.
export const move = (name, x = null) => ({ move: name, x });
export const hold = (seconds, lines = [], o = {}) => ({ hold: seconds, lines, countdown: o.countdown });
export const talk = (say, gap) => ({ talk: say, gap });
/** The same block on the right, then the left: the second side is the first with R and L swapped. */
let pairs = 0;
export const bothSides = (block) => {
  const [r, l] = [block('R', 0), block('L', 1)];
  // Mirrored holds last equally long, the longer of the two (the first side usually says more).
  r.forEach((st, i) => {
    if (st.hold != null && l[i] && l[i].hold != null) st.pair = l[i].pair = ++pairs;
  });
  return [...r, ...l];
};

const fill = (text, x) =>
  text.replace(/\{x\}/g, NAME[x] || '').replace(/\{X\}/g, cap(NAME[x] || '')).replace(/\{o\}/g, NAME[other(x)] || '').replace(/\{O\}/g, cap(NAME[other(x)] || ''));
const COUNTDOWN = say('Five, four, three, two, one.');
const ENDINGS = [say('One more breath here.'), say('Last breath here.'), say('Stay for one more.'), say('And one more breath.')];

/**
 * Walk a program from START: apply every move, resolve every cue, and lay out the engine steps.
 * Returns { sections, trace, errors }. `durs` are recorded line lengths (estimates otherwise), so
 * a phase is always long enough for its cue; `talk` is the voice level, so holds fit what's said.
 */
export function build(program, durs = {}, talk = 'full') {
  const lineDur = (c) => durs[c.id] ?? estimateDur(plain(c.text));
  let s = START;
  const seen = new Set(); // poses visited, as "Pose@R"
  const made = new Map(); // how often a move was made (the next time, a short cue)
  const errors = [];
  const trace = [];
  let ends = 0;
  // Sized for what this talk level actually says (the engine's rule): no dead air where a skipped line was.
  const heard = (c) => !((c.kind === 'science' && talk !== 'full') || ((c.kind === 'tip' || c.kind === 'lesson') && talk === 'quiet'));
  const tail = (st) => (st.countdown ? lineDur(COUNTDOWN) + 1.5 : 6); // room for the closing count or last-breath line
  const need = (st) => Math.max(st.hold, Math.ceil(st.lines.filter((l) => heard(l.say)).reduce((at, l) => at + lineDur(l.say) + 2, 1.5) + tail(st)));
  const pairLen = new Map();
  for (const sec of program) for (const st of sec.steps) if (st.pair) pairLen.set(st.pair, Math.max(pairLen.get(st.pair) || 0, need(st)));
  const sections = program.map((sec) => {
    const steps = [];
    for (const st of sec.steps) {
      if (st.move) {
        const m = MOVES[st.move](st.x);
        const why = m.pre(s);
        if (why !== true) {
          errors.push(`${sec.id}: ${st.move}${st.x ? ' ' + st.x : ''} from ${poseOf(s)}: ${why}`);
          continue;
        }
        for (const need of m.needs || []) {
          const [pose, which] = need.split('@');
          const side = which === 'o' ? other(st.x) : st.x;
          if (!seen.has(`${pose}@${side}`) && !seen.has(pose)) errors.push(`${sec.id}: ${st.move} ${st.x || ''} before ${pose}${side ? ` on the ${NAME[side]}` : ''}`);
        }
        // The first time a move is made: the full cue. After that (the second side included) the
        // short ones, rotating, so the left side and round three don't sound like a recording.
        const key = st.move;
        const n = made.get(key) || 0;
        const pick = (c) => (typeof c === 'function' ? c(s) : c);
        const again = [].concat(pick(m.again) || []);
        const text = fill(n && again.length ? again[(n - 1) % again.length] : pick(m.cue), st.x);
        made.set(key, n + 1);
        if (/[{}]/.test(text)) errors.push(`${sec.id}: unresolved cue "${text}"`);
        s = m.to(s);
        const pose = poseOf(s);
        if (!pose) errors.push(`${sec.id}: after ${st.move}, a state no pose matches: ${JSON.stringify(s)}`);
        const side = sideOf(s);
        seen.add(side ? `${pose}@${side}` : pose);
        const cue = say(text);
        // A flowing breath, longer when the cue needs it, and never shorter than the move itself (`min`,
        // the same on both sides, so a short second-side cue doesn't rush a technical transition).
        const d = Math.max(m.breath === 'in' ? 3.5 : 4.5, m.min || 0, lineDur(cue) + 0.8);
        const label = side ? `${pose} · ${NAME[side]}` : pose;
        steps.push({ pace: { [m.breath === 'in' ? 'inhale' : 'exhale']: d, level: 0.25 }, count: 1, style: 'slow', calls: () => cue, labels: () => label });
        trace.push({ kind: 'move', breath: m.breath, move: st.move, x: st.x, pose, side, text, dur: d, wrists: onWrists(s), state: s });
      } else if (st.hold) {
        const pose = poseOf(s);
        const side = sideOf(s);
        const cues = [];
        let at = 1.5;
        for (const l of st.lines.filter((x) => heard(x.say))) {
          if (l.pose && l.pose !== pose) errors.push(`${sec.id}: line ${l.say.id} is about ${l.pose}, spoken in ${pose}`);
          cues.push({ at, say: l.say });
          at += lineDur(l.say) + 2;
        }
        const seconds = st.pair ? pairLen.get(st.pair) : need(st);
        // Eyes-off, the end of a hold has to be heard: a countdown (`countdown`) or a last-breath line.
        if (st.countdown) cues.push({ at: seconds - lineDur(COUNTDOWN) - 0.6, say: COUNTDOWN });
        else if (seconds >= 15) cues.push({ at: seconds - 5, say: ENDINGS[ends++ % ENDINGS.length] });
        steps.push({ rest: seconds, label: side ? `${pose} · ${NAME[side]}` : pose, cues });
        trace.push({ kind: 'hold', pose, side, dur: seconds, wrists: onWrists(s), lines: st.lines.map((l) => l.say.id), state: s });
      } else if (st.talk) {
        steps.push({ say: st.talk, gap: st.gap });
        trace.push({ kind: 'talk', pose: poseOf(s), dur: lineDur(st.talk) + 1.8, text: plain(st.talk.text), wrists: onWrists(s), state: s });
      } else if (st.rest) {
        steps.push({ rest: st.rest, label: st.label || poseOf(s) });
        trace.push({ kind: 'rest', pose: poseOf(s), dur: st.rest, wrists: onWrists(s), state: s });
      }
    }
    return { id: sec.id, title: sec.title, what: sec.what, color: sec.color, steps };
  });
  return { sections, trace, errors };
}

/** Checks on a built program beyond "every move follows": breath alternates through each flowing
 *  run, the sides get the same moves and holds, the wrists get breaks, and it ends lying down for long enough. */
export function check({ trace, errors }) {
  const out = [...errors];
  let last = null;
  for (const t of trace) {
    if (t.kind !== 'move') {
      last = null;
      continue;
    }
    if (last === t.breath) out.push(`two ${t.breath}-breaths in a row: ${t.move} ${t.x || ''} (${t.text})`);
    last = t.breath;
  }
  // Sides: the same moves, and about the same time held. (The first side's cues run longer, since
  // the second side gets the short ones; that's talk, not practice, so it isn't counted.)
  const time = { R: 0, L: 0 };
  const moves = { R: 0, L: 0 };
  for (const t of trace) {
    if (t.side && t.kind === 'hold') time[t.side] += t.dur;
    if (t.side && t.kind === 'move') moves[t.side]++;
  }
  if (Math.abs(time.R - time.L) > 0.1 * Math.max(time.R, time.L)) out.push(`sides uneven: held ${time.R.toFixed(0)} s on the right, ${time.L.toFixed(0)} s on the left`);
  if (moves.R !== moves.L) out.push(`sides uneven: ${moves.R} moves on the right, ${moves.L} on the left`);
  let run = 0;
  let longest = 0;
  let total = 0;
  for (const t of trace) {
    if (t.wrists) {
      run += t.dur;
      total += t.dur;
      longest = Math.max(longest, run);
    } else run = 0;
  }
  if (longest > 150) out.push(`${longest.toFixed(0)} s on the wrists without a break`);
  const end = trace.filter((t) => t.pose === 'Savasana').reduce((n, t) => n + t.dur, 0);
  if (end < 90) out.push(`savasana is only ${end.toFixed(0)} s`);
  return { problems: out, sides: time, wrists: { total, longest } };
}

