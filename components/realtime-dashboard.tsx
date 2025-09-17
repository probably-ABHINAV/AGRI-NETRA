"use client"

import { useRealtime } from "@/hooks/use-realtime"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Thermometer, Droplets, Wind, AlertTriangle, Wifi, WifiOff } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RealtimeDashboardProps {
  farmId: string
  userId: string
}

export function RealtimeDashboard({ farmId, userId }: RealtimeDashboardProps) {
  const { messages, isConnected, latestData, clearMessages } = useRealtime(farmId, userId)

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      case "soil_moisture":
        return <Droplets className="h-4 w-4" />
      case "humidity":
        return <Wind className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            {isConnected ? <Wifi className="h-5 w-5 text-green-600" /> : <WifiOff className="h-5 w-5 text-red-600" />}
            Real-time Monitoring
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Latest Sensor Data */}
            {latestData.sensor_data && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getSensorIcon(latestData.sensor_data.sensorType)}
                  <span className="font-medium capitalize">{latestData.sensor_data.sensorType.replace("_", " ")}</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {latestData.sensor_data.value?.toFixed(1)} {latestData.sensor_data.unit}
                </div>
                <div className="text-sm text-blue-600">{latestData.sensor_data.location}</div>
              </div>
            )}

            {/* Latest Weather */}
            {latestData.weather_update && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="h-4 w-4" />
                  <span className="font-medium">Weather</span>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {latestData.weather_update.temperature?.toFixed(1)}°C
                </div>
                <div className="text-sm text-green-600">{latestData.weather_update.conditions}</div>
              </div>
            )}

            {/* Latest Alert */}
            {latestData.alert && (
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Latest Alert</span>
                </div>
                <Badge variant={getSeverityColor(latestData.alert.severity)}>{latestData.alert.severity}</Badge>
                <div className="text-sm text-orange-600 mt-1">{latestData.alert.message}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Live Activity Feed</CardTitle>
          <Button variant="outline" size="sm" onClick={clearMessages}>
            Clear
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No real-time data yet. Waiting for updates...</div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    {message.type === "sensor_data" && getSensorIcon(message.data.sensorType)}
                    {message.type === "alert" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                    {message.type === "weather_update" && <Wind className="h-4 w-4 text-blue-500" />}
                    {message.type === "irrigation_status" && <Droplets className="h-4 w-4 text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {message.type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm">
                      {message.type === "sensor_data" && (
                        <span>
                          <strong>{message.data.sensorType.replace("_", " ")}:</strong> {message.data.value?.toFixed(1)}{" "}
                          {message.data.unit} at {message.data.location}
                        </span>
                      )}
                      {message.type === "alert" && (
                        <span>
                          <Badge variant={getSeverityColor(message.data.severity)} className="mr-2">
                            {message.data.severity}
                          </Badge>
                          {message.data.message}
                        </span>
                      )}
                      {message.type === "weather_update" && (
                        <span>
                          Weather: {message.data.temperature?.toFixed(1)}°C, {message.data.conditions}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
