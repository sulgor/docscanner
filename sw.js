const CACHE = 'docscanner-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com') ||
      e.request.url.includes('fonts.googleapis.com') ||
      e.request.url.includes('fonts.gstatic.com') ||
      e.request.url.includes('cdn.jsdelivr.net') ||
      e.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request)
        .catch(() => caches.match('./index.html'))
      )
  );
});
