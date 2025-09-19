import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmId = searchParams.get("farmId")
    const sensorType = searchParams.get("type")

    if (!farmId) {
      return NextResponse.json({ error: "Farm ID is required" }, { status: 400 })
    }

    // Mock sensor data
    const readings = [
      {
        id: 'reading-1',
        sensorType: sensorType || 'soil_moisture',
        value: 45.2,
        unit: '%',
        timestamp: new Date().toISOString(),
        farmId: farmId
      },
      {
        id: 'reading-2',
        sensorType: 'temperature',
        value: 24.5,
        unit: '°C',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        farmId: farmId
      }
    ]

    return NextResponse.json({ readings }, { status: 200 })
  } catch (error) {
    console.error('Sensors API failed:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require authentication for sensor data writes
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { farmId, sensorType, value, unit } = body

    if (!farmId || !sensorType || value === undefined || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reading = {
      id: `reading-${Date.now()}`,
      farmId,
      sensorType,
      value: Number.parseFloat(value),
      unit,
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({ reading }, { status: 201 })
  } catch (error) {
    console.error('Sensors API failed:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}