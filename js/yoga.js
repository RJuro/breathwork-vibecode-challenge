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
// base:  what carries you: seated | all4 | dog | plank | lunge | stance | balance | prone | pigeon | child | supine
// feet:  per side: under (both together under the body, as in dog or seated) | front | back | air
// hands: per side: lap | floor | up | wide | thigh | back | knee
// heel:  the back heel: up | down.  spine: long | flex | extend | side | fold | twist
// knees: in supine poses: bent | chest | left | right (fallen to that side) | long
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
  ['Three-legged dog', (s) => s.base === 'dog' && lifted(s)],
  ['Downward dog', (s) => s.base === 'dog'],
  ['Plank, knee in', (s) => s.base === 'plank' && lifted(s)],
  ['Plank', (s) => s.base === 'plank'],
  ['High lunge', (s) => s.base === 'lunge' && s.hands.R === 'up'],
  ['Lunge', (s) => s.base === 'lunge'],
  ['Half moon, setting up', (s) => s.base === 'stance' && s.hands[front(s)] === 'floor'],
  ['Reverse warrior', (s) => s.base === 'stance' && s.spine === 'side' && s.hands[front(s)] === 'up'],
  ['Side angle', (s) => s.base === 'stance' && s.spine === 'side'],
  ['Warrior 2', (s) => s.base === 'stance'],
  ['Half moon', (s) => s.base === 'balance'],
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
/** Which side a one-sided shape is on: the front foot, the lifted leg, or the side the knees fell to. */
const sideOf = (s) => front(s) || lifted(s) || (s.knees === 'right' ? 'R' : s.knees === 'left' ? 'L' : null) || s.pigeon || null;
/** Hands carrying weight, for the wrist budget. */
const onWrists = (s) => ['all4', 'dog', 'plank'].includes(s.base) || (s.base === 'lunge' && s.hands.R === 'floor') || s.base === 'balance';

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
    again: ['Exhale, knee in, and step it through.', 'Exhale, {x} foot all the way up between your hands.'],
  }),
  rise: (x) => ({ breath: 'in', pre: (s) => ok(s.base === 'lunge' && front(s) === x, `no lunge with the ${NAME[x]} foot in front`), to: (s) => set(s, { hands: both('up') }), cue: 'Inhale, rise up into high lunge. Arms reach.', again: ['Inhale, rise up.', 'Inhale, come all the way up.', 'Inhale, up you come.'] }),
  warrior2: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'up', `no high lunge with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { base: 'stance', heel: 'down', hands: both('wide') }),
    cue: 'Exhale, turn your back toes toward the long edge and drop the heel. Warrior two, arms wide.',
    again: ['Exhale, open up. Warrior two.', 'Exhale, warrior two.'],
  }),
  reverse: (x) => ({
    breath: 'in',
    pre: (s) => ok(s.base === 'stance' && front(s) === x, `no wide stance with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { spine: 'side', hands: sides(x, 'up', 'back') }),
    cue: 'Inhale, reverse warrior. {X} arm sweeps up and back, {o} hand slides down the back leg.',
    again: ['Inhale, reverse it.', 'Inhale, reverse warrior.'],
  }),
  sideAngle: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'stance' && front(s) === x, `no wide stance with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { spine: 'side', hands: sides(x, 'thigh', 'up') }),
    cue: 'Exhale, side angle. {X} forearm to your thigh, {o} arm reaches long over your ear.',
  }),
  moonPrep: (x) => ({
    breath: 'out',
    needs: ['Warrior 2'],
    pre: (s) => ok(s.base === 'stance' && front(s) === x, `no wide stance with the ${NAME[x]} foot in front`),
    to: (s) => set(s, { spine: 'long', hands: sides(x, 'floor', 'hip') }),
    cue: 'Exhale, windmill your {x} hand down to the floor or a block, a foot ahead of your {x} foot. {O} hand to your hip.',
  }),
  halfMoon: (x) => ({
    breath: 'in',
    pre: (s) => ok(s.base === 'stance' && front(s) === x && s.hands[x] === 'floor', `the ${NAME[x]} hand isn't down ahead of the ${NAME[x]} foot`),
    to: (s) => set(s, { base: 'balance', feet: sides(x, 'front', 'air'), hands: sides(x, 'floor', 'up'), heel: null, spine: 'long' }),
    cue: 'Inhale, shift forward and float your {o} leg up. Half moon. Top arm up if you want it.',
  }),
  landLunge: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'balance' && front(s) === x, `not balancing on the ${NAME[x]} leg`),
    to: (s) => set(s, { base: 'lunge', feet: sides(x, 'front', 'back'), hands: both('floor'), heel: 'up' }),
    cue: 'Exhale, bend your {x} knee and step your {o} foot back onto its toes. Hands beside your front foot.',
  }),
  handsDown: (x) => ({
    breath: 'out',
    pre: (s) => ok(['lunge', 'stance'].includes(s.base) && front(s) === x, `no ${NAME[x]} foot in front`),
    to: (s) => set(s, { base: 'lunge', hands: both('floor'), heel: 'up', spine: 'long' }),
    cue: (s) => (s.base === 'stance' ? 'Exhale, windmill your hands down beside your {x} foot. Back heel lifts.' : 'Exhale, hands to the floor, either side of your {x} foot.'),
    again: (s) => (s.base === 'stance' ? ['Exhale, hands beside your front foot, back heel up.', 'Exhale, windmill down. Back heel up.'] : ['Exhale, hands down.', 'Exhale, hands beside your front foot.']),
  }),
  stepBack: (x) => ({
    breath: 'in',
    pre: (s) => ok(s.base === 'lunge' && front(s) === x && s.hands.R === 'floor', `no lunge with hands down and the ${NAME[x]} foot in front`),
    to: (s) => set(s, { base: 'plank', feet: both('under'), heel: null }),
    cue: 'Inhale, step your {x} foot back to plank.',
    again: ['Inhale, front foot back. Plank.', 'Inhale, step back to plank.', 'Inhale, plank. Strong arms.'],
  }),
  plankToDog: () => ({ breath: 'out', pre: (s) => ok(s.base === 'plank' && !lifted(s), 'not in plank'), to: (s) => set(s, { base: 'dog' }), cue: 'Exhale, push back to downward dog.', again: ['Exhale, hips up and back. Dog.'] }),
  lower: () => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'plank' && !lifted(s), 'not in plank'),
    to: (s) => set(s, { base: 'prone' }),
    cue: 'Exhale, lower down to your belly, elbows close. Knees down if you want them.',
    again: ['Exhale, belly down.', 'Exhale, lower all the way down.', 'Exhale, slow on the way down.'],
  }),
  cobra: () => ({ breath: 'in', needs: ['Cow'], pre: (s) => ok(s.base === 'prone', 'not on your belly'), to: (s) => set(s, { spine: 'extend' }), cue: 'Inhale, untuck your toes. Cobra: press lightly through your hands and lift your chest.', again: ['Inhale, cobra.', 'Inhale, chest forward and up.', 'Inhale, lift the chest.'] }),
  backToDog: () => ({ breath: 'out', pre: (s) => ok(s.base === 'prone', 'not on your belly'), to: (s) => set(s, { base: 'dog', spine: 'long', feet: both('under') }), cue: 'Exhale, tuck your toes and press back to downward dog.', again: ['Exhale, downward dog.', 'Exhale, back to dog.', 'Exhale, press back. Hips high.'] }),
  pigeon: (x) => ({
    breath: 'out',
    needs: ['Lunge', 'Lunge@o'],
    pre: (s) => ok(s.base === 'dog' && s.feet[x] === 'air', `the ${NAME[x]} leg isn't lifted`),
    to: (s) => set(s, { base: 'pigeon', feet: sides(x, 'front', 'back'), pigeon: x }),
    cue: 'Exhale, {x} knee behind your {x} wrist, {x} heel toward your {o} hip. Slide the {o} leg back and lower down. Pigeon.',
  }),
  fold: () => ({ breath: 'out', pre: (s) => ok(s.base === 'pigeon' && s.spine === 'long', 'not upright in pigeon'), to: (s) => set(s, { spine: 'fold' }), cue: 'Exhale, walk your hands forward and fold over your front shin.', again: ['Exhale, walk the hands out and fold.'] }),
  pigeonUp: () => ({ breath: 'in', pre: (s) => ok(s.base === 'pigeon' && s.spine === 'fold', 'not folded in pigeon'), to: (s) => set(s, { spine: 'long' }), cue: 'Inhale, walk your hands back in and lift your chest.', again: ['Inhale, hands back, chest up.'] }),
  pigeonBack: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'pigeon' && s.pigeon === x && s.spine === 'long', `not upright in pigeon on the ${NAME[x]}`),
    to: (s) => set(s, { base: 'dog', feet: both('under'), pigeon: null }),
    cue: 'Exhale, tuck your back toes and step your {x} leg back. Downward dog.',
  }),
  child: () => ({ breath: 'out', pre: (s) => ok(s.base === 'dog', 'not in downward dog'), to: (s) => set(s, { base: 'child', spine: 'flex' }), cue: "Exhale, knees down, hips back to your heels. Child's pose." }),
  onBack: () => ({ breath: 'in', pre: (s) => ok(s.base === 'child', "not in child's pose"), to: (s) => set(s, { base: 'supine', spine: 'long', knees: 'chest', hands: both('knee') }), cue: 'Inhale, sit over to one side, bring your legs around, and lie back. Hug your knees in.' }),
  twist: (x) => ({
    breath: 'out',
    pre: (s) => ok(s.base === 'supine' && s.knees === 'chest', 'knees not at your chest'),
    to: (s) => set(s, { spine: 'twist', knees: x === 'R' ? 'right' : 'left', hands: both('wide') }),
    cue: 'Exhale, arms wide, and let both knees fall over to the {x}.',
  }),
  center: () => ({ breath: 'in', pre: (s) => ok(s.base === 'supine' && s.spine === 'twist', 'not twisting'), to: (s) => set(s, { spine: 'long', knees: 'chest', hands: both('knee') }), cue: 'Inhale, knees back to center.', again: ['Inhale, back to center.'] }),
  savasana: () => ({ breath: 'out', pre: (s) => ok(s.base === 'supine' && s.spine === 'long', 'not on your back'), to: (s) => set(s, { knees: 'long', hands: both('floor') }), cue: 'Exhale, legs long, arms by your sides, palms up. Savasana.' }),
};

