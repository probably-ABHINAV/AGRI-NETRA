import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Thermometer,
  Zap,
  Leaf,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"

export default function AnalyticsPage() {
  const sensorData = [
    { id: 1, name: "Field A - North", type: "Soil Moisture", value: 68, unit: "%", status: "optimal", trend: "up" },
    { id: 2, name: "Field A - South", type: "Temperature", value: 24, unit: "°C", status: "good", trend: "stable" },
    { id: 3, name: "Field B - East", type: "pH Level", value: 6.8, unit: "pH", status: "optimal", trend: "down" },
    { id: 4, name: "Field B - West", type: "Nutrients", value: 85, unit: "%", status: "good", trend: "up" },
    { id: 5, name: "Greenhouse 1", type: "Humidity", value: 72, unit: "%", status: "warning", trend: "up" },
    {
      id: 6,
      name: "Greenhouse 2",
      type: "Light Intensity",
      value: 450,
      unit: "lux",
      status: "optimal",
      trend: "stable",
    },
  ]

  const weeklyData = [
    { day: "Mon", moisture: 65, temp: 22, ph: 6.5, nutrients: 80 },
    { day: "Tue", moisture: 68, temp: 24, ph: 6.7, nutrients: 82 },
    { day: "Wed", moisture: 70, temp: 26, ph: 6.8, nutrients: 85 },
    { day: "Thu", moisture: 67, temp: 23, ph: 6.6, nutrients: 83 },
    { day: "Fri", moisture: 69, temp: 25, ph: 6.9, nutrients: 87 },
    { day: "Sat", moisture: 72, temp: 27, ph: 7.0, nutrients: 89 },
    { day: "Sun", moisture: 68, temp: 24, ph: 6.8, nutrients: 85 },
  ]

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Greenhouse 1 humidity above optimal range",
      time: "2 hours ago",
      field: "Greenhouse 1",
    },
    { id: 2, type: "info", message: "Irrigation scheduled for Field A", time: "4 hours ago", field: "Field A" },
    { id: 3, type: "success", message: "Nutrient levels improved in Field B", time: "6 hours ago", field: "Field B" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time IoT sensor monitoring and data insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Calendar className="h-4 w-4" />
            Last 7 Days
          </Button>
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sensors</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Soil Moisture</CardTitle>
            <Droplets className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Optimal range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24°C</div>
            <p className="text-xs text-muted-foreground">+1°C from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crop Health Score</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Excellent condition</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sensors">Live Sensors</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Sensor Data</CardTitle>
              <CardDescription>Live readings from all connected IoT sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sensorData.map((sensor) => (
                  <Card key={sensor.id} className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-sm font-medium">{sensor.name}</CardTitle>
                          <CardDescription className="text-xs">{sensor.type}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(sensor.status)}>{sensor.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                          {sensor.value}
                          {sensor.unit}
                        </div>
                        {getTrendIcon(sensor.trend)}
                      </div>
                      <Progress value={sensor.value} className="mt-3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trends</CardTitle>
              <CardDescription>7-day historical data analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Soil Moisture Trend</h4>
                    <div className="space-y-2">
                      {weeklyData.map((day) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day.day}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={day.moisture} className="w-20" />
                            <span className="text-sm font-medium">{day.moisture}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3">Temperature Trend</h4>
                    <div className="space-y-2">
                      {weeklyData.map((day) => (
                        <div key={day.day} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{day.day}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(day.temp / 35) * 100} className="w-20" />
                            <span className="text-sm font-medium">{day.temp}°C</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                    {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                    {alert.type === "info" && <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.field}
                        </Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>Create detailed analytics reports for your farm data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Available Reports</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Weekly Performance Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Monthly Trend Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Leaf className="h-4 w-4 mr-2" />
                      Crop Health Assessment
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Droplets className="h-4 w-4 mr-2" />
                      Irrigation Efficiency Report
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Export Options</h4>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
