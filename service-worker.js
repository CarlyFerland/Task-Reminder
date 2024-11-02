const cacheName = 'task-reminder-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate event - clear old caches if necessary
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
});

// Fetch event - serve from cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
