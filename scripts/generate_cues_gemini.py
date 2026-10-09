#!/usr/bin/env python3
"""Record one practice's spoken lines with Gemini TTS, as an alternative voice pack.

Writes audio/cues-gemini/<id>.mp3 and audio/cues-gemini/manifest.json (same shape as the
Tom pack). The app uses this pack for a practice only when it covers every line that
practice can speak, so voices never mix within a session.

    export GEMINI_API_KEY=...
    python3 scripts/generate_cues_gemini.py --audition Schedar,Algieba,Sulafat,Vindemiatrix --line welcome
    python3 scripts/generate_cues_gemini.py --flow tide --voice Schedar
    python3 scripts/generate_cues_gemini.py --flow tide --voice Schedar --only hum_intro --force

Gemini 3.8 reads the request text verbatim, so delivery goes in speech_metadata.style (kept
short and identical for every line; long direction makes the voice drift) and a fixed seed
keeps takes repeatable. Every clip is checked: its words against a transcript
(gemini-3.5-transcribe), its length against a calm pace, and its longest internal pause.
A clip that fails gets a retake with a new seed (--retries) and the closest take is kept.
Token use and an estimated cost are printed at the end. Stdlib + ffmpeg.
"""
import argparse
import base64
import difflib
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CUES = ROOT / "flow" / "cues.json"
TOM = ROOT / "audio" / "cues" / "manifest.json"
OUT = ROOT / "audio" / "cues-gemini"
MANIFEST = OUT / "manifest.json"
API = "https://generativelanguage.googleapis.com/v1beta/models"
KEY = os.environ.get("GEMINI_API_KEY", "")

# Price per 1M tokens for gemini-3.8-flash-lite-tts (text in, audio out; 25 audio tokens a
# second), through 2026. Only used for the spend report.
PRICE = {"in": 0.50, "out": 6.00}

# Gemini 3.8 TTS reads `text` verbatim, so delivery goes in speech_metadata.style. Keep it
# short and identical for every line: longer direction makes the voice drift between calls.
STYLE = "calm, warm, soft, unhurried"
SEED = 7


def spoken(text):
    return re.sub(r"\s+", " ", text.replace("*", "")).strip()


def fingerprint(text, voice, model):
    return hashlib.sha1(f"{model}|{voice}|{STYLE}|{SEED}|{spoken(text)}".encode()).hexdigest()[:12]


usage = {"in": 0, "out": 0, "calls": 0}


def call(model, body, timeout=120):
    req = urllib.request.Request(
        f"{API}/{model}:generateContent",
        data=json.dumps(body).encode(),
        headers={"x-goog-api-key": KEY, "Content-Type": "application/json"},
    )
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=timeout) as r:
                data = json.loads(r.read())
            meta = data.get("usageMetadata", {})
            usage["in"] += meta.get("promptTokenCount", 0)
            usage["out"] += meta.get("candidatesTokenCount", 0)
            usage["calls"] += 1
            return data
        except urllib.error.HTTPError as e:
            msg = e.read()[:400].decode(errors="replace")
            if e.code == 429 and "PerDay" in msg:
                raise RuntimeError(f"{model}: daily request quota used up; run again tomorrow (done lines are kept)") from None
            if e.code in (429, 500, 502, 503, 504) and attempt < 5:
                wait = 2 ** attempt * (8 if e.code == 429 else 2)
                m = re.search(r'"retryDelay":\s*"(\d+)s"', msg)
                if m:
                    wait = int(m.group(1)) + 1
                print(f"    {e.code}, retrying in {wait}s", file=sys.stderr)
                time.sleep(wait)
                continue
            raise RuntimeError(f"{model} -> {e.code}: {msg}") from None
        except urllib.error.URLError:
            if attempt < 5:
                time.sleep(2 ** attempt)
                continue
            raise


