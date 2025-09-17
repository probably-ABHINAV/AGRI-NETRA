import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { db } from "@/lib/database"

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

    // Verify user owns the farm
    const farm = await db.getFarm(farmId)
    if (!farm || farm.ownerId !== user.id) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    const readings = await db.getSensorReadings(farmId, sensorType || undefined)
    return NextResponse.json({ readings })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { farmId, sensorType, value, unit } = body

    if (!farmId || !sensorType || value === undefined || !unit) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reading = await db.addSensorReading({
      farmId,
      sensorType,
      value: Number.parseFloat(value),
      unit,
      timestamp: new Date(),
    })

    return NextResponse.json({ reading }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
