'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';

interface UltraImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageFormats {
  webp: string;
  avif: string;
  jpeg: string;
  fallback: string;
}

interface ConnectionInfo {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
}

const UltraImageOptimizer: React.FC<UltraImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate multiple format URLs with different qualities
  const imageFormats: ImageFormats = useMemo(() => {
    const baseUrl = src.replace(/\.(jpg|jpeg|png|webp|avif)$/, '');
    const extension = src.match(/\.(jpg|jpeg|png|webp|avif)$/)?.[1] || 'jpg';
    
    // Generate different quality versions
    const qualities = {
      ultra: quality * 0.5,
      low: quality * 0.7,
      medium: quality * 0.85,
      high: quality
    };

    return {
      webp: `${baseUrl}-${qualities.ultra}.webp`,
      avif: `${baseUrl}-${qualities.ultra}.avif`,
      jpeg: `${baseUrl}-${qualities.ultra}.${extension}`,
      fallback: src
    };
  }, [src, quality]);

  // Detect connection quality
  const detectConnection = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionInfo({
        effectiveType: connection.effectiveType || '4g',
        downlink: connection.downlink || 10,
        rtt: connection.rtt || 50,
        saveData: connection.saveData || false
      });
    }
  }, []);

  // Get optimal image source based on connection and browser support
  const getOptimalSource = useCallback(() => {
    if (!connectionInfo) return imageFormats.fallback;

    // Check for save data mode
    if (connectionInfo.saveData) {
      return imageFormats.jpeg; // Lowest quality for data saving
    }

    // Check connection speed
    if (connectionInfo.effectiveType === 'slow-2g' || connectionInfo.effectiveType === '2g') {
      return imageFormats.jpeg;
    }

    if (connectionInfo.effectiveType === '3g') {
      return imageFormats.jpeg;
    }

    // For 4g and above, use modern formats
    if (connectionInfo.effectiveType === '4g') {
              // Check if browser supports AVIF
        if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
          const testAvif = new window.Image();
          testAvif.onload = () => setCurrentSrc(imageFormats.avif);
          testAvif.onerror = () => setCurrentSrc(imageFormats.webp);
          testAvif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
          return imageFormats.webp; // Fallback to WebP while testing
        }
      return imageFormats.webp;
    }

    return imageFormats.avif; // Best quality for fast connections
  }, [connectionInfo, imageFormats]);

  // Progressive loading with multiple quality levels
  const loadProgressive = useCallback(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    let currentQuality = 'ultra';
    const qualityLevels = ['ultra', 'low', 'medium', 'high'];

    const loadNextQuality = () => {
      const qualityIndex = qualityLevels.indexOf(currentQuality);
      if (qualityIndex < qualityLevels.length - 1) {
        currentQuality = qualityLevels[qualityIndex + 1];
        const newSrc = src.replace(/\.(jpg|jpeg|png|webp|avif)$/, `-${currentQuality}.$1`);
        
                 // Load higher quality image
         const highQualityImg = new window.Image();
         highQualityImg.onload = () => {
           if (img.src !== newSrc) {
             img.src = newSrc;
           }
         };
         highQualityImg.src = newSrc;
      }
    };

    // Start with ultra-low quality
    img.src = imageFormats.jpeg;
    
    // Load progressively better quality
    setTimeout(loadNextQuality, 100);
    setTimeout(loadNextQuality, 300);
    setTimeout(loadNextQuality, 600);
  }, [src, imageFormats]);

  // Setup intersection observer for lazy loading
  const setupIntersectionObserver = useCallback(() => {
    if (!imgRef.current || priority) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntersecting(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px 0px 100px 0px',
        threshold: 0.1
      }
    );

    observerRef.current.observe(imgRef.current);
  }, [priority]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setIsError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image error with retry logic
  const handleError = useCallback(() => {
    setIsError(true);
    setLoadAttempt(prev => prev + 1);
    
    if (loadAttempt < 3) {
      // Retry with different format
      const fallbackSrc = loadAttempt === 0 ? imageFormats.jpeg : imageFormats.fallback;
      setCurrentSrc(fallbackSrc);
      
      if (imgRef.current) {
        imgRef.current.src = fallbackSrc;
      }
    } else {
      onError?.();
    }
  }, [loadAttempt, imageFormats, onError]);

  // Setup connection detection
  useEffect(() => {
    detectConnection();
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection.addEventListener('change', detectConnection);
      
      return () => {
        connection.removeEventListener('change', detectConnection);
      };
    }
  }, [detectConnection]);

  // Setup intersection observer
  useEffect(() => {
    setupIntersectionObserver();
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setupIntersectionObserver]);

  // Load image when intersecting or priority
  useEffect(() => {
    if (priority || isIntersecting) {
      const optimalSrc = getOptimalSource();
      setCurrentSrc(optimalSrc);
      
      if (imgRef.current) {
        imgRef.current.src = optimalSrc;
        
        // Start progressive loading for non-priority images
        if (!priority) {
          loadProgressive();
        }
      }
    }
  }, [priority, isIntersecting, getOptimalSource, loadProgressive]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // Generate responsive sizes
  const responsiveSizes = useMemo(() => {
    if (sizes) return sizes;
    
    if (fill) {
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    }
    
    if (width && height) {
      const aspectRatio = width / height;
      if (aspectRatio > 2) {
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      } else if (aspectRatio > 1) {
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw';
      } else {
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw';
      }
    }
    
    return '100vw';
  }, [sizes, fill, width, height]);

  // Generate placeholder styles
  const placeholderStyles = useMemo(() => {
    if (placeholder === 'blur' && blurDataURL) {
      return {
        backgroundImage: `url(${blurDataURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        transform: 'scale(1.1)'
      };
    }
    
    return {
      backgroundColor: '#f3f4f6',
      backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    };
  }, [placeholder, blurDataURL]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="absolute inset-0"
          style={placeholderStyles}
        />
      )}
      
      {/* Error state */}
      {isError && loadAttempt >= 3 && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📷</div>
            <div className="text-sm">فشل في تحميل الصورة</div>
          </div>
        </div>
      )}
      
      {/* Main image */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${fill ? 'w-full h-full object-cover' : ''}`}
        style={fill ? { objectFit: 'cover' } : undefined}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        sizes={responsiveSizes}
      />
      
      {/* Loading indicator */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Connection indicator (development only) */}
      {process.env.NODE_ENV === 'development' && connectionInfo && (
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {connectionInfo.effectiveType}
        </div>
      )}
    </div>
  );
};

export default UltraImageOptimizer; 