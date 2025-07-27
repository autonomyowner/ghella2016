"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Service {
  id: number;
  title: string;
  description: string;
  features: string[];
  cta: {
    primary: string;
    secondary: string;
  };
  icon: string;
  color: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "خدمات التحليل والدراسات",
    description: "فريق متخصص من الخبراء يقدم دراسات ميدانية شاملة للأراضي والمشاريع الزراعية مع تقارير مفصلة وتوصيات عملية.",
    features: [
      "تحليل شامل للتربة والمياه",
      "توصيات مفصلة للمحاصيل المناسبة",
      "دراسات الجدوى الاقتصادية",
      "متابعة وتقييم النتائج"
    ],
    cta: {
      primary: "اطلب دراسة",
      secondary: "تواصل معنا"
    },
    icon: "🔬",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 2,
    title: "خبراء الغلة للاستشارات المتقدمة",
    description: "خدمة استشارات متقدمة للمشاريع الزراعية الكبرى والبنوك والمستثمرين، مع دراسات معمقة وإمكانيات الاستثمار.",
    features: [
      "للمستثمرين: تقييم دقيق لإمكانيات الاستثمار",
      "للبنوك: دراسات موثوقة لتمويل المشاريع",
      "تقارير مالية وإدارية شاملة",
      "متابعة المشاريع حتى النجاح"
    ],
    cta: {
      primary: "للمستثمرين",
      secondary: "للبنوك"
    },
    icon: "🏢",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 3,
    title: "خدمات التوصيل",
    description: "خدمة توصيل سريعة وآمنة تغطي جميع ولايات الجزائر الـ 58، مع ضمان وصول المنتجات طازجة وفي الوقت المحدد.",
    features: [
      "للمزارعين: باع منتجاتك في جميع أنحاء الجزائر",
      "للمشترين: احصل على منتجات طازجة من أي ولاية",
      "أسعار تنافسية وشفافة",
      "تأمين شامل على الشحنات"
    ],
    cta: {
      primary: "ابدأ البيع",
      secondary: "اطلب توصيل"
    },
    icon: "🚚",
    color: "from-blue-500 to-cyan-500"
  }
];

const serviceCategories = [
  { id: "all", label: "جميع الخدمات", icon: "🌍" },
  { id: "analysis", label: "تحليل ودراسات", icon: "🔬" },
  { id: "consultation", label: "استشارات متقدمة", icon: "🏢" },
  { id: "delivery", label: "خدمات التوصيل", icon: "🚚" }
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredServices = services.filter(service => {
    return selectedCategory === "all" || service.id.toString() === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6 arabic-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              خدمات الغلة
            </motion.h1>
            <motion.p 
              className="text-xl lg:text-2xl mb-8 opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              اربط منتجاتك بالأسواق العالمية ووسع نطاق تجارتك الزراعية
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">خدماتنا المتميزة</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              نقدم خدمات شاملة تغطي جميع احتياجات القطاع الزراعي في الجزائر
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="font-bold text-green-400 mb-2">المزايا الرئيسية:</div>
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="text-gray-300 text-xs">• {feature}</div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Details */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-yellow-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-6">تفاصيل الخدمات</h2>
            <p className="text-xl text-green-600 max-w-3xl mx-auto">
              اكتشف خدماتنا المتخصصة واختر ما يناسب احتياجاتك
            </p>
          </div>

          {/* Filters */}
          <div className="glass-arabic p-6 mb-12">
            <div className="flex flex-wrap gap-4 justify-center">
              {serviceCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`filter-chip ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <span className="ml-2">{category.icon}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="export-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-xl">{service.icon}</span>
                  </div>
                  <span className="text-green-600 font-bold text-lg">خدمة متخصصة</span>
                </div>
                
                <h3 className="text-xl font-bold text-green-800 mb-2">{service.title}</h3>
                <p className="text-green-600 mb-4">{service.description}</p>
                
                {/* Features */}
                <div className="mb-4">
                  <div className="text-sm font-bold text-green-700 mb-2">المزايا الرئيسية:</div>
                  <div className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-green-600">
                        <i className="fas fa-check text-green-500 ml-2"></i>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn-primary-arabic flex-1">
                    <i className="fas fa-handshake ml-2"></i>
                    {service.cta.primary}
                  </button>
                  <button className="btn-secondary-arabic flex-1">
                    <i className="fas fa-phone ml-2"></i>
                    {service.cta.secondary}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">لا توجد خدمات متاحة</h3>
              <p className="text-green-600 mb-6">جرب تغيير الفلاتر أو تحقق لاحقاً</p>
              <button 
                onClick={() => {
                  setSelectedCategory("all");
                }}
                className="btn-primary-arabic"
              >
                إعادة تعيين الفلاتر
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
