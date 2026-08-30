// English Lab - High Performance Service Worker
const CACHE_NAME = "english-lab-v1";
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/talk",
  "/vocabulary",
  "/learn",
  "/progress",
  "/manifest.json",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
];

// Install Event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Service Worker pre-caching non-fatal warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event (Cache Cleanup)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Stale-While-Revalidate for UI assets, Network-First for API and dynamic pages
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Bypass API and non-GET requests (e.g. AI chats, Supabase auth)
  if (event.request.method !== "GET" || url.pathname.startsWith("/api/")) {
    return;
  }

  // Static Assets & Fonts: Cache First with Network Fallback
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("fonts.googleapis.com")
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML / App Navigation: Network First with Cache Fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback to cached dashboard if navigating
        if (event.request.mode === "navigate") {
          return caches.match("/dashboard");
        }
        return new Response("Offline", { status: 503, statusText: "Offline" });
      })
  );
});
