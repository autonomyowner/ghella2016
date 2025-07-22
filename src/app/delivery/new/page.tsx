"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useFirebase } from '@/hooks/useFirebase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const DeliveryFormPage: React.FC = () => {
  const router = useRouter();
  const { addDelivery, isOnline, isWithinLimits } = useFirebase();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لإضافة خدمات توصيل جديدة</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors text-white"
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_km: '',
    base_price: '',
    currency: 'د.ج',
    service_type: 'local',
    vehicle_type: 'truck',
    capacity_kg: '',
    location: '',
    delivery_areas: '',
    max_distance_km: '',
    delivery_time_hours: '',
    min_order_kg: '',
    contact_phone: '',
    contact_email: '',
    company_name: '',
    license_number: '',
    specializations: '',
    insurance: false,
    tracking: false,
    packaging: false,
    loading_help: false,
    unloading_help: false,
    express_delivery: false,
    weekend_delivery: false,
    images: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imagePromises = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(imagePromises).then(images => {
        setFormData(prev => ({ ...prev, images: [...prev.images, ...images] }));
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deliveryData = {
        ...formData,
        user_id: user.id,
        price_per_km: parseFloat(formData.price_per_km),
        base_price: parseFloat(formData.base_price),
        capacity_kg: parseFloat(formData.capacity_kg),
        max_distance_km: parseFloat(formData.max_distance_km),
        delivery_time_hours: parseFloat(formData.delivery_time_hours),
        min_order_kg: parseFloat(formData.min_order_kg),
        delivery_areas: formData.delivery_areas.split(',').map(area => area.trim()).filter(Boolean),
        specializations: formData.specializations.split(',').map(spec => spec.trim()).filter(Boolean),
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      await addDelivery(deliveryData);
      router.push('/delivery');
    } catch (err) {
      console.error('Error adding delivery:', err);
      setError('حدث خطأ في إضافة الخدمة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">إضافة خدمة توصيل</h1>
            <p className="text-gray-600">سجل خدمات التوصيل الخاصة بك للمنتجات الزراعية</p>
          </div>

          {/* Status Indicator */}
          {(!isOnline || !isWithinLimits) && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                {!isOnline ? 'وضع عدم الاتصال - سيتم حفظ البيانات محلياً' : 'استخدام التخزين المحلي'}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">المعلومات الأساسية</h2>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الخدمة *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="مثال: خدمة توصيل سريع للمنتجات الزراعية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الشركة
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="اسم الشركة أو المؤسسة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الرخصة
                </label>
                <input
                  type="text"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="رقم رخصة النقل"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الخدمة *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="صف خدمات التوصيل الخاصة بك..."
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر لكل كم *
                </label>
                <input
                  type="number"
                  name="price_per_km"
                  value={formData.price_per_km}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأساسي *
                </label>
                <input
                  type="number"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملة
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="د.ج">دينار جزائري</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحد الأدنى للطلب (كجم)
                </label>
                <input
                  type="number"
                  name="min_order_kg"
                  value={formData.min_order_kg}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0"
                />
              </div>

              {/* Service Type and Vehicle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الخدمة *
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="local">محلي</option>
                  <option value="regional">إقليمي</option>
                  <option value="national">وطني</option>
                  <option value="international">دولي</option>
                  <option value="refrigerated">مبرد</option>
                  <option value="bulk">كميات كبيرة</option>
                  <option value="express">سريع</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المركبة *
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                >
                  <option value="truck">شاحنة</option>
                  <option value="van">فان</option>
                  <option value="pickup">بيك أب</option>
                  <option value="refrigerated_truck">شاحنة مبردة</option>
                  <option value="tanker">ناقلة</option>
                  <option value="trailer">مقطورة</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              {/* Capacity and Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعة (كجم) *
                </label>
                <input
                  type="number"
                  name="capacity_kg"
                  value={formData.capacity_kg}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المسافة القصوى (كم)
                </label>
                <input
                  type="number"
                  name="max_distance_km"
                  value={formData.max_distance_km}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة التوصيل (ساعات) *
                </label>
                <input
                  type="number"
                  name="delivery_time_hours"
                  value={formData.delivery_time_hours}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="0"
                />
              </div>

              {/* Location and Areas */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع الأساسي *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="المدينة أو المنطقة"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مناطق التوصيل (افصل بفواصل)
                </label>
                <input
                  type="text"
                  name="delivery_areas"
                  value={formData.delivery_areas}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="مثال: الكويت، الدمام، الرياض"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التخصصات (افصل بفواصل)
                </label>
                <input
                  type="text"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="مثال: خضروات، فواكه، حبوب، منتجات مبردة"
                />
              </div>

              {/* Contact Information */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">معلومات الاتصال</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="+965 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="example@email.com"
                />
              </div>

              {/* Additional Services */}
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">خدمات إضافية</h2>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="insurance"
                    checked={formData.insurance}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">تأمين</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="tracking"
                    checked={formData.tracking}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">تتبع</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="packaging"
                    checked={formData.packaging}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">تغليف</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="loading_help"
                    checked={formData.loading_help}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">مساعدة في التحميل</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="unloading_help"
                    checked={formData.unloading_help}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">مساعدة في التفريغ</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="express_delivery"
                    checked={formData.express_delivery}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">توصيل سريع</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="weekend_delivery"
                    checked={formData.weekend_delivery}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">توصيل في العطل</label>
                </div>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصور
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`صورة ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'جاري الإضافة...' : 'إضافة الخدمة'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default DeliveryFormPage; 
