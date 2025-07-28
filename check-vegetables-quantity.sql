-- Simple Vegetables Quantity Fix
-- Run this in Supabase SQL Editor

-- Step 1: Check current RLS status
SELECT 'Current RLS Status:' as info;
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'vegetables';

-- Step 2: Check current policies
SELECT 'Current RLS Policies:' as info;
SELECT 
    policyname, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename = 'vegetables';

-- Step 3: Check table structure
SELECT 'Table Structure:' as info;
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
ORDER BY ordinal_position;

-- Step 4: Test insert with explicit quantity
SELECT 'Testing Insert:' as info;

DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get a test user
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NULL THEN
        RAISE NOTICE '❌ No users found';
        RETURN;
    END IF;
    
    RAISE NOTICE '✅ Testing with user: %', test_user_id;
    
    -- Test insert with EXPLICIT quantity
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        currency,
        quantity,  -- ← EXPLICIT quantity
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date,
        is_available
    ) VALUES (
        test_user_id,
        'طماطم اختبار',
        'اختبار quantity',
        'tomatoes',
        150.00,
        'د.ج',
        50,  -- ← EXPLICIT quantity value
        'kg',
        'excellent',
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '✅ Insert successful!';
    
    -- Clean up
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار';
    RAISE NOTICE '🧹 Cleaned up';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '❌ NOT NULL violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error: %', SQLERRM;
END $$; 