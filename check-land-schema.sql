-- Check land_listings table structure and constraints
-- Run this in Supabase SQL Editor

-- 1. Check table structure
SELECT '=== LAND_LISTINGS TABLE STRUCTURE ===' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'land_listings'
ORDER BY ordinal_position;

-- 2. Check constraints
SELECT '=== LAND_LISTINGS CONSTRAINTS ===' as info;
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'land_listings'::regclass;

-- 3. Check RLS policies
SELECT '=== LAND_LISTINGS RLS POLICIES ===' as info;
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'land_listings';

-- 4. Test a simple insert to see what happens
SELECT '=== TESTING SIMPLE INSERT ===' as info;
-- This will help us understand what fields are required
SELECT 'Run the test page to see the actual error' as note; 