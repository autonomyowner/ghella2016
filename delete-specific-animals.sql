-- =====================================================
-- Delete Specific Animal Posts from animal_listings table
-- =====================================================

-- Check if animal_listings table exists and delete the posts
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'animal_listings') THEN
        -- Delete the first animal post
        DELETE FROM animal_listings WHERE id = 'e181b145-9966-4b70-bfdc-51388721231b';
        
        -- Delete the second animal post
        DELETE FROM animal_listings WHERE id = '5a39e6c3-0c2a-4ad0-ac1c-8377d8015499';
        
        RAISE NOTICE 'Animal posts deleted successfully from animal_listings table';
    ELSE
        RAISE NOTICE 'animal_listings table does not exist';
    END IF;
END $$;

-- Verify the deletion
SELECT 
    'animal_listings' as table_name, 
    COUNT(*) as remaining_records 
FROM animal_listings;

-- Show remaining animal posts (if any)
SELECT id, title, created_at FROM animal_listings ORDER BY created_at DESC;

-- Display confirmation
SELECT '✅ Specific animal posts have been deleted successfully!' as status; 