# Handoff: Breathe-up (formerly Kumbha), two coaches

## Where things stand

- **App:** Breathe-up (renamed from Kumbha on 11 Oct 2026; storage keys and cache names still say `kumbha`, keep them so logs and saved audio survive), a static PWA (vanilla ES modules, no build step). Branch `claude/cold-flow-rebuild`;
  Coolify deploys from it on request (API call below), not on push.
- **Coaches only.** Every practice is led by **Leo** or **Mira**, Gemini 3.8 designed voices (young,
  grounded coaches, light American English; Roman approved the younger versions on 9 Oct). Tom,
  the Gemini preview voice (Schedar), the Qwen "Coach" voice and the nine old practices are retired
  (in git history). There is no Voice switch: a practice plays its own coach's pack.
- **Library = Retention + a day arc** (`MOMENTS` in `js/flows/index.js`). Retention added 11 Oct 2026
  after Roman asked for 15–25 min sessions focused on holds (and the return of the plane/train one):

  | Moment | Practice | Coach | File |
  |---|---|---|---|
  | Retention | Kumbhaka (ratio 1:2:1.5:1, up to 8·16·12·8) | Leo | `js/flows/retain.js` |
  | Retention | Hold Ladder (First urge, or CO₂ table 8 × 0:45/1:00) | Leo | `js/flows/retain.js` |
  | Retention | Rounds (30 breaths, capped empty hold, recovery breath) | Mira | `js/flows/retain.js` |
  | Retention | Alternate Nostril with 1:4:2 holds | Mira | `js/flows/retain.js` |
  | Morning | Reps (breath-counting meditation, 3/5/10 min) | Leo | `js/flows/sit.js` |
  | Before | Box (tactical breath, then box breathing) | Leo | `js/flows/train.js` |
  | After | Cool-down (legs up, long exhales, quiet) | Mira | `js/flows/train.js` |
  | Night | Land (body scan, 3/5/10 min) | Mira | `js/flows/sit.js` |
  | Under the weather | Turn the Tide (hum sets spaced 3+ min, quiet holds) | Mira | `js/flows/weather.js` |
  | Under the weather | Clear Nose (hums, breathe light, pinch-and-nod) | Leo | `js/flows/weather.js` |
  | On the move | Window Seat (headache on a plane/train; Plane/Train pauses) | Mira | `js/flows/retain.js` |

- **Scripts** were written by hand, then reviewed by GPT-6.1 Sol via `codex exec` for "human or
  compressed/AI-ish" (verdict and every change: `docs/research/script-review-sol.md`; all 51 edits
  applied). Voice tags (`<sighs>`, `<chuckle>`) are placed by hand only.

## Recording

```sh
export GEMINI_API_KEY=…      # Roman's key: ~/.config/lidtdansk/gemini.env (never commit it)
node scripts/export_cues.mjs
python3 scripts/generate_cues_gemini.py --flow reps --voice leo --pack leo --model gemini-3.8-flash-lite-tts
node scripts/check_timing.mjs            # late / spills / repeat dropped / off-phase
node scripts/session_script.mjs box --level standard   # a practice as heard, phase by phase
```

Several recorders can share a pack (manifest writes merge), e.g. one `--flow` per process.

**Session rules** (Roman, 13 Oct 2026, after a Kumbhaka run; every practice was rebuilt to them on
14 Oct, Kumbhaka as the model):

- Phase calls on every slow breath (`calls: LEO` / `MIRA`). Each coach has four wordings per phase that
  rotate. Fast breathing is called only until the rhythm is set, then the coach gives markers.
