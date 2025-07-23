'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { designSystem, utils, animations } from '@/lib/designSystem';
import { useLazyLoad, PerformanceMonitor } from '@/lib/performance';
import { 
  MapPin, 
  Leaf, 
  Wrench, 
  Truck, 
  Ship, 
  Satellite, 
  Users,
  Heart,
  Share2,
  CalendarCheck,
  Star,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface MarketplaceCard {
  id: string;
  title: string;
  description: string;
  link: string;
  image: string;
  emoji: string;
  color: string;
  stats: {
    count: string;
    label: string;
  };
  features: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

export default function MarketplacePage() {
  const { user } = useSupabaseAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    PerformanceMonitor.startTimer('marketplace-load');
  }, []);

  useEffect(() => {
    PerformanceMonitor.endTimer('marketplace-load');
  }, []);

  const marketplaceCards: MarketplaceCard[] = [
    {
      id: 'animals',
      title: 'الحيوانات',
      description: 'تصفح وشراء الحيوانات الزراعية من أبقار وأغنام ودواجن',
      link: '/animals',
      image: '/assets/sheep1.webp',
      emoji: '🐄',
      color: 'bg-orange-500',
      stats: { count: '500+', label: 'حيوان متاح' },
      features: ['صحي ومضمون', 'أوراق رسمية', 'توصيل مجاني'],
      isPopular: true
    },
    {
      id: 'vegetables',
      title: 'الخضروات والفواكه',
      description: 'منتجات طازجة مباشرة من المزرعة إلى طاولتك',
      link: '/VAR/marketplace',
      image: '/assets/tomato 2.jpg',
      emoji: '🍅',
      color: 'bg-red-500',
      stats: { count: '1000+', label: 'منتج طازج' },
      features: ['عضوي 100%', 'طازج يومياً', 'أسعار منافسة'],
      isNew: true
    },
    {
      id: 'equipment',
      title: 'المعدات الزراعية',
      description: 'جرارات وآلات ومعدات زراعية حديثة للبيع والإيجار',
      link: '/equipment',
      image: '/assets/machin01.jpg',
      emoji: '🚜',
      color: 'bg-blue-500',
      stats: { count: '200+', label: 'معدة متاحة' },
      features: ['مؤمن', 'صيانة دورية', 'تأجير مرن'],
      isPopular: true
    },
    {
      id: 'nurseries',
      title: 'المشاتل والشتلات',
      description: 'شتلات وبذور وأشجار جاهزة للزراعة',
      link: '/nurseries',
      image: '/assets/seedings01.jpg',
      emoji: '🌱',
      color: 'bg-green-500',
      stats: { count: '300+', label: 'نوع شتلة' },
      features: ['شتلات صحية', 'أصناف متنوعة', 'ضمان النمو']
    },
    {
      id: 'exports',
      title: 'خدمات التصدير',
      description: 'تصدير المنتجات الزراعية للخارج بأسعار منافسة',
      link: '/exports',
      image: '/assets/exporting1.jpg',
      emoji: '🚢',
      color: 'bg-purple-500',
      stats: { count: '50+', label: 'دولة مستوردة' },
      features: ['وثائق رسمية', 'شحن سريع', 'أسعار منافسة']
    },
    {
      id: 'land',
      title: 'الأراضي الزراعية',
      description: 'أراضي زراعية للبيع والإيجار في جميع أنحاء الجزائر',
      link: '/land',
      image: '/assets/land01.jpg',
      emoji: '🌾',
      color: 'bg-emerald-500',
      stats: { count: '150+', label: 'أرض متاحة' },
      features: ['ري متطور', 'تربة خصبة', 'طرق ممهدة'],
      isPopular: true
    }
  ];

  const { displayedItems, hasMore, loading, loadMore } = useLazyLoad(marketplaceCards, 6);

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-300 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-teal-400/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Icon Animation */}
          <div className="text-8xl mb-8 drop-shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
            🛒
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            سوق المزارعين
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            اكتشف كل ما تحتاجه للزراعة في مكان واحد - من الأراضي والمعدات إلى المنتجات والخدمات
          </p>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">🌾</div>
              <div className="text-2xl font-bold text-emerald-300 mb-1">2,200+</div>
              <div className="text-sm text-white/70">عنصر متاح</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-emerald-300 mb-1">10,000+</div>
              <div className="text-sm text-white/70">مزارع نشط</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-emerald-300 mb-1">4.8</div>
              <div className="text-sm text-white/70">تقييم المستخدمين</div>
            </div>
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-2">🚚</div>
              <div className="text-2xl font-bold text-emerald-300 mb-1">24/7</div>
              <div className="text-sm text-white/70">خدمة التوصيل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-300 mb-4">فئات السوق</h2>
            <p className="text-xl text-white/80">اختر ما تريد بيعه أو شراؤه</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((card, index) => (
              <Link
                key={card.id}
                href={card.link}
                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Image */}
                <div 
                  className="h-48 bg-cover bg-center relative"
                  style={{ backgroundImage: `url('${card.image}')` }}
                >
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-all duration-300"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {card.isPopular && (
                      <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        شعبي
                      </div>
                    )}
                    {card.isNew && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        جديد
                      </div>
                    )}
                  </div>
                  
                  {/* Emoji Icon */}
                  <div className="absolute top-4 left-4 text-4xl">{card.emoji}</div>
                  
                  {/* Stats */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-white">{card.stats.count}</div>
                      <div className="text-xs text-white/80">{card.stats.label}</div>
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-white/70 mb-4 line-clamp-2">{card.description}</p>
                  
                                     {/* Features */}
                   <div className="flex gap-2 flex-wrap mb-4">
                     {card.features.map((feature: string, idx: number) => (
                       <span key={idx} className="bg-emerald-600/20 text-emerald-200 px-2 py-1 rounded text-xs">
                         {feature}
                       </span>
                     ))}
                   </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center transition-colors">
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      استكشف
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                {loading ? 'جاري التحميل...' : 'عرض المزيد'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-emerald-300 mb-4">ابدأ بيع منتجاتك الآن</h2>
            <p className="text-white/80 mb-6 text-lg">
              انضم إلى آلاف المزارعين الذين يبيعون منتجاتهم على منصة الغلة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                إنشاء حساب مجاني
                <ArrowRight className="w-5 h-5 mr-2" />
              </Link>
              <Link
                href="/help"
                className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                تعلم المزيد
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
