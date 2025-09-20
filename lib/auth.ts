import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-development-secret-key-change-in-production')

export interface SessionPayload {
  userId: string
  email: string
  userType: 'farmer' | 'expert' | 'admin'
  exp: number
}

export async function encrypt(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours

  return await new SignJWT({ ...payload, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret)
}

export async function decrypt(session: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, secret, {
      algorithms: ['HS256'],
    })

    return payload as SessionPayload
  } catch (error) {
    console.warn('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error')
    return null
  }
}

// Auth utility functions for server-side operations

// Simple login function (placeholder)
export async function login(email: string, password: string) {
  // This is a placeholder - implement actual login logic
  console.log('Login attempt for:', email)
  return { success: false, error: 'Login not implemented' }
}

// Simple register function (placeholder)
export async function register(email: string, password: string, userData?: any) {
  // This is a placeholder - implement actual registration logic
  console.log('Registration attempt for:', email)
  return { success: false, error: 'Registration not implemented' }
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash)
  } catch (error) {
    console.error('Password verification failed:', error)
    return false
  }
}

export async function createSession(userId: string, email: string, userType: 'farmer' | 'expert' | 'admin') {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const session = await encrypt({ userId, email, userType })

  const cookieStore = cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies()
  const cookie = cookieStore.get('session')

  if (!cookie?.value) {
    return null
  }

  return await decrypt(cookie.value)
}

export async function getUser(): Promise<{ userId: string; email: string; userType: string } | null> {
  const session = await getSession()

  if (!session) {
    return null
  }

  return {
    userId: session.userId,
    email: session.email,
    userType: session.userType
  }
}

export async function getUserFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const sessionCookie = request.cookies.get('session')

  if (!sessionCookie?.value) {
    return null
  }

  return await decrypt(sessionCookie.value)
}

export function deleteSession() {
  const cookieStore = cookies()
  cookieStore.delete('session')
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export function isValidPhone(phone: string): boolean {
  // Indian phone number format
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"']/g, '')
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const attempt = authAttempts.get(identifier)

  if (!attempt) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }

  // Reset if more than 15 minutes have passed
  if (now - attempt.lastAttempt > 15 * 60 * 1000) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }

  // Allow up to 5 attempts per 15 minutes
  if (attempt.count >= 5) {
    return false
  }

  attempt.count++
  attempt.lastAttempt = now
  return true
}

export function clearRateLimit(identifier: string) {
  authAttempts.delete(identifier)
}