-- =====================================================
-- Clear Test Data from Communication Tables
-- =====================================================

-- Clear contact messages (keep only real submissions)
DELETE FROM contact_messages 
WHERE email LIKE '%test%' 
   OR email LIKE '%example%' 
   OR name LIKE '%Test%' 
   OR name LIKE '%API%'
   OR subject LIKE '%Test%'
   OR subject LIKE '%API%';

-- Clear newsletter subscriptions (keep only real subscriptions)
DELETE FROM newsletter_subscriptions 
WHERE email LIKE '%test%' 
   OR email LIKE '%example%'
   OR full_name LIKE '%Test%'
   OR full_name LIKE '%API%';

-- Clear expert applications (keep only real applications)
DELETE FROM expert_applications 
WHERE email LIKE '%test%' 
   OR email LIKE '%example%'
   OR full_name LIKE '%Test%'
   OR full_name LIKE '%API%'
   OR specialization LIKE '%Test%';

-- Clear admin messages (keep only real messages)
DELETE FROM admin_messages 
WHERE title LIKE '%Test%' 
   OR title LIKE '%API%'
   OR message LIKE '%Test%'
   OR message LIKE '%API%';

-- Display results
SELECT '✅ Test data cleared successfully!' as status;
SELECT '📊 Remaining data:' as info;

-- Show remaining data counts
SELECT 
    'contact_messages' as table_name,
    COUNT(*) as remaining_count
FROM contact_messages
UNION ALL
SELECT 
    'newsletter_subscriptions' as table_name,
    COUNT(*) as remaining_count
FROM newsletter_subscriptions
UNION ALL
SELECT 
    'expert_applications' as table_name,
    COUNT(*) as remaining_count
FROM expert_applications
UNION ALL
SELECT 
    'admin_messages' as table_name,
    COUNT(*) as remaining_count
FROM admin_messages; 