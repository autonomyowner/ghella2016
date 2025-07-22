'use client';

import React from 'react';
import { useWebsiteSettings } from '@/lib/websiteSettings';

export default function TestSocialPage() {
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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">اختبار وسائل التواصل الاجتماعي</h1>
        
        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">معلومات الإعدادات الحالية:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Facebook:</strong> {settings.social_facebook || 'غير محدد'}</p>
              <p><strong>Instagram:</strong> {settings.social_instagram || 'غير محدد'}</p>
              <p><strong>TikTok:</strong> {settings.social_tiktok || 'غير محدد'}</p>
            </div>
            <div>
              <p><strong>Twitter:</strong> {settings.social_twitter || 'غير محدد'}</p>
              <p><strong>LinkedIn:</strong> {settings.social_linkedin || 'غير محدد'}</p>
              <p><strong>YouTube:</strong> {settings.social_youtube || 'غير محدد'}</p>
            </div>
          </div>
        </div>

        {/* Test Icons */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">أيقونات وسائل التواصل الاجتماعي:</h2>
          
          {/* Homepage Style Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">نمط الصفحة الرئيسية (Floating):</h3>
            <div className="flex flex-col space-y-3 w-fit">
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 border border-gray-300 hover:border-blue-500"
                  title="تابعنا على LinkedIn"
                >
                  <i className="fab fa-linkedin-in text-gray-700 text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all duration-300 border border-gray-300 hover:border-red-500"
                  title="تابعنا على YouTube"
                >
                  <i className="fab fa-youtube text-gray-700 text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_tiktok && (
                <a
                  href={settings.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-black hover:scale-110 transition-all duration-300 border border-gray-300 hover:border-gray-800"
                  title="تابعنا على TikTok"
                >
                  <i className="fab fa-tiktok text-gray-700 text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all duration-300 border border-gray-300 hover:border-blue-500"
                  title="تابعنا على Facebook"
                >
                  <i className="fab fa-facebook-f text-gray-700 text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:scale-110 transition-all duration-300 border border-gray-300 hover:border-purple-500"
                  title="تابعنا على Instagram"
                >
                  <i className="fab fa-instagram text-gray-700 text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center hover:bg-blue-400 hover:scale-110 transition-all duration-300 border border-gray-300 hover:border-blue-400"
                  title="تابعنا على Twitter"
                >
                  <i className="fab fa-twitter text-gray-700 text-lg group-hover:text-white"></i>
                </a>
              )}
            </div>
          </div>

          {/* Footer Style Icons */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">نمط التذييل (Footer):</h3>
            <div className="flex space-x-4 space-x-reverse">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على Facebook"
                >
                  <i className="fab fa-facebook-f text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على Instagram"
                >
                  <i className="fab fa-instagram text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_tiktok && (
                <a
                  href={settings.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-black hover:bg-gray-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على TikTok"
                >
                  <i className="fab fa-tiktok text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على Twitter"
                >
                  <i className="fab fa-twitter text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على LinkedIn"
                >
                  <i className="fab fa-linkedin-in text-white text-lg group-hover:text-white"></i>
                </a>
              )}
              {settings.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-12 h-12 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  title="تابعنا على YouTube"
                >
                  <i className="fab fa-youtube text-white text-lg group-hover:text-white"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">تعليمات:</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>إذا لم تظهر الأيقونات، تأكد من وجود روابط في قاعدة البيانات</li>
            <li>اذهب إلى <code className="bg-blue-100 px-2 py-1 rounded">/admin/settings</code> لتحديث الروابط</li>
            <li>اضغط <code className="bg-blue-100 px-2 py-1 rounded">Ctrl + Shift + R</code> لتحديث الصفحة</li>
            <li>تأكد من تحميل Font Awesome في الصفحة</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
