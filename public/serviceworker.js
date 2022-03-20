const staticCacheName = "site-static-v1";
const dynamicCacheName = "site-dynamic-v1";
const assets = ["index.html", "offline.html"];

const self = this;

// install serviceworker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log("opened cache");

      return cache.addAll(assets);
    })
  );
});

// listen for requests
self.addEventListener("fetch", (evt) => {
  // console.log(evt);
  if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(evt.request.url, fetchRes.clone());
                return fetchRes;
              });
            })
          );
        }) //
        .catch(() => {
          if (evt.request.url.indexOf(".html") > 1)
            return caches.match("offline.html");
        })
    );
  }
});

// activate the sw
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});
