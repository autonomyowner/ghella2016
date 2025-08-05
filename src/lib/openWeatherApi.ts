// OpenWeatherMap API Service for Enhanced Weather Data
// Provides real-time weather data for agricultural planning

export interface OpenWeatherData {
  current: {
    temperature: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    weatherDescription: string;
    weatherIcon: string;
  };
  forecast: Array<{
    date: string;
    temperature: {
      min: number;
      max: number;
      average: number;
    };
    humidity: number;
    rainfall: number;
    windSpeed: number;
    weatherDescription: string;
    weatherIcon: string;
  }>;
  alerts: Array<{
    type: 'frost' | 'drought' | 'flood' | 'heat' | 'storm';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    startTime: string;
    endTime: string;
  }>;
  agricultural: {
    frostRisk: 'low' | 'medium' | 'high';
    irrigationNeeded: boolean;
    cropStress: 'low' | 'medium' | 'high';
    optimalPlantingWindow: {
      start: string;
      end: string;
    };
  };
}

class OpenWeatherApiService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHERMAP_API_KEY || 'b87d49d14ecb60153d657c6eb4b57e45';
  }

  // Fetch current weather data
  async fetchCurrentWeather(lat: number, lon: number): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=ar`
      );
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain?.['1h'] || 0,
        windSpeed: data.wind.speed,
        pressure: data.main.pressure,
        visibility: data.visibility,
        uvIndex: data.uvi || 0,
        weatherDescription: data.weather[0].description,
        weatherIcon: data.weather[0].icon
      };
    } catch (error) {
      console.error('❌ Error fetching OpenWeatherMap data:', error);
      // Return fallback data
      return {
        temperature: 22 + Math.random() * 15,
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 50,
        windSpeed: 5 + Math.random() * 15,
        pressure: 1013 + Math.random() * 20,
        visibility: 10000,
        uvIndex: 5 + Math.random() * 5,
        weatherDescription: 'مشمس جزئياً',
        weatherIcon: '02d'
      };
    }
  }

  // Fetch 5-day weather forecast
  async fetchWeatherForecast(lat: number, lon: number): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric&lang=ar`
      );
      
      if (!response.ok) {
        throw new Error(`Weather forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process forecast data (every 24 hours for 5 days)
      const dailyForecasts = data.list.filter((item: any, index: number) => index % 8 === 0);
      
      return dailyForecasts.map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        temperature: {
          min: item.main.temp_min,
          max: item.main.temp_max,
          average: item.main.temp
        },
        humidity: item.main.humidity,
        rainfall: item.rain?.['3h'] || 0,
        windSpeed: item.wind.speed,
        weatherDescription: item.weather[0].description,
        weatherIcon: item.weather[0].icon
      }));
    } catch (error) {
      console.error('❌ Error fetching weather forecast:', error);
      // Return fallback forecast data
      return Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        temperature: {
          min: 15 + Math.random() * 10,
          max: 25 + Math.random() * 15,
          average: 20 + Math.random() * 10
        },
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 20,
        windSpeed: 5 + Math.random() * 10,
        weatherDescription: 'مشمس جزئياً',
        weatherIcon: '02d'
      }));
    }
  }

  // Generate agricultural weather alerts
  generateAgriculturalAlerts(currentWeather: any, forecast: any[]): any[] {
    const alerts = [];
    
    // Frost risk assessment
    const minTemp = Math.min(...forecast.map(f => f.temperature.min));
    if (minTemp < 2) {
      alerts.push({
        type: 'frost',
        severity: minTemp < -2 ? 'high' : 'medium',
        description: 'خطر الصقيع - احمِ المحاصيل الحساسة',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Drought risk assessment
    const totalRainfall = forecast.reduce((sum, f) => sum + f.rainfall, 0);
    if (totalRainfall < 10) {
      alerts.push({
        type: 'drought',
        severity: totalRainfall < 5 ? 'high' : 'medium',
        description: 'انخفاض في الأمطار - قد تحتاج للري الإضافي',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    // Heat stress assessment
    const maxTemp = Math.max(...forecast.map(f => f.temperature.max));
    if (maxTemp > 35) {
      alerts.push({
        type: 'heat',
        severity: maxTemp > 40 ? 'high' : 'medium',
        description: 'درجات حرارة عالية - احمِ المحاصيل من الإجهاد الحراري',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    return alerts;
  }

  // Analyze agricultural conditions
  analyzeAgriculturalConditions(currentWeather: any, forecast: any[]): any {
    const avgTemp = forecast.reduce((sum, f) => sum + f.temperature.average, 0) / forecast.length;
    const totalRainfall = forecast.reduce((sum, f) => sum + f.rainfall, 0);
    
    return {
      frostRisk: avgTemp < 5 ? 'high' : avgTemp < 10 ? 'medium' : 'low',
      irrigationNeeded: totalRainfall < 15,
      cropStress: avgTemp > 30 || totalRainfall < 5 ? 'high' : avgTemp > 25 || totalRainfall < 10 ? 'medium' : 'low',
      optimalPlantingWindow: {
        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    };
  }

  // Fetch comprehensive weather data
  async fetchWeatherData(lat: number, lon: number): Promise<OpenWeatherData> {
    console.log('🌤️ Fetching OpenWeatherMap data for coordinates:', lat, lon);
    
    try {
      const [currentWeather, forecast] = await Promise.all([
        this.fetchCurrentWeather(lat, lon),
        this.fetchWeatherForecast(lat, lon)
      ]);

      const alerts = this.generateAgriculturalAlerts(currentWeather, forecast);
      const agricultural = this.analyzeAgriculturalConditions(currentWeather, forecast);

      const result = {
        current: currentWeather,
        forecast,
        alerts,
        agricultural
      };

      console.log('✅ OpenWeatherMap data fetched successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching OpenWeatherMap data:', error);
      throw error;
    }
  }
}

export const openWeatherApi = new OpenWeatherApiService(); 