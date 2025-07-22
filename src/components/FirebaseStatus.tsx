'use client'

import { useState, useEffect } from 'react';
import { useFirebase } from '@/hooks/useFirebase';

export default function FirebaseStatus() {
  const { isOnline, isWithinLimits, getStats } = useFirebase();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getStats]);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-green-500/30">
        <div className="animate-pulse">
          <div className="h-4 bg-green-500/20 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-green-500/20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const readPercentage = (stats.readCount / stats.limits.FIRESTORE_READS_PER_DAY) * 100;
  const writePercentage = (stats.writeCount / stats.limits.FIRESTORE_WRITES_PER_DAY) * 100;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-green-500/30">
      <h3 className="text-lg font-bold text-green-300 mb-3">حالة Firebase</h3>
      
      <div className="space-y-3">
        {/* Online Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-200">الحالة:</span>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className={`text-sm ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>

        {/* Limits Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-200">الحدود:</span>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isWithinLimits ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className={`text-sm ${isWithinLimits ? 'text-green-400' : 'text-yellow-400'}`}>
              {isWithinLimits ? 'ضمن الحدود' : 'اقتراب من الحد'}
            </span>
          </div>
        </div>

        {/* Read Operations */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-200">قراءات اليوم:</span>
            <span className="text-green-300">{stats.readCount.toLocaleString()} / {stats.limits.FIRESTORE_READS_PER_DAY.toLocaleString()}</span>
          </div>
          <div className="w-full bg-green-500/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                readPercentage > 80 ? 'bg-red-400' : readPercentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(readPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Write Operations */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-200">كتابات اليوم:</span>
            <span className="text-green-300">{stats.writeCount.toLocaleString()} / {stats.limits.FIRESTORE_WRITES_PER_DAY.toLocaleString()}</span>
          </div>
          <div className="w-full bg-green-500/20 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                writePercentage > 80 ? 'bg-red-400' : writePercentage > 60 ? 'bg-yellow-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(writePercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-green-500/20">
          <div className="text-center">
            <div className="text-lg font-bold text-green-300">{stats.totalEquipment}</div>
            <div className="text-xs text-green-200">معدات</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-300">{stats.totalUsers}</div>
            <div className="text-xs text-green-200">مستخدمين</div>
          </div>
        </div>

        {/* Fallback Info */}
        {(!isOnline || !isWithinLimits) && (
          <div className="mt-3 p-2 bg-yellow-500/20 border border-yellow-500/30 rounded text-xs text-yellow-200">
            <div className="flex items-center">
              <span className="mr-1">⚠️</span>
              <span>يتم استخدام التخزين المحلي كبديل</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 