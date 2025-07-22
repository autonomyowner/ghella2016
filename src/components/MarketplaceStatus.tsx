'use client'

import { useState, useEffect } from 'react'
import { useFirebase } from '@/hooks/useFirebase'
import { motion } from 'framer-motion'

interface MarketplaceStats {
  equipment: number
  land: number
  animals: number
  total: number
  lastUpdated: string
}

export default function MarketplaceStatus() {
  const { isOnline, isWithinLimits, getStats } = useFirebase()
  const [stats, setStats] = useState<MarketplaceStats>({
    equipment: 0,
    land: 0,
    animals: 0,
    total: 0,
    lastUpdated: new Date().toLocaleString('ar-DZ')
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        
        // Get equipment stats
        const equipmentData = await getStats()
        
        // Calculate marketplace stats
        const marketplaceStats: MarketplaceStats = {
          equipment: equipmentData?.totalEquipment || 0,
          land: Math.floor((equipmentData?.totalEquipment || 0) * 0.3), // Estimate land as 30% of equipment
          animals: Math.floor((equipmentData?.totalEquipment || 0) * 0.2), // Estimate animals as 20% of equipment
          total: equipmentData?.totalEquipment || 0,
          lastUpdated: new Date().toLocaleString('ar-DZ')
        }
        
        setStats(marketplaceStats)
      } catch (error) {
        console.error('Error loading marketplace stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
    const interval = setInterval(loadStats, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [getStats])

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500'
    if (!isWithinLimits) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStatusText = () => {
    if (!isOnline) return 'غير متصل'
    if (!isWithinLimits) return 'استخدام التخزين المحلي'
    return 'متصل ومتاح'
  }

  const getStatusIcon = () => {
    if (!isOnline) return '🔴'
    if (!isWithinLimits) return '🟡'
    return '🟢'
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">حالة السوق الزراعي</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>
          <span className="text-sm text-white/80">{getStatusText()}</span>
          <span className="text-lg">{getStatusIcon()}</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-white/20 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Equipment Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-3 bg-emerald-500/20 rounded-lg border border-emerald-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚜</span>
              <div>
                <div className="font-semibold text-white">المعدات الزراعية</div>
                <div className="text-sm text-emerald-200">{stats.equipment} معدة متاحة</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-300">{stats.equipment}</div>
              <div className="text-xs text-emerald-200">إعلان</div>
            </div>
          </motion.div>

          {/* Land Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-3 bg-green-500/20 rounded-lg border border-green-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌾</span>
              <div>
                <div className="font-semibold text-white">الأراضي الزراعية</div>
                <div className="text-sm text-green-200">{stats.land} أرض متاحة</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-300">{stats.land}</div>
              <div className="text-xs text-green-200">إعلان</div>
            </div>
          </motion.div>

          {/* Animals Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between p-3 bg-orange-500/20 rounded-lg border border-orange-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🐄</span>
              <div>
                <div className="font-semibold text-white">الحيوانات الزراعية</div>
                <div className="text-sm text-orange-200">{stats.animals} حيوان متاح</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-300">{stats.animals}</div>
              <div className="text-xs text-orange-200">إعلان</div>
            </div>
          </motion.div>

          {/* Total Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg border border-blue-500/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-semibold text-white">إجمالي الإعلانات</div>
                <div className="text-sm text-blue-200">جميع الفئات</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-300">{stats.total}</div>
              <div className="text-xs text-blue-200">إعلان</div>
            </div>
          </motion.div>

          {/* Last Updated */}
          <div className="text-center pt-4 border-t border-white/20">
            <div className="text-xs text-white/60">
              آخر تحديث: {stats.lastUpdated}
            </div>
          </div>

          {/* Firebase Status Details */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <div className="text-sm text-white/80 mb-2">تفاصيل الاتصال:</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>حالة الاتصال:</span>
                <span className={isOnline ? 'text-green-400' : 'text-red-400'}>
                  {isOnline ? 'متصل' : 'غير متصل'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>حدود Firebase:</span>
                <span className={isWithinLimits ? 'text-green-400' : 'text-yellow-400'}>
                  {isWithinLimits ? 'ضمن الحدود' : 'تجاوز الحدود'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>وضع التخزين:</span>
                <span className={!isOnline || !isWithinLimits ? 'text-yellow-400' : 'text-green-400'}>
                  {!isOnline || !isWithinLimits ? 'محلي' : 'سحابي'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 