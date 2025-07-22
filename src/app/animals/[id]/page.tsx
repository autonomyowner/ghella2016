'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirebase } from '@/hooks/useFirebase';

interface AnimalListing {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  animal_type: 'sheep' | 'cow' | 'goat' | 'chicken' | 'camel' | 'horse' | 'other';
  breed: string | null;
  age_months: number | null;
  gender: 'male' | 'female' | 'mixed';
  quantity: number;
  health_status: string | null;
  vaccination_status: boolean;
  location: string;
  coordinates?: any;
  images: string[];
  is_available: boolean;
  is_featured: boolean;
  view_count: number;
  weight_kg: number | null;
  price_per_head: boolean;
  purpose: 'meat' | 'dairy' | 'breeding' | 'work' | 'pets' | 'other';
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

const AnimalDetailPage: React.FC = () => {
  const params = useParams();
  const animalId = params.id as string;
  const { getAnimals, isOnline, isWithinLimits } = useFirebase();
  
  const [animal, setAnimal] = useState<AnimalListing | null>(null);
  const [seller, setSeller] = useState<Profile | null>(null);
  const [relatedAnimals, setRelatedAnimals] = useState<AnimalListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (animalId) {
      fetchAnimalDetails();
    }
  }, [animalId]);

  const fetchAnimalDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use our hybrid hook to get animal data
      const data = await getAnimals();
      
      // Find the specific animal by ID
      const animalData = data.find(item => item.id === animalId);
      
      if (!animalData) {
        setError('لم يتم العثور على الإعلان');
        return;
      }

      // Use the animal data directly since it's already in the correct format
      setAnimal(animalData);

      // Mock seller data for now
      const mockSeller: Profile = {
        id: animalData.user_id,
        full_name: 'مزارع موثوق',
        phone: '+213 123 456 789',
        location: animalData.location || 'الجزائر',
        avatar_url: null,
        user_type: 'farmer',
        is_verified: true
      };
      setSeller(mockSeller);

      // Get related animals (same type)
      const relatedData = data
        .filter(item => 
          item.id !== animalId && 
          item.animal_type === animalData.animal_type &&
          item.is_available !== false
        )
        .slice(0, 4);

      setRelatedAnimals(relatedData);

    } catch (err: any) {
      console.error('Error fetching animal details:', err);
      setError('حدث خطأ في تحميل تفاصيل الإعلان');
    } finally {
      setLoading(false);
    }
  };

  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (!animal || !animal.images) return;

    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === animal.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? animal.images.length - 1 : prev - 1
      );
    }
  };

  const getAnimalTypeLabel = (type: string) => {
    const types = {
      sheep: 'أغنام',
      cow: 'أبقار',
      goat: 'ماعز',
      chicken: 'دجاج',
      camel: 'جمال',
      horse: 'خيول',
      other: 'أخرى'
    };
    return types[type as keyof typeof types] || type;
  };

  const getPurposeLabel = (purpose: string) => {
    const purposes = {
      meat: 'للحم',
      dairy: 'للحليب',
      breeding: 'للتربية',
      work: 'للعمل',
      pets: 'حيوانات أليفة',
      other: 'أخرى'
    };
    return purposes[purpose as keyof typeof purposes] || purpose;
  };

  const getGenderLabel = (gender: string) => {
    const genders = {
      male: 'ذكر',
      female: 'أنثى',
      mixed: 'مختلط'
    };
    return genders[gender as keyof typeof genders] || gender;
  };

  const formatPrice = (price: number, currency: string, perHead: boolean, quantity: number) => {
    const formatter = new Intl.NumberFormat('ar-DZ');
    if (perHead) {
      return {
        main: `${formatter.format(price)} ${currency}`,
        sub: 'لكل رأس',
        total: quantity > 1 ? `الإجمالي: ${formatter.format(price * quantity)} ${currency}` : null
      };
    } else {
      return {
        main: `${formatter.format(price)} ${currency}`,
        sub: `للكمية الإجمالية (${quantity} رؤوس)`,
        total: null
      };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل تفاصيل الإعلان...</p>
        </div>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">🐄</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">خطأ</h2>
          <p className="text-gray-600 mb-4">{error || 'لم يتم العثور على الإعلان'}</p>
          <Link
            href="/animals"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            العودة لسوق الحيوانات
          </Link>
        </div>
      </div>
    );
  }

  const priceInfo = formatPrice(animal.price, animal.currency, animal.price_per_head, animal.quantity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex space-x-2 space-x-reverse text-gray-600">
            <li><Link href="/" className="hover:text-orange-600">الرئيسية</Link></li>
            <li>/</li>
            <li><Link href="/animals" className="hover:text-orange-600">سوق الحيوانات</Link></li>
            <li>/</li>
            <li className="text-gray-800">{animal.title}</li>
          </ol>
        </nav>

        {/* Status Indicator */}
        {(!isOnline || !isWithinLimits) && (
          <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              {!isOnline ? 'وضع عدم الاتصال' : 'استخدام التخزين المحلي'}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="relative">
                {animal.images && animal.images.length > 0 ? (
                  <>
                    <Image
                      src={animal.images[currentImageIndex]}
                      alt={animal.title}
                      width={800}
                      height={500}
                      className="w-full h-96 object-cover"
                    />
                    
                    {animal.images.length > 1 && (
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
                  </>
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-8xl">
                      {animal.animal_type === 'sheep' ? '🐑' :
                       animal.animal_type === 'cow' ? '🐄' :
                       animal.animal_type === 'goat' ? '🐐' :
                       animal.animal_type === 'chicken' ? '🐔' :
                       animal.animal_type === 'camel' ? '🐪' :
                       animal.animal_type === 'horse' ? '🐎' : '🐾'}
                    </span>
                  </div>
                )}
              </div>

              {/* Image Thumbnails */}
              {animal.images && animal.images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {animal.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${animal.title} - صورة ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Animal Details */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">{animal.title}</h1>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600">{priceInfo.main}</div>
                  <div className="text-sm text-gray-500">{priceInfo.sub}</div>
                  {priceInfo.total && (
                    <div className="text-sm text-orange-500 font-semibold">{priceInfo.total}</div>
                  )}
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{animal.description}</p>

              {/* Animal Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">نوع الحيوان:</span>
                    <span className="font-semibold">{getAnimalTypeLabel(animal.animal_type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الغرض:</span>
                    <span className="font-semibold">{getPurposeLabel(animal.purpose)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الجنس:</span>
                    <span className="font-semibold">{getGenderLabel(animal.gender)}</span>
                  </div>
                  {animal.breed && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">السلالة:</span>
                      <span className="font-semibold">{animal.breed}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">الكمية:</span>
                    <span className="font-semibold">{animal.quantity} رأس</span>
                  </div>
                  {animal.age_months && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">العمر:</span>
                      <span className="font-semibold">{animal.age_months} شهر</span>
                    </div>
                  )}
                  {animal.weight_kg && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-semibold">{animal.weight_kg} كغ</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة الصحية:</span>
                    <span className="font-semibold text-green-600">{animal.health_status}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  اتصل بالبائع
                </button>
                <button className="flex-1 bg-white border border-orange-600 text-orange-600 py-3 px-6 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  إضافة للمفضلة
                </button>
              </div>
            </div>

            {/* Related Animals */}
            {relatedAnimals.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">حيوانات مشابهة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedAnimals.map((relatedAnimal) => (
                    <Link
                      key={relatedAnimal.id}
                      href={`/animals/${relatedAnimal.id}`}
                      className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                    >
                      <div className="h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        {relatedAnimal.images && relatedAnimal.images.length > 0 && relatedAnimal.images[0] ? (
                          <Image
                            src={relatedAnimal.images[0]}
                            alt={relatedAnimal.title}
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
                        <span className={`text-4xl ${relatedAnimal.images && relatedAnimal.images.length > 0 && relatedAnimal.images[0] ? 'hidden' : ''}`}>
                          {relatedAnimal.animal_type === 'sheep' ? '🐑' :
                           relatedAnimal.animal_type === 'cow' ? '🐄' :
                           relatedAnimal.animal_type === 'goat' ? '🐐' :
                           relatedAnimal.animal_type === 'chicken' ? '🐔' :
                           relatedAnimal.animal_type === 'camel' ? '🐪' :
                           relatedAnimal.animal_type === 'horse' ? '🐎' : '🐾'}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1 line-clamp-1">{relatedAnimal.title}</h4>
                      <p className="text-orange-600 font-bold">{relatedAnimal.price} {relatedAnimal.currency}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Information */}
            {seller && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">معلومات البائع</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{seller.full_name}</div>
                      <div className="text-sm text-gray-500">{seller.location}</div>
                    </div>
                  </div>
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {seller.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">نوع المستخدم:</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {seller.user_type === 'farmer' ? 'مزارع' : 
                       seller.user_type === 'buyer' ? 'مشتري' : 'مزارع ومشتري'}
                    </span>
                  </div>
                  {seller.is_verified && (
                    <div className="flex items-center gap-2 text-green-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold">حساب موثق</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">الموقع</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{animal.location}</span>
              </div>
            </div>

            {/* Listing Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">معلومات الإعلان</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">تاريخ النشر:</span>
                  <span>{new Date(animal.created_at).toLocaleDateString('ar-DZ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">عدد المشاهدات:</span>
                  <span>{animal.view_count}</span>
                </div>
                {animal.is_featured && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">الحالة:</span>
                    <span className="text-orange-600 font-semibold">إعلان مميز</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailPage;
