-- Temporarily disable triggers that might cause signup issues
-- Run this if you're still getting 500 errors during signup

-- Disable the handle_new_user trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Check if there are any other triggers on auth.users
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND event_object_schema = 'auth';

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE '🔧 Triggers disabled temporarily';
    RAISE NOTICE '✅ Try signing up now - should work without 500 errors';
    RAISE NOTICE '📝 You can re-enable triggers later if needed';
END $$; 