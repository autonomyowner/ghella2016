'use client';

import React, { useEffect, useState } from 'react';

interface MobileOptimizedInterfaceProps {
  children: React.ReactNode;
}

const MobileOptimizedInterface: React.FC<MobileOptimizedInterfaceProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };

    // Detect touch device
    const checkTouchDevice = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    };

    checkMobile();
    checkTouchDevice();

    // Add mobile-specific optimizations
    if (isMobile || isTouchDevice) {
      // Optimize for mobile performance
      document.body.style.setProperty('--transition-duration', '200ms');
      document.body.style.setProperty('--animation-duration', '300ms');
      
      // Improve touch scrolling
      document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
      
      // Disable hover effects on touch devices
      if (isTouchDevice) {
        const style = document.createElement('style');
        style.textContent = `
          @media (hover: none) and (pointer: coarse) {
            .group:hover { transform: none !important; }
            .hover\\:scale-105:hover { transform: none !important; }
            .hover\\:translate-y-2:hover { transform: none !important; }
            .hover\\:shadow-2xl:hover { box-shadow: none !important; }
          }
        `;
        document.head.appendChild(style);
      }
    }

    // Cleanup
    return () => {
      document.body.style.removeProperty('--transition-duration');
      document.body.style.removeProperty('--animation-duration');
      document.body.style.removeProperty('-webkit-overflow-scrolling');
    };
  }, [isMobile, isTouchDevice]);

  // Add touch event optimizations
  useEffect(() => {
    if (!isTouchDevice) return;

    const optimizeTouchEvents = (e: TouchEvent) => {
      // Prevent double-tap zoom on buttons and links
      if (e.target instanceof HTMLElement) {
        const tagName = e.target.tagName.toLowerCase();
        if (tagName === 'button' || tagName === 'a' || e.target.closest('button, a')) {
          e.preventDefault();
          // Trigger click after a short delay
          setTimeout(() => {
            if (e.target instanceof HTMLElement) {
              e.target.click();
            }
          }, 50);
        }
      }
    };

    document.addEventListener('touchend', optimizeTouchEvents, { passive: false });
    
    return () => {
      document.removeEventListener('touchend', optimizeTouchEvents);
    };
  }, [isTouchDevice]);

  return (
    <div 
      className={`mobile-optimized ${isMobile ? 'mobile' : ''} ${isTouchDevice ? 'touch-device' : ''}`}
      style={{
        '--touch-target-size': '44px',
        '--transition-duration': isMobile ? '200ms' : '300ms',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedInterface; 