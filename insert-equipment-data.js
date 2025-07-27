const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample equipment data
const sampleEquipment = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'جرار زراعي 75 حصان',
    description: 'جرار حديث مناسب لجميع الأعمال الزراعية، مكيف، هيدروليك، 4WD، GPS',
    price: 8000,
    currency: 'DZD',
    category_id: 'tractor',
    condition: 'excellent',
    year: 2022,
    brand: 'John Deere',
    model: '75HP',
    location: 'سطيف',
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    title: 'حصادة قمح',
    description: 'حصادة متطورة لجميع أنواع الحبوب، أوتوماتيك، GPS، تحكم ذكي، صيانة دورية',
    price: 15000,
    currency: 'DZD',
    category_id: 'harvester',
    condition: 'good',
    year: 2021,
    brand: 'Case IH',
    model: 'WheatMaster',
    location: 'تيارت',
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    title: 'محراث قلاب 4 سكة',
    description: 'محراث عالي الكفاءة للحراثة العميقة، قابل للتعديل، مقاوم للتآكل، سهل الصيانة',
    price: 2500,
    currency: 'DZD',
    category_id: 'plow',
    condition: 'new',
    year: 2023,
    brand: 'Lemken',
    model: '4-Furrow',
    location: 'قسنطينة',
    is_available: false,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    user_id: '550e8400-e29b-41d4-a716-446655440004',
    title: 'آلة بذر ذكية',
    description: 'آلة بذر متطورة مع نظام GPS للدقة العالية، تحكم إلكتروني، قابل للتعديل، صيانة سهلة',
    price: 5000,
    currency: 'DZD',
    category_id: 'seeder',
    condition: 'excellent',
    year: 2022,
    brand: 'Amazone',
    model: 'SmartSeeder',
    location: 'البليدة',
    is_available: true,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    user_id: '550e8400-e29b-41d4-a716-446655440005',
    title: 'رشاش محوري',
    description: 'رشاش محوري كبير للمساحات الواسعة، تحكم عن بعد، أوتوماتيك، تغطية واسعة، اقتصادي',
    price: 12000,
    currency: 'DZD',
    category_id: 'sprayer',
    condition: 'good',
    year: 2020,
    brand: 'Valley',
    model: 'PivotMaster',
    location: 'مستغانم',
    is_available: true,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function insertEquipmentData() {
  console.log('🚀 Starting equipment data insertion...\n');

  try {
    // First, check if equipment table exists and has data
    console.log('1. Checking existing equipment data...');
    const { data: existingData, error: checkError } = await supabase
      .from('equipment')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking equipment table:', checkError.message);
      return;
    }

    if (existingData && existingData.length > 0) {
      console.log('✅ Equipment table already has data, skipping insertion');
      return;
    }

    console.log('📝 No existing data found, inserting sample equipment...');

    // Insert sample equipment data
    const { data: insertedData, error: insertError } = await supabase
      .from('equipment')
      .insert(sampleEquipment)
      .select();

    if (insertError) {
      console.error('❌ Error inserting equipment data:', insertError.message);
      return;
    }

    console.log('✅ Successfully inserted equipment data:');
    console.log(`   - Inserted ${insertedData?.length || 0} items`);
    
    if (insertedData) {
      insertedData.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.title} - ${item.price} ${item.currency}`);
      });
    }

    console.log('\n🎉 Equipment data insertion completed successfully!');

  } catch (error) {
    console.error('💥 Error during equipment data insertion:', error.message);
  }
}

// Run the insertion
insertEquipmentData().then(() => {
  console.log('\n🏁 Script completed!');
}).catch(error => {
  console.error('💥 Script crashed:', error);
}); 