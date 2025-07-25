'use client';

import React from 'react';
import Image from 'next/image';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  user_type: 'farmer' | 'buyer' | 'both';
  is_verified: boolean;
}

interface SellerInfoProps {
  seller: Profile;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

const SellerInfo: React.FC<SellerInfoProps> = ({ 
  seller, 
  variant = 'default',
  className = ''
}) => {
  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'farmer': return 'مزارع';
      case 'buyer': return 'مشتري';
      case 'both': return 'مزارع ومشتري';
      default: return 'مستخدم';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          container: 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4',
          title: 'text-lg font-bold text-white mb-2',
          avatar: 'w-12 h-12',
          name: 'text-white font-medium',
          info: 'text-gray-300 text-sm'
        };
      case 'detailed':
        return {
          container: 'bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6',
          title: 'text-xl font-bold text-white mb-4',
          avatar: 'w-16 h-16',
          name: 'text-xl font-bold text-white',
          info: 'text-gray-300'
        };
      default:
        return {
          container: 'bg-black/50 backdrop-blur-lg border border-green-500/30 rounded-xl p-6',
          title: 'text-xl font-bold text-white mb-4',
          avatar: 'w-16 h-16',
          name: 'text-xl font-bold text-white',
          info: 'text-gray-300'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`${styles.container} ${className}`}>
      <h2 className={styles.title}>معلومات البائع</h2>
      
      <div className="flex items-center mb-4">
        <div className={`${styles.avatar} bg-green-600 rounded-full flex items-center justify-center mr-3`}>
          {seller.avatar_url ? (
            <Image
              src={seller.avatar_url}
              alt={seller.full_name || ''}
              width={variant === 'compact' ? 48 : 64}
              height={variant === 'compact' ? 48 : 64}
              className="rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-xl">
              {seller.full_name ? seller.full_name[0].toUpperCase() : '👤'}
            </span>
          )}
        </div>
        <div>
          <h3 className={`${styles.name} flex items-center`}>
            {seller.full_name || 'مزارع موثوق'}
            {seller.is_verified && (
              <span className="ml-2 text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </h3>
          {seller.location && (
            <p className={`${styles.info} flex items-center gap-1`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {seller.location}
            </p>
          )}
          <p className={`${styles.info} flex items-center gap-1`}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            {getUserTypeLabel(seller.user_type)}
          </p>
        </div>
      </div>

      {variant !== 'compact' && seller.phone && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href={`tel:${seller.phone}`}
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>اتصل بالبائع</span>
          </a>

          <a
            href={`https://wa.me/${seller.phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span>واتساب</span>
          </a>
        </div>
      )}

      {variant === 'compact' && seller.phone && (
        <div className="flex gap-2">
          <a
            href={`tel:${seller.phone}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span>اتصل</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default SellerInfo; 