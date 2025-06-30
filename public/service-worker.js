
const CACHE_NAME = 'simusmart-os-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Failed to cache during install:', error);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    // We only want to cache GET requests.
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // For API calls to Google, always fetch from the network.
    if (event.request.url.includes('googleapis.com')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request)
                .then(response => {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }

                    // Not in cache, fetch from network
                    return fetch(event.request).then(
                        networkResponse => {
                            // Check if we received a valid response
                            if (networkResponse && networkResponse.status === 200) {
                                // IMPORTANT: Clone the response. A response is a stream
                                // and because we want the browser to consume the response
                                // as well as the cache consuming the response, we need
                                // to clone it so we have two streams.
                                const responseToCache = networkResponse.clone();
                                cache.put(event.request, responseToCache);
                            }
                            return networkResponse;
                        }
                    ).catch(error => {
                        console.error('Fetching failed:', error);
                        // Optional: return a fallback offline page if fetch fails
                        // return caches.match('/offline.html');
                    });
                });
        })
    );
});


// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
