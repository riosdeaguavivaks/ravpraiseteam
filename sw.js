const C='praise-team-v6',F=['./','index.html','manifest.json','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(F)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// Responde primero con lo guardado (rápido y sin internet) y actualiza en segundo plano.
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(c=>{
    const n=fetch(e.request).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(x=>x.put(e.request,cp))}return r}).catch(()=>c);
    return c||n}))});
