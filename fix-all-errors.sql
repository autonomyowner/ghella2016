-- Comprehensive Fix for All Errors
-- Run this in Supabase SQL Editor to fix all issues

-- 1. First, let's check what we're working with
SELECT '=== DATABASE DIAGNOSTIC ===' as info;

-- Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('equipment', 'land_listings', 'vegetables', 'animal_listings', 'nurseries')
ORDER BY table_name, ordinal_position;

-- 2. Check vegetables freshness constraint
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'vegetables'::regclass 
AND contype = 'c' 
AND conname LIKE '%freshness%';

-- 3. Get valid category IDs
SELECT '=== CATEGORIES ===' as info;
SELECT id, name, name_ar FROM categories ORDER BY name;

-- 4. Fix RLS Policies (this is the main issue)
SELECT '=== FIXING RLS POLICIES ===' as info;

-- Enable RLS on all tables
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vegetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE animal_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurseries ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON equipment;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON equipment;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON equipment;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON equipment;

DROP POLICY IF EXISTS "Enable read access for all users" ON land_listings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON land_listings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON land_listings;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON land_listings;

DROP POLICY IF EXISTS "Enable read access for all users" ON vegetables;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON vegetables;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON vegetables;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON vegetables;

DROP POLICY IF EXISTS "Enable read access for all users" ON animal_listings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON animal_listings;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON animal_listings;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON animal_listings;

DROP POLICY IF EXISTS "Enable read access for all users" ON nurseries;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON nurseries;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON nurseries;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON nurseries;

-- Create new policies for equipment
CREATE POLICY "Enable read access for all users" ON equipment
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON equipment
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON equipment
    FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for land_listings
CREATE POLICY "Enable read access for all users" ON land_listings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for vegetables
CREATE POLICY "Enable read access for all users" ON vegetables
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON vegetables
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON vegetables
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON vegetables
    FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for animal_listings
CREATE POLICY "Enable read access for all users" ON animal_listings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON animal_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON animal_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON animal_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Create new policies for nurseries
CREATE POLICY "Enable read access for all users" ON nurseries
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON nurseries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON nurseries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON nurseries
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Verify policies were created
SELECT '=== VERIFYING POLICIES ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename IN ('equipment', 'land_listings', 'vegetables', 'animal_listings', 'nurseries')
ORDER BY tablename, policyname;

-- 6. Test data for each table (commented out - uncomment to test)
/*
-- Test vegetables insert (uncomment to test)
INSERT INTO vegetables (
    user_id, title, description, price, currency, 
    vegetable_type, quantity, unit, freshness, organic, 
    location, packaging
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user_id
    'Test Tomato',
    'Test description',
    100,
    'DZD',
    'tomatoes',
    10,
    'kg',
    'fresh',
    false,
    'Test Location',
    'plastic_bag'
);

-- Test land_listings insert (uncomment to test)
INSERT INTO land_listings (
    user_id, title, description, price, currency,
    listing_type, area_size, area_unit, location
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user_id
    'Test Land',
    'Test description',
    50000,
    'DZD',
    'sale',
    1000,
    'm2',
    'Test Location'
);

-- Test equipment insert (uncomment to test)
INSERT INTO equipment (
    user_id, title, description, price, currency,
    category_id, condition, location
) VALUES (
    '00000000-0000-0000-0000-000000000001', -- Replace with real user_id
    'Test Equipment',
    'Test description',
    1000,
    'DZD',
    '00000000-0000-0000-0000-000000000001', -- Replace with real category_id
    'good',
    'Test Location'
);
*/

SELECT '=== FIX COMPLETE ===' as info;
SELECT 'All RLS policies have been created successfully.' as status;
SELECT 'Please run the test pages to verify the fixes work.' as next_step; 