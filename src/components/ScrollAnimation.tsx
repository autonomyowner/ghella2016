'use client';

import { useEffect, useRef } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    switch (direction) {
      case 'up':
        return 'animate-on-scroll-up';
      case 'down':
        return 'animate-on-scroll-down';
      case 'left':
        return 'animate-on-scroll-left';
      case 'right':
        return 'animate-on-scroll-right';
      case 'fade':
        return 'animate-on-scroll-fade';
      case 'scale':
        return 'animate-on-scroll-scale';
      default:
        return 'animate-on-scroll-up';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
