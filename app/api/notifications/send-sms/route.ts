import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'
import twilio from 'twilio'

// Validate required environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER

// Rate limiting (simple in-memory store for demo - use Redis for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX = 5 // max 5 SMS per minute per user

function validateEnvironment() {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    throw new Error('Missing required Twilio environment variables')
  }
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return false
  }

  userLimit.count++
  return true
}

function sanitizeInput(input: string): string {
  // Remove or escape potentially dangerous characters for SMS content
  return input.replace(/[<>'"]/g, '').substring(0, 100)
}

function createNotificationMessage(type: string, data: any, farmName: string): string {
  const safeData = {
    farmName: sanitizeInput(farmName),
    fieldName: sanitizeInput(data.fieldName || 'Field'),
    pestType: sanitizeInput(data.pestType || 'Unknown Pest'),
    severity: sanitizeInput(data.severity || 'medium'),
    weatherCondition: sanitizeInput(data.weatherCondition || 'Severe Weather'),
    taskTitle: sanitizeInput(data.taskTitle || 'Farm Task'),
    dueDate: sanitizeInput(data.dueDate || 'Soon')
  }

  switch (type) {
    case 'irrigation':
      return `🌾 IRRIGATION ALERT: ${safeData.fieldName} at ${safeData.farmName} needs watering. Soil moisture is low. Check your farm immediately.`
    case 'pest':
      return `🐛 PEST ALERT: ${safeData.pestType} detected at ${safeData.farmName}. Severity: ${safeData.severity}. Take immediate action to prevent crop damage.`
    case 'weather':
      return `🌦️ WEATHER ALERT: ${safeData.weatherCondition} expected at ${safeData.farmName}. Protect your crops and equipment.`
    case 'task':
      return `📋 TASK REMINDER: '${safeData.taskTitle}' is due on ${safeData.dueDate}. Don't forget to complete this farm activity.`
    default:
      return `📱 AgriNetra: Update about your farm ${safeData.farmName}.`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    validateEnvironment()

    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check rate limiting
    if (!checkRateLimit(user.email)) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 })
    }

    const body = await request.json()
    const { type, data } = body

    // Validate input
    if (!type || !data) {
      return NextResponse.json({ error: 'Missing notification type or data' }, { status: 400 })
    }

    const allowedTypes = ['irrigation', 'pest', 'weather', 'task']
    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
    }

    const supabase = createClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 })
    }

    // Get user profile with phone number
    const { data: profile } = await supabase
      .from('profiles')
      .select('phone, full_name')
      .eq('email', user.email)
      .single()

    if (!profile || !profile.phone) {
      return NextResponse.json({ error: 'Phone number not found in profile' }, { status: 400 })
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(profile.phone)) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    // Initialize Twilio client
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

    // Create message content
    const messageBody = createNotificationMessage(type, data, data.farmName || 'Your Farm')

    // Send SMS
    const message = await client.messages.create({
      body: messageBody,
      from: TWILIO_PHONE_NUMBER,
      to: profile.phone
    })

    // Log the notification (for audit purposes)
    console.log(`SMS sent successfully: SID ${message.sid} to ${profile.phone}`)

    // Optionally store notification in database
    await supabase.from('alerts').insert({
      user_id: user.email,
      alert_type: type,
      message: messageBody,
      phone_number: profile.phone,
      twilio_sid: message.sid,
      sent_at: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'SMS notification sent successfully',
      sid: message.sid
    })

  } catch (error: any) {
    console.error('Error sending SMS notification:', error)
    
    // Handle specific Twilio errors
    if (error.code === 21211) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    } else if (error.code === 21408) {
      return NextResponse.json({ error: 'Permission denied for phone number' }, { status: 403 })
    }
    
    return NextResponse.json({ error: 'Failed to send SMS notification' }, { status: 500 })
  }
}