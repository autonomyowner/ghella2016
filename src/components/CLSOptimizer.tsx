'use client'

import { useEffect, useRef } from 'react'

interface CLSOptimizerProps {
  children: React.ReactNode
}

export default function CLSOptimizer({ children }: CLSOptimizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Prevent layout shifts by setting explicit dimensions
    const preventLayoutShift = () => {
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        if ((img as HTMLElement).closest('.leaflet-container')) {
          return
        }
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
          // Set default dimensions to prevent CLS
          img.style.width = img.style.width || '100%'
          img.style.height = img.style.height || 'auto'
          img.style.aspectRatio = '16/9'
        }
      })

      // Set explicit dimensions for motion components
      const motionElements = document.querySelectorAll('[class*="motion"]')
      motionElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        if (!htmlElement.style.minHeight) {
          htmlElement.style.minHeight = '1px'
        }
      })
    }

    // Run immediately and on resize
    preventLayoutShift()
    window.addEventListener('resize', preventLayoutShift)

    // Optimize animations to reduce CLS
    const optimizeAnimations = () => {
      // Reduce motion for users who prefer it
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--motion-reduce', '1')
      }

      // Use transform instead of changing layout properties
      const animatedElements = document.querySelectorAll('[class*="animate-"]')
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        htmlElement.style.willChange = 'transform, opacity'
      })
    }

    optimizeAnimations()

    return () => {
      window.removeEventListener('resize', preventLayoutShift)
    }
  }, [])

  return (
    <div ref={containerRef} className="cls-optimized">
      {children}
    </div>
  )
}
