
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import {
  Home, Store, Bot, Info, Search, Bell, Plus, User, Menu, X,
  ChevronDown, Star, Settings, Heart, LogOut, ShoppingCart, Wrench,
  MapPin, Beef, Sprout, Users, BarChart3, Truck, Ship, Brain,
  Satellite, Database, Cpu, Globe, Leaf, TrendingUp, Shield, Rocket
} from 'lucide-react';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
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
    }, 300);
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

  // Enhanced navigation with premium icons
  const navItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
      type: "link"
    },
    {
      label: "المنتجات",
      icon: Store,
      type: "dropdown",
      items: [
        { href: "/marketplace", label: "السوق", icon: ShoppingCart },
        { href: "/equipment", label: "المعدات", icon: Wrench },
        { href: "/land", label: "الأراضي", icon: MapPin },
        { href: "/animals", label: "الحيوانات", icon: Beef },
        { href: "/nurseries", label: "المشاتل", icon: Sprout },
        { href: "/labor", label: "اليد العاملة", icon: Users },
        { href: "/analysis", label: "التحليل والدراسات", icon: BarChart3 },
        { href: "/delivery", label: "خدمات التوصيل", icon: Truck },
        { href: "/exports", label: "التصدير", icon: Ship }
      ]
    },
    {
      href: "/VAR",
      label: "المرصد الزراعي",
      icon: Bot,
      type: "link",
      premium: true
    },
    {
      href: "/about",
      label: "من نحن",
      icon: Info,
      type: "link"
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-2xl shadow-2xl border-b border-emerald-200/30' 
          : 'bg-gradient-to-r from-emerald-50/95 via-white/98 to-emerald-50/95 backdrop-blur-xl'
      }`}
      role="banner"
    >
      {/* Premium Top Bar with Enhanced Design */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-2 px-4 text-center text-sm font-semibold relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center justify-center space-x-4 space-x-reverse"
        >
          <div className="flex items-center space-x-2 space-x-reverse">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-4 h-4 text-yellow-300" />
            </motion.div>
            <span>منصة الغلة - ربط المزارعين والمشترين في الجزائر</span>
          </div>
          <Link href="/equipment/new" className="flex items-center space-x-2 space-x-reverse underline hover:no-underline font-bold text-yellow-300 hover:text-yellow-200 transition-colors">
            <Plus className="w-4 h-4" />
            <span>أضف إعلانك الآن</span>
          </Link>
        </motion.div>
        
        {/* Enhanced animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-teal-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating tech icons */}
        <motion.div
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1 left-10 opacity-20"
        >
          <Satellite className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div
          animate={{ x: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1 right-10 opacity-20"
        >
          <Database className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Enhanced Premium Logo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center space-x-4 space-x-reverse group">
              <motion.div 
                className="relative w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-emerald-500/25"
                whileHover={{ rotate: 5, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Leaf className="w-8 h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
                {/* Enhanced glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                  initial={false}
                />
                {/* Enhanced shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                {/* Premium badge for VAR */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              <div className="text-right">
                <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-emerald-700 transition-all duration-500 drop-shadow-sm">
                  الغلة
                </h1>
                <p className="text-sm lg:text-base text-emerald-600 hidden sm:block font-semibold tracking-wide">
                  منصة التكنولوجيا الزراعية المتطورة
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Enhanced Premium Desktop Navigation */}
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
                    className={`flex items-center space-x-3 space-x-reverse px-4 py-3 text-emerald-700 hover:text-emerald-800 font-bold transition-all duration-300 group rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-lg hover:shadow-emerald-500/20 ${
                      item.premium ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50' : ''
                    }`}
                  >
                    <item.icon className={`w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110 ${
                      item.premium ? 'text-purple-500 group-hover:text-purple-600' : ''
                    }`} />
                    <span className="text-lg">{item.label}</span>
                    {item.premium && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    )}
                    <motion.div
                      className={`absolute bottom-0 left-3 right-3 h-1 rounded-full ${
                        item.premium 
                          ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                          : 'bg-gradient-to-r from-emerald-400 to-teal-400'
                      }`}
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>
                ) : (
                  <button
                    className="flex items-center space-x-3 space-x-reverse px-4 py-3 text-emerald-700 hover:text-emerald-800 font-bold transition-all duration-300 group rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-lg hover:shadow-emerald-500/20"
                  >
                    <item.icon className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110" />
                    <span className="text-lg">{item.label}</span>
                    <ChevronDown className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:rotate-180" />
                  </button>
                )}

                {/* Enhanced Premium Dropdown Menu */}
                {item.type === 'dropdown' && activeDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-full left-0 mt-1 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-200/50 overflow-hidden"
                    onMouseEnter={() => handleDropdownEnter(item.label)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    {/* Invisible bridge to prevent gap */}
                    <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>
                    <div className="p-3">
                      {item.items!.map((subItem, subIndex) => (
                        <motion.div
                          key={subItem.href}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: subIndex * 0.05 }}
                        >
                          <Link
                            href={subItem.href}
                            className="flex items-center space-x-4 space-x-reverse px-4 py-3 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300 group"
                          >
                            <subItem.icon className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-all duration-300 group-hover:scale-110" />
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

          {/* Enhanced Premium Search Bar */}
          <motion.div 
            className="hidden md:flex relative w-80 lg:w-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
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
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Enhanced Premium Desktop Actions */}
          <motion.div 
            className="hidden lg:flex items-center space-x-4 space-x-reverse"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {loading ? (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-100 to-teal-100 animate-pulse flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-6 h-6 text-emerald-600" />
                </motion.div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Enhanced Premium Notifications */}
                <motion.button
                  className="relative p-3 text-emerald-600 hover:text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-6 h-6" />
                  {notificationCount > 0 && (
                    <motion.span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {notificationCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Enhanced Premium Add Product Button */}
                <Link href="/equipment/new">
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 text-lg flex items-center space-x-2 space-x-reverse"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" />
                    <span>أضف إعلان</span>
                  </motion.button>
                </Link>

                {/* Enhanced Premium User Menu */}
                <div className="relative user-menu">
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-4 space-x-reverse px-4 py-3 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
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
                    <motion.div 
                      animate={{ rotate: showUserMenu ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-emerald-600" />
                    </motion.div>
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
                        <div className="p-4 border-b border-emerald-200/50 bg-gradient-to-r from-emerald-50/80 to-teal-50/80">
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
                                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                                <span className="text-sm text-emerald-600 mr-2 font-semibold">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          {[
                            { href: "/dashboard", icon: BarChart3, label: "لوحة التحكم", color: "text-blue-600" },
                            { href: "/equipment/new", icon: Plus, label: "إعلان جديد", color: "text-emerald-600" },
                            { href: "/profile", icon: Settings, label: "الإعدادات", color: "text-purple-600" },
                            { href: "/favorites", icon: Heart, label: "المفضلة", color: "text-red-600" }
                          ].map((item, index) => (
                            <motion.div
                              key={item.href}
                              initial={{ opacity: 0, x: -30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link 
                                href={item.href}
                                className="flex items-center space-x-4 space-x-reverse px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300 group"
                                onClick={() => setShowUserMenu(false)}
                              >
                                <item.icon className={`w-6 h-6 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                                <span className="font-bold text-base">{item.label}</span>
                              </Link>
                            </motion.div>
                          ))}
                          <div className="border-t border-emerald-200/50 mt-4 pt-4">
                            <motion.button 
                              onClick={handleSignOut}
                              className="w-full flex items-center space-x-4 space-x-reverse px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 group"
                              whileHover={{ x: 5 }}
                            >
                              <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
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
                  className="px-6 py-3 text-emerald-700 hover:text-emerald-800 transition-all duration-300 font-bold hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
                >
                  تسجيل الدخول
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white font-bold rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/30 text-lg"
                >
                  انضم الآن
                </Link>
              </div>
            )}
          </motion.div>

          {/* Enhanced Premium Mobile Actions */}
          <div className="flex lg:hidden items-center space-x-3 space-x-reverse">
            <motion.button
              onClick={() => setShowSearch(!showSearch)}
              className="p-3 text-emerald-600 hover:text-emerald-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20"
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-6 h-6" />
            </motion.button>

            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-3 text-emerald-600 hover:text-emerald-800 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/20 mobile-menu"
              whileTap={{ scale: 0.95 }}
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Enhanced Premium Mobile Search */}
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
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
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
                    <X className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Premium Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:hidden pb-8"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 p-4 mt-6">
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
                          className={`flex items-center space-x-4 space-x-reverse px-5 py-4 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-2xl transition-all duration-300 font-bold text-lg ${
                            item.premium ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50' : ''
                          }`}
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <item.icon className="w-6 h-6" />
                          <span>{item.label}</span>
                          {item.premium && (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            />
                          )}
                        </Link>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4 space-x-reverse px-5 py-4 text-emerald-700 font-bold text-lg">
                            <item.icon className="w-6 h-6" />
                            <span>{item.label}</span>
                          </div>
                          <div className="mr-8 space-y-2">
                            {item.items!.map((subItem, subIndex) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-center space-x-4 space-x-reverse px-4 py-3 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 rounded-xl transition-all duration-300 text-base font-semibold"
                                onClick={() => setShowMobileMenu(false)}
                              >
                                <subItem.icon className="w-5 h-5" />
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
                  <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl">
                    <div className="w-full h-6 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-xl animate-pulse"></div>
                  </div>
                ) : user ? (
                  <motion.div 
                    className="mt-8 p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl"
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
                        { href: "/dashboard", icon: BarChart3, label: "لوحة التحكم" },
                        { href: "/equipment/new", icon: Plus, label: "إعلان معدات" },
                        { href: "/animals/new", icon: Beef, label: "إعلان حيوانات" }
                      ].map((item, index) => (
                        <Link 
                          key={item.href}
                          href={item.href}
                          className="flex items-center space-x-4 space-x-reverse px-4 py-3 text-emerald-700 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-300"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="text-base font-semibold">{item.label}</span>
                        </Link>
                      ))}
                      <motion.button 
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-4 space-x-reverse px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <LogOut className="w-5 h-5" />
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
