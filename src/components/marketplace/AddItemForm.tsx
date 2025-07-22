'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { addMarketplaceItem, uploadImage } from '@/lib/marketplaceService';

interface AddItemFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddItemForm({ onSuccess, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'products' as const,
    subcategory: '',
    price: '',
    unit: '',
    location: 'algiers',
    location_name: 'الجزائر',
    type: 'sale' as const,
    description: '',
    is_organic: false,
    is_verified: false,
    has_delivery: false,
    stock: '',
    tags: '',
    seller_name: '',
    contactPhone: '',
    contactWhatsapp: '',
    contactEmail: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: 'products', label: 'المنتجات', icon: 'fas fa-apple-alt' },
    { value: 'lands', label: 'الأراضي', icon: 'fas fa-map-marked-alt' },
    { value: 'machines', label: 'المعدات', icon: 'fas fa-tractor' },
    { value: 'nurseries', label: 'المشاتل', icon: 'fas fa-seedling' },
    { value: 'animals', label: 'الحيوانات', icon: 'fas fa-cow' },
    { value: 'services', label: 'الخدمات', icon: 'fas fa-tools' },
  ];

  const locations = [
    { value: 'algiers', label: 'الجزائر' },
    { value: 'oran', label: 'وهران' },
    { value: 'constantine', label: 'قسنطينة' },
    { value: 'setif', label: 'سطيف' },
    { value: 'tiaret', label: 'تيارت' },
    { value: 'annaba', label: 'عنابة' },
    { value: 'batna', label: 'باتنة' },
  ];

  const types = [
    { value: 'sale', label: 'للبيع' },
    { value: 'rent', label: 'للإيجار' },
    { value: 'exchange', label: 'للتبادل' },
    { value: 'partnership', label: 'للشراكة' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length + images.length > 5) {
      alert('يمكنك رفع 5 صور كحد أقصى');
      return;
    }

    setImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert uploaded images to base64 for storage
      const uploadedImageUrls = imagePreviewUrls.length > 0 ? imagePreviewUrls : [];

      // Create new item
      const newItem = await addMarketplaceItem({
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        unit: formData.unit,
        location: formData.location,
        location_name: formData.location_name,
        type: formData.type,
        description: formData.description,
        is_organic: formData.is_organic,
        is_verified: formData.is_verified,
        has_delivery: formData.has_delivery,
        rating: 0,
        reviews: 0,
        stock: parseInt(formData.stock),
        image: imagePreviewUrls[0] || '📦', // Use first image as main image
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        seller_id: 'current-user', // In real app, get from auth context
        seller_name: formData.seller_name,
        is_active: true,
        images: uploadedImageUrls, // Store all image URLs as base64
        contact_info: {
          phone: formData.contactPhone || undefined,
          whatsapp: formData.contactWhatsapp || undefined,
          email: formData.contactEmail || undefined,
        }
      });

      console.log('Item added successfully:', newItem);
      
      // Reset form
      setFormData({
        name: '',
        category: 'products',
        subcategory: '',
        price: '',
        unit: '',
        location: 'algiers',
        location_name: 'الجزائر',
        type: 'sale',
        description: '',
        is_organic: false,
        is_verified: false,
        has_delivery: false,
        stock: '',
        tags: '',
        seller_name: '',
        contactPhone: '',
        contactWhatsapp: '',
        contactEmail: ''
      });
      setImages([]);
      setImagePreviewUrls([]);

      onSuccess?.();
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-emerald-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-emerald-800">إضافة منتج جديد</h2>
            <button
              onClick={onCancel}
              className="text-emerald-600 hover:text-emerald-800 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800">صور المنتج</h3>
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 text-center hover:border-emerald-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 flex flex-col items-center justify-center space-y-3 space-y-reverse"
              >
                <div className="text-4xl text-emerald-400">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div>
                  <p className="text-emerald-600 font-semibold">اضغط لرفع الصور</p>
                  <p className="text-sm text-emerald-500">JPG, PNG, WebP - حد أقصى 5 صور</p>
                </div>
              </button>
            </div>

            {/* Image Previews */}
            {imagePreviewUrls.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-emerald-700 font-semibold">الصور المرفوعة ({imagePreviewUrls.length}/5)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-xl border-2 border-emerald-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs">
                          الرئيسية
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800">المعلومات الأساسية</h3>
            
            <div>
              <label className="block text-emerald-700 font-semibold mb-2 text-right">
                اسم المنتج *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                placeholder="أدخل اسم المنتج"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  الفئة *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  النوع الفرعي
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                  placeholder="مثال: خضروات، حبوب، إلخ"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  السعر *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-center"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  الوحدة *
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-center"
                  placeholder="كغ، قطعة، إلخ"
                />
              </div>

              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  المخزون *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-center"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Location and Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800">الموقع والنوع</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  الولاية *
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                >
                  {locations.map((location) => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  نوع العرض *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                >
                  {types.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description and Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800">الوصف والعلامات</h3>
            
            <div>
              <label className="block text-emerald-700 font-semibold mb-2 text-right">
                الوصف *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right resize-none"
                placeholder="وصف مفصل للمنتج..."
              />
            </div>

            <div>
              <label className="block text-emerald-700 font-semibold mb-2 text-right">
                العلامات (مفصولة بفواصل)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                placeholder="طازج، عضوي، محلي"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800">الخيارات</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id="isOrganic"
                  name="is_organic"
                  checked={formData.is_organic}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isOrganic" className="text-emerald-700 font-semibold">
                  منتج عضوي
                </label>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id="isVerified"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isVerified" className="text-emerald-700 font-semibold">
                  مزرعة موثقة
                </label>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id="hasDelivery"
                  name="has_delivery"
                  checked={formData.has_delivery}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="hasDelivery" className="text-emerald-700 font-semibold">
                  خدمة التوصيل
                </label>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-800">معلومات الاتصال</h3>
            
            <div>
              <label className="block text-emerald-700 font-semibold mb-2 text-right">
                اسم البائع *
              </label>
              <input
                type="text"
                name="seller_name"
                value={formData.seller_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-right"
                placeholder="اسمك أو اسم المزرعة"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-center"
                  placeholder="+213 555 123 456"
                />
              </div>

              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  واتساب
                </label>
                <input
                  type="tel"
                  name="contactWhatsapp"
                  value={formData.contactWhatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-center"
                  placeholder="+213 555 123 456"
                />
              </div>

              <div>
                <label className="block text-emerald-700 font-semibold mb-2 text-right">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 text-center"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-emerald-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl transition-colors font-semibold"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl transition-colors font-semibold flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <i className="fas fa-plus ml-2"></i>
                  إضافة المنتج
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
} 