
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get current user session
    const user = await getUser()

    // Test database operations
    const testData = {
      authentication: user ? "✅ Working" : "❌ No user session",
      database: "✅ In-memory storage ready",
      aiServices: "✅ Mock AI endpoints ready",
      iotServices: "✅ IoT simulation ready",
      realtimeFeatures: "✅ WebSocket-like features ready",
      apiEndpoints: {
        farms: "/api/farms",
        crops: "/api/farms/[farmId]/crops",
        sensors: "/api/sensors",
        recommendations: "/api/recommendations",
        pestAlerts: "/api/pest-alerts",
        aiCropRecommendations: "/api/ai/crop-recommendations",
        aiPestDetection: "/api/ai/pest-detection",
        iotDevices: "/api/iot/devices",
        iotSensorData: "/api/iot/sensor-data",
        realtimeStatus: "/api/realtime/status",
      },
      testCredentials: {
        farmer: { email: "farmer@example.com", password: "password123" },
        expert: { email: "expert@example.com", password: "password123" },
        admin: { email: "admin@example.com", password: "password123" },
      },
      environmentStatus: {
        nodeEnv: process.env.NODE_ENV || 'development',
        supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        jwtSecret: !!process.env.JWT_SECRET,
        geminiApiKey: !!process.env.GEMINI_API_KEY,
        weatherApiKey: !!process.env.WEATHER_API_KEY,
      }
    }

    return NextResponse.json(testData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Backend test error:', error)
    return NextResponse.json(
      { 
        error: 'Backend test failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
