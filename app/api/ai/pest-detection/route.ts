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
    const { imageUrl, cropType, farmId } = body

    if (!imageUrl || !cropType) {
      return NextResponse.json({ error: "Image URL and crop type are required" }, { status: 400 })
    }

    const detections = await aiServices.detectPestFromImage(imageUrl, cropType)

    // If pests detected, create alerts in database
    if (detections.length > 0 && farmId) {
      const { db } = await import("@/lib/database")

      for (const detection of detections) {
        await db.createPestAlert({
          farmId,
          cropId: "crop-001", // In real app, this would be dynamic
          pestType: detection.pestName,
          severity: detection.severity,
          description: detection.description,
          location: "Field detected via AI",
          status: "active",
        })
      }
    }

    return NextResponse.json({
      detections,
      alertsCreated: detections.length,
      generatedAt: new Date().toISOString(),
      status: "success",
    })
  } catch (error) {
    console.error("Pest detection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
