-- Fix RLS Policies Properly for Land Listings
-- Run this in Supabase SQL Editor

-- 1. Re-enable RLS and create proper policies
DO $$
BEGIN
    -- Re-enable RLS
    ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS re-enabled for land_listings';
    
    -- Drop all existing policies
    DROP POLICY IF EXISTS "Enable read access for all users" ON land_listings;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON land_listings;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON land_listings;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON land_listings;
    DROP POLICY IF EXISTS "Users can view all land listings" ON land_listings;
    DROP POLICY IF EXISTS "Users can insert their own land listings" ON land_listings;
    DROP POLICY IF EXISTS "Users can update their own land listings" ON land_listings;
    DROP POLICY IF EXISTS "Users can delete their own land listings" ON land_listings;
    
    RAISE NOTICE 'All existing policies dropped';
    
    -- Create new policies that work properly
    CREATE POLICY "land_listings_select_policy" ON land_listings 
    FOR SELECT USING (true);
    
    CREATE POLICY "land_listings_insert_policy" ON land_listings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "land_listings_update_policy" ON land_listings 
    FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "land_listings_delete_policy" ON land_listings 
    FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'New RLS policies created successfully';
END $$;

-- 2. Verify the policies were created
SELECT '=== VERIFIED RLS POLICIES ===' as info;
SELECT
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'land_listings'
ORDER BY policyname;

-- 3. Test insert with proper RLS
SELECT '=== TESTING INSERT WITH PROPER RLS ===' as info;
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
        'Test Land Proper RLS',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Proper RLS test insert successful! ID: %', test_result.id;
    RAISE NOTICE 'Inserted data: %', row_to_json(test_result);
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Proper RLS test insert failed: %', SQLERRM;
        RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

SELECT '=== RLS FIX COMPLETE ===' as info;
SELECT 'Now test the application - it should work with proper security!' as note; 