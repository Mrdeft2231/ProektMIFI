const cachekey = "cache-v1";

const initCache =  () =>{
    return caches.open(cachekey).then((cache) =>{
        return cache.addAll([
            './index.html',
            './script.js',
            '/./css/main.css',
            './obrat.html',
            './zapis.html',
            './card-1.html',
            './card-2.html',
            './card-3.html',
            './css/card.css',
            './css/obrat.css',
            './css/zapis.css'
        ]);
    }, (error) =>{
        console.log(error)
    });
};
    
const tryNetwork = (req, timeout) => {
    console.log(req)
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(req).then((res) => {
            clearTimeout(timeoutId);
            const responseClone = res.clone();
            caches.open(cachekey).then((cache) => {
                cache.put(req, responseClone)
            })
            resolve(res);
        }, reject);
    });
};

const getFromCache = (req) => {
    console.log('network is off so getting from cache...')
    return caches.open(cachekey).then((cache) =>{
        return cache.match(req).then((result) => {
            return result || Promise.reject("no-match");
        });
    });
};

self.addEventListener("install", (e) =>{
    console.log("Installed");
    e.waitUntil(initCache());
})

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cachekey) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener("fetch", (e) => {
    console.log("Try network and store result or get data from cache");
    e.respondWith(tryNetwork(e.request, 400).catch(() => getFromCache(e.request)));
});
