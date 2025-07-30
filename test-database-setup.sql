-- Test Database Setup for Equipment Posting
-- Run this in your Supabase SQL Editor to verify everything works

-- 1. Check if categories table exists and has data
SELECT 'Categories count:' as info, COUNT(*) as count FROM categories;

-- 2. Show existing categories
SELECT 'Categories:' as info, id, name, name_ar FROM categories ORDER BY sort_order;

-- 3. Check equipment table structure
SELECT 'Equipment table columns:' as info, column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND column_name IN ('category_id', 'title_ar', 'title')
ORDER BY ordinal_position;

-- 4. Test inserting a sample equipment (this should work now)
INSERT INTO equipment (
  user_id,
  title,
  title_ar,
  description,
  price,
  currency,
  condition,
  location,
  contact_phone,
  images,
  is_available,
  is_featured,
  view_count
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001', -- Use an existing user ID
  'Test Equipment ' || EXTRACT(EPOCH FROM NOW()),
  'معدة اختبار ' || EXTRACT(EPOCH FROM NOW()),
  'This is a test equipment posting',
  100000,
  'DZD',
  'good',
  'Test Location',
  '+213 555 123 456',
  '{}',
  true,
  false,
  0
) RETURNING id, title, category_id;

-- 5. Check if the equipment was inserted successfully
SELECT 'Recent equipment:' as info, id, title, category_id, created_at 
FROM equipment 
ORDER BY created_at DESC 
LIMIT 5; 