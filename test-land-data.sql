-- Test script to verify land data exists
-- Run this in your Firebase SQL Editor to check if data is accessible

-- Check if land_listings table exists and has data
SELECT 
  'land_listings' as table_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN is_available = true THEN 1 END) as available_records
FROM public.land_listings;

-- Show sample data
SELECT 
  id,
  title,
  price,
  currency,
  listing_type,
  area_size,
  area_unit,
  location,
  is_available,
  is_featured
FROM public.land_listings
LIMIT 5;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'land_listings';

-- Test query that should work with RLS
SELECT 
  'Test query result' as test,
  COUNT(*) as count
FROM public.land_listings 
WHERE is_available = true; 
