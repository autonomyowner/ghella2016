'use client';

import { useEffect, useState } from 'react';

interface HydrationSuppressorProps {
  children: React.ReactNode;
}

export default function HydrationSuppressor({ children }: HydrationSuppressorProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Clean up any browser extension attributes that might cause hydration mismatches
    const cleanupBrowserExtensions = () => {
      const elements = document.querySelectorAll('[bis_skin_checked], [bis_use], [data-bis-config]');
      elements.forEach(element => {
        element.removeAttribute('bis_skin_checked');
        element.removeAttribute('bis_use');
        element.removeAttribute('data-bis-config');
      });
    };

    // Run cleanup after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      cleanupBrowserExtensions();
      setIsHydrated(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Suppress hydration warnings globally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Suppress console warnings for hydration mismatches
      const originalError = console.error;
      console.error = (...args) => {
        const message = args[0];
        if (typeof message === 'string' && 
            (message.includes('hydration') || 
             message.includes('bis_skin_checked') || 
             message.includes('bis_use'))) {
          return; // Suppress these specific errors
        }
        originalError.apply(console, args);
      };

      return () => {
        console.error = originalError;
      };
    }
  }, []);

  // Show loading state until hydration is complete
  if (!isHydrated) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري تحميل التطبيق...</p>
        </div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
} 