-- Fix Equipment Table - Simple Version
-- This script adds the missing contact_phone column and removes model_type

-- First, let's check the current table structure
SELECT 'Current equipment table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add contact_phone column (will fail if already exists, which is fine)
ALTER TABLE public.equipment ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50);

-- Remove model_type column if it exists
ALTER TABLE public.equipment DROP COLUMN IF EXISTS model_type;

-- Add currency column if it doesn't exist
ALTER TABLE public.equipment ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'DZD';

-- Add coordinates column if it doesn't exist
ALTER TABLE public.equipment ADD COLUMN IF NOT EXISTS coordinates JSONB;

-- Make category_id nullable
ALTER TABLE public.equipment ALTER COLUMN category_id DROP NOT NULL;

-- Verify all required columns exist
SELECT 'Verifying required columns exist:' as info;
SELECT 
    column_name,
    CASE 
        WHEN column_name IN ('id', 'created_at', 'updated_at', 'user_id', 'title', 'description', 
                           'price', 'category_id', 'condition', 'location', 'contact_phone', 
                           'images', 'is_available', 'is_featured')
        THEN 'Required' 
        ELSE 'Optional' 
    END as status
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY 
    CASE WHEN column_name IN ('id', 'created_at', 'updated_at', 'user_id', 'title', 'description', 
                             'price', 'category_id', 'condition', 'location', 'contact_phone', 
                             'images', 'is_available', 'is_featured') 
    THEN 1 ELSE 2 END,
    ordinal_position;

-- Show final table structure
SELECT 'Final equipment table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position; 