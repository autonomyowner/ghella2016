'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useWebsiteSettings } from '@/lib/websiteSettings';

// Lazy load heavy components
const VideoBackground = dynamic(() => import('@/components/VideoBackground'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black/60 animate-pulse" />
});

const SocialMediaIcons = dynamic(() => import('@/components/SocialMediaIcons'), {
  ssr: false,
  loading: () => <div className="w-12 h-12 bg-white/10 rounded-full animate-pulse" />
});

// Loading component
const LoadingSpinner = () => (
  <div className="h-screen w-full relative overflow-hidden bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-emerald-300 font-semibold">جاري التحميل...</p>
    </div>
  </div>
);

export default function HomePage() {
  const { user, signOut, profile } = useSupabaseAuth();
  const { settings, loading } = useWebsiteSettings();
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Prevent hydration mismatch by not rendering until hydrated
  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-black">
      {/* Optimized Video Background */}
      <Suspense fallback={<div className="absolute inset-0 bg-black/60 animate-pulse" />}>
        <VideoBackground />
      </Suspense>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* Top Banner */}
        {settings.announcement_enabled && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-3 px-4 text-center text-sm font-semibold relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              {settings.announcement_text} | 
              <Link href="/equipment/new" className="underline hover:no-underline ml-2 font-bold text-yellow-300 hover:text-yellow-200 transition-colors">
                أضف إعلانك الآن
              </Link>
            </motion.div>
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-teal-600/20 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        )}

        {/* Header with User Profile or Login/Signup */}
        <div className="flex justify-between items-center p-4 md:p-6">
          {/* User Profile (if logged in) or Login/Signup (if not logged in) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="flex items-center space-x-2 space-x-reverse md:space-x-4"
          >
            {loading ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg animate-pulse"></div>
                <span className="text-white text-sm">جاري التحميل...</span>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                {/* User Avatar */}
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                {/* User Info */}
                <div className="text-right">
                  <p className="text-white font-bold text-sm md:text-base">
                    {profile?.full_name || 'مرحباً بك'}
                  </p>
                  <p className="text-emerald-300 text-xs md:text-sm">
                    {user.email}
                  </p>
                </div>
                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm md:text-base"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 md:px-6 md:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm md:text-base"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 py-1.5 md:px-6 md:py-2 bg-transparent border-2 border-emerald-500 hover:bg-emerald-500 text-emerald-300 hover:text-white rounded-lg transition-all duration-300 font-semibold text-sm md:text-base"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </motion.div>

          {/* Logo and Name on Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center space-x-3 space-x-reverse md:space-x-4"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <i className="fas fa-seedling text-white text-xl md:text-2xl"></i>
            </div>
            <div className="text-right">
              <h1 className="text-lg md:text-2xl font-black text-white">{settings.site_title}</h1>
              <p className="text-xs md:text-sm text-emerald-300">{settings.site_description}</p>
            </div>
          </motion.div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center max-w-4xl"
          >
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 md:mb-6 leading-tight">
              {settings.homepage_title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-emerald-300 mb-6 md:mb-8 leading-relaxed px-4">
              {settings.homepage_subtitle}
            </p>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center items-center space-x-4 space-x-reverse md:space-x-8 px-4 md:px-6 pb-4 md:pb-8 relative z-20">
          {/* خدمات السوق */}
          <Link
            href="/marketplace"
            onClick={() => console.log('Marketplace clicked')}
            className="group flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl md:rounded-3xl hover:from-white/25 hover:to-white/15 transition-all duration-500 border-2 border-white/30 hover:border-emerald-400/60 shadow-2xl hover:shadow-emerald-500/20 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-emerald-500/30">
              <i className="fas fa-store text-white text-xl md:text-3xl group-hover:rotate-12 transition-transform duration-500"></i>
            </div>
            <div className="text-center">
              <span className="text-white font-black text-base md:text-xl block">خدمات السوق</span>
              <span className="text-emerald-300 text-xs md:text-sm opacity-80">تسويق وبيع المنتجات</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </Link>

          {/* Divider */}
          <div className="w-px h-16 md:h-24 bg-gradient-to-b from-white/40 via-white/20 to-transparent"></div>
          
          {/* خدمات التشغيل */}
          <Link
            href="/services"
            onClick={() => console.log('Services clicked')}
            className="group flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl md:rounded-3xl hover:from-white/25 hover:to-white/15 transition-all duration-500 border-2 border-white/30 hover:border-emerald-400/60 shadow-2xl hover:shadow-emerald-500/20 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-emerald-500/30">
              <i className="fas fa-cogs text-white text-xl md:text-3xl group-hover:rotate-12 transition-transform duration-500"></i>
            </div>
            <div className="text-center">
              <span className="text-white font-black text-base md:text-xl block">خدمات التشغيل</span>
              <span className="text-emerald-300 text-xs md:text-sm opacity-80">إدارة وتشغيل المزرعة</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </Link>

          {/* Divider */}
          <div className="w-px h-16 md:h-24 bg-gradient-to-b from-white/40 via-white/20 to-transparent"></div>

          {/* خدمات الدعم */}
          <Link
            href="/VAR"
            onClick={() => console.log('VAR clicked')}
            className="group flex flex-col items-center space-y-3 md:space-y-4 p-4 md:p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl md:rounded-3xl hover:from-white/25 hover:to-white/15 transition-all duration-500 border-2 border-white/30 hover:border-emerald-400/60 shadow-2xl hover:shadow-emerald-500/20 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-emerald-500/30">
              <i className="fas fa-hands-helping text-white text-xl md:text-3xl group-hover:rotate-12 transition-transform duration-500"></i>
            </div>
            <div className="text-center">
              <span className="text-white font-black text-base md:text-xl block">خدمات الدعم</span>
              <span className="text-emerald-300 text-xs md:text-sm opacity-80">استشارات ومساعدة</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </Link>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="px-4 md:px-6 pb-4 md:pb-6"
        >
          <div className="text-center">
            <div className="flex flex-wrap justify-center items-center space-x-4 space-x-reverse text-xs md:text-sm text-white/80 mb-2">
              <Link href="/terms" className="hover:text-emerald-300 transition-colors">
                شروط الاستخدام
              </Link>
              <span className="text-white/50">•</span>
              <Link href="/privacy" className="hover:text-emerald-300 transition-colors">
                سياسة الخصوصية
              </Link>
              <span className="text-white/50">•</span>
              <Link href="/help" className="hover:text-emerald-300 transition-colors">
                مركز المساعدة
              </Link>
            </div>
            <div className="text-xs md:text-sm text-white/60">
              حقوق النشر 2025 © {settings.site_title} جميع الحقوق محفوظة
            </div>
            <div className="text-xs text-white/50 mt-1">
              تم التصميم و التطوير بواسطة autonomy
            </div>
          </div>
        </motion.div>

        {/* Social Media Icons */}
        <Suspense fallback={<div className="w-12 h-12 bg-white/10 rounded-full animate-pulse" />}>
          <SocialMediaIcons settings={settings} />
        </Suspense>
      </div>
    </div>
  );
}
