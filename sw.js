// A very small service worker. Chrome needs one before it offers "Install app".
// The POS needs the internet, so the only thing it does is show a friendly
// message when the phone has no connection.
var CACHE = "pos-shell-v1";
var SHELL = ["./offline.html", "./icon-192.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) { return cache.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k != CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode == "navigate") {
    event.respondWith(
      fetch(event.request).catch(function () { return caches.match("./offline.html"); })
    );
  }
});
