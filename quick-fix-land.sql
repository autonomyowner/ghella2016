-- Quick Fix for Land Listings area_size Issue
-- Run this in Supabase SQL Editor

-- 1. Check if area_size column exists
SELECT '=== CHECKING AREA_SIZE COLUMN ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'land_listings'
AND column_name = 'area_size';

-- 2. Add area_size column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'land_listings' 
        AND column_name = 'area_size'
    ) THEN
        RAISE NOTICE 'Adding area_size column...';
        ALTER TABLE land_listings ADD COLUMN area_size INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE 'area_size column added successfully';
    ELSE
        RAISE NOTICE 'area_size column already exists';
    END IF;
END $$;

-- 3. Ensure area_size is NOT NULL
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'land_listings' 
        AND column_name = 'area_size'
        AND is_nullable = 'YES'
    ) THEN
        RAISE NOTICE 'Making area_size NOT NULL...';
        ALTER TABLE land_listings ALTER COLUMN area_size SET NOT NULL;
        RAISE NOTICE 'area_size is now NOT NULL';
    ELSE
        RAISE NOTICE 'area_size is already NOT NULL';
    END IF;
END $$;

-- 4. Check RLS policies for land_listings
SELECT '=== RLS POLICIES FOR LAND_LISTINGS ===' as info;
SELECT
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'land_listings';

-- 5. Create proper RLS policies if they don't exist
DO $$
BEGIN
    -- Enable RLS
    ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
    
    -- Drop existing policies
    DROP POLICY IF EXISTS "Enable read access for all users" ON land_listings;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON land_listings;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON land_listings;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON land_listings;
    
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON land_listings FOR SELECT USING (true);
    CREATE POLICY "Enable insert for authenticated users only" ON land_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Enable update for users based on user_id" ON land_listings FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY "Enable delete for users based on user_id" ON land_listings FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'RLS policies created successfully';
END $$;

-- 6. Test insert
SELECT '=== TESTING INSERT ===' as info;
DO $$
DECLARE
    test_user_id uuid;
    test_result record;
BEGIN
    -- Get a test user ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found - skipping test insert';
        RETURN;
    END IF;
    
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
        'Test Land Fix',
        'Test Description',
        50000,
        1000,
        'hectare',
        'Test Location',
        'sale'
    ) RETURNING * INTO test_result;
    
    RAISE NOTICE 'Test insert successful: %', test_result.id;
    
    -- Clean up
    DELETE FROM land_listings WHERE id = test_result.id;
    RAISE NOTICE 'Test record cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Test insert failed: %', SQLERRM;
END $$;

SELECT '=== FIX COMPLETE ===' as info; 