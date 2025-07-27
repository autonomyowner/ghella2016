'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import dynamic from 'next/dynamic'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

// Dynamic import for framer-motion to avoid SSR issues
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { 
  ssr: false,
  loading: () => <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md mx-auto" />
})

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('جاري التحقق من تسجيل الدخول...')
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('loading')
        setMessage('جاري التحقق من تسجيل الدخول...')

        // Get the session from the URL
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('حدث خطأ أثناء تسجيل الدخول')
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
          return
        }

        if (data.session) {
          console.log('Auth callback successful:', data.session.user.email)
          setStatus('success')
          setMessage('تم تسجيل الدخول بنجاح! جاري التوجيه...')
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('فشل في تسجيل الدخول')
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        setStatus('error')
        setMessage('حدث خطأ غير متوقع')
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md mx-auto"
        >
          {status === 'loading' && (
            <MotionDiv
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
            />
          )}
          
          {status === 'success' && (
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </MotionDiv>
          )}
          
          {status === 'error' && (
            <MotionDiv
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <XCircle className="w-8 h-8 text-white" />
            </MotionDiv>
          )}

          <h2 className="text-2xl font-bold text-white mb-4">
            {status === 'loading' && 'جاري التحقق...'}
            {status === 'success' && 'تم بنجاح!'}
            {status === 'error' && 'حدث خطأ'}
          </h2>
          
          <p className="text-gray-300 mb-6">
            {message}
          </p>

          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 text-emerald-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">يرجى الانتظار...</span>
            </div>
          )}
        </MotionDiv>
      </div>
    </div>
  )
} 