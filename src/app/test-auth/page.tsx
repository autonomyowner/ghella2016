'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'

export default function TestAuthPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('testpassword123')
  const [message, setMessage] = useState('')
  const { signIn, user, loading } = useSupabaseAuth()

  const handleTestLogin = async () => {
    setMessage('Testing login...')
    try {
      const { error } = await signIn(email, password)
      if (error) {
        setMessage(`Error: ${error.message}`)
      } else {
        setMessage('Login successful!')
      }
    } catch (err) {
      setMessage(`Exception: ${err}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Test</h1>
        
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <p><strong>Current User:</strong> {user ? user.email : 'None'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <button
            onClick={handleTestLogin}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Test Login
          </button>
        </div>

        {message && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  )
} 