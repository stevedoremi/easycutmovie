const V='cutter-v3',SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='share').map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 if(r.method==='POST'&&u.pathname.endsWith('/share-target')){
  e.respondWith((async()=>{
   try{
    const f=(await r.formData()).get('video');
    if(f&&typeof f!=='string'){const c=await caches.open('share');
     await c.put('shared-video',new Response(f,{headers:{'Content-Type':f.type||'video/mp4','X-Filename':encodeURIComponent(f.name||'shared.mp4')}}))}
   }catch(err){}
   return Response.redirect(new URL('./?shared=1',r.url).href,303);
  })());
  return;
 }
 if(r.method==='GET'&&u.origin===location.origin){
  e.respondWith(fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>caches.match(r,{ignoreSearch:true})));
 }
});
