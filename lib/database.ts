// Database operations with Supabase integration
import { supabase } from './supabase'
import type { Profile, Farm, Crop } from './supabase'

export interface User {
  id: string
  email: string
  full_name: string
  role: 'farmer' | 'expert' | 'admin'
  location?: string
  phone?: string
}

export interface FarmData {
  name: string
  ownerId: string
  location: string
  size: number
  soilType: string
  irrigationType: string
}

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Mock data for development
const mockFarms = [
  {
    id: 'farm-001',
    name: 'Green Valley Farm',
    ownerId: '1',
    location: 'Punjab, India',
    size: 25.5,
    soilType: 'Alluvial',
    irrigationType: 'Drip Irrigation',
    created_at: new Date().toISOString()
  }
]

export const db = {
  // User operations
  async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      const newUser = {
        id: Date.now().toString(),
        ...userData
      }
      return newUser
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          location: userData.location,
          phone: userData.phone
        }])
        .select()
        .single()

      if (error) throw error
      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        location: data.location,
        phone: data.phone
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  },

  async getUserById(id: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      return {
        id: '1',
        email: 'farmer@example.com',
        full_name: 'John Farmer',
        role: 'farmer',
        location: 'Punjab, India'
      }
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        location: data.location,
        phone: data.phone
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  },

  // Farm operations
  async createFarm(farmData: FarmData): Promise<any> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      const newFarm = {
        id: `farm-${Date.now()}`,
        ...farmData,
        created_at: new Date().toISOString()
      }
      mockFarms.push(newFarm)
      return newFarm
    }

    try {
      const { data, error } = await supabase
        .from('farms')
        .insert([{
          user_id: farmData.ownerId,
          name: farmData.name,
          location: farmData.location,
          area_hectares: farmData.size,
          soil_type: farmData.soilType,
          irrigation_type: farmData.irrigationType
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating farm:', error)
      throw error
    }
  },

  async getFarms(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      return mockFarms.filter(farm => farm.ownerId === userId)
    }

    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching farms:', error)
      return []
    }
  },

  // Crop operations
  async getCrops(): Promise<Crop[]> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      return [
        {
          id: '1',
          name: 'Rice',
          scientific_name: 'Oryza sativa',
          category: 'cereals',
          growing_season: 'Kharif',
          water_requirement: 'High',
          soil_ph_min: 5.5,
          soil_ph_max: 7.0,
          temperature_min: 20,
          temperature_max: 35,
          growth_duration_days: 120,
          description: 'Staple cereal crop requiring flooded fields',
          created_at: new Date().toISOString()
        }
      ]
    }

    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching crops:', error)
      return []
    }
  },

  async getCropsByCategory(category: string): Promise<Crop[]> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      return []
    }

    try {
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .eq('category', category)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching crops by category:', error)
      return []
    }
  },

  // Region operations for your state data
  async getRegions(): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      // Mock implementation
      return [
        { id: '1', name: 'Punjab Plains', state: 'Punjab', country: 'India' },
        { id: '2', name: 'Maharashtra Plateau', state: 'Maharashtra', country: 'India' }
      ]
    }

    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching regions:', error)
      return []
    }
  },

  // Farm operations - missing functions
  async getFarm(farmId: string): Promise<any> {
    if (!isSupabaseConfigured()) {
      return mockFarms.find(farm => farm.id === farmId) || null
    }

    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('id', farmId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching farm:', error)
      return null
    }
  },

  // Crop operations - missing functions
  async getCrops(farmId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('farm_crops')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching crops:', error)
      return []
    }
  },

  async createCrop(cropData: any): Promise<any> {
    if (!isSupabaseConfigured()) {
      const newCrop = {
        id: `crop-${Date.now()}`,
        ...cropData,
        created_at: new Date().toISOString()
      }
      return newCrop
    }

    try {
      const { data, error } = await supabase
        .from('farm_crops')
        .insert([cropData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating crop:', error)
      throw error
    }
  },

  // Recommendation operations
  async getRecommendations(farmId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('crop_recommendations')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return []
    }
  },

  async createRecommendation(recData: any): Promise<any> {
    if (!isSupabaseConfigured()) {
      const newRec = {
        id: `rec-${Date.now()}`,
        ...recData,
        created_at: new Date().toISOString()
      }
      return newRec
    }

    try {
      const { data, error } = await supabase
        .from('crop_recommendations')
        .insert([recData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating recommendation:', error)
      throw error
    }
  },

  // Pest alert operations
  async getPestAlerts(farmId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('pest_alerts')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pest alerts:', error)
      return []
    }
  },

  async createPestAlert(alertData: any): Promise<any> {
    if (!isSupabaseConfigured()) {
      const newAlert = {
        id: `alert-${Date.now()}`,
        ...alertData,
        created_at: new Date().toISOString()
      }
      return newAlert
    }

    try {
      const { data, error } = await supabase
        .from('pest_alerts')
        .insert([alertData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating pest alert:', error)
      throw error
    }
  }
}