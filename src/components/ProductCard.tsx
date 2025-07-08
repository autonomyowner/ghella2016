'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Eye, Heart, Share2 } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  currency?: string;
  location: string;
  image: string;
  category: string;
  postedDate: string;
  views?: number;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onShare?: (id: string) => void;
  isLand?: boolean;
  area?: number;
  condition?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  currency = 'ريال',
  location,
  image,
  category,
  postedDate,
  views = 0,
  isFavorited = false,
  onFavoriteToggle,
  onShare,
  isLand = false,
  area,
  condition
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'منذ يوم واحد';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`;
    return `منذ ${Math.ceil(diffDays / 30)} شهر`;
  };

  return (
    <div className="card-ultra glass-green group overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl hover-green-glow animate-green-glow">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 right-3 glass-green-dark px-2 py-1 rounded-full border border-green-300/30">
          <span className="text-xs sm:text-sm gradient-text-light font-medium">{category}</span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex space-x-1 space-x-reverse opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle?.(id);
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover-green-glow ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'glass-green-dark text-white hover:bg-red-500'
            }`}
          >
            <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onShare?.(id);
            }}
            className="w-8 h-8 sm:w-9 sm:h-9 glass-green-dark rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all duration-300 hover-green-glow"
          >
            <Share2 size={16} />
          </button>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 glass-green px-3 py-1 rounded-full border border-green-300/40">
          <span className="text-sm sm:text-base font-bold gradient-text-accent">
            {formatPrice(price)} {currency}
          </span>
        </div>

        {/* Condition Badge for Equipment */}
        {!isLand && condition && (
          <div className="absolute bottom-3 left-3 glass-green-dark px-2 py-1 rounded-full border border-green-300/30">
            <span className="text-xs gradient-text-light">{condition}</span>
          </div>
        )}

        {/* Area Badge for Land */}
        {isLand && area && (
          <div className="absolute bottom-3 left-3 glass-green-dark px-2 py-1 rounded-full border border-green-300/30">
            <span className="text-xs gradient-text-accent">{area} م²</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        <Link href={`/listings/${id}`} className="block group-hover:text-green-300 transition-colors">
          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg text-green-100 mb-2 line-clamp-2 group-hover:gradient-text-light transition-colors">
            {title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center text-green-200/80 mb-3">
          <MapPin size={14} className="ml-1 text-green-300" />
          <span className="text-xs sm:text-sm">{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-green-200/70 text-xs sm:text-sm pt-3 border-t border-green-300/20">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Calendar size={14} className="text-green-300" />
            <span>{formatDate(postedDate)}</span>
          </div>
          
          <div className="flex items-center space-x-1 space-x-reverse">
            <Eye size={14} className="text-green-300" />
            <span>{views}</span>
          </div>
        </div>
      </div>

      {/* Mobile Quick Action */}
      <div className="lg:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-900/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Link 
          href={`/listings/${id}`}
          className="block w-full btn-awesome text-center py-2 text-sm animate-green-glow"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
