'use client';

import React, { useState, useEffect } from 'react';

const MarketStats: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    products: 0,
    transactions: 0,
    satisfaction: 0
  });

  const stats = [
    {
      label: 'مستخدم نشط',
      value: 50000,
      suffix: '+',
      icon: 'fas fa-users',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      label: 'منتج متاح',
      value: 15000,
      suffix: '+',
      icon: 'fas fa-box',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      label: 'معاملة مكتملة',
      value: 25000,
      suffix: '+',
      icon: 'fas fa-handshake',
      color: 'from-purple-500 to-pink-500'
    },
    {
      label: 'معدل الرضا',
      value: 98,
      suffix: '%',
      icon: 'fas fa-star',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('market-stats');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      const interval = setInterval(() => {
        setCounts(prev => ({
          users: Math.min(prev.users + Math.ceil(50000 / steps), 50000),
          products: Math.min(prev.products + Math.ceil(15000 / steps), 15000),
          transactions: Math.min(prev.transactions + Math.ceil(25000 / steps), 25000),
          satisfaction: Math.min(prev.satisfaction + Math.ceil(98 / steps), 98)
        }));
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <div id="market-stats" className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all duration-500 transform hover:scale-105"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <i className={`${stat.icon} text-white text-xl`}></i>
              </div>
              
              {/* Counter */}
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                {index === 0 && counts.users.toLocaleString('en-US')}
                {index === 1 && counts.products.toLocaleString('en-US')}
                {index === 2 && counts.transactions.toLocaleString('en-US')}
                {index === 3 && counts.satisfaction}
                <span className="text-emerald-400">{stat.suffix}</span>
              </div>
              
              {/* Label */}
              <p className="text-emerald-200 text-sm md:text-base font-medium">
                {stat.label}
              </p>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
          </div>
        ))}
      </div>

      {/* Trust indicators */}
      <div className="mt-12 text-center">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-white/60 text-sm">
          <div className="flex items-center">
            <i className="fas fa-shield-alt text-emerald-400 mr-2"></i>
            <span>حماية كاملة للمعاملات</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-clock text-emerald-400 mr-2"></i>
            <span>دعم 24/7</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-certificate text-emerald-400 mr-2"></i>
            <span>معتمدة من وزارة الزراعة</span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-mobile-alt text-emerald-400 mr-2"></i>
            <span>متوافقة مع جميع الأجهزة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketStats; 