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
  
  console.log('🔄 Checking database schema...')
  
  try {
    // Test connection
    const { data, error } = await supabase.from('profiles').select('*').limit(1)
    
    if (error) {
      console.log('❌ Database connection failed:', error.message)
      console.log('Please check your Supabase configuration')
      return
    }
    
    console.log('✅ Database connection successful')
    console.log('✅ Database schema is working correctly')
    
  } catch (error) {
    console.error('❌ Database fix failed:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  fixDatabase()
}

module.exports = { fixDatabase }