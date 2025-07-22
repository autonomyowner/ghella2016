'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/hooks/useFirebase';

interface Equipment {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
  location: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  hours_used: number | null;
  images: string[];
  category_id: string;
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
}

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  user_type: 'farmer' | 'buyer' | 'both';
  is_verified: boolean;
}

const EquipmentDetailPage: React.FC = () => {
  const params = useParams();
  const equipmentId = params.id as string;
  const { getEquipment, isOnline, isWithinLimits } = useFirebase();
  
  const [equipment, setEquipment] = useState<Equipment | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [relatedEquipment, setRelatedEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (equipmentId) {
      fetchEquipmentDetails();
    }
  }, [equipmentId]);

  const fetchEquipmentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use our hybrid hook to get equipment data
      const data = await getEquipment();
      
      // Find the specific equipment by ID
      const equipmentData = data.find(item => item.id === equipmentId);
      
      if (!equipmentData) {
        setError('لم يتم العثور على الإعلان');
        return;
      }

      // Use the equipment data directly since it's already in the correct format
      setEquipment(equipmentData);

      // Mock seller data for now
      const mockSeller: Profile = {
        id: equipmentData.user_id,
        full_name: 'مزارع موثوق',
        phone: '+213 123 456 789',
        location: equipmentData.location || 'الجزائر',
        avatar_url: null,
        user_type: 'farmer',
        is_verified: true
      };
      setSeller(mockSeller);

      // Get related equipment (same category)
      const relatedData = data
        .filter(item => 
          item.id !== equipmentId && 
          item.category_id === equipmentData.category_id &&
          item.is_available !== false
        )
        .slice(0, 4);

      setRelatedEquipment(relatedData);

    } catch (err: any) {
      console.error('Error fetching equipment details:', err);
      setError('حدث خطأ في تحميل تفاصيل الإعلان');
    } finally {
      setLoading(false);
    }
  };

  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (!equipment || !equipment.images) return;

    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === equipment.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? equipment.images.length - 1 : prev - 1
      );
    }
  };

  const getConditionLabel = (condition: string) => {
    const conditions = {
      new: 'جديد',
      excellent: 'ممتاز',
      good: 'جيد',
      fair: 'مقبول',
      poor: 'يحتاج صيانة'
    };
    return conditions[condition as keyof typeof conditions] || condition;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="text-center py-8">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!equipment) {
    return <div className="text-center py-8">لم يتم العثور على الإعلان.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image gallery */}
        <div className="lg:col-span-2">
          <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl overflow-hidden">
            {equipment.images && equipment.images.length > 0 ? (
              <div className="aspect-video relative">
                <Image
                  src={equipment.images[currentImageIndex]}
                  alt={equipment.title}
                  fill
                  className="object-cover"
                  priority
                />
                
                {equipment.images.length > 1 && (
                  <>
                    <button
                      onClick={() => handleImageNavigation('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleImageNavigation('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-600 text-6xl">🚜</span>
              </div>
            )}

            {/* Image Thumbnails */}
            {equipment.images && equipment.images.length > 1 && (
              <div className="p-4 flex gap-2 overflow-x-auto">
                {equipment.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-emerald-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${equipment.title} - صورة ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
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

          {/* Related Equipment */}
          {relatedEquipment.length > 0 && (
            <div className="mt-8 bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">معدات مشابهة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedEquipment.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/equipment/${relatedItem.id}`}
                    className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-32 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {relatedItem.images && relatedItem.images.length > 0 && relatedItem.images[0] ? (
                        <Image
                          src={relatedItem.images[0]}
                          alt={relatedItem.title}
                          width={200}
                          height={128}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to emoji if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <span className={`text-4xl ${relatedItem.images && relatedItem.images.length > 0 && relatedItem.images[0] ? 'hidden' : ''}`}>
                        🚜
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">{relatedItem.title}</h4>
                    <p className="text-emerald-600 font-bold">{formatPrice(relatedItem.price, relatedItem.currency)}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Equipment details */}
        <div className="space-y-6">
          <div className="bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-white mb-3">{equipment.title}</h1>
            <div className="text-3xl font-bold text-green-500 mb-6">{formatPrice(equipment.price, equipment.currency)}</div>

            <div className="space-y-4 border-t border-gray-700 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-400">الحالة</span>
                <span className="text-white font-medium">
                  {getConditionLabel(equipment.condition)}
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
  );
};

export default EquipmentDetailPage;
