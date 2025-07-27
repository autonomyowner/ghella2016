'use client'

import { useState, useEffect } from 'react'
import { useEquipment } from '@/hooks/useSupabase'
import { supabase } from '@/lib/supabase/supabaseClient'

export default function TestEquipmentLoading() {
  const { equipment, loading, error, fetchEquipment } = useEquipment()
  const [directData, setDirectData] = useState<any[]>([])
  const [directLoading, setDirectLoading] = useState(false)
  const [directError, setDirectError] = useState<string | null>(null)

  // Test direct Supabase query
  const testDirectQuery = async () => {
    setDirectLoading(true)
    setDirectError(null)
    
    try {
      console.log('🔍 Testing direct Supabase query...')
      
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .limit(10)
      
      if (error) {
        console.error('❌ Direct query error:', error)
        setDirectError(error.message)
      } else {
        console.log('✅ Direct query successful:', data?.length || 0, 'items')
        setDirectData(data || [])
      }
    } catch (err) {
      console.error('❌ Direct query failed:', err)
      setDirectError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setDirectLoading(false)
    }
  }

  // Test hook data
  const testHookData = async () => {
    console.log('🔄 Testing hook data fetch...')
    try {
      const result = await fetchEquipment()
      console.log('✅ Hook fetch result:', result?.length || 0, 'items')
    } catch (err) {
      console.error('❌ Hook fetch failed:', err)
    }
  }

  useEffect(() => {
    testDirectQuery()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Equipment Loading Test</h1>
        
        {/* Direct Query Test */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Direct Supabase Query</h2>
          <div className="mb-4">
            <button 
              onClick={testDirectQuery}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mr-4"
            >
              Test Direct Query
            </button>
            <span className="text-sm text-gray-400">
              {directLoading ? 'Loading...' : directError ? 'Error' : 'Ready'}
            </span>
          </div>
          
          {directError && (
            <div className="bg-red-900/50 border border-red-500 p-4 rounded mb-4">
              <strong>Error:</strong> {directError}
            </div>
          )}
          
          <div className="bg-gray-700 p-4 rounded">
            <strong>Direct Data Count:</strong> {directData.length}
            {directData.length > 0 && (
              <div className="mt-2">
                <strong>Sample Items:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {directData.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.title} - {item.price} {item.currency}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Hook Test */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">useEquipment Hook Test</h2>
          <div className="mb-4">
            <button 
              onClick={testHookData}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mr-4"
            >
              Test Hook Data
            </button>
            <span className="text-sm text-gray-400">
              {loading ? 'Loading...' : error ? 'Error' : 'Ready'}
            </span>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-500 p-4 rounded mb-4">
              <strong>Hook Error:</strong> {error}
            </div>
          )}
          
          <div className="bg-gray-700 p-4 rounded">
            <strong>Hook Data Count:</strong> {equipment.length}
            {equipment.length > 0 && (
              <div className="mt-2">
                <strong>Sample Items:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {equipment.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.title} - {item.price} {item.currency}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Database Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <strong>Direct Query:</strong>
              <div className="text-sm text-gray-400 mt-1">
                Status: {directLoading ? 'Loading' : directError ? 'Error' : 'Success'}
              </div>
              <div className="text-sm text-gray-400">
                Items: {directData.length}
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded">
              <strong>Hook Query:</strong>
              <div className="text-sm text-gray-400 mt-1">
                Status: {loading ? 'Loading' : error ? 'Error' : 'Success'}
              </div>
              <div className="text-sm text-gray-400">
                Items: {equipment.length}
              </div>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="bg-gray-700 p-4 rounded text-sm font-mono">
            <div>Direct Loading: {directLoading.toString()}</div>
            <div>Hook Loading: {loading.toString()}</div>
            <div>Direct Error: {directError || 'None'}</div>
            <div>Hook Error: {error || 'None'}</div>
            <div>Direct Data Length: {directData.length}</div>
            <div>Hook Data Length: {equipment.length}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 