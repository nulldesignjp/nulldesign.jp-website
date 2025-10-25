/*
    sw.js
    https://qiita.com/tiwu_dev/items/47e8a7c3e6f2d57816d7
    https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=ja
*/

var CACHE_NAME  = "metrogram3d.cache.v00001";
var DOMAIN = "";
var urlsToCache = [
    DOMAIN + "/metrogram3d/shared/css/reset.css",
    DOMAIN + "/metrogram3d/shared/css/style.css",

    DOMAIN + "/metrogram3d/shared/data/schdule.js.gz",
    DOMAIN + "/metrogram3d/shared/data/stationlist.xml",
    
    DOMAIN + "/metrogram3d/shared/js/libs.js.gz",
    DOMAIN + "/metrogram3d/shared/js/jquery-3.5.1.min.js.gz",
    DOMAIN + "/metrogram3d/shared/js/three.min.js.gz",

    DOMAIN + "/metrogram3d/shared/img/badges-chrome_experiments_png/_b4.png",
    DOMAIN + "/metrogram3d/shared/img/txt_initialize01.png",
    DOMAIN + "/metrogram3d/shared/img/txt_description01.png",
    DOMAIN + "/metrogram3d/shared/img/txt_copyright01.png",
    DOMAIN + "/metrogram3d/shared/img/ico_tw01.png",
    DOMAIN + "/metrogram3d/shared/img/spark1.png",

    DOMAIN + "/metrogram3d/index.html",
    DOMAIN + "/metrogram3d/shared/js/app.js",




  "https://www.googletagmanager.com/gtag/js?id=UA-3578150-4",
  "https://fonts.googleapis.com/css?family=EB+Garamond"
];

//  1st
self.addEventListener('install', function(event) {
    console.log('serviceWorker.install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(
            function(cache){
                console.log('serviceWorker.install.cache.addAll');
                return cache.addAll(urlsToCache);
            })
    );

    event.waitUntil(self.skipWaiting());
});

//  2nd - 
self.addEventListener('activate', function(event){
    console.log('serviceWorker.activate');
    event.waitUntil(self.clients.claim());
});

//  offline
self.addEventListener('fetch', function(event){
    console.log('serviceWorker.fetch')
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

/*
//  delete
caches.open(cacheName).then((cache) => {
  cache.delete('hoge.png');
});
*/
