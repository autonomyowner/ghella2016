'use client';

import { useEffect } from 'react';
import { registerServiceWorker, unregisterServiceWorker } from '@/lib/serviceWorker';

const ServiceWorkerRegistration = () => {
  useEffect(() => {
    // In development, unregister any existing service workers
    if (process.env.NODE_ENV === 'development') {
      unregisterServiceWorker();
    } else {
      // Register service worker only in production
      registerServiceWorker();
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default ServiceWorkerRegistration; 