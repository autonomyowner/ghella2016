'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SlidersHorizontal,
  MapPin,
  Calendar,
  Star,
  Heart,
  Share2,
  ArrowRight,
  Plus,
  X
} from 'lucide-react';
import { designSystem, utils } from '@/lib/designSystem';
import { useDebounce } from '@/lib/performance';

interface MarketplaceLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: string;
  categories?: Array<{
    id: string;
    label: string;
    icon: string;
    count?: number;
  }>;
  filters?: Array<{
    id: string;
    label: string;
    type: 'select' | 'range' | 'checkbox';
    options?: Array<{ value: string; label: string }>;
  }>;
  sortOptions?: Array<{ value: string; label: string }>;
  onSearch?: (term: string) => void;
  onFilter?: (filters: any) => void;
  onSort?: (sort: string) => void;
  addItemLink?: string;
  addItemLabel?: string;
  stats?: Array<{ number: string; label: string; icon: string }>;
}

export default function MarketplaceLayout({
  children,
  title,
  subtitle,
  icon,
  categories = [],
  filters = [],
  sortOptions = [],
  onSearch,
  onFilter,
  onSort,
  addItemLink,
  addItemLabel = "إضافة عنصر",
  stats = []
}: MarketplaceLayoutProps) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState(sortOptions[0]?.value || 'newest');
  const [isHydrated, setIsHydrated] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch]);

  useEffect(() => {
    if (onFilter) {
      onFilter(selectedFilters);
    }
  }, [selectedFilters, onFilter]);

  useEffect(() => {
    if (onSort) {
      onSort(sortBy);
    }
  }, [sortBy, onSort]);

  const handleFilterChange = useCallback((filterId: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFilters({});
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy(sortOptions[0]?.value || 'newest');
  }, [sortOptions]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-300 font-semibold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-teal-400/25 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Icon Animation */}
          <div className="text-8xl mb-8 drop-shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
            {icon}
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-emerald-300 via-teal-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                placeholder="ابحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 transition-all duration-300 text-lg"
              />
            </div>
          </div>

          {/* Stats Section */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-emerald-300 mb-1">{stat.number}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Filters and Controls */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                فلاتر
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600' : 'hover:bg-white/10'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600' : 'hover:bg-white/10'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              {sortOptions.length > 0 && (
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Add Item Button */}
              {addItemLink && (
                <Link
                  href={addItemLink}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {addItemLabel}
                </Link>
              )}
            </div>

            {/* Category Chips */}
            {categories.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <span className="ml-2 text-lg">🌐</span>
                    جميع الفئات
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 ${
                        selectedCategory === category.id
                          ? 'bg-emerald-500 text-white shadow-lg'
                          : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <span className="ml-2 text-lg">{category.icon}</span>
                      {category.label}
                      {category.count && (
                        <span className="mr-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Filters */}
            {showFilters && filters.length > 0 && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filters.map((filter) => (
                    <div key={filter.id}>
                      <label className="block text-sm font-medium mb-2 text-white">{filter.label}</label>
                      {filter.type === 'select' && filter.options && (
                        <select
                          value={selectedFilters[filter.id] || ''}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                        >
                          <option value="">الكل</option>
                          {filter.options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {filter.type === 'range' && (
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="من"
                            value={selectedFilters[`${filter.id}_min`] || ''}
                            onChange={(e) => handleFilterChange(`${filter.id}_min`, e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                          />
                          <input
                            type="number"
                            placeholder="إلى"
                            value={selectedFilters[`${filter.id}_max`] || ''}
                            onChange={(e) => handleFilterChange(`${filter.id}_max`, e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      )}
                      {filter.type === 'checkbox' && filter.options && (
                        <div className="space-y-2">
                          {filter.options.map(option => (
                            <label key={option.value} className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={selectedFilters[filter.id]?.includes(option.value) || false}
                                onChange={(e) => {
                                  const current = selectedFilters[filter.id] || [];
                                  const newValue = e.target.checked
                                    ? [...current, option.value]
                                    : current.filter(v => v !== option.value);
                                  handleFilterChange(filter.id, newValue);
                                }}
                                className="mr-2 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-400"
                              />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Clear Filters */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    مسح الفلاتر
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
} 