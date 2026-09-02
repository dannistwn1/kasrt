// UBAH ANGKANYA (v1, v2, v3, dst) SETIAP KALI ANDA DEPLOY UPDATE BARU
const CACHE_NAME = "kas-rt-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
];

// 1. INSTALASI: SIMPAN ASSET BARU
self.addEventListener("install", (e) => {
  self.skipWaiting(); // Memaksa Service Worker baru langsung aktif tanpa menunggu
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// 2. AKTIVASI: HAPUS OTOMATIS CACHE LAMA
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Menghapus cache lama:", key);
            return caches.delete(key); // Menghapus versi cache yang lama
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. FETCH: AMBIL DARI NETWORK DULU (Network-First Strategy)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Jika online, perbarui isi cache dengan respon terbaru dari server
        if (e.request.method === "GET") {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Jika offline atau koneksi gagal, baru ambil dari cache memori HP
        return caches.match(e.request);
      })
  );
});