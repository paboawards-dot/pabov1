// Service worker minimal — cf. cahier des charges, Bloc Navigation 3.6 :
// "Si l'utilisateur rouvre l'app hors-ligne : afficher la dernière page
// consultée si elle est en cache, sinon un écran 'Pas de connexion' simple."
//
// Stratégie : network-first avec repli sur le cache, puis sur /offline.
const CACHE_NAME = "pabo-awards-v2";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(["/", OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // On ne met en cache que les requêtes de navigation (pages HTML) et les
  // assets statiques GET — jamais les appels API (paiement, webhook, etc.),
  // qui doivent toujours atteindre le serveur (cf. règles de sécurité).
  const { pathname } = new URL(request.url);
  // Jamais de mise en cache pour les API ni pour le back-office /admin
  // (données privées, ne doivent pas rester dans le cache d'un appareil partagé).
  if (request.method !== "GET" || pathname.startsWith("/api/") || pathname.startsWith("/admin")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          () => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
    )
  );
});
