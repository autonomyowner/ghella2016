const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const SUPABASE_URL = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabaseTables() {
  try {
    console.log('🔍 Checking database tables in Supabase...\n');
    
    // Try to query common table names
    const tableNames = [
      'users', 'farms', 'marketplace_items', 'orders', 'field_logs',
      'profiles', 'auth.users', 'public.users',
      'equipment', 'land', 'vegetables', 'animals'
    ];

    console.log('📋 Checking for existing tables:\n');

    for (const tableName of tableNames) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count')
          .limit(1);

        if (!error) {
          console.log(`✅ Table "${tableName}" exists`);
          
          // Get table structure
          const { data: sampleData, error: sampleError } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);

          if (!sampleError && sampleData.length > 0) {
            console.log(`   Columns: ${Object.keys(sampleData[0]).join(', ')}`);
          }
        } else {
          console.log(`❌ Table "${tableName}" does not exist`);
        }
      } catch (err) {
        console.log(`❌ Table "${tableName}" does not exist`);
      }
    }

    console.log('\n💡 Next Steps:');
    console.log('1. Create the database tables using the schema from mcp-gibsonai-simple.js');
    console.log('2. Set up proper RLS policies for security');
    console.log('3. Add sample data to test the functionality');

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

// Run the check
checkDatabaseTables(); 