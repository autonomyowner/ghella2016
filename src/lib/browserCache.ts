// Simple Browser Cache Clearing Utility

export const BrowserCache = {
  // Clear all browser caches
  clearAll: async (): Promise<void> => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Browser cache cleared successfully');
      } catch (error) {
        console.error('❌ Failed to clear browser cache:', error);
      }
    }
  },

  // Clear specific cache by name
  clearByName: async (cacheName: string): Promise<void> => {
    if ('caches' in window) {
      try {
        await caches.delete(cacheName);
        console.log(`✅ Cache "${cacheName}" cleared successfully`);
      } catch (error) {
        console.error(`❌ Failed to clear cache "${cacheName}":`, error);
      }
    }
  },

  // List all caches
  listAll: async (): Promise<string[]> => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log('📋 Available caches:', cacheNames);
        return cacheNames;
      } catch (error) {
        console.error('❌ Failed to list caches:', error);
        return [];
      }
    }
    return [];
  },

  // Force page reload with cache clearing
  forceReload: async (): Promise<void> => {
    await BrowserCache.clearAll();
    window.location.reload();
  },

  // Add cache-busting parameter to URL
  addCacheBuster: (url: string): string => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  },

  // Check if cache is available
  isAvailable: (): boolean => {
    return 'caches' in window;
  },
};

// Auto-clear cache on development mode (only once)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Clear cache on page load in development (only once)
  if (!(window as any).__cacheCleared) {
    (window as any).__cacheCleared = true;
    window.addEventListener('load', () => {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        BrowserCache.clearAll();
      }, 1000);
    });
  }
}

export default BrowserCache; 