'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Premium components with lazy loading
const PremiumBackground = dynamic(() => import('@/components/PremiumBackground'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900" />
  )
});

const PremiumHeader = dynamic(() => import('@/components/PremiumHeader'), {
  ssr: false,
  loading: () => <div className="h-20 bg-black/20 backdrop-blur-lg animate-pulse" />
});

// Premium loading component
const PremiumLoadingSpinner = () => (
  <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-teal-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <p className="text-emerald-300 font-semibold text-lg">جاري تحميل خدمات الغلة...</p>
      <p className="text-emerald-400 text-sm mt-2">أفضل منصة خدمات زراعية في الجزائر</p>
    </div>
  </div>
);

// Main services data
const premiumServices = [
  {
    id: 'consultation',
    title: 'الاستشارات الزراعية',
    subtitle: 'ربط الخبراء بالمزارعين',
    description: 'منصة ربط متطورة تجمع بين الخبراء الزراعيين الحاصلين على شهادات معتمدة والمزارعين المحتاجين للاستشارات المتخصصة.',
    icon: '👨‍🌾',
    color: 'from-emerald-500 to-teal-500',
    features: [
      'خبراء معتمدون من وزارة الزراعة',
      'استشارات مباشرة عبر المنصة',
      'تقييم مجاني للمشاريع',
      'متابعة مستمرة للنتائج'
    ],
    benefits: [
      'للخبراء: انضم كخبير واستقبل طلبات العملاء مباشرة',
      'للمزارعين: احصل على استشارات من خبراء معتمدين',
      'نظام تقييم ومراجعات موثوق',
      'دفع آمن ومضمون'
    ],
    cta: {
      expert: 'انضم كخبير',
      customer: 'احصل على استشارة',
      expertLink: '/expert/register',
      customerLink: '/consultation'
    },
    stats: {
      experts: '500+',
      consultations: '2000+',
      satisfaction: '98%'
    }
  },
  {
    id: 'delivery',
    title: 'خدمات التوصيل',
    subtitle: 'شبكة توصيل تغطي 58 ولاية',
    description: 'خدمة توصيل سريعة وآمنة تغطي جميع ولايات الجزائر الـ 58، مع ضمان وصول المنتجات طازجة وفي الوقت المحدد.',
    icon: '🚚',
    color: 'from-blue-500 to-cyan-500',
    features: [
      'توصيل لجميع الولايات الـ 58',
      'تتبع مباشر للشحنات',
      'توصيل في نفس اليوم',
      'ضمان جودة المنتجات'
    ],
    benefits: [
      'للمزارعين: باع منتجاتك في جميع أنحاء الجزائر',
      'للمشترين: احصل على منتجات طازجة من أي ولاية',
      'أسعار تنافسية وشفافة',
      'تأمين شامل على الشحنات'
    ],
    cta: {
      seller: 'ابدأ البيع',
      buyer: 'اطلب توصيل',
      sellerLink: '/delivery/seller',
      buyerLink: '/delivery/buyer'
    },
    stats: {
      wilayas: '58',
      deliveries: '15000+',
      satisfaction: '96%'
    }
  },
  {
    id: 'analysis',
    title: 'خدمات التحليل والدراسات',
    subtitle: 'فريق متخصص للدراسات الميدانية',
    description: 'فريق متخصص من الخبراء يقدم دراسات ميدانية شاملة للأراضي والمشاريع الزراعية مع تقارير مفصلة وتوصيات عملية.',
    icon: '🔬',
    color: 'from-purple-500 to-pink-500',
    features: [
      'دراسات ميدانية شاملة',
      'تحليل التربة والمياه',
      'توصيات مفصلة ومفصلة',
      'تقارير احترافية'
    ],
    benefits: [
      'تحليل شامل للتربة والمياه',
      'توصيات مفصلة للمحاصيل المناسبة',
      'دراسات الجدوى الاقتصادية',
      'متابعة وتقييم النتائج'
    ],
    cta: {
      request: 'اطلب دراسة',
      contact: 'تواصل معنا',
      requestLink: '/analysis/request',
      contactLink: '/contact'
    },
    stats: {
      studies: '300+',
      accuracy: '99%',
      satisfaction: '97%'
    }
  },
  {
    id: 'expert-consultation',
    title: 'خبراء الغلة للاستشارات المتقدمة',
    subtitle: 'استشارات متخصصة للمشاريع الكبرى',
    description: 'خدمة استشارات متقدمة للمشاريع الزراعية الكبرى والبنوك والمستثمرين، مع دراسات معمقة وإمكانيات الاستثمار.',
    icon: '🏢',
    color: 'from-orange-500 to-red-500',
    features: [
      'دراسات استثمارية معمقة',
      'تقييم إمكانيات الأراضي',
      'تقارير مالية مفصلة',
      'استشارات للبنوك والمستثمرين'
    ],
    benefits: [
      'للمستثمرين: تقييم دقيق لإمكانيات الاستثمار',
      'للبنوك: دراسات موثوقة لتمويل المشاريع',
      'تقارير مالية وإدارية شاملة',
      'متابعة المشاريع حتى النجاح'
    ],
    cta: {
      investor: 'للمستثمرين',
      bank: 'للبنوك',
      investorLink: '/expert/investor',
      bankLink: '/expert/bank'
    },
    stats: {
      projects: '50+',
      investment: '2M+ دج',
      success: '95%'
    }
  }
];

