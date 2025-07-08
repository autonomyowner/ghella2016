import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default async function EquipmentDetailPage({ params: { id } }: PageProps) {
  const supabase = createClient()

  const { data: equipment } = await supabase
    .from('equipment')
    .select(`
      *,
      profiles (
        id,
        full_name,
        phone,
        location,
        avatar_url
      )
    `)
    .eq('id', id)
    .single()

  if (!equipment) {
    notFound()
  }

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('ar-JO', {
    style: 'currency',
    currency: equipment.currency || 'JOD',
    maximumFractionDigits: 0,
  }).format(equipment.price)

  // Condition translation
  const conditionMap: Record<string, string> = {
    'new': 'جديد',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
    'poor': 'يحتاج صيانة'
  }

  const seller = equipment.profiles

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image gallery */}
        <div className="lg:col-span-2">
          <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl overflow-hidden">
            {equipment.images && equipment.images.length > 0 ? (
              <div className="aspect-video relative">
                <Image
                  src={equipment.images[0]}
                  alt={equipment.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-600 text-6xl">🚜</span>
              </div>
            )}

            {equipment.images && equipment.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4">
                {equipment.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={image}
                      alt={`${equipment.title} - صورة ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">وصف المعدات</h2>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {equipment.description}
            </p>
          </div>
        </div>

        {/* Equipment details */}
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-3">{equipment.title}</h1>
            <div className="text-3xl font-bold text-green-500 mb-6">{formattedPrice}</div>

            <div className="space-y-4 border-t border-gray-700 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-400">الحالة</span>
                <span className="text-white font-medium">
                  {conditionMap[equipment.condition] || equipment.condition}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">الموقع</span>
                <span className="text-white">{equipment.location}</span>
              </div>

              {equipment.brand && (
                <div className="flex justify-between">
                  <span className="text-gray-400">الماركة</span>
                  <span className="text-white">{equipment.brand}</span>
                </div>
              )}

              {equipment.model && (
                <div className="flex justify-between">
                  <span className="text-gray-400">الموديل</span>
                  <span className="text-white">{equipment.model}</span>
                </div>
              )}

              {equipment.year && (
                <div className="flex justify-between">
                  <span className="text-gray-400">سنة الصنع</span>
                  <span className="text-white">{equipment.year}</span>
                </div>
              )}

              {equipment.hours_used && (
                <div className="flex justify-between">
                  <span className="text-gray-400">ساعات الاستخدام</span>
                  <span className="text-white">{equipment.hours_used.toLocaleString()} ساعة</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-400">تاريخ النشر</span>
                <span className="text-white">
                  {new Date(equipment.created_at).toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>

          {/* Seller information */}
          {seller && (
            <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">معلومات البائع</h2>

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                  {seller.avatar_url ? (
                    <Image
                      src={seller.avatar_url}
                      alt={seller.full_name || ''}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-xl">
                      {seller.full_name ? seller.full_name[0].toUpperCase() : '👤'}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {seller.full_name || 'مستخدم الغلة'}
                  </h3>
                  {seller.location && (
                    <p className="text-sm text-gray-400">📍 {seller.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {seller.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-md transition flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    اتصل بالبائع
                  </a>
                )}

                {seller.phone && (
                  <a
                    href={`https://wa.me/${seller.phone?.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-green-600/20 hover:bg-green-600/30 text-green-500 border border-green-500/30 rounded-md transition flex items-center justify-center gap-2"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    واتساب
                  </a>
                )}

                <button className="w-full py-3 bg-black/50 hover:bg-black/70 border border-green-500/30 text-green-400 rounded-md transition flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  حفظ في المفضلة
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Link
              href="/equipment"
              className="text-green-400 hover:text-green-300 transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              العودة إلى قائمة المعدات
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
