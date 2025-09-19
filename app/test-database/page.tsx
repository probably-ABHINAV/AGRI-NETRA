
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Database, Users, Key, Server } from "lucide-react"

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  details?: string
}

export default function DatabaseTestPage() {
  const [tests, setTests] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const testResults: TestResult[] = []

    // Test 1: Environment Variables
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    testResults.push({
      name: 'Environment Variables',
      status: hasSupabaseUrl && hasSupabaseKey ? 'success' : 'error',
      message: hasSupabaseUrl && hasSupabaseKey 
        ? 'Supabase credentials found' 
        : 'Missing Supabase environment variables',
      details: `URL: ${hasSupabaseUrl ? '✓' : '✗'}, Key: ${hasSupabaseKey ? '✓' : '✗'}`
    })

    // Test 2: Supabase Connection
    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      
      testResults.push({
        name: 'Supabase Connection',
        status: data.success ? 'success' : 'error',
        message: data.message,
        details: data.details || data.error
      })
    } catch (error) {
      testResults.push({
        name: 'Supabase Connection',
        status: 'error',
        message: 'Failed to test connection',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Test 3: User Registration Test
    try {
      const testEmail = `test_${Date.now()}@example.com`
      const registerResponse = await fetch('/api/test-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'testpass123',
          fullName: 'Test User',
          role: 'farmer'
        })
      })
      
      const registerData = await registerResponse.json()
      
      testResults.push({
        name: 'User Registration',
        status: registerData.success ? 'success' : 'warning',
        message: registerData.message || 'Registration test completed',
        details: registerData.details
      })
    } catch (error) {
      testResults.push({
        name: 'User Registration',
        status: 'error',
        message: 'Registration test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    setTests(testResults)
    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={colors[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Database Connection Tests</h1>
        <p className="text-gray-600">
          Verify your Supabase configuration and database connectivity
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Test Results
            </CardTitle>
            <CardDescription>
              Comprehensive tests to verify your database setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">
                {tests.length} tests completed
              </span>
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                size="sm"
              >
                {isRunning ? 'Running Tests...' : 'Run Tests Again'}
              </Button>
            </div>

            <div className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{test.name}</h3>
                      {getStatusBadge(test.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{test.message}</p>
                    {test.details && (
                      <p className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded">
                        {test.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Environment Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Required Environment Variables:</h4>
              <div className="space-y-2 text-sm font-mono bg-gray-50 p-3 rounded">
                <div>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
                <div>JWT_SECRET=your_secure_random_string</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">How to get Supabase credentials:</h4>
              <ol className="text-sm space-y-1 list-decimal list-inside text-gray-600">
                <li>Go to your Supabase project dashboard</li>
                <li>Navigate to Settings → API</li>
                <li>Copy the Project URL and anon/public key</li>
                <li>Add them to your environment variables in Replit</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
