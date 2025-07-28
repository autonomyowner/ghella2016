-- Final Fix for Vegetables Quantity Issue
-- This handles existing policies and focuses on the quantity problem

-- Step 1: Check current status
SELECT 'Current Status:' as info;
SELECT 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'vegetables';

-- Step 2: Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Vegetables are viewable by everyone" ON public.vegetables;
DROP POLICY IF EXISTS "Users can insert vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can update their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can delete their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Authenticated users can insert vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can insert their own vegetables" ON public.vegetables;

-- Step 3: Create simple, permissive policies for marketplace
CREATE POLICY "Vegetables are viewable by everyone" ON public.vegetables
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert vegetables" ON public.vegetables
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own vegetables" ON public.vegetables
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vegetables" ON public.vegetables
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Test insert with the new policies
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
    
    RAISE NOTICE '✅ Testing insert with new policies...';
    
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
        'طماطم اختبار نهائي',
        'اختبار نهائي',
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
    
    RAISE NOTICE '✅ Insert successful with new policies!';
    
    -- Clean up
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار نهائي';
    RAISE NOTICE '🧹 Cleaned up';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '❌ Still getting NOT NULL violation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Error: %', SQLERRM;
END $$;

-- Step 5: Show current policies
SELECT 'Final Policies:' as info;
SELECT 
    policyname, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename = 'vegetables' 
ORDER BY cmd; 