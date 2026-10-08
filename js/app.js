import { FLOW } from './flow.js';
import { compile, stateAt, captionAt } from './engine.js';
import { loadCues, renderSession } from './audio.js';

const $ = (s) => document.querySelector(s);
const fmt = (s) => {
  s = Math.max(0, Math.round(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// ── Settings ───────────────────────────────────────────
const INTENSITY = {
  gentle: { holdScale: 0.6, gentle: true },
  standard: { holdScale: 1 },
  deeper: { holdScale: 1.3 },
};
const DEFAULTS = { intensity: 'standard', voice: true, sounds: true, ambience: true, safetyAck: false };
const store = {
  get() {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('kumbha') || '{}') };
    } catch {
      return { ...DEFAULTS };
    }
  },
  set(patch) {
    settings = { ...settings, ...patch };
    try {
      localStorage.setItem('kumbha', JSON.stringify(settings));
    } catch {}
  },
};
let settings = store.get();

// ── State ──────────────────────────────────────────────
let CUES = {};
let buffers = {};
let durs = {};
let plan = null;
let trackUrl = null;
let renderToken = 0;
let raf = 0;
let fired = new Set();
let holds = [];
let lastSeg = null;
let wakeLock = null;
const audio = $('#track');

// ── Boot ───────────────────────────────────────────────
async function boot() {
  CUES = await (await fetch('flow/cues.json')).json();
  buildPlan();
  renderMap();
  bindUI();
  syncSettingsUI();

  buffers = await loadCues(Object.keys(CUES));
  durs = Object.fromEntries(Object.entries(buffers).filter(([, b]) => b).map(([k, b]) => [k, b.duration]));
  const missing = Object.values(buffers).filter((b) => !b).length;
  if (missing) {
    $('#voice-note').textContent =
      missing === Object.keys(CUES).length
        ? 'Recorded voice not generated yet — your device’s voice will read the cues.'
        : `${missing} voice cues missing — your device’s voice fills in.`;
  }
  prepare();

  if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
}

function buildPlan() {
  plan = compile(FLOW, CUES, durs, INTENSITY[settings.intensity]);
}

async function prepare() {
  buildPlan();
  renderMap();
  const token = ++renderToken;
  const begin = $('#begin');
  begin.disabled = true;
  $('#begin-sub').textContent = 'Preparing…';
  const voiced = settings.voice ? buffers : {};
  let blob;
  try {
    blob = await renderSession(plan, voiced, { breathSounds: settings.sounds, ambience: settings.ambience });
  } catch (e) {
    console.error(e);
    $('#begin-sub').textContent = 'Audio unavailable in this browser';
    return;
  }
  if (token !== renderToken) return;
  if (trackUrl) URL.revokeObjectURL(trackUrl);
  trackUrl = URL.createObjectURL(blob);
  audio.src = trackUrl;
  audio.load();
  begin.disabled = false;
  $('#begin-sub').textContent = `${Math.round(plan.total / 60)} min`;
}

// ── Home map ───────────────────────────────────────────
function renderMap() {
  const map = $('#map');
  map.innerHTML = '';
  for (const s of plan.sections) {
    const meta = FLOW.sections.find((x) => x.id === s.id);
    const li = document.createElement('li');
    li.style.setProperty('--c', meta.color);
    const segs = plan.segs.filter((g) => g.section === s.id);
    let what = settings.intensity === 'gentle' && meta.gentleWhat ? meta.gentleWhat : meta.what;
    if (typeof what === 'function') what = what(segs);
    li.innerHTML = `<span class="dot"></span><span class="name">${meta.title}<span class="what">${what}</span></span><span class="len">${fmt(s.end - s.start)}</span>`;
    map.appendChild(li);
  }
  const bar = $('#progress');
  bar.innerHTML = '';
  for (const s of plan.sections) {
    const span = document.createElement('span');
    span.style.flex = String(s.end - s.start);
    span.innerHTML = '<i></i>';
    bar.appendChild(span);
  }
}

