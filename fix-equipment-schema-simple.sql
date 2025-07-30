-- Simple Equipment Schema Fix
-- Run this in your Supabase SQL Editor

-- Check if categories exist first
DO $$
BEGIN
    -- Only insert categories if the table is empty
    IF NOT EXISTS (SELECT 1 FROM categories LIMIT 1) THEN
        INSERT INTO categories (id, name, name_ar, description, icon, sort_order) VALUES
        (gen_random_uuid(), 'Tractors', 'جرارات', 'Agricultural tractors and machinery', '🚜', 1),
        (gen_random_uuid(), 'Harvesters', 'حصادات', 'Harvesting equipment and combines', '🌾', 2),
        (gen_random_uuid(), 'Plows', 'محاريث', 'Plowing and tillage equipment', '⚒️', 3),
        (gen_random_uuid(), 'Seeders', 'آلات بذر', 'Seeding and planting equipment', '🌱', 4),
        (gen_random_uuid(), 'Sprayers', 'رشاشات', 'Spraying equipment', '💧', 5),
        (gen_random_uuid(), 'Irrigation', 'أنظمة ري', 'Irrigation systems and equipment', '🌀', 6),
        (gen_random_uuid(), 'Tools', 'أدوات زراعية', 'Hand tools and small equipment', '🔧', 7);
        
        RAISE NOTICE 'Categories inserted successfully';
    ELSE
        RAISE NOTICE 'Categories already exist, skipping insertion';
    END IF;
END $$;

-- Make equipment table more flexible
ALTER TABLE equipment ALTER COLUMN category_id DROP NOT NULL;
ALTER TABLE equipment ALTER COLUMN title_ar DROP NOT NULL;

-- Set default category_id
DO $$
DECLARE
    first_category_id UUID;
BEGIN
    SELECT id INTO first_category_id FROM categories LIMIT 1;
    IF first_category_id IS NOT NULL THEN
        EXECUTE 'ALTER TABLE equipment ALTER COLUMN category_id SET DEFAULT ''' || first_category_id || '''';
        RAISE NOTICE 'Default category_id set to: %', first_category_id;
    END IF;
END $$;

-- Create trigger for title_ar
CREATE OR REPLACE FUNCTION set_title_ar()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.title_ar IS NULL THEN
        NEW.title_ar := NEW.title;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_title_ar ON equipment;
CREATE TRIGGER trigger_set_title_ar
    BEFORE INSERT OR UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION set_title_ar();

-- Create trigger for category_id
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

DROP TRIGGER IF EXISTS trigger_set_default_category ON equipment;
CREATE TRIGGER trigger_set_default_category
    BEFORE INSERT OR UPDATE ON equipment
    FOR EACH ROW
    EXECUTE FUNCTION set_default_category();

-- Verify setup
SELECT 'Setup complete!' as status;
SELECT 'Categories count:' as info, COUNT(*) as count FROM categories;
SELECT 'Equipment table structure:' as info, column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND column_name IN ('category_id', 'title_ar', 'title'); 