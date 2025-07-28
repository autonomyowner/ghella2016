-- Test Vegetables Table Constraints
-- This script tests that all constraints are working correctly

-- Test 1: Valid data insertion (should succeed)
SELECT 'Test 1: Valid data insertion' as test_name;

INSERT INTO public.vegetables (
    user_id,
    title,
    description,
    vegetable_type,
    price,
    quantity,
    unit,
    freshness,
    organic,
    location,
    packaging,
    harvest_date
) VALUES (
    (SELECT id FROM auth.users LIMIT 1),
    'طماطم اختبار صحيحة',
    'اختبار الإدراج الصحيح',
    'tomatoes',
    100.00,
    10,
    'kg',
    'excellent',
    false,
    'الجزائر العاصمة',
    'packaged',
    CURRENT_DATE
);

SELECT '✅ Test 1 PASSED: Valid data inserted successfully' as result;

-- Test 2: Invalid freshness value (should fail)
SELECT 'Test 2: Invalid freshness value' as test_name;

DO $$
BEGIN
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'طماطم اختبار خاطئة',
        'اختبار قيمة freshness خاطئة',
        'tomatoes',
        100.00,
        10,
        'kg',
        'fresh', -- Invalid value
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE
    );
    
    RAISE EXCEPTION 'Test 2 FAILED: Should have failed with invalid freshness';
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '✅ Test 2 PASSED: Correctly rejected invalid freshness value';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Test 2 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 3: Invalid packaging value (should fail)
SELECT 'Test 3: Invalid packaging value' as test_name;

DO $$
BEGIN
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'طماطم اختبار خاطئة',
        'اختبار قيمة packaging خاطئة',
        'tomatoes',
        100.00,
        10,
        'kg',
        'excellent',
        false,
        'الجزائر العاصمة',
        'plastic_bag', -- Invalid value
        CURRENT_DATE
    );
    
    RAISE EXCEPTION 'Test 3 FAILED: Should have failed with invalid packaging';
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '✅ Test 3 PASSED: Correctly rejected invalid packaging value';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Test 3 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 4: Invalid vegetable_type value (should fail)
SELECT 'Test 4: Invalid vegetable_type value' as test_name;

DO $$
BEGIN
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'طماطم اختبار خاطئة',
        'اختبار قيمة vegetable_type خاطئة',
        'invalid_type', -- Invalid value
        100.00,
        10,
        'kg',
        'excellent',
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE
    );
    
    RAISE EXCEPTION 'Test 4 FAILED: Should have failed with invalid vegetable_type';
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '✅ Test 4 PASSED: Correctly rejected invalid vegetable_type value';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Test 4 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 5: Invalid unit value (should fail)
SELECT 'Test 5: Invalid unit value' as test_name;

DO $$
BEGIN
    INSERT INTO public.vegetables (
        user_id,
        title,
        description,
        vegetable_type,
        price,
        quantity,
        unit,
        freshness,
        organic,
        location,
        packaging,
        harvest_date
    ) VALUES (
        (SELECT id FROM auth.users LIMIT 1),
        'طماطم اختبار خاطئة',
        'اختبار قيمة unit خاطئة',
        'tomatoes',
        100.00,
        10,
        'invalid_unit', -- Invalid value
        'excellent',
        false,
        'الجزائر العاصمة',
        'packaged',
        CURRENT_DATE
    );
    
    RAISE EXCEPTION 'Test 5 FAILED: Should have failed with invalid unit';
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE '✅ Test 5 PASSED: Correctly rejected invalid unit value';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Test 5 FAILED: Unexpected error: %', SQLERRM;
END $$;

-- Test 6: Test all valid freshness values
SELECT 'Test 6: All valid freshness values' as test_name;

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
                quantity,
                unit,
                freshness,
                organic,
                location,
                packaging,
                harvest_date
            ) VALUES (
                (SELECT id FROM auth.users LIMIT 1),
                'طماطم اختبار ' || freshness_value,
                'اختبار قيمة freshness: ' || freshness_value,
                'tomatoes',
                100.00,
                10,
                'kg',
                freshness_value,
                false,
                'الجزائر العاصمة',
                'packaged',
                CURRENT_DATE
            );
            
            test_count := test_count + 1;
            RAISE NOTICE '✅ Valid freshness value "%" inserted successfully', freshness_value;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION '❌ Failed to insert valid freshness value "%": %', freshness_value, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✅ Test 6 PASSED: All % valid freshness values inserted successfully', test_count;
END $$;

-- Test 7: Test all valid packaging values
SELECT 'Test 7: All valid packaging values' as test_name;

DO $$
DECLARE
    packaging_value TEXT;
    test_count INTEGER := 0;
BEGIN
    FOR packaging_value IN SELECT unnest(ARRAY['loose', 'packaged', 'bulk']) LOOP
        BEGIN
            INSERT INTO public.vegetables (
                user_id,
                title,
                description,
                vegetable_type,
                price,
                quantity,
                unit,
                freshness,
                organic,
                location,
                packaging,
                harvest_date
            ) VALUES (
                (SELECT id FROM auth.users LIMIT 1),
                'طماطم اختبار ' || packaging_value,
                'اختبار قيمة packaging: ' || packaging_value,
                'tomatoes',
                100.00,
                10,
                'kg',
                'excellent',
                false,
                'الجزائر العاصمة',
                packaging_value,
                CURRENT_DATE
            );
            
            test_count := test_count + 1;
            RAISE NOTICE '✅ Valid packaging value "%" inserted successfully', packaging_value;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE EXCEPTION '❌ Failed to insert valid packaging value "%": %', packaging_value, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '✅ Test 7 PASSED: All % valid packaging values inserted successfully', test_count;
END $$;

-- Clean up test data
DELETE FROM public.vegetables WHERE title LIKE '%اختبار%';

SELECT '🧹 Test data cleaned up' as cleanup_status;
SELECT '🎉 All constraint tests completed successfully!' as final_status; 