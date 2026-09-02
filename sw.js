const CACHE_NAME = "kas-rt-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
];

// SIMPAN ASSET KE MEMORI HP SAAT PERTAMA KALI DIBUKA (ONLINE)
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// BUKA KODE DARI MEMORI HP SAAT OFFLINE
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});