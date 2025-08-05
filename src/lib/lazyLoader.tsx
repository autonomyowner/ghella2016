'use client';

import React from 'react';
import { lazy, Suspense, ComponentType } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  [key: string]: any;
}

interface LazyLoaderOptions {
  fallback?: React.ReactNode;
  preload?: boolean;
  timeout?: number;
}

class LazyLoader {
  private loadedComponents = new Map<string, ComponentType<any>>();
  private loadingPromises = new Map<string, Promise<ComponentType<any>>>();
  private preloadedComponents = new Set<string>();

  /**
   * Lazy load a component with error boundary and retry logic
   */
  lazyLoad<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    componentName: string,
    options: LazyLoaderOptions = {}
  ): ComponentType<React.ComponentProps<T>> {
    const { fallback, preload = false, timeout = 10000 } = options;

    // Check if already loaded
    if (this.loadedComponents.has(componentName)) {
      return this.loadedComponents.get(componentName)!;
    }

    // Check if currently loading
    if (this.loadingPromises.has(componentName)) {
      return this.createLazyComponent(
        this.loadingPromises.get(componentName)!,
        componentName,
        fallback
      );
    }

    // Create loading promise with timeout and retry
    const loadingPromise = this.createLoadingPromise(importFn, componentName, timeout);
    this.loadingPromises.set(componentName, loadingPromise);

    // Preload if requested
    if (preload && !this.preloadedComponents.has(componentName)) {
      this.preloadComponent(componentName, loadingPromise);
    }

    return this.createLazyComponent(loadingPromise, componentName, fallback);
  }

  /**
   * Create loading promise with retry logic
   */
  private createLoadingPromise<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    componentName: string,
    timeout: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Loading timeout for ${componentName}`));
      }, timeout);

      importFn()
        .then((module) => {
          clearTimeout(timeoutId);
          const component = module.default;
          this.loadedComponents.set(componentName, component);
          this.loadingPromises.delete(componentName);
          resolve(component);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          this.loadingPromises.delete(componentName);
          
          // Retry once on failure
          console.warn(`Failed to load ${componentName}, retrying...`, error);
          
          setTimeout(() => {
            importFn()
              .then((module) => {
                const component = module.default;
                this.loadedComponents.set(componentName, component);
                resolve(component);
              })
              .catch((retryError) => {
                console.error(`Failed to load ${componentName} after retry:`, retryError);
                reject(retryError);
              });
          }, 1000);
        });
    });
  }

  /**
   * Create lazy component with Suspense wrapper
   */
  private createLazyComponent<T extends ComponentType<any>>(
    loadingPromise: Promise<T>,
    componentName: string,
    fallback?: React.ReactNode
  ): ComponentType<React.ComponentProps<T>> {
    const LazyComponent = lazy(() => 
      loadingPromise.then(component => ({ default: component }))
    );

    const WrappedComponent = (props: React.ComponentProps<T>) => (
      <Suspense fallback={fallback || this.getDefaultFallback(componentName)}>
        <LazyComponent {...props} />
      </Suspense>
    );
    
    WrappedComponent.displayName = `LazyLoaded(${componentName})`;
    return WrappedComponent;
  }

  /**
   * Preload a component
   */
  preloadComponent(componentName: string, loadingPromise?: Promise<ComponentType<any>>): void {
    if (this.preloadedComponents.has(componentName)) return;

    if (loadingPromise) {
      loadingPromise.then(() => {
        this.preloadedComponents.add(componentName);
      });
    }
  }

  /**
   * Get default fallback component
   */
  private getDefaultFallback(componentName: string): React.ReactNode {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">جاري تحميل {componentName}...</p>
        </div>
      </div>
    );
  }

  /**
   * Preload multiple components
   */
  preloadComponents(components: Array<{ name: string; importFn: () => Promise<any> }>): void {
    components.forEach(({ name, importFn }) => {
      if (!this.preloadedComponents.has(name)) {
        const promise = this.createLoadingPromise(importFn, name, 10000);
        this.preloadComponent(name, promise);
      }
    });
  }

  /**
   * Get loading status
   */
  getLoadingStatus(componentName: string): 'idle' | 'loading' | 'loaded' | 'error' {
    if (this.loadedComponents.has(componentName)) return 'loaded';
    if (this.loadingPromises.has(componentName)) return 'loading';
    return 'idle';
  }

  /**
   * Clear loaded components cache
   */
  clearCache(): void {
    this.loadedComponents.clear();
    this.loadingPromises.clear();
    this.preloadedComponents.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { loaded: number; loading: number; preloaded: number } {
    return {
      loaded: this.loadedComponents.size,
      loading: this.loadingPromises.size,
      preloaded: this.preloadedComponents.size
    };
  }
}

// Create singleton instance
const lazyLoader = new LazyLoader();

export default lazyLoader;

// Predefined lazy components for common marketplace forms
export const LazyEquipmentForm = lazyLoader.lazyLoad(
  () => import('@/app/equipment/new/page'),
  'EquipmentForm',
  { preload: true }
);

export const LazyLandForm = lazyLoader.lazyLoad(
  () => import('@/app/land/new/page'),
  'LandForm',
  { preload: true }
);

export const LazyAnimalsForm = lazyLoader.lazyLoad(
  () => import('@/app/animals/new/page'),
  'AnimalsForm',
  { preload: true }
);

export const LazyNurseriesForm = lazyLoader.lazyLoad(
  () => import('@/app/nurseries/new/page'),
  'NurseriesForm',
  { preload: true }
);

export const LazyVegetablesForm = lazyLoader.lazyLoad(
  () => import('@/app/VAR/marketplace/new/page'),
  'VegetablesForm',
  { preload: true }
); 