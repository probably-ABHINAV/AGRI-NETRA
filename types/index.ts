
// User and Authentication Types
export interface User {
  id: string
  email: string
  name: string
  role: 'farmer' | 'expert' | 'admin'
  createdAt: string
  updatedAt: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  phone?: string
  location?: string
  state?: string
  language?: string
  avatar?: string
  bio?: string
  expertise?: string[]
  createdAt: string
  updatedAt: string
}

// Farm and Agricultural Types
export interface Farm {
  id: string
  name: string
  location: string
  size: number
  soilType: string
  climateZone: string
  userId: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}

export interface Crop {
  id: string
  name: string
  variety: string
  plantedDate: string
  expectedHarvestDate?: string
  actualHarvestDate?: string
  area: number
  status: 'planted' | 'growing' | 'ready' | 'harvested'
  farmId: string
  userId: string
  recommendations?: Recommendation[]
  createdAt: string
  updatedAt: string
}

// Sensor and IoT Types
export interface SensorReading {
  id: string
  sensorId: string
  timestamp: string
  soilMoisture?: number
  soilTemperature?: number
  airTemperature?: number
  humidity?: number
  ph?: number
  nitrogen?: number
  phosphorus?: number
  potassium?: number
  lightIntensity?: number
  rainfall?: number
  windSpeed?: number
  windDirection?: number
  farmId: string
  createdAt: string
}

export interface Sensor {
  id: string
  name: string
  type: 'soil' | 'weather' | 'camera' | 'multisensor'
  location: string
  status: 'active' | 'inactive' | 'maintenance'
  batteryLevel?: number
  lastReading?: string
  farmId: string
  coordinates?: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}

// AI and Recommendations
export interface Recommendation {
  id: string
  type: 'crop' | 'irrigation' | 'fertilizer' | 'pest' | 'disease' | 'harvest'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'implemented' | 'ignored'
  aiConfidence: number
  data?: Record<string, any>
  cropId?: string
  farmId: string
  userId: string
  implementedAt?: string
  createdAt: string
  updatedAt: string
}

// Pest and Disease Detection
export interface PestAlert {
  id: string
  name: string
  type: 'pest' | 'disease' | 'nutrient_deficiency'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  symptoms: string[]
  treatment: string[]
  prevention: string[]
  images?: string[]
  detectedAt: string
  location?: string
  farmId: string
  cropId?: string
  userId: string
  status: 'detected' | 'treating' | 'resolved'
  aiConfidence: number
  createdAt: string
  updatedAt: string
}

// Weather and Environmental
export interface WeatherData {
  timestamp: string
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  windDirection: number
  pressure?: number
  uvIndex?: number
  visibility?: number
  cloudCover?: number
  location: string
  source: 'sensor' | 'api' | 'forecast'
}

export interface WeatherForecast {
  date: string
  minTemp: number
  maxTemp: number
  humidity: number
  rainfall: number
  windSpeed: number
  description: string
  icon?: string
  location: string
}

// Market and Analytics
export interface MarketPrice {
  id: string
  crop: string
  variety?: string
  price: number
  unit: 'kg' | 'quintal' | 'ton'
  market: string
  location: string
  date: string
  source: string
  createdAt: string
}

export interface YieldData {
  cropId: string
  farmId: string
  actualYield: number
  predictedYield?: number
  quality: 'poor' | 'fair' | 'good' | 'excellent'
  harvestDate: string
  marketPrice?: number
  revenue?: number
  costs?: number
  profit?: number
  createdAt: string
}

// Expert and Chat
export interface ExpertConsultation {
  id: string
  userId: string
  expertId: string
  title: string
  description: string
  category: 'crop' | 'pest' | 'soil' | 'irrigation' | 'harvest' | 'market' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  scheduledAt?: string
  completedAt?: string
  rating?: number
  feedback?: string
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  consultationId?: string
  senderId: string
  recipientId: string
  message: string
  type: 'text' | 'image' | 'file' | 'location' | 'recommendation'
  attachments?: string[]
  metadata?: Record<string, any>
  readAt?: string
  createdAt: string
}

// Irrigation and Automation
export interface IrrigationSchedule {
  id: string
  farmId: string
  cropId?: string
  name: string
  type: 'manual' | 'scheduled' | 'sensor_based' | 'ai_optimized'
  schedule?: {
    startTime: string
    duration: number
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
    days?: string[]
  }
  conditions?: {
    soilMoisture?: { min: number; max: number }
    weather?: string[]
    temperature?: { min: number; max: number }
  }
  status: 'active' | 'paused' | 'completed'
  lastRun?: string
  nextRun?: string
  createdAt: string
  updatedAt: string
}

