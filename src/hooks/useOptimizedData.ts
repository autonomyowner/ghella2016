'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedDataOptions<T> {
  initialData?: T;
  cacheKey?: string;
  cacheTime?: number;
  debounceTime?: number;
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseOptimizedDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();

const useOptimizedData = <T>(
  fetcher: () => Promise<T>,
  dependencies: any[] = [],
  options: UseOptimizedDataOptions<T> = {}
): UseOptimizedDataReturn<T> => {
  const {
    initialData = null,
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    debounceTime = 300,
    retryCount = 3,
    retryDelay = 1000,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);

  // Check cache
  const getCachedData = useCallback((): T | null => {
    if (!cacheKey) return null;
    
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    
    return null;
  }, [cacheKey, cacheTime]);

  // Set cache
  const setCachedData = useCallback((newData: T) => {
    if (cacheKey) {
      cache.set(cacheKey, { data: newData, timestamp: Date.now() });
    }
  }, [cacheKey]);

  // Clear cache
  const clearCache = useCallback(() => {
    if (cacheKey) {
      cache.delete(cacheKey);
    }
  }, [cacheKey]);

  // Fetch data with retry logic
  const fetchData = useCallback(async (signal?: AbortSignal): Promise<T> => {
    try {
      const result = await fetcher();
      
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }
      
      return result;
    } catch (err) {
      if (signal?.aborted) {
        throw new Error('Request aborted');
      }
      
      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchData(signal);
      }
      
      throw err;
    }
  }, [fetcher, retryCount, retryDelay]);

  // Main fetch function
  const executeFetch = useCallback(async () => {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) {
      setData(cachedData);
      setError(null);
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    retryCountRef.current = 0;

    try {
      const result = await fetchData(abortControllerRef.current.signal);
      
      setData(result);
      setCachedData(result);
      onSuccess?.(result);
    } catch (err) {
      if (err instanceof Error && err.message !== 'Request aborted') {
        setError(err);
        onError?.(err);
      }
    } finally {
      setLoading(false);
    }
  }, [getCachedData, fetchData, setCachedData, onSuccess, onError]);

  // Debounced fetch
  const debouncedFetch = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      executeFetch();
    }, debounceTime);
  }, [executeFetch, debounceTime]);

  // Refetch function
  const refetch = useCallback(async () => {
    clearCache();
    await executeFetch();
  }, [clearCache, executeFetch]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    debouncedFetch();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
};

export default useOptimizedData; 