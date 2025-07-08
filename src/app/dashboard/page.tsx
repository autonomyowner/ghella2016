'use client'

import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Equipment } from '@/types/database.types'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import EquipmentCard from '@/components/equipment/EquipmentCard'

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      fetchUserEquipment()
    }
  }, [user])

  const fetchUserEquipment = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="h-10 w-10 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">يجب تسجيل الدخول أولاً</h1>
        <Link
          href="/auth/login"
          className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md hover:from-green-500 hover:to-green-400 transition"
        >
          تسجيل الدخول
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Welcome Section */}
      <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              مرحباً {profile?.full_name || 'بك'}
            </h1>
            <p className="text-gray-400">
              {profile?.location && `📍 ${profile.location}`}
              {profile?.phone && ` • 📱 ${profile.phone}`}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Link
              href="/profile"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition"
            >
              إدارة الحساب
            </Link>
            <Link
              href="/equipment/new"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md transition"
            >
              إضافة معدات
            </Link>
            <Link
              href="/land/new"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md transition"
            >
              إضافة أراضي
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-black/30 border border-green-500/20 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{equipment.length}</div>
          <div className="text-gray-400">المعدات المعروضة</div>
        </div>
        <div className="bg-black/30 border border-green-500/20 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">0</div>
          <div className="text-gray-400">الأراضي المعروضة</div>
        </div>
        <div className="bg-black/30 border border-green-500/20 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {equipment.filter(eq => eq.is_available).length}
          </div>
          <div className="text-gray-400">الإعلانات النشطة</div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">المعدات المعروضة</h2>
          <Link
            href="/equipment/new"
            className="text-green-400 hover:text-green-300 transition flex items-center gap-2"
          >
            <span>إضافة معدات جديدة</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-black/30 border border-green-500/20 rounded-xl p-6 animate-pulse">
                <div className="aspect-video bg-gray-700 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : equipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
        ) : (
          <div className="bg-black/30 border border-green-500/20 rounded-xl p-12 text-center">
            <div className="text-6xl text-gray-600 mb-4">🚜</div>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد معدات معروضة</h3>
            <p className="text-gray-400 mb-6">ابدأ بإضافة أول معدة زراعية لك</p>
            <Link
              href="/equipment/new"
              className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md transition"
            >
              إضافة معدات جديدة
            </Link>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-black/30 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/equipment"
            className="flex items-center gap-3 p-4 bg-black/50 hover:bg-black/70 border border-green-500/20 rounded-lg transition"
          >
            <span className="text-2xl">🔍</span>
            <span className="text-white">تصفح المعدات</span>
          </Link>
          <Link
            href="/land"
            className="flex items-center gap-3 p-4 bg-black/50 hover:bg-black/70 border border-green-500/20 rounded-lg transition"
          >
            <span className="text-2xl">🌾</span>
            <span className="text-white">تصفح الأراضي</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 p-4 bg-black/50 hover:bg-black/70 border border-green-500/20 rounded-lg transition"
          >
            <span className="text-2xl">⚙️</span>
            <span className="text-white">إعدادات الحساب</span>
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-3 p-4 bg-black/50 hover:bg-black/70 border border-green-500/20 rounded-lg transition"
          >
            <span className="text-2xl">❓</span>
            <span className="text-white">المساعدة</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
