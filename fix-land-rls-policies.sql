-- Fix Land Listings RLS Policies
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

-- 2. Check current RLS policies
SELECT '=== CURRENT RLS POLICIES ===' as info;
SELECT
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'land_listings';

-- 3. Enable RLS and create proper policies
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'RLS enabled for land_listings';
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable read access for all users" ON land_listings;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON land_listings;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON land_listings;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON land_listings;
    DROP POLICY IF EXISTS "Users can view all land listings" ON land_listings;
    DROP POLICY IF EXISTS "Users can insert their own land listings" ON land_listings;
    DROP POLICY IF EXISTS "Users can update their own land listings" ON land_listings;
    DROP POLICY IF EXISTS "Users can delete their own land listings" ON land_listings;
    
    RAISE NOTICE 'Existing policies dropped';
    
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON land_listings 
    FOR SELECT USING (true);
    
    CREATE POLICY "Enable insert for authenticated users only" ON land_listings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" ON land_listings 
    FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" ON land_listings 
    FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'New RLS policies created successfully';
END $$;

-- 4. Verify the policies were created
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

-- 5. Test insert with RLS enabled
SELECT '=== TESTING INSERT WITH RLS ===' as info;
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
        'Test Land RLS Fix',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'RLS test insert successful! ID: %', test_result.id;
    RAISE NOTICE 'Inserted data: %', row_to_json(test_result);
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'RLS test insert failed: %', SQLERRM;
        RAISE NOTICE 'Error code: %', SQLSTATE;
END $$;

SELECT '=== RLS FIX COMPLETE ===' as info; 