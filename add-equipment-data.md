# Adding Sample Equipment Data to Supabase

## Problem
The equipment marketplace at `http://localhost:3000/equipment` is not loading cards because the equipment table is empty.

## Solution
You need to add sample equipment data to your Supabase database.

## Steps to Fix:

### 1. Access Your Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor

### 2. Run the Sample Data Script
Copy and paste the following SQL into your Supabase SQL Editor and run it:

```sql
-- Sample Equipment Data
-- This file contains sample equipment data for the equipment table

-- Insert sample equipment data
INSERT INTO public.equipment (
  id, user_id, title, description, price, currency, category_id, 
  condition, year, brand, model, location, is_available, is_featured,
  created_at, updated_at
) VALUES
-- Tractor 1
(
  '11111111-1111-1111-1111-111111111111',
  '550e8400-e29b-41d4-a716-446655440001',
  'جرار زراعي 75 حصان',
  'جرار حديث مناسب لجميع الأعمال الزراعية، مكيف، هيدروليك، 4WD، GPS',
  8000,
  'DZD',
  'tractor',
  'excellent',
  2022,
  'John Deere',
  '75HP',
  'سطيف',
  true,
  true,
  NOW(),
  NOW()
),

-- Harvester 1
(
  '22222222-2222-2222-2222-222222222222',
  '550e8400-e29b-41d4-a716-446655440002',
  'حصادة قمح',
  'حصادة متطورة لجميع أنواع الحبوب، أوتوماتيك، GPS، تحكم ذكي، صيانة دورية',
  15000,
  'DZD',
  'harvester',
  'good',
  2021,
  'Case IH',
  'WheatMaster',
  'تيارت',
  true,
  true,
  NOW(),
  NOW()
),

-- Plow 1
(
  '33333333-3333-3333-3333-333333333333',
  '550e8400-e29b-41d4-a716-446655440003',
  'محراث قلاب 4 سكة',
  'محراث عالي الكفاءة للحراثة العميقة، قابل للتعديل، مقاوم للتآكل، سهل الصيانة',
  2500,
  'DZD',
  'plow',
  'new',
  2023,
  'Lemken',
  '4-Furrow',
  'قسنطينة',
  false,
  false,
  NOW(),
  NOW()
),

-- Seeder 1
(
  '44444444-4444-4444-4444-444444444444',
  '550e8400-e29b-41d4-a716-446655440004',
  'آلة بذر ذكية',
  'آلة بذر متطورة مع نظام GPS للدقة العالية، تحكم إلكتروني، قابل للتعديل، صيانة سهلة',
  5000,
  'DZD',
  'seeder',
  'excellent',
  2022,
  'Amazone',
  'SmartSeeder',
  'البليدة',
  true,
  true,
  NOW(),
  NOW()
),

-- Sprayer 1
(
  '55555555-5555-5555-5555-555555555555',
  '550e8400-e29b-41d4-a716-446655440005',
  'رشاش محوري',
  'رشاش محوري كبير للمساحات الواسعة، تحكم عن بعد، أوتوماتيك، تغطية واسعة، اقتصادي',
  12000,
  'DZD',
  'sprayer',
  'good',
  2020,
  'Valley',
  'PivotMaster',
  'مستغانم',
  true,
  false,
  NOW(),
  NOW()
),

-- Tractor 2
(
  '66666666-6666-6666-6666-666666666666',
  '550e8400-e29b-41d4-a716-446655440006',
  'جرار زراعي 120 حصان',
  'جرار قوي للمساحات الكبيرة، مكيف، هيدروليك متطور، GPS، نظام تحكم ذكي',
  15000,
  'DZD',
  'tractor',
  'excellent',
  2023,
  'New Holland',
  '120HP',
  'ورقلة',
  true,
  true,
  NOW(),
  NOW()
),

-- Irrigation System 1
(
  '77777777-7777-7777-7777-777777777777',
  '550e8400-e29b-41d4-a716-446655440007',
  'نظام ري بالتنقيط',
  'نظام ري بالتنقيط متطور، تحكم إلكتروني، توفير المياه، مناسب لجميع المحاصيل',
  3000,
  'DZD',
  'irrigation',
  'new',
  2023,
  'Netafim',
  'DripMaster',
  'بسكرة',
  true,
  false,
  NOW(),
  NOW()
),

-- Tools Set 1
(
  '88888888-8888-8888-8888-888888888888',
  '550e8400-e29b-41d4-a716-446655440008',
  'مجموعة أدوات زراعية',
  'مجموعة شاملة من الأدوات الزراعية، جودة عالية، مقاومة للصدأ، سهلة الاستخدام',
  800,
  'DZD',
  'tools',
  'good',
  2022,
  'FarmTools',
  'CompleteSet',
  'عنابة',
  true,
  false,
  NOW(),
  NOW()
),

-- Harvester 2
(
  '99999999-9999-9999-9999-999999999999',
  '550e8400-e29b-41d4-a716-446655440009',
  'حصادة ذرة',
  'حصادة متخصصة للذرة، أوتوماتيك، GPS، تحكم ذكي، صيانة دورية',
  18000,
  'DZD',
  'harvester',
  'excellent',
  2021,
  'Claas',
  'CornMaster',
  'باتنة',
  true,
  true,
  NOW(),
  NOW()
),

-- Plow 2
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '550e8400-e29b-41d4-a716-446655440010',
  'محراث قرصي',
  'محراث قرصي للتربة الصلبة، قابل للتعديل، مقاوم للتآكل، سهل الصيانة',
  1800,
  'DZD',
  'plow',
  'good',
  2021,
  'Kuhn',
  'DiscPlow',
  'بجاية',
  true,
  false,
  NOW(),
  NOW()
),

-- Seeder 2
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '550e8400-e29b-41d4-a716-446655440001',
  'آلة بذر الحبوب',
  'آلة بذر متطورة للحبوب، تحكم إلكتروني، قابل للتعديل، صيانة سهلة',
  3500,
  'DZD',
  'seeder',
  'excellent',
  2022,
  'Horsch',
  'GrainSeeder',
  'سكيكدة',
  true,
  false,
  NOW(),
  NOW()
),

-- Sprayer 2
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '550e8400-e29b-41d4-a716-446655440002',
  'رشاش يدوي',
  'رشاش يدوي متطور، خفيف الوزن، سهل الاستخدام، مناسب للمساحات الصغيرة',
  600,
  'DZD',
  'sprayer',
  'new',
  2023,
  'SprayTech',
  'HandSprayer',
  'تلمسان',
  true,
  false,
  NOW(),
  NOW()
)

ON CONFLICT (id) DO NOTHING;
```

### 3. Verify the Data
After running the SQL, you can verify the data was added by running:

```sql
SELECT COUNT(*) FROM public.equipment;
```

This should return 12 (the number of sample equipment items).

### 4. Test the Equipment Page
1. Go to `http://localhost:3000/equipment`
2. The equipment cards should now load properly
3. You can also test the debug page at `http://localhost:3000/test-equipment-loading`

## What Was Fixed:

1. **Updated useEquipment hook**: Removed the requirement for a logged-in user to fetch equipment data
2. **Updated equipment page**: Modified the card component to work with the actual database schema
3. **Added sample data**: Created 12 sample equipment items with proper data structure
4. **Added debug page**: Created a test page to help troubleshoot loading issues

## Files Modified:
- `src/hooks/useSupabase.ts` - Updated useEquipment hook
- `src/app/equipment/page.tsx` - Updated equipment card component
- `src/app/test-equipment-loading/page.tsx` - Added debug page
- `sample-equipment-data.sql` - Sample data file
- `add-equipment-data.md` - This guide

After running the SQL script in your Supabase database, the equipment marketplace should work properly and display the equipment cards. 