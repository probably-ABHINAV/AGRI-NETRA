import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wifi, WifiOff, Battery, MapPin, Settings, Plus, Zap, AlertCircle, CheckCircle } from "lucide-react"

export default function SensorsPage() {
  const sensors = [
    {
      id: 1,
      name: "Soil Monitor A1",
      type: "Soil Moisture & Temperature",
      location: "Field A - North Section",
      status: "online",
      battery: 85,
      lastReading: "2 minutes ago",
      readings: {
        moisture: { value: 68, unit: "%", status: "optimal" },
        temperature: { value: 24, unit: "°C", status: "good" },
        ph: { value: 6.8, unit: "pH", status: "optimal" },
      },
    },
    {
      id: 2,
      name: "Weather Station B1",
      type: "Environmental Monitor",
      location: "Field B - Central",
      status: "online",
      battery: 92,
      lastReading: "1 minute ago",
      readings: {
        humidity: { value: 72, unit: "%", status: "good" },
        windSpeed: { value: 12, unit: "km/h", status: "optimal" },
        rainfall: { value: 2.5, unit: "mm", status: "good" },
      },
    },
    {
      id: 3,
      name: "Nutrient Sensor C1",
      type: "NPK Monitor",
      location: "Greenhouse 1",
      status: "online",
      battery: 67,
      lastReading: "5 minutes ago",
      readings: {
        nitrogen: { value: 85, unit: "ppm", status: "optimal" },
        phosphorus: { value: 45, unit: "ppm", status: "good" },
        potassium: { value: 120, unit: "ppm", status: "optimal" },
      },
    },
    {
      id: 4,
      name: "Light Sensor D1",
      type: "PAR & UV Monitor",
      location: "Greenhouse 2",
      status: "warning",
      battery: 23,
      lastReading: "15 minutes ago",
      readings: {
        par: { value: 450, unit: "μmol/m²/s", status: "optimal" },
        uv: { value: 3.2, unit: "UV Index", status: "good" },
        lux: { value: 25000, unit: "lux", status: "optimal" },
      },
    },
    {
      id: 5,
      name: "Water Level Monitor E1",
      type: "Tank & Flow Sensor",
      location: "Irrigation System",
      status: "offline",
      battery: 0,
      lastReading: "2 hours ago",
      readings: {
        level: { value: 45, unit: "%", status: "warning" },
        flow: { value: 0, unit: "L/min", status: "critical" },
        pressure: { value: 0, unit: "bar", status: "critical" },
      },
    },
    {
      id: 6,
      name: "Pest Trap Monitor F1",
      type: "Smart Trap",
      location: "Field A - Perimeter",
      status: "online",
      battery: 78,
      lastReading: "30 minutes ago",
      readings: {
        count: { value: 12, unit: "insects", status: "good" },
        activity: { value: 3, unit: "events/hr", status: "optimal" },
        temperature: { value: 26, unit: "°C", status: "good" },
      },
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "offline":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "offline":
        return <WifiOff className="h-4 w-4 text-red-600" />
      default:
        return <Wifi className="h-4 w-4 text-gray-600" />
    }
  }

  const getReadingStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-green-600"
      case "good":
        return "text-blue-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">IoT Sensors</h1>
          <p className="text-gray-600 mt-2">Monitor and manage your connected farm sensors</p>
        </div>
        <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4" />
          Add New Sensor
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
            <Zap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">83% uptime</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Battery</CardTitle>
            <Battery className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Battery</CardTitle>
            <Battery className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">69%</div>
            <p className="text-xs text-muted-foreground">Good condition</p>
          </CardContent>
        </Card>
      </div>

      {/* Sensors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sensors.map((sensor) => (
          <Card key={sensor.id} className="border-l-4 border-l-green-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{sensor.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3" />
                    {sensor.location}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(sensor.status)}>
                    {getStatusIcon(sensor.status)}
                    <span className="ml-1">{sensor.status}</span>
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{sensor.type}</span>
                <span className="text-gray-500">Last reading: {sensor.lastReading}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-gray-600" />
                  <Progress value={sensor.battery} className="w-16" />
                  <span className="text-sm font-medium">{sensor.battery}%</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(sensor.readings).map(([key, reading]) => (
                  <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className={`text-lg font-bold ${getReadingStatusColor(reading.status)}`}>
                      {reading.value}
                      {reading.unit}
                    </div>
                    <Badge variant="outline" className={`text-xs ${getReadingStatusColor(reading.status)}`}>
                      {reading.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
