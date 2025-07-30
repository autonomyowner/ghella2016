'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'

export default function TestEquipmentPosting() {
  const { user } = useSupabaseAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testSimplePost = async () => {
    if (!user) {
      setError('User not logged in')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Test with minimal required data
      const testEquipment = {
        user_id: user.id,
        title: 'Test Equipment ' + Date.now(),
        description: 'This is a test equipment posting',
        price: 100000,
        currency: 'DZD',
        // category_id will be set by database trigger
        condition: 'good',
        location: 'Test Location',
        contact_phone: '+213 555 123 456',
        images: [],
        is_available: true,
        is_featured: false,
        view_count: 0,
        coordinates: null
      }

      console.log('Testing equipment post with data:', testEquipment)

      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .insert([testEquipment])
        .select()
        .single()

      if (supabaseError) {
        console.error('Supabase error:', supabaseError)
        throw supabaseError
      }

      console.log('Success! Equipment posted:', data)
      setResult(data)
    } catch (err) {
      console.error('Test failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testFetchEquipment = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const { data, error: supabaseError } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (supabaseError) {
        throw supabaseError
      }

      console.log('Fetched equipment:', data)
      setResult(data)
    } catch (err) {
      console.error('Fetch failed:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Equipment Posting</h1>
        
        <div className="space-y-6">
          {/* User Info */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Status</h2>
            {user ? (
              <div className="space-y-2">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p className="text-green-400">✅ User is logged in</p>
              </div>
            ) : (
              <p className="text-red-400">❌ No user logged in</p>
            )}
          </div>

          {/* Test Buttons */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
            <div className="space-y-4">
              <button
                onClick={testSimplePost}
                disabled={loading || !user}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Testing...' : 'Test Equipment Post'}
              </button>
              
              <button
                onClick={testFetchEquipment}
                disabled={loading}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg font-semibold transition-colors ml-4"
              >
                {loading ? 'Fetching...' : 'Test Fetch Equipment'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Error</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Success!</h3>
              <pre className="text-green-300 text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 