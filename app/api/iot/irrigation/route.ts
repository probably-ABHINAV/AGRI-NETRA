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

    const commands = await iotServices.getIrrigationCommands(farmId)

    return NextResponse.json({
      commands,
      status: "success",
    })
  } catch (error) {
    console.error("Irrigation commands error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { farmId, zoneId, action, duration, scheduledTime, autoMode } = body

    if (!farmId || !action) {
      return NextResponse.json({ error: "Farm ID and action are required" }, { status: 400 })
    }

    // Verify user owns the farm
    const { db } = await import("@/lib/database")
    const farm = await db.getFarm(farmId)
    if (!farm || farm.ownerId !== user.id) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    let commands: any[] = []

    if (autoMode) {
      // Automated irrigation based on sensor data
      commands = await iotServices.autoIrrigate(farmId)
    } else {
      // Manual irrigation command
      const command = await iotServices.createIrrigationCommand({
        farmId,
        zoneId: zoneId || "All Zones",
        action,
        duration: duration ? Number.parseInt(duration) : undefined,
        scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      })
      commands = [command]
    }

    return NextResponse.json({
      commands,
      commandsCreated: commands.length,
      status: "success",
    })
  } catch (error) {
    console.error("Irrigation command error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
