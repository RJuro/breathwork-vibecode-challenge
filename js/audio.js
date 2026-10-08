// Session audio: decode the voice cues, synthesise breath / hum / bell sounds, and
// render the whole flow offline into one WAV track. One continuous track keeps
// playing with the screen locked, and its currentTime is the clock the visuals follow.

export const SR = 22050;

function decodeCtx() {
  const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  return new Offline(1, SR, SR);
}

function decode(ctx, buf) {
  // Promise form where available, callback form for older WebKit.
  return new Promise((resolve, reject) => {
    const p = ctx.decodeAudioData(buf, resolve, reject);
    if (p && p.then) p.then(resolve, reject);
  });
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

let manifests = null;
/** audio/cues/manifest.json (written by scripts/generate_cues.py) and audio/music/manifest.json. */
export function loadManifests() {
  manifests ??= Promise.all([fetchJSON('audio/cues/manifest.json'), fetchJSON('audio/music/manifest.json')]).then(([cues, music]) => ({ cues, music }));
  return manifests;
}

const decoded = new Map();
async function decodeUrl(url) {
  if (!decoded.has(url)) {
    decoded.set(
      url,
      (async () => {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(res.status);
          return await decode(decodeCtx(), await res.arrayBuffer());
        } catch {
          return null;
        }
      })()
    );
  }
  return decoded.get(url);
}

/** Decode the recorded lines among `ids`. Lines without a recording resolve to null and
 *  the app reads them with on-device speech, so a practice works before its cues exist. */
export async function loadCues(ids) {
  const { cues } = await loadManifests();
  const out = {};
  await Promise.all(
    ids.map(async (id) => {
      out[id] = cues[id] ? await decodeUrl(`audio/cues/${id}.mp3?v=${cues[id].fp}`) : null;
    })
  );
  return out;
}

/** A practice's background track: the first of `names` that has been added, or null. */
export async function loadMusic(names) {
  const { music } = await loadManifests();
  const m = [].concat(names || []).map((n) => music[n]).find(Boolean);
  return m ? decodeUrl(`audio/music/${m.file}?v=${m.v || 1}`) : null;
}

function noiseBuffer(ctx, seconds = 4) {
  const len = Math.floor(seconds * SR);
  const buf = ctx.createBuffer(1, len, SR);
  const d = buf.getChannelData(0);
  // Brown-ish noise: softer than white, closer to the sound of air.
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.035 * white) / 1.035;
    d[i] = last * 3.2;
  }
  return buf;
}

function breath(ctx, bus, noise, t, dur, dir, level) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.Q.value = 0.7;
  const g = ctx.createGain();
  const [f0, f1] = dir === 'in' ? [420, 1500] : [1200, 320];
  bp.frequency.setValueAtTime(f0, t);
  bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const peak = dir === 'in' ? 0.68 : 0.25;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(level, t + dur * peak);
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(bus);
  src.start(t, Math.random() * 2);
  src.stop(t + dur + 0.05);
}

function hum(ctx, bus, t, dur) {
  const g = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 700;
  // A2 with a little A3 and E3: in tune with the drone and the A-major music beds.
  [
    [110.0, 1],
    [220.0, 0.18],
    [164.81, 0.12],
  ].forEach(([f, a]) => {
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.value = f;
    og.gain.value = a;
    o.connect(og).connect(lp);
    o.start(t);
    o.stop(t + dur + 0.1);
  });
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.11, t + 0.8);
  g.gain.setValueAtTime(0.11, t + Math.max(0.9, dur - 1.2));
  g.gain.linearRampToValueAtTime(0.0001, t + dur);
  lp.connect(g).connect(bus);
}

function bell(ctx, bus, t, kind = 'bell') {
  // Singing-bowl-ish: a few inharmonic partials with staggered decays.
  const f0 = kind === 'tick' ? 880 : kind === 'low' ? 220 : 293.66; // A5, A3, D4: all in A major
  const amp = kind === 'tick' ? 0.05 : 0.16;
  const decay = kind === 'tick' ? 1.2 : 6;
  [
    [1, 1, 1],
    [2.76, 0.42, 0.55],
    [5.4, 0.18, 0.3],
  ].forEach(([m, a, d]) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = f0 * m;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(amp * a, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay * d);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + decay * d + 0.05);
  });
}

