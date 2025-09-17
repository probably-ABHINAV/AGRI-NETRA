"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface BackendStatus {
  status: string
  timestamp: string
  authentication: string
  database: string
  aiServices: string
  iotServices: string
  realtimeFeatures: string
  apiEndpoints: Record<string, string>
  testCredentials: Record<string, { email: string; password: string }>
}

export default function BackendStatusPage() {
  const [status, setStatus] = useState<BackendStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const checkBackendStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test-backend")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check backend status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkBackendStatus()
  }, [])

  const getStatusIcon = (statusText: string) => {
    return statusText.includes("✅") ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (statusText: string) => {
    return statusText.includes("✅") ? (
      <Badge variant="default" className="bg-green-500">
        Working
      </Badge>
    ) : (
      <Badge variant="destructive">Error</Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Checking backend status...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AgriNetra Backend Status</h1>
        <Button onClick={checkBackendStatus} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {status && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(status.status)}
                Overall Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{status.status}</span>
                <Badge variant="outline">{status.timestamp}</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Authentication
                  {getStatusBadge(status.authentication)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{status.authentication}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Database
                  {getStatusBadge(status.database)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{status.database}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  AI Services
                  {getStatusBadge(status.aiServices)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{status.aiServices}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  IoT Services
                  {getStatusBadge(status.iotServices)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{status.iotServices}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Real-time Features
                  {getStatusBadge(status.realtimeFeatures)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{status.realtimeFeatures}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(status.apiEndpoints).map(([name, endpoint]) => (
                  <div key={name} className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">{name}</span>
                    <code className="text-sm bg-background px-2 py-1 rounded">{endpoint}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(status.testCredentials).map(([role, creds]) => (
                  <div key={role} className="p-3 bg-muted rounded">
                    <h4 className="font-medium capitalize mb-2">{role} Account</h4>
                    <div className="text-sm space-y-1">
                      <div>
                        <strong>Email:</strong> {creds.email}
                      </div>
                      <div>
                        <strong>Password:</strong> {creds.password}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
