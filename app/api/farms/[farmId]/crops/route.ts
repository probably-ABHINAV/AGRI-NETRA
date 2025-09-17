
import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"

// Mock data for development
let farmCrops: Array<{
  id: string
  farmId: string
  name: string
  variety: string
  plantingDate: string
  expectedHarvestDate: string
  area: number
  status: string
}> = []

export async function GET(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Filter crops for this farm
    const crops = farmCrops.filter(crop => crop.farmId === params.farmId)
    
    return NextResponse.json({ crops })
  } catch (error) {
    console.error("Error fetching crops:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { farmId: string } }
) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, variety, plantingDate, expectedHarvestDate, area } = body

    if (!name || !plantingDate || !area) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const crop = {
      id: `crop-${Date.now()}`,
      farmId: params.farmId,
      name,
      variety: variety || "Unknown",
      plantingDate: plantingDate,
      expectedHarvestDate: expectedHarvestDate || new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
      area: Number.parseFloat(area),
      status: "planted",
    }

    farmCrops.push(crop)

    return NextResponse.json({ crop }, { status: 201 })
  } catch (error) {
    console.error("Error creating crop:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
