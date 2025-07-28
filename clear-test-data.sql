-- Clear all test data from marketplace tables
-- This script will remove all posts from vegetables, land, equipment, animals, and nurseries tables
-- while preserving the table structure and RLS policies

-- First, let's check what data exists in each table
SELECT 'vegetables' as table_name, COUNT(*) as record_count FROM vegetables
UNION ALL
SELECT 'land_listings' as table_name, COUNT(*) as record_count FROM land_listings
UNION ALL
SELECT 'equipment' as table_name, COUNT(*) as record_count FROM equipment
UNION ALL
SELECT 'animal_listings' as table_name, COUNT(*) as record_count FROM animal_listings
UNION ALL
SELECT 'nurseries' as table_name, COUNT(*) as record_count FROM nurseries;

-- Clear vegetables table
DELETE FROM vegetables WHERE id IS NOT NULL;

-- Clear land_listings table
DELETE FROM land_listings WHERE id IS NOT NULL;

-- Clear equipment table
DELETE FROM equipment WHERE id IS NOT NULL;

-- Clear animal_listings table
DELETE FROM animal_listings WHERE id IS NOT NULL;

-- Clear nurseries table
DELETE FROM nurseries WHERE id IS NOT NULL;

-- Verify all tables are empty
SELECT 'vegetables' as table_name, COUNT(*) as record_count FROM vegetables
UNION ALL
SELECT 'land_listings' as table_name, COUNT(*) as record_count FROM land_listings
UNION ALL
SELECT 'equipment' as table_name, COUNT(*) as record_count FROM equipment
UNION ALL
SELECT 'animal_listings' as table_name, COUNT(*) as record_count FROM animal_listings
UNION ALL
SELECT 'nurseries' as table_name, COUNT(*) as record_count FROM nurseries;

-- Reset auto-increment sequences (if any)
-- Note: This is only needed if you want to reset the ID counters
-- ALTER SEQUENCE vegetables_id_seq RESTART WITH 1;
-- ALTER SEQUENCE land_listings_id_seq RESTART WITH 1;
-- ALTER SEQUENCE equipment_id_seq RESTART WITH 1;
-- ALTER SEQUENCE animal_listings_id_seq RESTART WITH 1;
-- ALTER SEQUENCE nurseries_id_seq RESTART WITH 1; 