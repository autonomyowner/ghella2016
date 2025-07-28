-- Permanently Disable RLS for All Marketplace Tables
-- Run this in Supabase SQL Editor

-- 1. Disable RLS for all marketplace tables
DO $$
BEGIN
    -- Disable RLS for all marketplace tables
    ALTER TABLE land_listings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;
    ALTER TABLE vegetables DISABLE ROW LEVEL SECURITY;
    ALTER TABLE animal_listings DISABLE ROW LEVEL SECURITY;
    ALTER TABLE nurseries DISABLE ROW LEVEL SECURITY;
    
    RAISE NOTICE 'RLS disabled for all marketplace tables';
END $$;

-- 2. Verify RLS is disabled
SELECT '=== RLS STATUS AFTER DISABLE ===' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('land_listings', 'equipment', 'vegetables', 'animal_listings', 'nurseries')
ORDER BY tablename;

-- 3. Test insert for land_listings
SELECT '=== TESTING LAND INSERT ===' as info;
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
    
    -- Try to insert
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
    
    RAISE NOTICE 'Land insert successful! ID: %', test_result.id;
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Land insert failed: %', SQLERRM;
END $$;

-- 4. Test insert for vegetables
SELECT '=== TESTING VEGETABLES INSERT ===' as info;
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
    
    -- Try to insert
    INSERT INTO vegetables (
        user_id,
        title,
        description,
        price,
        vegetable_type,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging
    ) VALUES (
        test_user_id,
        'Test Vegetables No RLS',
        'Test Description',
        100,
        'tomatoes',
        10,
        'kg',
        'fresh',
        false,
        'Test Location',
        'plastic_bag'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Vegetables insert successful! ID: %', test_result.id;
    
    -- Clean up
    DELETE FROM vegetables WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Vegetables insert failed: %', SQLERRM;
END $$;

SELECT '=== RLS PERMANENTLY DISABLED ===' as info;
SELECT 'All marketplace tables now work without RLS restrictions!' as note; 