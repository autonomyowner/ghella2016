'use client'

import { useState } from 'react'
import { firestore } from '@/lib/firebaseConfig'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { useCategories } from '@/hooks/useData'
import { EquipmentInsert, LandListingInsert } from '@/types/database.types'

interface ListingFormProps {
  type?: 'equipment' | 'land'
}

const ListingForm: React.FC<ListingFormProps> = ({ type = 'equipment' }) => {
  const { user } = useSupabaseAuth()
  const { categories } = useCategories()
  const router = useRouter()
  
  // Common fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('SAR')
  const [location, setLocation] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Equipment specific fields
  const [categoryId, setCategoryId] = useState('')
  const [condition, setCondition] = useState<'new' | 'excellent' | 'good' | 'fair' | 'poor'>('good')
  const [year, setYear] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [hoursUsed, setHoursUsed] = useState('')

  // Land specific fields
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale')
  const [areaSize, setAreaSize] = useState('')
  const [areaUnit, setAreaUnit] = useState<'hectare' | 'acre' | 'dunum'>('hectare')
  const [soilType, setSoilType] = useState('')
  const [waterSource, setWaterSource] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setImages(prev => [...prev, ...newImages].slice(0, 5)) // Max 5 images
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async (): Promise<string[]> => {
    // Temporary stub for image upload
    return images.map((_, index) => `/placeholder-image-${index}.jpg`);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('يجب تسجيل الدخول أولاً لإنشاء إعلان')
      return
    }

    if (!title.trim() || !price || !location.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images
      const imageUrls = images.length > 0 ? await uploadImages() : []

      if (type === 'equipment') {
        if (!categoryId) {
          alert('يرجى اختيار فئة المعدة')
          return
        }

        const equipmentData: EquipmentInsert = {
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          currency,
          category_id: categoryId,
          condition,
          year: year ? parseInt(year) : null,
          brand: brand.trim() || null,
          model: model.trim() || null,
          hours_used: hoursUsed ? parseInt(hoursUsed) : null,
          location: location.trim(),
          images: imageUrls,
          is_available: true,
          is_featured: false
        }

        // Temporary stub for database insertion
        console.log('Would save equipment:', equipmentData);
        alert('تم إنشاء إعلان المعدة بنجاح!')
        router.push('/listings')
        
      } else {
        const landData: LandListingInsert = {
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          price: parseFloat(price),
          currency,
          listing_type: listingType,
          area_size: parseFloat(areaSize),
          area_unit: areaUnit,
          location: location.trim(),
          soil_type: soilType.trim() || null,
          water_source: waterSource.trim() || null,
          images: imageUrls,
          is_available: true,
          is_featured: false
        }

        // Temporary stub for database insertion
        console.log('Would save land listing:', landData);
        alert('تم إنشاء إعلان الأرض بنجاح!')
        router.push('/listings')
      }

    } catch (error: any) {
      console.error('Error creating listing:', error)
      alert('حدث خطأ في إنشاء الإعلان: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="glass rounded-3xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-4">تسجيل الدخول مطلوب</h3>
        <p className="text-white/80 mb-6">يجب تسجيل الدخول أولاً لإنشاء إعلان جديد</p>
        <a
          href="/auth/login"
          className="btn-awesome px-8 py-3 rounded-xl font-bold hover-scale"
        >
          تسجيل الدخول
        </a>
      </div>
    )
  }

  const locations = [
    'الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة',
    'الأحساء', 'الطائف', 'بريدة', 'تبوك', 'خميس مشيط', 'أبها', 'نجران'
  ]

  const conditions = [
    { value: 'new', label: 'جديد' },
    { value: 'excellent', label: 'ممتاز' },
    { value: 'good', label: 'جيد' },
    { value: 'fair', label: 'مقبول' },
    { value: 'poor', label: 'يحتاج صيانة' }
  ]

  return (
    <div className="glass rounded-3xl p-8 shadow-2xl bg-white/10 backdrop-blur-md border border-white/20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          {type === 'equipment' ? '🚜 إضافة معدة زراعية' : '🌾 إضافة أرض زراعية'}
        </h2>
        <p className="text-white/80">
          {type === 'equipment' 
            ? 'أضف تفاصيل معدتك الزراعية للوصول إلى آلاف المشترين المحتملين'
            : 'أضف تفاصيل أرضك الزراعية للوصول إلى آلاف المستثمرين والمزارعين'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-green-300 font-medium mb-2">
            العنوان *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'equipment' ? 'مثال: جرار فورد 6610 موديل 2018' : 'مثال: أرض زراعية مميزة في الأحساء'}
            className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-green-300 font-medium mb-2">
            الوصف
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="أضف وصفاً مفصلاً يساعد المشترين على فهم مميزات وحالة ما تعرضه..."
            rows={4}
            className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Price and Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-green-300 font-medium mb-2">
              السعر *
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-green-300 font-medium mb-2">
              العملة
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-4 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
            >
              <option value="SAR">ريال سعودي</option>
              <option value="USD">دولار أمريكي</option>
              <option value="EUR">يورو</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-green-300 font-medium mb-2">
            الموقع *
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-4 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
            required
          >
            <option value="">اختر الموقع</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Equipment Specific Fields */}
        {type === 'equipment' && (
          <>
            {/* Category */}
            <div>
              <label className="block text-green-300 font-medium mb-2">
                فئة المعدة *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full p-4 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                required
              >
                <option value="">اختر الفئة</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name_ar}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-green-300 font-medium mb-2">
                الحالة *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
                className="w-full p-4 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                required
              >
                {conditions.map((cond) => (
                  <option key={cond.value} value={cond.value}>
                    {cond.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  العلامة التجارية
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="مثال: جون ديري"
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  الموديل
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="مثال: 6610"
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  سنة الصنع
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2020"
                  min="1950"
                  max={new Date().getFullYear()}
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  ساعات التشغيل
                </label>
                <input
                  type="number"
                  value={hoursUsed}
                  onChange={(e) => setHoursUsed(e.target.value)}
                  placeholder="1500"
                  min="0"
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </>
        )}

        {/* Land Specific Fields */}
        {type === 'land' && (
          <>
            {/* Listing Type */}
            <div>
              <label className="block text-green-300 font-medium mb-2">
                نوع العرض *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="sale"
                    checked={listingType === 'sale'}
                    onChange={(e) => setListingType(e.target.value as 'sale')}
                    className="mr-2"
                  />
                  <span className="text-white">للبيع</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    value="rent"
                    checked={listingType === 'rent'}
                    onChange={(e) => setListingType(e.target.value as 'rent')}
                    className="mr-2"
                  />
                  <span className="text-white">للإيجار</span>
                </label>
              </div>
            </div>

            {/* Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  المساحة *
                </label>
                <input
                  type="number"
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                  placeholder="100"
                  min="0"
                  step="0.01"
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  وحدة القياس
                </label>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as any)}
                  className="w-full p-4 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                >
                  <option value="hectare">هكتار</option>
                  <option value="acre">أكر</option>
                  <option value="dunum">دونم</option>
                </select>
              </div>
            </div>

            {/* Soil and Water */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  نوع التربة
                </label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  placeholder="مثال: طينية، رملية، طمي"
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-green-300 font-medium mb-2">
                  مصدر المياه
                </label>
                <input
                  type="text"
                  value={waterSource}
                  onChange={(e) => setWaterSource(e.target.value)}
                  placeholder="مثال: بئر ارتوازي، شبكة الري، مياه أمطار"
                  className="w-full p-4 rounded-xl glass-dark text-white placeholder-white/70 border border-white/20 focus:border-green-400 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </>
        )}

        {/* Images */}
        <div>
          <label className="block text-green-300 font-medium mb-2">
            الصور (حد أقصى 5 صور)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full p-4 rounded-xl glass-dark text-white border border-white/20 focus:border-green-400 focus:outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600"
          />
          
          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-awesome px-12 py-4 rounded-xl font-bold text-lg hover-scale disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري النشر...
              </span>
            ) : (
              'نشر الإعلان'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ListingForm
