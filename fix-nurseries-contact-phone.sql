-- Add contact_phone column to nurseries table
-- This script adds the missing contact_phone column that the form is trying to use

-- Add contact_phone column to nurseries table
ALTER TABLE public.nurseries 
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'nurseries' 
AND column_name = 'contact_phone';

-- Show complete table structure for verification
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'nurseries' 
ORDER BY ordinal_position; 