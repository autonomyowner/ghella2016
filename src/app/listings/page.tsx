'use client';

import React, { useState } from 'react';
import { useEquipment } from '@/hooks/useData';
import ProductCard from '@/components/ProductCard';
import SearchFilters from '@/components/SearchFilters';
import Loading from '@/components/Loading';
import { Equipment } from '@/types/database.types';

export default function ListingsPage() {
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    priceRange: [0, 1000000] as [number, number],
    condition: ''
  });
  
  const { equipment, loading, error } = useEquipment(filters);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'popular'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Sort equipment
  const sortedEquipment = React.useMemo(() => {
    if (!equipment) return [];
    
    const sorted = [...equipment];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a: Equipment, b: Equipment) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a: Equipment, b: Equipment) => b.price - a.price);
      case 'newest':
        return sorted.sort((a: Equipment, b: Equipment) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      default:
        return sorted;
    }
  }, [equipment, sortBy]);

  type Filters = {
    category?: string;
    location?: string;
    priceRange?: [number, number];
    condition?: string;
    search?: string;
  };
  const handleFiltersChange = (newFilters: Filters) => {
    setFilters({
      category: newFilters.category || '',
      location: newFilters.location || '',
      priceRange: newFilters.priceRange || [0, 1000000],
      condition: newFilters.condition || ''
    });
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="container-responsive spacing-responsive-xl">
      <div className="card-responsive text-center bg-red-50 border border-red-200">
        <p className="text-responsive-base text-red-600">حدث خطأ في تحميل البيانات: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-900">
      {/* Hero Section */}
      <section className="relative gradient-bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 animate-color-wave opacity-30"></div>
        <div className="container-responsive spacing-responsive-xl relative z-10">
          <div className="text-center animate-fade-in-up">
            <h1 className="heading-responsive-h1 gradient-text-light mb-4">
              استكشف أفضل المعدات الزراعية
            </h1>
            <p className="text-responsive-lg text-green-100 max-w-3xl mx-auto">
              اكتشف مجموعة واسعة من المعدات والآلات الزراعية المتطورة لتحسين إنتاجيتك الزراعية
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-responsive spacing-responsive-lg">
        {/* Search and Filter Bar */}
        <div className="glass-dark rounded-2xl p-4 md:p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Input */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن المعدات..."
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/20 focus:ring-2 focus:ring-green-400 focus:border-transparent text-responsive-base"
                  onChange={(e) => handleFiltersChange({ ...filters, search: e.target.value })}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
            </div>

            {/* Sort and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 rounded-xl border border-white/20 focus:ring-2 focus:ring-green-400 text-responsive-sm bg-white/10 text-white min-w-40"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: منخفض إلى مرتفع</option>
                <option value="price-high">السعر: مرتفع إلى منخفض</option>
                <option value="popular">الأكثر شعبية</option>
              </select>

              {/* Filter Toggle Button (Mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-awesome lg:hidden"
              >
                فلترة ({sortedEquipment.length})
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/20 lg:hidden">
              <SearchFilters
                onFiltersChange={handleFiltersChange}
                type="equipment"
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="heading-responsive-h3 text-gray-800 dark:text-gray-200">
            النتائج ({sortedEquipment.length} منتج)
          </h2>
          
          {/* View Toggle */}
          <div className="flex gap-2 self-start sm:self-auto">
            <button className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors touch-friendly">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors touch-friendly">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-80 shrink-0 animate-slide-in-right">
            <div className="sticky top-24">
              <SearchFilters
                onFiltersChange={handleFiltersChange}
                type="equipment"
              />
            </div>
          </aside>

          {/* Equipment Grid */}
          <main className="flex-1">
            {sortedEquipment.length === 0 ? (
              <div className="card-awesome glass-light text-center py-16 animate-fade-in-up">
                <div className="text-6xl mb-4">🚜</div>
                <h3 className="heading-responsive-h3 text-gray-700 mb-2">
                  لا توجد منتجات متاحة
                </h3>
                <p className="text-responsive-base text-gray-500 mb-6">
                  جرب تغيير معايير البحث أو المرشحات
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      category: '',
                      location: '',
                      priceRange: [0, 1000000],
                      condition: ''
                    });
                  }}
                  className="btn-awesome"
                >
                  إعادة تعيين المرشحات
                </button>
              </div>
            ) : (
              <div className="grid-responsive stagger-animation animate">
                {sortedEquipment.map((item) => (
                  <ProductCard 
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    price={item.price}
                    currency={item.currency}
                    location={item.location}
                    image={item.images?.[0] || '/assets/placeholder.png'}
                    category={item.categories?.name_ar || 'غير محدد'}
                    postedDate={item.created_at}
                    condition={item.condition}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {sortedEquipment.length > 0 && sortedEquipment.length % 12 === 0 && (
              <div className="text-center mt-12 animate-fade-in-up">
                <button className="btn-awesome">
                  تحميل المزيد من المنتجات
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Quick Actions FAB (Mobile) */}
      <div className="fixed bottom-20 left-4 z-40 lg:hidden">
        <div className="flex flex-col gap-3">
          <button className="w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center touch-friendly animate-bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          </button>
          <button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center touch-friendly animate-bounce-in" style={{ animationDelay: '0.1s' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
