'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
  domLoad: number | null;
  windowLoad: number | null;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    domLoad: null,
    windowLoad: null
  });
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Get initial metrics
    const getInitialMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || null;
      const ttfb = navigation?.responseStart - navigation?.requestStart || null;
      const domLoad = navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || null;
      const windowLoad = navigation?.loadEventEnd - navigation?.loadEventStart || null;

      setMetrics(prev => ({
        ...prev,
        fcp,
        ttfb,
        domLoad,
        windowLoad
      }));
    };

    // Setup performance observer
    const setupObserver = () => {
      try {
        observerRef.current = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            switch (entry.entryType) {
              case 'largest-contentful-paint':
                setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
                break;
              case 'first-input':
                const fid = (entry as PerformanceEventTiming).processingStart - (entry as PerformanceEventTiming).startTime;
                setMetrics(prev => ({ ...prev, fid }));
                break;
              case 'layout-shift':
                const cls = (entry as any).value;
                setMetrics(prev => ({ ...prev, cls }));
                break;
            }
          }
        });

        observerRef.current.observe({ 
          entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] 
        });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    };

    // Get metrics after page load
    if (document.readyState === 'complete') {
      getInitialMetrics();
    } else {
      window.addEventListener('load', getInitialMetrics);
    }

    setupObserver();

    // Show monitor in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('load', getInitialMetrics);
    };
  }, []);

  // Performance grade calculation
  const getPerformanceGrade = (metric: number | null, thresholds: { good: number; needsImprovement: number }): string => {
    if (metric === null) return 'N/A';
    if (metric <= thresholds.good) return '🟢';
    if (metric <= thresholds.needsImprovement) return '🟡';
    return '🔴';
  };

  const formatMetric = (metric: number | null): string => {
    if (metric === null) return 'N/A';
    return `${Math.round(metric)}ms`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Performance Monitor</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FCP:</span>
          <span>{getPerformanceGrade(metrics.fcp, { good: 1800, needsImprovement: 3000 })} {formatMetric(metrics.fcp)}</span>
        </div>
        <div className="flex justify-between">
          <span>LCP:</span>
          <span>{getPerformanceGrade(metrics.lcp, { good: 2500, needsImprovement: 4000 })} {formatMetric(metrics.lcp)}</span>
        </div>
        <div className="flex justify-between">
          <span>FID:</span>
          <span>{getPerformanceGrade(metrics.fid, { good: 100, needsImprovement: 300 })} {formatMetric(metrics.fid)}</span>
        </div>
        <div className="flex justify-between">
          <span>CLS:</span>
          <span>{getPerformanceGrade(metrics.cls, { good: 0.1, needsImprovement: 0.25 })} {metrics.cls?.toFixed(3) || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span>{getPerformanceGrade(metrics.ttfb, { good: 800, needsImprovement: 1800 })} {formatMetric(metrics.ttfb)}</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600">
        <div className="flex justify-between">
          <span>DOM Load:</span>
          <span>{formatMetric(metrics.domLoad)}</span>
        </div>
        <div className="flex justify-between">
          <span>Window Load:</span>
          <span>{formatMetric(metrics.windowLoad)}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor; 