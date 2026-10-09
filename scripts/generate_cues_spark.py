#!/usr/bin/env python3
"""Record the app's spoken lines with Qwen3-TTS on the DGX Spark, as the "qwen" voice pack.

The Spark's TTS service (port 8881) is reached through an SSH tunnel, so run this on a
machine that can open one:

    ssh -N -L 8881:localhost:8881 spark &
    python3 scripts/generate_cues_spark.py --audition narrator_m,narrator_f,roman   # listen first
    python3 scripts/generate_cues_spark.py --voice narrator_m                       # every line
    python3 scripts/generate_cues_spark.py --voice narrator_m --flow tide --force   # one practice again

Add a voice by cloning a short reference (8-15 s; its words in a .txt next to it), or one
of another pack's recorded lines:

    python3 scripts/generate_cues_spark.py --clone coach --from-file scripts/voices/coach.wav
    python3 scripts/generate_cues_spark.py --clone schedar --from-pack gemini --from-line welcome

The current pack is "coach": a calm, dry ex-military coach, designed with Gemini 3.8 voice
design and cloned from scripts/voices/coach.wav. Qwen reads like a lecturer, faster and with
shorter sentence gaps than guided-breathing coaches, so each sentence is recorded on its own and
joined with a pause (longer after a short label like "Round one."), then the clip is slowed
with --tempo (pitch kept).

All pending lines go to /batch in one call (the service is fastest that way), then each WAV
is trimmed and loudness-normalised like the other packs and written to audio/cues-qwen/ with
a manifest. Every clip is checked for a sane length at a calm pace and for long pauses; with
--transcribe (needs GEMINI_API_KEY) its words are also checked against the script. Lines
that fail are listed at the end; re-run them with --only ... --force.
"""
import argparse
import hashlib
import io
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import uuid
import wave
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_cues_gemini import duration, longest_pause, polish, spoken, transcript_match, words  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CUES = ROOT / "flow" / "cues.json"
OUT = ROOT / "audio" / "cues-qwen"
MANIFEST = OUT / "manifest.json"
MODEL = "qwen3-tts (spark)"
TEMPO = 0.88
GAP, LABEL_GAP = 0.6, 0.85  # s added after a sentence (before --tempo); after a short label


def fingerprint(text, voice, tempo):
    return hashlib.sha1(f"{MODEL}|{voice}|{tempo}|{GAP}|{LABEL_GAP}|{spoken(text)}".encode()).hexdigest()[:12]


def chunks(text):
    """[(text, pause after)]: each full sentence on its own; runs of short ones (<= 3 words, like
    "Round one." or "Chin down.") stay together and get the longer pause when a sentence follows."""
    out, short = [], []
    for x in re.split(r"(?<=[.!?])\s+", spoken(text)):
        if len(x.split()) <= 3:
            short.append(x)
            continue
        if short:
            out.append((" ".join(short), LABEL_GAP))
            short = []
        out.append((x, GAP))
    return out + [(" ".join(short), 0)] if short else out


def record(base, voice, texts, tight=()):
    """{id: text} -> {id: wav bytes}, in one /batch call. Lines are recorded chunk by chunk and
    joined with pauses; lines in `tight` (counts and timing calls) are recorded whole."""
    parts = {i: [(t, 0)] if i in tight else chunks(t) for i, t in texts.items()}
    wavs = batch(base, voice, [{"id": f"{i}__{k}", "text": x} for i, ps in parts.items() for k, (x, _) in enumerate(ps)])
    out = {}
    for i, ps in parts.items():
        buf = io.BytesIO()
        with wave.open(buf, "wb") as w:
            for k, (_, gap) in enumerate(ps):
                with wave.open(io.BytesIO(wavs[f"{i}__{k}"])) as r:
                    if k == 0:
                        w.setparams(r.getparams())
                    w.writeframes(r.readframes(r.getnframes()))
                    if k < len(ps) - 1:
                        w.writeframes(bytes(int(gap * r.getframerate()) * r.getsampwidth() * r.getnchannels()))
        out[i] = buf.getvalue()
    return out


