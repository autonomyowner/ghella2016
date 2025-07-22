// Satellite API Service for Live Land Intelligence Tool
// Local data system for farmers - No external API dependencies

export interface SatelliteData {
  coordinates: {
    lat: number;
    lon: number;
  };
  soilData: {
    clay: number;
    silt: number;
    sand: number;
    organicMatter: number;
    ph: number;
    moisture: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  cropData: {
    ndvi: number;
    health: 'excellent' | 'good' | 'fair' | 'poor';
    growthStage: string;
    yieldPrediction: number;
    biomass: number;
    chlorophyll: number;
  };
  weatherData: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    solarRadiation: number;
    forecast: Array<{
      date: string;
      temp: number;
      rain: number;
      condition: string;
      humidity: number;
    }>;
  };
  satelliteImages: Array<{
    url: string;
    date: string;
    type: 'ndvi' | 'rgb' | 'thermal' | 'moisture' | 'chlorophyll';
    resolution: string;
    source: string;
  }>;
  recommendations: Array<{
    type: 'irrigation' | 'fertilizer' | 'pest' | 'harvest' | 'soil' | 'crop';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    confidence: number;
  }>;
}

class SatelliteApiService {
  // Generate realistic soil data based on location and climate
  private generateSoilData(lat: number, lon: number): any {
    console.log('🌱 Generating soil data for coordinates:', lat, lon);
    
    // Base values that vary by location
    const baseClay = 20 + Math.sin(lat * Math.PI / 180) * 15 + Math.cos(lon * Math.PI / 180) * 10;
    const baseSilt = 25 + Math.cos(lat * Math.PI / 180) * 12 + Math.sin(lon * Math.PI / 180) * 8;
    const baseSand = 55 - baseClay - baseSilt;
    
    return {
      clay: Math.max(5, Math.min(45, baseClay + (Math.random() - 0.5) * 10)),
      silt: Math.max(10, Math.min(40, baseSilt + (Math.random() - 0.5) * 8)),
      sand: Math.max(20, Math.min(70, baseSand + (Math.random() - 0.5) * 12)),
      organicMatter: 1.5 + Math.random() * 4 + (lat > 30 ? 1 : 0), // Higher in northern regions
      ph: 5.8 + Math.random() * 2.4 + (lat > 35 ? 0.5 : -0.3), // Slightly alkaline in northern regions
      moisture: 25 + Math.random() * 35 + (Math.sin(Date.now() / 86400000) * 10), // Seasonal variation
      nitrogen: 12 + Math.random() * 18 + (Math.random() > 0.7 ? 5 : 0), // Occasional high values
      phosphorus: 15 + Math.random() * 20 + (Math.random() > 0.8 ? 8 : 0),
      potassium: 20 + Math.random() * 25 + (Math.random() > 0.75 ? 10 : 0)
    };
  }

  // Generate crop health data based on soil and weather conditions
  private generateCropData(soilData: any, weatherData: any): any {
    console.log('🌾 Generating crop data based on soil and weather');
    
    // Calculate NDVI based on soil moisture, temperature, and organic matter
    const moistureFactor = soilData.moisture / 100;
    const tempFactor = Math.max(0, Math.min(1, (weatherData.temperature - 10) / 25));
    const organicFactor = soilData.organicMatter / 8;
    
    const ndvi = 0.2 + (moistureFactor * 0.3) + (tempFactor * 0.3) + (organicFactor * 0.2);
    
    // Determine health based on NDVI and stress factors
    let health: 'excellent' | 'good' | 'fair' | 'poor';
    if (ndvi > 0.7) health = 'excellent';
    else if (ndvi > 0.5) health = 'good';
    else if (ndvi > 0.3) health = 'fair';
    else health = 'poor';
    
    // Growth stage based on season and health
    const month = new Date().getMonth();
    const growthStages = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Mature'];
    const stageIndex = Math.floor((month / 12) * 4);
    
    return {
      ndvi: Math.max(0.1, Math.min(0.9, ndvi)),
      health,
      growthStage: growthStages[stageIndex],
      yieldPrediction: Math.max(50, Math.min(95, ndvi * 100 + (Math.random() - 0.5) * 20)),
      biomass: 1.5 + ndvi * 4 + Math.random() * 2,
      chlorophyll: 25 + ndvi * 30 + Math.random() * 15
    };
  }

