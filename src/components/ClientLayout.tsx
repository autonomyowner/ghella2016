'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for better performance
const ConditionalHeader = dynamic(() => import("@/components/ConditionalHeader"), {
  ssr: false,
  loading: () => <div className="h-16 bg-black/20 animate-pulse" />
});

const SupabaseAuthProvider = dynamic(() => import("@/contexts/SupabaseAuthContext").then(mod => ({ default: mod.SupabaseAuthProvider })), {
  ssr: false
});

const ServiceWorkerRegistration = dynamic(() => import("@/components/ServiceWorkerRegistration"), {
  ssr: false
});

const PerformanceOptimizer = dynamic(() => import("@/components/PerformanceOptimizer"), {
  ssr: false
});

const AdvancedPerformanceOptimizer = dynamic(() => import("@/components/AdvancedPerformanceOptimizer"), {
  ssr: false
});





interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <SupabaseAuthProvider>
      <PerformanceOptimizer />
      <AdvancedPerformanceOptimizer />
      <ConditionalHeader />
      <main className="min-h-screen">
        {children}
      </main>
      <ServiceWorkerRegistration />

    </SupabaseAuthProvider>
  );
};

export default ClientLayout; 