// ══════════════════════════════════════════════════
// CUADERNO APP — SERVICE WORKER
// Versión: actualizar CACHE_VERSION para forzar update
// ══════════════════════════════════════════════════

const CACHE_VERSION = 'cuaderno-v2';
const CACHE_STATIC  = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;

// Archivos que se cachean en la instalación (app shell)
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  // Google Fonts (se intentan cachear; si fallan, no bloquean)
  'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap',
];

// ── INSTALL ──────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[SW] Instalando...');
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => {
        // Cacheamos los assets críticos. Usamos addAll con manejo de errores
        const promises = STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] No se pudo cachear:', url, err);
          })
        );
        return Promise.all(promises);
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE ─────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[SW] Activando...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map(key => {
            console.log('[SW] Eliminando caché viejo:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ── FETCH ─────────────────────────────────────────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // No interceptar requests a Supabase API (necesitan red siempre)
  if (url.hostname.includes('supabase.co')) {
    return; // deja pasar sin interceptar
  }

  // Para peticiones GET usamos estrategia Cache First con fallback a red
  if (request.method === 'GET') {
    event.respondWith(cacheFirst(request));
  }
});

// Estrategia: Cache First → Network → (guarda en dynamic cache)
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const networkResponse = await fetch(request);
    // Solo cacheamos respuestas válidas de otros orígenes (fonts, etc.)
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_DYNAMIC);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    // Sin red y sin caché: devolver página offline si existe
    const offlineFallback = await caches.match('./index.html');
    if (offlineFallback) return offlineFallback;
    return new Response('Sin conexión', { status: 503, statusText: 'Offline' });
  }
}

// ── BACKGROUND SYNC (opcional, para futuros envíos offline) ──
self.addEventListener('sync', event => {
  if (event.tag === 'sync-movimientos') {
    console.log('[SW] Background sync: movimientos');
    // Aquí podrías procesar una cola de movimientos pendientes
  }
});

// ── PUSH NOTIFICATIONS (placeholder para futuro) ──
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'Cuaderno', {
    body: data.body || '',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
  });
});