  // Generate weather data with seasonal patterns
  private generateWeatherData(lat: number, lon: number): any {
    console.log('🌤️ Generating weather data for coordinates:', lat, lon);
    
    const now = new Date();
    const month = now.getMonth();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // Seasonal temperature patterns
    const baseTemp = 20 + Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 15;
    const latAdjustment = (lat - 30) * -0.6; // Cooler at higher latitudes
    const temperature = baseTemp + latAdjustment + (Math.random() - 0.5) * 8;
    
    // Humidity based on temperature and season
    const humidity = Math.max(30, Math.min(90, 60 + (temperature < 15 ? 20 : -10) + (Math.random() - 0.5) * 30));
    
    // Rainfall with seasonal patterns
    const rainfall = Math.max(0, Math.random() * 40 + (month >= 3 && month <= 5 ? 20 : 0) + (month >= 9 && month <= 11 ? 15 : 0));
    
    // Generate 7-day forecast
    const forecast = Array.from({ length: 7 }, (_, i) => {
      const forecastDay = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      const forecastTemp = temperature + (Math.random() - 0.5) * 10;
      const forecastHumidity = Math.max(30, Math.min(90, humidity + (Math.random() - 0.5) * 20));
      const forecastRain = Math.max(0, Math.random() * 30);
      
      const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain'];
      const condition = forecastRain > 20 ? 'Heavy Rain' : 
                       forecastRain > 10 ? 'Light Rain' : 
                       forecastHumidity > 70 ? 'Cloudy' :
                       forecastHumidity > 50 ? 'Partly Cloudy' : 'Sunny';
      
      return {
        date: forecastDay.toISOString().split('T')[0],
        temp: Math.round(forecastTemp * 10) / 10,
        rain: Math.round(forecastRain * 10) / 10,
        condition,
        humidity: Math.round(forecastHumidity)
      };
    });
    
    return {
      temperature: Math.round(temperature * 10) / 10,
      humidity: Math.round(humidity),
      rainfall: Math.round(rainfall * 10) / 10,
      windSpeed: 3 + Math.random() * 12,
      solarRadiation: 600 + Math.random() * 600,
      forecast
    };
  }

