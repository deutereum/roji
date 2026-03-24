// ROJI PREDICTION — Service Worker
const CACHE = 'roji-v1';
const ASSETS = [
  './polymarket-scanner.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Always fetch live data for API calls (Binance, market feeds)
  const url = e.request.url;
  if (url.includes('binance.com') || url.includes('coingecko.com') ||
      url.includes('polymarket.com') || url.includes('gamma-api') ||
      url.includes('clob.polymarket')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
