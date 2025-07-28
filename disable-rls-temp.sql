-- Temporarily Disable RLS for Testing
-- Run this in Supabase SQL Editor

-- 1. Check current RLS status
SELECT '=== CURRENT RLS STATUS ===' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'land_listings';

-- 2. Temporarily disable RLS
DO $$
BEGIN
    ALTER TABLE land_listings DISABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS temporarily disabled for land_listings';
END $$;

-- 3. Verify RLS is disabled
SELECT '=== RLS STATUS AFTER DISABLE ===' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'land_listings';

-- 4. Test insert without RLS
SELECT '=== TESTING INSERT WITHOUT RLS ===' as info;
DO $$
DECLARE
    test_user_id uuid;
    test_result record;
BEGIN
    -- Get a test user ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using test user ID: %', test_user_id;
    
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
        'Test Land No RLS',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Insert without RLS successful! ID: %', test_result.id;
    RAISE NOTICE 'Inserted data: %', row_to_json(test_result);
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Insert without RLS failed: %', SQLERRM;
        RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

SELECT '=== RLS TEMPORARILY DISABLED ===' as info;
SELECT 'Now test the application - it should work!' as note; 
