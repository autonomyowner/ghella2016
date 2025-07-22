-- Fix admin user type constraint
-- This script updates the profiles table to allow 'admin' as a valid user_type

-- First, drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_type_check;

-- Create new constraint that includes 'admin'
ALTER TABLE profiles ADD CONSTRAINT profiles_user_type_check 
CHECK (user_type IN ('farmer', 'buyer', 'both', 'admin'));

-- Update the enum type if it exists (for some setups)
DO $$
BEGIN
    -- Check if the enum type exists and add 'admin' if it doesn't have it
    IF EXISTS (
        SELECT 1 FROM pg_type 
        WHERE typname = 'user_type_enum'
    ) THEN
        -- Add 'admin' to the enum if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_enum 
            WHERE enumlabel = 'admin' 
            AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_type_enum')
        ) THEN
            ALTER TYPE user_type_enum ADD VALUE 'admin';
        END IF;
    END IF;
END $$;

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE '✅ Admin user type constraint fixed successfully!';
    RAISE NOTICE '🎯 You can now set user_type to "admin" in the profiles table';
    RAISE NOTICE '📝 Try updating your user type again in Supabase Dashboard';
END $$; 