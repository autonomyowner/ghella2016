-- Test Land Listings INSERT with RLS
-- This script tests if land_listings INSERT works properly

-- Check current auth context
SELECT 
    'Current auth context:' as info,
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- Test 1: Try to insert with all required fields
DO $$
BEGIN
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
        'أرض اختبار INSERT',
        'اختبار إدراج أرض مع جميع الحقول المطلوبة',
        150000.00,
        'DZD',
        'sale',
        10.5,
        'hectare',
        'تيارت',
        true
    );
    
    RAISE NOTICE '✅ Test 1 PASSED: Insert successful with all required fields';
    
    -- Clean up
    DELETE FROM public.land_listings WHERE title = 'أرض اختبار INSERT';
    RAISE NOTICE '🧹 Test data cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 1 FAILED: %', SQLERRM;
END $$;

-- Test 2: Try to insert with missing area_size (should fail)
DO $$
BEGIN
    INSERT INTO public.land_listings (
        user_id,
        title,
        description,
        price,
        currency,
        listing_type,
        -- area_size missing (should cause not-null constraint error)
        area_unit,
        location,
        is_available
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'أرض اختبار بدون area_size',
        'اختبار إدراج أرض بدون area_size',
        100000.00,
        'DZD',
        'sale',
        'hectare',
        'سطيف',
        true
    );
    
    RAISE NOTICE '❌ Test 2 FAILED: Should have failed with missing area_size';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '✅ Test 2 PASSED: Correctly rejected missing area_size';
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 2 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 3: Try to insert with missing user_id (should fail)
DO $$
BEGIN
    INSERT INTO public.land_listings (
        -- user_id missing (should cause RLS error)
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
        'أرض اختبار بدون user_id',
        'اختبار إدراج أرض بدون user_id',
        200000.00,
        'DZD',
        'sale',
        15.0,
        'hectare',
        'وهران',
        true
    );
    
    RAISE NOTICE '❌ Test 3 FAILED: Should have failed with missing user_id';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '✅ Test 3 PASSED: Correctly rejected missing user_id - %', SQLERRM;
END $$;

-- Show current land listings count
SELECT 
    'Current land listings:' as info,
    COUNT(*) as total_count
FROM public.land_listings;

-- Show sample land listings
SELECT 
    title,
    price,
    currency,
    listing_type,
    area_size,
    area_unit,
    location,
    is_available
FROM public.land_listings
LIMIT 5;

SELECT 'Land listings INSERT tests completed!' as final_status; 