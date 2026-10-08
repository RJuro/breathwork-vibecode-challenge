# Kumbha · Turn the Tide

A 15-minute guided pranayama flow with long breath holds, for the first scratchy-throat
day of a cold. It's shaped like Dylan Werner's *breath sequence* (warm up → build heat →
retention → cool down → check in) and voiced by **Tom** (LuxTTS on RunPod).

Static site, no build step: open `index.html` through any web server.

```sh
python3 -m http.server 8000   # then http://localhost:8000
```

## The flow (Standard)

| Section | What happens | Time |
|---|---|---|
| Arrive | Nasal breathing cues; a sama-vritti ladder, 4:4 → 5:5 → 6:6 | 2:13 |
| Hum | Five bhramari hums (nasal nitric oxide) | 1:50 |
| Round 1 | 30 kapalabhati · 45 s hold out · 20 s hold in with root lock | 2:15 |
| Round 2 | 40 kapalabhati · 1:00 hold out · 25 s hold in | 2:46 |
| Round 3 | 45 kapalabhati · 1:15 hold out · 30 s hold in | 3:04 |
| Cool down | 4:8 breathing, three more hums (spaced, so NO has recovered), stillness | 2:46 |

**Gentle** swaps the kapalabhati for slow breaths and shortens the empty holds (use it with
a fever). **Deeper** stretches the empty holds to 1:00 / 1:20 / 1:40. *Breathe now* ends
any empty hold early.

Spoken comments on technique and the science are tagged in the captions. The *How it
works* sheet has the longer version, with evidence labels and sources. It's honest that no
trial has tested breathwork against colds.

## How it's built

- `js/flow.js`: the session as data (talk, rest, paced breathing, holds, cue timings).
- `flow/cues.json`: every spoken line, used by both the app and the TTS script.
- `js/engine.js`: compiles the flow into a timeline and maps time to orb, phase and caption.
- `js/audio.js`: decodes the cues, synthesises breath, hum, bell and drone clips, and
  mixes the whole session into **one WAV track**. That track keeps playing with the
  screen locked, and the visuals follow its `currentTime`.
- `js/app.js`: UI. `js/learn.js`: the *How it works* content.

## Voice cues (LuxTTS · tom)

Cues are generated through the [runpod-qwen-tts](https://github.com/RJuro/runpod-qwen-tts)
gateway with `engine: "lux"`, `voice: "tom"`, then trimmed and loudness-normalised
(−19 LUFS) with ffmpeg; the files live in `audio/cues/`. Any cue missing from
`audio/cues/manifest.json` falls back to the device's own voice.

```sh
export QWEN_TTS_API_KEY=…            # the gateway's GATEWAY_API_KEY
python3 scripts/generate_cues.py     # only new or changed lines
python3 scripts/generate_cues.py --dry-run
```

Or add `QWEN_TTS_API_KEY` as a repository secret and run the **Voice cues** workflow
(it also runs whenever `flow/cues.json` changes, and commits the mp3s).

## Safety

Seated or lying down only. Never in or near water or while driving. Skip the fast
breathing (use Gentle) if pregnant, epileptic, or living with heart disease or high blood
pressure. Not medical advice; not affiliated with Dylan Werner.
