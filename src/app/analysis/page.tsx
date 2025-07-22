"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/hooks/useFirebase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface AnalysisListing {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  service_type: 'soil_analysis' | 'crop_analysis' | 'satellite_imaging' | 'drone_survey' | 'climate_study' | 'water_analysis' | 'pest_analysis' | 'other';
  analysis_type: 'basic' | 'standard' | 'premium' | 'custom';
  turnaround_days: number;
  location: string;
  coordinates?: any;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
  equipment_used: string[];
  certifications: string[];
  sample_required: boolean;
  report_format: 'pdf' | 'digital' | 'printed' | 'all';
  consultation_included: boolean;
  follow_up_support: boolean;
}

const AnalysisPage: React.FC = () => {
  const { getAnalysis, isOnline, isWithinLimits } = useFirebase();
  const [listings, setListings] = useState<AnalysisListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'turnaround' | 'oldest'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'soil_analysis' | 'crop_analysis' | 'satellite_imaging' | 'drone_survey' | 'climate_study' | 'water_analysis' | 'pest_analysis' | 'other'>('all');
  const [filterAnalysis, setFilterAnalysis] = useState<'all' | 'basic' | 'standard' | 'premium' | 'custom'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
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

      // Use our hybrid hook to get analysis data
      const filters = {
        service_type: filterType === 'all' ? undefined : filterType,
        location: undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        analysis_type: filterAnalysis === 'all' ? undefined : filterAnalysis
      };
      
      const data = await getAnalysis(filters);
      
      let analysisData = data || [];
      
      console.log('Fetched analysis data:', analysisData);
      console.log('Number of analysis services:', analysisData.length);

      // Apply search filter after fetch
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        analysisData = analysisData.filter(analysis =>
          (analysis.title && analysis.title.toLowerCase().includes(term)) ||
          (analysis.description && analysis.description.toLowerCase().includes(term)) ||
          (analysis.location && analysis.location.toLowerCase().includes(term)) ||
          (analysis.equipment_used && analysis.equipment_used.some(equipment => equipment.toLowerCase().includes(term)))
        );
      }

      // Apply all filters on client side
      analysisData = analysisData.filter(analysis => {
        // Availability filter
        if (analysis.is_available === false) return false;
        
        // Service type filter
        if (filterType !== 'all' && analysis.service_type !== filterType) return false;
        
        // Analysis type filter
        if (filterAnalysis !== 'all' && analysis.analysis_type !== filterAnalysis) return false;
        
        // Price filters
        if (minPrice && analysis.price < parseFloat(minPrice)) return false;
        if (maxPrice && analysis.price > parseFloat(maxPrice)) return false;
        
        return true;
      });

      // Apply sorting
      analysisData.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'turnaround':
            return a.turnaround_days - b.turnaround_days;
          default:
            return 0;
        }
      });

      if (page === 1 || reset) {
        setListings(analysisData || []);
      } else {
        setListings(prev => [...prev, ...(analysisData || [])]);
      }

      setHasMore((analysisData?.length || 0) === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching analysis listings:', err);
      setError('حدث خطأ في تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, filterType, filterAnalysis, minPrice, maxPrice, getAnalysis]);

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchListings(1, true);
  }, [fetchListings]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListings(currentPage + 1);
    }
  };

  // Service type labels in Arabic
  const getServiceTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      soil_analysis: 'تحليل التربة',
      crop_analysis: 'تحليل المحاصيل',
      satellite_imaging: 'التصوير بالأقمار الصناعية',
      drone_survey: 'مسح بالطائرات بدون طيار',
      climate_study: 'دراسة المناخ',
      water_analysis: 'تحليل المياه',
      pest_analysis: 'تحليل الآفات',
      other: 'أخرى'
    };
    return labels[type] || type;
  };

  // Analysis type labels in Arabic
  const getAnalysisTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      basic: 'أساسي',
      standard: 'قياسي',
      premium: 'مميز',
      custom: 'مخصص'
    };
    return labels[type] || type;
  };

  const formatPrice = (price: number, currency: string) => {
    const formattedPrice = new Intl.NumberFormat('en-US').format(price);
    return `${formattedPrice} ${currency}`;
  };

  const resetFilters = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setFilterType('all');
    setFilterAnalysis('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white overflow-hidden">
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
              🛰️
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-purple-300 via-violet-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              خدمات التحليل والدراسات
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              خدمات تحليل متقدمة للتربة والمحاصيل باستخدام أحدث التقنيات والأقمار الصناعية
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
                  placeholder="ابحث عن خدمات التحليل والدراسات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
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
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
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
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
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
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600' : 'hover:bg-white/10'}`}
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
                className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="price_low">السعر: من الأقل</option>
                <option value="price_high">السعر: من الأعلى</option>
                <option value="turnaround">الأسرع تسليم</option>
              </select>

              {/* Add Analysis Button */}
              <Link
                href="/analysis/new"
                className="flex items-center px-6 py-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-white"
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
                    {/* Service Type Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">نوع الخدمة</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="all">جميع الأنواع</option>
                        <option value="soil_analysis">تحليل التربة</option>
                        <option value="crop_analysis">تحليل المحاصيل</option>
                        <option value="satellite_imaging">التصوير بالأقمار الصناعية</option>
                        <option value="drone_survey">مسح بالطائرات بدون طيار</option>
                        <option value="climate_study">دراسة المناخ</option>
                        <option value="water_analysis">تحليل المياه</option>
                        <option value="pest_analysis">تحليل الآفات</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    {/* Analysis Type Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">نوع التحليل</label>
                      <select
                        value={filterAnalysis}
                        onChange={(e) => setFilterAnalysis(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400"
                      >
                        <option value="all">جميع الأنواع</option>
                        <option value="basic">أساسي</option>
                        <option value="standard">قياسي</option>
                        <option value="premium">مميز</option>
                        <option value="custom">مخصص</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">السعر من</label>
                      <input
                        type="number"
                        placeholder="السعر الأدنى"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">السعر إلى</label>
                      <input
                        type="number"
                        placeholder="السعر الأعلى"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
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
          
          {/* Analysis Listings Grid */}
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
                  {listings.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                    >
                      {/* Analysis Image */}
                      <div className={`${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center overflow-hidden`}>
                        {analysis.images && analysis.images.length > 0 && analysis.images[0] ? (
                          <Image
                            src={analysis.images[0]}
                            alt={analysis.title}
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
                        <span className={`text-${viewMode === 'list' ? '2xl' : '6xl'} ${analysis.images && analysis.images.length > 0 && analysis.images[0] ? 'hidden' : ''}`}>
                          🛰️
                        </span>
                      </div>
                      
                      {/* Analysis Details */}
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{analysis.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{analysis.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-purple-600">
                              {formatPrice(analysis.price, analysis.currency)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {getServiceTypeLabel(analysis.service_type)}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-500 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {analysis.location}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <span className="mr-2">نوع التحليل:</span>
                              {getAnalysisTypeLabel(analysis.analysis_type)}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <span className="mr-2">مدة التسليم:</span>
                              {analysis.turnaround_days} يوم
                            </div>
                            {analysis.equipment_used && analysis.equipment_used.length > 0 && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span className="mr-2">المعدات:</span>
                                {analysis.equipment_used.slice(0, 2).join(', ')}
                                {analysis.equipment_used.length > 2 && '...'}
                              </div>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/analysis/${analysis.id}`}
                          className={`block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 ${viewMode === 'list' ? 'mt-auto' : ''}`}
                        >
                          عرض التفاصيل
                        </Link>
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
                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors text-white"
                  >
                    تحميل المزيد
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛰️</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">لا توجد خدمات تحليل متاحة</h3>
              <p className="text-gray-600 mb-6">جرب تغيير الفلاتر أو إضافة خدمات جديدة</p>
              <Link
                href="/analysis/new"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors text-white"
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

export default AnalysisPage; 
