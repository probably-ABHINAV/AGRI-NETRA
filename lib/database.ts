import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found, using mock data')
    return null
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        headers: {
          'x-application-name': 'agri-netra'
        }
      }
    })
  }

  return supabase
}

export interface DatabaseProfile {
  id: string
  email: string
  name: string
  phone?: string
  location?: string
  user_type: 'farmer' | 'expert' | 'admin'
  created_at: string
  updated_at: string
}

export interface DatabaseFarm {
  id: string
  user_id: string
  name: string
  location: string
  area: number
  soil_type?: string
  created_at: string
  updated_at: string
}

export interface DatabaseCrop {
  id: string
  farm_id: string
  name: string
  variety?: string
  planting_date: string
  expected_harvest?: string
  status: 'planted' | 'growing' | 'harvested'
  created_at: string
  updated_at: string
}

export interface DatabaseSensorData {
  id: string
  farm_id: string
  sensor_type: string
  value: number
  unit: string
  timestamp: string
}

// Mock data for development/fallback
const mockProfiles: DatabaseProfile[] = [
  {
    id: '1',
    email: 'farmer@example.com',
    name: 'राम कुमार',
    phone: '+91-9876543210',
    location: 'पंजाब, भारत',
    user_type: 'farmer',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockFarms: DatabaseFarm[] = [
  {
    id: '1',
    user_id: '1',
    name: 'मुख्य खेत',
    location: 'पंजाब, भारत',
    area: 5.5,
    soil_type: 'दोमट मिट्टी',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockCrops: DatabaseCrop[] = [
  {
    id: '1',
    farm_id: '1',
    name: 'गेहूं',
    variety: 'HD-2967',
    planting_date: '2024-11-15',
    expected_harvest: '2024-04-15',
    status: 'growing',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export async function getUserProfile(userId: string): Promise<DatabaseProfile | null> {
  const client = getSupabaseClient()

  if (!client) {
    return mockProfiles.find(p => p.id === userId) || null
  }

  try {
    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Database error:', error)
      return mockProfiles.find(p => p.id === userId) || null
    }

    return data
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return mockProfiles.find(p => p.id === userId) || null
  }
}

export async function getUserFarms(userId: string): Promise<DatabaseFarm[]> {
  const client = getSupabaseClient()

  if (!client) {
    return mockFarms.filter(f => f.user_id === userId)
  }

  try {
    const { data, error } = await client
      .from('farms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return mockFarms.filter(f => f.user_id === userId)
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch farms:', error)
    return mockFarms.filter(f => f.user_id === userId)
  }
}

export async function getFarmCrops(farmId: string): Promise<DatabaseCrop[]> {
  const client = getSupabaseClient()

  if (!client) {
    return mockCrops.filter(c => c.farm_id === farmId)
  }

  try {
    const { data, error } = await client
      .from('crops')
      .select('*')
      .eq('farm_id', farmId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return mockCrops.filter(c => c.farm_id === farmId)
    }

    return data || []
  } catch (error) {
    console.error('Failed to fetch crops:', error)
    return mockCrops.filter(c => c.farm_id === farmId)
  }
}

export async function createProfile(profile: Omit<DatabaseProfile, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseProfile | null> {
  const client = getSupabaseClient()

  if (!client) {
    const newProfile: DatabaseProfile = {
      ...profile,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockProfiles.push(newProfile)
    return newProfile
  }

  try {
    const { data, error } = await client
      .from('profiles')
      .insert([profile])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to create profile:', error)
    return null
  }
}

export async function updateProfile(id: string, updates: Partial<DatabaseProfile>): Promise<DatabaseProfile | null> {
  const client = getSupabaseClient()

  if (!client) {
    const index = mockProfiles.findIndex(p => p.id === id)
    if (index !== -1) {
      mockProfiles[index] = { ...mockProfiles[index], ...updates, updated_at: new Date().toISOString() }
      return mockProfiles[index]
    }
    return null
  }

  try {
    const { data, error } = await client
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Failed to update profile:', error)
    return null
  }
}

export async function testDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  const client = getSupabaseClient()

  if (!client) {
    return { connected: false, error: 'Supabase client not configured' }
  }

  try {
    const { data, error } = await client
      .from('profiles')
      .select('count(*)')
      .limit(1)

    if (error) {
      return { connected: false, error: error.message }
    }

    return { connected: true }
  } catch (error) {
    return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Pest Detection interfaces
export interface DatabasePestDetection {
  id: string
  user_id: string
  farm_id?: string
  crop_id?: string
  image_url: string
  detected_pest?: string
  confidence_score: number
  severity: string
  treatment_recommendation?: string
  ai_model_version: string
  created_at: string
  updated_at: string
}

export interface DatabaseAnalyticsEvent {
  id: string
  user_id: string
  event_type: string
  event_data: any
  session_id: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

// Mock data for pest detections
const mockPestDetections: DatabasePestDetection[] = []

// Database operations object
export const db = {
  async createPestDetection(data: Omit<DatabasePestDetection, 'id' | 'created_at' | 'updated_at'>): Promise<DatabasePestDetection | null> {
    const client = getSupabaseClient()
    
    if (!client) {
      const newDetection: DatabasePestDetection = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mockPestDetections.push(newDetection)
      return newDetection
    }

    try {
      const { data: result, error } = await client
        .from('pest_detections')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        // Fallback to mock data
        const newDetection: DatabasePestDetection = {
          ...data,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        mockPestDetections.push(newDetection)
        return newDetection
      }

      return result
    } catch (error) {
      console.error('Failed to create pest detection:', error)
      return null
    }
  },

  async getUserPestDetections(userId: string): Promise<DatabasePestDetection[]> {
    const client = getSupabaseClient()
    
    if (!client) {
      return mockPestDetections.filter(d => d.user_id === userId)
    }

    try {
      const { data, error } = await client
        .from('pest_detections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Database error:', error)
        return mockPestDetections.filter(d => d.user_id === userId)
      }

      return data || []
    } catch (error) {
      console.error('Failed to fetch pest detections:', error)
      return mockPestDetections.filter(d => d.user_id === userId)
    }
  },

  async createAnalyticsEvent(data: Omit<DatabaseAnalyticsEvent, 'id' | 'created_at'>): Promise<DatabaseAnalyticsEvent | null> {
    const client = getSupabaseClient()
    
    if (!client) {
      console.log('Analytics event (mock):', data)
      return {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      }
    }

    try {
      const { data: result, error } = await client
        .from('analytics_events')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('Analytics error:', error)
        return null
      }

      return result
    } catch (error) {
      console.error('Failed to create analytics event:', error)
      return null
    }
  }
}