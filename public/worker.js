/* eslint-disable no-restricted-globals */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable max-len */
const staticCacheName = 'static-v5';
const dynamicCache = 'dynamic-v2';

// Install Service Worker

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(staticCacheName).then((cache) => cache.addAll([
          '/auth/login',
          '/vendor/fontawesome-free/css/all.min.css',
          'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i',
          '/css/sb-admin-2.min.css',
          '/vendor/jquery/jquery.min.js',
          '/vendor/bootstrap/js/bootstrap.bundle.min.js',
          '/vendor/jquery-easing/jquery.easing.min.js',
          '/js/sb-admin-2.min.js',
        ])),
    );
});

// activate event
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            // console.log(keys);
             Promise.all(keys
                .filter((key) => key !== staticCacheName && key !== dynamicCache)
                .map((key) => caches.delete(key)))),
    );
});

// Fetch Event
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request).then((fetchRes) => caches.open(dynamicCache).then((cache) => {
                    cache.put(e.request.url, fetchRes.clone());
                    return fetchRes;
                }))).catch(() => caches.match('./error.html')),
    );
});

self.addEventListener('push', (e) => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'favicon.png',
      image: data.image,
    });
});