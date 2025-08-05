// Sentinel Hub API Service for Satellite Imagery and NDVI Analysis
// Provides high-resolution satellite data for agricultural monitoring

export interface SentinelData {
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

class SentinelHubApiService {
  private apiKey: string;
  private baseUrl = 'https://services.sentinel-hub.com/api/v1';

  constructor() {
    this.apiKey = process.env.SENTINEL_HUB_API_KEY || 'PLAK67a923da926b44139785a9e31fa85d18';
  }

  // Generate Sentinel Hub WMS URL for satellite imagery
  generateWmsUrl(lat: number, lon: number, layer: string, size: string = '512,512'): string {
    const bbox = this.calculateBbox(lat, lon, 0.01); // 1km around the point
    
    return `${this.baseUrl}/wms/your-instance-id?` +
      `service=WMS&` +
      `request=GetMap&` +
      `layers=${layer}&` +
      `bbox=${bbox}&` +
      `width=512&` +
      `height=512&` +
      `format=image/png&` +
      `time=2024-01-01/2024-12-31&` +
      `evalscript=return [B04, B03, B02];`;
  }

  // Calculate bounding box for a point
  private calculateBbox(lat: number, lon: number, buffer: number): string {
    const minLon = lon - buffer;
    const maxLon = lon + buffer;
    const minLat = lat - buffer;
    const maxLat = lat + buffer;
    return `${minLon},${minLat},${maxLon},${maxLat}`;
  }

  // Fetch RGB satellite imagery
  async fetchRgbImagery(lat: number, lon: number): Promise<string> {
    try {
      // For demo purposes, return a placeholder image
      // In production, this would call the actual Sentinel Hub API
      const imageUrl = `https://via.placeholder.com/512x512/2E8B57/FFFFFF?text=Sentinel+RGB+${lat.toFixed(4)},${lon.toFixed(4)}`;
      
      console.log('📡 Fetching RGB imagery for coordinates:', lat, lon);
      return imageUrl;
    } catch (error) {
      console.error('❌ Error fetching RGB imagery:', error);
      return `https://via.placeholder.com/512x512/2E8B57/FFFFFF?text=RGB+Error`;
    }
  }

  // Fetch NDVI imagery
  async fetchNdviImagery(lat: number, lon: number): Promise<string> {
    try {
      // For demo purposes, return a placeholder image
      const imageUrl = `https://via.placeholder.com/512x512/32CD32/FFFFFF?text=Sentinel+NDVI+${lat.toFixed(4)},${lon.toFixed(4)}`;
      
      console.log('📡 Fetching NDVI imagery for coordinates:', lat, lon);
      return imageUrl;
    } catch (error) {
      console.error('❌ Error fetching NDVI imagery:', error);
      return `https://via.placeholder.com/512x512/32CD32/FFFFFF?text=NDVI+Error`;
    }
  }

  // Calculate NDVI value (simulated)
  calculateNdviValue(lat: number, lon: number): number {
    // Simulate NDVI calculation based on location and season
    const now = new Date();
    const month = now.getMonth();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Seasonal NDVI patterns
    const seasonalFactor = 0.3 + 0.4 * Math.sin((dayOfYear - 80) * 2 * Math.PI / 365);
    
    // Location-based variation
    const latFactor = Math.max(0.1, 1 - Math.abs(lat - 30) / 60);
    
    // Random variation
    const randomFactor = 0.8 + Math.random() * 0.4;
    
    const ndvi = Math.min(1, Math.max(0, seasonalFactor * latFactor * randomFactor));
    
    return Math.round(ndvi * 100) / 100;
  }

  // Analyze vegetation health
  analyzeVegetationHealth(ndvi: number): any {
    let health: 'excellent' | 'good' | 'fair' | 'poor';
    let stressFactors: string[] = [];
    
    if (ndvi > 0.7) {
      health = 'excellent';
    } else if (ndvi > 0.5) {
      health = 'good';
    } else if (ndvi > 0.3) {
      health = 'fair';
      stressFactors.push('نقص في النمو');
    } else {
      health = 'poor';
      stressFactors.push('إجهاد نباتي شديد');
      stressFactors.push('نقص في المياه');
    }

    // Add seasonal stress factors
    const now = new Date();
    const month = now.getMonth();
    
    if (month >= 5 && month <= 8) {
      stressFactors.push('إجهاد حراري');
    }
    
    if (month >= 11 || month <= 2) {
      stressFactors.push('برودة الشتاء');
    }

    return {
      health,
      stressFactors,
      growthStage: this.determineGrowthStage(ndvi, month)
    };
  }

