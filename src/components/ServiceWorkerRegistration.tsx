'use client';

import { useEffect } from 'react';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    const registerCacheBustingSW = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Only register in development and if not already registered
          if (process.env.NODE_ENV === 'development') {
            // Unregister any existing service workers first
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
              await registration.unregister();
            }
            
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