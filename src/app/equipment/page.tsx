'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Equipment } from '@/types/database.types'
import EquipmentCard from '@/components/equipment/EquipmentCard'
import Link from 'next/link'

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCondition, setSelectedCondition] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const supabase = createClient()

  useEffect(() => {
    fetchEquipment()
  }, [])

  const fetchEquipment = async () => {
    try {
      let query = supabase
        .from('equipment')
        .select('*')
        .eq('is_available', true)
        .order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      setEquipment(data || [])
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCondition = !selectedCondition || item.condition === selectedCondition
    
    const matchesPrice = (!priceRange.min || item.price >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || item.price <= parseFloat(priceRange.max))

    return matchesSearch && matchesCondition && matchesPrice
  })

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">المعدات الزراعية</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          تصفح أحدث المعدات الزراعية المتاحة للبيع من مزارعين موثوقين
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              البحث
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن المعدات، الماركة، الموديل..."
              className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              الحالة
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">جميع الحالات</option>
              <option value="new">جديد</option>
              <option value="excellent">ممتاز</option>
              <option value="good">جيد</option>
              <option value="fair">مقبول</option>
              <option value="poor">يحتاج صيانة</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              نطاق السعر (دينار)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                placeholder="من"
                className="w-full px-2 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                placeholder="إلى"
                className="w-full px-2 py-2 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Equipment Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-400">
          {loading ? 'جاري التحميل...' : `${filteredEquipment.length} معدة متاحة`}
        </div>
        <Link
          href="/equipment/new"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>إضافة معدات</span>
        </Link>
      </div>

      {/* Equipment Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-black/30 border border-green-500/20 rounded-xl p-6 animate-pulse">
              <div className="aspect-video bg-gray-700 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEquipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      ) : (
        <div className="bg-black/30 border border-green-500/20 rounded-xl p-12 text-center">
          <div className="text-6xl text-gray-600 mb-4">🔍</div>
          <h3 className="text-xl font-bold text-white mb-2">لا توجد معدات مطابقة</h3>
          <p className="text-gray-400 mb-6">جرب تعديل معايير البحث أو الفلترة</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCondition('')
                setPriceRange({ min: '', max: '' })
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
            >
              مسح الفلاتر
            </button>
            <Link
              href="/equipment/new"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md transition"
            >
              إضافة معدات جديدة
            </Link>
          </div>
        </div>
      )}

      {/* Load More Button (if needed for pagination) */}
      {filteredEquipment.length > 0 && filteredEquipment.length % 12 === 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-black/50 hover:bg-black/70 border border-green-500/30 text-white rounded-md transition">
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  )
}
