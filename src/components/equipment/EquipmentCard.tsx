'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Equipment } from '@/types/database.types'
import { MapPin, Star, Calendar, DollarSign } from 'lucide-react'

interface EquipmentCardProps {
  equipment: Equipment
  viewMode?: 'grid' | 'list'
}

export default function EquipmentCard({ equipment, viewMode = 'grid' }: EquipmentCardProps) {
  const {
    id,
    title,
    price,
    location,
    images,
    condition,
    brand,
    model,
    year,
    currency = 'DZD',
    is_available,
    created_at
  } = equipment

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('ar-DZ', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(price)

  // Condition translation
  const conditionMap: Record<string, string> = {
    'new': 'جديد',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
    'poor': 'يحتاج صيانة'
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-DZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (viewMode === 'list') {
    return (
      <Link href={`/equipment/${id}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="group flex gap-4 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer hover:bg-white/15"
        >
          <div className="relative w-40 h-28 rounded-lg overflow-hidden flex-shrink-0">
            {images && images.length > 0 ? (
              <Image
                src={images[0]}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                <span className="text-3xl">🚜</span>
              </div>
            )}
            
            {/* Condition Badge */}
            <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-md">
              {conditionMap[condition] || condition}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                {title}
              </h3>
              <span className="text-xl font-bold text-emerald-400 flex-shrink-0 mr-4">
                {formattedPrice}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-300 mb-2">
              <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400">
              {(brand || model || year) && (
                <span>{[brand, model, year].filter(Boolean).join(' • ')}</span>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-emerald-500/20 text-emerald-400 text-sm px-3 py-1 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
              عرض التفاصيل
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/equipment/${id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="group flex flex-col h-full overflow-hidden rounded-xl border border-white/20 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 bg-white/10 backdrop-blur-md hover:bg-white/15"
      >
        <div className="relative aspect-video overflow-hidden">
          {images && images.length > 0 ? (
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
              <span className="text-4xl">🚜</span>
            </div>
          )}
          
          {/* Condition Badge */}
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-md">
            {conditionMap[condition] || condition}
          </div>
          
          {/* Availability Badge */}
          {!is_available && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-md">
              غير متاح
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
            {formatDate(created_at)}
          </div>
        </div>

        <div className="flex flex-col flex-grow p-6">
          <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>

          <div className="flex flex-col mt-auto pt-2">
            {/* Brand, Model, Year */}
            {(brand || model || year) && (
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <span>{[brand, model, year].filter(Boolean).join(' • ')}</span>
              </div>
            )}

            {/* Location */}
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <MapPin className="w-4 h-4 mr-1 text-emerald-500" />
              <span>{location}</span>
            </div>

            {/* Price and Action */}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-emerald-400">{formattedPrice}</span>
              <div className="bg-emerald-500/20 text-emerald-400 text-xs px-3 py-1 rounded-md group-hover:bg-emerald-500/30 transition-colors">
                عرض التفاصيل
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