// Analytics and Reports
export interface AnalyticsData {
  farmId: string
  userId: string
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  startDate: string
  endDate: string
  metrics: {
    totalYield?: number
    averageYield?: number
    totalRevenue?: number
    totalCosts?: number
    profit?: number
    waterUsage?: number
    energyUsage?: number
    pestIncidents?: number
    diseaseIncidents?: number
    expertConsultations?: number
    recommendationsImplemented?: number
  }
  crops?: Record<string, any>
  trends?: Record<string, any>
  benchmarks?: Record<string, any>
  createdAt: string
}

// Language and Localization
export interface LanguageOption {
  code: string
  name: string
  nativeName: string
  flag: string
  regions: string[]
}

export enum IndianStates {
  ANDHRA_PRADESH = 'andhra_pradesh',
  ARUNACHAL_PRADESH = 'arunachal_pradesh',
  ASSAM = 'assam',
  BIHAR = 'bihar',
  CHHATTISGARH = 'chhattisgarh',
  GOA = 'goa',
  GUJARAT = 'gujarat',
  HARYANA = 'haryana',
  HIMACHAL_PRADESH = 'himachal_pradesh',
  JHARKHAND = 'jharkhand',
  KARNATAKA = 'karnataka',
  KERALA = 'kerala',
  MADHYA_PRADESH = 'madhya_pradesh',
  MAHARASHTRA = 'maharashtra',
  MANIPUR = 'manipur',
  MEGHALAYA = 'meghalaya',
  MIZORAM = 'mizoram',
  NAGALAND = 'nagaland',
  ODISHA = 'odisha',
  PUNJAB = 'punjab',
  RAJASTHAN = 'rajasthan',
  SIKKIM = 'sikkim',
  TAMIL_NADU = 'tamil_nadu',
  TELANGANA = 'telangana',
  TRIPURA = 'tripura',
  UTTAR_PRADESH = 'uttar_pradesh',
  UTTARAKHAND = 'uttarakhand',
  WEST_BENGAL = 'west_bengal',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// Real-time and WebSocket Types
export interface RealtimeUpdate {
  type: 'sensor_reading' | 'pest_alert' | 'weather_alert' | 'irrigation_alert' | 'recommendation'
  data: any
  timestamp: string
  farmId?: string
  userId?: string
}

// AI Service Types
export interface AIAnalysisResult {
  confidence: number
  results: any
  recommendations?: string[]
  metadata?: Record<string, any>
  processedAt: string
}

export interface CropRecommendation extends AIAnalysisResult {
  crops: Array<{
    name: string
    variety: string
    suitability: number
    expectedYield: number
    profitability: number
    riskFactors: string[]
    seasonality: {
      plantingWindow: string
      harvestWindow: string
      duration: number
    }
  }>
}

export interface PestDetectionResult extends AIAnalysisResult {
  detections: Array<{
    name: string
    type: 'pest' | 'disease' | 'nutrient_deficiency'
    severity: number
    location?: {
      x: number
      y: number
      width: number
      height: number
    }
    treatment: string[]
    prevention: string[]
  }>
}

// Form and UI Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'file' | 'date' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface TableColumn {
  key: string
  title: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any) => React.ReactNode
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'system' | 'crop' | 'weather' | 'pest' | 'irrigation' | 'market' | 'expert'
  read: boolean
  actionUrl?: string
  data?: Record<string, any>
  createdAt: string
  readAt?: string
}

// Database Schema Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
      }
      farms: {
        Row: Farm
        Insert: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>>
      }
      crops: {
        Row: Crop
        Insert: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>>
      }
      sensor_readings: {
        Row: SensorReading
        Insert: Omit<SensorReading, 'id' | 'createdAt'>
        Update: Partial<Omit<SensorReading, 'id' | 'createdAt'>>
      }
      pest_alerts: {
        Row: PestAlert
        Insert: Omit<PestAlert, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<PestAlert, 'id' | 'createdAt' | 'updatedAt'>>
      }
      recommendations: {
        Row: Recommendation
        Insert: Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Omit<Recommendation, 'id' | 'createdAt' | 'updatedAt'>>
      }
    }
  }
}
