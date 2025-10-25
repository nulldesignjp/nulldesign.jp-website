
var CACHE_NAME  = "nulldesign.jp/skynet-cache-v5";
var DOMAIN = "";
var urlsToCache = [

    DOMAIN + '/skynet/index.html',
    DOMAIN + '/skynet/shared/css/reset.css',
    DOMAIN + '/skynet/shared/css/style.css',

    DOMAIN + '/skynet/shared/js/world.js',
    DOMAIN + '/skynet/shared/js/three.min.js',
    DOMAIN + '/skynet/shared/js/shaders.js',
    DOMAIN + '/skynet/shared/js/OrbitControls.js',
    DOMAIN + '/skynet/shared/js/libs.js',
    DOMAIN + '/skynet/shared/js/jquery-3.3.1.min.map',
    DOMAIN + '/skynet/shared/js/jquery-3.3.1.min.js',
    DOMAIN + '/skynet/shared/js/engine.js',
    DOMAIN + '/skynet/shared/js/EffectComposers.js',
    DOMAIN + '/skynet/shared/js/coastLine.normal.js',
    DOMAIN + '/skynet/shared/js/coastLine.light.js',

    DOMAIN + '/skynet/shared/data/letters.xml',
    DOMAIN + '/skynet/shared/data/airport.xml',

    DOMAIN + '/skynet/shared/data/ANA_Sunday.json',
    DOMAIN + '/skynet/shared/data/JAL_Sunday.json',

    DOMAIN + '/skynet/shared/img/spark1.png',
    DOMAIN + '/skynet/shared/img/loading.png',
    DOMAIN + '/skynet/shared/img/icons/ico05.svg',
    DOMAIN + '/skynet/shared/img/icons/ico00.svg',
    DOMAIN + '/skynet/shared/img/icons/ico01.svg',
    DOMAIN + '/skynet/shared/img/icons/ico02.svg',
    DOMAIN + '/skynet/shared/img/icons/ico03.svg',
    DOMAIN + '/skynet/shared/img/icons/ico04.svg',
    DOMAIN + '/skynet/shared/img/icons/ico06.svg',
    DOMAIN + '/skynet/shared/img/icons/ico07.svg',
    DOMAIN + '/skynet/shared/img/icons/ico08.svg',
    DOMAIN + '/skynet/shared/img/icons/ico09.svg',
    DOMAIN + '/skynet/shared/img/icons/ico10.svg',
    DOMAIN + '/skynet/shared/img/icons/ico11.svg',
    DOMAIN + '/skynet/shared/img/icons/ico12.svg',
    DOMAIN + '/skynet/shared/img/icons/ico13.svg',
    DOMAIN + '/skynet/shared/img/icons/ico14.svg',
    DOMAIN + '/skynet/shared/img/icons/ico15.svg',
    DOMAIN + '/skynet/shared/img/icons/ico16.svg',
    DOMAIN + '/skynet/shared/img/icons/ico17.svg',
    DOMAIN + '/skynet/shared/img/icons/ico18.svg',
    DOMAIN + '/skynet/shared/img/icons/ico19.svg',
    DOMAIN + '/skynet/shared/img/icons/ico20.svg',
    DOMAIN + '/skynet/shared/img/icons/ico21.svg',
    DOMAIN + '/skynet/shared/img/icons/ico22.svg',
    DOMAIN + '/skynet/shared/img/icons/ico23.svg',
    DOMAIN + '/skynet/shared/img/icons/ico24.svg',
    DOMAIN + '/skynet/shared/img/icons/ico25.svg',
    DOMAIN + '/skynet/shared/img/icons/ico26.svg',
    DOMAIN + '/skynet/shared/img/icons/ico27.svg',
    DOMAIN + '/skynet/shared/img/icons/ico28.svg',
    DOMAIN + '/skynet/shared/img/icons/ico29.svg',
    DOMAIN + '/skynet/shared/img/icons/ico30.svg',
    DOMAIN + '/skynet/shared/img/icons/ico31.svg',
    DOMAIN + '/skynet/shared/img/icons/ico32.svg',
    DOMAIN + '/skynet/shared/img/icons/ico33.svg',
    DOMAIN + '/skynet/shared/img/icons/ico34.svg',
    DOMAIN + '/skynet/shared/img/icons/ico35.svg',
    DOMAIN + '/skynet/shared/img/icons/ico36.svg',
    DOMAIN + '/skynet/shared/img/icons/ico37.svg',
    DOMAIN + '/skynet/shared/img/icons/ico38.svg',
    DOMAIN + '/skynet/shared/img/icons/ico39.svg',
    DOMAIN + '/skynet/shared/img/icons/ico40.svg',
    DOMAIN + '/skynet/shared/img/icons/ico41.svg',
    DOMAIN + '/skynet/shared/img/icons/ico42.svg',
    DOMAIN + '/skynet/shared/img/icons/ico43.svg',
    DOMAIN + '/skynet/shared/img/icons/ico44.svg',
    DOMAIN + '/skynet/shared/img/icons/ico45.svg',
    DOMAIN + '/skynet/shared/img/icons/ico46.svg',
    DOMAIN + '/skynet/shared/img/icons/ico47.svg',
    DOMAIN + '/skynet/shared/img/icons/ico48.svg',
    DOMAIN + '/skynet/shared/img/icons/ico49.svg',
    DOMAIN + '/skynet/shared/img/icons/ico50.svg',
    DOMAIN + '/skynet/shared/img/icons/ico51.svg',
    DOMAIN + '/skynet/shared/img/icons/ico52.svg',
    DOMAIN + '/skynet/shared/img/icons/ico53.svg',
    DOMAIN + '/skynet/shared/img/icons/ico54.svg',
    DOMAIN + '/skynet/shared/img/icons/ico55.svg',
    DOMAIN + '/skynet/shared/img/icons/ico56.svg',
    DOMAIN + '/skynet/shared/img/icons/ico57.svg',
    DOMAIN + '/skynet/shared/img/icons/ico58.svg',
    DOMAIN + '/skynet/shared/img/icons/ico59.svg',
    DOMAIN + '/skynet/shared/img/icons/ico60.svg',
    DOMAIN + '/skynet/shared/img/icons/ico61.svg',
    DOMAIN + '/skynet/shared/img/icons/ico62.svg',
    DOMAIN + '/skynet/shared/img/icons/ico63.svg',
    DOMAIN + '/skynet/shared/img/icons/ico64.svg',
    DOMAIN + '/skynet/shared/img/icons/ico65.svg',
    DOMAIN + '/skynet/shared/img/icons/ico66.svg',
    DOMAIN + '/skynet/shared/img/icons/ico67.svg',
    DOMAIN + '/skynet/shared/img/icons/ico68.svg',
    DOMAIN + '/skynet/shared/img/icons/ico69.svg',
    DOMAIN + '/skynet/shared/img/icons/ico70.svg',
    DOMAIN + '/skynet/shared/img/icons/ico71.svg',
    DOMAIN + '/skynet/shared/img/icons/ico72.svg',
    DOMAIN + '/skynet/shared/img/icons/ico73.svg',
    DOMAIN + '/skynet/shared/img/icons/ico74.svg',
    DOMAIN + '/skynet/shared/img/icons/ico75.svg',
    DOMAIN + '/skynet/shared/img/icons/ico76.svg',
    DOMAIN + '/skynet/shared/img/icons/ico77.svg',
    DOMAIN + '/skynet/shared/img/icons/ico78.svg',
    DOMAIN + '/skynet/shared/img/icons/ico79.svg',
    DOMAIN + '/skynet/shared/img/icons/ico80.svg',
    DOMAIN + '/skynet/shared/img/icons/ico81.svg',
    DOMAIN + '/skynet/shared/img/icons/ico82.svg',
    DOMAIN + '/skynet/shared/img/icons/ico83.svg',
    DOMAIN + '/skynet/shared/img/icons/ico84.svg',
    DOMAIN + '/skynet/shared/img/icons/ico85.svg',
    DOMAIN + '/skynet/shared/img/icons/runway01.svg',
    DOMAIN + '/skynet/shared/img/icons/runway02.svg',
  "https://fonts.googleapis.com/css?family=Heebo:100,400&display=swap&subset=hebrew"
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(
            function(cache){
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(
        function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
