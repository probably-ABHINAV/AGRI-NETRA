import { type NextRequest, NextResponse } from "next/server"
import { iotServices } from "@/lib/iot-services"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, sensorType, value, unit, timestamp } = body

    if (!deviceId || !sensorType || value === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Process sensor data and check for alerts
    const result = await iotServices.processSensorData({
      deviceId,
      value: Number.parseFloat(value),
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    })

    // Store sensor reading in database
    const device = await iotServices.getDevice(deviceId)
    if (device) {
      await db.addSensorReading({
        farmId: device.farmId,
        sensorType,
        value: Number.parseFloat(value),
        unit: unit || "",
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      })
    }

    return NextResponse.json({
      processed: result.processed,
      alertGenerated: result.alertGenerated,
      alertId: result.alertId,
      status: "success",
    })
  } catch (error) {
    console.error("Sensor data processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
