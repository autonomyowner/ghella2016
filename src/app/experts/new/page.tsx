'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, Briefcase, GraduationCap, MapPin, Phone, 
  Mail, Camera, Award, DollarSign, Clock, 
  Languages, Check, AlertCircle, Upload
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore, storage } from '@/lib/firebaseConfig';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

interface FormData {
  name: string;
  title: string;
  specialization: string;
  bio: string;
  years_of_experience: number;
  education: string;
  certifications: string[];
  location: string;
  phone: string;
  email: string;
  hourly_rate: number;
  services_offered: string[];
  languages: string[];
  profile_image?: File;
}

const initialFormData: FormData = {
  name: '',
  title: '',
  specialization: '',
  bio: '',
  years_of_experience: 0,
  education: '',
  certifications: [],
  location: '',
  phone: '',
  email: '',
  hourly_rate: 0,
  services_offered: [],
  languages: [],
};

export default function NewExpertPage() {
  const { user } = useSupabaseAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [newCertification, setNewCertification] = useState('');
  const [newService, setNewService] = useState('');
  const [newLanguage, setNewLanguage] = useState('');


  // Check authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">يجب تسجيل الدخول</h2>
          <p className="text-gray-600 mb-6">يجب عليك تسجيل الدخول لإضافة خبراء جدد</p>
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

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_image: file }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);
  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      let profileImageUrl = null;
      // Upload image if provided
      if (formData.profile_image) {
        try {
          const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
          const fileExt = formData.profile_image.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const storagePath = `experts/${fileName}`;
          const fileRef = ref(storage, storagePath);
          await uploadBytes(fileRef, formData.profile_image);
          profileImageUrl = await getDownloadURL(fileRef);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
      // Insert expert profile into Firestore
      await addDoc(collection(firestore, 'expert_profiles'), {
        user_id: user.id,
        name: formData.name,
        title: formData.title,
        specialization: formData.specialization,
        bio: formData.bio,
        years_of_experience: formData.years_of_experience,
        education: formData.education,
        certifications: formData.certifications,
        location: formData.location,
        phone: formData.phone,
        email: formData.email,
        profile_image: profileImageUrl,
        hourly_rate: formData.hourly_rate > 0 ? formData.hourly_rate : null,
        services_offered: formData.services_offered,
        languages: formData.languages,
        availability_status: 'available',
        rating: 0,
        reviews_count: 0,
        is_verified: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      router.push('/experts');
    } catch (err) {
      console.error('Error creating expert:', err);
    } finally {
      setLoading(false);
    }
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            {/* Profile Image Upload */}
            <div>
              <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden mx-auto mb-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    width={128}
                    height={128}
                    placeholder="blur"
                    blurDataURL={imagePreview}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-1/2 transform translate-x-1/2 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                <Upload className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-gray-600">اختر صورة شخصية (اختياري)</p>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="أدخل اسمك الكامل"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المسمى الوظيفي *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="مثال: مهندس زراعي، خبير المحاصيل"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.title}
                </p>
              )}
            </div>
            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التخصص *
              </label>
              <select
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">اختر التخصص</option>
                <option value="هندسة زراعية">هندسة زراعية</option>
                <option value="علوم التربة">علوم التربة</option>
                <option value="المحاصيل الحقلية">المحاصيل الحقلية</option>
                <option value="البساتين">البساتين</option>
                <option value="الطب البيطري">الطب البيطري</option>
                <option value="تربية الحيوان">تربية الحيوان</option>
                <option value="الري والصرف">الري والصرف</option>
                <option value="وقاية النبات">وقاية النبات</option>
                <option value="الإرشاد الزراعي">الإرشاد الزراعي</option>
                <option value="الاقتصاد الزراعي">الاقتصاد الزراعي</option>
                <option value="التسويق الزراعي">التسويق الزراعي</option>
                <option value="أخرى">أخرى</option>
              </select>
              {errors.specialization && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.specialization}
                </p>
              )}
            </div>
            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نبذة تعريفية *
              </label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="اكتب نبذة مختصرة عن خبرتك وتخصصك..."
              />
              {errors.bio && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.bio}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                سنوات الخبرة *
              </label>
              <input
                type="number"
                min="0"
                value={formData.years_of_experience}
                onChange={(e) => handleInputChange('years_of_experience', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="عدد سنوات الخبرة"
              />
              {errors.years_of_experience && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.years_of_experience}
                </p>
              )}
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المؤهل التعليمي *
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="مثال: بكالوريوس هندسة زراعية"
              />
              {errors.education && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.education}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="مثال: الجزائر العاصمة"
              />
              {errors.location && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.location}
                </p>
              )}
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الشهادات المهنية
              </label>
              <div className="space-y-2">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أضف شهادة جديدة"
                  />
                  <button
                    type="button"
                    onClick={addCertification}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="+213 123 456 789"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Hourly Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر بالساعة (د.ج)
              </label>
              <input
                type="number"
                min="0"
                value={formData.hourly_rate}
                onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="السعر بالساعة"
              />
            </div>

            {/* Services Offered */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الخدمات المقدمة
              </label>
              <div className="space-y-2">
                {formData.services_offered.map((service, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">{service}</span>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أضف خدمة جديدة"
                  />
                  <button
                    type="button"
                    onClick={addService}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اللغات
              </label>
              <div className="space-y-2">
                {formData.languages.map((language, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg">{language}</span>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      حذف
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="أضف لغة جديدة"
                  />
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">مراجعة المعلومات</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">المعلومات الشخصية</h4>
                  <p><strong>الاسم:</strong> {formData.name}</p>
                  <p><strong>المسمى الوظيفي:</strong> {formData.title}</p>
                  <p><strong>التخصص:</strong> {formData.specialization}</p>
                  <p><strong>النبذة:</strong> {formData.bio}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">معلومات الاتصال</h4>
                  <p><strong>البريد الإلكتروني:</strong> {formData.email}</p>
                  <p><strong>الهاتف:</strong> {formData.phone}</p>
                  <p><strong>الموقع:</strong> {formData.location}</p>
                  <p><strong>السعر بالساعة:</strong> {formData.hourly_rate} د.ج</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Helper functions for form validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step >= 1) {
      if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
      if (!formData.title.trim()) newErrors.title = 'المسمى الوظيفي مطلوب';
      if (!formData.specialization) newErrors.specialization = 'التخصص مطلوب';
      if (!formData.bio.trim()) newErrors.bio = 'النبذة التعريفية مطلوبة';
    }
    
    if (step >= 2) {
      if (formData.years_of_experience < 0) newErrors.years_of_experience = 'سنوات الخبرة يجب أن تكون رقماً موجباً';
      if (!formData.education.trim()) newErrors.education = 'المؤهل التعليمي مطلوب';
      if (!formData.location.trim()) newErrors.location = 'الموقع مطلوب';
    }
    
    if (step >= 3) {
      if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
      if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'صيغة البريد الإلكتروني غير صحيحة';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Helper functions for managing arrays
  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const addService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services_offered: [...prev.services_offered, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setFormData(prev => ({
      ...prev,
      services_offered: prev.services_offered.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim()) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  // Steps configuration
  const steps = [
    {
      number: 1,
      title: 'المعلومات الشخصية',
      icon: User
    },
    {
      number: 2,
      title: 'الخبرة والمؤهلات',
      icon: GraduationCap
    },
    {
      number: 3,
      title: 'معلومات الاتصال',
      icon: Phone
    },
    {
      number: 4,
      title: 'مراجعة',
      icon: Check
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            انضم كخبير زراعي
          </h1>
          <p className="text-lg text-gray-600">
            شارك خبرتك مع المزارعين في الجزائر واحصل على فرص عمل جديدة
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center ${
                currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  currentStep >= step.number
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-center">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {steps[currentStep - 1].title}
          </h2>

          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              السابق
            </button>

            <div className="flex gap-3">
              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      نشر الملف الشخصي
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
