// Advanced Service Worker for Elghella Marketplace
// Version: 2.0.0

// Bump the cache version to force clients to install the new service worker
const CACHE_VERSION = 'v2';
const STATIC_CACHE = 'elghella-static-v2';
const DYNAMIC_CACHE = 'elghella-dynamic-v2';
const IMAGE_CACHE = 'elghella-images-v2';
const API_CACHE = 'elghella-api-v2';

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC_FIRST: 'static-first',
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Critical resources that should be cached immediately
const CRITICAL_RESOURCES = [
  '/',
  '/marketplace',
  '/equipment',
  '/land',
  '/assets/n7l1.webp',
  '/assets/n7l2.webp',
  '/assets/sheep1.webp',
  '/assets/tomato 2.jpg',
  '/assets/machin01.jpg',
  '/assets/seedings01.jpg',
  '/assets/exporting1.jpg',
  '/assets/land01.jpg',
  'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Cairo:wght@300;400;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// API endpoints that should be cached
const API_ENDPOINTS = [
  '/api/equipment',
  '/api/land',
  '/api/categories',
  '/api/profile'
];

// Image patterns that should be cached
const IMAGE_PATTERNS = [
  /\.(jpg|jpeg|png|webp|avif|svg)$/i,
  /\/assets\//,
  /\/images\//
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🔄 Advanced SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching critical resources...');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Preload other important resources
      caches.open(DYNAMIC_CACHE).then((cache) => {
        const preloadResources = [
          '/auth/login',
          '/auth/signup',
          '/dashboard',
          '/profile'
        ];
        return Promise.all(
          preloadResources.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response);
              }
            }).catch(() => {
              // Ignore failed preloads
            })
          )
        );
      })
    ]).then(() => {
      console.log('✅ Advanced SW: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Advanced SW: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Remove old caches
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE && 
              cacheName !== API_CACHE) {
            console.log('🗑️ Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Advanced SW: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle all requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Determine cache strategy based on request type
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Determine cache strategy for a request
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Always bypass Next.js build assets to prevent MIME/type mismatches
  if (url.pathname.startsWith('/_next/')) {
    return CACHE_STRATEGIES.NETWORK_ONLY;
  }

  // Skip caching for authentication-related requests
  if (url.pathname.includes('/auth/') || 
      url.href.includes('supabase') || 
      url.href.includes('elghella-auth')) {
    return CACHE_STRATEGIES.NETWORK_ONLY;
  }
  
  // Static assets (CSS, JS, fonts)
  if (url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/)) {
    return CACHE_STRATEGIES.STATIC_FIRST;
  }
  
  // Images
  if (IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // API requests
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // HTML pages
  // Always fetch HTML from the network to prevent serving stale pages.
  if (request.headers.get('accept')?.includes('text/html')) {
    return CACHE_STRATEGIES.NETWORK_ONLY;
  }
  
  // Default to network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// Handle request based on strategy
async function handleRequest(request, strategy) {
  const url = new URL(request.url);
  
  try {
    switch (strategy) {
      case CACHE_STRATEGIES.STATIC_FIRST:
        return await staticFirst(request);
        
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request);
        
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request);
        
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request);
        
      case CACHE_STRATEGIES.NETWORK_ONLY:
        return await networkOnly(request);
        
      case CACHE_STRATEGIES.CACHE_ONLY:
        return await cacheOnly(request);
        
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error('❌ SW Error:', error);
    
    // Return offline page for navigation requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return caches.match('/offline');
    }
    
    // Return fallback for other requests
    return new Response('Offline', { status: 503 });
  }
}

// Static First Strategy - Cache first, network fallback
async function staticFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Network First Strategy - Network first, cache fallback
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Cache First Strategy - Cache first, network fallback
async function cacheFirst(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

// Stale While Revalidate Strategy - Return cached, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately if available
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors for background updates
  });
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response if no cache
  return fetchPromise;
}

// Network Only Strategy - Always fetch from network
async function networkOnly(request) {
  return fetch(request);
}

// Cache Only Strategy - Only return from cache
async function cacheOnly(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  throw new Error('Not in cache');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle background sync
async function doBackgroundSync() {
  try {
    // Sync any pending offline actions
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      await syncAction(action);
    }
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Get pending actions from IndexedDB
async function getPendingActions() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

// Sync a single action
async function syncAction(action) {
  // Implementation would depend on your action structure
  console.log('Syncing action:', action);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data?.text() || 'تحديث جديد متاح',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'استكشف الآن',
        icon: '/globe.svg'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/globe.svg'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('الغلة', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('📱 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/marketplace')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('💬 SW Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      cacheUrls(event.data.urls)
    );
  }
  
  if (event.data && event.data.type === 'DELETE_CACHE') {
    event.waitUntil(
      deleteCache(event.data.cacheName)
    );
  }
});

// Cache multiple URLs
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const url of urls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response);
      }
    } catch (error) {
      console.error('Failed to cache URL:', url, error);
    }
  }
}

// Delete specific cache
async function deleteCache(cacheName) {
  const cacheNames = await caches.keys();
  const cacheToDelete = cacheNames.find(name => name.includes(cacheName));
  
  if (cacheToDelete) {
    await caches.delete(cacheToDelete);
    console.log('🗑️ Cache deleted:', cacheToDelete);
  }
}

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

// Clean up old caches
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const now = Date.now();
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  for (const cacheName of cacheNames) {
    try {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const date = response.headers.get('date');
          if (date && (now - new Date(date).getTime()) > maxAge) {
            await cache.delete(request);
          }
        }
      }
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }
}

console.log('🚀 Advanced Service Worker loaded successfully!');