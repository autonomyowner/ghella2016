'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface BundleMetrics {
  totalSize: number;
  chunkCount: number;
  largestChunk: {
    name: string;
    size: number;
  };
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
    percentage: number;
  };
  performance: {
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
  };
  recommendations: string[];
}

interface ChunkInfo {
  name: string;
  size: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  priority: 'high' | 'medium' | 'low';
}

const UltraBundleAnalyzer: React.FC = () => {
  const [metrics, setMetrics] = useState<BundleMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [chunks, setChunks] = useState<ChunkInfo[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const memoryIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Analyze JavaScript bundles
  const analyzeBundles = useCallback(async () => {
    if (typeof window === 'undefined') return;

    setIsAnalyzing(true);
    const chunks: ChunkInfo[] = [];
    let totalSize = 0;

    try {
      // Get all script tags
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach((script) => {
        const src = script.getAttribute('src');
        if (src) {
          // Estimate size based on URL patterns
          const size = estimateChunkSize(src);
          const type = getChunkType(src);
          const priority = getChunkPriority(src);
          
          chunks.push({
            name: src.split('/').pop() || src,
            size,
            type,
            priority
          });
          
          totalSize += size;
        }
      });

      // Get CSS files
      const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
      stylesheets.forEach((link) => {
        const href = link.getAttribute('href');
        if (href) {
          const size = estimateChunkSize(href);
          chunks.push({
            name: href.split('/').pop() || href,
            size,
            type: 'css',
            priority: 'medium'
          });
          totalSize += size;
        }
      });

      // Sort chunks by size
      chunks.sort((a, b) => b.size - a.size);

      setChunks(chunks);
      
      // Generate recommendations
      const recommendations = generateRecommendations(chunks, totalSize);
      
      setMetrics(prev => prev ? {
        ...prev,
        totalSize,
        chunkCount: chunks.length,
        largestChunk: chunks[0] ? {
          name: chunks[0].name,
          size: chunks[0].size
        } : { name: '', size: 0 },
        recommendations
      } : null);

    } catch (error) {
      console.error('Bundle analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Estimate chunk size based on URL patterns
  const estimateChunkSize = useCallback((url: string): number => {
    // This is a rough estimation - in production you'd want real metrics
    if (url.includes('_next/static/chunks/')) {
      if (url.includes('framework')) return 150 * 1024; // ~150KB
      if (url.includes('main')) return 100 * 1024; // ~100KB
      if (url.includes('pages')) return 50 * 1024; // ~50KB
      return 30 * 1024; // Default chunk size
    }
    
    if (url.includes('googleapis.com/fonts')) return 20 * 1024; // ~20KB
    if (url.includes('font-awesome')) return 15 * 1024; // ~15KB
    
    return 10 * 1024; // Default size
  }, []);

  // Get chunk type based on URL
  const getChunkType = useCallback((url: string): ChunkInfo['type'] => {
    if (url.includes('.js')) return 'js';
    if (url.includes('.css')) return 'css';
    if (url.match(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  }, []);

  // Get chunk priority based on URL
  const getChunkPriority = useCallback((url: string): ChunkInfo['priority'] => {
    if (url.includes('framework') || url.includes('main')) return 'high';
    if (url.includes('pages') || url.includes('chunks')) return 'medium';
    return 'low';
  }, []);

  // Generate performance recommendations
  const generateRecommendations = useCallback((chunks: ChunkInfo[], totalSize: number): string[] => {
    const recommendations: string[] = [];
    
    // Bundle size recommendations
    if (totalSize > 500 * 1024) { // > 500KB
      recommendations.push('🚨 Bundle size is large (>500KB). Consider code splitting.');
    }
    
    if (totalSize > 1000 * 1024) { // > 1MB
      recommendations.push('🚨 Bundle size is very large (>1MB). Implement aggressive code splitting.');
    }
    
    // Chunk count recommendations
    if (chunks.length > 20) {
      recommendations.push('⚠️ Too many chunks detected. Consider bundling related chunks.');
    }
    
    // Large chunk recommendations
    const largeChunks = chunks.filter(chunk => chunk.size > 100 * 1024);
    if (largeChunks.length > 3) {
      recommendations.push('⚠️ Multiple large chunks detected. Consider lazy loading.');
    }
    
    // CSS recommendations
    const cssChunks = chunks.filter(chunk => chunk.type === 'css');
    if (cssChunks.length > 5) {
      recommendations.push('💡 Consider CSS-in-JS or CSS modules to reduce CSS chunks.');
    }
    
    // Font recommendations
    const fontChunks = chunks.filter(chunk => chunk.type === 'font');
    if (fontChunks.length > 3) {
      recommendations.push('💡 Consider using font-display: swap and preloading critical fonts.');
    }
    
    // Performance recommendations
    if (metrics?.performance) {
      if (metrics.performance.lcp > 2500) {
        recommendations.push('🚨 LCP is slow. Optimize critical rendering path.');
      }
      if (metrics.performance.fid > 100) {
        recommendations.push('🚨 FID is slow. Reduce JavaScript execution time.');
      }
      if (metrics.performance.cls > 0.1) {
        recommendations.push('🚨 CLS is poor. Reserve space for dynamic content.');
      }
    }
    
    // Memory recommendations
    if (metrics?.memoryUsage && metrics.memoryUsage.percentage > 80) {
      recommendations.push('🚨 High memory usage. Check for memory leaks.');
    }
    
    return recommendations;
  }, [metrics]);

  // Monitor memory usage
  const monitorMemory = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const percentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
      
      setMetrics(prev => prev ? {
        ...prev,
        memoryUsage: {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
          percentage
        }
      } : null);
    }
  }, []);

  // Monitor performance metrics
  const monitorPerformance = useCallback(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    try {
      performanceObserverRef.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        let newMetrics: Partial<BundleMetrics['performance']> = {};

        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              newMetrics.lcp = entry.startTime;
              break;
            case 'first-input':
              newMetrics.fid = (entry as PerformanceEventTiming).processingStart - (entry as PerformanceEventTiming).startTime;
              break;
            case 'layout-shift':
              newMetrics.cls = (entry as any).value;
              break;
            case 'navigation':
              const navEntry = entry as PerformanceNavigationTiming;
              newMetrics.ttfb = navEntry.responseStart - navEntry.requestStart;
              break;
          }
        });

        if (Object.keys(newMetrics).length > 0) {
          setMetrics(prev => prev ? {
            ...prev,
            performance: { ...prev.performance, ...newMetrics }
          } : null);
        }
      });

      performanceObserverRef.current.observe({ 
        entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] 
      });

    } catch (error) {
      console.warn('Performance monitoring not supported:', error);
    }
  }, []);

  // Format bytes to human readable
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Get priority color
  const getPriorityColor = useCallback((priority: ChunkInfo['priority']): string => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }, []);

  // Get type icon
  const getTypeIcon = useCallback((type: ChunkInfo['type']): string => {
    switch (type) {
      case 'js': return '📜';
      case 'css': return '🎨';
      case 'image': return '🖼️';
      case 'font': return '🔤';
      default: return '📄';
    }
  }, []);

  // Toggle visibility
  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  // Setup monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Initial analysis
      analyzeBundles();
      
      // Monitor memory every 5 seconds
      memoryIntervalRef.current = setInterval(monitorMemory, 5000);
      
      // Setup performance monitoring
      monitorPerformance();
      
      // Re-analyze on route changes
      const handleRouteChange = () => {
        setTimeout(analyzeBundles, 1000);
      };
      
      window.addEventListener('popstate', handleRouteChange);
      
      return () => {
        if (memoryIntervalRef.current) {
          clearInterval(memoryIntervalRef.current);
        }
        if (performanceObserverRef.current) {
          performanceObserverRef.current.disconnect();
        }
        if (analysisTimeoutRef.current) {
          clearTimeout(analysisTimeoutRef.current);
        }
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, [analyzeBundles, monitorMemory, monitorPerformance]);

  // Development-only component
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggleVisibility}
        className="fixed top-4 left-4 bg-black/90 text-white p-3 rounded-lg z-50 hover:bg-black/80 transition-colors"
        title="Ultra Bundle Analyzer"
      >
        📊
      </button>

      {/* Main panel */}
      {isVisible && (
        <div className="fixed top-16 left-4 bg-black/95 text-white p-6 rounded-lg z-50 max-w-md max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">🚀 Ultra Bundle Analyzer</h3>
            <button
              onClick={toggleVisibility}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {isAnalyzing && (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-sm text-gray-400">تحليل الحزم...</p>
            </div>
          )}

          {metrics && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">📈 ملخص الأداء</h4>
                <div className="space-y-1 text-sm">
                  <div>إجمالي الحجم: {formatBytes(metrics.totalSize)}</div>
                  <div>عدد الحزم: {metrics.chunkCount}</div>
                  <div>أكبر حزمة: {metrics.largestChunk.name} ({formatBytes(metrics.largestChunk.size)})</div>
                </div>
              </div>

              {/* Memory Usage */}
              {metrics.memoryUsage && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">🧠 استخدام الذاكرة</h4>
                  <div className="space-y-1 text-sm">
                    <div>المستخدم: {formatBytes(metrics.memoryUsage.used)}</div>
                    <div>الحد الأقصى: {formatBytes(metrics.memoryUsage.limit)}</div>
                    <div className="flex items-center space-x-2">
                      <span>النسبة:</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            metrics.memoryUsage.percentage > 80 ? 'bg-red-500' :
                            metrics.memoryUsage.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(metrics.memoryUsage.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs">{metrics.memoryUsage.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Metrics */}
              {metrics.performance && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">⚡ مقاييس الأداء</h4>
                  <div className="space-y-1 text-sm">
                    <div className={`${metrics.performance.lcp > 2500 ? 'text-red-400' : 'text-green-400'}`}>
                      LCP: {metrics.performance.lcp?.toFixed(0)}ms
                    </div>
                    <div className={`${metrics.performance.fid > 100 ? 'text-red-400' : 'text-green-400'}`}>
                      FID: {metrics.performance.fid?.toFixed(0)}ms
                    </div>
                    <div className={`${metrics.performance.cls > 0.1 ? 'text-red-400' : 'text-green-400'}`}>
                      CLS: {metrics.performance.cls?.toFixed(3)}
                    </div>
                    <div>TTFB: {metrics.performance.ttfb?.toFixed(0)}ms</div>
                  </div>
                </div>
              )}

              {/* Top Chunks */}
              {chunks.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">📦 أكبر الحزم</h4>
                  <div className="space-y-2">
                    {chunks.slice(0, 5).map((chunk, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span>{getTypeIcon(chunk.type)}</span>
                          <span className="truncate max-w-32">{chunk.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={getPriorityColor(chunk.priority)}>
                            {chunk.priority}
                          </span>
                          <span>{formatBytes(chunk.size)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {metrics.recommendations.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">💡 التوصيات</h4>
                  <div className="space-y-2">
                    {metrics.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={analyzeBundles}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                >
                  إعادة التحليل
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded text-sm"
                >
                  تحديث الصفحة
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UltraBundleAnalyzer; 