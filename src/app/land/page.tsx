'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LandListing } from '@/types/database.types';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const LandListingsPage: React.FC = () => {
  const [listings, setListings] = useState<LandListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'area_large' | 'area_small'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'sale' | 'rent'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minArea, setMinArea] = useState('');
  const [maxArea, setMaxArea] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, [sortBy, filterType]);

  const fetchListings = async () => {
    try {
      let query = supabase
        .from('land_listings')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            phone,
            location
          )
        `)
        .eq('status', 'active');

      // Apply filters
      if (filterType !== 'all') {
        query = query.eq('listing_type', filterType);
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price_low':
          query = query.order('price', { ascending: true });
          break;
        case 'price_high':
          query = query.order('price', { ascending: false });
          break;
        case 'area_large':
          query = query.order('area_size', { ascending: false });
          break;
        case 'area_small':
          query = query.order('area_size', { ascending: true });
          break;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching land listings:', error);
        return;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Error fetching land listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = (!minPrice || listing.price >= parseInt(minPrice)) &&
                        (!maxPrice || listing.price <= parseInt(maxPrice));

    const matchesArea = (!minArea || listing.area_size >= parseInt(minArea)) &&
                       (!maxArea || listing.area_size <= parseInt(maxArea));

    return matchesSearch && matchesPrice && matchesArea;
  });

  const formatPrice = (price: number, currency: string, listingType: 'sale' | 'rent') => {
    const formattedPrice = new Intl.NumberFormat('ar-SA').format(price);
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

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg-primary pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-responsive glass animate-pulse">
                <div className="h-48 bg-white/20 rounded-lg mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg-primary pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            الأراضي الزراعية
          </h1>
          <p className="text-xl text-green-200 mb-6">
            اكتشف أفضل الأراضي الزراعية للبيع والإيجار
          </p>
          {user && (
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              إضافة أرض جديدة
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="card-responsive glass mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="البحث في الأراضي..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" />
              </svg>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            >
              <option value="newest">الأحدث</option>
              <option value="price_low">السعر: من الأقل للأعلى</option>
              <option value="price_high">السعر: من الأعلى للأقل</option>
              <option value="area_large">المساحة: الأكبر أولاً</option>
              <option value="area_small">المساحة: الأصغر أولاً</option>
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            >
              <option value="all">جميع الأنواع</option>
              <option value="sale">للبيع</option>
              <option value="rent">للإيجار</option>
            </select>

            {/* Price Range */}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="أقل سعر"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
              <input
                type="number"
                placeholder="أعلى سعر"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>
          </div>

          {/* Area Range */}
          <div className="flex gap-2 mt-4">
            <input
              type="number"
              placeholder="أقل مساحة"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
            <input
              type="number"
              placeholder="أعلى مساحة"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              className="flex-1 px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-white/80 mb-6">
          <p>عدد النتائج: {filteredListings.length} أرض</p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Link
                key={listing.id}
                href={`/land/${listing.id}`}
                className="card-responsive glass hover:scale-105 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Listing Type Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      listing.listing_type === 'sale' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {listing.listing_type === 'sale' ? 'للبيع' : 'للإيجار'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                    {listing.title}
                  </h3>
                  
                  <p className="text-white/80 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{listing.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{formatArea(listing.area_size, listing.area_unit)}</span>
                    </div>

                    {listing.soil_type && (
                      <div className="flex items-center gap-2 text-white/90">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                        <span className="text-sm">{listing.soil_type}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-brand-primary">
                      {formatPrice(listing.price, listing.currency, listing.listing_type)}
                    </div>
                    
                    {listing.profiles && (
                      <div className="flex items-center gap-2 text-white/70">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold">
                          {listing.profiles.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm">{listing.profiles.full_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-24 h-24 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2">لا توجد أراضي متوفرة</h3>
            <p className="text-white/70 mb-4">جرب تعديل معايير البحث أو المرشحات</p>
            {user && (
              <Link
                href="/listings/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                كن أول من يضيف أرض
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandListingsPage;
