import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    if (!supabase) {
      // Return empty farms for development
      return NextResponse.json({ success: true, data: [] }, { status: 200 })
    }

    // First get the user's profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 })
    }

    const { data: farms, error } = await supabase
      .from('farms')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    // Map database fields to API response format
    const farmsData = farms.map(farm => ({
      id: farm.id,
      name: farm.name,
      location: farm.location,
      size: farm.area_hectares,
      soilType: farm.soil_type || 'Unknown',
      userId: user.email,
      createdAt: farm.created_at,
    }))

    return NextResponse.json({ success: true, data: farmsData }, { status: 200 })
  } catch (error) {
    console.error('Error fetching farms:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.location || !body.size || !body.soilType) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location, size, soilType' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // First get the user's profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const farmData = {
      user_id: profile.id,
      name: body.name,
      location: body.location,
      area_hectares: Number(body.size),
      soil_type: body.soilType,
      irrigation_type: body.irrigationType || null,
    }

    const { data: farm, error } = await supabase
      .from('farms')
      .insert(farmData)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create farm' }, { status: 500 })
    }

    // Return farm in API response format
    const responseData = {
      id: farm.id,
      name: farm.name,
      location: farm.location,
      size: farm.area_hectares,
      soilType: farm.soil_type,
      userId: user.email,
      createdAt: farm.created_at,
    }

    return NextResponse.json({ success: true, data: responseData }, { status: 201 })
  } catch (error) {
    console.error('Error creating farm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}