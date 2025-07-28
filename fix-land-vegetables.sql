-- Fix Land and Vegetables Issues
-- Run this in Supabase SQL Editor

-- 1. Check vegetables freshness constraint
SELECT '=== CHECKING VEGETABLES CONSTRAINT ===' as info;
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'vegetables'::regclass 
AND contype = 'c' 
AND conname LIKE '%freshness%';

-- 2. Check what freshness values exist
SELECT '=== CHECKING FRESHNESS VALUES ===' as info;
SELECT DISTINCT freshness FROM vegetables LIMIT 10;

-- 3. Check if land_listings table exists
SELECT '=== CHECKING LAND_LISTINGS TABLE ===' as info;
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'land_listings'
) as land_listings_exists;

-- 4. Check land_listings structure
SELECT '=== LAND_LISTINGS STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'land_listings'
ORDER BY ordinal_position;

-- 5. Test insert with different freshness values
SELECT '=== TESTING VEGETABLES INSERT ===' as info;
-- This will show what values work for freshness
SELECT 'Run the check-vegetables-constraint.sql script to see valid freshness values' as note; 