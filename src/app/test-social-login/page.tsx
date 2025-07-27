'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { motion } from 'framer-motion'
import { Globe, MessageCircle, CheckCircle, XCircle } from 'lucide-react'

export default function TestSocialLogin() {
  const { signInWithGoogle, signInWithFacebook, user } = useSupabaseAuth()
  const [googleStatus, setGoogleStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [facebookStatus, setFacebookStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleGoogleTest = async () => {
    setGoogleStatus('loading')
    setError('')
    
    try {
      const { error } = await signInWithGoogle()
      
      if (error) {
        console.error('Google test error:', error)
        setGoogleStatus('error')
        setError(error.message || 'Google login failed')
      } else {
        setGoogleStatus('success')
      }
    } catch (err) {
      console.error('Unexpected Google test error:', err)
      setGoogleStatus('error')
      setError('Unexpected error occurred')
    }
  }

  const handleFacebookTest = async () => {
    setFacebookStatus('loading')
    setError('')
    
    try {
      const { error } = await signInWithFacebook()
      
      if (error) {
        console.error('Facebook test error:', error)
        setFacebookStatus('error')
        setError(error.message || 'Facebook login failed')
      } else {
        setFacebookStatus('success')
      }
    } catch (err) {
      console.error('Unexpected Facebook test error:', err)
      setFacebookStatus('error')
      setError('Unexpected error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 flex items-center justify-center" dir="rtl">
      <div className="max-w-md w-full mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            اختبار تسجيل الدخول الاجتماعي
          </h1>

          {user && (
            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <p className="text-emerald-300 text-center">
                تم تسجيل الدخول: {user.email}
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-300 text-center">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Google Test */}
            <motion.button
              onClick={handleGoogleTest}
              disabled={googleStatus === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                googleStatus === 'loading'
                  ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                  : googleStatus === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                  : googleStatus === 'error'
                  ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <Globe className="w-5 h-5" />
              <span>
                {googleStatus === 'loading' && 'جاري الاختبار...'}
                {googleStatus === 'success' && 'Google - نجح'}
                {googleStatus === 'error' && 'Google - فشل'}
                {googleStatus === 'idle' && 'اختبار Google'}
              </span>
              {googleStatus === 'success' && <CheckCircle className="w-5 h-5" />}
              {googleStatus === 'error' && <XCircle className="w-5 h-5" />}
            </motion.button>

            {/* Facebook Test */}
            <motion.button
              onClick={handleFacebookTest}
              disabled={facebookStatus === 'loading'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
                facebookStatus === 'loading'
                  ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                  : facebookStatus === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                  : facebookStatus === 'error'
                  ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                  : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span>
                {facebookStatus === 'loading' && 'جاري الاختبار...'}
                {facebookStatus === 'success' && 'Facebook - نجح'}
                {facebookStatus === 'error' && 'Facebook - فشل'}
                {facebookStatus === 'idle' && 'اختبار Facebook'}
              </span>
              {facebookStatus === 'success' && <CheckCircle className="w-5 h-5" />}
              {facebookStatus === 'error' && <XCircle className="w-5 h-5" />}
            </motion.button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              هذا الصفحة لاختبار وظائف تسجيل الدخول الاجتماعي
            </p>
            <p className="text-gray-400 text-sm mt-2">
              تأكد من تكوين Google و Facebook في Supabase أولاً
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 