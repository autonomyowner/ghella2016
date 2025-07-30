-- Fix Equipment Table Schema for Flexible Posting
-- Run this in your Supabase SQL Editor

-- First, let's check if categories table exists and has data
SELECT COUNT(*) as category_count FROM categories;

-- If no categories exist, create them with proper UUIDs
INSERT INTO categories (id, name, name_ar, description, icon, sort_order) VALUES
(gen_random_uuid(), 'Tractors', 'جرارات', 'Agricultural tractors and machinery', '🚜', 1),
(gen_random_uuid(), 'Harvesters', 'حصادات', 'Harvesting equipment and combines', '🌾', 2),
(gen_random_uuid(), 'Plows', 'محاريث', 'Plowing and tillage equipment', '⚒️', 3),
(gen_random_uuid(), 'Seeders', 'آلات بذر', 'Seeding and planting equipment', '🌱', 4),
(gen_random_uuid(), 'Sprayers', 'رشاشات', 'Spraying equipment', '💧', 5),
(gen_random_uuid(), 'Irrigation', 'أنظمة ري', 'Irrigation systems and equipment', '🌀', 6),
(gen_random_uuid(), 'Tools', 'أدوات زراعية', 'Hand tools and small equipment', '🔧', 7);

-- Now let's modify the equipment table to be more flexible
-- First, let's make category_id optional temporarily
ALTER TABLE equipment ALTER COLUMN category_id DROP NOT NULL;

-- Get the first category UUID to use as default
DO $$
DECLARE
    first_category_id UUID;
BEGIN
    SELECT id INTO first_category_id FROM categories LIMIT 1;
    
    -- Add a default value for category_id using the first category
    IF first_category_id IS NOT NULL THEN
        EXECUTE 'ALTER TABLE equipment ALTER COLUMN category_id SET DEFAULT ''' || first_category_id || '''';
    END IF;
END $$;

-- Also make title_ar optional since we can generate it from title
ALTER TABLE equipment ALTER COLUMN title_ar DROP NOT NULL;

-- Add a trigger to automatically set title_ar if it's null
CREATE OR REPLACE FUNCTION set_title_ar()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.title_ar IS NULL THEN
    NEW.title_ar := NEW.title;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_title_ar
  BEFORE INSERT OR UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION set_title_ar();

-- Add a trigger to set category_id if it's null
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

CREATE TRIGGER trigger_set_default_category
  BEFORE INSERT OR UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION set_default_category();

-- Verify the changes
SELECT 
  column_name, 
  is_nullable, 
  column_default,
  data_type
FROM information_schema.columns 
WHERE table_name = 'equipment' 
AND column_name IN ('category_id', 'title_ar', 'title')
ORDER BY ordinal_position;

-- Show the categories we created
SELECT id, name, name_ar FROM categories ORDER BY sort_order; 