import { type NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth"
import { aiServices } from "@/lib/ai-services"

export async function GET(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cropName = searchParams.get("crop")
    const location = searchParams.get("location")

    if (!cropName || !location) {
      return NextResponse.json({ error: "Crop name and location are required" }, { status: 400 })
    }

    const prediction = await aiServices.getPricePrediction(cropName, location)

    return NextResponse.json({
      prediction,
      crop: cropName,
      location,
      generatedAt: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Price prediction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
