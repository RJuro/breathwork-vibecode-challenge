import { FLOWS, INTENSITY, intensitiesOf } from './flows/index.js';
import { compile, stateAt, captionAt } from './engine.js';
import { loadManifests, loadCues, loadMusic, renderSession } from './audio.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmt = (s) => {
  s = Math.max(0, Math.round(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const minutes = (s) => `${Math.max(1, Math.round(s / 60))} min`;

// ── Settings ───────────────────────────────────────────
const DEFAULTS = { voice: true, sounds: true, music: true, safetyAck: false, intensity: {} };
let settings = load();
function load() {
  try {
    const s = { ...DEFAULTS, ...JSON.parse(localStorage.getItem('kumbha') || '{}') };
    if (typeof s.intensity !== 'object') s.intensity = {}; // v1 stored one global string
    if ('ambience' in s) s.music = s.ambience;
    return s;
  } catch {
    return { ...DEFAULTS };
  }
}
function save(patch) {
  settings = { ...settings, ...patch };
  try {
    localStorage.setItem('kumbha', JSON.stringify(settings));
  } catch {}
}
const levelOf = (flow) => {
  const lv = settings.intensity[flow.id];
  return intensitiesOf(flow).includes(lv) ? lv : 'standard';
};

// ── State ──────────────────────────────────────────────
let flow = null;
let plan = null;
let buffers = {};
let trackUrl = null;
let renderToken = 0;
let raf = 0;
let fired = new Set();
let holds = [];
let lastSeg = null;
let wakeLock = null;
const audio = $('#track');

// ── Routing: #/ library, #/p/<id> practice ─────────────
function route() {
  const id = (location.hash.match(/^#\/p\/([\w-]+)/) || [])[1];
  const f = FLOWS.find((x) => x.id === id);
  if ($('#session').classList.contains('is-active')) stopSession();
  if (f) openFlow(f);
  else {
    flow = null;
    document.body.dataset.section = 'arrive';
    show('library');
  }
}

function show(id) {
  $$('.screen').forEach((el) => el.classList.toggle('is-active', el.id === id));
  window.scrollTo(0, 0);
}

// ── Library ────────────────────────────────────────────
async function renderShelf() {
  const { cues } = await loadManifests();
  const durs = Object.fromEntries(Object.entries(cues).map(([k, v]) => [k, v.duration]));
  const shelf = $('#shelf');
  shelf.innerHTML = '';
  const groups = [...new Set(FLOWS.map((f) => f.tag))];
  for (const g of groups) {
    const sec = document.createElement('section');
    sec.className = 'group';
    sec.innerHTML = `<h2 class="group-title">${g}</h2>`;
    for (const f of FLOWS.filter((x) => x.tag === g)) {
      const total = compile(f, durs, INTENSITY[levelOf(f)]).total;
      const a = document.createElement('a');
      a.className = 'card';
      a.href = `#/p/${f.id}`;
      a.style.setProperty('--a1', f.accent[0]);
      a.style.setProperty('--a2', f.accent[1]);
      a.innerHTML = `<span class="card-orb" aria-hidden="true"></span><span class="card-text"><span class="card-title">${f.title}</span><span class="card-blurb">${f.blurb}</span></span><span class="card-len">${minutes(total)}</span>`;
      sec.appendChild(a);
    }
    shelf.appendChild(sec);
  }
}

// ── Practice detail ────────────────────────────────────
function openFlow(f) {
  flow = f;
  document.body.dataset.section = f.sky || 'arrive';
  $('#d-title').innerHTML = f.titleHtml || f.title;
  $('#d-lede').textContent = f.lede;
  $('#learn-body').innerHTML = f.learn || '';
  $('#intensity-row').hidden = !f.intensity;
  syncIntensity();
  show('detail');
  prepare();
}

function syncIntensity() {
  const lv = levelOf(flow);
  const offered = intensitiesOf(flow);
  $$('#intensity button').forEach((b) => {
    b.hidden = !offered.includes(b.dataset.v);
    b.setAttribute('aria-pressed', String(b.dataset.v === lv));
  });
  $('#intensity-note').textContent = (flow.intensityNotes || {})[lv] || '';
}

function renderMap() {
  $('#d-eyebrow').textContent = `${flow.tag} · ${minutes(plan.total)}`;
  const map = $('#map');
  map.innerHTML = '';
  for (const s of plan.sections) {
    const li = document.createElement('li');
    li.style.setProperty('--c', s.color);
    li.innerHTML = `<span class="dot"></span><span class="name">${s.title}<span class="what">${s.what || ''}</span></span><span class="len">${fmt(s.end - s.start)}</span>`;
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

async function prepare() {
  const token = ++renderToken;
  const f = flow;
  const opts = INTENSITY[levelOf(f)];
  const begin = $('#begin');
  begin.disabled = true;
  $('#begin-sub').textContent = 'Preparing…';

  // Draft with estimated timings to learn which lines this run needs, then decode them.
  const { cues } = await loadManifests();
  const est = Object.fromEntries(Object.entries(cues).map(([k, v]) => [k, v.duration]));
  plan = compile(f, est, opts);
  renderMap();
  const ids = [...new Set(plan.voice.map((v) => v.id))];
  const [loaded, music] = await Promise.all([loadCues(ids), settings.music ? loadMusic(f.music) : null]);
  if (token !== renderToken) return;
  buffers = loaded;
  const durs = Object.fromEntries(Object.entries(buffers).filter(([, b]) => b).map(([k, b]) => [k, b.duration]));
  plan = compile(f, durs, opts);
  renderMap();

  const missing = ids.filter((id) => !buffers[id]).length;
  $('#voice-note').textContent = !settings.voice || !missing ? '' : missing === ids.length ? 'Recorded voice not generated yet — your device’s voice will read the cues.' : `${missing} voice cues not recorded yet — your device’s voice fills in.`;

  let blob;
  try {
    blob = await renderSession(plan, settings.voice ? buffers : {}, { breathSounds: settings.sounds, ambience: settings.music, music });
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
  $('#begin-sub').textContent = minutes(plan.total);
}

// ── Session ────────────────────────────────────────────
async function begin() {
  if (!settings.safetyAck) {
    $('#safety').showModal();
    return;
  }
  if (!plan || $('#begin').disabled) return;
  fired = new Set();
  holds = [];
  lastSeg = null;
  plan.segs.forEach((s) => delete s.recorded);
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
  $('#session').dataset.phase = st.phase;
  document.body.dataset.section = st.seg.section;
  $('#orb').style.setProperty('--s', st.scale.toFixed(4));

  if (lastSeg && lastSeg !== st.seg) recordHold(lastSeg, Math.min(t, lastSeg.end));
  lastSeg = st.seg;

  const phaseEl = $('#phase');
  const countEl = $('#count');
  if (st.seg.kind === 'hold') {
    phaseEl.textContent = st.label;
    countEl.innerHTML = `<b>${fmt(st.elapsed)}</b>of ${fmt(st.target)}`;
    $('#ring-fill').style.strokeDashoffset = String(2 * Math.PI * 46 * (1 - st.p));
  } else if (st.seg.kind === 'pace') {
    phaseEl.textContent = st.label;
    countEl.textContent = st.sub || '';
  } else {
    phaseEl.textContent = '';
    countEl.textContent = '';
  }

  const bars = $$('#progress i');
  plan.sections.forEach((s, i) => {
    const p = Math.min(1, Math.max(0, (t - s.start) / (s.end - s.start)));
    bars[i].style.transform = `scaleX(${p})`;
  });
  $('#section-name').textContent = plan.sections.find((s) => s.id === st.seg.section)?.title || '';
  $('#time-left').textContent = fmt(plan.total - t);

  // Captions (and on-device speech for lines without a recording).
  const cap = captionAt(plan, t);
  const capEl = $('#caption');
  const key = cap ? cap.id + cap.t : '';
  if (capEl.dataset.key !== key) {
    capEl.dataset.key = key;
    capEl.classList.remove('show');
    if (cap) {
      setTimeout(() => {
        const tag = { science: 'Why it works', technique: 'Technique' }[cap.kind];
        capEl.innerHTML = (tag ? `<span class="tag">${tag}</span>` : '') + escapeHtml(cap.text);
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
  if (seg.kind !== 'hold' || !seg.record || seg.recorded) return;
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
  if (st.seg.kind !== 'hold') return;
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

function stopSession() {
  cancelAnimationFrame(raf);
  audio.pause();
  window.speechSynthesis?.cancel();
  wakeLock?.release?.().catch(() => {});
  wakeLock = null;
}

function finish() {
  if (lastSeg) recordHold(lastSeg, Math.min(audio.currentTime, lastSeg.end));
  const played = audio.currentTime;
  stopSession();

  const list = $('#hold-list');
  list.innerHTML = '';
  holds.forEach((h, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="k">Hold ${i + 1}</div><div class="v">${fmt(h)}</div>`;
    list.appendChild(li);
  });
  list.hidden = holds.length === 0;
  $('#after').innerHTML = (flow.after || []).map((x) => `<li>${x}</li>`).join('');
  $('#done-time').textContent = fmt(played);
  document.body.dataset.section = 'close';
  show('done');
}

function setMediaSession() {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: flow.title,
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
function bindUI() {
  $('#begin').addEventListener('click', begin);
  $('#open-learn').addEventListener('click', () => $('#learn').showModal());
  $('#done-learn').addEventListener('click', () => $('#learn').showModal());
  $$('.open-settings').forEach((b) => b.addEventListener('click', () => $('#settings').showModal()));
  $$('[data-close]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  $$('dialog').forEach((d) =>
    d.addEventListener('click', (e) => {
      if (e.target === d) d.close();
    })
  );

  $('#safety-ok').addEventListener('click', () => {
    save({ safetyAck: true });
    $('#safety').close();
    begin();
  });

  $$('#intensity button').forEach((b) =>
    b.addEventListener('click', () => {
      save({ intensity: { ...settings.intensity, [flow.id]: b.dataset.v } });
      syncIntensity();
      prepare();
    })
  );

  $('#set-voice').checked = settings.voice;
  $('#set-sounds').checked = settings.sounds;
  $('#set-music').checked = settings.music;
  let dirty = false;
  for (const [id, key] of [
    ['#set-voice', 'voice'],
    ['#set-sounds', 'sounds'],
    ['#set-music', 'music'],
  ]) {
    $(id).addEventListener('change', (e) => {
      save({ [key]: e.target.checked });
      dirty = true;
    });
  }
  $('#settings').addEventListener('close', () => {
    if (dirty && flow) prepare();
    dirty = false;
  });

  $('#pause-btn').addEventListener('click', togglePause);
  $('#breathe-btn').addEventListener('click', breatheNow);
  $('#end-btn').addEventListener('click', finish);
  $('#done-home').addEventListener('click', () => {
    location.hash = '#/';
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
  window.addEventListener('hashchange', route);
}

const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>';
const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

bindUI();
renderShelf();
route();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
