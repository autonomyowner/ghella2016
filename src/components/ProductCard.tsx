'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Calendar, Eye, Heart, Share2, Star } from 'lucide-react';
import { cn, formatCurrency, formatRelativeTime, domUtils } from '@/lib/utils';

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
  rating?: number;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onShare?: (id: string) => void;
  isLand?: boolean;
  area?: number;
  condition?: string;
  discount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  images?: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  price,
  currency = 'SAR',
  location,
  image,
  category,
  postedDate,
  views = 0,
  rating = 0,
  isFavorited = false,
  onFavoriteToggle,
  onShare,
  isLand = false,
  area,
  condition,
  discount = 0,
  isNew = false,
  isFeatured = false,
  images = []
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(isFavorited);
  const [isSharing, setIsSharing] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  // Handle favorite toggle with animation
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(id);
    
    // Add haptic feedback on mobile
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Handle share with animation
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSharing(true);
    
    try {
      const shareData = {
        title: title,
        text: `تحقق من هذا المنتج: ${title}`,
        url: `${window.location.origin}/listings/${id}`,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await domUtils.copyToClipboard(`${window.location.origin}/listings/${id}`);
        // Show toast notification
        console.log('تم نسخ الرابط إلى الحافظة');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setTimeout(() => setIsSharing(false), 1000);
    }
  };

  // Calculate discounted price
  const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const savings = discount > 0 ? price - discountedPrice : 0;

  // Card variants for framer-motion
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    }
  };

  const imageVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden frosted-panel transition-all duration-500 ease-out hover:shadow-glow gpu-accelerated"
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        <motion.div
          variants={imageVariants}
          className="relative w-full h-full"
        >
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setIsImageLoaded(true)}
            priority={inView}
          />
          
          {/* Loading skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 to-brand-primary-dark/30 animate-pulse" />
          )}
        </motion.div>

        {/* Image Gallery Navigation */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                // setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
              }}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                // setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
              }}
              className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ›
            </button>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isNew && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cta-orange text-white shadow glow-orange">
              جديد
            </span>
          )}
          {isFeatured && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-primary text-white shadow glow-green">
              مميز
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cta-orange text-white shadow glow-orange">
              خصم {discount}%
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <div className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
            {category}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavoriteToggle}
            className={cn("p-2 rounded-full transition-colors", isFavorite ? "bg-cta-orange/80 text-white glow-orange" : "bg-white/10 text-brand-primary glow-green")}
            aria-label="تفضيل المنتج"
          >
            <Heart size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 text-brand-primary glow-green transition-colors"
            aria-label="مشاركة المنتج"
          >
            <Share2 size={20} />
          </motion.button>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <div className="px-3 py-2 bg-black/70 backdrop-blur-sm rounded-full border border-white/20">
            <div className="flex flex-col items-end">
              {discount > 0 && (
                <span className="text-xs text-slate-300 line-through">
                  {formatCurrency(price, currency)}
                </span>
              )}
              <span className="text-sm font-bold text-white">
                {formatCurrency(discountedPrice, currency)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-emerald-400 font-medium">
                  توفير {formatCurrency(savings, currency)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Condition/Area Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-xs text-white font-medium">
              {isLand && area ? `${area} م²` : condition || 'جديد'}
            </span>
          </div>
        </div>

        {/* Quick View Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <Link href={`/listings/${id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
                >
                  <span>عرض التفاصيل</span>
                </motion.button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/listings/${id}`} className="block group-hover:text-emerald-300 transition-colors">
          <h3 className="font-bold text-lg text-white mb-2 line-clamp-2 leading-tight group-hover:line-clamp-none">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={cn(
                    "transition-colors",
                    i < Math.floor(rating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-slate-600"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-slate-400">({rating})</span>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center text-slate-300 text-sm">
          <MapPin size={14} className="ml-1 text-emerald-400" />
          <span className="truncate">{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-emerald-400" />
              <span>{formatRelativeTime(postedDate)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye size={12} className="text-emerald-400" />
              <span>{views}</span>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoriteToggle}
              className={cn(
                "p-1.5 rounded-full transition-all duration-300",
                isFavorite 
                  ? "text-red-400 hover:text-red-300" 
                  : "text-slate-400 hover:text-red-400"
              )}
            >
              <Heart size={14} className={isFavorite ? "fill-current" : ""} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-1.5 rounded-full text-slate-400 hover:text-blue-400 transition-colors"
            >
              <Share2 size={14} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default ProductCard;
