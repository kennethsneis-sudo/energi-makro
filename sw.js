const C="energi-makro-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{}));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  // dataene ligger inne i index.html: siden hentes alltid nett først (ferske tall), cache bare offline
  if(e.request.mode==="navigate" || u.pathname.endsWith("/") || u.pathname.endsWith("index.html")){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));
    return;
  }
  // ikoner, manifest og fonter: cache først
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
