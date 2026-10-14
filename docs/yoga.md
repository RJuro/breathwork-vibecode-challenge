# Yoga by ear: where it stands, how it works, what's next

Written 14 Oct 2026. The yoga area of Breathe-up: audio-only vinyasa for people who already know the
poses, practised with the phone face down.

## What's live (v32)

- **A separate area.** The library has two tabs, Breathe and Yoga (`#/` and `#/yoga`).
  - `MOMENTS[].area` and `AREAS` in `js/flows/index.js` give each area its own header and footer.
  - A yoga practice's back link and done button return to `#/yoga`.
- **Fifteen** (`flow-15`, about 15 min at Guided): the basic flow.
  - Warm-up, then three rounds of one chain: lunge, then warrior two and reverse warrior, then half moon.
  - Then pigeon, a twist, savasana.
  - Roman's verdict: "very basic". Keep it as the entry-level flow.
- **Heat** (`heat`, about 22½ min at Guided): the warming one. In order:
  1. shoulder-blade push-ups and crossunders;
  2. step-in salutations through a squat and a chair, with a chair twist in round two;
  3. standing rounds, each with its own focus: knee taps; warrior three opening to half moon with a knee squeeze; side plank flipped into wild thing and back through plank;
  4. child's pose for the wrists, then crow or a squat;
  5. lizard, a twist, savasana.
  - It takes more from Patrick Beach and Jonah Kest than from Dylan Werner. See "Spiral" below.
- **Music** is off by default for both. Every practice that has a music pool gets a No music / Music switch on its page.
  - The switch is remembered per practice: `settings.musicFor`.
  - Without a stored choice, `musicOn()` in `js/app.js` falls back to `musicDefault`, then to the global setting.
- **Coach names are internal.** Leo voices both flows, but no spoken line or UI copy names Leo or Mira.
  The same now holds across the whole app, including the calendar reminder.
- **Cost.** Gemini TTS is roughly 10–15 cents for a full 15–20-minute session.
  Fifteen's 109 clips cost about 12 cents; Heat plus the Fifteen fixes, 139 clips, about 17 cents.

## The practitioner model (`js/yoga.js`)

Roman's idea: there should always be a deterministic model of the practitioner, so the coach never
guesses which hand is up or which foot is in front.

- **State is the truth.** What it tracks:
  - `base`: what carries you (dog, lunge, stance, balance, squat, chair, side plank, wild, and so on);
  - `feet` and `hands` per side, back `heel`, `spine`, supine `knees`;
  - extras: `backKnee`, `turn`, `support`, `open`, `kneeIn`, `cross`, `hips`, `up`.
- **Poses** are named patterns over that state, first match wins.
  - There are 40 so far, e.g. "Warrior 3" means balance with hips square; "Half moon" means balance with hips open.
  - A state that matches no pose is an error: the program has drifted.
- **Moves** (69 so far). Each one has:
  - a breath (`in` or `out`);
  - preconditions (`pre`), which return why not when they fail;
  - the next state (`to`);
  - `needs`: poses that must have come earlier on that side, e.g. half moon after warrior two, pigeon after lunges on both sides;
  - optionally `min`: a minimum phase length for technical transitions, the same on both sides.
- **Cues are templates resolved from the state.** `{x}`/`{o}` are the move's side and the other side; `{X}`/`{O}` are capitalised.
  - The first time a move is made, the full cue plays.
  - After that, the short cues (`again`) rotate, so round three doesn't sound like round one. They still name the side.
- **Mirroring.** `bothSides((x, n) => [...])` writes the right side and derives the left.
  - Mirrored holds are paired and last the longer of the two, since the first side usually says more.
- **Holds** are free breathing in a named pose.
  - Each hold line declares the pose it's about, and the check fails if the line plays elsewhere.
  - Holds are sized to what the chosen talk level actually says, so there's no dead air where a skipped line would have been.
  - The end of a hold is always audible: a rotating "last breath" line, or a counted "five, four, three, two, one" (`countdown`).
- **Compiling.** A program compiles to ordinary engine steps:
  - one breath phase per move, whose call is the cue, with the phase stretched to fit the recorded cue length;
  - one labelled rest per hold.
  - `engine.compile` passes `durs` to `sections(opts, durs)` for this.

### The checks

`node scripts/yoga_check.mjs [--full | --quiet-voice]` prints the pose and side after every move, then
runs these checks:

1. every move follows from the state;
2. breath alternates within a flowing run;
3. both sides get the same moves and held time within 10%;
4. no stretch on the wrists longer than 150 s;
5. savasana is at least 90 s;
6. every hold line plays in its own pose.

