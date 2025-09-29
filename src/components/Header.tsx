
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import LogoutConfirmation from './LogoutConfirmation';
import UnifiedSearch from './UnifiedSearch';
import { 
  Leaf, 
  Menu, 
  X, 
  User, 
  LogOut,
  Plus,
  MapPin,
  Wrench,
  ShoppingCart,
  Settings,
  ChevronDown,
  LayoutDashboard,
  Store
} from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { user, profile, signOut, loading } = useSupabaseAuth();
  const [loadingGracePassed, setLoadingGracePassed] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Grace period: if auth loading persists > 2s (stale cache), show guest buttons
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoadingGracePassed(true), 2000);
    return () => clearTimeout(t);
  }, [loading]);

  const handleSignOut = async () => {
    setLogoutLoading(true);
    try {
      await signOut();
      setShowMobileMenu(false);
      setShowUserDropdown(false);
      setShowLogoutConfirmation(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
    }
  };

  const openLogoutConfirmation = () => {
    setShowLogoutConfirmation(true);
    setShowUserDropdown(false);
  };

  const navigationItems = [
    { href: "/", label: "الرئيسية", icon: LayoutDashboard },
    { href: "/services", label: "الخدمات", icon: Wrench },
    { href: "/VAR", label: "البيانات الفضائية", icon: User },
    { href: "/about", label: "من نحن", icon: Leaf }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-white/20' 
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 space-x-reverse">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110">
              <img src="/assets/logo o.jpg" alt="الغلة" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-green-800' : 'text-white drop-shadow-lg'
              }`}>الغلة</h1>
              <p className={`text-sm transition-colors duration-300 ${
                isScrolled ? 'text-green-600' : 'text-white/90 drop-shadow-md'
              }`}>منصة المزارعين</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-12 space-x-reverse">
            <Link href="/" className={`font-medium transition-colors duration-300 hover:scale-105 ${
              isScrolled ? 'text-green-700 hover:text-green-800' : 'text-white/90 hover:text-white drop-shadow-md'
            }`}>
              الرئيسية
            </Link>
            <Link href="/services" className={`font-medium transition-colors duration-300 hover:scale-105 ${
              isScrolled ? 'text-green-700 hover:text-green-800' : 'text-white/90 hover:text-white drop-shadow-md'
            }`}>
              الخدمات
            </Link>
            <Link href="/VAR" className={`font-medium transition-colors duration-300 hover:scale-105 ${
              isScrolled ? 'text-green-700 hover:text-green-800' : 'text-white/90 hover:text-white drop-shadow-md'
            }`}>
              البيانات الفضائية
            </Link>
            <Link href="/about" className={`font-medium transition-colors duration-300 hover:scale-105 mr-8 ${
              isScrolled ? 'text-green-700 hover:text-green-800' : 'text-white/90 hover:text-white drop-shadow-md'
            }`}>
              من نحن
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex">
            <UnifiedSearch variant="header" />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {loading && !loadingGracePassed ? (
              <div className={`w-4 h-4 border border-t-transparent rounded-full animate-spin transition-colors duration-300 opacity-50 ${
                isScrolled ? 'border-green-500' : 'border-white'
              }`}></div>
            ) : user ? (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link 
                  href="/marketplace"
                  className={`p-3 rounded-lg font-medium flex items-center transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                  }`}
                >
                  <Store className="w-5 h-5" />
                </Link>
                
                {/* User Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`px-4 py-2 font-medium flex items-center transition-colors duration-300 hover:scale-105 ${
                      isScrolled 
                        ? 'text-green-700 hover:text-green-800' 
                        : 'text-white/90 hover:text-white drop-shadow-md'
                    }`}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {profile?.full_name || 'حسابي'}
                    <ChevronDown className={`w-4 h-4 mr-2 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'المستخدم'}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        لوحة التحكم
                      </Link>
                      
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        الملف الشخصي
                      </Link>
                      
                      <Link
                        href="/marketplace"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <Store className="w-4 h-4 mr-3" />
                        السوق
                      </Link>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                          onClick={openLogoutConfirmation}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 space-x-reverse">
                <Link 
                  href="/auth/login"
                  className={`px-4 py-2 font-medium transition-colors duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'text-green-700 hover:text-green-800' 
                      : 'text-white/90 hover:text-white drop-shadow-md'
                  }`}
                >
                  دخول
                </Link>
                <Link 
                  href="/auth/signup"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    isScrolled 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                  }`}
                >
                  تسجيل
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-2 transition-colors duration-300 ${
                isScrolled 
                  ? 'text-green-700 hover:text-green-800' 
                  : 'text-white/90 hover:text-white drop-shadow-md'
              }`}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <UnifiedSearch variant="header" />
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden pb-6">
            <div className="bg-white border border-green-200 rounded-lg p-4 mt-4">
                          <nav className="space-y-3">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

                {loading && !loadingGracePassed ? (
                  <div className="flex justify-center py-2">
                    <div className="w-4 h-4 border border-green-500 border-t-transparent rounded-full animate-spin opacity-50"></div>
                  </div>
                ) : user ? (
                  <div className="border-t border-green-200 pt-3 space-y-3">
                    {/* User Info */}
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'المستخدم'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    
                    <Link 
                      href="/dashboard"
                      className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span className="font-medium">لوحة التحكم</span>
                    </Link>
                    
                    <Link 
                      href="/profile"
                      className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">الملف الشخصي</span>
                    </Link>
                    
                    <Link 
                      href="/marketplace"
                      className="flex items-center space-x-3 space-x-reverse px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Store className="w-5 h-5" />
                      <span className="font-medium">السوق</span>
                    </Link>
                    
                    <button 
                      onClick={openLogoutConfirmation}
                      className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">تسجيل الخروج</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-green-200 pt-3 space-y-3">
                    <Link 
                      href="/auth/login"
                      className="block w-full text-center px-4 py-3 text-green-700 hover:bg-green-50 rounded-lg transition-colors font-medium"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      دخول
                    </Link>
                    <Link 
                      href="/auth/signup"
                      className="block w-full text-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      تسجيل
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleSignOut}
        loading={logoutLoading}
      />
    </header>
  );
};

export default Header;
