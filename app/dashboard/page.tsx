"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Settings,
  Bell,
  Plus,
} from "lucide-react"
import Link from "next/link"

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
    { id: 1, type: "warning", message: "Soil moisture low in Field A", time: "2 hours ago" },
    { id: 2, type: "info", message: "Weather alert: Heavy rain expected", time: "4 hours ago" },
    { id: 3, type: "success", message: "Irrigation completed in Field B", time: "6 hours ago" },
  ],
}

const mockSensorData = [
  { name: "Soil Moisture", value: 45, unit: "%", status: "low", trend: "down" },
  { name: "Temperature", value: 28, unit: "°C", status: "normal", trend: "up" },
  { name: "pH Level", value: 6.8, unit: "pH", status: "normal", trend: "stable" },
  { name: "Nitrogen", value: 32, unit: "ppm", status: "high", trend: "up" },
]

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
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
        return "text-red-600 bg-red-50"
      case "high":
        return "text-orange-600 bg-orange-50"
      case "normal":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sprout className="h-8 w-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">AgriNetra</span>
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                {currentTime.toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                , {currentTime.toLocaleTimeString("en-IN", { hour12: true })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                  3
                </Badge>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Here's what's happening on your farm today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Farm Area</p>
                  <p className="text-2xl font-bold text-gray-900">{mockFarmData.totalArea} ha</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Fields</p>
                  <p className="text-2xl font-bold text-gray-900">{mockFarmData.activeFields}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sensors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockFarmData.sensors.active}/{mockFarmData.sensors.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Crops</p>
                  <p className="text-2xl font-bold text-gray-900">{mockFarmData.currentCrops.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Sprout className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Weather Conditions
              </CardTitle>
              <CardDescription>Current weather and 5-day forecast for your location</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Current Weather */}
              <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(mockWeatherData.current.condition)}
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{mockWeatherData.current.temperature}°C</p>
                    <p className="text-gray-600">{mockWeatherData.current.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      {mockWeatherData.current.humidity}%
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="h-4 w-4" />
                      {mockWeatherData.current.windSpeed} km/h
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast */}
              <div className="grid grid-cols-5 gap-2">
                {mockWeatherData.forecast.map((day, index) => (
                  <div key={index} className="text-center p-3 rounded-lg hover:bg-gray-50">
                    <p className="text-sm font-medium text-gray-900 mb-2">{day.day}</p>
                    {getWeatherIcon(day.condition)}
                    <p className="text-sm text-gray-600 mt-2">
                      {day.high}°/{day.low}°
                    </p>
                    <p className="text-xs text-blue-600">{day.rain}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>Important notifications from your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFarmData.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === "warning"
                          ? "bg-yellow-500"
                          : alert.type === "info"
                            ? "bg-blue-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View All Alerts
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Sensor Readings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Sensor Data
              </CardTitle>
              <CardDescription>Real-time readings from your IoT sensors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSensorData.map((sensor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{sensor.name}</span>
                        {getTrendIcon(sensor.trend)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gray-900">
                        {sensor.value} {sensor.unit}
                      </span>
                      <Badge className={getStatusColor(sensor.status)}>{sensor.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent">
                View Detailed Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                  <Link href="/crop-recommendations">
                    <Sprout className="h-6 w-6" />
                    <span className="text-sm">Crop Recommendations</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                  <Link href="/pest-detection">
                    <Camera className="h-6 w-6" />
                    <span className="text-sm">Pest Detection</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                  <Link href="/expert-chat">
                    <MessageSquare className="h-6 w-6" />
                    <span className="text-sm">Expert Chat</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent" asChild>
                  <Link href="/analytics">
                    <BarChart3 className="h-6 w-6" />
                    <span className="text-sm">Analytics</span>
                  </Link>
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button className="w-full" asChild>
                  <Link href="/farms/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Field
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Crops Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Current Crops Overview</CardTitle>
            <CardDescription>Status of crops currently growing on your farm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockFarmData.currentCrops.map((crop, index) => (
                <div key={index} className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{crop}</h3>
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Growth Progress</span>
                      <span className="font-medium">{65 + index * 5}%</span>
                    </div>
                    <Progress value={65 + index * 5} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Field {String.fromCharCode(65 + index)}</span>
                      <span>{2.5 + index * 0.5} ha</span>
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
