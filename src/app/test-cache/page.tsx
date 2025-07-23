'use client'

import { useState, useEffect } from 'react'
import BrowserCache from '@/lib/browserCache'

export default function TestCachePage() {
  const [message, setMessage] = useState('')
  const [caches, setCaches] = useState<string[]>([])
  const [cacheAvailable, setCacheAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    setCacheAvailable(BrowserCache.isAvailable())
  }, [])

  const handleClearCache = async () => {
    setMessage('Clearing cache...')
    await BrowserCache.clearAll()
    setMessage('Cache cleared!')
    
    // List caches after clearing
    const cacheList = await BrowserCache.listAll()
    setCaches(cacheList)
  }

  const handleListCaches = async () => {
    const cacheList = await BrowserCache.listAll()
    setCaches(cacheList)
    setMessage(`Found ${cacheList.length} caches`)
  }

  const handleForceReload = async () => {
    setMessage('Force reloading...')
    await BrowserCache.forceReload()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cache Test Page</h1>
        
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <p><strong>Cache Available:</strong> {cacheAvailable === null ? 'Checking...' : cacheAvailable ? 'Yes' : 'No'}</p>
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleClearCache}
            className="w-full p-3 bg-red-600 hover:bg-red-700 rounded cursor-pointer"
          >
            Clear All Cache
          </button>

          <button
            onClick={handleListCaches}
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
          >
            List Caches
          </button>

          <button
            onClick={handleForceReload}
            className="w-full p-3 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
          >
            Force Reload
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <p>{message}</p>
          </div>
        )}

        {caches.length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <h3 className="font-bold mb-2">Available Caches:</h3>
            <ul className="list-disc list-inside">
              {caches.map((cache, index) => (
                <li key={index}>{cache}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Clear All Cache" to clear browser cache</li>
            <li>Click "List Caches" to see available caches</li>
            <li>Click "Force Reload" to reload with cache clearing</li>
            <li>Check browser console for cache messages</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 