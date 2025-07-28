const { createClient } = require('@supabase/supabase-js');

// Supabase configuration (same as in your project)
const supabaseUrl = 'https://puvmqdnvofbtmqpcjmia.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1dm1xZG52b2ZidG1xcGNqbWlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODc2MDcsImV4cCI6MjA2ODU2MzYwN30.9rLsQz3vi8rU46OqTYHCInVMSGdj5xgZTYZvq7ZBfjY';

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

      console.log(`   Found ${count || 0} records`);

      if ((count || 0) > 0) {
        // Delete all records
        const { error: deleteError } = await supabase
          .from(table.name)
          .delete()
          .neq('id', 0); // Delete all records

        if (deleteError) {
          console.error(`❌ Error deleting from ${table.name}:`, deleteError.message);
        } else {
          console.log(`✅ Successfully deleted ${count || 0} records from ${table.displayName}`);
          totalDeleted += (count || 0);
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