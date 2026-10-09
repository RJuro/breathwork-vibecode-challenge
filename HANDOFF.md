# Handoff: Kumbha with two coaches (2026-10-09)

## Where things stand

- **App:** Kumbha, a static PWA (vanilla ES modules, no build step). Branch `claude/cold-flow-rebuild`;
  Coolify deploys from it on request (API call below), not on push.
- **Coaches only.** Every practice is led by **Leo** or **Mira**, Gemini 3.8 designed voices (young,
  grounded coaches, light American English; Roman approved the younger versions on 9 Oct). Tom,
  the Gemini preview voice (Schedar), the Qwen "Coach" voice and the nine old practices are retired
  (in git history). There is no Voice switch: a practice plays its own coach's pack.
- **Library = a day arc** (`MOMENTS` in `js/flows/index.js`):

  | Moment | Practice | Coach | File |
  |---|---|---|---|
  | Morning | Reps (breath-counting meditation, 3/5/10 min) | Leo | `js/flows/sit.js` |
  | Before | Box (tactical breath, then box breathing) | Leo | `js/flows/train.js` |
  | After | Cool-down (legs up, long exhales, quiet) | Mira | `js/flows/train.js` |
  | Night | Land (body scan, 3/5/10 min) | Mira | `js/flows/sit.js` |
  | Under the weather | Turn the Tide (hum sets spaced 3+ min, quiet holds) | Mira | `js/flows/weather.js` |
  | Under the weather | Clear Nose (hums, breathe light, pinch-and-nod) | Leo | `js/flows/weather.js` |

- **Scripts** were written by hand, then reviewed by GPT-6.1 Sol via `codex exec` for "human or
  compressed/AI-ish" (verdict and every change: `docs/research/script-review-sol.md`; all 51 edits
  applied). Voice tags (`<sighs>`, `<chuckle>`) are placed by hand only.

## Recording

```sh
export GEMINI_API_KEY=…      # Roman's key: ~/.config/lidtdansk/gemini.env (never commit it)
node scripts/export_cues.mjs
python3 scripts/generate_cues_gemini.py --flow reps --voice leo --pack leo --model gemini-3.8-flash-lite-tts
node scripts/check_timing.mjs
```

Voice specs (design text, stored ids, style, Leo's de-noise filter) are in
`scripts/voices/gemini_voices.json`; new voices are designed with the Danish reader's
`gemini_tts.py`-style `client.voices.create(...)` call (see that repo's PRODUCTION.md). Roman's
account is on Gemini tier 3, so the old ~100 requests/day cap no longer bites.

## Research (in `docs/research/`)

- `coach-voice-genre.md`: how good guided-breathing coaches speak (pace, 15 patterns).
- `sequences-youtube.txt`, `sequences-literature-reddit.txt`: 40+ candidate sequences with exact
  protocols, evidence and safety.
- `breathwrk-features.txt`: Breathwrk's features and reviews, 13 ranked ideas for Kumbha.

## Next

- **Practices on deck:** Ready (Leo, 3 min before a talk/exam/start line), Between Sets (Mira,
  60–90 s), Steady (small holds for over-breathing), Breathe Light + a breath check, a long Wind Down
  (Laborde 2019: 15 min of 4.5 in / 5.5 out), Resonance with "find your pace".
- **App ideas** (Breathwrk research): choose-your-length, a quiet practice log in browser storage,
  "Add to calendar" reminders, a "ready offline" button, vibration on breath turns (Android).
- **Service worker:** it wipes every cache on a version bump, including cue audio; keep versioned
  (`?v=`) audio in its own long-lived cache.

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