function pad(ctx, bus, seconds) {
  // A low, slow drone so the silence of the holds isn't empty.
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 520;
  lp.Q.value = 0.3;
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.05;
  lfoGain.gain.value = 160;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start(0);
  [
    [110, -4],
    [110, 5],
    [164.81, 0],
    [220, 3],
  ].forEach(([f, cents]) => {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    o.detune.value = cents;
    o.connect(lp);
    o.start(0);
    o.stop(seconds);
  });
  const g = ctx.createGain();
  g.gain.value = 0.05;
  lp.connect(g).connect(bus);
}

function offline(seconds) {
  const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  return new Offline(1, Math.ceil(seconds * SR), SR);
}

function rendered(ctx) {
  return new Promise((resolve, reject) => {
    ctx.oncomplete = (ev) => resolve(ev.renderedBuffer);
    const p = ctx.startRendering();
    if (p && p.then) p.then(resolve, reject);
  });
}

// Every distinct sound (an inhale of 4 s, a kapalabhati puff, a bell…) is rendered once
// as a short clip; the session render then only mixes clips, which is fast even on phones.
const isBell = (type) => type === 'bell' || type === 'low' || type === 'tick';
const PAD_LEN = 30;
const PAD_STEP = 25;

function atomKey(e, variant) {
  if (isBell(e.type)) return e.type;
  if (e.type === 'hum') return `hum|${e.dur.toFixed(2)}`;
  return `${e.type}|${e.dur.toFixed(2)}|${(e.level ?? 0.5).toFixed(2)}|${variant}`;
}

function renderAtom(e) {
  if (e.type === 'pad') {
    const ctx = offline(PAD_LEN);
    pad(ctx, ctx.destination, PAD_LEN);
    return rendered(ctx);
  }
  const tail = isBell(e.type) ? 6.2 : 0.1;
  const ctx = offline((e.dur || 0) + tail);
  if (isBell(e.type)) bell(ctx, ctx.destination, 0, e.type);
  else if (e.type === 'hum') hum(ctx, ctx.destination, 0, e.dur);
  else breath(ctx, ctx.destination, noiseBuffer(ctx, Math.max(1, e.dur + 0.5)), 0, e.dur, e.type, e.level ?? 0.5);
  return rendered(ctx);
}

