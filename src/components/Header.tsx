'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, profile, signOut, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 frosted-panel backdrop-blur-2xl ${isScrolled ? 'shadow-lg' : ''}`} style={{padding: '0.5rem 0', transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)'}}>
      <div className="container mx-auto flex items-center justify-between px-2 md:px-4" style={{minHeight: '48px', transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)'}}>
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold gradient-text-accent glow-green whitespace-nowrap transition-all duration-500 hover:scale-105">
          الغلة
        </Link>
        
        {/* Nav Links */}
        <nav className="flex items-center gap-2 md:gap-6 text-white/90 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-white transition-colors duration-300">الرئيسية</Link>
          <Link href="/equipment" className="hover:text-white transition-colors duration-300">المعدات</Link>
          <Link href="/land" className="hover:text-white transition-colors duration-300">الأراضي</Link>
          <Link href="/about" className="hover:text-white transition-colors duration-300">من نحن</Link>
        </nav>

        {/* Search Bar */}
        <div className="relative w-32 md:w-56">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ابحث..."
            className="w-full rounded-full px-3 py-1.5 bg-white/10 text-white placeholder-white/70 border-none focus:outline-none focus:ring-2 focus:ring-brand-primary/30 text-sm transition-all duration-500"
            style={{minWidth: '80px'}}
          />
          <button className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-brand-primary hover:bg-brand-primary/10 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.34-4.34"></path><circle cx="11" cy="11" r="8"></circle></svg>
          </button>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/20 animate-pulse"></div>
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm">
                  {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-white/90 text-sm">
                  {profile?.full_name || 'المستخدم'}
                </span>
                <svg className={`w-4 h-4 text-white/70 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 overflow-hidden">
                  <Link 
                    href="/dashboard" 
                    className="block px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      لوحة التحكم
                    </div>
                  </Link>
                  <Link 
                    href="/equipment/new" 
                    className="block px-4 py-3 text-white/90 hover:bg-white/10 transition-colors duration-300"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      إعلان جديد
                    </div>
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-right px-4 py-3 text-white/90 hover:bg-red-500/20 transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      تسجيل الخروج
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/auth/login" 
                className="px-4 py-2 text-white/90 hover:text-white transition-colors duration-300 text-sm"
              >
                تسجيل الدخول
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-full hover:shadow-lg transition-all duration-300 text-sm font-medium"
              >
                اشتراك
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
