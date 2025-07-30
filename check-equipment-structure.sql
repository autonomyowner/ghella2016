-- Check Equipment Table Structure
-- Run this to see what columns actually exist

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position;

-- Test inserting minimal equipment data
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
  '550e8400-e29b-41d4-a716-446655440001', -- Replace with actual user ID
  'Test Equipment ' || EXTRACT(EPOCH FROM NOW()),
  'Test description',
  150000,
  'DZD',
  'good',
  'Test Location',
  '+213 555 123 456',
  '{}',
  true,
  false,
  0,
  null
) RETURNING id, title, category_id, created_at; 