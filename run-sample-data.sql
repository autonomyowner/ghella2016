-- Run this script in your Firebase SQL Editor
-- This will populate your land marketplace with sample data

-- First, let's check if we have the required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Now run the sample data
\i sample-land-data.sql

-- Verify the data was inserted correctly
SELECT 
  'Users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profiles' as table_name,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Land Listings' as table_name,
  COUNT(*) as count
FROM land_listings
UNION ALL
SELECT 
  'Reviews' as table_name,
  COUNT(*) as count
FROM land_reviews
UNION ALL
SELECT 
  'Favorites' as table_name,
  COUNT(*) as count
FROM land_favorites;

-- Show some sample land listings
SELECT 
  title,
  price,
  currency,
  listing_type,
  area_size,
  area_unit,
  location,
  is_available
FROM land_listings
LIMIT 5; 
