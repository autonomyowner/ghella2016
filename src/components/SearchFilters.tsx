'use client'

import React, { useState } from 'react'
import { useCategories } from '@/hooks/useData'

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    search?: string
    category?: string
    location?: string
    priceRange?: [number, number]
    condition?: string
    sortBy?: string
  }) => void
  type?: 'equipment' | 'land'
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onFiltersChange, type = 'equipment' }) => {
  const { categories } = useCategories()
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
    condition: '',
    sortBy: 'newest'
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Convert to the format expected by the parent
    const processedFilters: any = {
      search: newFilters.search || undefined,
      category: newFilters.category || undefined,
      location: newFilters.location || undefined,
      condition: newFilters.condition || undefined,
      sortBy: newFilters.sortBy
    }

    // Handle price range
    if (newFilters.priceMin || newFilters.priceMax) {
      processedFilters.priceRange = [
        newFilters.priceMin ? parseInt(newFilters.priceMin) : 0,
        newFilters.priceMax ? parseInt(newFilters.priceMax) : 999999999
      ]
    }

    onFiltersChange(processedFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      location: '',
      priceMin: '',
      priceMax: '',
      condition: '',
      sortBy: 'newest'
    }
    setFilters(clearedFilters)
    onFiltersChange({ sortBy: 'newest' })
  }

  const popularLocations = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
    'الأحساء', 'الطائف', 'بريدة', 'تبوك', 'خميس مشيط'
  ]

  const conditions = [
    { value: 'new', label: 'جديد' },
    { value: 'excellent', label: 'ممتاز' },
    { value: 'good', label: 'جيد' },
    { value: 'fair', label: 'مقبول' },
    { value: 'poor', label: 'يحتاج صيانة' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'price_low', label: 'السعر: من الأقل للأعلى' },
    { value: 'price_high', label: 'السعر: من الأعلى للأقل' },
    { value: 'featured', label: 'المميزة أولاً' }
  ]

  return (
    <div className="glass rounded-3xl p-6 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🔍</span>
          البحث والتصفية
        </h3>
        <button
          onClick={clearFilters}
          className="text-green-300 hover:text-green-400 font-medium transition-colors"
        >
          مسح الفلاتر
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Search Input */}
        <div className="col-span-full md:col-span-2">
          <label className="block text-green-300 font-medium mb-2">البحث</label>
          <input
            type="text"
            placeholder={`ابحث في ${type === 'equipment' ? 'المعدات' : 'الأراضي'}...`}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Category Filter - Only for equipment */}
        {type === 'equipment' && (
          <div>
            <label className="block text-green-300 font-medium mb-2">الفئة</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full p-3 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="">جميع الفئات</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name_ar}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Location Filter */}
        <div>
          <label className="block text-green-300 font-medium mb-2">الموقع</label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full p-3 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
          >
            <option value="">جميع المواقع</option>
            {popularLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-green-300 font-medium mb-2">السعر من</label>
          <input
            type="number"
            placeholder="0"
            value={filters.priceMin}
            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
            className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-green-300 font-medium mb-2">السعر إلى</label>
          <input
            type="number"
            placeholder="999999"
            value={filters.priceMax}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
            className="w-full p-3 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Condition Filter - Only for equipment */}
        {type === 'equipment' && (
          <div>
            <label className="block text-green-300 font-medium mb-2">الحالة</label>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="w-full p-3 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="">جميع الحالات</option>
              {conditions.map((condition) => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Options */}
        <div>
          <label className="block text-green-300 font-medium mb-2">ترتيب حسب</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full p-3 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="text-white font-medium mb-3">فلاتر سريعة</h4>
        <div className="flex flex-wrap gap-2">
          {type === 'equipment' ? (
            <>
              <button
                onClick={() => handleFilterChange('category', 'tractors')}
                className="px-4 py-2 glass-light text-green-800 rounded-xl hover-scale text-sm font-medium"
              >
                🚜 جرارات
              </button>
              <button
                onClick={() => handleFilterChange('category', 'harvesters')}
                className="px-4 py-2 glass-light text-green-800 rounded-xl hover-scale text-sm font-medium"
              >
                🌾 حصادات
              </button>
              <button
                onClick={() => handleFilterChange('condition', 'new')}
                className="px-4 py-2 glass-light text-green-800 rounded-xl hover-scale text-sm font-medium"
              >
                ✨ جديد
              </button>
              <button
                onClick={() => handleFilterChange('sortBy', 'featured')}
                className="px-4 py-2 glass-light text-green-800 rounded-xl hover-scale text-sm font-medium"
              >
                ⭐ مميز
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleFilterChange('sortBy', 'price_low')}
                className="px-4 py-2 glass-light text-green-800 rounded-xl hover-scale text-sm font-medium"
              >
                💰 الأرخص أولاً
              </button>
              <button
                onClick={() => handleFilterChange('sortBy', 'featured')}
                className="px-4 py-2 glass-light text-green-800 rounded-xl hover-scale text-sm font-medium"
              >
                ⭐ مميزة
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
