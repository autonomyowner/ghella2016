-- Fix Vegetables Table - Remove contact_email column
-- This script removes the contact_email column from the vegetables table
-- and ensures only contact_phone is used for marketplace contact

-- First, check if the column exists and remove it
DO $$ 
BEGIN
    -- Check if contact_email column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vegetables' 
        AND column_name = 'contact_email'
        AND table_schema = 'public'
    ) THEN
        -- Remove the contact_email column
        ALTER TABLE public.vegetables DROP COLUMN contact_email;
        RAISE NOTICE 'contact_email column removed from vegetables table';
    ELSE
        RAISE NOTICE 'contact_email column does not exist in vegetables table';
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Ensure contact_phone column exists and has proper constraints
ALTER TABLE public.vegetables 
ALTER COLUMN contact_phone TYPE VARCHAR(50),
ALTER COLUMN contact_phone SET DEFAULT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN public.vegetables.contact_phone IS 'Contact phone number for marketplace communication - email removed as per requirements';

-- Verify the fix
SELECT 'Vegetables table fixed successfully!' as status; 