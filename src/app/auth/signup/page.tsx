'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, User, Phone, MapPin,
  Tractor, Shield, Users, Zap, CheckCircle, Star, UserCheck, 
  MessageCircle, Globe, Award, TrendingUp, Clock
} from 'lucide-react'

export default function SignupPage(): React.JSX.Element {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    location: '',
    userType: 'farmer' as 'farmer' | 'buyer' | 'both'
  })
  const { signUp, signInWithGoogle, signInWithFacebook } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('يرجى ملء جميع الحقول المطلوبة')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صحيح')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.password || !formData.confirmPassword) {
      setError('يرجى إدخال كلمة المرور وتأكيدها')
      return false
    }
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور غير متطابقة')
      return false
    }
    return true
  }

  const handleNextStep = () => {
    setError('')
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2)
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone,
        user_type: formData.userType
      })
      
      if (signUpError) {
        setError(signUpError.message)
        return
      }

      setMessage('تم إنشاء الحساب بنجاح! جاري تحويلك...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      console.error('Unexpected signup error:', err)
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      console.error('Unexpected Google signup error:', err)
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookSignup = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const { error } = await signInWithFacebook()
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      console.error('Unexpected Facebook signup error:', err)
      setError('حدث خطأ غير متوقع')
    } finally {
      setIsLoading(false)
    }
  }

  const userTypes = [
    {
      id: 'farmer',
      name: 'مزارع',
      description: 'أبيع المنتجات الزراعية والمعدات',
      icon: <Tractor className="w-8 h-8" />,
      color: 'green'
    },
    {
      id: 'buyer',
      name: 'مشتري',
      description: 'أشتري المنتجات والمعدات الزراعية',
      icon: <Users className="w-8 h-8" />,
      color: 'blue'
    },
    {
      id: 'both',
      name: 'مزارع وتاجر',
      description: 'أبيع وأشتري المنتجات والمعدات الزراعية',
      icon: <Award className="w-8 h-8" />,
      color: 'orange'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden" dir="rtl">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-2xl shadow-2xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <UserCheck className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
              <p className="text-gray-400">انضم إلى منصة الغيلة الزراعية</p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentStep >= step
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
              >
                {error}
              </motion.div>
            )}

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
              >
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <User className="w-4 h-4 inline ml-2" />
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="أدخل اسمك الكامل"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <Mail className="w-4 h-4 inline ml-2" />
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="example@email.com"
                      required
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <Phone className="w-4 h-4 inline ml-2" />
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="07xxxxxxxx"
                      required
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <MapPin className="w-4 h-4 inline ml-2" />
                      الموقع
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="المدينة، المحافظة"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Password */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <Lock className="w-4 h-4 inline ml-2" />
                      كلمة المرور *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-12"
                        placeholder="كلمة مرور قوية (6 أحرف على الأقل)"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      <Lock className="w-4 h-4 inline ml-2" />
                      تأكيد كلمة المرور *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-12"
                        placeholder="أعد إدخال كلمة المرور"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: User Type */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-4">
                      اختر نوع الحساب
                    </label>
                    <div className="grid gap-4">
                      {userTypes.map((type) => (
                        <label
                          key={type.id}
                          className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            formData.userType === type.id
                              ? `border-${type.color}-500 bg-${type.color}-500/10`
                              : 'border-gray-700 hover:border-gray-600 bg-black/30'
                          }`}
                        >
                          <input
                            type="radio"
                            name="userType"
                            value={type.id}
                            checked={formData.userType === type.id}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`flex-shrink-0 ml-4 text-${type.color}-500`}>
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-white">{type.name}</div>
                            <div className="text-sm text-gray-400">{type.description}</div>
                          </div>
                          {formData.userType === type.id && (
                            <CheckCircle className={`w-6 h-6 text-${type.color}-500`} />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col space-y-4">
                {currentStep < 3 ? (
                  <div className="flex space-x-4 space-x-reverse">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
                      >
                        <ArrowLeft className="w-5 h-5 ml-2" />
                        السابق
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
                    >
                      التالي
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4 space-x-reverse">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
                    >
                      <ArrowLeft className="w-5 h-5 ml-2" />
                      السابق
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></div>
                          جاري إنشاء الحساب...
                        </>
                      ) : (
                        <>
                          إنشاء الحساب
                          <UserCheck className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Social Login */}
            {currentStep === 1 && (
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-black/50 text-gray-400">أو استخدم</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full py-3 px-4 border border-gray-700 hover:border-gray-600 bg-white text-gray-900 rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
                  >
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={handleFacebookSignup}
                    disabled={isLoading}
                    className="w-full py-3 px-4 border border-gray-700 hover:border-gray-600 bg-[#1877F2] text-white rounded-lg transition-all duration-300 flex items-center justify-center font-medium"
                  >
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-8 text-center text-sm text-gray-400">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-green-400 hover:text-green-300 underline">
                تسجيل الدخول
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 