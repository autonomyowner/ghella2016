"use client";

import React, { useState, ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSupabaseData } from '@/hooks/useSupabase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Image from 'next/image';

const AnalysisFormPage = (): ReactElement => {
  const router = useRouter();
  const { addAnalysis, isOnline, isWithinLimits } = useSupabaseData();
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
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لإضافة خدمات تحليل جديدة</p>
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
    price: '',
    currency: 'د.ج',
    service_type: 'soil_analysis',
    analysis_type: 'basic',
    turnaround_days: '',
    location: '',
    equipment_used: '',
    certifications: '',
    sample_required: false,
    report_format: 'pdf',
    consultation_included: false,
    follow_up_support: false,
    contact_phone: '',
    contact_email: '',
    company_name: '',
    license_number: '',
    specializations: '',
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
      const analysisData = {
        ...formData,
        user_id: user.id,
        price: parseFloat(formData.price),
        turnaround_days: parseFloat(formData.turnaround_days),
        equipment_used: formData.equipment_used.split(',').map(equipment => equipment.trim()).filter(Boolean),
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(Boolean),
        specializations: formData.specializations.split(',').map(spec => spec.trim()).filter(Boolean),
        is_available: true,
        is_featured: false,
        view_count: 0
      };

      await addAnalysis(analysisData);
      router.push('/analysis');
    } catch (err) {
      console.error('Error adding analysis:', err);
      setError('حدث خطأ في إضافة الخدمة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <React.Fragment>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">إضافة خدمة تحليل ودراسات</h1>
              <p className="text-gray-600">سجل خدمات التحليل والدراسات الخاصة بك للمنتجات الزراعية</p>
            </div>

          {/* Status Indicator */}
          {(!isOnline || !isWithinLimits) && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-700">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                <span>{!isOnline ? 'وضع عدم الاتصال - سيتم حفظ البيانات محلياً' : 'استخدام التخزين المحلي'}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-700">
              <span>{error}</span>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="مثال: تحليل شامل للتربة والمحاصيل"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="رقم رخصة التحليل"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="صف خدمات التحليل والدراسات الخاصة بك..."
                />
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="د.ج">دينار جزائري</option>
                </select>
              </div>

              {/* Service Type and Analysis Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الخدمة *
                </label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="soil_analysis">تحليل التربة</option>
                  <option value="crop_analysis">تحليل المحاصيل</option>
                  <option value="satellite_imaging">التصوير بالأقمار الصناعية</option>
                  <option value="drone_survey">مسح بالطائرات بدون طيار</option>
                  <option value="climate_study">دراسة المناخ</option>
                  <option value="water_analysis">تحليل المياه</option>
                  <option value="pest_analysis">تحليل الآفات</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع التحليل *
                </label>
                <select
                  name="analysis_type"
                  value={formData.analysis_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="basic">أساسي</option>
                  <option value="standard">قياسي</option>
                  <option value="premium">مميز</option>
                  <option value="custom">مخصص</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  مدة التسليم (أيام) *
                </label>
                <input
                  type="number"
                  name="turnaround_days"
                  value={formData.turnaround_days}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تنسيق التقرير
                </label>
                <select
                  name="report_format"
                  value={formData.report_format}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="digital">رقمي</option>
                  <option value="printed">مطبوع</option>
                  <option value="all">جميع الأنواع</option>
                </select>
              </div>

              {/* Location and Equipment */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الموقع *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="المدينة أو المنطقة"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المعدات المستخدمة (افصل بفواصل)
                </label>
                <input
                  type="text"
                  name="equipment_used"
                  value={formData.equipment_used}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="مثال: أجهزة تحليل التربة، طائرات بدون طيار، أجهزة استشعار"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="مثال: تحليل التربة، تحليل المياه، دراسة المناخ"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الشهادات (افصل بفواصل)
                </label>
                <input
                  type="text"
                  name="certifications"
                  value={formData.certifications}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                  placeholder="مثال: شهادة معمل معتمد، رخصة تحليل"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
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
                    name="sample_required"
                    checked={formData.sample_required}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">يتطلب عينات</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="consultation_included"
                    checked={formData.consultation_included}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">يشمل استشارة</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="follow_up_support"
                    checked={formData.follow_up_support}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-700">دعم متابعة</label>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                {formData.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image}
                          alt={`صورة ${index + 1}`}
                          width={100}
                          height={50}
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
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
          </React.Fragment>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisFormPage; 
