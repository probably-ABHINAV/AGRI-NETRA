
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

    if (!farmId) {
      return NextResponse.json({ error: "Farm ID is required" }, { status: 400 })
    }

    // Mock data since db.getFarm might not exist
    const recommendations = [
      {
        id: 'rec-1',
        type: 'irrigation',
        title: 'Optimize Water Usage',
        description: 'Based on current soil moisture levels, reduce watering by 15%',
        priority: 'medium',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({ recommendations }, { status: 200 })
  } catch (error) {
    console.error("GET /api/recommendations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "expert") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { farmId, cropId, type, title, description, priority } = body

    if (!farmId || !type || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const recommendation = {
      id: `rec-${Date.now()}`,
      farmId,
      cropId: cropId || undefined,
      type,
      title,
      description,
      priority: priority || "medium",
      status: "pending",
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({ recommendation }, { status: 201 })
  } catch (error) {
    console.error("POST /api/recommendations error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
