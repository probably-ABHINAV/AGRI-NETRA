

-- Fix profiles table schema with proper RLS policies for registration
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Allow profile creation during registration" ON profiles;
    
    -- Drop existing table to recreate with correct structure
    DROP TABLE IF EXISTS profiles CASCADE;
    
    -- Create profiles table with correct structure
    CREATE TABLE profiles (
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
    );
    
    -- Enable Row Level Security
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    
    -- Create permissive policies for development
    -- Allow anyone to insert profiles (for registration)
    CREATE POLICY "Enable insert for registration" ON profiles 
        FOR INSERT WITH CHECK (true);
    
    -- Allow anyone to select profiles (can be restricted later)
    CREATE POLICY "Enable select for users" ON profiles 
        FOR SELECT USING (true);
        
    -- Allow users to update any profile (can be restricted later)
    CREATE POLICY "Enable update for users" ON profiles 
        FOR UPDATE USING (true);
        
    RAISE NOTICE 'Profiles table recreated successfully with permissive RLS policies for development';
    
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Error occurred: %', SQLERRM;
        RAISE;
END
$$;

