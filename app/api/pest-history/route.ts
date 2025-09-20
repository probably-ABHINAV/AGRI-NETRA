import { NextRequest, NextResponse } from 'next/server'
import { getUser as getAuthenticatedUser } from '@/lib/auth' // Renamed to avoid conflict
import { db } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user with fallback
    let userId: string;

    try {
      const user = await getAuthenticatedUser(request)
      if (user) {
        userId = user.id
      } else {
        // Generate a proper UUID for development
        userId = crypto.randomUUID()
        console.warn('Using generated UUID for pest history:', userId)
      }
    } catch (authError) {
      // Use generated UUID for development
      userId = crypto.randomUUID()
      console.warn('Using generated UUID for pest history due to auth error')
    }

    // Get pest detection history for user
    const detections = await db.getUserPestDetections(userId)

    return NextResponse.json({
      success: true,
      data: detections,
      count: detections.length
    })
  } catch (error) {
    console.error('Pest history API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pest detection history' },
      { status: 500 }
    )
  }
}