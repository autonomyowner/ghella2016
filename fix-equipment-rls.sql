-- Fix RLS policies for equipment table
-- This script updates the policies to use user_id instead of seller_id

-- First, let's check what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'equipment';

-- Drop existing policies that might be using seller_id
DROP POLICY IF EXISTS "Users can insert own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can update own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can delete own equipment" ON equipment;
DROP POLICY IF EXISTS "Equipment is viewable by everyone" ON equipment;

-- Create new policies using user_id
CREATE POLICY "Equipment is viewable by everyone" ON equipment
    FOR SELECT USING (is_available = true);

CREATE POLICY "Users can insert own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment" ON equipment
    FOR DELETE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'equipment' 
ORDER BY policyname;

-- Test query to see if we can read equipment
SELECT COUNT(*) as equipment_count FROM equipment WHERE is_available = true; 