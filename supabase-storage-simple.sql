-- Simple Supabase Storage Setup for Elghella Marketplace
-- This creates storage buckets without modifying system tables
-- Run this in your Supabase SQL Editor

-- Create storage buckets (this is the only part we can safely do)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('equipment-images', 'equipment-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('land-images', 'land-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('animal-images', 'animal-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE 'Storage buckets created successfully!';
    RAISE NOTICE 'Buckets: avatars, equipment-images, land-images, animal-images';
    RAISE NOTICE 'Note: Storage policies will be configured through Supabase Dashboard';
END $$; 