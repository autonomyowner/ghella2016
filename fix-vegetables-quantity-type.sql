-- Fix Vegetables Table - Ensure quantity field is INTEGER
-- This script ensures the quantity field is properly typed as integer

-- Check current data type of quantity column
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
AND column_name = 'quantity';

-- If quantity is not INTEGER, alter it
ALTER TABLE public.vegetables 
ALTER COLUMN quantity TYPE INTEGER USING quantity::INTEGER;

-- Verify the change
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
AND column_name = 'quantity';

-- Show complete table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'vegetables' 
ORDER BY ordinal_position; 