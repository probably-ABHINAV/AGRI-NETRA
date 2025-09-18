
// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'farmer' | 'expert' | 'admin'
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

// Farm and Crop Types
export interface Farm {
  id: string
  name: string
  location: string
  size: number
  soilType: string
  userId: string
  createdAt: string
  crops: Crop[]
}

export interface Crop {
  id: string
  name: string
  variety: string
  plantedDate: string
  expectedHarvest: string
  area: number
  farmId: string
  status: 'planted' | 'growing' | 'ready' | 'harvested'
  healthScore: number
}

// IoT and Sensor Types
export interface SensorReading {
  id: string
  deviceId: string
  timestamp: string
  temperature: number
  humidity: number
  soilMoisture: number
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
}

export interface IoTDevice {
  id: string
  name: string
  type: 'soil_moisture' | 'weather_station' | 'ph_sensor' | 'nutrient_sensor'
  status: 'online' | 'offline' | 'warning'
  batteryLevel: number
  lastReading: string
  farmId: string
  location: {
    latitude: number
    longitude: number
    description: string
  }
  calibrationDate: Date
}

// AI Service Types
export interface CropRecommendation {
  cropName: string
  variety: string
  confidence: number
  expectedYield: number
  profitability: number
  riskFactors: string[]
  plantingWindow: {
    start: string
    end: string
  }
  requirements: {
    soilType: string
    waterRequirement: string
    temperature: string
  }
}

export interface PestDetection {
  pestName: string
  confidence: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedArea: number
  description: string
  symptoms: string[]
  treatments: PestTreatment[]
  imageAnalysis: {
    boundingBoxes: Array<{
      x: number
      y: number
      width: number
      height: number
    }>
    confidence: number
  }
}

export interface PestTreatment {
  name: string
  type: 'organic' | 'chemical' | 'biological'
  effectiveness: number
  cost: string
  duration: string
  applicationMethod: string
  precautions: string[]
}

// Language and Localization Types
export interface LanguageConfig {
  code: string
  name: string
  localName: string
  flag: string
  rtl?: boolean
}

export interface TranslationSet {
  [key: string]: string | TranslationSet
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

// Weather Types
export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  rainfall: number
  uvIndex: number
  cloudCover: number
  timestamp: string
  location: string
}

export interface WeatherForecast {
  date: string
  temperature: {
    min: number
    max: number
  }
  humidity: number
  rainfall: number
  conditions: string
  iconCode: string
}

// Market and Analytics Types
export interface MarketPrice {
  cropName: string
  variety: string
  price: number
  unit: string
  market: string
  date: string
  trend: 'up' | 'down' | 'stable'
  changePercent: number
}

export interface AnalyticsData {
  farmPerformance: {
    totalYield: number
    avgYieldPerAcre: number
    profitability: number
    efficiency: number
  }
  cropHealth: {
    overallScore: number
    healthyPercentage: number
    atRiskPercentage: number
    diseaseIncidence: number
  }
  resourceUsage: {
    waterConsumption: number
    fertilizerUsage: number
    pesticideUsage: number
    energyConsumption: number
  }
}

// State Agriculture Information
export interface StateAgricultureInfo {
  state: string
  majorCrops: string[]
  soilTypes: string[]
  climate: string
  language: string
  regionalLanguages: string[]
  agriculturalZones: string[]
  traditionalPractices: string[]
  governmentSchemes: string[]
}

// Supabase Database Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone?: string
          role: 'farmer' | 'expert' | 'admin'
          location?: string
          farm_size?: number
          experience_years?: number
          preferred_language: string
          avatar_url?: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          email: string
          full_name: string
          phone?: string
          role: 'farmer' | 'expert' | 'admin'
          location?: string
          farm_size?: number
          experience_years?: number
          preferred_language?: string
          avatar_url?: string
          is_verified?: boolean
        }
        Update: {
          email?: string
          full_name?: string
          phone?: string
          role?: 'farmer' | 'expert' | 'admin'
          location?: string
          farm_size?: number
          experience_years?: number
          preferred_language?: string
          avatar_url?: string
          is_verified?: boolean
        }
      }
      farms: {
        Row: {
          id: string
          user_id: string
          name: string
          location: string
          coordinates?: any
          area_hectares: number
          soil_type?: string
          irrigation_type?: string
          region_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          location: string
          coordinates?: any
          area_hectares: number
          soil_type?: string
          irrigation_type?: string
          region_id?: string
        }
        Update: {
          name?: string
          location?: string
          coordinates?: any
          area_hectares?: number
          soil_type?: string
          irrigation_type?: string
          region_id?: string
        }
      }
      crops: {
        Row: {
          id: string
          name: string
          scientific_name?: string
          category: 'cereals' | 'pulses' | 'oilseeds' | 'vegetables' | 'fruits' | 'spices' | 'cash_crops'
          growing_season?: string
          water_requirement?: string
          soil_ph_min?: number
          soil_ph_max?: number
          temperature_min?: number
          temperature_max?: number
          growth_duration_days?: number
          description?: string
          image_url?: string
          created_at: string
        }
        Insert: {
          name: string
          scientific_name?: string
          category: 'cereals' | 'pulses' | 'oilseeds' | 'vegetables' | 'fruits' | 'spices' | 'cash_crops'
          growing_season?: string
          water_requirement?: string
          soil_ph_min?: number
          soil_ph_max?: number
          temperature_min?: number
          temperature_max?: number
          growth_duration_days?: number
          description?: string
          image_url?: string
        }
        Update: {
          name?: string
          scientific_name?: string
          category?: 'cereals' | 'pulses' | 'oilseeds' | 'vegetables' | 'fruits' | 'spices' | 'cash_crops'
          growing_season?: string
          water_requirement?: string
          soil_ph_min?: number
          soil_ph_max?: number
          temperature_min?: number
          temperature_max?: number
          growth_duration_days?: number
          description?: string
          image_url?: string
        }
      }
      sensor_readings: {
        Row: {
          id: string
          sensor_id: string
          value: number
          unit: string
          timestamp: string
          quality_score?: number
        }
        Insert: {
          sensor_id: string
          value: number
          unit: string
          timestamp?: string
          quality_score?: number
        }
        Update: {
          sensor_id?: string
          value?: number
          unit?: string
          timestamp?: string
          quality_score?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
