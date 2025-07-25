import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable caching in development
  experimental: {
    optimizeCss: true,
    // Force fresh builds
    forceSwcTransforms: true,
  },
  
  // Suppress hydration warnings caused by browser extensions
  reactStrictMode: false,
  
  // Webpack configuration to prevent caching issues
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable caching for development
      config.cache = false;
    }
    
    return config;
  },
  
  // Disable static optimization for dynamic content
  trailingSlash: false,
  
  // Disable image optimization in development
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Add headers to prevent caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development' 
              ? 'no-cache, no-store, must-revalidate, max-age=0'
              : 'public, max-age=31536000, immutable',
          },
          {
            key: 'Pragma',
            value: process.env.NODE_ENV === 'development' ? 'no-cache' : '',
          },
          {
            key: 'Expires',
            value: process.env.NODE_ENV === 'development' ? '0' : '',
          },
        ],
      },
    ]
  },
  


  // Redirects for better UX
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // Output configuration
  output: 'standalone',
  
  // Base path configuration
  basePath: '',
  
  // Asset prefix configuration
  assetPrefix: '',
  
  // Disable powered by header
  poweredByHeader: false,
  
  // Enable compression
  compress: true,
  
  // Disable etags in development
  generateEtags: process.env.NODE_ENV === 'production',
}

export default nextConfig
