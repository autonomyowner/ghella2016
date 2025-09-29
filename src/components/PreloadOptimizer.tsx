'use client'

import { useEffect, useRef } from 'react'

interface PreloadOptimizerProps {
  children: React.ReactNode
}

export default function PreloadOptimizer({ children }: PreloadOptimizerProps) {
  const preloadedResources = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Only preload resources that are actually used
    const optimizePreloading = () => {
      const isTestPage = window.location.pathname.includes('/test-') || 
                        window.location.pathname.includes('/debug') ||
                        window.location.pathname.includes('/admin')

      if (isTestPage) {
        console.log('🚫 Skipping preloading on test/admin page')
        return
      }

      // Remove unused preload links
      const existingPreloads = document.querySelectorAll('link[rel="preload"]')
      existingPreloads.forEach((link) => {
        const href = link.getAttribute('href')
        if (href && !isResourceUsed(href)) {
          console.log('🗑️ Removing unused preload:', href)
          link.remove()
        }
      })

      // Add only critical preloads
      addCriticalPreloads()
    }

    const isResourceUsed = (href: string): boolean => {
      // Check if resource is actually used in the page
      const images = document.querySelectorAll('img[src*="' + href + '"]')
      const videos = document.querySelectorAll('video[src*="' + href + '"]')
      const links = document.querySelectorAll('a[href*="' + href + '"]')
      
      return images.length > 0 || videos.length > 0 || links.length > 0
    }

    const addCriticalPreloads = () => {
      // Only preload critical resources that are above the fold
      const criticalResources = [
        { href: '/favicon.ico', as: 'image' },
        { href: '/assets/n7l1.webp', as: 'image' },
        { href: '/assets/n7l2.webp', as: 'image' }
      ]

      criticalResources.forEach((resource) => {
        if (!preloadedResources.current.has(resource.href)) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = resource.href
          link.as = resource.as
          link.setAttribute('fetchpriority', 'high')
          document.head.appendChild(link)
          preloadedResources.current.add(resource.href)
        }
      })
    }

    // Delay preloading to avoid blocking critical resources
    const timeoutId = setTimeout(optimizePreloading, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return <>{children}</>
}
