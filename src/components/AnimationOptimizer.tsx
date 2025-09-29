'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface AnimationOptimizerProps {
  children: React.ReactNode
}

export default function AnimationOptimizer({ children }: AnimationOptimizerProps) {
  useEffect(() => {
    // Optimize animations to reduce CLS
    const optimizeAnimations = () => {
      // Check user's motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      
      if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--animation-duration', '0s')
        document.documentElement.style.setProperty('--animation-delay', '0s')
      } else {
        // Optimize animation performance
        document.documentElement.style.setProperty('--animation-duration', '0.3s')
        document.documentElement.style.setProperty('--animation-delay', '0s')
      }

      // Use GPU acceleration for better performance
      const animatedElements = document.querySelectorAll('[class*="motion"], [class*="animate-"]')
      animatedElements.forEach((element) => {
        const htmlElement = element as HTMLElement
        htmlElement.style.willChange = 'transform, opacity'
        htmlElement.style.backfaceVisibility = 'hidden'
        htmlElement.style.perspective = '1000px'
      })

      // Reduce animation complexity on slower devices
      const isSlowDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
      if (isSlowDevice) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s')
      }
    }

    optimizeAnimations()

    // Re-optimize on resize
    const handleResize = () => {
      optimizeAnimations()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
      style={{ willChange: 'auto' }}
    >
      {children}
    </motion.div>
  )
}
