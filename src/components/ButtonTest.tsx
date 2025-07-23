'use client'

import { useState } from 'react'

export default function ButtonTest() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')

  const handleClick = () => {
    setCount(prev => prev + 1)
    setMessage('Button clicked!')
    console.log('Test button clicked, count:', count + 1)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Form submitted!')
    console.log('Form submitted')
  }

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Button Test</h1>
        
        <div className="p-4 bg-gray-800 rounded">
          <p>Count: {count}</p>
          <p>Message: {message}</p>
        </div>

        {/* Test regular button */}
        <button
          onClick={handleClick}
          className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded cursor-pointer"
        >
          Test Button Click
        </button>

        {/* Test form with submit button */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Test input"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 rounded cursor-pointer"
          >
            Submit Form
          </button>
        </form>

        {/* Test link button */}
        <button
          onClick={() => window.location.href = '/auth/login'}
          className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded cursor-pointer"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  )
} 