  // Generate satellite images with realistic URLs
  private generateSatelliteImages(lat: number, lon: number): Array<{
    url: string;
    date: string;
    type: 'ndvi' | 'rgb' | 'thermal' | 'moisture' | 'chlorophyll';
    resolution: string;
    source: string;
  }> {
    console.log('🛰️ Generating satellite images for coordinates:', lat, lon);
    
    const tileX = Math.floor((lon + 180) / 360 * 512);
    const tileY = Math.floor((90 - lat) / 180 * 256);
    
    return [
      {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_NDVI_8Day/default/2024-01-01/250m/${tileX}/${tileY}.png`,
        date: new Date().toISOString(),
        type: 'ndvi',
        resolution: '250m',
        source: 'NASA GIBS'
      },
      {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-01-01/250m/${tileX}/${tileY}.png`,
        date: new Date().toISOString(),
        type: 'rgb',
        resolution: '250m',
        source: 'NASA GIBS'
      },
      {
        url: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_Chlorophyll_A/default/2024-01-01/250m/${tileX}/${tileY}.png`,
        date: new Date().toISOString(),
        type: 'chlorophyll',
        resolution: '250m',
        source: 'NASA GIBS'
      }
    ];
  }

  // Generate intelligent recommendations based on data
  private generateRecommendations(soilData: any, cropData: any, weatherData: any): Array<{
    type: 'irrigation' | 'fertilizer' | 'pest' | 'harvest' | 'soil' | 'crop';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
    confidence: number;
  }> {
    console.log('💡 Generating intelligent recommendations');
    
    const recommendations: Array<{
      type: 'irrigation' | 'fertilizer' | 'pest' | 'harvest' | 'soil' | 'crop';
      priority: 'high' | 'medium' | 'low';
      title: string;
      description: string;
      impact: string;
      confidence: number;
    }> = [];
    
    // Irrigation recommendations
    if (soilData.moisture < 30) {
      recommendations.push({
        type: 'irrigation',
        priority: 'high',
        title: 'تحسين نظام الري',
        description: 'رطوبة التربة منخفضة. يوصى بزيادة الري بنسبة 25%',
        impact: 'تحسين نمو المحاصيل بنسبة 30%',
        confidence: 0.9
      });
    } else if (soilData.moisture > 70) {
      recommendations.push({
        type: 'irrigation',
        priority: 'medium',
        title: 'تقليل الري',
        description: 'رطوبة التربة عالية. يوصى بتقليل الري لتجنب تعفن الجذور',
        impact: 'منع أمراض الجذور وتحسين التهوية',
        confidence: 0.8
      });
    }
    
    // Fertilizer recommendations
    if (soilData.nitrogen < 15) {
      recommendations.push({
        type: 'fertilizer',
        priority: 'high',
        title: 'تطبيق الأسمدة النيتروجينية',
        description: 'محتوى النيتروجين منخفض. يوصى بتطبيق سماد نيتروجيني',
        impact: 'زيادة النمو الخضري بنسبة 40%',
        confidence: 0.85
      });
    }
    
    if (soilData.phosphorus < 20) {
      recommendations.push({
        type: 'fertilizer',
        priority: 'medium',
        title: 'تطبيق الأسمدة الفوسفاتية',
        description: 'محتوى الفوسفور منخفض. يوصى بتطبيق سماد فوسفاتي',
        impact: 'تحسين نمو الجذور والإزهار',
        confidence: 0.8
      });
    }
    
    // Soil pH recommendations
    if (soilData.ph < 6.0) {
      recommendations.push({
        type: 'soil',
        priority: 'medium',
        title: 'تحسين حموضة التربة',
        description: 'التربة حمضية. يوصى بإضافة الجير لرفع مستوى الحموضة',
        impact: 'تحسين امتصاص العناصر الغذائية',
        confidence: 0.75
      });
    } else if (soilData.ph > 8.0) {
      recommendations.push({
        type: 'soil',
        priority: 'medium',
        title: 'تعديل حموضة التربة',
        description: 'التربة قلوية. يوصى بإضافة الكبريت لخفض مستوى الحموضة',
        impact: 'تحسين توفر العناصر الغذائية',
        confidence: 0.75
      });
    }
    
    // Crop health recommendations
    if (cropData.health === 'poor') {
      recommendations.push({
        type: 'crop',
        priority: 'high',
        title: 'فحص صحة المحاصيل',
        description: 'صحة المحاصيل ضعيفة. يوصى بفحص دقيق للأمراض والآفات',
        impact: 'منع انتشار الأمراض وحماية المحاصيل',
        confidence: 0.9
      });
    }
    
    // Weather-based recommendations
    if (weatherData.forecast.some((day: any) => day.rain > 20)) {
      recommendations.push({
        type: 'harvest',
        priority: 'medium',
        title: 'تخطيط الحصاد',
        description: 'توقعات أمطار غزيرة. يوصى بتسريع الحصاد أو تأجيله',
        impact: 'حماية المحاصيل من التلف',
        confidence: 0.7
      });
    }
    
    // Add organic matter recommendation if low
    if (soilData.organicMatter < 2.0) {
      recommendations.push({
        type: 'soil',
        priority: 'medium',
        title: 'تحسين المادة العضوية',
        description: 'محتوى المادة العضوية منخفض. يوصى بإضافة السماد العضوي',
        impact: 'تحسين خصوبة التربة وبنيتها',
        confidence: 0.8
      });
    }
    
    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  // Main method to fetch all land intelligence data
  async fetchLandIntelligenceData(lat: number, lon: number): Promise<SatelliteData> {
    console.log('🚀 Starting land intelligence data generation for:', lat, lon);
    
    try {
      // Generate all data locally
      const soilData = this.generateSoilData(lat, lon);
      const weatherData = this.generateWeatherData(lat, lon);
      const cropData = this.generateCropData(soilData, weatherData);
      const satelliteImages = this.generateSatelliteImages(lat, lon);
      const recommendations = this.generateRecommendations(soilData, cropData, weatherData);
      
      const result: SatelliteData = {
        coordinates: { lat, lon },
        soilData,
        cropData,
        weatherData,
        satelliteImages,
        recommendations
      };
      
      console.log('✅ Land intelligence data generated successfully!');
      return result;
      
    } catch (error) {
      console.error('❌ Error generating land intelligence data:', error);
      throw error;
    }
  }

  // Generate PDF report (placeholder for future implementation)
  async generatePDFReport(data: SatelliteData): Promise<string> {
    console.log('📄 Generating PDF report...');
    return 'PDF report generation will be implemented in future updates';
  }
}

// Export singleton instance
export const satelliteApi = new SatelliteApiService(); 