`scripts/check_timing.mjs` also flags late, spilling, off-phase or unrecorded lines. The engine marks a
line "off-phase" when a phase-bound line can't fit its window. The checks have already caught real
slips, e.g. half moon read as warrior three after the model learned open versus square hips.

### Workflow for a new practice

1. Write the program in `js/flows/yoga.js`, adding shapes and moves to `js/yoga.js` as needed.
2. Run `yoga_check.mjs` until it's clean at all three talk levels.
3. Have GPT Sol review it with `codex exec -m gpt-6.1-sol … < /dev/null`, giving it the trace and the line list. Ask for:
   - eyes-off clarity;
   - accuracy of the science and trivia;
   - voice;
   - safety;
   - sequencing.
4. Record:
   - export with `node scripts/export_cues.mjs`;
   - run `generate_cues_gemini.py --flow ID --voice leo --pack leo`;
   - several recorders can share a pack, since manifest writes merge.
5. Run `check_timing.mjs` with the real clip lengths.
6. Do a browser check, then bump `service-worker.js` VERSION, commit and deploy.

New files must go into the service worker's `SHELL` list.

## Research: 16 classes, mapped

- **Source:** YouTube auto-captions only, fetched with the Spark's yt-dlp.
- **The classes:**
  - Patrick Beach: 8 classes, from his own channel.
  - Dylan Werner: 5 classes, from Liforme and Zen Studio.
  - Jonah Kest: 2 Nike-class re-uploads.
  - Bryan Kest: 1 Power Yoga class.
- **Method:** Haiku agents mapped every pose change, transition, cue type and moment that needs eyes into JSON. The text is paraphrased, not copied.
- **Where the data lives:** the maps are local only, in `docs/research/yoga/maps/` (gitignored, since they're derived from other teachers' classes). The raw captions are not kept in the repo.
- **Caveat:** auto-captions often mishear left and right, so treat the counts as indicative.

### What the classes show

- **Down dog is the hub.** It's in 26% of all transitions. Three-legged dog is the launch pad for nearly all one-sided work, and plank → chaturanga → up dog → down dog is the reset loop.
- **The transition library is a manageable size.** There are 532 distinct transitions, but only 133 appear three times or more.
- **Typical arc:**
  1. arrive;
  2. floor warm-up;
  3. often core early;
  4. rounds;
  5. standing and balance;
  6. an optional arm balance or inversion "as an extra";
  7. a backbend;
  8. hips, then a twist;
  9. savasana.
- **Later rounds get fewer words.** Everyone shortens the second side and later rounds: "same thing", "your own rhythm", "last time".
- **Two ways to time a class:**
  - breath-led: an inhale or exhale on every move, a cue every 5–10 s (Beach, Kest);
  - counted: holds and reps counted down from ten to one (Werner).
- **Options always rejoin** at a known pose, usually down dog.
- **Where audio-only breaks:** 2–25 moments per class need eyes.
  - showing instead of saying ("like this", "this way");
  - pivots and mat corners;
  - inside versus outside the hand;
  - crossing moves;
  - props;
  - gaze cues.

  The state model fixes most of these by naming limbs and sides.
- **Their anatomy is often folk science,** e.g. "reciprocal inhibition relaxes the hamstrings", "hips store tension". Our layer keeps their register with accurate content. Myth-busting makes good trivia.

### Each teacher, in one line

- **Patrick Beach:** additive rounds that alternate sides every round; transitions treated as the skill; playful, imagery-rich voice ("journey", "surfing that edge", "we're in this together").
- **Dylan Werner:** strength and mobility, counted holds and reps, dynamic before static, active stretching, level changes through the floor. Details below.
- **Jonah Kest:** dense breath-led cueing, crossunders as a recurring thread, light humour about Sanskrit, "remixes" of familiar sequences, child's pose offered "without asking permission".
- **Bryan Kest:** Ashtanga-style A and B salutations, long self-paced holds, sensation over aesthetics, a long savasana.

## What's creative in Werner's sequencing (the target for the next flow)

Timestamps refer to his 36-minute "Myofascial Yoga for Strength and Mobility" (`7i5mR-L_wlo`) unless noted.

1. **Level changes without the vinyasa.**
   - Down dog → front shin across → sit into 90/90 → fold → lean onto the opposite hip, step that foot over the other leg, rise into standing splits (13:22).
   - Pigeon → reach back for the back foot (quad stretch) → release, lift the back knee, roll onto the outer edge of the front foot → step behind into wild thing (5:35–5:55).
   - 90/90 → back hand down, lean onto one foot, lift the hip → side plank variation → wild thing (23:26).

   The body travels floor → side → standing, and the route is the interesting part.
