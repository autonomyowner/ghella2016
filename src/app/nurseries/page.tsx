"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/hooks/useFirebase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface NurseryListing {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  plant_type: 'fruit_trees' | 'ornamental' | 'vegetables' | 'herbs' | 'forest' | 'other';
  plant_name: string | null;
  age_months: number | null;
  size: 'seedling' | 'small' | 'medium' | 'large' | 'mature';
  quantity: number;
  health_status: string | null;
  location: string;
  coordinates?: any;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
  pot_size: string | null;
  care_instructions: string | null;
  seasonality: 'spring' | 'summer' | 'autumn' | 'winter' | 'all_year';
}

const NurseriesPage: React.FC = () => {
  const { getNurseries, isOnline, isWithinLimits } = useFirebase();
  const [listings, setListings] = useState<NurseryListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'oldest'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'fruit_trees' | 'ornamental' | 'vegetables' | 'herbs' | 'forest' | 'other'>('all');
  const [filterSize, setFilterSize] = useState<'all' | 'seedling' | 'small' | 'medium' | 'large' | 'mature'>('all');
  const [filterSeason, setFilterSeason] = useState<'all' | 'spring' | 'summer' | 'autumn' | 'winter' | 'all_year'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { user } = useSupabaseAuth();

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

      // Use our hybrid hook to get nursery data
      const filters = {
        plant_type: filterType === 'all' ? undefined : filterType,
        location: undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        size: filterSize === 'all' ? undefined : filterSize,
        seasonality: filterSeason === 'all' ? undefined : filterSeason
      };
      
      const data = await getNurseries(filters);
      
      let nurseryData = data || [];
      
      console.log('Fetched nursery data:', nurseryData);
      console.log('Number of nurseries:', nurseryData.length);

      // Apply search filter after fetch
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        nurseryData = nurseryData.filter(nursery =>
          (nursery.title && nursery.title.toLowerCase().includes(term)) ||
          (nursery.description && nursery.description.toLowerCase().includes(term)) ||
          (nursery.location && nursery.location.toLowerCase().includes(term)) ||
          (nursery.plant_name && nursery.plant_name.toLowerCase().includes(term))
        );
      }

      // Apply all filters on client side
      nurseryData = nurseryData.filter(nursery => {
        // Availability filter
        if (nursery.is_available === false) return false;
        
        // Plant type filter
        if (filterType !== 'all' && nursery.plant_type !== filterType) return false;
        
        // Size filter
        if (filterSize !== 'all' && nursery.size !== filterSize) return false;
        
        // Season filter
        if (filterSeason !== 'all' && nursery.seasonality !== filterSeason) return false;
        
        // Price filters
        if (minPrice && nursery.price < parseFloat(minPrice)) return false;
        if (maxPrice && nursery.price > parseFloat(maxPrice)) return false;
        
        return true;
      });

      // Apply sorting
      nurseryData.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          default:
            return 0;
        }
      });

      if (page === 1 || reset) {
        setListings(nurseryData || []);
      } else {
        setListings(prev => [...prev, ...(nurseryData || [])]);
      }

      setHasMore((nurseryData?.length || 0) === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (err) {
      console.error('Error fetching nursery listings:', err);
      setError('حدث خطأ في تحميل الإعلانات');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, sortBy, filterType, filterSize, filterSeason, minPrice, maxPrice, getNurseries]);

  // Initial fetch and refetch on dependencies change
  useEffect(() => {
    fetchListings(1, true);
  }, [fetchListings]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchListings(currentPage + 1);
    }
  };

  // Plant type labels in Arabic
  const getPlantTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      fruit_trees: 'أشجار مثمرة',
      ornamental: 'نباتات زينة',
      vegetables: 'خضروات',
      herbs: 'أعشاب',
      forest: 'أشجار حرجية',
      other: 'أخرى'
    };
    return labels[type] || type;
  };

  // Size labels in Arabic
  const getSizeLabel = (size: string) => {
    const labels: { [key: string]: string } = {
      seedling: 'بذرة',
      small: 'صغير',
      medium: 'متوسط',
      large: 'كبير',
      mature: 'ناضج'
    };
    return labels[size] || size;
  };

  // Season labels in Arabic
  const getSeasonLabel = (season: string) => {
    const labels: { [key: string]: string } = {
      spring: 'الربيع',
      summer: 'الصيف',
      autumn: 'الخريف',
      winter: 'الشتاء',
      all_year: 'طوال السنة'
    };
    return labels[season] || season;
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
    setFilterSize('all');
    setFilterSeason('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
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
              🌱
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-green-300 via-emerald-300 to-teal-400 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              المشاتل والشتلات
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              اكتشف أفضل الشتلات والنباتات من مشاتل معتمدة في جميع أنحاء الجزائر
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
                  placeholder="ابحث عن الشتلات والنباتات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/50 transition-all duration-300"
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
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
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
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-600' : 'hover:bg-white/10'}`}
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
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-600' : 'hover:bg-white/10'}`}
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
                className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="price_low">السعر: من الأقل</option>
                <option value="price_high">السعر: من الأعلى</option>
              </select>

              {/* Add Nursery Button */}
              <Link
                href="/nurseries/new"
                className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة شتلات
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
                    {/* Plant Type Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">نوع النبات</label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="all">جميع الأنواع</option>
                        <option value="fruit_trees">أشجار مثمرة</option>
                        <option value="ornamental">نباتات زينة</option>
                        <option value="vegetables">خضروات</option>
                        <option value="herbs">أعشاب</option>
                        <option value="forest">أشجار حرجية</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    {/* Size Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">الحجم</label>
                      <select
                        value={filterSize}
                        onChange={(e) => setFilterSize(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                      >
                        <option value="all">جميع الأحجام</option>
                        <option value="seedling">بذرة</option>
                        <option value="small">صغير</option>
                        <option value="medium">متوسط</option>
                        <option value="large">كبير</option>
                        <option value="mature">ناضج</option>
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
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">السعر إلى</label>
                      <input
                        type="number"
                        placeholder="السعر الأعلى"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-green-400"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-green-400 hover:text-green-300 transition-colors"
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
          
          {/* Nursery Listings Grid */}
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
                  {listings.map((nursery, index) => (
                    <motion.div
                      key={nursery.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                    >
                      {/* Nursery Image */}
                      <div className={`${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center overflow-hidden`}>
                        {nursery.images && nursery.images.length > 0 && nursery.images[0] ? (
                          <Image
                            src={nursery.images[0]}
                            alt={nursery.title}
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
                        <span className={`text-${viewMode === 'list' ? '2xl' : '6xl'} ${nursery.images && nursery.images.length > 0 && nursery.images[0] ? 'hidden' : ''}`}>
                          🌱
                        </span>
                      </div>
                      
                      {/* Nursery Details */}
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{nursery.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{nursery.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(nursery.price, nursery.currency)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {getPlantTypeLabel(nursery.plant_type)}
                            </span>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-500 text-sm">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {nursery.location}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <span className="mr-2">الحجم:</span>
                              {getSizeLabel(nursery.size)}
                            </div>
                            {nursery.plant_name && (
                              <div className="flex items-center text-gray-500 text-sm">
                                <span className="mr-2">اسم النبات:</span>
                                {nursery.plant_name}
                              </div>
                            )}
                          </div>
                        </div>

                        <Link
                          href={`/nurseries/${nursery.id}`}
                          className={`block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 ${viewMode === 'list' ? 'mt-auto' : ''}`}
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
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors text-white"
                  >
                    تحميل المزيد
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">لا توجد شتلات متاحة</h3>
              <p className="text-gray-600 mb-6">جرب تغيير الفلاتر أو إضافة شتلات جديدة</p>
              <Link
                href="/nurseries/new"
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة شتلات
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NurseriesPage; 
