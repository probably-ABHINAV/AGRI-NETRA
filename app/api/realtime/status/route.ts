import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { realtimeService } from "@/lib/websocket"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const status = realtimeService.getStatus()

    return NextResponse.json({
      ...status,
      timestamp: new Date().toISOString(),
      uptime: Date.now(), // Mock uptime
      version: "1.0.0"
    })
  } catch (error) {
    console.error("Realtime status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}