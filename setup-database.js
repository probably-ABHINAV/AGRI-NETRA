
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function setupDatabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase environment variables not set!')
    console.log('Please configure these in the Secrets tab:')
    console.log('- NEXT_PUBLIC_SUPABASE_URL')
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
    console.log('- JWT_SECRET')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  
  try {
    // Read the schema file
    const schemaSQL = fs.readFileSync('./scripts/01-create-database-schema.sql', 'utf8')
    
    console.log('🚀 Setting up database schema...')
    
    // Execute the schema creation
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql: schemaSQL 
    })
    
    if (error) {
      console.error('❌ Schema creation failed:', error)
      
      // Try alternative approach - create the profiles table manually
      console.log('🔄 Trying alternative table creation...')
      
      const createProfilesTable = `
        CREATE TABLE IF NOT EXISTS profiles (
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
      `
      
      const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
        sql: createProfilesTable
      })
      
      if (tableError) {
        console.error('❌ Table creation also failed:', tableError)
        console.log('Please run the SQL schema manually in your Supabase SQL editor.')
      } else {
        console.log('✅ Profiles table created successfully!')
      }
    } else {
      console.log('✅ Database schema created successfully!')
    }
    
    // Test the connection
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('⚠️ Table exists but may need manual setup via Supabase SQL editor')
      console.log('Error:', testError.message)
    } else {
      console.log('✅ Database connection and table access confirmed!')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.log('📝 Manual setup required:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor') 
    console.log('3. Run the contents of ./scripts/01-create-database-schema.sql')
  }
}

setupDatabase()
