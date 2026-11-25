'use strict';
const CACHE='rav-praise-pwa-shell-v3-logo-20261124';
const ASSETS=[
  './manifest.webmanifest','./logo.png',
  './icons/icon-192.png','./icons/icon-512.png',
  './icons/icon-maskable-512.png','./icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];
const ASSET_URLS=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('rav-praise-pwa-shell-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(ASSET_URLS.has(url.href)){
    event.respondWith((async()=>{
      const cached=await caches.match(request);
      if(cached)return cached;
      const response=await fetch(request);
      if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}
      return response;
    })());
  }
});
