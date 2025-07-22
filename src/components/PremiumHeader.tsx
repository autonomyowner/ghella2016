'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  full_name: string | null;
  user_type: 'farmer' | 'buyer' | 'both' | 'admin';
}

interface WebsiteSettings {
  site_title: string;
  site_description: string;
  announcement_text: string;
  announcement_enabled: boolean;
}

interface PremiumHeaderProps {
  user: User | null;
  profile: Profile | null;
  settings: WebsiteSettings;
  loading: boolean;
  onSignOut: () => Promise<void>;
}

const PremiumHeader: React.FC<PremiumHeaderProps> = ({
  user,
  profile,
  settings,
  loading,
  onSignOut
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-emerald-500/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3 space-x-reverse md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <i className="fas fa-seedling text-white text-xl md:text-2xl"></i>
              </div>
              <div className="text-right">
                <h1 className="text-lg md:text-2xl font-black text-white">{settings.site_title}</h1>
                <p className="text-xs md:text-sm text-emerald-300 hidden md:block">{settings.site_description}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 space-x-reverse">
              <Link href="/marketplace" className="text-white hover:text-emerald-300 transition-colors font-medium">
                السوق
              </Link>
              <Link href="/services" className="text-white hover:text-emerald-300 transition-colors font-medium">
                الخدمات
              </Link>
              <Link href="/about" className="text-white hover:text-emerald-300 transition-colors font-medium">
                عن المنصة
              </Link>
              <Link href="/contact" className="text-white hover:text-emerald-300 transition-colors font-medium">
                اتصل بنا
              </Link>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3 space-x-reverse md:space-x-4">
              {loading ? (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg animate-pulse"></div>
                  <span className="text-white text-sm hidden md:block">جاري التحميل...</span>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3 space-x-reverse">
                  {/* User Avatar */}
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* User Info - Hidden on mobile */}
                  <div className="text-right hidden md:block">
                    <p className="text-white font-bold text-sm md:text-base">
                      {profile?.full_name || 'مرحباً بك'}
                    </p>
                    <p className="text-emerald-300 text-xs md:text-sm">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Sign Out Button */}
                  <button
                    onClick={onSignOut}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 font-semibold text-sm md:text-base"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3 space-x-reverse">
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
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-white hover:text-emerald-300 transition-colors"
              >
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-emerald-500/20">
            <nav className="px-4 py-6 space-y-4">
              <Link 
                href="/marketplace" 
                className="block text-white hover:text-emerald-300 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                السوق
              </Link>
              <Link 
                href="/services" 
                className="block text-white hover:text-emerald-300 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                الخدمات
              </Link>
              <Link 
                href="/about" 
                className="block text-white hover:text-emerald-300 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                عن المنصة
              </Link>
              <Link 
                href="/contact" 
                className="block text-white hover:text-emerald-300 transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                اتصل بنا
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default PremiumHeader; 