import { FLOWS, MOMENTS, LEVEL_NAMES, intensitiesOf, optsOf } from './flows/index.js';
import { compile, stateAt, captionAt, exitOf, holdResults, retention } from './engine.js';
import { notesHtml } from './flows/lib.js';
import { Bloom } from './bloom.js';
import { Contour, ContourArt } from './contour.js';
import { motif, washOf } from './motifs.js';
import { loadManifests, loadCues, loadMusic, renderSession, allAudioUrls } from './audio.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmt = (s) => {
  s = Math.max(0, Math.round(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const minutes = (s) => `${Math.max(1, Math.round(s / 60))} min`;

// ── Settings ───────────────────────────────────────────
const DEFAULTS = { look: 2, voice: true, talk: 'guided', visual: 'contour', sounds: true, music: true, vibrate: false, voiceVol: 1, bedVol: 1, safetyAck: false, intensity: {} };
let settings = load();
function load() {
  try {
    const stored = JSON.parse(localStorage.getItem('kumbha') || '{}');
    const s = { ...DEFAULTS, ...stored };
    if (typeof s.intensity !== 'object') s.intensity = {}; // v1 stored one global string
    if ('ambience' in s) s.music = s.ambience;
    if (s.explain === true && !('talk' in stored)) s.talk = 'full';
    // The Contour redesign: its visual becomes everyone's default once (judged on what was
    // stored, not the defaults), and is saved so a later choice of Bloom or Orb sticks.
    if (!(stored.look >= 2)) {
      Object.assign(s, { look: 2, visual: 'contour' });
      if (Object.keys(stored).length) localStorage.setItem('kumbha', JSON.stringify(s));
    }
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
// ── Session log (this device only) ─────────────────────
const LOG = 'kumbha-log';
function readLog() {
  try {
    const l = JSON.parse(localStorage.getItem(LOG) || '[]');
    return Array.isArray(l) ? l : [];
  } catch {
    return [];
  }
}
function logSession(entry) {
  try {
    localStorage.setItem(LOG, JSON.stringify([...readLog(), entry].slice(-500)));
  } catch {}
}
const day = (at) => new Date(at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

const levelOf = (flow) => {
  const lv = settings.intensity[flow.id];
  return intensitiesOf(flow).includes(lv) ? lv : flow.defaultLevel || 'standard';
};

// ── State ──────────────────────────────────────────────
let flow = null;
let plan = null;
let buffers = {};
let trackUrl = null;
let renderToken = 0;
let raf = 0;
let fired = new Set();
let skips = []; // [from, to] jumps made with "Breathe now"
let announced = '';
let wakeLock = null;
let bloom = null;
let contour = null;
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
  for (const [screen, a] of Object.entries(art)) screen === id ? a.play() : a.stop();
  if (id === 'library') revealShelf();
  window.scrollTo(0, 0);
}

// ── Library ────────────────────────────────────────────
// Grouped by moment of the day; a moment with a single practice gets a wide tile.
async function renderShelf() {
  const week = readLog().filter((e) => e.at > Date.now() - 7 * 864e5);
  const held = week.reduce((n, e) => n + (e.held || 0), 0);
  $('#week').textContent = week.length ? `This week: ${week.length} session${week.length > 1 ? 's' : ''} · ${minutes(week.reduce((n, e) => n + e.secs, 0))}${held ? ` · ${fmt(held)} held` : ''}` : '';
  const { packs } = await loadManifests();
  const shelf = $('#shelf');
  shelf.innerHTML = '';
  let n = 0;
  for (const m of MOMENTS) {
    const fs = FLOWS.filter((f) => f.moment === m.id);
    if (!fs.length) continue;
    const head = document.createElement('div');
    head.className = 'moment';
    head.style.setProperty('--i', String(n));
    head.innerHTML = `<h2>${m.title}</h2><p>${m.sub}</p>`;
    shelf.appendChild(head);
    for (const f of fs) {
      const total = compile(f, durOf(packs[f.voice]), { ...optsOf(levelOf(f)), talk: settings.talk }).total;
      const wide = fs.length === 1;
      const a = document.createElement('a');
      a.className = wide ? 'tile wide' : 'tile';
      a.style.setProperty('--i', String(n++));
      a.style.setProperty('--wash', washOf(f.id));
      a.href = `#/p/${f.id}`;
      const meta = `<span class="tile-meta">${minutes(total)}</span>`;
      a.innerHTML = wide
        ? `<span class="tile-text">${meta}<span class="tile-title">${f.titleHtml || f.title}</span><span class="tile-blurb">${f.blurb}</span></span><span class="tile-art">${motif(f.id)}</span>`
        : `<span class="tile-art">${motif(f.id)}</span><span class="tile-text"><span class="tile-title">${f.title}</span>${meta}</span>`;
      shelf.appendChild(a);
    }
  }
  if ($('#library').classList.contains('is-active')) revealShelf();
}

/** Tiles and headers arrive as they scroll into view, each batch staggered (styles.css, "Tile
 *  motion"). `.in` comes off once the choreography has played, so a hover never restarts it. */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
let revealer = null;
let firstReveal = true;
function revealShelf() {
  if (calm || !('IntersectionObserver' in window)) return;
  revealer?.disconnect();
  // The first batch waits for the hero to start; later ones (scrolling) go at once.
  let start = firstReveal ? 0.45 : 0.1;
  firstReveal = false;
  revealer = new IntersectionObserver(
    (entries) => {
      const batch = entries.filter((e) => e.isIntersecting);
      batch.forEach((e, k) => {
        const el = e.target;
        revealer.unobserve(el);
        const d = start + k * 0.08;
        el.style.setProperty('--d', `${d.toFixed(2)}s`);
        el.classList.replace('pending', 'in');
        setTimeout(() => el.classList.remove('in'), (d + 2.2) * 1000);
      });
      if (batch.length) start = 0.05;
    },
    { rootMargin: '0px 0px -6% 0px' }
  );
  for (const el of $$('#shelf > .tile, #shelf > .moment')) {
    el.classList.remove('in');
    el.classList.add('pending');
    revealer.observe(el);
  }
}

// Contour art behind the library and practice headers (colours come from the section),
// animated while its screen shows.
const art = {
  library: new ContourArt($('#lib-topo'), { w: 420, h: 340, cx: 318, cy: 112, s: 200, drift: 0.4 }),
  detail: new ContourArt($('#detail-topo'), { w: 420, h: 300, cx: 330, cy: 70, s: 170, drift: 1.7 }),
};

// ── Practice detail ────────────────────────────────────
function openFlow(f) {
  flow = f;
  document.body.dataset.section = f.sky || 'arrive';
  $('#d-title').innerHTML = f.titleHtml || f.title;
  $('#d-lede').textContent = f.lede;
  // A practice's teacher's tips sit in How it works, just before the safety notes.
  const tips = f.notes ? `<h3>Tips</h3><div class="notes-body">${notesHtml(f.notes)}</div>` : '';
  const learn = f.learn || '';
  $('#learn-body').innerHTML = learn.includes('<h3>Safety</h3>') ? learn.replace('<h3>Safety</h3>', `${tips}<h3>Safety</h3>`) : learn + tips;
  $('#intensity-row').hidden = !f.intensity;
  $('#outline').open = matchMedia('(min-height: 900px) and (min-width: 700px)').matches;
  syncIntensity();
  renderHistory(f);
  show('detail');
  prepare();
}

/** The last sessions of this practice, and a small chart of its number over the last 20
 *  (seconds held, or the practice's own `metric`, e.g. Breath Check's control pause). */
function renderHistory(f) {
  const all = readLog().filter((e) => e.id === f.id);
  const metric = f.metric || { label: 'held', of: (e) => e.held };
  const val = (e) => metric.of(e) || 0;
  const pts = all.slice(-20).map(val);
  const max = Math.max(...pts, 1);
  const chart =
    pts.length > 1 && pts.some(Boolean)
      ? `<li class="chart"><svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.map((v, i) => `${((i / (pts.length - 1)) * 100).toFixed(1)},${(22 - (v / max) * 20).toFixed(1)}`).join(' ')}"/></svg><span>${metric.label}, last ${pts.length}</span></li>`
      : '';
  const rows = all.slice(-3).reverse().map((e) => `<li><span>${day(e.at)}</span><span>${minutes(e.secs)}${val(e) ? ` · ${fmt(val(e))} ${metric.label}` : ''}</span></li>`);
  $('#history').hidden = !rows.length;
  $('#history').innerHTML = chart + rows.join('');
}

function syncIntensity() {
  const lv = levelOf(flow);
  const seg = $('#intensity');
  seg.innerHTML = intensitiesOf(flow)
    .map((v) => `<button data-v="${v}" aria-pressed="${v === lv}">${(flow.levelNames || {})[v] || LEVEL_NAMES[v]}</button>`)
    .join('');
  $('#intensity-note').textContent = (flow.intensityNotes || {})[lv] || '';
}

// Every practice has its own instructor and voice pack (flow.voice).
const VOICES = { leo: 'Leo', mira: 'Mira' };
const durOf = (m = {}) => Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v.duration]));

function renderMap() {
  $('#d-eyebrow').textContent = `${flow.tag} · ${minutes(plan.total)}`;
  $('#outline-count').textContent = `${plan.sections.length} parts`;
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
  const opts = { ...optsOf(levelOf(f)), talk: settings.talk };
  const begin = $('#begin');
  begin.disabled = true;
  $('#begin-sub').textContent = 'Preparing…';

  // Draft with the recorded durations to learn which lines this run needs, then decode them
  // in the practice's own voice.
  const { packs } = await loadManifests();
  plan = compile(f, durOf(packs[f.voice]), opts);
  renderMap();
  const ids = [...new Set(plan.voice.map((v) => v.id))];
  const [loaded, music] = await Promise.all([loadCues(ids, f.voice), settings.music ? loadMusic(f.music) : null]);
  if (token !== renderToken) return;
  buffers = loaded;
  const durs = Object.fromEntries(Object.entries(buffers).filter(([, b]) => b).map(([k, b]) => [k, b.duration]));
  plan = compile(f, durs, opts);
  renderMap();

  const missing = ids.filter((id) => !buffers[id]).length;
  // Lines without a recording can only be read by the device while the screen is on.
  $('#voice-note').textContent = !settings.voice || !missing ? '' : `Audio incomplete: ${missing} of ${ids.length} spoken cues aren't recorded yet. Your device reads those, but only while the screen stays on.`;
  $('#voice-note').classList.toggle('warn', !!(settings.voice && missing));

  let blob;
  try {
    blob = await renderSession(plan, settings.voice ? buffers : {}, {
      breathSounds: settings.sounds,
      ambience: settings.music && f.music !== false,
      music,
      voiceGain: settings.voiceVol,
      bedGain: settings.bedVol,
    });
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
  skips = [];
  announced = '';
  audio.currentTime = 0;
  try {
    await audio.play();
  } catch (e) {
    console.warn(e);
    $('#begin-sub').textContent = 'Tap to retry';
    $('#play-error').hidden = false;
    return;
  }
  $('#play-error').hidden = true;
  $('#begin-sub').textContent = minutes(plan.total);
  $('#session').dataset.visual = settings.visual;
  show('session');
  if (settings.visual === 'bloom') {
    bloom ??= new Bloom($('#bloom'));
    bloom.resize();
  } else if (settings.visual === 'contour') {
    contour ??= new Contour($('#contour'));
    contour.resize();
    contour.restart();
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

let buzzKey = '';
/** A short buzz when the breath turns (Android; iPhones have no vibration API for the web). */
function buzz(st) {
  const key = st.seg.kind === 'pace' || st.seg.kind === 'hold' ? `${st.seg.start}|${st.label}|${st.breath}` : '';
  if (key === buzzKey) return;
  buzzKey = key;
  if (key && settings.vibrate && document.visibilityState === 'visible') navigator.vibrate?.(st.phase === 'in' ? 40 : st.phase === 'out' ? [20, 60, 20] : 15);
}

function frame(t) {
  const st = stateAt(plan, t);
  buzz(st);
  $('#session').dataset.phase = st.phase;
  document.body.dataset.section = st.seg.section;
  if (contour && settings.visual === 'contour') contour.draw(st, t);
  else if (bloom && settings.visual === 'bloom') bloom.draw(st, t);
  else $('#orb').style.setProperty('--s', st.scale.toFixed(4));

  const phaseEl = $('#phase');
  const countEl = $('#count');
  if (st.seg.kind === 'hold') {
    phaseEl.textContent = st.label;
    countEl.innerHTML = `<b>${fmt(st.elapsed)}</b>Breathe whenever you need`;
    $('#ring-fill').style.strokeDashoffset = String(2 * Math.PI * 46 * (1 - st.p));
  } else if (st.seg.kind === 'pace') {
    phaseEl.textContent = st.label;
    countEl.textContent = st.sub || '';
  } else {
    // A labelled rest (between holds) counts down to the next one.
    phaseEl.textContent = st.label;
    countEl.textContent = st.label ? fmt(st.seg.end - t) : '';
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
  const [part, text] = cap ? captionPart(cap, t) : [0, ''];
  const key = cap ? `${cap.id}${cap.t}|${part}` : '';
  if (capEl.dataset.key !== key) {
    capEl.dataset.key = key;
    capEl.classList.remove('show');
    if (cap) {
      setTimeout(() => {
        const tag = { science: 'Why it works', technique: 'Technique' }[cap.kind];
        capEl.innerHTML = (tag ? `<span class="tag">${tag}</span>` : '') + escapeHtml(text);
        capEl.classList.add('show');
      }, 180);
    }
  }
  // Screen readers hear phase changes only, not every timer tick.
  const phaseText = st.seg.kind === 'pace' || st.seg.kind === 'hold' ? st.label : '';
  const liveKey = `${st.seg.start}|${phaseText}`;
  if (phaseText && liveKey !== announced) {
    announced = liveKey;
    $('#live').textContent = phaseText;
  }
  voiceTick(t);
}

/** On-device speech for lines without a recording. Also driven by `timeupdate`, so it
 *  doesn't depend on animation frames (which stop in background tabs). */
function voiceTick(t) {
  if (!settings.voice || audio.paused || !plan) return;
  for (const v of plan.voice) {
    if (v.t > t) break;
    if (fired.has(v)) continue;
    fired.add(v);
    if (!buffers[v.id] && t - v.t < 1.5) speak(v.text);
  }
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
  // Skip the rest of the retention block (e.g. an empty hold and the recovery hold after
  // it), straight into normal breathing.
  const target = exitOf(plan, st.seg) + 0.01;
  skips.push([audio.currentTime, target]);
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
  const played = audio.ended ? plan.total : audio.currentTime;
  const holds = holdResults(plan, skips, played);
  const held = Math.round(retention(plan, skips, played));
  const before = readLog().filter((e) => e.id === flow.id).at(-1);
  if (played >= 60 && !flow.noLog) logSession({ id: flow.id, level: levelOf(flow), at: Date.now(), secs: Math.round(played), held, holds: holds.map(Math.round) });
  stopSession();

  // The practice's own number (Breath Check: the control pause), or seconds held.
  const metric = flow.metric || { label: 'held', of: (e) => e.held };
  const now = metric.of({ held, holds });
  const then = before && metric.of(before);
  $('#done-held').hidden = !now;
  $('#done-held').textContent = `${fmt(now)} ${metric.label}${then ? ` · last time ${fmt(then)}` : ''}`;

  const list = $('#hold-list');
  list.innerHTML = '';
  holds.forEach((h, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="k">${(flow.recordNames || [])[i] || `Hold ${i + 1}`}</div><div class="v">${fmt(h)}</div>`;
    list.appendChild(li);
  });
  list.hidden = holds.length === 0;
  $('#hold-head').hidden = holds.length === 0;
  $('#after').innerHTML = (flow.after || []).map((x) => `<li>${x}</li>`).join('');
  $('#done-time').textContent = fmt(played);
  document.body.dataset.section = 'close';
  show('done');
}

function setMediaSession() {
  if (!('mediaSession' in navigator)) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: flow.title,
    artist: 'Breathe-up',
    artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
  });
  navigator.mediaSession.setActionHandler('play', () => audio.play());
  navigator.mediaSession.setActionHandler('pause', () => audio.pause());
}

/** A long line is shown a sentence or two at a time (up to ~18 words), in step with the voice,
 *  so the caption keeps one size. -> [part index, text] */
function captionPart(cap, t) {
  const words = (s) => s.trim().split(/\s+/).length;
  // Sentences; one over 22 words splits at the comma or colon nearest its middle.
  const sentences = (cap.text.match(/[^.!?]+[.!?]+\S*\s*|[^.!?]+$/g) || [cap.text]).flatMap((s) => {
    if (words(s) <= 22) return [s];
    const cuts = [...s.matchAll(/[,:;] /g)].map((m) => m.index + 2);
    const cut = cuts.sort((a, b) => Math.abs(a - s.length / 2) - Math.abs(b - s.length / 2))[0];
    return cut ? [s.slice(0, cut), s.slice(cut)] : [s];
  });
  const parts = [];
  for (const s of sentences) {
    const last = parts.at(-1);
    if (last && words(last + s) <= 18) parts[parts.length - 1] = last + s;
    else parts.push(s);
  }
  const total = parts.reduce((n, p) => n + p.length, 0);
  let at = ((t - cap.t) / cap.dur) * total;
  let i = 0;
  while (i < parts.length - 1 && at > parts[i].length) at -= parts[i++].length;
  return [i, parts[i].trim()];
}

function escapeHtml(s) {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

// ── UI wiring ──────────────────────────────────────────
function bindUI() {
  // Tiles: a spotlight in the practice's colour and a slight tilt, following the pointer.
  $('#shelf').addEventListener('pointermove', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile || e.pointerType !== 'mouse') return;
    const r = tile.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    tile.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    tile.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    tile.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`);
    tile.style.setProperty('--rx', `${((0.5 - y) * 5).toFixed(2)}deg`);
  });
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

  $('#intensity').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    save({ intensity: { ...settings.intensity, [flow.id]: b.dataset.v } });
    syncIntensity();
    prepare();
  });

  $('#set-voice').checked = settings.voice;
  const syncTalk = () => $$('#set-talk button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === settings.talk)));
  syncTalk();
  const syncVisual = () => $$('#set-visual button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === settings.visual)));
  syncVisual();
  $('#set-visual').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    save({ visual: b.dataset.v });
    syncVisual();
  });
  $('#set-sounds').checked = settings.sounds;
  $('#set-music').checked = settings.music;
  $('#set-voice-vol').value = settings.voiceVol;
  $('#set-bed-vol').value = settings.bedVol;
  let dirty = false;
  $('#set-vibrate').checked = settings.vibrate;
  $('#set-vibrate').closest('.setting').hidden = !('vibrate' in navigator);
  $('#set-vibrate').addEventListener('change', (e) => save({ vibrate: e.target.checked }));
  $('#export-log').addEventListener('click', exportLog);
  $('#save-offline').addEventListener('click', saveOffline);
  $('#add-reminder').addEventListener('click', addReminder);
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
  for (const [id, key] of [
    ['#set-voice-vol', 'voiceVol'],
    ['#set-bed-vol', 'bedVol'],
  ]) {
    $(id).addEventListener('change', (e) => {
      save({ [key]: Number(e.target.value) });
      dirty = true;
    });
  }
  $('#set-talk').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    save({ talk: b.dataset.v });
    syncTalk();
    dirty = true;
  });
  $('#settings').addEventListener('close', () => {
    if (dirty) renderShelf();
    if (dirty && flow) {
      prepare();
    }
    dirty = false;
  });

  $('#pause-btn').addEventListener('click', togglePause);
  $('#breathe-btn').addEventListener('click', breatheNow);
  $('#end-btn').addEventListener('click', finish);
  $('#done-again').addEventListener('click', begin);
  $('#done-home').addEventListener('click', () => {
    location.hash = '#/';
  });
  audio.addEventListener('ended', finish);
  audio.addEventListener('timeupdate', () => voiceTick(audio.currentTime));
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

// ── Log export, offline audio, reminders ───────────────
function download(name, type, text) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function exportLog() {
  const title = Object.fromEntries(FLOWS.map((f) => [f.id, f.title]));
  const rows = readLog().map((e) => [new Date(e.at).toISOString(), title[e.id] || e.id, e.level || '', e.secs, e.held || 0, (e.holds || []).join(' ')]);
  const csv = [['date', 'practice', 'level', 'seconds', 'seconds_held', 'holds'], ...rows].map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')).join('\n');
  download('breathe-up-log.csv', 'text/csv', csv + '\n');
}

/** Fetch every recording once; the service worker keeps them, across app updates. */
async function saveOffline() {
  const btn = $('#save-offline');
  btn.disabled = true;
  const urls = await allAudioUrls();
  let done = 0;
  let failed = 0;
  const next = async () => {
    while (urls.length) {
      const u = urls.pop();
      try {
        if (!(await fetch(u)).ok) failed++;
      } catch {
        failed++;
      }
      btn.textContent = `Saving… ${++done}`;
    }
  };
  await Promise.all(Array.from({ length: 6 }, next));
  btn.disabled = false;
  btn.textContent = failed ? `Saved, ${failed} failed. Tap to retry` : 'Saved for offline ✓';
}

/** A daily calendar event at the chosen time, linking back to this practice. */
function addReminder() {
  const [h, m] = ($('#reminder-time').value || '07:30').split(':').map(Number);
  const start = new Date();
  start.setHours(h, m, 0, 0);
  if (start < new Date()) start.setDate(start.getDate() + 1);
  const end = new Date(start.getTime() + Math.max(5, Math.round(plan.total / 60)) * 60000);
  const local = (d) => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  const url = `${location.origin}${location.pathname}#/p/${flow.id}`;
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Breathe-up//EN', 'BEGIN:VEVENT',
    `UID:kumbha-${flow.id}-${Date.now()}`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${local(start)}`, `DTEND:${local(end)}`, 'RRULE:FREQ=DAILY',
    `SUMMARY:${flow.title} with ${VOICES[flow.voice]}`, `URL:${url}`, `DESCRIPTION:${url}`,
    'BEGIN:VALARM', 'TRIGGER:PT0M', 'ACTION:DISPLAY', `DESCRIPTION:${flow.title}`, 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  download(`breathe-up-${flow.id}.ics`, 'text/calendar', ics + '\r\n');
}

const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>';
const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

bindUI();
renderShelf();
route();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
