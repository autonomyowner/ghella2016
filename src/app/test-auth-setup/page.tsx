'use client'

import { useState } from 'react'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import { motion } from 'framer-motion'
import { 
  User, Mail, Lock, CheckCircle, XCircle, RefreshCw, 
  Database, Shield, AlertTriangle, Info, Plus, Trash2
} from 'lucide-react'

export default function TestAuthSetup() {
  const { signIn, signUp, signOut, user, profile } = useSupabaseAuth()
  const [testEmail, setTestEmail] = useState('test@elghella.com')
  const [testPassword, setTestPassword] = useState('testpassword123')
  const [testName, setTestName] = useState('Test User')
  const [testPhone, setTestPhone] = useState('0551234567')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState<any[]>([])
  const [showUsers, setShowUsers] = useState(false)

  const handleSignUp = async () => {
    setStatus('loading')
    setMessage('جاري إنشاء حساب تجريبي...')
    
    try {
      const { error } = await signUp(testEmail, testPassword, {
        full_name: testName,
        phone: testPhone,
        user_type: 'farmer'
      })
      
      if (error) {
        console.error('Signup error:', error)
        setStatus('error')
        setMessage(`خطأ في التسجيل: ${error.message}`)
      } else {
        setStatus('success')
        setMessage('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد.')
      }
    } catch (err) {
      console.error('Unexpected signup error:', err)
      setStatus('error')
      setMessage('حدث خطأ غير متوقع')
    }
  }

  const handleSignIn = async () => {
    setStatus('loading')
    setMessage('جاري تسجيل الدخول...')
    
    try {
      const { error } = await signIn(testEmail, testPassword)
      
      if (error) {
        console.error('Signin error:', error)
        setStatus('error')
        setMessage(`خطأ في تسجيل الدخول: ${error.message}`)
      } else {
        setStatus('success')
        setMessage('تم تسجيل الدخول بنجاح!')
      }
    } catch (err) {
      console.error('Unexpected signin error:', err)
      setStatus('error')
      setMessage('حدث خطأ غير متوقع')
    }
  }

  const handleSignOut = async () => {
    setStatus('loading')
    setMessage('جاري تسجيل الخروج...')
    
    try {
      await signOut()
      setStatus('success')
      setMessage('تم تسجيل الخروج بنجاح!')
    } catch (err) {
      console.error('Signout error:', err)
      setStatus('error')
      setMessage('حدث خطأ في تسجيل الخروج')
    }
  }

  const checkDatabaseConnection = async () => {
    setStatus('loading')
    setMessage('جاري فحص الاتصال بقاعدة البيانات...')
    
    try {
      // Test profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)
      
      if (profilesError) {
        setStatus('error')
        setMessage(`خطأ في جدول الملفات الشخصية: ${profilesError.message}`)
        return
      }

      // Test auth.users (if accessible)
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        setStatus('error')
        setMessage(`خطأ في المصادقة: ${authError.message}`)
        return
      }

      setStatus('success')
      setMessage(`الاتصال ناجح! الملفات الشخصية: ${profiles?.length || 0}, المستخدم الحالي: ${currentUser?.email || 'غير مسجل'}`)
    } catch (err) {
      console.error('Database check error:', err)
      setStatus('error')
      setMessage('حدث خطأ في فحص قاعدة البيانات')
    }
  }

  const fetchUsers = async () => {
    setStatus('loading')
    setMessage('جاري جلب المستخدمين...')
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)
      
      if (error) {
        setStatus('error')
        setMessage(`خطأ في جلب المستخدمين: ${error.message}`)
      } else {
        setUsers(data || [])
        setShowUsers(true)
        setStatus('success')
        setMessage(`تم جلب ${data?.length || 0} مستخدم`)
      }
    } catch (err) {
      console.error('Fetch users error:', err)
      setStatus('error')
      setMessage('حدث خطأ في جلب المستخدمين')
    }
  }

  const clearTestData = async () => {
    if (!confirm('هل أنت متأكد من حذف جميع البيانات التجريبية؟')) return
    
    setStatus('loading')
    setMessage('جاري حذف البيانات التجريبية...')
    
    try {
      // Delete test profiles
      const { error } = await supabase
        .from('profiles')
        .delete()
        .like('email', '%@example.com')
      
      if (error) {
        setStatus('error')
        setMessage(`خطأ في حذف البيانات: ${error.message}`)
      } else {
        setStatus('success')
        setMessage('تم حذف البيانات التجريبية بنجاح!')
        setUsers([])
        setShowUsers(false)
      }
    } catch (err) {
      console.error('Clear data error:', err)
      setStatus('error')
      setMessage('حدث خطأ في حذف البيانات')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            اختبار إعداد المصادقة
          </h1>

          {/* Current User Status */}
          {user && (
            <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-emerald-300 font-medium">
                    مسجل الدخول: {user.email}
                  </p>
                  {profile && (
                    <p className="text-emerald-300/70 text-sm">
                      الاسم: {profile.full_name || 'غير محدد'} | النوع: {profile.user_type}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border ${
              status === 'success' 
                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                : status === 'error'
                ? 'bg-red-500/20 border-red-500/30 text-red-300'
                : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
            }`}>
              <div className="flex items-center gap-2">
                {status === 'loading' && <RefreshCw className="w-4 h-4 animate-spin" />}
                {status === 'success' && <CheckCircle className="w-4 h-4" />}
                {status === 'error' && <XCircle className="w-4 h-4" />}
                <span>{message}</span>
              </div>
            </div>
          )}

          {/* Test User Form */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">بيانات المستخدم التجريبي</h3>
              
              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4" />
                  <input
                    type="email"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-emerald-400 focus:outline-none"
                    placeholder="test@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4" />
                  <input
                    type="password"
                    value={testPassword}
                    onChange={(e) => setTestPassword(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-emerald-400 focus:outline-none"
                    placeholder="كلمة مرور قوية"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4" />
                  <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-emerald-400 focus:outline-none"
                    placeholder="اسم المستخدم"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-emerald-300 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4" />
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className="w-full pr-10 pl-4 py-3 rounded-xl bg-black/50 text-white placeholder-white/70 border border-white/20 focus:border-emerald-400 focus:outline-none"
                    placeholder="0551234567"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">إجراءات الاختبار</h3>
              
              <motion.button
                onClick={handleSignUp}
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 text-white rounded-xl font-medium transition-all"
              >
                <Plus className="w-4 h-4" />
                إنشاء حساب تجريبي
              </motion.button>

              <motion.button
                onClick={handleSignIn}
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white rounded-xl font-medium transition-all"
              >
                <User className="w-4 h-4" />
                تسجيل الدخول
              </motion.button>

              {user && (
                <motion.button
                  onClick={handleSignOut}
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white rounded-xl font-medium transition-all"
                >
                  <User className="w-4 h-4" />
                  تسجيل الخروج
                </motion.button>
              )}

              <motion.button
                onClick={checkDatabaseConnection}
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-xl font-medium transition-all"
              >
                <Database className="w-4 h-4" />
                فحص الاتصال بقاعدة البيانات
              </motion.button>

              <motion.button
                onClick={fetchUsers}
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white rounded-xl font-medium transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                جلب المستخدمين
              </motion.button>

              <motion.button
                onClick={clearTestData}
                disabled={status === 'loading'}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white rounded-xl font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                حذف البيانات التجريبية
              </motion.button>
            </div>
          </div>

          {/* Users List */}
          {showUsers && users.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">المستخدمون المسجلون</h3>
              <div className="bg-black/30 rounded-xl p-4 max-h-96 overflow-y-auto">
                <div className="grid gap-3">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{user.full_name || 'غير محدد'}</p>
                        <p className="text-gray-300 text-sm">{user.id}</p>
                        <p className="text-gray-400 text-xs">{user.user_type} | {new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className={`w-4 h-4 ${user.is_verified ? 'text-emerald-400' : 'text-gray-400'}`} />
                        {user.is_verified && <span className="text-emerald-400 text-xs">مؤكد</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-500/20 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-300 font-medium mb-2">تعليمات الاستخدام:</h4>
                <ul className="text-blue-300/80 text-sm space-y-1">
                  <li>• استخدم "إنشاء حساب تجريبي" لإنشاء مستخدم جديد</li>
                  <li>• استخدم "تسجيل الدخول" للدخول بحساب موجود</li>
                  <li>• استخدم "فحص الاتصال" للتأكد من صحة الإعدادات</li>
                  <li>• استخدم "جلب المستخدمين" لرؤية جميع المستخدمين</li>
                  <li>• تأكد من تفعيل البريد الإلكتروني بعد التسجيل</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 