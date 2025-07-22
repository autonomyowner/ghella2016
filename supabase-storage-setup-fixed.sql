-- Supabase Storage Setup for Elghella Marketplace
-- This file sets up storage buckets and policies for images
-- Run this AFTER running the main schema

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view equipment images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload equipment images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own equipment images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own equipment images" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view land images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload land images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own land images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own land images" ON storage.objects;

DROP POLICY IF EXISTS "Anyone can view animal images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload animal images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own animal images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own animal images" ON storage.objects;

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('equipment-images', 'equipment-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('land-images', 'land-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
    ('animal-images', 'animal-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- AVATARS BUCKET POLICIES
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- EQUIPMENT IMAGES BUCKET POLICIES
CREATE POLICY "Anyone can view equipment images" ON storage.objects
    FOR SELECT USING (bucket_id = 'equipment-images');

CREATE POLICY "Users can upload equipment images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'equipment-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own equipment images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'equipment-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own equipment images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'equipment-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- LAND IMAGES BUCKET POLICIES
CREATE POLICY "Anyone can view land images" ON storage.objects
    FOR SELECT USING (bucket_id = 'land-images');

CREATE POLICY "Users can upload land images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'land-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own land images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'land-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own land images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'land-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ANIMAL IMAGES BUCKET POLICIES
CREATE POLICY "Anyone can view animal images" ON storage.objects
    FOR SELECT USING (bucket_id = 'animal-images');

CREATE POLICY "Users can upload animal images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'animal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own animal images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'animal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own animal images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'animal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE 'Storage buckets and policies created successfully!';
    RAISE NOTICE 'Buckets: avatars, equipment-images, land-images, animal-images';
    RAISE NOTICE 'All policies configured for secure access';
END $$; 