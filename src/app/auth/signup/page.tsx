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
      <div className="text-center p-8">
        <h1 className="text-white text-2xl">Signup Page</h1>
        <p className="text-green-200">Working on fixing TypeScript errors...</p>
      </div>
    </div>
  )
} 