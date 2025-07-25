'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useWebsiteSettings } from '@/lib/websiteSettings';
import { useSearch } from '@/contexts/SearchContext';
import { 
  MapPin, 
  Leaf, 
  Wrench, 
  Truck, 
  Ship, 
  Satellite, 
  Users, 
  ArrowRight,
  Star,
  Shield,
  Clock,
  TrendingUp,
  Award,
  Heart,
  Share2,
  CalendarCheck,
  Search,
  ChevronDown
} from 'lucide-react';

export default function HomePage() {
  const { user, signOut, profile } = useSupabaseAuth();
  const { settings, loading } = useWebsiteSettings();
  const { searchTerm, setSearchTerm, search, results, loading: searchLoading } = useSearch();
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('جميع الفئات');
  
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

  // Prevent hydration mismatch with proper layout preservation
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-gray-900">
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="text-8xl mb-8">🚜</div>
              <div className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-green-300 via-teal-300 to-green-400 bg-clip-text text-transparent">
                الغلة
              </div>
              <div className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed text-white">
                منتجات طبيعية خدمات زراعية و استشارية
              </div>
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-green-300 font-semibold">جاري التحميل...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    'جميع الفئات',
    'الأراضي الزراعية',
    'الخضروات والفواكه',
    'المشاتل',
    'المعدات الزراعية',
    'الحيوانات',
    'الخبراء'
  ];

  const quickSearchTerms = [
    'طماطم',
    'أراضي زراعية',
    'جرار زراعي',
    'خبير زراعي',
    'زيتون',
    'معدات الري'
  ];

  const marketplaceCategories = [
    {
      title: "الأراضي الزراعية",
      description: "استأجر أو اشتر أراضي زراعية",
      icon: MapPin,
      href: "/land",
      color: "bg-green-500",
      count: "150+ أرض متاحة",
      image: "/assets/land01.jpg",
      emoji: "🌾",
      features: ["ري متطور", "تربة خصبة", "طرق ممهدة"]
    },
    {
      title: "الخضروات والفواكه",
      description: "بيع وشراء المنتجات الطازجة",
      icon: Leaf,
      href: "/marketplace",
      color: "bg-emerald-500",
      count: "500+ منتج",
      image: "/assets/tomato 2.jpg",
      emoji: "🍅",
      features: ["طازج", "عضوي", "مضمون الجودة"]
    },
    {
      title: "المشاتل",
      description: "شتلات وأشجار جاهزة للزراعة",
      icon: Leaf,
      href: "/nurseries",
      color: "bg-teal-500",
      count: "80+ مشتل",
      image: "/assets/seedings01.jpg",
      emoji: "🌱",
      features: ["شتلات صحية", "أصناف متنوعة", "ضمان النمو"]
    },
    {
      title: "المعدات الزراعية",
      description: "جرارات وأدوات ومعدات",
      icon: Wrench,
      href: "/equipment",
      color: "bg-blue-500",
      count: "200+ معدة",
      image: "/assets/machin01.jpg",
      emoji: "🚜",
      features: ["مؤمن", "صيانة دورية", "تأجير مرن"]
    }
  ];

  const services = [
    {
      title: "كراء اراضي فلاحية",
      description: "تمتع بامكانية كراء اراضي فلاحية واسعة لضمان عمليات زراعية سلسة",
      icon: MapPin,
      href: "/land",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      emoji: "🌾",
      image: "/assets/land01.jpg"
    },
    {
      title: "منتجات زراعية طازجة",
      description: "تواصل مباشرة مع الفلاحين المحليين للمنتاجات الطازجة من الحقل مباشرة اليك",
      icon: Leaf,
      href: "/marketplace",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      emoji: "🍅",
      image: "/assets/tomato 2.jpg"
    },
    {
      title: "خدمات استشارية فلاحية متخصصة",
      description: "احصل على نصائح من خبراء فلاحين المتمرسين لزيادة أنتاجية مزرعتك و استدامتها",
      icon: Users,
      href: "/experts",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      emoji: "👨‍🌾",
      image: "/assets/pexels-cottonbro-4921204.jpg"
    },

    {
      title: "خدمات التصدير",
      description: "تصدير المنتجات الزراعية للخارج بأسعار منافسة ووثائق رسمية",
      icon: Ship,
      href: "/exports",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      emoji: "🚢",
      image: "/assets/exporting1.jpg"
    }
  ];

  const stats = [
    { number: "10,000+", label: "مزارع نشط", icon: "🌾" },
    { number: "50,000+", label: "معاملة مكتملة", icon: "✅" },
    { number: "4.8", label: "تقييم المستخدمين", icon: "⭐" },
    { number: "24/7", label: "دعم متواصل", icon: "🛡️" }
  ];

  return (
    <div className="min-h-screen min-w-[320px] mx-auto bg-gradient-to-br from-green-900 to-gray-900 text-white">
      {/* Hero Section with Video Background */}
      <div id="hero" className="relative h-screen w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden max-w-none">
        <video 
          autoPlay 
          loop 
          playsInline 
          className="object-cover w-screen h-full absolute top-0 left-0 z-0 min-w-full min-h-full"
        >
          <source src="/assets/Videoplayback1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay for better text readability */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-black/40">
          <div className="text-center">
            {/* 3D Logo */}
            <div className="mx-auto mb-6 flex items-center justify-center">
              <div className="relative group">
                {/* 3D Text Effect */}
                <div className="relative transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
                  {/* Shadow layers for 3D effect */}
                  <div className="absolute inset-0 transform translate-x-1 translate-y-1 text-3xl md:text-4xl font-black text-black/30 blur-sm">
                    الغلة
                  </div>
                  <div className="absolute inset-0 transform translate-x-0.5 translate-y-0.5 text-3xl md:text-4xl font-black text-black/50">
                    الغلة
                  </div>
                  <div className="absolute inset-0 transform translate-x-0.25 translate-y-0.25 text-3xl md:text-4xl font-black text-black/70">
                    الغلة
                  </div>
                  
                  {/* Main text with gradient */}
                  <div className="relative text-3xl md:text-4xl font-black bg-gradient-to-br from-green-300 via-emerald-300 to-green-400 bg-clip-text text-transparent drop-shadow-lg">
                    الغلة
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 text-3xl md:text-4xl font-black bg-gradient-to-br from-green-400 via-emerald-400 to-green-500 bg-clip-text text-transparent blur-sm opacity-50">
                    الغلة
                  </div>
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute -top-2 -right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-70"></div>
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse opacity-60" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute top-1/2 -right-3 w-1 h-1 bg-green-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl font-bold mb-4 text-white font-NeoSansArabicBlack">
              منتجات طبيعية خدمات زراعية و استشارية
            </h1>
            
            {/* Subtitle */}
            <p className="text-2xl text-white font-NeoSansArabicMedium">
              أستكشف موقعنا الغلة
            </p>
          </div>
        </div>

        {/* Social Media Bubbles - Right Side */}
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 z-20 flex flex-col gap-4">
          {/* Facebook */}
          <a 
            href="https://www.facebook.com/profile.php?id=61578467404013&mibextid=wwXIfr&rdid=SeDWt8dZzlNCz9Fh&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ApK4nZXXR%2F%3Fmibextid%3DwwXIfr#" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/el_ghella_/?fbclid=IwY2xjawLwqzJleHRuA2FlbQIxMABicmlkETF1V0htdkVhRVNhcG9hb1YzAR6JtdV_SYKFKbWZi-eAC56MfdAcEwok-_hDSctq9tRuEhCBPYW1s0HPl-F6ig_aem_Akct20fqf2UrxE9Mf1EoiQ" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          {/* TikTok */}
          <a 
            href="https://www.tiktok.com/@elghella10?_t=ZN-8yKMuFB1wIA&_r=1&fbclid=IwY2xjawLwqy5leHRuA2FlbQIxMABicmlkETF1V0htdkVhRVNhcG9hb1YzAR6jZLxUf1XjQseM-gHEzbPOsMaV0wH7ZLTgJu-Wter5Kxs0aKEnUr9In9w5fg_aem_BdvgT-Mkmob_c0Rp62-dGg" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-12 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['NeoSansArabicBold']">
                ابحث في منصة الغلة
              </h2>
              <p className="text-gray-600 font-['NeoSansArabicLight']">
                اكتشف المنتجات الطبيعية، الأراضي، المعدات الزراعية والخبراء
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Dropdown */}
              <div className="relative">
                <button className="flex items-center justify-between w-full md:w-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-['NeoSansArabicMedium']">
                  <span className="text-gray-700">{selectedCategory}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                </button>
              </div>
              
              {/* Search Input */}
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="ابحث عن المنتجات، الأراضي، المعدات..." 
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 font-['NeoSansArabicLight'] text-right text-gray-700 placeholder-gray-400" 
                  dir="rtl" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              {/* Search Button */}
              <button 
                disabled={!searchTerm.trim()} 
                onClick={() => search(searchTerm)}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-['NeoSansArabicBold'] shadow-lg"
              >
                {searchLoading ? 'جاري البحث...' : 'بحث'}
              </button>
            </div>
            
            {/* Quick Search Terms */}
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-3 font-['NeoSansArabicLight']">بحث سريع:</p>
              <div className="flex flex-wrap gap-2">
                {quickSearchTerms.map((term, index) => (
                  <button 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-100 hover:text-green-700 transition-colors duration-200 font-['NeoSansArabicLight']"
                    onClick={() => {
                      setSearchTerm(term);
                      search(term);
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section */}
      {results.length > 0 && (
        <div className="py-8 px-4">
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-['NeoSansArabicBold']">
                  نتائج البحث
                </h2>
                <p className="text-gray-600 font-['NeoSansArabicLight']">
                  تم العثور على {results.length} نتيجة لـ "{searchTerm}"
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 overflow-hidden"
                  >
                    {/* Result Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={result.image || '/assets/placeholder.png'}
                        alt={result.title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/placeholder.png';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {result.type === 'equipment' && 'معدات'}
                        {result.type === 'land' && 'أراضي'}
                        {result.type === 'vegetable' && 'خضروات'}
                        {result.type === 'animal' && 'حيوانات'}
                        {result.type === 'nursery' && 'مشاتل'}
                      </div>
                    </div>
                    
                    {/* Result Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {result.title}
                      </h3>
                      
                      {result.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {result.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        {result.price && (
                          <div className="text-green-600 font-bold">
                            {result.price.toLocaleString('en-US')} {result.currency}
                          </div>
                        )}
                        {result.location && (
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <MapPin className="w-3 h-3" />
                            {result.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <button
                  onClick={() => window.location.href = '/search?q=' + encodeURIComponent(searchTerm)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-['NeoSansArabicMedium']"
                >
                  عرض جميع النتائج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Featured Offers Section */}
      <section aria-label="العروض" className="mb-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold font-['NeoSansArabicBold'] text-green-200 mb-4 leading-tight">
              عروضنا المميزة
            </h2>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-['NeoSansArabicLight']">
              اكتشف خدماتنا المميزة المصممة خصيصاً لاحتياجاتك الزراعية
            </p>
          </div>
          
          {/* Marketplace Wide Card */}
          <div className="w-full max-w-6xl mx-auto mb-8">
            <Link href="/marketplace" className="block">
              <div className="w-full h-80 md:h-96 rounded-2xl shadow-2xl overflow-hidden border-2 border-green-500/50 group transition-all duration-500 hover:scale-[1.02] hover:border-green-400 relative bg-gradient-to-br from-green-900/20 to-gray-900/20">
                {/* Background Image with Mixed JPG */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="/assets/n7l2.webp" 
                    alt="سوق الغلة" 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    loading="lazy"
                  />
                </div>
                
                {/* Enhanced Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 via-black/40 to-transparent z-10 group-hover:from-black/80 group-hover:via-black/50 transition-all duration-500"></div>
                
                {/* Floating Badge */}
                <div className="absolute top-6 right-6 z-30">
                  <span className="bg-green-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-lg font-bold animate-pulse">
                    🛒 سوق الغلة
                  </span>
                </div>
                
                {/* Content */}
                <div className="relative z-20 p-8 md:p-12 text-right flex flex-col items-end justify-center h-full">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🏪</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-['NeoSansArabicBold'] text-green-200 mb-4 drop-shadow-lg leading-tight group-hover:text-green-100 transition-colors duration-300">
                    سوق الغلة الشامل
                  </h3>
                  
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-100 rtl leading-relaxed font-['NeoSansArabicMedium'] mb-6 drop-shadow max-w-2xl">
                    اكتشف كل ما تحتاجه في عالم الزراعة: منتجات طبيعية، أراضي، معدات، خبراء، وخدمات متكاملة
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 w-full max-w-2xl">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">🌱</span>
                      </div>
                      <p className="text-green-200 text-sm font-['NeoSansArabicMedium']">شتلات</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">🚜</span>
                      </div>
                      <p className="text-green-200 text-sm font-['NeoSansArabicMedium']">معدات</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">👨‍🌾</span>
                      </div>
                      <p className="text-green-200 text-sm font-['NeoSansArabicMedium']">خبراء</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl">🌍</span>
                      </div>
                      <p className="text-green-200 text-sm font-['NeoSansArabicMedium']">أراضي</p>
                    </div>
                  </div>
                  
                  <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg text-lg md:text-xl group-hover:shadow-green-500/25 group-hover:scale-105 flex items-center gap-3">
                    <span>استكشف السوق الآن</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  
                  <p className="text-green-200 font-bold mt-4 drop-shadow text-base md:text-lg leading-tight">
                    كل شيء في مكان واحد... منصة الغلة الشاملة
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 md:gap-8">
            {/* VAR Analysis Service Card */}
            <div className="w-full max-w-lg h-auto rounded-2xl shadow-2xl overflow-hidden border-2 border-green-500/50 group transition-all duration-500 hover:scale-105 hover:border-green-400 relative min-h-[450px] flex flex-col justify-end bg-gradient-to-br from-green-900/20 to-gray-900/20">
              {/* Background GIF with Enhanced Effects */}
              <img 
                src="/assets/field.gif" 
                alt="تحليل الأراضي الزراعية" 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
                loading="lazy"
              />
              
              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 via-black/30 to-transparent z-10 group-hover:from-black/70 group-hover:via-black/40 transition-all duration-500"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 z-30">
                <span className="bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  🛰️ VAR
                </span>
              </div>
              
              {/* Content */}
              <div className="relative z-20 p-6 md:p-8 text-right flex flex-col items-end justify-end h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🛰️</span>
                </div>
                
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-['NeoSansArabicMedium'] text-green-200 mb-3 drop-shadow-lg leading-tight group-hover:text-green-100 transition-colors duration-300">
                  أحدث تقنيات تحليل البيانات وبيانات الأقمار الصناعية
                </h3>
                
                <p className="text-sm md:text-base lg:text-lg text-gray-100 rtl leading-relaxed font-['NeoSansArabicLight'] mb-3 drop-shadow">
                  لتحليل الأراضي الزراعية وتحسين الإنتاجية.<br/>
                  استخدم تقنيات الذكاء الاصطناعي والبيانات الفضائية:
                </p>
                
                <ul className="text-green-300 mb-3 text-right list-none pr-0 drop-shadow text-sm md:text-base space-y-1">
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    تحليل التربة والمناخ
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    بيانات الأقمار الصناعية
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    تحسين الإنتاجية الزراعية
                  </li>
                </ul>
                
                <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-lg p-3 mb-3 w-full">
                  <p className="text-green-100 drop-shadow text-sm md:text-base leading-relaxed">
                    🛰️ تحليل متقدم للأراضي الزراعية<br/>
                    📊 بيانات دقيقة ومحدثة<br/>
                    🎯 توصيات لتحسين الإنتاجية
                  </p>
                </div>
                
                <Link href="/VAR" className="mt-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base group-hover:shadow-green-500/25 group-hover:scale-105 flex items-center gap-2">
                  <span>ابدأ التحليل</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <p className="text-green-200 font-bold mt-3 drop-shadow text-sm md:text-base leading-tight">
                  استخدم التكنولوجيا المتقدمة... لزراعة ذكية ومستدامة.
                </p>
              </div>
            </div>

            {/* Delivery Service Card */}
            <div className="w-full max-w-lg h-auto rounded-2xl shadow-2xl overflow-hidden border-2 border-blue-500/50 group transition-all duration-500 hover:scale-105 hover:border-blue-400 relative min-h-[450px] flex flex-col justify-end bg-gradient-to-br from-blue-900/20 to-gray-900/20">
              {/* Background Image with Enhanced Effects */}
              <img 
                src="/assets/exporting1.jpg" 
                alt="شاحنة التوصيل" 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-1" 
                loading="lazy"
              />
              
              {/* Enhanced Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 via-black/30 to-transparent z-10 group-hover:from-black/70 group-hover:via-black/40 transition-all duration-500"></div>
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 z-30">
                <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  ⚡ سريع
                </span>
              </div>
              
              {/* Content */}
              <div className="relative z-20 p-6 md:p-8 text-right flex flex-col items-end justify-end h-full">
                {/* Icon */}
                <div className="w-16 h-16 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl">🚚</span>
                </div>
                
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold font-['NeoSansArabicMedium'] text-blue-200 mb-3 drop-shadow-lg leading-tight group-hover:text-blue-100 transition-colors duration-300">
                  خدمة التوصيل من المزرعة إلى الباب
                </h3>
                
                <p className="text-sm md:text-base lg:text-lg text-gray-100 rtl leading-relaxed font-['NeoSansArabicLight'] mb-3 drop-shadow">
                  عندك منتوج فلاحي وتحتاج توصلو لزبونك؟<br/>
                  نحن في ElGhella نوفر لك خدمة توصيل موثوقة، سريعة وآمنة، من أرضك مباشرة إلى باب الزبون، مهما كانت المسافة.
                </p>
                
                <ul className="text-blue-300 mb-3 text-right list-none pr-0 drop-shadow text-sm md:text-base space-y-1">
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    نوع المنتوج
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    نقطة الانطلاق (البلدية والولاية)
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    نقطة الوصول
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    الكمية التقريبية
                  </li>
                  <li className="flex items-center justify-end gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    الوقت المطلوب للتوصيل
                  </li>
                </ul>
                
                <div className="bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-lg p-3 mb-3 w-full">
                  <p className="text-blue-100 drop-shadow text-sm md:text-base leading-relaxed">
                    ⏰ التوصيل متاح يوميًا من 08:00 إلى 18:00<br/>
                    📱 للتواصل: 0797339451
                  </p>
                </div>
                
                <button className="mt-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg text-sm md:text-base group-hover:shadow-blue-500/25 group-hover:scale-105 flex items-center gap-2">
                  <span>تواصل معنا</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                
                <p className="text-blue-200 font-bold mt-3 drop-shadow text-sm md:text-base leading-tight">
                  خدمة مثالية للفلاحين، التجار، وأصحاب المطاعم. دعنا نوصّل عنك، وركّز أنت على الإنتاج.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <div className="h-4 bg-gradient-to-br from-gray-900 to-gray-800"></div>
      <div id="services" className="py-16 md:py-20 font-['NeoSansArabicRegular']">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold font-['NeoSansArabicBold'] text-green-200 mb-4 leading-tight">
            خدماتنا
          </h2>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-['NeoSansArabicLight']">
            نقدم مجموعة متكاملة من الخدمات الزراعية لدعم المزارعين وتعزيز الإنتاجية
          </p>
        </div>



        {/* Service Cards Grid */}
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group relative w-full max-w-[400px] h-[500px] bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-700/50 hover:border-green-500/50 hover:scale-105"
            >
              {/* Background Image with Enhanced Effects */}
              <div className="absolute inset-0 overflow-hidden">
                <img 
                  src={service.image || "/assets/land01.jpg"} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent group-hover:from-black/50 group-hover:via-black/20 transition-all duration-500"></div>
              </div>
              
              {/* Floating Icon Badge */}
              <div className="absolute top-4 right-4 z-20">
                <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-green-500/30 transition-all duration-300 shadow-lg">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{service.emoji}</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-right">
                {/* Service Title */}
                <h3 className="text-xl font-bold font-['NeoSansArabicMedium'] text-green-200 mb-3 group-hover:text-green-100 transition-colors duration-300 drop-shadow-lg">
                  {service.title}
                </h3>
                
                {/* Service Description */}
                <p className="text-sm text-gray-300 rtl leading-relaxed font-['NeoSansArabicLight'] mb-4 drop-shadow-md group-hover:text-gray-200 transition-colors duration-300">
                  {service.description}
                </p>
                
                {/* Action Button */}
                <div className="flex justify-end">
                  <button className="bg-gradient-to-r from-green-600/90 to-green-700/90 hover:from-green-500 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 shadow-lg group-hover:shadow-green-500/25 group-hover:scale-105 flex items-center gap-2 backdrop-blur-sm border border-green-500/20">
                    <span className="text-sm">استكشف</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
                
                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[50px] border-l-transparent border-t-[50px] border-t-green-500/30 group-hover:border-t-green-500/50 transition-all duration-300"></div>
            </Link>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div id="our-story" className="py-16 md:py-20 font-NeoSansArabicLight">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center space-y-8 lg:space-y-0 lg:space-x-12">
            <div className="lg:w-1/2 flex justify-center space-x-4 md:space-x-8">
              <div className="w-1/2 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-xl rounded-xl overflow-hidden">
                <img 
                  src="/assets/land002.jpg" 
                  alt="Story Image 2" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="w-1/2 transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 shadow-lg hover:shadow-xl rounded-xl overflow-hidden">
                <img 
                  src="/assets/land01.jpg" 
                  alt="Story Image 1" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="lg:w-1/2 text-center lg:text-right space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-green-200 mb-4 leading-tight font-NeoSansArabicBlack">
                قصتنا
              </h2>
              <div className="space-y-4">
                <p className="text-base md:text-lg text-gray-300 rtl leading-relaxed font-NeoSansArabicRegular">
                  وُلدت فكرتنا من شغفنا العميق بالزراعة والإيمان بأهميتها في بناء مستقبل مستدام. لاحظنا الحاجة إلى حلول مبتكرة ومتكاملة تخدم المزارعين وتدعم محبي الزراعة لتحقيق أفضل النتائج.
                </p>
                <p className="text-base md:text-lg text-gray-300 rtl leading-relaxed font-NeoSansArabicRegular">
                  بدأنا كشركة ناشئة، الأولى من نوعها، لتقديم خدمات زراعية واستشارات متخصصة تجمع بين الخبرة التقنية والابتكار. نحن هنا لنكون شريكك الموثوق، نقدم الدعم اللازم لتحويل رؤيتك الزراعية إلى واقع، سواء كنت مزارعًا خبيرًا أو مبتدئًا في هذا المجال. في رحلتنا، نطمح لبناء مجتمع زراعي مستدام ومتقدم، ونؤمن بأن المستقبل الأفضل يبدأ بزراعة أفضل.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Company Section */}
      <div className="py-16 md:py-20 font-['NeoSansArabicRegular']">
        <div className="container mx-auto px-4 max-w-6xl" dir="rtl">
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between space-y-8 sm:space-y-0 sm:space-x-12">
            <div className="sm:w-1/2 text-right space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold font-['NeoSansArabicBold'] text-green-200 mb-6 leading-tight">
                عن شركتنا
              </h2>
              <div className="space-y-4">
                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-['NeoSansArabicLight']">
                  نحن شركة ناشئة متخصصة في الزراعة والخدمات الزراعية والاستشارات، نسعى لتمكين المزارعين والأفراد المهتمين بالزراعة من تحقيق إنتاجية أعلى ونتائج مستدامة.
                </p>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-['NeoSansArabicLight']">
                  تأسست شركتنا على أساس رؤية واضحة: تقديم حلول مبتكرة وشاملة تعزز من جودة الإنتاج الزراعي وتدعم مجتمع المزارعين. نحن نؤمن بأن الزراعة ليست مجرد مهنة، بل هي رسالة لبناء مستقبل أكثر خضرة واستدامة.
                </p>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-['NeoSansArabicLight']">
                  فريقنا يضم مجموعة من الخبراء في المجال الزراعي، الذين يجمعون بين المعرفة العملية والرؤية المستقبلية لتقديم خدمات واستشارات مصممة خصيصًا لتلبية احتياجاتك.
                </p>
                <p className="text-base md:text-lg text-gray-300 leading-relaxed font-['NeoSansArabicLight']">
                  معنا، الزراعة ليست فقط عملًا، بل أسلوب حياة نطمح إلى تحسينه باستمرار.
                </p>
              </div>
            </div>
            <div className="sm:w-1/2 flex justify-center mb-8 sm:mb-0">
              <div className="w-full max-w-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl overflow-hidden">
                <img 
                  src="/assets/pexels-tomfisk-1595104.jpg" 
                  alt="About Us" 
                  className="w-full h-auto object-contain" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">الغلة</h3>
              </div>
              <p className="text-white/70">منصة المزارعين الأولى في الجزائر</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-300">السوق</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/land" className="hover:text-green-300 transition-colors">الأراضي</Link></li>
                <li><Link href="/marketplace" className="hover:text-green-300 transition-colors">المنتجات</Link></li>
                <li><Link href="/equipment" className="hover:text-green-300 transition-colors">المعدات</Link></li>
                <li><Link href="/nurseries" className="hover:text-green-300 transition-colors">المشاتل</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-300">الخدمات</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/delivery" className="hover:text-green-300 transition-colors">التوصيل</Link></li>
                <li><Link href="/exports" className="hover:text-green-300 transition-colors">التصدير</Link></li>
                <li><Link href="/analysis" className="hover:text-green-300 transition-colors">التحليل</Link></li>
                <li><Link href="/experts" className="hover:text-green-300 transition-colors">الاستشارات</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-green-300">تواصل معنا</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/about" className="hover:text-green-300 transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="hover:text-green-300 transition-colors">اتصل بنا</Link></li>
                <li><Link href="/help" className="hover:text-green-300 transition-colors">المساعدة</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 منصة الغلة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
