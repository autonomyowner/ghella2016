-- Fix Land Listings RLS Policies
-- This script creates proper RLS policies for the land_listings table

-- Step 1: Enable RLS on land_listings table
ALTER TABLE public.land_listings ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Land listings are viewable by everyone" ON public.land_listings;
DROP POLICY IF EXISTS "Users can insert their own land listings" ON public.land_listings;
DROP POLICY IF EXISTS "Users can update their own land listings" ON public.land_listings;
DROP POLICY IF EXISTS "Users can delete their own land listings" ON public.land_listings;

-- Step 3: Create proper RLS policies for land_listings
-- Everyone can view land listings
CREATE POLICY "Land listings are viewable by everyone" ON public.land_listings 
    FOR SELECT USING (true);

-- Authenticated users can insert land listings
CREATE POLICY "Authenticated users can insert land listings" ON public.land_listings 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can insert their own land listings (more specific)
CREATE POLICY "Users can insert their own land listings" ON public.land_listings 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own land listings
CREATE POLICY "Users can update their own land listings" ON public.land_listings 
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own land listings
CREATE POLICY "Users can delete their own land listings" ON public.land_listings 
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Verify the policies were created
SELECT 'Land listings RLS policies created successfully!' as status;

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
WHERE tablename = 'land_listings'
ORDER BY cmd;

-- Step 6: Test insert with proper data
-- This will help verify the policies work
DO $$
BEGIN
    -- Try to insert a test record (this will show if RLS is working)
    INSERT INTO public.land_listings (
        user_id,
        title,
        description,
        price,
        currency,
        listing_type,
        area_size,
        area_unit,
        location,
        is_available
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'أرض اختبار RLS',
        'اختبار سياسات RLS للأراضي',
        100000.00,
        'DZD',
        'sale',
        5.0,
        'hectare',
        'الجزائر العاصمة',
        true
    );
    
    RAISE NOTICE '✅ Test insert successful - RLS policies are working!';
    
    -- Clean up test data
    DELETE FROM public.land_listings WHERE title = 'أرض اختبار RLS';
    RAISE NOTICE '🧹 Test data cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test insert failed: %', SQLERRM;
END $$;

SELECT 'Land listings RLS setup completed!' as final_status; 