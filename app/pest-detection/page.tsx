"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Upload,
  ArrowLeft,
  Scan,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  History,
  Zap,
  Bug,
  Leaf,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock detection results
const mockDetectionResult = {
  pest: "Aphids",
  scientificName: "Aphidoidea",
  confidence: 94,
  severity: "Medium",
  affectedArea: "15%",
  cropStage: "Vegetative",
  detectionTime: "2024-01-15T10:30:00Z",
  treatments: [
    {
      type: "Organic",
      name: "Neem Oil Spray",
      description: "Apply 2-3ml neem oil per liter of water",
      effectiveness: 85,
      cost: "₹150/acre",
      duration: "3-5 days",
    },
    {
      type: "Chemical",
      name: "Imidacloprid",
      description: "Apply 0.3ml per liter of water",
      effectiveness: 95,
      cost: "₹300/acre",
      duration: "1-2 days",
    },
    {
      type: "Biological",
      name: "Ladybird Beetles",
      description: "Release beneficial insects",
      effectiveness: 80,
      cost: "₹200/acre",
      duration: "7-10 days",
    },
  ],
  prevention: [
    "Regular monitoring of crop health",
    "Maintain proper plant spacing",
    "Remove infected plant parts",
    "Use yellow sticky traps",
  ],
  riskFactors: ["High humidity levels", "Dense plant canopy", "Previous pest history"],
}

const mockDetectionHistory = [
  {
    id: 1,
    date: "2024-01-15",
    pest: "Aphids",
    crop: "Tomato",
    severity: "Medium",
    confidence: 94,
    status: "Treated",
  },
  {
    id: 2,
    date: "2024-01-12",
    pest: "Leaf Blight",
    crop: "Rice",
    severity: "High",
    confidence: 89,
    status: "Under Treatment",
  },
  {
    id: 3,
    date: "2024-01-10",
    pest: "Whitefly",
    crop: "Cotton",
    severity: "Low",
    confidence: 76,
    status: "Monitored",
  },
]

export default function PestDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [detectionResult, setDetectionResult] = useState<typeof mockDetectionResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string)
      setDetectionResult(null)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleImageUpload(e.dataTransfer.files[0])
      }
    },
    [handleImageUpload],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleImageUpload(e.target.files[0])
      }
    },
    [handleImageUpload],
  )

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setDetectionResult(mockDetectionResult)
    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "treated":
        return "bg-green-100 text-green-800"
      case "under treatment":
        return "bg-blue-100 text-blue-800"
      case "monitored":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pest & Disease Detection</h1>
              <p className="text-gray-600">AI-powered image analysis for crop health monitoring</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <Tabs defaultValue="detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="detection">New Detection</TabsTrigger>
            <TabsTrigger value="history">Detection History</TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-6">
            {/* Image Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Upload Crop Image
                </CardTitle>
                <CardDescription>
                  Take a clear photo of the affected crop area or upload an existing image for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : selectedImage
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-md mx-auto">
                        <Image
                          src={selectedImage || "/placeholder.svg"}
                          alt="Selected crop image"
                          width={400}
                          height={300}
                          className="rounded-lg object-cover w-full h-64"
                        />
                      </div>
                      <div className="flex gap-3 justify-center">
                        <Button onClick={analyzeImage} disabled={isAnalyzing} className="flex items-center gap-2">
                          {isAnalyzing ? (
                            <>
                              <Scan className="h-4 w-4 animate-pulse" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Zap className="h-4 w-4" />
                              Analyze with AI
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null)
                            setDetectionResult(null)
                          }}
                          className="bg-transparent"
                        >
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 mb-2">Upload or drag an image</p>
                        <p className="text-gray-600 mb-4">Supported formats: JPG, PNG, WebP (max 10MB)</p>
                        <div className="flex gap-3 justify-center">
                          <Button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                            <Camera className="h-4 w-4" />
                            Take Photo
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </CardContent>
            </Card>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Scan className="h-8 w-8 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
                      <p className="text-gray-600 mb-4">
                        Our advanced AI models are analyzing your crop image for pests and diseases...
                      </p>
                      <Progress value={75} className="max-w-md mx-auto h-2" />
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detection Results */}
            {detectionResult && !isAnalyzing && (
              <div className="space-y-6">
                {/* Detection Summary */}
                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Bug className="h-6 w-6 text-red-600" />
                          {detectionResult.pest} Detected
                        </CardTitle>
                        <CardDescription className="italic text-base">{detectionResult.scientificName}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-600">Confidence</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {detectionResult.confidence}%
                          </Badge>
                        </div>
                        <Progress value={detectionResult.confidence} className="w-24 h-2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-600">Severity</span>
                        </div>
                        <Badge className={getSeverityColor(detectionResult.severity)}>{detectionResult.severity}</Badge>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">Affected Area</span>
                        </div>
                        <p className="font-bold text-gray-900">{detectionResult.affectedArea}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Leaf className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">Crop Stage</span>
                        </div>
                        <p className="font-bold text-gray-900">{detectionResult.cropStage}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-600">Detected</span>
                        </div>
                        <p className="font-bold text-gray-900">Just now</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatment Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Treatment Recommendations
                    </CardTitle>
                    <CardDescription>AI-suggested treatments ranked by effectiveness</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {detectionResult.treatments.map((treatment, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900">{treatment.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {treatment.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{treatment.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="font-bold text-green-600">{treatment.effectiveness}%</span>
                              </div>
                              <Progress value={treatment.effectiveness} className="w-20 h-2" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Cost: </span>
                              <span className="font-medium">{treatment.cost}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration: </span>
                              <span className="font-medium">{treatment.duration}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Prevention & Risk Factors */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-5 w-5" />
                        Prevention Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {detectionResult.prevention.map((tip, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-red-700">
                        <XCircle className="h-5 w-5" />
                        Risk Factors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {detectionResult.riskFactors.map((factor, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Schedule Treatment
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    Consult Expert
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Detection History
                </CardTitle>
                <CardDescription>Previous pest and disease detections on your farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDetectionHistory.map((detection) => (
                    <div key={detection.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Bug className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{detection.pest}</h4>
                          <p className="text-sm text-gray-600">
                            {detection.crop} • {detection.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(detection.severity)}>{detection.severity}</Badge>
                        <Badge className={getStatusColor(detection.status)}>{detection.status}</Badge>
                        <span className="text-sm text-gray-600">{detection.confidence}%</span>
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
