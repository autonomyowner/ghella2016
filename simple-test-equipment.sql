-- Simple Test for Equipment Posting
-- Run this after the schema fix to verify everything works

-- Test 1: Check if we can insert equipment without category_id
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
  'This is a test equipment posting without category_id',
  150000,
  'DZD',
  'good',
  'Test Location',
  '+213 555 123 456',
  '{}',
  true,
  false,
  0
) RETURNING id, title, category_id, created_at;

-- Test 2: Check if the equipment was inserted with a category_id
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