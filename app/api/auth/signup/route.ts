
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { hashPassword, createSession, isValidEmail, isValidPassword, isValidPhone, sanitizeInput, checkRateLimit } from '@/lib/auth'
import { createProfile } from '@/lib/database'
import { z } from 'zod'

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  location: z.string().optional(),
  userType: z.enum(['farmer', 'expert', 'admin']).default('farmer')
})

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { success: false, error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    
    // Validate input
    const validationResult = signupSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input data',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const { name, email, password, phone, location, userType } = validationResult.data

    // Additional validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
        },
        { status: 400 }
      )
    }

    if (phone && !isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name)
    const sanitizedLocation = location ? sanitizeInput(location) : undefined

    // Hash password (for real implementation)
    // const hashedPassword = await hashPassword(password)

    // Create user profile
    const profile = await createProfile({
      name: sanitizedName,
      email: email.toLowerCase().trim(),
      phone: phone?.trim(),
      location: sanitizedLocation,
      user_type: userType
    })

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Create session
    await createSession(profile.id, profile.email, profile.user_type)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        userType: profile.user_type
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
