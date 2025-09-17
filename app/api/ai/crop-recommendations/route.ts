import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { aiServices } from "@/lib/ai-services"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { location, soilType, season, farmSize } = body

    if (!location || !soilType || !season) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const recommendations = await aiServices.getCropRecommendations(location, soilType, season, farmSize || 10)

    return NextResponse.json({
      recommendations,
      generatedAt: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Crop recommendation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
