'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Search, User, Bell, ShoppingBag, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: '🏠' },
    { href: '/listings', label: 'القوائم', icon: '📋' },
    { href: '/nurseries', label: 'المشاتل', icon: '🌱' },
    { href: '/equipment-rental', label: 'كراء المعدات', icon: '🚜' },
    { href: '/land-rental', label: 'كراء الأراضي', icon: '🏞️' },
    { href: '/fresh-products', label: 'المنتجات الطازجة', icon: '🍅' },
    { href: '/services', label: 'الخدمات', icon: '�' },
    { href: '/about', label: 'من نحن', icon: 'ℹ️' },
    { href: '/contact', label: 'اتصل بنا', icon: '📞' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'glass-green-dark border-b border-green-300/30' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3 md:py-4">
          {/* Main Header Row */}
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text-accent group-hover:scale-105 transition-transform duration-300 animate-green-glow">
                🌾 الغلة
              </div>
            </Link>

            {/* Desktop Search - Keep original size for desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن المعدات والأراضي..."
                  className="w-full pr-12 pl-4 py-3 glass-green-dark text-white placeholder-white/70 
                           border border-green-300/40 rounded-full focus:border-green-300 
                           focus:outline-none focus:ring-2 focus:ring-green-300/30 
                           transition-all duration-300 hover-green-glow"
                />
                <button className="absolute left-2 top-1/2 -translate-y-1/2 p-2 
                                 btn-awesome rounded-full w-8 h-8 flex items-center justify-center animate-green-glow">
                  <Search size={16} />
                </button>
              </div>
            </div>

            {/* Desktop Navigation - Keep original beautiful design */}
            <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 space-x-reverse px-4 py-2 
                           text-white/90 hover:text-white transition-all duration-300 
                           hover:bg-green-400/10 rounded-full group hover-green-glow"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu & Mobile Toggle */}
            <div className="flex items-center space-x-2 space-x-reverse">
              {/* Desktop User Menu - Keep original design */}
              {user ? (
                <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
                  <button className="p-2 text-white/80 hover:text-white hover:bg-green-400/10 
                                   rounded-full transition-all duration-300 hover-green-glow">
                    <Bell size={20} />
                  </button>
                  <button className="p-2 text-white/80 hover:text-white hover:bg-green-400/10 
                                   rounded-full transition-all duration-300 hover-green-glow">
                    <ShoppingBag size={20} />
                  </button>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 space-x-reverse p-2 
                                     text-white/90 hover:text-white hover:bg-green-400/10 
                                     rounded-full transition-all duration-300 hover-green-glow">
                      <User size={20} />
                      <span className="font-medium">{user.email?.split('@')[0]}</span>
                    </button>
                    <div className="absolute left-0 top-full mt-2 w-48 glass-green-dark border 
                                  border-green-300/30 rounded-xl opacity-0 invisible 
                                  group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <Link href="/profile" className="block px-4 py-3 text-white hover:bg-green-400/10 
                                                     rounded-t-xl transition-colors">
                        الملف الشخصي
                      </Link>
                      <Link href="/my-listings" className="block px-4 py-3 text-white hover:bg-green-400/10 
                                                         transition-colors">
                        قوائمي
                      </Link>
                      <Link href="/settings" className="block px-4 py-3 text-white hover:bg-green-400/10 
                                                      transition-colors">
                        الإعدادات
                      </Link>
                      <button
                        onClick={signOut}
                        className="w-full text-right px-4 py-3 text-red-300 hover:bg-green-400/10 
                                 rounded-b-xl transition-colors"
                      >
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2 space-x-reverse">
                  <Link href="/auth/login" className="btn-outline px-4 py-2">
                    تسجيل الدخول
                  </Link>
                  <Link href="/auth/signup" className="btn-awesome px-4 py-2">
                    إنشاء حساب
                  </Link>
                </div>
              )}

              {/* Mobile Search Toggle */}
              <button className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-green-400/10 
                               rounded-full transition-all duration-300 hover-green-glow">
                <Search size={20} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-green-400/10 
                         rounded-full transition-all duration-300 hover-green-glow"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
               onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] glass-green-dark border-l 
                        border-green-300/30 transform transition-transform duration-300">
            <div className="p-6 pt-20">
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث..."
                    className="w-full pr-4 pl-12 py-3 glass-green text-white placeholder-white/70 
                             border border-green-300/40 rounded-full focus:border-green-300 
                             focus:outline-none transition-all duration-300 hover-green-glow"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2 mb-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 space-x-reverse p-4 
                             text-white hover:bg-green-400/10 rounded-xl transition-all duration-300 group hover-green-glow"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Mobile User Section */}
              {user ? (
                <div className="border-t border-green-300/30 pt-6 space-y-2">
                  <div className="flex items-center space-x-3 space-x-reverse p-4 glass-green rounded-xl">
                    <User size={24} className="text-green-300" />
                    <div>
                      <div className="text-white font-medium">{user.email?.split('@')[0]}</div>
                      <div className="text-white/60 text-sm">مرحباً بك</div>
                    </div>
                  </div>
                  
                  <Link href="/profile" className="flex items-center space-x-3 space-x-reverse p-4 
                                                 text-white hover:bg-green-400/10 rounded-xl transition-colors">
                    <Settings size={20} />
                    <span>الملف الشخصي</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 space-x-reverse p-4 
                             text-red-300 hover:bg-green-400/10 rounded-xl transition-colors"
                  >
                    <span>↩️</span>
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              ) : (
                <div className="border-t border-green-300/30 pt-6 space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full btn-outline text-center py-3 hover-green-glow"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full btn-awesome text-center py-3 animate-green-glow"
                  >
                    إنشاء حساب جديد
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
