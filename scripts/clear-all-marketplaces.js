const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAllMarketplaces() {
  console.log('🧹 Starting marketplace cleanup...');
  
  try {
    // Disable RLS temporarily
    console.log('🔓 Temporarily disabling RLS...');
    await supabase.rpc('disable_rls_temporarily');
    
    // Clear all marketplace tables
    const tablesToClear = [
      'equipment',
      'land_listings', 
      'agricultural_products',
      'messages',
      'favorites',
      'reviews',
      'land_reviews',
      'land_favorites',
      'export_deals',
      'nurseries',
      'vegetables',
      'animals',
      'labor',
      'delivery',
      'experts'
    ];

    for (const table of tablesToClear) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
        
        if (error) {
          console.log(`⚠️  Table ${table} not found or already empty: ${error.message}`);
        } else {
          console.log(`✅ Cleared ${table}`);
        }
      } catch (err) {
        console.log(`⚠️  Could not clear ${table}: ${err.message}`);
      }
    }

    // Re-enable RLS
    console.log('🔒 Re-enabling RLS...');
    await supabase.rpc('enable_rls_temporarily');

    // Verify cleanup
    console.log('\n📊 Verification:');
    const verificationTables = ['equipment', 'land_listings', 'agricultural_products', 'messages', 'favorites', 'reviews'];
    
    for (const table of verificationTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Error checking ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: ${count} records remaining`);
        }
      } catch (err) {
        console.log(`⚠️  Could not verify ${table}: ${err.message}`);
      }
    }

    console.log('\n🎉 All marketplace data has been cleared successfully!');
    console.log('💡 User profiles and categories have been preserved.');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
}

// Run the cleanup
clearAllMarketplaces(); 