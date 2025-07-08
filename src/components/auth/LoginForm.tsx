'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.user) {
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard')
          router.refresh()
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">تسجيل الدخول</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="example@email.com"
            dir="ltr"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
            كلمة المرور
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="كلمة المرور"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-md transition-all duration-300 flex items-center justify-center font-medium"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              جاري تسجيل الدخول...
            </>
          ) : (
            'تسجيل الدخول'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        ليس لديك حساب؟{' '}
        <button
          onClick={() => router.push('/auth/signup')}
          className="text-green-400 hover:text-green-300 underline"
        >
          إنشاء حساب جديد
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-green-400 hover:text-green-300 text-sm underline">
          نسيت كلمة المرور؟
        </button>
      </div>
    </div>
  )
}
