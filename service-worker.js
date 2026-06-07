const CACHE_NAME = "tasbih-online-v-0.0.2";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./zikr.json",
  "./manifest.json",
  "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700;800&display=swap",
  "https://cdn.jsdelivr.net/npm/sweetalert2@11",
];

// Installation du Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(
          ASSETS_TO_CACHE.filter(
            (url) =>
              !url.includes("fonts.googleapis") &&
              !url.includes("cdn.jsdelivr"),
          ),
        );
      })
      .then(() => self.skipWaiting()),
  );
});

// Activation du Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Gestion des requêtes
self.addEventListener("fetch", (event) => {
  // Ne pas mettre en cache les appels API Google Analytics
  if (
    event.request.url.includes("google") ||
    event.request.url.includes("gtag")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourner le cache si disponible
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Ne pas mettre en cache les réponses non-OK
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }

          // Cloner la réponse car elle ne peut être utilisée qu'une fois
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Retourner une page hors ligne si la requête échoue
          if (event.request.destination === "document") {
            return caches.match("./index.html");
          }
        });
    }),
  );
});

// Gestion de la synchronisation en arrière-plan (sauvegarde de l'état)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-tasbih-state") {
    event.waitUntil(
      // La synchronisation de l'état se fera via localStorage
      Promise.resolve(),
    );
  }
});
