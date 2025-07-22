const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://puvmqdnvofbtmqpcjmia.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // Test 1: Check if profiles table exists
    console.log('\n1. Checking if profiles table exists...')
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
    
    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError)
    } else {
      console.log('✅ Profiles table exists and is accessible')
    }

    // Test 2: Check if categories table exists
    console.log('\n2. Checking if categories table exists...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1)
    
    if (categoriesError) {
      console.error('❌ Categories table error:', categoriesError)
    } else {
      console.log('✅ Categories table exists and is accessible')
    }

    // Test 3: Check storage buckets
    console.log('\n3. Checking storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets()
    
    if (bucketsError) {
      console.error('❌ Storage buckets error:', bucketsError)
    } else {
      console.log('✅ Storage buckets accessible:', buckets.map(b => b.name))
    }

    // Test 4: Try to create a test profile (will fail if RLS blocks it)
    console.log('\n4. Testing profile creation...')
    const testProfile = {
      id: 'test-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      full_name: 'Test User',
      phone: null,
      location: null,
      avatar_url: null,
      user_type: 'farmer',
      is_verified: false,
      bio: null,
      website: null,
      social_links: {}
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select()
    
    if (insertError) {
      console.log('⚠️ Profile insert test (expected to fail due to RLS):', insertError.message)
    } else {
      console.log('✅ Profile insert test passed')
      // Clean up test data
      await supabase.from('profiles').delete().eq('id', 'test-user-id')
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error)
  }
}

testConnection()
