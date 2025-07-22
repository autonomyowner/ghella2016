'use client'

import { useState } from 'react'
import { firestore, auth } from '@/lib/firebaseConfig'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function FirebaseTest() {
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [testPassword, setTestPassword] = useState('password123')

  const testFirestore = async () => {
    try {
      setStatus('Testing Firestore connection...')
      setError('')
      
      const testRef = collection(firestore, 'test')
      const querySnapshot = await getDocs(testRef)
      
      setStatus(`✅ Firestore connected! Found ${querySnapshot.docs.length} test documents`)
    } catch (err) {
      setError(`❌ Firestore error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setStatus('')
    }
  }

  const testAuth = async () => {
    try {
      setStatus('Testing Firebase Auth...')
      setError('')
      
      // Try to create a test user
      const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword)
      
      setStatus(`✅ Firebase Auth working! Created user: ${userCredential.user.email}`)
    } catch (err) {
      setError(`❌ Firebase Auth error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setStatus('')
    }
  }

  const addTestDocument = async () => {
    try {
      setStatus('Adding test document...')
      setError('')
      
      const testRef = collection(firestore, 'test')
      const docRef = await addDoc(testRef, {
        message: 'Hello Firebase!',
        timestamp: new Date().toISOString(),
        test: true
      })
      
      setStatus(`✅ Test document added with ID: ${docRef.id}`)
    } catch (err) {
      setError(`❌ Error adding document: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setStatus('')
    }
  }

  const checkConfig = () => {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    }

    const missing = Object.entries(config).filter(([key, value]) => !value)
    
    if (missing.length > 0) {
      setError(`❌ Missing environment variables: ${missing.map(([key]) => key).join(', ')}`)
      setStatus('')
    } else {
      setStatus('✅ All environment variables are set')
      setError('')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Firebase Test</h2>
      
      {status && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md text-green-400 text-sm">
          {status}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <button
          onClick={checkConfig}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors"
        >
          Check Environment Variables
        </button>
        
        <button
          onClick={testFirestore}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-500 text-white rounded-md transition-colors"
        >
          Test Firestore Connection
        </button>
        
        <button
          onClick={addTestDocument}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-md transition-colors"
        >
          Add Test Document
        </button>
        
        <div className="border-t border-gray-600 pt-4">
          <h3 className="text-lg font-semibold text-white mb-2">Test Authentication</h3>
          <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Test email"
            className="w-full mb-2 px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white"
          />
          <input
            type="password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            placeholder="Test password"
            className="w-full mb-2 px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white"
          />
          <button
            onClick={testAuth}
            className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-md transition-colors"
          >
            Test Firebase Auth
          </button>
        </div>
      </div>
    </div>
  )
} 