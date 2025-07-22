-- Storage Policies for Elghella Marketplace
-- Run this AFTER the main setup to add storage policies

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;

-- AVATARS BUCKET POLICIES
CREATE POLICY "Public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- EQUIPMENT IMAGES BUCKET POLICIES
CREATE POLICY "Public read access equipment" ON storage.objects
    FOR SELECT USING (bucket_id = 'equipment-images');

CREATE POLICY "Authenticated users can upload equipment" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'equipment-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own equipment files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'equipment-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own equipment files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'equipment-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- LAND IMAGES BUCKET POLICIES
CREATE POLICY "Public read access land" ON storage.objects
    FOR SELECT USING (bucket_id = 'land-images');

CREATE POLICY "Authenticated users can upload land" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'land-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own land files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'land-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own land files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'land-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ANIMAL IMAGES BUCKET POLICIES
CREATE POLICY "Public read access animal" ON storage.objects
    FOR SELECT USING (bucket_id = 'animal-images');

CREATE POLICY "Authenticated users can upload animal" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'animal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own animal files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'animal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own animal files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'animal-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- COMPLETION MESSAGE
DO $$
BEGIN
    RAISE NOTICE '🎉 Storage policies created successfully!';
    RAISE NOTICE '✅ Avatars bucket policies: Public read, Authenticated upload/update/delete';
    RAISE NOTICE '✅ Equipment images bucket policies: Public read, Authenticated upload/update/delete';
    RAISE NOTICE '✅ Land images bucket policies: Public read, Authenticated upload/update/delete';
    RAISE NOTICE '✅ Animal images bucket policies: Public read, Authenticated upload/update/delete';
    RAISE NOTICE '🔒 All policies configured for secure access';
END $$; 