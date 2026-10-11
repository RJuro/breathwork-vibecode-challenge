# Breathe-up · breath & retention

Breath-retention training (15–25 min) and short practices for the moments of the day, led by two coaches,
**Leo** and **Mira**, timed to the second, with honest notes on what the science does and doesn't
show. Live at <https://breathwork-vibes.apps.rjuro.com>.

Static site, no build step:

```sh
python3 -m http.server 8000   # then http://localhost:8000
```

## Practices

The library opens with Retention, the long sessions, then a day arc: Morning, Before, After, Night,
Training, Breathe light, Under the weather, and On the move (`MOMENTS` in `js/flows/index.js`). Every practice has its own
instructor and plays only that voice.

| Practice | Moment | Coach | What it is | Length |
|---|---|---|---|---|
| **Kumbhaka** | Retention | Leo | Ratio retention, in · hold · out · hold at 1 : 2 : 1.5 : 1, stepping up 4·8·6·4 → 6·12·9·6 → 8·16·12·8 (Deeper to 10·20·15·10) | 18 min |
| **Hold Ladder** | Retention | Leo | Freediving table on dry land: First urge (6 holds, tap to end, 2:00 rests) or a CO₂ table (8 × 0:45 / 1:00, rests 2:00 → 0:30), recovery breaths after each hold | 19–23 min |
| **Rounds** | Retention | Mira | 30 full breaths, an empty hold you end yourself (capped 0:45 → 1:15), a 15 s recovery breath; four rounds, then 4:6 and quiet | 19 min |
| **Alternate Nostril** | Retention | Mira | Nadi shodhana, then holds at 1 : 4 : 2 (3·12·6 → 4·16·8, Deeper 5·20·10), breath sound panned to the open side | 16 min |
| **Reps** | Morning | Leo | Meditation: count out-breaths one to ten, start over when you drift. 3 / 5 / 10 min | 5 min |
| **Box** | Before | Leo | The tactical breath (4 in · 8 out), then box breathing 4-4-4-4 → 5-5-5-5 (Gentle 3→4, Deeper 5→6, or No holds) | 7 min |
| **Ready** | Before | Leo | Pre-performance routine: two sighs, 4:8, box, a first step. Desk / Stage (adds hums) / Start line (standing, no holds) | 3–4 min |
| **Resonance** | Before | Leo | Six-a-minute slow breathing, ten minutes, quiet at the end; **Find your pace** tries 6.5 → 4.5 a minute, then pick one as the level | 12 / 15 min |
| **Between Sets** | Training | Mira | A rest timer (1:00 / 1:30 / 2:00 / 3:00): hands on knees, free breathing, then 4:6 through the nose; "Again" for the next rest | 1–3 min |
| **Cool-down** | After | Mira | Legs up after training, 4:6 then 4:8 counted, two quiet minutes | 9 min |
| **Land** | Night | Mira | Meditation: a body scan, feet to head, lying down. 3 / 5 / 10 min | 6 min |
| **Lights Out** | Night | Mira | 4.5 in / 5.5 out with pursed lips in bed, a body sweep, then the voice goes quiet (Laborde 2019). 10 / 15 / 20 min | 15 min |
| **Breath Check** | Breathe light | Leo | Control pause (hold to the first urge) and slowest exhale; logged, charted as a trend | 3–5 min |
| **Breathe Light** | Breathe light | Leo | Small holds, then rounds of barely-there 6-a-minute breathing with mild air hunger (asthma-clinic retraining) | 9–19 min |
| **Steady** | Breathe light | Mira | Ten tiny holds after a normal breath out, then small 3:6 breathing, for over-breathing and panic spikes | 7 min |
| **Turn the Tide** | Under the weather | Mira | Nasal ladder, three short hum sets spaced for the sinuses to refill, three kapalabhati rounds with quiet holds, cool-down | 16 min |
| **Clear Nose** | Under the weather | Leo | Three hums, breathe light, three pinch-and-nod holds (moderate air hunger at most), three hums | 9 min |
| **Window Seat** | On the move | Mira | Silent, seated practice for a headache on a plane or train: soften, 4:6 breathing, then soft pauses (Plane 5 × 15 s, Train 0:30 → 1:00, or none) | 16–19 min |

Every finished session is logged in browser storage on the device (`kumbha-log`): time, level and
seconds spent holding the breath (holds plus the held phases of paced breathing). The library shows
this week's total, a practice page its last three sessions, the Done screen today's total against
last time.

The scripts follow what the research on good guided-breathing coaches showed: say little, a label
and then the instruction, near-silent holds with the coaching in the recovery, sensations named as
allowed rather than promised, and one mechanism plus honest caveats for the science. **How much
your coach says** is a setting: Quiet (instructions and counts), Guided (plus tips), Full (plus the
science). Each practice has a *How it works* page with technique, evidence labels, sources and, for
some, the teacher's tips (`js/flows/notes.js`). *Breathe now* ends any hold.

Motion (`ContourArt` in `js/contour.js`, "Tile motion" in `styles.css`): the home and practice-page
maps draw themselves in and breathe at six a minute, each ring lagging the one inside it, with light
runners on the index lines and a pointer tilt; the session map shares that look at the same scale. Tiles
reveal as they scroll into view, and every tile drawing acts out its practice on hover. All of it is
static under prefers-reduced-motion.

Also in the app: a chart of each practice's number over the last 20 sessions (seconds held; Breath
Check charts its control pause), CSV export of the log and **Save audio for offline** in Settings,
a daily calendar reminder (an `.ics` file) on each practice page, optional vibration on breath turns
(Android), and *Again* on the Done screen. Practices with their own level keys (Ready's modes,
Resonance's paces, Between Sets' rest lengths) read `opts.level`; `optsOf(level)` builds the options.

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
Each practice names a small pool of beds (`music: ['night', 'deep']`), and each new session of
that practice plays the next one that exists (by its count in the log), so long practices don't
always sound the same. Beds: `night` (Suno: *After the Party*), `focus` (Suno: *A Major Morning*),
`tide` (*A-Frame Stillness*), `transit` (*Pink Noise Cocoon*), and five recorded from **Lyria
RealTime** (`~/Desktop/kumbha-music/realtime/record.py`, outside the repo): `deep`, `dusk`, `keys`,
`terrace`, `swell`. RealTime is instrumental only and has real controls, so drums are muted, density
and brightness kept low, and the key locked to A major / F♯ minor; prompts are short weighted phrases,
crossfaded over the recording. (Lyria 3.5 song generation was dropped: it has no exclusion controls,
added beats and even spoken tags, and its output carries DC offset and sub-bass rumble.)
`add_music.py` low-cuts at 35 Hz and limits peaks; prefer `--shift 0` for RealTime beds.
Tracks are mixed to mono, level-matched, looped with a 6 s crossfade
and ducked under the voice; without a track the app plays a soft drone.

## Safety

Seated or lying down only. Never in or near water or while driving. Skip fast breathing and
long holds if pregnant, epileptic, or living with heart disease or high blood pressure, and
keep holds comfortable during an active cold. Not medical advice.
