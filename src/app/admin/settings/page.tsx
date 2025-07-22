'use client';

import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useWebsiteSettings, WebsiteSettings } from '@/lib/websiteSettings';

export default function AdminSettings() {
  const { user, profile } = useSupabaseAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { settings: defaultSettings, updateSettings, loading: settingsLoading } = useWebsiteSettings();
  const [localSettings, setLocalSettings] = useState<WebsiteSettings>({
    id: '',
    site_title: 'منصة الغلة',
    site_description: 'منصة التكنولوجيا الزراعية',
    homepage_title: 'منصة الغلة',
    homepage_subtitle: 'كل ما تحتاجه الفلاحة في مكان واحد',
    contact_email: 'info@elghella.com',
    contact_phone: '+213 123 456 789',
    address: 'الجزائر العاصمة، الجزائر',
    social_facebook: 'https://www.facebook.com/profile.php?id=61578467404013',
    social_twitter: 'https://twitter.com/elghella',
    social_instagram: 'https://www.instagram.com/el_ghella_/',
    social_linkedin: 'https://linkedin.com/company/elghella',
    social_youtube: 'https://youtube.com/elghella',
    social_tiktok: 'https://www.tiktok.com/@elghella10',
    announcement_text: '🌟 منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد',
    announcement_enabled: true,
    maintenance_mode: false,
    maintenance_message: 'الموقع قيد الصيانة، نعتذر عن الإزعاج',
    
    // Page Content
    about_content: 'منصة الغلة هي منصة رائدة في مجال التكنولوجيا الزراعية، تهدف إلى توفير كل ما يحتاجه المزارع في مكان واحد. نقدم خدمات متكاملة تشمل التسويق، التشغيل، والدعم الفني.',
    services_content: 'نقدم مجموعة شاملة من الخدمات الزراعية تشمل: تسويق المنتجات، إدارة المزارع، استشارات فنية، خدمات النقل والتخزين، وخدمات الدعم والتدريب.',
    contact_content: 'نحن هنا لمساعدتك! يمكنك التواصل معنا عبر البريد الإلكتروني أو الهاتف للحصول على الدعم والمعلومات التي تحتاجها.',
    
    // Marketplace Settings
    marketplace_title: 'سوق الغلة',
    marketplace_description: 'سوق إلكتروني متخصص في المنتجات الزراعية والخدمات المرتبطة بها',
    marketplace_welcome: 'مرحباً بك في سوق الغلة! اكتشف أفضل المنتجات الزراعية وخدمات المزرعة.',
    
    // SEO Settings
    seo_keywords: 'زراعة، مزرعة، منتجات زراعية، خدمات زراعية، الجزائر، منصة الغلة',
    seo_description: 'منصة الغلة - كل ما تحتاجه الفلاحة في مكان واحد. خدمات زراعية متكاملة وتسويق المنتجات الزراعية.',
    author_name: 'منصة الغلة',
    
    // Design Settings
    primary_color: '#059669',
    secondary_color: '#0d9488',
    logo_url: '',
    background_image: '',
    
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Update local settings when default settings load
  useEffect(() => {
    if (!settingsLoading && defaultSettings) {
      setLocalSettings(defaultSettings);
    }
  }, [defaultSettings, settingsLoading]);

  // Check admin access
  useEffect(() => {
    if (user && profile) {
      const isAdmin = profile.user_type === 'admin' || user.email === 'admin@elghella.com';
      setIsAuthenticated(isAdmin);
    }
    setLoading(false);
  }, [user, profile]);

  const saveSettings = async () => {
    setSaving(true);
    setMessage('');

    try {
      const result = await updateSettings(localSettings);
      if (result.success) {
        setMessage('تم حفظ الإعدادات بنجاح! التغييرات ظاهرة الآن على الموقع.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage('خطأ في حفظ الإعدادات: ' + (result.error || 'خطأ غير معروف'));
      }
    } catch (error) {
      setMessage('خطأ في حفظ الإعدادات');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof WebsiteSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading || settingsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-700 font-semibold">جاري التحميل...</p>
          <p className="text-emerald-600 text-sm mt-2">تحميل الإعدادات من قاعدة البيانات</p>
          <div className="mt-4 text-xs text-gray-500">
            <p>Loading: {loading ? 'Yes' : 'No'}</p>
            <p>Settings Loading: {settingsLoading ? 'Yes' : 'No'}</p>
            <p>User: {user?.email || 'Not logged in'}</p>
            <p>Profile: {profile ? 'Loaded' : 'Not loaded'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-lock text-red-500 text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">غير مصرح</h1>
          <p className="text-gray-600 mb-6">ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          <Link
            href="/admin"
            className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
          >
            العودة للوحة الإدارة
          </Link>
        </motion.div>
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
              <Link href="/admin" className="text-emerald-600 hover:text-emerald-700">
                <i className="fas fa-arrow-right text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">إعدادات الموقع</h1>
                <p className="text-emerald-600 text-sm">تعديل محتوى وإعدادات الموقع</p>
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={saving}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                saving
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {saving ? (
                <>
                  <i className="fas fa-spinner fa-spin ml-2"></i>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <i className="fas fa-save ml-2"></i>
                  حفظ الإعدادات
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="text-blue-800 font-semibold mb-2">معلومات التصحيح:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>المستخدم: {user?.email || 'غير مسجل'}</p>
            <p>نوع المستخدم: {profile?.user_type || 'غير محدد'}</p>
            <p>مصرح: {isAuthenticated ? 'نعم' : 'لا'}</p>
            <p>تحميل الإعدادات: {settingsLoading ? 'جاري' : 'مكتمل'}</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl mb-6 ${
              message.includes('بنجاح')
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="space-y-8">
          {/* الموقع العام */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-globe text-emerald-600 ml-3"></i>
              إعدادات الموقع العام
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الموقع</label>
                <input
                  type="text"
                  value={localSettings.site_title}
                  onChange={(e) => handleInputChange('site_title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="اسم الموقع"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">وصف الموقع</label>
                <input
                  type="text"
                  value={localSettings.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="وصف الموقع"
                />
              </div>
            </div>
          </motion.div>

          {/* الصفحة الرئيسية */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-home text-emerald-600 ml-3"></i>
              محتوى الصفحة الرئيسية
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان الرئيسي</label>
                <input
                  type="text"
                  value={localSettings.homepage_title}
                  onChange={(e) => handleInputChange('homepage_title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="العنوان الرئيسي للصفحة الرئيسية"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان الفرعي</label>
                <input
                  type="text"
                  value={localSettings.homepage_subtitle}
                  onChange={(e) => handleInputChange('homepage_subtitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="العنوان الفرعي للصفحة الرئيسية"
                />
              </div>
            </div>
          </motion.div>

          {/* معلومات الاتصال */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-phone text-emerald-600 ml-3"></i>
              معلومات الاتصال
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={localSettings.contact_email}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="info@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
                <input
                  type="text"
                  value={localSettings.contact_phone}
                  onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="+213 123 456 789"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان</label>
                <input
                  type="text"
                  value={localSettings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="عنوان الشركة"
                />
              </div>
            </div>
          </motion.div>

          {/* وسائل التواصل الاجتماعي */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-share-alt text-emerald-600 ml-3"></i>
              وسائل التواصل الاجتماعي
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={localSettings.social_facebook}
                  onChange={(e) => handleInputChange('social_facebook', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://facebook.com/profile.php?id=..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={localSettings.social_instagram}
                  onChange={(e) => handleInputChange('social_instagram', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">TikTok</label>
                <input
                  type="url"
                  value={localSettings.social_tiktok}
                  onChange={(e) => handleInputChange('social_tiktok', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://tiktok.com/@username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={localSettings.social_twitter}
                  onChange={(e) => handleInputChange('social_twitter', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={localSettings.social_linkedin}
                  onChange={(e) => handleInputChange('social_linkedin', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://linkedin.com/company/name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube</label>
                <input
                  type="url"
                  value={localSettings.social_youtube}
                  onChange={(e) => handleInputChange('social_youtube', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="https://youtube.com/channel/name"
                />
              </div>
            </div>
          </motion.div>

          {/* الإعلانات والإعدادات المتقدمة */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-cog text-emerald-600 ml-3"></i>
              الإعدادات المتقدمة
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">نص الإعلان العلوي</label>
                <input
                  type="text"
                  value={localSettings.announcement_text}
                  onChange={(e) => handleInputChange('announcement_text', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="نص الإعلان الذي يظهر في أعلى الموقع"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="announcement_enabled"
                    checked={localSettings.announcement_enabled}
                    onChange={(e) => handleInputChange('announcement_enabled', e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="announcement_enabled" className="text-sm text-gray-700 mr-2">
                    تفعيل الإعلان العلوي
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رسالة الصيانة</label>
                <textarea
                  value={localSettings.maintenance_message}
                  onChange={(e) => handleInputChange('maintenance_message', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="رسالة تظهر عند تفعيل وضع الصيانة"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="maintenance_mode"
                    checked={localSettings.maintenance_mode}
                    onChange={(e) => handleInputChange('maintenance_mode', e.target.checked)}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="maintenance_mode" className="text-sm text-gray-700 mr-2">
                    تفعيل وضع الصيانة
                  </label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* محتوى الصفحات */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-file-alt text-emerald-600 ml-3"></i>
              محتوى الصفحات
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">محتوى صفحة من نحن</label>
                <textarea
                  value={localSettings.about_content || ''}
                  onChange={(e) => handleInputChange('about_content', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="محتوى صفحة من نحن - يمكنك كتابة معلومات عن الشركة والخدمات"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">محتوى صفحة الخدمات</label>
                <textarea
                  value={localSettings.services_content || ''}
                  onChange={(e) => handleInputChange('services_content', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="محتوى صفحة الخدمات - يمكنك كتابة تفاصيل الخدمات المقدمة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">محتوى صفحة الاتصال</label>
                <textarea
                  value={localSettings.contact_content || ''}
                  onChange={(e) => handleInputChange('contact_content', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="محتوى صفحة الاتصال - يمكنك كتابة معلومات إضافية للتواصل"
                />
              </div>
            </div>
          </motion.div>

          {/* إعدادات السوق */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-store text-emerald-600 ml-3"></i>
              إعدادات السوق
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان صفحة السوق</label>
                <input
                  type="text"
                  value={localSettings.marketplace_title || 'سوق الغلة'}
                  onChange={(e) => handleInputChange('marketplace_title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="عنوان صفحة السوق"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">وصف صفحة السوق</label>
                <textarea
                  value={localSettings.marketplace_description || ''}
                  onChange={(e) => handleInputChange('marketplace_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="وصف صفحة السوق - يظهر في أعلى الصفحة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رسالة ترحيب السوق</label>
                <textarea
                  value={localSettings.marketplace_welcome || ''}
                  onChange={(e) => handleInputChange('marketplace_welcome', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="رسالة ترحيب للمستخدمين في السوق"
                />
              </div>
            </div>
          </motion.div>

          {/* إعدادات SEO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-search text-emerald-600 ml-3"></i>
              إعدادات SEO
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">كلمات مفتاحية للموقع</label>
                <input
                  type="text"
                  value={localSettings.seo_keywords || ''}
                  onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="كلمات مفتاحية مفصولة بفواصل - مثال: زراعة، مزرعة، منتجات زراعية"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">وصف SEO للموقع</label>
                <textarea
                  value={localSettings.seo_description || ''}
                  onChange={(e) => handleInputChange('seo_description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="وصف الموقع لمحركات البحث (SEO)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم المؤلف</label>
                <input
                  type="text"
                  value={localSettings.author_name || ''}
                  onChange={(e) => handleInputChange('author_name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="اسم المؤلف أو الشركة"
                />
              </div>
            </div>
          </motion.div>

          {/* إعدادات الألوان والتصميم */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <i className="fas fa-palette text-emerald-600 ml-3"></i>
              إعدادات التصميم
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اللون الرئيسي</label>
                <input
                  type="color"
                  value={localSettings.primary_color || '#059669'}
                  onChange={(e) => handleInputChange('primary_color', e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اللون الثانوي</label>
                <input
                  type="color"
                  value={localSettings.secondary_color || '#0d9488'}
                  onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">شعار الموقع (رابط)</label>
                <input
                  type="url"
                  value={localSettings.logo_url || ''}
                  onChange={(e) => handleInputChange('logo_url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="رابط شعار الموقع"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">صورة الخلفية (رابط)</label>
                <input
                  type="url"
                  value={localSettings.background_image || ''}
                  onChange={(e) => handleInputChange('background_image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="رابط صورة خلفية الموقع"
                />
              </div>
            </div>
          </motion.div>

          {/* Save Button at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex justify-center">
              <button
                onClick={saveSettings}
                disabled={saving}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  saving
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105 shadow-lg'
                }`}
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin ml-3"></i>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save ml-3"></i>
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-gray-600 mt-3 text-sm">
              اضغط هنا لحفظ جميع التغييرات وجعلها ظاهرة على الموقع
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 
