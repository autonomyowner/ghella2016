// Satellite Analysis Component for Agricultural Intelligence
// Displays Sentinel Hub satellite imagery and NDVI analysis

import React, { useState } from 'react';
import { Satellite, TrendingUp, TrendingDown, Minus, Eye, Download, BarChart3, Leaf } from 'lucide-react';

interface SentinelData {
  imagery: {
    rgb: string;
    ndvi: string;
    moisture: string;
    chlorophyll: string;
  };
  ndvi: {
    current: number;
    average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    health: 'excellent' | 'good' | 'fair' | 'poor';
  };
  vegetation: {
    density: number;
    health: 'excellent' | 'good' | 'fair' | 'poor';
    stressFactors: string[];
    growthStage: string;
  };
  landUse: {
    type: string;
    confidence: number;
    area: number;
    change: 'positive' | 'negative' | 'stable';
  };
}

interface SatelliteAnalysisProps {
  sentinelData: SentinelData;
}

const SatelliteAnalysis: React.FC<SatelliteAnalysisProps> = ({ sentinelData }) => {
  // Add null checks and default values
  const safeData = {
    imagery: sentinelData?.imagery || {
      rgb: '',
      ndvi: '',
      moisture: '',
      chlorophyll: ''
    },
    ndvi: {
      current: sentinelData?.ndvi?.current || 0.5,
      average: sentinelData?.ndvi?.average || 0.5,
      trend: sentinelData?.ndvi?.trend || 'stable',
      health: sentinelData?.ndvi?.health || 'good'
    },
    vegetation: {
      density: sentinelData?.vegetation?.density || 75,
      health: sentinelData?.vegetation?.health || 'good',
      stressFactors: sentinelData?.vegetation?.stressFactors || [],
      growthStage: sentinelData?.vegetation?.growthStage || 'نمو متوسط'
    },
    landUse: {
      type: sentinelData?.landUse?.type || 'أراضي زراعية',
      confidence: sentinelData?.landUse?.confidence || 0.8,
      area: sentinelData?.landUse?.area || 100,
      change: sentinelData?.landUse?.change || 'stable'
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
        return <Leaf className="w-4 h-4 text-green-600" />;
      case 'good':
        return <Leaf className="w-4 h-4 text-blue-600" />;
      case 'fair':
        return <Leaf className="w-4 h-4 text-yellow-600" />;
      case 'poor':
        return <Leaf className="w-4 h-4 text-red-600" />;
      default:
        return <Leaf className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Simplified Satellite Analysis Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Satellite className="w-5 h-5 text-blue-500" />
            تحليل الأقمار الصناعية
          </h3>
        </div>

        {/* Simple Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(safeData.ndvi.current * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">NDVI</div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {safeData.vegetation.density.toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">كثافة النباتات</div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {safeData.landUse.confidence * 100}%
              </div>
              <div className="text-sm text-gray-600">مستوى الثقة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteAnalysis; 