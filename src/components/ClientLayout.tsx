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

import ErrorBoundary from '@/components/ErrorBoundary';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {

  return (
    <SupabaseAuthProvider>
      <SearchProvider>
        <PerformanceOptimizer />
        <ConditionalHeader />
        <main className="min-h-screen">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <ServiceWorkerRegistration />
      </SearchProvider>
    </SupabaseAuthProvider>
  );
};

export default ClientLayout;