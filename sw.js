// Keeps the app working with no network: serve the saved copy, refresh it when online.
// Bump together with APP_VERSION in index.html.
const CACHE = "lois-akara-v20";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "logo.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Update checks always go to the network and are never saved.
  if (new URL(e.request.url).searchParams.has("check")) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
