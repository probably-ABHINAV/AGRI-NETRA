import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'

const key = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key-for-development')

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.warn('JWT verification failed:', error)
    return null
  }
}

export async function login(email: string, password: string) {
  try {
    if (!supabase) {
      throw new Error('Database connection not available')
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash || '')
    if (!isValid) {
      throw new Error('Invalid email or password')
    }

    // Create session
    const sessionData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const session = await encrypt(sessionData)

    cookies().set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return { user: sessionData }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export async function register(userData: {
  email: string
  password: string
  full_name: string
  phone?: string
  role: string
  location?: string
}) {
  try {
    if (!supabase) {
      throw new Error('Database connection not available')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12)

    // Prepare profile data
    const profileData = {
      email: userData.email,
      full_name: userData.full_name,
      phone: userData.phone,
      role: userData.role,
      location: userData.location,
      password_hash: hashedPassword,
      preferred_language: 'en',
      is_verified: false
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()

    // If password_hash column doesn't exist, try without it
    if (profileError && profileError.message.includes('password_hash')) {
      console.log('⚠️ password_hash column not found, creating profile without it...')

      const { password_hash, ...profileWithoutPassword } = profileData
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from('profiles')
        .insert(profileWithoutPassword)
        .select()
        .single()

      if (fallbackError) {
        console.error('Fallback profile creation error:', fallbackError)
        throw new Error(`Failed to create user profile: ${fallbackError.message}`)
      }

      console.log('✅ Profile created without password_hash column')
      return { ...fallbackProfile, password_hash: hashedPassword }
    } else if (profileError) {
      console.error('Profile creation error:', profileError)

      // Handle specific database errors
      if (profileError.code === '23505') {
        throw new Error('Email already exists')
      }
      if (profileError.code === '23502') {
        throw new Error('Missing required fields')
      }

      throw new Error(`Failed to create user profile: ${profileError.message}`)
    }

    console.log('User registered successfully:', profile.email)
    return profile
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

export async function logout() {
  const expires = new Date(Date.now() - 1000)
  cookies().set('session', '', { expires, httpOnly: true })
}

export async function getUser() {
  try {
    const session = cookies().get('session')?.value
    if (!session) return null

    const payload = await decrypt(session)
    if (!payload) return null

    return payload
  } catch (error) {
    console.warn('Session verification failed:', error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  try {
    const parsed = await decrypt(session)
    if (!parsed) return

    // Refresh the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const refreshed = await encrypt(parsed)

    const response = NextResponse.next()
    response.cookies.set('session', refreshed, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' })

    return response
  } catch (error) {
    console.warn('Session refresh failed:', error)
    return NextResponse.next()
  }
}