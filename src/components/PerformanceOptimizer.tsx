'use client';

import { useEffect, useState } from 'react';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Monitor CLS (Cumulative Layout Shift)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift') {
          const layoutShiftEntry = entry as PerformanceEntry & { value: number };
          if (layoutShiftEntry.value > 0.1) {
            console.warn('CLS is poor:', layoutShiftEntry.value);
            // Implement CLS optimization strategies
            optimizeLayoutShift();
          }
        }
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });

    // Optimize images and fonts
    optimizeImages();
    optimizeFonts();
    
    setIsOptimized(true);

    return () => observer.disconnect();
  }, []);

  const optimizeLayoutShift = () => {
    // Add explicit dimensions to images
    const images = document.querySelectorAll('img:not([width]):not([height])');
    images.forEach((img) => {
      if (!img.getAttribute('width') && !img.getAttribute('height')) {
        img.setAttribute('width', '100%');
        img.setAttribute('height', 'auto');
      }
    });

    // Reserve space for dynamic content
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach((el) => {
      if (!el.getAttribute('style')) {
        el.setAttribute('style', 'min-height: 200px;');
      }
    });
  };

  const optimizeImages = () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  };

  const optimizeFonts = () => {
    // Preload critical fonts
    const fontLinks = document.querySelectorAll('link[rel="preload"][as="font"]');
    fontLinks.forEach((link) => {
      link.setAttribute('crossorigin', 'anonymous');
    });
  };

  return (
    <div className={`performance-optimized ${isOptimized ? 'optimized' : 'loading'}`}>
      {children}
    </div>
  );
}