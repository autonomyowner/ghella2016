'use client'

import { useEffect, useRef } from 'react'

interface AggressiveCLSPreventionProps {
  children: React.ReactNode
}

export default function AggressiveCLSPrevention({ children }: AggressiveCLSPreventionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Aggressive CLS prevention
    const preventCLS = () => {
      // Set explicit dimensions for all images
      const images = document.querySelectorAll('img')
      images.forEach((img) => {
        if ((img as HTMLElement).closest('.leaflet-container')) {
          return
        }
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
          img.style.width = '100%'
          img.style.height = 'auto'
          img.style.aspectRatio = '16/9'
          img.style.objectFit = 'cover'
        }
      })

      // Set explicit dimensions for all motion components
      const motionElements = document.querySelectorAll('[class*="motion"], [data-framer-motion]')
      motionElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        htmlElement.style.minHeight = '1px'
        htmlElement.style.willChange = 'transform, opacity'
        htmlElement.style.backfaceVisibility = 'hidden'
      })

      // Set explicit dimensions for all containers
      const containers = document.querySelectorAll('.container, .max-w-\\[\\d+px\\], .w-full, .h-full')
      containers.forEach((container) => {
        const htmlElement = container as HTMLElement
        if (!htmlElement.style.minHeight) {
          htmlElement.style.minHeight = '1px'
        }
      })

      // Prevent layout shifts from text content
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span')
      textElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        htmlElement.style.lineHeight = '1.5'
        htmlElement.style.minHeight = '1.2em'
      })

      // Set explicit dimensions for video elements
      const videos = document.querySelectorAll('video')
      videos.forEach((video) => {
        video.style.width = '100%'
        video.style.height = 'auto'
        video.style.aspectRatio = '16/9'
        video.style.objectFit = 'cover'
      })

      // Prevent layout shifts from loading states
      const loadingElements = document.querySelectorAll('[class*="loading"], [class*="skeleton"]')
      loadingElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        htmlElement.style.minHeight = '200px'
        htmlElement.style.backgroundColor = '#f0f0f0'
      })
    }

    // Run immediately
    preventCLS()

    // Run on DOM changes
    const observer = new MutationObserver(() => {
      preventCLS()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })

    // Run on resize
    const handleResize = () => {
      preventCLS()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div ref={containerRef} className="aggressive-cls-prevention">
      {children}
    </div>
  )
}