- Before a hold sequence: one breath in together, all the way out; the next breath in starts it.
- Named own-pace breaks between sequences (labelled rests, `label: 'Your own pace'`).
- Nothing said twice (the engine drops repeats; only `count` lines repeat).
- Every content line fits its breath phase (`phase:` on the cue; `off-phase` in check_timing if not).
- Deeper content is a connected `lesson` thread over consecutive holds or breaths. Keep the science, extend it.
- Listener state (Roman, 14 Oct, after "some things are weird"): walk each session as the listener (posture, eyes,
  hands, what they're doing, how they feel) and say what they'd want to know at that moment: a reason, a mechanism,
  a surprising true detail. No "open your eyes" unless they were offered to close them; never undercut an instruction
  with a caveat (evidence limits go once in `learn`); no fragments; safety lines in proportion to the holds.
  Process that worked: Sol rewrite per flow file, then blind listener reviews (subagents reading
  `session_script.mjs` output), then Sol applies them, then a hand pass.

Voice specs (design text, stored ids, style, Leo's de-noise filter) are in
`scripts/voices/gemini_voices.json`; new voices are designed with the Danish reader's
`gemini_tts.py`-style `client.voices.create(...)` call (see that repo's PRODUCTION.md). Roman's
account is on Gemini tier 3, so the old ~100 requests/day cap no longer bites.

## Yoga (14 Oct 2026)

The full write-up (model, research, what's creative in the teachers' sequencing, the planned
"Spiral" flow, writing rules, backlog) is in `docs/yoga.md`.

A separate library area (`#/yoga`, tabs at the top of the library; `MOMENTS[].area`, `AREAS` in
js/flows/index.js). Practices (js/flows/yoga.js, both voiced by Leo, music off unless switched on per
practice: the practice page has a No music / Music switch, `musicFor` in settings):

- **Fifteen**: the basic flow, about 15 min.
- **Heat**: warming, about 22 min. Crossunders, squat-and-chair salutations, standing rounds (knee
  taps; warrior three to half moon with a squeeze; side plank flipped into wild thing), crow or a
  squat, lizard, twist, savasana. Reviewed by Sol for eyes-off clarity, facts and voice.

Coach names are internal: never in spoken lines or UI copy.

It runs on a deterministic model of the practitioner (js/yoga.js): a body state (base, each foot,
each hand, heel, spine), moves with preconditions and a next state, cues that name the side from the
state, `bothSides()` for mirrored blocks, and holds whose lines are tied to a pose. A program compiles
to ordinary engine steps (one breath phase per move, a labelled rest per hold), sized to the recorded
cue lengths and to the talk level.

```sh
node scripts/yoga_check.mjs [--full]   # pose and side after every move, and the checks
```

Checks: every move follows from the state, breath alternates in a flowing run, the same moves and
held time on both sides (mirrored holds are paired), the longest stretch on the wrists, savasana at
least 90 s, every hold line spoken in its pose. A move's full cue plays the first time it's made; the
second side and later rounds get short ones that still name the side; `min` keeps technical
transitions from being rushed.
Research behind it (local only, not in git): `docs/research/yoga/maps/` (16 classes, mapped from captions:
transitions, arcs, cue patterns). Not yet: a visual builder, more programs, options/branches.

## Research (in `docs/research/`)

- `coach-voice-genre.md`: how good guided-breathing coaches speak (pace, 15 patterns).
- `sequences-youtube.txt`, `sequences-literature-reddit.txt`: 40+ candidate sequences with exact
  protocols, evidence and safety.
- `breathwrk-features.txt`: Breathwrk's features and reviews, 13 ranked ideas for Kumbha.

## Next

- **Built 11 Oct 2026:** Ready, Resonance (+ Find your pace), Between Sets, Lights Out, Breath Check,
  Breathe Light, Steady (`js/flows/daily.js`); history chart, CSV export, offline save, calendar
  reminder, vibration, Again. Teacher's notes are no longer read aloud (Roman: nobody listens to
  them first); their tips are folded into *How it works*. Recorded audio lives in the `kumbha-audio`
  cache, which survives version bumps.
- **Still open from the research:** Cold Rinse (cold-shower breathing), Breath-hold Walk, Level (the
  4-week slow-and-shallow ladder for panic), Step Down (10-8-6), Run Rhythm, Cooling Breath.
- **Ideas:** contraction tap-logging in Hold Ladder; tables that rescale to a new First-urge best.

## Deploy

```sh
curl -X POST https://coolify.rjuro.com/api/v1/deploy -H "Authorization: Bearer $COOLIFY_TOKEN" \
     -H "Content-Type: application/json" -d '{"uuid":"dso8k8s0w8ckgwc0080wk8k8","force":false}'
```

## Spark (still useful, no longer in the app)

- Parakeet transcription: `~/parakeet/transcribe.py` on the AIDK Spark (YouTube ids or audio files;
  IPv4 forced for YouTube).
- Qwen3-TTS on port 8881 has no length cap: a runaway clip can fill all 121 GB; restart with
  `docker restart qwentts`.

## House rules

No secrets in the repo. No real teachers or brands named in the app. Health claims honest: comfort,
not treatment.
