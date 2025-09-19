"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Cloud,
  CloudRain,
  Sun,
  Droplets,
  Wind,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sprout,
  BarChart3,
  Camera,
  MessageSquare,
  Plus,
  Calendar,
  MapPin,
  Thermometer,
  Activity,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

// Mock data - will be replaced with real API calls
const mockWeatherData = {
  current: {
    temperature: 28,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    icon: "partly-cloudy",
    pressure: 1013,
    uvIndex: 6,
  },
  forecast: [
    { day: "Today", high: 32, low: 24, condition: "Sunny", rain: 0 },
    { day: "Tomorrow", high: 30, low: 22, condition: "Partly Cloudy", rain: 10 },
    { day: "Wed", high: 28, low: 20, condition: "Rainy", rain: 80 },
    { day: "Thu", high: 26, low: 18, condition: "Cloudy", rain: 40 },
    { day: "Fri", high: 29, low: 21, condition: "Sunny", rain: 5 },
  ],
}

const mockFarmData = {
  totalArea: 25.5,
  activeFields: 8,
  currentCrops: ["Rice", "Wheat", "Tomato", "Onion"],
  sensors: {
    active: 12,
    total: 15,
  },
  alerts: [
    { id: 1, type: "warning", message: "dashboard.alerts.soilMoistureLow", time: "2 hours ago" },
    { id: 2, type: "info", message: "dashboard.alerts.weatherAlert", time: "4 hours ago" },
    { id: 3, type: "success", message: "dashboard.alerts.irrigationComplete", time: "6 hours ago" },
  ],
}

const mockSensorData = [
  { name: "dashboard.sensors.soilMoisture", value: 45, unit: "%", status: "low", trend: "down" },
  { name: "dashboard.sensors.temperature", value: 28, unit: "°C", status: "normal", trend: "up" },
  { name: "dashboard.sensors.phLevel", value: 6.8, unit: "pH", status: "normal", trend: "stable" },
  { name: "dashboard.sensors.nitrogen", value: 32, unit: "ppm", status: "high", trend: "up" },
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    // Set initial time only on client to prevent hydration mismatch
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "partly cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Cloud className="h-8 w-8 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "text-red-600 bg-red-50 border-red-200"
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200"
      case "normal":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Activity className="h-4 w-4 text-blue-500" />
      case "success":
        return <Activity className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {t('dashboard.welcomeBack')}, John!
              </h1>
              <p className="text-gray-600">{t('dashboard.overview')}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              <Calendar className="h-4 w-4" />
              <span>
                {t('dashboard.lastUpdated')}: {currentTime?.toLocaleTimeString("en-IN", { hour12: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Farm Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.farmSize')}</p>
                  <p className="text-2xl font-bold text-gray-900">{mockFarmData.totalArea} {t('dashboard.hectares')}</p>
                  <p className="text-xs text-green-600">+2.5 {t('dashboard.thisMonth')}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.activeFields')}</p>
                  <p className="text-2xl font-bold text-gray-900">{mockFarmData.activeFields}</p>
                  <p className="text-xs text-blue-600">2 {t('dashboard.fieldsHarvesting')}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.activeSensors')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockFarmData.sensors.active}/{mockFarmData.sensors.total}
                  </p>
                  <p className="text-xs text-purple-600">3 {t('dashboard.sensorsOffline')}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{t('dashboard.currentCrops')}</p>
                  <p className="text-2xl font-bold text-gray-900">{mockFarmData.currentCrops.length}</p>
                  <p className="text-xs text-orange-600">{t('dashboard.peakGrowingSeason')}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Weather Card - Takes 2 columns on large screens */}
          <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-blue-600" />
                {t('dashboard.weatherUpdate')}
              </CardTitle>
              <CardDescription>{t('dashboard.currentConditions')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Weather */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(mockWeatherData.current.condition)}
                    <div>
                      <p className="text-3xl font-bold text-gray-900">{mockWeatherData.current.temperature}°C</p>
                      <p className="text-gray-600">{mockWeatherData.current.condition}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Droplets className="h-4 w-4" />
                      <span>{mockWeatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Wind className="h-4 w-4" />
                      <span>{mockWeatherData.current.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t('dashboard.fiveDayForecast')}</h4>
                <div className="grid grid-cols-5 gap-2">
                  {mockWeatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-3 rounded-lg hover:bg-gray-50 border transition-colors">
                      <p className="text-sm font-medium text-gray-900 mb-2">{day.day}</p>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {day.high}°/{day.low}°
                      </p>
                      <p className="text-xs text-blue-600">{day.rain}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sensor Readings */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                {t('dashboard.liveSensorData')}
              </CardTitle>
              <CardDescription>{t('dashboard.latestIoTReadings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSensorData.map((sensor, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getStatusColor(sensor.status)} transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t(sensor.name)}</span>
                    {getTrendIcon(sensor.trend)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {sensor.value} {sensor.unit}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {t(`dashboard.status.${sensor.status}`)}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/sensors">
                  <Eye className="h-4 w-4 mr-2" />
                  {t('dashboard.viewAllSensors')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Alerts Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                {t('dashboard.recentAlerts')}
              </CardTitle>
              <CardDescription>{t('dashboard.importantNotifications')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockFarmData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border hover:bg-gray-100 transition-colors">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{t(alert.message)}</p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/alerts">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {t('dashboard.viewAllAlerts')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                {t('dashboard.quickActions')}
              </CardTitle>
              <CardDescription>{t('dashboard.commonTasks')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-green-50 hover:border-green-300" asChild>
                  <Link href="/crop-recommendations">
                    <Sprout className="h-6 w-6 text-green-600" />
                    <span className="text-sm text-center">{t('nav.recommendations')}</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-300" asChild>
                  <Link href="/pest-detection">
                    <Camera className="h-6 w-6 text-blue-600" />
                    <span className="text-sm text-center">{t('nav.pest-detection')}</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-300" asChild>
                  <Link href="/chat">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                    <span className="text-sm text-center">{t('nav.chat')}</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-300" asChild>
                  <Link href="/analytics">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                    <span className="text-sm text-center">{t('nav.analytics')}</span>
                  </Link>
                </Button>
              </div>

              <Separator />

              <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                <Link href="/farms/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('farm.addNew')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Crop Management Section */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Sprout className="h-5 w-5 text-green-600" />
              {t('dashboard.cropManagement')}
            </CardTitle>
            <CardDescription>{t('dashboard.currentCropsOverview')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockFarmData.currentCrops.map((crop, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-blue-50 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{crop}</h3>
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('dashboard.growthProgress')}</span>
                      <span className="font-medium">{65 + index * 5}%</span>
                    </div>
                    <Progress value={65 + index * 5} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{t('dashboard.field')} {String.fromCharCode(65 + index)}</span>
                      <span>{2.5 + index * 0.5} {t('dashboard.hectares')}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('dashboard.estHarvest')}: {new Date(Date.now() + (30 - index * 5) * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}