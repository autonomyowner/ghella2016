import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Heart, Share2, MapPin, Star, Clock, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

type ProductCondition = 'new' | 'used' | 'refurbished' | string;

interface OptimizedProductCardProps {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: string;
  image: string;
  category: string;
  postedDate?: string;
  views?: number;
  rating?: number;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onShare?: (id: string) => void;
  isLand?: boolean;
  area?: number;
  condition?: ProductCondition;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  images?: string[];
  priority?: boolean;
}

const OptimizedProductCard = memo(({
  id,
  title,
  price = 0,
  currency = 'دج',
  location = 'غير محدد',
  image = '/placeholder.jpg',
  category = 'أخرى',
  postedDate,
  views = 0,
  rating = 0,
  isFavorited = false,
  onFavoriteToggle,
  onShare,
  isLand = false,
  area,
  condition = 'used',
  discount = 0,
  isNew = false,
  isFeatured = false,
  images = [],
  priority = false,
}: OptimizedProductCardProps) => {
  // Memoize formatted values
  const formattedPrice = useMemo(() => {
    const numericPrice = Number(price) || 0;
    return new Intl.NumberFormat('ar-DZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericPrice);
  }, [price]);

  const formattedDate = useMemo(() => {
    if (!postedDate) return 'غير محدد';
    try {
      return new Date(postedDate).toLocaleDateString('ar-DZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return 'غير محدد';
    }
  }, [postedDate]);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(id);
  }, [id, onFavoriteToggle]);

  const handleShareClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(id);
  }, [id, onShare]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Navigate to product details or handle click
    console.log('Product clicked:', id);
  }, [id]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.025, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.16), 0 1.5px 6px 0 rgba(0,0,0,0.04)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 30, duration: 0.28 }}
      className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 relative group focus-within:ring-2 focus-within:ring-green-500 focus:outline-none cursor-pointer transition-all duration-300"
      aria-labelledby={`product-${id}-title`}
      role="article"
      tabIndex={0}
      aria-label={title}
      onClick={handleClick}
    >
    
      {/* Featured Ribbon */}
      {isFeatured && (
        <div className="absolute top-5 left-0 bg-gradient-to-r from-green-700 via-green-500 to-green-400 text-white px-5 py-1.5 text-xs font-extrabold rounded-r-2xl shadow-2xl z-20 flex items-center gap-1 animate-bounce-in">
          <Star className="w-4 h-4 text-yellow-300 mr-1" aria-hidden="true" />
          <span className="sr-only">إعلان مميز</span>
          <span aria-hidden="true">مميز</span>
        </div>
      )}
      
      {/* Discount Ribbon */}
      {discount > 0 && (
        <div className="absolute top-5 right-5 bg-gradient-to-l from-pink-600 via-pink-400 to-pink-300 text-white px-4 py-1.5 text-xs font-extrabold rounded-l-2xl shadow-2xl z-20 flex items-center gap-1 animate-bounce-in">
          <span className="sr-only">خصم {discount} بالمئة</span>
          <span aria-hidden="true">خصم {discount}%</span>
        </div>
      )}
      
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 group-hover:brightness-95 transition-transform duration-300 rounded-2xl border border-gray-100 shadow-sm"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIiAvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNjY2MiPjx0c3BhbiB4PSI1MCUiIGR5PSI1JSI+..."
        />
        
        {/* New Badge */}
        {isNew && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white px-4 py-1.5 text-xs font-extrabold rounded-full shadow-2xl z-20 animate-fade-in">
            <span className="sr-only">جديد</span>
            <span aria-hidden="true">جديد</span>
          </div>
        )}
      </div>
      
      {/* Product Details */}
      <div className="p-6 flex flex-col gap-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h3 
            id={`product-${id}-title`}
            className="text-xl font-extrabold text-gray-900 line-clamp-2 min-h-[3rem] tracking-tight leading-snug"
            title={title}
          >
            {title}
          </h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-amber-500 fill-current" aria-hidden="true" />
              <span className="text-base font-bold text-amber-800">
                {rating.toFixed(1)}
                <span className="sr-only">تقييم</span>
              </span>
            </div>
          )}
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span className="truncate" title={location}>{location}</span>
        </div>
        
        {/* Price */}
        <div className="mt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-green-700">
              {formattedPrice}
              <span className="mr-1 text-base font-normal">{currency}</span>
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat('ar-DZ').format(price * (1 + discount / 100))} {currency}
              </span>
            )}
          </div>
          {isLand && area && (
            <div className="mt-1 text-sm text-gray-500">
              <span>مساحة: {area.toLocaleString('ar-DZ')} م²</span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <motion.button
            type="button"
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.92, rotate: -10 }}
            whileHover={{ scale: 1.1, backgroundColor: isFavorited ? '#fee2e2' : '#f3f4f6' }}
            className={`p-2 rounded-full border-2 transition-all duration-200 flex-shrink-0 focus:ring-2 focus:ring-red-400 focus:outline-none shadow-sm ${
              isFavorited 
                ? 'bg-red-50 border-red-300 text-red-500 hover:bg-red-100' 
                : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
            }`}
            aria-label={isFavorited ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            aria-pressed={isFavorited}
          >
            <Heart 
              className={`w-5 h-5 transition-all duration-200 ${isFavorited ? 'fill-current scale-110' : 'scale-100'}`} 
              aria-hidden="true" 
            />
          </motion.button>
          
          <motion.button
            type="button"
            onClick={handleShareClick}
            whileTap={{ scale: 0.92, rotate: 10 }}
            whileHover={{ scale: 1.1, backgroundColor: '#e0e7ff' }}
            className="p-2 rounded-full border-2 border-blue-100 bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all duration-200 flex-shrink-0 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm"
            aria-label="مشاركة الإعلان"
          >
            <Share2 className="w-5 h-5 transition-all duration-200" aria-hidden="true" />
          </motion.button>
          
          <div className="flex-1 flex items-center justify-end gap-4 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {views.toLocaleString('ar-DZ')}
            </span>
            <span className="flex items-center gap-1 mr-2">
              <Clock className="w-4 h-4" />
              <time dateTime={postedDate}>{formattedDate}</time>
            </span>
          </div>
        </div>
        
        {/* Category & Condition */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {category}
          </span>
          {condition && (
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              {condition === 'new' ? 'جديد' : condition === 'used' ? 'مستعمل' : 'مجدَّد'}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;