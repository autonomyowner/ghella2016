-- Comprehensive RLS Policy Fix for All Tables
-- This script fixes RLS policies for equipment, land_listings, nurseries, and other main tables

-- ========================================
-- EQUIPMENT TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can update own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can delete own equipment" ON equipment;
DROP POLICY IF EXISTS "Equipment is viewable by everyone" ON equipment;

CREATE POLICY "Equipment is viewable by everyone" ON equipment
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment" ON equipment
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- LAND_LISTINGS TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own land" ON land_listings;
DROP POLICY IF EXISTS "Users can update own land" ON land_listings;
DROP POLICY IF EXISTS "Users can delete own land" ON land_listings;
DROP POLICY IF EXISTS "Land is viewable by everyone" ON land_listings;

CREATE POLICY "Land is viewable by everyone" ON land_listings
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own land" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own land" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own land" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- NURSERIES TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own nurseries" ON nurseries;
DROP POLICY IF EXISTS "Users can update own nurseries" ON nurseries;
DROP POLICY IF EXISTS "Users can delete own nurseries" ON nurseries;
DROP POLICY IF EXISTS "Nurseries are viewable by everyone" ON nurseries;

CREATE POLICY "Nurseries are viewable by everyone" ON nurseries
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own nurseries" ON nurseries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nurseries" ON nurseries
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nurseries" ON nurseries
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- ANIMAL_LISTINGS TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own animals" ON animal_listings;
DROP POLICY IF EXISTS "Users can update own animals" ON animal_listings;
DROP POLICY IF EXISTS "Users can delete own animals" ON animal_listings;
DROP POLICY IF EXISTS "Animals are viewable by everyone" ON animal_listings;

CREATE POLICY "Animals are viewable by everyone" ON animal_listings
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own animals" ON animal_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own animals" ON animal_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own animals" ON animal_listings
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- LABOR TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own labor" ON labor;
DROP POLICY IF EXISTS "Users can update own labor" ON labor;
DROP POLICY IF EXISTS "Users can delete own labor" ON labor;
DROP POLICY IF EXISTS "Labor is viewable by everyone" ON labor;

CREATE POLICY "Labor is viewable by everyone" ON labor
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own labor" ON labor
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own labor" ON labor
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own labor" ON labor
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- DELIVERY TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own delivery" ON delivery;
DROP POLICY IF EXISTS "Users can update own delivery" ON delivery;
DROP POLICY IF EXISTS "Users can delete own delivery" ON delivery;
DROP POLICY IF EXISTS "Delivery is viewable by everyone" ON delivery;

CREATE POLICY "Delivery is viewable by everyone" ON delivery
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own delivery" ON delivery
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own delivery" ON delivery
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own delivery" ON delivery
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- ANALYSIS TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own analysis" ON analysis;
DROP POLICY IF EXISTS "Users can update own analysis" ON analysis;
DROP POLICY IF EXISTS "Users can delete own analysis" ON analysis;
DROP POLICY IF EXISTS "Analysis is viewable by everyone" ON analysis;

CREATE POLICY "Analysis is viewable by everyone" ON analysis
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own analysis" ON analysis
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analysis" ON analysis
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analysis" ON analysis
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- VEGETABLES TABLE
-- ========================================
DROP POLICY IF EXISTS "Users can insert own vegetables" ON vegetables;
DROP POLICY IF EXISTS "Users can update own vegetables" ON vegetables;
DROP POLICY IF EXISTS "Users can delete own vegetables" ON vegetables;
DROP POLICY IF EXISTS "Vegetables are viewable by everyone" ON vegetables;

CREATE POLICY "Vegetables are viewable by everyone" ON vegetables
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own vegetables" ON vegetables
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vegetables" ON vegetables
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vegetables" ON vegetables
    FOR DELETE USING (auth.uid() = user_id);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check all policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename IN ('equipment', 'land_listings', 'nurseries', 'animal_listings', 'labor', 'delivery', 'analysis', 'vegetables')
ORDER BY tablename, policyname;

-- Test counts for each table
SELECT 'equipment' as table_name, COUNT(*) as count FROM equipment WHERE is_available = true
UNION ALL
SELECT 'land_listings' as table_name, COUNT(*) as count FROM land_listings WHERE is_available = true
UNION ALL
SELECT 'nurseries' as table_name, COUNT(*) as count FROM nurseries WHERE is_available = true
UNION ALL
SELECT 'animal_listings' as table_name, COUNT(*) as count FROM animal_listings WHERE is_available = true
UNION ALL
SELECT 'labor' as table_name, COUNT(*) as count FROM labor WHERE is_available = true
UNION ALL
SELECT 'delivery' as table_name, COUNT(*) as count FROM delivery WHERE is_available = true
UNION ALL
SELECT 'analysis' as table_name, COUNT(*) as count FROM analysis WHERE is_available = true
UNION ALL
SELECT 'vegetables' as table_name, COUNT(*) as count FROM vegetables WHERE is_available = true; 