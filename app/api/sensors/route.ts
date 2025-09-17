import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { db } from "@/lib/database"
import { withAppRouterHighlight } from '@/app/_utils/app-router-highlight.config';
import { H } from '@highlight-run/next/server';

export const GET = withAppRouterHighlight(async function GET(
  request: NextRequest,
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { span } = H.startWithHeaders('sensors-data-span', {});

    console.info('Fetching sensor data - Highlight tracing enabled');

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
    const response = NextResponse.json({ readings })

    span.end();
    return response;
  } catch (error) {
    console.error('Sensors API failed:', error)
    H.recordException(error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

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
    console.error('Sensors API failed:', error)
    H.recordException(error as Error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}