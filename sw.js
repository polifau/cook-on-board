// Cook On Board — fonctionne hors connexion. Avec du réseau : toujours la dernière version ; sans réseau : la copie enregistrée.
const CACHE='cob-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{
    if(r&&r.ok&&new URL(e.request.url).origin===location.origin){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
});
