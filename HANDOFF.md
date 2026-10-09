# Handoff: record the remaining voice lines with Qwen3-TTS on the DGX Spark

Written by a cloud session that can't reach the Spark (it's only reachable through an SSH tunnel
from Roman's laptop). This file is for a Claude Code session **on that laptop** to continue.

## Where things stand

- **App:** Kumbha, a static PWA (vanilla ES modules, no build step). Live at
  <https://breathwork-vibes.apps.rjuro.com>.
- **Branch:** all current work is on `claude/cold-flow-rebuild`. `main` still has the old app,
  and Coolify deploys from this branch.
- **Look:** "Contour" (warm graphite, topographic line art, Cormorant Garamond with Hanken
  Grotesk). The session visual is `js/contour.js`; the earlier design directions are on a canvas
  artboard, row C (the chosen one).
- **Voice packs.** The app picks one pack per session and only offers a pack for a practice when
  that pack covers *every* line the practice can speak, so voices never mix:

  | Pack | Folder | Voice | Coverage | Made with |
  |---|---|---|---|---|
  | `tom` | `audio/cues/` | Tom (LuxTTS, cloned) | every line | `scripts/generate_cues.py` via the RunPod gateway. The **Voice cues** GitHub workflow regenerates it automatically when `js/flows/**`, `js/engine.js` or `scripts/**` change |
  | `gemini` | `audio/cues-gemini/` | Schedar (Gemini 3.8 Flash Lite TTS) | Turn the Tide only | `scripts/generate_cues_gemini.py` (needs `GEMINI_API_KEY`; reportedly capped at ~100 TTS requests/day) |
  | `qwen` | `audio/cues-qwen/` | to choose | **nothing yet**: this is the task | `scripts/generate_cues_spark.py` (new, see below) |

- **Roman's verdict on Gemini:** "really good". The ask now is to record **the rest** with the
  Qwen model on the Spark: free, no daily quota, about 12× real time.

## The task

1. Record every spoken line (all 9 practices plus the teacher's-notes talk, 354 lines, about
   26–32 min of speech) with Qwen3-TTS on the Spark into `audio/cues-qwen/`.
2. Teach the app about the third pack (see "App changes" below; not done yet).
3. Commit, push, deploy.

### 1. Reach the Spark

```sh
ssh -N -L 8881:localhost:8881 spark &
curl -s localhost:8881/health
```

**Known failure:** after a GPU state change the container can fail every request with
`CUDA error: unknown error` while `/health` still says OK.

- Always confirm with a real request:
  `curl -s -X POST localhost:8881/tts -H 'Content-Type: application/json' -d '{"text":"Test.","voice":"narrator_m"}' -o /tmp/t.wav && file /tmp/t.wav`
- If it fails, restart the Qwen container on the Spark.
- Service facts:
  - Voices: `narrator_m`, `narrator_f`, `john`, `jaenette`, `sean`, `default`, `test_voice`, `roman`.
  - Output is 24 kHz.
  - No speed control.
  - Send whole jobs to `/batch` in one call; that's what makes it fast.
- Details are in `TTS-HOWTO.md` from Roman's earlier Spark sessions.

### 2. Pick a voice (cheap, do this first)

```sh
python3 scripts/generate_cues_spark.py --audition narrator_m,narrator_f,roman --line welcome
# writes $TMPDIR/spark-audition/welcome-<voice>.mp3; let Roman listen and choose
```

**Option: one voice across the whole app.** Clone Schedar (the Gemini voice he liked) from its
8.6 s recording of `welcome`, then audition it:

```sh
python3 scripts/generate_cues_spark.py --clone schedar --from-pack gemini --from-line welcome
python3 scripts/generate_cues_spark.py --audition schedar --line welcome
```

Mention to Roman that this clones Google-generated audio; it's his call.

### 3. Record everything

```sh
python3 scripts/generate_cues_spark.py --voice <chosen>      # all 354 lines, one /batch call
```

**What the script does:**

- **Trimming:** cuts edge silence, normalises to −19 LUFS, writes mono 24 kHz mp3 (same treatment as the other packs).
- **Manifest:** writes `audio/cues-qwen/manifest.json` with `{fp, voice, model, duration}` per line. The fingerprint covers voice and text, so re-runs only record new or changed lines.
- **Checks:** flags clips with an implausible length for a calm pace (~2.4 words/s) or a pause over 1.6 s. With `--transcribe` (needs `GEMINI_API_KEY`) it also checks the words against the script using `gemini-3.5-transcribe`.
- **Timing:** finishes by running `node scripts/check_timing.mjs --pack qwen` and prints any cue that lands late or spills past its segment.
- **Re-recording flagged lines:** `--force --only id1,id2`. Also useful: `--flow tide` to limit to one practice.

