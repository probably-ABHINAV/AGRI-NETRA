'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarDays, Eye, Leaf, Target, TrendingUp } from 'lucide-react'
import Image from 'next/image'

interface PestDetection {
  id: string
  image_url: string
  detected_pest?: string
  confidence_score: number
  severity: string
  treatment_recommendation?: string
  created_at: string
  ai_model_version: string
}

export default function PestHistoryPage() {
  const [pestHistory, setPestHistory] = useState<PestDetection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPestHistory()
  }, [])

  const fetchPestHistory = async () => {
    try {
      // Just call the API without headers - let server handle authentication
      const response = await fetch('/api/pest-history')
      const data = await response.json()

      if (data.success) {
        setPestHistory(data.data)
        console.log('✅ Pest history loaded:', data.data.length, 'records');
      } else {
        setError(data.error || 'Failed to fetch history')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      case 'critical': return 'bg-red-200 text-red-900'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pest Detection History</h1>
            <p className="text-muted-foreground">View your previous pest analysis results</p>
          </div>
        </div>

        <div className="grid gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-48 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pest Detection History</h1>
          <p className="text-muted-foreground">View your previous pest analysis results</p>
        </div>
        <Button onClick={fetchPestHistory} variant="outline">
          <Eye className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pestHistory.length === 0 && !loading ? (
        <Card>
          <CardContent className="text-center py-12">
            <Leaf className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pest detections yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by uploading plant images for pest analysis
            </p>
            <Button onClick={() => window.location.href = '/pest-detection'}>
              Start Pest Detection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pestHistory.map((detection) => (
            <Card key={detection.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {detection.detected_pest || 'Healthy Plant'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <CalendarDays className="h-4 w-4" />
                      {new Date(detection.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getSeverityColor(detection.severity)}>
                      {detection.severity.charAt(0).toUpperCase() + detection.severity.slice(1)} Risk
                    </Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span className={getConfidenceColor(detection.confidence_score)}>
                        {Math.round(detection.confidence_score * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    {detection.image_url ? (
                      <div className="relative aspect-square rounded-lg overflow-hidden border">
                        <Image
                          src={detection.image_url}
                          alt="Plant analysis"
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<div class="aspect-square bg-muted rounded-lg flex items-center justify-center"><div class="text-center"><svg class="h-12 w-12 text-muted-foreground mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p class="text-xs text-muted-foreground">Image not available</p></div></div>';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                          <p className="text-xs text-muted-foreground">No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Detection Results</h4>
                      <p className="text-sm text-muted-foreground">
                        {detection.detected_pest ? (
                          `Detected: ${detection.detected_pest}`
                        ) : (
                          'No pests or diseases detected. Plant appears healthy.'
                        )}
                      </p>
                    </div>

                    {detection.treatment_recommendation && (
                      <div>
                        <h4 className="font-semibold mb-2">Treatment Recommendation</h4>
                        <p className="text-sm text-muted-foreground">
                          {detection.treatment_recommendation}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      Analysis powered by {detection.ai_model_version}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}