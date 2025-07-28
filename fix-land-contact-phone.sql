-- Add contact_phone column to land_listings table
-- This script adds the missing contact_phone column that the form is trying to use

-- Add contact_phone column to land_listings table
ALTER TABLE public.land_listings 
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'land_listings' 
AND column_name = 'contact_phone';

-- Show complete table structure for verification
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'land_listings' 
ORDER BY ordinal_position; 