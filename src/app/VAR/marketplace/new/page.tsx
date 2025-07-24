"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSupabaseData } from '@/hooks/useSupabase';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

const NewVegetableListingPage: React.FC = () => {
  const router = useRouter();
  const { addVegetable } = useSupabaseData();
  const { user } = useSupabaseAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'دج',
    vegetable_type: 'tomatoes' as 'tomatoes' | 'potatoes' | 'onions' | 'carrots' | 'cucumbers' | 'peppers' | 'lettuce' | 'cabbage' | 'broccoli' | 'cauliflower' | 'spinach' | 'kale' | 'other',
    variety: '',
    quantity: '1',
    unit: 'kg' as 'kg' | 'ton' | 'piece' | 'bundle' | 'box',
    freshness: 'excellent' as 'excellent' | 'good' | 'fair' | 'poor',
    organic: false,
    location: '',
    harvest_date: '',
    expiry_date: '',
    certification: '',
    packaging: 'loose' as 'loose' | 'packaged' | 'bulk',
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
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لإضافة خضار جديدة</p>
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imageFiles.length > 10) {
      setError('يمكنك رفع حتى 10 صور فقط');
      return;
    }

    // Validate file sizes and types
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return false;
      }
      if (!file.type.startsWith('image/')) {
        setError('يمكنك رفع صور فقط');
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) return;

    setImageFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError(null);
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
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
      setError('يجب تسجيل الدخول لإضافة خضار');
      return;
    }

    if (!formData.title.trim() || !formData.price || !formData.location.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert images to base64
      const imagePromises = imageFiles.map(convertImageToBase64);
      const base64Images = await Promise.all(imagePromises);

      const vegetableData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        images: base64Images,
        user_id: user.id,
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Attempting to add vegetable with data:', vegetableData);

      await addVegetable(vegetableData);
      
      // Redirect to marketplace
      router.push('/VAR/marketplace');
      
    } catch (error: unknown) {
      console.error('Error adding vegetable:', error);
      
      // Better error handling
      let errorMessage = 'حدث خطأ في إضافة الخضار. يرجى المحاولة مرة أخرى.';
      
      if (error instanceof Error) {
        if (error.message.includes('RLS')) {
          errorMessage = 'خطأ في الصلاحيات. يرجى التأكد من تسجيل الدخول.';
        } else if (error.message.includes('duplicate')) {
          errorMessage = 'هذا الإعلان موجود بالفعل.';
        } else if (error.message.includes('invalid')) {
          errorMessage = 'بيانات غير صحيحة. يرجى التحقق من المعلومات المدخلة.';
        } else {
          errorMessage = `خطأ: ${error.message}`;
        }
      }
      
      setError(errorMessage);
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
            <div className="text-6xl mb-4">🥬</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">إضافة خضار جديدة</h1>
            <p className="text-gray-600">أضف خضارك الطازجة إلى السوق واجعلها متاحة للمشترين</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الإعلان *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: طماطم طازجة عضوية"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الخضار *
                  </label>
                  <select
                    name="vegetable_type"
                    value={formData.vegetable_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="tomatoes">طماطم</option>
                    <option value="potatoes">بطاطس</option>
                    <option value="onions">بصل</option>
                    <option value="carrots">جزر</option>
                    <option value="cucumbers">خيار</option>
                    <option value="peppers">فلفل</option>
                    <option value="lettuce">خس</option>
                    <option value="cabbage">ملفوف</option>
                    <option value="broccoli">بروكلي</option>
                    <option value="cauliflower">قرنبيط</option>
                    <option value="spinach">سبانخ</option>
                    <option value="kale">كرنب</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="وصف مفصل عن الخضار، الجودة، طريقة الزراعة..."
                />
              </div>

              {/* Price and Quantity */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="1"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    وحدة القياس *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="kg">كيلوغرام</option>
                    <option value="ton">طن</option>
                    <option value="piece">قطعة</option>
                    <option value="bundle">حزمة</option>
                    <option value="box">صندوق</option>
                  </select>
                </div>
              </div>

              {/* Quality and Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مستوى الطزاجة *
                  </label>
                  <select
                    name="freshness"
                    value={formData.freshness}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="excellent">ممتازة</option>
                    <option value="good">جيدة</option>
                    <option value="fair">متوسطة</option>
                    <option value="poor">ضعيفة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    النوع
                  </label>
                  <input
                    type="text"
                    name="variety"
                    value={formData.variety}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: طماطم كرزية، بطاطس حمراء..."
                  />
                </div>
              </div>

              {/* Location and Dates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الموقع *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="المدينة أو المنطقة"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع التعبئة
                  </label>
                  <select
                    name="packaging"
                    value={formData.packaging}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="loose">سائب</option>
                    <option value="packaged">معبأ</option>
                    <option value="bulk">كميات كبيرة</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ الحصاد
                  </label>
                  <input
                    type="date"
                    name="harvest_date"
                    value={formData.harvest_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    تاريخ انتهاء الصلاحية
                  </label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Additional Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الشهادات
                  </label>
                  <input
                    type="text"
                    name="certification"
                    value={formData.certification}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="مثال: شهادة عضوية، شهادة جودة..."
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="organic"
                    checked={formData.organic}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label className="mr-2 text-sm font-medium text-gray-700">
                    خضار عضوية
                  </label>
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صور الخضار
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">يمكنك رفع حتى 10 صور. الحد الأقصى 5 ميجابايت لكل صورة.</p>
                
                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          width={96}
                          height={96}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 space-x-reverse">
                <button
                  type="button"
                  onClick={() => router.push('/VAR/marketplace')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الإضافة...' : 'إضافة الخضار'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewVegetableListingPage; 