// ── Session ────────────────────────────────────────────
function show(id) {
  document.querySelectorAll('.screen').forEach((el) => el.classList.toggle('is-active', el.id === id));
}

async function begin() {
  if (!settings.safetyAck) {
    $('#safety').showModal();
    return;
  }
  if (!plan || $('#begin').disabled) return;
  fired = new Set();
  holds = [];
  lastSeg = null;
  audio.currentTime = 0;
  show('session');
  try {
    await audio.play();
  } catch (e) {
    console.warn(e);
  }
  try {
    wakeLock = await navigator.wakeLock?.request('screen');
  } catch {}
  setMediaSession();
  loop();
}

function loop() {
  cancelAnimationFrame(raf);
  const tick = () => {
    frame(audio.currentTime);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
}

function frame(t) {
  const st = stateAt(plan, t);
  const session = $('#session');
  session.dataset.phase = st.phase;
  document.body.dataset.section = st.seg.section;
  $('#orb').style.setProperty('--s', st.scale.toFixed(4));

  // Track hold results as segments complete.
  if (lastSeg && lastSeg !== st.seg) recordHold(lastSeg, Math.min(t, lastSeg.end));
  lastSeg = st.seg;

  const phaseEl = $('#phase');
  const countEl = $('#count');
  if (st.phase === 'empty' || st.phase === 'full') {
    phaseEl.textContent = st.phase === 'empty' ? 'Hold, empty' : 'Hold, full';
    countEl.innerHTML = `<b>${fmt(st.elapsed)}</b>of ${fmt(st.target)}`;
    const C = 2 * Math.PI * 46;
    $('#ring-fill').style.strokeDashoffset = String(C * (1 - st.p));
  } else if (st.seg.kind === 'pace') {
    phaseEl.textContent = st.label;
    countEl.textContent = st.sub || '';
  } else {
    phaseEl.textContent = '';
    countEl.textContent = '';
  }

  // Overall progress.
  const bars = document.querySelectorAll('#progress i');
  plan.sections.forEach((s, i) => {
    const p = Math.min(1, Math.max(0, (t - s.start) / (s.end - s.start)));
    bars[i].style.transform = `scaleX(${p})`;
  });
  const sec = FLOW.sections.find((s) => s.id === st.seg.section);
  $('#section-name').textContent = sec.title;
  $('#time-left').textContent = fmt(plan.total - t);

  // Captions (and on-device speech for cues that have no recording).
  const cap = captionAt(plan, t);
  const capEl = $('#caption');
  const key = cap ? cap.id + cap.t : '';
  if (capEl.dataset.key !== key) {
    capEl.dataset.key = key;
    capEl.classList.remove('show');
    if (cap) {
      setTimeout(() => {
        capEl.innerHTML = (cap.kind === 'science' ? '<span class="tag">Why it works</span>' : cap.kind === 'technique' ? '<span class="tag">Technique</span>' : '') + escapeHtml(cap.text);
        capEl.classList.add('show');
      }, 180);
    }
  }
  if (settings.voice && !audio.paused) {
    for (const v of plan.voice) {
      if (v.t > t) break;
      if (fired.has(v)) continue;
      fired.add(v);
      if (!buffers[v.id] && t - v.t < 1.5) speak(v.text);
    }
  }
}

function recordHold(seg, endT) {
  if (seg.kind !== 'hold' || seg.type !== 'empty' || seg.recorded) return;
  seg.recorded = true;
  holds.push(Math.max(0, endT - seg.start));
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.88;
  u.pitch = 0.92;
  const v = speechSynthesis.getVoices().find((x) => /en[-_](GB|US)/i.test(x.lang) && /male|daniel|alex|george|arthur/i.test(x.name));
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

function breatheNow() {
  const st = stateAt(plan, audio.currentTime);
  if (st.seg.kind !== 'hold' || st.seg.type !== 'empty') return;
  recordHold(st.seg, audio.currentTime);
  const target = st.seg.end + 0.01;
  for (const v of plan.voice) if (v.t < target) fired.add(v);
  window.speechSynthesis?.cancel();
  audio.currentTime = target;
}

function togglePause() {
  if (audio.paused) {
    audio.play();
    window.speechSynthesis?.resume();
  } else {
    audio.pause();
    window.speechSynthesis?.pause();
  }
}

function finish() {
  cancelAnimationFrame(raf);
  if (lastSeg) recordHold(lastSeg, Math.min(audio.currentTime, lastSeg.end));
  const played = audio.currentTime;
  audio.pause();
  window.speechSynthesis?.cancel();
  wakeLock?.release?.().catch(() => {});
  wakeLock = null;
  plan.segs.forEach((s) => delete s.recorded);

  const list = $('#hold-list');
  list.innerHTML = '';
  holds.forEach((h, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="k">Hold ${i + 1}</div><div class="v">${fmt(h)}</div>`;
    list.appendChild(li);
  });
  list.hidden = holds.length === 0;
  $('#done-time').textContent = fmt(played);
  document.body.dataset.section = 'close';
  show('done');
}

function setMediaSession() {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: FLOW.title,
    artist: 'Kumbha · pranayama',
    artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  });
  navigator.mediaSession.setActionHandler('play', () => audio.play());
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

// ── UI wiring ──────────────────────────────────────────
function syncSettingsUI() {
  document.querySelectorAll('#intensity button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === settings.intensity)));
  $('#set-voice').checked = settings.voice;
  $('#set-sounds').checked = settings.sounds;
  $('#set-ambience').checked = settings.ambience;
}

function bindUI() {
  $('#begin').addEventListener('click', begin);
  $('#open-learn').addEventListener('click', () => $('#learn').showModal());
  $('#open-settings').addEventListener('click', () => $('#settings').showModal());
  $('#done-learn').addEventListener('click', () => $('#learn').showModal());
  document.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  document.querySelectorAll('dialog').forEach((d) =>
    d.addEventListener('click', (e) => {
      if (e.target === d) d.close();
    })
  );

  $('#safety-ok').addEventListener('click', () => {
    store.set({ safetyAck: true });
    $('#safety').close();
    begin();
  });

  let dirty = false;
  document.querySelectorAll('#intensity button').forEach((b) =>
    b.addEventListener('click', () => {
      store.set({ intensity: b.dataset.v });
      syncSettingsUI();
      dirty = true;
      buildPlan();
      renderMap();
    })
  );
  for (const [id, key] of [
    ['#set-voice', 'voice'],
    ['#set-sounds', 'sounds'],
    ['#set-ambience', 'ambience'],
  ]) {
    $(id).addEventListener('change', (e) => {
      store.set({ [key]: e.target.checked });
      dirty = true;
    });
  }
  $('#settings').addEventListener('close', () => {
    if (dirty) prepare();
    dirty = false;
  });

  $('#pause-btn').addEventListener('click', togglePause);
  $('#breathe-btn').addEventListener('click', breatheNow);
  $('#end-btn').addEventListener('click', finish);
  $('#done-home').addEventListener('click', () => {
    document.body.dataset.section = 'arrive';
    show('home');
  });
  audio.addEventListener('ended', finish);
  audio.addEventListener('play', () => ($('#pause-btn').innerHTML = ICON_PAUSE));
  audio.addEventListener('pause', () => ($('#pause-btn').innerHTML = ICON_PLAY));
  document.addEventListener('keydown', (e) => {
    if (!$('#session').classList.contains('is-active')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePause();
    } else if (e.code === 'Enter') breatheNow();
  });
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && $('#session').classList.contains('is-active') && !wakeLock) {
      try {
        wakeLock = await navigator.wakeLock?.request('screen');
      } catch {}
    }
  });
}

const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>';
const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

boot();
