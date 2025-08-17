const CACHE_NAME = "saikuto-cache"; // hanya 1 cache

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/success.html",
        "/headtrick.html",
        "/style.css",
        "/script.js",
        "/particles.js",
        "/logo.png"
      ]);
    })
  );
  self.skipWaiting(); // aktif langsung
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// strategi: network first, fallback ke cache
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// === Tambahan auto reload setelah update ===
self.addEventListener("message", event => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("activate", event => {
  event.waitUntil(
    clients.claim().then(() =>
      clients.matchAll({ type: "window" }).then(clientsArr => {
        clientsArr.forEach(client => client.navigate(client.url));
      })
    )
  );
});
