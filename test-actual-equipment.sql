-- Test Equipment Posting with Actual Database Structure
-- Run this after the schema fix to verify everything works

-- Test 1: Check if we can insert equipment with minimal data
INSERT INTO equipment (
  user_id,
  title,
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
  '550e8400-e29b-41d4-a716-446655440001', -- Use existing user ID
  'Test Equipment ' || EXTRACT(EPOCH FROM NOW()),
  'This is a test equipment posting with minimal data',
  200000,
  'DZD',
  'good',
  'Test Location',
  '+213 555 123 456',
  '{}',
  true,
  false,
  0
) RETURNING id, title, category_id, created_at;

-- Test 2: Check if the equipment was inserted successfully
SELECT 
  'Test result:' as info,
  id,
  title,
  category_id,
  created_at
FROM equipment 
WHERE title LIKE 'Test Equipment%'
ORDER BY created_at DESC 
LIMIT 1;

-- Test 3: Show all recent equipment
SELECT 
  'Recent equipment:' as info,
  id,
  title,
  category_id,
  created_at
FROM equipment 
ORDER BY created_at DESC 
LIMIT 5;

-- Test 4: Show table structure
SELECT 
  'Equipment table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position; 