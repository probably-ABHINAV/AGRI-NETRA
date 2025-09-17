import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET() {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const farms = await db.getFarms(user.id)
    return NextResponse.json({ farms })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user || user.role !== "farmer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, size, soilType, irrigationType } = body

    if (!name || !location || !size) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const farm = await db.createFarm({
      name,
      ownerId: user.id,
      location,
      size: Number.parseFloat(size),
      soilType: soilType || "Unknown",
      irrigationType: irrigationType || "Traditional",
    })

    return NextResponse.json({ farm }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
