# Kumbha · breath & retention

Guided pranayama and breath-hold practices, voiced by **Tom** (LuxTTS on RunPod), timed to
the second, with honest notes on what the science does and doesn't show. Live at
<https://breathwork-vibes.apps.rjuro.com>.

Static site, no build step:

```sh
python3 -m http.server 8000   # then http://localhost:8000
```

## Practices

| Practice | Tag | What it is | Length |
|---|---|---|---|
| **Turn the Tide** | Under the weather | Dylan Werner-style wave: nasal ladder, humming, three kapalabhati rounds with lengthening holds, cool-down | 15 min |
| **Clear Nose** | Under the weather | Breathe light, McKeown's pinch-and-nod nose-unblocking exercise (kept to moderate air hunger), five hums | 8 min |
| **Fire Wave** | Energy | Ujjayi warm-up, three short rounds of breath of fire sealed with full-lung holds and bandhas | 8 min |
| **Hold Ladder** | Long holds | A freediver's dry CO₂ table: six holds of the same length, rests shrinking 1:30 → 0:15 | 12 min |
| **Resonance** | Calm | Six light breaths a minute (4 in · 6 out), the best-studied calming practice | 9 min |
| **Cyclic Sighing** | Calm | Double inhale, long mouth exhale, five minutes (Balban et al. 2023) | 6 min |
| **Alternate Nostril** | Calm | Nadi shodhana, 4:4 then 4:8, with the nostril shown on every phase | 9 min |
| **Window Seat** | On the move | Silent, seated practice for a headache on a plane or train: soften jaw/brow/shoulders, 4:6 breathing, five soft pauses on two-thirds-full lungs (Plane ≤15 s, Train ≤25 s, or none) | 15 min |
| **Wind Down** | Sleep | Lengthening exhales, four rounds of Weil's 4-7-8, then drift | 7 min |

Practices with holds offer **Gentle / Standard / Deeper**; Turn the Tide and Clear Nose also
have **No holds** (no fast breathing, no retention). Tom announces what's coming ("Forty quick
breaths", "Hold, lungs empty, for up to one minute", "Rest, forty-five seconds") but never
counts every breath. *Breathe now* ends any hold and skips the rest of that retention block
into normal breathing. Spoken science notes are off by default (Settings → Explanations); every
practice has a *How it works* page with evidence labels and sources. The summary shows
*guided* hold time, worked out from the timeline, not a measurement of your breath.

## How it's built

- `js/flows/*.js`: each practice as data (talk, rest, paced breathing, holds) with its spoken
  lines inline; `lib.js` has the shared lines, number words and hold helpers.
- `js/engine.js`: compiles a practice into a timeline; maps time → orb, phase label, caption.
- `js/audio.js`: decodes Tom's cues and the practice's music, synthesises breath/hum/bell
  sounds, and mixes the whole session into **one WAV track** (keeps playing with the screen
  locked; the visuals follow its `currentTime`).
- `js/app.js`: library, practice page, session, settings.

## Voice cues (LuxTTS · tom)

```sh
node scripts/export_cues.mjs          # collect every line, all practices × intensities → flow/cues.json
export QWEN_TTS_API_KEY=…             # the gateway's GATEWAY_API_KEY
python3 scripts/generate_cues.py      # render only new or changed lines into audio/cues/
```

The **Voice cues** GitHub workflow does both whenever `js/flows/**` changes (repository secret
`QWEN_TTS_API_KEY` or `GATEWAY_API_KEY`) and commits the results. Lines without a recording
fall back to the device's voice.

## Music

Import a track (e.g. a Suno download) into a slot:

```sh
python3 scripts/add_music.py ~/Downloads/track.mp3 tide --end 222
```

It moves the track into A major with the smallest pitch shift (the app's drone, bells and hum
guide are in A), trims, fades, converts to mono and updates `audio/music/manifest.json`.
Slots: `tide` (calm and under-the-weather practices; added: *A-Frame Stillness*), `ember`
(Fire Wave, Hold Ladder), `night` (Wind Down), `transit` (Window Seat, falling back to `tide`). Tracks are mixed to mono, level-matched, looped with a 6 s crossfade
and ducked under the voice; without a track the app plays a soft drone.

## Safety

Seated or lying down only. Never in or near water or while driving. Skip fast breathing and
long holds if pregnant, epileptic, or living with heart disease or high blood pressure, and
keep holds comfortable during an active cold. Not medical advice; not affiliated with the
teachers whose methods inspired these practices.
