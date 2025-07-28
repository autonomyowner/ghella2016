-- Fix Land Listings area_size Issue
-- Run this in Supabase SQL Editor

-- 1. Check current table structure
SELECT '=== CURRENT LAND_LISTINGS STRUCTURE ===' as info;
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

-- 2. Check if area_size column exists and its properties
SELECT '=== AREA_SIZE COLUMN CHECK ===' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'land_listings'
AND column_name = 'area_size';

-- 3. Check constraints on area_size
SELECT '=== AREA_SIZE CONSTRAINTS ===' as info;
SELECT
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'land_listings'::regclass
AND pg_get_constraintdef(oid) LIKE '%area_size%';

-- 4. Test insert with explicit area_size
SELECT '=== TESTING INSERT WITH EXPLICIT AREA_SIZE ===' as info;
-- This will help us see if the issue is with the column or the data
DO $$
DECLARE
    test_user_id uuid;
    test_result record;
BEGIN
    -- Get a test user ID (replace with actual user ID if needed)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users';
        RETURN;
    END IF;
    
    -- Try to insert with explicit area_size
    INSERT INTO land_listings (
        user_id,
        title,
        description,
        price,
        area_size,
        area_unit,
        location,
        listing_type
    ) VALUES (
        test_user_id,
        'Test Land',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Insert successful: %', test_result.id;
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Insert failed: %', SQLERRM;
END $$;

-- 5. Check RLS policies
SELECT '=== RLS POLICIES ===' as info;
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

-- 6. If area_size column doesn't exist, add it
SELECT '=== CHECKING IF AREA_SIZE EXISTS ===' as info;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'land_listings' 
        AND column_name = 'area_size'
    ) THEN
        RAISE NOTICE 'area_size column does not exist - adding it...';
        ALTER TABLE land_listings ADD COLUMN area_size INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'area_size column added successfully';
    ELSE
        RAISE NOTICE 'area_size column already exists';
    END IF;
END $$;

-- 7. Ensure area_size is NOT NULL
SELECT '=== ENSURING AREA_SIZE IS NOT NULL ===' as info;
DO $$
BEGIN
    -- Check if area_size allows NULL
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'land_listings' 
        AND column_name = 'area_size'
        AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'area_size allows NULL - making it NOT NULL...';
        ALTER TABLE land_listings ALTER COLUMN area_size SET NOT NULL;
        RAISE NOTICE 'area_size is now NOT NULL';
    ELSE
        RAISE NOTICE 'area_size is already NOT NULL';
    END IF;
END $$;

-- 8. Final structure check
SELECT '=== FINAL STRUCTURE ===' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'land_listings'
AND column_name IN ('area_size', 'area_unit', 'user_id', 'title', 'price', 'location')
ORDER BY column_name; 