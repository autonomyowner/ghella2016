-- Debug Equipment Insert - Find the UUID Error
-- This script will help us identify exactly what's causing the UUID error

-- First, let's see the exact table structure
SELECT '=== EQUIPMENT TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    ordinal_position
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check all constraints on the equipment table
SELECT '=== ALL CONSTRAINTS ON EQUIPMENT TABLE ===' as info;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    tc.is_deferrable,
    tc.initially_deferred
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
WHERE tc.table_name = 'equipment' 
    AND tc.table_schema = 'public'
ORDER BY tc.constraint_type, kcu.column_name;

-- Check foreign key constraints specifically
SELECT '=== FOREIGN KEY CONSTRAINTS ===' as info;
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
    AND tc.table_schema = 'public';

-- Check if there are any UUID columns that might be causing issues
SELECT '=== UUID COLUMNS ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'equipment' 
    AND table_schema = 'public'
    AND data_type = 'uuid'
ORDER BY ordinal_position;

-- Try to insert a minimal record to see what fails
SELECT '=== TESTING MINIMAL INSERT ===' as info;

-- First, let's see what user IDs exist
SELECT 'Available user IDs:' as info;
SELECT id, full_name FROM public.profiles LIMIT 5;

-- Now try a minimal insert
INSERT INTO public.equipment (
    user_id,
    title,
    price,
    condition,
    location,
    contact_phone,
    currency,
    is_available,
    is_featured,
    view_count
) VALUES (
    (SELECT id FROM public.profiles LIMIT 1), -- Use first available user
    'Test Equipment Debug',
    1000.00,
    'good',
    'Test Location',
    '0770123456',
    'DZD',
    true,
    false,
    0
) RETURNING id, title, user_id, category_id;

-- Clean up
DELETE FROM public.equipment WHERE title = 'Test Equipment Debug'; 