import { FLOWS, MOMENTS, INTENSITY, LEVEL_NAMES, intensitiesOf } from './flows/index.js';
import { compile, stateAt, captionAt, exitOf, holdResults } from './engine.js';
import { notesHtml } from './flows/lib.js';
import { teacherTalk } from './flows/talk.js';
import { Bloom } from './bloom.js';
import { Contour, contourSvg } from './contour.js';
import { motif } from './motifs.js';
import { loadManifests, loadCues, loadMusic, renderSession, packCovers } from './audio.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmt = (s) => {
  s = Math.max(0, Math.round(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const minutes = (s) => `${Math.max(1, Math.round(s / 60))} min`;

// ── Settings ───────────────────────────────────────────
const DEFAULTS = { look: 2, voice: true, talk: 'guided', visual: 'contour', sounds: true, music: true, voiceVol: 1, bedVol: 1, safetyAck: false, intensity: {} };
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
  window.scrollTo(0, 0);
}

// ── Library ────────────────────────────────────────────
// Grouped by moment of the day; a moment with a single practice gets a wide tile.
async function renderShelf() {
  const { packs } = await loadManifests();
  const shelf = $('#shelf');
  shelf.innerHTML = '';
  for (const m of MOMENTS) {
    const fs = FLOWS.filter((f) => f.moment === m.id);
    if (!fs.length) continue;
    const head = document.createElement('div');
    head.className = 'moment';
    head.innerHTML = `<h2>${m.title}</h2><p>${m.sub}</p>`;
    shelf.appendChild(head);
    for (const f of fs) {
      const total = compile(f, durOf(packs[f.voice]), { ...INTENSITY[levelOf(f)], talk: settings.talk }).total;
      const wide = fs.length === 1;
      const a = document.createElement('a');
      a.className = wide ? 'tile wide' : 'tile';
      a.href = `#/p/${f.id}`;
      const meta = `<span class="tile-meta">${minutes(total)} · with ${VOICES[f.voice]}</span>`;
      a.innerHTML = wide
        ? `<span class="tile-text">${meta}<span class="tile-title">${f.titleHtml || f.title}</span><span class="tile-blurb">${f.blurb}</span></span><span class="tile-art">${motif(f.id)}</span>`
        : `<span class="tile-art">${motif(f.id)}</span><span class="tile-text"><span class="tile-title">${f.title}</span>${meta}</span>`;
      shelf.appendChild(a);
    }
  }
}

/** Contour art behind the library and practice headers (colours come from the section). */
function renderTopo() {
  $('#lib-topo').innerHTML = contourSvg({ w: 420, h: 340, cx: 318, cy: 112, s: 200, drift: 0.4 });
  $('#detail-topo').innerHTML = contourSvg({ w: 420, h: 300, cx: 330, cy: 70, s: 170, drift: 1.7 });
}

// ── Practice detail ────────────────────────────────────
function openFlow(f) {
  flow = f;
  document.body.dataset.section = f.sky || 'arrive';
  $('#d-title').innerHTML = f.titleHtml || f.title;
  $('#d-lede').textContent = f.lede;
  $('#learn-body').innerHTML = f.learn || '';
  $('#notes').hidden = !f.notes;
  $('#notes').open = false;
  $('#notes-audio').pause();
  $('#notes-body').innerHTML = f.notes ? notesHtml(f.notes) : '';
  $('#intensity-row').hidden = !f.intensity;
  $('#outline').open = matchMedia('(min-height: 900px) and (min-width: 700px)').matches;
  syncIntensity();
  show('detail');
  prepare();
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
  const opts = { ...INTENSITY[levelOf(f)], talk: settings.talk };
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
      ambience: settings.music,
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
  if (talkFor !== f.id) prepareTalk(f);
}

// ── Teacher's notes, read aloud ────────────────────────
// Rendered after the session track (so it never delays Begin), into its own player.
let talkFor = null;
let talkUrl = null;
async function prepareTalk(f) {
  talkFor = f.id;
  const btn = $('#notes-listen');
  const player = $('#notes-audio');
  player.pause();
  player.hidden = true;
  btn.hidden = false;
  btn.disabled = true;
  btn.textContent = 'Preparing audio…';
  const t = teacherTalk(f);
  if (!t) return;
  const { packs } = await loadManifests();
  const ids = [...new Set(compile(t, durOf(packs[f.voice]), { talk: 'full' }).voice.map((v) => v.id))];
  // Read aloud only once the instructor has recorded every line of the notes.
  if (!(await packCovers(f.voice, ids))) {
    btn.hidden = true;
    return;
  }
  const [loaded, music] = await Promise.all([loadCues(ids, f.voice), settings.music ? loadMusic(f.music) : null]);
  const durs = Object.fromEntries(Object.entries(loaded).filter(([, b]) => b).map(([k, b]) => [k, b.duration]));
  const p = compile(t, durs, { talk: 'full' });
  const blob = await renderSession(p, loaded, { breathSounds: false, ambience: settings.music, music, voiceGain: settings.voiceVol, bedGain: settings.bedVol * 0.8 });
  if (talkFor !== f.id) return;
  if (talkUrl) URL.revokeObjectURL(talkUrl);
  talkUrl = URL.createObjectURL(blob);
  player.src = talkUrl;
  btn.disabled = false;
  btn.textContent = `▶ Listen: ${VOICES[f.voice]} reads these notes · ${minutes(p.total)}`;
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
  $('#notes-audio').pause();
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
  stopSession();

  const list = $('#hold-list');
  list.innerHTML = '';
  holds.forEach((h, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="k">Hold ${i + 1}</div><div class="v">${fmt(h)}</div>`;
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
    artist: 'Kumbha · pranayama',
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
      talkFor = null; // re-render the notes track too (music/volume may have changed)
      prepare();
    }
    dirty = false;
  });
  $('#notes-listen').addEventListener('click', () => {
    const player = $('#notes-audio');
    $('#notes-listen').hidden = true;
    player.hidden = false;
    player.play().catch(() => {});
  });

  $('#pause-btn').addEventListener('click', togglePause);
  $('#breathe-btn').addEventListener('click', breatheNow);
  $('#end-btn').addEventListener('click', finish);
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

const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>';
const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';

bindUI();
renderShelf();
renderTopo();
route();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js').catch(() => {});
