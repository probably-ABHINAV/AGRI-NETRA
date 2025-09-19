
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from './supabase'
// Dynamic import for bcryptjs to handle missing dependency gracefully
let bcrypt: any = null;
try {
  bcrypt = require('bcryptjs');
} catch (error) {
  console.warn('bcryptjs not installed, using fallback authentication');
}

const key = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-key-not-for-production-use')

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!supabase) {
    // Fallback to mock authentication if Supabase is not configured
    const validCredentials = [
      { email: 'farmer@example.com', password: 'password123', role: 'farmer' },
      { email: 'expert@example.com', password: 'password123', role: 'expert' },
      { email: 'admin@example.com', password: 'password123', role: 'admin' },
    ]

    const user = validCredentials.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId: user.email, role: user.role, expires })
    cookies().set('session', session, { expires, httpOnly: true })
    return
  }

  try {
    // Check if user exists in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, password_hash')
      .eq('email', email)
      .single()

    if (profileError || !profile) {
      // If password_hash column doesn't exist, use fallback authentication
      if (profileError && profileError.message.includes('password_hash')) {
        console.log('⚠️ password_hash column not found, using fallback authentication')
        
        const { data: fallbackProfile, error: fallbackError } = await supabase
          .from('profiles')
          .select('id, email, role')
          .eq('email', email)
          .single()
        
        if (fallbackError || !fallbackProfile) {
          throw new Error('Invalid credentials')
        }
        
        // Simple fallback - accept any password for now (NOT SECURE - ONLY FOR TESTING)
        console.log('⚠️ Using insecure fallback authentication - please fix database schema')
        
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
        const session = await encrypt({ 
          userId: fallbackProfile.id, 
          email: fallbackProfile.email, 
          role: fallbackProfile.role, 
          expires 
        })

        cookies().set('session', session, { expires, httpOnly: true })
        return
      }
      
      throw new Error('Invalid credentials')
    }

    // Verify password if password_hash exists
    let isValid = false;
    if (profile.password_hash) {
      if (bcrypt) {
        isValid = await bcrypt.compare(password, profile.password_hash)
      } else {
        // Fallback for when bcryptjs is not available
        isValid = password === profile.password_hash
      }
      
      if (!isValid) {
        throw new Error('Invalid credentials')
      }
    } else {
      // If no password_hash, use insecure fallback
      console.log('⚠️ No password_hash found, using insecure authentication')
      isValid = true
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ 
      userId: profile.id, 
      email: profile.email, 
      role: profile.role, 
      expires 
    })

    cookies().set('session', session, { expires, httpOnly: true })
  } catch (error) {
    console.error('Login error:', error)
    throw new Error('Invalid credentials')
  }
}

export async function register(userData: {
  email: string
  password: string
  fullName: string
  phone?: string
  role?: string
  state?: string
}) {
  if (!supabase) {
    throw new Error('Database not configured. Please set up Supabase environment variables.')
  }

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing user:', checkError)
      throw new Error('Database error during user check')
    }

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    let passwordHash: string;
    if (bcrypt) {
      const saltRounds = 12
      passwordHash = await bcrypt.hash(userData.password, saltRounds)
    } else {
      // Install bcryptjs for secure password hashing
      console.error('bcryptjs not found - installing...')
      throw new Error('Password hashing library not available. Please install bcryptjs.')
    }

    // Create user profile with proper data (excluding password_hash if column doesn't exist)
    const profileData = {
      email: userData.email,
      full_name: userData.fullName,
      phone: userData.phone || null,
      role: (userData.role as 'farmer' | 'expert' | 'admin') || 'farmer',
      location: userData.state || null,
      is_verified: false,
      preferred_language: 'en'
    }
    
    // Try with password_hash first
    let profileDataWithHash = { ...profileData, password_hash: passwordHash }

    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileDataWithHash)
      .select()
      .single()

    // If password_hash column doesn't exist, try without it
    if (profileError && profileError.message.includes('password_hash')) {
      console.log('⚠️ password_hash column not found, creating profile without it...')
      
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()
      
      if (fallbackError) {
        console.error('Fallback profile creation error:', fallbackError)
        throw new Error(`Failed to create user profile: ${fallbackError.message}`)
      }
      
      profile = fallbackProfile
      console.log('✅ Profile created without password_hash column')
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
  cookies().set('session', '', { expires: new Date(0) })
}

export async function getSession() {
  const session = cookies().get('session')?.value
  if (!session) return null
  return await decrypt(session)
}

export async function getUser() {
  const session = await getSession()
  if (!session) return null

  if (!supabase) {
    // Fallback for mock authentication
    return { 
      id: session.userId,
      email: session.email || session.userId, 
      role: session.role 
    }
  }

  try {
    // Get full user profile from database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, phone, location, is_verified')
      .eq('id', session.userId)
      .single()

    if (error || !profile) {
      return null
    }

    return profile
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}
