'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { LandListing } from '@/types/database.types';
import { useAuth } from '@/contexts/AuthContext';
import ImageGallery from '@/components/ImageGallery';
import Link from 'next/link';

const LandDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [listing, setListing] = useState<LandListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('land_listings')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            avatar_url,
            phone,
            location,
            bio,
            created_at
          )
        `)
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetching land listing:', error);
        router.push('/land');
        return;
      }

      setListing(data);
    } catch (error) {
      console.error('Error fetching land listing:', error);
      router.push('/land');
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleContactClick = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    setShowContactInfo(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg-primary pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-white/20 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
                <div className="h-4 bg-white/20 rounded mb-2"></div>
              </div>
              <div>
                <div className="h-64 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen gradient-bg-primary pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">الأرض غير موجودة</h1>
            <Link href="/land" className="text-brand-primary hover:underline">
              العودة إلى قائمة الأراضي
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg-primary pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-white/70 mb-6">
          <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/land" className="hover:text-white transition-colors">الأراضي</Link>
          <span>/</span>
          <span className="text-white">{listing.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              <ImageGallery images={listing.images || []} />
            </div>

            {/* Title and Basic Info */}
            <div className="card-responsive glass mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{listing.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDate(listing.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-brand-primary mb-2">
                    {formatPrice(listing.price, listing.currency, listing.listing_type)}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    listing.listing_type === 'sale' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {listing.listing_type === 'sale' ? 'للبيع' : 'للإيجار'}
                  </span>
                </div>
              </div>
            </div>

            {/* Land Details */}
            <div className="card-responsive glass mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">تفاصيل الأرض</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-white/70 text-sm">المساحة</p>
                      <p className="text-white font-medium">{formatArea(listing.area_size, listing.area_unit)}</p>
                    </div>
                  </div>

                  {listing.soil_type && (
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                      </svg>
                      <div>
                        <p className="text-white/70 text-sm">نوع التربة</p>
                        <p className="text-white font-medium">{listing.soil_type}</p>
                      </div>
                    </div>
                  )}

                  {listing.water_source && (
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <div>
                        <p className="text-white/70 text-sm">مصدر المياه</p>
                        <p className="text-white font-medium">{listing.water_source}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <div>
                      <p className="text-white/70 text-sm">نوع الإعلان</p>
                      <p className="text-white font-medium">
                        {listing.listing_type === 'sale' ? 'للبيع' : 'للإيجار'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-white/70 text-sm">الحالة</p>
                      <p className="text-white font-medium">
                        {listing.status === 'active' ? 'متاح' : 'غير متاح'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-responsive glass mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">الوصف</h2>
              <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </div>
            </div>

            {/* Additional Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="card-responsive glass mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">المميزات الإضافية</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="card-responsive glass mb-6">
              <h3 className="text-xl font-bold text-white mb-4">معلومات البائع</h3>
              
              {listing.profiles && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold">
                      {listing.profiles.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{listing.profiles.full_name}</p>
                      <p className="text-white/70 text-sm">
                        عضو منذ {formatDate(listing.profiles.created_at)}
                      </p>
                    </div>
                  </div>

                  {listing.profiles.bio && (
                    <div>
                      <p className="text-white/90 text-sm">{listing.profiles.bio}</p>
                    </div>
                  )}

                  {listing.profiles.location && (
                    <div className="flex items-center gap-2 text-white/80">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{listing.profiles.location}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/20">
                    <button
                      onClick={handleContactClick}
                      className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      إظهار معلومات الاتصال
                    </button>

                    {showContactInfo && listing.profiles.phone && (
                      <div className="mt-4 p-3 bg-white/10 rounded-lg">
                        <p className="text-white/70 text-sm mb-1">رقم الهاتف:</p>
                        <p className="text-white font-medium">{listing.profiles.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card-responsive glass">
              <h3 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h3>
              
              <div className="space-y-3">
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  إضافة للمفضلة
                </button>

                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  مشاركة الإعلان
                </button>

                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  الإبلاغ عن مشكلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandDetailPage;
