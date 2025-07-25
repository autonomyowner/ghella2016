'use client';

import { useEffect, useState } from 'react';

interface HydrationSuppressorProps {
  children: React.ReactNode;
}

export default function HydrationSuppressor({ children }: HydrationSuppressorProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Suppress hydration warnings in development
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.__NEXT_DATA__ = window.__NEXT_DATA__ || {};
    // @ts-ignore
    window.__NEXT_DATA__.suppressHydrationWarning = true;
  }

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
} 