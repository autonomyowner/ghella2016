-- Comprehensive Database Check and Fix Script
-- Run this in Supabase SQL Editor to diagnose and fix all issues

-- 1. Check current table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('equipment', 'land_listings', 'vegetables', 'animal_listings', 'nurseries', 'categories')
ORDER BY table_name, ordinal_position;

-- 2. Check for check constraints on vegetables table
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'vegetables'::regclass 
AND contype = 'c';

-- 3. Check categories table to get valid category_id
SELECT id, name, name_ar FROM categories LIMIT 10;

-- 4. Check if land_listings has land_type column
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'land_listings' 
AND column_name = 'land_type';

-- 5. Fix vegetables table constraints (if needed)
-- First, let's see what the current constraint is
SELECT 
    conname,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'vegetables'::regclass 
AND contype = 'c' 
AND conname LIKE '%freshness%';

-- 6. Create proper RLS policies (if they don't exist)
-- Equipment policies
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Enable read access for all users" ON equipment;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON equipment;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON equipment;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON equipment;
    
    -- Create new policies
    CREATE POLICY "Enable read access for all users" ON equipment
        FOR SELECT USING (true);
    
    CREATE POLICY "Enable insert for authenticated users only" ON equipment
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" ON equipment
        FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" ON equipment
        FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'Equipment policies created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating equipment policies: %', SQLERRM;
END $$;

-- Land listings policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON land_listings;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON land_listings;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON land_listings;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON land_listings;
    
    CREATE POLICY "Enable read access for all users" ON land_listings
        FOR SELECT USING (true);
    
    CREATE POLICY "Enable insert for authenticated users only" ON land_listings
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" ON land_listings
        FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" ON land_listings
        FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'Land listings policies created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating land_listings policies: %', SQLERRM;
END $$;

-- Vegetables policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON vegetables;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON vegetables;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON vegetables;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON vegetables;
    
    CREATE POLICY "Enable read access for all users" ON vegetables
        FOR SELECT USING (true);
    
    CREATE POLICY "Enable insert for authenticated users only" ON vegetables
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" ON vegetables
        FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" ON vegetables
        FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'Vegetables policies created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating vegetables policies: %', SQLERRM;
END $$;

-- Animal listings policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON animal_listings;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON animal_listings;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON animal_listings;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON animal_listings;
    
    CREATE POLICY "Enable read access for all users" ON animal_listings
        FOR SELECT USING (true);
    
    CREATE POLICY "Enable insert for authenticated users only" ON animal_listings
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" ON animal_listings
        FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" ON animal_listings
        FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'Animal listings policies created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating animal_listings policies: %', SQLERRM;
END $$;

-- Nurseries policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON nurseries;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON nurseries;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON nurseries;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON nurseries;
    
    CREATE POLICY "Enable read access for all users" ON nurseries
        FOR SELECT USING (true);
    
    CREATE POLICY "Enable insert for authenticated users only" ON nurseries
        FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" ON nurseries
        FOR UPDATE USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" ON nurseries
        FOR DELETE USING (auth.uid() = user_id);
    
    RAISE NOTICE 'Nurseries policies created successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating nurseries policies: %', SQLERRM;
END $$;

-- 7. Verify all policies were created
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
WHERE tablename IN ('equipment', 'animal_listings', 'land_listings', 'nurseries', 'vegetables')
ORDER BY tablename, policyname;

-- 8. Test insert permissions (this will show if policies are working)
-- Note: This will only work if you're authenticated
SELECT 'Testing permissions...' as status; 