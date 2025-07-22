'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => <div /> });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false, loading: () => <button /> });;

export default function MarketplacePage() {
  const marketplaceCards = [
    {
      title: 'الحيوانات',
      link: '/animals',
      image: '/assets/sheep1.webp',
      description: 'تصفح وشراء الحيوانات الزراعية'
    },
    {
      title: 'الخضار',
      link: '/VAR/marketplace',
      image: '/assets/tomato 2.jpg',
      description: 'منتجات الخضار الطازجة'
    },
    {
      title: 'المعدات',
      link: '/equipment',
      image: '/assets/machin01.jpg',
      description: 'معدات وآلات زراعية'
    },
    {
      title: 'الشتلات',
      link: '/nurseries',
      image: '/assets/seedings01.jpg',
      description: 'شتلات وبذور زراعية'
    },
    {
      title: 'التصدير',
      link: '/exports',
      image: '/assets/exporting1.jpg',
      description: 'خدمات التصدير الزراعي'
    },
    {
      title: 'الاراضي',
      link: '/land',
      image: '/assets/land01.jpg',
      description: 'أراضي زراعية للبيع والإيجار'
    }
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-teal-600/20 animate-pulse z-0"></div>
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white py-3 px-4 text-center text-sm font-semibold relative overflow-hidden">
        <MotionDiv
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          🌟 منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد | 
          <Link href="/equipment/new" className="underline hover:no-underline ml-2 font-bold text-yellow-300 hover:text-yellow-200 transition-colors">
            أضف إعلانك الآن
          </Link>
        </MotionDiv>
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-teal-600/20 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Full-Screen Cards Grid */}
      <div className="relative h-[calc(100vh-3rem)] w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 z-10">
        {marketplaceCards.map((card, index) => (
          <MotionDiv
            key={card.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            className="group relative h-full"
          >
            <Link href={card.link}>
              <div className="relative h-full w-full overflow-hidden cursor-pointer">
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${card.image}')` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 group-hover:via-black/30 transition-all duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 text-white">
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                    {card.title}
                  </h3>
                  <p className="text-white/90 text-lg md:text-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300 max-w-xs">
                    {card.description}
                  </p>
                  
                  {/* Arrow Icon */}
                  <div className="mt-6 flex items-center text-emerald-300 group-hover:text-emerald-200 transition-colors duration-300">
                    <span className="text-lg font-medium ml-3">استكشف الآن</span>
                    <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </MotionDiv>
        ))}
      </div>
    </div>
  );
}
