const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testEquipmentData() {
  console.log('🔍 Testing Equipment Data...\n');

  try {
    // Test 1: Check if equipment table exists and has data
    console.log('1. Checking equipment table...');
    const { data: equipmentData, error: equipmentError } = await supabase
      .from('equipment')
      .select('*')
      .limit(5);

    if (equipmentError) {
      console.log('❌ Error accessing equipment table:', equipmentError.message);
    } else {
      console.log('✅ Equipment table accessible');
      console.log(`📊 Found ${equipmentData?.length || 0} equipment items`);
      
      if (equipmentData && equipmentData.length > 0) {
        console.log('📋 Sample equipment:');
        equipmentData.slice(0, 3).forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.title} - ${item.price} ${item.currency}`);
        });
      }
    }

    // Test 2: Check if categories table exists
    console.log('\n2. Checking categories table...');
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    if (categoriesError) {
      console.log('❌ Error accessing categories table:', categoriesError.message);
    } else {
      console.log('✅ Categories table accessible');
      console.log(`📊 Found ${categoriesData?.length || 0} categories`);
    }

    // Test 3: Check if profiles table exists
    console.log('\n3. Checking profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);

    if (profilesError) {
      console.log('❌ Error accessing profiles table:', profilesError.message);
    } else {
      console.log('✅ Profiles table accessible');
      console.log(`📊 Found ${profilesData?.length || 0} profiles`);
    }

    // Test 4: Check RLS policies
    console.log('\n4. Checking RLS policies...');
    const { data: policiesData, error: policiesError } = await supabase
      .rpc('get_rls_policies', { table_name: 'equipment' })
      .catch(() => ({ data: null, error: 'Function not available' }));

    if (policiesError) {
      console.log('⚠️  Could not check RLS policies (function may not exist)');
    } else {
      console.log('✅ RLS policies check completed');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testEquipmentData().then(() => {
  console.log('\n🏁 Test completed!');
}).catch(error => {
  console.error('💥 Test crashed:', error);
}); 