2. **Poses as counted reps.**
   - Wild thing with the top knee lowered toward the floor and lifted, five counted (11:51).
   - Figure-four push-ups (7:07).
   - Pulses in lunges and half splits.
   - "Three, two, one" at the end of every hold.

   This builds heat without adding poses, and suits eyes-off practice perfectly.
3. **Rotation.**
   - Revolved half moon.
   - "Functional warrior": warrior one, one arm forward, spiralling the torso around (18:03, 19:52).

   Our flows mostly move forward-back and side to side; his twist through the middle.
4. **Arms layered over legs.** Warrior two held while the arms run through cactus: open the chest, close it, squeeze the forearms, extend, scoop (24:22).
5. **The heat block (17:07–19:52).** Run four times, alternating sides:
   1. hop to a squat;
   2. jump into a split stance;
   3. revolved half moon;
   4. hand down, roll to the side, wild thing;
   5. knee tap;
   6. step through into warrior one with a spiral;
   7. windmill down into the vinyasa.
6. **Strength before range.**
   - Bounces and pulses before holds.
   - Pressing into a block, or lifting the leg out of half splits.
   - Strength straight into extension (L-sit on blocks → camel, in his intermediate strength class).
   - Handstands built as a ladder (fingertip lifts → pike → pike press; wall → freestanding).

**Not suitable by ear:**
- turning to face the back of the mat mid-class;
- the props, the wall and the handstands;
- jumps, unless offered as "step or hop".

## Next: "Spiral" (planned, not built)

About 20 minutes, built on Werner's patterns:

1. **Warm-up through the floor.** Dog → front shin across → 90/90 fold → rise into standing splits → back to dog. Both sides.
2. **Pigeon block.** Pigeon with the quad grab → roll out into wild thing → five counted knee taps → step through to low lunge → warrior two with three cactus pulses → windmill down. Both sides.
3. **Heat block,** stepping by default with an optional hop. Squat → step into split stance → revolved half moon → wild thing → knee tap → warrior one spiral → windmill down → vinyasa. Four rounds, alternating sides, finishing with countdowns.
4. **Cool-down.** 90/90 → hurdler → half frog, then a twist and savasana.

**Model work it needs:**
- **New shapes:** 90/90, figure-four dog, standing splits, revolved half moon, the pigeon quad grab, warrior one, the hurdler and half frog.
- **New moves:** arm-only moves (cactus pulses), counted rep blocks, and a "hold with reps" kind (knee taps inside wild thing).

**Eyes-off risks to solve in the cues:**
- stepping one foot over the other leg into standing splits;
- getting from a split stance into revolved half moon;
- where the support hand goes in the pigeon → wild thing roll.

**Decision pending:** build Spiral as a third flow, or rework Heat along these lines. Roman asked for it all to be written down first.

## Writing rules for yoga lines

**Voice.**
- Breath first, then a short action ("Inhale, right leg up.").
- Short cues rotate after the first time; the second side and later rounds still name the side.
- An occasional personal aside or dry joke: "Thighs talking to you yet? Mine usually start about now." / "I keep my gaze down here; it gives me one less thing to manage."
- Options offered casually; wobbling treated as normal.
- Roman asked for "more personal, a bit more cool, not robotic". Sol flags canned reassurance and forced cool; keep the asides that sound like a person.

**Clarity.**
- Every call names where the hand or foot lands and which leg moves.
- Name the destination pose ("Inhale, rise into high lunge", not "Inhale, rise up").
- Exits from grounded knees lift the knee first.
- Wild thing unwinds through plank.

**Honesty.**
- Science and trivia lines get fact-checked, e.g. "pushing the floor away recruits serratus anterior, among others", not "is serratus".
- No detox or "hips store emotions" claims.
- Wild thing is a modern pose that caught on through Anusara yoga; camatkara means astonishment.

**Safety, always played.**
- Knees down when lowering.
- Come out of pigeon if the front knee complains.
- Side plank or child's pose instead of wild thing, and a squat instead of crow, said *before* the first attempt.
- A wrist break at least every couple of minutes.

## Backlog

- **Spiral**, above.
- **A visual builder:** the current state as a stick figure, the legal next moves ranked by how often the teachers use them, and warnings as you go. Today the builder is text-only.
- **Options as real branches** that the checker proves rejoin at the same state, e.g. "crow or squat", "knees down or full".
- **A pace setting:** our breath phases are 3.5 s in and 4.5 s out at minimum. Some listeners will want slower or faster.
- **Track which way you face the mat**, so turning to the back of the mat could ever be cued safely.
- **More research:** Jonah Kest's own Nike classes (only re-uploads were found), and longer Werner flow classes.
