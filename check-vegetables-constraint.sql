-- Check Vegetables Freshness Constraint
-- Run this in Supabase SQL Editor

-- 1. Check what the constraint allows
SELECT '=== VEGETABLES FRESHNESS CONSTRAINT ===' as info;
SELECT
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'vegetables'::regclass
AND contype = 'c'
AND conname LIKE '%freshness%';

-- 2. Check what values are currently in the freshness column
SELECT '=== CURRENT FRESHNESS VALUES ===' as info;
SELECT DISTINCT freshness FROM vegetables LIMIT 10;

-- 3. Check the vegetables table structure
SELECT '=== VEGETABLES TABLE STRUCTURE ===' as info;
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'vegetables'
ORDER BY ordinal_position;

-- 4. Test different freshness values
SELECT '=== TESTING FRESHNESS VALUES ===' as info;
DO $$
DECLARE
    test_user_id uuid;
    test_result record;
    freshness_values text[] := ARRAY['fresh', 'very_fresh', 'new', 'excellent', 'good'];
    current_freshness text;
BEGIN
    -- Get a test user ID
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Using test user ID: %', test_user_id;
    
    -- Test each freshness value
    FOREACH current_freshness IN ARRAY freshness_values
    LOOP
        BEGIN
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
                packaging,
                harvest_date
            ) VALUES (
                test_user_id,
                'Test Vegetable ' || current_freshness,
                'Test Description',
                100,
                'tomatoes',
                10,
                'kg',
                current_freshness,
                false,
                'Test Location',
                'plastic_bag',
                CURRENT_DATE
            ) RETURNING * INTO test_result;
            
            RAISE NOTICE 'Freshness value "%" works! ID: %', current_freshness, test_result.id;
            
            -- Clean up
            DELETE FROM vegetables WHERE id = test_result.id;
            RAISE NOTICE 'Test record cleaned up for %', current_freshness;
            
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Freshness value "%" failed: %', current_freshness, SQLERRM;
        END;
    END LOOP;
END $$;

-- 5. Check RLS status for vegetables
SELECT '=== VEGETABLES RLS STATUS ===' as info;
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'vegetables';

SELECT '=== VEGETABLES RLS POLICIES ===' as info;
SELECT
    policyname,
    cmd,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'vegetables';

SELECT '=== VEGETABLES CONSTRAINT CHECK COMPLETE ===' as info; 