// Cache Busting Utility for Development Mode

export const CACHE_BUSTER = {
  // Generate a unique timestamp for cache busting
  timestamp: Date.now(),
  
  // Add cache busting parameter to URLs
  addCacheBuster: (url: string): string => {
    if (process.env.NODE_ENV === 'development') {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${CACHE_BUSTER.timestamp}`;
    }
    return url;
  },
  
  // Clear browser cache
  clearBrowserCache: async (): Promise<void> => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Browser cache cleared');
      } catch (error) {
        console.error('Failed to clear browser cache:', error);
      }
    }
  },
  
  // Force page reload with cache clearing
  forceReload: (): void => {
    if (process.env.NODE_ENV === 'development') {
      // Clear cache and reload
      CACHE_BUSTER.clearBrowserCache().then(() => {
        window.location.reload();
      });
    }
  },
  
  // Add cache-busting headers to fetch requests
  fetchWithCacheBust: async (url: string, options: RequestInit = {}): Promise<Response> => {
    const cacheBustedUrl = CACHE_BUSTER.addCacheBuster(url);
    
    const fetchOptions: RequestInit = {
      ...options,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...options.headers,
      },
    };
    
    return fetch(cacheBustedUrl, fetchOptions);
  },
  
  // Check if cache needs to be cleared
  shouldClearCache: (): boolean => {
    const lastBuildTime = localStorage.getItem('lastBuildTime');
    const currentBuildTime = process.env.NEXT_PUBLIC_BUILD_TIME || CACHE_BUSTER.timestamp.toString();
    
    if (lastBuildTime !== currentBuildTime) {
      localStorage.setItem('lastBuildTime', currentBuildTime);
      return true;
    }
    
    return false;
  },
  
  // Initialize cache busting
  init: (): void => {
    if (process.env.NODE_ENV === 'development') {
      // Check if cache needs to be cleared
      if (CACHE_BUSTER.shouldClearCache()) {
        console.log('Build time changed, clearing cache...');
        CACHE_BUSTER.clearBrowserCache();
      }
      
      console.log('Cache busting initialized');
    }
  },
};

// Auto-initialize cache busting
if (typeof window !== 'undefined') {
  CACHE_BUSTER.init();
}

export default CACHE_BUSTER; 