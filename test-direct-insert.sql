-- Test Direct Insert to Land Listings
-- Run this in Supabase SQL Editor to test the database directly

-- 1. Check current table structure
SELECT '=== LAND_LISTINGS CURRENT STRUCTURE ===' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'land_listings'
ORDER BY ordinal_position;

-- 2. Check if area_size exists and its properties
SELECT '=== AREA_SIZE DETAILS ===' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'land_listings'
AND column_name = 'area_size';

-- 3. Test insert with all required fields explicitly
SELECT '=== TESTING DIRECT INSERT ===' as info;
DO $$
DECLARE
    test_user_id uuid;
    test_result record;
    insert_data jsonb;
BEGIN
    -- Get a test user ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using test user ID: %', test_user_id;
    
    -- Create test data
    insert_data := jsonb_build_object(
        'user_id', test_user_id,
        'title', 'Test Land Direct',
        'description', 'Test Description',
        'price', 50000,
        'area_size', 1000,
        'area_unit', 'hectare',
        'location', 'Test Location',
        'listing_type', 'sale'
    );
    
    RAISE NOTICE 'Test data: %', insert_data;
    
    -- Try to insert with explicit field list
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
        'Test Land Direct',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Direct insert successful! ID: %', test_result.id;
    RAISE NOTICE 'Inserted data: %', row_to_json(test_result);
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Direct insert failed: %', SQLERRM;
        RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

-- 4. Check RLS policies
SELECT '=== RLS POLICIES ===' as info;
SELECT
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'land_listings';

-- 5. Check if RLS is enabled
SELECT '=== RLS STATUS ===' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'land_listings';

-- 6. Test with RLS disabled temporarily
SELECT '=== TESTING WITH RLS DISABLED ===' as info;
DO $$
DECLARE
    test_user_id uuid;
    test_result record;
    rls_was_enabled boolean;
BEGIN
    -- Get a test user ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found - skipping RLS test';
        RETURN;
    END IF;
    
    -- Check if RLS is enabled
    SELECT rowsecurity INTO rls_was_enabled 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'land_listings';
    
    RAISE NOTICE 'RLS was enabled: %', rls_was_enabled;
    
    -- Disable RLS temporarily
    ALTER TABLE land_listings DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS disabled for testing';
    
    -- Try insert
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
        'Test Land No RLS',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Insert without RLS successful! ID: %', test_result.id;
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
    -- Re-enable RLS if it was enabled
    IF rls_was_enabled THEN
        ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS re-enabled';
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Insert without RLS failed: %', SQLERRM;
        
        -- Re-enable RLS if it was enabled
        IF rls_was_enabled THEN
            ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
            RAISE NOTICE 'RLS re-enabled after error';
        END IF;
END $$;

SELECT '=== TEST COMPLETE ===' as info; 