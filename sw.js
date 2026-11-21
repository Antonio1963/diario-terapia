// Cache per l'uso offline. VERSION = terapia-<versione app>, da cambiare a ogni rilascio.
const VERSION = 'terapia-1.9';
const FILES = ['./', './index.html', './i18n.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('terapia-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // no-cache: chiede sempre al server se c'è una versione nuova (prima il telefono poteva tenere la vecchia fino a 10 minuti)
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => { const c = r.clone(); caches.open(VERSION).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
