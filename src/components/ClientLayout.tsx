'use client';

import React, { Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import BrowserCache from '@/lib/browserCache';

// Dynamic imports for better performance
const ConditionalHeader = dynamic(() => import("@/components/ConditionalHeader"), {
  ssr: false,
  loading: () => <div className="h-16 bg-black/20 animate-pulse" />
});

import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { SearchProvider } from "@/contexts/SearchContext";

const ServiceWorkerRegistration = dynamic(() => import("@/components/ServiceWorkerRegistration"), {
  ssr: false
});

// Keep only one performance optimizer to prevent conflicts
const PerformanceOptimizer = dynamic(() => import("@/components/PerformanceOptimizer"), {
  ssr: false
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  useEffect(() => {
    // Initialize cache clearing in development (only once)
    if (process.env.NODE_ENV === 'development') {
      // Clear cache on component mount (only once)
      const hasCleared = sessionStorage.getItem('cacheCleared');
      if (!hasCleared) {
        // Use the updated BrowserCache.clearAll() which preserves auth data
        BrowserCache.clearAll();
        sessionStorage.setItem('cacheCleared', 'true');
      }
    }

    // Handle loading states more intelligently
    const handleLoadingStates = () => {
      // Check if auth is still loading after a reasonable time
      const loadingElements = document.querySelectorAll('[class*="animate-spin"]');
      if (loadingElements.length > 0) {
        console.log('🚨 ClientLayout: Detected potential stuck loading spinners');
        
        // Only hide spinners that have been visible for too long
        loadingElements.forEach(el => {
          if (el.classList.contains('animate-spin')) {
            // Check if this is an auth-related spinner
            const isAuthSpinner = 
              el.closest('[data-auth-component]') || 
              el.closest('[class*="auth"]') ||
              el.closest('[id*="auth"]');
              
            if (isAuthSpinner) {
              console.log('🔄 Auth spinner detected - allowing more time');
            } else {
              (el as HTMLElement).style.display = 'none';
            }
          }
        });
      }
    };

    // First check after 3 seconds
    const loadingTimeout = setTimeout(handleLoadingStates, 3000);
    
    // Second check after 8 seconds for auth spinners
    const authLoadingTimeout = setTimeout(() => {
      console.log('🚨 ClientLayout: Force hiding all remaining loading spinners');
      document.querySelectorAll('[class*="animate-spin"]').forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    }, 8000);

    return () => {
      clearTimeout(loadingTimeout);
      clearTimeout(authLoadingTimeout);
    };
  }, []);

  return (
    <SupabaseAuthProvider>
      <SearchProvider>
        <PerformanceOptimizer />
        <ConditionalHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <ServiceWorkerRegistration />
      </SearchProvider>
    </SupabaseAuthProvider>
  );
};

export default ClientLayout;