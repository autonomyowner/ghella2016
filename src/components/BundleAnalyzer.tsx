'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface BundleInfo {
  name: string;
  size: number;
  gzippedSize: number;
  type: 'initial' | 'chunk' | 'vendor' | 'common';
  priority: 'high' | 'medium' | 'low';
}

interface PerformanceMetrics {
  jsHeapSize: number;
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  bundleCount: number;
  totalBundleSize: number;
}

const BundleAnalyzer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bundleInfo, setBundleInfo] = useState<BundleInfo[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Analyze bundle sizes
  const analyzeBundles = useCallback(() => {
    if (typeof window === 'undefined') return;

    const bundles: BundleInfo[] = [];
    
    // Analyze performance entries
    const performanceEntries = performance.getEntriesByType('resource');
    const jsEntries = performanceEntries.filter(entry => 
      entry.name.includes('.js') || entry.name.includes('chunk')
    );

    jsEntries.forEach(entry => {
      const name = entry.name.split('/').pop() || entry.name;
      const resourceEntry = entry as PerformanceResourceTiming;
      const size = resourceEntry.transferSize || resourceEntry.encodedBodySize || 0;
      const gzippedSize = Math.round(size * 0.3); // Estimate gzipped size
      
      let type: BundleInfo['type'] = 'chunk';
      let priority: BundleInfo['priority'] = 'medium';
      
      if (name.includes('main') || name.includes('app')) {
        type = 'initial';
        priority = 'high';
      } else if (name.includes('vendor') || name.includes('node_modules')) {
        type = 'vendor';
        priority = 'medium';
      } else if (name.includes('common')) {
        type = 'common';
        priority = 'low';
      }

      bundles.push({
        name,
        size,
        gzippedSize,
        type,
        priority
      });
    });

    setBundleInfo(bundles);
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    if (typeof window === 'undefined' || !('memory' in performance)) return;

    const memory = (performance as any).memory;
    const metrics: PerformanceMetrics = {
      jsHeapSize: memory.jsHeapSizeLimit,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      totalJSHeapSize: memory.totalJSHeapSize,
      usedJSHeapSize: memory.usedJSHeapSize,
      bundleCount: bundleInfo.length,
      totalBundleSize: bundleInfo.reduce((sum, bundle) => sum + bundle.size, 0)
    };

    setPerformanceMetrics(metrics);
  }, [bundleInfo]);

  // Generate recommendations
  const generateRecommendations = useCallback(() => {
    const recs: string[] = [];
    
    if (!performanceMetrics) return recs;

    // Bundle size recommendations
    const totalSize = performanceMetrics.totalBundleSize;
    if (totalSize > 2 * 1024 * 1024) { // 2MB
      recs.push('🚨 Bundle size is too large (>2MB). Consider code splitting.');
    } else if (totalSize > 1 * 1024 * 1024) { // 1MB
      recs.push('⚠️ Bundle size is large (>1MB). Consider optimization.');
    }

    // Memory usage recommendations
    const memoryUsage = performanceMetrics.usedJSHeapSize / performanceMetrics.jsHeapSizeLimit;
    if (memoryUsage > 0.8) {
      recs.push('🚨 High memory usage (>80%). Check for memory leaks.');
    } else if (memoryUsage > 0.6) {
      recs.push('⚠️ Moderate memory usage (>60%). Monitor closely.');
    }

    // Bundle count recommendations
    if (performanceMetrics.bundleCount > 20) {
      recs.push('⚠️ Too many bundles (>20). Consider consolidation.');
    }

    // Vendor bundle recommendations
    const vendorBundles = bundleInfo.filter(b => b.type === 'vendor');
    const vendorSize = vendorBundles.reduce((sum, b) => sum + b.size, 0);
    if (vendorSize > 500 * 1024) { // 500KB
      recs.push('⚠️ Large vendor bundle (>500KB). Consider tree shaking.');
    }

    // Initial bundle recommendations
    const initialBundles = bundleInfo.filter(b => b.type === 'initial');
    const initialSize = initialBundles.reduce((sum, b) => sum + b.size, 0);
    if (initialSize > 300 * 1024) { // 300KB
      recs.push('🚨 Large initial bundle (>300KB). Critical for LCP.');
    }

    setRecommendations(recs);
  }, [performanceMetrics, bundleInfo]);

  // Format bytes
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get priority color
  const getPriorityColor = (priority: BundleInfo['priority']): string => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  // Get type color
  const getTypeColor = (type: BundleInfo['type']): string => {
    switch (type) {
      case 'initial': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      case 'common': return 'bg-green-100 text-green-800';
      case 'chunk': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Main effect
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Show analyzer in development
    setIsVisible(true);

    // Analyze bundles after page load
    const analyzeAfterLoad = () => {
      setTimeout(() => {
        analyzeBundles();
      }, 2000); // Wait for all resources to load
    };

    if (document.readyState === 'complete') {
      analyzeAfterLoad();
    } else {
      window.addEventListener('load', analyzeAfterLoad);
    }

    // Update metrics periodically
    const interval = setInterval(() => {
      getPerformanceMetrics();
      generateRecommendations();
    }, 5000);

    return () => {
      window.removeEventListener('load', analyzeAfterLoad);
      clearInterval(interval);
    };
  }, [analyzeBundles, getPerformanceMetrics, generateRecommendations]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Bundle Analyzer</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      {/* Performance Metrics */}
      {performanceMetrics && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Memory Usage</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Used:</span>
              <span>{formatBytes(performanceMetrics.usedJSHeapSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{formatBytes(performanceMetrics.totalJSHeapSize)}</span>
            </div>
            <div className="flex justify-between">
              <span>Limit:</span>
              <span>{formatBytes(performanceMetrics.jsHeapSizeLimit)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(performanceMetrics.usedJSHeapSize / performanceMetrics.jsHeapSizeLimit) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Bundle Information */}
      {bundleInfo.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Bundles ({bundleInfo.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {bundleInfo.map((bundle, index) => (
              <div key={index} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(bundle.type)}`}>
                      {bundle.type}
                    </span>
                    <span className={`font-medium ${getPriorityColor(bundle.priority)}`}>
                      {bundle.name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">{formatBytes(bundle.size)}</div>
                  <div className="text-gray-500 text-xs">{formatBytes(bundle.gzippedSize)} gz</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
          <div className="space-y-1">
            {recommendations.map((rec, index) => (
              <div key={index} className="text-xs p-2 bg-yellow-50 border border-yellow-200 rounded">
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {performanceMetrics && (
        <div className="text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Total Bundle Size:</span>
            <span className="font-mono">{formatBytes(performanceMetrics.totalBundleSize)}</span>
          </div>
          <div className="flex justify-between">
            <span>Bundle Count:</span>
            <span>{performanceMetrics.bundleCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleAnalyzer; 