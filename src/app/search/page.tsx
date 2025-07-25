'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import Link from 'next/link';
import { 
  MapPin, 
  Filter, 
  SortAsc, 
  Grid, 
  List,
  ArrowLeft,
  Search as SearchIcon
} from 'lucide-react';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchTerm, setSearchTerm, search, results, loading, error } = useSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'date'>('relevance');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (query && query !== searchTerm) {
      setSearchTerm(query);
      search(query);
    }
  }, [query, searchTerm, setSearchTerm, search]);

  const filteredResults = results.filter(result => {
    if (filterType === 'all') return true;
    return result.type === filterType;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0);
      case 'date':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        return 0; // relevance - already sorted by search relevance
    }
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'equipment': return 'معدات';
      case 'land': return 'أراضي';
      case 'vegetable': return 'خضروات';
      case 'animal': return 'حيوانات';
      case 'nursery': return 'مشاتل';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equipment': return 'bg-blue-500';
      case 'land': return 'bg-green-500';
      case 'vegetable': return 'bg-red-500';
      case 'animal': return 'bg-orange-500';
      case 'nursery': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-gray-900 text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-300 font-semibold">جاري البحث...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-300 hover:text-green-200 mb-4">
            <ArrowLeft className="w-4 h-4" />
            العودة للرئيسية
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <SearchIcon className="w-6 h-6 text-green-400" />
            <h1 className="text-3xl font-bold">نتائج البحث</h1>
          </div>
          
          {query && (
            <p className="text-gray-300">
              تم العثور على <span className="text-green-400 font-bold">{results.length}</span> نتيجة لـ 
              <span className="text-green-400 font-bold mx-2">"{query}"</span>
            </p>
          )}
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter by Type */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-green-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">جميع الأنواع</option>
                <option value="equipment">معدات</option>
                <option value="land">أراضي</option>
                <option value="vegetable">خضروات</option>
                <option value="animal">حيوانات</option>
                <option value="nursery">مشاتل</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-green-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="relevance">الأكثر صلة</option>
                <option value="price">السعر</option>
                <option value="date">التاريخ</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white/20 text-gray-300 hover:bg-white/30'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white/20 text-gray-300 hover:bg-white/30'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-bold mb-2">حدث خطأ</h3>
            <p className="text-gray-400">{error}</p>
          </div>
        )}

        {!loading && !error && sortedResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
            <p className="text-gray-400">جرب البحث بكلمات مختلفة</p>
          </div>
        )}

        {sortedResults.length > 0 && (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {sortedResults.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.url}
                className={`group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/15 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32' : 'h-48'}`}>
                  <img
                    src={result.image || '/assets/placeholder.png'}
                    alt={result.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/placeholder.png';
                    }}
                  />
                  <div className={`absolute top-2 right-2 ${getTypeColor(result.type)} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                    {getTypeLabel(result.type)}
                  </div>
                </div>
                
                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-green-300 transition-colors">
                    {result.title}
                  </h3>
                  
                  {result.description && (
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {result.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    {result.price && (
                      <div className="text-green-400 font-bold">
                        {result.price.toLocaleString('en-US')} {result.currency}
                      </div>
                    )}
                    {result.location && (
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <MapPin className="w-3 h-3" />
                        {result.location}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-900 to-gray-900 text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-green-300 font-semibold">جاري التحميل...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 