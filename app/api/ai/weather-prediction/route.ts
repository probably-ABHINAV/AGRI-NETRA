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
    const location = searchParams.get("location")
    const days = Number.parseInt(searchParams.get("days") || "7")

    if (!location) {
      return NextResponse.json({ error: "Location is required" }, { status: 400 })
    }

    const predictions = await aiServices.getWeatherPrediction(location, days)

    return NextResponse.json({
      predictions,
      location,
      generatedAt: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Weather prediction error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
