
-- Simple profiles table creation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
