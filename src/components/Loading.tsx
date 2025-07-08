'use client'

import React from 'react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

const Loading: React.FC<LoadingProps> = ({ 
  message = 'جاري التحميل...', 
  size = 'md',
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="glass rounded-3xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`${sizeClasses[size]} border-4 border-green-400 border-t-transparent rounded-full animate-spin`}></div>
          </div>
          <p className={`text-white ${textSizes[size]} font-medium`}>
            {message}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className={`${sizeClasses[size]} border-4 border-green-400 border-t-transparent rounded-full animate-spin`}></div>
        </div>
        <p className={`text-white ${textSizes[size]} font-medium`}>
          {message}
        </p>
      </div>
    </div>
  )
}

// Skeleton loading components
export const SkeletonCard: React.FC = () => (
  <div className="glass rounded-3xl overflow-hidden">
    <div className="h-64 loading-skeleton"></div>
    <div className="p-6 space-y-4">
      <div className="h-4 loading-skeleton rounded"></div>
      <div className="h-4 loading-skeleton rounded w-3/4"></div>
      <div className="h-6 loading-skeleton rounded w-1/2"></div>
    </div>
  </div>
)

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
)

export default Loading
