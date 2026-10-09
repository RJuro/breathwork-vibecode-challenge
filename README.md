# Kumbha · breath & attention

Short breathing practices and meditations for the moments of the day, led by two coaches,
**Leo** and **Mira**, timed to the second, with honest notes on what the science does and doesn't
show. Live at <https://breathwork-vibes.apps.rjuro.com>.

Static site, no build step:

```sh
python3 -m http.server 8000   # then http://localhost:8000
```

## Practices

The library is a day arc: Morning, Before, After, Night, and Under the weather (`MOMENTS` in
`js/flows/index.js`). Every practice has its own instructor and plays only that voice.

| Practice | Moment | Coach | What it is | Length |
|---|---|---|---|---|
| **Reps** | Morning | Leo | Meditation: count out-breaths one to ten, start over when you drift. 3 / 5 / 10 min | 5 min |
| **Box** | Before | Leo | The tactical breath (4 in · 8 out), then box breathing 4-4-4-4 → 5-5-5-5 (Gentle 3→4, Deeper 5→6, or No holds) | 7 min |
| **Cool-down** | After | Mira | Legs up after training, 4:6 then 4:8 counted, two quiet minutes | 9 min |
| **Land** | Night | Mira | Meditation: a body scan, feet to head, lying down. 3 / 5 / 10 min | 6 min |
| **Turn the Tide** | Under the weather | Mira | Nasal ladder, three short hum sets spaced for the sinuses to refill, three kapalabhati rounds with quiet holds, cool-down | 16 min |
| **Clear Nose** | Under the weather | Leo | Three hums, breathe light, three pinch-and-nod holds (moderate air hunger at most), three hums | 9 min |

The scripts follow what the research on good guided-breathing coaches showed: say little, a label
and then the instruction, near-silent holds with the coaching in the recovery, sensations named as
allowed rather than promised, and one mechanism plus honest caveats for the science. **How much
your coach says** is a setting: Quiet (instructions and counts), Guided (plus tips), Full (plus the
science). Each practice page has **Teacher's notes** (`js/flows/notes.js`) with a **Listen** button
that plays the coach reading them (`js/flows/talk.js`), plus a *How it works* page with evidence
labels and sources. *Breathe now* ends any hold.

## How it's built

- `js/flows/*.js`: each practice as data (talk, rest, paced breathing, holds) with its spoken lines
  inline (`sit.js` Reps and Land, `train.js` Box and Cool-down, `weather.js` Turn the Tide and Clear
  Nose); `lib.js` has number words and hold helpers.
- `js/engine.js`: compiles a practice into a timeline; maps time → visual, phase label, caption.
- `js/audio.js`: decodes the coach's cues and the practice's music, synthesises breath/hum/bell
  sounds, and mixes the whole session into **one WAV track** (keeps playing with the screen
  locked; the visuals follow its `currentTime`).
- `js/contour.js`: the look and the session visual, *Contour*; `js/motifs.js` has the tile drawings.
- `js/app.js`: library, practice page, session, settings.

## Voices

**Leo** and **Mira** are Gemini 3.8 designed voices: young, grounded coaches, light relaxed American
English. Their descriptions, stored ids, delivery style and any clean-up filter are in
`scripts/voices/gemini_voices.json` (Leo's has a light de-noise). Each records into its own pack,
`audio/cues-leo/` and `audio/cues-mira/`.

```sh
node scripts/export_cues.mjs                 # every spoken line → flow/cues.json
export GEMINI_API_KEY=…
python3 scripts/generate_cues_gemini.py --flow box --voice leo --pack leo --model gemini-3.8-flash-lite-tts
node scripts/check_timing.mjs                 # every practice, in its coach's pack
```

The script records only new or changed lines, checks each clip's words with a transcription model,
its length and its pauses, and retakes a failed clip once. Lines are written by hand and may carry
Gemini voice tags placed by hand (`<sighs>`, `<chuckle>`); captions and on-device speech drop them
(`plain()` in `js/engine.js`).

## Music

Import a track (e.g. a Suno download) into a slot:

```sh
python3 scripts/add_music.py ~/Downloads/track.mp3 tide
```

It moves the track into A major with the smallest pitch shift (the app's drone, bells and hum
guide are in A), cuts it where the level matches the opening so the loop is seamless, converts
to mono and updates `audio/music/manifest.json`.
Slots: `tide` (Cool-down, Land, Turn the Tide, Clear Nose; added: *A-Frame Stillness*) and `transit`
(Reps, Box; added: *Pink Noise Cocoon*). Tracks are mixed to mono, level-matched, looped with a 6 s crossfade
and ducked under the voice; without a track the app plays a soft drone.

## Safety

Seated or lying down only. Never in or near water or while driving. Skip fast breathing and
long holds if pregnant, epileptic, or living with heart disease or high blood pressure, and
keep holds comfortable during an active cold. Not medical advice.
