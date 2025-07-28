-- Simple Fix for Vegetables Quantity Issue
-- Run this in Supabase SQL Editor

-- Step 1: Disable RLS temporarily to test
ALTER TABLE public.vegetables DISABLE ROW LEVEL SECURITY;

-- Step 2: Test insert without RLS
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
    
    RAISE NOTICE '✅ Testing insert without RLS...';
    
    -- Test insert
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        currency,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date,
        is_available
    ) VALUES (
        test_user_id,
        'طماطم اختبار بدون RLS',
        'اختبار بدون RLS',
        'tomatoes',
        150.00,
        'د.ج',
        50,
        'kg',
        'excellent',
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '✅ Insert successful without RLS!';
    
    -- Clean up
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار بدون RLS';
    RAISE NOTICE '🧹 Cleaned up';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '❌ Still getting NOT NULL violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error: %', SQLERRM;
END $$;

-- Step 3: If successful, create proper RLS policies
CREATE POLICY "Vegetables are viewable by everyone" ON public.vegetables
    FOR SELECT USING (true);

CREATE POLICY "Users can insert vegetables" ON public.vegetables
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vegetables" ON public.vegetables
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vegetables" ON public.vegetables
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Re-enable RLS
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;

-- Step 5: Test with RLS enabled
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
    
    RAISE NOTICE '✅ Testing insert with RLS enabled...';
    
    -- Test insert with RLS
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        currency,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date,
        is_available
    ) VALUES (
        test_user_id,
        'طماطم اختبار مع RLS',
        'اختبار مع RLS',
        'tomatoes',
        150.00,
        'د.ج',
        50,
        'kg',
        'excellent',
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '✅ Insert successful with RLS!';
    
    -- Clean up
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار مع RLS';
    RAISE NOTICE '🧹 Cleaned up';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '❌ Still getting NOT NULL violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error: %', SQLERRM;
END $$; 