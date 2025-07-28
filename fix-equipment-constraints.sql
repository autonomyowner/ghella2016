-- Fix Equipment Table Constraints
-- This script checks and fixes foreign key constraints that might be causing UUID errors

-- First, let's check the current table structure and constraints
SELECT 'Current equipment table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check for foreign key constraints
SELECT 'Foreign key constraints on equipment table:' as info;
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'equipment'
    AND tc.table_schema = 'public';

-- Check if category_id has a foreign key constraint
SELECT 'Checking category_id foreign key constraint:' as info;
SELECT 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'equipment'
    AND kcu.column_name = 'category_id'
    AND tc.table_schema = 'public';

-- Drop the foreign key constraint if it exists (this will allow NULL values)
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Find the foreign key constraint name for category_id
    SELECT tc.constraint_name INTO constraint_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' 
        AND tc.table_name = 'equipment'
        AND kcu.column_name = 'category_id'
        AND tc.table_schema = 'public';
    
    -- Drop the constraint if it exists
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.equipment DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped foreign key constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No foreign key constraint found on category_id';
    END IF;
END $$;

-- Make sure category_id is nullable
ALTER TABLE public.equipment ALTER COLUMN category_id DROP NOT NULL;

-- Verify the changes
SELECT 'Final equipment table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test inserting a record without category_id
SELECT 'Testing insert without category_id...' as info;
INSERT INTO public.equipment (
    user_id, 
    title, 
    description, 
    price, 
    condition, 
    location, 
    contact_phone,
    currency,
    is_available,
    is_featured,
    view_count
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001', -- Use an existing user ID
    'Test Equipment',
    'Test description',
    1000.00,
    'good',
    'Test Location',
    '0770123456',
    'DZD',
    true,
    false,
    0
) RETURNING id, title, category_id;

-- Clean up the test record
DELETE FROM public.equipment WHERE title = 'Test Equipment'; 