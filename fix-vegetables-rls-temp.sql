-- Temporary Fix: Disable RLS for Vegetables Table (Testing Only)
-- WARNING: This is for testing purposes only. Do not use in production!

-- Disable RLS temporarily for testing
ALTER TABLE public.vegetables DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    'RLS Status:' as status,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'vegetables' 
            AND rowsecurity = false
        ) THEN 'DISABLED' 
        ELSE 'ENABLED' 
    END as rls_status;

-- Test insert without RLS
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
    '244a6faf-b6b4-461c-825a-4e6c7fcaf023', -- Test user ID
    'طماطم اختبار بدون RLS',
    'اختبار الإدراج بدون RLS',
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

SELECT 'Test insert successful without RLS!' as result;

-- Clean up test data
DELETE FROM public.vegetables WHERE title = 'طماطم اختبار بدون RLS';

SELECT 'Test data cleaned up' as cleanup_status;

-- IMPORTANT: Remember to re-enable RLS after testing
-- ALTER TABLE public.vegetables ENABLE ROW LEVEL SECURITY; 