var C="iris-v1",CORE=["iris-ai.html","manifest.webmanifest","iris-icon-v2.svg","iris-192.png","iris-512.png"];
self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){return Promise.all(CORE.map(function(u){return c.add(u).catch(function(){})}))}).then(function(){return self.skipWaiting()}));
});
self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==C}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener("fetch",function(e){
  var r=e.request;if(r.method!=="GET")return;
  var u=new URL(r.url),cdn=/(^|\.)(jsdelivr\.net|unpkg\.com|googleapis\.com)$/.test(u.hostname);
  if(!cdn&&u.origin!==location.origin)return;
  e.respondWith(caches.match(r).then(function(hit){
    if(hit)return hit;
    return fetch(r).then(function(res){
      if(res&&(res.ok||res.type==="opaque")){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
      return res;
    }).catch(function(){
      if(r.mode==="navigate")return caches.match("iris-ai.html");
      return new Response("",{status:504});
    });
  }));
});
