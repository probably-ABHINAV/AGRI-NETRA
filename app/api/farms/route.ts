
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'

// In-memory storage for demo
let farms: Array<{
  id: string
  name: string
  location: string
  size: number
  soilType: string
  userId: string
  createdAt: string
}> = []

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userFarms = farms.filter(farm => farm.userId === user.email)
    return NextResponse.json({ success: true, data: userFarms })
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

    const farm = {
      id: `farm-${farms.length + 1}`,
      name: body.name,
      location: body.location,
      size: Number(body.size),
      soilType: body.soilType,
      userId: user.email,
      createdAt: new Date().toISOString(),
    }

    farms.push(farm)
    return NextResponse.json({ success: true, data: farm }, { status: 201 })
  } catch (error) {
    console.error('Error creating farm:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
