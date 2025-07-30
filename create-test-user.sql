-- Create Test User for Debugging
-- Run this in your Supabase SQL Editor

-- First, let's check if we can create a test user
-- Note: This will create a user in the auth.users table
-- You'll need to use Supabase Auth API or Dashboard to create users

-- Check existing users
SELECT 
  'Existing users:' as info,
  COUNT(*) as user_count
FROM auth.users;

-- Check existing profiles
SELECT 
  'Existing profiles:' as info,
  COUNT(*) as profile_count
FROM profiles;

-- Show recent users
SELECT 
  'Recent users:' as info,
  id,
  email,
  created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- Show recent profiles
SELECT 
  'Recent profiles:' as info,
  id,
  full_name,
  created_at
FROM profiles 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if there are any users at all
SELECT 
  'User status:' as info,
  CASE 
    WHEN COUNT(*) > 0 THEN 'Users exist'
    ELSE 'No users found'
  END as status
FROM auth.users;

-- Check if there are any profiles at all
SELECT 
  'Profile status:' as info,
  CASE 
    WHEN COUNT(*) > 0 THEN 'Profiles exist'
    ELSE 'No profiles found'
  END as status
FROM profiles; 