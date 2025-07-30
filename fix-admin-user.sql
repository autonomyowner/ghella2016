-- =====================================================
-- Fix Admin User Access
-- =====================================================

-- First, let's check the profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND table_schema = 'public';

-- Check if your user exists in auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'psy.zellag22@gmail.com';

-- Check if your profile exists
SELECT id, full_name, user_type, created_at 
FROM profiles 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'psy.zellag22@gmail.com'
);

-- Set your user as admin (using the correct user ID)
UPDATE profiles 
SET user_type = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'psy.zellag22@gmail.com'
);

-- Verify the update
SELECT id, full_name, user_type, created_at 
FROM profiles 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'psy.zellag22@gmail.com'
);

-- If no profile exists, create one
INSERT INTO profiles (id, full_name, user_type)
SELECT 
  id,
  'Admin User',
  'admin'
FROM auth.users 
WHERE email = 'psy.zellag22@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE id = auth.users.id
);

SELECT '✅ Admin user setup completed!' as status; 