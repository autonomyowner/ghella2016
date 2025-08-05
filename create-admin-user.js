const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('❌ Usage: node create-admin-user.js <email>');
  process.exit(1);
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdminUser() {
  try {
    console.log(`👑 Creating admin user for: ${email}`);
    
    const adminName = `Admin ${email.split('@')[0]}`;
    const userId = crypto.randomUUID();

    console.log('📝 Admin details:');
    console.log(`   ID: ${userId}`);
    console.log(`   Name: ${adminName}`);
    console.log(`   Email: ${email}`);

    // First, check if user already exists
    console.log('🔍 Checking if user already exists...');
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('full_name', adminName)
      .single();

    if (existingUser) {
      console.log('⚠️  User already exists with this name');
      console.log('📊 Existing user data:', existingUser);
      return;
    }

    // Try to create the profile
    console.log('➕ Creating admin profile...');
    const { data: newUser, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        full_name: adminName,
        phone: null,
        location: null,
        avatar_url: null,
        user_type: 'admin',
        is_verified: true,
        bio: null,
        website: null,
        social_links: {},
        role: 'admin',
        is_admin: true
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Error creating admin user:', createError);
      
      if (createError.message.includes('foreign key constraint')) {
        console.log('🔧 Solution: You need to create the user in auth.users first');
        console.log('💡 This requires database administrator privileges');
        console.log('📧 Contact your database administrator to create the user');
        console.log('🔑 Or update the service role key in .env.local');
      }
      
      return;
    }

    console.log('✅ Admin user created successfully!');
    console.log('📊 User data:', newUser);
    console.log('🎉 Admin privileges added to:', email);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createAdminUser(); 