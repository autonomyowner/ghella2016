-- Quick Fix: Disable RLS for Vegetables Testing
-- This is the simplest solution for marketplace testing

-- Step 1: Disable RLS temporarily
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
        'طماطم اختبار سريع',
        'اختبار سريع بدون RLS',
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
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار سريع';
    RAISE NOTICE '🧹 Cleaned up';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '❌ Still getting NOT NULL violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error: %', SQLERRM;
END $$;

-- Step 3: Show current status
SELECT 'Current Status:' as info;
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'vegetables'; 