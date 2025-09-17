import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { realtimeService } from "@/lib/websocket"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { farmId, type, data } = body

    if (!farmId || !type || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Broadcast simulated message
    realtimeService.broadcast({
      type,
      farmId,
      data,
      timestamp: new Date(),
    })

    return NextResponse.json({
      message: "Simulated data broadcasted successfully",
      status: "success",
    })
  } catch (error) {
    console.error("Realtime simulation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
