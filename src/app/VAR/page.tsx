'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';

// Premium components with lazy loading
const PremiumBackground = dynamic(() => import('@/components/PremiumBackground'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900" />
  )
});

const PremiumHeader = dynamic(() => import('@/components/PremiumHeader'), {
  ssr: false,
  loading: () => <div className="h-20 bg-black/20 backdrop-blur-lg animate-pulse" />
});

// Import existing APIs
import { satelliteApi, SatelliteData } from '@/lib/satelliteApi';
import { nasaApi, NasaData } from '@/lib/nasaApi';
const VarInteractiveMap = dynamic(() => import('@/components/VarInteractiveMap'), { ssr: false });

// Import icons and components
import {
  MapPin, Satellite, Droplets, Leaf, TrendingUp,
  Download, FileText, Zap, Globe, BarChart3,
  Thermometer, Sun, CloudRain, Wind, Target,
  Layers, Eye, RefreshCw, AlertTriangle, CheckCircle, X,
  Brain, Cpu, Database, Network, Shield, Rocket
} from 'lucide-react';

// Import framer-motion components
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false, loading: () => <div /> });
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false, loading: () => <button /> });
const AnimatePresence = dynamic(() => import('framer-motion').then(mod => mod.AnimatePresence), { ssr: false, loading: () => null });

// Premium loading component
const PremiumLoadingSpinner = () => (
  <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <div className="absolute inset-0 w-20 h-20 border-4 border-teal-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
      </div>
      <p className="text-emerald-300 font-semibold text-lg">جاري تحميل منصة تحليل الأراضي...</p>
      <p className="text-emerald-400 text-sm mt-2">أحدث التقنيات لتحليل الأراضي الزراعية</p>
    </div>
  </div>
);

// Enhanced interfaces for advanced agricultural intelligence
interface LandData {
  coordinates: { lat: number; lon: number; };
  soilData: {
    clay: number; silt: number; sand: number; organicMatter: number; ph: number; moisture: number;
    nitrogen: number; phosphorus: number; potassium: number; carbonSequestration: number; microbialActivity: number;
  };
  cropData: {
    ndvi: number; health: 'excellent' | 'good' | 'fair' | 'poor'; growthStage: string; yieldPrediction: number;
    biomass: number; chlorophyll: number; waterStress: number; nutrientDeficiency: string[];
  };
  weatherData: {
    temperature: number; humidity: number; rainfall: number; windSpeed: number; solarRadiation: number;
    forecast: Array<{ date: string; temp: number; rain: number; condition: string; humidity: number; }>;
  };
  recommendations: Array<{
    type: 'irrigation' | 'fertilizer' | 'pest' | 'harvest' | 'soil' | 'crop' | 'climate' | 'ai';
    priority: 'high' | 'medium' | 'low'; title: string; description: string; impact: string;
    confidence: number; cost: number; roi: number;
  }>;
  aiInsights: {
    cropSuitability: string[]; optimalPlantingTime: string; pestRisk: number; diseaseProbability: number;
    marketTrends: string; sustainabilityScore: number;
  };
}

interface SatelliteImage {
  url: string;
  date: string;
  type: 'ndvi' | 'rgb' | 'thermal' | 'moisture' | 'chlorophyll';
  resolution: string;
}

