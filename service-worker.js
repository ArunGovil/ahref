const cacheName = "v1.4";
const cacheAssets = [
  "./",
  "./index.html",
  "./manifest.json",
  "./pwa-icon-192.png",
  "./pwa-icon-512.png",
];

// Install Event
self.addEventListener("install", (e) => {
  console.log("SW installing...");
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(cacheAssets)),
  );
  self.skipWaiting(); // Activate immediately after install
});

// Activate Event - clear old caches
self.addEventListener("activate", (e) => {
  console.log("SW activating...");
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== cacheName)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
});

// Fetch Event
self.addEventListener("fetch", (e) => {
  if (e.request.mode === "navigate") {
    // Always fetch index.html from network first
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(e.request, res.clone());
            return res;
          });
        })
        .catch(() => caches.match(e.request)),
    );
  } else {
    // Cache first for other assets
    e.respondWith(
      caches.match(e.request).then((res) => res || fetch(e.request)),
    );
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "UPDATE_APP") {
    self.skipWaiting();
  }
});