def post(url, body=None, data=None, headers=None, timeout=60):
    req = urllib.request.Request(url, data=data if data is not None else json.dumps(body).encode(),
                                 headers=headers or {"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        sys.exit(f"{url} -> {e.code}: {e.read()[:400].decode(errors='replace')}")
    except urllib.error.URLError as e:
        sys.exit(f"can't reach {url} ({e.reason}). Is the tunnel open?  ssh -N -L 8881:localhost:8881 spark &")


def batch(base, voice, items):
    """{id: wav bytes} for items [{id, text}], in one /batch call."""
    raw = post(f"{base}/batch", {"voice": voice, "items": items}, timeout=3600)
    zf = zipfile.ZipFile(io.BytesIO(raw))
    names = sorted(n for n in zf.namelist() if n.lower().endswith(".wav"))
    by_stem = {Path(n).stem: n for n in names}
    if all(i["id"] in by_stem for i in items):
        return {i["id"]: zf.read(by_stem[i["id"]]) for i in items}
    if len(names) == len(items):  # named by position
        return {i["id"]: zf.read(n) for i, n in zip(items, names)}
    sys.exit(f"/batch returned {len(names)} WAVs for {len(items)} lines and the names don't match the ids")


def check(path, text, args):
    dur = duration(path)
    expected = len(words(spoken(text))) / 2.4
    pause = longest_pause(path)
    score = 1.0
    heard = ""
    if args.transcribe:
        score, heard = transcript_match(path, text, "gemini-3.5-transcribe")
    ok = score >= 0.9 and 0.45 * expected <= dur <= 2.0 * expected + 1.5 and pause <= 1.6
    note = f"{dur}s, longest pause {pause:.1f}s" + (f", words {score:.2f}" if args.transcribe else "")
    if score < 0.9:
        note += f" — heard: {heard[:120]!r}"
    return ok, dur, score, note


def clone(base, name, src, transcript):
    """Register a Spark voice from a reference recording and the exact words spoken in it."""
    if not src.exists():
        sys.exit(f"no recording {src}")
    wav = subprocess.run(["ffmpeg", "-v", "error", "-i", str(src), "-ac", "1", "-ar", "24000", "-f", "wav", "-"],
                         capture_output=True, check=True).stdout
    secs = len(wav) / 48000
    if not 6 <= secs <= 16:
        print(f"note: the reference is {secs:.1f}s; 8-15 s clones best")
    boundary = uuid.uuid4().hex
    parts = [("name", name), ("transcript", transcript)]
    body = b"".join(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode() for k, v in parts)
    body += (f'--{boundary}\r\nContent-Disposition: form-data; name="audio"; filename="ref.wav"\r\n'
             f"Content-Type: audio/wav\r\n\r\n").encode() + wav + f"\r\n--{boundary}--\r\n".encode()
    out = post(f"{base}/voices", data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, timeout=300)
    print(f"voice {name!r} added from {src} ({secs:.1f}s): {out[:200].decode(errors='replace')}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--url", default="http://localhost:8881")
    ap.add_argument("--voice", default="coach")
    ap.add_argument("--tempo", type=float, default=TEMPO, help=f"speed factor applied after recording (default {TEMPO})")
    ap.add_argument("--flow", help="only this practice's lines (default: every line in flow/cues.json)")
    ap.add_argument("--only", help="comma-separated line ids")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--transcribe", action="store_true", help="also check words with gemini-3.5-transcribe")
    ap.add_argument("--audition", help="comma-separated voices: record --line with each into --out-dir")
    ap.add_argument("--line", default="welcome")
    ap.add_argument("--out-dir", default=str(Path(tempfile.gettempdir()) / "spark-audition"))
    ap.add_argument("--clone", metavar="NAME", help="add a Spark voice from a recorded line (see --from-pack/--from-line)")
    ap.add_argument("--from-file", type=Path, help="reference WAV/MP3; its transcript is the .txt beside it")
    ap.add_argument("--from-pack", default="gemini")
    ap.add_argument("--from-line", default="welcome")
    args = ap.parse_args()
    base = args.url.rstrip("/")
    cues = json.loads(CUES.read_text())

    if args.clone:
        if args.from_file:
            clone(base, args.clone, args.from_file, args.from_file.with_suffix(".txt").read_text().strip())
        else:
            pack = "cues" if args.from_pack == "tom" else f"cues-{args.from_pack}"
            clone(base, args.clone, ROOT / "audio" / pack / f"{args.from_line}.mp3", spoken(cues[args.from_line]["text"]))
        return

    if args.audition:
        out = Path(args.out_dir)
        out.mkdir(parents=True, exist_ok=True)
        for voice in [v.strip() for v in args.audition.split(",")]:
            wav = record(base, voice, {args.line: cues[args.line]["text"]})[args.line]
            dst = out / f"{args.line}-{voice}.mp3"
            polish(wav, 24000, dst, args.tempo)
            print(f"  {voice}: {duration(dst)}s -> {dst}")
        return

    ids = list(cues)
    if args.flow:
        ids = json.loads(subprocess.run(["node", str(ROOT / "scripts" / "flow_lines.mjs"), args.flow],
                                        capture_output=True, text=True, check=True).stdout)
    if args.only:
        ids = [i for i in ids if i in set(args.only.split(","))]
    manifest = json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}
    for k in [k for k in manifest if k not in cues]:  # lines no practice speaks any more
        manifest.pop(k)
        (OUT / f"{k}.mp3").unlink(missing_ok=True)
    todo = [i for i in ids if args.force or manifest.get(i, {}).get("fp") != fingerprint(cues[i]["text"], args.voice, args.tempo)
            or not (OUT / f"{i}.mp3").exists()]
    est = sum(len(cues[i]["text"].split()) for i in todo) / 2.4 / 60
    print(f"{len(ids)} lines, {len(todo)} to record with {args.voice} (~{est:.0f} min of speech, one /batch call)")
    if not todo:
        return
    wavs = record(base, args.voice, {i: cues[i]["text"] for i in todo}, {i for i in todo if cues[i].get("kind") == "count"})

    OUT.mkdir(parents=True, exist_ok=True)
    flagged = []
    for i in todo:
        dst = OUT / f"{i}.mp3"
        polish(wavs[i], 24000, dst, args.tempo)
        ok, dur, score, note = check(dst, cues[i]["text"], args)
        manifest[i] = {"fp": fingerprint(cues[i]["text"], args.voice, args.tempo), "voice": args.voice, "model": MODEL, "duration": dur}
        if args.transcribe:
            manifest[i]["match"] = score
        print(f"  {'✓' if ok else '!'} {i}  {note}")
        if not ok:
            flagged.append(i)
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")

    timing = subprocess.run(["node", str(ROOT / "scripts" / "check_timing.mjs"), "--pack", "qwen"], capture_output=True, text=True)
    issues = [ln for ln in timing.stdout.splitlines() if ln.startswith("    ")]
    print(f"\nTiming with this pack: {'ok' if not issues else f'{len(issues)} note(s)'}")
    for ln in issues[:20]:
        print(ln)
    if flagged:
        print(f"\n{len(flagged)} line(s) worth a listen: {', '.join(flagged)}")
        print(f"re-record:  python3 scripts/generate_cues_spark.py --voice {args.voice} --force --only {','.join(flagged)}")
    print("\nThen:  git add audio/cues-qwen && git commit -m 'Qwen voice pack' && git push")


if __name__ == "__main__":
    main()