def synth(text, voice, model, take=0):
    """One line -> (audio bytes, sample rate). 3.8 returns a WAV; older models raw PCM.
    The seed is fixed per take (same seed, same audio), so a retake must change it."""
    cfg = {"responseModalities": ["AUDIO"], "seed": SEED + take, "speechConfig": {"voiceConfig": {"voice": voice}}}
    part = {"text": spoken(text), "speech_metadata": {"style": STYLE}}
    data = call(model, {"contents": [{"role": "user", "parts": [part]}], "generationConfig": cfg})
    cand = data["candidates"][0]
    parts = cand.get("content", {}).get("parts", [])
    audio = next((p["inlineData"] for p in parts if "inlineData" in p), None)
    if not audio:
        raise RuntimeError(f"no audio (finishReason {cand.get('finishReason')})")
    rate = int((re.search(r"rate=(\d+)", audio.get("mimeType", "")) or [0, 24000])[1])
    return base64.b64decode(audio["data"]), rate


def polish(audio: bytes, rate: int, dst: Path, tempo: float = 1.0):
    """WAV or raw PCM -> trimmed, -19 LUFS, mono 24 kHz mp3 (same treatment as the Tom pack).
    tempo < 1 slows the speech without changing its pitch."""
    src = [] if audio[:4] == b"RIFF" else ["-f", "s16le", "-ar", str(rate), "-ac", "1"]
    trim = ("silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05,"
            "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15,areverse")
    subprocess.run([
        "ffmpeg", "-v", "error", "-y", *src, "-i", "pipe:0",
        "-af", f"{trim},{f'atempo={tempo},' if tempo != 1 else ''}loudnorm=I=-19:TP=-2:LRA=7,afade=t=in:d=0.02",
        "-ac", "1", "-ar", "24000", "-b:a", "64k", str(dst),
    ], input=audio, check=True)


def duration(path: Path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True)
    return round(float(out.stdout.strip()), 2)


ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()


def say_number(n):
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + say_number(n % 100))


def words(s):
    """Lower-case words with digits spelled out, so '25 seconds' matches 'twenty-five seconds'."""
    s = re.sub(r"\d+", lambda m: say_number(int(m.group())) if int(m.group()) < 1000 else m.group(), s.lower())
    return re.findall(r"[a-z0-9']+", s.replace("-", " "))


def transcript_match(path: Path, text, model):
    data = call(model, {"contents": [{"role": "user", "parts": [
        {"inlineData": {"mimeType": "audio/mp3", "data": base64.b64encode(path.read_bytes()).decode()}},
        {"text": "Transcribe this audio verbatim. Output only the spoken words."},
    ]}]})
    parts = data["candidates"][0].get("content", {}).get("parts", [])
    heard = " ".join(p.get("audioTranscription", {}).get("text", "") or p.get("text", "") for p in parts)
    return round(difflib.SequenceMatcher(None, words(spoken(text)), words(heard)).ratio(), 3), heard.strip()


