"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Sprout,
  Brain,
  TrendingUp,
  Droplets,
  DollarSign,
  Calendar,
  MapPin,
  Lightbulb,
  ArrowLeft,
  RefreshCw,
  Download,
  Star,
} from "lucide-react"
import Link from "next/link"

// Mock AI recommendation data
const mockRecommendations = [
  {
    id: 1,
    crop: "Rice",
    scientificName: "Oryza sativa",
    category: "cereals",
    confidence: 92,
    expectedYield: "4.5-5.2 tons/ha",
    profitability: "High",
    season: "Kharif",
    duration: "120 days",
    waterRequirement: "High",
    reasons: [
      "Optimal soil moisture levels detected",
      "Favorable monsoon forecast",
      "High market demand in your region",
      "Suitable soil pH (6.2) for rice cultivation",
    ],
    pros: ["High yield potential", "Established market", "Government support schemes"],
    cons: ["High water requirement", "Pest susceptibility during monsoon"],
    marketPrice: "₹2,100/quintal",
    investment: "₹35,000/ha",
    roi: "65%",
    riskLevel: "Medium",
  },
  {
    id: 2,
    crop: "Maize",
    scientificName: "Zea mays",
    category: "cereals",
    confidence: 88,
    expectedYield: "6.0-7.5 tons/ha",
    profitability: "High",
    season: "Kharif",
    duration: "90 days",
    waterRequirement: "Medium",
    reasons: [
      "Excellent soil drainage in your fields",
      "Moderate water requirement suits current conditions",
      "Growing demand for animal feed",
      "Shorter crop cycle allows double cropping",
    ],
    pros: ["Quick harvest", "Multiple uses", "Lower water requirement"],
    cons: ["Price volatility", "Storage challenges"],
    marketPrice: "₹1,850/quintal",
    investment: "₹28,000/ha",
    roi: "72%",
    riskLevel: "Low",
  },
  {
    id: 3,
    crop: "Sugarcane",
    scientificName: "Saccharum officinarum",
    category: "cash_crops",
    confidence: 75,
    expectedYield: "70-85 tons/ha",
    profitability: "Very High",
    season: "Year-round",
    duration: "365 days",
    waterRequirement: "Very High",
    reasons: [
      "High profitability potential",
      "Long-term crop reduces replanting costs",
      "Sugar mill contracts available",
      "Government incentives for sugarcane",
    ],
    pros: ["Very high returns", "Long-term crop", "Guaranteed purchase"],
    cons: ["Very high water requirement", "Long investment cycle"],
    marketPrice: "₹350/quintal",
    investment: "₹45,000/ha",
    roi: "85%",
    riskLevel: "High",
  },
]

const mockFarmProfile = {
  location: "Pune, Maharashtra",
  soilType: "Black Cotton Soil",
  farmSize: 25.5,
  irrigationType: "Drip + Sprinkler",
  previousCrops: ["Wheat", "Onion", "Tomato"],
  soilHealth: {
    ph: 6.2,
    nitrogen: 32,
    phosphorus: 18,
    potassium: 245,
    organicMatter: 2.1,
  },
}

