import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { realtimeService } from "@/lib/websocket"

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

    const subscribersCount = realtimeService.getSubscribersCount(farmId)

    return NextResponse.json({
      farmId,
      subscribersCount,
      isActive: subscribersCount > 0,
      status: "success",
    })
  } catch (error) {
    console.error("Realtime status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
