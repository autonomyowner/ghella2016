-- Check Land Listings RLS Status
-- Run this first to see what's currently configured

-- Check if RLS is enabled
SELECT 
    'Land Listings RLS Status:' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'land_listings' 
            AND rowsecurity = true
        ) THEN 'ENABLED' 
        ELSE 'DISABLED' 
    END as rls_status;

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
WHERE tablename = 'land_listings'
ORDER BY cmd;

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'land_listings' 
ORDER BY ordinal_position;

-- Check if there are any existing records
SELECT COUNT(*) as total_land_listings FROM land_listings; 