export default function ServicesPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    // Auto-rotate through services
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % premiumServices.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('services-section');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  if (!isHydrated) {
    return <PremiumLoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-7xl mx-auto">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            خدمات معتمدة من وزارة الزراعة الجزائرية
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-tight">
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent">
              خدمات الغلة المتطورة
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-emerald-200 mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto">
            منصة متكاملة تقدم حلول زراعية متطورة تغطي جميع احتياجات المزارعين والمستثمرين في الجزائر
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12">
            <Link
              href="#services"
              className="group px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center"
            >
              <i className="fas fa-rocket mr-3 group-hover:rotate-12 transition-transform duration-300"></i>
              اكتشف خدماتنا
            </Link>
            
            <Link
              href="/contact"
              className="group px-8 py-4 md:px-12 md:py-5 bg-transparent border-2 border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <i className="fas fa-phone mr-3 group-hover:scale-110 transition-transform duration-300"></i>
              تواصل معنا
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">58</div>
              <div className="text-emerald-200 text-sm">ولاية مغطاة</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">500+</div>
              <div className="text-emerald-200 text-sm">خبير معتمد</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">2000+</div>
              <div className="text-emerald-200 text-sm">مشروع ناجح</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">98%</div>
              <div className="text-emerald-200 text-sm">رضا العملاء</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              خدماتنا <span className="text-emerald-400">المتميزة</span>
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              أربع خدمات رئيسية تغطي جميع احتياجات القطاع الزراعي في الجزائر
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {premiumServices.map((service, index) => (
              <div
                key={service.id}
                className={`group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-500 transform hover:scale-105 ${
                  activeService === index 
                    ? 'border-emerald-400/50 shadow-2xl shadow-emerald-500/20' 
                    : 'border-white/20 hover:border-emerald-400/30'
                }`}
                onClick={() => setActiveService(index)}
              >
                {/* Active background */}
                {activeService === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                )}
                
                <div className="relative z-10">
                  {/* Icon and Title */}
                  <div className="flex items-start space-x-4 space-x-reverse mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <span className="text-2xl">{service.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                      <p className="text-emerald-300 text-sm">{service.subtitle}</p>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-emerald-200 mb-6 leading-relaxed">{service.description}</p>
                  
                  {/* Features */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                        <span className="text-emerald-200">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center mb-6">
                    {Object.entries(service.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-emerald-400">{value}</div>
                        <div className="text-xs text-emerald-300">
                          {key === 'experts' && 'خبير'}
                          {key === 'consultations' && 'استشارة'}
                          {key === 'satisfaction' && 'رضا'}
                          {key === 'wilayas' && 'ولاية'}
                          {key === 'deliveries' && 'توصيل'}
                          {key === 'studies' && 'دراسة'}
                          {key === 'accuracy' && 'دقة'}
                          {key === 'projects' && 'مشروع'}
                          {key === 'investment' && 'استثمار'}
                          {key === 'success' && 'نجاح'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                                     {/* CTA Buttons */}
                   <div className="flex gap-3">
                     <Link
                       href={service.cta.expertLink || service.cta.sellerLink || service.cta.requestLink || service.cta.investorLink || '#'}
                       className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 text-center"
                     >
                       {service.cta.expert || service.cta.seller || service.cta.request || service.cta.investor}
                     </Link>
                     <Link
                       href={service.cta.customerLink || service.cta.buyerLink || service.cta.contactLink || service.cta.bankLink || '#'}
                       className="flex-1 px-4 py-2 bg-transparent border border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 text-center"
                     >
                       {service.cta.customer || service.cta.buyer || service.cta.contact || service.cta.bank}
                     </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Showcase */}
      <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-black/50 to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Service Details */}
            <div className="space-y-8">
              <div className="text-center lg:text-right">
                <div className={`w-24 h-24 bg-gradient-to-br ${premiumServices[activeService].color} rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-2xl`}>
                  <span className="text-4xl">{premiumServices[activeService].icon}</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{premiumServices[activeService].title}</h3>
                <p className="text-emerald-200 text-lg leading-relaxed">{premiumServices[activeService].description}</p>
              </div>
              
              {/* Benefits */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-emerald-400 mb-4">المزايا الرئيسية:</h4>
                {premiumServices[activeService].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 space-x-reverse">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-emerald-200 leading-relaxed">{benefit}</p>
                  </div>
                ))}
              </div>
              
                             {/* CTA */}
               <div className="flex flex-col sm:flex-row gap-4">
                 <Link
                   href={premiumServices[activeService].cta.expertLink || premiumServices[activeService].cta.sellerLink || premiumServices[activeService].cta.requestLink || premiumServices[activeService].cta.investorLink || '#'}
                   className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 text-center"
                 >
                   {premiumServices[activeService].cta.expert || premiumServices[activeService].cta.seller || premiumServices[activeService].cta.request || premiumServices[activeService].cta.investor}
                 </Link>
                 <Link
                   href={premiumServices[activeService].cta.customerLink || premiumServices[activeService].cta.buyerLink || premiumServices[activeService].cta.contactLink || premiumServices[activeService].cta.bankLink || '#'}
                   className="px-8 py-4 bg-transparent border-2 border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 text-center"
                 >
                   {premiumServices[activeService].cta.customer || premiumServices[activeService].cta.buyer || premiumServices[activeService].cta.contact || premiumServices[activeService].cta.bank}
                 </Link>
               </div>
            </div>

            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className={`w-32 h-32 bg-gradient-to-br ${premiumServices[activeService].color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
                    <span className="text-6xl">{premiumServices[activeService].icon}</span>
                  </div>
                  
                  {/* Stats Display */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {Object.entries(premiumServices[activeService].stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-2xl font-bold text-emerald-400 mb-1">{value}</div>
                        <div className="text-xs text-emerald-300">
                          {key === 'experts' && 'خبير'}
                          {key === 'consultations' && 'استشارة'}
                          {key === 'satisfaction' && 'رضا'}
                          {key === 'wilayas' && 'ولاية'}
                          {key === 'deliveries' && 'توصيل'}
                          {key === 'studies' && 'دراسة'}
                          {key === 'accuracy' && 'دقة'}
                          {key === 'projects' && 'مشروع'}
                          {key === 'investment' && 'استثمار'}
                          {key === 'success' && 'نجاح'}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-emerald-200 text-sm leading-relaxed">
                    {premiumServices[activeService].subtitle}
                  </p>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-60 animate-ping"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-teal-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
            ابدأ <span className="text-emerald-400">رحلتك</span> معنا اليوم
          </h2>
          <p className="text-xl text-emerald-200 mb-12 leading-relaxed">
            انضم إلى آلاف المزارعين والخبراء الذين يثقون بمنصة الغلة لتطوير مشاريعهم الزراعية
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/signup"
              className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30"
            >
              <i className="fas fa-rocket mr-3"></i>
              ابدأ الآن مجاناً
            </Link>
            <Link
              href="/contact"
              className="px-10 py-5 bg-transparent border-2 border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-phone mr-3"></i>
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
