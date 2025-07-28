'use client';

import React from 'react';
import Link from 'next/link';

const TestNavigationPage: React.FC = () => {
  const testPages = [
    {
      title: '🧪 اختبار شامل لجميع الأسواق',
      description: 'اختبار أساسي لجميع وظائف السوق',
      path: '/test-all-marketplaces',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: '🔧 تشخيص شامل للأسواق',
      description: 'تشخيص مفصل مع تقارير الأخطاء والحلول',
      path: '/test-marketplace-diagnostic',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: '🔧 اختبار API التشخيص',
      description: 'اختبار اتصال Supabase عبر API',
      path: '/test-api-diagnostic',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: '🚜 اختبار المعدات',
      description: 'اختبار خاص بسوق المعدات الزراعية',
      path: '/test-equipment-basic',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: '🌾 اختبار الأراضي',
      description: 'اختبار خاص بسوق الأراضي الزراعية',
      path: '/test-land',
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: '🍅 اختبار الخضروات',
      description: 'اختبار خاص بسوق الخضروات والفواكه',
      path: '/test-vegetables-form',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: '🌱 اختبار المشاتل',
      description: 'اختبار خاص بسوق المشاتل والشتلات',
      path: '/test-nurseries-working',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: '🐄 اختبار الحيوانات',
      description: 'اختبار خاص بسوق الحيوانات',
      path: '/animals',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  const quickActions = [
    {
      title: '🔍 اختبار الاتصال',
      description: 'اختبار سريع لاتصال Supabase',
      action: () => {
        // Quick connection test
        fetch('/api/test-supabase-connection')
          .then(response => response.json())
          .then(data => {
            alert(`حالة الاتصال: ${data.connection.status}`);
          })
          .catch(error => {
            alert(`خطأ في الاتصال: ${error.message}`);
          });
      },
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      title: '📊 عرض الإحصائيات',
      description: 'عرض إحصائيات قاعدة البيانات',
      action: () => {
        // Quick stats test
        alert('سيتم إضافة هذه الميزة قريباً');
      },
      color: 'bg-indigo-500 hover:bg-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">🧪 صفحة اختبارات الموقع</h1>
          <p className="text-gray-600 text-lg">جميع صفحات الاختبار والتشخيص المتاحة</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">⚡ إجراءات سريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg font-semibold transition-colors`}
              >
                <div className="text-lg font-bold">{action.title}</div>
                <div className="text-sm opacity-90">{action.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Test Pages */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 صفحات الاختبار</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testPages.map((page, index) => (
              <Link
                key={index}
                href={page.path}
                className={`${page.color} text-white p-6 rounded-lg font-semibold transition-colors hover:shadow-lg`}
              >
                <div className="text-xl font-bold mb-2">{page.title}</div>
                <div className="text-sm opacity-90">{page.description}</div>
                <div className="text-xs opacity-75 mt-2">انقر للانتقال →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📖 تعليمات الاستخدام</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-xl">1️⃣</span>
              <div>
                <h3 className="font-semibold text-gray-800">اختبار سريع</h3>
                <p className="text-gray-600">استخدم "إجراءات سريعة" لاختبار الاتصال بسرعة</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-green-600 text-xl">2️⃣</span>
              <div>
                <h3 className="font-semibold text-gray-800">تشخيص شامل</h3>
                <p className="text-gray-600">استخدم "تشخيص شامل للأسواق" للحصول على تقرير مفصل</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-xl">3️⃣</span>
              <div>
                <h3 className="font-semibold text-gray-800">حل المشاكل</h3>
                <p className="text-gray-600">إذا واجهت مشكلة، استخدم صفحة التشخيص للحصول على حلول محددة</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-purple-600 text-xl">4️⃣</span>
              <div>
                <h3 className="font-semibold text-gray-800">اختبارات متخصصة</h3>
                <p className="text-gray-600">استخدم الاختبارات المتخصصة لكل سوق على حدة</p>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 دليل حل المشاكل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">مشاكل الاتصال</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• تحقق من إعدادات Supabase URL و API Key</li>
                <li>• تأكد من وجود الجداول في قاعدة البيانات</li>
                <li>• تحقق من سياسات RLS (Row Level Security)</li>
                <li>• تأكد من الاتصال بالإنترنت</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">مشاكل الصلاحيات</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• تأكد من تسجيل دخول المستخدم</li>
                <li>• تحقق من سياسات RLS للإدراج والتحديث</li>
                <li>• تأكد من أن المستخدم لديه الصلاحيات المطلوبة</li>
                <li>• تحقق من إعدادات المستخدم في Supabase</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">مشاكل البيانات</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• تحقق من هيكل الجداول</li>
                <li>• تأكد من وجود البيانات المطلوبة</li>
                <li>• تحقق من العلاقات بين الجداول</li>
                <li>• تأكد من صحة أنواع البيانات</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">مشاكل الأداء</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• تحقق من استعلامات قاعدة البيانات</li>
                <li>• تأكد من وجود فهارس مناسبة</li>
                <li>• تحقق من حجم البيانات</li>
                <li>• تأكد من إعدادات التخزين المؤقت</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📞 معلومات الاتصال</h2>
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              إذا كنت تواجه مشاكل لا يمكن حلها من خلال هذه الاختبارات،
            </p>
            <p className="text-gray-600">
              يرجى التواصل مع فريق الدعم الفني للحصول على المساعدة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNavigationPage; 