'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const PremiumBackground: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const backgroundImages = [
    '/assets/n7l1.webp',
    '/assets/n7l2.webp',
    '/assets/land01.jpg'
  ];

  useEffect(() => {
    // Simulate image loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    // Auto-rotate background images for premium feel
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearInterval(imageInterval);
    };
  }, [backgroundImages.length]);

  return (
    <div className="absolute inset-0 z-0">
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 animate-pulse" />
      )}
      
      {/* Premium Image Background */}
      <div className={`absolute inset-0 transition-opacity duration-2000 ${
        isLoaded ? 'opacity-70' : 'opacity-0'
      }`}>
        <Image
          src={backgroundImages[currentImage]}
          alt="Premium agricultural background"
          fill
          priority
          quality={90}
          className="object-cover transition-all duration-2000"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
        />
      </div>
      
      {/* Multiple gradient overlays for premium depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 via-green-800/40 to-teal-900/60"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-transparent to-teal-900/30"></div>
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-teal-400 rounded-full animate-ping opacity-40" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-emerald-300 rounded-full animate-ping opacity-30" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Subtle animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent animate-pulse"></div>
      </div>
      
      {/* Premium texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
};

export default PremiumBackground; 