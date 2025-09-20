import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Get user profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const { data: farm, error } = await supabase
      .from('farms')
      .select('*')
      .eq('id', params.farmId)
      .eq('user_id', profile.id)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Farm not found' }, { status: 404 })
    }

    const farmData = {
      id: farm.id,
      name: farm.name,
      location: farm.location,
      size: farm.area_hectares,
      soilType: farm.soil_type || 'Unknown',
      irrigationType: farm.irrigation_type,
      userId: user.email,
      createdAt: farm.created_at,
      updatedAt: farm.updated_at,
    }

    return NextResponse.json({ success: true, data: farmData })
  } catch (error) {
    console.error('Error fetching farm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = createClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Get user profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.name) updateData.name = body.name
    if (body.location) updateData.location = body.location
    if (body.size) updateData.area_hectares = Number(body.size)
    if (body.soilType) updateData.soil_type = body.soilType
    if (body.irrigationType) updateData.irrigation_type = body.irrigationType

    const { data: farm, error } = await supabase
      .from('farms')
      .update(updateData)
      .eq('id', params.farmId)
      .eq('user_id', profile.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update farm' }, { status: 500 })
    }

    const farmData = {
      id: farm.id,
      name: farm.name,
      location: farm.location,
      size: farm.area_hectares,
      soilType: farm.soil_type || 'Unknown',
      irrigationType: farm.irrigation_type,
      userId: user.email,
      createdAt: farm.created_at,
      updatedAt: farm.updated_at,
    }

    return NextResponse.json({ success: true, data: farmData })
  } catch (error) {
    console.error('Error updating farm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Get user profile ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const { error } = await supabase
      .from('farms')
      .delete()
      .eq('id', params.farmId)
      .eq('user_id', profile.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete farm' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Farm deleted successfully' })
  } catch (error) {
    console.error('Error deleting farm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}