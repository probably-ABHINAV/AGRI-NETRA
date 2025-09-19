
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your secrets')
  process.exit(1)
}

async function fixDatabase() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  console.log('🔧 Fixing database schema...')
  
  try {
    // First, let's see what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tablesError) {
      console.log('Cannot check existing tables, proceeding with creation...')
    } else {
      console.log('📋 Existing tables:', tables?.map(t => t.table_name) || [])
    }
    
    // Check if profiles table exists and has password_hash column
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'profiles')
      .eq('table_schema', 'public')
    
    if (!columnsError && columns) {
      const columnNames = columns.map(c => c.column_name)
      console.log('📋 Profiles table columns:', columnNames)
      
      if (columnNames.includes('password_hash')) {
        console.log('✅ password_hash column already exists!')
        return
      } else {
        console.log('⚠️  password_hash column missing, will add it')
      }
    }
    
    // Try to insert a test record to see what happens
    console.log('🧪 Testing profiles table structure...')
    
    const testData = {
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'farmer',
      password_hash: 'test_hash',
      is_verified: false,
      preferred_language: 'en'
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(testData)
      .select()
    
    if (error) {
      console.log('❌ Insert failed:', error.message)
      console.log('🔧 Need to fix the table structure...')
      
      // This means we need to manually create or alter the table
      console.log('Please run this SQL manually in your Supabase SQL Editor:')
      console.log('')
      console.log('-- Drop existing table if it exists without the right structure')
      console.log('DROP TABLE IF EXISTS profiles CASCADE;')
      console.log('')
      console.log('-- Create profiles table with correct structure')
      console.log(`CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin')),
  location TEXT,
  farm_size DECIMAL,
  experience_years INTEGER,
  preferred_language TEXT DEFAULT 'en',
  avatar_url TEXT,
  password_hash TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`)
      console.log('')
      console.log('-- Enable Row Level Security')
      console.log('ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;')
      console.log('')
      console.log('-- Add RLS policies')
      console.log(`CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid()::text = id::text);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid()::text = id::text);`)
      
    } else {
      console.log('✅ Test insert successful! Cleaning up...')
      
      // Clean up test data
      await supabase
        .from('profiles')
        .delete()
        .eq('email', 'test@example.com')
      
      console.log('✅ Database is working correctly!')
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

fixDatabase()