**Untested against the real service. Verify on the first run:**

- **`/batch` zip names:** the script expects WAVs named `<id>.wav`, falling back to zip order when the count matches. It exits with a clear message if neither holds.
- **`/voices` form fields:** the multipart fields `name`, `audio` (WAV) and `transcript` were taken from the HOWTO's curl example.
- **One big call:** a single 354-item `/batch` call should take about 3 minutes; the HTTP timeout is 1 h. If it's too much, run it per practice with `--flow <id>`. Practice ids: `node -e "import('./js/flows/index.js').then(m=>console.log(m.FLOWS.map(f=>f.id).join(' ')))"`.

### 4. App changes (not done yet)

Roughly an hour of work. Everything here is testable locally with `python3 -m http.server 8765`.

- **`js/audio.js`:** add `qwen: 'audio/cues-qwen'` to `PACKS`, and fetch its manifest in
  `loadManifests()` into `packs.qwen`. `loadCues(ids, pack)` and `packCovers(pack, ids)` already
  take a pack name.
- **`index.html` + `js/app.js`:** the Voice switch (`#speaker-row`, `#speaker`, `#speaker-note`)
  is currently hard-wired to Tom / Gemini.
  - Build its buttons from the packs that cover the current plan's ids: Tom always, then Gemini and Qwen if covered.
  - Label each button from the pack's voice name, e.g. `Schedar · Gemini`, `Narrator · Qwen`.
  - Show the row only when more than one pack is offered.
  - The speaker logic lives in `syncSpeaker()` and in `prepare()` (look for `offerGemini`). The setting is `settings.speaker` (`'tom' | 'gemini'`); add `'qwen'`.
- **`prepareTalk()` in `js/app.js`:** the teacher's-notes "Listen" track always uses Tom. Use the
  chosen pack when it covers the talk's ids.
- **`service-worker.js`:** bump `VERSION`. It's `kumbha-v11` now.
- **Tests worth keeping:** the cloud session used Playwright scripts that checked:
  - which mp3 folder each choice loads from (watch `page.on('request')`);
  - that the switch is hidden where a pack doesn't cover the practice;
  - that the choice survives a reload;
  - that a session starts playing with no console errors.
- **Timing:** `node scripts/check_timing.mjs --pack qwen` should be clean.

### 5. Ship

```sh
git add audio/cues-qwen js index.html service-worker.js README.md
git commit -m "Qwen voice pack (Spark) for every practice"   # descriptive body, no model names
git push origin claude/cold-flow-rebuild
```

- **Deploy.** Coolify does not auto-deploy on push, so call its API. The token is in Roman's local secrets, not in this repo.
  ```sh
  curl -X POST https://coolify.rjuro.com/api/v1/deploy -H "Authorization: Bearer $COOLIFY_TOKEN" \
       -H "Content-Type: application/json" -d '{"uuid":"dso8k8s0w8ckgwc0080wk8k8","force":false}'
  # poll GET https://coolify.rjuro.com/api/v1/deployments/<deployment_uuid> until status=finished
  ```
- **GitHub workflow.** A push touching `scripts/**` or `js/flows/**` triggers the **Voice cues**
  workflow. It may commit Tom recordings to the branch a minute later, so `git pull` before the
  next push.

## House rules

- **Secrets:** never commit any key or token (Gemini, gateway, Coolify).
- **Teacher names:** never mention Dylan Werner, or any named teacher, in the app.
- **Health claims:** keep them honest. The practices are for comfort, not treatment.
  `js/flows/*.js` holds every spoken line inline; change a line there, then run
  `node scripts/export_cues.mjs` to refresh `flow/cues.json`.
- **Timing:** after changing lines or packs, run `node scripts/check_timing.mjs` (and
  `--pack gemini` / `--pack qwen`).

## Other open threads

- **Music:** the Suno slots `ember` (Fire Wave, Hold Ladder) and `night` (Wind Down) are still
  empty. Import with `python3 scripts/add_music.py <file> <slot>`.
- **Branch:** no PR or merge to `main` yet.
- **Spark health check:** an earlier local session offered one that generates a real clip every
  few minutes and restarts the container on failure.
