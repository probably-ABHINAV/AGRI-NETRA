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
    const { ph, moisture, temperature, farmId } = body

    if (ph === undefined || moisture === undefined || temperature === undefined) {
      return NextResponse.json({ error: "pH, moisture, and temperature values are required" }, { status: 400 })
    }

    const analysis = await aiServices.analyzeSoil({ ph, moisture, temperature })

    // Generate recommendations based on analysis
    if (farmId) {
      const { db } = await import("@/lib/database")

      // Create AI-generated recommendations
      for (const recommendation of analysis.recommendations) {
        await db.createRecommendation({
          farmId,
          type: "general",
          title: "Soil Analysis Recommendation",
          description: recommendation,
          priority: "medium",
          status: "pending",
        })
      }
    }

    return NextResponse.json({
      analysis,
      recommendationsCreated: analysis.recommendations.length,
      generatedAt: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Soil analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
