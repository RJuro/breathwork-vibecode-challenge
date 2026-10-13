// Offline shell + audio cache. Bump VERSION when shipping changes; AUDIO survives the bump, since
// every recording is versioned in its URL (?v=) and never changes in place.
const VERSION = 'kumbha-v27';
const AUDIO = 'kumbha-audio';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'js/app.js',
  'js/engine.js',
  'js/bloom.js',
  'js/contour.js',
  'js/motifs.js',
  'js/audio.js',
  'js/flows/index.js',
  'js/flows/lib.js',
  'js/flows/train.js',
  'js/flows/sit.js',
  'js/flows/weather.js',
  'js/flows/retain.js',
  'js/flows/daily.js',
  'js/flows/notes.js',
  'icons/icon.svg',
  'icons/icon-192.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((c) => c.addAll(SHELL))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION && k !== AUDIO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so updates land), cache as fallback; cue audio and fonts are cached as they load.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // The server sends no Cache-Control, so the browser may treat old files as fresh: revalidate
  // our own files on every load (a cheap 304 when unchanged). Versioned (?v=) audio and fonts
  // can use the HTTP cache as is.
  // (A navigation request can't be re-issued with options, so build a fresh one.)
  const url = new URL(request.url);
  // Versioned recordings: cache first, kept across updates (and filled by "Save audio for offline").
  if (url.origin === self.location.origin && url.searchParams.has('v') && /\.mp3$/.test(url.pathname)) {
    event.respondWith(
      caches.open(AUDIO).then((c) =>
        c.match(request).then(
          (hit) =>
            hit ||
            fetch(request).then((res) => {
              if (res.ok) c.put(request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }
  const own = url.origin === self.location.origin && !url.searchParams.has('v');
  event.respondWith(
    fetch(own ? new Request(request.url, { cache: 'no-cache', credentials: 'same-origin' }) : request)
      .then((res) => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(() => caches.match(request).then((hit) => hit || Response.error()))
  );
});
