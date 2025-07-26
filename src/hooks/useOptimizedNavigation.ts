'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useOptimizedNavigation = () => {
  const router = useRouter();

  const navigateTo = useCallback((href: string) => {
    try {
      // Add a small delay to ensure smooth navigation
      setTimeout(() => {
        router.push(href);
      }, 50);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      window.location.href = href;
    }
  }, [router]);

  const navigateToCard = useCallback((href: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Add visual feedback
    const target = event?.currentTarget as HTMLElement;
    if (target) {
      target.style.transform = 'scale(0.98)';
      setTimeout(() => {
        target.style.transform = '';
      }, 150);
    }
    
    navigateTo(href);
  }, [navigateTo]);

  return {
    navigateTo,
    navigateToCard,
  };
}; 