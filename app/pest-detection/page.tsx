"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Camera, Upload, ArrowLeft, Scan, AlertTriangle, History, Zap, Bug, Shield, Star, Leaf, RefreshCw, Eye
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast" // Assuming useToast is available

const mockDetectionHistory = [
  { id: 1, date: "2024-01-15", pest: "Aphids", crop: "Tomato", severity: "Medium", status: "Treated" },
  { id: 2, date: "2024-01-12", pest: "Leaf Blight", crop: "Rice", severity: "High", status: "Under Treatment" },
];

export default function PestDetectionPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast() // Initialize toast

  // Mock state variables that might be used in the original handleSubmit
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<string | null>(null); // Assuming this state exists
  const [result, setResult] = useState<string>(''); // Assuming this state exists

  const handleImageUpload = useCallback((file: File) => {
    setImageFile(file);
    setSelectedFile(file); // Also update selectedFile
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
  }, [handleImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleImageUpload(e.target.files[0]);
  }, [handleImageUpload]);

  const analyzeImage = async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      // Call API without user ID header - let server generate UUID
      const response = await fetch('/api/pest-detection', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze image.');
      }

      setAnalysisResult(data.analysis);
      // Show success message using toast
      toast({
        title: "Analysis Complete",
        description: "Pest detection analysis has been completed successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      // Show error message using toast
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // This is the function that was provided in the changes,
  // but the original code did not contain it.
  // Based on the user's intent, we are providing a placeholder
  // for it if it were to be used in a different context.
  // However, the primary fix is within the `analyzeImage` function.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setError('Please select an image.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResult('') // Clear previous result

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)
      if (selectedFarm) {
        formData.append('farmId', selectedFarm)
      }

      // Call API without user ID header - let server generate UUID
      const response = await fetch('/api/pest-detection', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const data = await response.json()
      setResult(data.analysis || 'No analysis available')

      // Show success message
      toast({
        title: "Analysis Complete",
        description: "Pest detection analysis has been completed successfully.",
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "treated": return "bg-green-100 text-green-800";
      case "under treatment": return "bg-blue-100 text-blue-800";
      case "monitored": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild><Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pest & Disease Detection</h1>
            <p className="text-gray-600">AI-powered image analysis for crop health monitoring</p>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5" />Upload Crop Image</CardTitle>
                <CardDescription>Take a clear photo or upload an image for AI analysis.</CardDescription>
              </CardHeader>
              <CardContent onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Upload className="h-8 w-8 text-gray-400" /></div>
                            <p className="text-lg font-medium text-gray-900 mb-2">Drag & drop or click to upload</p>
                            <p className="text-gray-600 mb-4">JPG, PNG, WebP (max 10MB)</p>
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full"><Upload className="h-4 w-4 mr-2" />Choose File</Button>
                        </div>
                    </div>
                    {imagePreview && (
                      <div className="space-y-4">
                        <p className="font-medium text-center">Image Preview</p>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                          <Image src={imagePreview} alt="Selected crop" layout="fill" className="object-cover" />
                        </div>
                        <Button onClick={analyzeImage} disabled={isAnalyzing || !imageFile} className="w-full">
                          {isAnalyzing ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Analyzing...</> : <><Zap className="h-4 w-4 mr-2" />Analyze with AI</>}
                        </Button>
                      </div>
                    )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </CardContent>
            </Card>

            {isAnalyzing && (<Card><CardContent className="py-12 text-center"><Zap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" /><h3 className="text-lg font-semibold">AI is analyzing your crop...</h3><p className="text-muted-foreground">This may take a few moments.</p></CardContent></Card>)}
            {error && (<Card className="border-red-500 bg-red-50"><CardContent className="py-6 text-center text-red-700"><AlertTriangle className="h-8 w-8 mx-auto mb-2" /><h3 className="font-semibold">Analysis Failed</h3><p className="text-sm">{error}</p></CardContent></Card>)}
            {analysisResult && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Star className="h-5 w-5 text-yellow-500"/> AI Analysis Complete</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none prose-headings:font-semibold prose-h3:text-lg prose-h4:font-medium prose-ul:list-disc prose-li:ml-4">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysisResult}</ReactMarkdown>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Detection History</CardTitle>
                <CardDescription>Previous pest and disease detections on your farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDetectionHistory.map((detection) => (
                    <div key={detection.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><Bug className="h-5 w-5 text-red-600" /></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{detection.pest}</h4>
                          <p className="text-sm text-gray-600">{detection.crop} • {detection.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(detection.status)}>{detection.status}</Badge>
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

// Dummy Badge component for compilation, assuming it exists in @/components/ui/badge
function Badge(props: { className?: string; children: React.ReactNode }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${props.className}`}>{props.children}</span>;
}