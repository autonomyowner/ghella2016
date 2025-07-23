'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchResult } from '@/contexts/SearchContext';
import { 
  Wrench, 
  MapPin, 
  Leaf, 
  Package, 
  Clock, 
  DollarSign,
  Search,
  X,
  TrendingUp
} from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
  onResultClick: () => void;
  onClearSearch: () => void;
  searchTerm: string;
  suggestions: string[];
  recentSearches: string[];
  onSuggestionClick: (term: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading,
  error,
  onResultClick,
  onClearSearch,
  searchTerm,
  suggestions,
  recentSearches,
  onSuggestionClick
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment':
        return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'land':
        return <MapPin className="w-4 h-4 text-green-500" />;
      case 'product':
        return <Package className="w-4 h-4 text-orange-500" />;
      case 'nursery':
        return <Leaf className="w-4 h-4 text-emerald-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden z-50">
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600 mt-2">جاري البحث...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden z-50">
        <div className="p-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!searchTerm.trim()) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden z-50">
        <div className="p-4">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                البحث الأخير
              </h3>
              <div className="space-y-1">
                {recentSearches.slice(0, 5).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(term)}
                    className="w-full text-right px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Searches */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              البحث الشائع
            </h3>
            <div className="flex flex-wrap gap-2">
              {['جرار زراعي', 'أرض زراعية', 'طماطم', 'معدات ري', 'شتلات'].map((term, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(term)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden z-50">
        <div className="p-4">
          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">اقتراحات البحث</h3>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="w-full text-right px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          <div className="text-center py-8">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">لا توجد نتائج لـ "{searchTerm}"</p>
            <p className="text-sm text-gray-400 mt-1">جرب البحث بكلمات مختلفة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
      <div className="p-4">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">
            {results.length} نتيجة لـ "{searchTerm}"
          </h3>
          <button
            onClick={onClearSearch}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="space-y-3">
          {results.map((result) => (
            <Link
              key={`${result.type}-${result.id}`}
              href={result.url}
              onClick={onResultClick}
              className="block p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200"
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                {/* Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                  {result.image ? (
                    <Image
                      src={result.image}
                      alt={result.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      {getTypeIcon(result.type)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {getTypeIcon(result.type)}
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                    {result.title}
                  </h4>
                  
                  {result.description && (
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {result.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      {result.price && (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <DollarSign className="w-3 h-3" />
                          {formatPrice(result.price, result.currency)}
                        </span>
                      )}
                      {result.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.location}
                        </span>
                      )}
                    </div>
                    <span>{formatDate(result.created_at)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Results */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={`/search?q=${encodeURIComponent(searchTerm)}`}
            onClick={onResultClick}
            className="block w-full text-center py-2 text-sm text-green-600 hover:text-green-700 font-medium"
          >
            عرض جميع النتائج ({results.length})
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResults; 