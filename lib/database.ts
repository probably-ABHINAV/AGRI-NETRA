// Database operations with Supabase integration
import { supabase, isSupabaseConfigured } from './supabase'
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
          location: userData.location,
          phone: userData.phone
        })
        .select()
        .single()

      if (error) throw error
      // Ensure all required fields are present, even if null in Supabase
      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        location: data.location || null, // Handle potential null
        phone: data.phone || null // Handle potential null
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) return null // Handle case where user is not found

      return {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        location: data.location || null,
        phone: data.phone || null
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('farms')
        .insert({
          user_id: farmData.ownerId,
          name: farmData.name,
          location: farmData.location,
          area_hectares: farmData.size,
          soil_type: farmData.soilType,
          irrigation_type: farmData.irrigationType
        })
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

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
  async getFarmCrops(farmId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('farm_crops')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching farm crops:', error)
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('farm_crops')
        .insert(cropData)
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('crop_recommendations')
        .insert(recData)
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
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('pest_detections')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching pest alerts:', error)
      return []
    }
  },

  async createPestDetection(detectionData: any): Promise<any> {
    if (!isSupabaseConfigured()) {
      const newDetection = {
        id: `detection-${Date.now()}`,
        ...detectionData,
        created_at: new Date().toISOString()
      }
      return newDetection
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('pest_detections')
        .insert(detectionData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating pest detection:', error)
      throw error
    }
  },

  // Analytics operations
  async createAnalyticsEvent(eventData: {
    user_id: string
    event_type: string
    event_data?: any
    session_id?: string
    ip_address?: string
    user_agent?: string
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      const newEvent = {
        id: `analytics-${Date.now()}`,
        ...eventData,
        created_at: new Date().toISOString()
      }
      return newEvent
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('analytics_events')
        .insert(eventData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating analytics event:', error)
      throw error
    }
  },

  async getAnalyticsEvents(userId: string, limit: number = 100): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching analytics events:', error)
      return []
    }
  },

  // Chat history operations
  async createChatMessage(messageData: {
    consultation_id?: string
    sender_id: string
    message: string
    attachments?: any
    is_ai_response: boolean
  }): Promise<any> {
    if (!isSupabaseConfigured()) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        ...messageData,
        created_at: new Date().toISOString()
      }
      return newMessage
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('consultation_messages')
        .insert(messageData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating chat message:', error)
      throw error
    }
  },

  async getChatHistory(consultationId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching chat history:', error)
      return []
    }
  },

  async getUserChatSessions(userId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return []
    }

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('farmer_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user chat sessions:', error)
      return []
    }
  }
}