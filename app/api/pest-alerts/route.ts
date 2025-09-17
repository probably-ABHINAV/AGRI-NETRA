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

    // Verify user owns the farm
    const farm = await db.getFarm(farmId)
    if (!farm || farm.ownerId !== user.id) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    const alerts = await db.getPestAlerts(farmId)
    return NextResponse.json({ alerts })
  } catch (error) {
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
    const { farmId, cropId, pestType, severity, description, location, imageUrl } = body

    if (!farmId || !cropId || !pestType || !description || !location) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const alert = await db.createPestAlert({
      farmId,
      cropId,
      pestType,
      severity: severity || "medium",
      description,
      location,
      imageUrl: imageUrl || undefined,
      status: "active",
    })

    return NextResponse.json({ alert }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
