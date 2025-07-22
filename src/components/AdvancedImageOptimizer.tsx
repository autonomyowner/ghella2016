'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  lazy?: boolean;
  progressive?: boolean;
  responsive?: boolean;
  formats?: ('webp' | 'avif' | 'jpeg' | 'png')[];
  fallbackSrc?: string;
  aspectRatio?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  loadingStrategy?: 'eager' | 'lazy' | 'progressive';
}

const AdvancedImageOptimizer: React.FC<AdvancedImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  lazy = true,
  progressive = true,
  responsive = true,
  formats = ['webp', 'avif', 'jpeg'],
  fallbackSrc,
  aspectRatio,
  objectFit = 'cover',
  objectPosition = 'center',
  loadingStrategy = 'lazy'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority || loadingStrategy === 'eager');
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [imageQuality, setImageQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [isProgressiveLoading, setIsProgressiveLoading] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Detect connection speed
  const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'fast' | 'unknown'>('unknown');

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.effectiveType === '3g') {
        setConnectionSpeed('slow');
        setImageQuality('low');
      } else {
        setConnectionSpeed('fast');
        setImageQuality('high');
      }
    }
  }, []);

  // Setup intersection observer
  useEffect(() => {
    if (priority || loadingStrategy === 'eager') return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px 0px 100px 0px',
        threshold: 0.1
      }
    );

    if (imageRef.current) {
      observerRef.current.observe(imageRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority, loadingStrategy]);

  // Generate optimized image sources
  const generateImageSources = useCallback(() => {
    const baseUrl = src;
    const extension = src.split('.').pop()?.toLowerCase();
    
    if (!extension) return { original: baseUrl };

    const sources: { [key: string]: string } = {};
    
    // Generate different formats
    formats.forEach(format => {
      if (format === 'webp' && extension !== 'webp') {
        sources.webp = baseUrl.replace(`.${extension}`, '.webp');
      } else if (format === 'avif' && extension !== 'avif') {
        sources.avif = baseUrl.replace(`.${extension}`, '.avif');
      }
    });

    // Generate different qualities
    if (progressive && connectionSpeed === 'slow') {
      sources.low = baseUrl.replace(`.${extension}`, `-low.${extension}`);
      sources.medium = baseUrl.replace(`.${extension}`, `-medium.${extension}`);
    }

    return { ...sources, original: baseUrl };
  }, [src, formats, progressive, connectionSpeed]);

  // Progressive loading effect
  useEffect(() => {
    if (!isInView || !progressive) return;

    const sources = generateImageSources();
    
    if ('low' in sources && sources.low && imageQuality === 'low') {
      setIsProgressiveLoading(true);
      setCurrentSrc(sources.low as string);
      
      // Load medium quality after low quality loads
      setTimeout(() => {
        if ('medium' in sources && sources.medium) {
          setCurrentSrc(sources.medium as string);
          setImageQuality('medium');
        }
      }, 200);
      
      // Load high quality after medium quality loads
      setTimeout(() => {
        if (sources.original) {
          setCurrentSrc(sources.original);
          setImageQuality('high');
        }
      }, 500);
    } else {
      setCurrentSrc(sources.original || src);
    }
  }, [isInView, progressive, generateImageSources, imageQuality, src]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsProgressiveLoading(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsError(false);
    } else {
      setIsError(true);
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  // Generate responsive sizes
  const generateResponsiveSizes = useCallback(() => {
    if (!responsive) return sizes;

    const breakpoints = [
      { width: 640, size: '100vw' },
      { width: 768, size: '50vw' },
      { width: 1024, size: '33vw' },
      { width: 1280, size: '25vw' }
    ];

    return breakpoints
      .map(bp => `(max-width: ${bp.width}px) ${bp.size}`)
      .join(', ') + ', 20vw';
  }, [responsive, sizes]);

  // Loading skeleton with shimmer
  const LoadingSkeleton = () => (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      {aspectRatio && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ aspectRatio: aspectRatio.toString() }}
        />
      )}
    </div>
  );

  // Error fallback
  const ErrorFallback = () => (
    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
      <div className="text-center text-gray-500 p-4">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">فشل في تحميل الصورة</p>
        <p className="text-xs text-gray-400 mt-1">يرجى المحاولة مرة أخرى</p>
      </div>
    </div>
  );

  // Progressive loading indicator
  const ProgressiveIndicator = () => (
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
      <div className="text-center text-white">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs">جاري تحميل الصورة...</p>
      </div>
    </div>
  );

  // Generate picture element sources
  const generatePictureSources = () => {
    const sources = generateImageSources();
    const pictureSources = [];

    // Add WebP source
    if ('webp' in sources && sources.webp) {
      pictureSources.push(
        <source key="webp" srcSet={sources.webp as string} type="image/webp" />
      );
    }

    // Add AVIF source
    if ('avif' in sources && sources.avif) {
      pictureSources.push(
        <source key="avif" srcSet={sources.avif as string} type="image/avif" />
      );
    }

    return pictureSources;
  };

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
      style={{ 
        width: fill ? '100%' : width,
        height: fill ? '100%' : height,
        aspectRatio: aspectRatio ? aspectRatio.toString() : undefined
      }}
    >
      <AnimatePresence mode="wait">
        {/* Loading state */}
        {!isLoaded && !isError && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingSkeleton />
          </motion.div>
        )}

        {/* Progressive loading indicator */}
        {isProgressiveLoading && (
          <motion.div
            key="progressive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ProgressiveIndicator />
          </motion.div>
        )}

        {/* Error state */}
        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ErrorFallback />
          </motion.div>
        )}

        {/* Image */}
        {isInView && !isError && (
          <motion.div
            key="image"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full"
          >
            <picture>
              {generatePictureSources()}
              <Image
                src={currentSrc || src}
                alt={alt}
                width={width}
                height={height}
                fill={fill}
                sizes={generateResponsiveSizes()}
                quality={quality}
                placeholder={placeholder}
                blurDataURL={blurDataURL}
                className={`object-${objectFit} transition-opacity duration-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ objectPosition }}
                onLoad={handleLoad}
                onError={handleError}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
              />
            </picture>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {imageQuality} {connectionSpeed}
        </div>
      )}
    </div>
  );
};

export default AdvancedImageOptimizer; 