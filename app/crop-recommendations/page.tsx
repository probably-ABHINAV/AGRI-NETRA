"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain, Lightbulb, MapPin, ArrowLeft, RefreshCw, Star, AlertTriangle
} from "lucide-react"
import Link from "next/link"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const mockFarmProfile = {
  location: "Pune, Maharashtra",
  soilType: "Black Cotton Soil",
  farmSize: 25.5,
  irrigationType: "Drip + Sprinkler",
  previousCrops: ["Wheat", "Onion", "Tomato"],
  soilHealth: {
    ph: 6.2, nitrogen: 32, phosphorus: 18, potassium: 245, organicMatter: 2.1,
  },
}

export default function CropRecommendationsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState("kharif")
  const [selectedField, setSelectedField] = useState("field-a")
  const [selectedPriority, setSelectedPriority] = useState("profitability")
  const [customRequirements, setCustomRequirements] = useState("")

  const generateRecommendations = async () => {
    setIsGenerating(true)
    setError(null)
    setRecommendations(null)

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmProfile: mockFarmProfile,
          season: selectedSeason,
          field: selectedField,
          priority: selectedPriority,
          customRequirements,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      const data = await response.json()
      setRecommendations(data.recommendations)

    } catch (err) {
      setError("Failed to generate recommendations. Please try again later.")
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Crop Recommendations</h1>
              <p className="text-gray-600">Personalized crop suggestions powered by Gemini AI</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Farm Profile Summary</CardTitle>
            <CardDescription>Current farm conditions used for AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
              <div><h4 className="font-semibold mb-2">Location & Soil</h4><p>📍 {mockFarmProfile.location}</p><p>🌱 {mockFarmProfile.soilType}</p></div>
              <div><h4 className="font-semibold mb-2">Farm Size</h4><p>📏 {mockFarmProfile.farmSize} hectares</p><p>💧 {mockFarmProfile.irrigationType}</p></div>
              <div><h4 className="font-semibold mb-2">Soil Health (pH)</h4><p>{mockFarmProfile.soilHealth.ph}</p></div>
              <div><h4 className="font-semibold mb-2">Previous Crops</h4><div className="flex flex-wrap gap-1">{mockFarmProfile.previousCrops.map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customize Your Recommendations</CardTitle>
            <CardDescription>Adjust these parameters to get more targeted suggestions from the AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="season">Growing Season</Label>
                <Select value={selectedSeason} onValueChange={setSelectedSeason}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="kharif">Kharif (Monsoon)</SelectItem><SelectItem value="rabi">Rabi (Winter)</SelectItem><SelectItem value="zaid">Zaid (Summer)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="field">Target Field</Label>
                <Select value={selectedField} onValueChange={setSelectedField}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="field-a">Field A (5.2 ha)</SelectItem><SelectItem value="field-b">Field B (8.1 ha)</SelectItem><SelectItem value="all-fields">All Fields</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="profitability">Maximum Profit</SelectItem><SelectItem value="yield">Maximum Yield</SelectItem><SelectItem value="sustainability">Sustainability</SelectItem><SelectItem value="risk">Low Risk</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="requirements">Additional Requirements (Optional)</Label>
              <Textarea id="requirements" placeholder="e.g., organic farming, specific market contracts, water conservation..." value={customRequirements} onChange={(e) => setCustomRequirements(e.target.value)} rows={2} />
            </div>
            <Button onClick={generateRecommendations} disabled={isGenerating}>
              {isGenerating ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Brain className="h-4 w-4 mr-2" />Generate AI Recommendations</>}
            </Button>
          </CardContent>
        </Card>
        
        {isGenerating && (
            <Card>
                <CardContent className="py-12 text-center">
                    <Brain className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold">AI is analyzing your farm...</h3>
                    <p className="text-muted-foreground">This may take a few moments.</p>
                </CardContent>
            </Card>
        )}
        
        {error && (
            <Card className="border-red-500 bg-red-50">
                <CardContent className="py-6 text-center text-red-700">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <h3 className="font-semibold">An Error Occurred</h3>
                    <p className="text-sm">{error}</p>
                </CardContent>
            </Card>
        )}

        {recommendations && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500"/> Your Gemini AI-Powered Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none prose-headings:font-semibold prose-h3:text-lg prose-h4:font-medium">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendations}</ReactMarkdown>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}