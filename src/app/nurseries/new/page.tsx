"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSupabaseData } from '@/hooks/useSupabase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Image from 'next/image';

const NurseriesFormPage: React.FC = () => {
  const router = useRouter();
  const { addNursery } = useSupabaseData();
  const { user } = useSupabaseAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'دج',
    plant_type: 'fruit_trees' as 'fruit_trees' | 'ornamental' | 'vegetables' | 'herbs' | 'forest' | 'other',
    plant_name: '',
    age_months: '',
    size: 'medium' as 'seedling' | 'small' | 'medium' | 'large' | 'mature',
    quantity: '1',
    health_status: '',
    location: '',
    pot_size: '',
    care_instructions: '',
    seasonality: 'all_year' as 'spring' | 'summer' | 'autumn' | 'winter' | 'all_year',
    images: [] as string[]
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Check authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لإضافة شتلات جديدة</p>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('يجب تسجيل الدخول لإضافة شتلات');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert images to base64
      const imagePromises = imageFiles.map(convertImageToBase64);
      const base64Images = await Promise.all(imagePromises);

      const nurseryData = {
        ...formData,
        price: parseFloat(formData.price),
        age_months: formData.age_months ? parseInt(formData.age_months) : null,
        quantity: parseInt(formData.quantity),
        images: base64Images,
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Submitting nursery data:', nurseryData);
      
      const result = await addNursery(nurseryData);
      console.log('Nursery added successfully:', result);

      // Show success message
      alert('تم إضافة المشتل بنجاح!');

      // Redirect to nurseries page
      router.push('/nurseries');
    } catch (err) {
      console.error('Error adding nursery:', err);
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(`خطأ في إضافة المشتل: ${errorMessage}`);
      alert(`خطأ في إضافة المشتل: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🌱</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">إضافة شتلات جديدة</h1>
            <p className="text-gray-600">أضف شتلاتك للنباتات والشتلات في منصة الغلة</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الإعلان *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: شتلات برتقال طازجة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع النبات *
                  </label>
                  <select
                    name="plant_type"
                    value={formData.plant_type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="fruit_trees">أشجار مثمرة</option>
                    <option value="ornamental">نباتات زينة</option>
                    <option value="vegetables">خضروات</option>
                    <option value="herbs">أعشاب</option>
                    <option value="forest">أشجار حرجية</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم النبات
                  </label>
                  <input
                    type="text"
                    name="plant_name"
                    value={formData.plant_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: برتقال، ليمون، تفاح"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحجم *
                  </label>
                  <select
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="seedling">بذرة</option>
                    <option value="small">صغير</option>
                    <option value="medium">متوسط</option>
                    <option value="large">كبير</option>
                    <option value="mature">ناضج</option>
                  </select>
                </div>

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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="دج">دج</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    العمر (بالأشهر)
                  </label>
                  <input
                    type="number"
                    name="age_months"
                    value={formData.age_months}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموسم
                  </label>
                  <select
                    name="seasonality"
                    value={formData.seasonality}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all_year">طوال السنة</option>
                    <option value="spring">الربيع</option>
                    <option value="summer">الصيف</option>
                    <option value="autumn">الخريف</option>
                    <option value="winter">الشتاء</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: الجزائر العاصمة"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    حجم الوعاء
                  </label>
                  <input
                    type="text"
                    name="pot_size"
                    value={formData.pot_size}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: 20 سم"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="وصف مفصل عن الشتلات..."
                />
              </div>

              {/* Health Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة الصحية
                </label>
                <input
                  type="text"
                  name="health_status"
                  value={formData.health_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="مثال: ممتازة، خالية من الأمراض"
                />
              </div>

              {/* Care Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تعليمات العناية
                </label>
                <textarea
                  name="care_instructions"
                  value={formData.care_instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="تعليمات العناية بالشتلات..."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور الشتلات
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {imagePreview.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={100}
                          height={50}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg font-semibold transition-colors"
                >
                  {loading ? 'جاري الإضافة...' : 'إضافة الشتلات'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NurseriesFormPage; 
