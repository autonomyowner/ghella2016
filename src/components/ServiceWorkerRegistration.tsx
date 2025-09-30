'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    const registerCacheBustingSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Always cleanup stray service workers that are not /sw.js
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            const scriptURL = (registration as any)?.active?.scriptURL as string | undefined;
            if (scriptURL && !scriptURL.endsWith('/sw.js')) {
              await registration.unregister();
            }
          }

          if (process.env.NODE_ENV === 'development') {
            console.log('Service workers unregistered for development mode');
          }
        } catch (error) {
          console.error('Service Worker cleanup failed:', error);
        }
      }
    };

    registerCacheBustingSW();
  }, []);

  // This component doesn't render anything
  return null;
};

export default ServiceWorkerRegistration; 