const { createClient } = require('@supabase/supabase-js');

// Supabase configuration from environment variables
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAllUsers() {
  try {
    console.log('🔍 Querying all users from Supabase database...\n');
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('📭 No users found in the database.');
      console.log('\n💡 You can create users through your application or directly in Supabase.');
      return;
    }

    console.log(`✅ Found ${data.length} user(s) in the database:\n`);
    
    data.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Role: ${user.role || 'N/A'}`);
      console.log(`   Created: ${user.created_at || 'N/A'}`);
      console.log(`   Updated: ${user.updated_at || 'N/A'}`);
      console.log('');
    });

    // Summary
    console.log('📊 Summary:');
    const roleCounts = data.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} user(s)`);
    });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the query
getAllUsers(); 