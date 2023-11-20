const staticCacheName = 's-app-v1'
const assetUrls = [
    'index.html',
    'script.js',
    '/css/main.css',
    'obrat.html',
    'zapis.html',
    'card-1.html',
    'card-2.html',
    'card-3.html',
    '/css/card.css',
    '/css/obrat.css',
    '/css/zapis.css'
]

self.addEventListener('istall', Event =>{
    Event.waitUntil(
        caches.open(staticCacheName).then(cache => cache.addAll(assetUrls))
    )
})
self.addEventListener('activate', Event =>{
    console.log('[SW]: activate')
})

