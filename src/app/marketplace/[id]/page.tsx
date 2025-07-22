'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getMarketplaceItem, MarketplaceItem } from '@/lib/marketplaceService';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      if (params.id) {
        try {
          const foundItem = await getMarketplaceItem(params.id as string);
          if (foundItem) {
            setItem(foundItem);
          }
        } catch (error) {
          console.error('Error loading item:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadItem();
  }, [params.id]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M دج`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K دج`;
    }
    return `${price} دج`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'products': return 'fas fa-apple-alt';
      case 'lands': return 'fas fa-map-marked-alt';
      case 'machines': return 'fas fa-tractor';
      case 'nurseries': return 'fas fa-seedling';
      case 'animals': return 'fas fa-cow';
      case 'services': return 'fas fa-tools';
      default: return 'fas fa-box';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'products': return 'المنتجات';
      case 'lands': return 'الأراضي';
      case 'machines': return 'المعدات';
      case 'nurseries': return 'المشاتل';
      case 'animals': return 'الحيوانات';
      case 'services': return 'الخدمات';
      default: return 'أخرى';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-4">المنتج غير موجود</h1>
          <p className="text-emerald-600 mb-6">المنتج الذي تبحث عنه غير متوفر أو تم حذفه</p>
          <Link
            href="/marketplace"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-semibold"
          >
            العودة للسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-emerald-200/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center space-x-4 space-x-reverse"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <i className="fas fa-seedling text-white text-2xl"></i>
              </div>
              <div className="text-right">
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  الغلة
                </h1>
                <p className="text-sm text-emerald-600 font-semibold">منصة التكنولوجيا الزراعية</p>
              </div>
            </motion.div>

            {/* Auth Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center space-x-4 space-x-reverse"
            >
              <Link
                href="/auth/login"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-300 font-semibold"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/signup"
                className="px-6 py-2 bg-transparent border-2 border-emerald-500 hover:bg-emerald-500 text-emerald-600 hover:text-white rounded-lg transition-all duration-300 font-semibold"
              >
                إنشاء حساب
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 space-x-reverse mb-6 text-sm text-emerald-600">
            <Link href="/marketplace" className="hover:text-emerald-800 transition-colors">
              السوق
            </Link>
            <span>•</span>
            <Link href={`/marketplace?category=${item.category}`} className="hover:text-emerald-800 transition-colors">
              {getCategoryName(item.category)}
            </Link>
            <span>•</span>
            <span className="text-emerald-800 font-semibold">{item.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Image and Basic Info */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-emerald-200/50">
                <div className="text-center">
                  {item.images && item.images.length > 0 ? (
                    <div className="space-y-4">
                      {/* Main Image */}
                      <div className="relative">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-64 object-cover rounded-2xl border-2 border-emerald-200"
                        />
                        <div className="absolute top-4 right-4 flex space-x-2 space-x-reverse">
                          {item.is_organic && (
                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                              عضوي
                            </span>
                          )}
                          {item.is_verified && (
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                              موثق
                            </span>
                          )}
                          {item.has_delivery && (
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                              توصيل متوفر
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Image Gallery */}
                      {item.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-3">
                          {item.images.slice(1, 5).map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`${item.name} ${index + 2}`}
                                className="w-full h-16 object-cover rounded-lg border border-emerald-200 cursor-pointer hover:opacity-80 transition-opacity"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="text-8xl mb-4">{item.image}</div>
                      <div className="flex justify-center space-x-2 space-x-reverse mb-4">
                        {item.is_organic && (
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                            عضوي
                          </span>
                        )}
                        {item.is_verified && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                            موثق
                          </span>
                        )}
                        {item.has_delivery && (
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                            توصيل متوفر
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex gap-4">
                  <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition-colors">
                    <i className="fas fa-phone ml-2"></i>
                    اتصل بالبائع
                  </button>
                  <button className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 py-3 rounded-xl font-semibold transition-colors">
                    <i className="fas fa-heart ml-2"></i>
                    إضافة للمفضلة
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Price */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <i className={`${getCategoryIcon(item.category)} text-emerald-600`}></i>
                    </div>
                    <span className="text-emerald-600 font-semibold">{getCategoryName(item.category)}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-emerald-800">
                      {formatPrice(item.price)}
                    </div>
                    <div className="text-emerald-600">لكل {item.unit}</div>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-emerald-800 mb-4">{item.name}</h1>
                <p className="text-emerald-600 leading-relaxed mb-4">{item.description}</p>

                {/* Rating */}
                <div className="flex items-center space-x-4 space-x-reverse mb-4">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star ${i < Math.floor(item.rating) ? '' : 'far'}`}></i>
                    ))}
                    <span className="text-emerald-600 text-sm mr-2">({item.rating})</span>
                  </div>
                  <span className="text-emerald-600 text-sm">({item.reviews} تقييم)</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-200/50">
                <h3 className="text-xl font-bold text-emerald-800 mb-4">معلومات البائع</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">اسم البائع:</span>
                    <span className="font-semibold text-emerald-800">{item.seller_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">الموقع:</span>
                    <span className="font-semibold text-emerald-800">{item.location_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">المخزون المتوفر:</span>
                    <span className="font-semibold text-emerald-800">{item.stock} {item.unit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600">تاريخ النشر:</span>
                    <span className="font-semibold text-emerald-800">
                      {new Date(item.created_at).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                {item.contact_info && (
                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <h4 className="font-semibold text-emerald-800 mb-3">معلومات الاتصال</h4>
                    <div className="space-y-2">
                      {item.contact_info.phone && (
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <i className="fas fa-phone text-emerald-600"></i>
                          <span className="text-emerald-700">{item.contact_info.phone}</span>
                        </div>
                      )}
                      {item.contact_info.whatsapp && (
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <i className="fab fa-whatsapp text-emerald-600"></i>
                          <span className="text-emerald-700">{item.contact_info.whatsapp}</span>
                        </div>
                      )}
                      {item.contact_info.email && (
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <i className="fas fa-envelope text-emerald-600"></i>
                          <span className="text-emerald-700">{item.contact_info.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              {item.specifications && (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-emerald-200/50">
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">المواصفات</h3>
                  <div className="space-y-3">
                    {Object.entries(item.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-emerald-600">{key}:</span>
                        <span className="font-semibold text-emerald-800">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 