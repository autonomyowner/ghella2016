-- Fix Equipment Schema Based on Actual Database Structure
-- Run this in your Supabase SQL Editor

-- First, let's check what columns actually exist in the equipment table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position;

-- Check if categories exist
SELECT COUNT(*) as category_count FROM categories;

-- Create categories if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
        INSERT INTO categories (id, name, name_ar, description, icon, sort_order) VALUES
        (gen_random_uuid(), 'Tractors', 'جرارات', 'Agricultural tractors and machinery', '🚜', 1),
        (gen_random_uuid(), 'Harvesters', 'حصادات', 'Harvesting equipment and combines', '🌾', 2),
        (gen_random_uuid(), 'Plows', 'محاريث', 'Plowing and tillage equipment', '⚒️', 3),
        (gen_random_uuid(), 'Seeders', 'آلات بذر', 'Seeding and planting equipment', '🌱', 4),
        (gen_random_uuid(), 'Sprayers', 'رشاشات', 'Spraying equipment', '💧', 5),
        (gen_random_uuid(), 'Irrigation', 'أنظمة ري', 'Irrigation systems and equipment', '🌀', 6),
        (gen_random_uuid(), 'Tools', 'أدوات زراعية', 'Hand tools and small equipment', '🔧', 7);
        
        RAISE NOTICE 'Categories created successfully';
    ELSE
        RAISE NOTICE 'Categories already exist';
    END IF;
END $$;

-- Make equipment table more flexible based on actual structure
-- Only modify columns that exist

-- Check if category_id exists and make it optional
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'category_id') THEN
        ALTER TABLE equipment ALTER COLUMN category_id DROP NOT NULL;
        RAISE NOTICE 'Made category_id optional';
    END IF;
END $$;

-- Check if title_ar exists and make it optional
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'title_ar') THEN
        ALTER TABLE equipment ALTER COLUMN title_ar DROP NOT NULL;
        RAISE NOTICE 'Made title_ar optional';
    END IF;
END $$;

-- Set default category_id if the column exists
DO $$
DECLARE
    first_category_id UUID;
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'category_id') THEN
        SELECT id INTO first_category_id FROM categories LIMIT 1;
        IF first_category_id IS NOT NULL THEN
            EXECUTE 'ALTER TABLE equipment ALTER COLUMN category_id SET DEFAULT ''' || first_category_id || '''';
            RAISE NOTICE 'Set default category_id to: %', first_category_id;
        END IF;
    END IF;
END $$;

-- Create trigger for title_ar if the column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'title_ar') THEN
        -- Create trigger function
        CREATE OR REPLACE FUNCTION set_title_ar()
        RETURNS TRIGGER AS $$
        BEGIN
            IF NEW.title_ar IS NULL THEN
                NEW.title_ar := NEW.title;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger
        DROP TRIGGER IF EXISTS trigger_set_title_ar ON equipment;
        CREATE TRIGGER trigger_set_title_ar
            BEFORE INSERT OR UPDATE ON equipment
            FOR EACH ROW
            EXECUTE FUNCTION set_title_ar();
            
        RAISE NOTICE 'Created title_ar trigger';
    END IF;
END $$;

-- Create trigger for category_id if the column exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'equipment' AND column_name = 'category_id') THEN
        -- Create trigger function
        CREATE OR REPLACE FUNCTION set_default_category()
        RETURNS TRIGGER AS $$
        DECLARE
            default_category_id UUID;
        BEGIN
            IF NEW.category_id IS NULL THEN
                SELECT id INTO default_category_id FROM categories LIMIT 1;
                IF default_category_id IS NOT NULL THEN
                    NEW.category_id := default_category_id;
                END IF;
            END IF;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        -- Create trigger
        DROP TRIGGER IF EXISTS trigger_set_default_category ON equipment;
        CREATE TRIGGER trigger_set_default_category
            BEFORE INSERT OR UPDATE ON equipment
            FOR EACH ROW
            EXECUTE FUNCTION set_default_category();
            
        RAISE NOTICE 'Created category_id trigger';
    END IF;
END $$;

-- Show final table structure
SELECT 'Final equipment table structure:' as info, column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position;

-- Show categories
SELECT 'Categories:' as info, id, name, name_ar FROM categories ORDER BY sort_order; 