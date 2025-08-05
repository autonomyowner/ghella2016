const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAllProfiles() {
  try {
    console.log('🔍 Querying all user profiles from Supabase database...\n');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No user profiles found in the database.');
      console.log('\n💡 You can create user profiles through your application or directly in Supabase.');
      return;
    }

    console.log(`✅ Found ${data.length} user profile(s) in the database:\n`);
    
    data.forEach((profile, index) => {
      console.log(`👤 User Profile ${index + 1}:`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   Full Name: ${profile.full_name || 'N/A'}`);
      console.log(`   Phone: ${profile.phone || 'N/A'}`);
      console.log(`   Location: ${profile.location || 'N/A'}`);
      console.log(`   User Type: ${profile.user_type || 'N/A'}`);
      console.log(`   Role: ${profile.role || 'N/A'}`);
      console.log(`   Is Admin: ${profile.is_admin ? 'Yes' : 'No'}`);
      console.log(`   Is Verified: ${profile.is_verified ? 'Yes' : 'No'}`);
      console.log(`   Bio: ${profile.bio || 'N/A'}`);
      console.log(`   Website: ${profile.website || 'N/A'}`);
      console.log(`   Created: ${profile.created_at || 'N/A'}`);
      console.log(`   Updated: ${profile.updated_at || 'N/A'}`);
      console.log('');
    });

    // Summary
    console.log('📊 Summary:');
    const userTypeCounts = data.reduce((acc, profile) => {
      acc[profile.user_type] = (acc[profile.user_type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(userTypeCounts).forEach(([userType, count]) => {
      console.log(`   ${userType || 'Unknown'}: ${count} user(s)`);
    });

    const adminCount = data.filter(p => p.is_admin).length;
    const verifiedCount = data.filter(p => p.is_verified).length;
    
    console.log(`   Admin users: ${adminCount}`);
    console.log(`   Verified users: ${verifiedCount}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the query
getAllProfiles(); 