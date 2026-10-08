#!/usr/bin/env python3
"""Generate the spoken cues in flow/cues.json with LuxTTS (voice "tom") on RunPod.

Goes through the runpod-qwen-tts gateway (POST /v1/jobs, engine "lux"), one job per
cue, then trims edge silence and loudness-normalises each clip with ffmpeg so every
cue sits at the same level in the mix. Only cues whose text changed are regenerated
(tracked in audio/cues/manifest.json).

    export QWEN_TTS_API_KEY=...            # the gateway's GATEWAY_API_KEY
    python3 scripts/generate_cues.py        # changed / missing cues only
    python3 scripts/generate_cues.py --force --only hum_intro,close_1

Stdlib only; ffmpeg is optional but recommended.
"""

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CUES = ROOT / "flow" / "cues.json"
OUT = ROOT / "audio" / "cues"
MANIFEST = OUT / "manifest.json"

BASE = os.environ.get("QWEN_TTS_URL", "https://qwen-tts.apps.rjuro.com").rstrip("/")
KEY = os.environ.get("QWEN_TTS_API_KEY") or os.environ.get("GATEWAY_API_KEY", "")


def api(method, path, body=None, raw=False):
    req = urllib.request.Request(
        BASE + path,
        method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                data = r.read()
                return data if raw else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503, 504) and attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {e.read()[:300]!r}") from None
        except urllib.error.URLError:
            if attempt < 4:
                time.sleep(2 ** attempt)
                continue
            raise


def spoken(text):
    """What the TTS should read: drop caption-only markup, keep [PAUSE:x]."""
    return re.sub(r"\s+", " ", text.replace("*", "")).strip()


def fingerprint(text, voice, engine):
    return hashlib.sha1(f"{voice}|{engine}|{spoken(text)}".encode()).hexdigest()[:12]


def synth(cue_id, text, voice, engine, timeout=900):
    job = api("POST", "/v1/jobs", {
        "text": spoken(text),
        "voice": voice,
        "engine": engine,
        "options": {"gap": 0.35, "section_gap": 0.6},
    })
    job_id, t0 = job["job_id"], time.time()
    while True:
        st = api("GET", f"/v1/jobs/{job_id}")
        if st["status"] == "READY":
            return api("GET", f"/v1/audio/{job_id}.mp3", raw=True), st.get("flagged_chunks") or []
        if st["status"] == "FAILED":
            raise RuntimeError(f"{cue_id}: job failed: {st.get('error')}")
        if time.time() - t0 > timeout:
            raise RuntimeError(f"{cue_id}: timed out in {st['status']}")
        time.sleep(2)


def polish(src: Path, dst: Path):
    """Trim edge silence, normalise to -19 LUFS, mono 24 kHz mp3."""
    if not shutil.which("ffmpeg"):
        shutil.copyfile(src, dst)
        return
    trim = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,"
            "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15,areverse")
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", "-i", str(src),
        "-af", f"{trim},loudnorm=I=-19:TP=-2:LRA=7,afade=t=in:d=0.02",
        "-ac", "1", "-ar", "24000", "-b:a", "64k", str(dst),
    ], check=True)


def duration(path: Path):
    if not shutil.which("ffprobe"):
        return None
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    try:
        return round(float(out.stdout.strip()), 2)
    except ValueError:
        return None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--voice", default="tom")
    ap.add_argument("--engine", default="lux", choices=["lux", "qwen"])
    ap.add_argument("--only", help="comma-separated cue ids")
    ap.add_argument("--force", action="store_true", help="regenerate even if unchanged")
    ap.add_argument("--jobs", type=int, default=4, help="parallel jobs")
    ap.add_argument("--dry-run", action="store_true", help="list what would be generated")
    args = ap.parse_args()

    cues = json.loads(CUES.read_text())
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    only = set(args.only.split(",")) if args.only else None

    todo = []
    for cid, cue in cues.items():
        if only and cid not in only:
            continue
        fp = fingerprint(cue["text"], args.voice, args.engine)
        if not args.force and manifest.get(cid, {}).get("fp") == fp and (OUT / f"{cid}.mp3").exists():
            continue
        todo.append((cid, cue["text"], fp))

    stale = [p for p in OUT.glob("*.mp3") if p.stem not in cues]
    print(f"{len(cues)} cues, {len(todo)} to generate with {args.engine}/{args.voice}"
          + (f", {len(stale)} stale files" if stale else ""))
    if args.dry_run:
        for cid, text, _ in todo:
            print(f"  {cid}: {spoken(text)[:90]}")
        return
    if KEY:
        # Fail fast on a bad key or a missing voice/engine, even when nothing needs generating.
        info = api("GET", "/v1/voices")
        if args.voice not in info.get("voices", []) or args.engine not in info.get("engines", [args.engine]):
            sys.exit(f"gateway has no {args.engine}/{args.voice}: {info}")
        print(f"gateway ok: {args.engine}/{args.voice} available")
    if not todo:
        return
    if not KEY:
        sys.exit("QWEN_TTS_API_KEY is not set (the gateway's GATEWAY_API_KEY).")

    OUT.mkdir(parents=True, exist_ok=True)
    failures = []
    with tempfile.TemporaryDirectory() as tmp, ThreadPoolExecutor(args.jobs) as pool:
        futs = {pool.submit(synth, cid, text, args.voice, args.engine): (cid, fp) for cid, text, fp in todo}
        for fut in as_completed(futs):
            cid, fp = futs[fut]
            try:
                audio, flagged = fut.result()
            except Exception as e:  # keep going; report at the end
                failures.append(cid)
                print(f"  ✗ {cid}: {e}", file=sys.stderr)
                continue
            raw = Path(tmp) / f"{cid}.raw.mp3"
            raw.write_bytes(audio)
            dst = OUT / f"{cid}.mp3"
            polish(raw, dst)
            manifest[cid] = {"fp": fp, "voice": args.voice, "engine": args.engine, "duration": duration(dst)}
            note = f"  (flagged chunks: {len(flagged)})" if flagged else ""
            print(f"  ✓ {cid}  {manifest[cid]['duration']}s{note}")
            MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")

    for p in stale:
        p.unlink()
        manifest.pop(p.stem, None)
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
    if failures:
        sys.exit(f"{len(failures)} cue(s) failed: {', '.join(failures)}")


if __name__ == "__main__":
    main()
