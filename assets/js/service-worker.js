const CACHE_NAME = 'photo-cache-v1';
const FILES_TO_CACHE = []; // Optional: Pre-cache specific photos

// Install event: Pre-cache specific files if needed
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache');
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Activate event: Cleanup old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            )
        )
    );
});

// Fetch event: Intercept and cache images dynamically
self.addEventListener('fetch', event => {
    const request = event.request;

    // Check if the request is for an image
    if (request.destination === 'image') {
        event.respondWith(
            caches.match(request).then(response => {
                // Return the cached image if available
                if (response) {
                    return response;
                }

                // Fetch and cache the image dynamically
                return fetch(request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    }
});
