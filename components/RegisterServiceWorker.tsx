"use client";

import { useEffect } from "react";

// Enregistre le service worker (public/sw.js) au chargement de l'app —
// nécessaire au mode hors-ligne et à l'installabilité complète de la PWA.
export default function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Échec silencieux : l'app reste utilisable en ligne sans mode hors-ligne.
      });
    }
  }, []);

  return null;
}
