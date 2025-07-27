'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { ProfileInsert } from '@/types/database.types'
import { 
  Eye, EyeOff, Mail, Lock, ArrowRight, ArrowLeft, User, Phone, MapPin,
  Tractor, Shield, Users, Zap, CheckCircle, Star, UserCheck, 
  MessageCircle, Globe, Award, TrendingUp, Clock
} from 'lucide-react'

// Floating Particles Component
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 overflow-hidden" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-400/30 rounded-full"
          initial={{ 
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{
            y: [null, -150, -300],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

export default function SignupPage() {
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

  const { updateProfile } = useSupabaseAuth();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const { error } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          phone: formData.phone,
        }
      );
      if (error) {
        setError(error.message);
      } else {
        // Update additional profile fields after signup
        await updateProfile({
          location: formData.location,
          user_type: formData.userType,
        });
        setMessage('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    setError('')

    try {
      const { error } = await signInWithGoogle()
      
      if (error) {
        console.error('Google signup error:', error)
        setError(error.message || 'حدث خطأ أثناء التسجيل بـ Google')
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
        console.error('Facebook signup error:', error)
        setError(error.message || 'حدث خطأ أثناء التسجيل بـ Facebook')
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

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "حماية كاملة",
      description: "بياناتك آمنة معنا"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "استجابة سريعة",
      description: "دعم فوري ومتابعة"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "نمو مضمون",
      description: "زيادة أرباحك ومبيعاتك"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "متاح 24/7",
      description: "خدمة على مدار الساعة"
    }
  ]

  const stats = [
    { number: "10,000+", label: "مزارع مسجل" },
    { number: "50,000+", label: "معدة متاحة" },
    { number: "48", label: "ولاية مغطاة" },
    { number: "95%", label: "رضا العملاء" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] relative overflow-hidden" dir="rtl">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(29,231,130,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      
      {/* Floating Particles */}
      <FloatingParticles />

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-green-400 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Link>
          <div className="flex items-center gap-2">
            <Tractor className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold text-white">الغلة</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[calc(100vh-200px)]">
          
          {/* Left Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-white mb-4"
              >
                انضم إلى الغلة
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl text-green-200"
              >
                أنشئ حسابك وابدأ رحلتك الزراعية
              </motion.p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    currentStep >= step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {currentStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-0.5 mx-2 transition-all ${
                      currentStep > step ? 'bg-green-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Success Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-200 text-center"
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                {message}
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Signup Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-8 rounded-2xl border border-green-500/30"
            >
              <form onSubmit={handleSignup} className="space-y-6">
                
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">المعلومات الأساسية</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        الاسم الكامل *
                      </label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        رقم الهاتف *
                      </label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="07xxxxxxxx"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        الموقع
                      </label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          placeholder="المدينة، الولاية"
                          className="w-full pr-12 pl-4 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleNextStep}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg transition-all flex items-center justify-center gap-2"
                    >
                      التالي
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Password */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">كلمة المرور</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        كلمة المرور *
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="كلمة مرور قوية"
                          className="w-full pr-12 pl-12 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-green-400 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">
                        تأكيد كلمة المرور *
                      </label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="أعد كتابة كلمة المرور"
                          className="w-full pr-12 pl-12 py-4 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-green-400 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-white/20 text-white rounded-xl hover:bg-white/30 font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        السابق
                      </motion.button>
                      <motion.button
                        type="button"
                        onClick={handleNextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        التالي
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: User Type */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">نوع الحساب</h3>
                    
                    <div className="space-y-3">
                      {userTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, userType: type.id as any }))}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-right ${
                            formData.userType === type.id
                              ? 'border-green-400 bg-green-500/20'
                              : 'border-white/20 bg-black/30 hover:border-green-400/50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${
                              formData.userType === type.id ? 'bg-green-500' : 'bg-white/20'
                            }`}>
                              {type.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{type.name}</h4>
                              <p className="text-white/70 text-sm">{type.description}</p>
                            </div>
                            {formData.userType === type.id && (
                              <CheckCircle className="w-6 h-6 text-green-400" />
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <motion.button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-white/20 text-white rounded-xl hover:bg-white/30 font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-5 h-5" />
                        السابق
                      </motion.button>
                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            جاري إنشاء الحساب...
                          </>
                        ) : (
                          <>
                            إنشاء الحساب
                            <UserCheck className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </form>

              {/* Social Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6"
              >
                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-transparent text-gray-400">أو</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-sm">Google</span>
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleFacebookSignup}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Facebook</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-8 glass p-6 rounded-2xl border border-green-500/30"
            >
              <p className="text-white/80 mb-4">
                لديك حساب بالفعل؟
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-green-100 border border-white/30 rounded-xl hover:bg-white/30 font-medium transition-all"
              >
                تسجيل الدخول
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side - Benefits & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block space-y-8"
          >
            {/* Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                مزايا الانضمام لنا
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass p-6 rounded-xl border border-green-500/30 text-center hover:border-green-400/50 transition-all"
                  >
                    <div className="text-green-400 mb-4 flex justify-center">
                      {benefit.icon}
                    </div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-white/70 text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>



            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass p-6 rounded-xl border border-green-500/30"
            >
              <h3 className="text-white font-semibold mb-4 text-center">تواصل معنا</h3>
              
              {/* Phone Numbers */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <Phone className="w-4 h-4" />
                  <a href="tel:0558981686" className="text-sm hover:text-green-400 transition-colors" dir="ltr">
                    05 58981686
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <Phone className="w-4 h-4" />
                  <a href="tel:0798700447" className="text-sm hover:text-green-400 transition-colors" dir="ltr">
                    07 98700447
                  </a>
                </div>
                <div className="flex items-center justify-center gap-2 text-green-300">
                  <Phone className="w-4 h-4" />
                  <a href="tel:0660378697" className="text-sm hover:text-green-400 transition-colors" dir="ltr">
                    06 60378697
                  </a>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex justify-center gap-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=61578467404013" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="تابعنا على Facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/el_ghella_/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="تابعنا على Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.tiktok.com/@elghella10" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-black hover:bg-gray-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                  title="تابعنا على TikTok"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
