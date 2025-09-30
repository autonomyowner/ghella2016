'use client';

import React, { useEffect, useRef, useCallback } from 'react';

const PerformanceOptimizer: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    const criticalImages = [
      '/assets/n7l1.webp',
      '/assets/n7l2.webp',
      '/assets/sheep1.webp',
      '/assets/tomato 2.jpg',
      '/assets/machin01.jpg',
      '/assets/seedings01.jpg',
      '/assets/exporting1.jpg',
      '/assets/land01.jpg'
    ];

    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Cairo:wght@300;400;600;700;900&display=swap'
    ];

    // Preload critical images
    criticalImages.forEach((src) => {
      if (!document.querySelector(`link[href="${src}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      }
    });

    // Preload critical fonts
    criticalFonts.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      }
    });
  }, []);

  // Setup intersection observer for lazy loading
  const setupIntersectionObserver = useCallback(() => {
    if (typeof window === 'undefined') return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            
            // Lazy load images
            if (target.tagName === 'IMG' && target.dataset.src) {
              (target as HTMLImageElement).src = target.dataset.src;
              target.removeAttribute('data-src');
              observerRef.current?.unobserve(target);
            }
            
            // Lazy load background images
            if (target.dataset.bgSrc) {
              target.style.backgroundImage = `url(${target.dataset.bgSrc})`;
              target.removeAttribute('data-bg-src');
              observerRef.current?.unobserve(target);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    );
  }, []);

  // Performance monitoring
  const setupPerformanceMonitoring = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      performanceObserverRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Monitor Core Web Vitals
          if (entry.entryType === 'largest-contentful-paint') {
            const lcp = entry.startTime;
            if (lcp > 2500) {
              console.warn('LCP is slow:', lcp);
            }
          }
          
          if (entry.entryType === 'first-input') {
            const fid = (entry as PerformanceEventTiming).processingStart - (entry as PerformanceEventTiming).startTime;
            if (fid > 100) {
              console.warn('FID is slow:', fid);
            }
          }
          
          if (entry.entryType === 'layout-shift') {
            const cls = (entry as any).value;
            if (cls > 0.1) {
              console.warn('CLS is poor:', cls);
            }
          }
        }
      });

      performanceObserverRef.current.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }, []);

  // Optimize images
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      observerRef.current?.observe(img);
    });

    const bgImages = document.querySelectorAll('[data-bg-src]');
    bgImages.forEach((element) => {
      observerRef.current?.observe(element);
    });
  }, []);

  // Debounce function for performance
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  // Optimize scroll performance
  const optimizeScroll = useCallback(() => {
    let ticking = false;
    
    const updateScroll = () => {
      // Handle scroll-based animations here
      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', requestTick);
    };
  }, []);

  // Prefetch critical pages
  const prefetchCriticalPages = useCallback(() => {
    const criticalPages = [
      '/marketplace',
      '/equipment',
      '/land',
      '/auth/login'
    ];

    // Prefetch on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        criticalPages.forEach(page => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = page;
          document.head.appendChild(link);
        });
      });
    }
  }, []);

  // Main effect
  useEffect(() => {
    // Setup all optimizations
    preloadCriticalResources();
    setupIntersectionObserver();
    setupPerformanceMonitoring();
    optimizeScroll();
    prefetchCriticalPages();

    // Optimize images after DOM is ready
    const optimizeImagesAfterLoad = debounce(() => {
      optimizeImages();
    }, 100);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeImagesAfterLoad);
    } else {
      optimizeImagesAfterLoad();
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      document.removeEventListener('DOMContentLoaded', optimizeImagesAfterLoad);
    };
  }, [preloadCriticalResources, setupIntersectionObserver, setupPerformanceMonitoring, optimizeImages, optimizeScroll, prefetchCriticalPages, debounce]);

  return null;
};

export default PerformanceOptimizer; 