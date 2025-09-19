
import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/lib/auth'
import { isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        message: 'Supabase not configured',
        details: 'Environment variables missing'
      })
    }

    const body = await request.json()
    const { email, password, fullName, role } = body

    // Attempt to register a test user
    const result = await register({
      email,
      password,
      fullName,
      phone: '+1234567890',
      role: role || 'farmer',
      state: 'Test State'
    })

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      details: `User ${email} registered with ID: ${result.id}`
    })

  } catch (error) {
    console.error('Test registration error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({
      success: false,
      message: 'Registration test failed',
      details: errorMessage
    })
  }
}
