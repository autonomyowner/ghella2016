"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/hooks/useFirebase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface LaborListing {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  hourly_rate: number;
  daily_rate: number;
  currency: string;
  labor_type: 'harvesting' | 'planting' | 'irrigation' | 'maintenance' | 'specialized' | 'general' | 'other';
  experience_years: number | null;
  skills: string[];
  location: string;
  coordinates?: any;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
  availability: 'full_time' | 'part_time' | 'seasonal' | 'on_demand';
  languages: string[];
  certifications: string[];
  references: boolean;
  transportation: boolean;
  accommodation: boolean;
  contact_phone: string;
  contact_email: string;
  work_area_km: number;
  specializations: string[];
}

const LaborPage: React.FC = () => {
  const { getLabor, isOnline, isWithinLimits } = useFirebase();
  const [listings, setListings] = useState<LaborListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'rate_low' | 'rate_high' | 'experience' | 'oldest'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'harvesting' | 'planting' | 'irrigation' | 'maintenance' | 'specialized' | 'general' | 'other'>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'full_time' | 'part_time' | 'seasonal' | 'on_demand'>('all');
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useAuth();

  const ITEMS_PER_PAGE = 12;

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch function
  const fetchListings = useCallback(async (page = 1, reset = false) => {
    try {
      setError(null);
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      }

      // Use our hybrid hook to get labor data
      const filters = {
        labor_type: filterType === 'all' ? undefined : filterType,
        location: undefined,
        minRate: minRate ? parseFloat(minRate) : undefined,
        maxRate: maxRate ? parseFloat(maxRate) : undefined,
        availability: filterAvailability === 'all' ? undefined : filterAvailability
      };
      
      const data = await getLabor(filters);
      
      let laborData = data || [];
      
      console.log('Fetched labor data:', laborData);
      console.log('Number of laborers:', laborData.length);

      // Apply search filter after fetch
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        laborData = laborData.filter(labor =>
          (labor.title && labor.title.toLowerCase().includes(term)) ||
          (labor.description && labor.description.toLowerCase().includes(term)) ||
          (labor.location && labor.location.toLowerCase().includes(term)) ||
          (labor.skills && labor.skills.some(skill => skill.toLowerCase().includes(term))) ||
          (labor.specializations && labor.specializations.some(spec => spec.toLowerCase().includes(term)))
        );
      }

      // Apply all filters on client side
      laborData = laborData.filter(labor => {
        // Availability filter
        if (labor.is_available === false) return false;
        
        // Labor type filter
        if (filterType !== 'all' && labor.labor_type !== filterType) return false;
        
        // Availability filter
        if (filterAvailability !== 'all' && labor.availability !== filterAvailability) return false;
        
        // Rate filters
        if (minRate && labor.hourly_rate < parseFloat(minRate)) return false;
        if (maxRate && labor.hourly_rate > parseFloat(maxRate)) return false;
        
        return true;
      });

      // Apply sorting
      laborData.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'rate_low':
            return a.hourly_rate - b.hourly_rate;
          case 'rate_high':
            return b.hourly_rate - a.hourly_rate;
          case 'experience':
            return (b.experience_years || 0) - (a.experience_years || 0);
          default:
            return 0;
        }
      });

      if (page === 1 || reset) {
        setListings(laborData || []);
      } else {
        setListings(prev => [...prev, ...(laborData || [])]);
      }

      setHasMore((laborData?.length || 0) === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching labor listings:', err);
      setError('حدث خطأ في تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, filterType, filterAvailability, minRate, maxRate, getLabor]);

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchListings(1, true);
  }, [fetchListings]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListings(currentPage + 1);
    }
  };

  // Labor type labels in Arabic
  const getLaborTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      harvesting: 'حصاد',
      planting: 'زراعة',
      irrigation: 'ري',
      maintenance: 'صيانة',
      specialized: 'متخصص',
      general: 'عام',
      other: 'أخرى'
    };
    return labels[type] || type;
  };

  // Availability labels in Arabic
  const getAvailabilityLabel = (availability: string) => {
    const labels: { [key: string]: string } = {
      full_time: 'دوام كامل',
      part_time: 'دوام جزئي',
      seasonal: 'موسمي',
      on_demand: 'حسب الطلب'
    };
    return labels[availability] || availability;
  };

  const formatRate = (hourlyRate: number, dailyRate: number, currency: string) => {
    const hourlyFormatted = new Intl.NumberFormat('en-US').format(hourlyRate);
    const dailyFormatted = new Intl.NumberFormat('en-US').format(dailyRate);
    return `${hourlyFormatted} ${currency}/ساعة | ${dailyFormatted} ${currency}/يوم`;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinRate('');
    setMaxRate('');
    setFilterType('all');
    setFilterAvailability('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            {/* Animated Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-8xl mb-8 drop-shadow-2xl"
            >
              👨‍🌾
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              اليد العاملة الفلاحية الماهرة
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              ابحث عن عمال مهرة في المجال الزراعي (حصاد، ري، زراعة، صيانة) أو اعرض خدماتك كعامل محترف
            </motion.p>

            {/* Status Indicator */}
            {(!isOnline || !isWithinLimits) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm mb-8"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                {!isOnline ? 'وضع عدم الاتصال' : 'استخدام التخزين المحلي'}
              </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن عمال أو مهارات (حصاد، ري، زراعة، صيانة)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                />
                <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Filters and Controls */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                فلاتر
              </button>

              {/* View Toggle */}
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                    <path d="M3 9h18"></path>
                    <path d="M3 15h18"></path>
                    <path d="M9 3v18"></path>
                    <path d="M15 3v18"></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600' : 'hover:bg-white/10'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                    <path d="M3 12h.01"></path>
                    <path d="M3 18h.01"></path>
                    <path d="M3 6h.01"></path>
                    <path d="M8 12h13"></path>
                    <path d="M8 18h13"></path>
                    <path d="M8 6h13"></path>
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="rate_low">السعر: من الأقل</option>
                <option value="rate_high">السعر: من الأعلى</option>
                <option value="experience">الأكثر خبرة</option>
              </select>

              {/* Add Labor Button */}
              <Link
                href="/labor/new"
                className="flex items-center px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة خدمة
              </Link>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6 mb-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Labor Type Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">نوع العمل</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      >
                        <option value="all">جميع الأنواع</option>
                        <option value="harvesting">حصاد</option>
                        <option value="planting">زراعة</option>
                        <option value="irrigation">ري</option>
                        <option value="maintenance">صيانة</option>
                        <option value="specialized">متخصص</option>
                        <option value="general">عام</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    {/* Availability Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">التوفر</label>
                      <select
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
                      >
                        <option value="all">جميع الأنواع</option>
                        <option value="full_time">دوام كامل</option>
                        <option value="part_time">دوام جزئي</option>
                        <option value="seasonal">موسمي</option>
                        <option value="on_demand">حسب الطلب</option>
                      </select>
                    </div>

                    {/* Rate Range */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">السعر من</label>
                      <input
                        type="number"
                        placeholder="السعر الأدنى"
                        value={minRate}
                        onChange={(e) => setMinRate(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">السعر إلى</label>
                      <input
                        type="number"
                        placeholder="السعر الأعلى"
                        value={maxRate}
                        onChange={(e) => setMaxRate(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      مسح الفلاتر
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}
          
          {/* Labor Listings Grid */}
          {loading ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}`}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`bg-white rounded-lg shadow-lg p-6 animate-pulse ${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'w-32 h-24' : 'h-48'} bg-gray-200 rounded-lg ${viewMode === 'list' ? 'flex-shrink-0' : 'mb-4'}`}></div>
                  <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <>
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}`}>
                <AnimatePresence>
                  {listings.map((labor, index) => (
                    <motion.div
                      key={labor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                    >
                      {/* Labor Image */}
                      <div className={`${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center overflow-hidden`}>
                        {labor.images && labor.images.length > 0 && labor.images[0] ? (
                          <Image
                            src={labor.images[0]}
                            alt={labor.title}
                            width={viewMode === 'list' ? 128 : 400}
                            height={viewMode === 'list' ? 96 : 200}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to emoji if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`text-${viewMode === 'list' ? '2xl' : '6xl'} ${labor.images && labor.images.length > 0 && labor.images[0] ? 'hidden' : ''}`}>
                          👨‍🌾
                        </span>
                      </div>
                      
                      {/* Labor Details */}
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{labor.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{labor.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-blue-600">
                              {formatRate(labor.hourly_rate, labor.daily_rate, labor.currency)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {getLaborTypeLabel(labor.labor_type)}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-500 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {labor.location}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <span className="mr-2">التوفر:</span>
                              {getAvailabilityLabel(labor.availability)}
                            </div>
                            {labor.experience_years && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span className="mr-2">الخبرة:</span>
                                {labor.experience_years} سنوات
                              </div>
                            )}
                            {labor.skills && labor.skills.length > 0 && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span className="mr-2">المهارات:</span>
                                {labor.skills.slice(0, 2).join(', ')}
                                {labor.skills.length > 2 && '...'}
                              </div>
                            )}
                            {labor.specializations && labor.specializations.length > 0 && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span className="mr-2">التخصصات:</span>
                                {labor.specializations.slice(0, 2).join(', ')}
                                {labor.specializations.length > 2 && '...'}
                              </div>
                            )}
                            {labor.work_area_km && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span className="mr-2">منطقة العمل:</span>
                                {labor.work_area_km} كم
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/labor/${labor.id}`}
                            className={`flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 ${viewMode === 'list' ? 'mt-auto' : ''}`}
                          >
                            عرض التفاصيل
                          </Link>
                          {labor.contact_phone && (
                            <a
                              href={`tel:${labor.contact_phone}`}
                              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
                              title="اتصال مباشر"
                            >
                              📞
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-white"
                  >
                    تحميل المزيد
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👨‍🌾</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">لا توجد عمالة متاحة</h3>
              <p className="text-gray-600 mb-6">جرب تغيير الفلاتر أو إضافة خدمات جديدة</p>
              <Link
                href="/labor/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة خدمة
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LaborPage; 
