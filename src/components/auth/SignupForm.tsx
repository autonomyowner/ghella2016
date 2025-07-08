'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProfileInsert } from '@/types/database.types'

interface SignupFormProps {
  onSuccess?: () => void
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            location: location,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Create profile
        const profileData: ProfileInsert = {
          id: data.user.id,
          full_name: fullName,
          phone: phone,
          location: location,
          user_type: 'farmer', // Default to farmer
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .insert([profileData])

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here, profile might be created by trigger
        }

        setMessage('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد.')
        
        if (onSuccess) {
          onSuccess()
        } else {
          setTimeout(() => {
            router.push('/auth/login')
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">إنشاء حساب جديد</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-md text-green-400 text-sm">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-md text-red-400 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-200 mb-1">
            الاسم الكامل *
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="أدخل اسمك الكامل"
            dir="rtl"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            البريد الإلكتروني *
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
            كلمة المرور *
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="كلمة مرور قوية"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
            رقم الهاتف
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="07xxxxxxxx"
            dir="ltr"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-200 mb-1">
            الموقع
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="المدينة، المحافظة"
            dir="rtl"
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
              جاري إنشاء الحساب...
            </>
          ) : (
            'إنشاء حساب'
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        لديك حساب بالفعل؟{' '}
        <button
          onClick={() => router.push('/auth/login')}
          className="text-green-400 hover:text-green-300 underline"
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  )
}
