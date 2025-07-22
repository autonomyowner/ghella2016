'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ProductCondition = 'new' | 'used' | 'refurbished';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ProductCondition;
  location: string;
  brand: string;
  year: number;
  image: string;
  images: string[];
  category: string;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  createdAt: string;
  views: number;
  saved: number;
  featured: boolean;
  area?: number;
  discount?: number;
}
import { 
  Search, Filter, Grid, List, MapPin, Star, Heart, 
  MessageCircle, Phone, Eye, ChevronDown, ChevronRight,
  SlidersHorizontal, X, Calendar, DollarSign, Package,
  User, Verified, TrendingUp, Clock, ArrowUpDown,
  Map, Bookmark, Share2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/lib/firebaseConfig';

export default function ListingsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    condition: '',
    brand: '',
    year: '',
    priceRange: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [savedItems, setSavedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Mock filter options
  const filterOptions = {
    categories: [
      { id: 'equipment', name: 'معدات', count: 50 },
      { id: 'land', name: 'أراضي', count: 30 },
      { id: 'animals', name: 'حيوانات', count: 25 }
    ],
    brands: [
      { id: 'john-deere', name: 'جون دير', count: 15 },
      { id: 'massey-ferguson', name: 'ماسي فيرغسون', count: 12 },
      { id: 'new-holland', name: 'نيو هولاند', count: 8 }
    ],
    locations: [
      { id: 'algiers', name: 'الجزائر العاصمة', count: 20 },
      { id: 'oran', name: 'وهران', count: 15 },
      { id: 'constantine', name: 'قسنطينة', count: 10 }
    ],
    conditions: [
      { id: 'new', name: 'جديد', count: 25 },
      { id: 'used', name: 'مستعمل', count: 60 },
      { id: 'refurbished', name: 'مجدد', count: 15 }
    ]
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let q = query(collection(firestore, 'equipment'), limit(itemsPerPage));
      // Add more queries for other product types if needed
      const snapshot = await getDocs(q);
      let data = snapshot.docs.map(doc => {
        const docData = doc.data();
        return {
          id: doc.id,
          ...docData
        };
      });
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [currentPage]);

  // Filtering and sorting
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.category) {
      filtered = filtered.filter(p => p.category_id === filters.category);
    }
    if (filters.location) {
      filtered = filtered.filter(p => p.location === filters.location);
    }
    if (filters.condition) {
      filtered = filtered.filter(p => p.condition === filters.condition);
    }
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    if (filters.year) {
      filtered = filtered.filter(p => p.year === parseInt(filters.year));
    }
    if (filters.search) {
      filtered = filtered.filter(p =>
        (p.title && p.title.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(filters.search.toLowerCase())) ||
        (p.brand && p.brand.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return filtered;
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      condition: '',
      brand: '',
      year: '',
      priceRange: '',
      search: ''
    });
    setCurrentPage(1);
  };

  const toggleSaved = (productId: string) => {
    setSavedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">المنتجات الزراعية</h1>
              <p className="text-gray-300">
                {filteredProducts.length.toLocaleString()} منتج متاح
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 lg:flex-1 lg:max-w-2xl lg:mr-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن منتجات زراعية..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-lg transition-colors ${
                    showFilters ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`p-3 rounded-lg transition-colors ${
                    showMap ? 'bg-emerald-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Map className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="newest">الأحدث</option>
                <option value="price-low">السعر: من الأقل للأعلى</option>
                <option value="price-high">السعر: من الأعلى للأقل</option>
                <option value="rating">التقييم</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-black/20 backdrop-blur-md border-b border-white/10 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع الفئات</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الماركة</label>
                  <select
                    value={filters.brand}
                    onChange={(e) => handleFilterChange('brand', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع الماركات</option>
                    {filterOptions.brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name} ({brand.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الموقع</label>
                  <select
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع المواقع</option>
                    {filterOptions.locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} ({location.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    {filterOptions.conditions.map((condition) => (
                      <option key={condition.id} value={condition.id}>
                        {condition.name} ({condition.count})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  مسح جميع المرشحات
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
                        {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                  </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-gray-400 mb-4">لم يتم العثور على منتجات تطابق معايير البحث</p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
            >
              مسح جميع المرشحات
            </button>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {paginatedProducts.map((product) => {
                // Safely extract all values with fallbacks
                const safeImages = Array.isArray(product.images) ? product.images : [];
                const safeImage = product.image || (safeImages[0] || '/placeholder.jpg');
                
                return (
                  <div key={product.id} className="bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors">
                    <div className="aspect-square bg-gray-300 rounded-lg mb-4"></div>
                    <h3 className="font-semibold text-white mb-2">{product.title || 'بدون عنوان'}</h3>
                    <p className="text-emerald-400 font-bold mb-2">
                      {typeof product.price === 'number' ? product.price : 0} {product.currency || 'دج'}
                    </p>
                    <p className="text-gray-300 text-sm">{product.location || 'غير محدد'}</p>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  السابق
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  التالي
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
