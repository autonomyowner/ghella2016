'use client'

import { useState } from 'react'
import ListingForm from '@/components/ListingForm'

export default function NewListingPage() {
  const [activeTab, setActiveTab] = useState<'equipment' | 'land'>('equipment')

  return (
    <div className="min-h-screen gradient-bg-primary spacing-responsive-xl">
      <div className="container-responsive">
        {/* Page Header */}
        <div className="text-center spacing-responsive-lg">
          <h1 className="heading-responsive-h1 text-white mb-6">
            أضف إعلان جديد
          </h1>
          <p className="text-responsive-xl text-green-200 max-w-3xl mx-auto">
            انشر إعلانك للوصول إلى آلاف المشترين والمستثمرين في المجال الزراعي
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center spacing-responsive-lg">
          <div className="card-responsive glass flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('equipment')}
              className={`btn-responsive font-bold transition-all duration-300 ${
                activeTab === 'equipment'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'text-white hover:bg-white/10 bg-transparent border border-white/20'
              }`}
            >
              <span className="ml-2 text-xl">🚜</span>
              معدة زراعية
            </button>
            <button
              onClick={() => setActiveTab('land')}
              className={`btn-responsive font-bold transition-all duration-300 ${
                activeTab === 'land'
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'text-white hover:bg-white/10 bg-transparent border border-white/20'
              }`}
            >
              <span className="ml-2 text-xl">🌾</span>
              أرض زراعية
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl mx-auto">
          <ListingForm type={activeTab} />
        </div>

        {/* Tips Section */}
        <div className="max-w-4xl mx-auto spacing-responsive-lg">
          <div className="card-responsive glass">
            <h3 className="heading-responsive-h2 text-white mb-6 text-center">
              💡 نصائح لإعلان ناجح
            </h3>
            <div className="grid-responsive">
              <div className="card-responsive text-center bg-white/5 border border-white/10">
                <div className="text-4xl mb-3">📸</div>
                <h4 className="text-responsive-lg font-bold text-white mb-2">صور عالية الجودة</h4>
                <p className="text-responsive-sm text-white/80">
                  أضف صوراً واضحة ومتعددة الزوايا لجذب المزيد من المشترين
                </p>
              </div>
              <div className="card-responsive text-center bg-white/5 border border-white/10">
                <div className="text-4xl mb-3">📝</div>
                <h4 className="text-responsive-lg font-bold text-white mb-2">وصف مفصل</h4>
                <p className="text-responsive-sm text-white/80">
                  اكتب وصفاً شاملاً يوضح المميزات والحالة والاستخدامات
                </p>
              </div>
              <div className="card-responsive text-center bg-white/5 border border-white/10">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="text-responsive-lg font-bold text-white mb-2">سعر منافس</h4>
                <p className="text-responsive-sm text-white/80">
                  حدد سعراً عادلاً ومنافساً بناءً على حالة وعمر المعدة أو الأرض
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto spacing-responsive-lg text-center">
          <div className="card-responsive glass">
            <h4 className="heading-responsive-h3 text-white mb-2">
              تحتاج مساعدة؟
            </h4>
            <p className="text-responsive-base text-white/80 mb-6">
              فريق الدعم الفني متاح لمساعدتك في إنشاء إعلان مميز
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a
                href="tel:+966123456789"
                className="btn-responsive bg-white/20 text-green-100 border border-white/30 hover:bg-white/30 font-medium inline-flex items-center justify-center"
              >
                📞 اتصل بنا
              </a>
              <a
                href="mailto:support@alghella.com"
                className="btn-responsive bg-white/20 text-green-100 border border-white/30 hover:bg-white/30 font-medium inline-flex items-center justify-center"
              >
                ✉️ راسلنا
              </a>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto spacing-responsive-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="card-responsive glass">
              <h4 className="heading-responsive-h3 text-white mb-4">
                ✨ مميزات النشر معنا
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-responsive-sm text-white/90">
                  <span className="text-green-400">✓</span>
                  وصول لآلاف المشترين المهتمين
                </li>
                <li className="flex items-center gap-3 text-responsive-sm text-white/90">
                  <span className="text-green-400">✓</span>
                  أدوات تسويق متطورة ومجانية
                </li>
                <li className="flex items-center gap-3 text-responsive-sm text-white/90">
                  <span className="text-green-400">✓</span>
                  نظام رسائل آمن ومحمي
                </li>
                <li className="flex items-center gap-3 text-responsive-sm text-white/90">
                  <span className="text-green-400">✓</span>
                  إحصائيات مفصلة عن الإعلان
                </li>
              </ul>
            </div>

            {/* Guidelines */}
            <div className="card-responsive glass">
              <h4 className="heading-responsive-h3 text-white mb-4">
                📋 إرشادات النشر
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-responsive-sm text-white/90">
                  <span className="text-yellow-400 mt-1">⚠️</span>
                  <span>تأكد من صحة جميع المعلومات المدخلة</span>
                </li>
                <li className="flex items-start gap-3 text-responsive-sm text-white/90">
                  <span className="text-blue-400 mt-1">ℹ️</span>
                  <span>استخدم كلمات مفتاحية واضحة</span>
                </li>
                <li className="flex items-start gap-3 text-responsive-sm text-white/90">
                  <span className="text-green-400 mt-1">📱</span>
                  <span>أضف رقم هاتف صحيح للتواصل</span>
                </li>
                <li className="flex items-start gap-3 text-responsive-sm text-white/90">
                  <span className="text-purple-400 mt-1">⭐</span>
                  <span>راجع الإعلان قبل النشر النهائي</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
