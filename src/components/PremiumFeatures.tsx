'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const PremiumFeatures: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: 'الذكاء الاصطناعي',
      subtitle: 'تحليل متقدم للبيانات الزراعية',
      description: 'نستخدم أحدث تقنيات الذكاء الاصطناعي لتحليل البيانات الزراعية وتقديم توصيات ذكية لتحسين الإنتاجية وتقليل التكاليف.',
      icon: 'fas fa-brain',
      color: 'from-purple-500 to-pink-500',
      benefits: [
        'تحليل توقعات الطقس',
        'توصيات الري الذكية',
        'تحسين استخدام الأسمدة',
        'توقع الأمراض النباتية'
      ]
    },
    {
      id: 1,
      title: 'إنترنت الأشياء',
      subtitle: 'مراقبة ذكية للمزرعة',
      description: 'أجهزة استشعار متطورة لمراقبة التربة والطقس والرطوبة في الوقت الفعلي، مع إمكانية التحكم عن بعد.',
      icon: 'fas fa-satellite-dish',
      color: 'from-blue-500 to-cyan-500',
      benefits: [
        'استشعار التربة الذكي',
        'مراقبة الطقس المباشرة',
        'تحكم عن بعد في الري',
        'تنبيهات فورية'
      ]
    },
    {
      id: 2,
      title: 'البلوك تشين',
      subtitle: 'شفافية كاملة في المعاملات',
      description: 'تقنية البلوك تشين لضمان الشفافية والأمان في جميع المعاملات، مع تتبع كامل لسلسلة الإمداد.',
      icon: 'fas fa-link',
      color: 'from-emerald-500 to-teal-500',
      benefits: [
        'تتبع المنتجات',
        'معاملات آمنة',
        'شهادات الجودة',
        'تاريخ المنتج الكامل'
      ]
    },
    {
      id: 3,
      title: 'الواقع المعزز',
      subtitle: 'تجربة تفاعلية متقدمة',
      description: 'تقنية الواقع المعزز لتصور المزرعة وتحليل البيانات بطريقة تفاعلية ومتطورة.',
      icon: 'fas fa-vr-cardboard',
      color: 'from-orange-500 to-red-500',
      benefits: [
        'تصور ثلاثي الأبعاد',
        'جولات افتراضية',
        'تحليل بصري متقدم',
        'تدريب تفاعلي'
      ]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-black/50 to-emerald-900/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            تقنيات <span className="text-emerald-400">المستقبل</span>
          </h2>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
            ندمج أحدث التقنيات العالمية لتحويل الزراعة التقليدية إلى زراعة ذكية ومستدامة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Features List */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`group cursor-pointer transition-all duration-500 ${
                  activeFeature === index ? 'scale-105' : 'scale-100'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className={`relative overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-500 ${
                  activeFeature === index 
                    ? 'border-emerald-400/50 shadow-2xl shadow-emerald-500/20' 
                    : 'border-white/20 hover:border-emerald-400/30'
                }`}>
                  {/* Active background */}
                  {activeFeature === index && (
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent"></div>
                  )}
                  
                  <div className="relative z-10 flex items-start space-x-4 space-x-reverse">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <i className={`${feature.icon} text-white text-2xl`}></i>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-emerald-300 text-sm mb-3">{feature.subtitle}</p>
                      <p className="text-emerald-200 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Feature Display */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              {/* Feature Icon */}
              <div className={`w-20 h-20 bg-gradient-to-br ${features[activeFeature].color} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl`}>
                <i className={`${features[activeFeature].icon} text-white text-3xl`}></i>
              </div>
              
              {/* Feature Title */}
              <h3 className="text-2xl font-bold text-white text-center mb-4">
                {features[activeFeature].title}
              </h3>
              
              {/* Feature Description */}
              <p className="text-emerald-200 text-center mb-8 leading-relaxed">
                {features[activeFeature].description}
              </p>
              
              {/* Benefits List */}
              <div className="space-y-3">
                <h4 className="text-emerald-300 font-semibold text-center mb-4">المزايا الرئيسية:</h4>
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span className="text-white text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              {/* CTA Button */}
              <div className="text-center mt-8">
                <Link
                  href="/demo"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <i className="fas fa-play mr-2"></i>
                  جرب التقنية الآن
                </Link>
              </div>
            </div>
            
            {/* Floating elements for premium feel */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-emerald-400 rounded-full opacity-60 animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-teal-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Technology Partners */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">شركاؤنا التقنيون</h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="text-white text-lg font-semibold">Microsoft Azure</div>
            <div className="text-white text-lg font-semibold">Google Cloud</div>
            <div className="text-white text-lg font-semibold">AWS</div>
            <div className="text-white text-lg font-semibold">IBM Watson</div>
            <div className="text-white text-lg font-semibold">Oracle</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumFeatures; 