// ── Program ────────────────────────────────────────────
// Steps: move(name, side) | hold(seconds, lines) | talk(line) | rest(seconds, label).
// Hold lines: { say, pose } — `pose` is the pose the line is about; the check fails if you're elsewhere.
export const move = (name, x = null) => ({ move: name, x });
export const hold = (seconds, lines = []) => ({ hold: seconds, lines });
export const talk = (say, gap) => ({ talk: say, gap });
/** The same block on the right, then the left: the second side is the first with R and L swapped. */
export const bothSides = (block) => [...block('R', 0), ...block('L', 1)];

const fill = (text, x) =>
  text.replace(/\{x\}/g, NAME[x] || '').replace(/\{X\}/g, cap(NAME[x] || '')).replace(/\{o\}/g, NAME[other(x)] || '').replace(/\{O\}/g, cap(NAME[other(x)] || ''));
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
  const made = new Map(); // how often a move was made on a side (the next time, a short cue)
  const errors = [];
  const trace = [];
  let ends = 0;
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
        // First time on this side: the full cue. After that the short ones, rotating, so round
        // three doesn't sound like round one.
        const key = `${st.move}@${st.x}`;
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
        const d = Math.max(m.breath === 'in' ? 3.5 : 4.5, lineDur(cue) + 0.8); // a flowing breath, longer when the cue needs it
        const label = side ? `${pose} · ${NAME[side]}` : pose;
        steps.push({ pace: { [m.breath === 'in' ? 'inhale' : 'exhale']: d, level: 0.25 }, count: 1, style: 'slow', calls: () => cue, labels: () => label });
        trace.push({ kind: 'move', breath: m.breath, move: st.move, x: st.x, pose, side, text, dur: d, wrists: onWrists(s), state: s });
      } else if (st.hold) {
        const pose = poseOf(s);
        const side = sideOf(s);
        const cues = [];
        let at = 1.5;
        // Sized for what this talk level actually says (the engine's rule): no dead air where a skipped line was.
        const heard = (c) => !((c.kind === 'science' && talk !== 'full') || ((c.kind === 'tip' || c.kind === 'lesson') && talk === 'quiet'));
        for (const l of st.lines.filter((x) => heard(x.say))) {
          if (l.pose && l.pose !== pose) errors.push(`${sec.id}: line ${l.say.id} is about ${l.pose}, spoken in ${pose}`);
          cues.push({ at, say: l.say });
          at += lineDur(l.say) + 2;
        }
        const seconds = Math.max(st.hold, Math.ceil(at + 6));
        if (seconds >= 15) cues.push({ at: seconds - 5, say: ENDINGS[ends++ % ENDINGS.length] });
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
 *  run, the sides get the same time, the wrists get breaks, and it ends lying down for long enough. */
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
  const time = { R: 0, L: 0 };
  for (const t of trace) if (t.side) time[t.side] += t.dur;
  if (Math.abs(time.R - time.L) > 0.1 * Math.max(time.R, time.L)) out.push(`sides uneven: right ${time.R.toFixed(0)} s, left ${time.L.toFixed(0)} s`);
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