/** Render a compiled plan to a WAV Blob. */
export async function renderSession(plan, cues, opts = {}) {
  const { breathSounds = true, ambience = true, music = null, voiceGain = 1, bedGain = 1 } = opts;
  const total = plan.total + 1;

  // 1. Atoms.
  const atoms = new Map();
  const placed = [];
  const seen = {};
  for (const e of plan.sounds) {
    if (!breathSounds && !isBell(e.type)) continue;
    // Short sounds (kapalabhati) get three variants so they don't sound machine-gunned.
    const base = `${e.type}|${e.dur}`;
    const variant = e.dur < 1.5 ? (seen[base] = (seen[base] || 0) + 1) % 3 : 0;
    const key = atomKey(e, variant);
    if (!atoms.has(key)) atoms.set(key, renderAtom(e));
    placed.push([e.t, key]);
  }
  const drone = ambience && !music;
  if (drone) atoms.set('pad', renderAtom({ type: 'pad' }));
  const clips = new Map(await Promise.all([...atoms].map(async ([k, p]) => [k, await p])));

  // 2. Mix in plain JS. Scheduling hundreds of nodes in one long OfflineAudioContext is
  //    slow (every node is processed every quantum); adding samples directly is not.
  const N = Math.ceil(total * SR);
  const out = new Float32Array(N);

  // Ducking envelope at 100 Hz: the sound bed dips under the voice.
  const CR = 100;
  const env = new Float32Array(Math.ceil(total * CR) + 2).fill(1);
  for (const v of plan.voice) {
    if (!cues[v.id]) continue;
    for (let i = Math.floor((v.t - 0.15) * CR); i < Math.ceil((v.t + v.dur) * CR); i++) if (i >= 0) env[i] = 0.55;
  }
  for (let i = 1, y = 1; i < env.length; i++) {
    const tau = env[i] < y ? 0.12 : 0.5;
    y += (env[i] - y) * (1 - Math.exp(-1 / (tau * CR)));
    env[i] = y;
  }

  const mix = (buffer, t, gain, shape) => {
    const d = buffer.getChannelData(0);
    const o = Math.round(t * SR);
    const n = Math.min(d.length, N - o);
    for (let i = Math.max(0, -o); i < n; i++) {
      const j = o + i;
      out[j] += d[i] * gain * env[((j * CR) / SR) | 0] * (shape ? shape(j / SR) : 1);
    }
  };

  const FX = 0.55 * bedGain;
  for (const [t, key] of placed) mix(clips.get(key), t, FX);

  if (drone) {
    // Overlapping, cross-faded copies of one pad clip, faded in and out with the session.
    const fadeIn = 8;
    const fadeOut = 10;
    const fade = PAD_LEN - PAD_STEP;
    for (let s = 0; s < total; s += PAD_STEP) {
      const rise = s === 0 ? fadeIn : fade;
      mix(clips.get('pad'), s, bedGain, (t) => {
        const x = t - s;
        const copy = x < rise ? x / rise : x > PAD_STEP ? Math.max(0, (PAD_LEN - x) / fade) : 1;
        return copy * Math.min(1, Math.max(0, (total - t) / fadeOut));
      });
    }
  }

  if (ambience && music) mixMusic(music, total, mix, bedGain);

  env.fill(1); // voice is not ducked
  for (const v of plan.voice) if (cues[v.id]) mix(cues[v.id], v.t, voiceGain);

  return toWav(out);
}

// Background track: mixed to mono, levelled to a fixed loudness so any track sits the
// same distance under the voice, looped with a long crossfade, faded in and out.
const MUSIC_RMS = 0.035;
const XFADE = 6;
function mixMusic(buffer, total, mix, level = 1) {
  const n = buffer.length;
  const mono = new Float32Array(n);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const d = buffer.getChannelData(c);
    for (let i = 0; i < n; i++) mono[i] += d[i] / buffer.numberOfChannels;
  }
  let sum = 0;
  for (let i = 0; i < n; i += 4) sum += mono[i] * mono[i];
  const rms = Math.sqrt(sum / (n / 4)) || 1;
  const gain = (MUSIC_RMS / rms) * level;
  const clip = { getChannelData: () => mono, length: n };
  const len = n / SR;
  const step = Math.max(10, len - XFADE);
  // Equal-power crossfade (sin/cos), so the seam doesn't dip when two copies overlap.
  for (let s = 0; s < total; s += step) {
    mix(clip, s, gain, (t) => {
      const x = t - s;
      const copy = s > 0 && x < XFADE ? Math.sin((Math.PI / 2) * (x / XFADE)) : x > step ? Math.cos((Math.PI / 2) * Math.min(1, (x - step) / XFADE)) : 1;
      const session = Math.min(1, t / 6, Math.max(0, (total - t) / 10));
      return copy * session;
    });
  }
}

function toWav(data) {
  const n = data.length;
  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(data[i]));
  const gain = peak > 0.97 ? 0.97 / peak : 1;
  const ab = new ArrayBuffer(44 + n * 2);
  const v = new DataView(ab);
  const str = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + n * 2, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, SR, true);
  v.setUint32(28, SR * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, n * 2, true);
  let o = 44;
  for (let i = 0; i < n; i++, o += 2) {
    const s = Math.max(-1, Math.min(1, data[i] * gain));
    v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([ab], { type: 'audio/wav' });
}
