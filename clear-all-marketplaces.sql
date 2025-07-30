-- =====================================================
-- Clear All Marketplace Data
-- This script clears all marketplace listings and related data
-- while preserving user profiles and categories
-- =====================================================

-- Function to safely clear a table if it exists
CREATE OR REPLACE FUNCTION clear_table_if_exists(table_name TEXT)
RETURNS TEXT AS $$
BEGIN
    EXECUTE format('DELETE FROM %I', table_name);
    RETURN 'Cleared ' || table_name;
EXCEPTION
    WHEN undefined_table THEN
        RETURN 'Table ' || table_name || ' does not exist';
    WHEN OTHERS THEN
        RETURN 'Error clearing ' || table_name || ': ' || SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Disable RLS temporarily for cleanup (only for existing tables)
DO $$
BEGIN
    -- Try to disable RLS for each table
    BEGIN
        ALTER TABLE equipment DISABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE land_listings DISABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
END $$;

-- Clear all marketplace tables safely
SELECT clear_table_if_exists('equipment');
SELECT clear_table_if_exists('land_listings');
SELECT clear_table_if_exists('messages');
SELECT clear_table_if_exists('favorites');
SELECT clear_table_if_exists('reviews');
SELECT clear_table_if_exists('land_reviews');
SELECT clear_table_if_exists('land_favorites');
SELECT clear_table_if_exists('export_deals');
SELECT clear_table_if_exists('nurseries');
SELECT clear_table_if_exists('vegetables');
SELECT clear_table_if_exists('animals');
SELECT clear_table_if_exists('labor');
SELECT clear_table_if_exists('delivery');
SELECT clear_table_if_exists('experts');

-- Re-enable RLS for existing tables
DO $$
BEGIN
    BEGIN
        ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE land_listings ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
    
    BEGIN
        ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
    EXCEPTION WHEN undefined_table THEN
        -- Table doesn't exist, skip
    END;
END $$;

-- Verify the cleanup for existing tables
SELECT 
    'equipment' as table_name, 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'equipment') 
        THEN (SELECT COUNT(*) FROM equipment) 
        ELSE -1 
    END as remaining_records
UNION ALL
SELECT 'land_listings', 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'land_listings') 
        THEN (SELECT COUNT(*) FROM land_listings) 
        ELSE -1 
    END
UNION ALL
SELECT 'messages', 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') 
        THEN (SELECT COUNT(*) FROM messages) 
        ELSE -1 
    END
UNION ALL
SELECT 'favorites', 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favorites') 
        THEN (SELECT COUNT(*) FROM favorites) 
        ELSE -1 
    END
UNION ALL
SELECT 'reviews', 
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') 
        THEN (SELECT COUNT(*) FROM reviews) 
        ELSE -1 
    END;

-- Display confirmation
SELECT '✅ All marketplace data has been cleared successfully!' as status;

-- Clean up the function
DROP FUNCTION IF EXISTS clear_table_if_exists(TEXT); 