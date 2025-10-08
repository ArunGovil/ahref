const cacheName = "v1.1";
const cacheAssets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./pwa-icon-192.png",
  "./pwa-icon-512.png",
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(cacheAssets)),
  );
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
