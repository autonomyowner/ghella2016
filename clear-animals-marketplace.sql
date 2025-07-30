-- =====================================================
-- Clear Animals Marketplace Only (Safe Version)
-- =====================================================

-- Function to safely clear animals table if it exists
CREATE OR REPLACE FUNCTION clear_animals_if_exists()
RETURNS TEXT AS $$
BEGIN
    -- Check if animals table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'animals') THEN
        DELETE FROM animals;
        RETURN 'Animals table cleared successfully';
    ELSE
        RETURN 'Animals table does not exist';
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error clearing animals: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Clear animals table safely
SELECT clear_animals_if_exists();

-- Clear any animal-related messages (if messages table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        DELETE FROM messages WHERE listing_type = 'animal';
    END IF;
END $$;

-- Clear any animal-related favorites (if favorites table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favorites') THEN
        DELETE FROM favorites WHERE listing_type = 'animal';
    END IF;
END $$;

-- Clear any animal-related reviews (if reviews table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        DELETE FROM reviews WHERE listing_type = 'animal';
    END IF;
END $$;

-- Check what tables exist
SELECT 
    table_name,
    CASE 
        WHEN table_name = 'animals' THEN 'Animals table'
        WHEN table_name = 'messages' THEN 'Messages table'
        WHEN table_name = 'favorites' THEN 'Favorites table'
        WHEN table_name = 'reviews' THEN 'Reviews table'
        ELSE 'Other table'
    END as table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('animals', 'messages', 'favorites', 'reviews')
ORDER BY table_name;

-- Clean up the function
DROP FUNCTION IF EXISTS clear_animals_if_exists(); 