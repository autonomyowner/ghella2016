-- Test Vegetables INSERT with RLS and Constraints
-- This script tests if vegetables INSERT works properly

-- Check current auth context
SELECT 
    'Current auth context:' as info,
    auth.uid() as current_user_id,
    auth.role() as current_role;

-- Test 1: Try to insert with all required fields and correct constraints
DO $$
BEGIN
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
        'طماطم اختبار INSERT',
        'اختبار إدراج خضروات مع جميع الحقول المطلوبة',
        'tomatoes',
        200.00,
        'د.ج',
        100,  -- quantity is required!
        'kg',
        'excellent',  -- must be: excellent, good, fair, poor
        true,
        'الجزائر العاصمة',
        'packaged',  -- must be: loose, packaged, bulk
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '✅ Test 1 PASSED: Insert successful with all required fields';
    
    -- Clean up
    DELETE FROM public.vegetables WHERE title = 'طماطم اختبار INSERT';
    RAISE NOTICE '🧹 Test data cleaned up';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 1 FAILED: %', SQLERRM;
END $$;

-- Test 2: Try to insert with missing quantity (should fail)
DO $$
BEGIN
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        currency,
        -- quantity missing (should cause not-null constraint error)
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date,
        is_available
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'طماطم اختبار بدون quantity',
        'اختبار إدراج خضروات بدون quantity',
        'tomatoes',
        150.00,
        'د.ج',
        'kg',
        'excellent',
        false,
        'سطيف',
        'packaged',
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '❌ Test 2 FAILED: Should have failed with missing quantity';
    
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE '✅ Test 2 PASSED: Correctly rejected missing quantity';
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 2 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 3: Try to insert with wrong freshness value (should fail)
DO $$
BEGIN
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
        'طماطم اختبار freshness خاطئ',
        'اختبار إدراج خضروات مع freshness خاطئ',
        'tomatoes',
        120.00,
        'د.ج',
        75,
        'kg',
        'fresh',  -- wrong value! should be: excellent, good, fair, poor
        false,
        'وهران',
        'packaged',
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '❌ Test 3 FAILED: Should have failed with wrong freshness';
    
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '✅ Test 3 PASSED: Correctly rejected wrong freshness value';
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 3 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 4: Try to insert with wrong packaging value (should fail)
DO $$
BEGIN
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
        'طماطم اختبار packaging خاطئ',
        'اختبار إدراج خضروات مع packaging خاطئ',
        'tomatoes',
        180.00,
        'د.ج',
        60,
        'kg',
        'excellent',
        true,
        'قسنطينة',
        'plastic_bag',  -- wrong value! should be: loose, packaged, bulk
        CURRENT_DATE,
        true
    );
    
    RAISE NOTICE '❌ Test 4 FAILED: Should have failed with wrong packaging';
    
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '✅ Test 4 PASSED: Correctly rejected wrong packaging value';
    WHEN OTHERS THEN
        RAISE NOTICE '❌ Test 4 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 5: Try all valid freshness values
DO $$
DECLARE
    freshness_value TEXT;
    test_count INTEGER := 0;
BEGIN
    FOR freshness_value IN SELECT unnest(ARRAY['excellent', 'good', 'fair', 'poor']) LOOP
        BEGIN
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
                'طماطم اختبار ' || freshness_value,
                'اختبار قيمة freshness: ' || freshness_value,
                'tomatoes',
                100.00,
                'د.ج',
                25,
                'kg',
                freshness_value,
                false,
                'الجزائر العاصمة',
                'packaged',
                CURRENT_DATE,
                true
            );
            
            test_count := test_count + 1;
            RAISE NOTICE '✅ Valid freshness value "%" inserted successfully', freshness_value;
            
            -- Clean up
            DELETE FROM public.vegetables WHERE title = 'طماطم اختبار ' || freshness_value;
            
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION '❌ Failed to insert valid freshness value "%": %', freshness_value, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✅ Test 5 PASSED: All % valid freshness values inserted successfully', test_count;
END $$;

-- Show current vegetables count
SELECT 
    'Current vegetables:' as info,
    COUNT(*) as total_count
FROM public.vegetables;

-- Show sample vegetables
SELECT 
    title,
    price,
    currency,
    vegetable_type,
    quantity,
    unit,
    freshness,
    packaging,
    location,
    is_available
FROM public.vegetables
LIMIT 5;

SELECT 'Vegetables INSERT tests completed!' as final_status; 