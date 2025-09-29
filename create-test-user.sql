-- Create a test user for testing purposes
-- This script should be run in the Supabase SQL editor

-- First, let's check if there are any existing users
SELECT id, email, created_at FROM auth.users LIMIT 5;

-- Create a test user (this will need to be done through the Supabase Auth UI or API)
-- For now, let's create a profile for an existing user if any exist
INSERT INTO profiles (id, created_at, updated_at, full_name, phone, location, avatar_url, user_type, is_verified, bio, website, social_links, role, is_admin)
SELECT 
  id,
  NOW(),
  NOW(),
  'Test User',
  '+213123456789',
  'Algiers',
  NULL,
  'farmer',
  true,
  'Test user for development',
  NULL,
  '{}',
  'user',
  false
FROM auth.users 
WHERE email = 'test@example.com'
ON CONFLICT (id) DO NOTHING;

-- Check if the profile was created
SELECT * FROM profiles WHERE full_name = 'Test User';