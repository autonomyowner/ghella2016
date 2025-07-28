-- Fix Equipment Table - Add Missing Contact Columns and Remove model_type
-- This script adds the missing contact_phone column to the equipment table
-- and removes model_type field as requested

-- First, let's check the current table structure
SELECT 'Current equipment table structure:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add contact_phone column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'equipment' 
        AND column_name = 'contact_phone'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.equipment ADD COLUMN contact_phone VARCHAR(50);
        RAISE NOTICE 'contact_phone column added to equipment table';
    ELSE
        RAISE NOTICE 'contact_phone column already exists in equipment table';
    END IF;

    -- Remove model_type column if it exists (as requested)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'equipment' 
        AND column_name = 'model_type'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.equipment DROP COLUMN model_type;
        RAISE NOTICE 'model_type column removed from equipment table';
    ELSE
        RAISE NOTICE 'model_type column does not exist in equipment table';
    END IF;

    -- Add currency column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'equipment' 
        AND column_name = 'currency'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.equipment ADD COLUMN currency VARCHAR(3) DEFAULT 'DZD';
        RAISE NOTICE 'currency column added to equipment table';
    ELSE
        RAISE NOTICE 'currency column already exists in equipment table';
    END IF;

    -- Add coordinates column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'equipment' 
        AND column_name = 'coordinates'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.equipment ADD COLUMN coordinates JSONB;
        RAISE NOTICE 'coordinates column added to equipment table';
    ELSE
        RAISE NOTICE 'coordinates column already exists in equipment table';
    END IF;

    -- Make category_id nullable if it's not already
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'equipment' 
        AND column_name = 'category_id'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE public.equipment ALTER COLUMN category_id DROP NOT NULL;
        RAISE NOTICE 'category_id column made nullable';
    ELSE
        RAISE NOTICE 'category_id column is already nullable or does not exist';
    END IF;

END $$;

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