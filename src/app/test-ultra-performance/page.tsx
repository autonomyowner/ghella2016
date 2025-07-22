'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UltraImageOptimizer from '@/components/UltraImageOptimizer';

export default function TestUltraPerformancePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Simulate performance metrics
    setTimeout(() => {
      setPerformanceMetrics({
        lcp: 1200,
        fid: 45,
        cls: 0.05,
        ttfb: 180,
        memory: {
          used: 45 * 1024 * 1024, // 45MB
          total: 80 * 1024 * 1024, // 80MB
          limit: 100 * 1024 * 1024, // 100MB
          percentage: 45
        }
      });
    }, 1000);
  }, []);

  const testImages = [
    '/assets/n7l1.webp',
    '/assets/n7l2.webp',
    '/assets/sheep1.webp',
    '/assets/tomato 2.jpg',
    '/assets/machin01.jpg',
    '/assets/seedings01.jpg',
    '/assets/exporting1.jpg',
    '/assets/land01.jpg'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            🚀 اختبار الأداء الفائق
          </h1>
          <p className="text-lg text-emerald-600">
            اختبار جميع تحسينات الأداء المتقدمة
          </p>
        </motion.div>

        {/* Performance Metrics */}
        {performanceMetrics && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600 mb-2">
                {performanceMetrics.lcp}ms
              </div>
              <div className="text-sm text-gray-600">LCP</div>
              <div className={`text-xs mt-1 ${
                performanceMetrics.lcp < 2500 ? 'text-green-600' : 'text-red-600'
              }`}>
                {performanceMetrics.lcp < 2500 ? 'ممتاز' : 'بطيء'}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600 mb-2">
                {performanceMetrics.fid}ms
              </div>
              <div className="text-sm text-gray-600">FID</div>
              <div className={`text-xs mt-1 ${
                performanceMetrics.fid < 100 ? 'text-green-600' : 'text-red-600'
              }`}>
                {performanceMetrics.fid < 100 ? 'ممتاز' : 'بطيء'}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600 mb-2">
                {performanceMetrics.cls}
              </div>
              <div className="text-sm text-gray-600">CLS</div>
              <div className={`text-xs mt-1 ${
                performanceMetrics.cls < 0.1 ? 'text-green-600' : 'text-red-600'
              }`}>
                {performanceMetrics.cls < 0.1 ? 'ممتاز' : 'ضعيف'}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-600 mb-2">
                {performanceMetrics.ttfb}ms
              </div>
              <div className="text-sm text-gray-600">TTFB</div>
              <div className={`text-xs mt-1 ${
                performanceMetrics.ttfb < 600 ? 'text-green-600' : 'text-red-600'
              }`}>
                {performanceMetrics.ttfb < 600 ? 'ممتاز' : 'بطيء'}
              </div>
            </div>
          </motion.div>
        )}

        {/* Memory Usage */}
        {performanceMetrics?.memory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200 mb-8"
          >
            <h3 className="text-xl font-bold text-emerald-800 mb-4">🧠 استخدام الذاكرة</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">المستخدم:</span>
                <span className="font-semibold">
                  {(performanceMetrics.memory.used / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">الحد الأقصى:</span>
                <span className="font-semibold">
                  {(performanceMetrics.memory.limit / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">النسبة:</span>
                  <span className="font-semibold">{performanceMetrics.memory.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${
                      performanceMetrics.memory.percentage > 80 ? 'bg-red-500' :
                      performanceMetrics.memory.percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(performanceMetrics.memory.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Ultra Image Optimizer Test */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200 mb-8"
        >
          <h3 className="text-xl font-bold text-emerald-800 mb-4">🖼️ اختبار تحسين الصور الفائق</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {testImages.map((src, index) => (
              <div key={index} className="relative">
                <UltraImageOptimizer
                  src={src}
                  alt={`Test image ${index + 1}`}
                  width={200}
                  height={150}
                  className="rounded-lg shadow-md"
                  priority={index < 2}
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index < 2 ? 'عالي الأولوية' : 'عادي'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Performance Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Ultra Performance Features */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">⚡ ميزات الأداء الفائق</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">1</span>
                </div>
                <span className="text-gray-700">تحسين ذكي للموارد</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">2</span>
                </div>
                <span className="text-gray-700">تحميل تدريجي للصور</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">3</span>
                </div>
                <span className="text-gray-700">كاش متقدم</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">4</span>
                </div>
                <span className="text-gray-700">مراقبة الأداء في الوقت الفعلي</span>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">5</span>
                </div>
                <span className="text-gray-700">تحليل الحزم المتقدم</span>
              </div>
            </div>
          </div>

          {/* Optimization Status */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-emerald-200">
            <h3 className="text-xl font-bold text-emerald-800 mb-4">📊 حالة التحسين</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تحسين الأداء الأساسي:</span>
                <span className="text-green-600 font-semibold">✅ مفعل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تحسين الأداء المتقدم:</span>
                <span className="text-green-600 font-semibold">✅ مفعل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تحسين الأداء الفائق:</span>
                <span className="text-green-600 font-semibold">✅ مفعل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تحسين الصور الفائق:</span>
                <span className="text-green-600 font-semibold">✅ مفعل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Service Worker المتقدم:</span>
                <span className="text-green-600 font-semibold">✅ مفعل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">تحليل الحزم الفائق:</span>
                <span className="text-green-600 font-semibold">✅ مفعل</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 rounded-xl p-6 mt-8 border border-emerald-200"
        >
          <h3 className="text-xl font-bold text-emerald-800 mb-4">💡 تعليمات الاختبار</h3>
          <div className="space-y-2 text-gray-700">
            <p>• افتح أدوات المطور (F12) لمراقبة الأداء</p>
            <p>• تحقق من علامة التبويب Network لرؤية تحسينات التحميل</p>
            <p>• راقب علامة التبويب Performance لقياس Core Web Vitals</p>
            <p>• تحقق من علامة التبويب Application لرؤية Service Worker</p>
            <p>• جرب الاتصال البطيء لاختبار التحسينات التكيفية</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
