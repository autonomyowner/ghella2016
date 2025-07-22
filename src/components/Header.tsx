
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const { user, profile, signOut, loading } = useSupabaseAuth();

  // Scroll handling
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 20;
    if (scrolled !== isScrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  // Dropdown timing helpers
  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before hiding
    setDropdownTimeout(timeout);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu') && !target.closest('.mobile-menu')) {
        setShowUserMenu(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup dropdown timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  // Enhanced navigation with dropdowns
  const navItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: "fas fa-home",
      type: "link"
    },
    {
      label: "المنتجات",
      icon: "fas fa-store",
      type: "dropdown",
      items: [
        { href: "/marketplace", label: "السوق", icon: "fas fa-shopping-cart" },
        { href: "/equipment", label: "المعدات", icon: "fas fa-tools" },
        { href: "/land", label: "الأراضي", icon: "fas fa-map-marked-alt" },
        { href: "/animals", label: "الحيوانات", icon: "fas fa-cow" },
        { href: "/nurseries", label: "المشاتل", icon: "fas fa-seedling" },
        { href: "/labor", label: "اليد العاملة", icon: "fas fa-user-tie" },
        { href: "/analysis", label: "التحليل والدراسات", icon: "fas fa-chart-line" },
        { href: "/delivery", label: "خدمات التوصيل", icon: "fas fa-truck" },
        { href: "/exports", label: "التصدير", icon: "fas fa-ship" }
      ]
    },
    {
      href: "/VAR",
      label: "المرصد الزراعي",
      icon: "fas fa-robot",
      type: "link"
    },
    {
      href: "/about",
      label: "من نحن",
      icon: "fas fa-info-circle",
      type: "link"
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-2xl shadow-2xl border-b border-emerald-200/30' 
          : 'bg-gradient-to-r from-emerald-50/90 via-white/95 to-emerald-50/90 backdrop-blur-xl'
      }`}
      role="banner"
    >
      {/* Premium Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-1 px-4 text-center text-sm font-semibold relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          🌟 منصة الغلة - ربط المزارعين والمشترين في الجزائر | 
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          
          {/* Premium Logo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-4 space-x-reverse group">
              <motion.div 
                className="relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-emerald-500/25"
                whileHover={{ rotate: 5, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-seedling text-white text-2xl lg:text-3xl drop-shadow-lg"></i>
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                  initial={false}
                />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
              </motion.div>
              <div className="text-right">
                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-emerald-700 transition-all duration-500 drop-shadow-sm">
                  الغلة
                </h1>
                <p className="text-sm lg:text-base text-emerald-600 hidden sm:block font-semibold tracking-wide">
                  منصة التكنولوجيا الزراعية
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Premium Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 space-x-reverse">
            {navItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => item.type === 'dropdown' && handleDropdownEnter(item.label)}
                onMouseLeave={handleDropdownLeave}
              >
                {item.type === 'link' ? (
                  <Link
                    href={item.href!}
                    className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-emerald-700 hover:text-emerald-800 font-bold transition-all duration-300 group rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <i className={`${item.icon} text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110`}></i>
                    <span className="text-lg">{item.label}</span>
                    <motion.div
                      className="absolute bottom-0 left-3 right-3 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                ) : (
                  <button
                    className="flex items-center space-x-3 space-x-reverse px-4 py-2 text-emerald-700 hover:text-emerald-800 font-bold transition-all duration-300 group rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <i className={`${item.icon} text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110`}></i>
                    <span className="text-lg">{item.label}</span>
                    <i className="fas fa-chevron-down text-sm text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:rotate-180"></i>
                  </button>
                )}

                {/* Premium Dropdown Menu */}
                {item.type === 'dropdown' && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-0 mt-1 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                    <div className="p-2">
                      {item.items!.map((subItem, subIndex) => (
                        <motion.div
                          key={subItem.href}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05 }}
                        >
                          <Link
                            href={subItem.href}
                            className="flex items-center space-x-4 space-x-reverse px-4 py-2 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300 group"
                          >
                            <i className={`${subItem.icon} w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110`}></i>
                            <span className="text-base font-semibold">{subItem.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Premium Search Bar */}
          <motion.div 
            className="hidden md:flex relative w-80 lg:w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full">
              <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="ابحث عن المنتجات، الأراضي، المعدات..."
                className="w-full pl-14 pr-5 py-4 bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-300 text-base placeholder-emerald-400 font-medium shadow-lg hover:shadow-xl hover:shadow-emerald-500/10"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="fas fa-times w-5 h-5"></i>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Premium Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-4 space-x-reverse"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {loading ? (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 animate-pulse flex items-center justify-center shadow-lg">
                <i className="fas fa-spinner fa-spin text-emerald-600 text-lg"></i>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Premium Notifications */}
                <motion.button
                  className="relative p-2 text-emerald-600 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-bell w-6 h-6"></i>
                  <motion.span 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>

                {/* Premium Add Product Button */}
                <Link href="/equipment/new">
                  <motion.button
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 text-lg"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className="fas fa-plus ml-3 text-xl"></i>
                    أضف إعلان
                  </motion.button>
                </Link>

                {/* Premium User Menu */}
                <div className="relative user-menu">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-4 space-x-reverse px-4 py-2 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-800 font-bold text-base">
                        {profile?.full_name || 'المستخدم'}
                      </p>
                      <p className="text-emerald-600 text-sm font-semibold">عضو نشط</p>
                    </div>
                    <motion.i 
                      className={`fas fa-chevron-down text-emerald-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`}
                      animate={{ rotate: showUserMenu ? 180 : 0 }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-0 mt-4 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden"
                      >
                        <div className="p-3 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50/80 to-teal-50/80">
                          <div className="flex items-center space-x-5 space-x-reverse">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-emerald-800 font-bold text-lg">{profile?.full_name || 'المستخدم'}</p>
                              <p className="text-emerald-600 text-sm font-semibold">{user.email}</p>
                              <div className="flex items-center mt-2">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`fas fa-star text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                                  ))}
                                </div>
                                <span className="text-sm text-emerald-600 mr-2 font-semibold">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2">
                          {[
                            { href: "/dashboard", icon: "fas fa-chart-line", label: "لوحة التحكم", color: "text-blue-600" },
                            { href: "/equipment/new", icon: "fas fa-plus-circle", label: "إعلان جديد", color: "text-emerald-600" },
                            { href: "/profile", icon: "fas fa-user-cog", label: "الإعدادات", color: "text-purple-600" },
                            { href: "/favorites", icon: "fas fa-heart", label: "المفضلة", color: "text-red-600" }
                          ].map((item, index) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link 
                                href={item.href}
                                className="flex items-center space-x-4 space-x-reverse px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300 group"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <i className={`${item.icon} w-6 h-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}></i>
                                <span className="font-bold text-base">{item.label}</span>
                              </Link>
                            </motion.div>
                          ))}
                          <div className="border-t border-emerald-200/50 mt-4 pt-4">
                            <motion.button 
                              onClick={handleSignOut}
                              className="w-full flex items-center space-x-4 space-x-reverse px-4 py-2 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 group"
                              whileHover={{ x: 5 }}
                            >
                              <i className="fas fa-sign-out-alt w-6 h-6 group-hover:scale-110 transition-transform duration-300"></i>
                              <span className="font-bold text-base">تسجيل الخروج</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link 
                  href="/auth/login" 
                  className="px-6 py-2 text-emerald-700 hover:text-emerald-800 transition-all duration-300 font-bold hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 text-lg"
                >
                  انضم الآن
                </Link>
              </div>
            )}
          </motion.div>

          {/* Premium Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3 space-x-reverse">
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-search w-6 h-6"></i>
            </motion.button>

            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 mobile-menu"
              whileTap={{ scale: 0.95 }}
            >
              <i className={`fas ${showMobileMenu ? 'fa-times' : 'fa-bars'} w-6 h-6`}></i>
            </motion.button>
          </div>
        </div>

        {/* Premium Mobile Search */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden pb-6"
            >
              <div className="relative">
                <i className="fas fa-search absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن المنتجات، الأراضي، المعدات..."
                  className="w-full pl-14 pr-5 py-5 bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 rounded-2xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all duration-300 text-base placeholder-emerald-400 font-medium shadow-xl"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-5 top-1/2 transform -translate-y-1/2 text-emerald-400 hover:text-emerald-600 transition-all duration-300 hover:scale-110"
                    onClick={() => setSearchTerm('')}
                  >
                    <i className="fas fa-times w-5 h-5"></i>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden pb-8"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-3 mt-6">
                <nav className="space-y-3">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.type === 'link' ? (
                        <Link
                          href={item.href!}
                          className="flex items-center space-x-4 space-x-reverse px-5 py-5 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 font-bold text-lg"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <i className={`${item.icon} w-6 h-6`}></i>
                          <span>{item.label}</span>
                        </Link>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4 space-x-reverse px-5 py-5 text-emerald-700 font-bold text-lg">
                            <i className={`${item.icon} w-6 h-6`}></i>
                            <span>{item.label}</span>
                          </div>
                          <div className="mr-8 space-y-2">
                            {item.items!.map((subItem, subIndex) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-center space-x-4 space-x-reverse px-4 py-2 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300 text-base font-semibold"
                                onClick={() => setShowMobileMenu(false)}
                              >
                                <i className={`${subItem.icon} w-5 h-5`}></i>
                                <span>{subItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </nav>

                {loading ? (
                  <div className="mt-8 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                    <div className="w-full h-6 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-xl animate-pulse"></div>
                  </div>
                ) : user ? (
                  <motion.div 
                    className="mt-8 p-3 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center space-x-5 space-x-reverse mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-emerald-800 font-bold text-lg">{profile?.full_name || 'المستخدم'}</p>
                        <p className="text-emerald-600 text-sm font-semibold">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { href: "/dashboard", icon: "fas fa-chart-line", label: "لوحة التحكم" },
                        { href: "/equipment/new", icon: "fas fa-plus-circle", label: "إعلان معدات" },
                        { href: "/animals/new", icon: "fas fa-cow", label: "إعلان حيوانات" }
                      ].map((item, index) => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-4 space-x-reverse px-4 py-2 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-300"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <i className={`${item.icon} w-5 h-5`}></i>
                          <span className="text-base font-semibold">{item.label}</span>
                        </Link>
                      ))}
                      <motion.button 
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-4 space-x-reverse px-4 py-2 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <i className="fas fa-sign-out-alt w-5 h-5"></i>
                        <span className="text-base font-semibold">تسجيل الخروج</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="mt-8 space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link 
                      href="/auth/login" 
                      className="block w-full text-center px-8 py-5 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 font-bold border-2 border-emerald-200/50 shadow-lg hover:shadow-xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      تسجيل الدخول
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="block w-full text-center px-8 py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      انضم الآن
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
