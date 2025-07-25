'use client';

import { useEffect, useState } from 'react';

interface HydrationSuppressorProps {
  children: React.ReactNode;
}

export default function HydrationSuppressor({ children }: HydrationSuppressorProps) {
  const [_isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Suppress hydration warnings in development
  if (typeof window !== 'undefined') {
    (window as any).__NEXT_DATA__ = (window as any).__NEXT_DATA__ || {};
    (window as any).__NEXT_DATA__.suppressHydrationWarning = true;
  }

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
} 