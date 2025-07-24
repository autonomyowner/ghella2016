-- Fix RLS policies for land_listings table
-- This script updates the policies to use user_id instead of seller_id

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'land_listings';

-- Drop existing policies that might be using seller_id
DROP POLICY IF EXISTS "Users can insert own land" ON land_listings;
DROP POLICY IF EXISTS "Users can update own land" ON land_listings;
DROP POLICY IF EXISTS "Users can delete own land" ON land_listings;
DROP POLICY IF EXISTS "Land is viewable by everyone" ON land_listings;

-- Create new policies using user_id
CREATE POLICY "Land is viewable by everyone" ON land_listings
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own land" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own land" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own land" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'land_listings' 
ORDER BY policyname;

-- Test query to see if we can read land listings
SELECT COUNT(*) as land_count FROM land_listings WHERE is_available = true; 