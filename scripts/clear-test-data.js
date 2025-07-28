const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearTestData() {
  console.log('🧹 Starting to clear all test data from marketplaces...\n');

  const tables = [
    { name: 'vegetables', displayName: 'الخضروات والفواكه' },
    { name: 'land_listings', displayName: 'الأراضي الزراعية' },
    { name: 'equipment', displayName: 'المعدات الزراعية' },
    { name: 'animal_listings', displayName: 'الحيوانات' },
    { name: 'nurseries', displayName: 'المشاتل والشتلات' }
  ];

  let totalDeleted = 0;

  for (const table of tables) {
    try {
      console.log(`📊 Checking ${table.displayName} (${table.name})...`);
      
      // First, count existing records
      const { count, error: countError } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error(`❌ Error counting records in ${table.name}:`, countError.message);
        continue;
      }

      console.log(`   Found ${count} records`);

      if (count > 0) {
        // Delete all records
        const { error: deleteError } = await supabase
          .from(table.name)
          .delete()
          .neq('id', 0); // Delete all records

        if (deleteError) {
          console.error(`❌ Error deleting from ${table.name}:`, deleteError.message);
        } else {
          console.log(`✅ Successfully deleted ${count} records from ${table.displayName}`);
          totalDeleted += count;
        }
      } else {
        console.log(`   No records to delete`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${table.name}:`, error.message);
    }
  }

  console.log(`\n🎉 Clear operation completed!`);
  console.log(`📈 Total records deleted: ${totalDeleted}`);
  console.log(`\n✅ All marketplace tables are now empty and ready for real data.`);
  console.log(`🚀 You can now start advertising your website!`);
}

// Run the clear operation
clearTestData().catch(console.error); 