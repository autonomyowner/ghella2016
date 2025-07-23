'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { useEquipment } from '@/hooks/useSupabase'
import { motion } from 'framer-motion'
import { 
  Upload, 
  X, 
  Plus, 
  ArrowLeft, 
  CheckCircle,
  AlertCircle,
  Camera,
  DollarSign,
  MapPin,
  Settings,
  FileText
} from 'lucide-react'
import Image from 'next/image'

export default function EquipmentForm() {
  const { user } = useSupabaseAuth()
  const { addEquipment } = useEquipment()
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    condition: 'good' as const,
    location: '',
    brand: '',
    model: '',
    year: '',
    hours_used: '',
  })
  
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 5) {
      setError('يمكنك تحميل حتى 5 صور فقط')
      return
    }
    setFiles(selectedFiles)
    setError(null)
  }

  const removeFile = (index: number) => {
    if (!files) return
    
    const dt = new DataTransfer()
    Array.from(files).forEach((file, i) => {
      if (i !== index) dt.items.add(file)
    })
    setFiles(dt.files)
  }

  // Helper function to convert image to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve(reader.result as string)
      }
      reader.onerror = () => {
        reject(new Error('Failed to convert image to base64'))
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadImages = async (): Promise<string[]> => {
    if (!files || files.length === 0) return []

    const imageUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`الصورة ${file.name} كبيرة جداً. الحد الأقصى 5 ميجابايت`)
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`${file.name} ليس ملف صورة صالح`)
      }

      try {
        const base64String = await convertImageToBase64(file)
        imageUrls.push(base64String)
      } catch (error) {
        console.error('Error converting image:', error)
        imageUrls.push('/placeholder-image.jpg')
      }
    }

    return imageUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      setError('يجب تسجيل الدخول لإضافة معدات')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const imageUrls = await uploadImages()

      const equipmentData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        location: formData.location,
        brand: formData.brand || null,
        model: formData.model || null,
        year: formData.year ? parseInt(formData.year) : null,
        hours_used: formData.hours_used ? parseInt(formData.hours_used) : null,
        images: imageUrls,
        category_id: 'default',
        currency: 'DZD',
        is_available: true,
        is_featured: false,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      await addEquipment(equipmentData)
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/equipment')
      }, 2000)
    } catch (error) {
      console.error('Error creating equipment:', error)
      setError((error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">يجب تسجيل الدخول أولاً</h1>
          <p className="text-white/70 mb-8">سجل دخولك لإضافة معدات جديدة</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105"
          >
            تسجيل الدخول
          </button>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">تم إضافة المعدات بنجاح!</h1>
          <p className="text-white/70 mb-8">سيتم توجيهك إلى صفحة المعدات قريباً...</p>
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white">
      {/* Header */}
      <div className="relative z-10 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              رجوع
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                إضافة معدات جديدة
              </h1>
              <p className="text-white/70 mt-2">أضف معداتك الزراعية بسهولة</p>
            </div>
            
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error && (
              <motion.div 
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300">{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">المعلومات الأساسية</h2>
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white/90 mb-3">
                    عنوان الإعلان *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                    placeholder="مثال: جرار زراعي جون دير 5000 - حالة ممتازة"
                  />
                </div>

                {/* Price and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-white/90 mb-3">
                      السعر (دينار جزائري) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                      <input
                        id="price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-white/90 mb-3">
                      حالة المعدات *
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                    >
                      <option value="new">جديد</option>
                      <option value="excellent">ممتاز</option>
                      <option value="good">جيد</option>
                      <option value="fair">مقبول</option>
                      <option value="poor">يحتاج صيانة</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white/90 mb-3">
                    الموقع *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                      placeholder="المدينة، المحافظة"
                    />
                  </div>
                </div>
              </div>

              {/* Technical Details Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">المواصفات التقنية</h2>
                </div>

                {/* Brand, Model, Year */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-white/90 mb-3">
                      الماركة
                    </label>
                    <input
                      id="brand"
                      name="brand"
                      type="text"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                      placeholder="جون دير، ماسي فيرغسون..."
                    />
                  </div>

                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-white/90 mb-3">
                      الموديل
                    </label>
                    <input
                      id="model"
                      name="model"
                      type="text"
                      value={formData.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                      placeholder="5000، M135..."
                    />
                  </div>

                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-white/90 mb-3">
                      سنة الصنع
                    </label>
                    <input
                      id="year"
                      name="year"
                      type="number"
                      value={formData.year}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                      placeholder="2020"
                    />
                  </div>
                </div>

                {/* Hours Used */}
                <div>
                  <label htmlFor="hours_used" className="block text-sm font-medium text-white/90 mb-3">
                    عدد ساعات الاستخدام
                  </label>
                  <input
                    id="hours_used"
                    name="hours_used"
                    type="number"
                    value={formData.hours_used}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">الوصف التفصيلي</h2>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/90 mb-3">
                    وصف المعدات *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 resize-none"
                    placeholder="اكتب وصفاً تفصيلياً للمعدات، الميزات، المواصفات، وأي معلومات مهمة أخرى..."
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <Camera className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">صور المعدات</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-3">
                    صور المعدات * (حتى 5 صور)
                  </label>
                  
                  {/* File Upload Area */}
                  <div
                    className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-emerald-400 transition-all duration-300 cursor-pointer bg-white/5 backdrop-blur-lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      name="images"
                      type="file"
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                      required
                    />
                    <Upload className="w-12 h-12 text-white/50 mx-auto mb-4" />
                    <p className="text-white/80 mb-2 font-medium">اضغط لاختيار الصور أو اسحبها هنا</p>
                    <p className="text-sm text-white/60">
                      الحد الأقصى: 5 صور، كل صورة حتى 5 ميجابايت
                    </p>
                  </div>

                  {/* Selected Files Preview */}
                  {files && files.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-white/90 mb-3">الصور المختارة:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {Array.from(files).map((file, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              width={100}
                              height={60}
                              className="w-full h-24 object-cover rounded-lg border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-600 disabled:to-gray-500 text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      جاري النشر...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      نشر الإعلان
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
