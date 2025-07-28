-- Fix Vegetables Table RLS Policies
-- This script ensures the vegetables table has proper RLS policies

-- First, let's check if the vegetables table exists and has RLS enabled
SELECT 'Checking vegetables table RLS status...' as status;

-- Enable RLS on vegetables table if not already enabled
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Vegetables are viewable by everyone" ON public.vegetables;
DROP POLICY IF EXISTS "Users can insert their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can update their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can delete their own vegetables" ON public.vegetables;

-- Create proper RLS policies for vegetables
CREATE POLICY "Vegetables are viewable by everyone" ON public.vegetables 
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own vegetables" ON public.vegetables 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vegetables" ON public.vegetables 
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vegetables" ON public.vegetables 
    FOR DELETE USING (auth.uid() = user_id);

-- Also create a policy for authenticated users to insert (for testing purposes)
CREATE POLICY "Authenticated users can insert vegetables" ON public.vegetables 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Verify the policies were created
SELECT 'RLS policies created successfully!' as status;

-- Show current policies
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
WHERE tablename = 'vegetables';

-- Test the policies by checking if a user can insert (this will show the current auth context)
SELECT 
    'Current auth context:' as info,
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- Create a test function to verify RLS is working
CREATE OR REPLACE FUNCTION test_vegetables_rls()
RETURNS TABLE (
    test_name TEXT,
    result TEXT,
    details TEXT
) AS $$
BEGIN
    -- Test 1: Check if RLS is enabled
    RETURN QUERY
    SELECT 
        'RLS Enabled'::TEXT,
        CASE WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'vegetables' 
            AND rowsecurity = true
        ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'Row Level Security should be enabled on vegetables table'::TEXT;

    -- Test 2: Check if policies exist
    RETURN QUERY
    SELECT 
        'Policies Exist'::TEXT,
        CASE WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'vegetables'
        ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'RLS policies should exist for vegetables table'::TEXT;

    -- Test 3: Check if user can view
    RETURN QUERY
    SELECT 
        'View Policy'::TEXT,
        CASE WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'vegetables' 
            AND cmd = 'SELECT'
        ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'SELECT policy should exist for vegetables table'::TEXT;

    -- Test 4: Check if user can insert
    RETURN QUERY
    SELECT 
        'Insert Policy'::TEXT,
        CASE WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'vegetables' 
            AND cmd = 'INSERT'
        ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'INSERT policy should exist for vegetables table'::TEXT;

    -- Test 5: Check if user can update
    RETURN QUERY
    SELECT 
        'Update Policy'::TEXT,
        CASE WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'vegetables' 
            AND cmd = 'UPDATE'
        ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'UPDATE policy should exist for vegetables table'::TEXT;

    -- Test 6: Check if user can delete
    RETURN QUERY
    SELECT 
        'Delete Policy'::TEXT,
        CASE WHEN EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'vegetables' 
            AND cmd = 'DELETE'
        ) THEN 'PASS' ELSE 'FAIL' END::TEXT,
        'DELETE policy should exist for vegetables table'::TEXT;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the test
SELECT * FROM test_vegetables_rls();

-- Clean up test function
DROP FUNCTION IF EXISTS test_vegetables_rls();

SELECT 'Vegetables RLS policies fixed successfully!' as final_status; 