// Ultra Advanced Service Worker for Elghella
// Version: 2.0.0

const CACHE_NAME = 'elghella-ultra-v2';
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
  '/assets/n7l1.webp',
  '/assets/n7l2.webp',
  '/assets/sheep1.webp',
  '/assets/Videoplayback1.mp4',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// API endpoints that should be cached
const API_ENDPOINTS = [
  '/api/',
  '/api/update-homepage-text'
];

// Image patterns that should be cached
const IMAGE_PATTERNS = [
  /\.(jpg|jpeg|png|webp|avif)$/i,
  /\/assets\//i
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  console.log('🚀 Ultra SW installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache critical static resources
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching critical static resources');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Preload important pages
      caches.open(DYNAMIC_CACHE).then((cache) => {
        const importantPages = [
          '/marketplace',
          '/equipment',
          '/land',
          '/auth/login',
          '/auth/signup'
        ];
        return Promise.all(
          importantPages.map(url => 
            fetch(url).then(response => {
              if (response.ok) {
                return cache.put(url, response.clone());
              }
            }).catch(() => {
              // Ignore fetch errors for preloading
            })
          )
        );
      })
    ]).then(() => {
      console.log('✅ Ultra SW installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Ultra SW activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE].includes(cacheName)) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Ultra SW activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategy
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

  // Determine caching strategy based on request type
  const strategy = getCachingStrategy(request);
  
  event.respondWith(
    handleRequest(request, strategy)
  );
});

// Determine the best caching strategy for a request
function getCachingStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets (CSS, JS, fonts)
  if (url.pathname.match(/\.(css|js|woff|woff2|ttf|eot)$/i)) {
    return CACHE_STRATEGIES.STATIC_FIRST;
  }
  
  // Images
  if (url.pathname.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i) || IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // API requests
  if (API_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint))) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // Default to network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// Handle requests with the appropriate strategy
async function handleRequest(request, strategy) {
  const url = new URL(request.url);
  
  try {
    switch (strategy) {
      case CACHE_STRATEGIES.STATIC_FIRST:
        return await staticFirst(request);
      
      case CACHE_STRATEGIES.CACHE_FIRST:
        return await cacheFirst(request);
      
      case CACHE_STRATEGIES.NETWORK_FIRST:
        return await networkFirst(request);
      
      case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
        return await staleWhileRevalidate(request);
      
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error('❌ SW fetch error:', error);
    
    // Fallback to cache or offline page
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for HTML requests
    if (request.headers.get('accept')?.includes('text/html')) {
      return getOfflinePage();
    }
    
    throw error;
  }
}

// Static First Strategy - for CSS, JS, fonts
async function staticFirst(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response);
      }
    }).catch(() => {
      // Ignore background update errors
    });
    
    return cachedResponse;
  }
  
  // If not in cache, fetch and cache
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Cache First Strategy - for images
async function cacheFirst(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, fetch and cache
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  
  return response;
}

// Network First Strategy - for API and HTML
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Fallback to cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate Strategy - for frequently changing content
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Return cached response immediately if available
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => {
    // Ignore fetch errors for background updates
  });
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Wait for network response if no cache
  return fetchPromise;
}

// Get offline page
async function getOfflinePage() {
  const cache = await caches.open(STATIC_CACHE);
  const offlineResponse = await cache.match('/offline');
  
  if (offlineResponse) {
    return offlineResponse;
  }
  
  // Create simple offline page
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>الغلة - غير متصل</title>
      <style>
        body { 
          font-family: 'Cairo', sans-serif; 
          background: linear-gradient(135deg, #1e3a8a 0%, #065f46 100%);
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          margin: 0; 
          padding: 20px;
          text-align: center;
        }
        .offline-container { 
          max-width: 400px; 
          background: rgba(255,255,255,0.1); 
          padding: 40px; 
          border-radius: 20px; 
          backdrop-filter: blur(10px);
        }
        .icon { 
          font-size: 4rem; 
          margin-bottom: 20px; 
        }
        h1 { 
          margin-bottom: 20px; 
          font-size: 1.5rem;
        }
        p { 
          margin-bottom: 30px; 
          opacity: 0.8;
        }
        button { 
          background: #10b981; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 8px; 
          cursor: pointer; 
          font-size: 1rem;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="icon">📡</div>
        <h1>غير متصل بالإنترنت</h1>
        <p>يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى</p>
        <button onclick="window.location.reload()">إعادة المحاولة</button>
      </div>
    </body>
    </html>
  `;
  
  const response = new Response(offlineHTML, {
    headers: { 'Content-Type': 'text/html' }
  });
  
  cache.put('/offline', response.clone());
  return response;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

// Perform background sync
async function performBackgroundSync() {
  try {
    // Sync any pending data
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        data: { timestamp: Date.now() }
      });
    });
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data?.text() || 'تحديث جديد متاح',
    icon: '/placeholder.png',
    badge: '/placeholder.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'استكشاف',
        icon: '/placeholder.png'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/placeholder.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('الغلة', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Notification clicked:', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic cache cleanup
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCaches());
  }
});

// Clean up old caches and entries
async function cleanupCaches() {
  console.log('🧹 Starting cache cleanup...');
  
  try {
    // Clean up old cache entries
    const cacheNames = [DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      
      // Remove entries older than 7 days
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      
      for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
          const dateHeader = response.headers.get('date');
          if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (responseDate < oneWeekAgo) {
              await cache.delete(request);
            }
          }
        }
      }
    }
    
    console.log('✅ Cache cleanup completed');
  } catch (error) {
    console.error('❌ Cache cleanup failed:', error);
  }
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_INFO':
      getCacheInfo().then(info => {
        event.ports[0].postMessage(info);
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    default:
      console.log('📨 Unknown message type:', type);
  }
});

// Get cache information
async function getCacheInfo() {
  const cacheNames = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
  const info = {};
  
  for (const cacheName of cacheNames) {
    try {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      info[cacheName] = keys.length;
    } catch (error) {
      info[cacheName] = 0;
    }
  }
  
  return info;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

console.log('🚀 Ultra Service Worker loaded successfully'); 