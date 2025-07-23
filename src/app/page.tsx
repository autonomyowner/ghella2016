'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useWebsiteSettings } from '@/lib/websiteSettings';
import UnifiedSearch from '@/components/UnifiedSearch';
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
  CalendarCheck
} from 'lucide-react';

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

  // Prevent hydration mismatch with proper layout preservation
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800">
        {/* Preserve layout structure to prevent CLS */}
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="text-8xl mb-8">🚜</div>
              <div className="text-5xl lg:text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                الغلة
              </div>
              <div className="text-xl lg:text-2xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
                منصة التكنولوجيا الزراعية
              </div>
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-emerald-300 font-semibold">جاري التحميل...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
      title: "خدمات التوصيل",
      description: "توصيل المنتجات للمنازل",
      icon: Truck,
      href: "/delivery",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      emoji: "🚚"
    },
    {
      title: "خدمات التصدير",
      description: "تصدير المنتجات للخارج",
      icon: Ship,
      href: "/exports",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      emoji: "🚢"
    },
    {
      title: "التحليل بالأقمار الصناعية",
      description: "دراسة الأراضي والتربة",
      icon: Satellite,
      href: "/analysis",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      emoji: "🛰️"
    },
    {
      title: "الاستشارات الزراعية",
      description: "خبراء متخصصون",
      icon: Users,
      href: "/experts",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      emoji: "👨‍🌾"
    }
  ];

  const stats = [
    { number: "10,000+", label: "مزارع نشط", icon: "🌾" },
    { number: "50,000+", label: "معاملة مكتملة", icon: "✅" },
    { number: "4.8", label: "تقييم المستخدمين", icon: "⭐" },
    { number: "24/7", label: "دعم متواصل", icon: "🛡️" }
  ];

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
      <section className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/seedings01.jpg)',
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Icon Animation */}
          <div className="text-8xl mb-8 drop-shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
            🌾
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            {settings?.homepage_title || "سوق المزارعين الأول في الجزائر"}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {settings?.homepage_subtitle || "بيع وشراء الأراضي، المنتجات، المشاتل والمعدات الزراعية بسهولة وأمان"}
          </p>
          
          {/* Search Bar */}
          <div className="mb-8">
            <UnifiedSearch variant="homepage" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/marketplace"
              className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              ابدأ البيع والشراء
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link
              href="/land"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              استكشف الأراضي
            </Link>
            <Link
              href="/equipment"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              استكشف المعدات
            </Link>
            <Link
              href="/marketplace"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              استكشف السوق
            </Link>
            <Link
              href="/nurseries"
              className="px-8 py-4 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-full hover:bg-white/20 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              استكشف الشتلات
            </Link>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-emerald-300 mb-1">{stat.number}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketplaceCategories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group relative aspect-[4/5] rounded-lg overflow-hidden hover:scale-105 transition-all duration-300 transform hover:shadow-2xl"
              >
                {/* Full Card Background Image with proper aspect ratio */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: `url('${category.image}')`,
                    aspectRatio: '4/5'
                  }}
                >
                  {/* Dark overlay for better text readability */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-300"></div>
                </div>
                
                {/* Card Content Overlay */}
                <div className="relative z-10 h-full flex flex-col justify-between p-6">
                  {/* Top Section */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-4xl drop-shadow-lg">{category.emoji}</div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{category.title}</h3>
                    <p className="text-white/90 mb-3 text-sm drop-shadow-md">{category.description}</p>
                  </div>
                  
                  {/* Bottom Section */}
                  <div>
                    {/* Features */}
                    <div className="flex gap-2 flex-wrap mb-3">
                      {category.features.map((feature, idx) => (
                        <span key={idx} className="bg-emerald-600/30 backdrop-blur-sm text-emerald-100 px-2 py-1 rounded text-xs border border-emerald-500/30">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-sm text-emerald-300 font-medium mb-4 drop-shadow-md">{category.count}</p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex-1 flex items-center justify-center transition-colors shadow-lg">
                        <CalendarCheck className="w-4 h-4 mr-2" />
                        استكشف
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-lg transition-colors border border-white/30">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-lg transition-colors border border-white/30">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-300 mb-4">خدماتنا الإضافية</h2>
            <p className="text-xl text-white/80">خدمات متكاملة لدعم المزارعين</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-16 h-16 ${service.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-3xl">{service.emoji}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-white/70 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-emerald-300 mb-4">لماذا تختار منصة الغلة؟</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">آمن وموثوق</h3>
              <p className="text-white/70">جميع المعاملات محمية ومؤمنة بأحدث تقنيات الأمان</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">سريع وسهل</h3>
              <p className="text-white/70">بيع وشراء في دقائق معدودة بواجهة بسيطة وسهلة الاستخدام</p>
            </div>

            <div className="text-center bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all duration-300">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">جودة عالية</h3>
              <p className="text-white/70">منتجات وأراضي مضمونة الجودة مع نظام تقييم متطور</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 space-x-reverse mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">الغلة</h3>
              </div>
              <p className="text-white/70">منصة المزارعين الأولى في الجزائر</p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-emerald-300">السوق</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/land" className="hover:text-emerald-300 transition-colors">الأراضي</Link></li>
                <li><Link href="/marketplace" className="hover:text-emerald-300 transition-colors">المنتجات</Link></li>
                <li><Link href="/equipment" className="hover:text-emerald-300 transition-colors">المعدات</Link></li>
                <li><Link href="/nurseries" className="hover:text-emerald-300 transition-colors">المشاتل</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-emerald-300">الخدمات</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/delivery" className="hover:text-emerald-300 transition-colors">التوصيل</Link></li>
                <li><Link href="/exports" className="hover:text-emerald-300 transition-colors">التصدير</Link></li>
                <li><Link href="/analysis" className="hover:text-emerald-300 transition-colors">التحليل</Link></li>
                <li><Link href="/experts" className="hover:text-emerald-300 transition-colors">الاستشارات</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-emerald-300">تواصل معنا</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/about" className="hover:text-emerald-300 transition-colors">من نحن</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-300 transition-colors">اتصل بنا</Link></li>
                <li><Link href="/help" className="hover:text-emerald-300 transition-colors">المساعدة</Link></li>
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
