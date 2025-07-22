'use client';

import React from 'react';
import { useWebsiteSettings } from '@/lib/websiteSettings';

export default function TestHomepagePage() {
  const { settings, loading } = useWebsiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          اختبار الصفحة الرئيسية
        </h1>
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">معلومات الإعدادات:</h2>
          <div className="space-y-3">
            <div>
              <strong>عنوان الموقع:</strong> {settings.site_title}
            </div>
            <div>
              <strong>وصف الموقع:</strong> {settings.site_description}
            </div>
            <div>
              <strong>عنوان الصفحة الرئيسية:</strong> {settings.homepage_title}
            </div>
            <div>
              <strong>نص الصفحة الرئيسية الفرعي:</strong> 
              <span className="text-emerald-600 font-medium"> {settings.homepage_subtitle}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">محاكاة الصفحة الرئيسية:</h2>
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-gray-800 mb-4">
              {settings.homepage_title}
            </h1>
            <p className="text-xl md:text-2xl text-emerald-600 mb-6">
              {settings.homepage_subtitle}
            </p>
          </div>
        </div>

        <div className="text-center">
          <a 
            href="/" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            العودة للصفحة الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
} 
