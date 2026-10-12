const staticData = "Slavic-independent-church-v3"
const assets = [
  "/",
  "/index.html",
  "/rus.html",
  "/css/bootstrap.min.css",
  "/css/style.css",
  "/css/animate.css",
  "/color/default.css",
  "/js/jquery.min.js",
  "/js/bootstrap.min.js",
  "/js/custom.js",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticData).then(cache => {
      // Cache assets individually so one missing file doesn't fail the whole install.
      return Promise.all(
        assets.map(asset =>
          cache.add(asset).catch(err => console.warn("SW: failed to cache", asset, err))
        )
      )
    })
  )
  self.skipWaiting()
})

self.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== staticData).map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })