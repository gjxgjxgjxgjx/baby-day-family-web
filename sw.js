const CACHE_NAME = "baby-day-shell-bd059ceb4801";
const PRECACHE = ["/baby-day-family-web/","/baby-day-family-web/index.html","/baby-day-family-web/cloudbase-config.js","/baby-day-family-web/manifest.webmanifest","/baby-day-family-web/assets/index-B-FuA0Wg.css","/baby-day-family-web/assets/index-q1RFYo5e.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("baby-day-shell-") && key !== CACHE_NAME).map((key) => caches.delete(key)))));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith("/baby-day-family-web/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(caches.match("/baby-day-family-web/index.html").then((cached) => {
      const fresh = fetch(request).then((response) => {
        if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put("/baby-day-family-web/index.html", response.clone()));
        return response;
      }).catch(() => cached);
      event.waitUntil(fresh.then(() => undefined, () => undefined));
      return cached || fresh;
    }));
    return;
  }

  if (url.pathname.startsWith("/baby-day-family-web/assets/")) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
      return response;
    })));
    return;
  }

  event.respondWith(fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  }).catch(() => caches.match(request)));
});
