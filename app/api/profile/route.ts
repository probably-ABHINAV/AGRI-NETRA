import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
import { getUser } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

// GET handler to fetch profile
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient();
    if (!supabase) {
      // Fallback to default profile for development
      const defaultProfile = {
        email: user.email,
        fullName: 'John Farmer',
        city: 'Noida',
        phone: '+91 98765 43210',
        state: 'Uttar Pradesh',
        country: 'India',
        farmSize: 25.5,
        experience: 15,
        language: 'en',
      };
      return NextResponse.json(defaultProfile);
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', user.email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!profile) {
      // Return default profile if user doesn't exist
      const defaultProfile = {
        email: user.email,
        fullName: 'New User',
        city: 'Noida',
        phone: '',
      };
      return NextResponse.json(defaultProfile);
    }

    // Map database fields to API response
    const profileData = {
      email: profile.email,
      fullName: profile.full_name,
      phone: profile.phone || '',
      city: profile.location?.split(',')[0] || 'Noida',
      state: profile.location?.split(',')[1] || 'Uttar Pradesh',
      country: 'India',
      farmSize: profile.farm_size || 0,
      experience: profile.experience_years || 0,
      language: profile.preferred_language || 'en',
      avatar: profile.avatar_url || '',
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST handler to update profile
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createClient();
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    // Map API fields to database fields
    const locationString = body.city && body.state ? `${body.city}, ${body.state}` : body.city || 'Noida, Uttar Pradesh';
    
    const profileData = {
      email: user.email,
      full_name: body.fullName || body.full_name || 'New User',
      phone: body.phone || null,
      location: locationString,
      farm_size: body.farmSize ? Number(body.farmSize) : null,
      experience_years: body.experience ? Number(body.experience) : null,
      preferred_language: body.language || 'en',
      avatar_url: body.avatar || null,
      updated_at: new Date().toISOString(),
    };

    // Try to update first, then insert if not exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    let result;
    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('profiles')
        .update(profileData)
        .eq('email', user.email)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database error:', result.error);
      return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 });
    }

    // Return the updated profile in API format
    const responseData = {
      email: result.data.email,
      fullName: result.data.full_name,
      phone: result.data.phone || '',
      city: result.data.location?.split(',')[0] || 'Noida',
      state: result.data.location?.split(',')[1] || 'Uttar Pradesh',
      farmSize: result.data.farm_size || 0,
      experience: result.data.experience_years || 0,
      language: result.data.preferred_language || 'en',
      avatar: result.data.avatar_url || '',
    };

    return NextResponse.json({ success: true, data: responseData });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}