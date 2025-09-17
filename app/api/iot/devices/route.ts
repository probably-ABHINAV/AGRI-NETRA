import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { iotServices } from "@/lib/iot-services"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const farmId = searchParams.get("farmId")

    if (!farmId) {
      return NextResponse.json({ error: "Farm ID is required" }, { status: 400 })
    }

    // Verify user owns the farm
    const { db } = await import("@/lib/database")
    const farm = await db.getFarm(farmId)
    if (!farm || farm.ownerId !== user.id) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    const devices = await iotServices.getDevices(farmId)
    const healthStatus = await iotServices.checkDeviceHealth(farmId)

    return NextResponse.json({
      devices,
      healthStatus,
      status: "success",
    })
  } catch (error) {
    console.error("IoT devices error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