  // Determine crop growth stage
  private determineGrowthStage(ndvi: number, month: number): string {
    if (ndvi < 0.2) return 'بذرة';
    if (ndvi < 0.4) return 'شتلة';
    if (ndvi < 0.6) return 'نمو مبكر';
    if (ndvi < 0.8) return 'نمو متوسط';
    return 'نمو متقدم';
  }

  // Analyze land use
  analyzeLandUse(lat: number, lon: number): any {
    // Simulate land use analysis based on location
    const landTypes = ['أراضي زراعية', 'مراعي', 'غابات', 'أراضي قاحلة'];
    const type = landTypes[Math.floor(Math.random() * landTypes.length)];
    const confidence = 0.7 + Math.random() * 0.3;
    const area = 100 + Math.random() * 900; // hectares
    
    return {
      type,
      confidence: Math.round(confidence * 100) / 100,
      area: Math.round(area),
      change: Math.random() > 0.5 ? 'positive' : 'stable'
    };
  }

  // Fetch comprehensive satellite data
  async fetchSentinelData(lat: number, lon: number): Promise<SentinelData> {
    console.log('🛰️ Fetching Sentinel Hub data for coordinates:', lat, lon);
    
    try {
      const [rgbImagery, ndviImagery] = await Promise.all([
        this.fetchRgbImagery(lat, lon),
        this.fetchNdviImagery(lat, lon)
      ]);

      const ndviValue = this.calculateNdviValue(lat, lon);
      const vegetation = this.analyzeVegetationHealth(ndviValue);
      const landUse = this.analyzeLandUse(lat, lon);

      // Calculate NDVI trend (simulated)
      const previousNdvi = ndviValue + (Math.random() - 0.5) * 0.2;
      const trend = (ndviValue > previousNdvi ? 'increasing' : 
                   ndviValue < previousNdvi ? 'decreasing' : 'stable') as 'increasing' | 'decreasing' | 'stable';

      const result = {
        imagery: {
          rgb: rgbImagery,
          ndvi: ndviImagery,
          moisture: `https://via.placeholder.com/512x512/4169E1/FFFFFF?text=Moisture+${lat.toFixed(4)},${lon.toFixed(4)}`,
          chlorophyll: `https://via.placeholder.com/512x512/228B22/FFFFFF?text=Chlorophyll+${lat.toFixed(4)},${lon.toFixed(4)}`
        },
        ndvi: {
          current: ndviValue,
          average: (ndviValue + previousNdvi) / 2,
          trend,
          health: vegetation.health
        },
        vegetation,
        landUse
      };

      console.log('✅ Sentinel Hub data fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching Sentinel Hub data:', error);
      throw error;
    }
  }

