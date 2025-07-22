'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export const useSafeNavigation = () => {
  const router = useRouter();

  const safePush = useCallback((href: string) => {
    try {
      // Check if the route exists before navigating
      if (href.startsWith('/')) {
        router.push(href);
      } else {
        // For external links, use window.location
        window.location.href = href;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location for critical navigation
      window.location.href = href;
    }
  }, [router]);

  const safeReplace = useCallback((href: string) => {
    try {
      router.replace(href);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      window.location.href = href;
    }
  }, [router]);

  const safeBack = useCallback(() => {
    try {
      router.back();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.history
      window.history.back();
    }
  }, [router]);

  const safeForward = useCallback(() => {
    try {
      router.forward();
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.history
      window.history.forward();
    }
  }, [router]);

  return {
    push: safePush,
    replace: safeReplace,
    back: safeBack,
    forward: safeForward,
  };
}; 