self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("saikuto-cache").then(cache => {
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
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
