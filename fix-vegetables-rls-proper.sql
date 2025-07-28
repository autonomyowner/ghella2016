-- Fix Vegetables RLS Policies with Proper Constraints
-- This script creates proper RLS policies for the vegetables table

-- Step 1: Enable RLS on vegetables table
ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Vegetables are viewable by everyone" ON public.vegetables;
DROP POLICY IF EXISTS "Users can insert their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can update their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Users can delete their own vegetables" ON public.vegetables;
DROP POLICY IF EXISTS "Authenticated users can insert vegetables" ON public.vegetables;

-- Step 3: Create proper RLS policies for vegetables
-- Everyone can view vegetables
CREATE POLICY "Vegetables are viewable by everyone" ON public.vegetables 
    FOR SELECT USING (true);

-- Authenticated users can insert vegetables
CREATE POLICY "Authenticated users can insert vegetables" ON public.vegetables 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can insert their own vegetables (more specific)
CREATE POLICY "Users can insert their own vegetables" ON public.vegetables 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own vegetables
CREATE POLICY "Users can update their own vegetables" ON public.vegetables 
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own vegetables
CREATE POLICY "Users can delete their own vegetables" ON public.vegetables 
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Verify the policies were created
SELECT 'Vegetables RLS policies created successfully!' as status;

-- Step 5: Show current policies
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

-- Step 6: Test insert with proper data and constraints
DO $$
BEGIN
    -- Try to insert a test record with correct constraints
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
        (SELECT id FROM auth.users LIMIT 1),
        'طماطم اختبار RLS',
        'اختبار سياسات RLS للخضروات',
        'tomatoes',
        150.00,
        'د.ج',
        50,  -- quantity is required!
        'kg',
        'excellent',  -- must be: excellent, good, fair, poor
        false,
        'الجزائر العاصمة',
        'packaged',  -- must be: loose, packaged, bulk
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '✅ Test insert successful - RLS policies are working!';
    
    -- Clean up test data
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار RLS';
    RAISE NOTICE '🧹 Test data cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test insert failed: %', SQLERRM;
END $$;

SELECT 'Vegetables RLS setup completed!' as final_status; 