-- Check Vegetables RLS Status
-- Run this first to see what's currently configured

-- Check if RLS is enabled
SELECT 
    'Vegetables RLS Status:' as info,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'vegetables' 
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
WHERE tablename = 'vegetables'
ORDER BY cmd;

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
ORDER BY ordinal_position;

-- Check constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'vegetables'::regclass;

-- Check if there are any existing records
SELECT COUNT(*) as total_vegetables FROM vegetables; 