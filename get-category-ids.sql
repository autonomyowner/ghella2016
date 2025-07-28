-- Get Category IDs for Equipment
-- Run this in Supabase SQL Editor to get valid category IDs

SELECT 
    id,
    name,
    name_ar,
    description
FROM categories 
WHERE name LIKE '%equipment%' 
   OR name LIKE '%معدات%'
   OR name LIKE '%آلات%'
   OR name LIKE '%أدوات%'
ORDER BY name;

-- Get all categories for reference
SELECT 
    id,
    name,
    name_ar,
    description
FROM categories 
ORDER BY name;

-- Check if there are any equipment-related categories
SELECT 
    id,
    name,
    name_ar
FROM categories 
WHERE name_ar LIKE '%معدات%' 
   OR name_ar LIKE '%آلات%'
   OR name_ar LIKE '%أدوات%'
   OR name LIKE '%equipment%'
   OR name LIKE '%machinery%'
   OR name LIKE '%tools%'; 