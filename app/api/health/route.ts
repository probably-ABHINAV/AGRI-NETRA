
import { NextResponse } from 'next/server'
import { testDatabaseConnection } from '@/lib/database'

export async function GET() {
  try {
    const dbStatus = await testDatabaseConnection()
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      database: dbStatus.connected ? 'connected' : 'disconnected',
      environment: process.env.NODE_ENV || 'development'
    }

    // If critical services are down, return 503
    if (!dbStatus.connected && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { ...health, status: 'unhealthy', error: dbStatus.error },
        { status: 503 }
      )
    }

    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}
