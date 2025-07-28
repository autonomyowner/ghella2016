-- Debug Vegetables Insert Issue
-- This script will help identify why quantity is null

-- Step 1: Check current RLS status
SELECT 'Step 1: Checking RLS Status' as step;
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'vegetables';

-- Step 2: Check current RLS policies
SELECT 'Step 2: Checking RLS Policies' as step;
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

-- Step 3: Check table structure and constraints
SELECT 'Step 3: Checking Table Structure' as step;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    CASE 
        WHEN constraint_name IS NOT NULL THEN constraint_name
        ELSE 'No constraint'
    END as constraint_info
FROM information_schema.columns c
LEFT JOIN information_schema.table_constraints tc 
    ON c.table_name = tc.table_name 
    AND c.column_name = tc.constraint_name
WHERE c.table_name = 'vegetables' 
ORDER BY c.ordinal_position;

-- Step 4: Check CHECK constraints specifically
SELECT 'Step 4: Checking CHECK Constraints' as step;
SELECT 
    conname as constraint_name, 
    contype as constraint_type, 
    pg_get_constraintdef(oid) as constraint_definition 
FROM pg_constraint 
WHERE conrelid = 'vegetables'::regclass;

-- Step 5: Test insert with explicit data
SELECT 'Step 5: Testing Insert with Explicit Data' as step;

DO $$
DECLARE
    test_user_id UUID;
    insert_result RECORD;
BEGIN
    -- Get a test user
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE '❌ No users found in auth.users';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Found test user: %', test_user_id;
    
    -- Test insert with all required fields
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        currency,
        quantity,  -- This is the key field!
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date,
        is_available
    ) VALUES (
        test_user_id,
        'طماطم اختبار DEBUG',
        'اختبار إدراج مع quantity صريح',
        'tomatoes',
        150.00,
        'د.ج',
        50,  -- Explicit quantity
        'kg',
        'excellent',
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE,
        true
    ) RETURNING * INTO insert_result;
    
    RAISE NOTICE '✅ Insert successful! ID: %, Quantity: %', insert_result.id, insert_result.quantity;
    
    -- Clean up
    DELETE FROM public.vegetables WHERE id = insert_result.id;
    RAISE NOTICE '🧹 Cleaned up test data';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '❌ NOT NULL constraint violation: %', SQLERRM;
    WHEN check_violation THEN
        RAISE NOTICE '❌ CHECK constraint violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Unexpected error: %', SQLERRM;
END $$;

-- Step 6: Check if there are any triggers that might affect the insert
SELECT 'Step 6: Checking Triggers' as step;
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'vegetables';

-- Step 7: Test with current user context
SELECT 'Step 7: Testing with Current User Context' as step;
DO $$
BEGIN
    RAISE NOTICE 'Current user context: %', current_user;
    RAISE NOTICE 'Current role: %', current_role;
    RAISE NOTICE 'Current session user: %', session_user;
END $$; 