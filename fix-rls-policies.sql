-- Fix RLS policies to use user_id instead of seller_id
-- This script updates the policies to match the actual database schema

-- Drop existing policies that use seller_id
DROP POLICY IF EXISTS "Users can insert own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can update own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can delete own equipment" ON equipment;

DROP POLICY IF EXISTS "Users can insert own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can update own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can delete own land listings" ON land_listings;

-- Create new policies using user_id
CREATE POLICY "Users can insert own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment" ON equipment
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own land listings" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own land listings" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own land listings" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('equipment', 'land_listings') 
ORDER BY tablename, policyname; 