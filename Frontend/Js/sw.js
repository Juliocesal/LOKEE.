const CACHE_NAME = 'Rentify-v1.0';
const ASSETS = [
    '/Frontend/landing.html',
    '/Frontend/Html/index.html',
    '/Frontend/Css/styles.css',
    '/Frontend/Js/app.js',
    '/Frontend/Images/android/android-launchericon-192-192.png',
    '/Frontend/Images/android/android-launchericon-512-512.png',
    '/Frontend/manifest.json',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Estrategia: Cache First, luego Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});

// Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

