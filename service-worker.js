// Offline shell + cue cache. Bump VERSION when shipping changes.
const VERSION = 'kumbha-v7';
const SHELL = [
  './',
  'index.html',
  'styles.css',
  'manifest.webmanifest',
  'js/app.js',
  'js/engine.js',
  'js/audio.js',
  'js/flows/index.js',
  'js/flows/lib.js',
  'js/flows/tide.js',
  'js/flows/clear.js',
  'js/flows/energy.js',
  'js/flows/calm.js',
  'js/flows/sleep.js',
  'js/flows/travel.js',
  'js/flows/notes.js',
  'js/flows/talk.js',
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
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first (so updates land), cache as fallback; cue audio and fonts are cached as they load.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    fetch(request)
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
