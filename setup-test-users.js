const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test users data
const testUsers = [
  {
    email: 'test@elghella.com',
    password: 'testpassword123',
    full_name: 'مستخدم تجريبي',
    phone: '0551234567',
    user_type: 'farmer'
  },
  {
    email: 'admin@elghella.com',
    password: 'adminpassword123',
    full_name: 'مدير النظام',
    phone: '0551234568',
    user_type: 'admin'
  },
  {
    email: 'buyer@elghella.com',
    password: 'buyerpassword123',
    full_name: 'مشتري تجريبي',
    phone: '0551234569',
    user_type: 'buyer'
  }
];

async function setupTestUsers() {
  console.log('🔧 Setting up test users...\n');

  for (const userData of testUsers) {
    try {
      console.log(`📝 Creating user: ${userData.email}`);
      
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        } else {
          console.error(`❌ Auth error for ${userData.email}:`, authError.message);
          continue;
        }
      }

      if (authData.user) {
        console.log(`✅ User ${userData.email} created successfully`);
        
        // Create profile
        const profileData = {
          id: authData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          full_name: userData.full_name,
          phone: userData.phone,
          location: null,
          avatar_url: null,
          user_type: userData.user_type,
          is_verified: true, // Set to true for test users
          bio: null,
          website: null,
          social_links: {},
        };

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .upsert([profileData], { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (profileError) {
          console.error(`❌ Profile error for ${userData.email}:`, profileError.message);
        } else {
          console.log(`✅ Profile created for ${userData.email}`);
        }
      }

    } catch (error) {
      console.error(`❌ Unexpected error for ${userData.email}:`, error.message);
    }
  }

  console.log('\n🎉 Test users setup completed!');
  console.log('\n📋 Test Users:');
  testUsers.forEach(user => {
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Type: ${user.user_type}`);
    console.log('   ---');
  });
  
  console.log('\n🔗 You can now test login at: http://localhost:3000/test-auth-setup');
}

// Check if profiles table exists
async function checkDatabaseSetup() {
  console.log('🔍 Checking database setup...\n');

  try {
    // Check if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Profiles table error:', profilesError.message);
      console.log('\n📋 Please make sure you have run the database setup SQL:');
      console.log('   - Check supabase-complete-setup.sql');
      console.log('   - Run the SQL commands in your Supabase SQL editor');
      return false;
    }

    console.log('✅ Profiles table exists and is accessible');
    return true;
  } catch (error) {
    console.error('❌ Database check error:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Elghella Test Users Setup\n');
  
  const dbReady = await checkDatabaseSetup();
  
  if (dbReady) {
    await setupTestUsers();
  } else {
    console.log('\n❌ Database not ready. Please set up the database first.');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupTestUsers, checkDatabaseSetup }; 