-- Fix Vegetables Table - Add Missing Contact Columns
-- This script adds the missing contact_phone column to the vegetables table

-- Add contact_phone column if it doesn't exist
DO $$ 
BEGIN
    -- Check if contact_phone column exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vegetables' 
        AND column_name = 'contact_phone'
        AND table_schema = 'public'
    ) THEN
        -- Add the contact_phone column
        ALTER TABLE public.vegetables ADD COLUMN contact_phone VARCHAR(50);
        RAISE NOTICE 'contact_phone column added to vegetables table';
    ELSE
        RAISE NOTICE 'contact_phone column already exists in vegetables table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
AND table_schema = 'public'
AND column_name = 'contact_phone';

-- Show current vegetables table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
AND table_schema = 'public'
ORDER BY ordinal_position; 