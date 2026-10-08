#!/usr/bin/env python3
"""Add a background track (e.g. from Suno) to audio/music/ and the music manifest.

The app's drone, bells and hum guide are tuned to A, so the track is moved into A major by
resampling (a semitone is a ~6% speed change, inaudible on ambient music). The smallest
shift that fits the track's notes to A major is used unless you pass --shift. The result
is mono (the app mixes to mono anyway), trimmed, lightly faded, and listed in the manifest.

    python3 scripts/add_music.py ~/Downloads/track.mp3 tide --end 222
    python3 scripts/add_music.py track.mp3 night --shift -2

Needs ffmpeg; numpy only for the automatic shift.
"""

import argparse
import json
import math
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MUSIC = ROOT / "audio" / "music"
NAMES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]


def key_shift(path):
    """Smallest shift (in semitones) that puts the track's notes into A major."""
    import numpy as np

    with tempfile.NamedTemporaryFile(suffix=".raw") as tmp:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(path), "-ac", "1", "-ar", "8000", "-f", "f32le", tmp.name], check=True)
        x = np.fromfile(tmp.name, dtype=np.float32)
    n = 1 << 15
    spec = sum(np.abs(np.fft.rfft(x[i:i + n] * np.hanning(n))) for i in range(0, len(x) - n, n // 2))
    f = np.fft.rfftfreq(n, 1 / 8000)
    chroma = np.zeros(12)
    for fi, a in zip(f, spec):
        if 50 < fi < 1000:
            chroma[round(12 * math.log2(fi / 55)) % 12] += a
    a_major = [0, 2, 4, 5, 7, 9, 11]  # A B C# D E F# G#
    fit = lambda k: sum(chroma[(pc - k) % 12] for pc in a_major) / chroma.sum()
    shift = max(range(-6, 6), key=lambda k: (round(fit(k), 2), -abs(k)))
    top = ", ".join(NAMES[i] for i in np.argsort(chroma)[::-1][:6])
    print(f"strongest notes: {top}; shift {shift:+d} puts {fit(shift):.0%} of the energy in A major")
    return shift


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("name", help="slot: tide, ember, night, transit, …")
    ap.add_argument("--shift", type=int, help="semitones (default: smallest shift into A major)")
    ap.add_argument("--start", type=float, default=0)
    ap.add_argument("--end", type=float, help="cut the track here (seconds, before shifting)")
    args = ap.parse_args()

    shift = args.shift if args.shift is not None else key_shift(args.src)
    ratio = 2 ** (shift / 12)
    span = (args.end or 1e9) - args.start
    trim = ["-ss", str(args.start)] + (["-t", str(span)] if args.end else [])
    MUSIC.mkdir(parents=True, exist_ok=True)
    out = MUSIC / f"{args.name}.mp3"
    probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=sample_rate:format=duration", "-of", "json", args.src], capture_output=True, text=True)
    info = json.loads(probe.stdout)
    rate = int(info["streams"][0]["sample_rate"])
    length = min(span, float(info["format"]["duration"]) - args.start) / ratio
    # Relabel the sample rate (pitch and speed move together), then resample back.
    af = f"asetrate={round(rate * ratio)},aresample=44100,afade=t=in:d=0.5,afade=t=out:st={length - 2:.2f}:d=2"
    subprocess.run(["ffmpeg", "-v", "error", "-y", *trim, "-i", args.src, "-af", af, "-ac", "1", "-ar", "44100", "-b:a", "96k", str(out)], check=True)

    manifest_path = MUSIC / "manifest.json"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    prev = manifest.get(args.name, {})
    manifest[args.name] = {"file": out.name, "v": prev.get("v", 0) + 1, "shift": shift, "seconds": round(length, 1)}
    manifest_path.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n")
    print(f"wrote {out.relative_to(ROOT)} ({length:.0f} s), manifest v{manifest[args.name]['v']}")


if __name__ == "__main__":
    sys.exit(main())
