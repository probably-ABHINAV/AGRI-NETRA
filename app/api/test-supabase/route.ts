
import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Supabase not configured',
          message: 'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables'
        },
        { status: 500 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase client not initialized' },
        { status: 500 }
      )
    }

    // Test database connection by checking profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' })
      .limit(1)

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection failed',
          details: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful',
      tableExists: true,
      userCount: data?.length || 0
    })

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Connection test failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
