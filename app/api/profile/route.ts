import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'

// In-memory storage for demo purposes - updated with city
let userProfiles: Record<string, any> = {
  'farmer@example.com': {
    fullName: "John Farmer",
    email: "farmer@example.com",
    phone: "+91 98765 43210",
    city: "Noida", // New city field
    state: "Uttar Pradesh",
    country: "India",
    farmSize: 25.5,
    experience: 15,
    language: "en",
    avatar: "https://github.com/shadcn.png",
  }
};

// GET handler to fetch profile
export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = userProfiles[user.email] || {
    email: user.email,
    fullName: 'New User',
    city: 'Noida', // Default city
    phone: '',
  };

  return NextResponse.json(profile);
}

// POST handler to update profile
export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  // Update or create the profile
  userProfiles[user.email] = {
    ...userProfiles[user.email],
    ...body,
    email: user.email,
  };

  return NextResponse.json({ success: true, data: userProfiles[user.email] });
}