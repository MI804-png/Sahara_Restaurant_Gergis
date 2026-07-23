const CACHE_NAME = 'sahara-shell-v2'
const APP_SHELL = ['/', '/manifest.webmanifest', '/sahara-mark.svg']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then((response) => {
          if (!response.ok) {
            return response
          }

          const clone = response.clone()
          const cacheableDestinations = ['document', 'script', 'style', 'image', 'font', 'video']

          if (cacheableDestinations.includes(request.destination)) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }

          return response
        })
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match('/')
          }

          return new Response('Offline', {
            status: 503,
            statusText: 'Offline',
          })
        })
    }),
  )
})