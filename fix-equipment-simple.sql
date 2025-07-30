-- Simple Equipment Schema Fix
-- Run this in your Supabase SQL Editor

-- First, let's check what columns actually exist in the equipment table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position;

-- Check if categories exist
SELECT COUNT(*) as category_count FROM categories;

-- Create categories if they don't exist
INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Tractors', 'جرارات', 'Agricultural tractors and machinery', '🚜', 1
WHERE NOT EXISTS (SELECT 1 FROM categories LIMIT 1);

INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Harvesters', 'حصادات', 'Harvesting equipment and combines', '🌾', 2
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Harvesters');

INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Plows', 'محاريث', 'Plowing and tillage equipment', '⚒️', 3
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Plows');

INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Seeders', 'آلات بذر', 'Seeding and planting equipment', '🌱', 4
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Seeders');

INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Sprayers', 'رشاشات', 'Spraying equipment', '💧', 5
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Sprayers');

INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Irrigation', 'أنظمة ري', 'Irrigation systems and equipment', '🌀', 6
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Irrigation');

INSERT INTO categories (id, name, name_ar, description, icon, sort_order) 
SELECT 
    gen_random_uuid(), 'Tools', 'أدوات زراعية', 'Hand tools and small equipment', '🔧', 7
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Tools');

-- Make category_id optional if it exists
ALTER TABLE equipment ALTER COLUMN category_id DROP NOT NULL;

-- Create trigger function for setting default category
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

-- Create trigger for category_id
DROP TRIGGER IF EXISTS trigger_set_default_category ON equipment;
CREATE TRIGGER trigger_set_default_category
    BEFORE INSERT OR UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION set_default_category();

-- Show final table structure
SELECT 'Final equipment table structure:' as info, column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
ORDER BY ordinal_position;

-- Show categories
SELECT 'Categories:' as info, id, name, name_ar FROM categories ORDER BY sort_order; 