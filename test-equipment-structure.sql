-- Test Equipment Table Structure
-- This script checks the current structure of the equipment table

SELECT 'Current equipment table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if contact_phone exists
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'equipment' 
            AND column_name = 'contact_phone'
            AND table_schema = 'public'
        ) 
        THEN '✅ contact_phone column EXISTS' 
        ELSE '❌ contact_phone column MISSING' 
    END as contact_phone_status;

-- Check if category_id is nullable
SELECT 
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'equipment' 
            AND column_name = 'category_id'
            AND table_schema = 'public'
            AND is_nullable = 'YES'
        ) 
        THEN '✅ category_id is NULLABLE' 
        ELSE '❌ category_id is NOT NULL' 
    END as category_id_status; 