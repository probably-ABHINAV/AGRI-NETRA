import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { farmId: string } }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the farm
    const farm = await db.getFarm(params.farmId)
    if (!farm || farm.ownerId !== user.id) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    const crops = await db.getCrops(params.farmId)
    return NextResponse.json({ crops })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { farmId: string } }) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user owns the farm
    const farm = await db.getFarm(params.farmId)
    if (!farm || farm.ownerId !== user.id) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, variety, plantingDate, expectedHarvestDate, area } = body

    if (!name || !plantingDate || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const crop = await db.createCrop({
      farmId: params.farmId,
      name,
      variety: variety || "Unknown",
      plantingDate: new Date(plantingDate),
      expectedHarvestDate: expectedHarvestDate
        ? new Date(expectedHarvestDate)
        : new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days default
      area: Number.parseFloat(area),
      status: "planted",
    })

    return NextResponse.json({ crop }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
