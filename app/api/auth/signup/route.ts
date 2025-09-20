
import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, phone, role, state } = body

    console.log('🔍 Signup API attempt:', { email, name, phone, role, state })

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('✅ Calling register function via API...')
    
    const user = await register({
      email,
      password,
      full_name: name,
      phone,
      role,
      location: state
    })

    console.log('✅ Registration successful via API:', user)

    return NextResponse.redirect(new URL('/auth/login?message=Registration successful', request.url))
  } catch (error) {
    console.error('Registration error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    return NextResponse.redirect(new URL(`/auth/signup?error=${encodeURIComponent(errorMessage)}`, request.url))
  }
}