def longest_pause(path: Path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "silencedetect=n=-45dB:d=0.3", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return max([float(x) for x in re.findall(r"silence_duration: ([\d.]+)", out)] or [0])


def check(path, cid, text, tom, args):
    """(ok, score, duration, note). Words must match the script; length is judged against a
    calm pace (~2 words/s), not Tom's, and no pause inside a line may run past 1.6 s."""
    dur = duration(path)
    expected = len(words(spoken(text))) / 2.0
    pause = longest_pause(path)
    score, heard = transcript_match(path, text, args.transcriber) if args.transcriber else (1.0, "")
    ok = score >= 0.9 and 0.45 * expected <= dur <= 2.0 * expected + 1.5 and pause <= 1.6
    ratio = dur / tom[cid]["duration"] if tom.get(cid, {}).get("duration") else None
    note = f"{dur}s" + (f" ({ratio:.2f}× Tom)" if ratio else "") + f", words {score:.2f}, longest pause {pause:.1f}s"
    if score < 0.9:
        note += f" — heard: {heard[:120]!r}"
    return ok, score, dur, note


def main():
    global STYLE
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--flow", help="practice id (see js/flows); records every line it can speak")
    ap.add_argument("--voice", default="Schedar")
    ap.add_argument("--model", default="gemini-3.8-flash-lite-tts")
    ap.add_argument("--transcriber", default="gemini-3.5-transcribe", help="'' to skip the word check")
    ap.add_argument("--style", help=f"delivery direction (default: {STYLE!r})")
    ap.add_argument("--retries", type=int, default=1, help="extra takes for a clip that fails its checks")
    ap.add_argument("--only", help="comma-separated line ids")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--audition", help="comma-separated voices: record --line with each into --out-dir")
    ap.add_argument("--line", default="welcome", help="line id for --audition")
    ap.add_argument("--out-dir", default=str(Path(tempfile.gettempdir()) / "gemini-audition"))
    args = ap.parse_args()
    if not KEY:
        sys.exit("GEMINI_API_KEY is not set.")
    if args.style:
        STYLE = args.style
    cues = json.loads(CUES.read_text())
    tom = json.loads(TOM.read_text()) if TOM.exists() else {}

    if args.audition:
        out = Path(args.out_dir)
        out.mkdir(parents=True, exist_ok=True)
        for voice in args.audition.split(","):
            pcm, rate = synth(cues[args.line]["text"], voice.strip(), args.model)
            dst = out / f"{args.line}-{voice.strip()}.mp3"
            polish(pcm, rate, dst)
            print(f"  {voice}: {duration(dst)}s -> {dst}")
        report()
        return

    if not args.flow:
        sys.exit("--flow or --audition is required")
    ids = json.loads(subprocess.run(["node", str(ROOT / "scripts" / "flow_lines.mjs"), args.flow],
                                    capture_output=True, text=True, check=True).stdout)
    if args.only:
        ids = [i for i in ids if i in set(args.only.split(","))]
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    todo = [i for i in ids if args.force or manifest.get(i, {}).get("fp") != fingerprint(cues[i]["text"], args.voice, args.model)
            or not (OUT / f"{i}.mp3").exists()]
    stale = [k for k in manifest if k not in cues]
    for k in stale:  # lines no practice speaks any more
        manifest.pop(k)
        (OUT / f"{k}.mp3").unlink(missing_ok=True)
    print(f"{args.flow}: {len(ids)} lines, {len(todo)} to record with {args.model} / {args.voice}"
          + (f", {len(stale)} stale removed" if stale else ""))
    OUT.mkdir(parents=True, exist_ok=True)
    if stale:
        MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
    failures = []
    with tempfile.TemporaryDirectory() as tmp:
        for cid in todo:
            text = cues[cid]["text"]
            best = None
            for take in range(1 + args.retries):
                try:
                    pcm, rate = synth(text, args.voice, args.model, take)
                except Exception as e:
                    print(f"  ✗ {cid}: {e}", file=sys.stderr)
                    continue
                path = Path(tmp) / f"{cid}.{take}.mp3"
                polish(pcm, rate, path)
                ok, score, dur, note = check(path, cid, text, tom, args)
                if best is None or score > best[1]:
                    best = (path, score, dur, note, ok)
                if ok:
                    break
                print(f"    retake {cid}: {note}")
            if not best:
                failures.append(cid)
                continue
            path, score, dur, note, ok = best
            (OUT / f"{cid}.mp3").write_bytes(path.read_bytes())
            manifest[cid] = {"fp": fingerprint(text, args.voice, args.model), "voice": args.voice,
                             "model": args.model, "duration": dur, "match": score}
            print(f"  {'✓' if ok else '!'} {cid}  {note}")
            MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
            if not ok:
                failures.append(cid)
    report()
    if failures:
        sys.exit(f"{len(failures)} line(s) need a listen: {', '.join(failures)}")


def report():
    cost = usage["in"] / 1e6 * PRICE["in"] + usage["out"] / 1e6 * PRICE["out"]
    print(f"{usage['calls']} calls, {usage['in']} input + {usage['out']} output tokens, about ${cost:.3f}")


if __name__ == "__main__":
    main()
