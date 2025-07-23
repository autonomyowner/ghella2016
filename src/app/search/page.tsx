'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSearch } from '@/contexts/SearchContext';
import { SearchResult } from '@/contexts/SearchContext';
import UnifiedSearch from '@/components/UnifiedSearch';
import { 
  Wrench, 
  MapPin, 
  Leaf, 
  Package, 
  Filter,
  Grid,
  List,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { results, loading, error, search } = useSearch();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query, search]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Wrench className="w-5 h-5 text-blue-500" />;
      case 'land':
        return <MapPin className="w-5 h-5 text-green-500" />;
      case 'product':
        return <Package className="w-5 h-5 text-orange-500" />;
      case 'nursery':
        return <Leaf className="w-5 h-5 text-emerald-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'equipment':
        return 'معدات';
      case 'land':
        return 'أراضي';
      case 'product':
        return 'منتجات';
      case 'nursery':
        return 'مشاتل';
      default:
        return 'منتج';
    }
  };

  const formatPrice = (price?: number, currency?: string) => {
    if (!price) return 'السعر غير محدد';
    return new Intl.NumberFormat('ar-SA').format(price) + ' ' + (currency || 'DZD');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter results based on selected filters
  const filteredResults = results.filter(result => {
    // Filter by type
    if (selectedTypes.length > 0 && !selectedTypes.includes(result.type)) {
      return false;
    }
    
    // Filter by price range
    if (result.price && (result.price < priceRange[0] || result.price > priceRange[1])) {
      return false;
    }
    
    return true;
  });

  // Get unique types for filter
  const availableTypes = [...new Set(results.map(r => r.type))];

  return (
    <div className="min-h-screen gradient-bg-primary pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">نتائج البحث</h1>
          {query && (
            <p className="text-xl text-green-200">نتائج البحث عن "{query}"</p>
          )}
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <UnifiedSearch variant="homepage" />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                الفلاتر
              </h3>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-green-200 mb-3">نوع المنتج</h4>
                <div className="space-y-2">
                  {availableTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, type]);
                          } else {
                            setSelectedTypes(selectedTypes.filter(t => t !== type));
                          }
                        }}
                        className="w-4 h-4 text-green-500 bg-white/10 border-white/20 rounded focus:ring-green-400 focus:ring-2"
                      />
                      <span className="text-white ml-2 flex items-center">
                        {getTypeIcon(type)}
                        <span className="mr-2">{getTypeLabel(type)}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-green-200 mb-3">نطاق السعر</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/70">من</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/70">إلى</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                      placeholder="1000000"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  setPriceRange([0, 1000000]);
                }}
                className="w-full py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors text-sm"
              >
                مسح الفلاتر
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-white">
                <p className="text-lg">
                  {loading ? 'جاري البحث...' : `${filteredResults.length} نتيجة`}
                </p>
                {query && (
                  <p className="text-sm text-green-200">للبحث عن "{query}"</p>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
                <p className="text-white">جاري البحث...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filteredResults.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white text-lg mb-2">لا توجد نتائج</p>
                <p className="text-white/70">جرب البحث بكلمات مختلفة أو تغيير الفلاتر</p>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && filteredResults.length > 0 && (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredResults.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className={`block bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg overflow-hidden hover:bg-white/20 transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Image */}
                    <div className={`${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-video'} bg-gray-100 overflow-hidden`}>
                      {result.image ? (
                        <Image
                          src={result.image}
                          alt={result.title}
                          width={viewMode === 'list' ? 128 : 400}
                          height={viewMode === 'list' ? 128 : 225}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          {getTypeIcon(result.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(result.type)}
                        <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                        {result.title}
                      </h3>
                      
                      {result.description && (
                        <p className="text-sm text-white/70 mb-3 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          {result.price && (
                            <span className="flex items-center gap-1 text-green-300 font-medium">
                              <DollarSign className="w-4 h-4" />
                              {formatPrice(result.price, result.currency)}
                            </span>
                          )}
                          {result.location && (
                            <span className="flex items-center gap-1 text-white/60">
                              <MapPin className="w-4 h-4" />
                              {result.location}
                            </span>
                          )}
                        </div>
                        <span className="text-white/50 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(result.created_at)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 