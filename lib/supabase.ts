
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types based on your schema
export interface Profile {
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

export interface Farm {
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

export interface Crop {
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

export interface SensorReading {
  id: string
  sensor_id: string
  value: number
  unit: string
  timestamp: string
  quality_score?: number
}
