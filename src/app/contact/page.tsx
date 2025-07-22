'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useWebsiteSettings } from '@/lib/websiteSettings';
import Link from 'next/link';

export default function ContactPage() {
  const { settings, loading } = useWebsiteSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/" className="text-emerald-600 hover:text-emerald-700">
                <i className="fas fa-arrow-right text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">اتصل بنا</h1>
                <p className="text-emerald-600 text-sm">تواصل معنا عبر وسائل التواصل المختلفة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contact Content */}
        {settings.contact_content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="prose prose-emerald max-w-none text-right">
              <p className="text-lg text-gray-700 leading-relaxed">
                {settings.contact_content}
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-phone text-emerald-600 ml-3"></i>
              معلومات الاتصال
            </h2>
            
            <div className="space-y-4">
              {settings.contact_email && (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-envelope text-emerald-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                    <a 
                      href={`mailto:${settings.contact_email}`}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              )}
              
              {settings.contact_phone && (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-phone text-emerald-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">رقم الهاتف</p>
                    <a 
                      href={`tel:${settings.contact_phone}`}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>
              )}
              
              {settings.address && (
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-map-marker-alt text-emerald-600"></i>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">العنوان</p>
                    <p className="text-gray-800 font-semibold">{settings.address}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-share-alt text-emerald-600 ml-3"></i>
              وسائل التواصل الاجتماعي
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {settings.social_facebook && (
                <a
                  href={settings.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 space-x-reverse p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <i className="fab fa-facebook-f text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-blue-700">Facebook</p>
                    <p className="text-sm text-gray-600">تابعنا على فيسبوك</p>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 group-hover:text-blue-500 transition-colors mr-auto"></i>
                </a>
              )}
              
              {settings.social_instagram && (
                <a
                  href={settings.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 space-x-reverse p-4 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                    <i className="fab fa-instagram text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-purple-700">Instagram</p>
                    <p className="text-sm text-gray-600">تابعنا على انستغرام</p>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 group-hover:text-purple-500 transition-colors mr-auto"></i>
                </a>
              )}
              
              {settings.social_tiktok && (
                <a
                  href={settings.social_tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 space-x-reverse p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                    <i className="fab fa-tiktok text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-gray-700">TikTok</p>
                    <p className="text-sm text-gray-600">تابعنا على تيك توك</p>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 group-hover:text-gray-600 transition-colors mr-auto"></i>
                </a>
              )}
              
              {settings.social_twitter && (
                <a
                  href={settings.social_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 space-x-reverse p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                    <i className="fab fa-twitter text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-blue-700">Twitter</p>
                    <p className="text-sm text-gray-600">تابعنا على تويتر</p>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 group-hover:text-blue-500 transition-colors mr-auto"></i>
                </a>
              )}
              
              {settings.social_linkedin && (
                <a
                  href={settings.social_linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 space-x-reverse p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                    <i className="fab fa-linkedin-in text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-blue-700">LinkedIn</p>
                    <p className="text-sm text-gray-600">تابعنا على لينكد إن</p>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 group-hover:text-blue-500 transition-colors mr-auto"></i>
                </a>
              )}
              
              {settings.social_youtube && (
                <a
                  href={settings.social_youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 space-x-reverse p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                    <i className="fab fa-youtube text-white text-lg"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 group-hover:text-red-700">YouTube</p>
                    <p className="text-sm text-gray-600">تابعنا على يوتيوب</p>
                  </div>
                  <i className="fas fa-external-link-alt text-gray-400 group-hover:text-red-500 transition-colors mr-auto"></i>
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
