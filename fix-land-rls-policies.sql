-- Fix RLS policies for land_listings table
-- This script should be run in the Supabase SQL editor

-- Drop all existing policies for land_listings to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view available land" ON land_listings;
DROP POLICY IF EXISTS "Authenticated users can insert land listings" ON land_listings;
DROP POLICY IF EXISTS "Land is viewable by everyone" ON land_listings;
DROP POLICY IF EXISTS "Land listings are viewable by everyone" ON land_listings;
DROP POLICY IF EXISTS "Users can delete own land" ON land_listings;
DROP POLICY IF EXISTS "Users can delete own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can delete their own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can insert own land" ON land_listings;
DROP POLICY IF EXISTS "Users can insert own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can insert their own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can update own land" ON land_listings;
DROP POLICY IF EXISTS "Users can update own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can update their own land listings" ON land_listings;
DROP POLICY IF EXISTS "Users can view own land" ON land_listings;
DROP POLICY IF EXISTS "land_listings_delete_policy" ON land_listings;
DROP POLICY IF EXISTS "land_listings_insert_policy" ON land_listings;
DROP POLICY IF EXISTS "land_listings_select_policy" ON land_listings;
DROP POLICY IF EXISTS "land_listings_update_policy" ON land_listings;

-- Create clean, simple RLS policies
CREATE POLICY "land_listings_select_policy" ON land_listings
    FOR SELECT USING (true);

CREATE POLICY "land_listings_insert_policy" ON land_listings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "land_listings_update_policy" ON land_listings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "land_listings_delete_policy" ON land_listings
    FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'land_listings' 
ORDER BY policyname;