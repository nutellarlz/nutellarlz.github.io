//This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

//Install stage sets up the offline page in the cahche and opens a new cache
self.addEventListener('install', function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function(){
  console.log('[PWA Builder] Install Event processing');
  return caches.open('pwabuilder-offline').then(function(cache) {
    console.log('[PWA Builder] Cached index and offline page during Install');
    return cache.addAll(['/offline.html', 
	'/index.html', 
	'styles.blog.css', 
	'styles.css', 
	'styles.portfolio.css', 
	'styles.text.css', 
	'material.min.css', 
	'css/offline.css', 
	'css/scroll.css', 
	'css/tabzilla.css', 
	'css/tabzilla2.css', 
	'css/demo.css', 
	'css/creative.css', 
	'css/creative.css', 
	'css/creative.css', 
	'media/img/tabzilla-static.png', 
	'media/img/tabzilla-static-high-res.png', 
	'media/img/offline-logo.png', 
	'media/img/offline-logo-hi-res.png', 
	'media/img/nutellarlz-white.png', 
	'images/about-header-off.jpg', 
	'images/NutellaRlzMC_1mb.png', 
	'images/josiah_main.png', 
	'images/AnJ_senior_pics.png', 
	'images/about-header.jpg', 
	'images/favicon.png', 
	'https://code.getmdl.io/1.3.0/material.min.js', 
	'https://fonts.googleapis.com/icon?family=Material+Icons']);
  });
}

self.addEventListener('fetch', function(event) {
  console.log('The service worker is serving the asset.');
  event.respondWith(checkResponse(event.request).catch(function() {
    return returnFromCache(event.request)}
  ));
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request){
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response){
      if(response.status !== 404) {
        fulfill(response)
      } else {
        reject()
      }
    }, reject)
  });
};

var addToCache = function(request){
  return caches.open('pwabuilder-offline').then(function (cache) {
    return fetch(request).then(function (response) {
      console.log('[PWA Builder] add page to offline'+response.url)
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request){
  return caches.open('pwabuilder-offline').then(function (cache) {
    return cache.match(request).then(function (matching) {
     if(!matching || matching.status == 404) {
       return cache.match('offline.html')
     } else {
       return matching
     }
    });
  });
};