-- Debug Equipment Posting Issues
-- Run this to check what's happening

-- 1. Check if equipment table exists and its structure
SELECT 
  'Equipment table structure:' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position;

-- 2. Check if categories exist
SELECT 
  'Categories:' as info,
  COUNT(*) as category_count
FROM categories;

-- 3. Check recent equipment posts
SELECT 
  'Recent equipment:' as info,
  id,
  title,
  user_id,
  created_at,
  is_available
FROM equipment 
ORDER BY created_at DESC 
LIMIT 5;

-- 4. Check if there are any equipment posts at all
SELECT 
  'Total equipment count:' as info,
  COUNT(*) as total_equipment
FROM equipment;

-- 5. Check RLS policies
SELECT 
  'RLS policies for equipment:' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'equipment';

-- 6. Test inserting equipment with a known user ID
-- Replace 'YOUR_USER_ID_HERE' with an actual user ID from your profiles table
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
  view_count,
  coordinates
) VALUES (
  (SELECT id FROM profiles LIMIT 1), -- Use first available user
  'Debug Test Equipment ' || EXTRACT(EPOCH FROM NOW()),
  'This is a debug test equipment posting',
  250000,
  'DZD',
  'good',
  'Debug Location',
  '+213 555 123 456',
  '{}',
  true,
  false,
  0,
  null
) RETURNING id, title, user_id, created_at, category_id; 