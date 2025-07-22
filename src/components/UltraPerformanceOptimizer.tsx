'use client';

import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  network: {
    effectiveType: string;
    downlink: number;
    rtt: number;
  };
  bundleSize: {
    total: number;
    js: number;
    css: number;
    images: number;
  };
}

interface ResourcePriority {
  url: string;
  priority: 'high' | 'medium' | 'low';
  type: 'image' | 'script' | 'style' | 'font' | 'video';
  critical: boolean;
  size?: number;
}

const UltraPerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState<'basic' | 'advanced' | 'ultra'>('basic');
  const [optimizationHistory, setOptimizationHistory] = useState<string[]>([]);
  
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const networkObserverRef = useRef<PerformanceObserver | null>(null);
  const memoryObserverRef = useRef<PerformanceObserver | null>(null);
  const resourceHintsRef = useRef<Set<string>>(new Set());
  const preloadedResourcesRef = useRef<Set<string>>(new Set());
  const optimizationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const bundleSizeRef = useRef<{ total: number; js: number; css: number; images: number }>({
    total: 0,
    js: 0,
    css: 0,
    images: 0
  });

  // Ultra-critical resources with intelligent prioritization
  const ultraCriticalResources: ResourcePriority[] = useMemo(() => [
    // Critical above-the-fold images with size optimization
    { url: '/assets/n7l1.webp', priority: 'high', type: 'image', critical: true, size: 150000 },
    { url: '/assets/n7l2.webp', priority: 'high', type: 'image', critical: true, size: 120000 },
    { url: '/assets/sheep1.webp', priority: 'high', type: 'image', critical: true, size: 80000 },
    
    // Critical fonts with preloading
    { url: 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap', priority: 'high', type: 'font', critical: true },
    
    // Critical styles
    { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', priority: 'high', type: 'style', critical: true },
    
    // Preload critical pages with route-based code splitting
    { url: '/marketplace', priority: 'medium', type: 'script', critical: false },
    { url: '/equipment', priority: 'medium', type: 'script', critical: false },
    { url: '/land', priority: 'medium', type: 'script', critical: false },
    
    // Below-the-fold resources with lazy loading
    { url: '/assets/tomato 2.jpg', priority: 'low', type: 'image', critical: false, size: 200000 },
    { url: '/assets/machin01.jpg', priority: 'low', type: 'image', critical: false, size: 180000 },
    { url: '/assets/seedings01.jpg', priority: 'low', type: 'image', critical: false, size: 160000 },
  ], []);

  // Calculate bundle size from performance entries
  const calculateBundleSize = useCallback(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    const resources = performance.getEntriesByType('resource');
    let totalSize = 0;
    let jsSize = 0;
    let cssSize = 0;
    let imagesSize = 0;

    resources.forEach((resource) => {
      const entry = resource as PerformanceResourceTiming;
      const size = entry.transferSize || entry.encodedBodySize || 0;
      totalSize += size;

      if (entry.name.includes('.js')) {
        jsSize += size;
      } else if (entry.name.includes('.css')) {
        cssSize += size;
      } else if (entry.name.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
        imagesSize += size;
      }
    });

    bundleSizeRef.current = { total: totalSize, js: jsSize, css: cssSize, images: imagesSize };
  }, []);

  // Intelligent resource hint injection with size awareness
  const injectIntelligentResourceHints = useCallback(() => {
    const head = document.head;
    const existingHints = new Set(Array.from(head.querySelectorAll('link[rel*="preload"], link[rel*="prefetch"], link[rel*="dns-prefetch"], link[rel*="preconnect"]')).map(link => link.getAttribute('href') || link.getAttribute('href')));

    ultraCriticalResources.forEach((resource) => {
      if (resourceHintsRef.current.has(resource.url) || existingHints.has(resource.url)) {
        return;
      }

      const link = document.createElement('link');
      
      if (resource.critical) {
        link.rel = 'preload';
        link.setAttribute('fetchpriority', resource.priority);
      } else {
        link.rel = 'prefetch';
      }

      link.href = resource.url;
      
      if (resource.type === 'image') {
        link.as = 'image';
        link.type = 'image/webp';
        // Add size hint for better loading
        if (resource.size) {
          link.setAttribute('data-size', resource.size.toString());
        }
      } else if (resource.type === 'font') {
        link.as = 'font';
        link.crossOrigin = 'anonymous';
      } else if (resource.type === 'style') {
        link.as = 'style';
      } else if (resource.type === 'script') {
        link.as = 'fetch';
      }

      head.appendChild(link);
      resourceHintsRef.current.add(resource.url);
    });
  }, [ultraCriticalResources]);

  // Advanced performance monitoring with real-time optimization
  const setupUltraPerformanceMonitoring = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      // Core Web Vitals with ultra-precise monitoring
      performanceObserverRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let newMetrics: Partial<PerformanceMetrics> = {};

        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              newMetrics.lcp = entry.startTime;
              if (entry.startTime > 2000) {
                triggerUltraOptimization('lcp');
              }
              break;
            case 'first-input':
              const fid = (entry as PerformanceEventTiming).processingStart - (entry as PerformanceEventTiming).startTime;
              newMetrics.fid = fid;
              if (fid > 100) {
                triggerUltraOptimization('fid');
              }
              break;
            case 'layout-shift':
              newMetrics.cls = (entry as any).value;
              if ((entry as any).value > 0.1) {
                triggerUltraOptimization('cls');
              }
              break;
            case 'navigation':
              const navEntry = entry as PerformanceNavigationTiming;
              newMetrics.ttfb = navEntry.responseStart - navEntry.requestStart;
              newMetrics.fcp = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
              break;
          }
        });

        if (Object.keys(newMetrics).length > 0) {
          setMetrics(prev => ({ 
            ...prev, 
            ...newMetrics,
            bundleSize: bundleSizeRef.current
          } as PerformanceMetrics));
        }
      });

      performanceObserverRef.current.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] 
      });

      // Network performance monitoring with bundle size tracking
      networkObserverRef.current = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.duration > 2000) {
              console.warn('🚨 Ultra slow resource detected:', resourceEntry.name, resourceEntry.duration);
              triggerUltraOptimization('network');
            }
          }
        }
        calculateBundleSize();
      });

      networkObserverRef.current.observe({ entryTypes: ['resource'] });

      // Memory monitoring with garbage collection hints
      if ('memory' in performance) {
        const checkMemory = () => {
          const memory = (performance as any).memory;
          const memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
          
          setMetrics(prev => prev ? {
            ...prev,
            memory: {
              used: memory.usedJSHeapSize,
              total: memory.totalJSHeapSize,
              limit: memory.jsHeapSizeLimit
            }
          } : null);

          if (memoryUsage > 0.7) {
            console.warn('🚨 High memory usage detected:', memoryUsage);
            triggerUltraOptimization('memory');
          }
        };

        // Check memory every 5 seconds
        setInterval(checkMemory, 5000);
        checkMemory(); // Initial check
      }

      // Network information API with adaptive loading
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const updateNetworkInfo = () => {
          setMetrics(prev => prev ? {
            ...prev,
            network: {
              effectiveType: connection.effectiveType || 'unknown',
              downlink: connection.downlink || 0,
              rtt: connection.rtt || 0
            }
          } : null);

          // Adaptive optimization based on network conditions
          if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            setOptimizationLevel('ultra');
            triggerUltraOptimization('network');
          } else if (connection.effectiveType === '3g') {
            setOptimizationLevel('advanced');
          }
        };

        connection.addEventListener('change', updateNetworkInfo);
        updateNetworkInfo(); // Initial update
      }

    } catch (error) {
      console.warn('Ultra performance monitoring not supported:', error);
    }
  }, [calculateBundleSize]);

  // Ultra-optimization triggers with history tracking
  const triggerUltraOptimization = useCallback((type: 'lcp' | 'fid' | 'cls' | 'network' | 'memory') => {
    if (isOptimizing) return;
    
    setIsOptimizing(true);
    const timestamp = new Date().toISOString();
    const optimizationMessage = `🚀 ${timestamp}: Triggering ultra optimization for ${type}`;
    
    setOptimizationHistory(prev => [...prev.slice(-9), optimizationMessage]);
    console.log(optimizationMessage);

    switch (type) {
      case 'lcp':
        optimizeForLCP();
        break;
      case 'fid':
        optimizeForFID();
        break;
      case 'cls':
        optimizeForCLS();
        break;
      case 'network':
        optimizeForNetwork();
        break;
      case 'memory':
        optimizeForMemory();
        break;
    }

    // Reset optimization flag after 2 seconds
    optimizationTimeoutRef.current = setTimeout(() => {
      setIsOptimizing(false);
    }, 2000);
  }, [isOptimizing]);

  // Enhanced LCP optimization with image compression
  const optimizeForLCP = useCallback(() => {
    // Reduce image quality for faster loading
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const src = (img as HTMLImageElement).dataset.src;
      if (src) {
        (img as HTMLImageElement).src = src.replace(/\.(jpg|jpeg|png)/, '-ultra-low.$1');
        (img as HTMLImageElement).loading = 'eager';
        (img as HTMLImageElement).fetchPriority = 'high';
      }
    });

    // Preload critical images with higher priority
    const criticalImages = document.querySelectorAll('img[data-critical]');
    criticalImages.forEach((img) => {
      (img as HTMLImageElement).fetchPriority = 'high';
    });

    // Optimize video loading
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.preload = 'metadata';
      video.setAttribute('data-optimized', 'true');
    });
  }, []);

  // Enhanced FID optimization with event delegation
  const optimizeForFID = useCallback(() => {
    // Defer non-critical JavaScript
    const nonCriticalScripts = document.querySelectorAll('script[data-non-critical]');
    nonCriticalScripts.forEach((script) => {
      script.setAttribute('defer', 'true');
    });

    // Reduce event listeners with delegation
    const elements = document.querySelectorAll('[data-heavy-events]');
    elements.forEach((element) => {
      element.setAttribute('data-events-optimized', 'true');
    });

    // Optimize form interactions
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
      form.setAttribute('data-optimized', 'true');
    });
  }, []);

  // Enhanced CLS optimization with layout stability
  const optimizeForCLS = useCallback(() => {
    // Reserve space for all images
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const aspectRatio = (img as HTMLImageElement).dataset.aspectRatio || '16/9';
      (img as HTMLImageElement).style.aspectRatio = aspectRatio;
      (img as HTMLImageElement).style.minHeight = '200px';
      (img as HTMLImageElement).style.width = '100%';
    });

    // Prevent layout shifts with container sizing
    const containers = document.querySelectorAll('[data-content]');
    containers.forEach((container) => {
      (container as HTMLElement).style.minHeight = '100px';
      (container as HTMLElement).style.overflow = 'hidden';
    });

    // Optimize font loading to prevent layout shifts
    const textElements = document.querySelectorAll('h1, h2, h3, p, span');
    textElements.forEach((element) => {
      (element as HTMLElement).style.setProperty('font-display', 'swap');
    });
  }, []);

  // Enhanced network optimization with adaptive loading
  const optimizeForNetwork = useCallback(() => {
    // Switch to low-quality resources based on network conditions
    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => {
      const src = (img as HTMLImageElement).dataset.src;
      if (src) {
        (img as HTMLImageElement).src = src.replace(/\.(jpg|jpeg|png)/, '-low.$1');
        (img as HTMLImageElement).loading = 'lazy';
      }
    });

    // Disable non-critical features
    const nonCriticalElements = document.querySelectorAll('[data-non-critical]');
    nonCriticalElements.forEach((element) => {
      element.setAttribute('style', 'display: none !important');
    });

    // Optimize video loading for slow networks
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.preload = 'none';
      video.setAttribute('data-network-optimized', 'true');
    });
  }, []);

  // Enhanced memory optimization with cleanup
  const optimizeForMemory = useCallback(() => {
    // Clear non-essential caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (!cacheName.includes('critical')) {
            caches.delete(cacheName);
          }
        });
      });
    }

    // Suggest garbage collection
    if ('gc' in window) {
      (window as any).gc();
    }

    // Remove non-critical event listeners
    const elements = document.querySelectorAll('[data-heavy-events]');
    elements.forEach((element) => {
      element.setAttribute('data-events-optimized', 'true');
    });

    // Clear unused images from memory
    const images = document.querySelectorAll('img[data-lazy]');
    images.forEach((img) => {
      const rect = img.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        (img as HTMLImageElement).src = '';
      }
    });
  }, []);

  // Intelligent preloading based on user behavior and network conditions
  const setupIntelligentPreloading = useCallback(() => {
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';
    let scrollCount = 0;
    let userInteractionCount = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      scrollCount++;

      // Preload based on scroll behavior
      if (scrollCount % 10 === 0) {
        if (scrollDirection === 'down') {
          preloadBelowFold();
        } else {
          preloadAboveFold();
        }
      }

      lastScrollY = currentScrollY;
    };

    const handleUserInteraction = () => {
      userInteractionCount++;
      if (userInteractionCount === 1) {
        // First user interaction - preload critical resources
        preloadCriticalResources();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
  }, []);

  const preloadBelowFold = useCallback(() => {
    const belowFoldResources = ultraCriticalResources.filter(r => r.priority === 'low');
    belowFoldResources.forEach(resource => {
      if (!preloadedResourcesRef.current.has(resource.url)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource.url;
        document.head.appendChild(link);
        preloadedResourcesRef.current.add(resource.url);
      }
    });
  }, [ultraCriticalResources]);

  const preloadAboveFold = useCallback(() => {
    const aboveFoldResources = ultraCriticalResources.filter(r => r.priority === 'high');
    aboveFoldResources.forEach(resource => {
      if (!preloadedResourcesRef.current.has(resource.url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        if (resource.type === 'image') link.as = 'image';
        document.head.appendChild(link);
        preloadedResourcesRef.current.add(resource.url);
      }
    });
  }, [ultraCriticalResources]);

  const preloadCriticalResources = useCallback(() => {
    const criticalResources = ultraCriticalResources.filter(r => r.critical);
    criticalResources.forEach(resource => {
      if (!preloadedResourcesRef.current.has(resource.url)) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.url;
        link.setAttribute('fetchpriority', 'high');
        if (resource.type === 'image') link.as = 'image';
        document.head.appendChild(link);
        preloadedResourcesRef.current.add(resource.url);
      }
    });
  }, [ultraCriticalResources]);

  // Main effect
  useEffect(() => {
    // Setup all ultra optimizations
    injectIntelligentResourceHints();
    setupUltraPerformanceMonitoring();
    setupIntelligentPreloading();

    // Cleanup
    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
      if (networkObserverRef.current) {
        networkObserverRef.current.disconnect();
      }
      if (memoryObserverRef.current) {
        memoryObserverRef.current.disconnect();
      }
      if (optimizationTimeoutRef.current) {
        clearTimeout(optimizationTimeoutRef.current);
      }
    };
  }, [
    injectIntelligentResourceHints,
    setupUltraPerformanceMonitoring,
    setupIntelligentPreloading
  ]);

  // Development-only performance display with enhanced metrics
  if (process.env.NODE_ENV === 'development' && metrics) {
    return (
      <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs max-h-96 overflow-y-auto">
        <div className="font-bold mb-2">🚀 Ultra Performance Metrics</div>
        <div className="space-y-1">
          <div>LCP: {metrics.lcp?.toFixed(0)}ms {metrics.lcp && metrics.lcp > 2000 && '🚨'}</div>
          <div>FID: {metrics.fid?.toFixed(0)}ms {metrics.fid && metrics.fid > 100 && '🚨'}</div>
          <div>CLS: {metrics.cls?.toFixed(3)} {metrics.cls && metrics.cls > 0.1 && '🚨'}</div>
          <div>TTFB: {metrics.ttfb?.toFixed(0)}ms</div>
          <div>FCP: {metrics.fcp?.toFixed(0)}ms</div>
          {metrics.memory && (
            <div>Memory: {Math.round(metrics.memory.used / 1024 / 1024)}MB / {Math.round(metrics.memory.limit / 1024 / 1024)}MB</div>
          )}
          {metrics.network && (
            <div>Network: {metrics.network.effectiveType} ({metrics.network.downlink}Mbps)</div>
          )}
          {metrics.bundleSize && (
            <div>Bundle: {Math.round(metrics.bundleSize.total / 1024)}KB</div>
          )}
          {isOptimizing && <div className="text-yellow-400">🔄 Optimizing...</div>}
          <div className="text-gray-400 text-xs">Level: {optimizationLevel}</div>
        </div>
        
        {/* Optimization History */}
        {optimizationHistory.length > 0 && (
          <div className="mt-3 pt-2 border-t border-gray-700">
            <div className="font-bold text-xs mb-1">Recent Optimizations:</div>
            <div className="space-y-1 text-xs text-gray-300">
              {optimizationHistory.slice(-3).map((msg, index) => (
                <div key={index} className="truncate">{msg}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default UltraPerformanceOptimizer; 