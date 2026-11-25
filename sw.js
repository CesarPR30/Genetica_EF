/* Service worker: modo sin conexión. Cambia VERSION al publicar cambios para renovar el caché. */
const VERSION = 'gef-v2';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './js/util.js', './js/svg.js', './js/generators.js', './js/data-mcq.js', './js/data-cases.js', './js/data-theory.js', './js/data-media.js', './js/app.js',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Videos y audios: directo de la red (pesan mucho y el navegador pide rangos de bytes).
  if (url.pathname.includes('/media/')) return;
  // Red primero para la página (para recibir actualizaciones), caché primero para el resto.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(VERSION).then((c) => c.put('./index.html', cp)); return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => {
    if (r.ok) { const cp = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, cp)); }
    return r;
  })));
});