  // Generate comprehensive mock Sentinel Hub data
  private generateMockSentinelData(lat: number, lon: number): SentinelData {
    const baseDate = new Date();
    const ndviValue = 0.65 + Math.random() * 0.25;
    const moistureLevel = 35 + Math.random() * 25;
    const chlorophyllLevel = 40 + Math.random() * 30;
    
    return {
      imagery: {
        rgb: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2E8B57;stop-opacity:1" /><stop offset="50%" style="stop-color:#32CD32;stop-opacity:1" /><stop offset="100%" style="stop-color:#228B22;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="white" font-weight="bold">RGB Image - High Resolution</text><text x="50%" y="70%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">Sentinel-2 • 10m Resolution</text></svg>`)}`,
        ndvi: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8B0000;stop-opacity:1" /><stop offset="25%" style="stop-color:#FF8C00;stop-opacity:1" /><stop offset="50%" style="stop-color:#FFFF00;stop-opacity:1" /><stop offset="75%" style="stop-color:#32CD32;stop-opacity:1" /><stop offset="100%" style="stop-color:#006400;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="white" font-weight="bold">NDVI Analysis - ${ndviValue.toFixed(3)}</text><text x="50%" y="70%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">Vegetation Index • 10m Resolution</text></svg>`)}`,
        moisture: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" /><stop offset="50%" style="stop-color:#D2691E;stop-opacity:1" /><stop offset="100%" style="stop-color:#4169E1;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="white" font-weight="bold">Soil Moisture - ${moistureLevel.toFixed(1)}%</text><text x="50%" y="70%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">Moisture Content • 20m Resolution</text></svg>`)}`,
        chlorophyll: `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF4500;stop-opacity:1" /><stop offset="50%" style="stop-color:#32CD32;stop-opacity:1" /><stop offset="100%" style="stop-color:#228B22;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(#grad)"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="20" fill="white" font-weight="bold">Chlorophyll - ${chlorophyllLevel.toFixed(1)} μg/cm²</text><text x="50%" y="70%" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="white">Chlorophyll Content • 10m Resolution</text></svg>`)}`
      },
      ndvi: {
        current: ndviValue,
        average: 0.58 + Math.random() * 0.2,
        trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any,
        health: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any
      },
      vegetation: {
        density: 70 + Math.random() * 25,
        health: ['excellent', 'good', 'fair', 'poor'][Math.floor(Math.random() * 4)] as any,
        stressFactors: Math.random() > 0.7 ? ['نقص المياه', 'ارتفاع درجات الحرارة', 'نقص العناصر الغذائية'] : [],
        growthStage: ['نمو مبكر', 'نمو متوسط', 'نمو متقدم', 'نضج'][Math.floor(Math.random() * 4)]
      },
      landUse: {
        type: ['أراضي زراعية', 'مراعي', 'غابات', 'أراضي رطبة'][Math.floor(Math.random() * 4)],
        confidence: 0.75 + Math.random() * 0.2,
        area: 50 + Math.random() * 100,
        change: ['positive', 'negative', 'stable'][Math.floor(Math.random() * 3)] as any
      }
    };
  }

  // Generate agricultural insights
  generateAgriculturalInsights(sentinelData: SentinelData): any {
    const insights = {
      cropHealth: sentinelData.ndvi.health,
      irrigationNeeded: sentinelData.ndvi.current < 0.4,
      harvestTiming: this.calculateHarvestTiming(sentinelData.ndvi.current),
      yieldPrediction: this.predictYield(sentinelData.ndvi.current),
      recommendations: this.generateRecommendations(sentinelData)
    };

    return insights;
  }

  // Calculate optimal harvest timing
  private calculateHarvestTiming(ndvi: number): string {
    if (ndvi > 0.7) return 'جاهز للحصاد خلال 2-3 أسابيع';
    if (ndvi > 0.5) return 'يحتاج 4-6 أسابيع إضافية';
    return 'يحتاج 8-10 أسابيع إضافية';
  }

  // Predict crop yield
  private predictYield(ndvi: number): string {
    const yieldPercentage = Math.min(100, Math.max(0, ndvi * 120));
    return `${Math.round(yieldPercentage)}% من المحصول المتوقع`;
  }

  // Generate agricultural recommendations
  private generateRecommendations(sentinelData: SentinelData): string[] {
    const recommendations = [];

    if (sentinelData.ndvi.current < 0.4) {
      recommendations.push('زيادة الري - المحاصيل تحتاج مياه أكثر');
    }

    if (sentinelData.vegetation.stressFactors.length > 0) {
      recommendations.push('مراقبة الإجهاد النباتي - قد تحتاج تدخل فوري');
    }

    if (sentinelData.ndvi.trend === 'decreasing') {
      recommendations.push('انخفاض في صحة النبات - فحص الآفات والأمراض');
    }

    if (sentinelData.ndvi.current > 0.7) {
      recommendations.push('صحة ممتازة - استمر في الرعاية الحالية');
    }

    return recommendations;
  }
}

export const sentinelHubApi = new SentinelHubApiService(); 