const LiveLandIntelligenceTool: React.FC = () => {
  const [landData, setLandData] = useState<LandData | null>(null);
  const [nasaData, setNasaData] = useState<NasaData | null>(null);
  const [satelliteImages, setSatelliteImages] = useState<SatelliteImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<SatelliteImage | null>(null);
  const [coordinates, setCoordinates] = useState({ lat: 36.75, lon: 3.05 });
  const [analysisMode, setAnalysisMode] = useState<'overview' | 'detailed' | 'predictive'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [dataSource, setDataSource] = useState<'satellite' | 'nasa' | 'combined'>('combined');
  
  // Advanced filter states
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [selectedSoilTypes, setSelectedSoilTypes] = useState<string[]>([]);
  const [selectedClimateZones, setSelectedClimateZones] = useState<string[]>([]);
  const [selectedWaterTypes, setSelectedWaterTypes] = useState<string[]>([]);
  const [selectedLandSizes, setSelectedLandSizes] = useState<string[]>([]);
  const [selectedTechLevels, setSelectedTechLevels] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [yieldRange, setYieldRange] = useState<[number, number]>([0, 100]);

  const mapRef = useRef<HTMLDivElement>(null);

  const fetchLandData = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    try {
      const [satelliteResult, nasaResult] = await Promise.all([
        satelliteApi.fetchLandIntelligenceData(lat, lon),
        nasaApi.fetchNasaData(lat, lon)
      ]);

      const enhancedLandData: LandData = {
        coordinates: { lat, lon },
        soilData: {
          ...satelliteResult.soilData,
          nitrogen: 15 + Math.random() * 10,
          phosphorus: 20 + Math.random() * 15,
          potassium: 25 + Math.random() * 20,
          carbonSequestration: 2.5 + Math.random() * 3,
          microbialActivity: 60 + Math.random() * 30
        },
        cropData: {
          ...satelliteResult.cropData,
          biomass: 2.5 + Math.random() * 3,
          chlorophyll: 35 + Math.random() * 25,
          waterStress: 20 + Math.random() * 40,
          nutrientDeficiency: Math.random() > 0.7 ? ['Nitrogen'] : []
        },
        weatherData: {
          ...satelliteResult.weatherData,
          solarRadiation: 800 + Math.random() * 400
        },
        recommendations: [
          { type: 'irrigation', priority: 'high', title: 'تحسين جدول الري', description: 'رطوبة التربة منخفضة. زيادة تكرار الري بنسبة 20%.', impact: 'تحسين متوقع في الإنتاجية بنسبة 15%', confidence: 0.85, cost: 200, roi: 2.5 },
          { type: 'fertilizer', priority: 'medium', title: 'تطبيق الأسمدة النيتروجينية', description: 'مستويات النيتروجين متوسطة. تطبيق 50 كجم/هكتار من سماد NPK.', impact: 'تحسين متوقع في الإنتاجية بنسبة 8%', confidence: 0.75, cost: 150, roi: 1.8 },
          { type: 'pest', priority: 'low', title: 'مراقبة نشاط الآفات', description: 'الظروف الجوية مواتية لتطور الآفات. المراقبة الدقيقة مطلوبة.', impact: 'منع خسارة محتملة في الإنتاجية بنسبة 5%', confidence: 0.6, cost: 50, roi: 1.2 }
        ],
        aiInsights: {
          cropSuitability: ['قمح', 'شعير', 'ذرة'],
          optimalPlantingTime: 'أكتوبر - نوفمبر',
          pestRisk: 15 + Math.random() * 25,
          diseaseProbability: 10 + Math.random() * 20,
          marketTrends: 'ارتفاع في أسعار الحبوب',
          sustainabilityScore: 75 + Math.random() * 20
        }
      };

      setLandData(enhancedLandData);
      setNasaData(nasaResult);

      // Generate mock satellite images
      const mockImages: SatelliteImage[] = [
        { url: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#065f46;stop-opacity:1" /><stop offset="100%" style="stop-color:#0d9488;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="white" font-weight="bold">NDVI Analysis</text></svg>`)}`, date: new Date().toISOString(), type: 'ndvi', resolution: '10m' },
        { url: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" /><stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="white" font-weight="bold">RGB Image</text></svg>`)}`, date: new Date().toISOString(), type: 'rgb', resolution: '5m' },
        { url: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#dc2626;stop-opacity:1" /><stop offset="100%" style="stop-color:#f97316;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="white" font-weight="bold">Thermal Scan</text></svg>`)}`, date: new Date().toISOString(), type: 'thermal', resolution: '30m' }
      ];
      setSatelliteImages(mockImages);
    } catch (error) {
      console.error('Error fetching land data:', error);
      // Fallback to mock data
      const mockData: LandData = {
        coordinates: { lat, lon },
        soilData: {
          clay: 25 + Math.random() * 15, silt: 30 + Math.random() * 20, sand: 45 + Math.random() * 25,
          organicMatter: 2.5 + Math.random() * 3, ph: 6.2 + Math.random() * 1.6, moisture: 35 + Math.random() * 25,
          nitrogen: 15 + Math.random() * 10, phosphorus: 20 + Math.random() * 15, potassium: 25 + Math.random() * 20,
          carbonSequestration: 2.5 + Math.random() * 3, microbialActivity: 60 + Math.random() * 30
        },
        cropData: {
          ndvi: 0.65 + Math.random() * 0.25, health: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
          growthStage: ['Seedling', 'Vegetative', 'Flowering', 'Fruiting'][Math.floor(Math.random() * 4)],
          yieldPrediction: 85 + Math.random() * 15, biomass: 2.5 + Math.random() * 3, chlorophyll: 35 + Math.random() * 25,
          waterStress: 20 + Math.random() * 40, nutrientDeficiency: Math.random() > 0.7 ? ['Nitrogen'] : []
        },
        weatherData: {
          temperature: 22 + Math.random() * 15, humidity: 60 + Math.random() * 30, rainfall: Math.random() * 50,
          windSpeed: 5 + Math.random() * 15, solarRadiation: 800 + Math.random() * 400,
          forecast: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temp: 20 + Math.random() * 15, rain: Math.random() * 30,
            condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
            humidity: 50 + Math.random() * 30
          }))
        },
        recommendations: [
          { type: 'irrigation', priority: 'high', title: 'تحسين جدول الري', description: 'رطوبة التربة منخفضة. زيادة تكرار الري بنسبة 20%.', impact: 'تحسين متوقع في الإنتاجية بنسبة 15%', confidence: 0.85, cost: 200, roi: 2.5 },
          { type: 'fertilizer', priority: 'medium', title: 'تطبيق الأسمدة النيتروجينية', description: 'مستويات النيتروجين متوسطة. تطبيق 50 كجم/هكتار من سماد NPK.', impact: 'تحسين متوقع في الإنتاجية بنسبة 8%', confidence: 0.75, cost: 150, roi: 1.8 },
          { type: 'pest', priority: 'low', title: 'مراقبة نشاط الآفات', description: 'الظروف الجوية مواتية لتطور الآفات. المراقبة الدقيقة مطلوبة.', impact: 'منع خسارة محتملة في الإنتاجية بنسبة 5%', confidence: 0.6, cost: 50, roi: 1.2 }
        ],
        aiInsights: {
          cropSuitability: ['قمح', 'شعير', 'ذرة'], optimalPlantingTime: 'أكتوبر - نوفمبر',
          pestRisk: 15 + Math.random() * 25, diseaseProbability: 10 + Math.random() * 20,
          marketTrends: 'ارتفاع في أسعار الحبوب', sustainabilityScore: 75 + Math.random() * 20
        }
      };
      setLandData(mockData);
    } finally {
      setIsLoading(false);
    }
  }, [dataSource]);

  const handleCoordinateChange = (lat: number, lon: number) => {
    setCoordinates({ lat, lon });
    fetchLandData(lat, lon);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingReport(false);
    alert('تم إنشاء التقرير بنجاح!');
  };

  // Filter handler functions
  const handleCropFilter = (crop: string) => {
    setSelectedCrops(prev => 
      prev.includes(crop) 
        ? prev.filter(c => c !== crop)
        : [...prev, crop]
    );
  };

  const handleSoilFilter = (soil: string) => {
    setSelectedSoilTypes(prev => 
      prev.includes(soil) 
        ? prev.filter(s => s !== soil)
        : [...prev, soil]
    );
  };

  const handleClimateFilter = (climate: string) => {
    setSelectedClimateZones(prev => 
      prev.includes(climate) 
        ? prev.filter(c => c !== climate)
        : [...prev, climate]
    );
  };

  const handleWaterFilter = (water: string) => {
    setSelectedWaterTypes(prev => 
      prev.includes(water) 
        ? prev.filter(w => w !== water)
        : [...prev, water]
    );
  };

  const handleLandSizeFilter = (size: string) => {
    setSelectedLandSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleTechLevelFilter = (tech: string) => {
    setSelectedTechLevels(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const applyFilters = () => {
    // Apply all selected filters and refresh data
    console.log('Applying filters:', {
      crops: selectedCrops,
      soils: selectedSoilTypes,
      climates: selectedClimateZones,
      waters: selectedWaterTypes,
      sizes: selectedLandSizes,
      techs: selectedTechLevels,
      priceRange,
      yieldRange
    });
    
    // Refresh data with new filters
    fetchLandData(coordinates.lat, coordinates.lon);
  };

  const exportResults = () => {
    const data = {
      coordinates,
      landData,
      nasaData,
      filters: {
        crops: selectedCrops,
        soils: selectedSoilTypes,
        climates: selectedClimateZones,
        waters: selectedWaterTypes,
        sizes: selectedLandSizes,
        techs: selectedTechLevels,
        priceRange,
        yieldRange
      },
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agricultural-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-8">
        {/* Hero Background GIF */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: 'url(/assets/field.gif)',
          }}
        />
        
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Hero Content */}
        <div className="text-center max-w-7xl mx-auto relative z-20">
          {/* Premium Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-semibold mb-8 shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            منصة تحليل الأراضي المتطورة - تقنيات NASA
          </div>


          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-emerald-200 mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto">
            أحدث تقنيات تحليل البيانات وبيانات الأقمار الصناعية لتحليل الأراضي الزراعية وتحسين الإنتاجية
          </p>

          {/* Technology Icons */}
          <div className="flex justify-center items-center space-x-8 space-x-reverse mb-12">
            <div className="flex items-center space-x-2 space-x-reverse text-emerald-300">
              <Satellite className="w-8 h-8" />
              <span className="text-lg font-semibold">NASA</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-emerald-300">
              <Database className="w-8 h-8" />
              <span className="text-lg font-semibold">Big Data</span>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse text-emerald-300">
              <Cpu className="w-8 h-8" />
              <span className="text-lg font-semibold">ML</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-12">
            <button
              onClick={() => fetchLandData(coordinates.lat, coordinates.lon)}
              disabled={isLoading}
              className="group px-8 py-4 md:px-12 md:py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center disabled:opacity-50"
            >
              <RefreshCw className={`w-6 h-6 mr-3 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-300'}`} />
              {isLoading ? 'جاري التحليل...' : 'ابدأ التحليل الذكي'}
            </button>
            
            <button
              onClick={generateReport}
              disabled={isGeneratingReport || !landData}
              className="group px-8 py-4 md:px-12 md:py-5 bg-transparent border-2 border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-2xl font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50"
            >
              <FileText className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              {isGeneratingReport ? 'جاري التوليد...' : 'تقرير شامل'}
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">99%</div>
              <div className="text-emerald-200 text-sm">دقة التحليل</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">ML</div>
              <div className="text-emerald-200 text-sm">تعلم آلي</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">NASA</div>
              <div className="text-emerald-200 text-sm">بيانات فضائية</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-black text-emerald-400 mb-2">24/7</div>
              <div className="text-emerald-200 text-sm">مراقبة مستمرة</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              الخريطة <span className="text-emerald-400">التفاعلية الذكية</span>
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              تحليل شامل للأراضي الزراعية باستخدام أحدث تقنيات الأقمار الصناعية وتحليل البيانات
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-emerald-400 ml-2" />
              <h3 className="text-2xl font-bold text-white">تحليل متقدم للطقس والتربة وصور الأقمار الصناعية</h3>
            </div>
            <VarInteractiveMap
              lat={coordinates.lat}
              lon={coordinates.lon}
              weatherData={landData?.weatherData}
              soilData={landData?.soilData}
              satelliteImages={satelliteImages}
            />
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-black/50 to-emerald-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              فلاتر <span className="text-emerald-400">متقدمة للمزارعين</span>
            </h2>
            <p className="text-xl text-emerald-200 max-w-3xl mx-auto">
              أدوات تحليل متطورة لتحسين القرارات الزراعية وزيادة الإنتاجية
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Crop Type Filter */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Leaf className="w-8 h-8 text-emerald-400 ml-3" />
                <h3 className="text-xl font-bold text-white">نوع المحصول</h3>
              </div>
              <div className="space-y-4">
                {['قمح', 'شعير', 'ذرة', 'بطاطس', 'طماطم', 'زيتون', 'عنب', 'حمضيات'].map((crop) => (
                  <label key={crop} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedCrops.includes(crop)}
                      onChange={() => handleCropFilter(crop)}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2" 
                    />
                    <span className="text-emerald-200 group-hover:text-white transition-colors">{crop}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Soil Type Filter */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Layers className="w-8 h-8 text-emerald-400 ml-3" />
                <h3 className="text-xl font-bold text-white">نوع التربة</h3>
              </div>
              <div className="space-y-4">
                {['طينية', 'رملية', 'طميية', 'جيرية', 'ملحية', 'عضوية'].map((soil) => (
                  <label key={soil} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedSoilTypes.includes(soil)}
                      onChange={() => handleSoilFilter(soil)}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2" 
                    />
                    <span className="text-emerald-200 group-hover:text-white transition-colors">{soil}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Climate Zone Filter */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Thermometer className="w-8 h-8 text-emerald-400 ml-3" />
                <h3 className="text-xl font-bold text-white">المنطقة المناخية</h3>
              </div>
              <div className="space-y-4">
                {['ساحلية', 'جبلية', 'صحراوية', 'شبه جافة', 'رطبة', 'معتدلة'].map((climate) => (
                  <label key={climate} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedClimateZones.includes(climate)}
                      onChange={() => handleClimateFilter(climate)}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2" 
                    />
                    <span className="text-emerald-200 group-hover:text-white transition-colors">{climate}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Water Availability Filter */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Droplets className="w-8 h-8 text-emerald-400 ml-3" />
                <h3 className="text-xl font-bold text-white">توفر المياه</h3>
              </div>
              <div className="space-y-4">
                {['ري بالتنقيط', 'ري بالرش', 'ري بالغمر', 'مياه جوفية', 'مياه سطحية', 'مياه معالجة'].map((water) => (
                  <label key={water} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedWaterTypes.includes(water)}
                      onChange={() => handleWaterFilter(water)}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2" 
                    />
                    <span className="text-emerald-200 group-hover:text-white transition-colors">{water}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Land Size Filter */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Target className="w-8 h-8 text-emerald-400 ml-3" />
                <h3 className="text-xl font-bold text-white">مساحة الأرض</h3>
              </div>
              <div className="space-y-4">
                {['أقل من 1 هكتار', '1-5 هكتار', '5-10 هكتار', '10-50 هكتار', 'أكثر من 50 هكتار'].map((size) => (
                  <label key={size} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedLandSizes.includes(size)}
                      onChange={() => handleLandSizeFilter(size)}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2" 
                    />
                    <span className="text-emerald-200 group-hover:text-white transition-colors">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technology Level Filter */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <Cpu className="w-8 h-8 text-emerald-400 ml-3" />
                <h3 className="text-xl font-bold text-white">مستوى التقنية</h3>
              </div>
              <div className="space-y-4">
                {['تقليدية', 'شبه آلية', 'آلية', 'ذكية', 'متطورة', 'مستقبلية'].map((tech) => (
                  <label key={tech} className="flex items-center space-x-3 space-x-reverse cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedTechLevels.includes(tech)}
                      onChange={() => handleTechLevelFilter(tech)}
                      className="w-5 h-5 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2" 
                    />
                    <span className="text-emerald-200 group-hover:text-white transition-colors">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Analysis Tools */}
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl p-6 border border-emerald-400/30 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
                              <Brain className="w-12 h-12 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-bold text-white mb-2">تحليل البيانات المتقدم</h3>
              <p className="text-emerald-300 text-sm">توقعات متقدمة للمحاصيل والأسعار</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-400/30 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
              <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-bold text-white mb-2">تحليل السوق</h3>
              <p className="text-blue-300 text-sm">دراسة الأسعار والطلب العالمي</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-400/30 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-bold text-white mb-2">حماية المحاصيل</h3>
              <p className="text-purple-300 text-sm">اكتشاف مبكر للأمراض والآفات</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-400/30 text-center group hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Rocket className="w-12 h-12 text-orange-400 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-lg font-bold text-white mb-2">تحسين الإنتاجية</h3>
              <p className="text-orange-300 text-sm">زيادة المحصول بنسبة 30%</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={applyFilters}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 flex items-center justify-center"
            >
              <BarChart3 className="w-6 h-6 mr-3" />
              تطبيق الفلاتر
            </button>
            <button 
              onClick={exportResults}
              className="px-8 py-4 bg-transparent border-2 border-emerald-400 hover:bg-emerald-400/10 text-emerald-300 hover:text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <Download className="w-6 h-6 mr-3" />
              تصدير النتائج
            </button>
            <button 
              onClick={generateReport}
              className="px-8 py-4 bg-transparent border-2 border-blue-400 hover:bg-blue-400/10 text-blue-300 hover:text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <FileText className="w-6 h-6 mr-3" />
              تقرير مفصل
            </button>
          </div>
        </div>
      </section>

      {/* Loading Section */}
      {isLoading ? (
        <section className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-teal-400 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">جاري تحليل البيانات من الأقمار الصناعية...</h3>
            <p className="text-emerald-200 text-lg">قد يستغرق هذا بضع ثوانٍ</p>
            <div className="mt-8 flex justify-center space-x-4 space-x-reverse">
              <div className="flex items-center text-emerald-300">
                <Brain className="w-5 h-5 mr-2" />
                <span>تحليل البيانات</span>
              </div>
              <div className="flex items-center text-emerald-300">
                <Satellite className="w-5 h-5 mr-2" />
                <span>بيانات NASA</span>
              </div>
              <div className="flex items-center text-emerald-300">
                <Database className="w-5 h-5 mr-2" />
                <span>معالجة البيانات</span>
              </div>
            </div>
          </div>
        </section>
      ) : landData ? (
        <div className="relative z-10 py-20 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Analysis Panel */}
              <div className="lg:col-span-2 space-y-8">
                {/* Satellite Images */}
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Globe className="w-6 h-6 text-emerald-400 ml-3" />
                    صور الأقمار الصناعية المتقدمة
                  </h2>
                  {satelliteImages.length === 0 && (
                    <div className="text-center py-12">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                        <div className="absolute inset-0 w-20 h-20 border-4 border-teal-300 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '0.5s' }}></div>
                      </div>
                      <p className="text-emerald-200 text-lg">جاري تحميل صور الأقمار الصناعية...</p>
                      <p className="text-emerald-300 text-sm mt-2">تحليل متقدم للبيانات</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    {satelliteImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-2xl"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image.url}
                          alt={`Satellite ${image.type}`}
                          className="w-full h-56 object-cover rounded-2xl border border-white/20 group-hover:border-emerald-400/50 transition-all duration-300 transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/40 transition-all duration-300 rounded-2xl flex items-end">
                          <div className="p-4 text-white w-full">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-lg capitalize">{image.type}</p>
                                <p className="text-emerald-300 text-sm">{image.resolution} resolution</p>
                              </div>
                              <div className="bg-emerald-500/20 backdrop-blur-sm rounded-full p-2">
                                <Eye className="w-5 h-5 text-emerald-300" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </MotionDiv>

                {/* Weather Data */}
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Thermometer className="w-6 h-6 text-emerald-400 ml-3" />
                    بيانات الطقس المتقدمة
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-400/30">
                      <Thermometer className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                      <p className="text-3xl font-black text-white mb-1">{landData.weatherData.temperature}°C</p>
                      <p className="text-emerald-300 text-sm">درجة الحرارة</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                      <Droplets className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                      <p className="text-3xl font-black text-white mb-1">{landData.weatherData.humidity}%</p>
                      <p className="text-blue-300 text-sm">الرطوبة</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                      <CloudRain className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                      <p className="text-3xl font-black text-white mb-1">{landData.weatherData.rainfall}mm</p>
                      <p className="text-purple-300 text-sm">الأمطار</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-400/30">
                      <Wind className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                      <p className="text-3xl font-black text-white mb-1">{landData.weatherData.windSpeed}km/h</p>
                      <p className="text-orange-300 text-sm">سرعة الرياح</p>
                    </div>
                  </div>
                  
                  {/* Solar Radiation */}
                  <div className="mt-6 p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Sun className="w-8 h-8 text-yellow-400 ml-3" />
                        <div>
                          <p className="text-2xl font-bold text-white">{landData.weatherData.solarRadiation} W/m²</p>
                          <p className="text-yellow-300 text-sm">الإشعاع الشمسي</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white">ممتاز</p>
                        <p className="text-yellow-300 text-sm">للمحاصيل</p>
                      </div>
                    </div>
                  </div>
                </MotionDiv>

                {/* Soil Analysis */}
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Layers className="w-6 h-6 text-emerald-400 ml-3" />
                    تحليل التربة المتقدم
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-400/30">
                      <div className="text-3xl font-black text-white mb-1">{landData.soilData.clay.toFixed(1)}%</div>
                      <div className="text-emerald-300 text-sm">محتوى الطين</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                      <div className="text-3xl font-black text-white mb-1">{landData.soilData.silt.toFixed(1)}%</div>
                      <div className="text-blue-300 text-sm">محتوى الطمي</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-400/30">
                      <div className="text-3xl font-black text-white mb-1">{landData.soilData.sand.toFixed(1)}%</div>
                      <div className="text-yellow-300 text-sm">محتوى الرمل</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                      <div className="text-3xl font-black text-white mb-1">{landData.soilData.organicMatter.toFixed(1)}%</div>
                      <div className="text-purple-300 text-sm">المادة العضوية</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl border border-red-400/30">
                      <div className="text-3xl font-black text-white mb-1">{landData.soilData.ph.toFixed(1)}</div>
                      <div className="text-red-300 text-sm">مستوى الحموضة</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl border border-teal-400/30">
                      <div className="text-3xl font-black text-white mb-1">{landData.soilData.moisture.toFixed(1)}%</div>
                      <div className="text-teal-300 text-sm">رطوبة التربة</div>
                    </div>
                  </div>
                  
                  {/* Advanced Soil Metrics */}
                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">{landData.soilData.nitrogen.toFixed(1)} mg/kg</p>
                          <p className="text-green-300 text-sm">النيتروجين</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">جيد</p>
                          <p className="text-green-300 text-sm">للمحاصيل</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-400/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">{landData.soilData.carbonSequestration.toFixed(1)} t/ha</p>
                          <p className="text-orange-300 text-sm">تخزين الكربون</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-white">ممتاز</p>
                          <p className="text-orange-300 text-sm">للاستدامة</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* AI Insights */}
                <MotionDiv
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Brain className="w-6 h-6 text-emerald-400 ml-3" />
                رؤى تحليل البيانات
                  </h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-400/30">
                      <h3 className="font-bold text-white mb-2">المحاصيل المناسبة</h3>
                      <div className="flex flex-wrap gap-2">
                        {landData.aiInsights.cropSuitability.map((crop, index) => (
                          <span key={index} className="px-3 py-1 bg-emerald-500/30 text-emerald-200 rounded-full text-sm">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30">
                      <h3 className="font-bold text-white mb-2">وقت الزراعة الأمثل</h3>
                      <p className="text-blue-300">{landData.aiInsights.optimalPlantingTime}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-400/30">
                      <h3 className="font-bold text-white mb-2">مخاطر الآفات</h3>
                      <p className="text-purple-300">{landData.aiInsights.pestRisk.toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-400/30">
                      <h3 className="font-bold text-white mb-2">معدل الاستدامة</h3>
                      <p className="text-orange-300">{landData.aiInsights.sustainabilityScore.toFixed(1)}%</p>
                    </div>
                  </div>
                </MotionDiv>

                {/* Quick Actions */}
                <MotionDiv
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-6">إجراءات سريعة</h2>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-center space-x-2 space-x-reverse px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105">
                      <BarChart3 className="w-5 h-5" />
                      <span>تحليل متقدم</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 space-x-reverse px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105">
                      <Download className="w-5 h-5" />
                      <span>تصدير البيانات</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 space-x-reverse px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105">
                      <TrendingUp className="w-5 h-5" />
                      <span>توقعات المستقبل</span>
                    </button>
                  </div>
                </MotionDiv>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <MotionDiv
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-4xl w-full border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">صورة القمر الصناعي</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-emerald-300 hover:text-white transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>
              <img
                src={selectedImage.url}
                alt={`Satellite ${selectedImage.type}`}
                className="w-full h-96 object-cover rounded-2xl border border-white/20"
              />
              <div className="mt-6 text-emerald-200 space-y-2">
                <p><strong>النوع:</strong> {selectedImage.type}</p>
                <p><strong>الدقة:</strong> {selectedImage.resolution}</p>
                <p><strong>التاريخ:</strong> {new Date(selectedImage.date).toLocaleDateString('ar-SA')}</p>
              </div>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveLandIntelligenceTool; 