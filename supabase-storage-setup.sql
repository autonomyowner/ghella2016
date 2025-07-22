-- Supabase Storage Bucket Setup for Elghella Marketplace
-- Run this in your Supabase SQL Editor after the main schema

-- ========================================
-- CREATE STORAGE BUCKETS
-- ========================================

-- Create avatars bucket for user profile pictures
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create equipment-images bucket for equipment listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'equipment-images',
    'equipment-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create land-images bucket for land listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'land-images',
    'land-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create animal-images bucket for animal listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'animal-images',
    'animal-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- STORAGE POLICIES
-- ========================================

-- Avatars bucket policies
CREATE POLICY "Anyone can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
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

-- Equipment images bucket policies
CREATE POLICY "Anyone can view equipment images" ON storage.objects
    FOR SELECT USING (bucket_id = 'equipment-images');

CREATE POLICY "Authenticated users can upload equipment images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'equipment-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Equipment owners can update images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'equipment-images' 
        AND EXISTS (
            SELECT 1 FROM equipment 
            WHERE id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Equipment owners can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'equipment-images' 
        AND EXISTS (
            SELECT 1 FROM equipment 
            WHERE id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
        )
    );

-- Land images bucket policies
CREATE POLICY "Anyone can view land images" ON storage.objects
    FOR SELECT USING (bucket_id = 'land-images');

CREATE POLICY "Authenticated users can upload land images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'land-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Land owners can update images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'land-images' 
        AND EXISTS (
            SELECT 1 FROM land_listings 
            WHERE id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Land owners can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'land-images' 
        AND EXISTS (
            SELECT 1 FROM land_listings 
            WHERE id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
        )
    );

-- Animal images bucket policies
CREATE POLICY "Anyone can view animal images" ON storage.objects
    FOR SELECT USING (bucket_id = 'animal-images');

CREATE POLICY "Authenticated users can upload animal images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'animal-images' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Animal owners can update images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'animal-images' 
        AND EXISTS (
            SELECT 1 FROM animal_listings 
            WHERE id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Animal owners can delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'animal-images' 
        AND EXISTS (
            SELECT 1 FROM animal_listings 
            WHERE id::text = (storage.foldername(name))[1]
            AND user_id = auth.uid()
        )
    );

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
DO $$
BEGIN
    RAISE NOTICE 'Storage buckets created successfully!';
    RAISE NOTICE 'Buckets: avatars, equipment-images, land-images, animal-images';
    RAISE NOTICE 'Storage policies configured for security';
    RAISE NOTICE 'File uploads are now ready for use';
END $$; 