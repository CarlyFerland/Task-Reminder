const cacheName = 'task-reminder-cache-v4';
const assetsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/firebaseConfig.js',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'
];

// Install event - cache essential assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching essential assets...');
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
    console.log('Service Worker activated and old caches cleared if any.');
});

// Fetch event - serve from cache only for static assets
self.addEventListener('fetch', event => {
    // Cache only requests for static assets
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request);
        })
    );
});
