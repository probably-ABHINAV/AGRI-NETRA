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

  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('🔄 Setting up database schema...')

    // Read and execute schema
    const schemaSQL = fs.readFileSync('./scripts/01-create-database-schema.sql', 'utf8')

    // Create profiles table
    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL })

    if (error && !error.message.includes('already exists')) {
      console.error('Schema creation error:', error)
      console.log('Please run the SQL schema manually in your Supabase SQL editor.')
    } else {
      console.log('✅ Profiles table created successfully!')
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

if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }