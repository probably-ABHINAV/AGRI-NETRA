
'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Thermometer,
  Zap,
  Leaf,
  Download,
  Calendar as CalendarIcon,
  AlertTriangle,
  CheckCircle,
  Database,
} from "lucide-react"

export default function AnalyticsPage() {
  const [date, setDate] = useState<Date>()
  const [dateRange, setDateRange] = useState("7")
  const [exportFormat, setExportFormat] = useState("")
  const [selectedState, setSelectedState] = useState("UP")
  const [loading, setLoading] = useState(true)

  // Real crop data from the files you provided
  const realCropData = {
    UP: [
      {
        crop: "Rice (Paddy)",
        type: "Cereal (Kharif)",
        waterReq: "1200-2000 mm/season",
        fertilizer: "NPK 80-40-40 kg/ha (~72-36-36 kg/acre); Organic: FYM/compost; Micronutrients: Zn, B",
        pesticides: "Common groups: fungicides, insecticides for stem borer; follow label and local advisory; prefer IPM & biopesticides",
        climate: "Warm, humid; 20-35°C; standing water/lowland",
        sowing: "June-July",
        harvesting: "October-November",
        duration: "120-150 days",
        yield: "3-6 t/acre",
        diseases: "Blast, Sheath blight, Brown plant hopper, Stem borer",
        rotation: "Wheat → Rice; Legume intercrop/Green manure"
      }
    ],
    Maharashtra: [
      {
        crop: "Wheat",
        type: "Cereal",
        waterReq: "300-400 mm/acre",
        fertilizer: "120:60:40 NPK; Organic: FYM, Vermicompost",
        pesticides: "Mancozeb (fungicide), Chlorpyrifos (insecticide)",
        climate: "Temp: 10-25°C; Rainfall: 50-75 cm",
        sowing: "Oct-Nov (Rabi)",
        harvesting: "Mar-Apr",
        duration: "120-140 days",
        yield: "30-40 quintals/acre",
        diseases: "Rust, Loose Smut, Termites, Aphids",
        rotation: "Legumes (Chickpea, Lentil), Mustard, Potato"
      },
      {
        crop: "Soybean",
        type: "Oilseed/Pulse",
        waterReq: "450-650 mm/acre",
        fertilizer: "30:60:30 NPK; Organic: Bio-fertilizers (Rhizobium)",
        pesticides: "Thiamethoxam (for sucking pests), Carbendazim (for rust)",
        climate: "Temp: 25-30°C; Rainfall: 70-100 cm",
        sowing: "June-July (Kharif)",
        harvesting: "Oct-Nov",
        duration: "90-110 days",
        yield: "15-20 quintals/acre",
        diseases: "Rust, Yellow Mosaic Virus, Girdle Beetle",
        rotation: "Wheat, Jowar, Rice, Gram"
      }
    ],
    Punjab: [
      {
        crop: "Wheat",
        type: "Cereal",
        waterReq: "Moderate (approx 400–650 mm seasonal)",
        fertilizer: "N 40–60 kg/acre; P2O5 20–40 kg/acre; K2O 10–20 kg/acre; Organic: FYM 2–4 t/ha",
        pesticides: "Herbicides (isoproturon) and fungicides for rusts (use label doses); follow IPM",
        climate: "Temp 10–25°C (best 15–20°C); Rainfall 350–500 mm",
        sowing: "October-November",
        harvesting: "April-May",
        duration: "130-150 days",
        yield: "40-50 quintals/acre",
        diseases: "Rust, Aphids, Termites",
        rotation: "Rice-Wheat system; Cotton-Wheat"
      }
    ],
    Haryana: [
      {
        crop: "Wheat",
        type: "Cereal",
        waterReq: "Moderate (approx 400–650 mm seasonal)",
        fertilizer: "N 40–60 kg/acre; P2O5 20–40 kg/acre; K2O 10–20 kg/acre; Organic: FYM 2–4 t/ha; Micronutrients: S, Zn as per soil test",
        pesticides: "Herbicides (isoproturon) and fungicides for rusts (use label doses); follow IPM",
        climate: "Temp 10–25°C (best 15–20°C); Rainfall 350–500 mm",
        sowing: "October-November",
        harvesting: "April-May",
        duration: "130-150 days",
        yield: "35-45 quintals/acre",
        diseases: "Rust diseases, Aphids, Termites",
        rotation: "Rice-Wheat; Sugarcane-Wheat; Cotton-Wheat"
      }
    ],
    Bihar: [
      {
        crop: "Rice",
        type: "Cereal (Kharif)",
        waterReq: "1000-1500 mm/season",
        fertilizer: "NPK 80:40:40 kg/ha; Organic: FYM 10-15 t/ha",
        pesticides: "Carbendazim for blast; Chlorpyrifos for stem borer",
        climate: "Temp: 25-35°C; Rainfall: 100-150 cm; High humidity",
        sowing: "June-July",
        harvesting: "October-November",
        duration: "120-140 days",
        yield: "25-35 quintals/acre",
        diseases: "Blast, Sheath rot, Brown plant hopper, Stem borer",
        rotation: "Rice-Wheat; Rice-Mustard; Rice-Gram"
      }
    ]
  }

  // Sensor data
  const sensorData = [
    { id: 1, name: "Field A - North", type: "Soil Moisture", value: 68, unit: "%", status: "optimal", trend: "up" },
    { id: 2, name: "Field A - South", type: "Temperature", value: 24, unit: "°C", status: "good", trend: "stable" },
    { id: 3, name: "Field B - East", type: "pH Level", value: 6.8, unit: "pH", status: "optimal", trend: "down" },
    { id: 4, name: "Field B - West", type: "Nutrients", value: 85, unit: "%", status: "good", trend: "up" },
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
      message: "Optimal sowing time for Wheat approaching in selected state",
      time: "2 hours ago",
      field: selectedState,
    },
    { id: 2, type: "info", message: "Weather favorable for current crop cycle", time: "4 hours ago", field: selectedState },
    { id: 3, type: "success", message: "Soil conditions optimal for selected crops", time: "6 hours ago", field: selectedState },
  ]

  const stateInfo = {
    UP: { totalFarmers: "2.3 Crore", avgLandHolding: "0.78 hectares", irrigationCoverage: "77%" },
    Punjab: { totalFarmers: "10.2 Lakh", avgLandHolding: "3.62 hectares", irrigationCoverage: "98%" },
    Maharashtra: { totalFarmers: "1.38 Crore", avgLandHolding: "1.2 hectares", irrigationCoverage: "45%" },
    Haryana: { totalFarmers: "8.5 Lakh", avgLandHolding: "2.25 hectares", irrigationCoverage: "85%" },
    Bihar: { totalFarmers: "1.6 Crore", avgLandHolding: "0.39 hectares", irrigationCoverage: "42%" }
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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

  const exportToCSV = () => {
    const currentCrops = realCropData[selectedState as keyof typeof realCropData]

    const csvContent = [
      ['State', 'Crop Name', 'Crop Type', 'Water Requirement', 'Fertilizer', 'Pesticides', 'Climate', 'Sowing Season', 'Harvesting Season', 'Duration', 'Expected Yield', 'Common Diseases', 'Crop Rotation'],
      ...currentCrops.map(crop => [
        selectedState,
        crop.crop,
        crop.type,
        crop.waterReq,
        crop.fertilizer,
        crop.pesticides,
        crop.climate,
        crop.sowing,
        crop.harvesting,
        crop.duration,
        crop.yield,
        crop.diseases,
        crop.rotation
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `crops-data-${selectedState}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExport = (format: string) => {
    if (format === 'csv') {
      exportToCSV()
    } else {
      alert('Export format not implemented yet')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agricultural Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time IoT monitoring with state-specific crop data</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? new Date(date).toLocaleDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UP">Uttar Pradesh</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Haryana">Haryana</SelectItem>
                <SelectItem value="Bihar">Bihar</SelectItem>
              </SelectContent>
            </Select>

            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Export Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV Data</SelectItem>
                <SelectItem value="json">JSON Data</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => handleExport(exportFormat)}
              disabled={!exportFormat}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stateInfo[selectedState as keyof typeof stateInfo]?.totalFarmers}</div>
              <p className="text-xs text-muted-foreground">in {selectedState}</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Land Holding</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stateInfo[selectedState as keyof typeof stateInfo]?.avgLandHolding}</div>
              <p className="text-xs text-muted-foreground">per farmer</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Irrigation Coverage</CardTitle>
              <Droplets className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stateInfo[selectedState as keyof typeof stateInfo]?.irrigationCoverage}</div>
              <p className="text-xs text-muted-foreground">of farmland</p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tracked Crops</CardTitle>
              <Database className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realCropData[selectedState as keyof typeof realCropData]?.length || 0}</div>
              <p className="text-xs text-muted-foreground">major crops</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white">
            <TabsTrigger value="crops">Crop Data</TabsTrigger>
            <TabsTrigger value="sensors">Live Sensors</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="crops" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Major Crops in {selectedState}</CardTitle>
                <CardDescription>
                  {realCropData[selectedState as keyof typeof realCropData]?.length
                    ? "Complete agricultural data with cultivation practices"
                    : "No crop data available for this state yet"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {realCropData[selectedState as keyof typeof realCropData]?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {realCropData[selectedState as keyof typeof realCropData]?.map((crop, index) => (
                      <Card key={index} className="border-l-4 border-l-green-500 bg-white">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-medium">{crop.crop}</CardTitle>
                              <Badge className="mt-1 bg-blue-100 text-blue-800">{crop.type}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-3">
                          <div className="text-sm space-y-2">
                            <div><strong>Water:</strong> {crop.waterReq}</div>
                            <div><strong>Duration:</strong> {crop.duration}</div>
                            <div><strong>Yield:</strong> {crop.yield}</div>
                            <div><strong>Sowing:</strong> {crop.sowing}</div>
                            <div><strong>Harvesting:</strong> {crop.harvesting}</div>
                            <div><strong>Climate:</strong> {crop.climate}</div>
                            <div className="pt-2">
                              <details className="cursor-pointer">
                                <summary className="font-semibold text-green-700">More Details</summary>
                                <div className="mt-2 space-y-1 text-xs">
                                  <div><strong>Fertilizer:</strong> {crop.fertilizer}</div>
                                  <div><strong>Diseases:</strong> {crop.diseases}</div>
                                  <div><strong>Rotation:</strong> {crop.rotation}</div>
                                </div>
                              </details>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Crop Data Available</h3>
                    <p className="text-gray-600">Crop data for {selectedState} will be added soon.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sensors" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Real-time Sensor Data</CardTitle>
                <CardDescription>Live readings from all connected IoT sensors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sensorData.map((sensor) => (
                    <Card key={sensor.id} className="border-l-4 border-l-green-500 bg-white">
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
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Weekly Sensor Trends</CardTitle>
                <CardDescription>{dateRange}-day historical data analysis</CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Agricultural Alerts for {selectedState}</CardTitle>
                <CardDescription>System notifications and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50">
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
        </Tabs>
      </div>
    </div>
  )
}
