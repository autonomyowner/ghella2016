'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  const { signIn } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen gradient-bg-primary flex items-center justify-center spacing-responsive-lg">
      <div className="container-responsive">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center spacing-responsive-md">
            <h1 className="heading-responsive-h1 text-white mb-4">
              مرحباً بك في الغلة
            </h1>
            <p className="text-responsive-lg text-green-200">
              سجل دخولك للوصول إلى حسابك
            </p>
          </div>

          {/* Login Form */}
          <div className="card-responsive glass">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-responsive-sm text-green-300 font-medium mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="أدخل بريدك الإلكتروني"
                    className="w-full spacing-responsive-sm rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all text-responsive-base"
                    required
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                    📧
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-responsive-sm text-green-300 font-medium mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="w-full spacing-responsive-sm rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all text-responsive-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors touch-friendly"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="spacing-responsive-sm rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-responsive-sm">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-responsive w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري تسجيل الدخول...
                  </span>
                ) : (
                  'تسجيل الدخول'
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-responsive-sm text-green-300 hover:text-green-400 transition-colors touch-friendly"
                >
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </form>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8 card-responsive glass">
            <p className="text-responsive-base text-white/80 mb-4">
              ليس لديك حساب؟
            </p>
            <Link
              href="/auth/signup"
              className="btn-responsive bg-white/20 text-green-100 border border-white/30 hover:bg-white/30 font-bold inline-flex items-center"
            >
              إنشاء حساب جديد
            </Link>
          </div>

          {/* Features */}
          <div className="spacing-responsive-lg text-center">
            <h3 className="heading-responsive-h3 text-white mb-6">
              لماذا تختار الغلة؟
            </h3>
            <div className="grid-responsive gap-4">
              <div className="card-responsive glass text-center">
                <div className="text-3xl mb-3">🚜</div>
                <h4 className="text-responsive-base text-white font-medium mb-2">معدات متنوعة</h4>
                <p className="text-responsive-sm text-white/70">آلاف المعدات الزراعية المتاحة</p>
              </div>
              <div className="card-responsive glass text-center">
                <div className="text-3xl mb-3">🔒</div>
                <h4 className="text-responsive-base text-white font-medium mb-2">معاملات آمنة</h4>
                <p className="text-responsive-sm text-white/70">حماية كاملة لبياناتك ومعاملاتك</p>
              </div>
              <div className="card-responsive glass text-center">
                <div className="text-3xl mb-3">📞</div>
                <h4 className="text-responsive-base text-white font-medium mb-2">دعم على مدار الساعة</h4>
                <p className="text-responsive-sm text-white/70">فريق الدعم متاح لمساعدتك دائماً</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
