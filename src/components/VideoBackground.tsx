'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const VideoBackground: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simulate image loading with a small delay for smooth transition
    const timer = setTimeout(() => {
      if (!hasError) {
        setIsLoaded(true);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [hasError]);

  // Fallback background if image fails to load
  if (hasError) {
    return (
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-emerald-900/30"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 animate-pulse" />
      )}
      
      {/* Static Image Background using Next.js Image for optimization */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-60' : 'opacity-0'
      }`}>
        <Image
          src="/assets/n7l1.webp"
          alt="Agricultural background"
          fill
          priority
          quality={85}
          className="object-cover"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Additional gradient overlay for better visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-transparent to-emerald-900/30"></div>
      
      {/* Subtle animated overlay for visual interest */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default VideoBackground; 