export default function CropRecommendationsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState("kharif")
  const [selectedField, setSelectedField] = useState("field-a")
  const [customRequirements, setCustomRequirements] = useState("")

  const generateRecommendations = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability.toLowerCase()) {
      case "very high":
        return "text-green-700"
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-gray-600"
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
              <h1 className="text-2xl font-bold text-gray-900">AI Crop Recommendations</h1>
              <p className="text-gray-600">Get personalized crop suggestions powered by artificial intelligence</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Farm Profile Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Farm Profile Summary
            </CardTitle>
            <CardDescription>Current farm conditions used for AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Location & Soil</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📍 {mockFarmProfile.location}</p>
                  <p>🌱 {mockFarmProfile.soilType}</p>
                  <p>📏 {mockFarmProfile.farmSize} hectares</p>
                  <p>💧 {mockFarmProfile.irrigationType}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Soil Health</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>pH: {mockFarmProfile.soilHealth.ph}</p>
                  <p>N: {mockFarmProfile.soilHealth.nitrogen} ppm</p>
                  <p>P: {mockFarmProfile.soilHealth.phosphorus} ppm</p>
                  <p>K: {mockFarmProfile.soilHealth.potassium} ppm</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Previous Crops</h4>
                <div className="flex flex-wrap gap-1">
                  {mockFarmProfile.previousCrops.map((crop, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {crop}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Ready for recommendations</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Parameters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customize Your Recommendations</CardTitle>
            <CardDescription>Adjust parameters to get more targeted suggestions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="season">Growing Season</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                    <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                    <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                    <SelectItem value="year-round">Year Round</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field">Target Field</Label>
                <Select value={selectedField} onValueChange={setSelectedField}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="field-a">Field A (5.2 ha)</SelectItem>
                    <SelectItem value="field-b">Field B (8.1 ha)</SelectItem>
                    <SelectItem value="field-c">Field C (6.8 ha)</SelectItem>
                    <SelectItem value="all-fields">All Fields</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue="profitability">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="profitability">Maximum Profit</SelectItem>
                    <SelectItem value="yield">Maximum Yield</SelectItem>
                    <SelectItem value="sustainability">Sustainability</SelectItem>
                    <SelectItem value="risk">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="requirements">Additional Requirements (Optional)</Label>
              <Textarea
                id="requirements"
                placeholder="e.g., organic farming, specific market contracts, water conservation..."
                value={customRequirements}
                onChange={(e) => setCustomRequirements(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={generateRecommendations} disabled={isGenerating} className="flex items-center gap-2">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Generate AI Recommendations
                  </>
                )}
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        {!isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recommended Crops for {selectedSeason} Season</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>

            {mockRecommendations.map((recommendation, index) => (
              <Card key={recommendation.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Sprout className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{recommendation.crop}</CardTitle>
                        <CardDescription className="italic">{recommendation.scientificName}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">Confidence Score</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {recommendation.confidence}%
                        </Badge>
                      </div>
                      <Progress value={recommendation.confidence} className="w-24 h-2" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-600">Expected Yield</span>
                      </div>
                      <p className="font-bold text-gray-900">{recommendation.expectedYield}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Profitability</span>
                      </div>
                      <p className={`font-bold ${getProfitabilityColor(recommendation.profitability)}`}>
                        {recommendation.profitability}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-600">Duration</span>
                      </div>
                      <p className="font-bold text-gray-900">{recommendation.duration}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-600">Water Need</span>
                      </div>
                      <p className="font-bold text-gray-900">{recommendation.waterRequirement}</p>
                    </div>
                  </div>

                  {/* Financial Analysis */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Market Price</h4>
                      <p className="text-2xl font-bold text-green-600">{recommendation.marketPrice}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Investment Required</h4>
                      <p className="text-2xl font-bold text-blue-600">{recommendation.investment}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Expected ROI
                        <Badge className={getRiskColor(recommendation.riskLevel)}>
                          {recommendation.riskLevel} Risk
                        </Badge>
                      </h4>
                      <p className="text-2xl font-bold text-purple-600">{recommendation.roi}</p>
                    </div>
                  </div>

                  {/* AI Reasoning */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      Why AI Recommends This Crop
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2">
                        {recommendation.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-3">Advantages</h4>
                      <ul className="space-y-2">
                        {recommendation.pros.map((pro, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-3">Considerations</h4>
                      <ul className="space-y-2">
                        {recommendation.cons.map((con, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button className="flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Select This Crop
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      View Detailed Plan
                    </Button>
                    <Button variant="outline" className="bg-transparent">
                      Compare with Others
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI is Analyzing Your Farm</h3>
                <p className="text-gray-600 mb-4">
                  Processing soil data, weather patterns, market trends, and regional factors...
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
