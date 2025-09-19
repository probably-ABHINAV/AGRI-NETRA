
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

const key = new TextEncoder().encode('your-secret-key-change-this-in-production')

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
      throw new Error('Invalid credentials')
    }

    // Verify password
    let isValid = false;
    if (bcrypt) {
      isValid = await bcrypt.compare(password, profile.password_hash)
    } else {
      // Fallback for when bcryptjs is not available
      isValid = password === profile.password_hash
    }
    
    if (!isValid) {
      throw new Error('Invalid credentials')
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
    throw new Error('Database not configured')
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', userData.email)
      .single()

    if (existingUser) {
      throw new Error('User already exists')
    }

    // Hash password
    let passwordHash: string;
    if (bcrypt) {
      const saltRounds = 10
      passwordHash = await bcrypt.hash(userData.password, saltRounds)
    } else {
      // Fallback for when bcryptjs is not available (NOT SECURE - for development only)
      passwordHash = userData.password
      console.warn('Using insecure password storage - install bcryptjs for production')
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        email: userData.email,
        full_name: userData.fullName,
        phone: userData.phone,
        role: (userData.role as 'farmer' | 'expert' | 'admin') || 'farmer',
        location: userData.state,
        password_hash: passwordHash,
        is_verified: false
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      throw new Error('Failed to create user profile')
    }

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
