'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useWebsiteSettings } from '@/lib/websiteSettings';

// Premium components with lazy loading
const PremiumBackground = dynamic(() => import('@/components/PremiumBackground'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 animate-pulse" />
  )
});

const PremiumHeader = dynamic(() => import('@/components/PremiumHeader'), {
  ssr: false,
  loading: () => <div className="h-20 bg-black/20 backdrop-blur-lg animate-pulse" />
});

const MarketStats = dynamic(() => import('@/components/MarketStats'), {
  ssr: false,
  loading: () => null
});

const PremiumFeatures = dynamic(() => import('@/components/PremiumFeatures'), {
  ssr: false,
  loading: () => null
});

const TestimonialsSection = dynamic(() => import('@/components/TestimonialsSection'), {
  ssr: false,
  loading: () => null
});

const PremiumFooter = dynamic(() => import('@/components/PremiumFooter'), {
  ssr: false,
  loading: () => null
});

// Premium loading component
const PremiumLoadingSpinner = () => (
  <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-teal-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <p className="text-emerald-300 font-semibold text-lg">جاري تحميل منصة الغلة...</p>
      <p className="text-emerald-400 text-sm mt-2">أفضل منصة زراعية في الشرق الأوسط</p>
    </div>
  </div>
);

export default function HomePage() {
  const { user, signOut, profile } = useSupabaseAuth();
  const { settings, loading } = useWebsiteSettings();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  
  useEffect(() => {
    setIsHydrated(true);
    
    // Auto-scroll through sections for premium feel
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Prevent hydration mismatch
  if (!isHydrated) {
    return <PremiumLoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Premium Background */}
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900" />
      }>
        <PremiumBackground />
      </Suspense>

      {/* Premium Header */}
      <Suspense fallback={<div className="h-20 bg-black/20 backdrop-blur-lg animate-pulse" />}>
        <PremiumHeader 
          user={user} 
          profile={profile} 
          settings={settings} 
          loading={loading}
          onSignOut={handleSignOut}
        />
      </Suspense>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-7xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            منصة معتمدة من وزارة الزراعة
          </div>

          {/* Main Title with Premium Typography */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              {settings.homepage_title}
            </span>
          </h1>
          
          {/* Premium Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-emerald-200 mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto">
            {settings.homepage_subtitle}
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12">
            <Link
              href="/marketplace"
              className="group px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center"
            >
              <i className="fas fa-rocket mr-3 group-hover:rotate-12 transition-transform duration-300"></i>
              ابدأ الآن مجاناً
            </Link>
            
            <Link
              href="/demo"
              className="group px-8 py-4 md:px-12 md:py-5 bg-transparent border-2 border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <i className="fas fa-play mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              شاهد العرض التوضيحي
            </Link>
          </div>

          {/* Market Stats */}
          <Suspense fallback={null}>
            <MarketStats />
          </Suspense>
        </div>
      </section>

      {/* Premium Services Section */}
      <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              خدماتنا <span className="text-emerald-400">المتميزة</span>
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              نقدم مجموعة شاملة من الخدمات المتطورة لتحويل الزراعة التقليدية إلى زراعة ذكية ومستدامة
            </p>
          </div>

          {/* Premium Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Marketplace Service */}
            <Link
              href="/marketplace"
              className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-store text-white text-2xl group-hover:rotate-12 transition-transform duration-500"></i>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">سوق الغلة الذكي</h3>
                <p className="text-emerald-200 mb-6 leading-relaxed">
                  منصة تجارة إلكترونية متطورة تربط المزارعين بالمشترين مع ضمان الجودة والأمان
                </p>
                
                <div className="flex items-center text-emerald-400 font-semibold">
                  <span>اكتشف السوق</span>
                  <i className="fas fa-arrow-left mr-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>

            {/* Operations Service */}
            <Link
              href="/services"
              className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-cogs text-white text-2xl group-hover:rotate-12 transition-transform duration-500"></i>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">إدارة المزرعة الذكية</h3>
                <p className="text-emerald-200 mb-6 leading-relaxed">
                  حلول متكاملة لإدارة المزرعة باستخدام أحدث التقنيات والذكاء الاصطناعي
                </p>
                
                <div className="flex items-center text-emerald-400 font-semibold">
                  <span>ابدأ الإدارة</span>
                  <i className="fas fa-arrow-left mr-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>

            {/* Support Service */}
            <Link
              href="/VAR"
              className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-hands-helping text-white text-2xl group-hover:rotate-12 transition-transform duration-500"></i>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">الاستشارات المتخصصة</h3>
                <p className="text-emerald-200 mb-6 leading-relaxed">
                  فريق من الخبراء المتخصصين لتقديم الاستشارات الفنية والمالية للمزارعين
                </p>
                
                <div className="flex items-center text-emerald-400 font-semibold">
                  <span>احصل على استشارة</span>
                  <i className="fas fa-arrow-left mr-2 group-hover:translate-x-1 transition-transform duration-300"></i>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <Suspense fallback={null}>
        <PremiumFeatures />
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={null}>
        <TestimonialsSection />
      </Suspense>

      {/* Premium Footer */}
      <Suspense fallback={null}>
        <PremiumFooter settings={settings} />
      </Suspense>
    </div>
  );
}
