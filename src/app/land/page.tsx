'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { LandListing } from '@/types/database.types';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => <div /> });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false, loading: () => <button /> });;
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const LandListingsPage: React.FC = () => {
  const { getLand, isOnline, isWithinLimits } = useFirebase();
  const [listings, setListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'area_large' | 'area_small'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
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
      setCurrentPage(1); // Reset to first page when searching
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized fetch function
  const fetchListings = useCallback(async (page = 1, reset = false) => {
    try {
      setError(null);
      if (reset) {
        setLoading(true);
        setCurrentPage(1);
      }

      // Use our hybrid hook to get land data
      const filters = {
        listing_type: filterType === 'all' ? undefined : filterType,
        location: undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        minArea: minArea ? parseFloat(minArea) : undefined,
        maxArea: maxArea ? parseFloat(maxArea) : undefined
      };
      
      const data = await getLand(filters);
      console.log('Fetched land data:', data);
      
      // Apply search filter after fetch
      let landData = data;
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        landData = landData.filter(listing =>
          (listing.title && listing.title.toLowerCase().includes(term)) ||
          (listing.description && listing.description.toLowerCase().includes(term)) ||
          (listing.location && listing.location.toLowerCase().includes(term))
        );
      }

      // Apply additional filters
      landData = landData.filter(listing => {
        if (listing.is_available === false) return false;
        
        // Area filters
        if (minArea && listing.area_size < parseFloat(minArea)) return false;
        if (maxArea && listing.area_size > parseFloat(maxArea)) return false;
        
        return true;
      });

      // Apply sorting
      landData.sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'area_large':
            return b.area_size - a.area_size;
          case 'area_small':
            return a.area_size - b.area_size;
          default:
            return 0;
        }
      });

      if (reset) {
        setListings(landData || []);
      } else {
        setListings(prev => page === 1 ? (landData || []) : [...prev, ...(landData || [])]);
      }

      setHasMore((landData?.length || 0) === ITEMS_PER_PAGE);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Error fetching land listings:', error);
      setError('حدث خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [filterType, debouncedSearchTerm, minPrice, maxPrice, minArea, maxArea, sortBy, getLand]);

  // Initial load
  useEffect(() => {
    fetchListings(1, true);
  }, [fetchListings]);

  // Memoized filtered listings
  const filteredListings = useMemo(() => {
    return listings;
  }, [listings]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchListings(currentPage + 1, false);
    }
  }, [loading, hasMore, currentPage, fetchListings]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setMinArea('');
    setMaxArea('');
    setFilterType('all');
    setSortBy('newest');
  }, []);

  const formatPrice = (price: number, currency: string, listingType: 'sale' | 'rent') => {
    const formattedPrice = new Intl.NumberFormat('en-US').format(price);
    const suffix = listingType === 'rent' ? ' / سنة' : '';
    return `${formattedPrice} ${currency}${suffix}`;
  };

  const formatArea = (area: number, unit: 'hectare' | 'acre' | 'dunum') => {
    const unitNames = {
      hectare: 'هكتار',
      acre: 'فدان',
      dunum: 'دونم'
    };
    return `${area} ${unitNames[unit]}`;
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="flex justify-between">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-yellow-50 pt-20">
      {/* Premium Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-800 via-green-700 to-yellow-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Animated Background Elements */}
        <MotionDiv
          className="absolute top-0 left-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-yellow-600/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </MotionDiv>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            {/* Icon Animation */}
            <MotionDiv
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-8xl mb-8 drop-shadow-2xl"
            >
              🌾
            </MotionDiv>

            {/* Main Title */}
            <MotionDiv 
              className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-green-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              الأراضي الزراعية
            </MotionDiv>

            {/* Subtitle */}
            <MotionDiv 
              className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              اكتشف أفضل الأراضي الزراعية للبيع والإيجار في جميع أنحاء الجزائر
            </MotionDiv>

            {/* Status Indicator */}
            {(!isOnline || !isWithinLimits) && (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm mb-8"
              >
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                {!isOnline ? 'وضع عدم الاتصال' : 'استخدام التخزين المحلي'}
              </MotionDiv>
            )}

            {/* Search Bar */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن الأراضي الزراعية..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                />
                <svg className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </MotionDiv>
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
                className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors text-white"
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
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600' : 'hover:bg-white/10'}`}
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
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600' : 'hover:bg-white/10'}`}
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
                className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="newest">الأحدث</option>
                <option value="price_low">السعر: من الأقل</option>
                <option value="price_high">السعر: من الأعلى</option>
                <option value="area_large">المساحة: من الأكبر</option>
                <option value="area_small">المساحة: من الأصغر</option>
              </select>

              {/* Add Land Button */}
              <Link
                href="/land/new"
                className="flex items-center px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 rounded-lg font-semibold transition-all duration-300 hover:scale-105 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة أرض
              </Link>
            </div>

            {/* Advanced Filters */}
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">السعر من</label>
                  <input
                    type="number"
                    placeholder="السعر الأدنى"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">السعر إلى</label>
                  <input
                    type="number"
                    placeholder="السعر الأعلى"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Area Range */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">المساحة من</label>
                  <input
                    type="number"
                    placeholder="المساحة الأدنى"
                    value={minArea}
                    onChange={(e) => setMinArea(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white">المساحة إلى</label>
                  <input
                    type="number"
                    placeholder="المساحة الأعلى"
                    value={maxArea}
                    onChange={(e) => setMaxArea(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  مسح الفلاتر
                </button>
              </div>
            </MotionDiv>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {/* Land Listings Grid */}
          {loading ? (
            <LoadingSkeleton />
          ) : filteredListings.length > 0 ? (
            <>
              <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}`}>
                <AnimatePresence>
                  {filteredListings.map((listing, index) => (
                    <MotionDiv
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${viewMode === 'list' ? 'flex gap-4' : ''}`}
                    >
                      {/* Land Image */}
                      <div className={`${viewMode === 'list' ? 'w-32 h-24 flex-shrink-0' : 'h-48'} bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center overflow-hidden`}>
                        {listing.images && listing.images.length > 0 && listing.images[0] ? (
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
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
                        <span className={`text-${viewMode === 'list' ? '2xl' : '6xl'} ${listing.images && listing.images.length > 0 && listing.images[0] ? 'hidden' : ''}`}>
                          🌾
                        </span>
                      </div>

                      {/* Land Details */}
                      <div className={`p-6 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-emerald-600">
                              {formatPrice(listing.price, listing.currency, listing.listing_type)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {formatArea(listing.area_size, listing.area_unit)}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-500 text-sm mb-4">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {listing.location}
                          </div>
                        </div>

                        <Link
                          href={`/land/${listing.id}`}
                          className={`block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 ${viewMode === 'list' ? 'mt-auto' : ''}`}
                        >
                          عرض التفاصيل
                        </Link>
                      </div>
                    </MotionDiv>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors text-white"
                  >
                    تحميل المزيد
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🌾</div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">لا توجد أراضي متاحة</h3>
              <p className="text-gray-600 mb-6">جرب تغيير الفلاتر أو إضافة أراضي جديدة</p>
              <Link
                href="/land/new"
                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                إضافة أرض
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LandListingsPage;
